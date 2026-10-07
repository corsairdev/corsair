"""Thin HTTP client for a hosted Corsair Cloud project.

Mirrors `corsairCloud` (TS) / `CorsairCloud` (Swift): a dynamic client —
the plugin set lives on the VM, so calls are just `POST .../call/<op>`.
"""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any
from urllib.parse import quote, urlencode, urlsplit

__all__ = [
    "CorsairCloud",
    "CorsairError",
    "InstanceClient",
    "InstanceManage",
    "Manage",
    "TenantClient",
]

_LOOPBACK_HOSTS = {"localhost", "127.0.0.1", "::1"}
_DEFAULT_TIMEOUT = 30.0
_CLOUD_API_HOST = "api.corsair.cloud"
_SLUG_RE = re.compile(r"^[a-z0-9]+$")


def _url_from_key(api_key: str) -> str | None:
    # ck_cloud_<slug>.<secret>: the slug is the segment after the prefix up to
    # the first '.' (the base64url secret never contains '.'), and the client
    # builds its own URL from it — so the key is the only value a developer passes.
    if not api_key.startswith("ck_cloud_"):
        return None
    slug, sep, _secret = api_key[len("ck_cloud_") :].partition(".")
    if not sep or not _SLUG_RE.match(slug):
        return None
    return f"https://{_CLOUD_API_HOST}/{slug}/api/corsair"


def _assert_secure_url(url: str) -> None:
    # The API key is sent as a bearer token, so http:// would leak it in
    # cleartext — allowed only for loopback, matching the other clients.
    parts = urlsplit(url)
    if parts.scheme == "https":
        return
    if parts.scheme == "http" and parts.hostname in _LOOPBACK_HOSTS:
        return
    raise ValueError(
        f'Corsair Cloud URL must use https:// (got "{url}") — '
        "http:// is only allowed for localhost/127.0.0.1."
    )


@dataclass
class CorsairError(Exception):
    status: int
    code: str
    message: str | None = None
    reason: str | None = None
    provider_status: int | None = None

    def __str__(self) -> str:
        return f"{self.code} ({self.status}): {self.message}"


class CorsairCloud:
    def __init__(
        self, api_key: str, url: str | None = None, timeout: float = _DEFAULT_TIMEOUT
    ) -> None:
        if not api_key:
            raise ValueError("CorsairCloud: api_key is required")
        base = url or _url_from_key(api_key)
        if not base:
            raise ValueError(
                "CorsairCloud: could not resolve a URL from api_key — pass a "
                "ck_cloud_<slug>.<secret> key, or set url explicitly."
            )
        _assert_secure_url(base)
        self.api_key = api_key
        self.base_url = base.rstrip("/")
        self.timeout = timeout
        # name -> instance URL, resolved once on first use.
        self._instances: dict[str, str] | None = None

    def with_instance(self, name: str) -> "InstanceClient":
        # Calls run on an instance, not on the project: the project URL serves
        # only tenants and permissions and answers 501 for anything else.
        if not name:
            raise ValueError("with_instance: name must be a non-empty string")
        return InstanceClient(self, name)

    @property
    def manage(self) -> "Manage":
        return Manage(self)

    def _instance_url(self, name: str) -> str:
        if self._instances is None:
            root = self.base_url
            if root.endswith("/api/corsair"):
                root = root[: -len("/api/corsair")]
            found = self._request_to(root, "GET", ["instances"])
            self._instances = {
                i["instanceKey"]: i["url"] for i in found.get("instances", [])
            }
        url = self._instances.get(name)
        if not url:
            available = ", ".join(sorted(self._instances)) or "(none)"
            raise ValueError(
                f'with_instance("{name}"): no such instance — available: {available}'
            )
        _assert_secure_url(url)
        return url.rstrip("/")

    def _request(
        self,
        method: str,
        path: list[str],
        query: dict[str, str] | None = None,
        body: dict[str, Any] | None = None,
    ) -> Any:
        return self._request_to(self.base_url, method, path, query, body)

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
        headers = {"Authorization": f"Bearer {self.api_key}"}
        if data is not None:
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read() or b"{}")
        except urllib.error.HTTPError as e:
            raw = e.read()
            try:
                body_json = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                body_json = {}
            raise CorsairError(
                status=e.code,
                code=body_json.get("error", "http_error"),
                message=body_json.get("message"),
                reason=body_json.get("reason"),
                provider_status=body_json.get("providerStatus"),
            ) from None


class InstanceClient:
    """One instance of a project. Its URL is resolved on first use."""

    def __init__(self, client: CorsairCloud, name: str) -> None:
        self._client = client
        self._name = name

    @property
    def _base(self) -> str:
        return self._client._instance_url(self._name)

    def with_tenant(self, tenant_id: str) -> "TenantClient":
        # Reject an empty tenant up front; otherwise it builds a request path
        # with a missing segment and misroutes.
        if not tenant_id:
            raise ValueError("with_tenant: tenant_id must be a non-empty string")
        return TenantClient(self, tenant_id)

    @property
    def manage(self) -> "InstanceManage":
        return InstanceManage(self)

    def _request(
        self,
        method: str,
        path: list[str],
        query: dict[str, str] | None = None,
        body: dict[str, Any] | None = None,
    ) -> Any:
        return self._client._request_to(self._base, method, path, query, body)


class TenantClient:
    def __init__(self, instance: InstanceClient, tenant_id: str) -> None:
        self._instance = instance
        self._tenant_id = tenant_id

    def call(self, plugin: str, op: str, args: dict[str, Any] | None = None) -> Any:
        result = self._instance._request(
            "POST",
            [quote(self._tenant_id, safe=""), quote(plugin, safe=""), "call", quote(op, safe="")],
            body={"args": args or {}},
        )
        return result["data"]


class InstanceManage:
    """Credential-touching operations. Each instance has its own store, so
    these are scoped to one instance rather than to the project."""

    def __init__(self, instance: InstanceClient) -> None:
        self._instance = instance

    def connection_status(self, tenant_id: str) -> dict[str, str]:
        return self._instance._request(
            "GET", ["connection-status"], query={"tenantId": tenant_id}
        )

    def create_connect_link(
        self, plugin: str, tenant_id: str, redirect_uri: str | None = None
    ) -> dict[str, Any]:
        body: dict[str, Any] = {"plugin": plugin, "tenantId": tenant_id}
        if redirect_uri is not None:
            body["redirectUri"] = redirect_uri
        return self._instance._request("POST", ["connect", "links"], body=body)

    def disconnect(self, plugin: str, tenant_id: str) -> None:
        self._instance._request(
            "POST", ["disconnect"], body={"plugin": plugin, "tenantId": tenant_id}
        )


class Manage:
    """Project-level reads. The project URL serves only these."""

    def __init__(self, client: CorsairCloud) -> None:
        self._client = client

    def tenants(self) -> list[dict[str, Any]]:
        return self._client._request("GET", ["tenants"])

    def create_tenant(self, id: str) -> dict[str, Any]:
        return self._client._request("POST", ["tenants"], body={"id": id})

    def get_permission(self, permission_id: str) -> dict[str, Any]:
        return self._client._request(
            "GET", ["permissions", quote(permission_id, safe="")]
        )
