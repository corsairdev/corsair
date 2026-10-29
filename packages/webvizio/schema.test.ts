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
	it('parses MCP project list rows', () => {
		const sampleProjects = [
			{
				uuid: 'ce7e2096-05ad-4b5f-95d6-6088ca551dd0',
				name: 'jiitsphere.com',
			},
			{
				uuid: 'abcd-1234',
				name: 'Test Project',
				id: 123,
				url: 'https://test.com',
			},
		];

		const parsed =
			WebvizioEndpointOutputSchemas.projectsList.parse(sampleProjects);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.uuid).toBe('ce7e2096-05ad-4b5f-95d6-6088ca551dd0');
		expect(parsed[0]?.name).toBe('jiitsphere.com');
		expect(parsed[1]?.id).toBe(123);
	});

	it('parses REST Hook subscription rows', () => {
		const sampleWebhooks = [
			{
				id: 101,
				url: 'https://example.com/webhook',
				event: 'project.created',
			},
			{
				id: 2,
				url: 'https://example.com/callback',
				event: 'task.created',
			},
		];

		const parsed =
			WebvizioEndpointOutputSchemas.webhooksList.parse(sampleWebhooks);
		expect(parsed).toHaveLength(2);
		expect(parsed[0]?.id).toBe(101);
		expect(parsed[0]?.event).toBe('project.created');
		expect(parsed[1]?.id).toBe(2);
	});

	it('validates single item schemas', () => {
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
	it('validates WebvizioProject from official MCP fields', () => {
		const project = WebvizioProject.parse({
			uuid: 'proj-123',
			name: 'Client Redesign',
			createdAt: '2026-08-20T10:00:00Z',
		});

		expect(project.uuid).toBe('proj-123');
		expect(project.name).toBe('Client Redesign');
		expect(project.createdAt).toBeInstanceOf(Date);
	});

	it('validates WebvizioWebhook from official REST Hooks fields', () => {
		const hook = WebvizioWebhook.parse({
			id: 42,
			url: 'https://app.example.com/events',
			event: 'comment.created',
		});

		expect(hook.id).toBe(42);
		expect(hook.event).toBe('comment.created');
	});
});
