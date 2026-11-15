# @corsair-dev/triggercmd

TRIGGERcmd plugin for Corsair: list registered computers and their commands, run a command remotely, read run history, and press panel buttons.

## Install

```bash
pnpm add @corsair-dev/triggercmd
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `commands.history` | `triggercmd.api.commands.history` | `read` | Read the run history of one command, newest first |
| `commands.list` | `triggercmd.api.commands.list` | `read` | List the commands configured on every computer, with the computer each belongs to |
| `commands.run` | `triggercmd.api.commands.run` | `write` | Run a configured command on one of the account's computers, with optional parameters |
| `computers.list` | `triggercmd.api.computers.list` | `read` | List the computers the agent has registered |
| `panels.list` | `triggercmd.api.panels.list` | `read` | List the dashboard panel buttons and the parameters each carries |
| `panels.trigger` | `triggercmd.api.panels.trigger` | `write` | Press a panel button, which runs the command it is configured for |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/triggercmd

## License

Apache-2.0
