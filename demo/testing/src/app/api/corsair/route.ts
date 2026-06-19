import { respondToHubDeliveryFromRequest } from 'corsair/hub';

import { corsair } from '@/server/corsair';

export const GET = (request: Request) =>
	respondToHubDeliveryFromRequest(corsair, request);

export const POST = (request: Request) =>
	respondToHubDeliveryFromRequest(corsair, request);
