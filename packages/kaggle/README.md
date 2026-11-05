# @corsair-dev/kaggle

Corsair plugin for the [Kaggle](https://www.kaggle.com) public API — datasets, competitions, kernels (notebooks), and models.

## Auth setup

API credentials only (no OAuth, no webhooks).

| Mode              | How to provide                                                              |
| ----------------- | --------------------------------------------------------------------------- |
| Legacy key file   | `kaggle.json` → username + key as `username:key`                            |
| Env (legacy)      | `KAGGLE_USERNAME` + `KAGGLE_KEY`                                            |
| Env (legacy)      | `KAGGLE_API_KEY` as `username:key` (the same format as the legacy key file) |
| Env (newer token) | `KAGGLE_API_TOKEN` as Bearer                                                |

```ts
import { kaggle } from '@corsair-dev/kaggle'

// Preferred in apps: key from Corsair key context
const plugin = kaggle()

// Scripts / demos: username:key or bare API token
const pluginWithKey = kaggle({
  key: process.env.KAGGLE_USERNAME
    ? `${process.env.KAGGLE_USERNAME}:${process.env.KAGGLE_KEY}`
    : process.env.KAGGLE_API_TOKEN,
})
```

Missing credentials throw `AuthMissingError`.

- Base URL: `https://www.kaggle.com/api/v1`
- Auth header: `Authorization: Basic base64(username:key)` or `Bearer <token>`

## Endpoint overview (25 operations)

| Domain               | Ops                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Datasets** (8)     | list, create, createVersion, getMetadata, getStatus, listFiles, download, downloadFile                            |
| **Competitions** (8) | list, listFiles, downloadFiles, downloadFile, viewLeaderboard, downloadLeaderboard, generateSubmissionUrl, submit |
| **Kernels** (5)      | list, pull, getStatus, downloadOutput, listOutputFiles                                                            |
| **Models** (4)       | list, get, getInstance, listInstanceVersionFiles                                                                  |

Local CLI/config helpers from the full OSS claim (config init/view/set, dataset/kernel init) are **out of scope** for this PR.

## Error handling

- `RATE_LIMIT_ERROR` — HTTP 429; retries with `Retry-After` when present
- `AUTH_ERROR` — HTTP 401; no retry
- `DEFAULT` — always last after caller overrides

## Provider quirks

- **Competition rules:** downloads/submissions return 403 until rules are accepted on the website
- **Dataset create/version:** requires prior file upload tokens
- **Downloads:** returned as `{ contentType, size, dataBase64 }` (no surprise disk writes). Binary payloads, including kernel output files, are capped at 100 MB.
- **Safe logging:** IDs/counts only — never API keys or tokens

## Tests

```bash
pnpm --filter @corsair-dev/kaggle test
```

Offline schema fixtures always run. Live list smokes run when `KAGGLE_USERNAME`+`KAGGLE_KEY`, `KAGGLE_API_KEY` (`user:key`), or `KAGGLE_API_TOKEN` is set.

## Live demo (R4 Loom)

```bash
# PowerShell
$env:KAGGLE_USERNAME = "..."
$env:KAGGLE_KEY = "..."
pnpm --filter @corsair-dev/kaggle demo
```

Or: `pnpm --filter @corsair-dev/kaggle demo`

Working proof recording (R4): https://www.loom.com/share/b0d541fa2dd14e3a9340f4a94b3ff4ea

## Links

- Docs: https://www.kaggle.com/docs/api
- Issue: https://github.com/corsairdev/corsair/issues/470
- Package: `@corsair-dev/kaggle`
