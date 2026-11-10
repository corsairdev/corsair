# @corsair-dev/rosette

Rosette plugin for Corsair - language detection, entity and relationship extraction, sentiment, topics, semantic vectors, name matching and transliteration.

## Install

```bash
pnpm add @corsair-dev/rosette
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `categories` | `rosette.api.categories` | `read` | Classify a text into topic-taxonomy categories with confidence |
| `entities` | `rosette.api.entities` | `read` | Extract people, places, organisations and other entities, grouped by entity ID and ranked by confidence |
| `info` | `rosette.api.info` | `read` | Read the server name, version and build, which explains a change in analysis output |
| `language` | `rosette.api.language` | `read` | Detect the language of a text, with every candidate and its confidence |
| `morphology` | `rosette.api.morphology` | `read` | Analyse morphology: lemmas, part-of-speech tags and compound components |
| `nameSimilarity` | `rosette.api.nameSimilarity` | `read` | Score how likely two names are to be the same entity; the order of the two affects the score |
| `nameTranslation` | `rosette.api.nameTranslation` | `read` | Translate a name into another language, optionally saying which script and entity type it is |
| `ping` | `rosette.api.ping` | `read` | Check that the host is reachable |
| `relationships` | `rosette.api.relationships` | `read` | Extract subject-verb-object relationships with the confidence of each predicate |
| `semantics.similarTerms` | `rosette.api.semantics.similarTerms` | `read` | Find terms near the input in embedding space |
| `semantics.vector` | `rosette.api.semantics.vector` | `read` | Compute a text embedding, with its dimension count |
| `sentences` | `rosette.api.sentences` | `read` | Find sentence boundaries, as offsets into the text |
| `sentiment` | `rosette.api.sentiment` | `read` | Score document and per-entity sentiment, where the label and the score are separate signals |
| `tokens` | `rosette.api.tokens` | `read` | Split a text into tokens with part-of-speech tags and lemmas |
| `topics` | `rosette.api.topics` | `read` | Extract topics and their broader concepts, with a salience rather than a probability |
| `transliteration` | `rosette.api.transliteration` | `read` | Transliterate text into another script, which keeps the words rather than translating them |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rosette

## License

Apache-2.0
