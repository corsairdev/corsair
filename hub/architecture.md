# Corsair Hub Architecture

Four-tier view of how third-party integrations reach developer apps and their tenants.

```mermaid
stateDiagram-v2
    direction TB

    ThirdParty: Third-Party APIs
    Hub: Corsair Hub

    state Developers {
        direction LR
        DevA: Developer A
        DevB: Developer B
    }

    state Tenants {
        direction LR
        TenantsA: Tenant 1 · 2 · 3
        TenantsB: Tenant 1 · 2
    }

    note right of ThirdParty
        Slack · Gmail · Teams · …
    end note

    ThirdParty --> Hub
    Hub --> DevA
    Hub --> DevB
    DevA --> TenantsA
    DevB --> TenantsB
```

## Flow

1. **Third-party APIs** send OAuth redirects and webhooks to Corsair Hub.
2. **Corsair Hub** verifies and relays signed tunnel envelopes to each developer's app.
3. **Developers** run Corsair in their own stack (`POST /api/corsair`).
4. **Tenants** are each developer's end customers; every developer manages between two and four tenants (shown here as Tenant 1, Tenant 2, …).
