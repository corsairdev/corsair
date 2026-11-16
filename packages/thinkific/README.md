# @corsair-dev/thinkific

Thinkific Admin API v1 integration for Corsair. The route and data contracts follow Thinkific's [official OpenAPI v1 export](https://developers.thinkific.com/openapi/thinkific-admin-api-v1.yaml).

## Install

```bash
pnpm add @corsair-dev/thinkific
```

## Authentication

Configure the Thinkific API key and the site's subdomain. The plugin sends the documented `X-Auth-API-Key` and `X-Auth-Subdomain` headers to `https://api.thinkific.com/api/public/v1`. Corsair stores the site subdomain (`acme` for `acme.thinkific.com`) as the account's `subdomain` field; the API key is resolved through `ctx.key`. API keys require a Thinkific plan with API access.

## Operations

The operation arguments are strict and grouped as `{ path, query, body }` according to the provider route. Path values are required where shown; query parameters preserve Thinkific's names (including `query[email]`).

| Operation | Method and path | Description |
| --- | --- | --- |
| `bundles.get` | `GET /bundles/{id}` | List a bundle |
| `bundles.listCourses` | `GET /bundles/{id}/courses` | List Courses by bundle ID |
| `bundles.listEnrollments` | `GET /bundles/{id}/enrollments` | List a enrollments in a bundle |
| `bundles.createEnrollment` | `POST /bundles/{id}/enrollments` | Create an Enrollment in a Bundle of Courses |
| `bundles.updateEnrollments` | `PUT /bundles/{id}/enrollments` | Update Enrollments in a Bundle |
| `chapters.get` | `GET /chapters/{id}` | Get Chapters |
| `chapters.listContents` | `GET /chapters/{id}/contents` | Get Contents by Chapter id |
| `categories.list` | `GET /collections` | Get Collections |
| `categories.create` | `POST /collections` | Create a new Category |
| `categories.get` | `GET /collections/{id}` | Get Collections by Id |
| `categories.update` | `PUT /collections/{id}` | Update collection by ID |
| `categories.remove` | `DELETE /collections/{id}` | Delete collection by ID |
| `categories.listProducts` | `GET /collections/{id}/products` | Get products by Collections id |
| `categoryMemberships.addProducts` | `POST /collection_memberships/{id}` | Add Product to Category |
| `categoryMemberships.removeProducts` | `DELETE /collection_memberships/{id}` | Delete  Products by ID |
| `coupons.list` | `GET /coupons` | Get Coupons |
| `coupons.create` | `POST /coupons` | Create a Coupon |
| `coupons.bulkCreate` | `POST /coupons/bulk_create` | Bulk Create Coupons |
| `coupons.get` | `GET /coupons/{id}` | Get a Coupon by ID |
| `coupons.update` | `PUT /coupons/{id}` | Update a Coupon |
| `coupons.remove` | `DELETE /coupons/{id}` | Delete Coupon by ID |
| `contents.get` | `GET /contents/{id}` | Get Contents by Id |
| `courses.list` | `GET /courses` | Get Courses |
| `courses.get` | `GET /courses/{id}` | Get courses by ID |
| `courses.listChapters` | `GET /courses/{id}/chapters` | Get Chapters by Course ID |
| `customProfileFields.list` | `GET /custom_profile_field_definitions` | Get Custom profile field definition |
| `enrollments.list` | `GET /enrollments` | Get Enrollments |
| `enrollments.create` | `POST /enrollments` | Create enrollment |
| `enrollments.get` | `GET /enrollments/{id}` | Get enrollments by ID |
| `enrollments.update` | `PUT /enrollments/{id}` | Update enrollment |
| `externalOrders.create` | `POST /external_orders` | Create a new external order |
| `externalOrders.refund` | `POST /external_orders/{id}/transactions/refund` | refund transaction |
| `externalOrders.purchase` | `POST /external_orders/{id}/transactions/purchase` | purchase transaction |
| `groups.list` | `GET /groups` | Get Groups |
| `groups.create` | `POST /groups` | Create Group |
| `groups.get` | `GET /groups/{id}` | Get Group |
| `groups.remove` | `DELETE /groups/{id}` | Delete Group by ID |
| `groups.listAnalysts` | `GET /groups/{group_id}/analysts` | Get Group Analysts |
| `groups.assignAnalysts` | `POST /groups/{group_id}/analysts` | Assign Analysts to a Group |
| `groups.removeAnalyst` | `DELETE /groups/{group_id}/analysts/{user_id}` | Delete Analyst |
| `groupAnalysts.addGroup` | `POST /group_analysts/{user_id}/groups` | Add Analyst to Groups |
| `groupAnalysts.removeGroup` | `DELETE /group_analysts/{user_id}/groups/{group_id}` | Delete Analyst |
| `instructors.list` | `GET /instructors` | Get Instructors |
| `instructors.create` | `POST /instructors` | Create instructor |
| `instructors.get` | `GET /instructors/{id}` | Get Instructor by ID |
| `instructors.update` | `PUT /instructors/{id}` | Update instructor |
| `instructors.remove` | `DELETE /instructors/{id}` | Delete instructor |
| `orders.list` | `GET /orders` | Get Orders |
| `orders.get` | `GET /orders/{id}` | Get orders by ID |
| `groupUsers.addUsers` | `POST /group_users` | Create a User to existing Groups |
| `productPublishRequests.list` | `GET /product_publish_requests` | Get List of unhandled product publish requests |
| `productPublishRequests.get` | `GET /product_publish_requests/{id}` | Get product publish request by ID |
| `productPublishRequests.approve` | `POST /product_publish_requests/{id}/approve` | Approves Product Publish Request |
| `productPublishRequests.deny` | `POST /product_publish_requests/{id}/deny` | Denies Product Publish Request |
| `products.list` | `GET /products` | List products |
| `products.get` | `GET /products/{id}` | Get product by ID |
| `products.listRelated` | `GET /products/{id}/related` | Get related products |
| `promotions.list` | `GET /promotions` | List promotions |
| `promotions.create` | `POST /promotions` | Create a new promotion |
| `promotions.get` | `GET /promotions/{id}` | Get promotion by provided ID |
| `promotions.update` | `PUT /promotions/{id}` | Update promotion by provided ID |
| `promotions.remove` | `DELETE /promotions/{id}` | Delete promotion by provided ID |
| `promotions.getByCoupon` | `GET /promotions/by_coupon` | Get Promotion associated with the provided Coupon code. |
| `courseReviews.list` | `GET /course_reviews` | Get Course Reviews |
| `courseReviews.create` | `POST /course_reviews` | Create a course review |
| `courseReviews.get` | `GET /course_reviews/{id}` | Get Course Reviews By ID |
| `users.list` | `GET /users` | List Users |
| `users.create` | `POST /users` | Create user |
| `users.get` | `GET /users/{id}` | List Users by ID |
| `users.update` | `PUT /users/{id}` | Update user by ID |
| `users.remove` | `DELETE /users/{id}` | Delete user by ID |
| `users.getAuthentication` | `GET /users/{id}/authentications/{provider}` | Get User Auth data by ID and Provider |
| `users.createExpressSignInLink` | `POST /users/{id}/express_sign_in_link` | Get a learner's Express Sign In Link |

## Pagination, rate limits, and errors

- Collection routes accept the documented `page` and `limit` query parameters when present in the OpenAPI operation. Thinkific's REST guide states a default limit of 25 and maximum of 250. Collection responses use `items` and `meta.pagination`.
- Thinkific documents a limit of 120 requests per minute per site and at most 10 concurrent requests. HTTP 429 responses may include `RateLimit-Reset` as an epoch time; Corsair's shared transport honors this reset header and retries 429s. Other errors and writes are not retried automatically by this plugin.
- Request objects reject undocumented fields. Successful responses are parsed with a lenient copy of the OpenAPI v1 response schemas: Thinkific sends `null` for unset fields (`next_page`, `completed_at`, `avatar_url`), decimals as strings and fields the export does not list, none of which fail a call. Error messages keep Thinkific's own error text (field names and rules) and drop request bodies, query values and credentials.
- Creating an enrollment (`enrollments.create`, `bundles.createEnrollment`) and creating a user can email the learner, so those operations are `destructive` and need approval.
- Thinkific's published OpenAPI component for `/product_publish_requests` incorrectly points list items to `PromotionResponse`; this plugin uses the documented `ProductPublishRequest` shape, which is also the response schema of the detail route.

## Scope and exclusions

- This plugin targets only the officially documented Thinkific Admin API v1 at `/api/public/v1`. Admin API v2 is not verified by the official Admin reference/export.
- Webhook management and incoming webhook receivers are excluded. Thinkific's separate [Webhooks API reference](https://developers.thinkific.com/api/webhooks-api) does not publish route-level request/response contracts and uses a separate Bearer-auth surface.
- These five Site Scripts routes are excluded because Thinkific requires a public app and OAuth `write:site_scripts` scope; this plugin uses the API-key auth model: `GET /site_scripts`, `POST /site_scripts`, `GET /site_scripts/{id}`, `PUT /site_scripts/{id}`, and `DELETE /site_scripts/{id}`.
- Thinkific's REST introduction notes that new-course-builder courses are excluded from almost all REST endpoints.

## Official references

- [Admin API reference](https://developers.thinkific.com/api/api-documentation)
- [Admin API v1 OpenAPI export](https://developers.thinkific.com/openapi/thinkific-admin-api-v1.yaml)
- [API key authorization](https://support.thinkific.dev/hc/en-us/articles/4422657425431)
- [Response format and pagination](https://support.thinkific.dev/hc/en-us/articles/4422657182743)
- [Rate limits](https://support.thinkific.dev/hc/en-us/articles/4422684774935)
- [REST API introduction and new course builder limitation](https://support.thinkific.dev/hc/en-us/articles/4422677315351)

## Webhooks

No webhooks are registered by this plugin.

## License

Apache-2.0
