# Modal plugin for Corsair

Run [Modal](https://modal.com) sandboxes, build images, call deployed functions
and classes, and manage volumes, secrets, queues, dicts, apps and environments
from Corsair.

Modal has no REST API. This plugin wraps Modal's official JavaScript SDK
([`modal` on npm](https://www.npmjs.com/package/modal)), which talks gRPC over
HTTP/2 to `api.modal.com`, so it runs on Node 20+ (not edge or browser
runtimes). The SDK is imported the first time an operation runs.

## Install and configure

```bash
pnpm add @corsair-dev/modal
```

Create a token at modal.com, Settings, API Tokens. Per account, store the
token secret (`as-...`) as the API key and the token id (`ak-...`) as
`token_id`. For a single workspace you can pass both directly:

```ts
import { modal } from '@corsair-dev/modal';

const plugin = modal({
	tokenId: process.env.MODAL_TOKEN_ID,
	key: process.env.MODAL_TOKEN_SECRET,
	environment: 'main', // optional
});
```

Every call builds its own SDK client from those values and closes it
afterwards. The host process's `MODAL_*` variables and `~/.modal.toml` are not
used for an account.

## Operations (95)

| Group | Ops | What |
| --- | ---: | --- |
| `sandboxes` | 26 | create, get, getByName, list, exec, terminate, wait, waitUntilReady, tunnels, tags, name, connect tokens, filesystem/directory/memory snapshots, restore, exit snapshot, mount/unmount images, network policy, reload volumes, pause/resume, logs |
| `files` | 6 | read, write, list, stat, makeDirectory, remove inside a running sandbox |
| `functions` | 11 | get, info, call, spawn, stats, currentStats, updateAutoscaler, logs, fetchLogs, metrics, metricsSchema |
| `classes` | 2 | call and spawn methods of deployed classes |
| `functionCalls` | 3 | get result, cancel, logs |
| `images` | 5 | build, get, getByName, publish, delete |
| `apps` | 7 | get, create, list, info, stats, sandboxStats (cost), stop |
| `environments` | 5 | get, getDefault, list, create, delete |
| `volumes` | 6 | get, create, list, delete, listFiles, removeFile |
| `secrets` | 4 | get, list, create, delete |
| `queues` | 8 | create, list, delete, put, get, peek, len, clear |
| `dicts` | 11 | create, list, delete, get, put, update, pop, contains, len, items, clear |
| `proxies` | 1 | get |

Creating sandboxes, running commands, building images and calling functions
spend Modal credits and are marked `destructive`, like every delete.

Queue and Dict values are Python pickles, so Python code on Modal reads what
the plugin writes. The plugin pickles them itself (`codec.ts`): Dict keys
(strings, numbers, booleans, null) byte for byte as CPython does, so a key
written from either side matches, and values with integers beyond 32 bits
intact (the SDK's pickler truncates those and cannot read Python tuples, sets
or big ints). Python data JSON has no form for comes back as
`{ "$pickle": "<base64>" }`.

The JS SDK has no wrappers for Dicts, for listing secrets, volumes, queues and
dicts, for creating named Secrets, or for Volume file listings, and its Queue
class uses its own pickler; those operations call the same gRPC methods
through the SDK's client, as Modal's Python CLI does.

## Tests

```bash
pnpm --filter @corsair-dev/modal test          # mocked, no network
MODAL_TOKEN_ID=ak-... MODAL_TOKEN_SECRET=as-... pnpm --filter @corsair-dev/modal test:live
```

The live suite makes short 0.125 CPU / 128 MiB alpine sandboxes and a few
named objects, and deletes them all. To include the functions, classes and
function call steps, deploy the small app in `tests/live_app.py` first
(`modal deploy packages/modal/tests/live_app.py`) and set
`MODAL_LIVE_APP=corsair-live-fn`.
