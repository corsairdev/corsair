// Dedupes concurrent token refreshes for one credential store. The store is the
// WeakMap owner: two Corsair instances with separate stores must NOT share a
// flight, or one instance would receive the other's freshly minted access token
// and skip persisting to its own store, leaving its refresh_token stale. Within
// one store the inner key separates a forced (401) refresh from a routine one.
//
// Account key managers are rebuilt per client (withTenant() creates a new one on
// every call), so they bind the stable credential store they come from. Callers
// that pass a manager as the store should pass it through flightStoreOf() to
// join the same flight as every other client of that store.
const flightsByStore = new WeakMap<object, Map<string, Promise<unknown>>>();
const logicalStores = new WeakMap<object, object>();

/** Attach the stable logical store to a per-client object. */
export function bindFlightStore(owner: object, store: object): void {
	logicalStores.set(owner, store);
}

/** The stable logical store for `owner`, or `owner` itself when none was bound. */
export function flightStoreOf(owner: object): object {
	return logicalStores.get(owner) ?? owner;
}

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
