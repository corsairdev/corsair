# @corsair-dev/epicgames

Epic Games plugin for Corsair (Fortnite islands + UE Remote Control).

## Install

```bash
pnpm add @corsair-dev/epicgames
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `islands.get` | `epicgames.api.islands.get` | `read` | Get metadata for a Fortnite island by code |
| `islands.getAvgMinutesPerPlayer` | `epicgames.api.islands.getAvgMinutesPerPlayer` | `read` | Get average minutes per unique player for an island |
| `islands.getFavorites` | `epicgames.api.islands.getFavorites` | `read` | Get island favorites metrics for an interval |
| `islands.getMetricsByInterval` | `epicgames.api.islands.getMetricsByInterval` | `read` | Get island usage metrics aggregated by time interval |
| `islands.getMinutesPlayed` | `epicgames.api.islands.getMinutesPlayed` | `read` | Get total minutes played on an island for an interval |
| `islands.getPeakCcu` | `epicgames.api.islands.getPeakCcu` | `read` | Get peak concurrent users for an island over an interval |
| `islands.getPlays` | `epicgames.api.islands.getPlays` | `read` | Get island play/session-start counts for an interval |
| `islands.getRecommendations` | `epicgames.api.islands.getRecommendations` | `read` | Get island recommendation counts for an interval |
| `islands.getRetention` | `epicgames.api.islands.getRetention` | `read` | Get day-over-day retention metrics for an island |
| `islands.getUniquePlayers` | `epicgames.api.islands.getUniquePlayers` | `read` | Get unique player counts for an island over an interval |
| `islands.list` | `epicgames.api.islands.list` | `read` | List public discoverable Fortnite Creative islands |
| `remote.batch` | `epicgames.api.remote.batch` | `write` | Batch multiple Remote Control API calls into one request |
| `remote.callObjectFunction` | `epicgames.api.remote.callObjectFunction` | `write` | Call a Blueprint-callable function on a UObject |
| `remote.corsPreflight` | `epicgames.api.remote.corsPreflight` | `read` | CORS preflight OPTIONS against the Remote Control API |
| `remote.deletePresetMetadataKey` | `epicgames.api.remote.deletePresetMetadataKey` | `write` | Delete a metadata key from a Remote Control preset |
| `remote.describeObject` | `epicgames.api.remote.describeObject` | `read` | Describe a UObject by path via Remote Control |
| `remote.getObjectThumbnail` | `epicgames.api.remote.getObjectThumbnail` | `read` | Fetch Content Browser thumbnail for an asset path |
| `remote.getPreset` | `epicgames.api.remote.getPreset` | `read` | Get a Remote Control preset by name |
| `remote.getPresetMetadata` | `epicgames.api.remote.getPresetMetadata` | `read` | Get all metadata entries for a Remote Control preset |
| `remote.getPresetMetadataKey` | `epicgames.api.remote.getPresetMetadataKey` | `read` | Get a single metadata key for a Remote Control preset |
| `remote.getPresetProperty` | `epicgames.api.remote.getPresetProperty` | `read` | Read a property exposed on a Remote Control preset |
| `remote.initiateSession` | `epicgames.api.remote.initiateSession` | `write` | Initiate an Unreal Web Remote Control session |
| `remote.invokePresetFunction` | `epicgames.api.remote.invokePresetFunction` | `write` | Invoke a function exposed on a Remote Control preset |
| `remote.listBlueprintCallableFunctions` | `epicgames.api.remote.listBlueprintCallableFunctions` | `read` | List Blueprint-callable functions exposed by a UObject |
| `remote.putObjectProperty` | `epicgames.api.remote.putObjectProperty` | `write` | Read or set UObject property values via Remote Control |
| `remote.putPresetMetadataKey` | `epicgames.api.remote.putPresetMetadataKey` | `write` | Create or update a metadata key on a Remote Control preset |
| `remote.updatePresetProperty` | `epicgames.api.remote.updatePresetProperty` | `write` | Update a property exposed on a Remote Control preset |
| `remote.waitForObjectEvent` | `epicgames.api.remote.waitForObjectEvent` | `write` | Wait for a UObject event (experimental; requires EnableExperimentalRoutes) |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/epicgames

## License

Apache-2.0
