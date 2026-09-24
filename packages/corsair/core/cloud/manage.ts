import type {
	ConnectLink,
	PermissionLookupInput,
	PermissionRecord,
} from '../management/types';
import { type TransportSource, resolveTransport } from './client';
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

// Accepts a resolved transport (project-level manage) or a lazy thunk (per-
// instance manage, whose URL isn't known until the resolve completes). Each
// method resolves the transport at call time so both callers share one builder.
export function buildCloudManagement(source: TransportSource) {
	return {
		connect: {
			createLink: (input: CreateCloudConnectLinkInput) => {
				if (!input.plugin || !input.tenantId) {
					throw new Error(
						'connect.createLink requires both "plugin" and "tenantId" in cloud mode',
					);
				}
				return resolveTransport(source).then((t) =>
					cloudRequest<ConnectLink>(t, 'POST', CLOUD_ROUTES.connectLinks, input),
				);
			},
		},
		tenants: {
			create: (input: { id: string }) =>
				resolveTransport(source).then((t) =>
					cloudRequest(t, 'POST', CLOUD_ROUTES.tenants, input),
				),
			list: () =>
				resolveTransport(source).then((t) =>
					cloudRequest(t, 'GET', CLOUD_ROUTES.tenants),
				),
			get: (id: string) =>
				resolveTransport(source).then((t) =>
					cloudRequest(
						t,
						'GET',
						CLOUD_ROUTES.tenant.replace(':id', encodeURIComponent(id)),
					),
				),
		},
		connectionStatus: {
			get: (input: { tenantId: string }) =>
				resolveTransport(source).then((t) =>
					cloudRequest(
						t,
						'GET',
						`${CLOUD_ROUTES.connectionStatus}?tenantId=${encodeURIComponent(input.tenantId)}`,
					),
				),
		},
		disconnect: (input: { tenantId: string; plugin: string }) =>
			resolveTransport(source).then((t) =>
				cloudRequest(t, 'POST', CLOUD_ROUTES.disconnect, input),
			),
		permissions: {
			// By id is the admin lookup (GET /permissions/:id); by token is the
			// public approval-page lookup (POST, so the token never lands in a URL).
			get: (input: PermissionLookupInput) =>
				resolveTransport(source).then((t) =>
					'id' in input
						? cloudRequest<PermissionRecord>(
								t,
								'GET',
								CLOUD_ROUTES.permission.replace(
									':id',
									encodeURIComponent(input.id),
								),
							)
						: cloudRequest<PermissionRecord>(
								t,
								'POST',
								CLOUD_ROUTES.permissionLookup,
								{ token: input.token },
							),
				),
		},
	};
}
