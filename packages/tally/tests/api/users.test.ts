import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type { UsersGetMeResponse } from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getKey, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Users', () => {
	const key = getKey();

	it('usersGetMe returns user object with expected fields', async () => {
		const result = await makeTallyRequest<UsersGetMeResponse>('users/me', key, {
			method: 'GET',
		});
		TallyEndpointOutputSchemas.usersGetMe.parse(result);
		expect(result.id).toBeTruthy();
		expect(typeof result.id).toBe('string');
	});

	it('usersGetMe includes subscription plan and email', async () => {
		const result = await makeTallyRequest<
			UsersGetMeResponse & {
				email?: string;
				subscriptionPlan?: string;
				organizationId?: string;
			}
		>('users/me', key, { method: 'GET' });

		expect(result.email).toBeTruthy();
		expect(result.subscriptionPlan).toBeDefined();
		expect(['FREE', 'PRO', 'BUSINESS']).toContain(result.subscriptionPlan);
		expect(result.organizationId).toBeTruthy();
	});

	it('rejects invalid API key with an error', async () => {
		await expect(
			makeTallyRequest('users/me', 'invalid-key-12345', { method: 'GET' }),
		).rejects.toThrow();
	});
});
