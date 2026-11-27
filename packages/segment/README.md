# @corsair-dev/segment

Segment (Twilio Segment) customer data platform: manage workspace sources, destinations, warehouses, tracking plans, functions and GDPR regulations through the Public API.

## Install

```bash
pnpm add @corsair-dev/segment
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `catalog.getDestination` | `segment.api.catalog.getDestination` | `read` | Get one Destination catalog item; its id is the metadataId destinations.create needs |
| `catalog.getSource` | `segment.api.catalog.getSource` | `read` | Get one Source catalog item; its id is the metadataId sources.create needs |
| `catalog.listDestinations` | `segment.api.catalog.listDestinations` | `read` | List the Destination catalog; each item holds the settings its instances need |
| `catalog.listSources` | `segment.api.catalog.listSources` | `read` | List the Source catalog; each item holds the settings its instances need |
| `destinations.create` | `segment.api.destinations.create` | `write` | Create a Destination from a catalog metadata id, a source id and its settings; it starts receiving data once enabled |
| `destinations.delete` | `segment.api.destinations.delete` | `destructive` | Delete a Destination permanently |
| `destinations.get` | `segment.api.destinations.get` | `read` | Get one Destination by id |
| `destinations.list` | `segment.api.destinations.list` | `read` | List the Destinations connected in the Workspace |
| `destinations.update` | `segment.api.destinations.update` | `write` | Update a Destination name, enabled flag or settings |
| `functions.create` | `segment.api.functions.create` | `write` | Create a Function from JavaScript code, a name and a resource type |
| `functions.delete` | `segment.api.functions.delete` | `destructive` | Delete a Function permanently |
| `functions.deploy` | `segment.api.functions.deploy` | `write` | Deploy a Function: its latest saved code goes live for the resources using it |
| `functions.get` | `segment.api.functions.get` | `read` | Get one Function by id, including its code |
| `functions.getVersion` | `segment.api.functions.getVersion` | `read` | Get one saved version of a Function |
| `functions.list` | `segment.api.functions.list` | `read` | List Functions of one resource type in the Workspace |
| `functions.listVersions` | `segment.api.functions.listVersions` | `read` | List a Function's saved versions |
| `functions.restoreVersion` | `segment.api.functions.restoreVersion` | `write` | Restore a Function's code to a saved version |
| `functions.update` | `segment.api.functions.update` | `write` | Update a Function's code or metadata; the new code runs after the next deploy |
| `regulations.create` | `segment.api.regulations.create` | `destructive` | Start a deletion or suppression run that permanently removes the named users data from Segment and downstream systems; cannot be cancelled or undone |
| `regulations.get` | `segment.api.regulations.get` | `read` | Read one deletion or suppression run and its status |
| `regulations.list` | `segment.api.regulations.list` | `read` | List the Workspace deletion and suppression runs and their statuses |
| `sources.create` | `segment.api.sources.create` | `write` | Create a Source from a catalog metadata id and its settings; with disconnectAllWarehouses it also detaches warehouses from the slug |
| `sources.createWriteKey` | `segment.api.sources.createWriteKey` | `write` | Create a new write key for a Source and return the Source; the key is a credential that can send data to Segment |
| `sources.delete` | `segment.api.sources.delete` | `destructive` | Delete a Source permanently; its data in downstream warehouses remains but the configuration is gone |
| `sources.get` | `segment.api.sources.get` | `read` | Get one Source by id, with its write keys and settings |
| `sources.list` | `segment.api.sources.list` | `read` | List the Sources in the Workspace; each row embeds its write keys |
| `sources.listConnectedDestinations` | `segment.api.sources.listConnectedDestinations` | `read` | List the Destinations connected to a Source |
| `sources.listConnectedWarehouses` | `segment.api.sources.listConnectedWarehouses` | `read` | List the Warehouses connected to a Source |
| `sources.removeWriteKey` | `segment.api.sources.removeWriteKey` | `destructive` | Delete a write key from a Source; senders using it immediately fail |
| `sources.update` | `segment.api.sources.update` | `write` | Update a Source name, slug, enabled flag or settings |
| `sources.updateSchemaSettings` | `segment.api.sources.updateSchemaSettings` | `write` | Change a Source's schema settings, such as allowing unplanned events or forwarding violations |
| `trackingPlans.addSource` | `segment.api.trackingPlans.addSource` | `write` | Connect a Source to a Tracking Plan so its events are enforced |
| `trackingPlans.create` | `segment.api.trackingPlans.create` | `write` | Create a Tracking Plan with a name and a type |
| `trackingPlans.delete` | `segment.api.trackingPlans.delete` | `destructive` | Delete a Tracking Plan permanently |
| `trackingPlans.get` | `segment.api.trackingPlans.get` | `read` | Get one Tracking Plan by id |
| `trackingPlans.list` | `segment.api.trackingPlans.list` | `read` | List the Tracking Plans in the Workspace, optionally by type |
| `trackingPlans.listRules` | `segment.api.trackingPlans.listRules` | `read` | List a Tracking Plan's event and trait rules |
| `trackingPlans.listSources` | `segment.api.trackingPlans.listSources` | `read` | List the Sources connected to a Tracking Plan |
| `trackingPlans.removeSource` | `segment.api.trackingPlans.removeSource` | `destructive` | Disconnect a Source from a Tracking Plan |
| `trackingPlans.replaceRules` | `segment.api.trackingPlans.replaceRules` | `write` | Replace a Tracking Plan's whole rule set; rules absent from the array are removed |
| `trackingPlans.update` | `segment.api.trackingPlans.update` | `write` | Rename a Tracking Plan or change its description |
| `warehouses.addSourceConnection` | `segment.api.warehouses.addSourceConnection` | `write` | Connect a Source to a Warehouse so its data loads there |
| `warehouses.create` | `segment.api.warehouses.create` | `write` | Create a Warehouse from a catalog metadata id and its connection settings |
| `warehouses.delete` | `segment.api.warehouses.delete` | `destructive` | Delete a Warehouse permanently |
| `warehouses.get` | `segment.api.warehouses.get` | `read` | Get one Warehouse by id |
| `warehouses.getConnectionState` | `segment.api.warehouses.getConnectionState` | `read` | Read a Warehouse's current connection state: CONNECTED or FAILED |
| `warehouses.list` | `segment.api.warehouses.list` | `read` | List the Warehouses in the Workspace |
| `warehouses.listConnectedSources` | `segment.api.warehouses.listConnectedSources` | `read` | List the Sources connected to a Warehouse |
| `warehouses.removeSourceConnection` | `segment.api.warehouses.removeSourceConnection` | `destructive` | Disconnect a Source from a Warehouse |
| `warehouses.update` | `segment.api.warehouses.update` | `write` | Update a Warehouse name, enabled flag or settings; the API requires settings on every call |
| `warehouses.validate` | `segment.api.warehouses.validate` | `read` | Check a set of Warehouse credentials by attempting to connect; synchronous, answers CONNECTED or FAILED |
| `workspaces.get` | `segment.api.workspaces.get` | `read` | Get the Workspace the token belongs to |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/segment

## License

Apache-2.0
