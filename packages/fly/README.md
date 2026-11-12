# @corsair-dev/fly

Fly.io GraphQL plugin for Corsair. It implements 34 selected operations;
it does not implement the separate Machines REST API or the complete GraphQL API.
Fly warns that its GraphQL interface can change without notice; the operation
documents were checked against the [Fly-maintained schema](https://github.com/superfly/fly-go/blob/494ae940b5bdaf7ed50d53ce01ed973915e268ce/schema.graphql).

## Install

```bash
pnpm add @corsair-dev/fly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.userOnlyToken` | `fly.api.account.userOnlyToken` | `read` | Check whether the token is user-only |
| `account.viewer` | `fly.api.account.viewer` | `read` | Get the current token principal |
| `addOns.create` | `fly.api.addOns.create` | `write` | Create an add-on |
| `addOns.delete` | `fly.api.addOns.delete` | `destructive` | Delete an add-on |
| `addOns.get` | `fly.api.addOns.get` | `read` | Get an add-on |
| `addOns.list` | `fly.api.addOns.list` | `read` | List add-ons |
| `addOns.plans` | `fly.api.addOns.plans` | `read` | List add-on plans |
| `addOns.provider` | `fly.api.addOns.provider` | `read` | Get an add-on provider |
| `addOns.resetPassword` | `fly.api.addOns.resetPassword` | `write` | Reset an add-on password |
| `addOns.update` | `fly.api.addOns.update` | `write` | Update an add-on |
| `apps.get` | `fly.api.apps.get` | `read` | Get a Fly app |
| `apps.list` | `fly.api.apps.list` | `read` | List Fly apps |
| `apps.nameAvailable` | `fly.api.apps.nameAvailable` | `read` | Check app name availability |
| `checks.createJob` | `fly.api.checks.createJob` | `write` | Create a health check job |
| `checks.jobs` | `fly.api.checks.jobs` | `read` | List health check jobs |
| `checks.locations` | `fly.api.checks.locations` | `read` | List health check locations |
| `checks.runJob` | `fly.api.checks.runJob` | `write` | Run a health check job |
| `organizations.delete` | `fly.api.organizations.delete` | `destructive` | Permanently delete an organization |
| `organizations.get` | `fly.api.organizations.get` | `read` | Get an organization |
| `organizations.list` | `fly.api.organizations.list` | `read` | List organizations |
| `organizations.personal` | `fly.api.organizations.personal` | `read` | Get the personal organization |
| `platform.nearestRegion` | `fly.api.platform.nearestRegion` | `read` | Get the nearest Fly region |
| `thirdParty.create` | `fly.api.thirdParty.create` | `write` | Create a third-party configuration |
| `thirdParty.delete` | `fly.api.thirdParty.delete` | `destructive` | Delete a third-party configuration |
| `thirdParty.list` | `fly.api.thirdParty.list` | `read` | List third-party configurations |
| `thirdParty.update` | `fly.api.thirdParty.update` | `write` | Update a third-party configuration |
| `wireguard.addPeer` | `fly.api.wireguard.addPeer` | `write` | Add a WireGuard peer |
| `wireguard.createToken` | `fly.api.wireguard.createToken` | `write` | Create a delegated WireGuard token |
| `wireguard.deleteToken` | `fly.api.wireguard.deleteToken` | `destructive` | Revoke a delegated WireGuard token |
| `wireguard.getPeer` | `fly.api.wireguard.getPeer` | `read` | Get a WireGuard peer |
| `wireguard.listPeers` | `fly.api.wireguard.listPeers` | `read` | List organization WireGuard peers |
| `wireguard.listTokens` | `fly.api.wireguard.listTokens` | `read` | List delegated WireGuard tokens |
| `wireguard.removePeer` | `fly.api.wireguard.removePeer` | `destructive` | Remove a WireGuard peer |
| `wireguard.validatePeers` | `fly.api.wireguard.validatePeers` | `write` | Validate WireGuard peer addresses |

## Auth

Auth: Fly access token. Provide the entire token, including its `FlyV1 ` prefix,
as the API key. The plugin sends it as a Bearer token to `https://api.fly.io/graphql`.
Fly GraphQL pagination uses `first`/`last` and `after`/`before`; responses include
`pageInfo`. The default error handlers do not automatically retry operations;
custom error handlers can override this behavior and should not replay mutations.

```ts
import { createCorsair } from 'corsair';
import { fly } from '@corsair-dev/fly';

const corsair = createCorsair({ plugins: [fly({ key: process.env.FLY_API_TOKEN })] });
const apps = await corsair.fly.api.apps.list({ first: 20 });
```

Third-party configuration caveats are not exposed: Fly's schema declares them
as a custom scalar without a documented wire shape. Arbitrary GraphQL queries,
Machines REST endpoints, and inbound webhook handlers are out of scope.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fly

## License

Apache-2.0
