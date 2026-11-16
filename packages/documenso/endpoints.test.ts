import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeDocumensoRequest } from './client';
import { documensoEndpointTestRunners } from './endpoints';
import {
	DocumensoOperationDefinitions,
	DocumensoOperationNames,
} from './endpoints/definitions';
import type { DocumensoContext, DocumensoPluginOptions } from './index';
import { documenso } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => ({ makeDocumensoRequest: jest.fn() }));

const mockedRequest = jest.mocked(makeDocumensoRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildContext(): DocumensoContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: { baseUrl: 'https://tenant.documenso.invalid/api/v2' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

describe('Documenso endpoint handlers', () => {
	const ctx = buildContext();

	beforeEach(() => {
		mockedRequest.mockReset();
		mockedLogEvent.mockReset();
	});

	it('throws AuthMissingError when the required stored API key is absent and supports an explicit key', async () => {
		const keyContext = {
			authType: 'api_key' as const,
			options: {},
			keys: { ...ctx.keys, get_api_key: () => Promise.resolve(null) },
			tenantId: 'test-team',
		};
		const missingKeyBuilder = documenso().keyBuilder;
		const configuredKeyBuilder = documenso<DocumensoPluginOptions>({
			key: 'configured-api-key',
		}).keyBuilder;
		if (!missingKeyBuilder || !configuredKeyBuilder)
			throw new Error('Documenso key builder is not configured');
		await expect(
			missingKeyBuilder(keyContext, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(configuredKeyBuilder(keyContext, 'endpoint')).resolves.toBe(
			'configured-api-key',
		);
	});

	for (const name of DocumensoOperationNames) {
		const definition = DocumensoOperationDefinitions[name];
		it(`executes ${definition.method} ${definition.path} with validated input and output`, async () => {
			mockedRequest.mockResolvedValue(definition.outputExample);
			const runner =
				documensoEndpointTestRunners[
					`${definition.group}.${definition.action}.${definition.method.toLowerCase()}`
				];
			if (!runner) throw new Error(`Missing endpoint runner for ${name}`);

			await expect(runner(ctx, definition.inputExample)).resolves.toEqual(
				definition.outputExample,
			);
			expect(mockedRequest).toHaveBeenCalledWith(
				name,
				{
					key: 'test-api-key',
					baseUrl: 'https://tenant.documenso.invalid/api/v2',
				},
				definition.inputExample,
			);
			expect(mockedLogEvent).toHaveBeenCalledTimes(1);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				`documenso.${name}`,
				{ status: 'completed' },
				'completed',
			);
			expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
				'test-api-key',
			);
		});

		it(`rejects undocumented input before network I/O for ${name}`, async () => {
			const runner =
				documensoEndpointTestRunners[
					`${definition.group}.${definition.action}.${definition.method.toLowerCase()}`
				];
			if (!runner) throw new Error(`Missing endpoint runner for ${name}`);
			const invalidInput = {
				...definition.inputExample,
				undocumentedCorsairField: 'must be rejected',
			};

			await expect(runner(ctx, invalidInput)).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedLogEvent).not.toHaveBeenCalled();
		});
	}
});
