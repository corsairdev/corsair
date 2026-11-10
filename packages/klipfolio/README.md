# @corsair-dev/klipfolio

Klipfolio plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/klipfolio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clients.createClient` | `klipfolio.api.clients.createClient` | `write` | Create Client on Klipfolio |
| `clients.createClientSettings` | `klipfolio.api.clients.createClientSettings` | `write` | Set Client Settings on Klipfolio |
| `clients.deleteClient` | `klipfolio.api.clients.deleteClient` | `destructive` | Delete Client on Klipfolio |
| `clients.deleteClientProperties` | `klipfolio.api.clients.deleteClientProperties` | `destructive` | Delete Client Property on Klipfolio |
| `clients.deleteClientShareRight` | `klipfolio.api.clients.deleteClientShareRight` | `destructive` | Revoke Group Access to Client on Klipfolio |
| `clients.enableDirectBillingClient` | `klipfolio.api.clients.enableDirectBillingClient` | `write` | Enable Direct Billing on Klipfolio |
| `clients.extendTrialClient` | `klipfolio.api.clients.extendTrialClient` | `write` | Extend Trial on Klipfolio |
| `clients.listClients` | `klipfolio.api.clients.listClients` | `read` | List Clients on Klipfolio |
| `clients.retrieveClient` | `klipfolio.api.clients.retrieveClient` | `read` | Get Client on Klipfolio |
| `clients.retrieveClientFeatures` | `klipfolio.api.clients.retrieveClientFeatures` | `read` | Get Client Features on Klipfolio |
| `clients.retrieveClientProperties` | `klipfolio.api.clients.retrieveClientProperties` | `read` | Get Client Properties on Klipfolio |
| `clients.retrieveClientResources` | `klipfolio.api.clients.retrieveClientResources` | `read` | Get Client Resources on Klipfolio |
| `clients.retrieveClientSettings` | `klipfolio.api.clients.retrieveClientSettings` | `read` | Get Client Settings on Klipfolio |
| `clients.retrieveClientShareRights` | `klipfolio.api.clients.retrieveClientShareRights` | `read` | Get Client Share Rights on Klipfolio |
| `clients.setClientShareRights` | `klipfolio.api.clients.setClientShareRights` | `write` | Update Client Share Rights on Klipfolio |
| `clients.updateClient` | `klipfolio.api.clients.updateClient` | `write` | Update Client on Klipfolio |
| `clients.updateClientFeatures` | `klipfolio.api.clients.updateClientFeatures` | `write` | Update Client Features on Klipfolio |
| `clients.updateClientProperties` | `klipfolio.api.clients.updateClientProperties` | `write` | Update Client Properties on Klipfolio |
| `clients.updateClientResources` | `klipfolio.api.clients.updateClientResources` | `write` | Update Client Resources on Klipfolio |
| `datasources.createDatasource` | `klipfolio.api.datasources.createDatasource` | `write` | Create Data Source on Klipfolio |
| `datasources.createDatasourceInstances` | `klipfolio.api.datasources.createDatasourceInstances` | `write` | Create Data Source Instance on Klipfolio |
| `datasources.deleteDatasource` | `klipfolio.api.datasources.deleteDatasource` | `destructive` | Delete Data Source on Klipfolio |
| `datasources.deleteDatasourceInstances` | `klipfolio.api.datasources.deleteDatasourceInstances` | `destructive` | Delete Data Source Instance on Klipfolio |
| `datasources.deleteDatasourceInstancesProperties` | `klipfolio.api.datasources.deleteDatasourceInstancesProperties` | `destructive` | Delete Data Source Instance Property on Klipfolio |
| `datasources.deleteDatasourceProperties` | `klipfolio.api.datasources.deleteDatasourceProperties` | `destructive` | Delete a Data Source Property on Klipfolio |
| `datasources.deleteDatasourceShareRight` | `klipfolio.api.datasources.deleteDatasourceShareRight` | `destructive` | Delete Data Source Share Right on Klipfolio |
| `datasources.deleteInstancesDatasource` | `klipfolio.api.datasources.deleteInstancesDatasource` | `write` | Delete Instances on Klipfolio |
| `datasources.disableDatasource` | `klipfolio.api.datasources.disableDatasource` | `write` | Disable a Data Source on Klipfolio |
| `datasources.enableDatasource` | `klipfolio.api.datasources.enableDatasource` | `write` | Enable a Data Source on Klipfolio |
| `datasources.importDatasource` | `klipfolio.api.datasources.importDatasource` | `write` | Import a Data Source on Klipfolio |
| `datasources.listDatasourceInstances` | `klipfolio.api.datasources.listDatasourceInstances` | `read` | List Data Source Instances on Klipfolio |
| `datasources.listDatasources` | `klipfolio.api.datasources.listDatasources` | `read` | List Data Sources on Klipfolio |
| `datasources.refreshDatasource` | `klipfolio.api.datasources.refreshDatasource` | `write` | Refresh Multiple Data Sources on Klipfolio |
| `datasources.refreshDatasourceInstances` | `klipfolio.api.datasources.refreshDatasourceInstances` | `write` | Refresh a Data Source Instance on Klipfolio |
| `datasources.retrieveDatasource` | `klipfolio.api.datasources.retrieveDatasource` | `read` | Get Data Source on Klipfolio |
| `datasources.retrieveDatasourceInstances` | `klipfolio.api.datasources.retrieveDatasourceInstances` | `read` | Get Data Source Instance on Klipfolio |
| `datasources.retrieveDatasourceInstancesData` | `klipfolio.api.datasources.retrieveDatasourceInstancesData` | `read` | Get Data Source Instance Data on Klipfolio |
| `datasources.retrieveDatasourceInstancesProperties` | `klipfolio.api.datasources.retrieveDatasourceInstancesProperties` | `read` | Get Data Source Instance Properties on Klipfolio |
| `datasources.retrieveDatasourceProperties` | `klipfolio.api.datasources.retrieveDatasourceProperties` | `read` | Get Data Source Properties on Klipfolio |
| `datasources.retrieveDatasourceShareRights` | `klipfolio.api.datasources.retrieveDatasourceShareRights` | `read` | Get Data Source Share Rights on Klipfolio |
| `datasources.setDatasourceShareRights` | `klipfolio.api.datasources.setDatasourceShareRights` | `write` | Update Data Source Share Rights on Klipfolio |
| `datasources.updateDatasource` | `klipfolio.api.datasources.updateDatasource` | `write` | Update Data Source on Klipfolio |
| `datasources.updateDatasourceInstancesData` | `klipfolio.api.datasources.updateDatasourceInstancesData` | `write` | Update Data Source Instance Data on Klipfolio |
| `datasources.updateDatasourceInstancesProperties` | `klipfolio.api.datasources.updateDatasourceInstancesProperties` | `write` | Create or Update Data Source Instance Properties on Klipfolio |
| `datasources.updateDatasourceProperties` | `klipfolio.api.datasources.updateDatasourceProperties` | `write` | Create or Update Data Source Properties on Klipfolio |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/klipfolio

## License

Apache-2.0
