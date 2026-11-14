# @corsair-dev/helpscout

Help Scout plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/helpscout
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `conversations.create` | `helpscout.api.conversations.create` | `destructive` | Create a new conversation with initial thread |
| `conversations.delete` | `helpscout.api.conversations.delete` | `destructive` | Delete a conversation permanently |
| `conversations.get` | `helpscout.api.conversations.get` | `read` | Get a specific Help Scout conversation by ID |
| `conversations.list` | `helpscout.api.conversations.list` | `read` | List and filter conversations in Help Scout |
| `conversations.update` | `helpscout.api.conversations.update` | `destructive` | Update fields of a conversation via JSON Patch |
| `conversations.updateFields` | `helpscout.api.conversations.updateFields` | `destructive` | Update custom field values on a conversation |
| `conversations.updateTags` | `helpscout.api.conversations.updateTags` | `destructive` | Update tags assigned to a conversation |
| `customers.create` | `helpscout.api.customers.create` | `destructive` | Create a new customer profile |
| `customers.createAddress` | `helpscout.api.customers.createAddress` | `destructive` | Create customer physical address |
| `customers.createChat` | `helpscout.api.customers.createChat` | `destructive` | Add a chat handle to a customer |
| `customers.createEmail` | `helpscout.api.customers.createEmail` | `destructive` | Add an email address to a customer |
| `customers.createPhone` | `helpscout.api.customers.createPhone` | `destructive` | Add a phone number to a customer |
| `customers.createSocialProfile` | `helpscout.api.customers.createSocialProfile` | `destructive` | Add a social profile to a customer |
| `customers.createWebsite` | `helpscout.api.customers.createWebsite` | `destructive` | Add a website URL to a customer |
| `customers.delete` | `helpscout.api.customers.delete` | `destructive` | Delete a customer profile |
| `customers.deleteAddress` | `helpscout.api.customers.deleteAddress` | `destructive` | Delete customer physical address |
| `customers.deleteChat` | `helpscout.api.customers.deleteChat` | `destructive` | Delete a chat handle from a customer |
| `customers.deleteEmail` | `helpscout.api.customers.deleteEmail` | `destructive` | Delete an email address from a customer |
| `customers.deletePhone` | `helpscout.api.customers.deletePhone` | `destructive` | Delete a phone number from a customer |
| `customers.deleteSocialProfile` | `helpscout.api.customers.deleteSocialProfile` | `destructive` | Delete a social profile from a customer |
| `customers.deleteWebsite` | `helpscout.api.customers.deleteWebsite` | `destructive` | Delete a website URL from a customer |
| `customers.get` | `helpscout.api.customers.get` | `read` | Get details of a specific customer by ID |
| `customers.list` | `helpscout.api.customers.list` | `read` | List and search customers in Help Scout |
| `customers.patch` | `helpscout.api.customers.patch` | `destructive` | Partially update customer profile fields |
| `customers.update` | `helpscout.api.customers.update` | `destructive` | Overwrite an existing customer profile |
| `customers.updateAddress` | `helpscout.api.customers.updateAddress` | `destructive` | Update customer physical address |
| `customers.updateChat` | `helpscout.api.customers.updateChat` | `destructive` | Update an existing customer chat handle |
| `customers.updateEmail` | `helpscout.api.customers.updateEmail` | `destructive` | Update an existing customer email address |
| `customers.updatePhone` | `helpscout.api.customers.updatePhone` | `destructive` | Update an existing customer phone number |
| `customers.updateSocialProfile` | `helpscout.api.customers.updateSocialProfile` | `destructive` | Update an existing customer social profile |
| `customers.updateWebsite` | `helpscout.api.customers.updateWebsite` | `destructive` | Update an existing customer website URL |
| `customFields.list` | `helpscout.api.customFields.list` | `read` | List custom fields configured on a mailbox |
| `folders.list` | `helpscout.api.folders.list` | `read` | List folders belonging to a mailbox |
| `mailboxes.get` | `helpscout.api.mailboxes.get` | `read` | Get details of a specific Help Scout mailbox |
| `mailboxes.list` | `helpscout.api.mailboxes.list` | `read` | List mailboxes in Help Scout |
| `reports.getChat` | `helpscout.api.reports.getChat` | `read` | Get live chat channel report metrics |
| `reports.getCompany` | `helpscout.api.reports.getCompany` | `read` | Get overall company performance report metrics |
| `reports.getConversations` | `helpscout.api.reports.getConversations` | `read` | Get aggregate conversations report metrics |
| `reports.getDocs` | `helpscout.api.reports.getDocs` | `read` | Get Help Scout Docs knowledge base report metrics |
| `reports.getEmail` | `helpscout.api.reports.getEmail` | `read` | Get email channel performance report metrics |
| `savedReplies.create` | `helpscout.api.savedReplies.create` | `destructive` | Create a saved reply in a mailbox |
| `savedReplies.delete` | `helpscout.api.savedReplies.delete` | `destructive` | Delete a saved reply from a mailbox |
| `savedReplies.get` | `helpscout.api.savedReplies.get` | `read` | Get a saved reply by ID |
| `savedReplies.list` | `helpscout.api.savedReplies.list` | `read` | List saved replies for a mailbox |
| `savedReplies.update` | `helpscout.api.savedReplies.update` | `destructive` | Update an existing saved reply |
| `tags.get` | `helpscout.api.tags.get` | `read` | Get details of a tag by ID |
| `tags.list` | `helpscout.api.tags.list` | `read` | List all tags used across mailboxes |
| `threads.createChat` | `helpscout.api.threads.createChat` | `destructive` | Create a chat thread on a conversation |
| `threads.createCustomer` | `helpscout.api.threads.createCustomer` | `destructive` | Create a customer message thread on a conversation |
| `threads.createNote` | `helpscout.api.threads.createNote` | `destructive` | Create an internal note thread on a conversation |
| `threads.createPhone` | `helpscout.api.threads.createPhone` | `destructive` | Create a phone call log thread on a conversation |
| `threads.createReply` | `helpscout.api.threads.createReply` | `destructive` | Create a reply thread sent to the customer |
| `threads.getOriginalSource` | `helpscout.api.threads.getOriginalSource` | `read` | Get original email source of a thread |
| `threads.list` | `helpscout.api.threads.list` | `read` | List all threads in a conversation |
| `threads.update` | `helpscout.api.threads.update` | `destructive` | Update thread text or visibility |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/helpscout

## License

Apache-2.0
