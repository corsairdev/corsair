import type { EndpointMeta } from './common';

export const vercelDeploymentsMeta = {
	getDeployments: {
		riskLevel: 'read',
		description:
			'List deployments, newest first, filtered by project, environment, state, branch, commit or creator. Page with until = pagination.next.',
	},
	getDeployment: {
		riskLevel: 'read',
		description:
			'Get one deployment by id or hostname: readyState (QUEUED, BUILDING, READY, ERROR, CANCELED), URL, aliases, creator, Git metadata and error details.',
	},
	createDeployment: {
		// Builds use billable build minutes, and a production deploy replaces
		// the live site (R8: spends money).
		riskLevel: 'destructive',
		description:
			'Start a deployment from a Git ref, from inline files, or as a redeploy of an existing deployment. It builds in the background: follow readyState with getDeployment. target production replaces the live site once ready.',
		job: {
			idPath: 'id',
			status: {
				op: 'deployments.getDeployment',
				idArg: 'idOrUrl',
				statusPath: 'readyState',
				done: ['READY'],
				failed: ['ERROR', 'CANCELED'],
			},
			cancel: { op: 'deployments.cancelDeployment', idArg: 'deploymentId' },
		},
	},
	cancelDeployment: {
		riskLevel: 'write',
		description:
			'Stop a deployment that is still queued or building. Fails with 400 once it is READY, ERROR or already CANCELED. Redeploy to build it again.',
	},
	deleteDeployment: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a deployment by id or hostname. Its URL stops serving and its build output and logs are gone. Cannot be undone.',
	},
	getDeploymentEvents: {
		riskLevel: 'read',
		description:
			'Read the build logs of a deployment: stdout/stderr lines and state changes, oldest first by default. Returns what has been logged so far; it does not wait for new lines.',
	},
	getDeploymentFiles: {
		riskLevel: 'read',
		description:
			'Get the source file tree of a deployment made with the CLI or the API files field. Git deployments have no file tree and return 404.',
	},
} as const satisfies Record<string, EndpointMeta>;
