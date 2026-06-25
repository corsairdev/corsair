import { respondToHubDeliveryFromRequest } from './delivery';

export function createHubRouteHandlers(corsair: unknown) {
	return {
		delivery: (request: Request) =>
			respondToHubDeliveryFromRequest(corsair, request),
		deliveryOptions: (request: Request) =>
			respondToHubDeliveryFromRequest(corsair, request),
	};
}
