/**
 * Minimal endpoint context: the auth key plus the event-logging resolver.
 * Full plugin contexts are assignable to this (they carry at least these
 * fields), so endpoint implementations stay decoupled and tests can build
 * fixtures without type assertions.
 */
export type ClickupRequestContext = {
	readonly key: string;
	readonly $getAccountId: () => Promise<string>;
};
