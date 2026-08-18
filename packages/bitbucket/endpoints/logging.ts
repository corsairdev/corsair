const safeNames = new Set([
	'workspace',
	'repo_slug',
	'commit',
	'revision',
	'spec',
	'revspec',
	'pull_request_id',
	'issue_id',
	'comment_id',
	'reportId',
	'annotationId',
	'encoded_id',
	'environment_uuid',
	'pipeline_uuid',
	'variable_uuid',
	'page',
	'pagelen',
	'state',
	'role',
	'sort',
	'max_depth',
	'subject_type',
]);
export function bitbucketAuditPayload(
	input: Record<string, unknown>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(input).filter(
			([name, value]) =>
				safeNames.has(name) &&
				['string', 'number', 'boolean'].includes(typeof value),
		),
	) as Record<string, string | number | boolean>;
}
