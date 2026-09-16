# corsaircloud

Go client for a hosted Corsair Cloud project.

```go
import "github.com/corsairdev/corsair/clients/go"

corsair := corsaircloud.New("ck_cloud_…", "https://vm.corsair.cloud/env/api/corsair")

raw, err := corsair.Tenant("acme").Call(ctx, "notion", "pages.searchPage", map[string]any{})

var pages NotionPages
_ = json.Unmarshal(raw, &pages)

status, _ := corsair.ConnectionStatus(ctx, "acme")
link, _ := corsair.CreateConnectLink(ctx, "notion", "acme", "") // redirectURI optional
```

Errors from non-2xx responses are `*corsaircloud.CorsairError` (`Code`, `Message`, `Reason`, `ProviderStatus`).

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

`go get ...@latest` resolves to the highest `clients/go/vX.Y.Z` tag; a bare
`@main` tracks the branch HEAD instead.
