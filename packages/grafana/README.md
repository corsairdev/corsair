# @corsair-dev/grafana

Grafana plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/grafana
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `dashboards.queryPublic` | `grafana.api.dashboards.queryPublic` | `read` | Query a panel on a public Grafana dashboard |
| `health.get` | `grafana.api.health.get` | `read` | Check Grafana server health and database connectivity |
| `jwks.retrieve` | `grafana.api.jwks.retrieve` | `read` | Retrieve JWKS public keys for token verification |
| `logs.createOtlp` | `grafana.api.logs.createOtlp` | `write` | Send OTLP v1 logs to Grafana Loki for ingestion |
| `ring.getDistributorHaTracker` | `grafana.api.ring.getDistributorHaTracker` | `read` | Get distributor HA tracker ring status |
| `ring.getIndexGateway` | `grafana.api.ring.getIndexGateway` | `read` | Get index gateway hash ring status |
| `ring.getOverridesExporter` | `grafana.api.ring.getOverridesExporter` | `read` | Get overrides-exporter hash ring status |
| `ring.getRuler` | `grafana.api.ring.getRuler` | `read` | Get ruler ring status from Grafana Mimir |
| `saml.postAcs` | `grafana.api.saml.postAcs` | `write` | Process a SAML Assertion Consumer Service authentication response |
| `status.get` | `grafana.api.status.get` | `read` | Check Grafana Enterprise license availability |
| `storeGateway.getTenants` | `grafana.api.storeGateway.getTenants` | `read` | List tenants with blocks in the store-gateway storage |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/grafana

## License

Apache-2.0
