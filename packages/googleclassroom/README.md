# @corsair-dev/googleclassroom

Google Classroom plugin for Corsair. Exposes 104 documented v1 operations: 96 current nondeprecated methods plus 8 deprecated posts-based add-on compatibility methods. Coverage spans courses, rosters, classwork, submissions, add-ons, guardians, invitations, rubrics, topics, and notification registrations.

## Install

```bash
pnpm add @corsair-dev/googleclassroom
```

## Authentication

OAuth 2.0 via Google. The plugin passes the resolved OAuth access token in the `Authorization: Bearer` header; it does not use API keys or query-string credentials. By default, the consent configuration requests the narrowest 10 official scopes that cover the complete supported API surface. For least privilege when a deployment enables only selected operations, pass a smaller `oauthScopes` list chosen from `GOOGLE_CLASSROOM_SUPPORTED_SCOPES`. Importing a rubric with `sourceSpreadsheetId` additionally needs `spreadsheets.readonly` or `spreadsheets`; those optional scopes are supported but not requested by default. Google may require app verification for sensitive scopes.

See [Google's OAuth scope guide](https://developers.google.com/classroom/guides/auth).

## Live smoke test

Set `GOOGLECLASSROOM_ACCESS_TOKEN` to a short-lived Google OAuth token with an accepted `userProfiles.get` scope, then run `pnpm test:live` from this package. The live test only reads the authenticated user's profile and never prints the token. No live credentials are configured in this contribution.

## Operations

All list operations support Google's `pageSize` and `pageToken` where documented; pass back `nextPageToken` with the same filters.

| Operation | Route | Accepted OAuth scope(s) | Official reference |
|---|---|---|---|
| `courses.aliases.create` | `POST /v1/courses/{courseId}/aliases` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.aliases) |
| `courses.aliases.delete` | `DELETE /v1/courses/{courseId}/aliases/{alias}` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.aliases) |
| `courses.aliases.list` | `GET /v1/courses/{courseId}/aliases` | `classroom.courses`, `classroom.courses.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.aliases) |
| `courses.announcements.addOnAttachments.create` | `POST /v1/courses/{courseId}/announcements/{itemId}/addOnAttachments` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements.addOnAttachments) |
| `courses.announcements.addOnAttachments.delete` | `DELETE /v1/courses/{courseId}/announcements/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements.addOnAttachments) |
| `courses.announcements.addOnAttachments.get` | `GET /v1/courses/{courseId}/announcements/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements.addOnAttachments) |
| `courses.announcements.addOnAttachments.list` | `GET /v1/courses/{courseId}/announcements/{itemId}/addOnAttachments` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements.addOnAttachments) |
| `courses.announcements.addOnAttachments.patch` | `PATCH /v1/courses/{courseId}/announcements/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements.addOnAttachments) |
| `courses.announcements.create` | `POST /v1/courses/{courseId}/announcements` | `classroom.announcements` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.announcements.delete` | `DELETE /v1/courses/{courseId}/announcements/{id}` | `classroom.announcements` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.announcements.get` | `GET /v1/courses/{courseId}/announcements/{id}` | `classroom.announcements`, `classroom.announcements.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.announcements.getAddOnContext` | `GET /v1/courses/{courseId}/announcements/{itemId}/addOnContext` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.announcements.list` | `GET /v1/courses/{courseId}/announcements` | `classroom.announcements`, `classroom.announcements.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.announcements.modifyAssignees` | `POST /v1/courses/{courseId}/announcements/{id}:modifyAssignees` | `classroom.announcements` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.announcements.patch` | `PATCH /v1/courses/{courseId}/announcements/{id}` | `classroom.announcements` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.announcements) |
| `courses.courseWork.addOnAttachments.create` | `POST /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments) |
| `courses.courseWork.addOnAttachments.delete` | `DELETE /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments) |
| `courses.courseWork.addOnAttachments.get` | `GET /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments) |
| `courses.courseWork.addOnAttachments.list` | `GET /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments) |
| `courses.courseWork.addOnAttachments.patch` | `PATCH /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments) |
| `courses.courseWork.addOnAttachments.studentSubmissions.get` | `GET /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` | `classroom.addons.student`, `classroom.addons.teacher`, `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly`, `classroom.student-submissions.me.readonly`, `classroom.student-submissions.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments.studentSubmissions) |
| `courses.courseWork.addOnAttachments.studentSubmissions.list` | `GET /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}/studentSubmissions` | `classroom.addons.student`, `classroom.addons.teacher`, `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly`, `classroom.student-submissions.me.readonly`, `classroom.student-submissions.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments.studentSubmissions) |
| `courses.courseWork.addOnAttachments.studentSubmissions.patch` | `PATCH /v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.addOnAttachments.studentSubmissions) |
| `courses.courseWork.create` | `POST /v1/courses/{courseId}/courseWork` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.delete` | `DELETE /v1/courses/{courseId}/courseWork/{id}` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.get` | `GET /v1/courses/{courseId}/courseWork/{id}` | `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.getAddOnContext` | `GET /v1/courses/{courseId}/courseWork/{itemId}/addOnContext` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.list` | `GET /v1/courses/{courseId}/courseWork` | `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.modifyAssignees` | `POST /v1/courses/{courseId}/courseWork/{id}:modifyAssignees` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.patch` | `PATCH /v1/courses/{courseId}/courseWork/{id}` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork) |
| `courses.courseWork.rubrics.create` | `POST /v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.rubrics) |
| `courses.courseWork.rubrics.delete` | `DELETE /v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics/{id}` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.rubrics) |
| `courses.courseWork.rubrics.get` | `GET /v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics/{id}` | `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.rubrics) |
| `courses.courseWork.rubrics.list` | `GET /v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics` | `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.rubrics) |
| `courses.courseWork.rubrics.patch` | `PATCH /v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics/{id}` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.rubrics) |
| `courses.courseWork.studentSubmissions.get` | `GET /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}` | `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly`, `classroom.student-submissions.me.readonly`, `classroom.student-submissions.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWork.studentSubmissions.list` | `GET /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions` | `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly`, `classroom.student-submissions.me.readonly`, `classroom.student-submissions.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWork.studentSubmissions.modifyAttachments` | `POST /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:modifyAttachments` | `classroom.coursework.me`, `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWork.studentSubmissions.patch` | `PATCH /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}` | `classroom.coursework.me`, `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWork.studentSubmissions.reclaim` | `POST /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:reclaim` | `classroom.coursework.me` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWork.studentSubmissions.return` | `POST /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:return` | `classroom.coursework.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWork.studentSubmissions.turnIn` | `POST /v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:turnIn` | `classroom.coursework.me` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWork.studentSubmissions) |
| `courses.courseWorkMaterials.addOnAttachments.create` | `POST /v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials.addOnAttachments) |
| `courses.courseWorkMaterials.addOnAttachments.delete` | `DELETE /v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials.addOnAttachments) |
| `courses.courseWorkMaterials.addOnAttachments.get` | `GET /v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials.addOnAttachments) |
| `courses.courseWorkMaterials.addOnAttachments.list` | `GET /v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials.addOnAttachments) |
| `courses.courseWorkMaterials.addOnAttachments.patch` | `PATCH /v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials.addOnAttachments) |
| `courses.courseWorkMaterials.create` | `POST /v1/courses/{courseId}/courseWorkMaterials` | `classroom.courseworkmaterials` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials) |
| `courses.courseWorkMaterials.delete` | `DELETE /v1/courses/{courseId}/courseWorkMaterials/{id}` | `classroom.courseworkmaterials` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials) |
| `courses.courseWorkMaterials.get` | `GET /v1/courses/{courseId}/courseWorkMaterials/{id}` | `classroom.courseworkmaterials`, `classroom.courseworkmaterials.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials) |
| `courses.courseWorkMaterials.getAddOnContext` | `GET /v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnContext` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials) |
| `courses.courseWorkMaterials.list` | `GET /v1/courses/{courseId}/courseWorkMaterials` | `classroom.courseworkmaterials`, `classroom.courseworkmaterials.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials) |
| `courses.courseWorkMaterials.patch` | `PATCH /v1/courses/{courseId}/courseWorkMaterials/{id}` | `classroom.courseworkmaterials` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.courseWorkMaterials) |
| `courses.create` | `POST /v1/courses` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.delete` | `DELETE /v1/courses/{id}` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.get` | `GET /v1/courses/{id}` | `classroom.courses`, `classroom.courses.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.getGradingPeriodSettings` | `GET /v1/courses/{courseId}/gradingPeriodSettings` | `classroom.courses`, `classroom.courses.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.list` | `GET /v1/courses` | `classroom.courses`, `classroom.courses.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.patch` | `PATCH /v1/courses/{id}` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.posts.addOnAttachments.create` | `POST /v1/courses/{courseId}/posts/{postId}/addOnAttachments` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments) |
| `courses.posts.addOnAttachments.delete` | `DELETE /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments) |
| `courses.posts.addOnAttachments.get` | `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments) |
| `courses.posts.addOnAttachments.list` | `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments) |
| `courses.posts.addOnAttachments.patch` | `PATCH /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments) |
| `courses.posts.addOnAttachments.studentSubmissions.get` | `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` | `classroom.addons.student`, `classroom.addons.teacher`, `classroom.coursework.me`, `classroom.coursework.me.readonly`, `classroom.coursework.students`, `classroom.coursework.students.readonly`, `classroom.student-submissions.me.readonly`, `classroom.student-submissions.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments.studentSubmissions) |
| `courses.posts.addOnAttachments.studentSubmissions.patch` | `PATCH /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` | `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts.addOnAttachments.studentSubmissions) |
| `courses.posts.getAddOnContext` | `GET /v1/courses/{courseId}/posts/{postId}/addOnContext` | `classroom.addons.student`, `classroom.addons.teacher` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.posts) |
| `courses.studentGroups.create` | `POST /v1/courses/{courseId}/studentGroups` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups) |
| `courses.studentGroups.delete` | `DELETE /v1/courses/{courseId}/studentGroups/{id}` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups) |
| `courses.studentGroups.list` | `GET /v1/courses/{courseId}/studentGroups` | `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups) |
| `courses.studentGroups.patch` | `PATCH /v1/courses/{courseId}/studentGroups/{id}` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups) |
| `courses.studentGroups.studentGroupMembers.create` | `POST /v1/courses/{courseId}/studentGroups/{studentGroupId}/studentGroupMembers` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups.studentGroupMembers) |
| `courses.studentGroups.studentGroupMembers.delete` | `DELETE /v1/courses/{courseId}/studentGroups/{studentGroupId}/studentGroupMembers/{userId}` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups.studentGroupMembers) |
| `courses.studentGroups.studentGroupMembers.list` | `GET /v1/courses/{courseId}/studentGroups/{studentGroupId}/studentGroupMembers` | `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.studentGroups.studentGroupMembers) |
| `courses.students.create` | `POST /v1/courses/{courseId}/students` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.students) |
| `courses.students.delete` | `DELETE /v1/courses/{courseId}/students/{userId}` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.students) |
| `courses.students.get` | `GET /v1/courses/{courseId}/students/{userId}` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.students) |
| `courses.students.list` | `GET /v1/courses/{courseId}/students` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.students) |
| `courses.teachers.create` | `POST /v1/courses/{courseId}/teachers` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.teachers) |
| `courses.teachers.delete` | `DELETE /v1/courses/{courseId}/teachers/{userId}` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.teachers) |
| `courses.teachers.get` | `GET /v1/courses/{courseId}/teachers/{userId}` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.teachers) |
| `courses.teachers.list` | `GET /v1/courses/{courseId}/teachers` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.teachers) |
| `courses.topics.create` | `POST /v1/courses/{courseId}/topics` | `classroom.topics` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.topics) |
| `courses.topics.delete` | `DELETE /v1/courses/{courseId}/topics/{id}` | `classroom.topics` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.topics) |
| `courses.topics.get` | `GET /v1/courses/{courseId}/topics/{id}` | `classroom.topics`, `classroom.topics.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.topics) |
| `courses.topics.list` | `GET /v1/courses/{courseId}/topics` | `classroom.topics`, `classroom.topics.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.topics) |
| `courses.topics.patch` | `PATCH /v1/courses/{courseId}/topics/{id}` | `classroom.topics` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses.topics) |
| `courses.update` | `PUT /v1/courses/{id}` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `courses.updateGradingPeriodSettings` | `PATCH /v1/courses/{courseId}/gradingPeriodSettings` | `classroom.courses` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.courses) |
| `invitations.accept` | `POST /v1/invitations/{id}:accept` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.invitations) |
| `invitations.create` | `POST /v1/invitations` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.invitations) |
| `invitations.delete` | `DELETE /v1/invitations/{id}` | `classroom.rosters` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.invitations) |
| `invitations.get` | `GET /v1/invitations/{id}` | `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.invitations) |
| `invitations.list` | `GET /v1/invitations` | `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.invitations) |
| `registrations.create` | `POST /v1/registrations` | `classroom.push-notifications` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.registrations) |
| `registrations.delete` | `DELETE /v1/registrations/{registrationId}` | `classroom.push-notifications` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.registrations) |
| `userProfiles.get` | `GET /v1/userProfiles/{userId}` | `classroom.profile.emails`, `classroom.profile.photos`, `classroom.rosters`, `classroom.rosters.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles) |
| `userProfiles.guardianInvitations.create` | `POST /v1/userProfiles/{studentId}/guardianInvitations` | `classroom.guardianlinks.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardianInvitations) |
| `userProfiles.guardianInvitations.get` | `GET /v1/userProfiles/{studentId}/guardianInvitations/{invitationId}` | `classroom.guardianlinks.students`, `classroom.guardianlinks.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardianInvitations) |
| `userProfiles.guardianInvitations.list` | `GET /v1/userProfiles/{studentId}/guardianInvitations` | `classroom.guardianlinks.students`, `classroom.guardianlinks.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardianInvitations) |
| `userProfiles.guardianInvitations.patch` | `PATCH /v1/userProfiles/{studentId}/guardianInvitations/{invitationId}` | `classroom.guardianlinks.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardianInvitations) |
| `userProfiles.guardians.delete` | `DELETE /v1/userProfiles/{studentId}/guardians/{guardianId}` | `classroom.guardianlinks.students` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardians) |
| `userProfiles.guardians.get` | `GET /v1/userProfiles/{studentId}/guardians/{guardianId}` | `classroom.guardianlinks.me.readonly`, `classroom.guardianlinks.students`, `classroom.guardianlinks.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardians) |
| `userProfiles.guardians.list` | `GET /v1/userProfiles/{studentId}/guardians` | `classroom.guardianlinks.me.readonly`, `classroom.guardianlinks.students`, `classroom.guardianlinks.students.readonly` | [Reference](https://developers.google.com/workspace/classroom/reference/rest#v1.userProfiles.guardians) |

Each listed scope is an accepted alternative for that operation, not a scope that must be granted together with the other scopes in the row. `GOOGLE_CLASSROOM_OAUTH_SCOPES` is the smallest supported default set selected to cover all stable routes; read-only deployments can supply a smaller subset through `oauthScopes`.

## Pub/Sub registrations

`registrations.create` and `registrations.delete` manage Google's notification registrations and are included because their lifecycle is a normal REST resource operation. Creating one requires a valid Pub/Sub topic and Google Classroom's publish permission on that topic. This plugin does not implement a Pub/Sub message receiver or webhook callback.

## Deprecated but supported posts-based add-on routes

Google marks the legacy `courses.posts` add-on routes below deprecated and directs callers to the resource-specific `announcements`, `courseWork`, or `courseWorkMaterials` methods. They remain exposed for compatibility because the v1 methods are still documented.

| Operation | Method and path |
|---|---|
| `courses.posts.getAddOnContext` | `GET /v1/courses/{courseId}/posts/{postId}/addOnContext` |
| `courses.posts.addOnAttachments.create` | `POST /v1/courses/{courseId}/posts/{postId}/addOnAttachments` |
| `courses.posts.addOnAttachments.delete` | `DELETE /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` |
| `courses.posts.addOnAttachments.get` | `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` |
| `courses.posts.addOnAttachments.list` | `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments` |
| `courses.posts.addOnAttachments.patch` | `PATCH /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}` |
| `courses.posts.addOnAttachments.studentSubmissions.get` | `GET /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` |
| `courses.posts.addOnAttachments.studentSubmissions.patch` | `PATCH /v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}` |

## Add-ons and rubrics

`addOnToken` may be omitted for partner-first attachment creation when the creating project matches the project that created the parent post. For `getAddOnContext`, `attachmentId` may be omitted in the Attachment Discovery iframe; Google enforces the remaining token and project-match conditions. Rubric requests using `sourceSpreadsheetId` additionally need either `spreadsheets.readonly` or `spreadsheets`, which can be selected through `oauthScopes` but are not requested by default.

## Excluded routes

- `courses.checkAddOnCreationEligibility` — `GET /v1/courses/{courseId}:checkAddOnCreationEligibility`; marked deprecated in the [REST reference](https://developers.google.com/workspace/classroom/reference/rest/v1/courses/checkAddOnCreationEligibility).
- `courses.checkGradingPeriodsSetupEligibility` — `GET /v1/courses/{courseId}:checkGradingPeriodsSetupEligibility`; marked deprecated and Developer Preview in the [REST reference](https://developers.google.com/workspace/classroom/reference/rest/v1/courses/checkGradingPeriodsSetupEligibility).
- `userProfiles.checkUserCapability` — `GET /v1/userProfiles/{userId}:checkUserCapability`; Developer Preview, not stable v1, in the [REST reference](https://developers.google.com/workspace/classroom/reference/rest/v1/userProfiles/checkUserCapability).
- `courses.courseWork.updateRubric` (`PATCH /v1/courses/{courseId}/courseWork/{courseWorkId}/rubric`) — present in Discovery metadata but absent from the current REST method catalog (its method reference returns 404); use the documented plural rubrics resource instead.
- JSONP callbacks, query-string credentials, media/protobuf response formats, and upload protocol parameters — excluded because the supported Classroom methods use OAuth-authenticated JSON and expose no binary endpoint.

## Error handling and privacy

Core transport retries HTTP 429 responses using Google's `Retry-After` header; plugin handlers do not multiply these retries. Other failures are not retried automatically, so non-idempotent writes are never replayed by this plugin. Completion logs contain only the static operation ID; request data, student/guardian information, tokens, and response bodies are not logged. Errors from Corsair's transport are preserved so status and retry metadata remain available.

## References

- [REST API reference](https://developers.google.com/workspace/classroom/reference/rest)
- [OAuth scopes](https://developers.google.com/classroom/guides/auth)
- [Discovery document](https://classroom.googleapis.com/$discovery/rest?version=v1)
