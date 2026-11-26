package corsaircloud

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
)

// fakeCloud answers like production does today: the key's project slug lists
// the instances at /proj/instances and answers every /proj/api/corsair/...
// path with the runtime's 404 "no route". Each instance serves the SDK routes
// on its own URL, /inst-<key>/api/corsair.
type fakeCloud struct {
	srv *httptest.Server
	// instance keys to list; changed between calls to model a new instance.
	mu       sync.Mutex
	keys     []string
	listings atomic.Int32
	// listError, when set, is the status the next listing answers with.
	listError int
	// instance answers requests under an instance's /api/corsair, with the
	// instance key and the path below it.
	instance func(w http.ResponseWriter, r *http.Request, key, path string)
	// projectHits counts requests to /proj/api/corsair/...
	projectHits atomic.Int32
}

func newFakeCloud(t *testing.T, instance func(w http.ResponseWriter, r *http.Request, key, path string)) (*fakeCloud, *Client) {
	t.Helper()
	f := &fakeCloud{keys: []string{"billing"}, instance: instance}
	f.srv = httptest.NewServer(http.HandlerFunc(f.serve))
	t.Cleanup(f.srv.Close)
	return f, New("ck_cloud_test", WithURL(f.srv.URL+"/proj/api/corsair"))
}

func (f *fakeCloud) setKeys(keys ...string) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.keys = keys
}

func (f *fakeCloud) serve(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch {
	case r.URL.Path == "/proj/instances":
		f.listings.Add(1)
		f.mu.Lock()
		keys, failWith := f.keys, f.listError
		f.listError = 0
		f.mu.Unlock()
		if failWith != 0 {
			w.WriteHeader(failWith)
			return
		}
		type entry struct {
			InstanceKey string `json:"instanceKey"`
			URL         string `json:"url"`
		}
		out := struct {
			Instances []entry `json:"instances"`
		}{Instances: []entry{}}
		for _, k := range keys {
			out.Instances = append(out.Instances, entry{k, f.srv.URL + "/inst-" + k + "/api/corsair"})
		}
		_ = json.NewEncoder(w).Encode(out)
	case strings.HasPrefix(r.URL.Path, "/proj/api/corsair"):
		f.projectHits.Add(1)
		w.WriteHeader(http.StatusNotFound)
		_, _ = w.Write([]byte(`{"code":"not_found","hop":"internal","message":"no route"}`))
	case strings.HasPrefix(r.URL.Path, "/inst-"):
		rest := strings.TrimPrefix(r.URL.Path, "/inst-")
		key, path, _ := strings.Cut(rest, "/api/corsair")
		if f.instance != nil {
			f.instance(w, r, key, path)
			return
		}
		if path == "/tenants" {
			_, _ = w.Write([]byte(`[]`))
			return
		}
		_, _ = w.Write([]byte(`{"data":{}}`))
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}

// The bug: the project URL answers 404 "no route" for calls, so a call has to
// land on the instance URL that GET /instances names.
func TestCallRunsOnTheInstanceURLFromTheListing(t *testing.T) {
	var gotKey, gotPath, gotMethod, gotAuth string
	var gotBody map[string]any
	f, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		gotKey, gotPath, gotMethod = key, path, r.Method
		gotAuth = r.Header.Get("Authorization")
		body, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(body, &gotBody)
		_, _ = w.Write([]byte(`{"data":{"results":["a","b"]}}`))
	})

	raw, err := c.Instance("billing").Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", map[string]any{"q": "hi"})
	if err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if gotKey != "billing" || gotPath != "/acme/notion/call/pages.searchPage" {
		t.Errorf("call landed on instance %q path %q, want billing /acme/notion/call/pages.searchPage", gotKey, gotPath)
	}
	if gotMethod != http.MethodPost {
		t.Errorf("method = %q, want POST", gotMethod)
	}
	if gotAuth != "Bearer ck_cloud_test" {
		t.Errorf("auth = %q, want Bearer ck_cloud_test", gotAuth)
	}
	if args, ok := gotBody["args"].(map[string]any); !ok || args["q"] != "hi" {
		t.Errorf("body = %v, want {args:{q:hi}}", gotBody)
	}
	if f.projectHits.Load() != 0 {
		t.Errorf("project URL got %d requests, want 0", f.projectHits.Load())
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

func TestListingIsFetchedOnceAndShared(t *testing.T) {
	f, c := newFakeCloud(t, nil)
	ctx := context.Background()
	var wg sync.WaitGroup
	for n := 0; n < 8; n++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, err := c.Instance("billing").Tenant("acme").Call(ctx, "notion", "x", nil); err != nil {
				t.Errorf("Call: %v", err)
			}
		}()
	}
	wg.Wait()
	if _, err := c.Instance("billing").Tenants(ctx); err != nil {
		t.Fatalf("Tenants: %v", err)
	}
	if got := f.listings.Load(); got != 1 {
		t.Errorf("listings = %d, want 1", got)
	}
}

func TestRuntimeRoutesRunOnTheInstanceURL(t *testing.T) {
	type seen struct{ method, path, query, body string }
	var got seen
	_, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		body, _ := io.ReadAll(r.Body)
		got = seen{r.Method, key + path, r.URL.RawQuery, strings.TrimSpace(string(body))}
		switch path {
		case "/connection-status":
			_, _ = w.Write([]byte(`{"notion":"connected","slack":"not_connected"}`))
		case "/connect/links":
			_, _ = w.Write([]byte(`{"connectUrl":"https://connect.example/x","expiresAt":"2026-01-01T00:00:00Z","tenantId":"acme"}`))
		case "/tenants":
			if r.Method == http.MethodGet {
				_, _ = w.Write([]byte(`[{"id":"acme","connectedPlugins":["notion"]}]`))
			} else {
				_, _ = w.Write([]byte(`{"id":"beta","connectedPlugins":[]}`))
			}
		default:
			_, _ = w.Write([]byte(`{}`))
		}
	})
	ctx := context.Background()
	billing := c.Instance("billing")

	status, err := billing.ConnectionStatus(ctx, "acme")
	if err != nil || status["notion"] != "connected" || status["slack"] != "not_connected" {
		t.Errorf("ConnectionStatus = %v, %v", status, err)
	}
	if got != (seen{"GET", "billing/connection-status", "tenantId=acme", ""}) {
		t.Errorf("ConnectionStatus sent %+v", got)
	}

	link, err := billing.CreateConnectLink(ctx, "notion", "acme", &ConnectLinkOptions{OAuthMode: "managed"})
	if err != nil || link.ConnectURL != "https://connect.example/x" || link.TenantID != "acme" {
		t.Errorf("CreateConnectLink = %+v, %v", link, err)
	}
	if got != (seen{"POST", "billing/connect/links", "", `{"oauthMode":"managed","plugin":"notion","tenantId":"acme"}`}) {
		t.Errorf("CreateConnectLink sent %+v", got)
	}

	if err := billing.Disconnect(ctx, "notion", "acme", &DisconnectOptions{Account: "work"}); err != nil {
		t.Errorf("Disconnect: %v", err)
	}
	if got != (seen{"POST", "billing/disconnect", "", `{"account":"work","plugin":"notion","tenantId":"acme"}`}) {
		t.Errorf("Disconnect sent %+v", got)
	}

	tenants, err := billing.Tenants(ctx)
	if err != nil || len(tenants) != 1 || tenants[0].ID != "acme" {
		t.Errorf("Tenants = %+v, %v", tenants, err)
	}
	if got != (seen{"GET", "billing/tenants", "", ""}) {
		t.Errorf("Tenants sent %+v", got)
	}

	created, err := billing.CreateTenant(ctx, "beta")
	if err != nil || created.ID != "beta" {
		t.Errorf("CreateTenant = %+v, %v", created, err)
	}
	if got != (seen{"POST", "billing/tenants", "", `{"id":"beta"}`}) {
		t.Errorf("CreateTenant sent %+v", got)
	}

	if _, err := billing.GetPermission(ctx, "perm_1"); err != nil {
		t.Errorf("GetPermission: %v", err)
	}
	if got != (seen{"GET", "billing/permissions/perm_1", "", ""}) {
		t.Errorf("GetPermission sent %+v", got)
	}
}

func TestWithAccountsBindsOnePluginToAnAccount(t *testing.T) {
	var bodies []string
	_, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		body, _ := io.ReadAll(r.Body)
		bodies = append(bodies, strings.TrimSpace(string(body)))
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	tenant := c.Instance("billing").Tenant("acme", WithAccounts(map[string]string{"slack": "work"}))
	ctx := context.Background()
	if _, err := tenant.Call(ctx, "slack", "messages.post", map[string]any{"text": "hi"}); err != nil {
		t.Fatal(err)
	}
	if _, err := tenant.Call(ctx, "notion", "pages.searchPage", nil); err != nil {
		t.Fatal(err)
	}
	want := []string{`{"account":"work","args":{"text":"hi"}}`, `{"args":{}}`}
	if len(bodies) != 2 || bodies[0] != want[0] || bodies[1] != want[1] {
		t.Errorf("bodies = %q, want %q", bodies, want)
	}
}

func TestAnInstanceAddedAfterTheFirstListingIsFound(t *testing.T) {
	var gotKey string
	f, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		gotKey = key
		_, _ = w.Write([]byte(`[]`))
	})
	ctx := context.Background()
	if _, err := c.Instance("billing").Tenants(ctx); err != nil {
		t.Fatal(err)
	}
	f.setKeys("billing", "support")
	if _, err := c.Instance("support").Tenants(ctx); err != nil {
		t.Fatalf("Tenants on the new instance: %v", err)
	}
	if gotKey != "support" || f.listings.Load() != 2 {
		t.Errorf("instance = %q, listings = %d; want support, 2", gotKey, f.listings.Load())
	}
}

func TestAnUnknownInstanceNamesTheOnesThatExist(t *testing.T) {
	f, c := newFakeCloud(t, nil)
	ctx := context.Background()
	_, err := c.Instance("nope").Tenant("acme").Call(ctx, "notion", "x", nil)
	var unknown *UnknownInstanceError
	if !errors.As(err, &unknown) {
		t.Fatalf("error = %v (%T), want *UnknownInstanceError", err, err)
	}
	if len(unknown.Available) != 1 || unknown.Available[0] != "billing" || !strings.Contains(err.Error(), "available: billing") {
		t.Errorf("error = %v", err)
	}
	// Listed by this call; a fresh listing is not fetched twice.
	if got := f.listings.Load(); got != 1 {
		t.Errorf("listings = %d, want 1", got)
	}
	// A second miss lists once more before giving up.
	if _, err := c.Instance("nope").Tenants(ctx); !errors.As(err, &unknown) {
		t.Fatalf("error = %v, want *UnknownInstanceError", err)
	}
	if got := f.listings.Load(); got != 2 {
		t.Errorf("listings = %d, want 2", got)
	}
}

func TestAFailedListingIsNotCached(t *testing.T) {
	f, c := newFakeCloud(t, nil)
	f.listError = http.StatusBadGateway
	ctx := context.Background()
	if _, err := c.Instance("billing").Tenants(ctx); err == nil {
		t.Fatal("expected the failed listing to surface")
	}
	if _, err := c.Instance("billing").Tenants(ctx); err != nil {
		t.Fatalf("second try: %v", err)
	}
}

func TestAnInsecureInstanceURLIsRefused(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte(`{"instances":[{"instanceKey":"billing","url":"http://attacker.example/x/api/corsair"}]}`))
	}))
	defer srv.Close()
	c := New("ck_cloud_test", WithURL(srv.URL+"/proj/api/corsair"))
	_, err := c.Instance("billing").Tenants(context.Background())
	if err == nil || !strings.Contains(err.Error(), `instance "billing" URL must use https://`) {
		t.Fatalf("error = %v, want the insecure instance URL refused", err)
	}
}

func TestInstanceRejectsAnInvalidKey(t *testing.T) {
	_, c := newFakeCloud(t, nil)
	for _, key := range []string{"", "Billing", "a:b", "1st", strings.Repeat("x", 33)} {
		_, err := c.Instance(key).Tenants(context.Background())
		if err == nil || !strings.Contains(err.Error(), "not a valid instance key") {
			t.Errorf("Instance(%q): error = %v, want an invalid-key error", key, err)
		}
	}
}

func errorFor(t *testing.T, status int, body string, header map[string]string) *CorsairError {
	t.Helper()
	_, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		for k, v := range header {
			w.Header().Set(k, v)
		}
		w.WriteHeader(status)
		_, _ = w.Write([]byte(body))
	})
	_, err := c.Instance("billing").Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", nil)
	var ce *CorsairError
	if !errors.As(err, &ce) {
		t.Fatalf("error = %v (%T), want *CorsairError", err, err)
	}
	return ce
}

func TestSDKErrorBodyMapsToCorsairError(t *testing.T) {
	ce := errorFor(t, http.StatusForbidden, `{"error":"not_connected","message":"tenant has no notion credentials","reason":"missing_credentials","providerStatus":401}`, nil)
	if ce.Status != 403 || ce.Code != "not_connected" || ce.Message != "tenant has no notion credentials" ||
		ce.Reason != "missing_credentials" || ce.ProviderStatus != 401 || ce.Retryable {
		t.Errorf("error = %+v", ce)
	}
}

func TestManagementErrorBodyMapsToCorsairError(t *testing.T) {
	ce := errorFor(t, http.StatusUnauthorized, `{"error":{"type":"authentication_error","code":"unauthorized","message":"Invalid or missing project key","retryable":false,"doc_url":"https://docs.corsair.dev/v1/errors#unauthorized","request_id":"req_1"}}`, nil)
	if ce.Status != 401 || ce.Code != "unauthorized" || ce.Type != "authentication_error" ||
		ce.RequestID != "req_1" || ce.DocURL != "https://docs.corsair.dev/v1/errors#unauthorized" || ce.Retryable {
		t.Errorf("error = %+v", ce)
	}
}

func TestRuntimeRefusalBodyMapsToCorsairError(t *testing.T) {
	// What the old client got for every call: the code is read, not lost.
	ce := errorFor(t, http.StatusNotFound, `{"code":"not_found","hop":"internal","message":"no route"}`, map[string]string{"X-Corsair-Trace-Id": "trace_1"})
	if ce.Status != 404 || ce.Code != "not_found" || ce.Message != "no route" || ce.RequestID != "trace_1" {
		t.Errorf("error = %+v", ce)
	}
}

func TestBodylessErrorUsesTheRequestIDHeader(t *testing.T) {
	ce := errorFor(t, http.StatusServiceUnavailable, ``, map[string]string{"Request-Id": "req_9"})
	if ce.Status != 503 || ce.Code != "internal_error" || ce.RequestID != "req_9" || !ce.Retryable {
		t.Errorf("error = %+v", ce)
	}
}

func TestSendRejectsNonHTTPSBaseURL(t *testing.T) {
	c := New("ck_cloud_test", WithURL("http://attacker.example"))
	_, err := c.Instance("billing").Tenant("acme").Call(context.Background(), "notion", "pages.searchPage", nil)
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
	if _, err := c2.Instance("billing").Tenant("acme").Call(context.Background(), "notion", "op", nil); err == nil {
		t.Fatal("expected error when no URL can be resolved from the key")
	}
}

func TestCallNilArgsSendsEmptyObject(t *testing.T) {
	var gotBody map[string]json.RawMessage
	_, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		body, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(body, &gotBody)
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	ctx := context.Background()
	tenant := c.Instance("billing").Tenant("acme")
	if _, err := tenant.Call(ctx, "notion", "pages.searchPage", nil); err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if string(gotBody["args"]) != "{}" {
		t.Errorf("args = %s, want {}", gotBody["args"])
	}
	// A typed nil map is a non-nil interface but still marshals to null.
	var typedNil map[string]any
	if _, err := tenant.Call(ctx, "notion", "pages.searchPage", typedNil); err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if string(gotBody["args"]) != "{}" {
		t.Errorf("args = %s, want {}", gotBody["args"])
	}
}

func TestCallEmptyTenantErrors(t *testing.T) {
	_, c := newFakeCloud(t, nil)
	if _, err := c.Instance("billing").Tenant("").Call(context.Background(), "slack", "send", nil); err == nil {
		t.Fatal("expected an error for an empty tenant id")
	}
}

func TestCallEscapesPathSegments(t *testing.T) {
	var gotRequestURI string
	_, c := newFakeCloud(t, func(w http.ResponseWriter, r *http.Request, key, path string) {
		gotRequestURI = r.RequestURI
		_, _ = w.Write([]byte(`{"data":{}}`))
	})
	if _, err := c.Instance("billing").Tenant("a/b").Call(context.Background(), "notion", "pages.searchPage", nil); err != nil {
		t.Fatalf("Call returned error: %v", err)
	}
	if gotRequestURI != "/inst-billing/api/corsair/a%2Fb/notion/call/pages.searchPage" {
		t.Errorf("request URI = %q, want the tenant segment escaped as a%%2Fb", gotRequestURI)
	}
}

func TestCreateConnectLinkNeedsPluginAndTenant(t *testing.T) {
	_, c := newFakeCloud(t, nil)
	if _, err := c.Instance("billing").CreateConnectLink(context.Background(), "", "acme", nil); err == nil {
		t.Fatal("expected an error for an empty plugin")
	}
}
