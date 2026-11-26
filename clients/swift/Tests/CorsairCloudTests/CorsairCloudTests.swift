import Foundation
import Testing

@testable import CorsairCloud

// Intercepts URLSession requests so tests assert the exact HTTP the client emits
// and feed back canned responses — no network.
final class MockURLProtocol: URLProtocol {
	nonisolated(unsafe) static var handler: ((URLRequest) throws -> (HTTPURLResponse, Data))?
	nonisolated(unsafe) static var lastBody: Data?

	override class func canInit(with _: URLRequest) -> Bool { true }
	override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

	override func startLoading() {
		// URLSession hands the body to a protocol as a stream, not httpBody — drain it.
		if let stream = request.httpBodyStream {
			stream.open()
			var data = Data()
			let size = 4096
			let buf = UnsafeMutablePointer<UInt8>.allocate(capacity: size)
			defer { buf.deallocate(); stream.close() }
			while stream.hasBytesAvailable {
				let read = stream.read(buf, maxLength: size)
				if read <= 0 { break }
				data.append(buf, count: read)
			}
			Self.lastBody = data
		} else {
			Self.lastBody = request.httpBody
		}
		guard let handler = Self.handler else {
			client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse))
			return
		}
		do {
			let (response, data) = try handler(request)
			client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
			client?.urlProtocol(self, didLoad: data)
			client?.urlProtocolDidFinishLoading(self)
		} catch {
			client?.urlProtocol(self, didFailWithError: error)
		}
	}

	override func stopLoading() {}
}

let projectBase = "https://api.corsair.cloud/envproj/api/corsair"
let listingURL = "https://api.corsair.cloud/envproj/instances"
let billingBase = "https://api.corsair.cloud/envbilling/api/corsair"

/// Answers like production does today: the key's project slug lists the
/// instances and answers every /envproj/api/corsair/... path with the
/// runtime's 404 "no route". Each instance serves the SDK routes on its own
/// URL, answered here by `instance`.
final class FakeCloud: @unchecked Sendable {
	var instances: [(String, String)] = [("billing", billingBase)]
	var listingStatus: Int?
	var listings = 0
	var requests: [(method: String, url: String, body: [String: Any]?)] = []
	var instance: (URLRequest) -> (Int, String, [String: String]) = { _ in (200, #"{"data":{}}"#, [:]) }

	func install() {
		MockURLProtocol.handler = { [self] req in
			let url = req.url!.absoluteString
			let body = MockURLProtocol.lastBody.flatMap {
				try? JSONSerialization.jsonObject(with: $0) as? [String: Any]
			}
			requests.append((req.httpMethod ?? "GET", url, body))
			if url == listingURL {
				listings += 1
				if let listingStatus {
					self.listingStatus = nil
					return Self.response(req, listingStatus, "", [:])
				}
				let items = instances.map { #"{"instanceKey":"\#($0.0)","url":"\#($0.1)"}"# }
				return Self.response(req, 200, #"{"instances":[\#(items.joined(separator: ","))]}"#, [:])
			}
			if url.hasPrefix(projectBase) {
				return Self.response(req, 404, #"{"code":"not_found","hop":"internal","message":"no route"}"#, [:])
			}
			let (status, text, headers) = instance(req)
			return Self.response(req, status, text, headers)
		}
	}

	static func response(_ req: URLRequest, _ status: Int, _ text: String, _ headers: [String: String])
		-> (HTTPURLResponse, Data)
	{
		(
			HTTPURLResponse(url: req.url!, statusCode: status, httpVersion: nil, headerFields: headers)!,
			text.data(using: .utf8)!
		)
	}

	var last: (method: String, url: String, body: [String: Any]?) { requests.last! }
}

// Serialized: the tests share MockURLProtocol's static handler.
@Suite(.serialized)
struct CorsairCloudTests {
	private func session() -> URLSession {
		let config = URLSessionConfiguration.ephemeral
		config.protocolClasses = [MockURLProtocol.self]
		return URLSession(configuration: config)
	}

	private func makeClient(_ fake: FakeCloud, url: URL? = nil) -> CorsairCloud {
		fake.install()
		return CorsairCloud(apiKey: "ck_cloud_envproj.secret123", url: url, session: session())
	}

	// The bug: the project URL answers 404 "no route" for calls, so a call has
	// to land on the instance URL that GET /instances names.
	@Test func callRunsOnTheInstanceURLFromTheListing() async throws {
		let fake = FakeCloud()
		var seenAuth: String?
		fake.instance = { req in
			seenAuth = req.value(forHTTPHeaderField: "Authorization")
			return (200, #"{"data":{"ok":true}}"#, [:])
		}
		let out = try await makeClient(fake)
			.instance("billing")
			.tenant("acme")
			.call("notion", "pages.searchPage", args: ["query": "hi"])

		#expect(fake.requests.map(\.url) == [listingURL, "\(billingBase)/acme/notion/call/pages.searchPage"])
		#expect(fake.last.method == "POST")
		#expect(seenAuth == "Bearer ck_cloud_envproj.secret123")
		#expect((fake.last.body?["args"] as? [String: Any])?["query"] as? String == "hi")
		#expect(out == .object(["ok": .bool(true)]))
	}

	@Test func listingIsFetchedOnceAndShared() async throws {
		let fake = FakeCloud()
		let corsair = makeClient(fake)
		_ = try await corsair.instance("billing").tenant("acme").call("notion", "a")
		let copy = corsair
		_ = try await copy.instance("billing").tenant("beta").call("notion", "b")
		fake.instance = { _ in (200, "[]", [:]) }
		_ = try await corsair.instance("billing").tenants()
		#expect(fake.listings == 1)
		#expect(!fake.requests.contains { $0.url.hasPrefix(projectBase) })
	}

	@Test func runtimeRoutesRunOnTheInstanceURL() async throws {
		let fake = FakeCloud()
		let billing = makeClient(fake).instance("billing")

		fake.instance = { _ in (200, #"{"notion":"connected","slack":"not_connected"}"#, [:]) }
		let status = try await billing.connectionStatus(tenantId: "acme")
		#expect(status["notion"] == "connected")
		#expect(fake.last.url == "\(billingBase)/connection-status?tenantId=acme")

		fake.instance = { _ in (200, #"{"connectUrl":"https://connect.example/x","tenantId":"acme"}"#, [:]) }
		let link = try await billing.createConnectLink(plugin: "notion", tenantId: "acme", oauthMode: "managed")
		#expect(link.connectUrl == "https://connect.example/x")
		#expect(fake.last.url == "\(billingBase)/connect/links")
		#expect(fake.last.body?["oauthMode"] as? String == "managed")
		#expect(fake.last.body?["plugin"] as? String == "notion")

		fake.instance = { _ in (200, "{}", [:]) }
		try await billing.disconnect(plugin: "notion", tenantId: "acme", account: "work")
		#expect(fake.last.url == "\(billingBase)/disconnect")
		#expect(fake.last.body?["account"] as? String == "work")

		fake.instance = { _ in (200, #"[{"id":"acme","connectedPlugins":["notion"]}]"#, [:]) }
		let tenants = try await billing.tenants()
		#expect(tenants.map(\.id) == ["acme"])
		#expect(fake.last.url == "\(billingBase)/tenants")

		fake.instance = { _ in (200, #"{"id":"beta"}"#, [:]) }
		let created = try await billing.createTenant(id: "beta")
		#expect(created.id == "beta")
		#expect(fake.last.method == "POST")
		#expect(fake.last.body?["id"] as? String == "beta")

		fake.instance = { _ in (200, #"{"id":"perm_1"}"#, [:]) }
		_ = try await billing.permission(id: "perm_1")
		#expect(fake.last.url == "\(billingBase)/permissions/perm_1")
	}

	@Test func accountsBindOnePluginToAnAccount() async throws {
		let fake = FakeCloud()
		let tenant = makeClient(fake).instance("billing").tenant("acme", accounts: ["slack": "work"])
		_ = try await tenant.call("slack", "messages.post", args: ["text": "hi"])
		#expect(fake.last.body?["account"] as? String == "work")
		_ = try await tenant.call("notion", "pages.searchPage")
		#expect(fake.last.body?["account"] == nil)
	}

	@Test func anInstanceAddedAfterTheFirstListingIsFound() async throws {
		let fake = FakeCloud()
		let corsair = makeClient(fake)
		_ = try await corsair.instance("billing").tenant("acme").call("notion", "a")
		fake.instances.append(("support", "https://api.corsair.cloud/envsupport/api/corsair"))
		_ = try await corsair.instance("support").tenant("acme").call("notion", "a")
		#expect(fake.listings == 2)
		#expect(fake.last.url == "https://api.corsair.cloud/envsupport/api/corsair/acme/notion/call/a")
	}

	@Test func anUnknownInstanceNamesTheOnesThatExist() async throws {
		let fake = FakeCloud()
		let corsair = makeClient(fake)
		await #expect(throws: UnknownInstanceError(key: "nope", available: ["billing"])) {
			_ = try await corsair.instance("nope").tenant("acme").call("notion", "x")
		}
		// Listed by this call; a fresh listing is not fetched twice.
		#expect(fake.listings == 1)
		// A second miss lists once more before giving up.
		await #expect(throws: UnknownInstanceError.self) {
			_ = try await corsair.instance("nope").tenants()
		}
		#expect(fake.listings == 2)
	}

	@Test func aFailedListingIsNotCached() async throws {
		let fake = FakeCloud()
		fake.listingStatus = 502
		let corsair = makeClient(fake)
		await #expect(throws: CorsairError.self) {
			_ = try await corsair.instance("billing").tenant("acme").call("notion", "x")
		}
		_ = try await corsair.instance("billing").tenant("acme").call("notion", "x")
		#expect(fake.last.url == "\(billingBase)/acme/notion/call/x")
	}

	@Test func anInsecureInstanceURLIsRefused() async throws {
		let fake = FakeCloud()
		fake.instances = [("billing", "http://attacker.example/x/api/corsair")]
		let corsair = makeClient(fake)
		await #expect(throws: InsecureBaseURLError(url: "http://attacker.example/x/api/corsair")) {
			_ = try await corsair.instance("billing").tenant("acme").call("notion", "x")
		}
	}

	@Test(arguments: ["", "Billing", "a:b", "1st", String(repeating: "x", count: 33)])
	func instanceRejectsAnInvalidKey(key: String) async throws {
		let fake = FakeCloud()
		let corsair = makeClient(fake)
		await #expect(throws: InvalidInstanceKeyError(key: key)) {
			_ = try await corsair.instance(key).tenant("acme").call("notion", "x")
		}
		#expect(fake.requests.isEmpty)
	}

	private func error(_ status: Int, _ body: String, _ headers: [String: String] = [:]) async throws
		-> CorsairError
	{
		let fake = FakeCloud()
		fake.instance = { _ in (status, body, headers) }
		do {
			_ = try await makeClient(fake).instance("billing").tenant("acme").call("notion", "x")
		} catch let error as CorsairError {
			return error
		}
		Issue.record("expected a CorsairError")
		return CorsairError(status: -1, code: "")
	}

	@Test func sdkErrorBodyThrowsTypedError() async throws {
		let e = try await error(409, #"{"error":"not_connected","message":"reconnect","reason":"missing","providerStatus":401}"#)
		#expect(e.status == 409)
		#expect(e.code == "not_connected")
		#expect(e.message == "reconnect")
		#expect(e.reason == "missing")
		#expect(e.providerStatus == 401)
		#expect(!e.retryable)
	}

	@Test func managementErrorBodyThrowsTypedError() async throws {
		let e = try await error(
			401,
			#"{"error":{"type":"authentication_error","code":"unauthorized","message":"Invalid or missing project key","retryable":false,"doc_url":"https://docs.corsair.dev/v1/errors#unauthorized","request_id":"req_1"}}"#
		)
		#expect(e.code == "unauthorized")
		#expect(e.type == "authentication_error")
		#expect(e.requestId == "req_1")
		#expect(e.docUrl == "https://docs.corsair.dev/v1/errors#unauthorized")
	}

	@Test func runtimeRefusalBodyThrowsTypedError() async throws {
		// What the old client got for every call: the code is read, not lost.
		let e = try await error(404, #"{"code":"not_found","hop":"internal","message":"no route"}"#)
		#expect(e.status == 404)
		#expect(e.code == "not_found")
		#expect(e.message == "no route")
	}

	@Test func bodylessErrorUsesTheRequestIdHeader() async throws {
		let e = try await error(503, "", ["Request-Id": "req_9"])
		#expect(e.code == "internal_error")
		#expect(e.requestId == "req_9")
		#expect(e.retryable)
	}

	@Test func urlOverrideListsInstancesBesideItsRuntimeSuffix() async throws {
		let fake = FakeCloud()
		let corsair = makeClient(fake, url: URL(string: "\(projectBase)/")!)
		_ = try await corsair.instance("billing").tenant("acme").call("notion", "pages.searchPage")
		#expect(fake.requests.first?.url == listingURL)
		#expect(fake.last.url == "\(billingBase)/acme/notion/call/pages.searchPage")
	}

	@Test func rejectsNonHttpsNonLoopbackBaseURL() async throws {
		let client = CorsairCloud(apiKey: "ck_cloud_x", url: URL(string: "http://attacker.example")!)
		await #expect(throws: InsecureBaseURLError.self) {
			_ = try await client.instance("billing").tenant("acme").call("notion", "pages.searchPage")
		}
	}

	@Test func allowsHttpForLoopbackHost() async throws {
		let fake = FakeCloud()
		fake.install()
		MockURLProtocol.handler = { req in
			let url = req.url!.absoluteString
			let body =
				url == "http://localhost:4000/instances"
				? #"{"instances":[{"instanceKey":"billing","url":"http://localhost:4000/b/api/corsair"}]}"#
				: #"{"data":{}}"#
			return FakeCloud.response(req, 200, body, [:])
		}
		let client = CorsairCloud(
			apiKey: "ck_cloud_x", url: URL(string: "http://localhost:4000/api/corsair")!, session: session())
		_ = try await client.instance("billing").tenant("acme").call("notion", "pages.searchPage")
	}

	@Test func callEscapesReservedCharactersInPathSegments() async throws {
		let fake = FakeCloud()
		_ = try await makeClient(fake).instance("billing").tenant("a/b").call("notion", "pages.searchPage")
		#expect(fake.last.url == "\(billingBase)/a%2Fb/notion/call/pages.searchPage")
	}

	@Test func emptyTenantThrows() async throws {
		let fake = FakeCloud()
		await #expect(throws: EmptyTenantIdError.self) {
			_ = try await makeClient(fake).instance("billing").tenant("").call("notion", "x")
		}
	}

	@Test func derivesURLFromKey() async throws {
		let client = CorsairCloud(apiKey: "ck_cloud_envh.secret123")
		#expect(
			client.baseURL?.absoluteString == "https://api.corsair.cloud/envh/api/corsair")
		// No derivable slug and no url -> unresolved, throws at call time.
		let bad = CorsairCloud(apiKey: "not-a-cloud-key")
		await #expect(throws: UnresolvedURLError.self) {
			_ = try await bad.instance("billing").tenant("acme").call("notion", "op")
		}
	}
}
