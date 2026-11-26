import io
import json
import urllib.error
import urllib.request

import pytest

from corsair_cloud import CorsairCloud, CorsairError, UnknownInstanceError, __version__

PROJECT = "https://api.corsair.cloud/envproj/api/corsair"
BILLING = "https://api.corsair.cloud/envbilling/api/corsair"


class FakeResponse:
    def __init__(self, body: bytes) -> None:
        self._body = body

    def read(self) -> bytes:
        return self._body

    def __enter__(self) -> "FakeResponse":
        return self

    def __exit__(self, *a) -> None:
        pass


class FakeCloud:
    """Answers like production does today.

    The key's project slug lists the instances at /<project>/instances and
    answers every /<project>/api/corsair/... path with the runtime's 404
    "no route". Each instance serves the SDK routes on its own URL.
    """

    def __init__(self, instances=None, routes=None) -> None:
        self.instances = instances if instances is not None else {"billing": BILLING}
        # (method, url) -> (status, body, headers); a missing entry is 200 {"data": {}}.
        self.routes = routes or {}
        self.requests: list[dict] = []
        self.listings = 0

    def urlopen(self, req: urllib.request.Request, *a, **kw):
        url = req.full_url
        self.requests.append(
            {
                "url": url,
                "method": req.get_method(),
                "headers": dict(req.header_items()),
                "body": json.loads(req.data) if req.data else None,
                "timeout": kw.get("timeout"),
            }
        )
        if url == "https://api.corsair.cloud/envproj/instances":
            self.listings += 1
            listing = self.instances() if callable(self.instances) else self.instances
            if isinstance(listing, Exception):
                raise listing
            return self._ok(
                {"instances": [{"instanceKey": k, "url": v} for k, v in listing.items()]}
            )
        if url.startswith(PROJECT):
            self._fail(url, 404, {"code": "not_found", "hop": "internal", "message": "no route"})
        status, body, headers = self.routes.get(
            (req.get_method(), url), (200, {"data": {}}, {})
        )
        if status >= 300:
            self._fail(url, status, body, headers)
        return self._ok(body)

    @staticmethod
    def _ok(body) -> FakeResponse:
        return FakeResponse(json.dumps(body).encode())

    @staticmethod
    def _fail(url, status, body, headers=None):
        raw = json.dumps(body).encode() if body is not None else b""
        raise urllib.error.HTTPError(url, status, "err", headers or {}, io.BytesIO(raw))

    def last(self) -> dict:
        return self.requests[-1]


@pytest.fixture
def cloud(monkeypatch) -> FakeCloud:
    fake = FakeCloud()
    monkeypatch.setattr(urllib.request, "urlopen", fake.urlopen)
    return fake


def client() -> CorsairCloud:
    return CorsairCloud(api_key="ck_cloud_envproj.secret123")


# The bug: the project URL answers 404 "no route" for calls, so a call has to
# land on the instance URL that GET /instances names.
def test_call_runs_on_the_instance_url_from_the_listing(cloud):
    cloud.routes[("POST", f"{BILLING}/acme/notion/call/pages.searchPage")] = (
        200,
        {"data": {"results": [1, 2]}},
        {},
    )
    corsair = client()

    result = (
        corsair.with_instance("billing")
        .with_tenant("acme")
        .call("notion", "pages.searchPage", {"query": "hi"})
    )

    assert result == {"results": [1, 2]}
    listing, call = cloud.requests
    assert listing["url"] == "https://api.corsair.cloud/envproj/instances"
    assert listing["method"] == "GET"
    assert call["url"] == f"{BILLING}/acme/notion/call/pages.searchPage"
    assert call["method"] == "POST"
    assert call["headers"]["Authorization"] == "Bearer ck_cloud_envproj.secret123"
    assert call["body"] == {"args": {"query": "hi"}}
    assert call["timeout"] == corsair.timeout
    # urllib title-cases header names.
    assert call["headers"]["User-agent"] == f"corsair-cloud-python/{__version__}"


def test_the_listing_is_fetched_once_and_shared_across_handles(cloud):
    corsair = client()
    corsair.with_instance("billing").with_tenant("acme").call("notion", "a")
    corsair.with_instance("billing").with_tenant("beta").call("notion", "b")
    corsair.with_instance("billing").tenants()
    assert cloud.listings == 1


@pytest.mark.parametrize(
    "run, method, path, body",
    [
        (lambda i: i.connection_status("acme"), "GET", "/connection-status?tenantId=acme", None),
        (
            lambda i: i.create_connect_link("notion", "acme", oauth_mode="managed"),
            "POST",
            "/connect/links",
            {"plugin": "notion", "tenantId": "acme", "oauthMode": "managed"},
        ),
        (
            lambda i: i.disconnect("notion", "acme", account="work"),
            "POST",
            "/disconnect",
            {"plugin": "notion", "tenantId": "acme", "account": "work"},
        ),
        (lambda i: i.tenants(), "GET", "/tenants", None),
        (lambda i: i.create_tenant("acme"), "POST", "/tenants", {"id": "acme"}),
        (lambda i: i.get_permission("perm/1"), "GET", "/permissions/perm%2F1", None),
    ],
)
def test_runtime_routes_run_on_the_instance_url(cloud, run, method, path, body):
    run(client().with_instance("billing"))
    sent = cloud.last()
    assert sent["url"] == BILLING + path
    assert sent["method"] == method
    assert sent["body"] == body


def test_connection_status_parses_plugin_map(cloud):
    cloud.routes[("GET", f"{BILLING}/connection-status?tenantId=acme")] = (
        200,
        {"notion": "connected"},
        {},
    )
    assert client().with_instance("billing").connection_status("acme") == {
        "notion": "connected"
    }


def test_accounts_bind_one_plugin_to_an_account(cloud):
    tenant = client().with_instance("billing").with_tenant("acme", accounts={"slack": "work"})
    tenant.call("slack", "messages.post", {"text": "hi"})
    assert cloud.last()["body"] == {"args": {"text": "hi"}, "account": "work"}
    tenant.call("notion", "pages.searchPage")
    assert cloud.last()["body"] == {"args": {}}


def test_an_instance_added_after_the_first_listing_is_found(cloud):
    listings = [{"billing": BILLING}, {"billing": BILLING, "support": "https://api.corsair.cloud/envsupport/api/corsair"}]
    cloud.instances = lambda: listings[min(cloud.listings - 1, 1)]
    corsair = client()
    corsair.with_instance("billing").tenants()

    corsair.with_instance("support").tenants()

    assert cloud.listings == 2
    assert cloud.last()["url"] == "https://api.corsair.cloud/envsupport/api/corsair/tenants"


def test_an_unknown_instance_names_the_ones_that_exist(cloud):
    corsair = client()
    with pytest.raises(UnknownInstanceError, match="available: billing") as exc_info:
        corsair.with_instance("nope").with_tenant("acme").call("notion", "x")
    assert exc_info.value.available == ["billing"]
    # Listed once by this call; a fresh listing is not fetched twice.
    assert cloud.listings == 1
    # A second miss lists once more before giving up.
    with pytest.raises(UnknownInstanceError):
        corsair.with_instance("nope").tenants()
    assert cloud.listings == 2


def test_a_failed_listing_is_not_cached(cloud):
    outcomes = [urllib.error.URLError("down"), {"billing": BILLING}]
    cloud.instances = lambda: outcomes[cloud.listings - 1]
    corsair = client()
    with pytest.raises(urllib.error.URLError):
        corsair.with_instance("billing").tenants()
    corsair.with_instance("billing").tenants()
    assert cloud.last()["url"] == f"{BILLING}/tenants"


def test_an_insecure_instance_url_is_refused(cloud):
    cloud.instances = {"billing": "http://attacker.example/envbilling/api/corsair"}
    with pytest.raises(ValueError, match='Instance "billing" URL must use https'):
        client().with_instance("billing").tenants()


@pytest.mark.parametrize("key", ["", "Billing", "a:b", "1st", "x" * 33])
def test_with_instance_rejects_an_invalid_key(key):
    with pytest.raises(ValueError, match="not a valid instance key"):
        client().with_instance(key)


def test_the_project_url_is_never_called_for_runtime_routes(cloud):
    corsair = client()
    instance = corsair.with_instance("billing")
    instance.with_tenant("acme").call("notion", "x")
    instance.connection_status("acme")
    instance.tenants()
    assert not [r for r in cloud.requests if r["url"].startswith(PROJECT)]


def test_sdk_error_body_raises_corsair_error(cloud):
    cloud.routes[("POST", f"{BILLING}/acme/notion/call/pages.searchPage")] = (
        409,
        {"error": "not_connected", "message": "no credentials", "reason": "missing", "providerStatus": 401},
        {},
    )
    with pytest.raises(CorsairError) as exc_info:
        client().with_instance("billing").with_tenant("acme").call("notion", "pages.searchPage")
    err = exc_info.value
    assert (err.status, err.code, err.message, err.reason, err.provider_status) == (
        409,
        "not_connected",
        "no credentials",
        "missing",
        401,
    )
    assert err.retryable is False


def test_management_api_error_body_raises_corsair_error(cloud):
    cloud.routes[("GET", f"{BILLING}/tenants")] = (
        401,
        {
            "error": {
                "type": "authentication_error",
                "code": "unauthorized",
                "message": "Invalid or missing project key",
                "retryable": False,
                "doc_url": "https://docs.corsair.dev/v1/errors#unauthorized",
                "request_id": "req_1",
            }
        },
        {},
    )
    with pytest.raises(CorsairError) as exc_info:
        client().with_instance("billing").tenants()
    err = exc_info.value
    assert (err.status, err.code, err.type, err.request_id) == (
        401,
        "unauthorized",
        "authentication_error",
        "req_1",
    )
    assert err.doc_url == "https://docs.corsair.dev/v1/errors#unauthorized"


def test_runtime_refusal_body_raises_corsair_error(cloud):
    # What the old clients got for every call: the code is read, not lost.
    with pytest.raises(CorsairError) as exc_info:
        client()._request_to(PROJECT, "GET", ["tenants"])
    err = exc_info.value
    assert (err.status, err.code, err.message) == (404, "not_found", "no route")


def test_bodyless_error_uses_the_request_id_header(cloud):
    cloud.routes[("GET", f"{BILLING}/tenants")] = (503, None, {"Request-Id": "req_9"})
    with pytest.raises(CorsairError) as exc_info:
        client().with_instance("billing").tenants()
    err = exc_info.value
    assert (err.status, err.code, err.request_id, err.retryable) == (
        503,
        "internal_error",
        "req_9",
        True,
    )


def test_rejects_non_https_url():
    with pytest.raises(ValueError, match="https"):
        CorsairCloud(api_key="ck_cloud_x", url="http://attacker.example")


def test_allows_http_for_loopback():
    corsair = CorsairCloud(api_key="ck_cloud_x", url="http://localhost:4000")
    assert corsair.base_url == "http://localhost:4000"


def test_url_override_lists_instances_beside_its_runtime_suffix(cloud):
    cloud.instances = {"billing": BILLING}
    corsair = CorsairCloud(api_key="ck_cloud_x", url="https://api.corsair.cloud/envproj/api/corsair/")
    corsair.with_instance("billing").tenants()
    assert cloud.requests[0]["url"] == "https://api.corsair.cloud/envproj/instances"


def test_call_encodes_a_slash_containing_tenant(cloud):
    client().with_instance("billing").with_tenant("a/b").call("notion", "pages.searchPage")
    assert cloud.last()["url"] == f"{BILLING}/a%2Fb/notion/call/pages.searchPage"


def test_with_tenant_rejects_empty():
    with pytest.raises(ValueError):
        client().with_instance("billing").with_tenant("")


def test_create_connect_link_needs_plugin_and_tenant():
    with pytest.raises(ValueError):
        client().with_instance("billing").create_connect_link("", "acme")


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
