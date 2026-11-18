// Shippo's objects are read directly and not cached: a shipment, rate or
// transaction is disposable and immutable, and a stored copy would go stale the
// moment a label is refunded or a tracking status advances. Shippo's own list
// routes already filter by `object_created_gt`/`_lt` for incremental reads.
export const ShippoSchema = {
	version: '1.0.0',
	entities: {},
} as const;
