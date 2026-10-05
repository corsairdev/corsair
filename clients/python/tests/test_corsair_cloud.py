import io
import json
import urllib.error
import urllib.request

import pytest

from corsair_cloud import CorsairCloud, CorsairError


class FakeResponse:
    def __init__(self, body: bytes) -> None:
        self._body = body

    def read(self) -> bytes:
        return self._body

    def __enter__(self) -> "FakeResponse":
        return self

    def __exit__(self, *a) -> None:
        pass


def fake_urlopen(captured: dict, response_body: dict):
    def _urlopen(req: urllib.request.Request, *a, **kw):
        captured["url"] = req.full_url
        captured["method"] = req.get_method()
        captured["headers"] = req.headers
        captured["body"] = json.loads(req.data) if req.data else None
        captured["timeout"] = kw.get("timeout")
        return FakeResponse(json.dumps(response_body).encode())

    return _urlopen


def fake_urlopen_error(status: int, body: dict):
    def _urlopen(req, *a, **kw):
        raise urllib.error.HTTPError(
            req.full_url, status, "err", {}, io.BytesIO(json.dumps(body).encode())
        )

    return _urlopen


def fake_urlopen_routing(captured: dict, instances: dict, response_body: dict):
    """Answers GET /instances from `instances`, everything else from
    `response_body`. The client resolves an instance before it can call."""

    def _urlopen(req: urllib.request.Request, *a, **kw):
        if req.full_url.endswith("/instances"):
            captured.setdefault("resolved", []).append(req.full_url)
            body = {
                "instances": [
                    {"instanceKey": k, "url": v} for k, v in instances.items()
                ]
            }
            return FakeResponse(json.dumps(body).encode())
        captured["url"] = req.full_url
        captured["method"] = req.get_method()
        captured["headers"] = req.headers
        captured["body"] = json.loads(req.data) if req.data else None
        captured["timeout"] = kw.get("timeout")
        return FakeResponse(json.dumps(response_body).encode())

    return _urlopen


def test_call_builds_url_bearer_body_and_returns_data(monkeypatch):
    captured: dict = {}
    monkeypatch.setattr(
        urllib.request,
        "urlopen",
        fake_urlopen_routing(captured, {"users": "https://vm.corsair.cloud/envusers/api/corsair"}, {"data": {"results": [1, 2]}}),
    )

    corsair = CorsairCloud(api_key="ck_cloud_x", url="https://vm.corsair.cloud/env/api/corsair")
    result = (
        corsair.with_instance("users")
        .with_tenant("acme")
        .call("notion", "pages.searchPage", {"query": "hi"})
    )

    assert result == {"results": [1, 2]}
    # The project URL serves only tenants/permissions, so the call has to land
    # on the instance's own URL.
    assert captured["resolved"] == ["https://vm.corsair.cloud/env/instances"]
    assert captured["url"] == (
        "https://vm.corsair.cloud/envusers/api/corsair/acme/notion/call/pages.searchPage"
    )
    assert captured["method"] == "POST"
    assert captured["headers"]["Authorization"] == "Bearer ck_cloud_x"
    assert captured["body"] == {"args": {"query": "hi"}}
    assert captured["timeout"] == corsair.timeout


def test_connection_status_parses_plugin_map(monkeypatch):
    captured: dict = {}
    monkeypatch.setattr(
        urllib.request,
        "urlopen",
        fake_urlopen_routing(captured, {"users": "https://vm.corsair.cloud/envusers/api/corsair"}, {"notion": "connected"}),
    )

    corsair = CorsairCloud(api_key="ck_cloud_x", url="https://vm.corsair.cloud/env/api/corsair")
    status = corsair.with_instance("users").manage.connection_status("acme")

    assert status == {"notion": "connected"}
    assert captured["url"] == (
        "https://vm.corsair.cloud/envusers/api/corsair/connection-status?tenantId=acme"
    )
    assert captured["method"] == "GET"


def test_non_2xx_error_body_raises_corsair_error(monkeypatch):
    monkeypatch.setattr(
        urllib.request,
        "urlopen",
        fake_urlopen_error(
            409,
            {"error": "not_connected", "message": "no credentials", "reason": "missing"},
        ),
    )

    corsair = CorsairCloud(api_key="ck_cloud_x", url="https://vm.corsair.cloud/env/api/corsair")
    corsair._instances = {"users": "https://vm.corsair.cloud/envusers/api/corsair"}

    with pytest.raises(CorsairError) as exc_info:
        corsair.with_instance("users").with_tenant("acme").call(
            "notion", "pages.searchPage"
        )

    err = exc_info.value
    assert err.status == 409
    assert err.code == "not_connected"
    assert err.message == "no credentials"
    assert err.reason == "missing"


def test_rejects_non_https_url():
    with pytest.raises(ValueError, match="https"):
        CorsairCloud(api_key="ck_cloud_x", url="http://attacker.example")


def test_allows_http_for_loopback():
    corsair = CorsairCloud(api_key="ck_cloud_x", url="http://localhost:4000")
    assert corsair.base_url == "http://localhost:4000"


def test_call_encodes_a_slash_containing_tenant(monkeypatch):
    captured: dict = {}
    monkeypatch.setattr(
        urllib.request,
        "urlopen",
        fake_urlopen_routing(captured, {"users": "https://vm.corsair.cloud/envusers/api/corsair"}, {"data": {}}),
    )

    corsair = CorsairCloud(api_key="ck_cloud_x", url="https://vm.corsair.cloud/env/api/corsair")
    corsair.with_instance("users").with_tenant("a/b").call("notion", "pages.searchPage")

    assert captured["url"] == (
        "https://vm.corsair.cloud/envusers/api/corsair/a%2Fb/notion/call/pages.searchPage"
    )


def test_with_tenant_rejects_empty():
    corsair = CorsairCloud(api_key="ck_cloud_envh.secret123")
    with pytest.raises(ValueError):
        corsair.with_instance("users").with_tenant("")


def test_with_instance_rejects_empty():
    corsair = CorsairCloud(api_key="ck_cloud_envh.secret123")
    with pytest.raises(ValueError):
        corsair.with_instance("")


# Naming an instance that does not exist must say which ones do, rather than
# sending the call somewhere that answers 501.
def test_unknown_instance_lists_the_available_ones():
    corsair = CorsairCloud(api_key="ck_cloud_envh.secret123")
    corsair._instances = {"users": "https://vm/envusers/api/corsair"}
    with pytest.raises(ValueError, match="available: users"):
        corsair.with_instance("nope").with_tenant("acme").call("notion", "x")


def test_derives_url_from_key():
    from corsair_cloud import _url_from_key

    corsair = CorsairCloud(api_key="ck_cloud_envh.secret123")
    assert corsair.base_url == "https://api.corsair.cloud/envh/api/corsair"
    assert _url_from_key("ck_cloud_envh.secret123") == "https://api.corsair.cloud/envh/api/corsair"
    # An older slug-less key (base64url secret, no '.') resolves to None rather
    # than a wrong URL — the '.' delimiter is what makes this unambiguous.
    assert _url_from_key("ck_cloud_abc_def123") is None
    # A key with no derivable slug and no url raises.
    with pytest.raises(ValueError):
        CorsairCloud(api_key="not-a-cloud-key")
