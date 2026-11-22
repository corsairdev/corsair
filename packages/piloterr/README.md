# @corsair-dev/piloterr

Piloterr is a scraping API for public web data. This plugin fetches and renders pages, captures screenshots, detects website technology, extracts contact details, scrapes Google search and news, reads LinkedIn companies, profiles, jobs and posts, and finds and verifies professional emails.

## Install

```bash
pnpm add @corsair-dev/piloterr
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getJob` | `piloterr.api.account.getJob` | `read` | Poll the status and result of an async job (free) |
| `account.usage` | `piloterr.api.account.usage` | `read` | Read remaining quota, packs, credits and rate limits (free) |
| `email.analyzes` | `piloterr.api.email.analyzes` | `read` | Analyze a domain email infrastructure and SPF records |
| `email.finder` | `piloterr.api.email.finder` | `read` | Find a verified professional email by name and company |
| `email.verify` | `piloterr.api.email.verify` | `read` | Verify whether an email address is deliverable |
| `google.news` | `piloterr.api.google.news` | `read` | Scrape Google News results for a query |
| `google.search` | `piloterr.api.google.search` | `read` | Scrape Google search results with filters and pagination |
| `google.searchAutocomplete` | `piloterr.api.google.searchAutocomplete` | `read` | Fetch Google autocomplete suggestions for a query |
| `linkedin.companyInfo` | `piloterr.api.linkedin.companyInfo` | `read` | Read LinkedIn company firmographics by slug, URL, ID or domain |
| `linkedin.jobInfo` | `piloterr.api.linkedin.jobInfo` | `read` | Read a LinkedIn job posting by ID or URL |
| `linkedin.jobSearch` | `piloterr.api.linkedin.jobSearch` | `read` | Search LinkedIn jobs with seniority, type and location filters |
| `linkedin.postInfo` | `piloterr.api.linkedin.postInfo` | `read` | Read a LinkedIn post with its comments |
| `linkedin.profileInfo` | `piloterr.api.linkedin.profileInfo` | `read` | Read a LinkedIn member profile by username, URL or member ID |
| `web.crawler` | `piloterr.api.web.crawler` | `read` | Fetch a public page with fast HTTP crawling, no JavaScript |
| `web.emailPhoneExtractor` | `piloterr.api.web.emailPhoneExtractor` | `read` | Extract emails, phone numbers and social profiles from a site |
| `web.rendering` | `piloterr.api.web.rendering` | `read` | Render a JavaScript-heavy page in a headless browser |
| `web.screenshot` | `piloterr.api.web.screenshot` | `read` | Capture a webpage as an image or PDF file |
| `web.technology` | `piloterr.api.web.technology` | `read` | Detect the technology stack behind a website |
| `web.webunlocker` | `piloterr.api.web.webunlocker` | `read` | Unlock a bot-protected page on a whitelisted domain |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/piloterr

## License

Apache-2.0
