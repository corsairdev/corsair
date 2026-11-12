export const LemonSqueezySchema = {
	version: '1.0.0',
	// Lemon Squeezy is the record: orders, subscriptions and customers live
	// there, and a local copy would be a second, staler source of truth for
	// money. The read endpoints fetch it on demand instead.
	entities: {},
} as const;
