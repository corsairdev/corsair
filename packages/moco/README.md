# @corsair-dev/moco

Business management with MOCO: time tracking, projects and tasks, clients, contacts and deals, offers, invoices, payments and reminders, purchases and expenses, planning and schedules, staff (users, employments, holidays, presences, absences), reports, tags, comments and account settings (290 operations).

## Install

```bash
pnpm add @corsair-dev/moco
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.catalogServices.create` | `moco.api.account.catalogServices.create` | `write` | Create account catalog service |
| `account.catalogServices.delete` | `moco.api.account.catalogServices.delete` | `destructive` | Delete account catalog service |
| `account.catalogServices.get` | `moco.api.account.catalogServices.get` | `read` | Get account catalog service |
| `account.catalogServices.items.create` | `moco.api.account.catalogServices.items.create` | `write` | Create account catalog service item |
| `account.catalogServices.items.delete` | `moco.api.account.catalogServices.items.delete` | `destructive` | Delete account catalog service item |
| `account.catalogServices.items.get` | `moco.api.account.catalogServices.items.get` | `read` | Get account catalog service item |
| `account.catalogServices.items.update` | `moco.api.account.catalogServices.items.update` | `write` | Update account catalog service item |
| `account.catalogServices.list` | `moco.api.account.catalogServices.list` | `read` | List account catalog services, one page at a time |
| `account.catalogServices.update` | `moco.api.account.catalogServices.update` | `write` | Update account catalog service |
| `account.customProperties.create` | `moco.api.account.customProperties.create` | `write` | Create account custom property |
| `account.customProperties.delete` | `moco.api.account.customProperties.delete` | `destructive` | Delete account custom property |
| `account.customProperties.get` | `moco.api.account.customProperties.get` | `read` | Get account custom property |
| `account.customProperties.list` | `moco.api.account.customProperties.list` | `read` | List account custom properties: lists custom property definitions; can be filtered by `entity`, one page at a time |
| `account.customProperties.update` | `moco.api.account.customProperties.update` | `write` | Update account custom property |
| `account.expenseTemplates.create` | `moco.api.account.expenseTemplates.create` | `write` | Create account expense template |
| `account.expenseTemplates.delete` | `moco.api.account.expenseTemplates.delete` | `destructive` | Delete account expense template |
| `account.expenseTemplates.get` | `moco.api.account.expenseTemplates.get` | `read` | Get account expense template |
| `account.expenseTemplates.list` | `moco.api.account.expenseTemplates.list` | `read` | List account expense templates, one page at a time |
| `account.expenseTemplates.update` | `moco.api.account.expenseTemplates.update` | `write` | Update account expense template |
| `account.fixedCosts.list` | `moco.api.account.fixedCosts.list` | `read` | List account fixed costs, one page at a time |
| `account.hourlyRates.get` | `moco.api.account.hourlyRates.get` | `read` | List account hourly rates |
| `account.internalHourlyRates.get` | `moco.api.account.internalHourlyRates.get` | `read` | Get account internal hourly rates |
| `account.internalHourlyRates.update` | `moco.api.account.internalHourlyRates.update` | `write` | Update account internal hourly rates: upserts internal hourly rates for the provided year and users |
| `account.taskTemplates.create` | `moco.api.account.taskTemplates.create` | `write` | Create account task template |
| `account.taskTemplates.delete` | `moco.api.account.taskTemplates.delete` | `destructive` | Delete account task template |
| `account.taskTemplates.get` | `moco.api.account.taskTemplates.get` | `read` | Get account task template |
| `account.taskTemplates.list` | `moco.api.account.taskTemplates.list` | `read` | List account task templates, one page at a time |
| `account.taskTemplates.update` | `moco.api.account.taskTemplates.update` | `write` | Update account task template |
| `account.webHooks.create` | `moco.api.account.webHooks.create` | `write` | Create account web hook |
| `account.webHooks.delete` | `moco.api.account.webHooks.delete` | `destructive` | Delete account web hook |
| `account.webHooks.disable` | `moco.api.account.webHooks.disable` | `write` | Disable account web hook |
| `account.webHooks.enable` | `moco.api.account.webHooks.enable` | `write` | Enable account web hook |
| `account.webHooks.get` | `moco.api.account.webHooks.get` | `read` | Get account web hook |
| `account.webHooks.list` | `moco.api.account.webHooks.list` | `read` | List account web hooks, one page at a time |
| `account.webHooks.update` | `moco.api.account.webHooks.update` | `write` | Update account web hook: only `hook` can be changed |
| `activities.bulkCreate` | `moco.api.activities.bulkCreate` | `write` | Create activities in bulk |
| `activities.create` | `moco.api.activities.create` | `write` | Create a time entry on a project task for the authenticated user, in hours or seconds |
| `activities.delete` | `moco.api.activities.delete` | `destructive` | Delete a time entry; billed entries cannot be deleted this way |
| `activities.disregard` | `moco.api.activities.disregard` | `write` | Disregard activities for invoicing: marks selected activities as disregarded for billing calculations |
| `activities.get` | `moco.api.activities.get` | `read` | Read one time entry |
| `activities.list` | `moco.api.activities.list` | `read` | List time entries with date, user, project, task, billable and billed filters, one page at a time |
| `activities.startTimer` | `moco.api.activities.startTimer` | `write` | Start activity timer: starts the timer for an existing activity |
| `activities.stopTimer` | `moco.api.activities.stopTimer` | `write` | Stop activity timer: stops a running timer and writes tracked duration back to the activity |
| `activities.update` | `moco.api.activities.update` | `write` | Update a time entry |
| `activities.updateBillableSeconds` | `moco.api.activities.updateBillableSeconds` | `write` | Update activity billable seconds |
| `approvals.approve` | `moco.api.approvals.approve` | `write` | Approve approval: approves a pending approval |
| `approvals.create` | `moco.api.approvals.create` | `write` | Create approval |
| `approvals.delete` | `moco.api.approvals.delete` | `destructive` | Delete approval |
| `approvals.deny` | `moco.api.approvals.deny` | `write` | Deny approval: denies a pending approval |
| `approvals.get` | `moco.api.approvals.get` | `read` | Get approval |
| `approvals.list` | `moco.api.approvals.list` | `read` | List approvals, one page at a time |
| `comments.bulkCreate` | `moco.api.comments.bulkCreate` | `write` | Create comments in bulk |
| `comments.create` | `moco.api.comments.create` | `write` | Create comment |
| `comments.delete` | `moco.api.comments.delete` | `destructive` | Delete comment |
| `comments.get` | `moco.api.comments.get` | `read` | Get comment |
| `comments.list` | `moco.api.comments.list` | `read` | List comments, one page at a time |
| `comments.update` | `moco.api.comments.update` | `write` | Update comment |
| `companies.archive` | `moco.api.companies.archive` | `write` | Archive a company; unarchive reverses it |
| `companies.create` | `moco.api.companies.create` | `write` | Create a client, supplier or organization |
| `companies.delete` | `moco.api.companies.delete` | `destructive` | Delete company |
| `companies.get` | `moco.api.companies.get` | `read` | Read one company |
| `companies.list` | `moco.api.companies.list` | `read` | List clients, suppliers and organizations, one page at a time |
| `companies.unarchive` | `moco.api.companies.unarchive` | `write` | Unarchive a company |
| `companies.update` | `moco.api.companies.update` | `write` | Update a company |
| `contacts.create` | `moco.api.contacts.create` | `write` | Create a contact person for a company |
| `contacts.delete` | `moco.api.contacts.delete` | `destructive` | Delete a contact person |
| `contacts.get` | `moco.api.contacts.get` | `read` | Read one contact person |
| `contacts.list` | `moco.api.contacts.list` | `read` | List contact persons, one page at a time |
| `contacts.update` | `moco.api.contacts.update` | `write` | Update a contact person |
| `dealCategories.create` | `moco.api.dealCategories.create` | `write` | Create deal category |
| `dealCategories.delete` | `moco.api.dealCategories.delete` | `destructive` | Delete deal category |
| `dealCategories.get` | `moco.api.dealCategories.get` | `read` | Get deal category |
| `dealCategories.list` | `moco.api.dealCategories.list` | `read` | List deal categories, one page at a time |
| `dealCategories.update` | `moco.api.dealCategories.update` | `write` | Update deal category |
| `deals.create` | `moco.api.deals.create` | `write` | Create a deal in a deal category |
| `deals.delete` | `moco.api.deals.delete` | `destructive` | Delete a deal |
| `deals.get` | `moco.api.deals.get` | `read` | Read one deal |
| `deals.list` | `moco.api.deals.list` | `read` | List deals with status, close date, company and contact filters, one page at a time |
| `deals.update` | `moco.api.deals.update` | `write` | Update a deal, including its status |
| `invoiceReminders.create` | `moco.api.invoiceReminders.create` | `write` | Create invoice reminder |
| `invoiceReminders.delete` | `moco.api.invoiceReminders.delete` | `destructive` | Delete invoice reminder |
| `invoiceReminders.get` | `moco.api.invoiceReminders.get` | `read` | Get invoice reminder |
| `invoiceReminders.list` | `moco.api.invoiceReminders.list` | `read` | List invoice reminders, one page at a time |
| `invoiceReminders.sendEmail` | `moco.api.invoiceReminders.sendEmail` | `destructive` | Email a payment reminder to the recipients given (sends real email from MOCO) |
| `invoices.attachments.create` | `moco.api.invoices.attachments.create` | `write` | Create invoice attachment: uploads a file as invoice attachment using base64-encoded content |
| `invoices.attachments.delete` | `moco.api.invoices.attachments.delete` | `destructive` | Delete invoice attachment |
| `invoices.attachments.list` | `moco.api.invoices.attachments.list` | `read` | List invoice attachments |
| `invoices.bookkeepingExports.create` | `moco.api.invoices.bookkeepingExports.create` | `destructive` | Create invoice bookkeeping export |
| `invoices.bookkeepingExports.get` | `moco.api.invoices.bookkeepingExports.get` | `read` | Get invoice bookkeeping export |
| `invoices.bookkeepingExports.list` | `moco.api.invoices.bookkeepingExports.list` | `read` | List invoice bookkeeping exports, one page at a time |
| `invoices.create` | `moco.api.invoices.create` | `write` | Create invoice |
| `invoices.delete` | `moco.api.invoices.delete` | `destructive` | Delete invoice |
| `invoices.get` | `moco.api.invoices.get` | `read` | Read one invoice with its line items, payments and reminders |
| `invoices.getPdf` | `moco.api.invoices.getPdf` | `read` | Download invoice PDF (a PDF, saved to Files) |
| `invoices.getTimesheet` | `moco.api.invoices.getTimesheet` | `read` | Get invoice timesheet entries |
| `invoices.getTimesheetPdf` | `moco.api.invoices.getTimesheetPdf` | `read` | Download invoice timesheet PDF (a PDF, saved to Files) |
| `invoices.list` | `moco.api.invoices.list` | `read` | List invoices with status, date, client and project filters, one page at a time |
| `invoices.listExpenses` | `moco.api.invoices.listExpenses` | `read` | List invoice expenses |
| `invoices.listLocked` | `moco.api.invoices.listLocked` | `read` | List locked invoices, one page at a time |
| `invoices.payments.bulkCreate` | `moco.api.invoices.payments.bulkCreate` | `write` | Create invoice payments in bulk: requires `application/json` request body with `bulk_data` list |
| `invoices.payments.create` | `moco.api.invoices.payments.create` | `write` | Create invoice payment |
| `invoices.payments.delete` | `moco.api.invoices.payments.delete` | `destructive` | Delete invoice payment |
| `invoices.payments.get` | `moco.api.invoices.payments.get` | `read` | Get invoice payment |
| `invoices.payments.list` | `moco.api.invoices.payments.list` | `read` | List invoice payments, one page at a time |
| `invoices.payments.update` | `moco.api.invoices.payments.update` | `write` | Update invoice payment |
| `invoices.sendEmail` | `moco.api.invoices.sendEmail` | `destructive` | Email an invoice to the recipients given (sends real email from MOCO) |
| `invoices.updateStatus` | `moco.api.invoices.updateStatus` | `write` | Move an invoice to created, sent, overdue or ignored; locked invoices refuse the change |
| `letterPapers.list` | `moco.api.letterPapers.list` | `read` | List letter papers |
| `offerConfirmations.create` | `moco.api.offerConfirmations.create` | `write` | Create offer confirmation |
| `offerConfirmations.delete` | `moco.api.offerConfirmations.delete` | `destructive` | Delete offer confirmation |
| `offerConfirmations.get` | `moco.api.offerConfirmations.get` | `read` | Get offer confirmation |
| `offerConfirmations.getPdf` | `moco.api.offerConfirmations.getPdf` | `read` | Download offer confirmation PDF (a PDF, saved to Files) |
| `offerConfirmations.list` | `moco.api.offerConfirmations.list` | `read` | List offer confirmations, one page at a time |
| `offerConfirmations.update` | `moco.api.offerConfirmations.update` | `write` | Update offer confirmation |
| `offers.assign` | `moco.api.offers.assign` | `write` | Assign offer to company/project/deal: if `project_id` is set, project company overrides `company_id` |
| `offers.attachments.create` | `moco.api.offers.attachments.create` | `write` | Create offer attachment |
| `offers.attachments.delete` | `moco.api.offers.attachments.delete` | `destructive` | Delete offer attachment |
| `offers.attachments.list` | `moco.api.offers.attachments.list` | `read` | List offer attachments |
| `offers.create` | `moco.api.offers.create` | `write` | Create offer |
| `offers.customerApproval.activate` | `moco.api.offers.customerApproval.activate` | `write` | Activate customer approval |
| `offers.customerApproval.deactivate` | `moco.api.offers.customerApproval.deactivate` | `write` | Deactivate customer approval |
| `offers.customerApproval.get` | `moco.api.offers.customerApproval.get` | `read` | Get customer approval state |
| `offers.delete` | `moco.api.offers.delete` | `destructive` | Delete offer |
| `offers.get` | `moco.api.offers.get` | `read` | Get offer |
| `offers.getPdf` | `moco.api.offers.getPdf` | `read` | Download offer PDF (a PDF, saved to Files) |
| `offers.list` | `moco.api.offers.list` | `read` | List offers, one page at a time |
| `offers.sendEmail` | `moco.api.offers.sendEmail` | `destructive` | Email an offer to the recipients given (sends real email from MOCO) |
| `offers.update` | `moco.api.offers.update` | `write` | Update offer |
| `offers.updateStatus` | `moco.api.offers.updateStatus` | `write` | Update offer status: transitions the offer state; successful updates return no body |
| `plannedPurchases.create` | `moco.api.plannedPurchases.create` | `write` | Create planned purchase: create a new planned purchase |
| `plannedPurchases.delete` | `moco.api.plannedPurchases.delete` | `destructive` | Delete planned purchase |
| `plannedPurchases.get` | `moco.api.plannedPurchases.get` | `read` | Get planned purchase |
| `plannedPurchases.list` | `moco.api.plannedPurchases.list` | `read` | List planned purchases, one page at a time |
| `plannedPurchases.update` | `moco.api.plannedPurchases.update` | `write` | Update planned purchase: update an existing planned purchase |
| `planningEntries.create` | `moco.api.planningEntries.create` | `write` | Create planning entry |
| `planningEntries.delete` | `moco.api.planningEntries.delete` | `destructive` | Delete planning entry |
| `planningEntries.get` | `moco.api.planningEntries.get` | `read` | Get planning entry |
| `planningEntries.list` | `moco.api.planningEntries.list` | `read` | List planning entries, one page at a time |
| `planningEntries.update` | `moco.api.planningEntries.update` | `write` | Update planning entry |
| `profile.get` | `moco.api.profile.get` | `read` | Read the profile of the authenticated user |
| `profile.performanceReport` | `moco.api.profile.performanceReport` | `read` | Get current user's performance report |
| `projects.archive` | `moco.api.projects.archive` | `write` | Archive a project; unarchive reverses it |
| `projects.assignProjectGroup` | `moco.api.projects.assignProjectGroup` | `write` | Assign project to project group: assigns a project to a project group |
| `projects.contracts.create` | `moco.api.projects.contracts.create` | `write` | Create project contract |
| `projects.contracts.delete` | `moco.api.projects.contracts.delete` | `destructive` | Delete project contract |
| `projects.contracts.get` | `moco.api.projects.contracts.get` | `read` | Get project contract |
| `projects.contracts.list` | `moco.api.projects.contracts.list` | `read` | List project contracts, one page at a time |
| `projects.contracts.update` | `moco.api.projects.contracts.update` | `write` | Update project contract |
| `projects.create` | `moco.api.projects.create` | `write` | Create a project for a client |
| `projects.delete` | `moco.api.projects.delete` | `destructive` | Delete project |
| `projects.disableShare` | `moco.api.projects.disableShare` | `write` | Disable project report sharing: disables public customer report sharing for the selected project |
| `projects.expenses.bulkCreate` | `moco.api.projects.expenses.bulkCreate` | `write` | Create project expenses in bulk |
| `projects.expenses.create` | `moco.api.projects.expenses.create` | `write` | Create project expense |
| `projects.expenses.delete` | `moco.api.projects.expenses.delete` | `destructive` | Delete project expense |
| `projects.expenses.disregard` | `moco.api.projects.expenses.disregard` | `write` | Disregard project expenses: marks selected expenses as disregarded for billing calculations |
| `projects.expenses.get` | `moco.api.projects.expenses.get` | `read` | Get project expense |
| `projects.expenses.list` | `moco.api.projects.expenses.list` | `read` | List project expenses, one page at a time |
| `projects.expenses.listAll` | `moco.api.projects.expenses.listAll` | `read` | List expenses across projects, one page at a time |
| `projects.expenses.update` | `moco.api.projects.expenses.update` | `write` | Update project expense |
| `projects.get` | `moco.api.projects.get` | `read` | Read one project, optionally embedding the client |
| `projects.groups.get` | `moco.api.projects.groups.get` | `read` | Get project group |
| `projects.groups.list` | `moco.api.projects.groups.list` | `read` | List project groups, one page at a time |
| `projects.list` | `moco.api.projects.list` | `read` | List projects with company, leader, tag, date and archive filters, one page at a time |
| `projects.listAssigned` | `moco.api.projects.listAssigned` | `read` | List projects assigned to current user |
| `projects.paymentSchedules.create` | `moco.api.projects.paymentSchedules.create` | `write` | Create project payment schedule |
| `projects.paymentSchedules.delete` | `moco.api.projects.paymentSchedules.delete` | `destructive` | Delete project payment schedule |
| `projects.paymentSchedules.get` | `moco.api.projects.paymentSchedules.get` | `read` | Get project payment schedule |
| `projects.paymentSchedules.list` | `moco.api.projects.paymentSchedules.list` | `read` | List project payment schedules, one page at a time |
| `projects.paymentSchedules.listAll` | `moco.api.projects.paymentSchedules.listAll` | `read` | List project payment schedules (all projects), one page at a time |
| `projects.paymentSchedules.update` | `moco.api.projects.paymentSchedules.update` | `write` | Update project payment schedule |
| `projects.recurringExpenses.create` | `moco.api.projects.recurringExpenses.create` | `write` | Create project recurring expense |
| `projects.recurringExpenses.delete` | `moco.api.projects.recurringExpenses.delete` | `destructive` | Delete project recurring expense |
| `projects.recurringExpenses.get` | `moco.api.projects.recurringExpenses.get` | `read` | Get project recurring expense |
| `projects.recurringExpenses.list` | `moco.api.projects.recurringExpenses.list` | `read` | List project recurring expenses, one page at a time |
| `projects.recurringExpenses.recur` | `moco.api.projects.recurringExpenses.recur` | `write` | Recur project recurring expense |
| `projects.recurringExpenses.update` | `moco.api.projects.recurringExpenses.update` | `write` | Update project recurring expense |
| `projects.report` | `moco.api.projects.report` | `read` | Read a project business report: budget, invoiced totals, hours and costs |
| `projects.share` | `moco.api.projects.share` | `write` | Enable project report sharing: enables public customer report sharing for the selected project |
| `projects.tasks.create` | `moco.api.projects.tasks.create` | `write` | Create project task |
| `projects.tasks.delete` | `moco.api.projects.tasks.delete` | `destructive` | Delete project task |
| `projects.tasks.deleteAll` | `moco.api.projects.tasks.deleteAll` | `destructive` | Delete all project tasks |
| `projects.tasks.get` | `moco.api.projects.tasks.get` | `read` | Get project task |
| `projects.tasks.list` | `moco.api.projects.tasks.list` | `read` | List project tasks, one page at a time |
| `projects.tasks.update` | `moco.api.projects.tasks.update` | `write` | Update project task |
| `projects.unarchive` | `moco.api.projects.unarchive` | `write` | Unarchive a project |
| `projects.unassignProjectGroup` | `moco.api.projects.unassignProjectGroup` | `write` | Unassign project from project group: removes the project-group assignment from a project |
| `projects.update` | `moco.api.projects.update` | `write` | Update a project |
| `purchases.assignToProject` | `moco.api.purchases.assignToProject` | `write` | Assign purchase item to project: assigns one purchase item to a project expense |
| `purchases.bookkeepingExports.create` | `moco.api.purchases.bookkeepingExports.create` | `destructive` | Create purchase bookkeeping export |
| `purchases.bookkeepingExports.get` | `moco.api.purchases.bookkeepingExports.get` | `read` | Get purchase bookkeeping export |
| `purchases.bookkeepingExports.list` | `moco.api.purchases.bookkeepingExports.list` | `read` | List purchase bookkeeping exports, one page at a time |
| `purchases.budgets.create` | `moco.api.purchases.budgets.create` | `write` | Create purchase budget: create a new purchase budget |
| `purchases.budgets.delete` | `moco.api.purchases.budgets.delete` | `destructive` | Delete a purchase budget |
| `purchases.budgets.list` | `moco.api.purchases.budgets.list` | `read` | List purchase budgets |
| `purchases.budgets.update` | `moco.api.purchases.budgets.update` | `write` | Update a purchase budget: update the title, cost category, or active status of a purchase budget |
| `purchases.budgets.updateTarget` | `moco.api.purchases.budgets.updateTarget` | `write` | Update budget target for a year |
| `purchases.categories.get` | `moco.api.purchases.categories.get` | `read` | Get purchase category |
| `purchases.categories.list` | `moco.api.purchases.categories.list` | `read` | List purchase categories, one page at a time |
| `purchases.create` | `moco.api.purchases.create` | `write` | Create purchase |
| `purchases.delete` | `moco.api.purchases.delete` | `destructive` | Delete purchase: deletion is possible only for pending purchases without payments |
| `purchases.drafts.create` | `moco.api.purchases.drafts.create` | `write` | Create purchase draft |
| `purchases.drafts.delete` | `moco.api.purchases.drafts.delete` | `destructive` | Delete purchase draft |
| `purchases.drafts.get` | `moco.api.purchases.drafts.get` | `read` | Get purchase draft |
| `purchases.drafts.getPdf` | `moco.api.purchases.drafts.getPdf` | `read` | Download purchase draft PDF (a PDF, saved to Files) |
| `purchases.drafts.list` | `moco.api.purchases.drafts.list` | `read` | List purchase drafts, one page at a time |
| `purchases.get` | `moco.api.purchases.get` | `read` | Get purchase |
| `purchases.list` | `moco.api.purchases.list` | `read` | List purchases, one page at a time |
| `purchases.payments.bulkCreate` | `moco.api.purchases.payments.bulkCreate` | `write` | Create purchase payments in bulk: requires `application/json` request body with `bulk_data` list |
| `purchases.payments.create` | `moco.api.purchases.payments.create` | `write` | Create purchase payment |
| `purchases.payments.delete` | `moco.api.purchases.payments.delete` | `destructive` | Delete purchase payment |
| `purchases.payments.get` | `moco.api.purchases.payments.get` | `read` | Get purchase payment |
| `purchases.payments.list` | `moco.api.purchases.payments.list` | `read` | List purchase payments, one page at a time |
| `purchases.payments.update` | `moco.api.purchases.payments.update` | `write` | Update purchase payment |
| `purchases.storeDocument` | `moco.api.purchases.storeDocument` | `destructive` | Store purchase document: replaces or adds document after purchase creation |
| `purchases.update` | `moco.api.purchases.update` | `write` | Update purchase |
| `purchases.updateStatus` | `moco.api.purchases.updateStatus` | `write` | Update purchase status |
| `receipts.create` | `moco.api.receipts.create` | `write` | Create receipt |
| `receipts.delete` | `moco.api.receipts.delete` | `destructive` | Delete receipt |
| `receipts.get` | `moco.api.receipts.get` | `read` | Get receipt |
| `receipts.list` | `moco.api.receipts.list` | `read` | List receipts, one page at a time |
| `receipts.update` | `moco.api.receipts.update` | `write` | Update receipt |
| `recurringExpenses.list` | `moco.api.recurringExpenses.list` | `read` | List recurring expenses, one page at a time |
| `reports.absences` | `moco.api.reports.absences` | `read` | Get absences report |
| `reports.cashflow` | `moco.api.reports.cashflow` | `read` | Get cashflow report, one page at a time |
| `reports.finance` | `moco.api.reports.finance` | `read` | Get finance report, one page at a time |
| `reports.plannedVsTracked` | `moco.api.reports.plannedVsTracked` | `read` | Get planned vs tracked report, one page at a time |
| `reports.utilization` | `moco.api.reports.utilization` | `read` | Get utilization report |
| `revenueCategories.create` | `moco.api.revenueCategories.create` | `write` | Create revenue category |
| `revenueCategories.delete` | `moco.api.revenueCategories.delete` | `destructive` | Delete revenue category |
| `revenueCategories.get` | `moco.api.revenueCategories.get` | `read` | Get revenue category |
| `revenueCategories.list` | `moco.api.revenueCategories.list` | `read` | List revenue categories, one page at a time |
| `revenueCategories.update` | `moco.api.revenueCategories.update` | `write` | Update revenue category |
| `schedules.create` | `moco.api.schedules.create` | `write` | Create schedule |
| `schedules.delete` | `moco.api.schedules.delete` | `destructive` | Delete schedule |
| `schedules.get` | `moco.api.schedules.get` | `read` | Get schedule |
| `schedules.list` | `moco.api.schedules.list` | `read` | List schedules: retrieve all absences (paged), one page at a time |
| `schedules.update` | `moco.api.schedules.update` | `write` | Update schedule |
| `session.verify` | `moco.api.session.verify` | `read` | Verify the API key and read the user identity it belongs to |
| `taggings.add` | `moco.api.taggings.add` | `write` | Add tags to a record, keeping the ones it has |
| `taggings.list` | `moco.api.taggings.list` | `read` | List the tags on one record |
| `taggings.remove` | `moco.api.taggings.remove` | `destructive` | Remove the given tags from a record |
| `taggings.replace` | `moco.api.taggings.replace` | `destructive` | Replace every tag on a record with the given list |
| `tags.create` | `moco.api.tags.create` | `write` | Create tag |
| `tags.delete` | `moco.api.tags.delete` | `destructive` | Delete tag |
| `tags.get` | `moco.api.tags.get` | `read` | Get tag |
| `tags.list` | `moco.api.tags.list` | `read` | List tags, one page at a time |
| `tags.update` | `moco.api.tags.update` | `write` | Update tag |
| `todos.get` | `moco.api.todos.get` | `read` | Get todo |
| `todos.list` | `moco.api.todos.list` | `read` | List todos, one page at a time |
| `units.create` | `moco.api.units.create` | `write` | Create unit |
| `units.delete` | `moco.api.units.delete` | `destructive` | Delete unit |
| `units.get` | `moco.api.units.get` | `read` | Get unit |
| `units.list` | `moco.api.units.list` | `read` | List units, one page at a time |
| `units.update` | `moco.api.units.update` | `write` | Update unit |
| `users.absenceRequests.create` | `moco.api.users.absenceRequests.create` | `write` | Create user absence request |
| `users.absenceRequests.delete` | `moco.api.users.absenceRequests.delete` | `destructive` | Delete user absence request |
| `users.absenceRequests.get` | `moco.api.users.absenceRequests.get` | `read` | Get user absence request |
| `users.absenceRequests.list` | `moco.api.users.absenceRequests.list` | `read` | List user absence requests, one page at a time |
| `users.create` | `moco.api.users.create` | `destructive` | Create a user (a billed seat); MOCO emails them a welcome message unless welcome_email is false |
| `users.delete` | `moco.api.users.delete` | `destructive` | Delete user |
| `users.employments.create` | `moco.api.users.employments.create` | `write` | Create user employment |
| `users.employments.delete` | `moco.api.users.employments.delete` | `destructive` | Delete user employment |
| `users.employments.get` | `moco.api.users.employments.get` | `read` | Get user employment |
| `users.employments.list` | `moco.api.users.employments.list` | `read` | List user employments, one page at a time |
| `users.employments.update` | `moco.api.users.employments.update` | `write` | Update user employment |
| `users.get` | `moco.api.users.get` | `read` | Read one user |
| `users.holidays.create` | `moco.api.users.holidays.create` | `write` | Create user holiday |
| `users.holidays.delete` | `moco.api.users.holidays.delete` | `destructive` | Delete user holiday |
| `users.holidays.get` | `moco.api.users.holidays.get` | `read` | Get user holiday |
| `users.holidays.list` | `moco.api.users.holidays.list` | `read` | List user holidays, one page at a time |
| `users.holidays.update` | `moco.api.users.holidays.update` | `write` | Update user holiday |
| `users.list` | `moco.api.users.list` | `read` | List account users, one page at a time |
| `users.performanceReport` | `moco.api.users.performanceReport` | `read` | Get user performance report |
| `users.presences.create` | `moco.api.users.presences.create` | `write` | Create user presence |
| `users.presences.delete` | `moco.api.users.presences.delete` | `destructive` | Delete user presence |
| `users.presences.get` | `moco.api.users.presences.get` | `read` | Get user presence |
| `users.presences.list` | `moco.api.users.presences.list` | `read` | List user presences, one page at a time |
| `users.presences.touch` | `moco.api.users.presences.touch` | `write` | Touch user presence |
| `users.presences.update` | `moco.api.users.presences.update` | `write` | Update user presence |
| `users.roles.list` | `moco.api.users.roles.list` | `read` | List user roles |
| `users.update` | `moco.api.users.update` | `write` | Update user |
| `users.workTimeAdjustments.create` | `moco.api.users.workTimeAdjustments.create` | `write` | Create user work time adjustment |
| `users.workTimeAdjustments.delete` | `moco.api.users.workTimeAdjustments.delete` | `destructive` | Delete user work time adjustment |
| `users.workTimeAdjustments.get` | `moco.api.users.workTimeAdjustments.get` | `read` | Get user work time adjustment |
| `users.workTimeAdjustments.list` | `moco.api.users.workTimeAdjustments.list` | `read` | List user work time adjustments, one page at a time |
| `users.workTimeAdjustments.update` | `moco.api.users.workTimeAdjustments.update` | `write` | Update user work time adjustment |
| `vatCodePurchases.get` | `moco.api.vatCodePurchases.get` | `read` | Get VAT code purchase |
| `vatCodePurchases.list` | `moco.api.vatCodePurchases.list` | `read` | List VAT code purchases, one page at a time |
| `vatCodeSales.get` | `moco.api.vatCodeSales.get` | `read` | Get VAT code sale |
| `vatCodeSales.list` | `moco.api.vatCodeSales.list` | `read` | List VAT code sales, one page at a time |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moco

## License

Apache-2.0
