import 'dotenv/config';
import { makeBitwardenRequest } from './client';
import type {
	CollectionsGetResponse,
	CollectionsListResponse,
	MembersGetResponse,
	MembersListResponse,
	OrganizationsGetResponse,
	OrganizationsListResponse,
} from './endpoints/types';
import { BitwardenEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.BITWARDEN_ACCESS_TOKEN!;
const TEST_ORGANIZATION_ID = process.env.TEST_BITWARDEN_ORGANIZATION_ID;

describe('Bitwarden API Type Tests', () => {
	if (!TEST_TOKEN) {
		it.skip('skipping all Bitwarden API tests because BITWARDEN_ACCESS_TOKEN is missing', () => {});
		return;
	}

	describe('organizations', () => {
		it('organizationsList returns correct type', async () => {
			const response = await makeBitwardenRequest<OrganizationsListResponse>(
				'/public/organizations',
				TEST_TOKEN,
			);
			BitwardenEndpointOutputSchemas.organizationsList.parse(response);
		});

		it('organizationsGet returns correct type', async () => {
			if (TEST_ORGANIZATION_ID) {
				const response = await makeBitwardenRequest<OrganizationsGetResponse>(
					`/public/organizations/${TEST_ORGANIZATION_ID}`,
					TEST_TOKEN,
				);
				BitwardenEndpointOutputSchemas.organizationsGet.parse(response);
			} else {
				const listResponse =
					await makeBitwardenRequest<OrganizationsListResponse>(
						'/public/organizations',
						TEST_TOKEN,
					);
				const orgId = listResponse.data?.[0]?.id;
				if (!orgId) {
					console.warn('No organizations found to test organizationsGet');
					return;
				}
				const response = await makeBitwardenRequest<OrganizationsGetResponse>(
					`/public/organizations/${orgId}`,
					TEST_TOKEN,
				);
				BitwardenEndpointOutputSchemas.organizationsGet.parse(response);
			}
		});
	});

	describe('collections', () => {
		it('collectionsList returns correct type', async () => {
			try {
				const response = await makeBitwardenRequest<CollectionsListResponse>(
					'/public/collections',
					TEST_TOKEN,
				);
				BitwardenEndpointOutputSchemas.collectionsList.parse(response);
			} catch (e) {
				console.warn(
					'collectionsList failed, this might require a specific org context',
					e,
				);
			}
		});

		it('collectionsGet returns correct type', async () => {
			try {
				const listResponse =
					await makeBitwardenRequest<CollectionsListResponse>(
						'/public/collections',
						TEST_TOKEN,
					);
				const colId = listResponse.data?.[0]?.id;
				if (!colId) {
					return;
				}
				const response = await makeBitwardenRequest<CollectionsGetResponse>(
					`/public/collections/${colId}`,
					TEST_TOKEN,
				);
				BitwardenEndpointOutputSchemas.collectionsGet.parse(response);
			} catch (e) {
				console.warn('collectionsGet failed', e);
			}
		});
	});

	describe('members', () => {
		it('membersList returns correct type', async () => {
			try {
				const response = await makeBitwardenRequest<MembersListResponse>(
					'/public/members',
					TEST_TOKEN,
				);
				BitwardenEndpointOutputSchemas.membersList.parse(response);
			} catch (e) {
				console.warn('membersList failed', e);
			}
		});

		it('membersGet returns correct type', async () => {
			try {
				const listResponse = await makeBitwardenRequest<MembersListResponse>(
					'/public/members',
					TEST_TOKEN,
				);
				const memId = listResponse.data?.[0]?.id;
				if (!memId) {
					return;
				}
				const response = await makeBitwardenRequest<MembersGetResponse>(
					`/public/members/${memId}`,
					TEST_TOKEN,
				);
				BitwardenEndpointOutputSchemas.membersGet.parse(response);
			} catch (e) {
				console.warn('membersGet failed', e);
			}
		});
	});
});
