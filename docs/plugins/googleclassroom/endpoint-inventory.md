# Google Classroom endpoint inventory

The package implements 104 documented operations listed in the [Google Classroom REST reference](https://developers.google.com/workspace/classroom/reference/rest) and [Discovery document](https://classroom.googleapis.com/$discovery/rest?version=v1): 96 nondeprecated methods plus eight deprecated posts-based add-on compatibility methods. OAuth scope alternatives per route and method/path coverage are documented in the package README.

Google marks the legacy posts-based add-on routes deprecated and recommends the corresponding `announcements`, `courseWork`, or `courseWorkMaterials` resource methods. They remain implemented because they are still documented v1 routes:

| Route | Status | Replacement |
|---|---|---|
| `GET /v1/courses/{courseId}/posts/{postId}/addOnContext` | Deprecated | `courses.announcements/courseWork/courseWorkMaterials.getAddOnContext` |
| `POST /v1/courses/{courseId}/posts/{postId}/addOnAttachments` | Deprecated | Resource-specific `addOnAttachments.create` |
| `DELETE /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` | Deprecated | Resource-specific `addOnAttachments.delete` |
| `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` | Deprecated | Resource-specific `addOnAttachments.get` |
| `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments` | Deprecated | Resource-specific `addOnAttachments.list` |
| `PATCH /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` | Deprecated | Resource-specific `addOnAttachments.patch` |
| `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` | Deprecated | Resource-specific add-on `studentSubmissions.get` |
| `PATCH /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` | Deprecated | Resource-specific add-on `studentSubmissions.patch` |

The excluded v1 routes are:

| Route | Status | Reason |
|---|---|---|
| `GET /v1/courses/{courseId}:checkAddOnCreationEligibility` | Deprecated | Marked deprecated in the REST reference. |
| `GET /v1/courses/{courseId}:checkGradingPeriodsSetupEligibility` | Deprecated and Developer Preview | Preview-only and deprecated; not part of stable v1. |
| `GET /v1/userProfiles/{userId}:checkUserCapability` | Developer Preview | Preview-only; not part of stable v1. |
| `PATCH /v1/courses/{courseId}/courseWork/{courseWorkId}/rubric` | Discovery-only | Absent from the current REST method catalog, whose direct method reference returns 404; use the documented plural rubrics resource. |

The plugin also rejects Google API's global JSONP callback and query-string credential parameters. Pub/Sub registration create/delete are included; message delivery is not received by this plugin.
