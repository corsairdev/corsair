# @corsair-dev/veo

Google Veo video generation for Corsair.

Veo 3.1 on the Gemini API (`veo-3.1-generate-preview` and the other preview
and Veo 2/3 ids) was shut down. This plugin calls the current GA models on
Gemini Enterprise Agent Platform:

`POST https://{location}-aiplatform.googleapis.com/v1/projects/{project}/locations/{location}/publishers/google/models/{model}:predictLongRunning`

`POST .../models/{model}:fetchPredictOperation`

## Auth

A Google access token is sent as `Authorization: Bearer`. Pass it as `key`,
or store it as the API key. The Cloud project id is `projectId` on the plugin,
on each call, or in the `projectId` account field. Location defaults to
`us-central1`.

## Endpoints

| Operation | Risk | Description |
| --- | --- | --- |
| `textToVideo.create` | write | Text-to-video |
| `imageToVideo.create` | write | Image-to-video, with optional `resizeMode` |
| `frames.create` | write | First and last frame |
| `references.create` | write | Up to three asset reference images |
| `extend.create` | write | Extend a `gs://` video |
| `operations.get` | read | Fetch one operation |
| `operations.wait` | read | Poll until done, failed, or timed out |

Models: `veo-3.1-generate-001`, `veo-3.1-fast-generate-001`, and preview
`veo-3.1-lite-generate-001`. Reference images accept the two GA models.

Video editing in the current guides is Gemini Omni Flash, not Veo, so there
is no edit action.
