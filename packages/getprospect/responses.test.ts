import * as client from './client';
import { GetProspectOperations } from './endpoints';
import { toResponseSchema } from './endpoints/responses';
import {
	getProspectOperationDefinitions,
	OpenApiSchemas,
} from './endpoints/types';
import type { GetProspectContext } from './index';
import { getprospectEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeGetProspectRequest: jest.fn(),
}));

const mockedRequest = jest.mocked(client.makeGetProspectRequest);

const context: GetProspectContext = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'test-key',
	options: {},
	keys: {
		get_dek: () => Promise.resolve('test-dek'),
		issue_new_dek: () => Promise.resolve('test-dek'),
		get_api_key: () => Promise.resolve('test-key'),
		set_api_key: () => Promise.resolve(),
		get_webhook_signature: () => Promise.resolve(null),
		set_webhook_signature: () => Promise.resolve(),
	},
	db: {},
};

describe('GetProspect response parsing', () => {
	beforeEach(() => mockedRequest.mockReset());

	it('accepts a response that drifts from the contract (nulls, missing fields, new enum values, loose formats)', async () => {
		const drifted = {
			success: true,
			data: {
				id: 'u1',
				email: 'not-an-address',
				first_name: null,
				email_verified: null,
				status: 'trial',
				created_at: '2026-01-01 00:00:00',
				workspace: { id: 7, name: null, role: 'owner' },
				extra_field: { nested: true },
			},
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		};
		mockedRequest.mockResolvedValue(drifted);
		const result = await GetProspectOperations.account.meGet(context, {});
		expect(result).toEqual(drifted);
	});

	it('still rejects a response of the wrong type', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			data: { id: 12, workspace: 'x' },
			metadata: { timestamp: '2026-01-01T00:00:00Z' },
		});
		await expect(
			GetProspectOperations.account.meGet(context, {}),
		).rejects.toThrow();
	});

	it('keeps the strict contract for documentation', () => {
		expect(() =>
			OpenApiSchemas.SchemaMeGetResponse.parse({
				success: true,
				data: { id: 'u1' },
				metadata: { timestamp: '2026-01-01T00:00:00Z' },
			}),
		).toThrow();
		expect(() =>
			toResponseSchema(OpenApiSchemas.SchemaMeGetResponse).parse({
				success: true,
				data: { id: 'u1' },
				metadata: { timestamp: '2026-01-01T00:00:00Z' },
			}),
		).not.toThrow();
	});
});

describe('GetProspect risk levels and timeouts', () => {
	it('marks metered lookups as reads (R8: lookups stay read even when they use credits)', () => {
		for (const id of [
			'email.find',
			'email.findGet',
			'email.verify',
			'email.verifyGet',
			'people.enrich',
			'people.bulkEnrich',
			'people.search',
		] as const) {
			expect(getprospectEndpointMeta[id].riskLevel).toBe('read');
		}
	});

	it('keeps credit-spending jobs, saves and irreversible changes destructive', () => {
		for (const id of [
			'people.enrichSearch',
			'people.save',
			'people.saveSearch',
			'exports.peopleExport',
			'email.verificationsCreate',
			'email.verificationsStart',
			'enrichments.peopleEnrichmentsCreate',
			'lists.delete',
		] as const) {
			expect(getprospectEndpointMeta[id].riskLevel).toBe('destructive');
		}
	});

	it('keeps operation definitions in step with the endpoint metadata', () => {
		for (const definition of Object.values(getProspectOperationDefinitions)) {
			const id = `${definition.group}.${definition.leaf}`;
			const meta = Object.entries(getprospectEndpointMeta).find(
				([key]) => key === id,
			)?.[1];
			expect(meta?.riskLevel).toBe(definition.riskLevel);
		}
	});

	it('gives the GET finder and verifier the same timeouts as their POST twins', () => {
		expect(getProspectOperationDefinitions.email_find_get.timeout).toBe(
			getProspectOperationDefinitions.email_find.timeout,
		);
		expect(getProspectOperationDefinitions.email_verify_get.timeout).toBe(
			getProspectOperationDefinitions.email_verify.timeout,
		);
	});
});
