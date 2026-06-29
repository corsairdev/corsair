const DEFAULT_LOCAL_PORT = '3000';
const DEFAULT_DELIVERY_PATH = '/api/corsair';

function stripTrailingSlash(url: string) {
	return url.replace(/\/$/, '');
}

function withDeliveryPath(baseUrl: string, path: string) {
	return `${stripTrailingSlash(baseUrl)}${path}`;
}

function toAbsoluteUrl(value: string) {
	return value.startsWith('http') ? value : `https://${value}`;
}

export function resolveHubDeliveryUrl(input?: {
	deliveryUrl?: string;
	deliveryPath?: string;
}): string {
	const explicit = input?.deliveryUrl?.trim();
	if (explicit) {
		return stripTrailingSlash(explicit);
	}

	const deliveryPath = input?.deliveryPath?.trim() || DEFAULT_DELIVERY_PATH;
	const path = deliveryPath.startsWith('/') ? deliveryPath : `/${deliveryPath}`;

	const corsairDeliveryUrl = process.env.CORSAIR_DELIVERY_URL?.trim();
	if (corsairDeliveryUrl) {
		return stripTrailingSlash(toAbsoluteUrl(corsairDeliveryUrl));
	}

	const appBaseUrl =
		process.env.APP_URL?.trim() ||
		process.env.NEXT_PUBLIC_APP_URL?.trim() ||
		process.env.VERCEL_URL?.trim();

	if (appBaseUrl) {
		return withDeliveryPath(toAbsoluteUrl(appBaseUrl), path);
	}

	const port = process.env.PORT?.trim() || DEFAULT_LOCAL_PORT;
	return `http://localhost:${port}${path}`;
}
