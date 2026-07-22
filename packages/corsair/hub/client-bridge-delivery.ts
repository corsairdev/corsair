import { randomUUID } from 'node:crypto';
import { normalizeBridgeTargetOrigin } from './browser-delivery-html';
import type { HubEnvironmentSlug } from './contracts/environment';
import { resolveDeliveryTransport } from './contracts/environment';
import type { BrowserDeliveryPayload } from './contracts/tunnel';
import {
	buildBrowserDeliveryRedirectUrl,
	signBrowserDeliveryToken,
} from './signing/browser-delivery';

export type ClientBridgeDeliverySpec =
	| {
			deliveryMode: 'connections.sync';
			deliveryUrl: string;
			projectId: string;
			signingSecret: string;
			hubOrigin: string;
			requestId: string;
	  }
	| {
			deliveryMode: 'connect.create_link';
			deliveryUrl: string;
			projectId: string;
			signingSecret: string;
			hubOrigin: string;
			requestId: string;
			tenantId: string;
			plugins: string[];
	  };

export type ClientBridgeTransportResult =
	| { transport: 'server' }
	| { transport: 'browser'; deliveryUrl: string; requestId: string };

function buildClientBridgePayload(
	spec: ClientBridgeDeliverySpec,
): Omit<BrowserDeliveryPayload, 'exp' | 'iat' | 'jti'> {
	const bridgeTargetOrigin = normalizeBridgeTargetOrigin(spec.hubOrigin);
	const base = {
		connectJti: spec.requestId,
		projectId: spec.projectId,
		hubSuccessUrl: spec.hubOrigin,
		deliveryMode: spec.deliveryMode,
		hubOrigin: bridgeTargetOrigin,
		requestId: spec.requestId,
	};

	switch (spec.deliveryMode) {
		case 'connections.sync':
			return {
				...base,
				plugin: 'connections.sync',
				tenantId: '*',
			};
		case 'connect.create_link':
			return {
				...base,
				plugin: 'connect.create_link',
				tenantId: spec.tenantId,
				connectLinkPlugins: spec.plugins,
			};
	}
}

export function buildClientBridgeBrowserDeliveryUrl(
	spec: ClientBridgeDeliverySpec,
): string {
	const signedDelivery = signBrowserDeliveryToken(
		buildClientBridgePayload(spec),
		spec.signingSecret,
	);
	return buildBrowserDeliveryRedirectUrl(spec.deliveryUrl, signedDelivery);
}

export type PrepareClientBridgeDeliveryTransportInput =
	| {
			deliveryMode: 'connections.sync';
			deliveryUrl: string;
			projectId: string;
			signingSecret: string;
			hubOrigin?: string;
			environmentSlug: HubEnvironmentSlug;
	  }
	| {
			deliveryMode: 'connect.create_link';
			deliveryUrl: string;
			projectId: string;
			signingSecret: string;
			hubOrigin?: string;
			environmentSlug: HubEnvironmentSlug;
			tenantId: string;
			plugins: string[];
	  };

export function prepareClientBridgeDeliveryTransport(
	spec: PrepareClientBridgeDeliveryTransportInput,
): ClientBridgeTransportResult {
	const transport = resolveDeliveryTransport(spec.environmentSlug);
	if (transport === 'server') {
		return { transport: 'server' };
	}

	if (!spec.hubOrigin) {
		throw new Error(
			`hubOrigin is required for development ${spec.deliveryMode} delivery`,
		);
	}

	const requestId = randomUUID();
	const deliverySpec = {
		...spec,
		hubOrigin: spec.hubOrigin,
		requestId,
	} as ClientBridgeDeliverySpec;
	return {
		transport: 'browser',
		requestId,
		deliveryUrl: buildClientBridgeBrowserDeliveryUrl(deliverySpec),
	};
}
