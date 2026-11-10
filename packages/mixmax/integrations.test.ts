import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const COMMAND = {
	_id: 'cmd-1',
	id: 'pTQ3LTN8UAqVXmvdu',
	userId: 'user-1',
	name: 'Insert a ticket',
	commands: ['ticket'],
	parameterPlaceholder: '[ticket number]',
	commandParameterHintsUrl: 'https://example.com/mixmax/hints',
	commandResolverUrl: 'https://example.com/mixmax/resolve',
	createdAt: '2026-10-14T18:10:21.809Z',
};

const ENHANCEMENT = {
	_id: 'enh-1',
	id: 'typeform',
	userId: 'user-1',
	name: 'Insert a Typeform',
	icon: 'typeform',
	iconTooltip: 'Insert a Typeform',
	editorUrl: 'https://example.com/mixmax/editor',
	resolverUrl: 'https://example.com/mixmax/resolve',
	activateUrl: 'https://example.com/mixmax/activate',
	editorHeight: 480,
	editorWidth: 640,
	commands: ['typeform'],
	category: 'Forms',
	isEditable: true,
	createdAt: '2026-10-14T18:10:24.000Z',
};

const LINK_RESOLVER = {
	_id: 'lr-1',
	id: 'q5lkLkJdJELfgwVop',
	userId: 'user-1',
	description: 'Example tickets',
	regex: '^https://example\\.com/tickets/\\d+',
	resolverUrl: 'https://example.com/mixmax/resolve',
	createdAt: '2026-10-14T18:10:28.409Z',
};

const SIDEBAR = {
	_id: 'sidebar-1',
	userId: 'user-1',
	name: 'Account notes',
	url: 'https://example.com/mixmax/sidebar',
	iconName: 'star',
	iconColor: '#7d4cdb',
	createdAt: '2026-10-14T18:10:31.575Z',
};

describe('Mixmax integrations endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('integrations.commands.list sends GET /v1/integrations/commands with documented query params', async () => {
		const page = { results: [COMMAND], hasNext: false, hasPrevious: false };
		request.mockResolvedValue(page);
		const result = await endpoints.integrations.commands.list(ctx, {
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/integrations/commands', {
			method: 'GET',
			query: {
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('integrations.commands.create posts the documented body', async () => {
		request.mockResolvedValue(COMMAND);
		const body = {
			name: 'Insert a ticket',
			commands: ['ticket'],
			parameterPlaceholder: '[ticket number]',
			commandParameterHintsUrl: 'https://example.com/mixmax/hints',
			commandResolverUrl: 'https://example.com/mixmax/resolve',
		};
		const result = await endpoints.integrations.commands.create(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/integrations/commands', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(COMMAND);
	});

	it('integrations.commands.delete sends DELETE /v1/integrations/commands/:id', async () => {
		const result = await endpoints.integrations.commands.delete(ctx, {
			id: 'cmd-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/integrations/commands/cmd-1',
			{
				method: 'DELETE',
			},
		);
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('integrations.enhancements.list sends GET /v1/integrations/enhancements with documented query params', async () => {
		const page = {
			results: [ENHANCEMENT],
			hasNext: false,
			hasPrevious: false,
		};
		request.mockResolvedValue(page);
		const result = await endpoints.integrations.enhancements.list(ctx, {
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/integrations/enhancements', {
			method: 'GET',
			query: {
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('integrations.enhancements.create posts the documented body', async () => {
		request.mockResolvedValue(ENHANCEMENT);
		const body = {
			name: 'Insert a Typeform',
			icon: 'typeform',
			iconTooltip: 'Insert a Typeform',
			editorUrl: 'https://example.com/mixmax/editor',
			resolverUrl: 'https://example.com/mixmax/resolve',
			activateUrl: 'https://example.com/mixmax/activate',
			editorHeight: 480,
			editorWidth: 640,
			commands: ['typeform'],
			category: 'Forms',
			isEditable: true,
		};
		const result = await endpoints.integrations.enhancements.create(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/integrations/enhancements', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(ENHANCEMENT);
	});

	it('integrations.enhancements.delete sends DELETE /v1/integrations/enhancements/:id', async () => {
		const result = await endpoints.integrations.enhancements.delete(ctx, {
			id: 'enh-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/integrations/enhancements/enh-1',
			{
				method: 'DELETE',
			},
		);
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('integrations.linkResolvers.list sends GET /v1/integrations/linkresolvers with documented query params', async () => {
		const page = {
			results: [LINK_RESOLVER],
			hasNext: false,
			hasPrevious: false,
		};
		request.mockResolvedValue(page);
		const result = await endpoints.integrations.linkResolvers.list(ctx, {
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/integrations/linkresolvers',
			{
				method: 'GET',
				query: {
					limit: 50,
					next: undefined,
					previous: undefined,
				},
			},
		);
		expect(result).toEqual(page);
	});

	it('integrations.linkResolvers.create posts the documented body', async () => {
		request.mockResolvedValue(LINK_RESOLVER);
		const body = {
			description: 'Example tickets',
			regex: '^https://example\\.com/tickets/\\d+',
			resolverUrl: 'https://example.com/mixmax/resolve',
		};
		const result = await endpoints.integrations.linkResolvers.create(ctx, body);

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/integrations/linkresolvers',
			{
				method: 'POST',
				body,
			},
		);
		expect(result).toEqual(LINK_RESOLVER);
	});

	it('integrations.linkResolvers.delete sends DELETE /v1/integrations/linkresolvers/:id', async () => {
		const result = await endpoints.integrations.linkResolvers.delete(ctx, {
			id: 'lr-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/integrations/linkresolvers/lr-1',
			{
				method: 'DELETE',
			},
		);
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('integrations.sidebars.list sends GET /v1/integrations/sidebars without query params', async () => {
		// The provider returns 500 when `limit` is passed, so this list takes
		// no query at all.
		const page = { results: [SIDEBAR], hasNext: false, hasPrevious: false };
		request.mockResolvedValue(page);
		const result = await endpoints.integrations.sidebars.list(ctx, {});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/integrations/sidebars', {
			method: 'GET',
		});
		expect(result).toEqual(page);
	});

	it('integrations.sidebars.create posts the documented body', async () => {
		request.mockResolvedValue(SIDEBAR);
		const result = await endpoints.integrations.sidebars.create(ctx, {
			name: 'Account notes',
			url: 'https://example.com/mixmax/sidebar',
			iconName: 'star',
			iconColor: '#7d4cdb',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/integrations/sidebars', {
			method: 'POST',
			body: {
				name: 'Account notes',
				url: 'https://example.com/mixmax/sidebar',
				iconImage: undefined,
				iconName: 'star',
				iconColor: '#7d4cdb',
			},
		});
		expect(result).toEqual(SIDEBAR);
	});

	it('integrations.sidebars.delete sends DELETE /v1/integrations/sidebars/:id', async () => {
		const result = await endpoints.integrations.sidebars.delete(ctx, {
			id: 'sidebar-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/integrations/sidebars/sidebar-1',
			{
				method: 'DELETE',
			},
		);
		// 204 with no body.
		expect(result).toBeUndefined();
	});

	it('rejects empty create bodies before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.integrations.commands.create(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.enhancements.create(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.linkResolvers.create(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.sidebars.create(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects missing delete ids before any request', async () => {
		await expect(
			endpoints.integrations.commands.delete(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.enhancements.delete(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.linkResolvers.delete(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.integrations.sidebars.delete(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('integrations.enhancements.list accepts a category list, as Mixmax returns for Group Event Poll', async () => {
		// Trimmed from GET /v1/integrations/enhancements on a live trial
		// account (11-10): one enhancement has two categories.
		const live = {
			results: [
				{
					_id: '5608cca56277da10fc7504a0',
					id: 'groupscheduling',
					name: 'Group Event Poll',
					editorUrl: 'https://emailapps.mixmax.com/groupscheduling/editor',
					isEditable: true,
					editorHeight: 640,
					editorWidth: 680,
					resolverUrl: 'https://emailapps.mixmax.com/groupscheduling/widget',
					commands: ['groupscheduling', 'group'],
					category: ['calendaring', 'survey'],
				},
				{
					_id: '585894f8c1f5b333612c779d',
					id: 'html',
					name: 'Custom HTML',
					category: 'media',
				},
			],
			hasNext: false,
			hasPrevious: false,
		};
		request.mockResolvedValueOnce(live);

		const page = await endpoints.integrations.enhancements.list(ctx, {});
		expect(page.results[0]?.category).toEqual(['calendaring', 'survey']);
		expect(page.results[1]?.category).toBe('media');
	});
});
