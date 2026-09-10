# @corsair-dev/scaleai

[Scale AI](https://scale.com) integration for [Corsair](https://corsair.dev) — create
and manage data-labeling tasks, batches, projects, files, teams and Scale Studio
assignments from an agent.

## Install

```bash
pnpm add @corsair-dev/scaleai
```

## Usage

```ts
import { createCorsair } from 'corsair';
import { scaleai } from '@corsair-dev/scaleai';

export const corsair = createCorsair({
  plugins: [
    scaleai({ key: process.env.SCALE_API_KEY }),
  ],
});
```

Authentication is HTTP Basic auth with your Scale API key as the username and a
blank password (handled for you). Use a `live_` key for real (billed) tasks or a
`test_` key for test-mode calls.

## Operations

| Group | Operations |
| --- | --- |
| `tasks` | create image / segmentation / video / video-playback / LiDAR annotation, LiDAR segmentation, NER, text-collection, document-transcription tasks; get task; list tasks; add/delete tags; update/delete `unique_id`; set metadata; get secure response URL; re-send callback |
| `batches` | create, finalize, get, get status, list |
| `projects` | get, list, set params, set ontology |
| `files` | get assets (list), import from URL, upload (base64) |
| `teams` | list members, invite member |
| `studio` | get/add/remove assignments, get batches, set/reset batch priorities |
| `audits` | get fixless audits |
| `quality` | get quality labelers (training attempts) |

Every operation validates its input and output with zod schemas and routes errors
(including 429 rate limits) through the plugin's error handlers.
