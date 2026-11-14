# @corsair-dev/gatherup

GatherUp plugin for Corsair: manage the businesses on an account, add customers and send them feedback requests, and read the feedback and ratings they leave.

## Install

```bash
pnpm add @corsair-dev/gatherup
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `businesses.create` | `gatherup.api.businesses.create` | `write` | Create a business. The body uses `businessName` and `businessType`, not the `name` and `organisationType` a read returns |
| `businesses.deactivate` | `gatherup.api.businesses.deactivate` | `write` | Suspend a business so no feedback requests go out. Nothing is deleted, and `businesses.reactivate` reverses it |
| `businesses.delete` | `gatherup.api.businesses.delete` | `destructive` | Delete a business with its customers and feedback; it cannot be restored |
| `businesses.get` | `gatherup.api.businesses.get` | `read` | One business with its address, short feedback URL, package and ratings received |
| `businesses.list` | `gatherup.api.businesses.list` | `read` | Businesses on the account, paged; `next_page` gives the next page |
| `businesses.reactivate` | `gatherup.api.businesses.reactivate` | `write` | Bring a deactivated business back into service |
| `businesses.search` | `gatherup.api.businesses.search` | `read` | Search the business directory for an ID by name or domain |
| `businesses.types` | `gatherup.api.businesses.types` | `read` | The Google business types a business can be created with |
| `businesses.update` | `gatherup.api.businesses.update` | `write` | Update a business, including its name, type, address and thresholds |
| `customers.create` | `gatherup.api.customers.create` | `destructive` | Add a customer to a business. The body uses `customerFirstName` and `customerEmail`; an email or a phone is needed. Destructive because it can message the customer: a feedback request goes out when `sendFeedbackRequest` is true, and a business in automatic mode sends one on its own schedule |
| `customers.delete` | `gatherup.api.customers.delete` | `destructive` | Delete a customer and their feedback record |
| `customers.get` | `gatherup.api.customers.get` | `read` | One customer with their status, rating and review |
| `customers.list` | `gatherup.api.customers.list` | `read` | Customers of a business, paged, with their rating, review and request status |
| `customers.requestFeedback` | `gatherup.api.customers.requestFeedback` | `destructive` | Send a feedback request to a customer, which is a message to a real person |
| `customers.update` | `gatherup.api.customers.update` | `write` | Update a customer. This route spells the phone `customerPhoneNumber`, where create spells it `customerPhone` |
| `feedbacks.list` | `gatherup.api.feedbacks.list` | `read` | Feedback a business received, with its rating, NPS answer and text, paged |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gatherup

## License

Apache-2.0
