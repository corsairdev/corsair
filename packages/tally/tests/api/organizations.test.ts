import 'dotenv/config';

import { makeTallyRequest } from '../../client';
import type {
	OrganizationsListInvitesResponse,
	OrganizationsListUsersResponse,
	UsersGetMeResponse,
} from '../../endpoints/types';
import { TallyEndpointOutputSchemas } from '../../endpoints/types';
import { getKey, getOrganizationId, tallyDescribe } from '../utils';

tallyDescribe('Tally API – Organizations', () => {
	const key = getKey();
	let organizationId: string;

	beforeAll(async () => {
		organizationId = await getOrganizationId(key);
	});

	it('organizationsListUsers returns array of user objects', async () => {
		const result = await makeTallyRequest<OrganizationsListUsersResponse>(
			`organizations/${organizationId}/users`,
			key,
			{ method: 'GET' },
		);
		TallyEndpointOutputSchemas.organizationsListUsers.parse(result);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThanOrEqual(1);
	});

	it('org users contain the current user', async () => {
		const me = await makeTallyRequest<
			UsersGetMeResponse & { email?: string }
		>('users/me', key, { method: 'GET' });
		const users = await makeTallyRequest<OrganizationsListUsersResponse>(
			`organizations/${organizationId}/users`,
			key,
			{ method: 'GET' },
		);
		const ids = (users as Array<{ id: string }>).map((u) => u.id);
		expect(ids).toContain(me.id);
	});

	it('organizationsListInvites returns array', async () => {
		const result = await makeTallyRequest<OrganizationsListInvitesResponse>(
			`organizations/${organizationId}/invites`,
			key,
			{ method: 'GET' },
		);
		TallyEndpointOutputSchemas.organizationsListInvites.parse(result);
		expect(Array.isArray(result)).toBe(true);
	});

	it('listUsers with invalid org id throws', async () => {
		await expect(
			makeTallyRequest('organizations/invalid_org_xyz/users', key, {
				method: 'GET',
			}),
		).rejects.toThrow();
	});
});
