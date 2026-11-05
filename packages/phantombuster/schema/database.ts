/**
 * No persisted entities in this plugin: every operation is a live call
 * against the PhantomBuster v2 API (agents, containers, scripts, branches,
 * org storage, identities, captchas) rather than a record with a durable
 * identity a caller would look up repeatedly by id.
 */
export {};
