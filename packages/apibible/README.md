# @corsair-dev/apibible

API.Bible plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apibible
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `audioBibles.get` | `apibible.api.audioBibles.get` | `read` | Get a specific audio Bible version |
| `audioBibles.list` | `apibible.api.audioBibles.list` | `read` | List audio Bible versions |
| `audioBooks.get` | `apibible.api.audioBooks.get` | `read` | Get a specific book of an audio Bible |
| `audioBooks.list` | `apibible.api.audioBooks.list` | `read` | List all books of an audio Bible |
| `audioChapters.get` | `apibible.api.audioChapters.get` | `read` | Get an audio chapter (includes an mp3 resource URL) |
| `audioChapters.list` | `apibible.api.audioChapters.list` | `read` | List all chapters of an audio book |
| `bibles.get` | `apibible.api.bibles.get` | `read` | Get details for a specific Bible version |
| `bibles.list` | `apibible.api.bibles.list` | `read` | List supported Bible versions |
| `books.get` | `apibible.api.books.get` | `read` | Get a specific book of a Bible version |
| `books.list` | `apibible.api.books.list` | `read` | List all books of a Bible version |
| `chapters.get` | `apibible.api.chapters.get` | `read` | Get a chapter with its text content |
| `chapters.list` | `apibible.api.chapters.list` | `read` | List all chapters of a book |
| `chapters.listSections` | `apibible.api.chapters.listSections` | `read` | List sections (usfm headings) within a chapter |
| `passages.get` | `apibible.api.passages.get` | `read` | Get one or more verses of scripture text by passage reference |
| `search.query` | `apibible.api.search.query` | `read` | Search for verses within a Bible version |
| `sections.get` | `apibible.api.sections.get` | `read` | Get a section with its text content |
| `sections.list` | `apibible.api.sections.list` | `read` | List sections (usfm headings) of a book |
| `verses.get` | `apibible.api.verses.get` | `read` | Get a single verse with its text content |
| `verses.list` | `apibible.api.verses.list` | `read` | List all verses of a chapter |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apibible

## License

Apache-2.0
