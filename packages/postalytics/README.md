# @corsair-dev/postalytics

Manage direct mail with the [Postalytics REST API](https://docs.postalytics.com/references/postalytics-rest-api/get-my-account). This plugin exposes 45 documented operations.

## Install

```bash
pnpm add @corsair-dev/postalytics
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.createNewAccount` | `postalytics.api.account.createNewAccount` | `write` | create new account |
| `account.deleteAccount` | `postalytics.api.account.deleteAccount` | `destructive` | delete account |
| `account.getAccount` | `postalytics.api.account.getAccount` | `read` | get account |
| `account.getIntegrations` | `postalytics.api.account.getIntegrations` | `read` | get integrations |
| `account.getMyAccount` | `postalytics.api.account.getMyAccount` | `read` | get my account |
| `account.updateAccount` | `postalytics.api.account.updateAccount` | `write` | update account |
| `campaigns.createNewCampaign` | `postalytics.api.campaigns.createNewCampaign` | `write` | create new campaign |
| `campaigns.deleteCampaign` | `postalytics.api.campaigns.deleteCampaign` | `destructive` | delete campaign |
| `campaigns.getAllCampaigns` | `postalytics.api.campaigns.getAllCampaigns` | `read` | get all campaigns |
| `campaigns.getAllDripCampaigns` | `postalytics.api.campaigns.getAllDripCampaigns` | `read` | get all drip campaigns |
| `campaigns.getCampaign` | `postalytics.api.campaigns.getCampaign` | `read` | get campaign |
| `campaigns.getCampaignEvents` | `postalytics.api.campaigns.getCampaignEvents` | `read` | get campaign events |
| `campaigns.getCampaignStats` | `postalytics.api.campaigns.getCampaignStats` | `read` | get campaign stats |
| `campaigns.getContactEvent` | `postalytics.api.campaigns.getContactEvent` | `read` | get contact event |
| `campaigns.updateCampaignStatus` | `postalytics.api.campaigns.updateCampaignStatus` | `write` | update campaign status |
| `contacts.createContactOnList` | `postalytics.api.contacts.createContactOnList` | `write` | create contact on list |
| `contacts.deleteContact` | `postalytics.api.contacts.deleteContact` | `destructive` | delete contact |
| `contacts.getAllContactLists` | `postalytics.api.contacts.getAllContactLists` | `read` | get all contact lists |
| `contacts.getContact` | `postalytics.api.contacts.getContact` | `read` | get contact |
| `contacts.getContactsOnList` | `postalytics.api.contacts.getContactsOnList` | `read` | get contacts on list |
| `contacts.updateContactOnList` | `postalytics.api.contacts.updateContactOnList` | `write` | update contact on list |
| `flows.enrollContactToFlow` | `postalytics.api.flows.enrollContactToFlow` | `write` | enroll contact to flow |
| `flows.getAllFlows` | `postalytics.api.flows.getAllFlows` | `read` | get all flows |
| `flows.getFlow` | `postalytics.api.flows.getFlow` | `read` | get flow |
| `flows.unenrollContactFromFlow` | `postalytics.api.flows.unenrollContactFromFlow` | `write` | unenroll contact from flow |
| `login.createLoginLink` | `postalytics.api.login.createLoginLink` | `write` | create login link |
| `mail.sendMail` | `postalytics.api.mail.sendMail` | `destructive` | Send direct mail, which may incur charges and cannot be recalled |
| `suppressionContacts.createSuppressionListContact` | `postalytics.api.suppressionContacts.createSuppressionListContact` | `write` | create suppression list contact |
| `suppressionContacts.deleteSuppressionListContact` | `postalytics.api.suppressionContacts.deleteSuppressionListContact` | `destructive` | delete suppression list contact |
| `suppressionContacts.getSuppressionListContact` | `postalytics.api.suppressionContacts.getSuppressionListContact` | `read` | get suppression list contact |
| `suppressionContacts.getSuppressionListContacts` | `postalytics.api.suppressionContacts.getSuppressionListContacts` | `read` | get suppression list contacts |
| `suppressionContacts.updateSuppressionListContact` | `postalytics.api.suppressionContacts.updateSuppressionListContact` | `write` | update suppression list contact |
| `suppressionLists.createSuppressionList` | `postalytics.api.suppressionLists.createSuppressionList` | `write` | create suppression list |
| `suppressionLists.deleteSuppressionList` | `postalytics.api.suppressionLists.deleteSuppressionList` | `destructive` | delete suppression list |
| `suppressionLists.getSuppressionList` | `postalytics.api.suppressionLists.getSuppressionList` | `read` | get suppression list |
| `suppressionLists.getSuppressionLists` | `postalytics.api.suppressionLists.getSuppressionLists` | `read` | get suppression lists |
| `templates.createTemplate` | `postalytics.api.templates.createTemplate` | `write` | create template |
| `templates.deleteTemplate` | `postalytics.api.templates.deleteTemplate` | `destructive` | delete template |
| `templates.getAllTemplates` | `postalytics.api.templates.getAllTemplates` | `read` | get all templates |
| `templates.getTemplate` | `postalytics.api.templates.getTemplate` | `read` | get template |
| `webhooks.createWebhook` | `postalytics.api.webhooks.createWebhook` | `write` | create webhook |
| `webhooks.deleteWebhook` | `postalytics.api.webhooks.deleteWebhook` | `destructive` | delete webhook |
| `webhooks.getAllWebhooks` | `postalytics.api.webhooks.getAllWebhooks` | `read` | get all webhooks |
| `webhooks.getWebhook` | `postalytics.api.webhooks.getWebhook` | `read` | get webhook |
| `webhooks.updateWebhook` | `postalytics.api.webhooks.updateWebhook` | `write` | update webhook |

## Auth

Auth: API key. Postalytics uses HTTP Basic with the API key as the username and an empty password. Corsair prompts your tenant for credentials on first use. Set `sandbox: true` when constructing the plugin to use the sandbox host.

Postalytics documents a limit of three requests per second. Rate-limit errors include `Retry-After` when available; requests are not automatically retried.

## Webhooks

The endpoints above manage Postalytics outbound webhook configurations. This plugin does not receive or verify inbound webhook events.

## Known limitation

The provider reference describes `PUT /api/v1/campaigns/{id}` without a request body or status parameter. The plugin forwards that documented bodyless request; confirm the intended behavior with Postalytics before relying on it.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/postalytics

## License

Apache-2.0
