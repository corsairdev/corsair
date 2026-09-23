# @corsair-dev/writer

Writer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/writer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `applications.list` | `writer.api.applications.list` | `read` | List no-code applications |
| `chat.create` | `writer.api.chat.create` | `write` | Generate chat completions |
| `completions.create` | `writer.api.completions.create` | `write` | Generate text completions |
| `files.delete` | `writer.api.files.delete` | `destructive` | Delete file |
| `files.download` | `writer.api.files.download` | `read` | Download file contents |
| `files.get` | `writer.api.files.get` | `read` | Get file details |
| `files.list` | `writer.api.files.list` | `read` | List uploaded files |
| `files.upload` | `writer.api.files.upload` | `write` | Upload file |
| `knowledgeGraphs.addFile` | `writer.api.knowledgeGraphs.addFile` | `write` | Add file to graph |
| `knowledgeGraphs.askQuestion` | `writer.api.knowledgeGraphs.askQuestion` | `read` | Ask question to knowledge graph |
| `knowledgeGraphs.create` | `writer.api.knowledgeGraphs.create` | `write` | Create knowledge graph |
| `knowledgeGraphs.delete` | `writer.api.knowledgeGraphs.delete` | `destructive` | Delete knowledge graph |
| `knowledgeGraphs.list` | `writer.api.knowledgeGraphs.list` | `read` | List knowledge graphs |
| `knowledgeGraphs.removeFile` | `writer.api.knowledgeGraphs.removeFile` | `destructive` | Remove file from graph |
| `knowledgeGraphs.retrieve` | `writer.api.knowledgeGraphs.retrieve` | `read` | Retrieve knowledge graph |
| `knowledgeGraphs.update` | `writer.api.knowledgeGraphs.update` | `write` | Update knowledge graph |
| `models.list` | `writer.api.models.list` | `read` | List available models |
| `tools.analyzeImages` | `writer.api.tools.analyzeImages` | `write` | Analyze images with vision models |
| `tools.detectAiContent` | `writer.api.tools.detectAiContent` | `read` | Detect AI-generated content likelihood |
| `tools.medicalComprehend` | `writer.api.tools.medicalComprehend` | `write` | Extract structured medical entities from text |
| `tools.parsePdf` | `writer.api.tools.parsePdf` | `read` | Parse PDF file |
| `tools.translateText` | `writer.api.tools.translateText` | `write` | Translate text between languages |
| `tools.webSearch` | `writer.api.tools.webSearch` | `read` | Search the web |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/writer

## License

Apache-2.0
