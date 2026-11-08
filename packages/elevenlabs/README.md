# @corsair-dev/elevenlabs

ElevenLabs plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/elevenlabs
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.subscription` | `elevenlabs.api.account.subscription` | `read` | The plan, credits used and limits. |
| `account.usageStats` | `elevenlabs.api.account.usageStats` | `read` | Credits used over a time range, by product or model. |
| `account.user` | `elevenlabs.api.account.user` | `read` | The account’s user and workspace ids and its subscription. Key fields are removed from the result. |
| `agents.conversationDelete` | `elevenlabs.api.agents.conversationDelete` | `destructive` | Delete a conversation, for good. |
| `agents.conversationGet` | `elevenlabs.api.agents.conversationGet` | `read` | Read a conversation’s transcript, metadata and analysis. |
| `agents.conversationsList` | `elevenlabs.api.agents.conversationsList` | `read` | List conversations, optionally for one agent. |
| `agents.create` | `elevenlabs.api.agents.create` | `write` | Create a conversational agent. |
| `agents.delete` | `elevenlabs.api.agents.delete` | `destructive` | Delete an agent, for good. |
| `agents.get` | `elevenlabs.api.agents.get` | `read` | Read an agent’s full configuration. |
| `agents.list` | `elevenlabs.api.agents.list` | `read` | List conversational agents. |
| `agents.signedUrl` | `elevenlabs.api.agents.signedUrl` | `write` | Mint a short-lived WebSocket URL a client can use to talk to an agent; the conversation spends credits. |
| `agents.update` | `elevenlabs.api.agents.update` | `write` | Change an agent’s configuration, name or tags. |
| `audioIsolation.isolate` | `elevenlabs.api.audioIsolation.isolate` | `write` | Remove background noise from audio and keep the voices; spends credits by audio length. The cleaned audio comes back in the result. |
| `dubbing.create` | `elevenlabs.api.dubbing.create` | `write` | Start dubbing a video or audio file into another language; spends credits by length. Returns at once with a dubbing_id; follow it with dubbing.get until status is dubbed or failed. |
| `dubbing.delete` | `elevenlabs.api.dubbing.delete` | `destructive` | Delete a dub, for good. |
| `dubbing.get` | `elevenlabs.api.dubbing.get` | `read` | Where a dub stands: status dubbed or failed are final. |
| `dubbing.getAudio` | `elevenlabs.api.dubbing.getAudio` | `read` | Download a finished dub as base64 (audio or video), subject to the same size limit as other audio. |
| `dubbing.getTranscript` | `elevenlabs.api.dubbing.getTranscript` | `read` | Read a dub’s transcript as srt, webvtt or json. |
| `dubbing.list` | `elevenlabs.api.dubbing.list` | `read` | List dubs, newest first by default. |
| `forcedAlignment.create` | `elevenlabs.api.forcedAlignment.create` | `write` | Line up known text with audio to get word and character timings; spends credits by audio length. |
| `history.delete` | `elevenlabs.api.history.delete` | `destructive` | Delete a history item and its audio, for good. |
| `history.get` | `elevenlabs.api.history.get` | `read` | Read one history item: its text, voice, model and cost. |
| `history.getAudio` | `elevenlabs.api.history.getAudio` | `read` | Download a history item’s audio as base64, subject to a size limit you can raise with maxBytes. |
| `history.list` | `elevenlabs.api.history.list` | `read` | List generated speech, newest first by default. |
| `models.list` | `elevenlabs.api.models.list` | `read` | List available models with their languages and rates. |
| `music.compose` | `elevenlabs.api.music.compose` | `write` | Generate a song from a prompt or a composition plan; spends credits by length. ElevenLabs keeps no copy, so the audio comes back in the result. At the default format, about 24 KB/s, a song over about 31 s is too big to return from a script on Corsair’s cloud, whose cap is 1,000,000 bytes: pick a lower-bitrate outputFormat, or pass contentBase64 to the next operation and return only metadata. |
| `music.plan` | `elevenlabs.api.music.plan` | `write` | Draft a composition plan from a prompt, to edit and pass to music.compose. |
| `music.separateStems` | `elevenlabs.api.music.separateStems` | `write` | Split a song into stems, returned as a zip; spends credits by audio length. |
| `singleUseTokens.create` | `elevenlabs.api.singleUseTokens.create` | `write` | Mint a single-use token, valid 15 minutes, to give a client instead of the API key. |
| `soundEffects.generate` | `elevenlabs.api.soundEffects.generate` | `write` | Generate a sound effect from a description; spends credits by duration. ElevenLabs keeps no copy, so the audio comes back in the result. |
| `speechToText.convert` | `elevenlabs.api.speechToText.convert` | `write` | Transcribe audio or video from a URL or a base64 file; spends credits by audio length. With webhook true it returns at once and delivers the transcript by webhook. |
| `speechToText.deleteTranscript` | `elevenlabs.api.speechToText.deleteTranscript` | `destructive` | Delete a stored transcript, for good. |
| `speechToText.getTranscript` | `elevenlabs.api.speechToText.getTranscript` | `read` | Read a transcript by the transcription_id speechToText.convert returned. |
| `textToDialogue.convert` | `elevenlabs.api.textToDialogue.convert` | `write` | Turn lines spoken by several voices into one audio clip; spends credits by text length. |
| `textToSpeech.convert` | `elevenlabs.api.textToSpeech.convert` | `write` | Turn text into speech; spends credits by text length. Returns the audio as base64 with its history item id; set includeContent false to keep a long clip out of the result and read it later with history.getAudio. |
| `textToSpeech.convertWithTimestamps` | `elevenlabs.api.textToSpeech.convertWithTimestamps` | `write` | Turn text into speech with the start and end time of each character; spends credits by text length. Same audio fields as textToSpeech.convert. |
| `voiceChanger.convert` | `elevenlabs.api.voiceChanger.convert` | `write` | Say the same thing in a different voice, from a base64 audio file; spends credits by audio length. |
| `voiceDesign.create` | `elevenlabs.api.voiceDesign.create` | `write` | Save a designed preview as a voice in this account; uses a voice slot. |
| `voiceDesign.design` | `elevenlabs.api.voiceDesign.design` | `write` | Generate voice previews from a description; spends credits. Hear one with voiceDesign.getPreview, then pass its generated_voice_id to voiceDesign.create. |
| `voiceDesign.getPreview` | `elevenlabs.api.voiceDesign.getPreview` | `read` | Read a preview's audio by its generated_voice_id, without generating again. Subject to a size limit you can raise with maxBytes. |
| `voiceDesign.remix` | `elevenlabs.api.voiceDesign.remix` | `write` | Generate previews of a changed version of an existing voice; spends credits. Hear one with voiceDesign.getPreview. |
| `voices.addFromLibrary` | `elevenlabs.api.voices.addFromLibrary` | `write` | Add a voice from the shared library to this account; uses a voice slot. |
| `voices.defaultSettings` | `elevenlabs.api.voices.defaultSettings` | `read` | The settings a voice has by default. |
| `voices.delete` | `elevenlabs.api.voices.delete` | `destructive` | Delete a voice from this account, for good. |
| `voices.edit` | `elevenlabs.api.voices.edit` | `write` | Change a voice’s name, description or labels. |
| `voices.editSettings` | `elevenlabs.api.voices.editSettings` | `write` | Change a voice’s stored settings (stability, similarity and so on). |
| `voices.get` | `elevenlabs.api.voices.get` | `read` | Read one voice with its settings and labels. |
| `voices.getSettings` | `elevenlabs.api.voices.getSettings` | `read` | Read a voice’s stored settings. |
| `voices.list` | `elevenlabs.api.voices.list` | `read` | List the voices this account can use. |
| `voices.searchLibrary` | `elevenlabs.api.voices.searchLibrary` | `read` | Search the shared voice library. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 8 webhook events. See the reference for payloads and `webhookHooks`.

## Audio in results

Audio comes back as base64 in `contentBase64`, with `contentType`, `byteLength`, `requestId`, `traceId`, `characterCost` and `historyItemId`. Speech operations can leave it out with `includeContent: false`, and do so on their own above `maxBytes` (default 700000 bytes); `contentOmitted` says why and `history.getAudio` brings it back. Sound effects, music, stems and isolation have no history item, so their output always comes back, up to 50 MB. Voice previews never come back inline; `voiceDesign.getPreview` reads one by its id.

## Time and size on Corsair's cloud

A script there has a 25 s wall and can return at most 1,000,000 bytes. For what we timed, size is the first limit. Single runs on 2026-11-08: a 10 s sound effect took 2.1 s, 530 characters of speech 1.1 s (eleven_flash_v2_5) and 1.7 s (eleven_multilingual_v2), and 15, 30 and 60 s of music took 3.9, 4.6 and 6.9 s. Music's default format is about 24 KB/s, so its base64 passes the cap at about 31 s. Ask for a lower-bitrate `outputFormat` (`mp3_22050_32` gave 4.05 KB/s in one run), or pass `contentBase64` to the next operation in the same script and return only the metadata. We did not time long transcription, isolation, voice changer or stems.

## Retries

ElevenLabs has no idempotency keys, so a repeated generation bills again. By default a generation is retried only when ElevenLabs refused it before running it: a 429 with `rate_limit_exceeded`, `concurrent_limit_exceeded`, `system_busy` or the older `too_many_concurrent_requests`, at most 3 times, waiting as `Retry-After` says. Over 30 s of `Retry-After` it doesn't wait and you get the 429. It never retries a generation on a 5xx, a timeout, a network failure or any other 429. Reads retry any 429 under the same rules, and a 5xx at most 2 times. A custom handler in `errorHandlers` can change this, including retrying a generation after a 5xx, which can bill twice.

## Not covered

Left out on purpose: Studio and projects, professional voice training, instant voice cloning from files (consent and verification concerns), websockets, realtime and Speech Engine, streaming variants (an operation returns one value), phone numbers and outbound calls, workspace admin, SMB, and Flows.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/elevenlabs

## License

Apache-2.0
