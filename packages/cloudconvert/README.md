# @corsair-dev/cloudconvert

CloudConvert integration plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloudconvert
```

## Operations

The plugin exposes the documented CloudConvert Jobs and Tasks REST operations, plus operation/format discovery and the authenticated user endpoint. Task creation is part of `POST /v2/jobs`; the two export helpers remain convenience facades over that route.

| Corsair operation | Method and path | Required scope | Provider documentation |
| --- | --- | --- | --- |
| `jobs.create` | `POST /v2/jobs` | `task.write` | [Create job](https://cloudconvert.com/docs/api-reference/jobs#create-job) |
| `jobs.createAndWait` | `POST https://sync.api.cloudconvert.com/v2/jobs` | `task.write` | [Create job and wait](https://cloudconvert.com/docs/api-reference/jobs#create-job-and-wait) |
| `jobs.get` | `GET /v2/jobs/{ID}` | `task.read` | [Show job](https://cloudconvert.com/docs/api-reference/jobs#show-job) |
| `jobs.wait` | `GET https://sync.api.cloudconvert.com/v2/jobs/{ID}` | `task.read` | [Wait for job](https://cloudconvert.com/docs/api-reference/jobs#wait-for-job) |
| `jobs.list` | `GET /v2/jobs` | `task.read` | [List jobs](https://cloudconvert.com/docs/api-reference/jobs#list-jobs) |
| `jobs.remove` | `DELETE /v2/jobs/{ID}` | `task.write` | [Delete job](https://cloudconvert.com/docs/api-reference/jobs#delete-job) |
| `tasks.createExportGoogleCloudStorage` | `POST /v2/jobs` | `task.write` | [GCS export](https://cloudconvert.com/docs/import-export/export-files#google-cloud-storage), [Create job](https://cloudconvert.com/docs/api-reference/jobs#create-job) |
| `tasks.createExportS3` | `POST /v2/jobs` | `task.write` | [S3 export](https://cloudconvert.com/docs/import-export/export-files#s3), [Create job](https://cloudconvert.com/docs/api-reference/jobs#create-job) |
| `tasks.list` | `GET /v2/tasks` | `task.read` | [List tasks](https://cloudconvert.com/docs/api-reference/tasks#list-tasks) |
| `tasks.get` | `GET /v2/tasks/{ID}` | `task.read` | [Show task](https://cloudconvert.com/docs/api-reference/tasks#show-task) |
| `tasks.wait` | `GET https://sync.api.cloudconvert.com/v2/tasks/{ID}` | `task.read` | [Wait for task](https://cloudconvert.com/docs/api-reference/tasks#wait-for-task) |
| `tasks.cancel` | `POST /v2/tasks/{ID}/cancel` | `task.write` | [Cancel task](https://cloudconvert.com/docs/api-reference/tasks#cancel-task) |
| `tasks.retry` | `POST /v2/tasks/{ID}/retry` | `task.write` | [Retry task](https://cloudconvert.com/docs/api-reference/tasks#retry-task) |
| `tasks.remove` | `DELETE /v2/tasks/{ID}` | `task.write` | [Delete task](https://cloudconvert.com/docs/api-reference/tasks#delete-task) |
| `operations.list` | `GET /v2/operations` | No scope documented | [List operations](https://cloudconvert.com/docs/api-reference/operations#list-operations) |
| `formats.listSupported` | `GET /v2/operations` | No scope documented | [List operations](https://cloudconvert.com/docs/api-reference/operations#list-operations) |
| `users.show` | `GET /v2/users/me` | `user.read` | [Show user](https://cloudconvert.com/docs/api-reference/users#show-user) |

`jobs.create` and `jobs.createAndWait` accept generic task graphs: each task needs a documented `operation`, while operation-specific JSON options remain extensible. Task names are restricted to letters, numbers, hyphens and underscores; a job can contain at most 2,000 tasks. `jobs.list` supports the documented status, tag and access-token filters, `include: ['tasks']`, and `perPage` values from 1 to 1,000. CloudConvert credential fields such as `private_key` and `secret_access_key` are rejected in task arguments; store export credentials with the encrypted key manager instead.

```ts
const tenant = corsair.withTenant('acme');
const job = await tenant.cloudconvert.api.jobs.create({
	tasks: {
		'import-file': {
			operation: 'import/url',
			url: 'https://example.test/input.docx',
		},
		convert: {
			operation: 'convert',
			input: 'import-file',
			output_format: 'pdf',
		},
		export_file: {
			operation: 'export/url',
			input: 'convert',
		},
	},
	tag: 'request-123',
});

// For short jobs, wait for completion and read the export task's download URL.
const completed = await tenant.cloudconvert.api.jobs.wait({ jobId: job.data.id });
const downloadUrl = completed.data.tasks
	?.find((task) => task.name === 'export_file')
	?.result?.files?.[0]?.url;
```

## Authentication

Configure a CloudConvert API key. Requests use `Authorization: Bearer <API_KEY>`; create keys and select scopes in the [CloudConvert API dashboard](https://cloudconvert.com/dashboard/api/v2/keys). Select the per-operation scopes in the table above. [Authentication and scopes](https://cloudconvert.com/docs/getting-started/introduction#authentication).

## Export credentials

The GCS and S3 export helpers create a job because CloudConvert documents task creation as part of `POST /v2/jobs`. They accept source tasks and add the requested export task to that same job. Store provider credentials in Corsair's encrypted, per-tenant key manager before calling them; do not pass credentials as endpoint or task arguments:

```ts
const tenant = corsair.withTenant('acme');

await tenant.cloudconvert.keys.set_export_gcs_project_id('project-id');
await tenant.cloudconvert.keys.set_export_gcs_client_email(
	'service-account@example.test',
);
await tenant.cloudconvert.keys.set_export_gcs_private_key(
	process.env.CLOUDCONVERT_GCS_PRIVATE_KEY!,
);

await tenant.cloudconvert.keys.set_export_s3_access_key_id(
	process.env.CLOUDCONVERT_S3_ACCESS_KEY_ID!,
);
await tenant.cloudconvert.keys.set_export_s3_secret_access_key(
	process.env.CLOUDCONVERT_S3_SECRET_ACCESS_KEY!,
);
// Set this only when using temporary AWS credentials.
await tenant.cloudconvert.keys.set_export_s3_session_token(
	process.env.CLOUDCONVERT_S3_SESSION_TOKEN ?? null,
);
```

The export helpers resolve these credentials locally after permission checks, then send them to CloudConvert. They are not included in the validated endpoint arguments or plugin event logs, and propagated CloudConvert API errors redact credential fields from their request details. When an endpoint requires approval (including strict mode), Corsair currently records raw incoming arguments before endpoint schema validation; a malformed request that manually includes secret fields as unknown arguments could still put them in `corsair_permissions` or a hosted Hub approval request. Never include credentials in endpoint arguments.

## Synchronous operations and redirects

CloudConvert warns that its synchronous job/task endpoints can time out for long-running work. Prefer `jobs.create` followed by `jobs.get` or `tasks.get` for long jobs. `jobs.createAndWait`, `jobs.wait` and `tasks.wait` are included for short synchronous workflows. Their per-request timeout defaults to 5 minutes and can be configured with `cloudconvert({ syncTimeoutMs })` up to 10 minutes; the asynchronous routes remain available for long-running work.

The provider's `redirect=true` option returns the `export/url` file as raw/binary content. The shared Corsair HTTP transport decodes non-JSON responses as text, so `jobs.createAndWait`, `jobs.get` and `jobs.wait` reject `redirect: true` rather than claiming to return a JSON job. Omit `redirect` or set it to `false` to receive the documented job response.

## Pagination

`jobs.list` and `tasks.list` use CloudConvert's `per_page` and `page` parameters (default 100, maximum 1,000). The operations discovery endpoint documents filters but no pagination parameters.

## Webhooks

No webhook operations or webhook fields are exposed. In particular, the provider's optional job `webhook_url` field is intentionally excluded; CloudConvert's outbound notifications are outside this plugin's supported surface.

## References

- [CloudConvert API v2 introduction](https://cloudconvert.com/docs/getting-started/introduction)
- [Jobs](https://cloudconvert.com/docs/api-reference/jobs)
- [Tasks](https://cloudconvert.com/docs/api-reference/tasks)
- [Operations](https://cloudconvert.com/docs/api-reference/operations)
- [Export files](https://cloudconvert.com/docs/import-export/export-files)
- [Users](https://cloudconvert.com/docs/api-reference/users)
