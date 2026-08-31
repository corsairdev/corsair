import { DripcelAPIError, makeDripcelRequest } from './client';
import { DripcelTag } from './schema';

const LIVE_KEY = process.env.DRIPCEL_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Dripcel live API', () => {
	it('rejects an invalid API key on GET /balance', async () => {
		const err = await makeDripcelRequest(
			'/balance',
			'invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(DripcelAPIError);
	});

	it('returns a numeric credit balance', async () => {
		const balance = await makeDripcelRequest<number>(
			'/balance',
			LIVE_KEY as string,
		);
		expect(typeof balance).toBe('number');
	});

	it('lists tags with official fields', async () => {
		const tags = await makeDripcelRequest<unknown[]>(
			'/tags',
			LIVE_KEY as string,
		);
		expect(Array.isArray(tags)).toBe(true);
		if (tags[0]) {
			expect(DripcelTag.parse(tags[0])._id).toBeDefined();
		}
	});

	it('lists campaigns as an array', async () => {
		const campaigns = await makeDripcelRequest<unknown[]>(
			'/campaigns',
			LIVE_KEY as string,
		);
		expect(Array.isArray(campaigns)).toBe(true);
	});

	it('lists email templates', async () => {
		const data = await makeDripcelRequest<{ templates: unknown[] }>(
			'/email/templates',
			LIVE_KEY as string,
		);
		expect(Array.isArray(data.templates)).toBe(true);
	});

	it('searches replies', async () => {
		const replies = await makeDripcelRequest<unknown[]>(
			'/replies/search',
			LIVE_KEY as string,
			{ method: 'POST', body: {} },
		);
		expect(Array.isArray(replies)).toBe(true);
	});

	it('searches send logs', async () => {
		const data = await makeDripcelRequest<{
			total: number;
			send_logs: unknown[];
		}>('/send-logs/search', LIVE_KEY as string, {
			method: 'POST',
			body: { find: {}, options: { skip: 0, limit: 1 } },
		});
		expect(typeof data.total).toBe('number');
		expect(Array.isArray(data.send_logs)).toBe(true);
	});

	it('creates, reads, and deletes a contact', async () => {
		const local = `082${String(Date.now()).slice(-7)}`;
		const msisdn = `27${local.slice(1)}`;
		let created = false;
		try {
			const uploaded = await makeDripcelRequest<{
				validContact?: number;
				validContacts?: number;
				invalidContacts?: unknown[];
			}>('/contacts', LIVE_KEY as string, {
				method: 'POST',
				body: {
					country: 'ZA',
					contacts: [{ cell: local, firstname: 'CorsairTest' }],
				},
			});
			created = true;
			expect(uploaded.validContact ?? uploaded.validContacts).toBe(1);

			const contact = await makeDripcelRequest<{ cell?: string }>(
				`/contacts/${msisdn}`,
				LIVE_KEY as string,
			);
			expect(contact.cell).toBeDefined();
		} finally {
			if (created) {
				await makeDripcelRequest(`/contacts/${msisdn}`, LIVE_KEY as string, {
					method: 'DELETE',
				});
			}
		}
	});
});
