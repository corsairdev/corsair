export const SquareSchema = {
	version: '1.0.0',
	// Payments, orders, invoices, customers and the catalog live on Square's
	// side and change under the seller's feet; nothing here is worth
	// mirroring locally.
	entities: {},
} as const;
