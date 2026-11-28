# @corsair-dev/freshbooks

FreshBooks accounting: clients, invoices, estimates, payments, expenses, bills, items, taxes, projects, time tracking, team, reports, the ledger and webhook callbacks (191 operations), plus signed webhooks.

## Install

```bash
pnpm add @corsair-dev/freshbooks
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `abilities.list` | `freshbooks.api.abilities.list` | `read` | Read what the signed-in identity may do in the business's projects. |
| `accountGateways.delete` | `freshbooks.api.accountGateways.delete` | `destructive` | Disconnect a payment gateway from the account. |
| `accountGateways.list` | `freshbooks.api.accountGateways.list` | `read` | List the payment gateways connected to the accounting account. |
| `adjustmentJournalEntries.create` | `freshbooks.api.adjustmentJournalEntries.create` | `write` | Create an adjustment journal entry: a description, a date and balanced debit and credit lines against ledger accounts. |
| `adjustmentJournalEntries.list` | `freshbooks.api.adjustmentJournalEntries.list` | `read` | List adjustment journal entries of the business (ledger API, version 2023-09-25). |
| `adjustmentJournalEntries.update` | `freshbooks.api.adjustmentJournalEntries.update` | `write` | Change an adjustment journal entry. (PUT /accounting/businesses/{businessUuid}/journal_entries/{journalEntryUuid}) |
| `applications.create` | `freshbooks.api.applications.create` | `write` | Create an OAuth app (name, redirect URIs, scopes). |
| `applications.list` | `freshbooks.api.applications.list` | `read` | List the OAuth apps the signed-in developer owns. |
| `applications.update` | `freshbooks.api.applications.update` | `write` | Change an OAuth app by its client id. (PUT /auth/api/v1/partners/applications/{clientId}) |
| `billPayments.create` | `freshbooks.api.billPayments.create` | `destructive` | Create a payment made on a bill. Fields go in `bill_payment`. |
| `billPayments.delete` | `freshbooks.api.billPayments.delete` | `destructive` | Delete a payment made on a bill (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `billPayments.get` | `freshbooks.api.billPayments.get` | `read` | Read one payment made on a bill. (GET /accounting/account/{accountId}/bill_payments/bill_payments/{billPaymentId}) |
| `billPayments.list` | `freshbooks.api.billPayments.list` | `read` | List payments made on bills, newest first, with search filters, includes and paging. |
| `billPayments.update` | `freshbooks.api.billPayments.update` | `destructive` | Change fields of a payment made on a bill. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `bills.archive` | `freshbooks.api.bills.archive` | `write` | Archive a bill (sets vis_state to 2): hidden from lists, still counted. |
| `bills.create` | `freshbooks.api.bills.create` | `write` | Create a bill from a vendor. Fields go in `bill`. |
| `bills.delete` | `freshbooks.api.bills.delete` | `destructive` | Delete a bill from a vendor (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `bills.get` | `freshbooks.api.bills.get` | `read` | Read one bill from a vendor. (GET /accounting/account/{accountId}/bills/bills/{billId}) |
| `bills.list` | `freshbooks.api.bills.list` | `read` | List bills from vendors, newest first, with search filters, includes and paging. |
| `bills.update` | `freshbooks.api.bills.update` | `write` | Change fields of a bill from a vendor. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `billVendors.create` | `freshbooks.api.billVendors.create` | `write` | Create a bill vendor. Fields go in `bill_vendor`. |
| `billVendors.delete` | `freshbooks.api.billVendors.delete` | `destructive` | Delete a bill vendor (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `billVendors.get` | `freshbooks.api.billVendors.get` | `read` | Read one bill vendor. (GET /accounting/account/{accountId}/bill_vendors/bill_vendors/{vendorId}) |
| `billVendors.list` | `freshbooks.api.billVendors.list` | `read` | List bill vendors, newest first, with search filters, includes and paging. |
| `billVendors.update` | `freshbooks.api.billVendors.update` | `write` | Change fields of a bill vendor. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `businesses.create` | `freshbooks.api.businesses.create` | `write` | Add a business to the signed-in identity. Fields go in `business` (name, address...). |
| `businesses.delete` | `freshbooks.api.businesses.delete` | `destructive` | Delete a business from the signed-in identity, with its data. Cannot be undone. |
| `businesses.listUsers` | `freshbooks.api.businesses.listUsers` | `read` | List the identities (owner, team members, clients) that belong to a business. |
| `callbacks.create` | `freshbooks.api.callbacks.create` | `write` | Register a webhook: `callback.event` (invoice.create, or a noun like invoice for all its events) and `callback.uri`. FreshBooks then POSTs a verification code to the URI; send it back with callbacks.verify. |
| `callbacks.delete` | `freshbooks.api.callbacks.delete` | `destructive` | Delete a webhook callback. (DELETE /events/account/{accountId}/events/callbacks/{callbackId}) |
| `callbacks.get` | `freshbooks.api.callbacks.get` | `read` | Read one webhook callback. (GET /events/account/{accountId}/events/callbacks/{callbackId}) |
| `callbacks.list` | `freshbooks.api.callbacks.list` | `read` | List the webhook callbacks registered on the account. |
| `callbacks.resendVerification` | `freshbooks.api.callbacks.resendVerification` | `write` | Ask FreshBooks to post the verification code to the webhook URI again (also re-enables a webhook it disabled). |
| `callbacks.verify` | `freshbooks.api.callbacks.verify` | `write` | Activate a webhook with the verifier FreshBooks posted to its URI (`callback.verifier`). The verifier is also the secret that signs every delivery. |
| `checkoutLinks.create` | `freshbooks.api.checkoutLinks.create` | `destructive` | Create a checkout link that takes card or bank payments for an amount. |
| `checkoutLinks.delete` | `freshbooks.api.checkoutLinks.delete` | `destructive` | Delete a checkout link: it stops taking payments. |
| `checkoutLinks.setPaymentOptions` | `freshbooks.api.checkoutLinks.setPaymentOptions` | `destructive` | Choose the payment gateway options of a checkout link. |
| `checkoutLinks.update` | `freshbooks.api.checkoutLinks.update` | `destructive` | Change a checkout link. (PUT /payments/account/{accountId}/checkout-links/{checkoutLinkId}) |
| `clients.create` | `freshbooks.api.clients.create` | `write` | Create a client. Fields go in `client`. (POST /accounting/account/{accountId}/users/clients) |
| `clients.delete` | `freshbooks.api.clients.delete` | `destructive` | Delete a client (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `clients.get` | `freshbooks.api.clients.get` | `read` | Read one client. (GET /accounting/account/{accountId}/users/clients/{clientId}) |
| `clients.list` | `freshbooks.api.clients.list` | `read` | List clients, newest first, with search filters, includes and paging. |
| `clients.update` | `freshbooks.api.clients.update` | `write` | Change fields of a client. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `contacts.delete` | `freshbooks.api.contacts.delete` | `destructive` | Delete a client's secondary contact. (DELETE /accounting/account/{accountId}/users/contacts/{contactId}) |
| `contacts.update` | `freshbooks.api.contacts.update` | `write` | Change a client's secondary contact (email, name, phone). |
| `creditNotes.create` | `freshbooks.api.creditNotes.create` | `write` | Create a credit note (goodwill, prepayment or refund credit). Fields go in `credit_note`. |
| `creditNotes.delete` | `freshbooks.api.creditNotes.delete` | `destructive` | Delete a credit note (goodwill, prepayment or refund credit) (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `creditNotes.get` | `freshbooks.api.creditNotes.get` | `read` | Read one credit note (goodwill, prepayment or refund credit). |
| `creditNotes.list` | `freshbooks.api.creditNotes.list` | `read` | List credit notes, newest first, with search filters, includes and paging. |
| `creditNotes.update` | `freshbooks.api.creditNotes.update` | `write` | Change fields of a credit note (goodwill, prepayment or refund credit). FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `estimates.accept` | `freshbooks.api.estimates.accept` | `write` | Mark an estimate as accepted on the client's behalf. |
| `estimates.create` | `freshbooks.api.estimates.create` | `write` | Create a estimate. Fields go in `estimate`. |
| `estimates.delete` | `freshbooks.api.estimates.delete` | `destructive` | Delete a estimate (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `estimates.get` | `freshbooks.api.estimates.get` | `read` | Read one estimate. (GET /accounting/account/{accountId}/estimates/estimates/{estimateId}) |
| `estimates.list` | `freshbooks.api.estimates.list` | `read` | List estimates, newest first, with search filters, includes and paging. |
| `estimates.markSent` | `freshbooks.api.estimates.markSent` | `write` | Mark an estimate as sent without emailing anyone. |
| `estimates.sendEmail` | `freshbooks.api.estimates.sendEmail` | `destructive` | Email the estimate now, to `estimate.email_recipients` with an optional customized subject and body. Cannot be unsent. |
| `estimates.update` | `freshbooks.api.estimates.update` | `write` | Change fields of a estimate. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `expenseCategories.create` | `freshbooks.api.expenseCategories.create` | `write` | Create a custom expense category under a parent category. |
| `expenseCategories.get` | `freshbooks.api.expenseCategories.get` | `read` | Read one expense category. (GET /accounting/account/{accountId}/expenses/categories/{categoryId}) |
| `expenseCategories.list` | `freshbooks.api.expenseCategories.list` | `read` | List expense categories (the chart of accounts entries expenses use). |
| `expenseProfiles.create` | `freshbooks.api.expenseProfiles.create` | `write` | Create a recurring expense (an expense profile with a frequency). |
| `expenses.create` | `freshbooks.api.expenses.create` | `write` | Create a expense. Fields go in `expense`. |
| `expenses.delete` | `freshbooks.api.expenses.delete` | `destructive` | Delete a expense (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `expenses.get` | `freshbooks.api.expenses.get` | `read` | Read one expense. (GET /accounting/account/{accountId}/expenses/expenses/{expenseId}) |
| `expenses.list` | `freshbooks.api.expenses.list` | `read` | List expenses, newest first, with search filters, includes and paging. |
| `expenses.listVendors` | `freshbooks.api.expenses.listVendors` | `read` | List the vendor names used on expenses. (GET /accounting/account/{accountId}/expenses/vendors) |
| `expenses.summaries` | `freshbooks.api.expenses.summaries` | `read` | Read expense totals grouped by category and period. |
| `expenses.update` | `freshbooks.api.expenses.update` | `write` | Change fields of a expense. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `gateways.get` | `freshbooks.api.gateways.get` | `read` | Read the account's online payment gateways (Stripe, FreshBooks Payments, PayPal) and their status. |
| `gateways.provisionFreshBooksPayments` | `freshbooks.api.gateways.provisionFreshBooksPayments` | `destructive` | Start FreshBooks Payments for the account (the money-moving gateway). |
| `invitationRates.list` | `freshbooks.api.invitationRates.list` | `read` | List the rates set on pending team invitations. |
| `invitations.create` | `freshbooks.api.invitations.create` | `destructive` | Invite a person to the business (and optionally to projects). FreshBooks emails them the invitation. |
| `invoicePaymentOptions.create` | `freshbooks.api.invoicePaymentOptions.create` | `destructive` | Turn on online payment options (gateway_name, has_credit_card, has_ach...) for an invoice. |
| `invoicePaymentOptions.get` | `freshbooks.api.invoicePaymentOptions.get` | `read` | Read which online payment gateways an invoice accepts. |
| `invoiceProfilePaymentOptions.create` | `freshbooks.api.invoiceProfilePaymentOptions.create` | `destructive` | Turn on online payment options for a recurring invoice profile. |
| `invoiceProfiles.create` | `freshbooks.api.invoiceProfiles.create` | `write` | Create a recurring invoice profile. Fields go in `invoice_profile`. |
| `invoiceProfiles.delete` | `freshbooks.api.invoiceProfiles.delete` | `destructive` | Delete a recurring invoice profile (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `invoiceProfiles.get` | `freshbooks.api.invoiceProfiles.get` | `read` | Read one recurring invoice profile. (GET /accounting/account/{accountId}/invoice_profiles/invoice_profiles/{invoiceProfileId}) |
| `invoiceProfiles.list` | `freshbooks.api.invoiceProfiles.list` | `read` | List recurring invoice profiles, newest first, with search filters, includes and paging. |
| `invoiceProfiles.update` | `freshbooks.api.invoiceProfiles.update` | `write` | Change fields of a recurring invoice profile. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `invoices.create` | `freshbooks.api.invoices.create` | `write` | Create a invoice. Fields go in `invoice`. |
| `invoices.delete` | `freshbooks.api.invoices.delete` | `destructive` | Delete a invoice (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `invoices.downloadPdf` | `freshbooks.api.invoices.downloadPdf` | `read` | Download the invoice as a PDF. (GET /accounting/account/{accountId}/invoices/invoices/{invoiceId}/pdf) |
| `invoices.get` | `freshbooks.api.invoices.get` | `read` | Read one invoice. (GET /accounting/account/{accountId}/invoices/invoices/{invoiceId}) |
| `invoices.getShareLink` | `freshbooks.api.invoices.getShareLink` | `read` | Get a client-facing link to view and pay the invoice. |
| `invoices.list` | `freshbooks.api.invoices.list` | `read` | List invoices, newest first, with search filters, includes and paging. |
| `invoices.listPresentations` | `freshbooks.api.invoices.listPresentations` | `read` | Read the default invoice presentation styles (theme, fonts, logo, banner). |
| `invoices.markSent` | `freshbooks.api.invoices.markSent` | `write` | Mark a draft invoice as sent without emailing anyone. |
| `invoices.sendEmail` | `freshbooks.api.invoices.sendEmail` | `destructive` | Email the invoice now, to `invoice.email_recipients` (or the client) with an optional `invoice_customized_email` subject and body. Cannot be unsent. |
| `invoices.update` | `freshbooks.api.invoices.update` | `write` | Change fields of a invoice. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `items.create` | `freshbooks.api.items.create` | `write` | Create a item. Fields go in `item`. (POST /accounting/account/{accountId}/items/items) |
| `items.delete` | `freshbooks.api.items.delete` | `destructive` | Delete a item (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `items.get` | `freshbooks.api.items.get` | `read` | Read one item. (GET /accounting/account/{accountId}/items/items/{itemId}) |
| `items.list` | `freshbooks.api.items.list` | `read` | List items, newest first, with search filters, includes and paging. |
| `items.update` | `freshbooks.api.items.update` | `write` | Change fields of a item. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `journalEntries.create` | `freshbooks.api.journalEntries.create` | `write` | Add a journal entry with its debit and credit lines. |
| `journalEntryAccounts.list` | `freshbooks.api.journalEntryAccounts.list` | `read` | List the accounts journal entries can post to. |
| `journalEntryDetails.list` | `freshbooks.api.journalEntryDetails.list` | `read` | List journal entry detail lines (the general ledger lines). |
| `ledgerAccounts.create` | `freshbooks.api.ledgerAccounts.create` | `write` | Create a ledger account (name, number, sub type, parent). |
| `ledgerAccounts.get` | `freshbooks.api.ledgerAccounts.get` | `read` | Read one ledger account. (GET /accounting/businesses/{businessUuid}/ledger_accounts/accounts/{accountUuid}) |
| `ledgerAccounts.list` | `freshbooks.api.ledgerAccounts.list` | `read` | List the chart of accounts of the business (ledger accounts and sub-accounts). |
| `ledgerAccounts.update` | `freshbooks.api.ledgerAccounts.update` | `write` | Change a ledger account. (PUT /accounting/businesses/{businessUuid}/ledger_accounts/accounts/{accountUuid}) |
| `ledgerAccountSubTypes.get` | `freshbooks.api.ledgerAccountSubTypes.get` | `read` | Read one ledger account sub type. (GET /accounting/ledger_accounts/sub_types/{subTypeId}) |
| `ledgerAccountSubTypes.list` | `freshbooks.api.ledgerAccountSubTypes.list` | `read` | List the ledger account sub types. (GET /accounting/ledger_accounts/sub_types) |
| `ledgerAccountTypes.list` | `freshbooks.api.ledgerAccountTypes.list` | `read` | List the ledger account types (asset, liability, equity, income, expense). |
| `ledgerReports.accountEntryDetails` | `freshbooks.api.ledgerReports.accountEntryDetails` | `read` | List the journal entries that posted to one ledger account. |
| `ledgerReports.balanceSheet` | `freshbooks.api.ledgerReports.balanceSheet` | `read` | Run the balance sheet report from the ledger. |
| `ledgerReports.cashFlow` | `freshbooks.api.ledgerReports.cashFlow` | `read` | Run the cash flow report. (GET /accounting/businesses/{businessUuid}/reports/cash_flow) |
| `ledgerReports.chartOfAccounts` | `freshbooks.api.ledgerReports.chartOfAccounts` | `read` | Run the chart of accounts report with balances. |
| `ledgerReports.expenseDetails` | `freshbooks.api.ledgerReports.expenseDetails` | `read` | Run the expense details report from the ledger. |
| `ledgerReports.generalLedger` | `freshbooks.api.ledgerReports.generalLedger` | `read` | Run the general ledger report. (GET /accounting/businesses/{businessUuid}/reports/general_ledger) |
| `ledgerReports.manualJournalEntries` | `freshbooks.api.ledgerReports.manualJournalEntries` | `read` | Run the manual journal entry report. (GET /accounting/businesses/{businessUuid}/reports/manual_journal_entry_report) |
| `ledgerReports.profitAndLoss` | `freshbooks.api.ledgerReports.profitAndLoss` | `read` | Run the profit and loss report from the ledger. |
| `ledgerReports.trialBalance` | `freshbooks.api.ledgerReports.trialBalance` | `read` | Run the trial balance from the ledger. (GET /accounting/businesses/{businessUuid}/reports/trial_balance) |
| `otherIncomes.create` | `freshbooks.api.otherIncomes.create` | `write` | Create a other income entry (sales outside invoices). Fields go in `other_income`. |
| `otherIncomes.delete` | `freshbooks.api.otherIncomes.delete` | `destructive` | Delete a other income entry (sales outside invoices). |
| `otherIncomes.get` | `freshbooks.api.otherIncomes.get` | `read` | Read one other income entry (sales outside invoices). |
| `otherIncomes.list` | `freshbooks.api.otherIncomes.list` | `read` | List other income entries, newest first, with search filters, includes and paging. |
| `otherIncomes.update` | `freshbooks.api.otherIncomes.update` | `write` | Change fields of a other income entry (sales outside invoices). FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `paymentOptions.getDefault` | `freshbooks.api.paymentOptions.getDefault` | `read` | Read the account's default online payment options. |
| `payments.create` | `freshbooks.api.payments.create` | `destructive` | Create a payment record. Fields go in `payment`. |
| `payments.delete` | `freshbooks.api.payments.delete` | `destructive` | Delete a payment record (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `payments.get` | `freshbooks.api.payments.get` | `read` | Read one payment record. (GET /accounting/account/{accountId}/payments/payments/{paymentId}) |
| `payments.list` | `freshbooks.api.payments.list` | `read` | List payments recorded against invoices, newest first, with search filters, includes and paging. |
| `payments.update` | `freshbooks.api.payments.update` | `destructive` | Change fields of a payment record. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `projects.create` | `freshbooks.api.projects.create` | `write` | Create a project (title, client, billing method, fixed price or hourly rate). Fields go in `project`. |
| `projects.delete` | `freshbooks.api.projects.delete` | `destructive` | Delete a project and its data. Cannot be undone. |
| `projects.get` | `freshbooks.api.projects.get` | `read` | Read one project with its services and group. |
| `projects.list` | `freshbooks.api.projects.list` | `read` | List projects with filters and paging. (GET /projects/business/{businessId}/projects) |
| `projects.update` | `freshbooks.api.projects.update` | `write` | Change a project. (PUT /projects/business/{businessId}/project/{projectId}) |
| `projects.updateServiceRate` | `freshbooks.api.projects.updateServiceRate` | `write` | Set a service's rate on one project. (PUT /comments/business/{businessId}/project/{projectId}/service/{serviceId}/rate) |
| `projectThreads.create` | `freshbooks.api.projectThreads.create` | `destructive` | Post a new message to a project's discussion. Project members are notified. |
| `projectThreads.list` | `freshbooks.api.projectThreads.list` | `read` | List the messages in a project's discussion. |
| `reports.accountsAging` | `freshbooks.api.reports.accountsAging` | `read` | Run the accounts aging report (what clients owe, by age). |
| `reports.accountStatement` | `freshbooks.api.reports.accountStatement` | `read` | Run a client's account statement for a period. |
| `reports.balanceSheet` | `freshbooks.api.reports.balanceSheet` | `read` | Run the balance sheet (account version). |
| `reports.bankReconciliationSummary` | `freshbooks.api.reports.bankReconciliationSummary` | `read` | Run the bank reconciliation summary for a bank account. |
| `reports.download` | `freshbooks.api.reports.download` | `read` | Download a report as CSV with the download token a report call returned (fileName like invoice_details.csv). |
| `reports.expenseDetails` | `freshbooks.api.reports.expenseDetails` | `read` | Run the expense details report for a period (account version). |
| `reports.invoiceDetails` | `freshbooks.api.reports.invoiceDetails` | `read` | Run the invoice details report for a period. |
| `reports.itemSales` | `freshbooks.api.reports.itemSales` | `read` | Run the item sales report. (GET /accounting/account/{accountId}/reports/accounting/item_sales) |
| `reports.paymentsCollected` | `freshbooks.api.reports.paymentsCollected` | `read` | Run the payments collected report. (GET /accounting/account/{accountId}/reports/accounting/payments_collected) |
| `reports.profitLossEntity` | `freshbooks.api.reports.profitLossEntity` | `read` | Run the profit and loss report (account version). |
| `reports.revenueByClient` | `freshbooks.api.reports.revenueByClient` | `read` | Run the revenue by client report. (GET /accounting/account/{accountId}/reports/accounting/revenue_by_client) |
| `reports.taxSummary` | `freshbooks.api.reports.taxSummary` | `read` | Run the sales tax summary report. (GET /accounting/account/{accountId}/reports/accounting/taxsummary) |
| `reports.trialBalance` | `freshbooks.api.reports.trialBalance` | `read` | Run the trial balance (account version). |
| `retainers.create` | `freshbooks.api.retainers.create` | `write` | Create a retainer for a client. (POST /comments/business/{businessId}/retainers) |
| `retainers.delete` | `freshbooks.api.retainers.delete` | `destructive` | Delete a retainer (sets vis_state to 1; retainers.undelete restores it). |
| `retainers.get` | `freshbooks.api.retainers.get` | `read` | Read one retainer. (GET /comments/business/{businessId}/retainer/{retainerId}) |
| `retainers.list` | `freshbooks.api.retainers.list` | `read` | List retainers (recurring prepaid client agreements). |
| `retainers.undelete` | `freshbooks.api.retainers.undelete` | `write` | Restore a deleted retainer (sets vis_state to 0). |
| `retainers.update` | `freshbooks.api.retainers.update` | `write` | Change a retainer. (PUT /comments/business/{businessId}/retainer/{retainerId}) |
| `serviceRates.list` | `freshbooks.api.serviceRates.list` | `read` | List the hourly rates of all services. (GET /comments/business/{businessId}/service_rates) |
| `services.create` | `freshbooks.api.services.create` | `write` | Create a service (name, billable). (POST /comments/business/{businessId}/service) |
| `services.createRate` | `freshbooks.api.services.createRate` | `write` | Set the hourly rate of a service. (POST /comments/business/{businessId}/service/{serviceId}/rate) |
| `services.get` | `freshbooks.api.services.get` | `read` | Read one service. (GET /comments/business/{businessId}/service/{serviceId}) |
| `services.getRate` | `freshbooks.api.services.getRate` | `read` | Read a service's hourly rate. (GET /comments/business/{businessId}/service/{serviceId}/rate) |
| `services.list` | `freshbooks.api.services.list` | `read` | List services (the billable work types on projects). |
| `services.updateRate` | `freshbooks.api.services.updateRate` | `write` | Change a service's hourly rate. (PUT /comments/business/{businessId}/service/{serviceId}/rate) |
| `staff.delete` | `freshbooks.api.staff.delete` | `destructive` | Delete a staff record (sets vis_state to 1). |
| `staff.get` | `freshbooks.api.staff.get` | `read` | Read one staff record. (GET /accounting/account/{accountId}/users/staffs/{staffId}) |
| `staff.list` | `freshbooks.api.staff.list` | `read` | List staff of the account (the legacy accounting staff records). |
| `staff.update` | `freshbooks.api.staff.update` | `write` | Change a staff record. (PUT /accounting/account/{accountId}/users/staffs/{staffId}) |
| `systems.get` | `freshbooks.api.systems.get` | `read` | Read the account's system settings (company name, address, currency, date format...). The system id is the business id. |
| `tasks.create` | `freshbooks.api.tasks.create` | `write` | Create a billable task. Fields go in `task`. |
| `tasks.delete` | `freshbooks.api.tasks.delete` | `destructive` | Delete a billable task (sets vis_state to 1). FreshBooks keeps it: an update with vis_state 0 restores it. |
| `tasks.get` | `freshbooks.api.tasks.get` | `read` | Read one billable task. (GET /accounting/account/{accountId}/projects/tasks/{taskId}) |
| `tasks.list` | `freshbooks.api.tasks.list` | `read` | List billable tasks, newest first, with search filters, includes and paging. |
| `tasks.update` | `freshbooks.api.tasks.update` | `write` | Change fields of a billable task. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `taxes.create` | `freshbooks.api.taxes.create` | `write` | Create a tax. Fields go in `tax`. (POST /accounting/account/{accountId}/taxes/taxes) |
| `taxes.delete` | `freshbooks.api.taxes.delete` | `destructive` | Delete a tax. (DELETE /accounting/account/{accountId}/taxes/taxes/{taxId}) |
| `taxes.get` | `freshbooks.api.taxes.get` | `read` | Read one tax. (GET /accounting/account/{accountId}/taxes/taxes/{taxId}) |
| `taxes.list` | `freshbooks.api.taxes.list` | `read` | List taxes, newest first, with search filters, includes and paging. |
| `taxes.update` | `freshbooks.api.taxes.update` | `write` | Change fields of a tax. FreshBooks updates one phase of fields per call: send vis_state on its own. |
| `teamMemberRates.list` | `freshbooks.api.teamMemberRates.list` | `read` | List the billable and cost rates of team members. |
| `teamMemberRates.update` | `freshbooks.api.teamMemberRates.update` | `write` | Change a team member's billable or cost rate. |
| `teamMembers.get` | `freshbooks.api.teamMembers.get` | `read` | Read one team member by uuid. (GET /auth/api/v1/businesses/{businessId}/team_members/{teamMemberUuid}) |
| `teamMembers.list` | `freshbooks.api.teamMembers.list` | `read` | List the team members of a business with their roles. |
| `threadComments.create` | `freshbooks.api.threadComments.create` | `destructive` | Reply to a project discussion message. Project members are notified. |
| `timeEntries.create` | `freshbooks.api.timeEntries.create` | `write` | Log a time entry (duration in seconds, started_at, project, service, client), or start a timer with is_logged false. |
| `timeEntries.delete` | `freshbooks.api.timeEntries.delete` | `destructive` | Delete a time entry. Cannot be undone. (DELETE /timetracking/business/{businessId}/time_entries/{timeEntryId}) |
| `timeEntries.get` | `freshbooks.api.timeEntries.get` | `read` | Read one time entry. (GET /timetracking/business/{businessId}/time_entries/{timeEntryId}) |
| `timeEntries.list` | `freshbooks.api.timeEntries.list` | `read` | List time entries with filters (billed, client, teammate, date range) and paging. |
| `timeEntries.search` | `freshbooks.api.timeEntries.search` | `read` | Search time entries across the business (the time entry details report). |
| `timeEntries.update` | `freshbooks.api.timeEntries.update` | `write` | Change a time entry. (PUT /timetracking/business/{businessId}/time_entries/{timeEntryId}) |
| `tokens.revoke` | `freshbooks.api.tokens.revoke` | `destructive` | Revoke an OAuth refresh or access token. The connection stops working until it is authorized again. |
| `uploads.attachment` | `freshbooks.api.uploads.attachment` | `write` | Upload an attachment (an expense receipt, an invoice attachment). Returns the jwt to reference it on the expense or invoice. |
| `uploads.image` | `freshbooks.api.uploads.image` | `write` | Upload an image (an invoice logo or banner, a proposal image). Returns the jwt to reference it and a link. |
| `uploads.publicImage` | `freshbooks.api.uploads.publicImage` | `write` | Upload an image that belongs to no account (an app listing logo). Returns its jwt and link. |
| `users.me` | `freshbooks.api.users.me` | `read` | Read the signed-in identity: name, email, and business_memberships with each business id, business_uuid and accounting account_id the other operations need. |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 48 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/freshbooks

## License

Apache-2.0
