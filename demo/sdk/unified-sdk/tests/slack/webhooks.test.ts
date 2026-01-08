import * as fs from 'fs';
import * as path from 'path';
import { SlackWebhookHandler } from '../../webhooks/slack';
import type {
	AppMentionEvent,
	ChannelCreatedEvent,
	FilePublicEvent,
	FileSharedEvent,
	MessageEvent,
	ReactionAddedEvent,
	ReactionRemovedEvent,
	TeamJoinEvent,
} from '../../webhooks/slack-types';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

interface FixtureFile {
	filename: string;
	eventType: string;
	payload: object;
}

const EVENT_TYPES = [
	'app_mention',
	'file_shared',
	'file_created',
	'file_public',
	'channel_created',
	'reaction_added',
	'reaction_removed',
	'team_join',
	'user_change',
	'message',
];

function extractEventType(filename: string): string {
	for (const eventType of EVENT_TYPES) {
		if (filename.startsWith(eventType + '_')) {
			return eventType;
		}
	}
	return filename.split('_')[0];
}

function loadFixtures(): FixtureFile[] {
	if (!fs.existsSync(FIXTURES_DIR)) {
		return [];
	}

	const files = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));

	return files.map((filename) => {
		const filepath = path.join(FIXTURES_DIR, filename);
		const content = fs.readFileSync(filepath, 'utf-8');
		const eventType = extractEventType(filename);

		return {
			filename,
			eventType,
			payload: JSON.parse(content),
		};
	});
}

function getFixturesByEventType(eventType: string): FixtureFile[] {
	return loadFixtures().filter((f) => f.eventType === eventType);
}

describe('Real Slack Webhook Events - Dynamic Tests', () => {
	const allFixtures = loadFixtures();

	beforeAll(() => {
		console.log('\n📁 Loaded fixtures from:', FIXTURES_DIR);
		console.log(`   Total fixtures: ${allFixtures.length}`);

		const byType = allFixtures.reduce(
			(acc, f) => {
				acc[f.eventType] = (acc[f.eventType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		Object.entries(byType).forEach(([type, count]) => {
			console.log(`   - ${type}: ${count} fixture(s)`);
		});

		if (allFixtures.length === 0) {
			console.log(
				'\n⚠️  No fixtures found! Run the webhook server and trigger some events:',
			);
			console.log('   npm run webhook-server');
			console.log('   Then post messages, add reactions, share files, etc.\n');
		}
	});

	describe('Message Events', () => {
		const messageFixtures = getFixturesByEventType('message');

		if (messageFixtures.length === 0) {
			it.skip('no message fixtures available - post a message in a channel to capture them', () => {});
		} else {
			messageFixtures.forEach((fixture, index) => {
				it(`should process real message event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('message', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as MessageEvent;
					expect(event.type).toBe('message');
					expect(event.channel).toBeDefined();

					console.log(`   💬 Message in channel ${event.channel}`);
					if ('text' in event && event.text) {
						console.log(`      Text: ${event.text.substring(0, 50)}...`);
					}
				});
			});
		}
	});

	describe('App Mention Events', () => {
		const mentionFixtures = getFixturesByEventType('app_mention');

		if (mentionFixtures.length === 0) {
			it.skip('no app_mention fixtures available - @mention your bot to capture them', () => {});
		} else {
			mentionFixtures.forEach((fixture, index) => {
				it(`should process real app_mention event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('app_mention', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as AppMentionEvent;
					expect(event.type).toBe('app_mention');
					expect(event.user).toBeDefined();
					expect(event.text).toBeDefined();

					console.log(`   @️ Mention from ${event.user} in ${event.channel}`);
					console.log(`      Text: ${event.text.substring(0, 50)}...`);
				});
			});
		}
	});

	describe('File Shared Events', () => {
		const fileSharedFixtures = getFixturesByEventType('file_shared');

		if (fileSharedFixtures.length === 0) {
			it.skip('no file_shared fixtures available - share a file in a channel to capture them', () => {});
		} else {
			fileSharedFixtures.forEach((fixture, index) => {
				it(`should process real file_shared event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('file_shared', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as FileSharedEvent;
					expect(event.type).toBe('file_shared');
					expect(event.file_id).toBeDefined();
					expect(event.user_id).toBeDefined();

					console.log(`   📎 File ${event.file_id} shared by ${event.user_id}`);
				});
			});
		}
	});

	describe('File Public Events', () => {
		const filePublicFixtures = getFixturesByEventType('file_public');

		if (filePublicFixtures.length === 0) {
			it.skip('no file_public fixtures available - make a file public to capture them', () => {});
		} else {
			filePublicFixtures.forEach((fixture, index) => {
				it(`should process real file_public event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('file_public', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as FilePublicEvent;
					expect(event.type).toBe('file_public');
					expect(event.file_id).toBeDefined();

					console.log(
						`   🌐 File ${event.file_id} made public by ${event.user_id}`,
					);
				});
			});
		}
	});

	describe('Channel Created Events', () => {
		const channelCreatedFixtures = getFixturesByEventType('channel_created');

		if (channelCreatedFixtures.length === 0) {
			it.skip('no channel_created fixtures available - create a new channel to capture them', () => {});
		} else {
			channelCreatedFixtures.forEach((fixture, index) => {
				it(`should process real channel_created event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('channel_created', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as ChannelCreatedEvent;
					expect(event.type).toBe('channel_created');
					expect(event.channel).toBeDefined();
					expect(event.channel.name).toBeDefined();

					console.log(`   📢 Channel #${event.channel.name} created`);
				});
			});
		}
	});

	describe('Reaction Added Events', () => {
		const reactionAddedFixtures = getFixturesByEventType('reaction_added');

		if (reactionAddedFixtures.length === 0) {
			it.skip('no reaction_added fixtures available - add a reaction to a message to capture them', () => {});
		} else {
			reactionAddedFixtures.forEach((fixture, index) => {
				it(`should process real reaction_added event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('reaction_added', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as ReactionAddedEvent;
					expect(event.type).toBe('reaction_added');
					expect(event.reaction).toBeDefined();
					expect(event.user).toBeDefined();

					console.log(
						`   👍 Reaction :${event.reaction}: added by ${event.user}`,
					);
				});
			});
		}
	});

	describe('Reaction Removed Events', () => {
		const reactionRemovedFixtures = getFixturesByEventType('reaction_removed');

		if (reactionRemovedFixtures.length === 0) {
			it.skip('no reaction_removed fixtures available - remove a reaction from a message to capture them', () => {});
		} else {
			reactionRemovedFixtures.forEach((fixture, index) => {
				it(`should process real reaction_removed event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('reaction_removed', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as ReactionRemovedEvent;
					expect(event.type).toBe('reaction_removed');
					expect(event.reaction).toBeDefined();
					expect(event.user).toBeDefined();

					console.log(
						`   👎 Reaction :${event.reaction}: removed by ${event.user}`,
					);
				});
			});
		}
	});

	describe('Team Join Events', () => {
		const teamJoinFixtures = getFixturesByEventType('team_join');

		if (teamJoinFixtures.length === 0) {
			it.skip('no team_join fixtures available - invite a new user to capture them', () => {});
		} else {
			teamJoinFixtures.forEach((fixture, index) => {
				it(`should process real team_join event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new SlackWebhookHandler();
					const callback = jest.fn();
					handler.on('team_join', callback);

					const result = await handler.handleWebhook(
						{},
						fixture.payload as any,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as TeamJoinEvent;
					expect(event.type).toBe('team_join');
					expect(event.user).toBeDefined();
					expect(event.user.id).toBeDefined();

					console.log(
						`   👋 ${event.user.real_name} (${event.user.name}) joined`,
					);
				});
			});
		}
	});
});

describe('Fixture Statistics', () => {
	it('should report available fixtures', () => {
		const fixtures = loadFixtures();

		console.log('\n📊 Fixture Statistics:');
		console.log('═'.repeat(50));

		if (fixtures.length === 0) {
			console.log('No fixtures captured yet.\n');
			console.log('To capture real webhook payloads:');
			console.log('1. Run: npm run webhook-server');
			console.log('2. Run: ngrok http 3000');
			console.log('3. Configure webhook in Slack app settings');
			console.log('4. Trigger events (post messages, add reactions, etc.)\n');
		} else {
			const byType = fixtures.reduce(
				(acc, f) => {
					acc[f.eventType] = (acc[f.eventType] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			const eventTypes = [
				'message',
				'app_mention',
				'file_shared',
				'file_created',
				'file_public',
				'channel_created',
				'reaction_added',
				'reaction_removed',
				'team_join',
				'user_change',
			];

			eventTypes.forEach((type) => {
				const count = byType[type] || 0;
				const status = count > 0 ? '✅' : '⬜';
				console.log(`${status} ${type}: ${count} fixture(s)`);
			});

			console.log('═'.repeat(50));
			console.log(`Total: ${fixtures.length} fixtures\n`);
		}

		expect(true).toBe(true);
	});
});
