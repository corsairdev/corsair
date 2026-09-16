# CorsairCloud (Swift)

A thin client for a hosted Corsair Cloud project. Mirrors the TS
`createCorsairCloud`: dynamic calls over HTTP — the plugin set lives on the VM.

## Install

```swift
.package(url: "https://github.com/corsairdev/corsair", branch: "main"),
// target: .product(name: "CorsairCloud", package: "corsair")
```

## Use

Two values from your project's Overview — the key and the URL:

```swift
import CorsairCloud

let corsair = CorsairCloud(
	apiKey: "ck_cloud_…",
	url: URL(string: "https://<vm>.corsair.cloud/<env>/api/corsair")!)

// Tool call (returns the raw result as JSONValue)
let result = try await corsair.tenant("acme").call("notion", "pages.searchPage", args: ["query": "hi"])

// …or decode straight into your own type
struct Page: Decodable { let id: String }
struct SearchResult: Decodable { let results: [Page] }
let typed = try await corsair.tenant("acme")
	.call("notion", "pages.searchPage", as: SearchResult.self)

// Management
let status = try await corsair.manage.connectionStatus(tenantId: "acme")   // ["notion": "connected"]
let link = try await corsair.manage.createConnectLink(plugin: "notion", tenantId: "acme")
try await corsair.manage.disconnect(plugin: "notion", tenantId: "acme")
```

Errors throw `CorsairError` (`.code` is the machine code — `not_connected`,
`provider_error`, …; `.status` is the HTTP status).

## Distribution status

SPM's `.package(url:)` expects `Package.swift` at the repo root of the URL it
fetches. `corsair` is a monorepo with `Package.swift` at `clients/swift`, which
SPM cannot resolve directly — the snippet above (`.package(url: ".../corsair",
branch: "main")`) will fail to fetch until one of these ships:

- a dedicated `corsairdev/corsair-swift` mirror repo (root-level `Package.swift`,
  synced from `clients/swift` on release) — the standard fix for a monorepo
  Swift package, recommended
- a path or local package dependency pointing straight at `clients/swift`, for
  in-repo or vendored use only

No decision has been made yet; `Package.swift` itself needs no change either way.
