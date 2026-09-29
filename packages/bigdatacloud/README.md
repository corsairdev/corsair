# @corsair-dev/bigdatacloud

BigDataCloud plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bigdatacloud
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `asn.asnExtendedReceivingFromInfo` | `bigdatacloud.api.asn.asnExtendedReceivingFromInfo` | `read` | Tool to return upstream providers (receivingFrom) for a given ASN. Use when you need a paginated list of ASes feeding traffic for the specified ASN. |
| `asn.asnExtendedTransitToInfo` | `bigdatacloud.api.asn.asnExtendedTransitToInfo` | `read` | Tool to return downstream customers (transitTo) for a given ASN. Use when you need a paginated list of ASes receiving traffic from a specific ASN. |
| `asn.asnRankList` | `bigdatacloud.api.asn.asnRankList` | `read` | Retrieves a ranked list of Autonomous Systems (ASNs) sorted by IPv4 address announcement volumes. Use cases: - Find the largest ASNs by IP address count (DoD, Amazon, Microsoft, etc.) - Look up ASN rankings for network analysis - Paginate through the global ASN database (79,000+ entries) - Sort ASNs by various criteria (rank, name, organisation, country) Returns paginated results with total count for navigation. |
| `asn.bgpActivePrefixes` | `bigdatacloud.api.asn.bgpActivePrefixes` | `read` | Tool to retrieve IPv4 or IPv6 prefixes currently announced on BGP. Use when inspecting BGP routing announcements for a given ASN. |
| `location.amIRoaming` | `bigdatacloud.api.location.amIRoaming` | `read` | Tool to determine if the user is roaming based on their IP address and GPS coordinates. Use after obtaining device location to verify roaming status before mobile actions. |
| `location.countryByIpAddress` | `bigdatacloud.api.location.countryByIpAddress` | `read` | Tool to geolocate an IP address and retrieve country details and demographics. Use when you need country-level data after obtaining the target IP address. |
| `location.countryInfo` | `bigdatacloud.api.location.countryInfo` | `read` | Tool to fetch detailed country information by ISO code. Use when you need localized names, currencies, regions, and other metadata for a country. |
| `location.reverseGeocodingWithTimezone` | `bigdatacloud.api.location.reverseGeocodingWithTimezone` | `read` | Tool to return reverse geocoding and time zone info for given coordinates. Use when you need both locality details and timezone data in one call. |
| `location.timeZoneByIpAddress` | `bigdatacloud.api.location.timeZoneByIpAddress` | `read` | Tool to retrieve time zone information for a given IP address. Use when you need DST status, UTC offsets, and local/UTC time for a specific IP. |
| `network.networkByIpAddress` | `bigdatacloud.api.network.networkByIpAddress` | `read` | Tool to retrieve registry, ASN, and BGP details for a given IP address’s network. Use when you need detailed network information (e.g., ASNs, prefixes) after confirming the target IP. |
| `network.networksByCidr` | `bigdatacloud.api.network.networksByCidr` | `read` | Tool to retrieve BGP-announced networks within a specified CIDR range. Use when you need to analyze network announcements within a particular CIDR after confirming the range format. |
| `security.hazardReport` | `bigdatacloud.api.security.hazardReport` | `read` | Tool to fetch a cybersecurity hazard report for a specified IP address. Use when assessing an IP's threat profile (VPN, proxy, blacklists, hosting risk). |
| `security.torExitNodesGeolocated` | `bigdatacloud.api.security.torExitNodesGeolocated` | `read` | Retrieve a paginated list of active TOR exit node IP addresses with geolocation and carrier (ASN) details. Use this tool to: - Get a list of known TOR exit node IPs to detect/block anonymous traffic - Analyze geographic distribution of TOR exit nodes by country - Look up carrier/ASN information for TOR nodes - Build IP blocklists or allowlists for TOR traffic Returns nodes with IP address, country info (when available), and detailed carrier/ASN data including BGP prefix counts and global ranking. |
| `security.userRisk` | `bigdatacloud.api.security.userRisk` | `read` | Tool to return a risk assessment for a user based on IP signals for fraud prevention. Use after initial IP checks to decide whether to bypass or require captcha challenges. |
| `validation.emailAddressVerification` | `bigdatacloud.api.validation.emailAddressVerification` | `read` | Tool to verify email addresses for syntax, domain validity, and disposability. Use after obtaining the email input. |
| `validation.phoneNumberValidationByIp` | `bigdatacloud.api.validation.phoneNumberValidationByIp` | `read` | Tool to validate phone numbers by inferring country from client IP. Use when you want to validate a number without specifying country. |
| `validation.userAgentParser` | `bigdatacloud.api.validation.userAgentParser` | `read` | Tool to parse a User-Agent string into device, OS, browser, and bot details. Use when you have a raw User-Agent header and need structured client info. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bigdatacloud

## License

Apache-2.0
