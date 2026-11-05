# @corsair-dev/suzanne

Suzanne plugin for Corsair. Suzanne turns a text prompt or one to four photos into a textured 3D mesh (`GLB`, and optionally `OBJ`, `STL`, or `FBX`).

## Install

```bash
pnpm add @corsair-dev/suzanne
```

## Endpoints

Base URL `https://api.suzanne3d.com`.

| Operation | Method | Path | Notes |
|-----------|--------|------|-------|
| `generations.textTo3d` | POST | `/v1/generations/text-to-3d` | `sculptor` or `atelier`. Prompt 1-4000 characters. Returns 202 |
| `generations.photoTo3d` | POST | `/v1/generations/photo-to-3d` | Exactly one of `images_upload_ids` or `images_inline`. `capture` needs all four views |
| `uploads.create` | POST | `/v1/uploads` | Empty body. Presigned PUT URL, 5 minutes |
| `jobs.get` | GET | `/v1/jobs/{job_id}` | Poll until `done`, `failed`, or `cancelled` |
| `jobs.cancel` | POST | `/v1/jobs/{job_id}/cancel` | Best-effort. Refunds a running job if it stops in time |
| `models.download` | GET | `/v1/models/{job_id}/download` | Returns the 302 Location. The URL lasts 15 minutes |

`faces` is `200000`, `500000`, `1000000`, or `2000000` (default `500000`). `outputs` is any subset of `glb`, `obj`, `stl`, `fbx`.

The image bytes go to the presigned `upload_url` with PUT and no `Content-Type` header. Sending one makes S3 return `403 SignatureDoesNotMatch`.

## Auth

`Authorization: Bearer sznn_test_...` or `sznn_live_...`. Test and live keys share this base URL. There is no separate sandbox host.

Generation POSTs accept `Idempotency-Key` (`idempotencyKey` on the input). The same key and body replay the original 202 for 24 hours. The same key and a different body is `409 idempotency_key_conflict`.

## Errors and retries

Errors are `{ error: { type, code, message, request_id } }`.

- 400, 401, 403, 404: no retry. 404 is `not_found`, not an empty result.
- `409 idempotency_key_conflict` and `409 job_not_done`: no retry.
- `409 concurrent_limit_reached`: up to 3 attempts. The account is at its concurrent-job ceiling.
- 429, if one arrives: up to 3 attempts. `Retry-After` is capped at 60 seconds. The docs do not publish a 429 table.
- `500` on `uploads.create`: 2 attempts. The docs say to retry a failed presign.
- Other 5xx: no retry. A generation may already have been queued.

## Billing

`billable_amount_cents` is on the 202. Cancelling a running job refunds the bill if the worker stops before the vendor finishes. This plugin does not create meshes in its live test.

## Not implemented

Webhooks are not in the docs. Jobs are polled. There is no list-jobs or account-balance route. Putting the image bytes on S3 is the caller's PUT to `upload_url`.

No database row is written when Corsair has no database. When it does, jobs merge by `job_id`. A queued write cannot rewind a `done`, `failed`, or `cancelled` row. A cancel that reports `already_terminal` does not change the stored status.

## Reference

Full docs: https://docs.corsair.dev/plugins/suzanne

Provider docs: https://console.suzanne3d.com/documentation

## License

Apache-2.0
