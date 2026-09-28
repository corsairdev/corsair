# @corsair-dev/flutterwave

Flutterwave plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/flutterwave
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `beneficiaries.create` | `flutterwave.api.beneficiaries.create` | `write` | Create a transfer beneficiary. |
| `beneficiaries.list` | `flutterwave.api.beneficiaries.list` | `read` | List all beneficiaries. |
| `beneficiaries.get` | `flutterwave.api.beneficiaries.get` | `read` | Fetch a beneficiary by ID. |
| `beneficiaries.delete` | `flutterwave.api.beneficiaries.delete` | `destructive` | Delete a beneficiary by ID. |
| `bulkTokenizedCharges.create` | `flutterwave.api.bulkTokenizedCharges.create` | `write` | Create a bulk tokenized charge batch. |
| `bulkTokenizedCharges.get` | `flutterwave.api.bulkTokenizedCharges.get` | `read` | Get status of bulk tokenized charges. |
| `bulkVirtualAccounts.create` | `flutterwave.api.bulkVirtualAccounts.create` | `write` | Create bulk virtual account numbers. |
| `bulkVirtualAccounts.get` | `flutterwave.api.bulkVirtualAccounts.get` | `read` | Get details for a bulk virtual account batch. |
| `paymentLinks.create` | `flutterwave.api.paymentLinks.create` | `write` | Create a hosted payment link. |
| `paymentLinks.disable` | `flutterwave.api.paymentLinks.disable` | `write` | Disable an existing payment link. |
| `paymentPlans.create` | `flutterwave.api.paymentPlans.create` | `write` | Create a payment plan. |
| `paymentPlans.list` | `flutterwave.api.paymentPlans.list` | `read` | List payment plans. |
| `paymentPlans.get` | `flutterwave.api.paymentPlans.get` | `read` | Get a payment plan by ID. |
| `paymentPlans.update` | `flutterwave.api.paymentPlans.update` | `write` | Update a payment plan. |
| `paymentPlans.cancel` | `flutterwave.api.paymentPlans.cancel` | `write` | Cancel a Flutterwave payment plan by ID. |
| `refunds.create` | `flutterwave.api.refunds.create` | `write` | Create a refund for a transaction. |
| `refunds.get` | `flutterwave.api.refunds.get` | `read` | Get refund details by ID. |
| `refunds.list` | `flutterwave.api.refunds.list` | `read` | List refund transactions with filters. |
| `subaccounts.create` | `flutterwave.api.subaccounts.create` | `write` | Create a subaccount. |
| `subaccounts.list` | `flutterwave.api.subaccounts.list` | `read` | List all subaccounts. |
| `subaccounts.get` | `flutterwave.api.subaccounts.get` | `read` | Fetch a subaccount by ID. |
| `subaccounts.update` | `flutterwave.api.subaccounts.update` | `write` | Update a subaccount. |
| `subaccounts.delete` | `flutterwave.api.subaccounts.delete` | `destructive` | Delete a subaccount by ID. |
| `virtualAccounts.create` | `flutterwave.api.virtualAccounts.create` | `write` | Create a virtual account number. |
| `virtualAccounts.get` | `flutterwave.api.virtualAccounts.get` | `read` | Get virtual account number details by order reference. |
| `transactions.generateReference` | `flutterwave.api.transactions.generateReference` | `read` | Generate a unique transaction reference. |
| `transactions.list` | `flutterwave.api.transactions.list` | `read` | Retrieve all transactions. |
| `transactions.get` | `flutterwave.api.transactions.get` | `read` | Get a transaction by ID. |
| `transactions.verifyByReference` | `flutterwave.api.transactions.verifyByReference` | `read` | Verify a transaction by tx_ref. |
| `transactions.viewTimeline` | `flutterwave.api.transactions.viewTimeline` | `read` | View transaction timeline. |
| `transactions.getFee` | `flutterwave.api.transactions.getFee` | `read` | Get transaction fee estimate. |
| `subscriptions.list` | `flutterwave.api.subscriptions.list` | `read` | Get all subscriptions, including cancelled. |
| `wallets.listBalances` | `flutterwave.api.wallets.listBalances` | `read` | Get wallet balances across currencies. |
| `wallets.getBalanceByCurrency` | `flutterwave.api.wallets.getBalanceByCurrency` | `read` | Get wallet balance by currency. |
| `wallets.getStatement` | `flutterwave.api.wallets.getStatement` | `read` | Get wallet statement. |
| `banks.getBranches` | `flutterwave.api.banks.getBranches` | `read` | Get branches for a bank. |
| `banks.getByCountry` | `flutterwave.api.banks.getByCountry` | `read` | Get banks by country. |
| `banks.resolveAccount` | `flutterwave.api.banks.resolveAccount` | `read` | Resolve bank account details. |
| `bills.getCategories` | `flutterwave.api.bills.getCategories` | `read` | Get bill categories. |
| `bills.listBillers` | `flutterwave.api.bills.listBillers` | `read` | List billers in a category. |
| `bills.listProducts` | `flutterwave.api.bills.listProducts` | `read` | List biller products. |
| `bills.validateItem` | `flutterwave.api.bills.validateItem` | `read` | Validate a bill item before payment. |
| `bills.listRecurring` | `flutterwave.api.bills.listRecurring` | `read` | List recurring bill payments. |
| `transfers.list` | `flutterwave.api.transfers.list` | `read` | List transfers. |
| `transfers.getFee` | `flutterwave.api.transfers.getFee` | `read` | Get transfer fee estimate. |
| `transfers.getRates` | `flutterwave.api.transfers.getRates` | `read` | Get transfer exchange rates. |
| `verification.initiateBvn` | `flutterwave.api.verification.initiateBvn` | `write` | Initiate BVN verification. |
| `charges.initiateMobileMoneyTanzania` | `flutterwave.api.charges.initiateMobileMoneyTanzania` | `write` | Initiate mobile money charge in Tanzania. |
| `payoutSubaccounts.list` | `flutterwave.api.payoutSubaccounts.list` | `read` | List payout subaccounts. |
| `payoutSubaccounts.listRefunds` | `flutterwave.api.payoutSubaccounts.listRefunds` | `read` | List payout subaccount refunds. |
| `settlements.list` | `flutterwave.api.settlements.list` | `read` | List settlements. |
| `chargebacks.list` | `flutterwave.api.chargebacks.list` | `read` | List chargebacks. |
| `cards.resolveBin` | `flutterwave.api.cards.resolveBin` | `read` | Resolve card BIN details. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/flutterwave

## License

Apache-2.0
