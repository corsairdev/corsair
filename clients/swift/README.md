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
