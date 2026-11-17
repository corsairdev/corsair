# @corsair-dev/jobnimbus

JobNimbus plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/jobnimbus
```

## Authentication

The plugin uses a JobNimbus API key passed via the `Authorization: Bearer <token>` header. Customers can generate an API key in JobNimbus under **Settings > API > New API key**, selecting the desired Access Profile.

The primary API base URL is `https://app.jobnimbus.com/api1` (with secondary endpoints on `https://api.jobnimbus.com` for file uploads and `https://app.jobnimbus.com/api2` for payment creation).

## Operations

Every operation validates its input and response against strict Zod schemas. List endpoints support pagination via `size` (1–1000, default 1000) and zero-based offset `from`.

| Operation | Method and path | Official reference |
| --- | --- | --- |
| `contacts.create` | `POST /contacts` | [Create a Contact](https://documenter.getpostman.com/view/3919598/S11PpG4x#contacts) |
| `contacts.update` | `PUT /contacts/{jnid}` | [Update a Contact](https://documenter.getpostman.com/view/3919598/S11PpG4x#contacts) |
| `contacts.delete` | `PUT /contacts/{jnid}` | [Delete a Contact](https://documenter.getpostman.com/view/3919598/S11PpG4x#contacts) |
| `contacts.get` | `GET /contacts/{jnid}` | [Retrieve a Contact](https://documenter.getpostman.com/view/3919598/S11PpG4x#contacts) |
| `contacts.list` | `GET /contacts` | [Retrieve ALL Contacts](https://documenter.getpostman.com/view/3919598/S11PpG4x#contacts) |
| `jobs.create` | `POST /jobs` | [Create a Job](https://documenter.getpostman.com/view/3919598/S11PpG4x#jobs) |
| `jobs.update` | `PUT /jobs/{jnid}` | [Update a Job](https://documenter.getpostman.com/view/3919598/S11PpG4x#jobs) |
| `jobs.delete` | `PUT /jobs/{jnid}` | [Delete a Job](https://documenter.getpostman.com/view/3919598/S11PpG4x#jobs) |
| `jobs.get` | `GET /jobs/{jnid}` | [Retrieve a Job](https://documenter.getpostman.com/view/3919598/S11PpG4x#jobs) |
| `jobs.list` | `GET /jobs` | [Retrieve ALL Jobs](https://documenter.getpostman.com/view/3919598/S11PpG4x#jobs) |
| `tasks.create` | `POST /tasks` | [Create a Task](https://documenter.getpostman.com/view/3919598/S11PpG4x#tasks) |
| `tasks.update` | `PUT /tasks/{jnid}` | [Update a Task](https://documenter.getpostman.com/view/3919598/S11PpG4x#tasks) |
| `tasks.delete` | `PUT /tasks/{jnid}` | [Delete a Task](https://documenter.getpostman.com/view/3919598/S11PpG4x#tasks) |
| `tasks.get` | `GET /tasks/{jnid}` | [Retrieve a Task](https://documenter.getpostman.com/view/3919598/S11PpG4x#tasks) |
| `tasks.list` | `GET /tasks` | [Retrieve ALL Tasks](https://documenter.getpostman.com/view/3919598/S11PpG4x#tasks) |
| `activities.create` | `POST /activities` | [Create an Activity](https://documenter.getpostman.com/view/3919598/S11PpG4x#activities) |
| `activities.get` | `GET /activities/{jnid}` | [Retrieve an Activity](https://documenter.getpostman.com/view/3919598/S11PpG4x#activities) |
| `activities.list` | `GET /activities` | [Retrieve ALL Activities](https://documenter.getpostman.com/view/3919598/S11PpG4x#activities) |
| `files.create` | `POST /files` | [Create a File](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.createFromUrl` | `POST /files/fromUrl` | [Create a File from URL](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.requestSinglePartUpload` | `POST /files/v1/uploads/url` | [Upload Single Part File](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.completeSinglePartUpload` | `POST /files/v1/uploads/{jnid}/complete` | [Complete Single Part Upload](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.requestMultipartUpload` | `POST /files/v1/uploads/multi-urls` | [Upload Multipart File](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.completeMultipartUpload` | `POST /files/v1/uploads/{jnid}/complete` | [Complete Multipart Upload](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.abortMultipartUpload` | `POST /files/v1/uploads/multi-abort` | [Abort Multipart Upload](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.list` | `GET /files` | [Retrieve List of File Attachments](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `files.get` | `GET /files/{jnid}` | [Retrieve a File Attachment](https://documenter.getpostman.com/view/3919598/S11PpG4x#files) |
| `products.create` | `POST /v2/products` | [Create a Product](https://documenter.getpostman.com/view/3919598/S11PpG4x#products) |
| `products.update` | `PUT /v2/products/{jnid}` | [Update a Product](https://documenter.getpostman.com/view/3919598/S11PpG4x#products) |
| `products.delete` | `PUT /v2/products/{jnid}` | [Delete a Product](https://documenter.getpostman.com/view/3919598/S11PpG4x#products) |
| `products.get` | `GET /v2/products/{jnid}` | [Retrieve a Product](https://documenter.getpostman.com/view/3919598/S11PpG4x#products) |
| `products.list` | `GET /v2/products` | [Retrieve ALL Products](https://documenter.getpostman.com/view/3919598/S11PpG4x#products) |
| `materialOrders.create` | `POST /v2/materialorders` | [Create a MaterialOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#materialorders) |
| `materialOrders.update` | `PUT /v2/materialorders/{jnid}` | [Update a MaterialOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#materialorders) |
| `materialOrders.delete` | `PUT /v2/materialorders/{jnid}` | [Delete a MaterialOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#materialorders) |
| `materialOrders.get` | `GET /v2/materialorders/{jnid}` | [Retrieve a MaterialOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#materialorders) |
| `materialOrders.list` | `GET /v2/materialorders` | [Retrieve ALL MaterialOrders](https://documenter.getpostman.com/view/3919598/S11PpG4x#materialorders) |
| `workOrders.create` | `POST /v2/workorders` | [Create a WorkOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#workorders) |
| `workOrders.update` | `PUT /v2/workorders/{id}` | [Update a WorkOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#workorders) |
| `workOrders.delete` | `PUT /v2/workorders/{id}` | [Delete a WorkOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#workorders) |
| `workOrders.get` | `GET /v2/workorders/{jnid}` | [Retrieve a WorkOrder](https://documenter.getpostman.com/view/3919598/S11PpG4x#workorders) |
| `workOrders.list` | `GET /v2/workorders` | [Retrieve ALL WorkOrders](https://documenter.getpostman.com/view/3919598/S11PpG4x#workorders) |
| `estimates.create` | `POST /v2/estimates` | [Create an Estimate](https://documenter.getpostman.com/view/3919598/S11PpG4x#estimates) |
| `estimates.update` | `PUT /v2/estimates/{jnid}` | [Update an Estimate](https://documenter.getpostman.com/view/3919598/S11PpG4x#estimates) |
| `estimates.delete` | `PUT /v2/estimates/{jnid}` | [Delete an Estimate](https://documenter.getpostman.com/view/3919598/S11PpG4x#estimates) |
| `estimates.get` | `GET /v2/estimates/{jnid}` | [Retrieve an Estimate](https://documenter.getpostman.com/view/3919598/S11PpG4x#estimates) |
| `estimates.list` | `GET /v2/estimates` | [Retrieve ALL Estimates](https://documenter.getpostman.com/view/3919598/S11PpG4x#estimates) |
| `invoices.create` | `POST /v2/invoices` | [Create an Invoice](https://documenter.getpostman.com/view/3919598/S11PpG4x#invoices) |
| `invoices.update` | `PUT /v2/invoices/{jnid}` | [Update an Invoice](https://documenter.getpostman.com/view/3919598/S11PpG4x#invoices) |
| `invoices.delete` | `PUT /v2/invoices/{jnid}` | [Delete an Invoice](https://documenter.getpostman.com/view/3919598/S11PpG4x#invoices) |
| `invoices.get` | `GET /v2/invoices/{jnid}` | [Retrieve an Invoice](https://documenter.getpostman.com/view/3919598/S11PpG4x#invoices) |
| `invoices.list` | `GET /v2/invoices` | [Retrieve ALL Invoices](https://documenter.getpostman.com/view/3919598/S11PpG4x#invoices) |
| `payments.list` | `GET /payments` | [Retrieve ALL Payments](https://documenter.getpostman.com/view/3919598/S11PpG4x#payments) |
| `payments.create` | `POST /api2/v2/payments` | [Create a Payment](https://documenter.getpostman.com/view/3919598/S11PpG4x#payments) |
| `budgets.list` | `GET /budgets` | [Retrieve ALL Budgets](https://documenter.getpostman.com/view/3919598/S11PpG4x#budgets) |
| `account.getSettings` | `GET /account/settings` | [Retrieve Account Settings](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.getGroups` | `GET /account/settings?field=groups` | [Retrieve Group Information](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.getUsers` | `GET /account/users` | [Retrieve Users or Team Members](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.getUoms` | `GET /utility/uoms` | [Retrieve UoMs](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createWorkflow` | `POST /account/workflow` | [Create a Workflow](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createWorkflowStatus` | `POST /account/workflow/{workflowid}/status` | [Create a Status within a Workflow](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createLeadSource` | `POST /account/leadsource` | [Create a Lead Source](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createCustomField` | `POST /account/customfield` | [Create a Custom Field](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createFileType` | `POST /account/filetype` | [Create a File Type](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createTaskType` | `POST /account/tasktype` | [Create a Task Type](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createActivityType` | `POST /account/activitytype` | [Create an Activity Type](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |
| `account.createLocation` | `POST /account/location` | [Create a Location](https://documenter.getpostman.com/view/3919598/S11PpG4x#account) |

## Excluded Routes

- `PUT <presigned_url>` (Upload a File): direct binary upload to external AWS S3 storage via temporary presigned URLs obtained from `files.requestSinglePartUpload` or `files.requestMultipartUpload`, rather than a JobNimbus REST route.
- Inbound webhooks: excluded as JobNimbus uses REST polling / API calls and has no inbound webhook receiver contract.

## References

- [JobNimbus Public API (Postman Collection)](https://documenter.getpostman.com/view/3919598/S11PpG4x)
- [How Do I Create an API Key?](https://support.jobnimbus.com/how-do-i-create-an-api-key)
