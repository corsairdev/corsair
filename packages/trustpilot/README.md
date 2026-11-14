# @corsair-dev/trustpilot

Trustpilot business, service review, product review, invitation-link, consumer-profile, and Data Solutions API operations for Corsair.

## Install

```bash
pnpm add @corsair-dev/trustpilot
```

## Authentication

Trustpilot documents public API-key authentication (`apikey: <client ID>`) and OAuth 2.0 Bearer authentication for private operations. Choose `api_key` for public operations or `oauth_2` for protected operations. With `oauth_2`, public operations send the OAuth app's client ID as the API key (Trustpilot's API key is the client ID), or `apiKey` from plugin options when it is set. Corsair's OAuth authorization-code flow is configured for Trustpilot, and the plugin uses Corsair's shared OAuth helper to refresh expired access tokens and recover from 401s. Trustpilot also documents client-credentials tokens, but those do not include a refresh token; obtain and renew them externally before the stored token expires. Trustpilot does not document per-operation OAuth scopes. Access tokens expire after 100 hours; refresh tokens expire after 30 days for grants that issue one.

Data Solutions is a separate API product and host, but uses the same API-key header. Invitations use the `invitations-api.trustpilot.com` host. Business and Data Solutions use separate documented hosts.

## Operations

Public operations use API key unless marked OAuth. OAuth operations use a Bearer access token.

| Operation | Method and path | Auth |
| --- | --- | --- |
| `businessUnits.find` | GET `/v1/business-units/find` | API key |
| `businessUnits.get` | GET `/v1/business-units/{businessUnitId}` | API key |
| `businessUnits.search` | GET `/v1/business-units/search` | API key |
| `businessUnits.profileInfo` | GET `/v1/business-units/{businessUnitId}/profileinfo` | API key |
| `businessUnits.webLinks` | GET `/v1/business-units/{businessUnitId}/web-links` | API key |
| `businessUnits.logo` | GET `/v1/business-units/{businessUnitId}/images/logo` | API key |
| `businessUnits.promotionBoxImage` | GET `/v1/business-units/{businessUnitId}/images/promotion-box` | API key |
| `businessUnits.headerImage` | GET `/v1/business-units/{businessUnitId}/images/header` | API key |
| `businessUnits.listCategories` | GET `/v1/business-units/{businessUnitId}/categories` | API key |
| `businessUnits.publicAll` | GET `/v1/business-units/all` | API key |
| `businessUnits.customerGuarantee` | GET `/v1/business-units/{businessUnitId}/customerguarantee` | API key |
| `businessUnits.profilePromotion` | GET `/v1/business-units/{businessUnitId}/profilepromotion` | API key |
| `businessUnits.publicPromotionBox` | GET `/v1/business-units/{businessUnitId}/promotion-box` | API key |
| `businessUnits.reviews` | GET `/v1/business-units/{businessUnitId}/reviews` | API key |
| `businessUnits.allReviews` | GET `/v1/business-units/{businessUnitId}/all-reviews` | API key |
| `businessUnits.privateReviews` | GET `/v1/private/business-units/{businessUnitId}/reviews` | OAuth |
| `reviews.get` | GET `/v1/reviews/{reviewId}` | API key |
| `reviews.getPrivate` | GET `/v1/private/reviews/{reviewId}` | OAuth |
| `reviews.latest` | GET `/v1/reviews/latest` | API key |
| `reviews.getTags` | GET `/v1/private/reviews/{reviewId}/tags` | OAuth |
| `reviews.webLinks` | GET `/v1/reviews/{reviewId}/web-links` | API key |
| `reviews.likes` | GET `/v1/reviews/{reviewId}/likes` | API key |
| `consumers.reviews` | GET `/v1/consumers/{consumerId}/reviews` | API key |
| `consumerProfiles.get` | GET `/v1/consumers/{consumerId}/profile` | API key |
| `consumerProfiles.getWithReviews` | GET `/v1/consumers/{consumerId}` | API key |
| `consumerProfiles.webLinks` | GET `/v1/consumers/{consumerId}/web-links` | API key |
| `consumerProfiles.bulk` | POST `/v1/consumers/profile/bulk` | API key |
| `consumerProfiles.createDisplayName` | POST `/v1/consumers/profile/displayname/create` | API key |
| `consumerProfiles.validateDisplayName` | POST `/v1/consumers/profile/displayname/validate` | API key |
| `productReviews.summary` | GET `/v1/product-reviews/business-units/{businessUnitId}` | API key |
| `productReviews.list` | GET `/v1/product-reviews/business-units/{businessUnitId}/reviews` | API key |
| `productReviews.privateList` | GET `/v1/private/product-reviews/business-units/{businessUnitId}/reviews` | OAuth |
| `productReviews.privateGet` | GET `/v1/private/product-reviews/{reviewId}` | OAuth |
| `productReviews.summaries` | GET `/v1/private/product-reviews/business-units/{businessUnitId}/summaries` | OAuth |
| `productReviews.batchSummaries` | POST `/v1/product-reviews/business-units/{businessUnitId}/batch-summaries` | API key |
| `productReviews.invitationLink` | POST `/v1/private/product-reviews/business-units/{businessUnitId}/invitation-links` | OAuth |
| `productReviews.createComment` | POST `/v1/private/conversations/{conversationId}/comments` | OAuth |
| `productReviews.getConversation` | GET `/v1/private/conversations/{conversationId}` | OAuth |
| `productReviews.getComment` | GET `/v1/private/conversations/{conversationId}/comments/{commentId}` | OAuth |
| `productReviews.updateComment` | PUT `/v1/private/conversations/{conversationId}/comments/{commentId}` | OAuth |
| `productReviews.publicConversation` | GET `/v1/conversations/{conversationId}` | API key |
| `productReviews.createConversation` | POST `/v1/private/product-reviews/{reviewId}/create-conversation` | OAuth |
| `productReviews.attributeSummaries` | POST `/v1/product-reviews/business-units/{businessUnitId}/attribute-summaries` | API key |
| `productReviews.importedSummary` | GET `/v1/product-reviews/business-units/{businessUnitId}/imported-reviews-summaries` | API key |
| `productReviews.importedReviews` | GET `/v1/product-reviews/business-units/{businessUnitId}/imported-reviews` | API key |
| `invitations.templates` | GET `/v1/private/business-units/{businessUnitId}/templates` | OAuth |
| `invitations.link` | POST `/v1/private/business-units/{businessUnitId}/invitation-links` | OAuth |
| `dataSolutions.searchBusinessUnits` | GET `/v1/business-units/search` | API key |
| `dataSolutions.findBusinessUnits` | GET `/v1/business-units` | API key |
| `dataSolutions.businessUnitDetails` | GET `/v1/business-units/{businessUnitId}` | API key |
| `dataSolutions.latestReviews` | GET `/v1/business-units/{businessUnitId}/reviews/latest` | API key |
| `dataSolutions.serviceReviews` | GET `/v1/business-units/{businessUnitId}/reviews` | API key |
| `dataSolutions.categories` | GET `/v1/categories` | API key |

Review lists use the provider's page/pageToken or nextToken parameters as documented. Data Solutions search/find pages accept `perPage` (1–100) and `nextToken`; service-review results forward `nextToken`; the latest-review endpoint is capped at five. Trustpilot recommends no more than 833 calls per five minutes or 10,000 per hour. Trustpilot for Business API modules also have annual call allowances (200,000 for tier 1, 1,000,000 for tier 2, unlimited for tier 3); invitation links count against the invitation allowance instead. This client makes one HTTP request per plugin retry attempt and extracts `Retry-After`; Corsair retries rate-limited read operations only. The invitation-link writes are not replayed. Trustpilot does not document an idempotency-key mechanism for these writes. The plugin does not retry 5xx or network errors; callers can override the default error handlers.

## Privacy and limitations

Private review and invitation responses can include consumer names, email addresses, reference IDs, addresses, or other personal data. Endpoint inputs and outputs are not logged. HTTP errors are rethrown with status and rate-limit metadata preserved, but with provider bodies, request details, and provider error text removed.

The official reference pages do not document a usable response schema for email-invitation creation, invitation-data deletion, or service-review mutation calls; those operations are not registered. The profile-image endpoint's response dimensions have no documented primitive types, so that endpoint is also excluded rather than guessed. The Trustpilot for Business docs also describe standalone category-directory, location-management, resource, and catalog-product APIs; those ancillary groups are outside the issue's selected operation areas and are not registered here. Business-unit category associations and all six documented Data Solutions API calls are included. The docs describe managing webhook notifications through the Business UI/help center but do not publish a REST management contract. No webhook management endpoint, receiver, callback, or webhook schema is implemented.

Trustpilot recommends synchronizing consumer/review deletions every 28 days if your application stores provider data and refreshing cached review data every 24 hours when showcasing it. This plugin does not persist provider records and currently does not expose the separate Deletions API. Data Solutions service-review and category access is available only with the Insights API plan; other Data Solutions reads require the product entitlements described by Trustpilot.

## Official references

- [Trustpilot for Business API module](https://developers.trustpilot.com/api-module-overview/)
- [Authentication overview](https://developers.trustpilot.com/authentication/)
- [Authorization code grant](https://developers.trustpilot.com/grant-type-auth-code/)
- [Client credentials grant](https://developers.trustpilot.com/grant-type-client-credentials/)
- [Business Units API](https://developers.trustpilot.com/business-units-api/)
- [Public Business Units API](https://developers.trustpilot.com/business-units-api-%28public%29/)
- [Service Reviews API](https://developers.trustpilot.com/service-reviews-api/)
- [Consumer API](https://developers.trustpilot.com/consumer-api/)
- [Consumer Profile API](https://developers.trustpilot.com/consumer-profile-api/)
- [Product Reviews API](https://developers.trustpilot.com/product-reviews-api/)
- [Invitation API](https://developers.trustpilot.com/invitation-api/)
- [Data Solutions API](https://developers.trustpilot.com/data-solutions-api/)
- [Rate limiting](https://developers.trustpilot.com/rate-limiting/)
- [Common errors](https://developers.trustpilot.com/common-error-messages/)

## License

Apache-2.0
