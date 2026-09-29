# @corsair-dev/oura

Oura plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/oura
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `profile.get` | `oura.api.profile.get` | `read` | Get the authenticated user Oura profile and personal info |
| `summary.getActivity` | `oura.api.summary.getActivity` | `read` | Get daily activity summary data for a date range |
| `summary.getReadiness` | `oura.api.summary.getReadiness` | `read` | Get daily readiness summary data for a date range |
| `summary.getSleep` | `oura.api.summary.getSleep` | `read` | Get daily sleep summary data for a date range |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/oura

## License

Apache-2.0
