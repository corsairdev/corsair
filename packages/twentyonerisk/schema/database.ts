/**
 * No cached entities are declared.
 *
 * 21RISK exposes a read-only OData v5 service whose entity shapes are defined
 * by its `$metadata` document. That document is served only to authenticated
 * callers, and the field-level documentation on 21risk.com sits behind a login,
 * so there is no public source to model these rows from.
 *
 * Declaring speculative columns would create tables that never match the
 * service, so entities are added once a `$metadata` response can be read and
 * transcribed. Endpoint responses remain fully typed and validated in
 * `endpoints/types.ts` in the meantime.
 */
export {};
