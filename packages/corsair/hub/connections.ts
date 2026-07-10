import { hubApiGet } from './client/http';
import { getHubConfig } from './config';
import { parseProjectConnectionsResponse } from './contracts/connect-api';
import type {
	HubListProjectConnectionsInput,
	HubProjectConnection,
} from './types';

export async function listHubProjectConnections(
	corsair: unknown,
	input: HubListProjectConnectionsInput,
): Promise<HubProjectConnection[]> {
	const hub = getHubConfig(corsair);

	return hubApiGet({
		hub,
		path: `/projects/${encodeURIComponent(input.projectId)}/connections`,
		notFoundMessage:
			'Hub REST API not found at /projects/:id/connections. Check HUB_API_URL and ensure the Hub API is deployed.',
		parseResponse: parseProjectConnectionsResponse,
	});
}
