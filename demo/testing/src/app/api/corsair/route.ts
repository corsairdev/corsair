import { createHubRouteHandlers } from 'corsair/hub';

import { corsair } from '@/server/corsair';

const hub = createHubRouteHandlers(corsair);

export const GET = hub.delivery;
export const POST = hub.delivery;
export const OPTIONS = hub.deliveryOptions;
