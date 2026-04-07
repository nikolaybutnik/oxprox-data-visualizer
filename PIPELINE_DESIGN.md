# Data Pipeline Design for OxProx Proxy Voting Records

This pipeline collects, cleans, and loads quarterly proxy voting records from three varied sources: a UK asset manager’s PDF report, a US fund’s CSV whose URL changes each quarter, and an Australian fund with votes listed inline on an HTML page. We process roughly 2,000 records per run and must handle common real-world issues like sources going offline, sudden format changes, and missing or inconsistent data.

## Pipeline Structure

The pipeline is built as a modular step-by-step process with per-source isolation. If one source fails, the others can still complete successfully.

Main stages:
1. Discovery & Ingestion: locate and fetch the latest file from each source.
2. Parsing & Extraction: convert raw content into a common intermediate format.
3. Standardisation & Validation: normalise fields, handle inconsistencies, and run quality checks.
4. Loading & Archiving: upsert records idempotently into the database and archive raw files with metadata.

High-level flow:

```python
for source in [uk_pdf, us_csv, au_html]:
    raw = discover_and_fetch(source)
    if raw:
        extracted = parse(raw, source.type)
        standardised = normalise_and_validate(extracted)
        load_to_db(standardised, source)
```

## Handling the Different Sources

Each source has its own dedicated parser module:
- UK PDF: table extraction using specialist PDF tools.
- US CSV (changing URL): dynamic URL discovery (light scraping or date-based patterns) followed by pandas loading with configurable column mapping to tolerate schema drift.
- Australian HTML: parsing with BeautifulSoup + pandas.read_html(), plus fallback selectors for minor layout changes.

Separate modules make it straightforward to update or fix one parser without risking the rest of the pipeline.

## Resilience When Sources Fail or Change Format

- Failed sources are quarantined (raw file + error context saved) while the pipeline continues with the remaining sources.
- Transient network or write issues receive up to 3 retries with exponential backoff.
- Format changes are detected by comparing column names and row counts against the previous successful run. Significant drift automatically flags the run for manual review.
- Records use a composite key (fund + company identifier + meeting date + resolution) for idempotent upserts to prevent duplicates.

## Handling Missing or Inconsistent Fields

A strict target schema (defined with Pydantic or equivalent) enforces structure. Non-critical fields default to `None` or sensible placeholders (e.g. unknown ESG category => “Uncategorised”). Vote strings are normalised via mapping tables.

Records missing critical fields (company identifier or vote decision) are routed to a quarantine table rather than failing the entire run. Basic quality gates check that record count stays within ±20% of historical average as an early warning of anomalies.

## Scheduling and Monitoring

Prefect is a good tool choice for orchestration due to its strong observability and retry capabilities (a lightweight cron-based Python script is a viable minimal alternative).

The pipeline runs automatically on the first business day of each quarter, with manual trigger support. Structured logging captures key metrics, and alerts (Slack/email) fire on failures or when >10% of records are quarantined. This ensures problems are caught quickly before they impact the public database or client reports.

A minimal working demo demonstrating the three parsers, normalisation, validation, and quarantine logic is included in the `pipeline_demo/` folder. Run it locally with:

```python
cd pipeline_demo
pip install -r requirements.txt
python run_demo.py
```

This design balances reliability, maintainability, and operational simplicity for a small team.