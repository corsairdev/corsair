import * as fs from 'fs';
import * as path from 'path';
import { HubSpotWebhookHandler } from '../webhook-handler';
import type {
	CompanyCreatedEvent,
	ContactCreatedEvent,
	DealCreatedEvent,
	HubSpotWebhookEvent,
} from '../webhooks';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');

interface FixtureFile {
	filename: string;
	eventType: string;
	payload: object;
}

const EVENT_TYPES = [
	'contact.creation',
	'contact.propertyChange',
	'contact.deletion',
	'company.creation',
	'company.propertyChange',
	'company.deletion',
	'deal.creation',
	'deal.propertyChange',
	'deal.deletion',
	'ticket.creation',
	'ticket.propertyChange',
	'ticket.deletion',
	'engagement.creation',
	'conversation.creation',
	'conversation.newMessage',
];

function extractEventType(filename: string): string {
	for (const eventType of EVENT_TYPES) {
		if (filename.startsWith(eventType.replace('.', '_'))) {
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

describe('Real HubSpot Webhook Events - Dynamic Tests', () => {
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
			console.log('   Then create/update contacts, companies, deals, etc.\n');
		}
	});

	describe('Contact Events', () => {
		const contactFixtures = getFixturesByEventType('contact.creation');

		if (contactFixtures.length === 0) {
			it.skip(
				'no contact.creation fixtures available - create a contact to capture them',
				() => {},
			);
		} else {
			contactFixtures.forEach((fixture, index) => {
				it(`should process real contact.creation event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new HubSpotWebhookHandler();
					const callback = jest.fn();
					handler.on('contact.creation', callback);

					const result = await handler.handleWebhook({}, fixture.payload as any);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as ContactCreatedEvent;
					expect(event.subscriptionType).toBe('contact.creation');
					expect(event.objectId).toBeDefined();

					console.log(`   👤 Contact ${event.objectId} created`);
				});
			});
		}
	});

	describe('Company Events', () => {
		const companyFixtures = getFixturesByEventType('company.creation');

		if (companyFixtures.length === 0) {
			it.skip(
				'no company.creation fixtures available - create a company to capture them',
				() => {},
			);
		} else {
			companyFixtures.forEach((fixture, index) => {
				it(`should process real company.creation event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new HubSpotWebhookHandler();
					const callback = jest.fn();
					handler.on('company.creation', callback);

					const result = await handler.handleWebhook({}, fixture.payload as any);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as CompanyCreatedEvent;
					expect(event.subscriptionType).toBe('company.creation');
					expect(event.objectId).toBeDefined();

					console.log(`   🏢 Company ${event.objectId} created`);
				});
			});
		}
	});

	describe('Deal Events', () => {
		const dealFixtures = getFixturesByEventType('deal.creation');

		if (dealFixtures.length === 0) {
			it.skip(
				'no deal.creation fixtures available - create a deal to capture them',
				() => {},
			);
		} else {
			dealFixtures.forEach((fixture, index) => {
				it(`should process real deal.creation event #${index + 1} (${fixture.filename})`, async () => {
					const handler = new HubSpotWebhookHandler();
					const callback = jest.fn();
					handler.on('deal.creation', callback);

					const result = await handler.handleWebhook({}, fixture.payload as any);

					expect(result.success).toBe(true);
					expect(callback).toHaveBeenCalled();

					const event = callback.mock.calls[0][0] as DealCreatedEvent;
					expect(event.subscriptionType).toBe('deal.creation');
					expect(event.objectId).toBeDefined();

					console.log(`   💼 Deal ${event.objectId} created`);
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
			console.log('3. Configure webhook in HubSpot Private App settings');
			console.log('4. Trigger events (create contacts, companies, deals, etc.)\n');
		} else {
			const byType = fixtures.reduce(
				(acc, f) => {
					acc[f.eventType] = (acc[f.eventType] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);

			EVENT_TYPES.forEach((type) => {
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

