import { createCorsair } from '../core';
import { linear } from '../plugins/linear';
import { LinearAPIError } from '../plugins/linear/client';
import { createTestDatabase } from './setup-db';
import { createIntegrationAndAccount } from './plugins-test-utils';
import type { LinearCredentials } from '../plugins/linear/schema';
import type { AuthTypes } from '../core/constants';
import dotenv from 'dotenv';
dotenv.config();

async function createLinearClient() {
	const apiKey = process.env.LINEAR_API_KEY;
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'linear');

	const corsair = createCorsair({
		plugins: [
			linear({
				authType: 'api_key' as AuthTypes,
				credentials: {
					apiKey,
				} satisfies LinearCredentials,
			}),
		],
		database: testDb.adapter,
	});

	return { corsair, testDb };
}

describe('Linear plugin integration', () => {
	it('teams endpoints interact with API and DB', async () => {
		const setup = await createLinearClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const teamsList = await corsair.linear.api.teams.list({
			first: 10,
		});

		expect(teamsList).toBeDefined();
		expect(teamsList.nodes).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.teams.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		if (teamsList.nodes && teamsList.nodes.length > 0) {
			const firstTeam = teamsList.nodes[0];
			if (firstTeam && firstTeam.id) {
				const teamFromDb = await corsair.linear.db.teams.findByEntityId(
					firstTeam.id,
				);
				expect(teamFromDb).not.toBeNull();

				const teamInfo = await corsair.linear.api.teams.get({
					id: firstTeam.id,
				});

				expect(teamInfo).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'linear.teams.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);
			}
		}

		testDb.cleanup();
	});

	it('issues endpoints interact with API and DB', async () => {
		const setup = await createLinearClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const teamsList = await corsair.linear.api.teams.list({
			first: 1,
		});

		if (!teamsList.nodes || teamsList.nodes.length === 0) {
			testDb.cleanup();
			return;
		}

		const teamId = teamsList.nodes[0]?.id;
		if (!teamId) {
			testDb.cleanup();
			return;
		}

		let issuesList;
		try {
			issuesList = await corsair.linear.api.issues.list({
				teamId,
				first: 10,
			});
		} catch (error) {
			if (error instanceof LinearAPIError) {
				issuesList = await corsair.linear.api.issues.list({
					first: 10,
				});
			} else {
				throw error;
			}
		}

		expect(issuesList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.issues.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const issueTitle = `Corsair test issue ${Date.now()}`;

		const createdIssue = await corsair.linear.api.issues.create({
			title: issueTitle,
			teamId,
			description: 'Test issue created by Corsair integration test',
		});

		expect(createdIssue).toBeDefined();
		expect(createdIssue.id).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.issues.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		const issueFromDb = await corsair.linear.db.issues.findByEntityId(
			createdIssue.id,
		);

		expect(issueFromDb).not.toBeNull();

		const fetchedIssue = await corsair.linear.api.issues.get({
			id: createdIssue.id,
		});

		expect(fetchedIssue).toBeDefined();

		const getEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.issues.get' }],
		});

		expect(getEvents.length).toBeGreaterThan(0);

		const updatedIssue = await corsair.linear.api.issues.update({
			id: createdIssue.id,
			input: {
				title: `${issueTitle} updated`,
				description: 'Updated description',
			},
		});

		expect(updatedIssue).toBeDefined();

		const updateEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.issues.update' }],
		});

		expect(updateEvents.length).toBeGreaterThan(0);

		const issueFromDbAfterUpdate =
			await corsair.linear.db.issues.findByEntityId(createdIssue.id);

		expect(issueFromDbAfterUpdate).not.toBeNull();

		const deletedIssue = await corsair.linear.api.issues.delete({
			id: createdIssue.id,
		});

		expect(deletedIssue).toBeDefined();

		const deleteEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.issues.delete' }],
		});

		expect(deleteEvents.length).toBeGreaterThan(0);

		const issuesCount = await corsair.linear.db.issues.count();

		expect(issuesCount).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('projects endpoints interact with API and DB', async () => {
		const setup = await createLinearClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const teamsList = await corsair.linear.api.teams.list({
			first: 1,
		});

		if (!teamsList.nodes || teamsList.nodes.length === 0) {
			testDb.cleanup();
			return;
		}

		const teamId = teamsList.nodes[0]?.id;
		if (!teamId) {
			testDb.cleanup();
			return;
		}

		const projectsList = await corsair.linear.api.projects.list({
			first: 10,
		});

		expect(projectsList).toBeDefined();

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.projects.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		if (projectsList.nodes && projectsList.nodes.length > 0) {
			const firstProject = projectsList.nodes[0];
			if (firstProject && firstProject.id) {
				const projectFromDb = await corsair.linear.db.projects.findByEntityId(
					firstProject.id,
				);
				expect(projectFromDb).not.toBeNull();

				const projectInfo = await corsair.linear.api.projects.get({
					id: firstProject.id,
				});

				expect(projectInfo).toBeDefined();

				const getEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'linear.projects.get' }],
				});

				expect(getEvents.length).toBeGreaterThan(0);
			}
		}

		const projectName = `Corsair test project ${Date.now()}`;

		const createdProject = await corsair.linear.api.projects.create({
			name: projectName,
			teamIds: [teamId],
			description: 'Test project created by Corsair integration test',
		});

		expect(createdProject).toBeDefined();
		expect(createdProject.id).toBeDefined();

		const createEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.projects.create' }],
		});

		expect(createEvents.length).toBeGreaterThan(0);

		const projectFromDb = await corsair.linear.db.projects.findByEntityId(
			createdProject.id,
		);

		expect(projectFromDb).not.toBeNull();

		const updatedProject = await corsair.linear.api.projects.update({
			id: createdProject.id,
			input: {
				name: `${projectName} updated`,
				description: 'Updated description',
			},
		});

		expect(updatedProject).toBeDefined();

		const updateEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.projects.update' }],
		});

		expect(updateEvents.length).toBeGreaterThan(0);

		const deletedProject = await corsair.linear.api.projects.delete({
			id: createdProject.id,
		});

		expect(deletedProject).toBeDefined();

		const deleteEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'linear.projects.delete' }],
		});

		expect(deleteEvents.length).toBeGreaterThan(0);

		testDb.cleanup();
	});

	it('comments endpoints interact with API and DB', async () => {
		const setup = await createLinearClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const teamsList = await corsair.linear.api.teams.list({
			first: 1,
		});

		if (!teamsList.nodes || teamsList.nodes.length === 0) {
			testDb.cleanup();
			return;
		}

		const teamId = teamsList.nodes[0]?.id;
		if (!teamId) {
			testDb.cleanup();
			return;
		}

		let issuesList;
		try {
			issuesList = await corsair.linear.api.issues.list({
				teamId,
				first: 1,
			});
		} catch (error) {
			if (error instanceof LinearAPIError) {
				issuesList = await corsair.linear.api.issues.list({
					first: 1,
				});
			} else {
				throw error;
			}
		}

		if (!issuesList.nodes || issuesList.nodes.length === 0) {
			const testIssue = await corsair.linear.api.issues.create({
				title: `Test issue for comments ${Date.now()}`,
				teamId,
			});

			if (!testIssue || !testIssue.id) {
				testDb.cleanup();
				return;
			}

			const issueId = testIssue.id;

			const commentBody = `Corsair test comment ${Date.now()}`;

			const createdComment = await corsair.linear.api.comments.create({
				issueId,
				body: commentBody,
			});

			expect(createdComment).toBeDefined();
			expect(createdComment.id).toBeDefined();

			const createEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.create' }],
			});

			expect(createEvents.length).toBeGreaterThan(0);

			const commentFromDb = await corsair.linear.db.comments.findByEntityId(
				createdComment.id,
			);

			expect(commentFromDb).not.toBeNull();

			const commentsList = await corsair.linear.api.comments.list({
				issueId,
				first: 10,
			});

			expect(commentsList).toBeDefined();

			const listEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.list' }],
			});

			expect(listEvents.length).toBeGreaterThan(0);

			const updatedComment = await corsair.linear.api.comments.update({
				id: createdComment.id,
				input: {
					body: `${commentBody} updated`,
				},
			});

			expect(updatedComment).toBeDefined();

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			const deletedComment = await corsair.linear.api.comments.delete({
				id: createdComment.id,
			});

			expect(deletedComment).toBeDefined();

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.delete' }],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);

			await corsair.linear.api.issues.delete({
				id: issueId,
			});
		} else {
			const issueId = issuesList.nodes[0]?.id;
			if (!issueId) {
				testDb.cleanup();
				return;
			}

			const commentsList = await corsair.linear.api.comments.list({
				issueId,
				first: 10,
			});

			expect(commentsList).toBeDefined();

			const listEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.list' }],
			});

			expect(listEvents.length).toBeGreaterThan(0);

			const commentBody = `Corsair test comment ${Date.now()}`;

			const createdComment = await corsair.linear.api.comments.create({
				issueId,
				body: commentBody,
			});

			expect(createdComment).toBeDefined();
			expect(createdComment.id).toBeDefined();

			const createEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.create' }],
			});

			expect(createEvents.length).toBeGreaterThan(0);

			const commentFromDb = await corsair.linear.db.comments.findByEntityId(
				createdComment.id,
			);

			expect(commentFromDb).not.toBeNull();

			const updatedComment = await corsair.linear.api.comments.update({
				id: createdComment.id,
				input: {
					body: `${commentBody} updated`,
				},
			});

			expect(updatedComment).toBeDefined();

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			const deletedComment = await corsair.linear.api.comments.delete({
				id: createdComment.id,
			});

			expect(deletedComment).toBeDefined();

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'linear.comments.delete' }],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});
});
