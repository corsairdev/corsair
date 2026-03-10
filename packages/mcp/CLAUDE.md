# @corsair-dev/mcp — Extension Guide

## How adapters work

All tool logic lives once in `src/core/tools.ts` (`buildCorsairToolDefs`). Adapters are thin wrappers that translate `CorsairToolDef[]` into whatever format a specific SDK expects.

```
src/core/tools.ts          ← all 4 tool definitions live here
src/core/provider.ts       ← BaseProvider<TOutput> abstract class
src/adapters/claude.ts     ← ClaudeProvider  (async, does NOT extend BaseProvider)
src/adapters/mastra.ts     ← MastraProvider  (async, does NOT extend BaseProvider)
src/adapters/openai.ts     ← plain function  (different pattern — MCP over HTTP)
src/adapters/vercel-ai.ts  ← plain function  (different pattern — MCP over HTTP)
```

---

## Path 1: Extend `BaseProvider` (sync SDK, direct import)

Use this when the target SDK's tool constructor is **synchronous** and the package can be a **direct import** (not an optional peer dep requiring dynamic import).

```typescript
// src/adapters/langchain.ts
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BaseProvider, type CorsairToolDef } from '../core/provider.js';

export class LangchainProvider extends BaseProvider<DynamicStructuredTool> {
  readonly name = 'langchain';

  wrapTool(def: CorsairToolDef): DynamicStructuredTool {
    return new DynamicStructuredTool({
      name: def.name,
      description: def.description,
      schema: z.object(def.shape),
      func: def.handler,
    });
  }
}
```

`build(options)` is inherited — no need to implement it.

---

## Path 2: Own async `build()` (optional peer dep)

Use this when the SDK is an **optional peer dependency** that must be dynamically imported. The dynamic import forces `build()` to be async, which is incompatible with `BaseProvider.build()` (sync). Do not try to extend `BaseProvider` here — just implement the class directly.

```typescript
// src/adapters/my-sdk.ts
import { z } from 'zod';
import type { BaseMcpOptions } from '../core/adapters.js';
import { buildCorsairToolDefs } from '../core/tools.js';

export class MySdkProvider {
  readonly name = 'my-sdk';

  async build(options: BaseMcpOptions) {
    const { createTool } = await import('my-sdk'); // optional peer dep
    return buildCorsairToolDefs(options).map(def =>
      createTool({
        name: def.name,
        description: def.description,
        schema: z.object(def.shape),
        run: def.handler,
      }),
    );
  }
}
```

`ClaudeProvider` and `MastraProvider` both follow this pattern.

---

## Caveats

### Handler return type
`CorsairToolDef.handler` returns `Promise<CallToolResult>` — the MCP protocol envelope:
```ts
{ content: Array<{ type: 'text'; text: string } | ...>, isError?: boolean }
```
- **MCP-native SDKs** (Claude agent SDK, `@modelcontextprotocol/sdk`): pass `def.handler` directly — they speak this format natively.
- **Non-MCP SDKs** (Mastra, Langchain, etc.): unwrap the envelope in your `execute`/`func`. Filter `content` to `type === 'text'` items (the union includes image/audio/resource variants without a `text` property), parse the JSON text, and convert `isError: true` into a thrown `Error`.

### `inputSchema` vs raw shape
Different SDKs expect different forms of the schema:
- Some (Claude SDK `tool()`) take the **raw `ZodRawShape`** (`def.shape`)
- Some (Mastra `createTool`, Langchain `DynamicStructuredTool`) take a **`z.object(def.shape)`**

Check the target SDK's type signature — passing the wrong form will cause a type error or silent runtime mismatch.

### Adding the peer dependency
1. Add to `peerDependencies` and `peerDependenciesMeta` (as `optional: true`) in `package.json`.
2. Run `pnpm install` from the workspace root so the package resolves for `typecheck`.
3. Export the new provider class from `src/index.ts`.

### `content` is a discriminated union
`CallToolResult.content` items are `TextContent | ImageContent | AudioContent | ResourceLink | Resource`. Always narrow before accessing `.text`:
```ts
const textItems = result.content.filter(c => c.type === 'text');
```
