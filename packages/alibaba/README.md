# @corsair-dev/alibaba

Alibaba plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/alibaba
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `image.generate` | `alibaba.api.image.generate` | `write` | Generate or edit images with Qwen-Image 3.0 or Wan 2.7 Image; returns image URLs valid for 24 hours |
| `tasks.get` | `alibaba.api.tasks.get` | `read` | Get a generation task status and, once it succeeds, the video URL (valid 24 hours) |
| `video.edit` | `alibaba.api.video.edit` | `write` | Start a Wan 2.7 video editing task on an input video |
| `video.imageToVideo` | `alibaba.api.video.imageToVideo` | `write` | Start a Wan 2.7 image-to-video task from a first frame, first and last frames, or a clip to continue |
| `video.referenceToVideo` | `alibaba.api.video.referenceToVideo` | `write` | Start a Wan 2.7 reference-to-video task from reference images, videos, and voices |
| `video.textToVideo` | `alibaba.api.video.textToVideo` | `write` | Start a Wan text-to-video task (Wan 3.0 also takes reference media, files, and links); returns a task id |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/alibaba

## License

Apache-2.0
