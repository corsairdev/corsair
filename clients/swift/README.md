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
server, not inside a shipped app.

```swift
import CorsairCloud

let corsair = CorsairCloud(apiKey: "ck_cloud_…")

// Call any operation on any plugin your runtime has, as user "acme":
let result = try await corsair.tenant("acme").call("notion", "pages.searchPage", args: [:])

// ...or decode straight into your own type:
struct Page: Decodable { let id: String }
struct SearchResult: Decodable { let results: [Page] }
let typed = try await corsair.tenant("acme")
    .call("notion", "pages.searchPage", as: SearchResult.self)

// Connect a user's account, then check status:
let link = try await corsair.manage.createConnectLink(plugin: "notion", tenantId: "acme")
let status = try await corsair.manage.connectionStatus(tenantId: "acme")
```

Non-2xx responses throw `CorsairError` (`code`, `status`, `message`). Full guide:
[docs.corsair.dev/clients/swift](https://docs.corsair.dev/clients/swift).

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
