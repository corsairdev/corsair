# @corsair-dev/pipedrive

Pipedrive API plugin for Corsair with **365 operations** covering every business operation in the current official v1 and v2 OpenAPI contracts that is outside Corsair's OAuth lifecycle and unrequested webhook surfaces. Operations include deals, contacts, activities, projects, files, mail, leads, users, roles, search, products, and account settings.

## Install

```bash
pnpm add @corsair-dev/pipedrive
```

## Authentication

Configure an API token or OAuth 2.0 credentials. Pipedrive accepts API tokens in the `x-api-token` header and OAuth access tokens as Bearer authorization. OAuth access tokens are refreshed automatically through Pipedrive's documented token endpoint; refresh requires the integration's client ID and secret plus the account's refresh token. OAuth is configured with the complete set of scopes required to expose the full API surface, including `admin`, mail, messenger, phone-integration and video-call scopes. This is intentionally broad; prefer an API token or a separately scoped OAuth app when an installation should have less access. Every catalog operation also has an operation-specific Zod input/output schema. Product image and file/audio uploads accept the documented multipart fields and runtime `Blob`/`File` values.

## Existing convenience operations

| Operation | Method and path | Risk / token cost | OAuth scopes | Official reference |
| --- | --- | --- | --- | --- |
| `deals.list` | `GET /api/v2/deals` | Read · 10 tokens | `deals:read` or `deals:full` | [Get all deals](https://developers.pipedrive.com/docs/api/v1/Deals#getDeals) |
| `deals.get` | `GET /api/v2/deals/{id}` | Read · 1 token | `deals:read` or `deals:full` | [Get deal](https://developers.pipedrive.com/docs/api/v1/Deals#getDeal) |
| `deals.create` | `POST /api/v2/deals` | Write · 5 tokens | `deals:full` | [Add deal](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal) |
| `deals.update` | `PATCH /api/v2/deals/{id}` | Write · 5 tokens | `deals:full` | [Update deal](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal) |
| `deals.delete` | `DELETE /api/v2/deals/{id}` | Destructive · 3 tokens | `deals:full` | [Delete deal](https://developers.pipedrive.com/docs/api/v1/Deals#deleteDeal) |
| `persons.list` | `GET /api/v2/persons` | Read · 10 tokens | `contacts:read` or `contacts:full` | [Get all persons](https://developers.pipedrive.com/docs/api/v1/Persons#getPersons) |
| `persons.get` | `GET /api/v2/persons/{id}` | Read · 1 token | `contacts:read` or `contacts:full` | [Get person](https://developers.pipedrive.com/docs/api/v1/Persons#getPerson) |
| `persons.create` | `POST /api/v2/persons` | Write · 5 tokens | `contacts:full` | [Add person](https://developers.pipedrive.com/docs/api/v1/Persons#addPerson) |
| `persons.update` | `PATCH /api/v2/persons/{id}` | Write · 5 tokens | `contacts:full` | [Update person](https://developers.pipedrive.com/docs/api/v1/Persons#updatePerson) |
| `persons.delete` | `DELETE /api/v2/persons/{id}` | Destructive · 3 tokens | `contacts:full` | [Delete person](https://developers.pipedrive.com/docs/api/v1/Persons#deletePerson) |
| `organizations.list` | `GET /api/v2/organizations` | Read · 10 tokens | `contacts:read` or `contacts:full` | [Get all organizations](https://developers.pipedrive.com/docs/api/v1/Organizations#getOrganizations) |
| `organizations.get` | `GET /api/v2/organizations/{id}` | Read · 1 token | `contacts:read` or `contacts:full` | [Get organization](https://developers.pipedrive.com/docs/api/v1/Organizations#getOrganization) |
| `organizations.create` | `POST /api/v2/organizations` | Write · 5 tokens | `contacts:full` | [Add organization](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization) |
| `organizations.update` | `PATCH /api/v2/organizations/{id}` | Write · 5 tokens | `contacts:full` | [Update organization](https://developers.pipedrive.com/docs/api/v1/Organizations#updateOrganization) |
| `organizations.delete` | `DELETE /api/v2/organizations/{id}` | Destructive · 3 tokens | `contacts:full` | [Delete organization](https://developers.pipedrive.com/docs/api/v1/Organizations#deleteOrganization) |
| `activities.list` | `GET /api/v2/activities` | Read · 10 tokens | `activities:read` or `activities:full` | [Get all activities](https://developers.pipedrive.com/docs/api/v1/Activities#getActivities) |
| `activities.get` | `GET /api/v2/activities/{id}` | Read · 1 token | `activities:read` or `activities:full` | [Get activity](https://developers.pipedrive.com/docs/api/v1/Activities#getActivity) |
| `activities.create` | `POST /api/v2/activities` | Destructive (attendee invitations) · 5 tokens | `activities:full` | [Add activity](https://developers.pipedrive.com/docs/api/v1/Activities#addActivity) |
| `activities.update` | `PATCH /api/v2/activities/{id}` | Destructive (attendee invitations) · 5 tokens | `activities:full` | [Update activity](https://developers.pipedrive.com/docs/api/v1/Activities#updateActivity) |
| `activities.delete` | `DELETE /api/v2/activities/{id}` | Destructive · 3 tokens | `activities:full` | [Delete activity](https://developers.pipedrive.com/docs/api/v1/Activities#deleteActivity) |
| `tasks.list` | `GET /api/v2/tasks` | Read · 10 tokens | `projects:read` or `projects:full` | [Get all tasks](https://developers.pipedrive.com/docs/api/v1/Tasks#getTasks) |
| `tasks.get` | `GET /api/v2/tasks/{id}` | Read · 1 token | `projects:read` or `projects:full` | [Get task](https://developers.pipedrive.com/docs/api/v1/Tasks#getTask) |
| `tasks.create` | `POST /api/v2/tasks` | Write · 5 tokens | `projects:full` | [Add task](https://developers.pipedrive.com/docs/api/v1/Tasks#addTask) |
| `tasks.update` | `PATCH /api/v2/tasks/{id}` | Write · 5 tokens | `projects:full` | [Update task](https://developers.pipedrive.com/docs/api/v1/Tasks#updateTask) |
| `tasks.delete` | `DELETE /api/v2/tasks/{id}` | Destructive · 3 tokens | `projects:full` | [Delete task](https://developers.pipedrive.com/docs/api/v1/Tasks#deleteTask) |
| `products.list` | `GET /api/v2/products` | Read · 10 tokens | `products:read` or `products:full` | [Get products](https://developers.pipedrive.com/docs/api/v1/Products#getProducts) |
| `products.create` | `POST /api/v2/products` | Write · 5 tokens | `products:full` | [Add product](https://developers.pipedrive.com/docs/api/v1/Products#addProduct) |
| `products.search` | `GET /api/v2/products/search` | Read · 20 tokens | `products:read`, `products:full`, or `search:read` | [Search products](https://developers.pipedrive.com/docs/api/v1/Products#searchProducts) |
| `products.get` | `GET /api/v2/products/{id}` | Read · 1 token | `products:read` or `products:full` | [Get product](https://developers.pipedrive.com/docs/api/v1/Products#getProduct) |
| `products.update` | `PATCH /api/v2/products/{id}` | Write · 5 tokens | `products:full` | [Update product](https://developers.pipedrive.com/docs/api/v1/Products#updateProduct) |
| `products.delete` | `DELETE /api/v2/products/{id}` | Destructive · 3 tokens | `products:full` | [Delete product](https://developers.pipedrive.com/docs/api/v1/Products#deleteProduct) |
| `products.duplicate` | `POST /api/v2/products/{id}/duplicate` | Write · 5 tokens | `products:full` | [Duplicate product](https://developers.pipedrive.com/docs/api/v1/Products#duplicateProduct) |
| `products.variations.list` | `GET /api/v2/products/{id}/variations` | Read · 10 tokens | `products:read` or `products:full` | [Get product variations](https://developers.pipedrive.com/docs/api/v1/Products#getProductVariations) |
| `products.variations.create` | `POST /api/v2/products/{id}/variations` | Write · 5 tokens | `products:full` | [Add product variation](https://developers.pipedrive.com/docs/api/v1/Products#addProductVariation) |
| `products.variations.update` | `PATCH /api/v2/products/{id}/variations/{product_variation_id}` | Write · 5 tokens | `products:full` | [Update product variation](https://developers.pipedrive.com/docs/api/v1/Products#updateProductVariation) |
| `products.variations.delete` | `DELETE /api/v2/products/{id}/variations/{product_variation_id}` | Destructive · 3 tokens | `products:full` | [Delete product variation](https://developers.pipedrive.com/docs/api/v1/Products#deleteProductVariation) |
| `products.images.get` | `GET /api/v2/products/{id}/images` | Read · 10 tokens | `products:read` or `products:full` | [Get product image](https://developers.pipedrive.com/docs/api/v1/Products#getProductImage) |
| `products.images.upload` | `POST /api/v2/products/{id}/images` | Write · 20 tokens | `products:full` | [Upload product image](https://developers.pipedrive.com/docs/api/v1/Products#uploadProductImage) |
| `products.images.update` | `PUT /api/v2/products/{id}/images` | Write · 20 tokens | `products:full` | [Update product image](https://developers.pipedrive.com/docs/api/v1/Products#updateProductImage) |
| `products.images.delete` | `DELETE /api/v2/products/{id}/images` | Destructive · 6 tokens | `products:full` | [Delete product image](https://developers.pipedrive.com/docs/api/v1/Products#deleteProductImage) |
| `products.followers.list` | `GET /api/v2/products/{id}/followers` | Read · 10 tokens | `products:read` or `products:full` | [Get product followers](https://developers.pipedrive.com/docs/api/v1/Products#getProductFollowers) |
| `products.followers.create` | `POST /api/v2/products/{id}/followers` | Write · 5 tokens | `products:full` | [Add product follower](https://developers.pipedrive.com/docs/api/v1/Products#addProductFollower) |
| `products.followers.changelog` | `GET /api/v2/products/{id}/followers/changelog` | Read · 10 tokens | `products:read` or `products:full` | [Get follower changelog](https://developers.pipedrive.com/docs/api/v1/Products#getProductFollowersChangelog) |
| `products.followers.delete` | `DELETE /api/v2/products/{id}/followers/{follower_id}` | Destructive · 3 tokens | `products:full` | [Delete product follower](https://developers.pipedrive.com/docs/api/v1/Products#deleteProductFollower) |

Deal, person, organization, activity, and task list endpoints support their documented filters, maximum page size of 500, and opaque cursor pagination through `additional_data.next_cursor`; array query parameters are comma-separated where documented. Activity person assignment uses `participants` with a primary participant, not a `person_id` body field. Task request `done` and `milestone` flags are integers (`0` or `1`), whereas response fields are booleans. Task endpoints are marked beta in Pipedrive's API reference. Task create requires `title` and `project_id`; `assignee_ids` accepts up to 10 user IDs. Person `emails`, `phones`, and custom field values, organization address and custom field values, and activity notes/attendees are sent only to Pipedrive; event logs include no customer values. Organization custom fields are arbitrary provider-defined JSON. Person `im`, `postal_address`, `notes`, `birthday`, and `job_title` fields require contact sync to be enabled by the Pipedrive company, or Pipedrive may return 403. The `marketing_status` field depends on the company's Campaigns product and has documented transition restrictions.
Deal, person, organization, activity, task, product, product variation, and product follower list endpoints support their documented cursor pagination through `additional_data.next_cursor`; product lists and variations have a maximum page size of 500, product search has a maximum of 100, and follower lists have a maximum of 500. Array query parameters are comma-separated where documented. Activity person assignment uses `participants` with a primary participant, not a `person_id` body field. Task request `done` and `milestone` flags are integers (`0` or `1`), whereas response fields are booleans. Task endpoints are marked beta in Pipedrive's API reference. Task create requires `title` and `project_id`; `assignee_ids` accepts up to 10 user IDs. Product image upload/update take a `Blob` and send it as the documented multipart `data` binary field; image get returns metadata and a public URL (not image bytes) whose lifetime is documented as 7 days. Product deletion is permanent after 30 days. Product duplicate includes variations, prices, and custom fields. Product create requires a non-empty name; product variation create requires a name of at most 255 characters. Each supplied product price requires `price` and `currency`; billing-frequency fields are available on Growth and above, with cycles from 1 to 208 when non-null. Product search terms must have at least two characters unless exact matching is enabled; its burst rate limit is 10 requests per 2-second window, regardless of plan or authentication type. Pipedrive's documented burst-reset `x-ratelimit-reset` is honored by the shared client; a 429 without that reset is not retried because daily token-budget exhaustion remains blocked until its daily reset. Person `emails`, `phones`, and custom field values, organization address and custom field values, and activity notes/attendees are sent only to Pipedrive; event logs include no customer values. Product custom field values are arbitrary account-defined JSON. Organization custom fields are arbitrary provider-defined JSON. Person `im`, `postal_address`, `notes`, `birthday`, and `job_title` fields require contact sync to be enabled by the Pipedrive company, or Pipedrive may return 403. The `marketing_status` field depends on the company's Campaigns product and has documented transition restrictions.

Pipedrive also applies daily token budgets and per-token burst limits. The client captures `x-ratelimit-reset`; only a 429 with that documented burst reset is retried once. A 429 without a reset is not retried because daily token-budget exhaustion remains blocked until reset. See [Pipedrive rate limiting](https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting).

For `apiV1.mailbox.updateMailThreadDetails`, explicit `null` values for the nullable `deal_id` and `lead_id` form fields are sent as empty fields (`deal_id=` / `lead_id=`); omitted properties remain omitted. File downloads use manual redirect handling: credentials go only to HTTPS `*.pipedrive.com` origins. Pipedrive answers a download with a 302 to presigned storage (S3), which is fetched over HTTPS with no token or other request headers; non-HTTPS redirects are rejected.

## Official v1 and v2 route catalog

The following inventory covers the additional 321 operations, one row per versioned method/path. Together with the 44 convenience operations above, the plugin implements 365 of the 371 operations in Pipedrive's published OpenAPI contracts. The `apiV1` and `apiV2` namespaces preserve the provider's version-specific path, method, parameters, request media type, and response contract; optional groups are nested under `query`, path identifiers under `path`, and request bodies under `body`.

<!-- PIPEDRIVE_CATALOG_START -->

| Corsair operation | Provider route | API-token cost | OAuth scope(s) | Official reference |
| --- | --- | ---: | --- | --- |
| `apiV1.activityFields.getActivityFields` | `GET https://api.pipedrive.com/v1/activityFields` | 20 | `activities:read`, `activities:full` | [ActivityFields](https://developers.pipedrive.com/docs/api/v1/ActivityFields) |
| `apiV1.activityTypes.getActivityTypes` | `GET https://api.pipedrive.com/v1/activityTypes` | 20 | `activities:read`, `activities:full`, `admin` | [ActivityTypes](https://developers.pipedrive.com/docs/api/v1/ActivityTypes) |
| `apiV1.activityTypes.addActivityType` | `POST https://api.pipedrive.com/v1/activityTypes` | 10 | `admin` | [ActivityTypes](https://developers.pipedrive.com/docs/api/v1/ActivityTypes) |
| `apiV1.activityTypes.deleteActivityType` | `DELETE https://api.pipedrive.com/v1/activityTypes/{id}` | 6 | `admin` | [ActivityTypes](https://developers.pipedrive.com/docs/api/v1/ActivityTypes) |
| `apiV1.activityTypes.updateActivityType` | `PUT https://api.pipedrive.com/v1/activityTypes/{id}` | 10 | `admin` | [ActivityTypes](https://developers.pipedrive.com/docs/api/v1/ActivityTypes) |
| `apiV1.billing.getCompanyAddons` | `GET https://api.pipedrive.com/v1/billing/subscriptions/addons` | 20 | `users:read` | [Billing](https://developers.pipedrive.com/docs/api/v1/Billing) |
| `apiV1.callLogs.addCallLog` | `POST https://api.pipedrive.com/v1/callLogs` | 10 | `phone-integration` | [CallLogs](https://developers.pipedrive.com/docs/api/v1/CallLogs) |
| `apiV1.callLogs.getUserCallLogs` | `GET https://api.pipedrive.com/v1/callLogs` | 20 | `phone-integration` | [CallLogs](https://developers.pipedrive.com/docs/api/v1/CallLogs) |
| `apiV1.callLogs.deleteCallLog` | `DELETE https://api.pipedrive.com/v1/callLogs/{id}` | 6 | `phone-integration` | [CallLogs](https://developers.pipedrive.com/docs/api/v1/CallLogs) |
| `apiV1.callLogs.getCallLog` | `GET https://api.pipedrive.com/v1/callLogs/{id}` | 2 | `phone-integration` | [CallLogs](https://developers.pipedrive.com/docs/api/v1/CallLogs) |
| `apiV1.callLogs.addCallLogAudioFile` | `POST https://api.pipedrive.com/v1/callLogs/{id}/recordings` | 10 | `phone-integration` | [CallLogs](https://developers.pipedrive.com/docs/api/v1/CallLogs) |
| `apiV1.channels.addChannel` | `POST https://api.pipedrive.com/v1/channels` | 10 | `messengers-integration` | [Channels](https://developers.pipedrive.com/docs/api/v1/Channels) |
| `apiV1.channels.deleteChannel` | `DELETE https://api.pipedrive.com/v1/channels/{id}` | 6 | `messengers-integration` | [Channels](https://developers.pipedrive.com/docs/api/v1/Channels) |
| `apiV1.channels.receiveMessage` | `POST https://api.pipedrive.com/v1/channels/messages/receive` | 10 | `messengers-integration` | [Channels](https://developers.pipedrive.com/docs/api/v1/Channels) |
| `apiV1.channels.deleteConversation` | `DELETE https://api.pipedrive.com/v1/channels/{channel-id}/conversations/{conversation-id}` | 6 | `messengers-integration` | [Channels](https://developers.pipedrive.com/docs/api/v1/Channels) |
| `apiV1.currencies.getCurrencies` | `GET https://api.pipedrive.com/v1/currencies` | 20 | `base` | [Currencies](https://developers.pipedrive.com/docs/api/v1/Currencies) |
| `apiV1.deals.getArchivedDeals` | `GET https://api.pipedrive.com/v1/deals/archived` | 40 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealsSummary` | `GET https://api.pipedrive.com/v1/deals/summary` | 40 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getArchivedDealsSummary` | `GET https://api.pipedrive.com/v1/deals/summary/archived` | 80 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealsTimeline` | `GET https://api.pipedrive.com/v1/deals/timeline` | 20 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getArchivedDealsTimeline` | `GET https://api.pipedrive.com/v1/deals/timeline/archived` | 40 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealChangelog` | `GET https://api.pipedrive.com/v1/deals/{id}/changelog` | 20 | `recents:read` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.duplicateDeal` | `POST https://api.pipedrive.com/v1/deals/{id}/duplicate` | 10 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealFiles` | `GET https://api.pipedrive.com/v1/deals/{id}/files` | 20 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealUpdates` | `GET https://api.pipedrive.com/v1/deals/{id}/flow` | 40 | `recents:read` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealParticipantsChangelog` | `GET https://api.pipedrive.com/v1/deals/{id}/participantsChangelog` | 10 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealFollowers` | `GET https://api.pipedrive.com/v1/deals/{id}/followers` | 20 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.addDealFollower` | `POST https://api.pipedrive.com/v1/deals/{id}/followers` | 10 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.deleteDealFollower` | `DELETE https://api.pipedrive.com/v1/deals/{id}/followers/{follower_id}` | 6 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealMailMessages` | `GET https://api.pipedrive.com/v1/deals/{id}/mailMessages` | 20 | `mail:read`, `mail:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.mergeDeals` | `PUT https://api.pipedrive.com/v1/deals/{id}/merge` | 40 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealParticipants` | `GET https://api.pipedrive.com/v1/deals/{id}/participants` | 10 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.addDealParticipant` | `POST https://api.pipedrive.com/v1/deals/{id}/participants` | 10 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.deleteDealParticipant` | `DELETE https://api.pipedrive.com/v1/deals/{id}/participants/{deal_participant_id}` | 6 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.deals.getDealUsers` | `GET https://api.pipedrive.com/v1/deals/{id}/permittedUsers` | 10 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV1.dealFields.getDealFields` | `GET https://api.pipedrive.com/v1/dealFields` | 20 | `deals:read`, `deals:full`, `deal-fields:full`, `admin` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV1.dealFields.addDealField` | `POST https://api.pipedrive.com/v1/dealFields` | 10 | `deal-fields:full`, `admin` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV1.dealFields.deleteDealFields` | `DELETE https://api.pipedrive.com/v1/dealFields` | 10 | `deal-fields:full`, `admin` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV1.dealFields.getDealField` | `GET https://api.pipedrive.com/v1/dealFields/{id}` | 2 | `deals:read`, `deals:full`, `deal-fields:full`, `admin` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV1.dealFields.deleteDealField` | `DELETE https://api.pipedrive.com/v1/dealFields/{id}` | 6 | `deal-fields:full`, `admin` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV1.dealFields.updateDealField` | `PUT https://api.pipedrive.com/v1/dealFields/{id}` | 10 | `deal-fields:full`, `admin` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV1.files.getFiles` | `GET https://api.pipedrive.com/v1/files` | 20 | `deals:read`, `deals:full`, `activities:read`, `activities:full`, `contacts:read`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.addFile` | `POST https://api.pipedrive.com/v1/files` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.addFileAndLinkIt` | `POST https://api.pipedrive.com/v1/files/remote` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.linkFileToItem` | `POST https://api.pipedrive.com/v1/files/remoteLink` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.deleteFile` | `DELETE https://api.pipedrive.com/v1/files/{id}` | 6 | `deals:full`, `activities:full`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.getFile` | `GET https://api.pipedrive.com/v1/files/{id}` | 2 | `deals:read`, `deals:full`, `activities:read`, `activities:full`, `contacts:read`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.updateFile` | `PUT https://api.pipedrive.com/v1/files/{id}` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.files.downloadFile` | `GET https://api.pipedrive.com/v1/files/{id}/download` | 20 | `deals:read`, `deals:full`, `activities:read`, `activities:full`, `contacts:read`, `contacts:full` | [Files](https://developers.pipedrive.com/docs/api/v1/Files) |
| `apiV1.filters.deleteFilters` | `DELETE https://api.pipedrive.com/v1/filters` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.filters.getFilters` | `GET https://api.pipedrive.com/v1/filters` | 20 | `deals:read`, `deals:full`, `activities:read`, `activities:full`, `contacts:read`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.filters.addFilter` | `POST https://api.pipedrive.com/v1/filters` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.filters.getFilterHelpers` | `GET https://api.pipedrive.com/v1/filters/helpers` | 20 | `deals:read`, `deals:full`, `activities:read`, `activities:full`, `contacts:read`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.filters.deleteFilter` | `DELETE https://api.pipedrive.com/v1/filters/{id}` | 6 | `deals:full`, `activities:full`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.filters.getFilter` | `GET https://api.pipedrive.com/v1/filters/{id}` | 2 | `deals:read`, `deals:full`, `activities:read`, `activities:full`, `contacts:read`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.filters.updateFilter` | `PUT https://api.pipedrive.com/v1/filters/{id}` | 10 | `deals:full`, `activities:full`, `contacts:full` | [Filters](https://developers.pipedrive.com/docs/api/v1/Filters) |
| `apiV1.goals.addGoal` | `POST https://api.pipedrive.com/v1/goals` | 10 | `goals:full` | [Goals](https://developers.pipedrive.com/docs/api/v1/Goals) |
| `apiV1.goals.getGoals` | `GET https://api.pipedrive.com/v1/goals/find` | 20 | `goals:read`, `goals:full` | [Goals](https://developers.pipedrive.com/docs/api/v1/Goals) |
| `apiV1.goals.updateGoal` | `PUT https://api.pipedrive.com/v1/goals/{id}` | 10 | `goals:full` | [Goals](https://developers.pipedrive.com/docs/api/v1/Goals) |
| `apiV1.goals.deleteGoal` | `DELETE https://api.pipedrive.com/v1/goals/{id}` | 6 | `goals:full` | [Goals](https://developers.pipedrive.com/docs/api/v1/Goals) |
| `apiV1.goals.getGoalResult` | `GET https://api.pipedrive.com/v1/goals/{id}/results` | 20 | `goals:read`, `goals:full` | [Goals](https://developers.pipedrive.com/docs/api/v1/Goals) |
| `apiV1.leads.getLeads` | `GET https://api.pipedrive.com/v1/leads` | 20 | `leads:read`, `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.addLead` | `POST https://api.pipedrive.com/v1/leads` | 10 | `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.getArchivedLeads` | `GET https://api.pipedrive.com/v1/leads/archived` | 40 | `leads:read`, `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.getLead` | `GET https://api.pipedrive.com/v1/leads/{id}` | 2 | `leads:read`, `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.updateLead` | `PATCH https://api.pipedrive.com/v1/leads/{id}` | 10 | `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.deleteLead` | `DELETE https://api.pipedrive.com/v1/leads/{id}` | 6 | `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.getLeadUsers` | `GET https://api.pipedrive.com/v1/leads/{id}/permittedUsers` | 10 | `leads:read`, `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leads.searchLeads` | `GET https://api.pipedrive.com/v1/leads/search` | 40 | `leads:read`, `leads:full`, `search:read` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV1.leadFields.getLeadFields` | `GET https://api.pipedrive.com/v1/leadFields` | 20 | `leads:read`, `leads:full`, `admin` | [LeadFields](https://developers.pipedrive.com/docs/api/v1/LeadFields) |
| `apiV1.leadLabels.getLeadLabels` | `GET https://api.pipedrive.com/v1/leadLabels` | 10 | `leads:read`, `leads:full` | [LeadLabels](https://developers.pipedrive.com/docs/api/v1/LeadLabels) |
| `apiV1.leadLabels.addLeadLabel` | `POST https://api.pipedrive.com/v1/leadLabels` | 10 | `leads:full` | [LeadLabels](https://developers.pipedrive.com/docs/api/v1/LeadLabels) |
| `apiV1.leadLabels.updateLeadLabel` | `PATCH https://api.pipedrive.com/v1/leadLabels/{id}` | 10 | `leads:full` | [LeadLabels](https://developers.pipedrive.com/docs/api/v1/LeadLabels) |
| `apiV1.leadLabels.deleteLeadLabel` | `DELETE https://api.pipedrive.com/v1/leadLabels/{id}` | 6 | `leads:full` | [LeadLabels](https://developers.pipedrive.com/docs/api/v1/LeadLabels) |
| `apiV1.leadSources.getLeadSources` | `GET https://api.pipedrive.com/v1/leadSources` | 2 | `leads:read`, `leads:full` | [LeadSources](https://developers.pipedrive.com/docs/api/v1/LeadSources) |
| `apiV1.legacyTeams.getTeams` | `GET https://api.pipedrive.com/v1/legacyTeams` | 20 | `users:read` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.addTeam` | `POST https://api.pipedrive.com/v1/legacyTeams` | 10 | `admin` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.getTeam` | `GET https://api.pipedrive.com/v1/legacyTeams/{id}` | 2 | `users:read` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.updateTeam` | `PUT https://api.pipedrive.com/v1/legacyTeams/{id}` | 10 | `admin` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.getTeamUsers` | `GET https://api.pipedrive.com/v1/legacyTeams/{id}/users` | 20 | `users:read` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.addTeamUser` | `POST https://api.pipedrive.com/v1/legacyTeams/{id}/users` | 10 | `admin` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.deleteTeamUser` | `DELETE https://api.pipedrive.com/v1/legacyTeams/{id}/users` | 10 | `admin` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.legacyTeams.getUserTeams` | `GET https://api.pipedrive.com/v1/legacyTeams/user/{id}` | 20 | `users:read` | [LegacyTeams](https://developers.pipedrive.com/docs/api/v1/LegacyTeams) |
| `apiV1.mailbox.getMailMessage` | `GET https://api.pipedrive.com/v1/mailbox/mailMessages/{id}` | 2 | `mail:read`, `mail:full` | [Mailbox](https://developers.pipedrive.com/docs/api/v1/Mailbox) |
| `apiV1.mailbox.getMailThreads` | `GET https://api.pipedrive.com/v1/mailbox/mailThreads` | 20 | `mail:read`, `mail:full` | [Mailbox](https://developers.pipedrive.com/docs/api/v1/Mailbox) |
| `apiV1.mailbox.deleteMailThread` | `DELETE https://api.pipedrive.com/v1/mailbox/mailThreads/{id}` | 6 | `mail:full` | [Mailbox](https://developers.pipedrive.com/docs/api/v1/Mailbox) |
| `apiV1.mailbox.getMailThread` | `GET https://api.pipedrive.com/v1/mailbox/mailThreads/{id}` | 20 | `mail:read`, `mail:full` | [Mailbox](https://developers.pipedrive.com/docs/api/v1/Mailbox) |
| `apiV1.mailbox.updateMailThreadDetails` | `PUT https://api.pipedrive.com/v1/mailbox/mailThreads/{id}` | 10 | `mail:full` | [Mailbox](https://developers.pipedrive.com/docs/api/v1/Mailbox) |
| `apiV1.mailbox.getMailThreadMessages` | `GET https://api.pipedrive.com/v1/mailbox/mailThreads/{id}/mailMessages` | 20 | `mail:read`, `mail:full` | [Mailbox](https://developers.pipedrive.com/docs/api/v1/Mailbox) |
| `apiV1.meetings.saveUserProviderLink` | `POST https://api.pipedrive.com/v1/meetings/userProviderLinks` | 10 | `video-calls` | [Meetings](https://developers.pipedrive.com/docs/api/v1/Meetings) |
| `apiV1.meetings.deleteUserProviderLink` | `DELETE https://api.pipedrive.com/v1/meetings/userProviderLinks/{id}` | 6 | `video-calls` | [Meetings](https://developers.pipedrive.com/docs/api/v1/Meetings) |
| `apiV1.notes.getNotes` | `GET https://api.pipedrive.com/v1/notes` | 20 | `deals:read`, `deals:full`, `contacts:read`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.addNote` | `POST https://api.pipedrive.com/v1/notes` | 10 | `deals:full`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.deleteNote` | `DELETE https://api.pipedrive.com/v1/notes/{id}` | 6 | `deals:full`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.getNote` | `GET https://api.pipedrive.com/v1/notes/{id}` | 2 | `deals:read`, `deals:full`, `contacts:read`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.updateNote` | `PUT https://api.pipedrive.com/v1/notes/{id}` | 10 | `deals:full`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.getNoteComments` | `GET https://api.pipedrive.com/v1/notes/{id}/comments` | 20 | `deals:read`, `deals:full`, `contacts:read`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.addNoteComment` | `POST https://api.pipedrive.com/v1/notes/{id}/comments` | 10 | `deals:full`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.getComment` | `GET https://api.pipedrive.com/v1/notes/{id}/comments/{commentId}` | 2 | `deals:read`, `deals:full`, `contacts:read`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.updateCommentForNote` | `PUT https://api.pipedrive.com/v1/notes/{id}/comments/{commentId}` | 10 | `deals:full`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.notes.deleteComment` | `DELETE https://api.pipedrive.com/v1/notes/{id}/comments/{commentId}` | 6 | `deals:full`, `contacts:full` | [Notes](https://developers.pipedrive.com/docs/api/v1/Notes) |
| `apiV1.noteFields.getNoteFields` | `GET https://api.pipedrive.com/v1/noteFields` | 20 | `deals:read`, `deals:full`, `contacts:read`, `contacts:full` | [NoteFields](https://developers.pipedrive.com/docs/api/v1/NoteFields) |
| `apiV1.organizations.getOrganizationChangelog` | `GET https://api.pipedrive.com/v1/organizations/{id}/changelog` | 20 | `recents:read` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.getOrganizationFiles` | `GET https://api.pipedrive.com/v1/organizations/{id}/files` | 20 | `contacts:read`, `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.getOrganizationUpdates` | `GET https://api.pipedrive.com/v1/organizations/{id}/flow` | 40 | `recents:read` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.getOrganizationFollowers` | `GET https://api.pipedrive.com/v1/organizations/{id}/followers` | 20 | `contacts:read`, `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.addOrganizationFollower` | `POST https://api.pipedrive.com/v1/organizations/{id}/followers` | 10 | `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.deleteOrganizationFollower` | `DELETE https://api.pipedrive.com/v1/organizations/{id}/followers/{follower_id}` | 6 | `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.getOrganizationMailMessages` | `GET https://api.pipedrive.com/v1/organizations/{id}/mailMessages` | 20 | `mail:read`, `mail:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.mergeOrganizations` | `PUT https://api.pipedrive.com/v1/organizations/{id}/merge` | 40 | `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizations.getOrganizationUsers` | `GET https://api.pipedrive.com/v1/organizations/{id}/permittedUsers` | 10 | `contacts:read`, `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV1.organizationFields.getOrganizationFields` | `GET https://api.pipedrive.com/v1/organizationFields` | 20 | `contacts:read`, `contacts:full`, `contact-fields:full`, `admin` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV1.organizationFields.addOrganizationField` | `POST https://api.pipedrive.com/v1/organizationFields` | 10 | `contact-fields:full`, `admin` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV1.organizationFields.deleteOrganizationFields` | `DELETE https://api.pipedrive.com/v1/organizationFields` | 10 | `contact-fields:full`, `admin` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV1.organizationFields.getOrganizationField` | `GET https://api.pipedrive.com/v1/organizationFields/{id}` | 2 | `contacts:read`, `contacts:full`, `contact-fields:full`, `admin` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV1.organizationFields.deleteOrganizationField` | `DELETE https://api.pipedrive.com/v1/organizationFields/{id}` | 6 | `contact-fields:full`, `admin` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV1.organizationFields.updateOrganizationField` | `PUT https://api.pipedrive.com/v1/organizationFields/{id}` | 10 | `contact-fields:full`, `admin` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV1.organizationRelationships.getOrganizationRelationships` | `GET https://api.pipedrive.com/v1/organizationRelationships` | 20 | `contacts:read`, `contacts:full` | [OrganizationRelationships](https://developers.pipedrive.com/docs/api/v1/OrganizationRelationships) |
| `apiV1.organizationRelationships.addOrganizationRelationship` | `POST https://api.pipedrive.com/v1/organizationRelationships` | 10 | `contacts:full` | [OrganizationRelationships](https://developers.pipedrive.com/docs/api/v1/OrganizationRelationships) |
| `apiV1.organizationRelationships.deleteOrganizationRelationship` | `DELETE https://api.pipedrive.com/v1/organizationRelationships/{id}` | 6 | `contacts:full` | [OrganizationRelationships](https://developers.pipedrive.com/docs/api/v1/OrganizationRelationships) |
| `apiV1.organizationRelationships.getOrganizationRelationship` | `GET https://api.pipedrive.com/v1/organizationRelationships/{id}` | 2 | `contacts:read`, `contacts:full` | [OrganizationRelationships](https://developers.pipedrive.com/docs/api/v1/OrganizationRelationships) |
| `apiV1.organizationRelationships.updateOrganizationRelationship` | `PUT https://api.pipedrive.com/v1/organizationRelationships/{id}` | 10 | `contacts:full` | [OrganizationRelationships](https://developers.pipedrive.com/docs/api/v1/OrganizationRelationships) |
| `apiV1.permissionSets.getPermissionSets` | `GET https://api.pipedrive.com/v1/permissionSets` | 20 | `admin` | [PermissionSets](https://developers.pipedrive.com/docs/api/v1/PermissionSets) |
| `apiV1.permissionSets.getPermissionSet` | `GET https://api.pipedrive.com/v1/permissionSets/{id}` | 2 | `admin` | [PermissionSets](https://developers.pipedrive.com/docs/api/v1/PermissionSets) |
| `apiV1.permissionSets.getPermissionSetAssignments` | `GET https://api.pipedrive.com/v1/permissionSets/{id}/assignments` | 20 | `admin` | [PermissionSets](https://developers.pipedrive.com/docs/api/v1/PermissionSets) |
| `apiV1.persons.getPersonChangelog` | `GET https://api.pipedrive.com/v1/persons/{id}/changelog` | 20 | `recents:read` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.getPersonFiles` | `GET https://api.pipedrive.com/v1/persons/{id}/files` | 20 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.getPersonUpdates` | `GET https://api.pipedrive.com/v1/persons/{id}/flow` | 40 | `recents:read` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.getPersonFollowers` | `GET https://api.pipedrive.com/v1/persons/{id}/followers` | 20 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.addPersonFollower` | `POST https://api.pipedrive.com/v1/persons/{id}/followers` | 10 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.deletePersonFollower` | `DELETE https://api.pipedrive.com/v1/persons/{id}/followers/{follower_id}` | 6 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.getPersonMailMessages` | `GET https://api.pipedrive.com/v1/persons/{id}/mailMessages` | 20 | `mail:read`, `mail:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.mergePersons` | `PUT https://api.pipedrive.com/v1/persons/{id}/merge` | 40 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.getPersonUsers` | `GET https://api.pipedrive.com/v1/persons/{id}/permittedUsers` | 10 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.deletePersonPicture` | `DELETE https://api.pipedrive.com/v1/persons/{id}/picture` | 6 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.addPersonPicture` | `POST https://api.pipedrive.com/v1/persons/{id}/picture` | 10 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.persons.getPersonProducts` | `GET https://api.pipedrive.com/v1/persons/{id}/products` | 20 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV1.personFields.getPersonFields` | `GET https://api.pipedrive.com/v1/personFields` | 20 | `contacts:read`, `contacts:full`, `contact-fields:full`, `admin` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV1.personFields.addPersonField` | `POST https://api.pipedrive.com/v1/personFields` | 10 | `contact-fields:full`, `admin` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV1.personFields.deletePersonFields` | `DELETE https://api.pipedrive.com/v1/personFields` | 10 | `contact-fields:full`, `admin` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV1.personFields.getPersonField` | `GET https://api.pipedrive.com/v1/personFields/{id}` | 2 | `contacts:read`, `contacts:full`, `contact-fields:full`, `admin` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV1.personFields.deletePersonField` | `DELETE https://api.pipedrive.com/v1/personFields/{id}` | 6 | `contact-fields:full`, `admin` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV1.personFields.updatePersonField` | `PUT https://api.pipedrive.com/v1/personFields/{id}` | 10 | `contact-fields:full`, `admin` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV1.pipelines.getPipelineConversionStatistics` | `GET https://api.pipedrive.com/v1/pipelines/{id}/conversion_statistics` | 40 | `deals:read`, `deals:full` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV1.pipelines.getPipelineDeals` | `GET https://api.pipedrive.com/v1/pipelines/{id}/deals` | 20 | `deals:read`, `deals:full` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV1.pipelines.getPipelineMovementStatistics` | `GET https://api.pipedrive.com/v1/pipelines/{id}/movement_statistics` | 40 | `deals:read`, `deals:full` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV1.products.getProductDeals` | `GET https://api.pipedrive.com/v1/products/{id}/deals` | 20 | `deals:read`, `deals:full` | [Products](https://developers.pipedrive.com/docs/api/v1/Products) |
| `apiV1.products.getProductFiles` | `GET https://api.pipedrive.com/v1/products/{id}/files` | 20 | `products:read`, `products:full` | [Products](https://developers.pipedrive.com/docs/api/v1/Products) |
| `apiV1.products.getProductFollowers` | `GET https://api.pipedrive.com/v1/products/{id}/followers` | 20 | `products:read`, `products:full` | [Products](https://developers.pipedrive.com/docs/api/v1/Products) |
| `apiV1.products.addProductFollower` | `POST https://api.pipedrive.com/v1/products/{id}/followers` | 10 | `products:full` | [Products](https://developers.pipedrive.com/docs/api/v1/Products) |
| `apiV1.products.deleteProductFollower` | `DELETE https://api.pipedrive.com/v1/products/{id}/followers/{follower_id}` | 6 | `products:full` | [Products](https://developers.pipedrive.com/docs/api/v1/Products) |
| `apiV1.products.getProductUsers` | `GET https://api.pipedrive.com/v1/products/{id}/permittedUsers` | 10 | `products:read`, `products:full` | [Products](https://developers.pipedrive.com/docs/api/v1/Products) |
| `apiV1.productFields.deleteProductFields` | `DELETE https://api.pipedrive.com/v1/productFields` | 10 | `product-fields:full`, `products:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV1.productFields.getProductFields` | `GET https://api.pipedrive.com/v1/productFields` | 20 | `products:read`, `product-fields:full`, `products:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV1.productFields.addProductField` | `POST https://api.pipedrive.com/v1/productFields` | 10 | `product-fields:full`, `products:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV1.productFields.deleteProductField` | `DELETE https://api.pipedrive.com/v1/productFields/{id}` | 6 | `product-fields:full`, `products:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV1.productFields.getProductField` | `GET https://api.pipedrive.com/v1/productFields/{id}` | 2 | `products:read`, `product-fields:full`, `products:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV1.productFields.updateProductField` | `PUT https://api.pipedrive.com/v1/productFields/{id}` | 10 | `product-fields:full`, `products:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV1.projects.getProjects` | `GET https://api.pipedrive.com/v1/projects` | 20 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.addProject` | `POST https://api.pipedrive.com/v1/projects` | 10 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.getProject` | `GET https://api.pipedrive.com/v1/projects/{id}` | 2 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.updateProject` | `PUT https://api.pipedrive.com/v1/projects/{id}` | 10 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.deleteProject` | `DELETE https://api.pipedrive.com/v1/projects/{id}` | 6 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.archiveProject` | `POST https://api.pipedrive.com/v1/projects/{id}/archive` | 10 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.getProjectPlan` | `GET https://api.pipedrive.com/v1/projects/{id}/plan` | 20 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.putProjectPlanActivity` | `PUT https://api.pipedrive.com/v1/projects/{id}/plan/activities/{activityId}` | 10 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.putProjectPlanTask` | `PUT https://api.pipedrive.com/v1/projects/{id}/plan/tasks/{taskId}` | 10 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.getProjectGroups` | `GET https://api.pipedrive.com/v1/projects/{id}/groups` | 20 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.getProjectTasks` | `GET https://api.pipedrive.com/v1/projects/{id}/tasks` | 20 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projects.getProjectActivities` | `GET https://api.pipedrive.com/v1/projects/{id}/activities` | 20 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV1.projectBoards.getProjectsBoards` | `GET https://api.pipedrive.com/v1/projects/boards` | 20 | `projects:read`, `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV1.projectBoards.getProjectsBoard` | `GET https://api.pipedrive.com/v1/projects/boards/{id}` | 2 | `projects:read`, `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV1.projectPhases.getProjectsPhases` | `GET https://api.pipedrive.com/v1/projects/phases` | 20 | `projects:read`, `projects:full` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV1.projectPhases.getProjectsPhase` | `GET https://api.pipedrive.com/v1/projects/phases/{id}` | 2 | `projects:read` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV1.projectTemplates.getProjectTemplates` | `GET https://api.pipedrive.com/v1/projectTemplates` | 20 | `projects:read`, `projects:full` | [ProjectTemplates](https://developers.pipedrive.com/docs/api/v1/ProjectTemplates) |
| `apiV1.projectTemplates.getProjectTemplate` | `GET https://api.pipedrive.com/v1/projectTemplates/{id}` | 2 | `projects:read`, `projects:full` | [ProjectTemplates](https://developers.pipedrive.com/docs/api/v1/ProjectTemplates) |
| `apiV1.recents.getRecents` | `GET https://api.pipedrive.com/v1/recents` | 20 | `recents:read`, `search:read` | [Recents](https://developers.pipedrive.com/docs/api/v1/Recents) |
| `apiV1.roles.getRoles` | `GET https://api.pipedrive.com/v1/roles` | 20 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.addRole` | `POST https://api.pipedrive.com/v1/roles` | 10 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.deleteRole` | `DELETE https://api.pipedrive.com/v1/roles/{id}` | 6 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.getRole` | `GET https://api.pipedrive.com/v1/roles/{id}` | 2 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.updateRole` | `PUT https://api.pipedrive.com/v1/roles/{id}` | 10 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.deleteRoleAssignment` | `DELETE https://api.pipedrive.com/v1/roles/{id}/assignments` | 6 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.getRoleAssignments` | `GET https://api.pipedrive.com/v1/roles/{id}/assignments` | 10 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.addRoleAssignment` | `POST https://api.pipedrive.com/v1/roles/{id}/assignments` | 10 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.getRoleSettings` | `GET https://api.pipedrive.com/v1/roles/{id}/settings` | 20 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.addOrUpdateRoleSetting` | `POST https://api.pipedrive.com/v1/roles/{id}/settings` | 10 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.getRolePipelines` | `GET https://api.pipedrive.com/v1/roles/{id}/pipelines` | 20 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.roles.updateRolePipelines` | `PUT https://api.pipedrive.com/v1/roles/{id}/pipelines` | 10 | `admin` | [Roles](https://developers.pipedrive.com/docs/api/v1/Roles) |
| `apiV1.stages.getStageDeals` | `GET https://api.pipedrive.com/v1/stages/{id}/deals` | 20 | `deals:read`, `deals:full` | [Stages](https://developers.pipedrive.com/docs/api/v1/Stages) |
| `apiV1.tasks.getTasks` | `GET https://api.pipedrive.com/v1/tasks` | 20 | `projects:read`, `projects:full` | [Tasks](https://developers.pipedrive.com/docs/api/v1/Tasks) |
| `apiV1.tasks.addTask` | `POST https://api.pipedrive.com/v1/tasks` | 10 | `projects:full` | [Tasks](https://developers.pipedrive.com/docs/api/v1/Tasks) |
| `apiV1.tasks.getTask` | `GET https://api.pipedrive.com/v1/tasks/{id}` | 2 | `projects:read`, `projects:full` | [Tasks](https://developers.pipedrive.com/docs/api/v1/Tasks) |
| `apiV1.tasks.updateTask` | `PUT https://api.pipedrive.com/v1/tasks/{id}` | 10 | `projects:full` | [Tasks](https://developers.pipedrive.com/docs/api/v1/Tasks) |
| `apiV1.tasks.deleteTask` | `DELETE https://api.pipedrive.com/v1/tasks/{id}` | 6 | `projects:full` | [Tasks](https://developers.pipedrive.com/docs/api/v1/Tasks) |
| `apiV1.users.getUsers` | `GET https://api.pipedrive.com/v1/users` | 20 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.addUser` | `POST https://api.pipedrive.com/v1/users` | 10 | `admin` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.findUsersByName` | `GET https://api.pipedrive.com/v1/users/find` | 40 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.getCurrentUser` | `GET https://api.pipedrive.com/v1/users/me` | 2 | `base` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.getUser` | `GET https://api.pipedrive.com/v1/users/{id}` | 2 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.updateUser` | `PUT https://api.pipedrive.com/v1/users/{id}` | 10 | `admin` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.getUserFollowers` | `GET https://api.pipedrive.com/v1/users/{id}/followers` | 20 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.getUserPermissions` | `GET https://api.pipedrive.com/v1/users/{id}/permissions` | 10 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.getUserRoleAssignments` | `GET https://api.pipedrive.com/v1/users/{id}/roleAssignments` | 10 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.users.getUserRoleSettings` | `GET https://api.pipedrive.com/v1/users/{id}/roleSettings` | 10 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
| `apiV1.userConnections.getUserConnections` | `GET https://api.pipedrive.com/v1/userConnections` | 20 | `base` | [UserConnections](https://developers.pipedrive.com/docs/api/v1/UserConnections) |
| `apiV1.userSettings.getUserSettings` | `GET https://api.pipedrive.com/v1/userSettings` | 2 | `base` | [UserSettings](https://developers.pipedrive.com/docs/api/v1/UserSettings) |
| `apiV2.activityFields.getActivityFields` | `GET https://api.pipedrive.com/api/v2/activityFields` | 10 | `admin` | [ActivityFields](https://developers.pipedrive.com/docs/api/v1/ActivityFields) |
| `apiV2.activityFields.getActivityField` | `GET https://api.pipedrive.com/api/v2/activityFields/{field_code}` | 1 | `admin` | [ActivityFields](https://developers.pipedrive.com/docs/api/v1/ActivityFields) |
| `apiV2.deals.getArchivedDeals` | `GET https://api.pipedrive.com/api/v2/deals/archived` | 20 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.getDealFollowers` | `GET https://api.pipedrive.com/api/v2/deals/{id}/followers` | 10 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.addDealFollower` | `POST https://api.pipedrive.com/api/v2/deals/{id}/followers` | 5 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.getDealFollowersChangelog` | `GET https://api.pipedrive.com/api/v2/deals/{id}/followers/changelog` | 10 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.deleteDealFollower` | `DELETE https://api.pipedrive.com/api/v2/deals/{id}/followers/{follower_id}` | 3 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.dealProducts.getDealsProducts` | `GET https://api.pipedrive.com/api/v2/deals/products` | 10 | `products:read`, `products:full`, `deals:read`, `deals:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.deals.searchDeals` | `GET https://api.pipedrive.com/api/v2/deals/search` | 20 | `deals:read`, `deals:full`, `search:read` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.dealProducts.getDealProducts` | `GET https://api.pipedrive.com/api/v2/deals/{id}/products` | 10 | `products:read`, `products:full`, `deals:read`, `deals:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.dealProducts.addDealProduct` | `POST https://api.pipedrive.com/api/v2/deals/{id}/products` | 5 | `products:full`, `deals:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.dealProducts.deleteManyDealProducts` | `DELETE https://api.pipedrive.com/api/v2/deals/{id}/products` | 15 | `products:full`, `deals:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.dealProducts.updateDealProduct` | `PATCH https://api.pipedrive.com/api/v2/deals/{id}/products/{product_attachment_id}` | 5 | `products:full`, `deals:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.dealProducts.deleteDealProduct` | `DELETE https://api.pipedrive.com/api/v2/deals/{id}/products/{product_attachment_id}` | 3 | `deals:full`, `products:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.dealProducts.addManyDealProducts` | `POST https://api.pipedrive.com/api/v2/deals/{id}/products/bulk` | 25 | `products:full`, `deals:full` | [DealProducts](https://developers.pipedrive.com/docs/api/v1/DealProducts) |
| `apiV2.deals.getAdditionalDiscounts` | `GET https://api.pipedrive.com/api/v2/deals/{id}/discounts` | 10 | `deals:read`, `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.postAdditionalDiscount` | `POST https://api.pipedrive.com/api/v2/deals/{id}/discounts` | 5 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.updateAdditionalDiscount` | `PATCH https://api.pipedrive.com/api/v2/deals/{id}/discounts/{discount_id}` | 5 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.deals.deleteAdditionalDiscount` | `DELETE https://api.pipedrive.com/api/v2/deals/{id}/discounts/{discount_id}` | 3 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.dealInstallments.getInstallments` | `GET https://api.pipedrive.com/api/v2/deals/installments` | 10 | `deals:read`, `deals:full` | [DealInstallments](https://developers.pipedrive.com/docs/api/v1/DealInstallments) |
| `apiV2.dealInstallments.postInstallment` | `POST https://api.pipedrive.com/api/v2/deals/{id}/installments` | 5 | `deals:full` | [DealInstallments](https://developers.pipedrive.com/docs/api/v1/DealInstallments) |
| `apiV2.dealInstallments.updateInstallment` | `PATCH https://api.pipedrive.com/api/v2/deals/{id}/installments/{installment_id}` | 5 | `deals:full` | [DealInstallments](https://developers.pipedrive.com/docs/api/v1/DealInstallments) |
| `apiV2.dealInstallments.deleteInstallment` | `DELETE https://api.pipedrive.com/api/v2/deals/{id}/installments/{installment_id}` | 3 | `deals:full` | [DealInstallments](https://developers.pipedrive.com/docs/api/v1/DealInstallments) |
| `apiV2.deals.convertDealToLead` | `POST https://api.pipedrive.com/api/v2/deals/{id}/convert/lead` | 40 | `deals:full` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.dealFields.getDealFields` | `GET https://api.pipedrive.com/api/v2/dealFields` | 10 | `deals:read`, `deals:full`, `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.addDealField` | `POST https://api.pipedrive.com/api/v2/dealFields` | 5 | `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.getDealField` | `GET https://api.pipedrive.com/api/v2/dealFields/{field_code}` | 1 | `deals:read`, `deals:full`, `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.updateDealField` | `PATCH https://api.pipedrive.com/api/v2/dealFields/{field_code}` | 5 | `deals:full`, `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.deleteDealField` | `DELETE https://api.pipedrive.com/api/v2/dealFields/{field_code}` | 3 | `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.addDealFieldOptions` | `POST https://api.pipedrive.com/api/v2/dealFields/{field_code}/options` | 5 | `deals:full`, `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.deleteDealFieldOptions` | `DELETE https://api.pipedrive.com/api/v2/dealFields/{field_code}/options` | 3 | `deals:full`, `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.dealFields.updateDealFieldOptions` | `PATCH https://api.pipedrive.com/api/v2/dealFields/{field_code}/options` | 5 | `deals:full`, `admin`, `deal-fields:full` | [DealFields](https://developers.pipedrive.com/docs/api/v1/DealFields) |
| `apiV2.deals.getDealConversionStatus` | `GET https://api.pipedrive.com/api/v2/deals/{id}/convert/status/{conversion_id}` | 1 | `deals:full`, `deals:read` | [Deals](https://developers.pipedrive.com/docs/api/v1/Deals) |
| `apiV2.persons.getPersonFollowers` | `GET https://api.pipedrive.com/api/v2/persons/{id}/followers` | 10 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV2.persons.addPersonFollower` | `POST https://api.pipedrive.com/api/v2/persons/{id}/followers` | 5 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV2.persons.getPersonFollowersChangelog` | `GET https://api.pipedrive.com/api/v2/persons/{id}/followers/changelog` | 10 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV2.persons.deletePersonFollower` | `DELETE https://api.pipedrive.com/api/v2/persons/{id}/followers/{follower_id}` | 3 | `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV2.persons.getPersonPicture` | `GET https://api.pipedrive.com/api/v2/persons/{id}/picture` | 1 | `contacts:read`, `contacts:full` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV2.personFields.getPersonFields` | `GET https://api.pipedrive.com/api/v2/personFields` | 10 | `contacts:read`, `contacts:full`, `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.addPersonField` | `POST https://api.pipedrive.com/api/v2/personFields` | 5 | `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.getPersonField` | `GET https://api.pipedrive.com/api/v2/personFields/{field_code}` | 1 | `contacts:read`, `contacts:full`, `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.updatePersonField` | `PATCH https://api.pipedrive.com/api/v2/personFields/{field_code}` | 5 | `contacts:full`, `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.deletePersonField` | `DELETE https://api.pipedrive.com/api/v2/personFields/{field_code}` | 3 | `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.addPersonFieldOptions` | `POST https://api.pipedrive.com/api/v2/personFields/{field_code}/options` | 5 | `contacts:full`, `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.deletePersonFieldOptions` | `DELETE https://api.pipedrive.com/api/v2/personFields/{field_code}/options` | 3 | `contacts:full`, `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.personFields.updatePersonFieldOptions` | `PATCH https://api.pipedrive.com/api/v2/personFields/{field_code}/options` | 5 | `contacts:full`, `admin`, `contact-fields:full` | [PersonFields](https://developers.pipedrive.com/docs/api/v1/PersonFields) |
| `apiV2.organizations.getOrganizationFollowers` | `GET https://api.pipedrive.com/api/v2/organizations/{id}/followers` | 10 | `contacts:read`, `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV2.organizations.addOrganizationFollower` | `POST https://api.pipedrive.com/api/v2/organizations/{id}/followers` | 5 | `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV2.organizations.getOrganizationFollowersChangelog` | `GET https://api.pipedrive.com/api/v2/organizations/{id}/followers/changelog` | 10 | `contacts:read`, `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV2.organizations.deleteOrganizationFollower` | `DELETE https://api.pipedrive.com/api/v2/organizations/{id}/followers/{follower_id}` | 3 | `contacts:full` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV2.organizationFields.getOrganizationFields` | `GET https://api.pipedrive.com/api/v2/organizationFields` | 10 | `contacts:read`, `contacts:full`, `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.addOrganizationField` | `POST https://api.pipedrive.com/api/v2/organizationFields` | 5 | `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.getOrganizationField` | `GET https://api.pipedrive.com/api/v2/organizationFields/{field_code}` | 1 | `contacts:read`, `contacts:full`, `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.updateOrganizationField` | `PATCH https://api.pipedrive.com/api/v2/organizationFields/{field_code}` | 5 | `contacts:full`, `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.deleteOrganizationField` | `DELETE https://api.pipedrive.com/api/v2/organizationFields/{field_code}` | 3 | `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.addOrganizationFieldOptions` | `POST https://api.pipedrive.com/api/v2/organizationFields/{field_code}/options` | 5 | `contacts:full`, `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.deleteOrganizationFieldOptions` | `DELETE https://api.pipedrive.com/api/v2/organizationFields/{field_code}/options` | 3 | `contacts:full`, `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.organizationFields.updateOrganizationFieldOptions` | `PATCH https://api.pipedrive.com/api/v2/organizationFields/{field_code}/options` | 5 | `contacts:full`, `admin`, `contact-fields:full` | [OrganizationFields](https://developers.pipedrive.com/docs/api/v1/OrganizationFields) |
| `apiV2.productFields.getProductFields` | `GET https://api.pipedrive.com/api/v2/productFields` | 10 | `products:read`, `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.addProductField` | `POST https://api.pipedrive.com/api/v2/productFields` | 5 | `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.getProductField` | `GET https://api.pipedrive.com/api/v2/productFields/{field_code}` | 1 | `products:read`, `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.updateProductField` | `PATCH https://api.pipedrive.com/api/v2/productFields/{field_code}` | 5 | `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.deleteProductField` | `DELETE https://api.pipedrive.com/api/v2/productFields/{field_code}` | 3 | `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.addProductFieldOptions` | `POST https://api.pipedrive.com/api/v2/productFields/{field_code}/options` | 5 | `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.deleteProductFieldOptions` | `DELETE https://api.pipedrive.com/api/v2/productFields/{field_code}/options` | 3 | `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.productFields.updateProductFieldOptions` | `PATCH https://api.pipedrive.com/api/v2/productFields/{field_code}/options` | 5 | `products:full`, `product-fields:full` | [ProductFields](https://developers.pipedrive.com/docs/api/v1/ProductFields) |
| `apiV2.leads.searchLeads` | `GET https://api.pipedrive.com/api/v2/leads/search` | 20 | `leads:read`, `leads:full`, `search:read` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV2.leads.convertLeadToDeal` | `POST https://api.pipedrive.com/api/v2/leads/{id}/convert/deal` | 40 | `leads:full` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV2.leads.getLeadConversionStatus` | `GET https://api.pipedrive.com/api/v2/leads/{id}/convert/status/{conversion_id}` | 1 | `leads:full`, `leads:read` | [Leads](https://developers.pipedrive.com/docs/api/v1/Leads) |
| `apiV2.organizations.searchOrganization` | `GET https://api.pipedrive.com/api/v2/organizations/search` | 20 | `contacts:read`, `contacts:full`, `search:read` | [Organizations](https://developers.pipedrive.com/docs/api/v1/Organizations) |
| `apiV2.persons.searchPersons` | `GET https://api.pipedrive.com/api/v2/persons/search` | 20 | `contacts:read`, `contacts:full`, `search:read` | [Persons](https://developers.pipedrive.com/docs/api/v1/Persons) |
| `apiV2.itemSearch.searchItem` | `GET https://api.pipedrive.com/api/v2/itemSearch` | 20 | `search:read` | [ItemSearch](https://developers.pipedrive.com/docs/api/v1/ItemSearch) |
| `apiV2.itemSearch.searchItemByField` | `GET https://api.pipedrive.com/api/v2/itemSearch/field` | 20 | `search:read` | [ItemSearch](https://developers.pipedrive.com/docs/api/v1/ItemSearch) |
| `apiV2.stages.getStages` | `GET https://api.pipedrive.com/api/v2/stages` | 5 | `deals:read`, `deals:full`, `admin` | [Stages](https://developers.pipedrive.com/docs/api/v1/Stages) |
| `apiV2.stages.addStage` | `POST https://api.pipedrive.com/api/v2/stages` | 5 | `admin` | [Stages](https://developers.pipedrive.com/docs/api/v1/Stages) |
| `apiV2.stages.deleteStage` | `DELETE https://api.pipedrive.com/api/v2/stages/{id}` | 3 | `admin` | [Stages](https://developers.pipedrive.com/docs/api/v1/Stages) |
| `apiV2.stages.getStage` | `GET https://api.pipedrive.com/api/v2/stages/{id}` | 1 | `deals:read`, `deals:full`, `admin` | [Stages](https://developers.pipedrive.com/docs/api/v1/Stages) |
| `apiV2.stages.updateStage` | `PATCH https://api.pipedrive.com/api/v2/stages/{id}` | 5 | `admin` | [Stages](https://developers.pipedrive.com/docs/api/v1/Stages) |
| `apiV2.pipelines.getPipelines` | `GET https://api.pipedrive.com/api/v2/pipelines` | 5 | `deals:read`, `deals:full`, `admin` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV2.pipelines.addPipeline` | `POST https://api.pipedrive.com/api/v2/pipelines` | 5 | `admin` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV2.pipelines.deletePipeline` | `DELETE https://api.pipedrive.com/api/v2/pipelines/{id}` | 3 | `admin` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV2.pipelines.getPipeline` | `GET https://api.pipedrive.com/api/v2/pipelines/{id}` | 1 | `deals:read`, `deals:full`, `admin` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV2.pipelines.updatePipeline` | `PATCH https://api.pipedrive.com/api/v2/pipelines/{id}` | 5 | `admin` | [Pipelines](https://developers.pipedrive.com/docs/api/v1/Pipelines) |
| `apiV2.projectFields.getProjectFields` | `GET https://api.pipedrive.com/api/v2/projectFields` | 10 | `projects:read`, `projects:full`, `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.addProjectField` | `POST https://api.pipedrive.com/api/v2/projectFields` | 5 | `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.getProjectField` | `GET https://api.pipedrive.com/api/v2/projectFields/{field_code}` | 1 | `projects:read`, `projects:full`, `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.updateProjectField` | `PATCH https://api.pipedrive.com/api/v2/projectFields/{field_code}` | 5 | `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.deleteProjectField` | `DELETE https://api.pipedrive.com/api/v2/projectFields/{field_code}` | 3 | `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.addProjectFieldOptions` | `POST https://api.pipedrive.com/api/v2/projectFields/{field_code}/options` | 5 | `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.deleteProjectFieldOptions` | `DELETE https://api.pipedrive.com/api/v2/projectFields/{field_code}/options` | 3 | `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projectFields.updateProjectFieldOptions` | `PATCH https://api.pipedrive.com/api/v2/projectFields/{field_code}/options` | 5 | `project-fields:full` | [ProjectFields](https://developers.pipedrive.com/docs/api/v1/ProjectFields) |
| `apiV2.projects.getProjects` | `GET https://api.pipedrive.com/api/v2/projects` | 10 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.addProject` | `POST https://api.pipedrive.com/api/v2/projects` | 5 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.getArchivedProjects` | `GET https://api.pipedrive.com/api/v2/projects/archived` | 10 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.getProject` | `GET https://api.pipedrive.com/api/v2/projects/{id}` | 1 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.updateProject` | `PATCH https://api.pipedrive.com/api/v2/projects/{id}` | 5 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.deleteProject` | `DELETE https://api.pipedrive.com/api/v2/projects/{id}` | 3 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projectTemplates.getProjectTemplates` | `GET https://api.pipedrive.com/api/v2/projectTemplates` | 10 | `projects:read`, `projects:full` | [ProjectTemplates](https://developers.pipedrive.com/docs/api/v1/ProjectTemplates) |
| `apiV2.projectTemplates.getProjectTemplate` | `GET https://api.pipedrive.com/api/v2/projectTemplates/{id}` | 1 | `projects:read`, `projects:full` | [ProjectTemplates](https://developers.pipedrive.com/docs/api/v1/ProjectTemplates) |
| `apiV2.projects.searchProjects` | `GET https://api.pipedrive.com/api/v2/projects/search` | 20 | `projects:read`, `projects:full`, `search:read` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.archiveProject` | `POST https://api.pipedrive.com/api/v2/projects/{id}/archive` | 3 | `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.getProjectUsers` | `GET https://api.pipedrive.com/api/v2/projects/{id}/permittedUsers` | 5 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projects.getProjectChangelog` | `GET https://api.pipedrive.com/api/v2/projects/{id}/changelog` | 10 | `projects:read`, `projects:full` | [Projects](https://developers.pipedrive.com/docs/api/v1/Projects) |
| `apiV2.projectBoards.getProjectsBoards` | `GET https://api.pipedrive.com/api/v2/boards` | 10 | `projects:read`, `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV2.projectBoards.addProjectBoard` | `POST https://api.pipedrive.com/api/v2/boards` | 5 | `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV2.projectBoards.getProjectsBoard` | `GET https://api.pipedrive.com/api/v2/boards/{id}` | 10 | `projects:read`, `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV2.projectBoards.updateProjectBoard` | `PATCH https://api.pipedrive.com/api/v2/boards/{id}` | 5 | `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV2.projectBoards.deleteProjectBoard` | `DELETE https://api.pipedrive.com/api/v2/boards/{id}` | 3 | `projects:full` | [ProjectBoards](https://developers.pipedrive.com/docs/api/v1/ProjectBoards) |
| `apiV2.projectPhases.getProjectsPhases` | `GET https://api.pipedrive.com/api/v2/phases` | 10 | `projects:read`, `projects:full` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV2.projectPhases.addProjectPhase` | `POST https://api.pipedrive.com/api/v2/phases` | 5 | `projects:full` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV2.projectPhases.getProjectsPhase` | `GET https://api.pipedrive.com/api/v2/phases/{id}` | 10 | `projects:read`, `projects:full` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV2.projectPhases.updateProjectPhase` | `PATCH https://api.pipedrive.com/api/v2/phases/{id}` | 5 | `projects:full` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV2.projectPhases.deleteProjectPhase` | `DELETE https://api.pipedrive.com/api/v2/phases/{id}` | 3 | `projects:full` | [ProjectPhases](https://developers.pipedrive.com/docs/api/v1/ProjectPhases) |
| `apiV2.users.getUserFollowers` | `GET https://api.pipedrive.com/api/v2/users/{id}/followers` | 10 | `users:read` | [Users](https://developers.pipedrive.com/docs/api/v1/Users) |
<!-- PIPEDRIVE_CATALOG_END -->

## Scope and limitations

The current official contracts contain 213 v1 and 158 v2 operations (371 versioned operations total). The plugin exposes 365: all documented business operations compatible with Corsair's request/response model. The three webhook routes are intentionally excluded because webhook receiving was not requested. The three v1 OAuth authorization, token-exchange, and refresh routes are handled by Corsair's OAuth lifecycle rather than exposed as business endpoints. No other OpenAPI operation is pending or unverified against the two published spec files. Pipedrive's file-download route is exposed as `{ content_type, base64, byte_length }`; the plugin caps a single downloaded file at 20 MiB and follows HTTPS redirects, sending credentials only to `*.pipedrive.com` and nothing but `Accept` to presigned storage; non-HTTPS redirects are rejected.

Official references: [Pipedrive API v1](https://developers.pipedrive.com/docs/api/v1/openapi.yaml), [Pipedrive API v2](https://developers.pipedrive.com/docs/api/v1/openapi-v2.yaml), [API reference](https://developers.pipedrive.com/docs/api/v1).

Rate-limit details: [Pipedrive rate limiting](https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting).

## License

Apache-2.0
