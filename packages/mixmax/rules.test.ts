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

// `filter` is a JSON-encoded string, not an object, per the official Rule
// schema.
const RULE = {
	_id: 'rule-1',
	userId: 'user-1',
	name: 'Forward support emails',
	trigger: { type: 'event', eventName: 'message:received' },
	filter: '{"to.email":{"$regex":"^support@example\\\\.com$","$options":"i"}}',
	isPaused: false,
	createdAt: '2026-10-14T15:52:30.760Z',
	modifiedAt: '2026-10-14T15:52:30.760Z',
};

const ACTION = {
	_id: 'action-1',
	ruleId: 'rule-1',
	type: 'postToWebhook',
	isPaused: false,
	webhookUrl: 'https://example.com/mixmax-webhook',
	signingSecretLastFour: 'Ab12',
};

const EVENT = {
	_id: 'event-1',
	date: '2026-10-16T17:02:56.000Z',
	type: 'rules',
	userId: 'user-1',
	status: 'success',
	message: 'Posted to the webhook.',
	payload: { subject: 'Hello' },
	metadata: {
		ruleId: 'rule-1',
		ruleName: 'Forward support emails',
		actionType: 'postToWebhook',
	},
};

const EVENT_PAGE = {
	records: [EVENT],
	hasNext: true,
	next: 50,
	since: '2026-10-01T17:02:56.000Z',
	statuses: { success: 4, total: 5 },
};

describe('Mixmax rules endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('rules.list sends GET /v1/rules with documented query params', async () => {
		const page = { results: [RULE], hasNext: false };
		request.mockResolvedValue(page);
		const result = await endpoints.rules.list(ctx, {
			expand: 'actions',
			limit: 20,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules', {
			method: 'GET',
			query: {
				expand: 'actions',
				owner: undefined,
				hidden: undefined,
				limit: 20,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('rules.create posts the rule write fields with the required trigger', async () => {
		request.mockResolvedValue(RULE);
		const result = await endpoints.rules.create(ctx, {
			name: 'Forward support emails',
			trigger: { type: 'event', eventName: 'message:received' },
			filter: RULE.filter,
			isPaused: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules', {
			method: 'POST',
			body: {
				name: 'Forward support emails',
				trigger: { type: 'event', eventName: 'message:received' },
				filter: RULE.filter,
				isPaused: true,
			},
		});
		expect(result).toEqual(RULE);
	});

	it('rules.get sends GET /v1/rules/:id with the expand query', async () => {
		request.mockResolvedValue(RULE);
		const result = await endpoints.rules.get(ctx, {
			id: 'rule-1',
			expand: 'actions',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/rule-1', {
			method: 'GET',
			query: { expand: 'actions' },
		});
		expect(result).toEqual(RULE);
	});

	it('rules.update patches /v1/rules/:id without the id in the body', async () => {
		const response = { _id: 'rule-1', modifiedAt: '2026-10-15T16:00:00.000Z' };
		request.mockResolvedValue(response);
		const result = await endpoints.rules.update(ctx, {
			id: 'rule-1',
			isPaused: false,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/rule-1', {
			method: 'PATCH',
			body: { isPaused: false },
		});
		expect(result).toEqual(response);
	});

	it('rules.delete sends DELETE /v1/rules/:id and answers undefined', async () => {
		const result = await endpoints.rules.delete(ctx, { id: 'rule-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/rule-1', {
			method: 'DELETE',
		});
		expect(result).toBeUndefined();
	});

	it('rules.deleteBulk sends DELETE /v1/rules with the ids body', async () => {
		const result = await endpoints.rules.deleteBulk(ctx, {
			ids: ['rule-1', 'rule-2'],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules', {
			method: 'DELETE',
			body: { ids: ['rule-1', 'rule-2'] },
		});
		expect(result).toBeUndefined();
	});

	it('rules.actions.list sends GET /v1/rules/:id/actions with documented query params', async () => {
		const page = { results: [ACTION], hasNext: false };
		request.mockResolvedValue(page);
		const result = await endpoints.rules.actions.list(ctx, {
			id: 'rule-1',
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/rule-1/actions', {
			method: 'GET',
			query: {
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(page);
	});

	it('rules.actions.create posts /v1/rules/:id/actions with the action body', async () => {
		// The create response is the only time the generated signing secret
		// is visible.
		const created = { ...ACTION, signingSecret: 'whsec_new_secret' };
		request.mockResolvedValue(created);
		const result = await endpoints.rules.actions.create(ctx, {
			id: 'rule-1',
			type: 'postToWebhook',
			webhookUrl: 'https://example.com/mixmax-webhook',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/rule-1/actions', {
			method: 'POST',
			body: {
				type: 'postToWebhook',
				webhookUrl: 'https://example.com/mixmax-webhook',
			},
		});
		expect(result).toEqual(created);
	});

	it('rules.actions.update patches /v1/rules/:id/actions/:actionId', async () => {
		const updated = { ...ACTION, isPaused: true };
		request.mockResolvedValue(updated);
		const result = await endpoints.rules.actions.update(ctx, {
			id: 'rule-1',
			actionId: 'action-1',
			isPaused: true,
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/rules/rule-1/actions/action-1',
			{
				method: 'PATCH',
				body: { isPaused: true },
			},
		);
		expect(result).toEqual(updated);
	});

	it('rules.actions.delete sends DELETE /v1/rules/:id/actions/:actionId', async () => {
		const result = await endpoints.rules.actions.delete(ctx, {
			id: 'rule-1',
			actionId: 'action-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/rules/rule-1/actions/action-1',
			{ method: 'DELETE' },
		);
		expect(result).toBeUndefined();
	});

	it('rules.events.list sends GET /v1/rules/events with documented query params', async () => {
		request.mockResolvedValue(EVENT_PAGE);
		const result = await endpoints.rules.events.list(ctx, {
			ruleId: 'rule-1',
			status: 'success',
			offset: 50,
			limit: 50,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/events', {
			method: 'GET',
			query: {
				userId: undefined,
				getWorkspaceEvents: undefined,
				ruleId: 'rule-1',
				status: 'success',
				text: undefined,
				aggregate: undefined,
				fields: undefined,
				offset: 50,
				limit: 50,
			},
		});
		expect(result).toEqual(EVENT_PAGE);
	});

	it('rules.events.get sends GET /v1/rules/events/:id with the date query', async () => {
		request.mockResolvedValue(EVENT);
		const result = await endpoints.rules.events.get(ctx, {
			id: 'event-1',
			date: '2026-10-16T17:02:56.000Z',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/rules/events/event-1', {
			method: 'GET',
			query: { date: '2026-10-16T17:02:56.000Z' },
		});
		expect(result).toEqual(EVENT);
	});

	it('rejects missing ids and required body fields before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.rules.get(ctx, {} as never),
		).rejects.toThrow();
		await expect(endpoints.rules.delete(ctx, {} as never)).rejects.toThrow();
		await expect(
			endpoints.rules.deleteBulk(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.rules.actions.create(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.rules.actions.update(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.rules.actions.delete(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe path ids before any request', async () => {
		await expect(endpoints.rules.get(ctx, { id: '../admin' })).rejects.toThrow(
			'Invalid Mixmax id',
		);
		// Rule actions substitute two ids; both are guarded.
		await expect(
			endpoints.rules.actions.delete(ctx, {
				id: 'rule-1',
				actionId: '../admin',
			}),
		).rejects.toThrow('Invalid Mixmax actionId');
		await expect(
			endpoints.rules.actions.delete(ctx, {
				id: '../admin',
				actionId: 'action-1',
			}),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).not.toHaveBeenCalled();
	});

	it('rules.create rejects a rule without a trigger', async () => {
		// The official RuleCreate body requires `trigger`, so an update-style
		// body without one fails before transport.
		await expect(
			endpoints.rules.create(ctx, {
				name: 'No trigger',
				isPaused: true,
			} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
