# @corsair-dev/lob

Address verification and print mail with Lob - verify US and international addresses, autocomplete and look up ZIP codes, manage the address book, send and track postcards and letters, and read the account balance.

## Install

```bash
pnpm add @corsair-dev/lob
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getBalance` | `lob.api.account.getBalance` | `read` | Read the account's current Lob Credits balance |
| `addresses.create` | `lob.api.addresses.create` | `write` | Create a US or international address in the Lob address book for reuse as a mail to or from address |
| `addresses.delete` | `lob.api.addresses.delete` | `destructive` | Permanently delete an address book entry. Lob marks it deleted and does not restore it |
| `addresses.get` | `lob.api.addresses.get` | `read` | Read one address book entry by its adr_ ID |
| `addresses.list` | `lob.api.addresses.list` | `read` | Page through the address book with before/after cursors, optional metadata and date filters |
| `autocomplete.usAutocomplete` | `lob.api.autocomplete.usAutocomplete` | `read` | Complete a partial US address into up to 10 suggestion lines, optionally restricted to deliverable addresses |
| `intlVerifications.verify` | `lob.api.intlVerifications.verify` | `read` | Verify one international address and get its deliverability, coverage level and parsed components |
| `letters.get` | `lob.api.letters.get` | `read` | Read one letter by its ltr_ ID, including tracking number and events on certified or registered mail |
| `letters.send` | `lob.api.letters.send` | `destructive` | Send a real letter that Lob prints, stuffs and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice |
| `postcards.get` | `lob.api.postcards.get` | `read` | Read one postcard by its psc_ ID, including print status and the signed PDF preview URL |
| `postcards.send` | `lob.api.postcards.send` | `destructive` | Send a real postcard that Lob prints and mails. Each piece is billed and cannot be recalled once in production; pass an idempotency_key so a replay returns the original instead of mailing twice |
| `usVerifications.bulk` | `lob.api.usVerifications.bulk` | `read` | Verify up to 20 US addresses in one synchronous call; each row comes back as a verification or a per-row error |
| `usVerifications.verify` | `lob.api.usVerifications.verify` | `read` | Verify one US address with USPS data and get its deliverability, standardized components and confidence score |
| `zip.usZipLookup` | `lob.api.zip.usZipLookup` | `read` | Look up a 5-digit US ZIP code and get its cities, county, FIPS code and default city |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lob

## License

Apache-2.0
