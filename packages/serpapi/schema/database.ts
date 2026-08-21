/**
 * No persisted entities in this plugin: every one of the 48 operations is a
 * live search or lookup against a third-party search engine's current
 * results, not a record with a durable identity a caller would look up
 * repeatedly by id - the same "query against current state, not a stable
 * record" shape as most of this repo's College Football Data plugin, but
 * true of this catalog's entire surface rather than just part of it.
 */
export {};
