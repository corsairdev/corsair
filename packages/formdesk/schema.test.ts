import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './endpoints/types';
import { FormdeskSchema } from './schema';

describe('Formdesk schemas', () => {
	it('declares a semver version and an empty persistence model', () => {
		expect(FormdeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(FormdeskSchema.entities).toEqual({});
	});

	it('has strict input and output schemas for all 39 REST operations', () => {
		const inputs = Object.entries(FormdeskEndpointInputSchemas);
		const outputs = Object.entries(FormdeskEndpointOutputSchemas);
		expect(inputs).toHaveLength(39);
		expect(outputs.map(([name]) => name).sort()).toEqual(
			inputs.map(([name]) => name).sort(),
		);
		for (const [, schema] of inputs) {
			expect(schema.safeParse({}).success).toBe(false);
		}
		for (const [, schema] of outputs) {
			expect(schema.safeParse({}).success).toBe(false);
		}
	});

	it('rejects unknown fields, invalid tenant routing, and invalid form names', () => {
		expect(
			FormdeskEndpointInputSchemas.formsList.safeParse({
				host: 'attacker.invalid',
				domain: 'tenant',
				webhookUrl: 'https://attacker.invalid',
			}).success,
		).toBe(false);
		expect(
			FormdeskEndpointInputSchemas.formsItems.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				form: '',
			}).success,
		).toBe(false);
	});

	it('enforces the documented 10-result maximum and JSON result data', () => {
		const data = Array.from({ length: 10 }, (_, index) => ({ answer: index }));
		const valid = FormdeskEndpointInputSchemas.resultsAdd.safeParse({
			host: 'fd7.formdesk.com',
			domain: 'tenant',
			form: 'people',
			data,
		});
		expect(valid.success).toBe(true);
		const tooMany = FormdeskEndpointInputSchemas.resultsAdd.safeParse({
			host: 'fd7.formdesk.com',
			domain: 'tenant',
			form: 'people',
			data: [...data, { answer: 10 }],
		});
		expect(tooMany.success).toBe(false);
		expect(
			FormdeskEndpointInputSchemas.resultsAdd.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				form: 'people',
				data: { answer: () => 'not JSON' },
			}).success,
		).toBe(false);
	});

	it('validates account-specific user and visitor requirements', () => {
		expect(
			FormdeskEndpointInputSchemas.usersAdd.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				user: { name: 'Ada' },
			}).success,
		).toBe(false);
		expect(
			FormdeskEndpointInputSchemas.usersAdd.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				user: {
					type: 'external',
					external_userid: 'ext-1',
					external_provider: 'accounts.provider.test',
				},
			}).success,
		).toBe(true);
		expect(
			FormdeskEndpointInputSchemas.usersAdd.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				user: { type: 'API', name: 'Integration', apikey: 'test-key' },
			}).success,
		).toBe(true);
		expect(
			FormdeskEndpointInputSchemas.visitorsAdd.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				visitor: { type: 'external', external_userid: 'ext-1' },
			}).success,
		).toBe(false);
	});

	it('requires exactly one sign-on identity and validates PDF settings', () => {
		expect(
			FormdeskEndpointInputSchemas.usersSignOn.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				credentials: { username: 'ada', email: 'ada@formdesk.invalid' },
			}).success,
		).toBe(false);
		expect(
			FormdeskEndpointInputSchemas.usersSignOn.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				credentials: { username: 'ada' },
			}).success,
		).toBe(true);
		expect(
			FormdeskEndpointInputSchemas.resultsPdf.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				entryId: 7,
				settings: { papersize: 'A4', orientation: 2, scaletype: 1 },
			}).success,
		).toBe(true);
		expect(
			FormdeskEndpointInputSchemas.resultsPdf.safeParse({
				host: 'fd7.formdesk.com',
				domain: 'tenant',
				entryId: 7,
				settings: { papersize: 'A4', orientation: 3 },
			}).success,
		).toBe(false);
	});

	it('validates binary response shape and the Formdesk Connect host', () => {
		expect(
			FormdeskEndpointOutputSchemas.filesContent.safeParse({
				kind: 'binary',
				contentType: 'image/png',
				base64: 'AA==',
				byteLength: 1,
			}).success,
		).toBe(true);
		expect(
			FormdeskEndpointOutputSchemas.connectWithCredentials.safeParse({
				apikey: 'secret',
				host: 'fd7.evil.test',
			}).success,
		).toBe(false);
	});
});
