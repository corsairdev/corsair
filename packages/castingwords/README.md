# CastingWords

Corsair integration for the CastingWords Store API v4.

## Authentication

CastingWords uses an API key. Configure it through Corsair's `api_key` credential store or pass the key through plugin options for local development.

## API surface

The plugin exposes the nine operations in the CastingWords v4 surface:

- `createOrder.create` — create a transcription order from a media URL
- `prepayBalance.get` — read the prepaid balance
- `audiofileDetails.get` — read audiofile details and state
- `transcript.get` — retrieve a transcript in a supported format
- `upgrade.create` — order audiofile upgrades
- `refund.create` — refund an eligible audiofile
- `invoice.get` — read invoice details
- `webhook.get` — read the registered webhook URL
- `webhook.set` — set the registered webhook URL

Provider documentation: https://castingwords.com/docs/developer/SimpleAPI.html
