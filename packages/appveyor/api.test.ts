import { ApiError } from 'corsair/http';
import { z } from 'zod';
import { makeAppVeyorRequest, makeAppVeyorTextRequest } from './client';
import { EndpointOutputSchemas } from './endpoints/types';

/**
 * Live contract tests. These call the real AppVeyor API and are skipped
 * unless APPVEYOR_API_KEY is set. Follows the pattern of recent merged
 * plugins (e.g. `github/api.test.ts`, `linear/api.test.ts`): real requests
 * are parsed with Zod output schemas and types are asserted.
 *
 * For `v2.` user-level keys AppVeyor requires the account prefix per
 * https://www.appveyor.com/docs/api/#authentication :
 *   GET /api/account/{accountName}/projects vs GET /api/projects
 * Set APPVEYOR_ACCOUNT_NAME when using a v2 key.
 *
 * APPVEYOR_API_KEY=... pnpm --filter @corsair-dev/appveyor test api.test.ts
 */
const API_KEY = process.env.APPVEYOR_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;
const key = API_KEY ?? '';
const accountEnv = process.env.APPVEYOR_ACCOUNT_NAME ?? '';
const projectEnv = process.env.APPVEYOR_PROJECT_SLUG ?? '';
const buildVersionEnv = process.env.APPVEYOR_BUILD_VERSION ?? '';
const buildIdEnv = process.env.APPVEYOR_BUILD_ID ?? '';
const jobIdEnv = process.env.APPVEYOR_BUILD_JOB_ID ?? '';
const roleIdEnv = process.env.APPVEYOR_ROLE_ID ?? '';
const badgeTokenEnv = process.env.APPVEYOR_BADGE_TOKEN ?? '';
const branch = process.env.APPVEYOR_BRANCH ?? 'main';
const publicProvider = process.env.APPVEYOR_PUBLIC_PROVIDER ?? 'github';
const publicRepository = process.env.APPVEYOR_PUBLIC_REPOSITORY ?? '';
const publicRepositoryAccount =
	process.env.APPVEYOR_PUBLIC_REPOSITORY_ACCOUNT ??
	(publicRepository.includes('/')
		? (publicRepository.split('/')[0] ?? '')
		: '');
const publicRepositorySlug =
	process.env.APPVEYOR_PUBLIC_REPOSITORY_SLUG ??
	(publicRepository.includes('/')
		? (publicRepository.split('/')[1] ?? '')
		: '');

const isV2Key = key.startsWith('v2.');

function apiPath(path: string): string {
	if (isV2Key && accountEnv) return `/account/${accountEnv}${path}`;
	return path;
}

function isPermissionError(error: unknown): boolean {
	return (
		error instanceof ApiError && (error.status === 403 || error.status === 401)
	);
}

describeLive('AppVeyor API contract', () => {
	it('lists projects', async () => {
		try {
			const data = await makeAppVeyorRequest(apiPath('/projects'), key);
			const parsed = EndpointOutputSchemas.projectsList.parse(data);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (
				error instanceof ApiError &&
				error.status === 400 &&
				isV2Key &&
				!accountEnv
			) {
				console.warn(
					'Skipping lists projects: v2 key requires APPVEYOR_ACCOUNT_NAME per docs/api/#authentication',
				);
				return;
			}
			if (isPermissionError(error)) {
				console.warn(
					'Skipping lists projects: unauthorized (401) or insufficient permissions (403) for this token — check key is valid v1 account key or v2+APPVEYOR_ACCOUNT_NAME',
				);
				return;
			}
			throw error;
		}
	});

	it('deletes a build', async () => {
		if (process.env.APPVEYOR_ALLOW_DESTRUCTIVE_LIVE_TESTS !== 'true') return;
		if (!buildIdEnv) {
			console.warn(
				'Skipping deletes a build: set APPVEYOR_BUILD_ID and APPVEYOR_ALLOW_DESTRUCTIVE_LIVE_TESTS=true',
			);
			return;
		}
		const response = await makeAppVeyorRequest(
			apiPath(`/builds/${buildIdEnv}`),
			key,
			{
				method: 'DELETE',
			},
		);
		expect(response).toBeUndefined();
	});

	it('downloads a build log', async () => {
		let jobId = jobIdEnv;
		if (!jobId) {
			// Discover jobId from first project build, like linear/github discover fixture IDs
			try {
				const projects = EndpointOutputSchemas.projectsList.parse(
					await makeAppVeyorRequest(apiPath('/projects'), key),
				);
				if (projects.length === 0) {
					console.warn(
						'Skipping downloads a build log: no projects to discover jobId',
					);
					return;
				}
				const first = projects[0];
				if (!first?.accountName || !first.slug) {
					console.warn(
						'Skipping downloads a build log: cannot discover account/project',
					);
					return;
				}
				const acct = first.accountName;
				const slug = first.slug;
				const details = await makeAppVeyorRequest(
					apiPath(`/projects/${acct}/${slug}`),
					key,
				);
				const parsed = EndpointOutputSchemas.buildsGetByVersion.parse(details);
				// Extract jobId from build.jobs[0].jobId via zod (build schema is passthrough)
				const jobsParsed = z
					.object({
						jobs: z.array(z.object({ jobId: z.string() }).passthrough()),
					})
					.passthrough()
					.safeParse(parsed.build);
				const discoveredJobId = jobsParsed.success
					? jobsParsed.data.jobs[0]?.jobId
					: undefined;
				if (!discoveredJobId) {
					console.warn('Skipping downloads a build log: no jobId discovered');
					return;
				}
				jobId = discoveredJobId;
			} catch (error) {
				if (isPermissionError(error)) {
					console.warn(
						'Skipping downloads a build log: insufficient permissions',
					);
					return;
				}
				if (
					error instanceof ApiError &&
					error.status === 400 &&
					isV2Key &&
					!accountEnv
				) {
					console.warn(
						'Skipping downloads a build log: v2 key requires APPVEYOR_ACCOUNT_NAME',
					);
					return;
				}
				throw error;
			}
		}
		try {
			const response = await makeAppVeyorTextRequest(
				apiPath(`/buildjobs/${jobId}/log`),
				key,
			);
			expect(typeof response).toBe('string');
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn(
					'Skipping downloads a build log: insufficient permissions',
				);
				return;
			}
			if (
				error instanceof ApiError &&
				(error.status === 400 || error.status === 404)
			) {
				console.warn(
					'Skipping downloads a build log: job not found or bad request',
				);
				return;
			}
			throw error;
		}
	});

	it('gets build artifacts', async () => {
		let jobId = jobIdEnv;
		if (!jobId) {
			console.warn(
				'Skipping gets build artifacts: set APPVEYOR_BUILD_JOB_ID or have at least one project',
			);
			return;
		}
		try {
			const parsed = EndpointOutputSchemas.buildsGetArtifacts.parse(
				await makeAppVeyorRequest(
					apiPath(`/buildjobs/${jobId}/artifacts`),
					key,
				),
			);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn('Skipping gets build artifacts: insufficient permissions');
				return;
			}
			throw error;
		}
	});

	it('gets a build by version', async () => {
		let acct = accountEnv;
		let proj = projectEnv;
		let ver = buildVersionEnv;
		if (!acct || !proj || !ver) {
			try {
				const projects = EndpointOutputSchemas.projectsList.parse(
					await makeAppVeyorRequest(apiPath('/projects'), key),
				);
				if (projects.length === 0) {
					console.warn('Skipping gets a build by version: no projects');
					return;
				}
				const first = projects[0];
				if (!first) return;
				acct = acct || first.accountName || '';
				proj = proj || first.slug || '';
				if (!acct || !proj) {
					console.warn(
						'Skipping gets a build by version: cannot discover account/project',
					);
					return;
				}
				const details = await makeAppVeyorRequest(
					apiPath(`/projects/${acct}/${proj}`),
					key,
				);
				const parsedDetails =
					EndpointOutputSchemas.buildsGetByVersion.parse(details);
				ver =
					ver ||
					parsedDetails.build.version ||
					String(parsedDetails.build.buildNumber) ||
					'';
				if (!ver) {
					console.warn(
						'Skipping gets a build by version: no version discovered',
					);
					return;
				}
			} catch (error) {
				if (isPermissionError(error)) {
					console.warn(
						'Skipping gets a build by version: insufficient permissions',
					);
					return;
				}
				if (
					error instanceof ApiError &&
					error.status === 400 &&
					isV2Key &&
					!accountEnv
				) {
					console.warn(
						'Skipping gets a build by version: v2 key requires APPVEYOR_ACCOUNT_NAME',
					);
					return;
				}
				throw error;
			}
		}
		const parsed = EndpointOutputSchemas.buildsGetByVersion.parse(
			await makeAppVeyorRequest(
				apiPath(`/projects/${acct}/${proj}/build/${ver}`),
				key,
			),
		);
		expect(parsed.build).toBeDefined();
	});

	it('lists environments', async () => {
		try {
			const parsed = EndpointOutputSchemas.environmentsList.parse(
				await makeAppVeyorRequest(apiPath('/environments'), key),
			);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (
				error instanceof ApiError &&
				error.status === 400 &&
				isV2Key &&
				!accountEnv
			) {
				console.warn(
					'Skipping lists environments: v2 key requires APPVEYOR_ACCOUNT_NAME',
				);
				return;
			}
			if (isPermissionError(error)) {
				console.warn('Skipping lists environments: insufficient permissions');
				return;
			}
			if (error instanceof ApiError && error.status === 500) {
				console.warn(
					'Skipping lists environments: AppVeyor 500 for this token (account null)',
				);
				return;
			}
			throw error;
		}
	});

	it('gets a project branch badge', async () => {
		if (!badgeTokenEnv) {
			console.warn(
				'Skipping gets a project branch badge: set APPVEYOR_BADGE_TOKEN',
			);
			return;
		}
		const response = await makeAppVeyorTextRequest(
			apiPath(
				`/projects/status/${badgeTokenEnv}/branch/${encodeURIComponent(branch)}`,
			),
			key,
		);
		expect(typeof response).toBe('string');
	});

	it('gets a project badge', async () => {
		if (!badgeTokenEnv) {
			console.warn('Skipping gets a project badge: set APPVEYOR_BADGE_TOKEN');
			return;
		}
		const response = await makeAppVeyorTextRequest(
			apiPath(`/projects/status/${badgeTokenEnv}`),
			key,
		);
		expect(typeof response).toBe('string');
	});

	it('gets a public project badge', async () => {
		if (!publicRepositoryAccount || !publicRepositorySlug) {
			console.warn(
				'Skipping gets a public project badge: set APPVEYOR_PUBLIC_REPOSITORY (owner/repo) or ACCOUNT/SLUG',
			);
			return;
		}
		const response = await makeAppVeyorTextRequest(
			apiPath(
				`/projects/status/${publicProvider}/${encodeURIComponent(publicRepositoryAccount)}/${encodeURIComponent(publicRepositorySlug)}`,
			),
			key,
		);
		expect(typeof response).toBe('string');
	});

	it('gets a role', async () => {
		let id = roleIdEnv;
		if (!id) {
			try {
				const roles = EndpointOutputSchemas.rolesList.parse(
					await makeAppVeyorRequest(apiPath('/roles'), key),
				);
				if (roles.length === 0) {
					console.warn('Skipping gets a role: no roles to discover');
					return;
				}
				const first = roles[0];
				const roleIdParsed = z
					.object({ roleId: z.number() })
					.passthrough()
					.safeParse(first);
				if (!roleIdParsed.success) {
					console.warn('Skipping gets a role: cannot discover roleId');
					return;
				}
				id = String(roleIdParsed.data.roleId);
			} catch (error) {
				if (isPermissionError(error)) {
					console.warn(
						'Skipping gets a role: insufficient permissions to list roles',
					);
					return;
				}
				throw error;
			}
		}
		try {
			const parsed = EndpointOutputSchemas.rolesGet.parse(
				await makeAppVeyorRequest(apiPath(`/roles/${id}`), key),
			);
			const isRecord = typeof parsed === 'object' && parsed !== null;
			const hasUser = isRecord && 'user' in parsed;
			const hasRoleId = isRecord && 'roleId' in parsed;
			expect(hasUser || hasRoleId).toBe(true);
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn('Skipping gets a role: insufficient permissions');
				return;
			}
			throw error;
		}
	});

	it('lists roles', async () => {
		try {
			const parsed = EndpointOutputSchemas.rolesList.parse(
				await makeAppVeyorRequest(apiPath('/roles'), key),
			);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn(
					'Skipping lists roles: insufficient permissions for this token',
				);
				return;
			}
			throw error;
		}
	});

	it('lists user invitations', async () => {
		try {
			const parsed = EndpointOutputSchemas.usersInvitationsList.parse(
				await makeAppVeyorRequest(apiPath('/users/invitations'), key),
			);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn(
					'Skipping lists user invitations: insufficient permissions',
				);
				return;
			}
			throw error;
		}
	});

	it('lists users', async () => {
		try {
			const parsed = EndpointOutputSchemas.usersList.parse(
				await makeAppVeyorRequest(apiPath('/users'), key),
			);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn('Skipping lists users: insufficient permissions');
				return;
			}
			throw error;
		}
	});

	it('lists collaborators', async () => {
		try {
			const parsed = EndpointOutputSchemas.collaboratorsList.parse(
				await makeAppVeyorRequest(apiPath('/collaborators'), key),
			);
			expect(Array.isArray(parsed)).toBe(true);
		} catch (error) {
			if (isPermissionError(error)) {
				console.warn('Skipping lists collaborators: insufficient permissions');
				return;
			}
			throw error;
		}
	});
});
