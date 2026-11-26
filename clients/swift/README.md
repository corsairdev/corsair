# CorsairCloud (Swift)

Swift client for a hosted [Corsair Cloud](https://docs.corsair.dev/cloud/overview)
project. Uses `URLSession` and `async`/`await`.

## Install

Not yet resolvable as a remote SPM dependency (see "Distribution status" below).
For in-repo or vendored use, add it as a local path dependency:

```swift
.package(path: "../corsair/clients/swift"),
// target: .product(name: "CorsairCloud", package: "CorsairCloud")
```

## Use

Grab your API key (`ck_cloud_…`) from your project's Overview page. The client
derives its URL from the key, so it's the only value you pass. Keep the key on a
server, not inside a shipped app. A project has one or more instances, each with
its own plugins, tenants and connected accounts: name the instance, then call as
one of your users.

```swift
import CorsairCloud

let corsair = CorsairCloud(apiKey: "ck_cloud_…")
let billing = corsair.instance("billing")

// Call any operation on any plugin the instance has, as user "acme":
let result = try await billing.tenant("acme").call("notion", "pages.searchPage", args: [:])

// ...or decode straight into your own type:
struct Page: Decodable { let id: String }
struct SearchResult: Decodable { let results: [Page] }
let typed = try await billing.tenant("acme")
    .call("notion", "pages.searchPage", as: SearchResult.self)

// A tenant with two Slack accounts: pick one per plugin.
let work = billing.tenant("acme", accounts: ["slack": "work"])
_ = try await work.call("slack", "messages.post", args: ["channel": "#general", "text": "hi"])

// Connect a user's account, then check status:
let link = try await billing.createConnectLink(plugin: "notion", tenantId: "acme")
let status = try await billing.connectionStatus(tenantId: "acme")

// Tenants, permissions and disconnects are per instance too:
let tenants = try await billing.tenants()
try await billing.disconnect(plugin: "notion", tenantId: "acme")
```

There is no default instance, so adding a second one never reroutes existing
code. The client fetches the project's instance list once and reuses it; a key
it doesn't know triggers one fresh fetch before `UnknownInstanceError`, which
lists the instances that do exist.

Non-2xx responses throw `CorsairError` (`code`, `status`, `message`,
`retryable`, `requestId`, and `body` for anything else the server sent). Full
guide: [docs.corsair.dev/clients/swift](https://docs.corsair.dev/clients/swift).

## Distribution status

SPM's `.package(url:)` expects `Package.swift` at the repo root of the URL it
fetches. `corsair` is a monorepo with `Package.swift` at `clients/swift`, which
SPM cannot resolve directly, so a remote `.package(url: ".../corsair")` will fail
to fetch until one of these ships:

- a dedicated `corsairdev/corsair-swift` mirror repo with a root-level
  `Package.swift`, synced from `clients/swift` on release (the standard fix for a
  monorepo Swift package, recommended), or
- a local path dependency pointing straight at `clients/swift`, for in-repo or
  vendored use only.

No decision has been made yet. `Package.swift` itself needs no change either way.
