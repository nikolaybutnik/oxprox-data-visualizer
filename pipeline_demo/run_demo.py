"""
OxProx Pipeline Demo
Shows parsing, normalisation, validation, and quarantine logic for the three sources.
"""

from pydantic import BaseModel, ValidationError, field_validator
from typing import Literal, Optional
from io import StringIO
import pandas as pd
from bs4 import BeautifulSoup
from datetime import date
from demo_sources import UK_PDF_DATA, US_CSV_DATA, AU_HTML_DATA


# Target schema - this is what we want every record to look like
class VoteRecord(BaseModel):
    fund_id: str
    company: str
    resolution: str
    vote: Literal["For", "Against", "Abstain", "Withhold"]
    meeting_date: date
    source: str

    @field_validator("company")
    @classmethod
    def company_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("company identifier is required")
        return v.strip()


def normalise_vote(vote_str: str) -> Optional[str]:
    if not vote_str or vote_str.strip() == "":
        return None
    mapping = {
        "for": "For",
        "against": "Against",
        "abstain": "Abstain",
        "withhold": "Withhold",
    }
    return mapping.get(vote_str.lower().strip(), vote_str.strip())


def parse_uk_pdf():
    return [{**row, "fund_id": "UK_Fund", "source": "UK_PDF"} for row in UK_PDF_DATA]


def parse_us_csv():
    df = pd.read_csv(StringIO(US_CSV_DATA))
    df = df.fillna("")
    records = df.to_dict("records")
    return [{**r, "fund_id": "US_Fund", "source": "US_CSV"} for r in records]


def parse_au_html():
    soup = BeautifulSoup(AU_HTML_DATA, "html.parser")
    table = soup.find("table")
    rows = table.find_all("tr")[1:]
    records = []
    for row in rows:
        cols = row.find_all("td")
        records.append(
            {
                "company": cols[0].text.strip(),
                "resolution": cols[1].text.strip(),
                "vote": cols[2].text.strip(),
                "date": cols[3].text.strip(),
                "fund_id": "AU_Fund",
                "source": "AU_HTML",
            }
        )
    return records


def main():
    print("=== OxProx Data Pipeline Demo ===\n")

    all_records = []
    quarantined = []

    sources = [
        ("UK_PDF", parse_uk_pdf),
        ("US_CSV", parse_us_csv),
        ("AU_HTML", parse_au_html),
    ]

    for source_name, parser in sources:
        print(f"Processing {source_name}...")
        try:
            raw_records = parser()

            for r in raw_records:
                try:
                    if "vote" in r:
                        r["vote"] = normalise_vote(r["vote"])

                    r["meeting_date"] = date.fromisoformat(r["date"])
                    del r["date"]

                    record = VoteRecord(**r)
                    all_records.append(record.model_dump())
                    print(
                        f"  ✓ {r['company']:12} | {r['resolution']:20} | {r['vote']:10} | {r['source']}"
                    )

                except ValidationError as e:
                    reason = e.errors()[0].get("loc", ["unknown"])[0]
                    quarantined.append(
                        {"source": source_name, "raw": r, "error": str(e)}
                    )
                    print(
                        f"  ⚠ Quarantined : {r.get('company', 'Unknown') or 'Unknown':12} | missing '{reason}'"
                    )

        except Exception as e:
            print(f"  ✗ Failed processing {source_name}: {e}")
            quarantined.append({"source": source_name, "error": str(e)})

    print("\n=== Summary ===")
    print(f"Successfully processed : {len(all_records)} records")
    print(f"Quarantined           : {len(quarantined)} records")

    if quarantined:
        print(
            "\nNote: Quarantined records would be reviewed manually before loading into the database."
        )


if __name__ == "__main__":
    main()
