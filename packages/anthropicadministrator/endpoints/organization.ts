import type { AnthropicAdministratorEndpoints } from '../index';
import { callAdminApi } from './shared';
import type { AnthropicAdministratorEndpointOutputs as Outputs } from './types';

/** GET /v1/organizations/me */
export const getOrganization: AnthropicAdministratorEndpoints['getOrganization'] =
	async (ctx) => {
		return callAdminApi<Outputs['getOrganization']>(
			ctx,
			'organization.getOrganization',
			'/v1/organizations/me',
			{ method: 'GET' },
		);
	};
