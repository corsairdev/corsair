"""Thin HTTP client for a hosted Corsair Cloud project.

Mirrors `createCorsairCloud` (TS) / `CorsairCloud` (Swift): a dynamic client —
the plugin set lives on the VM, so calls are just `POST .../call/<op>`.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any
from urllib.parse import quote, urlencode, urlsplit

__all__ = ["CorsairCloud", "CorsairError", "TenantClient", "Manage"]

_LOOPBACK_HOSTS = {"localhost", "127.0.0.1", "::1"}
_DEFAULT_TIMEOUT = 30.0


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
    def __init__(self, api_key: str, url: str, timeout: float = _DEFAULT_TIMEOUT) -> None:
        _assert_secure_url(url)
        self.api_key = api_key
        self.base_url = url.rstrip("/")
        self.timeout = timeout

    def with_tenant(self, tenant_id: str) -> "TenantClient":
        return TenantClient(self, tenant_id)

    @property
    def manage(self) -> "Manage":
        return Manage(self)

    def _request(
        self,
        method: str,
        path: list[str],
        query: dict[str, str] | None = None,
        body: dict[str, Any] | None = None,
    ) -> Any:
        url = self.base_url + "/" + "/".join(path)
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


class TenantClient:
    def __init__(self, client: CorsairCloud, tenant_id: str) -> None:
        self._client = client
        self._tenant_id = tenant_id

    def call(self, plugin: str, op: str, args: dict[str, Any] | None = None) -> Any:
        result = self._client._request(
            "POST",
            [quote(self._tenant_id, safe=""), quote(plugin, safe=""), "call", quote(op, safe="")],
            body={"args": args or {}},
        )
        return result["data"]


class Manage:
    def __init__(self, client: CorsairCloud) -> None:
        self._client = client

    def connection_status(self, tenant_id: str) -> dict[str, str]:
        return self._client._request(
            "GET", ["connection-status"], query={"tenantId": tenant_id}
        )

    def create_connect_link(
        self, plugin: str, tenant_id: str, redirect_uri: str | None = None
    ) -> dict[str, Any]:
        body: dict[str, Any] = {"plugin": plugin, "tenantId": tenant_id}
        if redirect_uri is not None:
            body["redirectUri"] = redirect_uri
        return self._client._request("POST", ["connect", "links"], body=body)

    def disconnect(self, plugin: str, tenant_id: str) -> None:
        self._client._request(
            "POST", ["disconnect"], body={"plugin": plugin, "tenantId": tenant_id}
        )

    def tenants(self) -> list[dict[str, Any]]:
        return self._client._request("GET", ["tenants"])

    def create_tenant(self, id: str) -> dict[str, Any]:
        return self._client._request("POST", ["tenants"], body={"id": id})
