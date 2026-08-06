import type { RawWebhookRequest } from 'corsair/core';
import { matchAsanaTenantWebhook } from './tenant-matcher';

describe('matchAsanaTenantWebhook', () => {
	it('returns project_gid when a task event parent is a project', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				events: [
					{
						resource: {
							gid: 'task-1',
							resource_type: 'task',
						},
						parent: {
							gid: 'project-99',
							resource_type: 'project',
						},
					},
				],
			},
		};

		expect(matchAsanaTenantWebhook(request)).toEqual({
			linkType: 'project_gid',
			externalId: 'project-99',
		});
	});

	it('returns project_gid when the event resource is a project', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				events: [
					{
						resource: {
							gid: 'project-42',
							resource_type: 'project',
						},
						parent: {
							gid: 'workspace-1',
							resource_type: 'workspace',
						},
					},
				],
			},
		};

		expect(matchAsanaTenantWebhook(request)).toEqual({
			linkType: 'project_gid',
			externalId: 'project-42',
		});
	});

	it('returns workspace_gid for workspace membership events', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				events: [
					{
						resource: {
							gid: 'membership-1',
							resource_type: 'workspace_membership',
						},
						parent: {
							gid: 'workspace-7',
							resource_type: 'workspace',
						},
					},
				],
			},
		};

		expect(matchAsanaTenantWebhook(request)).toEqual({
			linkType: 'workspace_gid',
			externalId: 'workspace-7',
		});
	});

	it('returns null for handshake requests with X-Hook-Secret', () => {
		const request: RawWebhookRequest = {
			headers: { 'x-hook-secret': 'secret' },
			body: { events: [] },
		};

		expect(matchAsanaTenantWebhook(request)).toBeNull();
	});

	it('returns null when events carry no project or workspace gid', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				events: [
					{
						resource: {
							gid: 'story-1',
							resource_type: 'story',
						},
					},
				],
			},
		};

		expect(matchAsanaTenantWebhook(request)).toBeNull();
	});
});
