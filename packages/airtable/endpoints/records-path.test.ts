import { create, get } from './records';

const requested: string[] = [];

beforeEach(() => {
	requested.length = 0;
	global.fetch = (async (url: unknown) => {
		requested.push(String(url));
		const payload = { id: 'rec1', createdTime: '', fields: {}, records: [] };
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
});

it('keeps a table name with reserved characters inside one path segment', async () => {
	const ctx = { key: 'key', db: {} } as never;
	const table = { baseId: 'appBase', tableIdOrName: 'Sales/Leads #2' };

	await create(ctx, { ...table, fields: { Name: 'a' } });
	await get(ctx, { ...table, recordId: 'rec1' });

	expect(requested.map((url) => new URL(url).pathname)).toEqual([
		'/v0/appBase/Sales%2FLeads%20%232',
		'/v0/appBase/Sales%2FLeads%20%232/rec1',
	]);
});
