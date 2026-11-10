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
| `groups.addGroupDefaultTabs` | `klipfolio.api.groups.addGroupDefaultTabs` | `write` | Add Dashboard to Group on Klipfolio |
| `groups.createGroup` | `klipfolio.api.groups.createGroup` | `write` | Create Group on Klipfolio |
| `groups.deleteGroup` | `klipfolio.api.groups.deleteGroup` | `destructive` | Delete Group on Klipfolio |
| `groups.deleteGroupDefaultTab` | `klipfolio.api.groups.deleteGroupDefaultTab` | `destructive` | Delete Group Default Tab on Klipfolio |
| `groups.deleteGroupUser` | `klipfolio.api.groups.deleteGroupUser` | `destructive` | Delete User from Group on Klipfolio |
| `groups.listGroups` | `klipfolio.api.groups.listGroups` | `read` | List Groups on Klipfolio |
| `groups.retrieveGroup` | `klipfolio.api.groups.retrieveGroup` | `read` | Get Group on Klipfolio |
| `groups.retrieveGroupDefaultTab` | `klipfolio.api.groups.retrieveGroupDefaultTab` | `read` | Get Group Default Tab on Klipfolio |
| `groups.retrieveGroupDefaultTabs` | `klipfolio.api.groups.retrieveGroupDefaultTabs` | `read` | List Group Default Tabs on Klipfolio |
| `groups.retrieveGroupUsers` | `klipfolio.api.groups.retrieveGroupUsers` | `read` | List Users in Group on Klipfolio |
| `groups.updateGroup` | `klipfolio.api.groups.updateGroup` | `write` | Update Group on Klipfolio |
| `groups.updateGroupDefaultTab` | `klipfolio.api.groups.updateGroupDefaultTab` | `write` | Update Group Default Tab on Klipfolio |
| `groups.updateGroupUser` | `klipfolio.api.groups.updateGroupUser` | `write` | Add User to Group on Klipfolio |
| `klips.createKlip` | `klipfolio.api.klips.createKlip` | `write` | Create Klip on Klipfolio |
| `klips.createKlipAnnotations` | `klipfolio.api.klips.createKlipAnnotations` | `write` | Create annotation on Klipfolio |
| `klips.deleteKlip` | `klipfolio.api.klips.deleteKlip` | `destructive` | Delete Klip on Klipfolio |
| `klips.deleteKlipAnnotation` | `klipfolio.api.klips.deleteKlipAnnotation` | `destructive` | Delete annotation on Klipfolio |
| `klips.deleteKlipShareRights` | `klipfolio.api.klips.deleteKlipShareRights` | `destructive` | Delete Klip share rights on Klipfolio |
| `klips.importKlip` | `klipfolio.api.klips.importKlip` | `write` | Import Klip to client account on Klipfolio |
| `klips.listKlips` | `klipfolio.api.klips.listKlips` | `read` | List Klips on Klipfolio |
| `klips.retrieveKlip` | `klipfolio.api.klips.retrieveKlip` | `read` | Get Klip on Klipfolio |
| `klips.retrieveKlipAnnotation` | `klipfolio.api.klips.retrieveKlipAnnotation` | `read` | Get one annotation on Klipfolio |
| `klips.retrieveKlipAnnotations` | `klipfolio.api.klips.retrieveKlipAnnotations` | `read` | List annotations on Klipfolio |
| `klips.retrieveKlipClientInstances` | `klipfolio.api.klips.retrieveKlipClientInstances` | `read` | Get Klip Client Instances on Klipfolio |
| `klips.retrieveKlipSchema` | `klipfolio.api.klips.retrieveKlipSchema` | `read` | Get Klip schema on Klipfolio |
| `klips.retrieveKlipShareRights` | `klipfolio.api.klips.retrieveKlipShareRights` | `read` | Get Klip share rights on Klipfolio |
| `klips.setKlipShareRights` | `klipfolio.api.klips.setKlipShareRights` | `write` | Update Klip share rights on Klipfolio |
| `klips.updateFromParentKlip` | `klipfolio.api.klips.updateFromParentKlip` | `write` | Update client instance from parent (update_from_parent) on Klipfolio |
| `klips.updateKlip` | `klipfolio.api.klips.updateKlip` | `write` | Update Klip on Klipfolio |
| `klips.updateKlipAnnotation` | `klipfolio.api.klips.updateKlipAnnotation` | `write` | Update annotation on Klipfolio |
| `klips.updateKlipSchema` | `klipfolio.api.klips.updateKlipSchema` | `write` | Update Klip schema on Klipfolio |
| `misc.createDashboardPublishedLinks` | `klipfolio.api.misc.createDashboardPublishedLinks` | `write` | Create published link on Klipfolio |
| `misc.deleteDashboardPublishedLinks` | `klipfolio.api.misc.deleteDashboardPublishedLinks` | `destructive` | Delete published link on Klipfolio |
| `misc.listDashboardPublishedLinks` | `klipfolio.api.misc.listDashboardPublishedLinks` | `read` | Get published link(s) on Klipfolio |
| `misc.retrieveProfile` | `klipfolio.api.misc.retrieveProfile` | `read` | Get profile on Klipfolio |
| `misc.updateDashboardPublishedLinks` | `klipfolio.api.misc.updateDashboardPublishedLinks` | `write` | Update published link on Klipfolio |
| `roles.createRole` | `klipfolio.api.roles.createRole` | `write` | Create role on Klipfolio |
| `roles.deleteRole` | `klipfolio.api.roles.deleteRole` | `destructive` | Delete role on Klipfolio |
| `roles.deleteRolePermissions` | `klipfolio.api.roles.deleteRolePermissions` | `destructive` | Remove role permission on Klipfolio |
| `roles.deleteRoleUser` | `klipfolio.api.roles.deleteRoleUser` | `destructive` | Delete user from role on Klipfolio |
| `roles.listRoles` | `klipfolio.api.roles.listRoles` | `read` | List roles on Klipfolio |
| `roles.retrieveRole` | `klipfolio.api.roles.retrieveRole` | `read` | Get role on Klipfolio |
| `roles.retrieveRolePermissions` | `klipfolio.api.roles.retrieveRolePermissions` | `read` | Get role permissions on Klipfolio |
| `roles.retrieveRoleUsers` | `klipfolio.api.roles.retrieveRoleUsers` | `read` | List users for role on Klipfolio |
| `roles.updateRole` | `klipfolio.api.roles.updateRole` | `write` | Update role on Klipfolio |
| `roles.updateRolePermissions` | `klipfolio.api.roles.updateRolePermissions` | `write` | Update role permissions on Klipfolio |
| `roles.updateRoleUser` | `klipfolio.api.roles.updateRoleUser` | `write` | Add user to role on Klipfolio |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/klipfolio

## License

Apache-2.0
