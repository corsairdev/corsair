import type { HubConnectSessionResponseOptions } from './connect-response';
import { respondToHubConnectSessionFromRequest } from './connect-response';
import { respondToHubDeliveryFromRequest } from './delivery';

export type HubRouteHandlersOptions = HubConnectSessionResponseOptions;

export function createHubRouteHandlers(
	corsair: unknown,
	options?: HubRouteHandlersOptions,
) {
	return {
		delivery: (request: Request) =>
			respondToHubDeliveryFromRequest(corsair, request),
		deliveryOptions: (request: Request) =>
			respondToHubDeliveryFromRequest(corsair, request),
		createConnectSession: (request: Request) =>
			respondToHubConnectSessionFromRequest(corsair, request, options),
	};
}
