# @corsair-dev/backendless

Backendless plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/backendless
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `counters.get` | `backendless.api.counters.get` | `read` | Read a Backendless atomic counter. |
| `counters.reset` | `backendless.api.counters.reset` | `destructive` | Reset a Backendless atomic counter. |
| `counters.set` | `backendless.api.counters.set` | `write` | Conditionally update a Backendless atomic counter. |
| `data.retrieve` | `backendless.api.data.retrieve` | `read` | Retrieve Backendless database objects. |
| `files.copy` | `backendless.api.files.copy` | `write` | Copy a Backendless file or directory. |
| `files.count` | `backendless.api.files.count` | `read` | Count Backendless files and directories. |
| `files.createDirectory` | `backendless.api.files.createDirectory` | `write` | Create a Backendless directory. |
| `files.delete` | `backendless.api.files.delete` | `destructive` | Delete a Backendless file. |
| `files.deleteDirectory` | `backendless.api.files.deleteDirectory` | `destructive` | Delete a Backendless directory. |
| `files.list` | `backendless.api.files.list` | `read` | List Backendless files and directories. |
| `files.move` | `backendless.api.files.move` | `write` | Move a Backendless file or directory. |
| `hive.create` | `backendless.api.hive.create` | `write` | Create a Backendless Hive. |
| `hive.keyItems` | `backendless.api.hive.keyItems` | `read` | Retrieve items from a Backendless Hive list. |
| `hive.mapPut` | `backendless.api.hive.mapPut` | `write` | Insert or update a Backendless Hive map value. |
| `hive.values` | `backendless.api.hive.values` | `read` | Retrieve values from a Backendless Hive map. |
| `messaging.publish` | `backendless.api.messaging.publish` | `write` | Publish a message to a Backendless channel. |
| `permissions.grant` | `backendless.api.permissions.grant` | `destructive` | Grant a Backendless data permission; security-sensitive. |
| `permissions.revoke` | `backendless.api.permissions.revoke` | `destructive` | Revoke a Backendless data permission; security-sensitive. |
| `users.delete` | `backendless.api.users.delete` | `destructive` | Delete a Backendless user. |
| `users.find` | `backendless.api.users.find` | `read` | Find a Backendless user by object ID. |
| `users.login` | `backendless.api.users.login` | `write` | Log in to Backendless and return a user token. |
| `users.logout` | `backendless.api.users.logout` | `write` | Log out the current Backendless user session. |
| `users.passwordRecovery` | `backendless.api.users.passwordRecovery` | `write` | Request Backendless password recovery. |
| `users.register` | `backendless.api.users.register` | `write` | Register a Backendless user. |
| `users.update` | `backendless.api.users.update` | `write` | Update a Backendless user. |
| `users.validateToken` | `backendless.api.users.validateToken` | `read` | Validate a Backendless user token. |

## Auth

Authentication depends on how you configure the plugin factory. See the full reference for supported methods.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/backendless

## License

Apache-2.0
