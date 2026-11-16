# @corsair-dev/neutrino

Neutrino API plugin for Corsair: look up IP geolocation and blocklists, validate and verify email addresses and phone numbers, parse user agents, check domain and host reputation, inspect URLs, geocode, look up card BINs, convert units and send SMS codes.

## Install

```bash
pnpm add @corsair-dev/neutrino
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `commerce.binLookup` | `neutrino.api.commerce.binLookup` | `read` | Read card facts from a BIN: brand, category, type, issuing country, and whether the calling IP matches that country |
| `commerce.convert` | `neutrino.api.commerce.convert` | `read` | Convert between currencies, units and number bases using the unit codes Neutrino publishes |
| `email.validate` | `neutrino.api.email.validate` | `read` | Validate an address without contacting it: syntax, domain, MX, and flags for disposable, free and personal |
| `email.verify` | `neutrino.api.email.verify` | `read` | Validate an address and probe its mailbox over SMTP, reporting verified separately from valid |
| `geocode.address` | `neutrino.api.geocode.address` | `read` | Forward geocode a full address or its parts, returning every location that matched |
| `geocode.reverse` | `neutrino.api.geocode.reverse` | `read` | Reverse geocode a coordinate into a local address and a structured one with the same fields everywhere |
| `ip.blocklist` | `neutrino.api.ip.blocklist` | `read` | Check an address against the blocklists Neutrino tracks, with a flag per threat type and the sensors that matched |
| `ip.info` | `neutrino.api.ip.info` | `read` | Geolocate one IPv4 or IPv6 address: country, city, region, time zone and currency |
| `ip.probe` | `neutrino.api.ip.probe` | `read` | Identify the network and hosting provider behind an address and whether it is hosting rather than a consumer line |
| `messaging.smsVerify` | `neutrino.api.messaging.smsVerify` | `write` | Generate a security code and text it to a number, which sends a real SMS and costs a credit; compare it with verifySecurityCode |
| `phone.hlrLookup` | `neutrino.api.phone.hlrLookup` | `read` | Query the home location register for whether a number is live, which network it is on now and whether it was ported |
| `phone.validate` | `neutrino.api.phone.validate` | `read` | Parse a number into international and local forms with its location, carrier prefix and mobile flag |
| `web.domainLookup` | `neutrino.api.web.domainLookup` | `read` | Read domain facts: subdomain and TLD, rank, and whether the blocklists know it for phishing, malware or spam |
| `web.hostReputation` | `neutrino.api.web.hostReputation` | `read` | Check a host or IP against many DNSBLs, with one entry per list showing whether it listed the host |
| `web.uaLookup` | `neutrino.api.web.uaLookup` | `read` | Parse a User-Agent string into browser, engine, OS and device fields |
| `web.urlInfo` | `neutrino.api.web.urlInfo` | `read` | Inspect a URL: HTTP status, server location and host, load time, and the page body when asked |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/neutrino

## License

Apache-2.0
