# @corsair-dev/smsalert

SMS Alert plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/smsalert
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.balance` | `smsalert.api.account.balance` | `read` | Get available SMS credits |
| `account.changePassword` | `smsalert.api.account.changePassword` | `write` | Change the account password |
| `account.forgotPassword` | `smsalert.api.account.forgotPassword` | `write` | Request a password reset |
| `account.profile` | `smsalert.api.account.profile` | `read` | Get the account profile |
| `account.register` | `smsalert.api.account.register` | `write` | Register an SMS Alert account |
| `account.senders` | `smsalert.api.account.senders` | `read` | List sender IDs |
| `account.updateProfile` | `smsalert.api.account.updateProfile` | `write` | Update the account profile |
| `contacts.create` | `smsalert.api.contacts.create` | `write` | Create a contact |
| `contacts.delete` | `smsalert.api.contacts.delete` | `destructive` | Delete a contact |
| `contacts.list` | `smsalert.api.contacts.list` | `read` | List contacts in a group |
| `contacts.update` | `smsalert.api.contacts.update` | `write` | Update a contact |
| `groups.create` | `smsalert.api.groups.create` | `write` | Create a contact group |
| `groups.delete` | `smsalert.api.groups.delete` | `destructive` | Delete a contact group |
| `groups.list` | `smsalert.api.groups.list` | `read` | List contact groups |
| `groups.send` | `smsalert.api.groups.send` | `write` | Send SMS to contact groups |
| `groups.update` | `smsalert.api.groups.update` | `write` | Update a contact group |
| `messages.send` | `smsalert.api.messages.send` | `write` | Send or schedule an SMS, optionally requesting delivery callbacks |
| `otp.generate` | `smsalert.api.otp.generate` | `write` | Generate and send an OTP |
| `otp.validate` | `smsalert.api.otp.validate` | `write` | Validate an OTP |
| `reports.delivery` | `smsalert.api.reports.delivery` | `read` | Get delivery reports for a batch |
| `reports.sent` | `smsalert.api.reports.sent` | `read` | List sent SMS campaigns |
| `schedules.cancel` | `smsalert.api.schedules.cancel` | `destructive` | Cancel a scheduled campaign |
| `schedules.update` | `smsalert.api.schedules.update` | `write` | Change a scheduled campaign |
| `shortUrls.create` | `smsalert.api.shortUrls.create` | `write` | Create a short URL |
| `shortUrls.delete` | `smsalert.api.shortUrls.delete` | `destructive` | Delete a short URL |
| `templates.create` | `smsalert.api.templates.create` | `write` | Create an SMS template |
| `templates.delete` | `smsalert.api.templates.delete` | `destructive` | Delete an SMS template |
| `templates.list` | `smsalert.api.templates.list` | `read` | List SMS templates |
| `templates.update` | `smsalert.api.templates.update` | `write` | Update an SMS template |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.
Account registration and password reset do not require an API key. Password
changes use a form body; the other authenticated operations send `apikey` in
the query string, as documented by SMS Alert. Avoid logging request URLs.
When Hub connection reporting is enabled, Corsair core may mark credentials as
verified after registration or password reset even though neither checks the
API key. Do not use those operations to verify a stored key.
`otp.validate` rejects the documented `Code does not match.` response even
though SMS Alert labels it successful. Check `description.desc` for a match;
the provider has not documented all possible validation outcomes.

## Webhooks

No inbound webhook handler is provided. `messages.send` accepts the documented
`dlrurl` and `reference` parameters to request delivery callbacks; the caller
is responsible for receiving and securing those callbacks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/smsalert

Provider API reference: https://kb.smsalert.co.in/developers-api/.
The 33 reference entries map to 29 operations here: scheduled SMS and delivery
callbacks are options on `messages.send`, while XML contact import and XML push
are omitted because their credential or payload contracts are incomplete.
Retries are disabled, including for rate limits, to avoid replaying writes.

## License

Apache-2.0
