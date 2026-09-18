import Foundation

#if canImport(FoundationNetworking)
	import FoundationNetworking
#endif

/// A JSON value with no external dependency — carries op args in and results out.
public enum JSONValue: Codable, Sendable, Equatable {
	case string(String)
	case number(Double)
	case bool(Bool)
	case object([String: JSONValue])
	case array([JSONValue])
	case null

	public init(from decoder: Decoder) throws {
		let c = try decoder.singleValueContainer()
		if c.decodeNil() { self = .null; return }
		if let b = try? c.decode(Bool.self) { self = .bool(b); return }
		if let n = try? c.decode(Double.self) { self = .number(n); return }
		if let s = try? c.decode(String.self) { self = .string(s); return }
		if let o = try? c.decode([String: JSONValue].self) { self = .object(o); return }
		if let a = try? c.decode([JSONValue].self) { self = .array(a); return }
		throw DecodingError.dataCorruptedError(in: c, debugDescription: "unrecognized JSON value")
	}

	public func encode(to encoder: Encoder) throws {
		var c = encoder.singleValueContainer()
		switch self {
		case let .string(v): try c.encode(v)
		case let .number(v): try c.encode(v)
		case let .bool(v): try c.encode(v)
		case let .object(v): try c.encode(v)
		case let .array(v): try c.encode(v)
		case .null: try c.encodeNil()
		}
	}

	/// Re-decode this value into a concrete type (the typed `call` convenience).
	public func decoded<T: Decodable>(as type: T.Type) throws -> T {
		try JSONDecoder().decode(T.self, from: JSONEncoder().encode(self))
	}
}

extension JSONValue: ExpressibleByStringLiteral, ExpressibleByBooleanLiteral,
	ExpressibleByIntegerLiteral, ExpressibleByFloatLiteral
{
	public init(stringLiteral value: String) { self = .string(value) }
	public init(booleanLiteral value: Bool) { self = .bool(value) }
	public init(integerLiteral value: Int) { self = .number(Double(value)) }
	public init(floatLiteral value: Double) { self = .number(value) }
}

/// The runtime's error envelope (`{ error, message, reason?, providerStatus? }`)
/// plus the HTTP status. `code` is the machine code (`not_connected`, …).
public struct CorsairError: Error, Equatable, Sendable {
	public let status: Int
	public let code: String
	public let message: String?
	public let reason: String?
	public let providerStatus: Int?
}

/// Thrown at call time when `baseURL` isn't https:// (loopback excepted) — the
/// API key is sent as a bearer token, so http:// would leak it in cleartext.
public struct InsecureBaseURLError: Error, Equatable, Sendable {
	public let url: String
}

private let loopbackHosts: Set<String> = ["localhost", "127.0.0.1", "::1"]

private func assertSecureBaseURL(_ url: URL) throws {
	if url.scheme == "https" { return }
	if url.scheme == "http", let host = url.host, loopbackHosts.contains(host) { return }
	throw InsecureBaseURLError(url: url.absoluteString)
}

/// Thrown at call time when no URL was given and none could be derived from the
/// key — pass a `ck_cloud_<slug>.<secret>` key, or set `url` explicitly.
public struct UnresolvedURLError: Error, Equatable, Sendable {}

/// Thrown by a tenant call when the tenant id is empty — it would build a
/// request path with a missing segment and misroute (matches the TS client).
public struct EmptyTenantIdError: Error, Equatable, Sendable {}

private let cloudSlugChars = Set("abcdefghijklmnopqrstuvwxyz0123456789")

/// Derives the runtime URL from a ck_cloud_<slug>.<secret> key: the slug is the
/// segment after the prefix up to the first '.' (the base64url secret never
/// contains '.'), so the key is the only value you pass.
private func urlFromKey(_ apiKey: String) -> URL? {
	let prefix = "ck_cloud_"
	guard apiKey.hasPrefix(prefix) else { return nil }
	let rest = apiKey.dropFirst(prefix.count)
	guard let sep = rest.firstIndex(of: ".") else { return nil }
	let slug = rest[..<sep]
	guard !slug.isEmpty, slug.allSatisfy({ cloudSlugChars.contains($0) }) else { return nil }
	return URL(string: "https://api.corsair.cloud/\(slug)/api/corsair")
}

private func encodedPathSegment(_ segment: String) -> String {
	segment.addingPercentEncoding(withAllowedCharacters: .urlPathSegmentAllowed) ?? segment
}

extension CharacterSet {
	// Also escape "%" so a literal segment like "a%2Fb" encodes to "a%252Fb"
	// rather than staying "a%2Fb" and decoding to "a/b" on the server — matching
	// Go's url.PathEscape and Python's quote(safe="").
	fileprivate static let urlPathSegmentAllowed = CharacterSet.urlPathAllowed.subtracting(CharacterSet(charactersIn: "/%"))
}

public struct ConnectLink: Codable, Sendable {
	public let connectUrl: String?
	public let expiresAt: String?
	public let tenantId: String?
}

public struct Tenant: Codable, Sendable {
	public let id: String
	public let connectedPlugins: [String]?
}

/// Client for a hosted Corsair Cloud project. Mirrors `corsairCloud`: a
/// dynamic HTTP client — the plugin set lives on the VM.
public struct CorsairCloud: Sendable {
	let apiKey: String
	let baseURL: URL?
	let session: URLSession

	/// The URL is derived from the API key; pass `url` only for dev/testing.
	public init(apiKey: String, url: URL? = nil, session: URLSession = .shared) {
		self.apiKey = apiKey
		let resolved = url ?? urlFromKey(apiKey)
		if let resolved {
			// Strip a trailing slash so a console-copied base URL doesn't produce
			// a "//" in the request path, matching the Python/Go/TS clients.
			let s = resolved.absoluteString
			baseURL = URL(string: s.hasSuffix("/") ? String(s.dropLast()) : s) ?? resolved
		} else {
			baseURL = nil
		}
		self.session = session
	}

	public func tenant(_ id: String) -> TenantClient {
		TenantClient(client: self, tenantId: id)
	}

	public var manage: Manage { Manage(client: self) }

	func send(
		_ method: String,
		path: [String],
		query: [String: String] = [:],
		body: JSONValue? = nil
	) async throws -> Data {
		guard let baseURL else { throw UnresolvedURLError() }
		try assertSecureBaseURL(baseURL)
		var comps = URLComponents(url: baseURL, resolvingAgainstBaseURL: false)!
		comps.percentEncodedPath += "/" + path.map(encodedPathSegment).joined(separator: "/")
		if !query.isEmpty {
			comps.queryItems = query.map { URLQueryItem(name: $0.key, value: $0.value) }
		}
		var req = URLRequest(url: comps.url!)
		req.httpMethod = method
		req.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
		if let body {
			req.setValue("application/json", forHTTPHeaderField: "Content-Type")
			req.httpBody = try JSONEncoder().encode(body)
		}
		let (data, response) = try await session.data(for: req)
		let status = (response as? HTTPURLResponse)?.statusCode ?? 0
		guard (200 ..< 300).contains(status) else {
			if let e = try? JSONDecoder().decode(ErrorBody.self, from: data) {
				throw CorsairError(
					status: status, code: e.error, message: e.message,
					reason: e.reason, providerStatus: e.providerStatus)
			}
			throw CorsairError(
				status: status, code: "http_error", message: nil, reason: nil, providerStatus: nil)
		}
		return data
	}

	private struct ErrorBody: Decodable {
		let error: String
		let message: String?
		let reason: String?
		let providerStatus: Int?
	}

	struct Envelope<T: Decodable>: Decodable { let data: T }
}

public struct TenantClient: Sendable {
	let client: CorsairCloud
	let tenantId: String

	private func callRaw(
		_ plugin: String, _ op: String, _ args: [String: JSONValue]
	) async throws -> Data {
		guard !tenantId.isEmpty else { throw EmptyTenantIdError() }
		return try await client.send(
			"POST", path: [tenantId, plugin, "call", op], body: .object(["args": .object(args)]))
	}

	/// Invoke a plugin op, returning the raw result (`.data`) as a `JSONValue`.
	public func call(
		_ plugin: String, _ op: String, args: [String: JSONValue] = [:]
	) async throws -> JSONValue {
		let data = try await callRaw(plugin, op, args)
		return try JSONDecoder().decode(CorsairCloud.Envelope<JSONValue>.self, from: data).data
	}

	/// Invoke a plugin op, decoding `.data` into a concrete type.
	public func call<T: Decodable>(
		_ plugin: String, _ op: String, args: [String: JSONValue] = [:], as _: T.Type
	) async throws -> T {
		let data = try await callRaw(plugin, op, args)
		return try JSONDecoder().decode(CorsairCloud.Envelope<T>.self, from: data).data
	}
}

public struct Manage: Sendable {
	let client: CorsairCloud

	public func connectionStatus(tenantId: String) async throws -> [String: String] {
		let data = try await client.send(
			"GET", path: ["connection-status"], query: ["tenantId": tenantId])
		return try JSONDecoder().decode([String: String].self, from: data)
	}

	public func createConnectLink(
		plugin: String, tenantId: String, redirectUri: String? = nil
	) async throws -> ConnectLink {
		var body: [String: JSONValue] = ["plugin": .string(plugin), "tenantId": .string(tenantId)]
		if let redirectUri { body["redirectUri"] = .string(redirectUri) }
		let data = try await client.send("POST", path: ["connect", "links"], body: .object(body))
		return try JSONDecoder().decode(ConnectLink.self, from: data)
	}

	public func disconnect(plugin: String, tenantId: String) async throws {
		_ = try await client.send(
			"POST", path: ["disconnect"],
			body: .object(["plugin": .string(plugin), "tenantId": .string(tenantId)]))
	}

	public func tenants() async throws -> [Tenant] {
		try JSONDecoder().decode([Tenant].self, from: await client.send("GET", path: ["tenants"]))
	}

	public func createTenant(id: String) async throws -> Tenant {
		let data = try await client.send(
			"POST", path: ["tenants"], body: .object(["id": .string(id)]))
		return try JSONDecoder().decode(Tenant.self, from: data)
	}
}
