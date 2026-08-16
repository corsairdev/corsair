import {
	BLAZEMETER_BASE_URLS,
	basicAuthorization,
	compactRecord,
	parseBlazemeterCredentials,
} from './client';
import { blazemeter, blazemeterAuthConfig } from './index';
import {
	BLAZEMETER_OPERATIONS,
	BlazemeterEndpointInputSchemas,
	blazemeterEndpointMeta,
	blazemeterEndpointSchemas,
	blazemeterEndpointsNested,
	buildBlazemeterBody,
	buildBlazemeterFormData,
	buildBlazemeterQuery,
	resolveBlazemeterPath,
} from './operations';

function sampleValue(type: string): unknown {
	switch (type) {
		case 'integer':
		case 'number':
			return 1;
		case 'boolean':
			return false;
		case 'object':
			return {};
		case 'array':
			return [];
		case 'unknown':
			return 'value';
		default:
			return 'value';
	}
}

function requiredInput(params: readonly string[]): Record<string, unknown> {
	return Object.fromEntries(
		params
			.filter((token) => !token.split(':')[0]?.endsWith('?'))
			.map((token) => {
				const [name, type] = token.split(':');
				return [name, sampleValue(type ?? 'string')];
			}),
	);
}

function endpointCount(value: unknown): number {
	if (typeof value === 'function') return 1;
	if (!value || typeof value !== 'object') return 0;
	return Object.values(value).reduce(
		(total, child) => total + endpointCount(child),
		0,
	);
}

describe('BlazeMeter operation catalog', () => {
	it('exposes all 92 unique catalog operations', () => {
		expect(BLAZEMETER_OPERATIONS).toHaveLength(92);
		expect(new Set(BLAZEMETER_OPERATIONS.map(({ key }) => key)).size).toBe(92);
		expect(new Set(BLAZEMETER_OPERATIONS.map(({ slug }) => slug)).size).toBe(
			92,
		);
		expect(endpointCount(blazemeterEndpointsNested)).toBe(92);
		expect(Object.keys(blazemeterEndpointSchemas)).toHaveLength(92);
		expect(Object.keys(blazemeterEndpointMeta)).toHaveLength(92);
	});

	it('covers every API family and risk class', () => {
		const byApi = Object.groupBy(BLAZEMETER_OPERATIONS, ({ api }) => api);
		expect(
			Object.fromEntries(
				Object.entries(byApi).map(([key, value]) => [key, value?.length]),
			),
		).toEqual({
			mock: 7,
			core: 51,
			asset: 26,
			tdm: 8,
		});

		const byRisk = Object.groupBy(
			BLAZEMETER_OPERATIONS,
			({ riskLevel }) => riskLevel,
		);
		expect(
			Object.fromEntries(
				Object.entries(byRisk).map(([key, value]) => [key, value?.length]),
			),
		).toEqual({
			read: 50,
			write: 27,
			destructive: 15,
		});
	});

	it.each(BLAZEMETER_OPERATIONS)(
		'$slug has a valid schema and complete path mapping',
		(definition) => {
			const input = requiredInput(definition.params);
			expect(
				BlazemeterEndpointInputSchemas[definition.key].safeParse(input).success,
			).toBe(true);

			const placeholders = [...definition.path.matchAll(/\{([^}]+)\}/g)].map(
				(match) => match[1],
			);
			expect('pathParams' in definition ? definition.pathParams : []).toEqual(
				placeholders,
			);
			expect(resolveBlazemeterPath(definition, input)).not.toMatch(/[{}]/);
			expect(blazemeterEndpointSchemas[definition.key]).toBeDefined();
			expect(blazemeterEndpointMeta[definition.key]).toMatchObject({
				riskLevel: definition.riskLevel,
				description: definition.description,
			});
		},
	);

	it.each(
		BLAZEMETER_OPERATIONS.filter(({ params }) =>
			params.some((token) => !token.split(':')[0]?.endsWith('?')),
		),
	)('$slug rejects a missing required input', (definition) => {
		const input = requiredInput(definition.params);
		const requiredName = definition.params
			.find((token) => !token.split(':')[0]?.endsWith('?'))
			?.split(':')[0];
		delete input[requiredName ?? ''];
		expect(
			BlazemeterEndpointInputSchemas[definition.key].safeParse(input).success,
		).toBe(false);
	});
});

describe('BlazeMeter request mapping', () => {
	it('encodes path parameters and rejects missing values', () => {
		const operation = BLAZEMETER_OPERATIONS.find(
			({ key }) => key === 'assets.get',
		)!;
		expect(
			resolveBlazemeterPath(operation, {
				workspaceId: 42,
				assetId: 'asset/with space',
			}),
		).toBe('/workspaces/42/assets/asset%2Fwith%20space');
		expect(() => resolveBlazemeterPath(operation, { workspaceId: 42 })).toThrow(
			'missing required path parameter: assetId',
		);
	});

	it('separates path, query, and body fields without dropping false', () => {
		const operation = BLAZEMETER_OPERATIONS.find(
			({ key }) => key === 'tests.start',
		)!;
		const input = {
			testId: 7,
			isDebugRun: false,
			delayedStart: true,
		};
		expect(buildBlazemeterQuery(operation, input)).toEqual({
			isDebugRun: false,
			delayedStart: true,
		});
		expect(buildBlazemeterBody(operation, input)).toBeUndefined();
		expect(compactRecord({ enabled: false, absent: undefined })).toEqual({
			enabled: false,
		});
	});

	it('converts base64 upload content to a Blob', async () => {
		const operation = BLAZEMETER_OPERATIONS.find(
			({ key }) => key === 'tests.uploadFile',
		)!;
		const form = buildBlazemeterFormData(operation, {
			testId: 1,
			fileContent: {
				content: Buffer.from('hello').toString('base64'),
				contentType: 'text/plain',
			},
		});
		expect(form?.file).toBeInstanceOf(Blob);
		expect(await (form?.file as Blob).text()).toBe('hello');
	});
});

describe('BlazeMeter authentication', () => {
	it('uses API key ID and secret as HTTP Basic credentials', () => {
		expect(parseBlazemeterCredentials('key-id:key:secret')).toEqual({
			apiKeyId: 'key-id',
			apiKeySecret: 'key:secret',
		});
		expect(basicAuthorization('key-id:key-secret')).toBe(
			`Basic ${Buffer.from('key-id:key-secret').toString('base64')}`,
		);
		expect(() => basicAuthorization('missing-secret')).toThrow(
			'both API key ID and secret',
		);
	});

	it('declares the secret as an account-level API-key field', () => {
		expect(blazemeterAuthConfig.api_key.account).toEqual(['api_key_secret']);
		expect(Object.keys(BLAZEMETER_BASE_URLS).sort()).toEqual([
			'asset',
			'core',
			'mock',
			'tdm',
		]);
	});

	it('builds credentials from explicit options or connected keys', async () => {
		const explicit = blazemeter({
			credentials: { apiKeyId: 'id', apiKeySecret: 'secret' },
		});
		await expect(explicit.keyBuilder?.({} as never, 'endpoint')).resolves.toBe(
			'id:secret',
		);

		const connected = blazemeter();
		await expect(
			connected.keyBuilder?.(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => 'connected-id',
						get_api_key_secret: async () => 'connected-secret',
					},
				} as never,
				'endpoint',
			),
		).resolves.toBe('connected-id:connected-secret');
	});
});
