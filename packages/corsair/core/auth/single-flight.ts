// Dedupes concurrent work per owner. Token refreshes use the database as owner
// and the account row in the key, so one account refreshes once however its
// key manager was built.
const flightsByStore = new WeakMap<object, Map<string, Promise<unknown>>>();

export function singleFlight<T>(
	store: object,
	key: string,
	run: () => Promise<T>,
): Promise<T> {
	let flights = flightsByStore.get(store);
	if (!flights) {
		flights = new Map();
		flightsByStore.set(store, flights);
	}
	const existing = flights.get(key) as Promise<T> | undefined;
	if (existing !== undefined) return existing;
	const pending = run().finally(() => {
		flights.delete(key);
	});
	flights.set(key, pending);
	return pending;
}

type AccountFlight = <T>(key: string, run: () => Promise<T>) => Promise<T>;

/**
 * Per account where the keys know their account (the SDK's key manager);
 * otherwise per keys object, as before, for keys a plugin or test builds itself.
 */
export function refreshFlight<T>(
	keys: object,
	key: string,
	run: () => Promise<T>,
): Promise<T> {
	const own = (keys as { single_flight?: AccountFlight }).single_flight;
	return typeof own === 'function'
		? own(key, run)
		: singleFlight(keys, key, run);
}
