import dotenv from 'dotenv';
import { createCorsair } from '../../core';
import { createCorsairOrm } from '../../db/orm';
import { createIntegrationAndAccount } from '../../tests/plugins-test-utils';
import { createTestDatabase } from '../../tests/setup-db';
import { LinearAPIError } from './client';
import { linear } from './index';

dotenv.config();

async function createLinearClient() {
	const apiKey = process.env.LINEAR_API_KEY;
	if (!apiKey) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'linear');

	const corsair = createCorsair({
		plugins: [
			linear({
				authType: 'api_key',
				key: process.env.LINEAR_API_KEY!,
				credentials: {
					apiKey,
				},
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
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

		const listInput = {
			first: 10,
		};

		const teamsList = await corsair.linear.api.teams.list(listInput);

		expect(teamsList).toBeDefined();
		expect(teamsList.nodes).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'linear.teams.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (teamsList.nodes && teamsList.nodes.length > 0) {
			const firstTeam = teamsList.nodes[0];
			if (firstTeam && firstTeam.id) {
				const teamFromDb = await corsair.linear.db.teams.findByEntityId(
					firstTeam.id,
				);
				expect(teamFromDb).not.toBeNull();
				if (teamFromDb) {
					expect(teamFromDb.data.id).toBe(firstTeam.id);
				}

				const getInput = {
					id: firstTeam.id,
				};

				const teamInfo = await corsair.linear.api.teams.get(getInput);

				expect(teamInfo).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'linear.teams.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				if (teamInfo.id) {
					const teamInfoFromDb = await corsair.linear.db.teams.findByEntityId(
						teamInfo.id,
					);
					if (teamInfoFromDb) {
						expect(teamInfoFromDb.data.id).toBe(teamInfo.id);
					}
				}
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

		const listInput = {
			teamId,
			first: 10,
		};

		let issuesList;
		try {
			issuesList = await corsair.linear.api.issues.list(listInput);
		} catch (error) {
			if (error instanceof LinearAPIError) {
				const listInputWithoutTeam = { first: 10 };
				issuesList = await corsair.linear.api.issues.list(listInputWithoutTeam);
			} else {
				throw error;
			}
		}

		expect(issuesList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'linear.issues.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);

		const issueTitle = `Corsair test issue ${Date.now()}`;
		const createInput = {
			title: issueTitle,
			teamId,
			description: 'Test issue created by Corsair integration test',
		};

		const createdIssue = await corsair.linear.api.issues.create(createInput);

		expect(createdIssue).toBeDefined();
		expect(createdIssue.id).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'linear.issues.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const issueFromDb = await corsair.linear.db.issues.findByEntityId(
			createdIssue.id,
		);

		expect(issueFromDb).not.toBeNull();
		if (issueFromDb) {
			expect(issueFromDb.data.id).toBe(createdIssue.id);
			expect(issueFromDb.data.title).toBe(createdIssue.title);
		}

		const getInput = {
			id: createdIssue.id,
		};

		const fetchedIssue = await corsair.linear.api.issues.get(getInput);

		expect(fetchedIssue).toBeDefined();

		const getEvents = await orm.events.findMany({
			where: { event_type: 'linear.issues.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		const issueAfterGet = await corsair.linear.db.issues.findByEntityId(
			createdIssue.id,
		);
		expect(issueAfterGet).not.toBeNull();

		const updateInput = {
			id: createdIssue.id,
			input: {
				title: `${issueTitle} updated`,
				description: 'Updated description',
			},
		};

		const updatedIssue = await corsair.linear.api.issues.update(updateInput);

		expect(updatedIssue).toBeDefined();

		const updateEvents = await orm.events.findMany({
			where: { event_type: 'linear.issues.update' },
		});

		expect(updateEvents.length).toBeGreaterThan(0);
		const updateEvent = updateEvents[updateEvents.length - 1]!;
		const updateEventPayload =
			typeof updateEvent.payload === 'string'
				? JSON.parse(updateEvent.payload)
				: updateEvent.payload;
		expect(updateEventPayload).toMatchObject(updateInput);

		const issueFromDbAfterUpdate =
			await corsair.linear.db.issues.findByEntityId(createdIssue.id);

		expect(issueFromDbAfterUpdate).not.toBeNull();
		if (issueFromDbAfterUpdate) {
			expect(issueFromDbAfterUpdate.data.title).toBe(updatedIssue.title);
		}

		const deleteInput = {
			id: createdIssue.id,
		};

		const deletedIssue = await corsair.linear.api.issues.delete(deleteInput);

		expect(deletedIssue).toBeDefined();

		const deleteEvents = await orm.events.findMany({
			where: { event_type: 'linear.issues.delete' },
		});

		expect(deleteEvents.length).toBeGreaterThan(0);
		const deleteEvent = deleteEvents[deleteEvents.length - 1]!;
		const deleteEventPayload =
			typeof deleteEvent.payload === 'string'
				? JSON.parse(deleteEvent.payload)
				: deleteEvent.payload;
		expect(deleteEventPayload).toMatchObject(deleteInput);

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

		const listInput = {
			first: 10,
		};

		const projectsList = await corsair.linear.api.projects.list(listInput);

		expect(projectsList).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const listEvents = await orm.events.findMany({
			where: { event_type: 'linear.projects.list' },
		});

		expect(listEvents.length).toBeGreaterThan(0);
		const listEvent = listEvents[listEvents.length - 1]!;
		const listEventPayload =
			typeof listEvent.payload === 'string'
				? JSON.parse(listEvent.payload)
				: listEvent.payload;
		expect(listEventPayload).toMatchObject(listInput);

		if (projectsList.nodes && projectsList.nodes.length > 0) {
			const firstProject = projectsList.nodes[0];
			if (firstProject && firstProject.id) {
				const projectFromDb = await corsair.linear.db.projects.findByEntityId(
					firstProject.id,
				);
				expect(projectFromDb).not.toBeNull();
				if (projectFromDb) {
					expect(projectFromDb.data.id).toBe(firstProject.id);
				}

				const getInput = {
					id: firstProject.id,
				};

				const projectInfo = await corsair.linear.api.projects.get(getInput);

				expect(projectInfo).toBeDefined();

				const getEvents = await orm.events.findMany({
					where: { event_type: 'linear.projects.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				if (projectInfo.id) {
					const projectInfoFromDb =
						await corsair.linear.db.projects.findByEntityId(projectInfo.id);
					if (projectInfoFromDb) {
						expect(projectInfoFromDb.data.id).toBe(projectInfo.id);
					}
				}
			}
		}

		const projectName = `Corsair test project ${Date.now()}`;
		const createInput = {
			name: projectName,
			teamIds: [teamId],
			description: 'Test project created by Corsair integration test',
		};

		const createdProject =
			await corsair.linear.api.projects.create(createInput);

		expect(createdProject).toBeDefined();
		expect(createdProject.id).toBeDefined();

		const createEvents = await orm.events.findMany({
			where: { event_type: 'linear.projects.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		const projectFromDb = await corsair.linear.db.projects.findByEntityId(
			createdProject.id,
		);

		expect(projectFromDb).not.toBeNull();
		if (projectFromDb) {
			expect(projectFromDb.data.id).toBe(createdProject.id);
			expect(projectFromDb.data.name).toBe(createdProject.name);
		}

		const updateInput = {
			id: createdProject.id,
			input: {
				name: `${projectName} updated`,
				description: 'Updated description',
			},
		};

		const updatedProject =
			await corsair.linear.api.projects.update(updateInput);

		expect(updatedProject).toBeDefined();

		const updateEvents = await orm.events.findMany({
			where: { event_type: 'linear.projects.update' },
		});

		expect(updateEvents.length).toBeGreaterThan(0);
		const updateEvent = updateEvents[updateEvents.length - 1]!;
		const updateEventPayload =
			typeof updateEvent.payload === 'string'
				? JSON.parse(updateEvent.payload)
				: updateEvent.payload;
		expect(updateEventPayload).toMatchObject(updateInput);

		const projectAfterUpdate = await corsair.linear.db.projects.findByEntityId(
			createdProject.id,
		);
		expect(projectAfterUpdate).not.toBeNull();
		if (projectAfterUpdate) {
			expect(projectAfterUpdate.data.name).toBe(updatedProject.name);
		}

		const deleteInput = {
			id: createdProject.id,
		};

		const deletedProject =
			await corsair.linear.api.projects.delete(deleteInput);

		expect(deletedProject).toBeDefined();

		const deleteEvents = await orm.events.findMany({
			where: { event_type: 'linear.projects.delete' },
		});

		expect(deleteEvents.length).toBeGreaterThan(0);
		const deleteEvent = deleteEvents[deleteEvents.length - 1]!;
		const deleteEventPayload =
			typeof deleteEvent.payload === 'string'
				? JSON.parse(deleteEvent.payload)
				: deleteEvent.payload;
		expect(deleteEventPayload).toMatchObject(deleteInput);

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

		let issuesList: any;
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

			const orm = createCorsairOrm(testDb.database);
			const createEvents = await orm.events.findMany({
				where: { event_type: 'linear.comments.create' },
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

			const listEvents = await orm.events.findMany({
				where: { event_type: 'linear.comments.list' },
			});

			expect(listEvents.length).toBeGreaterThan(0);

			const updatedComment = await corsair.linear.api.comments.update({
				id: createdComment.id,
				input: {
					body: `${commentBody} updated`,
				},
			});

			expect(updatedComment).toBeDefined();

			const updateEvents = await orm.events.findMany({
				where: { event_type: 'linear.comments.update' },
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			const deletedComment = await corsair.linear.api.comments.delete({
				id: createdComment.id,
			});

			expect(deletedComment).toBeDefined();

			const deleteEvents = await orm.events.findMany({
				where: { event_type: 'linear.comments.delete' },
			});

			expect(deleteEvents.length).toBeGreaterThan(0);

			await corsair.linear.api.issues.delete({
				id: issueId,
			});
		}

		testDb.cleanup();
	});
});
