package corsaircloud

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func newTestServer(t *testing.T, handler http.HandlerFunc) (*Client, func()) {
	t.Helper()
	srv := httptest.NewServer(handler)
	c := New("ck_cloud_test", WithURL(srv.URL))
	return c, srv.Close
}

func TestCallBuildsRequestAndReturnsData(t *testing.T) {
	var gotMethod, gotPath, gotAuth string
	var gotBody map[string]any

	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		gotMethod = r.Method
		gotPath = r.URL.Path
		gotAuth = r.Header.Get("Authorization")
		body, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(body, &gotBody)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{"results":["a","b"]}}`))
	})
	defer close()

	raw, err := c.Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", map[string]any{"q": "hi"})
	if err != nil {
		t.Fatalf("Call returned error: %v", err)
	}

	if gotMethod != http.MethodPost {
		t.Errorf("method = %q, want POST", gotMethod)
	}
	if gotPath != "/acme/notion/call/pages.searchPage" {
		t.Errorf("path = %q, want /acme/notion/call/pages.searchPage", gotPath)
	}
	if gotAuth != "Bearer ck_cloud_test" {
		t.Errorf("auth = %q, want Bearer ck_cloud_test", gotAuth)
	}
	args, ok := gotBody["args"].(map[string]any)
	if !ok || args["q"] != "hi" {
		t.Errorf("body = %v, want {args:{q:hi}}", gotBody)
	}

	var out struct {
		Results []string `json:"results"`
	}
	if err := json.Unmarshal(raw, &out); err != nil {
		t.Fatalf("unmarshal data: %v", err)
	}
	if len(out.Results) != 2 || out.Results[0] != "a" {
		t.Errorf("data = %v, want [a b]", out.Results)
	}
}

func TestConnectionStatusParsesMap(t *testing.T) {
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/connection-status" {
			t.Errorf("path = %q", r.URL.Path)
		}
		if r.URL.Query().Get("tenantId") != "acme" {
			t.Errorf("tenantId query = %q", r.URL.Query().Get("tenantId"))
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"notion":"connected","slack":"not_connected"}`))
	})
	defer close()

	status, err := c.ConnectionStatus(context.Background(), "acme")
	if err != nil {
		t.Fatalf("ConnectionStatus returned error: %v", err)
	}
	if status["notion"] != "connected" || status["slack"] != "not_connected" {
		t.Errorf("status = %v", status)
	}
}

func TestErrorBodyMapsToCorsairError(t *testing.T) {
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		_, _ = w.Write([]byte(`{"error":"not_connected","message":"tenant has no notion credentials","reason":"missing_credentials","providerStatus":401}`))
	})
	defer close()

	_, err := c.Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", map[string]any{})
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	ce, ok := err.(*CorsairError)
	if !ok {
		t.Fatalf("error type = %T, want *CorsairError", err)
	}
	if ce.Status != http.StatusForbidden {
		t.Errorf("Status = %d, want 403", ce.Status)
	}
	if ce.Code != "not_connected" {
		t.Errorf("Code = %q, want not_connected", ce.Code)
	}
	if ce.Message != "tenant has no notion credentials" {
		t.Errorf("Message = %q", ce.Message)
	}
	if ce.Reason != "missing_credentials" {
		t.Errorf("Reason = %q", ce.Reason)
	}
	if ce.ProviderStatus != 401 {
		t.Errorf("ProviderStatus = %d, want 401", ce.ProviderStatus)
	}
}

func TestSendRejectsNonHTTPSBaseURL(t *testing.T) {
	c := New("ck_cloud_test", WithURL("http://attacker.example"))
	_, err := c.Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", nil)
	if err == nil {
		t.Fatal("expected error for non-https base URL")
	}
}

func TestDerivesURLFromKey(t *testing.T) {
	c := New("ck_cloud_envh.secret123")
	if c.baseURL != "https://api.corsair.cloud/envh/api/corsair" {
		t.Errorf("baseURL = %q, want the api.corsair.cloud URL derived from the key", c.baseURL)
	}
	// A key with no derivable slug and no WithURL errors at call time.
	c2 := New("not-a-cloud-key")
	if _, err := c2.Tenant("acme").Call(context.Background(), "notion", "op", nil); err == nil {
		t.Fatal("expected error when no URL can be resolved from the key")
	}
}

func TestSendAllowsLoopbackHTTP(t *testing.T) {
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	defer close()

	if _, err := c.Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", nil); err != nil {
		t.Fatalf("expected loopback http to be allowed, got %v", err)
	}
}

func TestCallNilArgsSendsEmptyObject(t *testing.T) {
	var gotBody map[string]json.RawMessage
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(body, &gotBody)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	defer close()

	if _, err := c.Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", nil); err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if string(gotBody["args"]) != "{}" {
		t.Errorf("args = %s, want {}", gotBody["args"])
	}
}

func TestCallEmptyTenantErrors(t *testing.T) {
	c := New("ck_cloud_x", WithURL("https://vm.corsair.cloud"))
	if _, err := c.Tenant("").Call(context.Background(), "slack", "send", nil); err == nil {
		t.Fatal("expected an error for an empty tenant id")
	}
}

func TestCallTypedNilArgsSendsEmptyObject(t *testing.T) {
	var gotBody map[string]json.RawMessage
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(body, &gotBody)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	defer close()

	// A typed nil map is a non-nil interface but still marshals to null.
	var typedNil map[string]any
	if _, err := c.Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", typedNil); err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if string(gotBody["args"]) != "{}" {
		t.Errorf("args = %s, want {}", gotBody["args"])
	}
}

func TestCallEscapesPathSegments(t *testing.T) {
	var gotRequestURI string
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		gotRequestURI = r.RequestURI
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	defer close()

	if _, err := c.Tenant("a/b").Call(context.Background(), "notion", "pages.searchPage", nil); err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if !strings.Contains(gotRequestURI, "a%2Fb") {
		t.Errorf("request URI = %q, want the tenant segment escaped as a%%2Fb", gotRequestURI)
	}
}

func TestCreateConnectLinkAndDisconnect(t *testing.T) {
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.URL.Path {
		case "/connect/links":
			_, _ = w.Write([]byte(`{"connectUrl":"https://connect.example/x","expiresAt":"2026-01-01T00:00:00Z","tenantId":"acme"}`))
		case "/disconnect":
			w.Write([]byte(`{}`))
		default:
			t.Errorf("unexpected path %q", r.URL.Path)
		}
	})
	defer close()

	link, err := c.CreateConnectLink(context.Background(), "notion", "acme", "")
	if err != nil {
		t.Fatalf("CreateConnectLink error: %v", err)
	}
	if link.ConnectURL != "https://connect.example/x" || link.TenantID != "acme" {
		t.Errorf("link = %+v", link)
	}

	if err := c.Disconnect(context.Background(), "notion", "acme"); err != nil {
		t.Fatalf("Disconnect error: %v", err)
	}
}

func TestTenantsAndCreateTenant(t *testing.T) {
	c, close := newTestServer(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch {
		case r.Method == http.MethodGet && r.URL.Path == "/tenants":
			_, _ = w.Write([]byte(`[{"id":"acme","connectedPlugins":["notion"]}]`))
		case r.Method == http.MethodPost && r.URL.Path == "/tenants":
			_, _ = w.Write([]byte(`{"id":"beta","connectedPlugins":[]}`))
		default:
			t.Errorf("unexpected %s %q", r.Method, r.URL.Path)
		}
	})
	defer close()

	tenants, err := c.Tenants(context.Background())
	if err != nil {
		t.Fatalf("Tenants error: %v", err)
	}
	if len(tenants) != 1 || tenants[0].ID != "acme" {
		t.Errorf("tenants = %+v", tenants)
	}

	created, err := c.CreateTenant(context.Background(), "beta")
	if err != nil {
		t.Fatalf("CreateTenant error: %v", err)
	}
	if created.ID != "beta" {
		t.Errorf("created = %+v", created)
	}
}
