# @corsair-dev/realphonevalidation

RealPhoneValidation plugin for Corsair - phone connectivity, line type, Do-Not-Call, fraud risk, reassigned-number and email verification lookups.

## Install

```bash
pnpm add @corsair-dev/realphonevalidation
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `active` | `realphonevalidation.api.active` | `read` | Report whether a US phone number sits on a provider still in business, which is a different question from whether it is connected |
| `dncLookup` | `realphonevalidation.api.dncLookup` | `read` | Check a US phone number against the national, state and DMA Do-Not-Call lists and the known-litigator list, and report its line type. Needs a SAN number from the national registry |
| `dncPlus` | `realphonevalidation.api.dncPlus` | `read` | Check a US phone number against the three Do-Not-Call lists and the known-litigator list together with its connection status |
| `emailVerify` | `realphonevalidation.api.emailVerify` | `read` | Verify an email address for validity, whether it is connected to an active online network, and whether it is disposable |
| `fraudCheck` | `realphonevalidation.api.fraudCheck` | `read` | Score a US phone number for fraudulent use from 0 to 1000, with a risk level, a recommended action, the carrier and the number location |
| `reassigned` | `realphonevalidation.api.reassigned` | `read` | Report whether a US phone number changed owner since the date consent to contact was given |
| `scrub` | `realphonevalidation.api.scrub` | `read` | Validate a US phone number for connection status at list-processing prices; Iscell and carrier are extra-cost options. May return unknown for up to 5% of numbers |
| `scrubPlus` | `realphonevalidation.api.scrubPlus` | `read` | Validate a US phone number for connection status and phone type at list-processing prices |
| `turbo` | `realphonevalidation.api.turbo` | `read` | Validate a US phone number with the older Turbo script: connection status, Iscell and carrier |
| `turboStandard` | `realphonevalidation.api.turboStandard` | `read` | Validate a US phone number for connection status and phone type only |
| `turboV3` | `realphonevalidation.api.turboV3` | `read` | Validate a US phone number with the richest answer: connection status, phone type, caller name, carrier and caller type |
| `wirelessId` | `realphonevalidation.api.wirelessId` | `read` | Report whether a US phone number is landline or cell, for TCPA compliance |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/realphonevalidation

## License

Apache-2.0
