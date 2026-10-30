# @corsair-dev/whoisfreaks

Whoisfreaks plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/whoisfreaks
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asnWhois.lookup` | `whoisfreaks.api.asnWhois.lookup` | `read` | Fetch WHOIS data for an autonomous system number |
| `availability.bulkCheck` | `whoisfreaks.api.availability.bulkCheck` | `read` | Check availability for up to 100 domains or TLDs at once |
| `availability.check` | `whoisfreaks.api.availability.check` | `read` | Check whether a domain is available for registration |
| `bulkWhois.lookup` | `whoisfreaks.api.bulkWhois.lookup` | `read` | Fetch WHOIS records for up to 100 domains at once |
| `dns.bulk` | `whoisfreaks.api.dns.bulk` | `read` | Fetch DNS records for up to 100 domains and IPs at once |
| `dns.historical` | `whoisfreaks.api.dns.historical` | `read` | Fetch historical DNS records for a domain |
| `dns.live` | `whoisfreaks.api.dns.live` | `read` | Fetch live DNS records for a domain or IP |
| `dns.reverse` | `whoisfreaks.api.dns.reverse` | `read` | Find domains pointing at an IP or record value |
| `domainReputation.lookup` | `whoisfreaks.api.domainReputation.lookup` | `read` | Assess threat reputation and trust score of a domain |
| `geolocation.bulkLookup` | `whoisfreaks.api.geolocation.bulkLookup` | `read` | Look up geolocation data for up to 100 IPs at once |
| `geolocation.lookup` | `whoisfreaks.api.geolocation.lookup` | `read` | Look up geolocation data for an IP address |
| `ipReputation.bulkLookup` | `whoisfreaks.api.ipReputation.bulkLookup` | `read` | Fetch threat reputation for up to 100 IPs at once |
| `ipReputation.lookup` | `whoisfreaks.api.ipReputation.lookup` | `read` | Fetch threat reputation for an IP address |
| `ipWhois.lookup` | `whoisfreaks.api.ipWhois.lookup` | `read` | Fetch WHOIS data for an IP address |
| `ssl.lookup` | `whoisfreaks.api.ssl.lookup` | `read` | Fetch the live SSL certificate for a domain |
| `subdomains.lookup` | `whoisfreaks.api.subdomains.lookup` | `read` | Enumerate subdomains of a domain |
| `typosquatting.lookup` | `whoisfreaks.api.typosquatting.lookup` | `read` | Find typo-squat domain variants of a brand keyword |
| `whoisHistory.lookup` | `whoisfreaks.api.whoisHistory.lookup` | `read` | Fetch historical WHOIS records for a domain |
| `whoisLive.lookupV2` | `whoisfreaks.api.whoisLive.lookupV2` | `read` | Fetch real-time WHOIS information for a domain |
| `whoisReverse.lookup` | `whoisfreaks.api.whoisReverse.lookup` | `read` | Search WHOIS records by keyword across domains |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/whoisfreaks

## License

Apache-2.0
