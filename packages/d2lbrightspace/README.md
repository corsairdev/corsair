# @corsair-dev/d2lbrightspace

Manage users, roles, courses, grades, quizzes, and demographics in D2L Brightspace.

## Install

```bash
pnpm add @corsair-dev/d2lbrightspace
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `courses.create` | `d2lbrightspace.api.courses.create` | `write` | Create a course offering |
| `courses.delete` | `d2lbrightspace.api.courses.delete` | `destructive` | Archive a course offering |
| `courses.get` | `d2lbrightspace.api.courses.get` | `read` | Get a course offering |
| `courses.schema` | `d2lbrightspace.api.courses.schema` | `read` | Get course parent constraints |
| `courses.update` | `d2lbrightspace.api.courses.update` | `write` | Update a course offering |
| `demographics.deleteUser` | `d2lbrightspace.api.demographics.deleteUser` | `destructive` | Delete user demographics |
| `demographics.getOrgUnit` | `d2lbrightspace.api.demographics.getOrgUnit` | `read` | Get org unit demographics |
| `grades.access` | `d2lbrightspace.api.grades.access` | `read` | List users with access to a grade |
| `grades.create` | `d2lbrightspace.api.grades.create` | `write` | Create a grade object |
| `grades.delete` | `d2lbrightspace.api.grades.delete` | `destructive` | Delete a grade object |
| `grades.get` | `d2lbrightspace.api.grades.get` | `read` | Get a grade object |
| `grades.list` | `d2lbrightspace.api.grades.list` | `read` | List grade objects |
| `grades.setup` | `d2lbrightspace.api.grades.setup` | `read` | Get grade setup |
| `grades.statistics` | `d2lbrightspace.api.grades.statistics` | `read` | Get grade statistics |
| `grades.update` | `d2lbrightspace.api.grades.update` | `write` | Update a grade object |
| `grades.updateSetup` | `d2lbrightspace.api.grades.updateSetup` | `write` | Update grade setup |
| `quizCategories.create` | `d2lbrightspace.api.quizCategories.create` | `write` | Create a quiz category |
| `quizCategories.delete` | `d2lbrightspace.api.quizCategories.delete` | `destructive` | Delete a quiz category |
| `quizCategories.get` | `d2lbrightspace.api.quizCategories.get` | `read` | Get a quiz category |
| `quizCategories.list` | `d2lbrightspace.api.quizCategories.list` | `read` | List quiz categories |
| `quizCategories.update` | `d2lbrightspace.api.quizCategories.update` | `write` | Update a quiz category |
| `quizzes.access` | `d2lbrightspace.api.quizzes.access` | `read` | List users with quiz access |
| `quizzes.create` | `d2lbrightspace.api.quizzes.create` | `write` | Create a quiz |
| `quizzes.delete` | `d2lbrightspace.api.quizzes.delete` | `destructive` | Delete a quiz |
| `quizzes.get` | `d2lbrightspace.api.quizzes.get` | `read` | Get a quiz |
| `quizzes.getAttempt` | `d2lbrightspace.api.quizzes.getAttempt` | `read` | Get a quiz attempt |
| `quizzes.list` | `d2lbrightspace.api.quizzes.list` | `read` | List quizzes |
| `quizzes.listAttempts` | `d2lbrightspace.api.quizzes.listAttempts` | `read` | List quiz attempts |
| `quizzes.listQuestions` | `d2lbrightspace.api.quizzes.listQuestions` | `read` | List quiz questions |
| `quizzes.update` | `d2lbrightspace.api.quizzes.update` | `write` | Update a quiz |
| `roles.copy` | `d2lbrightspace.api.roles.copy` | `write` | Copy a role using the unsupported unstable API |
| `roles.get` | `d2lbrightspace.api.roles.get` | `read` | Get a role by ID |
| `roles.getEnrolled` | `d2lbrightspace.api.roles.getEnrolled` | `read` | List enrolled roles in an org unit |
| `roles.list` | `d2lbrightspace.api.roles.list` | `read` | List roles |
| `templates.create` | `d2lbrightspace.api.templates.create` | `write` | Create a course template |
| `templates.delete` | `d2lbrightspace.api.templates.delete` | `destructive` | Archive a course template |
| `templates.get` | `d2lbrightspace.api.templates.get` | `read` | Get a course template |
| `templates.schema` | `d2lbrightspace.api.templates.schema` | `read` | Get course template parent constraints |
| `templates.update` | `d2lbrightspace.api.templates.update` | `write` | Update a course template |
| `users.create` | `d2lbrightspace.api.users.create` | `write` | Create a user |
| `users.current` | `d2lbrightspace.api.users.current` | `read` | Get the current user |
| `users.delete` | `d2lbrightspace.api.users.delete` | `destructive` | Delete a user |
| `users.get` | `d2lbrightspace.api.users.get` | `read` | Get a user by ID |
| `users.list` | `d2lbrightspace.api.users.list` | `read` | List or search users |
| `users.update` | `d2lbrightspace.api.users.update` | `write` | Update a user |

## Auth

Set `baseUrl` to the HTTPS origin of your Brightspace instance. Authenticate with
an OAuth 2.0 access token or a Corsair OAuth connection. The default scope is
`users:own_profile:read`; set `scopes` to the permissions registered for the
operations your application needs. See the [Brightspace scope reference](https://docs.valence.desire2learn.com/http-scopestable.html).
Routes without a specific documented scope require Brightspace's `core:*:*`
fallback scope. OAuth connections use the authorization-code grant; a token
obtained separately through a client-credentials grant can be supplied as `key`.
Enable refresh tokens in the Brightspace application registration if the
connection should refresh expired tokens.

The plugin uses LP 1.62 for users, courses, and demographics; LP 1.49 for
stable role and current-user routes; and LE 1.82 for grades and quizzes. Role
copying uses D2L's unsupported `unstable` API and may change without notice.
For paged results, pass a bookmark or the returned `Next` URL as appropriate;
`Next` URLs must point to the same instance and endpoint.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/d2lbrightspace

## License

Apache-2.0
