import * as fs from 'fs';
import * as path from 'path';
import { GithubWebhookHandler } from '../../webhooks/github';
import type {
	CommitCommentEvent,
	DeploymentEvent,
	PullRequestEvent,
	PushEvent,
	StarEvent,
	TeamAddEvent,
	WatchEvent,
} from '../../webhooks/github-types';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

interface FixtureFile {
	filename: string;
	eventType: string;
	payload: object;
}

const EVENT_TYPES = [
	'commit_comment',
	'deployment_status',
	'deployment',
	'issue_comment',
	'pull_request',
	'pull_request_review',
	'pull_request_review_comment',
	'push',
	'star',
	'team_add',
	'watch',
	'check_run',
	'check_suite',
	'create',
	'delete',
	'status',
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

describe('Real Webhook Events - Dynamic Tests', () => {
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
			console.log('   Then star/unstar repo, create PR, push commits, etc.\n');
		}
	});

	describe('Star Events', () => {
		const starFixtures = getFixturesByEventType('star');

		if (starFixtures.length === 0) {
			it.skip('no star fixtures available - star/unstar your repo to capture them', () => {});
		} else {
			starFixtures.forEach((fixture, index) => {
				it(`should process real star event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('star', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'star' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as StarEvent;
					expect(event.action).toMatch(/^(created|deleted)$/);
					expect(event.repository).toBeDefined();
					expect(event.repository.full_name).toBeDefined();
					expect(event.sender).toBeDefined();
					expect(event.sender.login).toBeDefined();

					console.log(
						`   ⭐ ${event.action} by ${event.sender.login} on ${event.repository.full_name}`,
					);
				});
			});
		}
	});

	describe('Watch Events', () => {
		const watchFixtures = getFixturesByEventType('watch');

		if (watchFixtures.length === 0) {
			it.skip('no watch fixtures available - watch/unwatch your repo to capture them', () => {});
		} else {
			watchFixtures.forEach((fixture, index) => {
				it(`should process real watch event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('watch', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'watch' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as WatchEvent;
					expect(event.action).toBe('started');
					expect(event.repository).toBeDefined();
					expect(event.sender).toBeDefined();

					console.log(
						`   👀 ${event.action} by ${event.sender.login} on ${event.repository.full_name}`,
					);
				});
			});
		}
	});

	describe('Push Events', () => {
		const pushFixtures = getFixturesByEventType('push');

		if (pushFixtures.length === 0) {
			it.skip('no push fixtures available - push a commit to capture them', () => {});
		} else {
			pushFixtures.forEach((fixture, index) => {
				it(`should process real push event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('push', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'push' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as PushEvent;
					expect(event.ref).toBeDefined();
					expect(event.repository).toBeDefined();
					expect(event.pusher).toBeDefined();
					expect(event.commits).toBeInstanceOf(Array);

					console.log(
						`   ⬆️  Push to ${event.ref} with ${event.commits.length} commit(s)`,
					);
					event.commits.slice(0, 3).forEach((c) => {
						console.log(`      - ${c.message.split('\n')[0]}`);
					});
				});
			});
		}
	});

	describe('Pull Request Events', () => {
		const prFixtures = getFixturesByEventType('pull_request');

		if (prFixtures.length === 0) {
			it.skip('no pull_request fixtures available - create/update a PR to capture them', () => {});
		} else {
			prFixtures.forEach((fixture, index) => {
				it(`should process real pull_request event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('pull_request', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'pull_request' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as PullRequestEvent;
					expect(event.action).toBeDefined();
					expect(event.pull_request).toBeDefined();
					expect(event.pull_request.title).toBeDefined();
					expect(event.pull_request.number).toBeDefined();
					expect(event.repository).toBeDefined();

					console.log(
						`   🔀 PR #${event.pull_request.number}: ${event.action}`,
					);
					console.log(`      Title: ${event.pull_request.title}`);
				});
			});
		}
	});

	describe('Commit Comment Events', () => {
		const commentFixtures = getFixturesByEventType('commit_comment');

		if (commentFixtures.length === 0) {
			it.skip('no commit_comment fixtures available - comment on a commit to capture them', () => {});
		} else {
			commentFixtures.forEach((fixture, index) => {
				it(`should process real commit_comment event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('commit_comment', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'commit_comment' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as CommitCommentEvent;
					expect(event.action).toBe('created');
					expect(event.comment).toBeDefined();
					expect(event.comment.body).toBeDefined();

					console.log(
						`   📝 Comment on ${event.comment.commit_id.substring(0, 7)}`,
					);
					console.log(`      "${event.comment.body.substring(0, 50)}..."`);
				});
			});
		}
	});

	describe('Deployment Events', () => {
		const deployFixtures = getFixturesByEventType('deployment');

		if (deployFixtures.length === 0) {
			it.skip('no deployment fixtures available - trigger a deployment to capture them', () => {});
		} else {
			deployFixtures.forEach((fixture, index) => {
				it(`should process real deployment event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('deployment', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'deployment' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as DeploymentEvent;
					expect(event.action).toBe('created');
					expect(event.deployment).toBeDefined();
					expect(event.deployment.environment).toBeDefined();

					console.log(`   🚀 Deployment to ${event.deployment.environment}`);
				});
			});
		}
	});

	describe('Team Add Events', () => {
		const teamFixtures = getFixturesByEventType('team_add');

		if (teamFixtures.length === 0) {
			it.skip('no team_add fixtures available - add a team to a repo to capture them', () => {});
		} else {
			teamFixtures.forEach((fixture, index) => {
				it(`should process real team_add event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new GithubWebhookHandler();
					const callback = jest.fn();
					handler.on('team_add', callback);

					const result = await handler.handleWebhook(
						{ 'x-github-event': 'team_add' },
						fixture.payload,
					);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as TeamAddEvent;
					expect(event.team).toBeDefined();
					expect(event.team.name).toBeDefined();
					expect(event.organization).toBeDefined();

					console.log(`   👥 Team "${event.team.name}" added`);
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
			console.log('3. Configure webhook in GitHub repo settings');
			console.log('4. Trigger events (star, push, create PR, etc.)\n');
		} else {
			const byType = fixtures.reduce(
				(acc, f) => {
					acc[f.eventType] = (acc[f.eventType] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			const eventTypes = [
				'star',
				'watch',
				'push',
				'pull_request',
				'commit_comment',
				'deployment',
				'team_add',
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
