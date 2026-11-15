import 'dotenv/config';
import { makeCodacyRequest } from './client';

const API_TOKEN = process.env.CODACY_API_TOKEN;
const PROVIDER = process.env.CODACY_PROVIDER ?? 'gh';
const ORGANIZATION = process.env.CODACY_ORGANIZATION;

const describeWhenCreds = API_TOKEN && ORGANIZATION ? describe : describe.skip;

describeWhenCreds('Codacy live API smoke tests', () => {
	const token = API_TOKEN as string;
	const organization = ORGANIZATION as string;

	it('retrieves the authenticated user', async () => {
		const response = await makeCodacyRequest<{ data: { id: number } }>(
			'/user',
			token,
		);

		expect(response).toBeDefined();
		expect(response.data.id).toEqual(expect.any(Number));
	});

	it('lists organizations', async () => {
		const response = await makeCodacyRequest<{
			data: Array<{ name: string }>;
		}>('/user/organizations', token, { query: { limit: 5 } });

		expect(response).toBeDefined();
		expect(Array.isArray(response.data)).toBe(true);
	});

	it('lists organization repositories', async () => {
		const response = await makeCodacyRequest<{
			data: Array<{ name: string }>;
		}>(`/organizations/${PROVIDER}/${organization}/repositories`, token, {
			query: { limit: 5 },
		});

		expect(response).toBeDefined();
		expect(Array.isArray(response.data)).toBe(true);
	});

	it('lists available tools', async () => {
		const response = await makeCodacyRequest<{
			data: Array<{ uuid: string; name: string }>;
		}>('/tools', token, { query: { limit: 5 } });

		expect(response).toBeDefined();
		expect(Array.isArray(response.data)).toBe(true);

		if (response.data.length > 0) {
			const first = response.data[0];
			if (first) {
				const patterns = await makeCodacyRequest<{
					data: Array<{ id: string }>;
				}>(`/tools/${first.uuid}/patterns`, token, {
					query: { limit: 5 },
				});
				expect(Array.isArray(patterns.data)).toBe(true);
			}
		}
	});
});
