// Dedupes concurrent token refreshes for one credential store. The store is the
// per-(instance, plugin, tenant) key-manager object, used as the WeakMap owner:
// two Corsair instances with separate stores must NOT share a flight, or one
// instance would receive the other's freshly minted access token and skip
// persisting to its own store, leaving its refresh_token stale. Within one store
// the inner key separates a forced (401) refresh from a routine one.
const flightsByStore = new WeakMap<object, Map<string, Promise<unknown>>>();

/**
 * Runs `run` at most once per (store, key) while a previous call is still
 * unsettled: concurrent callers with the same store and key share the
 * in-flight promise instead of executing `run` again. The flight is removed
 * once it settles, so later calls execute fresh.
 */
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

/**
 * True while the store owns at least one unsettled flight. Lets caches that
 * key off store identity (e.g. the shared account-key-manager cache in
 * core/client) evict only idle entries: dropping a manager mid-refresh would
 * hand the next caller a fresh flight map and split the single-flight.
 */
export function hasInflightFlights(store: object): boolean {
	const flights = flightsByStore.get(store);
	return flights !== undefined && flights.size > 0;
}
