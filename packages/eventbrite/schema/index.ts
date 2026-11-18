// Eventbrite's answer shapes are read directly and not cached: the plugin
// stores no copy of an event, order or attendee. A local mirror would go stale
// the moment an organizer edits the event, and Eventbrite's own listing routes
// already filter by `changed_since` for anyone who needs incremental reads.
export const EventbriteSchema = {
	version: '1.0.0',
	entities: {},
} as const;
