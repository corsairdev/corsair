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

// Serialized: the tests share MockURLProtocol's static handler.
@Suite(.serialized)
struct CorsairCloudTests {
	let base = URL(string: "https://vm.corsair.cloud/env/api/corsair")!

	private func makeClient() -> CorsairCloud {
		let config = URLSessionConfiguration.ephemeral
		config.protocolClasses = [MockURLProtocol.self]
		return CorsairCloud(apiKey: "ck_cloud_x", url: base, session: URLSession(configuration: config))
	}

	@Test func callBuildsUrlBearerBodyAndUnwrapsData() async throws {
		var seenURL: URL?
		var seenAuth: String?
		MockURLProtocol.handler = { req in
			seenURL = req.url
			seenAuth = req.value(forHTTPHeaderField: "Authorization")
			let body = #"{"data":{"ok":true}}"#.data(using: .utf8)!
			return (HTTPURLResponse(url: req.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!, body)
		}
		let out = try await makeClient()
			.tenant("acme")
			.call("notion", "pages.searchPage", args: ["query": "hi"])

		#expect(
			seenURL?.absoluteString
				== "https://vm.corsair.cloud/env/api/corsair/acme/notion/call/pages.searchPage")
		#expect(seenAuth == "Bearer ck_cloud_x")
		let sent = try #require(MockURLProtocol.lastBody.flatMap {
			try? JSONSerialization.jsonObject(with: $0) as? [String: Any]
		})
		#expect((sent["args"] as? [String: Any])?["query"] as? String == "hi")
		#expect(out == .object(["ok": .bool(true)]))
	}

	@Test func trailingSlashInBaseUrlDoesNotDoubleSlashPath() async throws {
		var seenURL: URL?
		let config = URLSessionConfiguration.ephemeral
		config.protocolClasses = [MockURLProtocol.self]
		let client = CorsairCloud(
			apiKey: "ck_cloud_x",
			url: URL(string: "https://vm.corsair.cloud/env/api/corsair/")!,
			session: URLSession(configuration: config))
		MockURLProtocol.handler = { req in
			seenURL = req.url
			let body = #"{"data":{}}"#.data(using: .utf8)!
			return (HTTPURLResponse(url: req.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!, body)
		}
		_ = try await client.tenant("acme").call("notion", "pages.searchPage")

		#expect(
			seenURL?.absoluteString
				== "https://vm.corsair.cloud/env/api/corsair/acme/notion/call/pages.searchPage")
	}

	@Test func connectionStatusParsesPluginMap() async throws {
		MockURLProtocol.handler = { req in
			#expect(req.url!.absoluteString.contains("connection-status?tenantId=acme"))
			let body = #"{"notion":"connected","slack":"not_connected"}"#.data(using: .utf8)!
			return (HTTPURLResponse(url: req.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!, body)
		}
		let status = try await makeClient().manage.connectionStatus(tenantId: "acme")
		#expect(status["notion"] == "connected")
		#expect(status["slack"] == "not_connected")
	}

	@Test func rejectsNonHttpsNonLoopbackBaseURL() async throws {
		let insecure = URL(string: "http://attacker.example")!
		let client = CorsairCloud(apiKey: "ck_cloud_x", url: insecure)
		do {
			_ = try await client.tenant("acme").call("notion", "pages.searchPage")
			Issue.record("expected throw")
		} catch is InsecureBaseURLError {
			// expected
		}
	}

	@Test func allowsHttpForLoopbackHost() async throws {
		let loopback = URL(string: "http://localhost:4000")!
		let config = URLSessionConfiguration.ephemeral
		config.protocolClasses = [MockURLProtocol.self]
		let client = CorsairCloud(apiKey: "ck_cloud_x", url: loopback, session: URLSession(configuration: config))
		MockURLProtocol.handler = { req in
			let body = #"{"data":{}}"#.data(using: .utf8)!
			return (HTTPURLResponse(url: req.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!, body)
		}
		_ = try await client.tenant("acme").call("notion", "pages.searchPage")
	}

	@Test func callEscapesReservedCharactersInPathSegments() async throws {
		var seenURL: URL?
		MockURLProtocol.handler = { req in
			seenURL = req.url
			let body = #"{"data":{}}"#.data(using: .utf8)!
			return (HTTPURLResponse(url: req.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!, body)
		}
		_ = try await makeClient().tenant("a/b").call("notion", "pages.searchPage")

		#expect(
			seenURL?.absoluteString
				== "https://vm.corsair.cloud/env/api/corsair/a%2Fb/notion/call/pages.searchPage")
	}

	@Test func errorEnvelopeThrowsTypedError() async throws {
		MockURLProtocol.handler = { req in
			let body = #"{"error":"not_connected","message":"reconnect"}"#.data(using: .utf8)!
			return (HTTPURLResponse(url: req.url!, statusCode: 401, httpVersion: nil, headerFields: nil)!, body)
		}
		do {
			_ = try await makeClient().tenant("acme").call("notion", "pages.searchPage")
			Issue.record("expected throw")
		} catch let error as CorsairError {
			#expect(error.code == "not_connected")
			#expect(error.status == 401)
		}
	}
}
