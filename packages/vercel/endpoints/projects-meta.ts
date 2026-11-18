import type { EndpointMeta } from './common';

export const vercelProjectsMeta = {
	getProjects: {
		riskLevel: 'read',
		description:
			'List projects in the team, newest first, with optional search and repo filters.',
	},
	getProject: {
		riskLevel: 'read',
		description:
			'Get a project by id or name, with its settings and latest deployments.',
	},
	createProject: {
		riskLevel: 'write',
		description:
			'Create a project, optionally connected to a Git repo and with initial environment variables.',
	},
	updateProject: {
		riskLevel: 'write',
		description:
			'Update project settings: name, framework, build/dev/install commands, Node version, protection.',
	},
	deleteProject: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a project with all its deployments, domains and environment variables. Cannot be undone.',
	},
	pauseProject: {
		riskLevel: 'write',
		description:
			'Pause a project: its production deployment stops serving until unpaused.',
	},
	unpauseProject: {
		riskLevel: 'write',
		description: 'Unpause a paused project so production serves again.',
	},
	promoteDeployment: {
		riskLevel: 'write',
		description:
			'Make an existing production build (an earlier or staged production deployment) the live production deployment, without rebuilding. Vercel refuses preview deployments (422); redeploy those with target production instead. Runs in the background: getProject with rollbackInfo shows its jobStatus.',
	},
	rollbackDeployment: {
		riskLevel: 'write',
		description:
			'Roll production back to an earlier deployment (Instant Rollback).',
	},
	getProjectMembers: {
		riskLevel: 'read',
		description: 'List the members of a project and their project roles.',
	},
} as const satisfies Record<string, EndpointMeta>;
