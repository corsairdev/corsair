import type { ConnectLink, CreateConnectLinkInput } from '../management/types';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';

export function buildCloudManagement(transport: CloudTransport) {
	return {
		connect: {
			createLink: (input: CreateConnectLinkInput) =>
				cloudRequest<ConnectLink>(transport, 'POST', '/connect/links', input),
		},
		tenants: {
			create: (input: { id: string }) =>
				cloudRequest(transport, 'POST', '/tenants', input),
			list: () => cloudRequest(transport, 'GET', '/tenants'),
			get: (id: string) =>
				cloudRequest(transport, 'GET', `/tenants/${encodeURIComponent(id)}`),
		},
		connectionStatus: {
			get: (input: { tenantId: string }) =>
				cloudRequest(
					transport,
					'GET',
					`/connection-status?tenantId=${encodeURIComponent(input.tenantId)}`,
				),
		},
		disconnect: (input: { tenantId: string; plugin: string }) =>
			cloudRequest(transport, 'POST', '/disconnect', input),
		plugins: {
			list: () => cloudRequest(transport, 'GET', '/plugins'),
			get: (id: string) =>
				cloudRequest(transport, 'GET', `/plugins/${encodeURIComponent(id)}`),
		},
		discover: () => cloudRequest(transport, 'GET', '/call'),
	};
}
