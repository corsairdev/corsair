# @corsair-dev/backendless

Backendless provider for Corsair. This package exposes verified Backendless REST operations through Corsair’s typed plugin architecture.

## Configuration

Use an HTTPS Backendless application subdomain as `baseUrl`, for example `https://your-app.backendless.app`. Store the REST API key, application ID, base URL, and optional user token through Corsair’s encrypted account key manager. The `restApiKey`, `applicationId`, `baseUrl`, and `userToken` options are useful for controlled local configuration, but production deployments should prefer Corsair-managed encrypted credentials.

```ts
import { backendless } from '@corsair-dev/backendless';

const plugin = backendless({
  authType: 'api_key',
  applicationId: process.env.BACKENDLESS_APPLICATION_ID,
  restApiKey: process.env.BACKENDLESS_REST_API_KEY,
  baseUrl: process.env.BACKENDLESS_BASE_URL,
  userToken: process.env.BACKENDLESS_USER_TOKEN,
  permissions: { mode: 'cautious' },
});
```

Never commit these values, print them in logs, include them in snapshots, or place them in a public client bundle. User passwords are accepted only for the login or registration request and are never persisted or logged. A login response returns the user object and the Backendless user token; subsequent user-scoped operations send that token only in the `user-token` header.

## Operation groups

The provider includes file copy, move, delete, directory creation and deletion, directory listing, and file counting. It also includes database retrieval with filters, sorting, pagination, properties, exclusions, and relation loading; Hive creation, map value retrieval, list item retrieval, and map updates; atomic counter retrieval, conditional updates, and reset; user registration, login, logout, password recovery, update, deletion, lookup, and token validation; table/object permission grant and revoke; and message publishing with optional headers, subtopic, and schedule fields.

Destructive operations are marked with `riskLevel: 'destructive'` and irreversible actions are flagged where appropriate. Permission grant and revoke are intentionally destructive/security-sensitive. Configure Corsair’s plugin permission mode and endpoint overrides to require approval or deny these actions in production.

## Webhooks

This provider intentionally declares no webhook tree. Backendless webhook matchers and handlers were not invented because no verified webhook-signing contract was supplied for this integration.

## Timers

Official REST docs do not publish timer CRUD. Timers are Cloud Code, created in Console, so this plugin does not invent those endpoints. See [Cloud Code timers](https://backendless.com/docs/bl-js/bl_timers.html).

## Development

From the monorepo root:

```bash
pnpm install
pnpm --filter @corsair-dev/backendless typecheck
pnpm --filter @corsair-dev/backendless test
pnpm --filter @corsair-dev/backendless build
pnpm validate:plugins
pnpm build:explorer-catalog
```

The tests use mocked Corsair HTTP requests and do not require a live Backendless application. The catalog generator discovers this package from `packages/backendless/package.json` and `packages/backendless/index.ts`; no manually maintained generated catalog entry is required.

## API references

The REST request shapes follow Backendless documentation for [client setup](https://backendless.com/docs/rest/setup.html), [file operations](https://backendless.com/docs/rest/files_overview.html), [basic data retrieval](https://backendless.com/docs/rest/data_basic_search.html), [Hive list items](https://backendless.com/docs/rest/list_api_get_data.html), [map values](https://backendless.com/docs/rest/map_api_get_all_key_value_pairs.html), [atomic counters](https://backendless.com/docs/rest/ut_get_current.html), [user login and validation](https://backendless.com/docs/rest/users_login.html), [user removal](https://backendless.com/docs/rest/users_remove_user.html), [data permissions](https://backendless.com/docs/rest/data_permissions_api.html), and [Cloud Code timers](https://backendless.com/docs/bl-js/bl_timers.html).
