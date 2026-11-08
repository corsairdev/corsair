# @corsair-dev/memberspot

MemberSpot plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/memberspot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.check` | `memberspot.api.auth.check` | `read` | Returns the school the API key belongs to, which is the cheapest way to confirm a key works |
| `chapters.enableAccess` | `memberspot.api.chapters.enableAccess` | `write` | Grants a user access to one chapter by email |
| `chapters.enableAccessByUid` | `memberspot.api.chapters.enableAccessByUid` | `write` | Grants a user access to one chapter by uid |
| `courses.list` | `memberspot.api.courses.list` | `read` | Lists all courses of the school with their ids and types |
| `customProperties.list` | `memberspot.api.customProperties.list` | `read` | Lists the custom user properties defined for the school |
| `exams.list` | `memberspot.api.exams.list` | `read` | Lists all exams of the school, including the examId used for results |
| `exams.results` | `memberspot.api.exams.results` | `read` | Lists the exam results of every user who took an exam, with each run and whether it passed |
| `offers.list` | `memberspot.api.offers.list` | `read` | Lists the offers available in the school |
| `users.courseProgress` | `memberspot.api.users.courseProgress` | `read` | Lists every course progress record for a user by email, paginated |
| `users.courseProgressByUid` | `memberspot.api.users.courseProgressByUid` | `read` | Lists every course progress record for a user by uid, paginated |
| `users.courseProgressDetail` | `memberspot.api.users.courseProgressDetail` | `read` | Returns one user’s progress in one course, by email |
| `users.courseProgressDetailByUid` | `memberspot.api.users.courseProgressDetailByUid` | `read` | Returns one user’s progress in one course, by uid |
| `users.delete` | `memberspot.api.users.delete` | `destructive` | Permanently deletes up to 10 users by email; deleted accounts and their progress cannot be restored |
| `users.deleteByUid` | `memberspot.api.users.deleteByUid` | `destructive` | Permanently deletes up to 10 users by uid; deleted accounts and their progress cannot be restored |
| `users.findByEmail` | `memberspot.api.users.findByEmail` | `read` | Returns one user by email, or null when no such user exists |
| `users.findByUid` | `memberspot.api.users.findByUid` | `read` | Returns one user by uid, or null when no such user exists |
| `users.grantOffer` | `memberspot.api.users.grantOffer` | `write` | Creates or updates a user by email and optionally grants an offer in the same call; reports whether the user is new |
| `users.grantOfferByUid` | `memberspot.api.users.grantOfferByUid` | `write` | Grants an offer to an existing user by uid |
| `users.list` | `memberspot.api.users.list` | `read` | Returns a page of users, optionally filtered by offer or course, with a cursor for the next page |
| `users.loginToken` | `memberspot.api.users.loginToken` | `read` | Mints a token and login URL that signs a user in automatically; the token expires after one hour |
| `users.offers` | `memberspot.api.users.offers` | `read` | Returns the offers granted to a user with their active state and expiry |
| `users.setCourseStartDate` | `memberspot.api.users.setCourseStartDate` | `write` | Sets when a user’s access to a course starts |
| `users.setCustomProperties` | `memberspot.api.users.setCustomProperties` | `write` | Sets several custom user properties at once by email; properties omitted from the map are left unchanged |
| `users.setCustomPropertiesByUid` | `memberspot.api.users.setCustomPropertiesByUid` | `write` | Sets several custom user properties at once by uid |
| `users.setCustomProperty` | `memberspot.api.users.setCustomProperty` | `write` | Sets one custom user property by email; a null value blanks it |
| `users.setCustomPropertyByUid` | `memberspot.api.users.setCustomPropertyByUid` | `write` | Sets one custom user property by uid |
| `users.setOfferExpires` | `memberspot.api.users.setOfferExpires` | `write` | Sets or clears the expiry date of an offer for a user by uid |
| `users.setOfferState` | `memberspot.api.users.setOfferState` | `write` | Activates or deactivates an offer for a user by email, which is how access is revoked |
| `users.setOfferStateByUid` | `memberspot.api.users.setOfferStateByUid` | `write` | Activates or deactivates an offer for a user by uid |
| `users.setOrderState` | `memberspot.api.users.setOrderState` | `write` | Sets the state of an offer tied to an order for a user by email |
| `users.setOrderStateByOrderId` | `memberspot.api.users.setOrderStateByOrderId` | `write` | Sets the state of every offer carrying a given orderId, across all users |
| `users.setOrderStateByUid` | `memberspot.api.users.setOrderStateByUid` | `write` | Sets the state of an offer tied to an order for a user by uid |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/memberspot

## License

Apache-2.0
