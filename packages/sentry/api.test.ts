import 'dotenv/config';
import { makeSentryRequest } from './client';
import type { SentryEndpointOutputs } from './endpoints/types';
import { SentryEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.SENTRY_PERSONAL_TOKEN!;

describe('Sentry API Type Tests', () => {
	describe('organizations', () => {
		it('organizationsList returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });

			SentryEndpointOutputSchemas.organizationsList.parse(response);
		});

		it('organizationsGet returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });

			const orgSlug = listResponse[0]?.slug;
			if (!orgSlug) {
				throw new Error('No organizations found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['organizationsGet']
			>(`organizations/${orgSlug}/`, TEST_TOKEN, { method: 'GET' });

			SentryEndpointOutputSchemas.organizationsGet.parse(response);
		});
	});

	describe('projects', () => {
		let orgSlug: string;
		let teamSlug: string;
		let createdProjectSlug: string | undefined;

		beforeAll(async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });
			const orgs = listResponse;
			const slug = orgs[0]?.slug;
			if (!slug) {
				throw new Error('No organizations found');
			}
			orgSlug = slug;
			const teamsResponse = await makeSentryRequest<
				SentryEndpointOutputs['teamsList']
			>(`organizations/${orgSlug}/teams/`, TEST_TOKEN, {
				method: 'GET',
			});
			const teams = Array.isArray(teamsResponse) ? teamsResponse : [];
			const tSlug = teams[0]?.slug;
			if (!tSlug) {
				throw new Error('No teams found');
			}
			teamSlug = tSlug;
		});

		it('projectsList returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['projectsList']
			>(`organizations/${orgSlug}/projects/`, TEST_TOKEN, {
				method: 'GET',
			});

			SentryEndpointOutputSchemas.projectsList.parse(response);
		});

		it('projectsGet returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['projectsList']
			>(`organizations/${orgSlug}/projects/`, TEST_TOKEN, {
				method: 'GET',
			});
			const projects = Array.isArray(listResponse) ? listResponse : [];
			const projectSlug = projects[0]?.slug;
			if (!projectSlug) {
				throw new Error('No projects found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['projectsGet']
			>(`projects/${orgSlug}/${projectSlug}/`, TEST_TOKEN, { method: 'GET' });

			SentryEndpointOutputSchemas.projectsGet.parse(response);
		});

		it('projectsCreate returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['projectsCreate']
			>(`teams/${orgSlug}/${teamSlug}/projects/`, TEST_TOKEN, {
				method: 'POST',
				body: {
					name: `test-project-${Date.now()}`,
					platform: 'node',
				},
			});

			const parsed = SentryEndpointOutputSchemas.projectsCreate.parse(response);
			createdProjectSlug = parsed.slug;
		});

		it('projectsUpdate returns correct type', async () => {
			let projectSlug = createdProjectSlug;
			if (!projectSlug) {
				const listResponse = await makeSentryRequest<
					SentryEndpointOutputs['projectsList']
				>(`organizations/${orgSlug}/projects/`, TEST_TOKEN, {
					method: 'GET',
				});
				const projects = Array.isArray(listResponse) ? listResponse : [];
				const pSlug = projects[0]?.slug;
				if (!pSlug) {
					throw new Error('No projects found for update test');
				}
				projectSlug = pSlug;
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['projectsUpdate']
			>(`projects/${orgSlug}/${projectSlug}/`, TEST_TOKEN, {
				method: 'PUT',
				body: { isBookmarked: false },
			});

			SentryEndpointOutputSchemas.projectsUpdate.parse(response);
		});
	});

	describe('events', () => {
		let orgSlug: string;
		let projectSlug: string;

		beforeAll(async () => {
			const orgsResponse = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });
			const orgs = Array.isArray(orgsResponse) ? orgsResponse : [];
			const oSlug = orgs[0]?.slug;
			if (!oSlug) {
				throw new Error('No organizations found');
			}
			orgSlug = oSlug;
			const projectsResponse = await makeSentryRequest<
				SentryEndpointOutputs['projectsList']
			>(`organizations/${orgSlug}/projects/`, TEST_TOKEN, {
				method: 'GET',
			});
			const projects = Array.isArray(projectsResponse) ? projectsResponse : [];
			const pSlug = projects[0]?.slug;
			if (!pSlug) {
				throw new Error('No projects found');
			}
			projectSlug = pSlug;
		});

		it('eventsList returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['eventsList']
			>(`projects/${orgSlug}/${projectSlug}/events/`, TEST_TOKEN, {
				method: 'GET',
			});

			SentryEndpointOutputSchemas.eventsList.parse(response);
		});

		it('eventsGet returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['eventsList']
			>(`projects/${orgSlug}/${projectSlug}/events/`, TEST_TOKEN, {
				method: 'GET',
			});
			const events = Array.isArray(listResponse) ? listResponse : [];
			const eventId = events[0]?.eventID;
			if (!eventId) {
				throw new Error('No events found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['eventsGet']
			>(`projects/${orgSlug}/${projectSlug}/events/${eventId}/`, TEST_TOKEN, {
				method: 'GET',
			});

			SentryEndpointOutputSchemas.eventsGet.parse(response);
		});
	});

	describe('issues', () => {
		let orgSlug: string;
		let projectSlug: string;

		beforeAll(async () => {
			const orgsResponse = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });
			const orgs = Array.isArray(orgsResponse) ? orgsResponse : [];
			const oSlug = orgs[0]?.slug;
			if (!oSlug) {
				throw new Error('No organizations found');
			}
			orgSlug = oSlug;
			const projectsResponse = await makeSentryRequest<
				SentryEndpointOutputs['projectsList']
			>(`organizations/${orgSlug}/projects/`, TEST_TOKEN, {
				method: 'GET',
			});
			const projects = Array.isArray(projectsResponse) ? projectsResponse : [];
			const pSlug = projects[0]?.slug;
			if (!pSlug) {
				throw new Error('No projects found');
			}
			projectSlug = pSlug;
		});

		it('issuesList returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['issuesList']
			>(`projects/${orgSlug}/${projectSlug}/issues/`, TEST_TOKEN, {
				method: 'GET',
			});

			SentryEndpointOutputSchemas.issuesList.parse(response);
		});

		it('issuesGet returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['issuesList']
			>(`projects/${orgSlug}/${projectSlug}/issues/`, TEST_TOKEN, {
				method: 'GET',
			});
			const issues = Array.isArray(listResponse) ? listResponse : [];
			const issueId = issues[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['issuesGet']
			>(`issues/${issueId}/`, TEST_TOKEN, { method: 'GET' });

			SentryEndpointOutputSchemas.issuesGet.parse(response);
		});

		it('issuesUpdate returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['issuesList']
			>(`projects/${orgSlug}/${projectSlug}/issues/`, TEST_TOKEN, {
				method: 'GET',
			});
			const issues = Array.isArray(listResponse) ? listResponse : [];
			const issueId = issues[0]?.id;
			if (!issueId) {
				throw new Error('No issues found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['issuesUpdate']
			>(`issues/${issueId}/`, TEST_TOKEN, {
				method: 'PUT',
				body: { hasSeen: true },
			});

			SentryEndpointOutputSchemas.issuesUpdate.parse(response);
		});
	});

	describe('teams', () => {
		let orgSlug: string;

		beforeAll(async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });
			const orgs = Array.isArray(listResponse) ? listResponse : [];
			const slug = orgs[0]?.slug;
			if (!slug) {
				throw new Error('No organizations found');
			}
			orgSlug = slug;
		});

		it('teamsList returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['teamsList']
			>(`organizations/${orgSlug}/teams/`, TEST_TOKEN, {
				method: 'GET',
			});

			SentryEndpointOutputSchemas.teamsList.parse(response);
		});

		it('teamsGet returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['teamsList']
			>(`organizations/${orgSlug}/teams/`, TEST_TOKEN, {
				method: 'GET',
			});
			const teams = Array.isArray(listResponse) ? listResponse : [];
			const teamSlug = teams[0]?.slug;
			if (!teamSlug) {
				throw new Error('No teams found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['teamsGet']
			>(`teams/${orgSlug}/${teamSlug}/`, TEST_TOKEN, { method: 'GET' });

			SentryEndpointOutputSchemas.teamsGet.parse(response);
		});
	});

	describe('releases', () => {
		let orgSlug: string;

		beforeAll(async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['organizationsList']
			>('organizations/', TEST_TOKEN, { method: 'GET' });
			const orgs = Array.isArray(listResponse) ? listResponse : [];
			const slug = orgs[0]?.slug;
			if (!slug) {
				throw new Error('No organizations found');
			}
			orgSlug = slug;
		});

		it('releasesList returns correct type', async () => {
			const response = await makeSentryRequest<
				SentryEndpointOutputs['releasesList']
			>(`organizations/${orgSlug}/releases/`, TEST_TOKEN, {
				method: 'GET',
			});

			SentryEndpointOutputSchemas.releasesList.parse(response);
		});

		it('releasesGet returns correct type', async () => {
			const listResponse = await makeSentryRequest<
				SentryEndpointOutputs['releasesList']
			>(`organizations/${orgSlug}/releases/`, TEST_TOKEN, {
				method: 'GET',
			});
			const releases = Array.isArray(listResponse) ? listResponse : [];
			const version = releases[0]?.version;
			if (!version) {
				throw new Error('No releases found');
			}

			const response = await makeSentryRequest<
				SentryEndpointOutputs['releasesGet']
			>(
				`organizations/${orgSlug}/releases/${encodeURIComponent(version)}/`,
				TEST_TOKEN,
				{ method: 'GET' },
			);

			SentryEndpointOutputSchemas.releasesGet.parse(response);
		});
	});
});
