# Fake data simulating the three real sources

UK_PDF_DATA = [
    {
        "company": "Company X",
        "resolution": "Board Diversity",
        "vote": "For",
        "date": "2025-03-15",
    },
    {
        "company": "Company Y",
        "resolution": "CEO Pay Ratio",
        "vote": "Against",
        "date": "2025-03-15",
    },
    {
        "company": "Company X",
        "resolution": "Climate Disclosure",
        "vote": "",
        "date": "2025-03-15",
    },  # missing vote
]

US_CSV_DATA = """company,resolution,vote,date
Company X,Board Diversity,For,2025-03-15
Company Z,Independent Chair,Against,2025-03-15
Company Y,CEO Pay Ratio,For,2025-03-15
,Executive Compensation,For,2025-03-15
"""

AU_HTML_DATA = """
<table>
  <tr><th>Company</th><th>Resolution</th><th>Vote</th><th>Date</th></tr>
  <tr><td>Company Z</td><td>Share Buyback</td><td>For</td><td>2025-03-15</td></tr>
  <tr><td>Company X</td><td>Climate Disclosure</td><td>Against</td><td>2025-03-15</td></tr>
</table>
"""
