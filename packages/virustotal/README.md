# @corsair-dev/virustotal

VirusTotal plugin for Corsair - look up file, URL, domain and IP reports, rescan and submit indicators, read analyses, and manage comments and votes.

## Install

```bash
pnpm add @corsair-dev/virustotal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `analyses.get` | `virustotal.api.analyses.get` | `read` | Read an analysis a scan produced; its status moves from queued to completed |
| `comments.delete` | `virustotal.api.comments.delete` | `destructive` | Permanently delete one of your own comments, which cannot be restored |
| `comments.get` | `virustotal.api.comments.get` | `read` | Read one comment |
| `comments.list` | `virustotal.api.comments.list` | `read` | List the latest comments anyone posted on VirusTotal, not only your own; filter by tag, e.g. tag:malware |
| `domains.get` | `virustotal.api.domains.get` | `read` | Read a domain report: registrar, dates, categories, DNS records and engine verdicts |
| `domains.rescan` | `virustotal.api.domains.rescan` | `write` | Ask VirusTotal to reanalyse a domain |
| `files.addComment` | `virustotal.api.files.addComment` | `write` | Comment on a file publicly; a word starting with # becomes a tag, and only the author can delete it |
| `files.comments` | `virustotal.api.files.comments` | `read` | List the comments on a file, newest first, with cursor paging |
| `files.get` | `virustotal.api.files.get` | `read` | Read a file report by SHA-256, SHA-1 or MD5, including every engine verdict and the malicious tally |
| `files.rescan` | `virustotal.api.files.rescan` | `write` | Ask VirusTotal to reanalyse a file already uploaded; answers an analysis id to poll, and counts against the scan quota |
| `files.vote` | `virustotal.api.files.vote` | `write` | Vote a file harmless or malicious as your account |
| `files.votes` | `virustotal.api.files.votes` | `read` | List the votes on a file with their verdicts |
| `ipAddresses.get` | `virustotal.api.ipAddresses.get` | `read` | Read an IP report: ASN and owner, country, network and engine verdicts |
| `ipAddresses.rescan` | `virustotal.api.ipAddresses.rescan` | `write` | Ask VirusTotal to reanalyse an IP address |
| `urls.addComment` | `virustotal.api.urls.addComment` | `write` | Comment on a URL publicly |
| `urls.comments` | `virustotal.api.urls.comments` | `read` | List the comments on a URL, with cursor paging |
| `urls.get` | `virustotal.api.urls.get` | `read` | Read a URL report by the base64url identifier `urlId()` builds or the SHA-256 id a report returns; the base64url form carries the full URL to VirusTotal |
| `urls.rescan` | `virustotal.api.urls.rescan` | `write` | Ask VirusTotal to reanalyse a URL already submitted |
| `urls.scan` | `virustotal.api.urls.scan` | `write` | Submit a URL for analysis; it is added to the public dataset, answers an analysis id to poll, and cannot be withdrawn |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/virustotal

## License

Apache-2.0
