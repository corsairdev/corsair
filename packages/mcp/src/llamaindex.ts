// Own subpath (`@corsair-dev/mcp/llamaindex`) rather than the barrel: every
// framework adapter exports a `corsairTools`, so re-exporting them together
// would collide. @llamaindex/core is an optional peer the adapter imports
// lazily — only consumers of this subpath need it installed. Single source of
// truth is @corsair-dev/llamaindex.
export * from '@corsair-dev/llamaindex';
