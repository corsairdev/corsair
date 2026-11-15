# @corsair-dev/nanonets

Nanonets plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/nanonets
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `files.approve` | `nanonets.api.files.approve` | `write` | Approve a validated file from an approval stage, which can trigger exports |
| `files.assign` | `nanonets.api.files.assign` | `write` | Assign files to a team member by email for review |
| `files.delete` | `nanonets.api.files.delete` | `destructive` | Permanently delete a file and its predictions from a model |
| `files.retryExports` | `nanonets.api.files.retryExports` | `write` | Re-run the export integrations for the given files |
| `files.retryPredictions` | `nanonets.api.files.retryPredictions` | `write` | Re-run OCR prediction for the given files |
| `files.unapprove` | `nanonets.api.files.unapprove` | `write` | Reopen a previously approved file; it cannot be rejected here |
| `files.updateFields` | `nanonets.api.files.updateFields` | `write` | Replace the field set of one page of a file: unchanged boxes stay, new boxes need is_new, and any omitted field is deleted |
| `integrations.executeQuery` | `nanonets.api.integrations.executeQuery` | `destructive` | Run arbitrary SQL against a connected store; documented examples include UPDATE, which cannot be undone |
| `integrations.list` | `nanonets.api.integrations.list` | `read` | List external integrations with their IDs, types and masked connection info |
| `models.train` | `nanonets.api.models.train` | `write` | Train or retrain a model from its uploaded images; the model state moves through the training queue |
| `models.updateGuidelines` | `nanonets.api.models.updateGuidelines` | `write` | Add or update the natural-language field and table extraction guidelines of an Instant Learning model |
| `models.uploadTrainingUrls` | `nanonets.api.models.uploadTrainingUrls` | `write` | Add training images to a model by URL, with optional box annotations, before (re)training |
| `predictions.createFromFile` | `nanonets.api.predictions.createFromFile` | `write` | Upload a base64 PNG or JPEG to an OCR model and extract fields synchronously or, with async, as a pollable request |
| `predictions.createFromUrls` | `nanonets.api.predictions.createFromUrls` | `write` | Extract fields from public image URLs with an OCR model, synchronously or as a pollable async request |
| `predictions.getFileByFileId` | `nanonets.api.predictions.getFileByFileId` | `read` | Fetch every page of a prediction file by request file ID, listed as moderated and unmoderated; the poll target for async requests |
| `predictions.getFileByPageId` | `nanonets.api.predictions.getFileByPageId` | `read` | Fetch one prediction page with its boxes and raw OCR output |
| `predictions.listFiles` | `nanonets.api.predictions.listFiles` | `read` | List a model prediction files in a day-since-epoch window, split into moderated and unmoderated |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nanonets

## License

Apache-2.0
