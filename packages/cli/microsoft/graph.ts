export const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

export async function createGraphSubscription(
	accessToken: string,
	notificationUrl: string,
	resource: string,
	changeType: string,
	clientState: string,
	expiryMinutes: number,
): Promise<{ id: string; expirationDateTime: string }> {
	const expirationDateTime = new Date(
		Date.now() + expiryMinutes * 60 * 1000,
	).toISOString();

	const response = await fetch(`${GRAPH_API_BASE}/subscriptions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			changeType,
			notificationUrl,
			resource,
			expirationDateTime,
			clientState,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Graph subscription failed: ${error}`);
	}

	return response.json() as Promise<{ id: string; expirationDateTime: string }>;
}
