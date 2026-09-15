# Corsair Cloud generated clients

Python, Go, and Swift clients for the Corsair Cloud runtime contract
(`packages/corsair/core/cloud/contract.openapi.yaml`), generated via
[openapi-generator](https://openapi-generator.tech).

These clients are **generated in CI, not committed to this repo** — see
`.github/workflows/cloud-clients.yml`. `clients/python`, `clients/go`, and
`clients/swift` are gitignored.

## Regenerating locally

```
pnpm generate:clients
```

Requires a JVM (Java 11+) — the generator is Java-based. Without one, the
script prints an error and exits non-zero; run it in CI instead.

## Shape

These are flat-ergonomics clients, not the nested TypeScript SDK shape:

```
client.call(tenant, plugin, op, { args })
client.connect({ tenantId, plugin })
client.createTenant({ id })
```

## Auth

Bearer auth using a **cloud key**. The cloud key is a **server-side
credential** — never embed it in a browser, mobile app, or any client the
end user controls. Call these clients from your own backend.
