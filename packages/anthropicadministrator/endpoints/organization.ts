import type { AnthropicAdministratorEndpoints } from '../index';
import { callAdminApi } from './shared';
import { AnthropicAdministratorEndpointOutputSchemas as OutputSchemas } from './types/index';

/** GET /v1/organizations/me */
export const getOrganization: AnthropicAdministratorEndpoints['getOrganization'] =
	async (ctx) => {
		return callAdminApi(
			ctx,
			'organization.getOrganization',
			OutputSchemas.getOrganization,
			'/v1/organizations/me',
			{ method: 'GET' },
		);
	};
