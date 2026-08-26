# BoxHero plugin

This plugin provides typed Corsair endpoints for the BoxHero Open API:

- Locations: list, get, and delete
- Items: list, get, and delete
- Transactions: basic and location transaction lists
- Partners: list
- Item attributes: list and get
- Team information: get the linked team
- Members: list and get

## Authentication

BoxHero uses bearer API tokens. Create a token in the BoxHero application under
**Settings -> Integrations -> Open API**. Tokens are bound to one BoxHero team.

For local demo testing, create a repository-root `.env` file (it is ignored by
Git):

```dotenv
BOXHERO_API_KEY=your-boxhero-api-token
CORSAIR_KEK=your-local-encryption-key
```

Generate a local encryption key with:

```bash
openssl rand -base64 32
```

The demo stores the token through Corsair's encrypted key manager and exercises
the read endpoints:

```bash
cd demo/testing
pnpm test
```

Without `BOXHERO_API_KEY`, the demo exits with a clear skip message. The
published BoxHero API does not provide a sandbox token, so live endpoint
verification requires a BoxHero team and token. Use a disposable team and do
not commit or print the token.

## Development checks

```bash
pnpm --dir packages/boxhero typecheck
pnpm --dir packages/boxhero test
pnpm --dir packages/boxhero build
```

The repository build command uses a small cross-platform cleanup shim so
package scripts that remove their `dist` directory also work on Windows.
