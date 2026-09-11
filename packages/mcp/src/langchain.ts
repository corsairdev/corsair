// Own subpath (`@corsair-dev/mcp/langchain`) rather than the barrel: every
// framework adapter exports a `corsairTools`, so re-exporting them together
// would collide. @langchain/core is an optional peer the adapter imports
// lazily — only consumers of this subpath need it installed. Single source of
// truth is @corsair-dev/langchain.
export * from '@corsair-dev/langchain';
