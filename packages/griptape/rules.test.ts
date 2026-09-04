import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import {
	createRule,
	createRuleset,
	getRule,
	getRuleset,
	getRulesetByAlias,
	listRules,
	removeRule,
	removeRuleset,
	updateRule,
	updateRuleset,
} from './endpoints/rules';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = jest.mocked(logEventFromContext);

const ctx = { key: 'test-api-key' } as unknown as GriptapeContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockClear();
});

describe('rules endpoints', () => {
	it('listRules sends GET /rules with pagination', async () => {
		const payload = {
			items: [{ rule_id: 'rule-001', name: 'No PII' }],
			pagination: { page_number: 1, page_size: 10, total_count: 1 },
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await listRules(ctx, { page: 1, page_size: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'rules' }),
		);
		expect(result).toEqual(payload);
	});

	it('createRule sends POST /rules', async () => {
		const payload = { rule_id: 'rule-002', name: 'Tone guardrail' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createRule(ctx, { body: { name: 'Tone guardrail' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'rules' }),
		);
		expect(result).toEqual(payload);
	});

	it('getRule sends GET /rules/{rule_id}', async () => {
		const payload = { rule_id: 'rule-003', name: 'Brand voice' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRule(ctx, { rule_id: 'rule-003' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'rules/rule-003' }),
		);
		expect(result).toEqual(payload);
	});

	it('updateRule sends PATCH /rules/{rule_id}', async () => {
		const payload = { rule_id: 'rule-004', name: 'Updated rule' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateRule(ctx, {
			rule_id: 'rule-004',
			body: { name: 'Updated rule' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'PATCH', url: 'rules/rule-004' }),
		);
		expect(result).toEqual(payload);
	});

	it('removeRule sends DELETE /rules/{rule_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await removeRule(ctx, { rule_id: 'rule-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'DELETE', url: 'rules/rule-005' }),
		);
		expect(result).toEqual(payload);
	});

	it('createRuleset sends POST /rulesets', async () => {
		const payload = { ruleset_id: 'ruleset-001', name: 'Support rules' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await createRuleset(ctx, {
			body: { name: 'Support rules' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'POST', url: 'rulesets' }),
		);
		expect(result).toEqual(payload);
	});

	it('getRuleset sends GET /rulesets/{ruleset_id}', async () => {
		const payload = { ruleset_id: 'ruleset-002', name: 'Safety rules' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRuleset(ctx, { ruleset_id: 'ruleset-002' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'GET',
				url: 'rulesets/ruleset-002',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('getRulesetByAlias sends GET /rulesets with alias query', async () => {
		const payload = {
			items: [{ ruleset_id: 'ruleset-003', alias: 'support-default' }],
		};
		mockRequest.mockResolvedValueOnce(payload);
		const result = await getRulesetByAlias(ctx, { alias: 'support-default' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'rulesets' }),
		);
		expect(result).toEqual(payload);
	});

	it('updateRuleset sends PATCH /rulesets/{ruleset_id}', async () => {
		const payload = { ruleset_id: 'ruleset-004', name: 'Renamed ruleset' };
		mockRequest.mockResolvedValueOnce(payload);
		const result = await updateRuleset(ctx, {
			ruleset_id: 'ruleset-004',
			body: { name: 'Renamed ruleset' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'PATCH',
				url: 'rulesets/ruleset-004',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('removeRuleset sends DELETE /rulesets/{ruleset_id}', async () => {
		const payload = undefined;
		mockRequest.mockResolvedValueOnce(payload);
		const result = await removeRuleset(ctx, { ruleset_id: 'ruleset-005' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'DELETE',
				url: 'rulesets/ruleset-005',
			}),
		);
		expect(result).toEqual(payload);
	});
});

describe('rules input schemas', () => {
	it('accepts a valid rulesetGetByAlias input', () => {
		const parsed = GriptapeEndpointInputSchemas.rulesetGetByAlias.safeParse({
			alias: 'support-default',
		});
		expect(parsed.success).toBe(true);
	});

	it('rejects an empty alias for rulesetGetByAlias', () => {
		const parsed = GriptapeEndpointInputSchemas.rulesetGetByAlias.safeParse({
			alias: '',
		});
		expect(parsed.success).toBe(false);
	});
});
