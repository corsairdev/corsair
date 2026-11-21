/**
 * Storeganise has no read models Corsair should persist: the API returns
 * live records (sites, units, users, invoices, rentals), and webhook
 * deliveries carry ids the caller resolves with the read operations. So no
 * entities are declared.
 */
export const StoreganiseSchema = {
	version: '1.0.0',
	entities: {},
} as const;
