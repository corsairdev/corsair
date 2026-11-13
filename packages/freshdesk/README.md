# Freshdesk

Corsair integration for the documented Freshdesk REST API v2. It exposes 256 distinct documented route operations across tickets, contacts, agents, groups, companies, admin fields, discussions, solutions, time entries, and account settings. The current provider reference is the source of truth: https://developers.freshdesk.com/api/.

Configure the exact Freshdesk-provided account hostname (not a custom CNAME) with the API key. Requests use Basic authentication with `API_KEY:X`; list routes forward Freshdesk's `page` and `per_page` parameters (maximum page size 100). A 429 preserves `Retry-After`; only safe GET calls can be retried. Ticket, note, outbound-email, contact-avatar, and conversation upload routes accept base64 file data and send multipart/form-data; contact avatars use the `avatar` part and other uploads use `attachments[]`. API errors omit provider bodies to avoid exposing customer PII.

Each operation takes route-specific `pathParams`, documented query parameters, and an optional JSON `body`. Where Freshdesk publishes request attributes, body fields and primitive types are validated against that route; tenant-defined `custom_fields` and nested object values remain open JSON. Responses are validated as JSON values to preserve the provider's optional embed and custom fields.

Only v2 routes are included: Freshdesk documents v1 as deprecated and restricted for new users. Incoming webhooks are not supported because this API reference provides no webhook contract.
