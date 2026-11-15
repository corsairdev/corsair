# IdentityCheck

StackGo IdentityCheck integration. The API requires a paid account and a key with the appropriate `verification.create` or `verification.info` scopes. Authentication is `Authorization: Basic <API_KEY>`.

The five implemented operations start individual, SMS, KYB and Tranche 2 verifications and retrieve a verification. StackGo has not published the field-level request and response schemas, so inputs and results are opaque JSON objects. See https://stackgo.io/docs/ and https://stackgo.io/openapi.json.

The sixth operation, image retrieval, is deferred because its response format is not specified and the shared HTTP transport converts non-JSON bodies to text, which would corrupt binary data. The plugin handles the inbound Svix-signed `verification.decision` webhook when configured with a webhook secret. StackGo's published event does not identify an account, so automatic multi-tenant routing is not supported. Do not treat this work-in-progress plugin as production ready.

Direct webhook deliveries require a valid Svix signature. Deliveries authenticated by Corsair Hub use the Hub's verification instead. SMS invitations are classified as destructive and require approval in cautious mode.

## Operations

| Endpoint | Method and path |
| --- | --- |
| `verification.create` | POST `/api/v1/verification/create` |
| `verification.sms` | POST `/api/v1/verification/sms` |
| `verification.kyb` | POST `/api/v1/verification/namescan/kyb` |
| `verification.tranche2` | POST `/api/v1/verification/tranche2` |
| `verification.get` | GET `/api/v1/verification/info/{id}` |
