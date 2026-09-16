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
	"strings"
)

// Client talks to a Corsair Cloud project's base URL
// (https://<vm>.corsair.cloud/<env>/api/corsair).
type Client struct {
	apiKey  string
	baseURL string
	http    *http.Client
}

// Option configures a Client.
type Option func(*Client)

// WithHTTPClient overrides the default http.Client.
func WithHTTPClient(h *http.Client) Option {
	return func(c *Client) { c.http = h }
}

// New creates a Client for the given API key and project base URL.
func New(apiKey, baseURL string, opts ...Option) *Client {
	c := &Client{
		apiKey:  apiKey,
		baseURL: strings.TrimRight(baseURL, "/"),
		http:    http.DefaultClient,
	}
	for _, opt := range opts {
		opt(c)
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
func (c *Client) CreateConnectLink(ctx context.Context, plugin, tenantID string) (ConnectLink, error) {
	body := map[string]string{"plugin": plugin, "tenantId": tenantID}
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

// Call invokes a plugin op and returns the response's data field.
func (t *TenantClient) Call(ctx context.Context, plugin, op string, args any) (json.RawMessage, error) {
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
	u := c.baseURL + "/" + strings.Join(path, "/")
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
