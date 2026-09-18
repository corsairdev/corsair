// Package corsaircloud is a thin HTTP client for a hosted Corsair Cloud
// project. The plugin set lives on the VM, so calls are dynamic.
package corsaircloud

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"strings"
	"time"
)

// Client talks to a Corsair Cloud project. The base URL is derived from the
// API key (https://api.corsair.cloud/<slug>/api/corsair), so the key is the
// only value you pass.
type Client struct {
	apiKey  string
	baseURL string
	http    *http.Client
	initErr error
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

// WithURL overrides the base URL derived from the key (dev/testing only).
func WithURL(u string) Option {
	return func(c *Client) { c.baseURL = u }
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
	return "https://api.corsair.cloud/" + slug + "/api/corsair"
}

var loopbackHosts = map[string]bool{"localhost": true, "127.0.0.1": true, "::1": true}

// The API key is sent as a bearer token, so http:// would leak it in
// cleartext — allowed only for loopback, matching the other language clients.
func assertSecureBaseURL(baseURL string) error {
	u, err := url.Parse(baseURL)
	if err != nil {
		return fmt.Errorf("corsaircloud: invalid base URL %q: %w", baseURL, err)
	}
	if u.Scheme == "https" {
		return nil
	}
	if u.Scheme == "http" && loopbackHosts[u.Hostname()] {
		return nil
	}
	return fmt.Errorf("corsaircloud: base URL must use https:// (got %q) — http:// is only allowed for localhost/127.0.0.1", baseURL)
}

// New creates a Client for the given API key; the URL is derived from the key.
// Pass WithURL only for dev/testing. A URL that isn't https:// (loopback
// excepted), or a key no URL can be derived from, surfaces as an error from the
// first call made with this client.
func New(apiKey string, opts ...Option) *Client {
	c := &Client{apiKey: apiKey, http: &http.Client{Timeout: 30 * time.Second}}
	for _, opt := range opts {
		opt(c)
	}
	if c.baseURL == "" {
		c.baseURL = urlFromKey(apiKey)
	}
	if c.baseURL == "" {
		c.initErr = fmt.Errorf("corsaircloud: could not resolve a URL from apiKey — pass a ck_cloud_<slug>.<secret> key, or corsaircloud.WithURL(...)")
	} else {
		c.baseURL = strings.TrimRight(c.baseURL, "/")
		c.initErr = assertSecureBaseURL(c.baseURL)
	}
	return c
}

// Tenant scopes calls to a tenant for plugin op invocation.
func (c *Client) Tenant(id string) *TenantClient {
	return &TenantClient{client: c, tenantID: id}
}

// ConnectionStatus returns each plugin's connection state for a tenant.
func (c *Client) ConnectionStatus(ctx context.Context, tenantID string) (map[string]string, error) {
	data, err := c.send(ctx, http.MethodGet, []string{"connection-status"}, url.Values{"tenantId": {tenantID}}, nil)
	if err != nil {
		return nil, err
	}
	var out map[string]string
	if err := json.Unmarshal(data, &out); err != nil {
		return nil, err
	}
	return out, nil
}

// CreateConnectLink starts an OAuth connect flow for a plugin/tenant pair.
// redirectURI is optional — pass "" to omit it.
func (c *Client) CreateConnectLink(ctx context.Context, plugin, tenantID, redirectURI string) (ConnectLink, error) {
	body := map[string]string{"plugin": plugin, "tenantId": tenantID}
	if redirectURI != "" {
		body["redirectUri"] = redirectURI
	}
	data, err := c.send(ctx, http.MethodPost, []string{"connect", "links"}, nil, body)
	if err != nil {
		return ConnectLink{}, err
	}
	var out ConnectLink
	if err := json.Unmarshal(data, &out); err != nil {
		return ConnectLink{}, err
	}
	return out, nil
}

// Disconnect removes a plugin's credentials for a tenant.
func (c *Client) Disconnect(ctx context.Context, plugin, tenantID string) error {
	body := map[string]string{"plugin": plugin, "tenantId": tenantID}
	_, err := c.send(ctx, http.MethodPost, []string{"disconnect"}, nil, body)
	return err
}

// Tenants lists the project's tenants.
func (c *Client) Tenants(ctx context.Context) ([]Tenant, error) {
	data, err := c.send(ctx, http.MethodGet, []string{"tenants"}, nil, nil)
	if err != nil {
		return nil, err
	}
	var out []Tenant
	if err := json.Unmarshal(data, &out); err != nil {
		return nil, err
	}
	return out, nil
}

// CreateTenant creates a tenant with the given id.
func (c *Client) CreateTenant(ctx context.Context, id string) (Tenant, error) {
	data, err := c.send(ctx, http.MethodPost, []string{"tenants"}, nil, map[string]string{"id": id})
	if err != nil {
		return Tenant{}, err
	}
	var out Tenant
	if err := json.Unmarshal(data, &out); err != nil {
		return Tenant{}, err
	}
	return out, nil
}

// TenantClient invokes plugin ops scoped to one tenant.
type TenantClient struct {
	client   *Client
	tenantID string
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
	if isNilArgs(args) {
		// Send {"args":{}} rather than {"args":null}; the contract types args as
		// an object, matching the Python/Swift clients' empty-object default.
		// isNilArgs also catches a typed nil (e.g. a nil map[string]any passed as
		// `any`), which is a non-nil interface but still marshals to null.
		args = map[string]any{}
	}
	raw, err := t.client.send(ctx, http.MethodPost, []string{t.tenantID, plugin, "call", op}, nil, map[string]any{"args": args})
	if err != nil {
		return nil, err
	}
	var env envelope
	if err := json.Unmarshal(raw, &env); err != nil {
		return nil, err
	}
	return env.Data, nil
}

// ConnectLink is a project's response to a connect-link request.
type ConnectLink struct {
	ConnectURL string `json:"connectUrl"`
	ExpiresAt  string `json:"expiresAt"`
	TenantID   string `json:"tenantId"`
}

// Tenant is a project tenant.
type Tenant struct {
	ID               string   `json:"id"`
	ConnectedPlugins []string `json:"connectedPlugins"`
}

// CorsairError is the runtime's error envelope plus the HTTP status.
// Code is the machine code (not_connected, unknown_plugin, provider_error, ...).
type CorsairError struct {
	Status         int
	Code           string
	Message        string
	Reason         string
	ProviderStatus int
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

type errorBody struct {
	Error          string `json:"error"`
	Message        string `json:"message"`
	Reason         string `json:"reason"`
	ProviderStatus int    `json:"providerStatus"`
}

func (c *Client) send(ctx context.Context, method string, path []string, query url.Values, body any) (json.RawMessage, error) {
	if c.initErr != nil {
		return nil, c.initErr
	}
	escaped := make([]string, len(path))
	for i, p := range path {
		escaped[i] = url.PathEscape(p)
	}
	u := c.baseURL + "/" + strings.Join(escaped, "/")
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
		var eb errorBody
		if err := json.Unmarshal(respBody.Bytes(), &eb); err == nil && eb.Error != "" {
			return nil, &CorsairError{
				Status: resp.StatusCode, Code: eb.Error, Message: eb.Message,
				Reason: eb.Reason, ProviderStatus: eb.ProviderStatus,
			}
		}
		return nil, &CorsairError{Status: resp.StatusCode, Code: "http_error"}
	}

	return respBody.Bytes(), nil
}
