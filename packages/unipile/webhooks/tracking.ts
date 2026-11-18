import { defineUnipileWebhook } from './define';
import { TrackingClickEventSchema, TrackingOpenEventSchema } from './types';

// Someone opened an email sent with open tracking.
export const trackingOpen = defineUnipileWebhook(
	'trackingOpen',
	'tracking.open',
	TrackingOpenEventSchema,
);

// Someone clicked a tracked link in an email.
export const trackingClick = defineUnipileWebhook(
	'trackingClick',
	'tracking.click',
	TrackingClickEventSchema,
);
