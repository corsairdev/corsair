# @corsair-dev/paypal

PayPal integration for Corsair: payPal REST APIs: Checkout orders (create, authorize, capture, track), payments (authorizations, captures, refunds), invoices and templates, subscriptions and billing plans, catalog products, payouts, disputes, vaulted payment tokens, transaction search and balances, shipment tracking, partner referrals, web experience profiles and webhook management, plus verified webhooks for every event type (114 operations).

## Install

```bash
pnpm add @corsair-dev/paypal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `balances.get` | `paypal.api.balances.get` | `read` | Get the account balances per currency, optionally as of a date |
| `disputes.acceptClaim` | `paypal.api.disputes.acceptClaim` | `destructive` | Accept claim |
| `disputes.acceptOffer` | `paypal.api.disputes.acceptOffer` | `destructive` | Accept offer to resolve dispute |
| `disputes.acknowledgeReturnItem` | `paypal.api.disputes.acknowledgeReturnItem` | `destructive` | Acknowledge returned item |
| `disputes.adjudicate` | `paypal.api.disputes.adjudicate` | `destructive` | Settle dispute |
| `disputes.appeal` | `paypal.api.disputes.appeal` | `destructive` | Appeal dispute |
| `disputes.denyOffer` | `paypal.api.disputes.denyOffer` | `destructive` | Deny offer to resolve dispute |
| `disputes.escalate` | `paypal.api.disputes.escalate` | `destructive` | Escalate dispute to claim |
| `disputes.get` | `paypal.api.disputes.get` | `read` | Show dispute details |
| `disputes.list` | `paypal.api.disputes.list` | `read` | List disputes |
| `disputes.makeOffer` | `paypal.api.disputes.makeOffer` | `destructive` | Make offer to resolve dispute |
| `disputes.provideEvidence` | `paypal.api.disputes.provideEvidence` | `destructive` | Provide evidence |
| `disputes.provideSupportingInfo` | `paypal.api.disputes.provideSupportingInfo` | `destructive` | Provide supporting information for dispute |
| `disputes.requireEvidence` | `paypal.api.disputes.requireEvidence` | `destructive` | Update dispute status |
| `disputes.sendMessage` | `paypal.api.disputes.sendMessage` | `destructive` | Send message about dispute to other party |
| `disputes.update` | `paypal.api.disputes.update` | `write` | Partially update dispute |
| `invoices.accountingConnections` | `paypal.api.invoices.accountingConnections` | `read` | List Connections |
| `invoices.accountingSync` | `paypal.api.invoices.accountingSync` | `read` | List Connection Status for an Invoice |
| `invoices.cancel` | `paypal.api.invoices.cancel` | `destructive` | Cancel sent invoice |
| `invoices.create` | `paypal.api.invoices.create` | `write` | Create draft invoice |
| `invoices.delete` | `paypal.api.invoices.delete` | `destructive` | Delete invoice |
| `invoices.deletePayment` | `paypal.api.invoices.deletePayment` | `destructive` | Delete external payment |
| `invoices.deleteRefund` | `paypal.api.invoices.deleteRefund` | `destructive` | Delete external refund |
| `invoices.generateQrCode` | `paypal.api.invoices.generateQrCode` | `read` | Generate QR code |
| `invoices.get` | `paypal.api.invoices.get` | `read` | Show invoice details |
| `invoices.list` | `paypal.api.invoices.list` | `read` | List invoices |
| `invoices.nextNumber` | `paypal.api.invoices.nextNumber` | `write` | Generate invoice number |
| `invoices.recordPayment` | `paypal.api.invoices.recordPayment` | `destructive` | Record a payment received outside PayPal (cash, check, bank transfer) against an invoice |
| `invoices.recordRefund` | `paypal.api.invoices.recordRefund` | `destructive` | Record a refund made outside PayPal against an invoice |
| `invoices.remind` | `paypal.api.invoices.remind` | `destructive` | Send a payment reminder for an invoice by email |
| `invoices.search` | `paypal.api.invoices.search` | `read` | Search for invoices |
| `invoices.send` | `paypal.api.invoices.send` | `destructive` | Send an invoice to its recipients by email (or mark it sent without emailing with send_to_recipient false) |
| `invoices.templates.create` | `paypal.api.invoices.templates.create` | `write` | Create template |
| `invoices.templates.delete` | `paypal.api.invoices.templates.delete` | `destructive` | Delete template |
| `invoices.templates.get` | `paypal.api.invoices.templates.get` | `read` | Show template details |
| `invoices.templates.list` | `paypal.api.invoices.templates.list` | `read` | List templates |
| `invoices.templates.update` | `paypal.api.invoices.templates.update` | `write` | Fully update template |
| `invoices.update` | `paypal.api.invoices.update` | `write` | Fully update invoice |
| `orders.authorize` | `paypal.api.orders.authorize` | `destructive` | Authorize the payment of an approved order (capture it later with payments.authorizations.capture) |
| `orders.capture` | `paypal.api.orders.capture` | `destructive` | Capture the payment of an approved order: money moves from the buyer to you |
| `orders.confirmPaymentSource` | `paypal.api.orders.confirmPaymentSource` | `write` | Confirm the Order |
| `orders.create` | `paypal.api.orders.create` | `write` | Create a Checkout order (intent CAPTURE or AUTHORIZE) with purchase units, amounts and an optional payment source; the buyer approves it through the payer-action link |
| `orders.get` | `paypal.api.orders.get` | `read` | Show order details |
| `orders.trackers.create` | `paypal.api.orders.trackers.create` | `write` | Add tracking information for an Order |
| `orders.trackers.update` | `paypal.api.orders.trackers.update` | `write` | Update or cancel tracking information for an order |
| `orders.update` | `paypal.api.orders.update` | `write` | Update order |
| `partnerReferrals.create` | `paypal.api.partnerReferrals.create` | `write` | Create partner referral |
| `partnerReferrals.get` | `paypal.api.partnerReferrals.get` | `read` | Show referral data |
| `payments.authorizations.capture` | `paypal.api.payments.authorizations.capture` | `destructive` | Capture an authorized payment, in full or for an amount |
| `payments.authorizations.get` | `paypal.api.payments.authorizations.get` | `read` | Show details for authorized payment |
| `payments.authorizations.reauthorize` | `paypal.api.payments.authorizations.reauthorize` | `destructive` | Reauthorize authorized payment |
| `payments.authorizations.void` | `paypal.api.payments.authorizations.void` | `destructive` | Void an authorization so it can no longer be captured |
| `payments.captures.get` | `paypal.api.payments.captures.get` | `read` | Show captured payment details |
| `payments.captures.refund` | `paypal.api.payments.captures.refund` | `destructive` | Refund a captured payment, in full or for an amount: the money goes back to the buyer |
| `payments.findEligibleMethods` | `paypal.api.payments.findEligibleMethods` | `read` | Find a list of eligible payment methods |
| `payments.refunds.get` | `paypal.api.payments.refunds.get` | `read` | Show refund details |
| `payouts.create` | `paypal.api.payouts.create` | `destructive` | Send money to up to 15,000 recipients (email, phone or PayPal id) in one batch payout |
| `payouts.get` | `paypal.api.payouts.get` | `read` | Show payout batch details |
| `payouts.items.cancel` | `paypal.api.payouts.items.cancel` | `destructive` | Cancel unclaimed payout item |
| `payouts.items.get` | `paypal.api.payouts.items.get` | `read` | Show payout item details |
| `plans.activate` | `paypal.api.plans.activate` | `write` | Activate plan |
| `plans.create` | `paypal.api.plans.create` | `write` | Create plan |
| `plans.deactivate` | `paypal.api.plans.deactivate` | `write` | Deactivate plan |
| `plans.get` | `paypal.api.plans.get` | `read` | Show plan details |
| `plans.list` | `paypal.api.plans.list` | `read` | List plans |
| `plans.update` | `paypal.api.plans.update` | `write` | Update plan |
| `plans.updatePricing` | `paypal.api.plans.updatePricing` | `destructive` | Update pricing |
| `products.create` | `paypal.api.products.create` | `write` | Create product |
| `products.get` | `paypal.api.products.get` | `read` | Show product details |
| `products.list` | `paypal.api.products.list` | `read` | List products |
| `products.update` | `paypal.api.products.update` | `write` | Update product |
| `subscriptions.activate` | `paypal.api.subscriptions.activate` | `write` | Activate subscription |
| `subscriptions.cancel` | `paypal.api.subscriptions.cancel` | `destructive` | Cancel a subscription: it stops for good |
| `subscriptions.capture` | `paypal.api.subscriptions.capture` | `destructive` | Capture authorized payment on subscription |
| `subscriptions.create` | `paypal.api.subscriptions.create` | `write` | Create subscription |
| `subscriptions.get` | `paypal.api.subscriptions.get` | `read` | Show subscription details |
| `subscriptions.revise` | `paypal.api.subscriptions.revise` | `destructive` | Revise plan or quantity of subscription |
| `subscriptions.suspend` | `paypal.api.subscriptions.suspend` | `destructive` | Suspend subscription |
| `subscriptions.transactions` | `paypal.api.subscriptions.transactions` | `read` | List transactions for subscription |
| `subscriptions.update` | `paypal.api.subscriptions.update` | `write` | Update subscription |
| `trackers.create` | `paypal.api.trackers.create` | `write` | Add tracking information for PayPal transaction |
| `trackers.createBatch` | `paypal.api.trackers.createBatch` | `write` | Add tracking information for multiple PayPal transactions |
| `trackers.get` | `paypal.api.trackers.get` | `read` | Show tracking information |
| `trackers.list` | `paypal.api.trackers.list` | `read` | List tracking information |
| `trackers.update` | `paypal.api.trackers.update` | `write` | Update or cancel tracking information for PayPal transaction |
| `transactions.list` | `paypal.api.transactions.list` | `read` | List transactions for up to 31 days, with filters (transaction id or type, status, amount, currency, dates) |
| `vault.paymentTokens.create` | `paypal.api.vault.paymentTokens.create` | `write` | Create payment token for a given payment source |
| `vault.paymentTokens.delete` | `paypal.api.vault.paymentTokens.delete` | `destructive` | Delete payment token |
| `vault.paymentTokens.get` | `paypal.api.vault.paymentTokens.get` | `read` | Retrieve a payment token |
| `vault.paymentTokens.list` | `paypal.api.vault.paymentTokens.list` | `read` | List all payment tokens |
| `vault.setupTokens.create` | `paypal.api.vault.setupTokens.create` | `write` | Create a setup token |
| `vault.setupTokens.get` | `paypal.api.vault.setupTokens.get` | `read` | Retrieve a setup token |
| `webhooks.availableEventTypes` | `paypal.api.webhooks.availableEventTypes` | `read` | List available events |
| `webhooks.create` | `paypal.api.webhooks.create` | `write` | Create webhook |
| `webhooks.delete` | `paypal.api.webhooks.delete` | `destructive` | Delete webhook |
| `webhooks.events.get` | `paypal.api.webhooks.events.get` | `read` | Show event notification details |
| `webhooks.events.list` | `paypal.api.webhooks.events.list` | `read` | List event notifications |
| `webhooks.events.resend` | `paypal.api.webhooks.events.resend` | `destructive` | Resend event notification |
| `webhooks.eventTypes` | `paypal.api.webhooks.eventTypes` | `read` | List event subscriptions for webhook |
| `webhooks.get` | `paypal.api.webhooks.get` | `read` | Show webhook details |
| `webhooks.list` | `paypal.api.webhooks.list` | `read` | List webhooks |
| `webhooks.lookups.create` | `paypal.api.webhooks.lookups.create` | `write` | Create webhook lookup |
| `webhooks.lookups.delete` | `paypal.api.webhooks.lookups.delete` | `destructive` | Delete webhook lookup |
| `webhooks.lookups.get` | `paypal.api.webhooks.lookups.get` | `read` | Show webhook lookup details |
| `webhooks.lookups.list` | `paypal.api.webhooks.lookups.list` | `read` | List webhook lookups |
| `webhooks.simulateEvent` | `paypal.api.webhooks.simulateEvent` | `write` | Send a sample event of a type to a webhook (sandbox and live) |
| `webhooks.update` | `paypal.api.webhooks.update` | `write` | Update webhook |
| `webhooks.verifySignature` | `paypal.api.webhooks.verifySignature` | `read` | Verify a webhook delivery's signature with PayPal (the plugin's webhooks verify offline with PayPal's certificate) |
| `webProfiles.create` | `paypal.api.webProfiles.create` | `write` | Create web experience profile |
| `webProfiles.delete` | `paypal.api.webProfiles.delete` | `destructive` | Delete web experience profile |
| `webProfiles.get` | `paypal.api.webProfiles.get` | `read` | Show web experience profile details by ID |
| `webProfiles.list` | `paypal.api.webProfiles.list` | `read` | List web experience profiles |
| `webProfiles.replace` | `paypal.api.webProfiles.replace` | `write` | Update web experience profile |
| `webProfiles.update` | `paypal.api.webProfiles.update` | `write` | Partially update web experience profile |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 12 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/paypal

## License

Apache-2.0
