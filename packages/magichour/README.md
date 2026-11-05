# @corsair-dev/magichour

Magic Hour plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/magichour
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `magichour.api.account.get` | `read` | Get the account's credit balance and subscription details |
| `files.generateUploadUrls` | `magichour.api.files.generateUploadUrls` | `write` | Generate pre-signed URLs for uploading video, audio, or image assets |
| `files.savedItemsList` | `magichour.api.files.savedItemsList` | `read` | List saved items (characters, references, voices, moodboards, brand kits) |
| `faceDetection.detect` | `magichour.api.faceDetection.detect` | `write` | Detect faces in an image or video |
| `faceDetection.getDetails` | `magichour.api.faceDetection.getDetails` | `read` | Get the details and detected faces of a face detection task |
| `videoProjects.getDetails` | `magichour.api.videoProjects.getDetails` | `read` | Check the progress, status, and downloads of a video project |
| `videoProjects.delete` | `magichour.api.videoProjects.delete` | `destructive` | Permanently delete a rendered video [DESTRUCTIVE · IRREVERSIBLE] |
| `videos.talkingPhoto` | `magichour.api.videos.talkingPhoto` | `write` | Create a talking photo video from an image and an audio file |
| `videos.ugcAd` | `magichour.api.videos.ugcAd` | `write` | Create a spoken UGC ad video from an image and a script |
| `videos.videoEditor` | `magichour.api.videos.videoEditor` | `write` | Edit a video with a prompt-driven AI model |
| `videos.videoTranslator` | `magichour.api.videos.videoTranslator` | `write` | Translate the speech in a video into another language |
| `videos.animation` | `magichour.api.videos.animation` | `write` | Create a stylized animation video from an image and audio |
| `videos.audioToVideo` | `magichour.api.videos.audioToVideo` | `write` | Create a video from an audio track |
| `videos.autoSubtitleGenerator` | `magichour.api.videos.autoSubtitleGenerator` | `write` | Generate styled subtitles for a video |
| `videos.characterReplace` | `magichour.api.videos.characterReplace` | `write` | Replace or animate a character in a video |
| `videos.faceSwap` | `magichour.api.videos.faceSwap` | `write` | Swap faces in a video using a reference face image |
| `videos.imageToVideo` | `magichour.api.videos.imageToVideo` | `write` | Animate a still image into a video |
| `videos.lipSync` | `magichour.api.videos.lipSync` | `write` | Sync a video's lip movement to an audio track |
| `videos.textToVideo` | `magichour.api.videos.textToVideo` | `write` | Generate a video from a text prompt |
| `videos.videoToVideo` | `magichour.api.videos.videoToVideo` | `write` | Restyle an existing video with a new art style |
| `imageProjects.getDetails` | `magichour.api.imageProjects.getDetails` | `read` | Check the progress, status, and downloads of an image project |
| `imageProjects.delete` | `magichour.api.imageProjects.delete` | `destructive` | Permanently delete rendered image(s) [DESTRUCTIVE · IRREVERSIBLE] |
| `images.clothesChanger` | `magichour.api.images.clothesChanger` | `write` | Change outfits in a photo using a garment reference |
| `images.faceEditor` | `magichour.api.images.faceEditor` | `write` | Edit facial features of an image |
| `images.gifGenerator` | `magichour.api.images.gifGenerator` | `write` | Generate an animated GIF from a prompt |
| `images.headshotGenerator` | `magichour.api.images.headshotGenerator` | `write` | Generate a professional headshot from a photo |
| `images.imageEditor` | `magichour.api.images.imageEditor` | `write` | Edit an image with a prompt-driven AI model |
| `images.imageGenerator` | `magichour.api.images.imageGenerator` | `write` | Generate images from a text prompt |
| `images.imageUpscaler` | `magichour.api.images.imageUpscaler` | `write` | Upscale an image 2x or 4x with AI |
| `images.memeGenerator` | `magichour.api.images.memeGenerator` | `write` | Generate a meme from a topic and template |
| `images.qrCodeGenerator` | `magichour.api.images.qrCodeGenerator` | `write` | Generate an artistic QR code |
| `images.bodySwap` | `magichour.api.images.bodySwap` | `write` | Place a person into a scene image |
| `images.faceSwapPhoto` | `magichour.api.images.faceSwapPhoto` | `write` | Swap faces in a photo |
| `images.headSwap` | `magichour.api.images.headSwap` | `write` | Swap a head onto a body image |
| `images.backgroundRemover` | `magichour.api.images.backgroundRemover` | `write` | Remove or replace an image background |
| `images.photoColorizer` | `magichour.api.images.photoColorizer` | `write` | Colorize a black-and-white photo |
| `audioProjects.getDetails` | `magichour.api.audioProjects.getDetails` | `read` | Check the progress, status, and downloads of an audio project |
| `audioProjects.delete` | `magichour.api.audioProjects.delete` | `destructive` | Permanently delete rendered audio file(s) [DESTRUCTIVE · IRREVERSIBLE] |
| `audio.voiceGenerator` | `magichour.api.audio.voiceGenerator` | `write` | Generate speech audio from text using a preset voice |
| `audio.voiceCloner` | `magichour.api.audio.voiceCloner` | `write` | Clone a voice from an audio sample and generate speech |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.
Requests send `Authorization: Bearer <key>`.

## Webhooks

No webhooks. Magic Hour is asynchronous: create endpoints return a project id
immediately and callers poll `videoProjects.getDetails`, `imageProjects.getDetails`,
or `audioProjects.getDetails` until the status is `complete`, `error`, or `canceled`.
Download URLs are time-limited (expire after roughly 24 hours).

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/magichour

## License

Apache-2.0
