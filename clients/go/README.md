# corsaircloud

Go client for a hosted Corsair Cloud project.

```go
import "github.com/corsairdev/corsair/clients/go"

corsair := corsaircloud.New("ck_cloud_…", "https://vm.corsair.cloud/env/api/corsair")

raw, err := corsair.Tenant("acme").Call(ctx, "notion", "pages.searchPage", map[string]any{})

var pages NotionPages
_ = json.Unmarshal(raw, &pages)

status, _ := corsair.ConnectionStatus(ctx, "acme")
link, _ := corsair.CreateConnectLink(ctx, "notion", "acme")
```

Errors from non-2xx responses are `*corsaircloud.CorsairError` (`Code`, `Message`, `Reason`, `ProviderStatus`).
