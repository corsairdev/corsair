# @corsair-dev/lusha

B2B contact and company data from Lusha: search, enrich and prospect contacts and companies, lookalikes, recommendations, buying groups, signals and scores, tables, signal and opt-out webhooks, conversations and account usage. Most calls charge credits.

## Install

```bash
pnpm add @corsair-dev/lusha
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getAccountUsage` | `lusha.api.account.getAccountUsage` | `read` | Read the account credit balance, rate-limit windows, plan and per-action pricing map. Free, but Lusha caps it at 5 requests per minute. |
| `auditLogs.getStats` | `lusha.api.auditLogs.getStats` | `read` | Get Audit Log Statistics. Get delivery statistics for your account. |
| `auditLogs.list` | `lusha.api.auditLogs.list` | `read` | Get Audit Logs. Retrieve webhook delivery logs for your account. |
| `company.enrichCompanies` | `lusha.api.company.enrichCompanies` | `read` | Reveal full firmographics for up to 100 company ids, including premium fields named in reveal (each charged separately per result). Omitting reveal returns base firmographics only. Charges credits per result via reveal_company. |
| `company.getCompanyFilterTypes` | `lusha.api.company.getCompanyFilterTypes` | `read` | Get Company Filter Types (Discovery). Returns all available filter types for company prospecting and whether each requires a search query. |
| `company.getCompanyFilterValues` | `lusha.api.company.getCompanyFilterValues` | `read` | Get Company Filter Values. Returns valid values for a single company filter type. |
| `company.getCompanyIcpFitScores` | `lusha.api.company.getCompanyIcpFitScores` | `read` | Score Companies by ICP Fit. Score how well each company fits 1-3 of your Target Profiles, from '0' to '1'. Billing: 1 credit per scored company, regardless of how many profiles it's scored against. A score of '0' is charged. Error rows ('NOT_FOUND' / 'NO_SCORE') are never charged. |
| `company.getCompanyLookalikes` | `lusha.api.company.getCompanyLookalikes` | `read` | Company Lookalikes. Find companies similar to a set of seed companies using AI-powered recommendations. Billing: Charged per result via the 'lookalikeCompany' action. |
| `company.getCompanyRecommendationFilters` | `lusha.api.company.getCompanyRecommendationFilters` | `read` | Company Recommendation Filters. Lists the Target Profiles and signal types that currently appear in your company recommendations. Billing: Free. |
| `company.getCompanyRecommendations` | `lusha.api.company.getCompanyRecommendations` | `read` | Company Recommendations. Returns the recommended companies for the calling user, ranked by Lusha against your Target Profiles and recent signals. Billing: Charged per result without an 'error', via the 'companyRecommendationsReveal' action. |
| `company.getCompanySignalFilters` | `lusha.api.company.getCompanySignalFilters` | `read` | Get Company Signal Filters (Discovery). Returns all available filter types for company signals and whether each requires a search query. |
| `company.getCompanySignalFilterValues` | `lusha.api.company.getCompanySignalFilterValues` | `read` | Get Company Signal Filter Values. Returns valid values for a single company signal filter type. Billing: Free. |
| `company.getCompanySignals` | `lusha.api.company.getCompanySignals` | `read` | Company Signals. Retrieve signal events for a list of companies - hiring activity, headcount changes, web traffic, IT spend, news, and intent. Billing: Charged per matched signal per result via the 'showSignalsCompany' action. Intent signals are charged the same way as every other company signal - no matches, no charge. |
| `company.getCompanySignalScores` | `lusha.api.company.getCompanySignalScores` | `read` | Score Companies by Signal Activity. Score companies by their active buying signals. Billing: 1 credit is charged per scored row via 'signal_score_company_reveal'. This action is currently limited-availability - while it isn't yet seeded on an account's pricebook, the endpoint stays free ('billing.creditsCharged' is '0'). |
| `company.getCompanySignalTypes` | `lusha.api.company.getCompanySignalTypes` | `read` | Get Company Signal Types. Returns the full list of supported signal types for companies. |
| `company.getWebsiteVisits` | `lusha.api.company.getWebsiteVisits` | `read` | Get Website Visitors. Returns companies ranked by website-visit signals for your tracked domains and date range. Billing: not documented; the response reports any credits charged in billing. |
| `company.prospectCompanies` | `lusha.api.company.prospectCompanies` | `read` | Prospecting Companies. Search for companies that match your target market using rich filter criteria. Billing: Charged per result via 'api_search'. If signals are requested, an additional charge applies per matched signal per result. |
| `company.searchAndEnrichCompanies` | `lusha.api.company.searchAndEnrichCompanies` | `read` | Search up to 100 companies by id, name or domain and return their full firmographics in one call. Charges credits per result and per reveal field. |
| `company.searchCompanies` | `lusha.api.company.searchCompanies` | `read` | Look up up to 100 companies by id, name or domain and get firmographic previews. Charges credits per matched result. |
| `companyTables.addEntities` | `lusha.api.companyTables.addEntities` | `destructive` | Add Entities to Companies Table. Add up to 500 company IDs to an existing table. Billing: Charges 'reveal_company' per newly-added company, deduped via row-count delta - duplicates and already-present companies aren't charged again. |
| `companyTables.create` | `lusha.api.companyTables.create` | `write` | Create Companies Table. Create a new, empty companies table, optionally seeded with an initial list of company IDs. Billing: Free. |
| `companyTables.delete` | `lusha.api.companyTables.delete` | `destructive` | Delete Companies Table. Permanently delete a table and all its data. Billing: Free. |
| `companyTables.get` | `lusha.api.companyTables.get` | `read` | Get Companies Table. Get a table's metadata and current processing status. Billing: Free. |
| `companyTables.getColumnCatalog` | `lusha.api.companyTables.getColumnCatalog` | `read` | Get Companies Column Catalog. List every Lusha data column that can be added to a companies table - 46 columns. Billing: Free - no credits charged. |
| `companyTables.list` | `lusha.api.companyTables.list` | `read` | List Companies Tables. List companies tables owned by the given user, plus any tables shared with the account. Billing: Free. |
| `companyTables.listEntities` | `lusha.api.companyTables.listEntities` | `read` | Get Companies Table Entities. Read a page of rows in the table, with all column values and per-cell status. Billing: Charged per row returned via 'export_api'. |
| `companyTables.removeColumn` | `lusha.api.companyTables.removeColumn` | `destructive` | Remove Column from Companies Table. Remove a column and delete all of its cell data across the table. Billing: Free. |
| `companyTables.removeEntities` | `lusha.api.companyTables.removeEntities` | `destructive` | Remove Entities from Companies Table. Remove specific company IDs from a table. Billing: Free. |
| `companyTables.runColumn` | `lusha.api.companyTables.runColumn` | `destructive` | Run Column on Companies Table. Populate or refresh a column's data for some or all rows in the table. Billing: Charged per row processed, per the column's credit tier. Company enrichment charges once per company per table - re-runs on an already-paid company in the same table are free. |
| `companyTables.update` | `lusha.api.companyTables.update` | `write` | Update Companies Table. Rename a table, change its visibility, or reassign its owner. Billing: Free. |
| `contactTables.addColumns` | `lusha.api.contactTables.addColumns` | `write` | Add Columns to Contacts Table. Add up to 10 Lusha columns to a table in one call. Billing: Free today - credits aren't charged for adding columns yet. |
| `contactTables.addEntities` | `lusha.api.contactTables.addEntities` | `write` | Add Entities to Contacts Table. Add up to 500 contact IDs to an existing table. Billing: Free. |
| `contactTables.create` | `lusha.api.contactTables.create` | `write` | Create Contacts Table. Create a new, empty contacts table, optionally seeded with an initial list of contact IDs. Billing: Free. |
| `contactTables.delete` | `lusha.api.contactTables.delete` | `destructive` | Delete Contacts Table. Permanently delete a table and all its data. Billing: Free. |
| `contactTables.get` | `lusha.api.contactTables.get` | `read` | Get Contacts Table. Get a table's metadata and current processing status. Billing: Free. |
| `contactTables.getColumnCatalog` | `lusha.api.contactTables.getColumnCatalog` | `read` | Get Contacts Column Catalog. List every Lusha data column that can be added to a contacts table - 22 columns. Billing: Free - no credits charged. |
| `contactTables.list` | `lusha.api.contactTables.list` | `read` | List Contacts Tables. List contacts tables owned by the given user, plus any tables shared with the account. Billing: Free. |
| `contactTables.listColumns` | `lusha.api.contactTables.listColumns` | `read` | List Contacts Table Columns. List the columns on a table, with type and aggregated per-cell status counts. Billing: Free. |
| `contactTables.listEntities` | `lusha.api.contactTables.listEntities` | `read` | Get Contacts Table Entities. Read a page of rows in the table, with all column values and per-cell status. Billing: Charged per row returned via 'export_api'. |
| `contactTables.removeColumn` | `lusha.api.contactTables.removeColumn` | `destructive` | Remove Column from Contacts Table. Remove a column and delete all of its cell data across the table. Billing: Free. |
| `contactTables.removeEntities` | `lusha.api.contactTables.removeEntities` | `destructive` | Remove Entities from Contacts Table. Remove specific contact IDs from a table. Billing: Free. |
| `contactTables.runColumn` | `lusha.api.contactTables.runColumn` | `destructive` | Run Column on Contacts Table. Populate or refresh a column's data for some or all rows in the table. Billing: Charged per row processed, per the column's credit tier. Re-running with 'all' charges again for rows that already have data. |
| `contactTables.update` | `lusha.api.contactTables.update` | `write` | Update Contacts Table. Rename a table, change its visibility, or reassign its owner. Billing: Free. |
| `conversations.getTranscript` | `lusha.api.conversations.getTranscript` | `read` | Get Conversation Transcript. Returns the speaker-attributed, timestamped transcript of a single conversation. Billing: 1 credit per successful request via 'ci_transcript_analysis', including repeat requests for the same conversation. A '404' is never charged. While 'ci_transcript_analysis' isn't seeded on your account's pricebook, the endpoint stays free. |
| `conversations.search` | `lusha.api.conversations.search` | `read` | Search Conversations. Search the sales conversations recorded by Lusha Conversations for your account. Billing: 1 credit per block of up to 25 conversations returned (1–25 = 1, 26–50 = 2, 51–75 = 3, 76–100 = 4), via 'ci_meeting_data_export'. Charged on results returned, not the page size requested. A request that returns nothing is free. |
| `icp.listProfiles` | `lusha.api.icp.listProfiles` | `read` | List Target Profiles. Returns the Target Profiles (ICPs) you can see: your own, plus any an admin has shared with the account. Billing: Free (0 credits). |
| `jobs.getContactsEnrichJob` | `lusha.api.jobs.getContactsEnrichJob` | `read` | Where a partial contacts enrich job stands: processing (poll again after retryAfter seconds), complete (contacts to merge by id plus creditsCharged), or the terminal expired and failed. Free. |
| `person.enrichContacts` | `lusha.api.person.enrichContacts` | `read` | Reveal emails and phone numbers for up to 100 contact ids from search results. Charges credits per revealed data point; a data point already revealed for the account is free to re-enrich (canReveal.credits is 0 in search). May answer status partial with a job; follow it with jobs.getContactsEnrichJob until it reports complete, expired or failed. |
| `person.getBuyingGroup` | `lusha.api.person.getBuyingGroup` | `read` | Get Buying Group Contacts. Identify the buying group within a set of target companies. Billing: 1 credit per contact record returned, via the 'buyingGroupContact' action. Credits are charged per record, not per person - if the same person appears at more than one company in the request, each record is charged. |
| `person.getContactFilterTypes` | `lusha.api.person.getContactFilterTypes` | `read` | Get Contact Filter Types (Discovery). Returns all available filter types for contact prospecting and whether each requires a search query. |
| `person.getContactFilterValues` | `lusha.api.person.getContactFilterValues` | `read` | Get Contact Filter Values. Returns valid values for a single contact filter type. |
| `person.getContactIcpFitScores` | `lusha.api.person.getContactIcpFitScores` | `read` | Score Contacts by ICP Fit. Score how well each contact fits 1-3 of your Target Profiles, from '0' to '1'. Billing: 1 credit per scored contact, regardless of how many profiles it's scored against. A score of '0' is charged. Error rows ('NOT_FOUND' / 'NO_SCORE') are never charged. |
| `person.getContactLookalikes` | `lusha.api.person.getContactLookalikes` | `read` | Contact Lookalikes. Find contacts similar to a set of seed contacts using AI-powered recommendations. Billing: Charged per result via the 'lookalikeContact' action. |
| `person.getContactRecommendationFilters` | `lusha.api.person.getContactRecommendationFilters` | `read` | Contact Recommendation Filters. Lists the Target Profiles and signal types that currently appear in your contact recommendations. Billing: Free. |
| `person.getContactRecommendations` | `lusha.api.person.getContactRecommendations` | `read` | Contact Recommendations. Returns the recommended contacts for the calling user, ranked by Lusha against your Target Profiles and recent signals. Billing: Charged per result without an 'error', via the 'contactRecommendationsReveal' action. Results with an 'error' (e.g. 'COMPLIANCE_RESTRICTED') keep their scores but carry no personal data and are not charged. |
| `person.getContactSignals` | `lusha.api.person.getContactSignals` | `read` | Contact Signals. Retrieve signal events for a list of contacts - job changes and promotions. Billing: Charged per matched signal per result via the 'showSignalsContact' action. |
| `person.getContactSignalScores` | `lusha.api.person.getContactSignalScores` | `read` | Score Contacts by Signal Activity. Score contacts by their active buying signals. Billing: 1 credit is charged per scored row via 'signal_score_contact_reveal'. This action is currently limited-availability - while it isn't yet seeded on an account's pricebook, the endpoint stays free ('billing.creditsCharged' is '0'). |
| `person.getContactSignalTypes` | `lusha.api.person.getContactSignalTypes` | `read` | Get Contact Signal Types. Returns the full list of supported signal types for contacts. |
| `person.prospectContacts` | `lusha.api.person.prospectContacts` | `read` | Prospecting Contacts. Search for contacts that match your Ideal Customer Profile using rich filter criteria. Billing: Charged per result via 'api_search'. If signals are requested, an additional charge applies per matched signal per result. |
| `person.searchAndEnrichContacts` | `lusha.api.person.searchAndEnrichContacts` | `read` | Search up to 100 contacts by email, LinkedIn URL or name plus company and return their full enriched records in one call. Charges credits per result and per revealed field. |
| `person.searchContacts` | `lusha.api.person.searchContacts` | `read` | Look up up to 100 contacts by id, LinkedIn URL, email, or name plus company, and get previews that say which data points exist and what revealing them costs. Charges credits per matched result. |
| `subscriptions.create` | `lusha.api.subscriptions.create` | `destructive` | Create Subscription. Creates one or more webhook subscriptions for real-time signal notifications. Billing: Lusha charges credits for each signal it delivers to a subscription. Needs an account webhook secret, set in the Lusha dashboard. The secret is never returned here. |
| `subscriptions.createOptOut` | `lusha.api.subscriptions.createOptOut` | `write` | Create Opt-Out Subscription. Subscribe to real-time notifications when a contact opts out of data processing. Needs an account webhook secret, set in the Lusha dashboard. |
| `subscriptions.delete` | `lusha.api.subscriptions.delete` | `destructive` | Delete Subscriptions. Delete one or more webhook subscriptions. Deletes 1 to 25 subscriptions; this cannot be undone. |
| `subscriptions.get` | `lusha.api.subscriptions.get` | `read` | Get Subscription by ID. Returns a single webhook subscription by ID. |
| `subscriptions.list` | `lusha.api.subscriptions.list` | `read` | List Subscriptions. Returns all webhook subscriptions for your account with pagination support. |
| `subscriptions.test` | `lusha.api.subscriptions.test` | `write` | Test Subscription. Test a webhook subscription by sending a test signal. Billing: test deliveries are free. |
| `subscriptions.update` | `lusha.api.subscriptions.update` | `write` | Update Subscription. Updates an existing webhook subscription. Setting isActive true reactivates a subscription that was disabled after failed deliveries; active subscriptions are charged per delivered signal. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lusha

## License

Apache-2.0
