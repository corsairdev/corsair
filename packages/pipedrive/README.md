# @corsair-dev/pipedrive

Pipedrive API v2 deals, persons, organizations, activities, tasks, and product catalog plugin for Corsair. The implemented API surface is deliberately partial.

## Install

```bash
pnpm add @corsair-dev/pipedrive
```

## Authentication

Configure an API token or OAuth 2.0 access token. Pipedrive accepts API tokens in the `x-api-token` header and OAuth access tokens as Bearer authorization. Deal reads require `deals:read` or `deals:full`; person and organization reads require `contacts:read` or `contacts:full`; activity reads require `activities:read` or `activities:full`; task reads require `projects:read` or `projects:full`; product reads require `products:read` or `products:full` (search also accepts `search:read`). Corresponding writes and deletes require each resource's `:full` scope.

## Implemented operations

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
| `activities.create` | `POST /api/v2/activities` | Write · 5 tokens | `activities:full` | [Add activity](https://developers.pipedrive.com/docs/api/v1/Activities#addActivity) |
| `activities.update` | `PATCH /api/v2/activities/{id}` | Write · 5 tokens | `activities:full` | [Update activity](https://developers.pipedrive.com/docs/api/v1/Activities#updateActivity) |
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

## Scope and limitations

This contribution is a partial slice, not complete API coverage. The official references publish 213 v1 operations and 158 v2 operations (371 versioned operations total). Forty-four v2 deals, persons, organizations, activities, tasks, and products operations above are currently implemented. Three webhook routes are intentionally excluded. The three v1 OAuth authorization/token exchange/refresh routes are handled by Corsair's OAuth lifecycle rather than exposed as business endpoints. The other 321 documented operations remain pending, including ProductFields and other resources; routes not implemented are pending rather than excluded as unsupported.

Official references: [Pipedrive API v1](https://developers.pipedrive.com/docs/api/v1/openapi.yaml), [Pipedrive API v2](https://developers.pipedrive.com/docs/api/v1/openapi-v2.yaml).

Rate-limit details: [Pipedrive rate limiting](https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting).

## License

Apache-2.0
