const DEFAULT_LOCAL_PORT = '3000';
const DEFAULT_DELIVERY_PATH = '/api/corsair';

function normalizeBaseUrl(baseUrl: string): string {
	return baseUrl.replace(/\/$/, '');
}

export function resolveHubDeliveryUrl(input?: {
	deliveryUrl?: string;
	deliveryPath?: string;
}): string {
	const explicit = input?.deliveryUrl?.trim();
	if (explicit) {
		return explicit;
	}

	const deliveryPath = input?.deliveryPath?.trim() || DEFAULT_DELIVERY_PATH;
	const path = deliveryPath.startsWith('/') ? deliveryPath : `/${deliveryPath}`;

	const fromEnv =
		process.env.CORSAIR_DELIVERY_URL?.trim() ||
		process.env.APP_URL?.trim() ||
		process.env.NEXT_PUBLIC_APP_URL?.trim() ||
		process.env.VERCEL_URL?.trim();

	if (fromEnv) {
		const base = fromEnv.startsWith('http') ? fromEnv : `https://${fromEnv}`;
		return `${normalizeBaseUrl(base)}${path}`;
	}

	const port = process.env.PORT?.trim() || DEFAULT_LOCAL_PORT;
	return `http://localhost:${port}${path}`;
}
