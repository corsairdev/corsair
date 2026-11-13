# Freshdesk

Corsair integration for the documented Freshdesk REST API v2. It exposes 256 distinct documented route operations across tickets, contacts, agents, groups, companies, admin fields, discussions, solutions, time entries, and account settings. The current provider reference is the source of truth: https://developers.freshdesk.com/api/.

Configure the exact Freshdesk-provided account hostname (not a custom CNAME) with the API key. Requests use Basic authentication with `API_KEY:X`; list routes forward Freshdesk's `page` and `per_page` parameters (maximum page size 100). A 429 preserves `Retry-After`; only safe GET calls can be retried. Attachment-enabled ticket, contact, and conversation routes accept base64 file data and send multipart/form-data. API errors omit provider bodies to avoid exposing customer PII.

Each operation takes route-specific `pathParams`, an optional query object, and an optional JSON `body`; responses are validated as JSON values to preserve Freshdesk's evolving resource fields and tenant-defined custom fields. Use the linked provider reference for the exact resource fields and required body attributes.

Only v2 routes are included: Freshdesk documents v1 as deprecated and restricted for new users. Incoming webhooks are not supported because this API reference provides no webhook contract.
