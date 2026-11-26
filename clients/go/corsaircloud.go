// Package corsaircloud is a thin HTTP client for a hosted Corsair Cloud
// project. The plugin set lives on each instance, so calls are dynamic.
//
// Every call names an instance of the project, as the TS client does:
//
//	corsair.Instance("billing").Tenant("acme").Call(ctx, "notion", "pages.searchPage", args)
//
// The key's project URL only lists the instances. Calls, connections, tenants
// and permissions run on each instance's own URL, which comes from that list.
package corsaircloud

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"regexp"
	"strings"
	"sync"
	"time"
)

const runtimeSuffix = "/api/corsair"

// Client talks to a Corsair Cloud project. The base URL is derived from the
// API key (https://api.corsair.cloud/<slug>/api/corsair), so the key is the
// only value you pass.
type Client struct {
	apiKey  string
	baseURL string
	http    *http.Client
	initErr error

	// The instance listing, in the server's order: resolved on first use,
	// shared by every Instance handle, and held under the lock while it
	// resolves so concurrent callers make one request between them.
	instancesMu sync.Mutex
	instances   []instanceEntry
}

type instanceEntry struct {
	key string
	url string
}

// Option configures a Client.
type Option func(*Client)

// WithHTTPClient overrides the default http.Client. A nil client is ignored so
// the default is kept, rather than panicking on the next request.
func WithHTTPClient(h *http.Client) Option {
	return func(c *Client) {
		if h != nil {
			c.http = h
		}
	}
}

// WithURL overrides the project URL derived from the key (dev/testing only).
// The instance listing is read beside it: <url minus /api/corsair>/instances.
func WithURL(u string) Option {
	return func(c *Client) { c.baseURL = strings.TrimSpace(u) }
}

// urlFromKey derives the runtime URL from a ck_cloud_<slug>.<secret> key: the
// slug is the segment after the prefix up to the first '.' (the base64url
// secret never contains '.').
func urlFromKey(apiKey string) string {
	const prefix = "ck_cloud_"
	if !strings.HasPrefix(apiKey, prefix) {
		return ""
	}
	rest := apiKey[len(prefix):]
	i := strings.IndexByte(rest, '.')
	if i <= 0 {
		return ""
	}
	slug := rest[:i]
	for _, r := range slug {
		if !((r >= 'a' && r <= 'z') || (r >= '0' && r <= '9')) {
			return ""
		}
	}
	return "https://api.corsair.cloud/" + slug + runtimeSuffix
}

var loopbackHosts = map[string]bool{"localhost": true, "127.0.0.1": true, "::1": true}

// The API key is sent as a bearer token, so http:// would leak it in
// cleartext — allowed only for loopback, matching the other language clients.
func assertSecureURL(raw, label string) error {
	u, err := url.Parse(raw)
	if err != nil {
		return fmt.Errorf("corsaircloud: invalid %s %q: %w", label, raw, err)
	}
	if u.Scheme == "https" {
		return nil
	}
	if u.Scheme == "http" && loopbackHosts[u.Hostname()] {
		return nil
	}
	return fmt.Errorf("corsaircloud: %s must use https:// (got %q) — http:// is only allowed for localhost/127.0.0.1", label, raw)
}

// The TS client's instance-key rule: the key heads every composite ref, so a
// colon or an uppercase letter would make one ambiguous.
var instanceKeyRE = regexp.MustCompile(`^[a-z][a-z0-9-]{0,31}$`)

// New creates a Client for the given API key; the URL is derived from the key.
// Pass WithURL only for dev/testing. A URL that isn't https:// (loopback
// excepted), or a key no URL can be derived from, surfaces as an error from the
// first call made with this client.
func New(apiKey string, opts ...Option) *Client {
	c := &Client{apiKey: strings.TrimSpace(apiKey), http: &http.Client{Timeout: 30 * time.Second}}
	for _, opt := range opts {
		opt(c)
	}
	if c.baseURL == "" {
		c.baseURL = urlFromKey(c.apiKey)
	}
	switch {
	case c.apiKey == "":
		c.initErr = fmt.Errorf("corsaircloud: apiKey is required")
	case c.baseURL == "":
		c.initErr = fmt.Errorf("corsaircloud: could not resolve a URL from apiKey — pass a ck_cloud_<slug>.<secret> key, or corsaircloud.WithURL(...)")
	default:
		c.baseURL = strings.TrimRight(c.baseURL, "/")
		c.initErr = assertSecureURL(c.baseURL, "base URL")
	}
	return c
}

// Instance scopes calls to one instance of the project, by its key. There is
// no default instance: every call names one, so adding a second instance never
// reroutes existing code. An invalid key surfaces as an error from the first
// call made through the handle.
func (c *Client) Instance(key string) *InstanceClient {
	i := &InstanceClient{client: c, key: key}
	if !instanceKeyRE.MatchString(key) {
		i.err = fmt.Errorf("corsaircloud: Instance: %q is not a valid instance key. Lowercase letter first, then letters, digits or hyphens, up to 32 characters", key)
	}
	return i
}

// UnknownInstanceError means the project has no instance with this key.
type UnknownInstanceError struct {
	Key       string
	Available []string
}

func (e *UnknownInstanceError) Error() string {
	available := strings.Join(e.Available, ", ")
	if available == "" {
		available = "(none)"
	}
	return fmt.Sprintf("corsaircloud: Instance(%q): no such instance — available: %s", e.Key, available)
}

func (c *Client) listInstances(ctx context.Context) ([]instanceEntry, error) {
	// <project>/api/corsair and <project>/instances are siblings.
	root := strings.TrimSuffix(c.baseURL, runtimeSuffix)
	data, err := c.sendTo(ctx, root, http.MethodGet, []string{"instances"}, nil, nil)
	if err != nil {
		return nil, err
	}
	var found struct {
		Instances []struct {
			InstanceKey string `json:"instanceKey"`
			URL         string `json:"url"`
		} `json:"instances"`
	}
	if err := json.Unmarshal(data, &found); err != nil {
		return nil, err
	}
	out := make([]instanceEntry, 0, len(found.Instances))
	for _, i := range found.Instances {
		if err := assertSecureURL(i.URL, fmt.Sprintf("instance %q URL", i.InstanceKey)); err != nil {
			return nil, err
		}
		out = append(out, instanceEntry{key: i.InstanceKey, url: strings.TrimRight(i.URL, "/")})
	}
	return out, nil
}

func lookupInstance(entries []instanceEntry, key string) (string, bool) {
	for _, e := range entries {
		if e.key == key {
			return e.url, true
		}
	}
	return "", false
}

// instanceURL resolves an instance key to its own URL.
func (c *Client) instanceURL(ctx context.Context, key string) (string, error) {
	if c.initErr != nil {
		return "", c.initErr
	}
	c.instancesMu.Lock()
	defer c.instancesMu.Unlock()
	fresh := c.instances == nil
	if fresh {
		list, err := c.listInstances(ctx)
		if err != nil {
			return "", err
		}
		c.instances = list
	}
	if u, ok := lookupInstance(c.instances, key); ok {
		return u, nil
	}
	if !fresh {
		// Listed once already and the key is missing: list again before
		// calling it missing, so an instance created after the first listing
		// is still reachable for the life of this client.
		c.instances = nil
		list, err := c.listInstances(ctx)
		if err != nil {
			return "", err
		}
		c.instances = list
		if u, ok := lookupInstance(c.instances, key); ok {
			return u, nil
		}
	}
	names := make([]string, len(c.instances))
	for n, e := range c.instances {
		names[n] = e.key
	}
	return "", &UnknownInstanceError{Key: key, Available: names}
}

// InstanceClient scopes calls, connections, tenants and permissions to one
// instance. Each instance has its own tenants and credential store.
type InstanceClient struct {
	client *Client
	key    string
	err    error
}

// Key is the instance's key.
func (i *InstanceClient) Key() string { return i.key }

// TenantOption configures a TenantClient.
type TenantOption func(*TenantClient)

// WithAccounts picks which connected account each plugin uses when the tenant
// has more than one (plugin id -> account label or id).
func WithAccounts(accounts map[string]string) TenantOption {
	return func(t *TenantClient) {
		t.accounts = make(map[string]string, len(accounts))
		for plugin, account := range accounts {
			t.accounts[plugin] = account
		}
	}
}

// Tenant scopes calls to one of your users.
func (i *InstanceClient) Tenant(id string, opts ...TenantOption) *TenantClient {
	t := &TenantClient{instance: i, tenantID: id}
	for _, opt := range opts {
		opt(t)
	}
	return t
}

func (i *InstanceClient) send(ctx context.Context, method string, path []string, query url.Values, body any) (json.RawMessage, error) {
	if i.err != nil {
		return nil, i.err
	}
	base, err := i.client.instanceURL(ctx, i.key)
	if err != nil {
		return nil, err
	}
	return i.client.sendTo(ctx, base, method, path, query, body)
}

// ConnectionStatus returns each plugin's connection state for a tenant.
func (i *InstanceClient) ConnectionStatus(ctx context.Context, tenantID string) (map[string]string, error) {
	data, err := i.send(ctx, http.MethodGet, []string{"connection-status"}, url.Values{"tenantId": {tenantID}}, nil)
	if err != nil {
		return nil, err
	}
	var out map[string]string
	if err := json.Unmarshal(data, &out); err != nil {
		return nil, err
	}
	return out, nil
}

// ConnectLinkOptions are the optional fields of a connect link.
type ConnectLinkOptions struct {
	// OAuthMode is "managed" (Corsair's OAuth app) or "byo" (your own).
	OAuthMode string
	// ProviderName overrides the provider's display name.
	ProviderName string
}

// CreateConnectLink returns a link to send the tenant to, so they connect
// their account for a plugin. opts may be nil.
func (i *InstanceClient) CreateConnectLink(ctx context.Context, plugin, tenantID string, opts *ConnectLinkOptions) (ConnectLink, error) {
	if plugin == "" || tenantID == "" {
		return ConnectLink{}, fmt.Errorf("corsaircloud: CreateConnectLink requires both plugin and tenantID")
	}
	body := map[string]string{"plugin": plugin, "tenantId": tenantID}
	if opts != nil && opts.OAuthMode != "" {
		body["oauthMode"] = opts.OAuthMode
	}
	if opts != nil && opts.ProviderName != "" {
		body["providerName"] = opts.ProviderName
	}
	data, err := i.send(ctx, http.MethodPost, []string{"connect", "links"}, nil, body)
	if err != nil {
		return ConnectLink{}, err
	}
	var out ConnectLink
	if err := json.Unmarshal(data, &out); err != nil {
		return ConnectLink{}, err
	}
	return out, nil
}

// DisconnectOptions are the optional fields of a disconnect.
type DisconnectOptions struct {
	// Account removes only this account (label, provider id or row id).
	Account string
}

// Disconnect removes a plugin's stored credentials for a tenant: every
// account, or only opts.Account. opts may be nil.
func (i *InstanceClient) Disconnect(ctx context.Context, plugin, tenantID string, opts *DisconnectOptions) error {
	body := map[string]string{"plugin": plugin, "tenantId": tenantID}
	if opts != nil && opts.Account != "" {
		body["account"] = opts.Account
	}
	_, err := i.send(ctx, http.MethodPost, []string{"disconnect"}, nil, body)
	return err
}

// Tenants lists the instance's tenants.
func (i *InstanceClient) Tenants(ctx context.Context) ([]Tenant, error) {
	data, err := i.send(ctx, http.MethodGet, []string{"tenants"}, nil, nil)
	if err != nil {
		return nil, err
	}
	var out []Tenant
	if err := json.Unmarshal(data, &out); err != nil {
		return nil, err
	}
	return out, nil
}

// CreateTenant creates a tenant with the given id on the instance.
func (i *InstanceClient) CreateTenant(ctx context.Context, id string) (Tenant, error) {
	data, err := i.send(ctx, http.MethodPost, []string{"tenants"}, nil, map[string]string{"id": id})
	if err != nil {
		return Tenant{}, err
	}
	var out Tenant
	if err := json.Unmarshal(data, &out); err != nil {
		return Tenant{}, err
	}
	return out, nil
}

// GetPermission fetches a permission record by id. The shape varies by grant,
// so it's returned as raw JSON for the caller to decode.
func (i *InstanceClient) GetPermission(ctx context.Context, id string) (json.RawMessage, error) {
	return i.send(ctx, http.MethodGet, []string{"permissions", id}, nil, nil)
}

// TenantClient invokes plugin ops scoped to one tenant on one instance.
type TenantClient struct {
	instance *InstanceClient
	tenantID string
	accounts map[string]string
}

// isNilArgs reports whether args is nil or a typed nil (map/slice/pointer/etc.),
// both of which JSON-marshal to null.
func isNilArgs(args any) bool {
	if args == nil {
		return true
	}
	v := reflect.ValueOf(args)
	switch v.Kind() {
	case reflect.Map, reflect.Slice, reflect.Ptr, reflect.Interface, reflect.Chan, reflect.Func:
		return v.IsNil()
	default:
		return false
	}
}

// Call invokes a plugin op and returns the response's data field.
func (t *TenantClient) Call(ctx context.Context, plugin, op string, args any) (json.RawMessage, error) {
	if t.tenantID == "" {
		// An empty tenant would build a `.../call/...` path with a missing
		// segment and misroute; reject it like the TS client's withTenant.
		return nil, fmt.Errorf("corsaircloud: tenantId must be a non-empty string")
	}
	if isNilArgs(args) {
		// Send {"args":{}} rather than {"args":null}; the contract types args as
		// an object, matching the Python/Swift clients' empty-object default.
		// isNilArgs also catches a typed nil (e.g. a nil map[string]any passed as
		// `any`), which is a non-nil interface but still marshals to null.
		args = map[string]any{}
	}
	body := map[string]any{"args": args}
	if account := t.accounts[plugin]; account != "" {
		body["account"] = account
	}
	raw, err := t.instance.send(ctx, http.MethodPost, []string{t.tenantID, plugin, "call", op}, nil, body)
	if err != nil {
		return nil, err
	}
	var env envelope
	if err := json.Unmarshal(raw, &env); err != nil {
		return nil, err
	}
	return env.Data, nil
}

// ConnectLink is an instance's response to a connect-link request.
type ConnectLink struct {
	ConnectURL string `json:"connectUrl"`
	ExpiresAt  string `json:"expiresAt"`
	TenantID   string `json:"tenantId"`
}

// Tenant is a tenant of an instance.
type Tenant struct {
	ID               string   `json:"id"`
	ConnectedPlugins []string `json:"connectedPlugins"`
}

// CorsairError is a non-2xx answer from Corsair Cloud plus the HTTP status.
// Code is the machine code (not_connected, unknown_plugin, provider_error,
// not_found, ...). Body is the raw error body, for fields not named here.
type CorsairError struct {
	Status         int
	Code           string
	Message        string
	Reason         string
	ProviderStatus int
	// Type is the error family on the management API (invalid_request_error, ...).
	Type string
	// Retryable means the same request is safe to send again. Defaults to
	// true for 429 and 5xx when the server does not say.
	Retryable bool
	Param     string
	DocURL    string
	// RequestID is worth quoting when reporting a failure.
	RequestID string
	Body      json.RawMessage
}

func (e *CorsairError) Error() string {
	if e.Message != "" {
		return fmt.Sprintf("corsair: %s: %s", e.Code, e.Message)
	}
	return fmt.Sprintf("corsair: %s (status %d)", e.Code, e.Status)
}

type envelope struct {
	Data json.RawMessage `json:"data"`
}

// str is a JSON string's value, or "" for anything else.
func str(raw json.RawMessage) string {
	var s string
	_ = json.Unmarshal(raw, &s)
	return s
}

// errorFrom reads any of the three error bodies Corsair sends: the instance's
// SDK routes answer {error: "<code>", message, ...}, the management API
// {error: {code, type, message, ...}}, and the front of the runtime (a
// missing key, an unknown path) {code, hop, message}.
func errorFrom(status int, raw []byte, requestID string) *CorsairError {
	e := &CorsairError{
		Status:    status,
		Retryable: status == 0 || status == http.StatusTooManyRequests || status >= 500,
		RequestID: requestID,
	}
	if len(raw) > 0 && json.Valid(raw) {
		e.Body = append(json.RawMessage(nil), raw...)
	}
	// Field by field, so one field of an unexpected type doesn't lose the rest.
	var top map[string]json.RawMessage
	if json.Unmarshal(raw, &top) == nil {
		var nested map[string]json.RawMessage
		switch {
		case str(top["error"]) != "":
			e.Code, e.Message, e.Reason = str(top["error"]), str(top["message"]), str(top["reason"])
			_ = json.Unmarshal(top["providerStatus"], &e.ProviderStatus)
			return e
		case json.Unmarshal(top["error"], &nested) == nil && str(nested["code"]) != "":
			e.Code, e.Message, e.Type = str(nested["code"]), str(nested["message"]), str(nested["type"])
			e.Param, e.DocURL = str(nested["param"]), str(nested["doc_url"])
			var retryable bool
			if json.Unmarshal(nested["retryable"], &retryable) == nil {
				e.Retryable = retryable
			}
			if id := str(nested["request_id"]); id != "" {
				e.RequestID = id
			}
			return e
		case str(top["code"]) != "":
			e.Code, e.Message = str(top["code"]), str(top["message"])
			return e
		}
	}
	if status == 0 {
		e.Code = "request_failed"
	} else {
		e.Code = "internal_error"
	}
	e.Message = fmt.Sprintf("Corsair Cloud returned %d with no error body", status)
	return e
}

func (c *Client) sendTo(ctx context.Context, base, method string, path []string, query url.Values, body any) (json.RawMessage, error) {
	if c.initErr != nil {
		return nil, c.initErr
	}
	escaped := make([]string, len(path))
	for i, p := range path {
		escaped[i] = url.PathEscape(p)
	}
	u := base + "/" + strings.Join(escaped, "/")
	if len(query) > 0 {
		u += "?" + query.Encode()
	}

	var reqBody *bytes.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewReader(b)
	} else {
		reqBody = bytes.NewReader(nil)
	}

	req, err := http.NewRequestWithContext(ctx, method, u, reqBody)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody := new(bytes.Buffer)
	if _, err := respBody.ReadFrom(resp.Body); err != nil {
		return nil, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		// Request-Id from hub; the runtime's own refusals carry only
		// X-Corsair-Trace-Id.
		requestID := strings.TrimSpace(resp.Header.Get("Request-Id"))
		if requestID == "" {
			requestID = strings.TrimSpace(resp.Header.Get("X-Corsair-Trace-Id"))
		}
		return nil, errorFrom(resp.StatusCode, respBody.Bytes(), requestID)
	}

	return respBody.Bytes(), nil
}
