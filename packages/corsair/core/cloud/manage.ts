import type { ConnectLink } from '../management/types';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';
import { CLOUD_ROUTES } from './routes';

// The cloud contract (contract.openapi.yaml /connect/links) requires both
// fields; local Hub mode leaves them optional. Narrow the type here so a
// type-correct call can't silently omit either one.
export type CreateCloudConnectLinkInput = {
	plugin: string;
	tenantId: string;
	oauthMode?: 'byo' | 'managed';
	providerName?: string;
};

export function buildCloudManagement(transport: CloudTransport) {
	return {
		connect: {
			createLink: (input: CreateCloudConnectLinkInput) => {
				if (!input.plugin || !input.tenantId) {
					throw new Error(
						'connect.createLink requires both "plugin" and "tenantId" in cloud mode',
					);
				}
				return cloudRequest<ConnectLink>(
					transport,
					'POST',
					CLOUD_ROUTES.connectLinks,
					input,
				);
			},
		},
		tenants: {
			create: (input: { id: string }) =>
				cloudRequest(transport, 'POST', CLOUD_ROUTES.tenants, input),
			list: () => cloudRequest(transport, 'GET', CLOUD_ROUTES.tenants),
			get: (id: string) =>
				cloudRequest(
					transport,
					'GET',
					CLOUD_ROUTES.tenant.replace(':id', encodeURIComponent(id)),
				),
		},
		connectionStatus: {
			get: (input: { tenantId: string }) =>
				cloudRequest(
					transport,
					'GET',
					`${CLOUD_ROUTES.connectionStatus}?tenantId=${encodeURIComponent(input.tenantId)}`,
				),
		},
		disconnect: (input: { tenantId: string; plugin: string }) =>
			cloudRequest(transport, 'POST', CLOUD_ROUTES.disconnect, input),
	};
}
