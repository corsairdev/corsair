# corsaircloud

Go client for a hosted [Corsair Cloud](https://docs.corsair.dev/cloud/overview)
project. Standard library only.

```go
import corsaircloud "github.com/corsairdev/corsair/clients/go"

// The URL is derived from the key; pass corsaircloud.WithURL(...) only for dev.
corsair := corsaircloud.New("ck_cloud_…")

// Call any operation on any plugin your runtime has, as user "acme":
raw, err := corsair.Tenant("acme").Call(ctx, "notion", "pages.searchPage", map[string]any{})
var pages NotionPages
_ = json.Unmarshal(raw, &pages)

// Connect a user's account, then check status:
link, _ := corsair.CreateConnectLink(ctx, "notion", "acme", "") // last arg: optional redirectURI
status, _ := corsair.ConnectionStatus(ctx, "acme")
```

A non-2xx response comes back as `*corsaircloud.CorsairError` (`Code`, `Message`,
`Reason`, `ProviderStatus`). Full guide:
[docs.corsair.dev/clients/go](https://docs.corsair.dev/clients/go).

## Versioning

This module lives in a subdirectory of the `corsair` monorepo, so Go's module
proxy needs a subdirectory-scoped tag, not a bare `vX.Y.Z`:

```bash
git tag clients/go/v0.1.0
git push origin clients/go/v0.1.0
```

Consumers then pin:

```bash
go get github.com/corsairdev/corsair/clients/go@v0.1.0
```

`go get ...@latest` resolves to the highest `clients/go/vX.Y.Z` tag. A bare
`@main` tracks the branch HEAD instead.
