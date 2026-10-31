# @corsair-dev/enginemailer

Enginemailer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/enginemailer
```

## Authentication

Enginemailer uses API-key authentication. Corsair sends the configured key in
the provider's `APIKey` header. N8N operations use Enginemailer's documented
N8N API base URL and the same header.

## Endpoints

The plugin exposes 38 operations across subscriber management, campaigns, and
Enginemailer's official N8N integration surface.

See the generated documentation at:

https://docs.corsair.dev/plugins/enginemailer

## Webhooks

Enginemailer currently documents no webhook operations for this integration.

## License

Apache-2.0
