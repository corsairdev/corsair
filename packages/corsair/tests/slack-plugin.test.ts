import dotenv from 'dotenv';
import { createCorsair } from '../core';
import { slack } from '../plugins/slack';
import { SlackAPIError } from '../plugins/slack/client';
import { createIntegrationAndAccount } from './plugins-test-utils';
import { createTestDatabase } from './setup-db';

dotenv.config();

async function createSlackClient() {
	const botToken = process.env.SLACK_BOT_TOKEN;
	const channel = process.env.TEST_SLACK_CHANNEL;
	const userId = process.env.TEST_SLACK_USER_ID;
	if (!botToken || !channel || !userId) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.adapter, 'slack');

	const corsair = createCorsair({
		plugins: [
			slack({
				authType: 'oauth_2',
				key: process.env.SLACK_BOT_TOKEN!,
				credentials: {
					botToken,
				},
			}),
		],
		database: testDb.adapter,
		kek: process.env.CORSAIR_KEK!,
	});

	return { corsair, testDb, channel, userId };
}

describe('Slack plugin integration', () => {
	it('messages endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const posted = await corsair.slack.api.messages.post({
			channel,
			text: `corsair slack integration test ${Date.now()}`,
		});

		expect(posted).toBeDefined();
		expect(posted.ok).toBe(true);

		const postEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.messages.postMessage' }],
		});

		expect(postEvents.length).toBeGreaterThan(0);

		if (posted.ts) {
			const messageFromDb = await corsair.slack.db.messages.findByEntityId(
				posted.ts,
			);
			expect(messageFromDb).not.toBeNull();

			const updated = await corsair.slack.api.messages.update({
				channel,
				ts: posted.ts,
				text: 'updated by corsair test',
			});

			expect(updated).toBeDefined();
			expect(updated.ok).toBe(true);

			const updateEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'slack.messages.update' }],
			});

			expect(updateEvents.length).toBeGreaterThan(0);

			// try {
			// 	const permalink = await corsair.slack.api.messages.getPermalink({
			// 		channel,
			// 		message_ts: posted.ts,
			// 	});

			// 	expect(permalink).toBeDefined();

			// 	const permalinkEvents = await testDb.adapter.findMany({
			// 		table: 'corsair_events',
			// 		where: [
			// 			{ field: 'event_type', value: 'slack.messages.getPermalink' },
			// 		],
			// 	});

			// 	expect(permalinkEvents.length).toBeGreaterThan(0);
			// } catch (error) {
			// 	if (
			// 		error instanceof SlackAPIError &&
			// 		error.code === 'invalid_auth'
			// 	) {
			// 		console.warn(
			// 			'Skipping getPermalink test - bot token missing required scopes',
			// 		);
			// 	} else {
			// 		throw error;
			// 	}
			// }

			// try {
			// 	const searchResult = await corsair.slack.api.messages.search({
			// 		query: 'corsair',
			// 	});

			// 	expect(searchResult).toBeDefined();

			// 	const searchEvents = await testDb.adapter.findMany({
			// 		table: 'corsair_events',
			// 		where: [{ field: 'event_type', value: 'slack.messages.search' }],
			// 	});

			// 	expect(searchEvents.length).toBeGreaterThan(0);
			// } catch (error) {
			// 	if (
			// 		error instanceof SlackAPIError &&
			// 		error.code === 'invalid_auth'
			// 	) {
			// 		console.warn(
			// 			'Skipping search test - bot token missing required scopes',
			// 		);
			// 	} else {
			// 		throw error;
			// 	}
			// }

			const deleted = await corsair.slack.api.messages.delete({
				channel,
				ts: posted.ts,
			});

			expect(deleted).toBeDefined();
			expect(deleted.ok).toBe(true);

			const deleteEvents = await testDb.adapter.findMany({
				table: 'corsair_events',
				where: [{ field: 'event_type', value: 'slack.messages.delete' }],
			});

			expect(deleteEvents.length).toBeGreaterThan(0);
		}

		testDb.cleanup();
	});

	it('channels endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const list = await corsair.slack.api.channels.list({
			types: 'public_channel,private_channel',
		});

		expect(list).toBeDefined();
		expect(list.ok).toBe(true);

		const listEvents = await testDb.adapter.findMany({
			table: 'corsair_events',
			where: [{ field: 'event_type', value: 'slack.channels.list' }],
		});

		expect(listEvents.length).toBeGreaterThan(0);

		if (list.channels && list.channels.length > 0) {
			const firstChannel = list.channels[0];
			if (firstChannel && firstChannel.id) {
				const channelFromDb = await corsair.slack.db.channels.findByEntityId(
					firstChannel.id,
				);
				expect(channelFromDb).not.toBeNull();
			}
		}

		// try {
		// 	const channelInfo = await corsair.slack.api.channels.get({
		// 		channel,
		// 	});

		// 	expect(channelInfo).toBeDefined();

		// 	const getEvents = await testDb.adapter.findMany({
		// 		table: 'corsair_events',
		// 		where: [{ field: 'event_type', value: 'slack.channels.get' }],
		// 	});

		// 	expect(getEvents.length).toBeGreaterThan(0);

		// 	if (channelInfo.ok && channelInfo.channel?.id) {
		// 		const channelFromDb = await corsair.slack.db.channels.findByEntityId(
		// 			channelInfo.channel.id,
		// 		);
		// 		expect(channelFromDb).not.toBeNull();
		// 	}
		// } catch (error) {
		// 	if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
		// 		console.warn(
		// 			'Skipping channels.get test - bot token missing required scopes',
		// 		);
		// 	} else {
		// 		throw error;
		// 	}
		// }

		// try {
		// 	const history = await corsair.slack.api.channels.getHistory({
		// 		channel,
		// 		limit: 10,
		// 	});

		// 	expect(history).toBeDefined();

		// 	const historyEvents = await testDb.adapter.findMany({
		// 		table: 'corsair_events',
		// 		where: [
		// 			{ field: 'event_type', value: 'slack.channels.getHistory' },
		// 		],
		// 	});

		// 	expect(historyEvents.length).toBeGreaterThan(0);
		// } catch (error) {
		// 	if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
		// 		console.warn(
		// 			'Skipping getHistory test - bot token missing required scopes',
		// 		);
		// 	} else {
		// 		throw error;
		// 	}
		// }

		// try {
		// 	const members = await corsair.slack.api.channels.getMembers({
		// 		channel,
		// 		limit: 10,
		// 	});

		// 	expect(members).toBeDefined();

		// 	const membersEvents = await testDb.adapter.findMany({
		// 		table: 'corsair_events',
		// 		where: [
		// 			{ field: 'event_type', value: 'slack.channels.getMembers' },
		// 		],
		// 	});

		// 	expect(membersEvents.length).toBeGreaterThan(0);
		// } catch (error) {
		// 	if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
		// 		console.warn(
		// 			'Skipping getMembers test - bot token missing required scopes',
		// 		);
		// 	} else {
		// 		throw error;
		// 	}
		// }

		testDb.cleanup();
	});

	// it('users endpoints interact with API and DB', async () => {
	// 	const setup = await createSlackClient();
	// 	if (!setup) {
	// 		return;
	// 	}

	// 	const { corsair, testDb, userId } = setup;

	// 	try {
	// 		const userInfo = await corsair.slack.api.users.get({
	// 			user: userId,
	// 		});

	// 		expect(userInfo).toBeDefined();

	// 		const getEvents = await testDb.adapter.findMany({
	// 			table: 'corsair_events',
	// 			where: [{ field: 'event_type', value: 'slack.users.get' }],
	// 		});

	// 		expect(getEvents.length).toBeGreaterThan(0);

	// 		if (userInfo.ok && userInfo.user?.id) {
	// 			const userFromDb = await corsair.slack.db.users.findByEntityId(
	// 				userInfo.user.id,
	// 			);
	// 			expect(userFromDb).not.toBeNull();
	// 		}
	// 	} catch (error) {
	// 		if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
	// 			console.warn(
	// 				'Skipping users.get test - bot token missing required scopes',
	// 			);
	// 		} else {
	// 			throw error;
	// 		}
	// 	}

	// 	const list = await corsair.slack.api.users.list({});

	// 	expect(list).toBeDefined();
	// 	expect(list.ok).toBe(true);

	// 	const listEvents = await testDb.adapter.findMany({
	// 		table: 'corsair_events',
	// 		where: [{ field: 'event_type', value: 'slack.users.list' }],
	// 	});

	// 	expect(listEvents.length).toBeGreaterThan(0);

	// 	if (list.members && list.members.length > 0) {
	// 		const firstMember = list.members[0];
	// 		if (firstMember && firstMember.id) {
	// 			const userFromDb = await corsair.slack.db.users.findByEntityId(
	// 				firstMember.id,
	// 			);
	// 			expect(userFromDb).not.toBeNull();
	// 		}
	// 	}

	// 	try {
	// 		const profile = await corsair.slack.api.users.getProfile({
	// 			user: userId,
	// 		});

	// 		expect(profile).toBeDefined();

	// 		const getProfileEvents = await testDb.adapter.findMany({
	// 			table: 'corsair_events',
	// 			where: [{ field: 'event_type', value: 'slack.users.getProfile' }],
	// 		});

	// 		expect(getProfileEvents.length).toBeGreaterThan(0);
	// 	} catch (error) {
	// 		if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
	// 			console.warn(
	// 				'Skipping getProfile test - bot token missing required scopes',
	// 			);
	// 		} else {
	// 			throw error;
	// 		}
	// 	}

	// 	try {
	// 		const presence = await corsair.slack.api.users.getPresence({
	// 			user: userId,
	// 		});

	// 		expect(presence).toBeDefined();

	// 		const presenceEvents = await testDb.adapter.findMany({
	// 			table: 'corsair_events',
	// 			where: [{ field: 'event_type', value: 'slack.users.getPresence' }],
	// 		});

	// 		expect(presenceEvents.length).toBeGreaterThan(0);
	// 	} catch (error) {
	// 		if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
	// 			console.warn(
	// 				'Skipping getPresence test - bot token missing required scopes',
	// 			);
	// 		} else {
	// 			throw error;
	// 		}
	// 	}

	// 	testDb.cleanup();
	// });

	it('files endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		// try {
		// 	const filesList = await corsair.slack.api.files.list({
		// 		channel,
		// 		count: 10,
		// 	});

		// 	expect(filesList).toBeDefined();

		// 	const listEvents = await testDb.adapter.findMany({
		// 		table: 'corsair_events',
		// 		where: [{ field: 'event_type', value: 'slack.files.list' }],
		// 	});

		// 	expect(listEvents.length).toBeGreaterThan(0);

		// 	if (filesList.ok && filesList.files && filesList.files.length > 0) {
		// 		const firstFile = filesList.files[0];
		// 		if (firstFile && firstFile.id) {
		// 			const fileFromDb = await corsair.slack.db.files.findByEntityId(
		// 				firstFile.id,
		// 			);
		// 			expect(fileFromDb).not.toBeNull();

		// 			try {
		// 				const fileInfo = await corsair.slack.api.files.get({
		// 					file: firstFile.id,
		// 				});

		// 				expect(fileInfo).toBeDefined();

		// 				const getEvents = await testDb.adapter.findMany({
		// 					table: 'corsair_events',
		// 					where: [{ field: 'event_type', value: 'slack.files.get' }],
		// 				});

		// 				expect(getEvents.length).toBeGreaterThan(0);
		// 			} catch (error) {
		// 				if (
		// 					error instanceof SlackAPIError &&
		// 					error.code === 'invalid_auth'
		// 				) {
		// 					console.warn(
		// 						'Skipping files.get test - bot token missing required scopes',
		// 					);
		// 				} else {
		// 					throw error;
		// 				}
		// 			}
		// 		}
		// 	}
		// } catch (error) {
		// 	if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
		// 		console.warn(
		// 			'Skipping files.list test - bot token missing required scopes',
		// 		);
		// 	} else {
		// 		throw error;
		// 	}
		// }

		testDb.cleanup();
	});

	it('reactions endpoints interact with API and DB', async () => {
		const setup = await createSlackClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb, channel } = setup;

		const posted = await corsair.slack.api.messages.post({
			channel,
			text: `test message for reactions ${Date.now()}`,
		});

		if (posted.ok && posted.ts) {
			try {
				const added = await corsair.slack.api.reactions.add({
					channel,
					timestamp: posted.ts,
					name: 'thumbsup',
				});

				expect(added).toBeDefined();

				const addEvents = await testDb.adapter.findMany({
					table: 'corsair_events',
					where: [{ field: 'event_type', value: 'slack.reactions.add' }],
				});

				expect(addEvents.length).toBeGreaterThan(0);

				// try {
				// 	const reactions = await corsair.slack.api.reactions.get({
				// 		channel,
				// 		timestamp: posted.ts,
				// 	});

				// 	expect(reactions).toBeDefined();

				// 	const getEvents = await testDb.adapter.findMany({
				// 		table: 'corsair_events',
				// 		where: [{ field: 'event_type', value: 'slack.reactions.get' }],
				// 	});

				// 	expect(getEvents.length).toBeGreaterThan(0);
				// } catch (error) {
				// 	if (
				// 		error instanceof SlackAPIError &&
				// 		error.code === 'invalid_auth'
				// 	) {
				// 		console.warn(
				// 			'Skipping reactions.get test - bot token missing required scopes',
				// 		);
				// 	} else {
				// 		throw error;
				// 	}
				// }

				try {
					const removed = await corsair.slack.api.reactions.remove({
						channel,
						timestamp: posted.ts,
						name: 'thumbsup',
					});

					expect(removed).toBeDefined();

					const removeEvents = await testDb.adapter.findMany({
						table: 'corsair_events',
						where: [{ field: 'event_type', value: 'slack.reactions.remove' }],
					});

					expect(removeEvents.length).toBeGreaterThan(0);
				} catch (error) {
					if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
						console.warn(
							'Skipping reactions.remove test - bot token missing required scopes',
						);
					} else {
						throw error;
					}
				}
			} catch (error) {
				if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
					console.warn(
						'Skipping reactions.add test - bot token missing required scopes',
					);
				} else {
					throw error;
				}
			}

			await corsair.slack.api.messages.delete({
				channel,
				ts: posted.ts,
			});
		}

		testDb.cleanup();
	});

	// it('stars endpoints interact with API and DB', async () => {
	// 	const setup = await createSlackClient();
	// 	if (!setup) {
	// 		return;
	// 	}

	// 	const { corsair, testDb, channel } = setup;

	// 	const posted = await corsair.slack.api.messages.post({
	// 		channel,
	// 		text: `test message for stars ${Date.now()}`,
	// 	});

	// 	if (posted.ok && posted.ts) {
	// 		try {
	// 			const added = await corsair.slack.api.stars.add({
	// 				channel,
	// 				timestamp: posted.ts,
	// 			});

	// 			expect(added).toBeDefined();

	// 			const addEvents = await testDb.adapter.findMany({
	// 				table: 'corsair_events',
	// 				where: [{ field: 'event_type', value: 'slack.stars.add' }],
	// 			});

	// 			expect(addEvents.length).toBeGreaterThan(0);

	// 			try {
	// 				const starsList = await corsair.slack.api.stars.list({});

	// 				expect(starsList).toBeDefined();

	// 				const listEvents = await testDb.adapter.findMany({
	// 					table: 'corsair_events',
	// 					where: [{ field: 'event_type', value: 'slack.stars.list' }],
	// 				});

	// 				expect(listEvents.length).toBeGreaterThan(0);
	// 			} catch (error) {
	// 				if (
	// 					error instanceof SlackAPIError &&
	// 					error.code === 'invalid_auth'
	// 				) {
	// 					console.warn(
	// 						'Skipping stars.list test - bot token missing required scopes',
	// 					);
	// 				} else {
	// 					throw error;
	// 				}
	// 			}

	// 			try {
	// 				const removed = await corsair.slack.api.stars.remove({
	// 					channel,
	// 					timestamp: posted.ts,
	// 				});

	// 				expect(removed).toBeDefined();

	// 				const removeEvents = await testDb.adapter.findMany({
	// 					table: 'corsair_events',
	// 					where: [{ field: 'event_type', value: 'slack.stars.remove' }],
	// 				});

	// 				expect(removeEvents.length).toBeGreaterThan(0);
	// 			} catch (error) {
	// 				if (
	// 					error instanceof SlackAPIError &&
	// 					error.code === 'invalid_auth'
	// 				) {
	// 					console.warn(
	// 						'Skipping stars.remove test - bot token missing required scopes',
	// 					);
	// 				} else {
	// 					throw error;
	// 				}
	// 			}
	// 		} catch (error) {
	// 			if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
	// 				console.warn(
	// 					'Skipping stars.add test - bot token missing required scopes',
	// 				);
	// 			} else {
	// 				throw error;
	// 			}
	// 		}

	// 		await corsair.slack.api.messages.delete({
	// 			channel,
	// 			ts: posted.ts,
	// 		});
	// 	}

	// 	testDb.cleanup();
	// });

	// it('userGroups endpoints interact with API and DB', async () => {
	// 	const setup = await createSlackClient();
	// 	if (!setup) {
	// 		return;
	// 	}

	// 	const { corsair, testDb } = setup;

	// 	try {
	// 		const list = await corsair.slack.api.userGroups.list({});

	// 		expect(list).toBeDefined();

	// 		const listEvents = await testDb.adapter.findMany({
	// 			table: 'corsair_events',
	// 			where: [{ field: 'event_type', value: 'slack.userGroups.list' }],
	// 		});

	// 		expect(listEvents.length).toBeGreaterThan(0);

	// 		if (list.ok && list.userGroups && list.userGroups.length > 0) {
	// 			const firstGroup = list.userGroups[0];
	// 			if (firstGroup && firstGroup.id) {
	// 				const groupFromDb =
	// 					await corsair.slack.db.userGroups.findByEntityId(firstGroup.id);
	// 				expect(groupFromDb).not.toBeNull();
	// 			}
	// 		}
	// 	} catch (error) {
	// 		if (error instanceof SlackAPIError && error.code === 'invalid_auth') {
	// 			console.warn(
	// 				'Skipping userGroups.list test - bot token missing required scopes',
	// 			);
	// 		} else {
	// 			throw error;
	// 		}
	// 	}

	// 	testDb.cleanup();
	// });
});
