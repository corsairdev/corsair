// Mastra lives behind its own subpath (`@corsair-dev/mcp/mastra`) rather than the
// main barrel: the provider extends `@mastra/core`'s BaseToolProvider, so importing
// it evaluates @mastra/core. Keeping it off `.` means an mcp consumer using another
// framework never loads @mastra/core (it's an optional peer). Single source of
// truth — the implementation lives in @corsair-dev/mastra.
export * from '@corsair-dev/mastra';
