export const EventzillaSchema = {
	version: '1.0.0',
	// No entities: nothing here is worth syncing. Events, attendees and orders
	// all change on Eventzilla's side as registrations arrive, and the API
	// exposes no updated-since filter to sync on, so a stored copy would go
	// stale without ever being knowable as stale. Every endpoint reads live.
	entities: {},
} as const;
