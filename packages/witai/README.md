# @corsair-dev/witai

WitAi plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/witai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apps.createApp` | `witai.api.apps.createApp` | `write` | Create a new Wit.ai app |
| `apps.deleteApp` | `witai.api.apps.deleteApp` | `destructive` | Delete a specific Wit.ai app |
| `apps.exportApp` | `witai.api.apps.exportApp` | `read` | Export Wit.ai app data as a ZIP backup |
| `apps.getApp` | `witai.api.apps.getApp` | `read` | Retrieve metadata and settings of a Wit.ai app |
| `apps.listApps` | `witai.api.apps.listApps` | `read` | List all Wit.ai apps for the authenticated user |
| `apps.listTags` | `witai.api.apps.listTags` | `read` | List all tag groups (versions) for a Wit.ai app |
| `apps.updateApp` | `witai.api.apps.updateApp` | `write` | Update an existing Wit.ai app |
| `entities.addKeyword` | `witai.api.entities.addKeyword` | `write` | Add a keyword with optional synonyms to an entity |
| `entities.addSynonym` | `witai.api.entities.addSynonym` | `write` | Add a synonym to a keyword in an entity |
| `entities.createEntity` | `witai.api.entities.createEntity` | `write` | Create a new entity in Wit.ai |
| `entities.deleteEntity` | `witai.api.entities.deleteEntity` | `destructive` | Permanently delete an entity by name |
| `entities.deleteKeyword` | `witai.api.entities.deleteKeyword` | `destructive` | Delete a keyword from an entity |
| `entities.deleteRole` | `witai.api.entities.deleteRole` | `destructive` | Delete a specific role from an entity |
| `entities.deleteSynonym` | `witai.api.entities.deleteSynonym` | `destructive` | Delete a synonym from a keyword in an entity |
| `entities.getEntity` | `witai.api.entities.getEntity` | `read` | Retrieve details of a specific entity |
| `entities.listEntities` | `witai.api.entities.listEntities` | `read` | List all entities in the Wit.ai app |
| `intents.createIntent` | `witai.api.intents.createIntent` | `write` | Create a new intent in Wit.ai |
| `intents.deleteIntent` | `witai.api.intents.deleteIntent` | `destructive` | Permanently delete an intent by name |
| `intents.getIntent` | `witai.api.intents.getIntent` | `read` | Retrieve details of a specific intent |
| `intents.listIntents` | `witai.api.intents.listIntents` | `read` | List all intents in the Wit.ai app |
| `message.detectLanguage` | `witai.api.message.detectLanguage` | `read` | Detect the language of a given text input |
| `message.getMessage` | `witai.api.message.getMessage` | `read` | Analyze text to extract intents, entities, and traits |
| `traits.addValue` | `witai.api.traits.addValue` | `write` | Add a new value to an existing trait |
| `traits.createTrait` | `witai.api.traits.createTrait` | `write` | Create a new trait in Wit.ai |
| `traits.deleteTrait` | `witai.api.traits.deleteTrait` | `destructive` | Delete a trait by name |
| `traits.getTrait` | `witai.api.traits.getTrait` | `read` | Retrieve details of a specific trait |
| `traits.listTraits` | `witai.api.traits.listTraits` | `read` | List all traits in the Wit.ai app |
| `utterances.createUtterances` | `witai.api.utterances.createUtterances` | `write` | Add training utterances to the Wit.ai app (rate limit: 200/min) |
| `utterances.deleteUtterances` | `witai.api.utterances.deleteUtterances` | `destructive` | Delete validated utterances from the Wit.ai app |
| `utterances.listUtterances` | `witai.api.utterances.listUtterances` | `read` | List training utterances from the Wit.ai app |
| `voices.getVoice` | `witai.api.voices.getVoice` | `read` | Retrieve details for a specific text-to-speech voice |
| `voices.listVoices` | `witai.api.voices.listVoices` | `read` | List all available text-to-speech voices grouped by locale |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/witai

## License

Apache-2.0
