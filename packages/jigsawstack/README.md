# @corsair-dev/jigsawstack

JigsawStack plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/jigsawstack
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `ai.imageGeneration` | `jigsawstack.api.ai.imageGeneration` | `write` | Generate an image from a text prompt |
| `ai.prediction` | `jigsawstack.api.ai.prediction` | `read` | Forecast a time series from dated values |
| `ai.sentiment` | `jigsawstack.api.ai.sentiment` | `read` | Analyze sentiment and emotion in text |
| `ai.summary` | `jigsawstack.api.ai.summary` | `read` | Summarize text or a PDF as a paragraph or bullet points |
| `ai.translate` | `jigsawstack.api.ai.translate` | `read` | Translate text into a target language |
| `audio.createVoiceClone` | `jigsawstack.api.audio.createVoiceClone` | `write` | Clone a voice from an audio sample for later TTS |
| `audio.speechToText` | `jigsawstack.api.audio.speechToText` | `read` | Transcribe audio or video to text |
| `audio.textToSpeech` | `jigsawstack.api.audio.textToSpeech` | `write` | Convert text to speech audio |
| `classification.classify` | `jigsawstack.api.classification.classify` | `read` | Classify text or images with custom labels |
| `embedding.createV2` | `jigsawstack.api.embedding.createV2` | `read` | Create v2 embeddings from text, image, audio, or PDF |
| `promptEngine.create` | `jigsawstack.api.promptEngine.create` | `write` | Create a reusable Prompt Engine template |
| `promptEngine.list` | `jigsawstack.api.promptEngine.list` | `read` | List Prompt Engine templates |
| `promptEngine.run` | `jigsawstack.api.promptEngine.run` | `write` | Run a stored Prompt Engine by id |
| `validate.nsfw` | `jigsawstack.api.validate.nsfw` | `read` | Detect NSFW content in an image |
| `validate.profanity` | `jigsawstack.api.validate.profanity` | `read` | Check text for profanity and return a cleaned copy |
| `validate.spamCheck` | `jigsawstack.api.validate.spamCheck` | `read` | Score text for spam likelihood |
| `validate.spellCheck` | `jigsawstack.api.validate.spellCheck` | `read` | Detect and auto-correct spelling mistakes |
| `vision.detectObjects` | `jigsawstack.api.vision.detectObjects` | `read` | Detect objects and GUI elements in an image |
| `vision.vocr` | `jigsawstack.api.vision.vocr` | `read` | Extract text and fields from an image or PDF |
| `web.htmlToAny` | `jigsawstack.api.web.htmlToAny` | `write` | Convert HTML or a URL to PNG, JPEG, WEBP, or PDF |
| `web.scrape` | `jigsawstack.api.web.scrape` | `read` | Scrape a page into structured data with AI prompts |
| `web.search` | `jigsawstack.api.web.search` | `read` | Search the web with optional AI overview |
| `web.searchSuggestions` | `jigsawstack.api.web.searchSuggestions` | `read` | Get search autocomplete suggestions for a query |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/jigsawstack

## License

Apache-2.0
