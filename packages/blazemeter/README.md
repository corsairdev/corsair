# @corsair-dev/blazemeter

BlazeMeter plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/blazemeter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.list` | `blazemeter.api.accounts.list` | `read` | List accounts available to the authenticated user |
| `assetDependencies.create` | `blazemeter.api.assetDependencies.create` | `write` | Create a dependency from one workspace asset to another |
| `assetDependencies.forAsset` | `blazemeter.api.assetDependencies.forAsset` | `read` | List dependencies belonging to an asset |
| `assetDependencies.get` | `blazemeter.api.assetDependencies.get` | `read` | Get one asset dependency by ID |
| `assetDependencies.list` | `blazemeter.api.assetDependencies.list` | `read` | List workspace asset dependencies |
| `assetDependencies.remove` | `blazemeter.api.assetDependencies.remove` | `destructive` | Delete an asset dependency by ID |
| `assetDependencies.removeMatching` | `blazemeter.api.assetDependencies.removeMatching` | `destructive` | Delete asset dependencies matching source, target, and type filters |
| `assetDependencies.updateForAsset` | `blazemeter.api.assetDependencies.updateForAsset` | `write` | Replace dependencies for an asset |
| `assets.create` | `blazemeter.api.assets.create` | `write` | Create an Asset Repository asset |
| `assets.data` | `blazemeter.api.assets.data` | `read` | Get stored data for an asset |
| `assets.get` | `blazemeter.api.assets.get` | `read` | Get a workspace asset by ID |
| `assets.list` | `blazemeter.api.assets.list` | `read` | List Asset Repository assets in a workspace |
| `assets.remove` | `blazemeter.api.assets.remove` | `destructive` | Delete a workspace asset |
| `assets.update` | `blazemeter.api.assets.update` | `write` | Update a workspace asset |
| `assets.uploadData` | `blazemeter.api.assets.uploadData` | `write` | Upload data content to an asset |
| `generator.cardIssuers` | `blazemeter.api.generator.cardIssuers` | `read` | List available credit-card issuer generators |
| `generator.functions` | `blazemeter.api.generator.functions` | `read` | List available synthetic-data generator functions |
| `generator.seedLists` | `blazemeter.api.generator.seedLists` | `read` | List available generator seed lists |
| `info.health` | `blazemeter.api.info.health` | `read` | Get Asset Repository service health |
| `info.version` | `blazemeter.api.info.version` | `read` | Get Asset Repository build information |
| `masters.stop` | `blazemeter.api.masters.stop` | `destructive` | Gracefully stop a running master execution |
| `masters.summary` | `blazemeter.api.masters.summary` | `read` | Get request statistics for a master test run |
| `multiTests.create` | `blazemeter.api.multiTests.create` | `write` | Create a multi-test in a project |
| `multiTests.get` | `blazemeter.api.multiTests.get` | `read` | Get a multi-test by ID |
| `multiTests.list` | `blazemeter.api.multiTests.list` | `read` | List multi-tests in a workspace |
| `packages.create` | `blazemeter.api.packages.create` | `write` | Create an Asset Repository package |
| `packages.dependencies` | `blazemeter.api.packages.dependencies` | `read` | List package dependencies |
| `packages.export` | `blazemeter.api.packages.export` | `read` | Export one package as a zip archive |
| `packages.exportMany` | `blazemeter.api.packages.exportMany` | `read` | Export multiple workspace packages as a zip archive |
| `packages.get` | `blazemeter.api.packages.get` | `read` | Get a workspace package |
| `packages.import` | `blazemeter.api.packages.import` | `write` | Import a package zip into a workspace |
| `packages.list` | `blazemeter.api.packages.list` | `read` | List packages in a workspace |
| `packages.remove` | `blazemeter.api.packages.remove` | `destructive` | Delete a workspace package |
| `packages.update` | `blazemeter.api.packages.update` | `write` | Update a workspace package |
| `packages.updateDependencies` | `blazemeter.api.packages.updateDependencies` | `write` | Replace package dependencies |
| `privateLocations.create` | `blazemeter.api.privateLocations.create` | `write` | Create a private execution location |
| `privateLocations.createAgent` | `blazemeter.api.privateLocations.createAgent` | `write` | Create an agent in a private location |
| `privateLocations.list` | `blazemeter.api.privateLocations.list` | `read` | List private execution locations |
| `privateLocations.removeWorkspace` | `blazemeter.api.privateLocations.removeWorkspace` | `destructive` | Remove a workspace from a private location |
| `projects.create` | `blazemeter.api.projects.create` | `write` | Create a project in a workspace |
| `projects.get` | `blazemeter.api.projects.get` | `read` | Get project details |
| `projects.list` | `blazemeter.api.projects.list` | `read` | List projects in a workspace |
| `projects.remove` | `blazemeter.api.projects.remove` | `destructive` | Delete a project, optionally forcing removal of contained data |
| `projects.update` | `blazemeter.api.projects.update` | `write` | Update a project |
| `regions.list` | `blazemeter.api.regions.list` | `read` | List execution regions and locations |
| `schedules.create` | `blazemeter.api.schedules.create` | `write` | Create a cron schedule for a test or multi-test |
| `schedules.get` | `blazemeter.api.schedules.get` | `read` | Get a schedule by ID |
| `schedules.list` | `blazemeter.api.schedules.list` | `read` | List schedules with scope and pagination filters |
| `schedules.remove` | `blazemeter.api.schedules.remove` | `destructive` | Delete a test schedule |
| `schedules.update` | `blazemeter.api.schedules.update` | `write` | Enable or disable a schedule |
| `search.execute` | `blazemeter.api.search.execute` | `read` | Search BlazeMeter entities using filters, selected fields, and ordering |
| `search.metadata` | `blazemeter.api.search.metadata` | `read` | Get searchable entities, fields, relations, and operators |
| `serviceMockTemplates.get` | `blazemeter.api.serviceMockTemplates.get` | `read` | Get a virtual-service template by ID |
| `serviceMockTemplates.list` | `blazemeter.api.serviceMockTemplates.list` | `read` | List virtual-service templates in a workspace |
| `serviceMockTemplates.update` | `blazemeter.api.serviceMockTemplates.update` | `write` | Update a virtual-service template |
| `sharedFolders.list` | `blazemeter.api.sharedFolders.list` | `read` | List shared folders in a workspace |
| `tags.create` | `blazemeter.api.tags.create` | `write` | Create a workspace tag |
| `tags.list` | `blazemeter.api.tags.list` | `read` | List Mock Services tags |
| `testData.generate` | `blazemeter.api.testData.generate` | `write` | Generate test data from an inline model |
| `testData.generateFromModel` | `blazemeter.api.testData.generateFromModel` | `write` | Generate synthetic records from a stored data model |
| `testData.getModel` | `blazemeter.api.testData.getModel` | `read` | Get a data model by ID |
| `testData.publish` | `blazemeter.api.testData.publish` | `write` | Publish generated data through a Test Data orchestration target |
| `testData.validateModel` | `blazemeter.api.testData.validateModel` | `write` | Validate a workspace data model |
| `tests.create` | `blazemeter.api.tests.create` | `write` | Create a performance or functional test |
| `tests.duplicate` | `blazemeter.api.tests.duplicate` | `write` | Duplicate a test and its configuration |
| `tests.files` | `blazemeter.api.tests.files` | `read` | List files attached to a test |
| `tests.get` | `blazemeter.api.tests.get` | `read` | Get test details |
| `tests.list` | `blazemeter.api.tests.list` | `read` | List tests by workspace or project |
| `tests.remove` | `blazemeter.api.tests.remove` | `destructive` | Delete a test |
| `tests.removeFile` | `blazemeter.api.tests.removeFile` | `destructive` | Delete an uploaded test asset file |
| `tests.start` | `blazemeter.api.tests.start` | `write` | Start a configured test |
| `tests.stop` | `blazemeter.api.tests.stop` | `destructive` | Stop every active execution for a test |
| `tests.update` | `blazemeter.api.tests.update` | `write` | Update a test configuration |
| `tests.uploadFile` | `blazemeter.api.tests.uploadFile` | `write` | Upload a script, data file, or configuration to a test |
| `tests.validate` | `blazemeter.api.tests.validate` | `write` | Start validation for a test configuration |
| `tests.validations` | `blazemeter.api.tests.validations` | `read` | Get test-file validation results |
| `transactions.convert` | `blazemeter.api.transactions.convert` | `write` | Convert Swagger, HAR, YAML, or other transaction input to BlazeMeter DSL |
| `transactions.create` | `blazemeter.api.transactions.create` | `write` | Create service-virtualization transactions in a workspace |
| `transactions.list` | `blazemeter.api.transactions.list` | `read` | List service-virtualization transactions in a workspace |
| `user.activeSessions` | `blazemeter.api.user.activeSessions` | `read` | List active test sessions for the authenticated user |
| `user.get` | `blazemeter.api.user.get` | `read` | Get the authenticated user profile |
| `user.invites` | `blazemeter.api.user.invites` | `read` | List pending user invitations |
| `user.projects` | `blazemeter.api.user.projects` | `read` | List projects available to the authenticated user |
| `user.register` | `blazemeter.api.user.register` | `write` | Register a BlazeMeter user account |
| `user.terminateSessions` | `blazemeter.api.user.terminateSessions` | `destructive` | Immediately terminate selected active sessions |
| `workspaces.get` | `blazemeter.api.workspaces.get` | `read` | Get workspace details |
| `workspaces.list` | `blazemeter.api.workspaces.list` | `read` | List workspaces for an account |
| `workspaces.removeLogs` | `blazemeter.api.workspaces.removeLogs` | `destructive` | Delete master execution logs from a workspace |
| `workspaces.removeManagers` | `blazemeter.api.workspaces.removeManagers` | `destructive` | Remove managers from a workspace |
| `workspaces.terminateMasters` | `blazemeter.api.workspaces.terminateMasters` | `destructive` | Terminate active master executions in a workspace |
| `workspaces.updateUser` | `blazemeter.api.workspaces.updateUser` | `write` | Update a workspace user role and enabled status |
| `workspaces.users` | `blazemeter.api.workspaces.users` | `read` | List users in a workspace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/blazemeter

## License

Apache-2.0
