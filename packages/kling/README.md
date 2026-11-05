# @corsair-dev/kling

Kling plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/kling
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `imageGeneration.create` | `kling.api.imageGeneration.create` | `write` | Generate images from a text prompt, optionally guided by a reference image |
| `imageGeneration.get` | `kling.api.imageGeneration.get` | `read` | Query a single image generation task |
| `imageGeneration.list` | `kling.api.imageGeneration.list` | `read` | List image generation tasks |
| `imageToVideo.create` | `kling.api.imageToVideo.create` | `write` | Generate a video from reference images and a prompt |
| `imageToVideo.get` | `kling.api.imageToVideo.get` | `read` | Query one or more image-to-video tasks by id |
| `imageToVideo.list` | `kling.api.imageToVideo.list` | `read` | List image-to-video tasks with cursor paging |
| `lipSync.detectFace` | `kling.api.lipSync.detectFace` | `write` | Identify faces in a video for lip-sync processing |
| `lipSync.create` | `kling.api.lipSync.create` | `write` | Create an advanced lip-sync video task |
| `lipSync.get` | `kling.api.lipSync.get` | `read` | Query a single lip-sync task |
| `lipSync.list` | `kling.api.lipSync.list` | `read` | List lip-sync tasks |
| `motionControl.create` | `kling.api.motionControl.create` | `write` | Transfer motion from a reference video onto a character |
| `motionControl.get` | `kling.api.motionControl.get` | `read` | Query one or more motion-control tasks by id |
| `motionControl.list` | `kling.api.motionControl.list` | `read` | List motion-control tasks with cursor paging |
| `multiImageToImage.create` | `kling.api.multiImageToImage.create` | `write` | Generate an image from subject, scene and style references |
| `multiImageToImage.get` | `kling.api.multiImageToImage.get` | `read` | Query a single multi-image task |
| `multiImageToImage.list` | `kling.api.multiImageToImage.list` | `read` | List multi-image tasks |
| `omniImage.create` | `kling.api.omniImage.create` | `write` | Generate images from a prompt with image and element references |
| `omniImage.get` | `kling.api.omniImage.get` | `read` | Query a single omni-image task |
| `omniImage.list` | `kling.api.omniImage.list` | `read` | List omni-image tasks |
| `omniVideo.create` | `kling.api.omniVideo.create` | `write` | Generate a video from prompt, image, element and video references |
| `omniVideo.get` | `kling.api.omniVideo.get` | `read` | Query one or more omni-video tasks by id |
| `omniVideo.list` | `kling.api.omniVideo.list` | `read` | List omni-video tasks with cursor paging |
| `outpainting.create` | `kling.api.outpainting.create` | `write` | Expand an image in any direction |
| `outpainting.get` | `kling.api.outpainting.get` | `read` | Query a single outpainting task |
| `outpainting.list` | `kling.api.outpainting.list` | `read` | List outpainting tasks |
| `textToVideo.create` | `kling.api.textToVideo.create` | `write` | Generate a video from a text prompt |
| `textToVideo.get` | `kling.api.textToVideo.get` | `read` | Query one or more text-to-video tasks by id |
| `textToVideo.list` | `kling.api.textToVideo.list` | `read` | List text-to-video tasks with cursor paging |
| `videoEffects.create` | `kling.api.videoEffects.create` | `write` | Create a video effects task for a documented scene |
| `videoEffects.get` | `kling.api.videoEffects.get` | `read` | Query a single video effects task |
| `videoEffects.list` | `kling.api.videoEffects.list` | `read` | List video effects tasks |
| `virtualTryOn.create` | `kling.api.virtualTryOn.create` | `write` | Create a virtual try-on task from a product and person image |
| `virtualTryOn.get` | `kling.api.virtualTryOn.get` | `read` | Query one or more virtual try-on tasks by id |
| `virtualTryOn.list` | `kling.api.virtualTryOn.list` | `read` | List virtual try-on tasks with cursor paging |

## Auth

Auth: API key (`Authorization: Bearer <API_KEY>`). Corsair prompts your tenant
for credentials on first use.

## Webhooks

No webhooks. Kling delivers task results through caller-supplied HTTP callbacks
rather than signed inbound webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kling

## License

Apache-2.0
