# @corsair-dev/tapfiliate

Tapfiliate plugin for Corsair: manage affiliates and programs, track conversions and customers, approve commissions, and record payments.

## Install

```bash
pnpm add @corsair-dev/tapfiliate
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `affiliates.balances` | `tapfiliate.api.affiliates.balances` | `read` | Read one affiliate's balance per currency |
| `affiliates.create` | `tapfiliate.api.affiliates.create` | `write` | Create an affiliate and run the Affiliate created triggers; the new affiliate joins no program until you add it to one |
| `affiliates.customFields` | `tapfiliate.api.affiliates.customFields` | `read` | List the custom fields on your signup form, whose IDs affiliate creates take |
| `affiliates.delete` | `tapfiliate.api.affiliates.delete` | `destructive` | Permanently delete an affiliate; their personal data is cleared and the record is locked |
| `affiliates.get` | `tapfiliate.api.affiliates.get` | `read` | Read one affiliate with their company, address, custom fields and metadata |
| `affiliates.list` | `tapfiliate.api.affiliates.list` | `read` | List affiliates, newest first, 25 per page, filtered by email, referral code, click, parent or group |
| `affiliates.payments` | `tapfiliate.api.affiliates.payments` | `read` | List one affiliate's payments, newest first |
| `affiliates.programs` | `tapfiliate.api.affiliates.programs` | `read` | List the programs an affiliate belongs to, with the coupon, approval state and referral link for each |
| `balances.list` | `tapfiliate.api.balances.list` | `read` | List what you owe each affiliate with a non-zero balance, per currency |
| `clicks.create` | `tapfiliate.api.clicks.create` | `write` | Record a click and return its ID for use as click_id when creating a conversion |
| `clicks.get` | `tapfiliate.api.clicks.get` | `read` | Read one click with its device details, country and metadata, plus its affiliate and program |
| `clicks.list` | `tapfiliate.api.clicks.list` | `read` | List clicks on your programs, filtered by program, affiliate or date; needs the click-report feature on your plan |
| `commissions.approve` | `tapfiliate.api.commissions.approve` | `write` | Approve a commission, also when it was disapproved before, and fire the commission triggers |
| `commissions.disapprove` | `tapfiliate.api.commissions.disapprove` | `write` | Disapprove a commission from pending or approved, which removes it from the affiliate balance |
| `commissions.get` | `tapfiliate.api.commissions.get` | `read` | Read one commission of any kind: regular, recurring, MLM level or bonus |
| `commissions.list` | `tapfiliate.api.commissions.list` | `read` | List commissions, filtered by affiliate, status or whether they are paid |
| `commissions.update` | `tapfiliate.api.commissions.update` | `write` | Change a commission's amount or comment |
| `conversions.create` | `tapfiliate.api.conversions.create` | `write` | Track a conversion and create its commissions, attributed through a coupon, click, referral code, asset or tracking ID |
| `conversions.delete` | `tapfiliate.api.conversions.delete` | `destructive` | Permanently delete a conversion with all of its commissions and metadata |
| `conversions.get` | `tapfiliate.api.conversions.get` | `read` | Read one conversion with every commission, including MLM levels, and its fraud warnings |
| `conversions.list` | `tapfiliate.api.conversions.list` | `read` | List conversions with their commissions, newest first, filtered by program, affiliate, external ID or date |
| `conversions.update` | `tapfiliate.api.conversions.update` | `write` | Change a conversion's amount, external ID or metadata; commissions change only with recalculate_commissions and a numeric amount |
| `customers.cancel` | `tapfiliate.api.customers.cancel` | `write` | Cancel a customer, which stops its automatic recurring commissions; another call can reactivate it |
| `customers.create` | `tapfiliate.api.customers.create` | `write` | Create a customer attributed to an affiliate; no commission is created until a conversion arrives |
| `customers.delete` | `tapfiliate.api.customers.delete` | `destructive` | Permanently delete a customer and its metadata; its conversions and commissions stay but lose the link |
| `customers.get` | `tapfiliate.api.customers.get` | `read` | Read one customer with the click it was tracked from and its current fraud warnings |
| `customers.list` | `tapfiliate.api.customers.list` | `read` | List customers, newest first, filtered by program, customer ID, affiliate or date range |
| `customers.uncancel` | `tapfiliate.api.customers.uncancel` | `write` | Reactivate a canceled customer, restoring recurring commissions from now without back-filling |
| `customers.update` | `tapfiliate.api.customers.update` | `write` | Change a customer's customer_id or replace its metadata |
| `payments.cancel` | `tapfiliate.api.payments.cancel` | `write` | Cancel a payment, which removes it from the affiliate's balance without reversing an outside payout |
| `payments.create` | `tapfiliate.api.payments.create` | `write` | Record one payment or an array of payments; Tapfiliate creates none when any entry is invalid |
| `payments.get` | `tapfiliate.api.payments.get` | `read` | Read one payment with its affiliate, amount and currency |
| `payments.list` | `tapfiliate.api.payments.list` | `read` | List payments that were not canceled, newest first |
| `programs.addAffiliate` | `tapfiliate.api.programs.addAffiliate` | `write` | Add an existing affiliate to a program, approved by default, or pending or disapproved explicitly |
| `programs.affiliates` | `tapfiliate.api.programs.affiliates` | `read` | List a program's affiliates in every approval state, with each one's coupon and referral link |
| `programs.approveAffiliate` | `tapfiliate.api.programs.approveAffiliate` | `write` | Approve an affiliate for a program and email them when the program notifies on approval |
| `programs.disapproveAffiliate` | `tapfiliate.api.programs.disapproveAffiliate` | `write` | Disapprove an affiliate for a program; they keep the record but earn nothing there |
| `programs.get` | `tapfiliate.api.programs.get` | `read` | Read one program, including an archived one, with its currency, cookie time and status |
| `programs.getAffiliate` | `tapfiliate.api.programs.getAffiliate` | `read` | Read one affiliate within a program, with their program-specific coupon and approval state |
| `programs.list` | `tapfiliate.api.programs.list` | `read` | List your programs, archived ones included, 25 per page |
| `programs.updateAffiliate` | `tapfiliate.api.programs.updateAffiliate` | `write` | Change an affiliate's coupon in a program; null removes it and omitting it changes nothing |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tapfiliate

## License

Apache-2.0
