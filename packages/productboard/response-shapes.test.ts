import {
	ProductboardTeamsListOutputSchema,
	ProductboardWebhookGetOutputSchema,
	ProductboardWebhookListOutputSchema,
} from './endpoints/types';

const webhook = {
	id: 'wh-1',
	type: 'webhook',
	createdAt: '2026-11-23T10:00:00.123456Z',
	fields: {
		name: 'Synthetic hook',
		events: [{ eventType: 'portal-card.updated' }],
		notification: {
			url: 'https://hooks.example.com/pb',
			version: 1,
			headers: { authorization: 'Bearer stored-secret' },
		},
	},
	links: { self: 'https://api.productboard.com/v2/webhooks/wh-1' },
};

describe('Productboard response schemas', () => {
	it('reads webhooks with an event type the plugin does not list', () => {
		const parsed = ProductboardWebhookListOutputSchema.parse({
			data: [webhook],
			links: { next: null },
		});
		expect(parsed.data[0]?.fields.events[0]?.eventType).toBe(
			'portal-card.updated',
		);
	});

	it('never returns a stored webhook authorization header', () => {
		const parsed = ProductboardWebhookGetOutputSchema.parse({ data: webhook });
		expect(JSON.stringify(parsed)).not.toContain('stored-secret');
	});

	it('reads teams without format or length checks', () => {
		expect(
			ProductboardTeamsListOutputSchema.safeParse({
				data: [
					{
						id: 'team-1',
						type: 'team',
						fields: { name: 'Synthetic team', handle: '' },
						createdAt: '2026-11-23T10:00:00Z',
						updatedAt: '2026-11-23T10:00:00Z',
						links: { self: '/v2/teams/team-1' },
					},
				],
			}).success,
		).toBe(true);
	});
});
