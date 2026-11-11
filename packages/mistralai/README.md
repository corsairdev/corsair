# @corsair-dev/mistralai

Mistral AI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mistralai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.complete` | `mistralai.api.agents.complete` | `write` | Run an agent on a list of messages with the agent's instructions and tools; spends Mistral credits |
| `agents.create` | `mistralai.api.agents.create` | `write` | Create an agent: a model with instructions, tools and default settings (beta) |
| `agents.delete` | `mistralai.api.agents.delete` | `destructive` | Delete an agent; cannot be undone (beta) |
| `agents.deleteAlias` | `mistralai.api.agents.deleteAlias` | `destructive` | Remove a version alias from an agent; the version itself stays (beta) |
| `agents.get` | `mistralai.api.agents.get` | `read` | Get an agent, at its current version or at a given version or alias (beta) |
| `agents.getVersion` | `mistralai.api.agents.getVersion` | `read` | Get one version of an agent by number or alias (beta) |
| `agents.list` | `mistralai.api.agents.list` | `read` | List agents, filtered by name, search text or metadata; page with page_token (beta) |
| `agents.listAliases` | `mistralai.api.agents.listAliases` | `read` | List an agent's version aliases (beta) |
| `agents.listVersions` | `mistralai.api.agents.listVersions` | `read` | List an agent's versions; page with page and page_size (beta) |
| `agents.setVersion` | `mistralai.api.agents.setVersion` | `write` | Switch an agent to another of its versions (beta) |
| `agents.update` | `mistralai.api.agents.update` | `write` | Change an agent; each update creates a new version (beta) |
| `agents.upsertAlias` | `mistralai.api.agents.upsertAlias` | `write` | Point a version alias such as production at an agent version, creating it if needed (beta) |
| `audio.speech` | `mistralai.api.audio.speech` | `write` | Turn text into speech; returns base64 audio (mp3 by default); spends Mistral credits |
| `audio.transcribe` | `mistralai.api.audio.transcribe` | `write` | Transcribe audio from base64 content, a URL or an uploaded file, optionally with speakers and timestamps; spends Mistral credits |
| `audioAgents.create` | `mistralai.api.audioAgents.create` | `write` | Create a voice agent: speech-to-text, LLM and text-to-speech settings, instructions and tools |
| `audioAgents.delete` | `mistralai.api.audioAgents.delete` | `destructive` | Delete a voice agent; cannot be undone |
| `audioAgents.get` | `mistralai.api.audioAgents.get` | `read` | Get a voice agent, optionally at a given version |
| `audioAgents.list` | `mistralai.api.audioAgents.list` | `read` | List voice agents; page with page_token |
| `audioAgents.listSessions` | `mistralai.api.audioAgents.listSessions` | `read` | List a voice agent's sessions; page with page_token |
| `audioAgents.listVersions` | `mistralai.api.audioAgents.listVersions` | `read` | List a voice agent's versions; page with page_token |
| `audioAgents.update` | `mistralai.api.audioAgents.update` | `write` | Replace a voice agent's name, description and configuration |
| `batch.cancel` | `mistralai.api.batch.cancel` | `destructive` | Ask Mistral to cancel a batch job: status goes to CANCELLATION_REQUESTED, then CANCELLED; there is no way to resume it |
| `batch.create` | `mistralai.api.batch.create` | `write` | Start a batch job that runs many requests to one endpoint, from uploaded .jsonl files or inline; spends Mistral credits. Follow it with batch.get until status is SUCCESS, FAILED, TIMEOUT_EXCEEDED or CANCELLED |
| `batch.delete` | `mistralai.api.batch.delete` | `destructive` | Ask Mistral to delete a batch job; cannot be undone |
| `batch.get` | `mistralai.api.batch.get` | `read` | Where a batch job stands: status, request counts, and output_file once it's done |
| `batch.list` | `mistralai.api.batch.list` | `read` | List batch jobs, filtered by status, model or date; page with page and page_size |
| `chat.complete` | `mistralai.api.chat.complete` | `write` | Generate a chat answer from a list of messages, with optional tools and JSON output; spends Mistral credits |
| `classifiers.classify` | `mistralai.api.classifiers.classify` | `write` | Classify texts with a fine-tuned classifier model; spends Mistral credits |
| `classifiers.classifyChat` | `mistralai.api.classifiers.classifyChat` | `write` | Classify conversations with a fine-tuned classifier model; spends Mistral credits |
| `classifiers.moderate` | `mistralai.api.classifiers.moderate` | `write` | Score texts against moderation categories (sexual, hate, violence, self-harm…); spends Mistral credits |
| `classifiers.moderateChat` | `mistralai.api.classifiers.moderateChat` | `write` | Score a conversation against moderation categories; spends Mistral credits |
| `embeddings.create` | `mistralai.api.embeddings.create` | `write` | Turn one or more texts into embedding vectors; spends Mistral credits |
| `files.delete` | `mistralai.api.files.delete` | `destructive` | Delete an uploaded file; cannot be undone |
| `files.get` | `mistralai.api.files.get` | `read` | Get a file's details |
| `files.getSignedUrl` | `mistralai.api.files.getSignedUrl` | `read` | A temporary download URL for a file's content, such as a batch job's output_file |
| `files.list` | `mistralai.api.files.list` | `read` | List uploaded files, filtered by purpose or name; page with page and page_size |
| `files.upload` | `mistralai.api.files.upload` | `write` | Upload a file (base64, up to 512 MB) for batch jobs, fine-tuning or OCR; returns its id |
| `fim.complete` | `mistralai.api.fim.complete` | `write` | Fill in code between a prompt and a suffix with a Codestral model; spends Mistral credits |
| `models.archive` | `mistralai.api.models.archive` | `write` | Archive a fine-tuned model; models.unarchive restores it |
| `models.delete` | `mistralai.api.models.delete` | `destructive` | Delete a fine-tuned model; cannot be undone |
| `models.get` | `mistralai.api.models.get` | `read` | Get a model's details and capabilities |
| `models.list` | `mistralai.api.models.list` | `read` | List the base and fine-tuned models this key can use, with their capabilities |
| `models.unarchive` | `mistralai.api.models.unarchive` | `write` | Restore an archived fine-tuned model |
| `models.update` | `mistralai.api.models.update` | `write` | Rename a fine-tuned model or change its description |
| `ocr.process` | `mistralai.api.ocr.process` | `write` | Read a PDF or image (URL or uploaded file) into markdown per page, with optional structured annotations; spends Mistral credits |
| `responses.countInputTokens` | `mistralai.api.responses.countInputTokens` | `read` | Count the input tokens a responses.create call would use, without running it |
| `responses.create` | `mistralai.api.responses.create` | `write` | Generate a response with the Responses API (input items, tools, reasoning); spends Mistral credits |
| `voices.create` | `mistralai.api.voices.create` | `write` | Create a custom voice from a base64 audio sample |
| `voices.delete` | `mistralai.api.voices.delete` | `destructive` | Delete a custom voice; cannot be undone |
| `voices.get` | `mistralai.api.voices.get` | `read` | Get a voice |
| `voices.list` | `mistralai.api.voices.list` | `read` | List preset and custom voices for audio.speech; page with page_token |
| `voices.update` | `mistralai.api.voices.update` | `write` | Change a custom voice's name, languages, tags or details |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mistralai

## License

Apache-2.0
