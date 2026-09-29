# @corsair-dev/kibana

Kibana plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/kibana
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `alerting.createRule` | `kibana.api.alerting.createRule` | `write` | Create a new alerting rule in Kibana |
| `alerting.deleteRule` | `kibana.api.alerting.deleteRule` | `destructive` | Delete an alerting rule by ID |
| `alerting.listRules` | `kibana.api.alerting.listRules` | `read` | List alerting rules with pagination and filters |
| `alerting.listRuleTypes` | `kibana.api.alerting.listRuleTypes` | `read` | List available alerting rule types |
| `cases.create` | `kibana.api.cases.create` | `write` | Create a new case in Kibana |
| `cases.list` | `kibana.api.cases.list` | `read` | Find and list cases with filters |
| `connectors.create` | `kibana.api.connectors.create` | `write` | Create a new connector in Kibana |
| `connectors.delete` | `kibana.api.connectors.delete` | `destructive` | Delete a connector by ID |
| `connectors.get` | `kibana.api.connectors.get` | `read` | Retrieve a connector by ID |
| `connectors.list` | `kibana.api.connectors.list` | `read` | List all connectors in Kibana |
| `connectors.listTypes` | `kibana.api.connectors.listTypes` | `read` | List available connector (action) types |
| `dashboards.create` | `kibana.api.dashboards.create` | `write` | Create a new dashboard in Kibana |
| `dashboards.delete` | `kibana.api.dashboards.delete` | `destructive` | Delete a dashboard by ID |
| `dashboards.get` | `kibana.api.dashboards.get` | `read` | Retrieve a dashboard by ID |
| `dashboards.search` | `kibana.api.dashboards.search` | `read` | Search dashboards in Kibana |
| `dashboards.upsert` | `kibana.api.dashboards.upsert` | `write` | Create or update a dashboard by ID |
| `dataViews.create` | `kibana.api.dataViews.create` | `write` | Create a new data view in Kibana |
| `dataViews.get` | `kibana.api.dataViews.get` | `read` | Retrieve data view details by ID |
| `dataViews.list` | `kibana.api.dataViews.list` | `read` | List all data views in Kibana |
| `detection.findAlerts` | `kibana.api.detection.findAlerts` | `read` | Find and aggregate detection alerts |
| `detection.findRules` | `kibana.api.detection.findRules` | `read` | Find detection engine rules with filters |
| `fleet.agentPoliciesList` | `kibana.api.fleet.agentPoliciesList` | `read` | List Fleet agent policies with pagination |
| `fleet.agentsSetup` | `kibana.api.fleet.agentsSetup` | `read` | Check Fleet agents setup status |
| `fleet.agentsVersions` | `kibana.api.fleet.agentsVersions` | `read` | List available Fleet agent versions |
| `fleet.checkPermissions` | `kibana.api.fleet.checkPermissions` | `read` | Check permissions for the Fleet API |
| `fleet.enrollmentKeyGet` | `kibana.api.fleet.enrollmentKeyGet` | `read` | Retrieve a Fleet enrollment API key by ID |
| `fleet.enrollmentKeysList` | `kibana.api.fleet.enrollmentKeysList` | `read` | List Fleet enrollment API keys |
| `fleet.epmCategories` | `kibana.api.fleet.epmCategories` | `read` | List Fleet EPM package categories |
| `fleet.epmDataStreams` | `kibana.api.fleet.epmDataStreams` | `read` | List Fleet EPM data streams |
| `fleet.epmPackageDetails` | `kibana.api.fleet.epmPackageDetails` | `read` | Retrieve details of a Fleet EPM package version |
| `fleet.epmPackageFile` | `kibana.api.fleet.epmPackageFile` | `read` | Retrieve a file from a Fleet EPM package |
| `fleet.epmPackagesInstalled` | `kibana.api.fleet.epmPackagesInstalled` | `read` | List installed Fleet EPM packages |
| `fleet.epmPackagesLimited` | `kibana.api.fleet.epmPackagesLimited` | `read` | List Fleet EPM package names only |
| `fleet.epmPackagesList` | `kibana.api.fleet.epmPackagesList` | `read` | List available Fleet EPM packages |
| `fleet.epmPackageStats` | `kibana.api.fleet.epmPackageStats` | `read` | Retrieve usage statistics for a Fleet package |
| `fleet.outputDelete` | `kibana.api.fleet.outputDelete` | `destructive` | Delete a Fleet output by ID |
| `fleet.packagePoliciesList` | `kibana.api.fleet.packagePoliciesList` | `read` | List Fleet package policies with pagination |
| `fleet.proxyDelete` | `kibana.api.fleet.proxyDelete` | `destructive` | Delete a Fleet proxy by ID |
| `fleet.serverHostGet` | `kibana.api.fleet.serverHostGet` | `read` | Retrieve a Fleet Server host by ID |
| `fleet.serverHostsList` | `kibana.api.fleet.serverHostsList` | `read` | List Fleet Server hosts |
| `index.listIndices` | `kibana.api.index.listIndices` | `read` | List indices via Index Management (not in the official OpenAPI spec; disabled on serverless, works where Index Management UI is enabled) |
| `lists.delete` | `kibana.api.lists.delete` | `destructive` | Delete a value list by ID |
| `metrics.get` | `kibana.api.metrics.get` | `read` | Retrieve Elasticsearch node metrics |
| `osquery.deleteSavedQuery` | `kibana.api.osquery.deleteSavedQuery` | `destructive` | Delete an Osquery saved query by ID |
| `reporting.listJobs` | `kibana.api.reporting.listJobs` | `read` | List Kibana reporting jobs (legacy stateful-only API; not in the official OpenAPI spec, 404 on serverless) |
| `savedObjects.create` | `kibana.api.savedObjects.create` | `write` | Create a new saved object in Kibana |
| `savedObjects.delete` | `kibana.api.savedObjects.delete` | `destructive` | Delete a saved object by type and ID |
| `savedObjects.find` | `kibana.api.savedObjects.find` | `read` | Find saved objects matching search query or type filters |
| `savedObjects.get` | `kibana.api.savedObjects.get` | `read` | Retrieve a specific saved object by type and ID |
| `savedObjects.update` | `kibana.api.savedObjects.update` | `write` | Update attributes of an existing saved object by type and ID |
| `security.entitiesList` | `kibana.api.security.entitiesList` | `read` | List Entity Store entities |
| `security.entityStoreEngines` | `kibana.api.security.entityStoreEngines` | `read` | Retrieve Entity Store engines (derived from the entity-store status response; no separate engines endpoint exists in the spec) |
| `security.entityStoreStatus` | `kibana.api.security.entityStoreStatus` | `read` | Retrieve Entity Store status |
| `security.listEndpointItems` | `kibana.api.security.listEndpointItems` | `read` | List Endpoint exception list items |
| `status.get` | `kibana.api.status.get` | `read` | Retrieve health and version status of the Kibana instance |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kibana

## License

Apache-2.0
