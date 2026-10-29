# @corsair-dev/faraday

Faraday plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/faraday
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.create` | `faraday.api.accounts.create` | `write` | Create a Faraday subaccount |
| `accounts.delete` | `faraday.api.accounts.delete` | `destructive` | Delete a Faraday account |
| `accounts.get` | `faraday.api.accounts.get` | `read` | Retrieve a Faraday account |
| `accounts.getBilling` | `faraday.api.accounts.getBilling` | `read` | Get billing for a Faraday account |
| `accounts.getCurrent` | `faraday.api.accounts.getCurrent` | `read` | Retrieve the current Faraday account |
| `accounts.getCurrentBilling` | `faraday.api.accounts.getCurrentBilling` | `read` | Get billing for the current Faraday account |
| `accounts.list` | `faraday.api.accounts.list` | `read` | List Faraday accounts |
| `accounts.update` | `faraday.api.accounts.update` | `write` | Update a Faraday account (JSON Merge Patch) |
| `attributes.list` | `faraday.api.attributes.list` | `read` | List Faraday attributes |
| `cohorts.archive` | `faraday.api.cohorts.archive` | `write` | Archive a Faraday cohort |
| `cohorts.create` | `faraday.api.cohorts.create` | `write` | Create a Faraday cohort |
| `cohorts.delete` | `faraday.api.cohorts.delete` | `destructive` | Delete a Faraday cohort |
| `cohorts.forceUpdate` | `faraday.api.cohorts.forceUpdate` | `write` | Force update a Faraday cohort |
| `cohorts.get` | `faraday.api.cohorts.get` | `read` | Retrieve a Faraday cohort |
| `cohorts.getMembershipAnalysis` | `faraday.api.cohorts.getMembershipAnalysis` | `read` | Get Faraday cohort membership analysis |
| `cohorts.list` | `faraday.api.cohorts.list` | `read` | List Faraday cohorts |
| `cohorts.unarchive` | `faraday.api.cohorts.unarchive` | `write` | Unarchive a Faraday cohort |
| `cohorts.update` | `faraday.api.cohorts.update` | `write` | Update a Faraday cohort (JSON Merge Patch) |
| `connections.archive` | `faraday.api.connections.archive` | `write` | Archive a Faraday connection |
| `connections.delete` | `faraday.api.connections.delete` | `destructive` | Delete a Faraday connection |
| `connections.forceUpdate` | `faraday.api.connections.forceUpdate` | `write` | Force update a Faraday connection |
| `connections.getDatasets` | `faraday.api.connections.getDatasets` | `read` | List datasets for a Faraday connection |
| `connections.getTargets` | `faraday.api.connections.getTargets` | `read` | List targets for a Faraday connection |
| `connections.list` | `faraday.api.connections.list` | `read` | List Faraday connections |
| `connections.update` | `faraday.api.connections.update` | `write` | Update a Faraday connection (JSON Merge Patch) |
| `datasets.archive` | `faraday.api.datasets.archive` | `write` | Archive a Faraday dataset |
| `datasets.create` | `faraday.api.datasets.create` | `write` | Create a Faraday dataset |
| `datasets.delete` | `faraday.api.datasets.delete` | `destructive` | Delete a Faraday dataset |
| `datasets.forceUpdate` | `faraday.api.datasets.forceUpdate` | `write` | Force update a Faraday dataset |
| `datasets.get` | `faraday.api.datasets.get` | `read` | Retrieve a Faraday dataset |
| `datasets.getIngressLogs` | `faraday.api.datasets.getIngressLogs` | `read` | Get Faraday dataset ingress logs |
| `datasets.list` | `faraday.api.datasets.list` | `read` | List Faraday datasets |
| `datasets.unarchive` | `faraday.api.datasets.unarchive` | `write` | Unarchive a Faraday dataset |
| `datasets.update` | `faraday.api.datasets.update` | `write` | Update a Faraday dataset (JSON Merge Patch) |
| `featureStores.list` | `faraday.api.featureStores.list` | `read` | List Faraday feature stores |
| `graph.get` | `faraday.api.graph.get` | `read` | Retrieve the Faraday resource dependency graph |
| `marketOpportunityAnalyses.list` | `faraday.api.marketOpportunityAnalyses.list` | `read` | List Faraday market opportunity analyses |
| `outcomes.archive` | `faraday.api.outcomes.archive` | `write` | Archive a Faraday outcome |
| `outcomes.create` | `faraday.api.outcomes.create` | `write` | Create a Faraday outcome |
| `outcomes.delete` | `faraday.api.outcomes.delete` | `destructive` | Delete a Faraday outcome |
| `outcomes.forceUpdate` | `faraday.api.outcomes.forceUpdate` | `write` | Force update a Faraday outcome |
| `outcomes.get` | `faraday.api.outcomes.get` | `read` | Retrieve a Faraday outcome |
| `outcomes.list` | `faraday.api.outcomes.list` | `read` | List Faraday outcomes |
| `outcomes.unarchive` | `faraday.api.outcomes.unarchive` | `write` | Unarchive a Faraday outcome |
| `outcomes.update` | `faraday.api.outcomes.update` | `write` | Update a Faraday outcome (JSON Merge Patch) |
| `personaSets.archive` | `faraday.api.personaSets.archive` | `write` | Archive a Faraday persona set |
| `personaSets.create` | `faraday.api.personaSets.create` | `write` | Create a Faraday persona set |
| `personaSets.delete` | `faraday.api.personaSets.delete` | `destructive` | Delete a Faraday persona set |
| `personaSets.forceUpdate` | `faraday.api.personaSets.forceUpdate` | `write` | Force update a Faraday persona set |
| `personaSets.get` | `faraday.api.personaSets.get` | `read` | Retrieve a Faraday persona set |
| `personaSets.getAnalysisDimensions` | `faraday.api.personaSets.getAnalysisDimensions` | `read` | Get Faraday persona set dimension analysis |
| `personaSets.getAnalysisFlow` | `faraday.api.personaSets.getAnalysisFlow` | `read` | Get Faraday persona set flow analysis |
| `personaSets.list` | `faraday.api.personaSets.list` | `read` | List Faraday persona sets |
| `personaSets.unarchive` | `faraday.api.personaSets.unarchive` | `write` | Unarchive a Faraday persona set |
| `personaSets.update` | `faraday.api.personaSets.update` | `write` | Update a Faraday persona set (JSON Merge Patch) |
| `places.archive` | `faraday.api.places.archive` | `write` | Archive a Faraday place |
| `places.create` | `faraday.api.places.create` | `write` | Create a Faraday place |
| `places.delete` | `faraday.api.places.delete` | `destructive` | Delete a Faraday place |
| `places.forceUpdate` | `faraday.api.places.forceUpdate` | `write` | Force update a Faraday place |
| `places.get` | `faraday.api.places.get` | `read` | Retrieve a Faraday place |
| `places.list` | `faraday.api.places.list` | `read` | List Faraday places |
| `places.unarchive` | `faraday.api.places.unarchive` | `write` | Unarchive a Faraday place |
| `places.update` | `faraday.api.places.update` | `write` | Update a Faraday place (JSON Merge Patch) |
| `recommenders.list` | `faraday.api.recommenders.list` | `read` | List Faraday recommenders |
| `scopes.archive` | `faraday.api.scopes.archive` | `write` | Archive a Faraday scope |
| `scopes.create` | `faraday.api.scopes.create` | `write` | Create a Faraday scope |
| `scopes.delete` | `faraday.api.scopes.delete` | `destructive` | Delete a Faraday scope |
| `scopes.forceUpdate` | `faraday.api.scopes.forceUpdate` | `write` | Force update a Faraday scope |
| `scopes.get` | `faraday.api.scopes.get` | `read` | Retrieve a Faraday scope |
| `scopes.getAnalysis` | `faraday.api.scopes.getAnalysis` | `read` | Get Faraday scope analysis |
| `scopes.getDatasets` | `faraday.api.scopes.getDatasets` | `read` | List datasets for a Faraday scope |
| `scopes.getEfficacy` | `faraday.api.scopes.getEfficacy` | `read` | Get Faraday scope efficacy |
| `scopes.getPayloadCohorts` | `faraday.api.scopes.getPayloadCohorts` | `read` | Get Faraday scope payload cohorts |
| `scopes.getPayloadOutcomes` | `faraday.api.scopes.getPayloadOutcomes` | `read` | Get Faraday scope payload outcomes |
| `scopes.getPayloadPersonaSets` | `faraday.api.scopes.getPayloadPersonaSets` | `read` | Get Faraday scope payload persona sets |
| `scopes.getPayloadRecommenders` | `faraday.api.scopes.getPayloadRecommenders` | `read` | Get Faraday scope payload recommenders |
| `scopes.getPopulationCohorts` | `faraday.api.scopes.getPopulationCohorts` | `read` | Get Faraday scope population cohorts |
| `scopes.getPopulationExclusionCohorts` | `faraday.api.scopes.getPopulationExclusionCohorts` | `read` | Get Faraday scope population exclusion cohorts |
| `scopes.getTargets` | `faraday.api.scopes.getTargets` | `read` | Get Faraday scope targets |
| `scopes.list` | `faraday.api.scopes.list` | `read` | List Faraday scopes |
| `scopes.unarchive` | `faraday.api.scopes.unarchive` | `write` | Unarchive a Faraday scope |
| `scopes.update` | `faraday.api.scopes.update` | `write` | Update a Faraday scope (JSON Merge Patch) |
| `streams.archive` | `faraday.api.streams.archive` | `write` | Archive a Faraday stream |
| `streams.create` | `faraday.api.streams.create` | `write` | Create a Faraday stream |
| `streams.delete` | `faraday.api.streams.delete` | `destructive` | Delete a Faraday stream |
| `streams.forceUpdate` | `faraday.api.streams.forceUpdate` | `write` | Force update a Faraday stream |
| `streams.get` | `faraday.api.streams.get` | `read` | Retrieve a Faraday stream |
| `streams.getAnalysis` | `faraday.api.streams.getAnalysis` | `read` | Get Faraday stream event analysis |
| `streams.list` | `faraday.api.streams.list` | `read` | List Faraday streams |
| `streams.unarchive` | `faraday.api.streams.unarchive` | `write` | Unarchive a Faraday stream |
| `streams.update` | `faraday.api.streams.update` | `write` | Update a Faraday stream (JSON Merge Patch) |
| `targets.archive` | `faraday.api.targets.archive` | `write` | Archive a Faraday target |
| `targets.create` | `faraday.api.targets.create` | `write` | Create a Faraday target |
| `targets.createPreview` | `faraday.api.targets.createPreview` | `write` | Start a Faraday target preview delivery |
| `targets.delete` | `faraday.api.targets.delete` | `destructive` | Delete a Faraday target |
| `targets.forceUpdate` | `faraday.api.targets.forceUpdate` | `write` | Force update a Faraday target |
| `targets.get` | `faraday.api.targets.get` | `read` | Retrieve a Faraday target |
| `targets.getAnalysis` | `faraday.api.targets.getAnalysis` | `read` | Get Faraday target analysis |
| `targets.list` | `faraday.api.targets.list` | `read` | List Faraday targets |
| `targets.update` | `faraday.api.targets.update` | `write` | Update a Faraday target (JSON Merge Patch) |
| `traits.archive` | `faraday.api.traits.archive` | `write` | Archive a Faraday trait |
| `traits.create` | `faraday.api.traits.create` | `write` | Create a Faraday trait |
| `traits.delete` | `faraday.api.traits.delete` | `destructive` | Delete a Faraday trait |
| `traits.deleteOrphaned` | `faraday.api.traits.deleteOrphaned` | `destructive` | Delete all orphaned Faraday traits |
| `traits.forceUpdate` | `faraday.api.traits.forceUpdate` | `write` | Force update a Faraday trait |
| `traits.get` | `faraday.api.traits.get` | `read` | Retrieve a Faraday trait |
| `traits.getAnalysisDimensions` | `faraday.api.traits.getAnalysisDimensions` | `read` | Get Faraday trait dimension analysis |
| `traits.getCsv` | `faraday.api.traits.getCsv` | `read` | Download Faraday traits as CSV |
| `traits.list` | `faraday.api.traits.list` | `read` | List Faraday traits |
| `traits.unarchive` | `faraday.api.traits.unarchive` | `write` | Unarchive a Faraday trait |
| `traits.update` | `faraday.api.traits.update` | `write` | Update a Faraday trait (JSON Merge Patch) |
| `uploads.delete` | `faraday.api.uploads.delete` | `destructive` | Delete a Faraday uploaded file |
| `uploads.get` | `faraday.api.uploads.get` | `read` | Download a Faraday uploaded file |
| `uploads.list` | `faraday.api.uploads.list` | `read` | List Faraday uploaded files |
| `usages.get` | `faraday.api.usages.get` | `read` | Get Faraday account usage stats |
| `webhookEndpoints.create` | `faraday.api.webhookEndpoints.create` | `write` | Create a Faraday webhook endpoint |
| `webhookEndpoints.delete` | `faraday.api.webhookEndpoints.delete` | `destructive` | Delete a Faraday webhook endpoint |
| `webhookEndpoints.get` | `faraday.api.webhookEndpoints.get` | `read` | Retrieve a Faraday webhook endpoint |
| `webhookEndpoints.list` | `faraday.api.webhookEndpoints.list` | `read` | List Faraday webhook endpoints |
| `webhookEndpoints.update` | `faraday.api.webhookEndpoints.update` | `write` | Update a Faraday webhook endpoint |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/faraday

## License

Apache-2.0
