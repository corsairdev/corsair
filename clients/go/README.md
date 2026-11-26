# corsaircloud

Go client for a hosted [Corsair Cloud](https://docs.corsair.dev/cloud/overview)
project. Standard library only.

```go
import corsaircloud "github.com/corsairdev/corsair/clients/go"

// The URL is derived from the key; pass corsaircloud.WithURL(...) only for dev.
corsair := corsaircloud.New("ck_cloud_…")

// A project has one or more instances, each with its own plugins, tenants and
// connected accounts. Name one, then call as one of your users:
billing := corsair.Instance("billing")
raw, err := billing.Tenant("acme").Call(ctx, "notion", "pages.searchPage", map[string]any{})
var pages NotionPages
_ = json.Unmarshal(raw, &pages)

// A tenant with two Slack accounts: pick one per plugin.
work := billing.Tenant("acme", corsaircloud.WithAccounts(map[string]string{"slack": "work"}))
_, err = work.Call(ctx, "slack", "messages.post", map[string]any{"channel": "#general", "text": "hi"})

// Connect a user's account, then check status:
link, _ := billing.CreateConnectLink(ctx, "notion", "acme", nil) // or &corsaircloud.ConnectLinkOptions{OAuthMode: "managed"}
status, _ := billing.ConnectionStatus(ctx, "acme")

// Tenants, permissions and disconnects are per instance too:
tenants, _ := billing.Tenants(ctx)
_ = billing.Disconnect(ctx, "notion", "acme", nil) // or &corsaircloud.DisconnectOptions{Account: "work"}
```

There is no default instance, so adding a second one never reroutes existing
code. The client fetches the project's instance list once and reuses it; a key
it doesn't know triggers one fresh fetch before `*corsaircloud.UnknownInstanceError`,
which lists the instances that do exist.

A non-2xx response comes back as `*corsaircloud.CorsairError` (`Code`, `Message`,
`Reason`, `ProviderStatus`, `Retryable`, `RequestID`, and `Body` for anything
else the server sent). Full guide:
[docs.corsair.dev/clients/go](https://docs.corsair.dev/clients/go).

## Versioning

This module lives in a subdirectory of the `corsair` monorepo, so Go's module
proxy needs a subdirectory-scoped tag, not a bare `vX.Y.Z`. None has been
pushed yet, so for now track the branch:

```bash
go get github.com/corsairdev/corsair/clients/go@main
```

A release is a tag like this one:

```bash
git tag clients/go/v0.1.0
git push origin clients/go/v0.1.0
```

Consumers then pin `go get github.com/corsairdev/corsair/clients/go@v0.1.0`,
and `@latest` resolves to the highest `clients/go/vX.Y.Z` tag.
