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

/// A non-2xx answer from Corsair Cloud plus the HTTP status. `code` is the
/// machine code (`not_connected`, `provider_error`, `not_found`, …); `body` is
/// the parsed error body, for fields not named here.
public struct CorsairError: Error, Equatable, Sendable {
	public let status: Int
	public let code: String
	public let message: String?
	public let reason: String?
	public let providerStatus: Int?
	/// Error family on the management API (`invalid_request_error`, …).
	public let type: String?
	/// Safe to send the same request again. Defaults to true for 429 and 5xx.
	public let retryable: Bool
	public let param: String?
	public let docUrl: String?
	/// Quote this when reporting a failure.
	public let requestId: String?
	public let body: JSONValue?

	init(
		status: Int, code: String, message: String? = nil, reason: String? = nil,
		providerStatus: Int? = nil, type: String? = nil, retryable: Bool? = nil,
		param: String? = nil, docUrl: String? = nil, requestId: String? = nil,
		body: JSONValue? = nil
	) {
		self.status = status
		self.code = code
		self.message = message
		self.reason = reason
		self.providerStatus = providerStatus
		self.type = type
		// 429 and 5xx clear on their own; the server can say otherwise.
		self.retryable = retryable ?? (status == 0 || status == 429 || status >= 500)
		self.param = param
		self.docUrl = docUrl
		self.requestId = requestId
		self.body = body
	}

	/// Reads any of the three error bodies Corsair sends: the instance's SDK
	/// routes answer `{error: "<code>", message, …}`, the management API
	/// `{error: {code, type, message, …}}`, and the front of the runtime (a
	/// missing key, an unknown path) `{code, hop, message}`.
	static func from(status: Int, data: Data, requestId: String?) -> CorsairError {
		let body = try? JSONDecoder().decode(JSONValue.self, from: data)
		if case let .object(top)? = body {
			if case let .string(code)? = top["error"] {
				var providerStatus: Int?
				if case let .number(n)? = top["providerStatus"] { providerStatus = Int(n) }
				return CorsairError(
					status: status, code: code, message: top["message"]?.stringValue,
					reason: top["reason"]?.stringValue, providerStatus: providerStatus,
					requestId: requestId, body: body)
			}
			if case let .object(err)? = top["error"], let code = err["code"]?.stringValue {
				var retryable: Bool?
				if case let .bool(b)? = err["retryable"] { retryable = b }
				return CorsairError(
					status: status, code: code, message: err["message"]?.stringValue,
					type: err["type"]?.stringValue, retryable: retryable,
					param: err["param"]?.stringValue, docUrl: err["doc_url"]?.stringValue,
					requestId: err["request_id"]?.stringValue ?? requestId, body: body)
			}
			if let code = top["code"]?.stringValue {
				return CorsairError(
					status: status, code: code, message: top["message"]?.stringValue,
					requestId: requestId, body: body)
			}
		}
		return CorsairError(
			status: status, code: status == 0 ? "request_failed" : "internal_error",
			message: "Corsair Cloud returned \(status) with no error body",
			requestId: requestId, body: body)
	}
}

extension JSONValue {
	fileprivate var stringValue: String? {
		if case let .string(s) = self { return s }
		return nil
	}
}

/// Thrown at call time when a URL isn't https:// (loopback excepted) — the
/// API key is sent as a bearer token, so http:// would leak it in cleartext.
/// Covers the project URL and every instance URL the project lists.
public struct InsecureBaseURLError: Error, Equatable, Sendable {
	public let url: String
}

private let loopbackHosts: Set<String> = ["localhost", "127.0.0.1", "::1", "[::1]"]

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

/// Thrown at call time when an instance key breaks the TS client's rule:
/// lowercase letter first, then letters, digits or hyphens, up to 32
/// characters. The key heads every composite ref, so a colon or an uppercase
/// letter would make one ambiguous.
public struct InvalidInstanceKeyError: Error, Equatable, Sendable {
	public let key: String
}

/// Thrown when the project has no instance with this key. `available` lists
/// the keys it does have.
public struct UnknownInstanceError: Error, Equatable, Sendable {
	public let key: String
	public let available: [String]
}

/// Thrown by `createConnectLink` when `plugin` or `tenantId` is empty.
public struct MissingConnectLinkFieldError: Error, Equatable, Sendable {}

private let cloudSlugChars = Set("abcdefghijklmnopqrstuvwxyz0123456789")
private let instanceKeyHead = Set("abcdefghijklmnopqrstuvwxyz")
private let instanceKeyChars = Set("abcdefghijklmnopqrstuvwxyz0123456789-")
private let runtimeSuffix = "/api/corsair"

private func isValidInstanceKey(_ key: String) -> Bool {
	guard let first = key.first, instanceKeyHead.contains(first), key.count <= 32 else {
		return false
	}
	return key.allSatisfy { instanceKeyChars.contains($0) }
}

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
	return URL(string: "https://api.corsair.cloud/\(slug)\(runtimeSuffix)")
}

private func trimmingTrailingSlashes(_ s: String) -> String {
	var out = Substring(s)
	while out.hasSuffix("/") { out = out.dropLast() }
	return String(out)
}

/// `<project>/api/corsair` and `<project>/instances` are siblings, so the
/// listing lives at the base URL minus its runtime suffix.
private func projectRoot(_ baseURL: URL) -> URL {
	let s = trimmingTrailingSlashes(baseURL.absoluteString)
	let root = s.hasSuffix(runtimeSuffix) ? String(s.dropLast(runtimeSuffix.count)) : s
	return URL(string: root) ?? baseURL
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

struct InstanceEntry: Sendable {
	let key: String
	let url: URL
}

/// The project's instance listing, in the server's order. One per
/// `CorsairCloud`, shared by its copies and every instance handle made from
/// it; concurrent callers share one listing request.
actor InstanceDirectory {
	private var entries: [InstanceEntry]?
	private var inflight: Task<[InstanceEntry], Error>?

	func url(
		for key: String, list: @escaping @Sendable () async throws -> [InstanceEntry]
	) async throws -> URL {
		if let entries, let hit = entries.first(where: { $0.key == key }) { return hit.url }
		// Nothing listed yet, or listed already without this key: list (again)
		// before calling it missing, so an instance created after the first
		// listing is still reachable for the life of this client.
		let fresh = try await load(list)
		if let hit = fresh.first(where: { $0.key == key }) { return hit.url }
		throw UnknownInstanceError(key: key, available: fresh.map(\.key))
	}

	private func load(
		_ list: @escaping @Sendable () async throws -> [InstanceEntry]
	) async throws -> [InstanceEntry] {
		if let inflight { return try await inflight.value }
		// A failed listing is not cached: the next call lists again.
		entries = nil
		let task = Task { try await list() }
		inflight = task
		defer { inflight = nil }
		let listed = try await task.value
		entries = listed
		return listed
	}
}

/// Client for a hosted Corsair Cloud project. Mirrors `corsairCloud` (TS):
/// every call names an instance, `corsair.instance("billing").tenant("acme")`.
/// The key's project URL only lists the instances; calls, connections,
/// tenants and permissions run on each instance's own URL.
public struct CorsairCloud: Sendable {
	let apiKey: String
	let baseURL: URL?
	let session: URLSession
	let directory: InstanceDirectory

	/// The URL is derived from the API key; pass `url` only for dev/testing.
	/// The instance listing is read beside it: `<url minus /api/corsair>/instances`.
	public init(apiKey: String, url: URL? = nil, session: URLSession = .shared) {
		self.apiKey = apiKey.trimmingCharacters(in: .whitespacesAndNewlines)
		let resolved = url ?? urlFromKey(self.apiKey)
		if let resolved {
			// Strip a trailing slash so a console-copied base URL doesn't produce
			// a "//" in the request path, matching the Python/Go/TS clients.
			let s = trimmingTrailingSlashes(resolved.absoluteString)
			baseURL = URL(string: s) ?? resolved
		} else {
			baseURL = nil
		}
		self.session = session
		directory = InstanceDirectory()
	}

	/// One instance of the project, by its key. There is no default instance:
	/// every call names one, so adding a second instance never reroutes
	/// existing code.
	public func instance(_ key: String) -> InstanceClient {
		InstanceClient(client: self, key: key)
	}

	private struct Listing: Decodable {
		struct Item: Decodable {
			let instanceKey: String
			let url: String
		}
		let instances: [Item]
	}

	func listInstances() async throws -> [InstanceEntry] {
		guard let baseURL else { throw UnresolvedURLError() }
		let data = try await send("GET", base: projectRoot(baseURL), path: ["instances"])
		return try JSONDecoder().decode(Listing.self, from: data).instances.map { item in
			guard let url = URL(string: trimmingTrailingSlashes(item.url)) else {
				throw InsecureBaseURLError(url: item.url)
			}
			try assertSecureBaseURL(url)
			return InstanceEntry(key: item.instanceKey, url: url)
		}
	}

	func instanceURL(_ key: String) async throws -> URL {
		guard baseURL != nil else { throw UnresolvedURLError() }
		let client = self
		return try await directory.url(for: key, list: { try await client.listInstances() })
	}

	func send(
		_ method: String,
		base: URL,
		path: [String],
		query: [String: String] = [:],
		body: JSONValue? = nil
	) async throws -> Data {
		try assertSecureBaseURL(base)
		var comps = URLComponents(url: base, resolvingAgainstBaseURL: false)!
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
		let http = response as? HTTPURLResponse
		let status = http?.statusCode ?? 0
		guard (200 ..< 300).contains(status) else {
			let requestId = http?.value(forHTTPHeaderField: "Request-Id")?
				.trimmingCharacters(in: .whitespaces)
			throw CorsairError.from(
				status: status, data: data, requestId: requestId?.isEmpty == false ? requestId : nil)
		}
		return data
	}

	struct Envelope<T: Decodable>: Decodable { let data: T }
}

/// One instance of a project. Its URL is resolved on first use. Each instance
/// has its own tenants and credential store.
public struct InstanceClient: Sendable {
	let client: CorsairCloud
	public let key: String

	/// Calls as one of your users. `accounts` picks which connected account
	/// each plugin uses when the tenant has more than one (plugin id → account
	/// label or id).
	public func tenant(_ id: String, accounts: [String: String] = [:]) -> TenantClient {
		TenantClient(instance: self, tenantId: id, accounts: accounts)
	}

	func send(
		_ method: String,
		path: [String],
		query: [String: String] = [:],
		body: JSONValue? = nil
	) async throws -> Data {
		guard isValidInstanceKey(key) else { throw InvalidInstanceKeyError(key: key) }
		let base = try await client.instanceURL(key)
		return try await client.send(method, base: base, path: path, query: query, body: body)
	}

	public func connectionStatus(tenantId: String) async throws -> [String: String] {
		let data = try await send("GET", path: ["connection-status"], query: ["tenantId": tenantId])
		return try JSONDecoder().decode([String: String].self, from: data)
	}

	/// A link to send the tenant to, so they connect their account for a
	/// plugin. `oauthMode` is `"managed"` (Corsair's OAuth app) or `"byo"`.
	public func createConnectLink(
		plugin: String, tenantId: String, oauthMode: String? = nil, providerName: String? = nil
	) async throws -> ConnectLink {
		guard !plugin.isEmpty, !tenantId.isEmpty else { throw MissingConnectLinkFieldError() }
		var body: [String: JSONValue] = ["plugin": .string(plugin), "tenantId": .string(tenantId)]
		if let oauthMode { body["oauthMode"] = .string(oauthMode) }
		if let providerName { body["providerName"] = .string(providerName) }
		let data = try await send("POST", path: ["connect", "links"], body: .object(body))
		return try JSONDecoder().decode(ConnectLink.self, from: data)
	}

	/// Drops the tenant's stored credentials for a plugin: every account, or
	/// only `account`.
	public func disconnect(plugin: String, tenantId: String, account: String? = nil) async throws {
		var body: [String: JSONValue] = ["plugin": .string(plugin), "tenantId": .string(tenantId)]
		if let account { body["account"] = .string(account) }
		_ = try await send("POST", path: ["disconnect"], body: .object(body))
	}

	public func tenants() async throws -> [Tenant] {
		try JSONDecoder().decode([Tenant].self, from: await send("GET", path: ["tenants"]))
	}

	public func createTenant(id: String) async throws -> Tenant {
		let data = try await send("POST", path: ["tenants"], body: .object(["id": .string(id)]))
		return try JSONDecoder().decode(Tenant.self, from: data)
	}

	/// Fetch a permission record by id. The shape varies by grant, so it comes
	/// back as a `JSONValue` for the caller to read or decode.
	public func permission(id: String) async throws -> JSONValue {
		let data = try await send("GET", path: ["permissions", id])
		return try JSONDecoder().decode(JSONValue.self, from: data)
	}
}

public struct TenantClient: Sendable {
	let instance: InstanceClient
	let tenantId: String
	let accounts: [String: String]

	private func callRaw(
		_ plugin: String, _ op: String, _ args: [String: JSONValue]
	) async throws -> Data {
		guard !tenantId.isEmpty else { throw EmptyTenantIdError() }
		var body: [String: JSONValue] = ["args": .object(args)]
		if let account = accounts[plugin], !account.isEmpty { body["account"] = .string(account) }
		return try await instance.send(
			"POST", path: [tenantId, plugin, "call", op], body: .object(body))
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
