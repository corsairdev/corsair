import {
	WebvizioEndpointInputSchemas,
	WebvizioEndpointOutputSchemas,
	WebvizioProjectSchema,
	WebvizioWebhookSubscriptionSchema,
} from './endpoints/types';
import { WebvizioProject, WebvizioWebhook } from './schema';

describe('Webvizio input schemas', () => {
	it('accepts empty object for projects.list', () => {
		expect(WebvizioEndpointInputSchemas.projectsList.parse({})).toEqual({});
	});

	it('accepts empty object for webhooks.list', () => {
		expect(WebvizioEndpointInputSchemas.webhooksList.parse({})).toEqual({});
	});
});

describe('Webvizio output schemas', () => {
	it('parses valid projectsList array response', () => {
		const sampleProjects = [
			{
				uuid: 'ce7e2096-05ad-4b5f-95d6-6088ca551dd0',
				name: 'jiitsphere.com',
				description: null,
				url: null,
			},
			{
				id: '123',
				uuid: 'abcd-1234',
				name: 'Test Project',
				description: 'Sample description',
				url: 'https://test.com',
			},
		];

		const parsed =
			WebvizioEndpointOutputSchemas.projectsList.parse(sampleProjects);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.uuid).toBe('ce7e2096-05ad-4b5f-95d6-6088ca551dd0');
		expect(parsed[0]?.name).toBe('jiitsphere.com');
		expect(parsed[0]?.description).toBeNull();
		expect(parsed[1]?.id).toBe('123');
	});

	it('parses valid webhooksList array response', () => {
		const sampleWebhooks = [
			{
				id: 101,
				url: 'https://example.com/webhook',
				event: 'project.created',
			},
			{
				id: 'hook-2',
				url: 'https://example.com/callback',
				event: 'task.created',
			},
		];

		const parsed =
			WebvizioEndpointOutputSchemas.webhooksList.parse(sampleWebhooks);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.id).toBe(101);
		expect(parsed[0]?.event).toBe('project.created');
		expect(parsed[1]?.id).toBe('hook-2');
	});

	it('validates single WebvizioProjectSchema and WebvizioWebhookSubscriptionSchema', () => {
		expect(
			WebvizioProjectSchema.parse({
				uuid: 'u-1',
				name: 'Project 1',
			}),
		).toMatchObject({ uuid: 'u-1', name: 'Project 1' });

		expect(
			WebvizioWebhookSubscriptionSchema.parse({
				id: 1,
				url: 'https://hook.url',
				event: 'task.deleted',
			}),
		).toMatchObject({ id: 1, event: 'task.deleted' });
	});
});

describe('Webvizio database entity schemas', () => {
	it('validates WebvizioProject database entity', () => {
		const project = WebvizioProject.parse({
			uuid: 'proj-123',
			name: 'Client Redesign',
			description: 'Redesigning company website',
			created_at: new Date().toISOString(),
		});

		expect(project.uuid).toBe('proj-123');
		expect(project.name).toBe('Client Redesign');
	});

	it('validates WebvizioWebhook database entity', () => {
		const hook = WebvizioWebhook.parse({
			id: 42,
			url: 'https://app.example.com/events',
			event: 'comment.created',
			created_at: '2026-08-20T10:00:00Z',
		});

		expect(hook.id).toBe(42);
		expect(hook.event).toBe('comment.created');
	});
});
