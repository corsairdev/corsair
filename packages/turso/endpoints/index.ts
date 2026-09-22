import { listen } from './changes';
import { closest } from './regions';
import { validate } from './tokens';

/** Edge-location lookup. */
export const Regions = {
	/** Report the Turso edge location closest to the caller. */
	closest,
};

/** API token operations. */
export const Tokens = {
	/** Validate the configured API token and report its expiry. */
	validate,
};

/** Committed-change streaming. */
export const Changes = {
	/** Stream committed insert/update/delete events for a table. */
	listen,
};

export * from './types';
