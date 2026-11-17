# @corsair-dev/tave

Tave plugin for Corsair: manage studio jobs, products, payments, tasks and notes, and read the studio reference data they use.

## Install

```bash
pnpm add @corsair-dev/tave
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.list` | `tave.api.brands.list` | `read` | List the brands of the studio |
| `jobs.create` | `tave.api.jobs.create` | `write` | Create a lead or job with its type, lead source, brand and event date |
| `jobs.delete` | `tave.api.jobs.delete` | `destructive` | Permanently delete a job with its orders, invoices and notes |
| `jobs.get` | `tave.api.jobs.get` | `read` | Read one job with its contacts, orders, invoices and totals |
| `jobs.list` | `tave.api.jobs.list` | `read` | List jobs with their stage, balances and event dates, filtered by stage, lead status or event date range |
| `jobs.payments` | `tave.api.jobs.payments` | `read` | List the payments recorded against one job |
| `jobs.update` | `tave.api.jobs.update` | `write` | Change a job's stage, dates, type, lead source, brand or closed state |
| `jobTypes.list` | `tave.api.jobTypes.list` | `read` | List the job types, whose IDs jobs.create takes |
| `leadSources.list` | `tave.api.leadSources.list` | `read` | List the lead sources, for reporting where a lead came from |
| `leadStatuses.list` | `tave.api.leadStatuses.list` | `read` | List the lead statuses, whose IDs jobs.list filters by |
| `notes.create` | `tave.api.notes.create` | `write` | Add an HTML note to a job or a contact |
| `notes.delete` | `tave.api.notes.delete` | `destructive` | Permanently delete a note |
| `notes.list` | `tave.api.notes.list` | `read` | List notes, optionally only those on one job |
| `payments.create` | `tave.api.payments.create` | `write` | Record a payment against a job, which changes that job balance |
| `payments.delete` | `tave.api.payments.delete` | `destructive` | Delete a payment, which removes it from the job balance |
| `payments.get` | `tave.api.payments.get` | `read` | Read one payment with its refunded amount and memo |
| `payments.list` | `tave.api.payments.list` | `read` | List payments with their job, amount, status and method |
| `payments.update` | `tave.api.payments.update` | `write` | Change a payment's status, memo, method or payer; the amount is read-only, so to fix it delete the payment and record it again (the delete cannot be undone and the new payment gets a new id) |
| `products.create` | `tave.api.products.create` | `write` | Add a product to the price list |
| `products.delete` | `tave.api.products.delete` | `destructive` | Delete a product; orders that already include it keep their line item |
| `products.get` | `tave.api.products.get` | `read` | Read one product with its price, SKU and flags |
| `products.list` | `tave.api.products.list` | `read` | List the products in your price list |
| `products.update` | `tave.api.products.update` | `write` | Change a product's name, price, SKU or flags |
| `studio.get` | `tave.api.studio.get` | `read` | Read the studio profile, including its currency and timezone |
| `taskLists.list` | `tave.api.taskLists.list` | `read` | List the task lists, whose IDs tasks.create takes |
| `tasks.create` | `tave.api.tasks.create` | `write` | Create a task in a task list, optionally on a job |
| `tasks.delete` | `tave.api.tasks.delete` | `destructive` | Permanently delete a task |
| `tasks.list` | `tave.api.tasks.list` | `read` | List tasks with their list, assignee and due date |
| `tasks.update` | `tave.api.tasks.update` | `write` | Change a task's name, assignee, due date or completed state |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/tave

## License

Apache-2.0
