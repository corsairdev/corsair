# @corsair-dev/veriphone

Veriphone plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/veriphone
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `coverage` | `veriphone.api.coverage` | `read` | List countries where Current (mode=current) lookups are available |
| `credits` | `veriphone.api.credits` | `read` | Get the account credit balance and usage by lookup mode |
| `getExamplePhoneNumber` | `veriphone.api.getExamplePhoneNumber` | `read` | Tool to retrieve an example phone number for a specified country and type. Use after confirming the country code. Example: 'Get an example mobile number for US'. |
| `verifyPhoneNumber` | `veriphone.api.verifyPhoneNumber` | `write` | Tool to verify if a phone number is valid. Use when you need to confirm formatting, region, and carrier details. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/veriphone

## License

Apache-2.0
