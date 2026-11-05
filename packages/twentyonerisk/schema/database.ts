/**
 * This plugin declares no database entities.
 *
 * 21RISK's OData v5 service defines its entity shapes in a `$metadata`
 * document that is served only to authenticated callers, and the field-level
 * documentation on 21risk.com sits behind a login. There is therefore no
 * public source to model these rows from.
 *
 * Organizations, sites and reports are durable records that would be worth
 * caching, so this is a gap to close rather than a design decision: entities
 * belong here once a `$metadata` response can be read and transcribed
 * field-for-field. Declaring speculative columns in the meantime would create
 * tables that never match the service.
 *
 * Endpoint responses are fully typed and validated in `endpoints/types.ts`
 * regardless.
 */
export {};
