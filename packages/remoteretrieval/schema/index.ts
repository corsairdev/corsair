/**
 * Remote Retrieval is the system of record for the orders it books, and an order is
 * a live logistics job whose shipment statuses change as carriers scan boxes. A
 * cached copy would show a device in transit long after it arrived. Nothing is
 * persisted and no entities are declared.
 */
export const RemoteRetrievalSchema = {
	version: '1.0.0',
	entities: {},
} as const;
