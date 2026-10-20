# @corsair-dev/hunterio

Hunter.io plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hunterio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `hunterio.api.account.get` | `read` | Get the Hunter.io account profile |
| `account.update` | `hunterio.api.account.update` | `write` | Update the Hunter.io account profile |
| `accountStats.get` | `hunterio.api.accountStats.get` | `read` | Get global account statistics and credit usage |
| `apiKeys.create` | `hunterio.api.apiKeys.create` | `write` | Create a new API key |
| `apiKeys.delete` | `hunterio.api.apiKeys.delete` | `destructive` | Delete an API key permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `apiKeys.list` | `hunterio.api.apiKeys.list` | `read` | List the API keys on the account |
| `apiKeys.replace` | `hunterio.api.apiKeys.replace` | `write` | Replace an API key definition |
| `apiKeys.update` | `hunterio.api.apiKeys.update` | `write` | Update an API key |
| `companies.bulkCopy` | `hunterio.api.companies.bulkCopy` | `write` | Copy companies to another company list |
| `companies.bulkDelete` | `hunterio.api.companies.bulkDelete` | `destructive` | Delete companies in bulk permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `companies.bulkMove` | `hunterio.api.companies.bulkMove` | `write` | Move companies to another company list |
| `companies.bulkTag` | `hunterio.api.companies.bulkTag` | `write` | Assign a tag to companies in bulk |
| `companies.create` | `hunterio.api.companies.create` | `write` | Add a company to the account from a domain |
| `companies.delete` | `hunterio.api.companies.delete` | `destructive` | Delete a company permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `companies.get` | `hunterio.api.companies.get` | `read` | Get a company |
| `companies.list` | `hunterio.api.companies.list` | `read` | List companies with filters |
| `companies.tag` | `hunterio.api.companies.tag` | `write` | Assign a tag to a company |
| `companies.untag` | `hunterio.api.companies.untag` | `destructive` | Remove a tag from a company [DESTRUCTIVE] |
| `companyListFolders.create` | `hunterio.api.companyListFolders.create` | `write` | Create a company list folder |
| `companyListFolders.delete` | `hunterio.api.companyListFolders.delete` | `destructive` | Delete a company list folder permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `companyListFolders.get` | `hunterio.api.companyListFolders.get` | `read` | Get a company list folder |
| `companyListFolders.list` | `hunterio.api.companyListFolders.list` | `read` | List the company list folders |
| `companyListFolders.replace` | `hunterio.api.companyListFolders.replace` | `write` | Replace a company list folder |
| `companyListFolders.update` | `hunterio.api.companyListFolders.update` | `write` | Update a company list folder |
| `companyLists.addCompany` | `hunterio.api.companyLists.addCompany` | `write` | Add a company to a company list |
| `companyLists.create` | `hunterio.api.companyLists.create` | `write` | Create a company list |
| `companyLists.delete` | `hunterio.api.companyLists.delete` | `destructive` | Delete a company list permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `companyLists.favorite` | `hunterio.api.companyLists.favorite` | `write` | Mark a company list as favorite |
| `companyLists.get` | `hunterio.api.companyLists.get` | `read` | Get a company list and its companies |
| `companyLists.list` | `hunterio.api.companyLists.list` | `read` | List the company lists on the account |
| `companyLists.removeCompany` | `hunterio.api.companyLists.removeCompany` | `destructive` | Remove a company from a company list [DESTRUCTIVE] |
| `companyLists.replace` | `hunterio.api.companyLists.replace` | `write` | Replace a company list |
| `companyLists.unfavorite` | `hunterio.api.companyLists.unfavorite` | `write` | Remove the favorite mark from a company list |
| `companyLists.update` | `hunterio.api.companyLists.update` | `write` | Update a company list |
| `companyTags.create` | `hunterio.api.companyTags.create` | `write` | Create a company tag |
| `companyTags.delete` | `hunterio.api.companyTags.delete` | `destructive` | Delete a company tag permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `companyTags.get` | `hunterio.api.companyTags.get` | `read` | Get a company tag |
| `companyTags.list` | `hunterio.api.companyTags.list` | `read` | List the company tags on the account |
| `companyTags.replace` | `hunterio.api.companyTags.replace` | `write` | Replace a company tag |
| `companyTags.update` | `hunterio.api.companyTags.update` | `write` | Update a company tag |
| `connectedApps.get` | `hunterio.api.connectedApps.get` | `read` | Get a connected app |
| `connectedApps.list` | `hunterio.api.connectedApps.list` | `read` | List the connected apps on the account |
| `connectedApps.push` | `hunterio.api.connectedApps.push` | `write` | Push leads to a connected app |
| `customAttributes.create` | `hunterio.api.customAttributes.create` | `write` | Create a custom attribute |
| `customAttributes.delete` | `hunterio.api.customAttributes.delete` | `destructive` | Delete a custom attribute permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `customAttributes.get` | `hunterio.api.customAttributes.get` | `read` | Get a custom attribute |
| `customAttributes.list` | `hunterio.api.customAttributes.list` | `read` | List the custom attributes on the account |
| `customAttributes.replace` | `hunterio.api.customAttributes.replace` | `write` | Replace a custom attribute |
| `customAttributes.update` | `hunterio.api.customAttributes.update` | `write` | Update a custom attribute |
| `discover.companies` | `hunterio.api.discover.companies` | `read` | Discover companies matching the given filters |
| `discover.people` | `hunterio.api.discover.people` | `read` | Discover people matching the given filters |
| `discover.peoplePost` | `hunterio.api.discover.peoplePost` | `read` | Discover people with nested filters (POST form) |
| `discoverViews.create` | `hunterio.api.discoverViews.create` | `write` | Save the current discover filters as a view |
| `discoverViews.delete` | `hunterio.api.discoverViews.delete` | `destructive` | Delete a saved discover view permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `discoverViews.get` | `hunterio.api.discoverViews.get` | `read` | Get a saved discover view |
| `discoverViews.list` | `hunterio.api.discoverViews.list` | `read` | List saved discover views |
| `domainCount.get` | `hunterio.api.domainCount.get` | `read` | Count the email addresses available for a domain |
| `domainFinder.find` | `hunterio.api.domainFinder.find` | `read` | Find the domain of a company by name |
| `domainFinder.findPost` | `hunterio.api.domainFinder.findPost` | `read` | Find the domain of a company by name (POST form) |
| `domainSearch.search` | `hunterio.api.domainSearch.search` | `read` | List the email addresses found for a domain |
| `domainSearch.searchPost` | `hunterio.api.domainSearch.searchPost` | `read` | List the email addresses found for a domain (POST form) |
| `domainsSuggestion.get` | `hunterio.api.domainsSuggestion.get` | `read` | Suggest similar company domains |
| `emailAccounts.capacities` | `hunterio.api.emailAccounts.capacities` | `read` | Get the sending capacities of all email accounts |
| `emailAccounts.get` | `hunterio.api.emailAccounts.get` | `read` | Get a connected email account |
| `emailAccounts.healthReport` | `hunterio.api.emailAccounts.healthReport` | `read` | Get the deliverability health report of an email account |
| `emailAccounts.list` | `hunterio.api.emailAccounts.list` | `read` | List the connected email accounts |
| `emailAccounts.replace` | `hunterio.api.emailAccounts.replace` | `write` | Replace email account settings |
| `emailAccounts.sequences` | `hunterio.api.emailAccounts.sequences` | `read` | List the sequences using an email account |
| `emailAccounts.update` | `hunterio.api.emailAccounts.update` | `write` | Update email account settings |
| `emailAccounts.usage` | `hunterio.api.emailAccounts.usage` | `read` | Get sending usage and limits of an email account |
| `emailAccounts.warmupReport` | `hunterio.api.emailAccounts.warmupReport` | `read` | Get the warmup report of an email account |
| `emailCount.get` | `hunterio.api.emailCount.get` | `read` | Count the email addresses found for a domain |
| `emailFinder.find` | `hunterio.api.emailFinder.find` | `read` | Find the most likely email of a person |
| `emailFinder.findFound` | `hunterio.api.emailFinder.findFound` | `read` | Check whether an email was already found for a person |
| `emailFinder.findFoundPost` | `hunterio.api.emailFinder.findFoundPost` | `read` | Check whether an email was already found (POST form) |
| `emailInsight.get` | `hunterio.api.emailInsight.get` | `read` | Get insight data for an email address |
| `emailVerifier.verify` | `hunterio.api.emailVerifier.verify` | `read` | Verify the deliverability of an email address |
| `enrichment.combined` | `hunterio.api.enrichment.combined` | `read` | Enrich a person and their company together |
| `enrichment.company` | `hunterio.api.enrichment.company` | `read` | Enrich a company profile from a domain or name |
| `enrichment.person` | `hunterio.api.enrichment.person` | `read` | Enrich a person profile from an email or name |
| `feedback.create` | `hunterio.api.feedback.create` | `write` | Send product feedback to Hunter |
| `leads.bulkDelete` | `hunterio.api.leads.bulkDelete` | `destructive` | Delete leads in bulk permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `leads.bulkExist` | `hunterio.api.leads.bulkExist` | `read` | Check which of the given emails exist as leads |
| `leads.bulkMove` | `hunterio.api.leads.bulkMove` | `write` | Move leads to another leads list |
| `leads.bulkUpsert` | `hunterio.api.leads.bulkUpsert` | `write` | Create or update up to 100 leads in a single call |
| `leads.create` | `hunterio.api.leads.create` | `write` | Create a lead |
| `leads.delete` | `hunterio.api.leads.delete` | `destructive` | Delete a lead permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `leads.enrich` | `hunterio.api.leads.enrich` | `write` | Enrich a lead with data found by Hunter |
| `leads.exist` | `hunterio.api.leads.exist` | `read` | Check whether an email exists as a lead |
| `leads.get` | `hunterio.api.leads.get` | `read` | Get a lead |
| `leads.importCsv` | `hunterio.api.leads.importCsv` | `write` | Create a CSV import job for leads |
| `leads.list` | `hunterio.api.leads.list` | `read` | List leads with filters |
| `leads.replace` | `hunterio.api.leads.replace` | `write` | Replace a lead |
| `leads.update` | `hunterio.api.leads.update` | `write` | Update a lead |
| `leads.upsert` | `hunterio.api.leads.upsert` | `write` | Create or update a lead |
| `leadsListFolders.create` | `hunterio.api.leadsListFolders.create` | `write` | Create a leads list folder |
| `leadsListFolders.delete` | `hunterio.api.leadsListFolders.delete` | `destructive` | Delete a leads list folder permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `leadsListFolders.get` | `hunterio.api.leadsListFolders.get` | `read` | Get a leads list folder |
| `leadsListFolders.list` | `hunterio.api.leadsListFolders.list` | `read` | List the leads list folders |
| `leadsListFolders.replace` | `hunterio.api.leadsListFolders.replace` | `write` | Replace a leads list folder |
| `leadsListFolders.update` | `hunterio.api.leadsListFolders.update` | `write` | Update a leads list folder |
| `leadsLists.create` | `hunterio.api.leadsLists.create` | `write` | Create a leads list |
| `leadsLists.delete` | `hunterio.api.leadsLists.delete` | `destructive` | Delete a leads list permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `leadsLists.favorite` | `hunterio.api.leadsLists.favorite` | `write` | Mark a leads list as favorite |
| `leadsLists.get` | `hunterio.api.leadsLists.get` | `read` | Get a leads list and its leads |
| `leadsLists.list` | `hunterio.api.leadsLists.list` | `read` | List the leads lists on the account |
| `leadsLists.merge` | `hunterio.api.leadsLists.merge` | `destructive` | Merge a leads list into another list [DESTRUCTIVE] |
| `leadsLists.replace` | `hunterio.api.leadsLists.replace` | `write` | Replace a leads list |
| `leadsLists.unfavorite` | `hunterio.api.leadsLists.unfavorite` | `write` | Remove the favorite mark from a leads list |
| `leadsLists.update` | `hunterio.api.leadsLists.update` | `write` | Update a leads list |
| `leadTags.attach` | `hunterio.api.leadTags.attach` | `write` | Attach a tag to a lead |
| `leadTags.detach` | `hunterio.api.leadTags.detach` | `destructive` | Detach a tag from a lead [DESTRUCTIVE] |
| `lookalikes.list` | `hunterio.api.lookalikes.list` | `read` | Find companies similar to a seed company |
| `messages.list` | `hunterio.api.messages.list` | `read` | List messages sent or received |
| `messages.send` | `hunterio.api.messages.send` | `write` | Send a message from a connected email account |
| `messageTemplates.create` | `hunterio.api.messageTemplates.create` | `write` | Create a message template |
| `messageTemplates.delete` | `hunterio.api.messageTemplates.delete` | `destructive` | Delete a message template permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `messageTemplates.get` | `hunterio.api.messageTemplates.get` | `read` | Get a message template |
| `messageTemplates.list` | `hunterio.api.messageTemplates.list` | `read` | List message templates |
| `messageTemplates.replace` | `hunterio.api.messageTemplates.replace` | `write` | Replace a message template |
| `messageTemplates.update` | `hunterio.api.messageTemplates.update` | `write` | Update a message template |
| `multiDomainSearch.reveal` | `hunterio.api.multiDomainSearch.reveal` | `read` | Reveal the verified email addresses of a multi-domain search |
| `multiDomainSearch.search` | `hunterio.api.multiDomainSearch.search` | `read` | Find email addresses across multiple domains |
| `sequenceFollowUps.create` | `hunterio.api.sequenceFollowUps.create` | `write` | Add a follow-up step to a sequence |
| `sequenceFollowUps.delete` | `hunterio.api.sequenceFollowUps.delete` | `destructive` | Delete the last follow-up step permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `sequenceFollowUps.get` | `hunterio.api.sequenceFollowUps.get` | `read` | Get a follow-up step |
| `sequenceFollowUps.list` | `hunterio.api.sequenceFollowUps.list` | `read` | List the follow-up steps of a sequence |
| `sequenceFollowUps.replace` | `hunterio.api.sequenceFollowUps.replace` | `write` | Replace a follow-up step |
| `sequenceFollowUps.update` | `hunterio.api.sequenceFollowUps.update` | `write` | Update a follow-up step |
| `sequenceRecipients.add` | `hunterio.api.sequenceRecipients.add` | `write` | Add recipients to a sequence |
| `sequenceRecipients.list` | `hunterio.api.sequenceRecipients.list` | `read` | List the recipients of a sequence |
| `sequenceRecipients.remove` | `hunterio.api.sequenceRecipients.remove` | `destructive` | Remove recipients from a sequence and cancel their messages [DESTRUCTIVE] |
| `sequences.archive` | `hunterio.api.sequences.archive` | `write` | Archive a sequence |
| `sequences.create` | `hunterio.api.sequences.create` | `write` | Create a sequence draft |
| `sequences.delete` | `hunterio.api.sequences.delete` | `destructive` | Delete a sequence draft permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `sequences.get` | `hunterio.api.sequences.get` | `read` | Get a sequence |
| `sequences.list` | `hunterio.api.sequences.list` | `read` | List sequences |
| `sequences.pause` | `hunterio.api.sequences.pause` | `write` | Pause an active sequence |
| `sequences.replace` | `hunterio.api.sequences.replace` | `write` | Replace a sequence |
| `sequences.resume` | `hunterio.api.sequences.resume` | `write` | Resume a paused sequence |
| `sequences.start` | `hunterio.api.sequences.start` | `write` | Start a sequence |
| `sequences.test` | `hunterio.api.sequences.test` | `write` | Send test emails for every step of a sequence |
| `sequences.update` | `hunterio.api.sequences.update` | `write` | Update a sequence |
| `sequenceStats.get` | `hunterio.api.sequenceStats.get` | `read` | Get performance statistics for a sequence |
| `tags.create` | `hunterio.api.tags.create` | `write` | Create a lead tag |
| `tags.delete` | `hunterio.api.tags.delete` | `destructive` | Delete a lead tag permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `tags.get` | `hunterio.api.tags.get` | `read` | Get a lead tag |
| `tags.list` | `hunterio.api.tags.list` | `read` | List the lead tags on the account |
| `tags.replace` | `hunterio.api.tags.replace` | `write` | Replace a lead tag |
| `tags.update` | `hunterio.api.tags.update` | `write` | Update a lead tag |
| `teamMembers.list` | `hunterio.api.teamMembers.list` | `read` | List the team members on the account |
| `usage.get` | `hunterio.api.usage.get` | `read` | Get account usage and plan limits |
| `usage.history` | `hunterio.api.usage.history` | `read` | Get the daily API usage history for this billing period |
| `webhooks.create` | `hunterio.api.webhooks.create` | `write` | Create a webhook |
| `webhooks.delete` | `hunterio.api.webhooks.delete` | `destructive` | Delete a webhook permanently [DESTRUCTIVE · IRREVERSIBLE] |
| `webhooks.deleteLegacy` | `hunterio.api.webhooks.deleteLegacy` | `destructive` | Delete a webhook permanently via the legacy endpoint [DESTRUCTIVE · IRREVERSIBLE] |
| `webhooks.get` | `hunterio.api.webhooks.get` | `read` | Get a webhook |
| `webhooks.list` | `hunterio.api.webhooks.list` | `read` | List the configured webhooks |
| `webhooks.replace` | `hunterio.api.webhooks.replace` | `write` | Replace a webhook |
| `webhooks.update` | `hunterio.api.webhooks.update` | `write` | Update a webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hunterio

## License

Apache-2.0
