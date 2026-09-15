import type { ConnectLink, CreateConnectLinkInput } from '../management/types';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';
import { CLOUD_ROUTES } from './routes';

export function buildCloudManagement(transport: CloudTransport) {
	return {
		connect: {
			createLink: (input: CreateConnectLinkInput) =>
				cloudRequest<ConnectLink>(
					transport,
					'POST',
					CLOUD_ROUTES.connectLinks,
					input,
				),
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
		plugins: {
			list: () => cloudRequest(transport, 'GET', CLOUD_ROUTES.plugins),
			get: (id: string) =>
				cloudRequest(
					transport,
					'GET',
					CLOUD_ROUTES.plugin.replace(':id', encodeURIComponent(id)),
				),
		},
		discover: () => cloudRequest(transport, 'GET', CLOUD_ROUTES.discover),
	};
}
