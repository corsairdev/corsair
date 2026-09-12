# @corsair-dev/emelia

Emelia plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/emelia
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.me` | `emelia.api.account.me` | `read` | Retrieve authenticated Emelia account details |
| `blacklist.add` | `emelia.api.blacklist.add` | `write` | Add a contact to the email blacklist |
| `blacklist.remove` | `emelia.api.blacklist.remove` | `destructive` | Remove a contact from the email blacklist |
| `campaigns.addContact` | `emelia.api.campaigns.addContact` | `write` | Add a contact to a campaign |
| `campaigns.list` | `emelia.api.campaigns.list` | `read` | List all cold outreach campaigns |
| `campaigns.removeContact` | `emelia.api.campaigns.removeContact` | `destructive` | Remove a contact from a campaign |
| `contacts.addToList` | `emelia.api.contacts.addToList` | `write` | Add a contact to a contact list |
| `contacts.listLists` | `emelia.api.contacts.listLists` | `read` | List all contact lists |
| `emailCampaigns.addContact` | `emelia.api.emailCampaigns.addContact` | `write` | Add a contact to an email campaign (legacy REST) |
| `emailCampaigns.deleteContact` | `emelia.api.emailCampaigns.deleteContact` | `destructive` | Remove a contact from an email campaign |
| `emailCampaigns.listContacts` | `emelia.api.emailCampaigns.listContacts` | `read` | List contacts in an email campaign |
| `linkedin.createCampaign` | `emelia.api.linkedin.createCampaign` | `write` | Create a new LinkedIn campaign |
| `linkedin.deleteContact` | `emelia.api.linkedin.deleteContact` | `destructive` | Delete a contact from a LinkedIn campaign |
| `linkedin.getActivities` | `emelia.api.linkedin.getActivities` | `read` | Retrieve activities for a LinkedIn campaign |
| `linkedin.listCampaigns` | `emelia.api.linkedin.listCampaigns` | `read` | List all LinkedIn campaigns |
| `providers.list` | `emelia.api.providers.list` | `read` | List all configured email providers |
| `restCampaigns.create` | `emelia.api.restCampaigns.create` | `write` | Create a new email campaign (REST) |
| `restCampaigns.getActivities` | `emelia.api.restCampaigns.getActivities` | `read` | Retrieve activities for an email campaign |
| `restCampaigns.list` | `emelia.api.restCampaigns.list` | `read` | List all email campaigns (REST) |
| `tools.findEmailSingle` | `emelia.api.tools.findEmailSingle` | `write` | Initiate a find-email job for a single contact |
| `tools.findPhoneSingle` | `emelia.api.tools.findPhoneSingle` | `write` | Initiate a phone-find job for a single contact |
| `tools.getFindEmailResult` | `emelia.api.tools.getFindEmailResult` | `read` | Retrieve the result of a find-email job |
| `tools.getFindPhoneResult` | `emelia.api.tools.getFindPhoneResult` | `read` | Retrieve the result of a phone-find job |
| `tools.getVerifyEmailResult` | `emelia.api.tools.getVerifyEmailResult` | `read` | Retrieve the result of an email verification job |
| `tools.verifyEmailSingle` | `emelia.api.tools.verifyEmailSingle` | `write` | Initiate an email verification job |
| `webhooks.create` | `emelia.api.webhooks.create` | `write` | Create a webhook for campaign events |
| `webhooks.list` | `emelia.api.webhooks.list` | `read` | List all webhooks |
| `webhooks.remove` | `emelia.api.webhooks.remove` | `destructive` | Delete a webhook by URL |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/emelia

## License

Apache-2.0
