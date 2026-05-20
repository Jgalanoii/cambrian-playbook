# Sample: SEC EDGAR Company Tickers

This is a partial capture of `https://www.sec.gov/files/company_tickers.json`, retrieved during
knowledge layer generation as a proof-of-concept that the ingestion pipeline works end-to-end
before the user runs it locally.

- **Source:** SEC EDGAR
- **Format:** JSON, shape `{"<index>": {"cik_str": <int>, "ticker": "<str>", "title": "<str>"}, ...}`
- **Record count (full file):** ~10,000 US public entities
- **Primary key:** `cik_str` (pad to 10 digits with leading zeros when hitting other SEC endpoints)
- **Update frequency:** Daily
- **License:** Public domain

To pull the full current file yourself:

```bash
curl -H "User-Agent: YourCompany your@email.com" \
  https://www.sec.gov/files/company_tickers.json \
  > sec_tickers_full.json
```

Or just run `python ingest.py --source sec_company_tickers` from this kit.

The full dataset feeds downstream SEC APIs:
- `https://data.sec.gov/submissions/CIK{0-padded-cik}.json` — filings metadata
- `https://data.sec.gov/api/xbrl/companyfacts/CIK{0-padded-cik}.json` — all XBRL financial facts

For the payments/fintech vertical specifically, filter this list by SIC code 6020 (state commercial banks),
6021 (national commercial banks), 6022 (savings institutions), 6141 (personal credit institutions),
6199 (finance services), 6770 (holding companies), 7389 (business services — catches many fintechs).
