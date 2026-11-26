"""Thin HTTP client for a hosted Corsair Cloud project.

Mirrors `corsairCloud` (TS): every call names an instance of the project,
`corsair.with_instance("billing").with_tenant("acme").call(...)`. The key's
project URL only lists the instances; calls, connections, tenants and
permissions run on each instance's own URL, which comes from that listing.
The plugin set lives on the instance, so calls are just `POST .../call/<op>`.
"""

from __future__ import annotations

import json
import re
import threading
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any
from urllib.parse import quote, urlencode, urlsplit

__all__ = [
    "CorsairCloud",
    "CorsairError",
    "InstanceClient",
    "TenantClient",
    "UnknownInstanceError",
    "__version__",
]

__version__ = "0.1.0"

# The edge in front of api.corsair.cloud answers urllib's default
# "Python-urllib/x.y" with a bodyless 403 before the request reaches the
# runtime, so the client names itself.
_USER_AGENT = f"corsair-cloud-python/{__version__}"
_LOOPBACK_HOSTS = {"localhost", "127.0.0.1", "::1"}
_DEFAULT_TIMEOUT = 30.0
_CLOUD_API_HOST = "api.corsair.cloud"
_SLUG_RE = re.compile(r"^[a-z0-9]+$")
# The TS client's instance-key rule: the key heads every composite ref, so a
# colon or an uppercase letter would make one ambiguous.
_INSTANCE_KEY_RE = re.compile(r"^[a-z][a-z0-9-]{0,31}$")
_RUNTIME_SUFFIX = "/api/corsair"


def _url_from_key(api_key: str) -> str | None:
    # ck_cloud_<slug>.<secret>: the slug is the segment after the prefix up to
    # the first '.' (the base64url secret never contains '.'), and the client
    # builds its own URL from it — so the key is the only value a developer passes.
    if not api_key.startswith("ck_cloud_"):
        return None
    slug, sep, _secret = api_key[len("ck_cloud_") :].partition(".")
    if not sep or not _SLUG_RE.match(slug):
        return None
    return f"https://{_CLOUD_API_HOST}/{slug}{_RUNTIME_SUFFIX}"


def _project_root(base_url: str) -> str:
    # `<project>/api/corsair` and `<project>/instances` are siblings, so the
    # listing lives at the base URL minus its runtime suffix.
    trimmed = base_url.rstrip("/")
    if trimmed.endswith(_RUNTIME_SUFFIX):
        return trimmed[: -len(_RUNTIME_SUFFIX)]
    return trimmed


def _assert_secure_url(url: str, label: str = "Corsair Cloud URL") -> None:
    # The API key is sent as a bearer token, so http:// would leak it in
    # cleartext — allowed only for loopback, matching the other clients.
    parts = urlsplit(url)
    if parts.scheme == "https":
        return
    if parts.scheme == "http" and parts.hostname in _LOOPBACK_HOSTS:
        return
    raise ValueError(
        f'{label} must use https:// (got "{url}") — '
        "http:// is only allowed for localhost/127.0.0.1."
    )


def _assert_instance_key(key: str) -> None:
    if not isinstance(key, str) or not _INSTANCE_KEY_RE.match(key):
        raise ValueError(
            f'with_instance: "{key}" is not a valid instance key. Lowercase '
            "letter first, then letters, digits or hyphens, up to 32 characters."
        )


@dataclass
class CorsairError(Exception):
    """A non-2xx answer from Corsair Cloud.

    Branch on `code` (`not_connected`, `provider_error`, `not_found`, ...).
    `body` is the parsed error body, for fields not named here.
    """

    status: int
    code: str
    message: str | None = None
    reason: str | None = None
    provider_status: int | None = None
    # Error family on the management API: invalid_request_error, conflict, ...
    type: str | None = None
    # Safe to send the same request again. Defaults to true for 429 and 5xx.
    retryable: bool = False
    param: str | None = None
    doc_url: str | None = None
    # Quote this when reporting a failure.
    request_id: str | None = None
    body: Any = field(default=None, repr=False)

    def __str__(self) -> str:
        return f"{self.code} ({self.status}): {self.message}"


class UnknownInstanceError(ValueError):
    """The project has no instance with this key."""

    def __init__(self, key: str, available: list[str]) -> None:
        self.key = key
        self.available = available
        names = ", ".join(available) or "(none)"
        super().__init__(
            f'CorsairCloud.with_instance("{key}"): no such instance — available: {names}'
        )


def _str_or_none(value: Any) -> str | None:
    return value if isinstance(value, str) else None


def _error_from(status: int, raw: bytes, request_id: str | None) -> CorsairError:
    """Builds a CorsairError from any of the three error bodies Corsair sends.

    The instance's SDK routes answer `{error: "<code>", message, ...}`, the
    management API `{error: {code, type, message, ...}}`, and the front of the
    runtime (a missing key, an unknown path) `{code, hop, message}`.
    """
    try:
        body = json.loads(raw) if raw else None
    except (json.JSONDecodeError, UnicodeDecodeError):
        body = None
    # 429 and 5xx clear on their own; the server can say otherwise.
    retryable = status == 0 or status == 429 or status >= 500
    if isinstance(body, dict):
        err = body.get("error")
        if isinstance(err, str):
            provider_status = body.get("providerStatus")
            return CorsairError(
                status=status,
                code=err,
                message=_str_or_none(body.get("message")),
                reason=_str_or_none(body.get("reason")),
                provider_status=provider_status if isinstance(provider_status, int) else None,
                retryable=retryable,
                request_id=request_id,
                body=body,
            )
        if isinstance(err, dict) and isinstance(err.get("code"), str):
            explicit = err.get("retryable")
            return CorsairError(
                status=status,
                code=err["code"],
                message=_str_or_none(err.get("message")),
                type=_str_or_none(err.get("type")),
                retryable=explicit if isinstance(explicit, bool) else retryable,
                param=_str_or_none(err.get("param")),
                doc_url=_str_or_none(err.get("doc_url")),
                request_id=_str_or_none(err.get("request_id")) or request_id,
                body=body,
            )
        if isinstance(body.get("code"), str):
            return CorsairError(
                status=status,
                code=body["code"],
                message=_str_or_none(body.get("message")),
                retryable=retryable,
                request_id=request_id,
                body=body,
            )
    return CorsairError(
        status=status,
        code="request_failed" if status == 0 else "internal_error",
        message=f"Corsair Cloud returned {status} with no error body",
        retryable=retryable,
        request_id=request_id,
        body=body,
    )


class CorsairCloud:
    def __init__(
        self, api_key: str, url: str | None = None, timeout: float = _DEFAULT_TIMEOUT
    ) -> None:
        key = (api_key or "").strip()
        if not key:
            raise ValueError("CorsairCloud: api_key is required")
        base = (url or "").strip() or _url_from_key(key)
        if not base:
            raise ValueError(
                "CorsairCloud: could not resolve a URL from api_key — pass a "
                "ck_cloud_<slug>.<secret> key, or set url explicitly."
            )
        _assert_secure_url(base)
        self.api_key = key
        # The project's runtime base. It only lists the instances; nothing else
        # is served under it.
        self.base_url = base.rstrip("/")
        self.timeout = timeout
        # instance key -> URL, in the order the server listed them. Shared by
        # every with_instance() handle, and held under the lock while it
        # resolves so concurrent callers make one request between them.
        self._instances: dict[str, str] | None = None
        self._instances_lock = threading.Lock()

    def with_instance(self, instance_key: str) -> "InstanceClient":
        """One instance of the project, by its key.

        There is no default instance: every call names one, so adding a second
        instance never reroutes existing code.
        """
        _assert_instance_key(instance_key)
        return InstanceClient(self, instance_key)

    def _list_instances(self) -> dict[str, str]:
        found = self._request_to(_project_root(self.base_url), "GET", ["instances"])
        instances: dict[str, str] = {}
        for item in (found or {}).get("instances") or []:
            key, url = item.get("instanceKey"), item.get("url")
            if not isinstance(key, str) or not isinstance(url, str):
                continue
            _assert_secure_url(url, f'Instance "{key}" URL')
            instances[key] = url.rstrip("/")
        return instances

    def _instance_url(self, key: str) -> str:
        with self._instances_lock:
            fresh = self._instances is None
            if fresh:
                self._instances = self._list_instances()
            url = self._instances.get(key)
            if url is None and not fresh:
                # Listed once already and the key is missing: list again before
                # calling it missing, so an instance created after the first
                # listing is still reachable for the life of this client.
                self._instances = None
                self._instances = self._list_instances()
                url = self._instances.get(key)
            if url is None:
                raise UnknownInstanceError(key, list(self._instances))
            return url

    def _request_to(
        self,
        base: str,
        method: str,
        path: list[str],
        query: dict[str, str] | None = None,
        body: dict[str, Any] | None = None,
    ) -> Any:
        url = base + "/" + "/".join(path)
        if query:
            url += "?" + urlencode(query)
        data = json.dumps(body).encode() if body is not None else None
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "User-Agent": _USER_AGENT,
        }
        if data is not None:
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read() or b"{}")
        except urllib.error.HTTPError as e:
            # Request-Id from hub; the runtime's own refusals carry only
            # x-corsair-trace-id.
            headers = e.headers or {}
            request_id = (
                (headers.get("Request-Id") or "").strip()
                or (headers.get("X-Corsair-Trace-Id") or "").strip()
            )
            raise _error_from(e.code, e.read(), request_id or None) from None


class InstanceClient:
    """One instance of a project. Its URL is resolved on first use.

    Each instance has its own tenants and credential store, so everything
    except the instance listing is scoped to one.
    """

    def __init__(self, client: CorsairCloud, instance_key: str) -> None:
        self._client = client
        self.instance_key = instance_key

    def with_tenant(
        self, tenant_id: str, accounts: dict[str, str] | None = None
    ) -> "TenantClient":
        """Calls as one of your users.

        `accounts` picks which connected account each plugin uses when the
        tenant has more than one (plugin id -> account label or id).
        """
        # Reject an empty tenant up front (matches the TS client's withTenant);
        # otherwise it builds a request path with a missing segment and misroutes.
        if not tenant_id:
            raise ValueError("with_tenant: tenant_id must be a non-empty string")
        return TenantClient(self, tenant_id, dict(accounts or {}))

    def connection_status(self, tenant_id: str) -> dict[str, str]:
        return self._request("GET", ["connection-status"], query={"tenantId": tenant_id})

    def create_connect_link(
        self,
        plugin: str,
        tenant_id: str,
        oauth_mode: str | None = None,
        provider_name: str | None = None,
    ) -> dict[str, Any]:
        """A link to send the tenant to, so they connect their account.

        `oauth_mode` is "managed" (Corsair's OAuth app) or "byo" (your own).
        """
        if not plugin or not tenant_id:
            raise ValueError("create_connect_link requires both plugin and tenant_id")
        body: dict[str, Any] = {"plugin": plugin, "tenantId": tenant_id}
        if oauth_mode is not None:
            body["oauthMode"] = oauth_mode
        if provider_name is not None:
            body["providerName"] = provider_name
        return self._request("POST", ["connect", "links"], body=body)

    def disconnect(self, plugin: str, tenant_id: str, account: str | None = None) -> None:
        """Drops the tenant's stored credentials for a plugin (one account, or all)."""
        body: dict[str, Any] = {"plugin": plugin, "tenantId": tenant_id}
        if account is not None:
            body["account"] = account
        self._request("POST", ["disconnect"], body=body)

    def tenants(self) -> list[dict[str, Any]]:
        return self._request("GET", ["tenants"])

    def create_tenant(self, id: str) -> dict[str, Any]:
        return self._request("POST", ["tenants"], body={"id": id})

    def get_permission(self, permission_id: str) -> dict[str, Any]:
        return self._request("GET", ["permissions", quote(permission_id, safe="")])

    def _request(
        self,
        method: str,
        path: list[str],
        query: dict[str, str] | None = None,
        body: dict[str, Any] | None = None,
    ) -> Any:
        base = self._client._instance_url(self.instance_key)
        return self._client._request_to(base, method, path, query, body)


class TenantClient:
    def __init__(
        self, instance: InstanceClient, tenant_id: str, accounts: dict[str, str]
    ) -> None:
        self._instance = instance
        self._tenant_id = tenant_id
        self._accounts = accounts

    def call(self, plugin: str, op: str, args: dict[str, Any] | None = None) -> Any:
        body: dict[str, Any] = {"args": args or {}}
        account = self._accounts.get(plugin)
        if account:
            body["account"] = account
        result = self._instance._request(
            "POST",
            [quote(self._tenant_id, safe=""), quote(plugin, safe=""), "call", quote(op, safe="")],
            body=body,
        )
        return result["data"]
