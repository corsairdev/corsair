import { fireberryEndpointSchemas } from './index';

describe('Fireberry endpoint schemas', () => {
	it('validates every registered operation input and rejects callback residue', () => {
		const inputs = [
			[
				fireberryEndpointSchemas['records.list'].input,
				{ object: 'account', pageSize: 50, pageNumber: 1 },
			],
			[
				fireberryEndpointSchemas['records.get'].input,
				{ object: 'account', id: 'record-id' },
			],
			[
				fireberryEndpointSchemas['records.create'].input,
				{ object: 'account', data: { accountname: 'Example' } },
			],
			[
				fireberryEndpointSchemas['records.update'].input,
				{
					object: 'account',
					id: 'record-id',
					data: { accountname: 'Changed' },
				},
			],
			[
				fireberryEndpointSchemas['records.delete'].input,
				{ object: 'account', id: 'record-id' },
			],
			[
				fireberryEndpointSchemas['records.query'].input,
				{ objectType: 1, fields: [{ name: 'accountname' }] },
			],
			[fireberryEndpointSchemas['metadata.objects'].input, {}],
			[fireberryEndpointSchemas['metadata.object'].input, { id: 1 }],
			[fireberryEndpointSchemas['metadata.fields'].input, { id: 1 }],
			[
				fireberryEndpointSchemas['metadata.field'].input,
				{ id: 1, fieldName: 'accountname' },
			],
			[
				fireberryEndpointSchemas['metadata.picklist'].input,
				{ id: 1, fieldName: 'industrycode' },
			],
			[
				fireberryEndpointSchemas['batch.create'].input,
				{ objectCode: '1', data: [{ accountname: 'Example' }] },
			],
			[
				fireberryEndpointSchemas['batch.update'].input,
				{
					objectCode: '1',
					data: [{ id: 'record-id', record: { accountname: 'Changed' } }],
				},
			],
			[
				fireberryEndpointSchemas['batch.delete'].input,
				{ objectCode: 'account', ids: ['record-id'] },
			],
		] as const;
		for (const [schema, input] of inputs)
			expect(schema.safeParse(input).success).toBe(true);
		expect(
			fireberryEndpointSchemas['records.get'].input.safeParse({
				object: 'account',
				id: 'id',
				webhookUrl: 'https://example.test',
			}).success,
		).toBe(false);
	});

	it('enforces Fireberry pagination and batch size limits', () => {
		expect(
			fireberryEndpointSchemas['records.list'].input.safeParse({
				object: 'account',
				pageSize: 51,
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.list'].input.safeParse({
				object: 'account',
				pageNumber: 11,
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.query'].input.safeParse({
				objectType: 1,
				fields: [{ name: 'accountname' }],
				pageSize: 501,
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['batch.delete'].input.safeParse({
				objectCode: 'account',
				ids: Array.from({ length: 21 }, (_, index) => `record-${index}`),
			}).success,
		).toBe(false);
	});

	it('validates documented response envelopes and query v3 paging fields', () => {
		expect(
			fireberryEndpointSchemas['records.list'].output.safeParse({
				success: true,
				data: {
					PrimaryKey: 'accountid',
					PrimaryField: 'accountname',
					Total_Records: 1,
					Page_Size: 50,
					Page_Number: 1,
					Records: [{ accountname: 'Example' }],
				},
				message: '',
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['records.query'].output.safeParse({
				success: true,
				data: [{ _id: 'record-id', accountname: 'Example' }],
				message: '',
				pageNumber: 1,
				pageSize: 25,
				isLastPage: true,
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['metadata.field'].output.safeParse({
				success: true,
				data: {
					label: 'Account Name',
					fieldName: 'accountname',
					systemFieldTypeId: 'string',
					fieldObjectType: 'account',
					systemName: 'accountname',
				},
				message: '',
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['batch.delete'].output.safeParse({}).success,
		).toBe(true);
	});
});
