# @corsair-dev/make

Make plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/make
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `scenarios.activate` | `make.api.scenarios.activate` | `destructive` | Activate scenario |
| `scenarios.addBuildVariables` | `make.api.scenarios.addBuildVariables` | `write` | Add new buildtime variables to scenario metadata |
| `scenarios.clone` | `make.api.scenarios.clone` | `write` | Clone scenario |
| `scenarios.countTrash` | `make.api.scenarios.countTrash` | `read` | Count scenarios in trash |
| `scenarios.create` | `make.api.scenarios.create` | `write` | Create scenario |
| `scenarios.deactivate` | `make.api.scenarios.deactivate` | `write` | Deactivate scenario |
| `scenarios.delete` | `make.api.scenarios.delete` | `destructive` | Delete scenario |
| `scenarios.deleteBuildVariable` | `make.api.scenarios.deleteBuildVariable` | `write` | Delete buildtime variable |
| `scenarios.get` | `make.api.scenarios.get` | `read` | Get scenario details |
| `scenarios.getAiAgentModules` | `make.api.scenarios.getAiAgentModules` | `read` | Get AI agent module details for scenarios |
| `scenarios.getInterface` | `make.api.scenarios.getInterface` | `read` | Get scenario interface |
| `scenarios.getModuleData` | `make.api.scenarios.getModuleData` | `read` | Check module data |
| `scenarios.getTriggers` | `make.api.scenarios.getTriggers` | `read` | Get trigger details |
| `scenarios.getUsage` | `make.api.scenarios.getUsage` | `read` | Get scenario usage |
| `scenarios.list` | `make.api.scenarios.list` | `read` | List scenarios |
| `scenarios.listAiAgents` | `make.api.scenarios.listAiAgents` | `read` | List AI agent scenarios |
| `scenarios.listBuildVariables` | `make.api.scenarios.listBuildVariables` | `read` | List buildtime variables |
| `scenarios.moveToTrash` | `make.api.scenarios.moveToTrash` | `destructive` | Move scenarios to trash |
| `scenarios.replay` | `make.api.scenarios.replay` | `destructive` | Replay scenario executions |
| `scenarios.restore` | `make.api.scenarios.restore` | `write` | Restore scenario from trash |
| `scenarios.run` | `make.api.scenarios.run` | `destructive` | Run a scenario |
| `scenarios.update` | `make.api.scenarios.update` | `write` | Update scenario |
| `scenarios.updateBuildVariables` | `make.api.scenarios.updateBuildVariables` | `write` | Update buildtime variables in scenario metadata |
| `scenarios.updateInterface` | `make.api.scenarios.updateInterface` | `write` | Update scenario interface |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/make

## License

Apache-2.0
