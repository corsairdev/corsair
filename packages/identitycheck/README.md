# IdentityCheck

StackGo IdentityCheck integration. The API needs a paid StackGo plan (Professional or higher; trial accounts have no API access) and a key with the `verification.create`, `verification.info` or `verification.image` scope. Authentication is `Authorization: Basic <API_KEY>`.

The six operations cover StackGo's whole public API: start individual, SMS, KYB and Tranche 2 verifications, retrieve a verification, and download an image captured during one. StackGo has not published the field-level request and response schemas, so request bodies and results are open JSON objects. See https://stackgo.io/docs/ and https://stackgo.io/openapi.json.

Every check started through `create`, `sms`, `kyb` or `tranche2` is paid from the plan's credit, `sms` texts the person and `create` can email them, so all four are destructive and need approval in cautious mode. `verification.image` returns the file (base64 content, media type and size).

The plugin handles the inbound Svix-signed `verification.decision` webhook when configured with the endpoint's signing secret. Direct deliveries need a valid Svix signature; deliveries authenticated by Corsair Hub use the Hub's verification instead. StackGo's event does not identify an account, so automatic multi-tenant routing is not supported.

## Operations

| Endpoint | Method and path |
| --- | --- |
| `verification.create` | POST `/api/v1/verification/create` |
| `verification.sms` | POST `/api/v1/verification/sms` |
| `verification.kyb` | POST `/api/v1/verification/namescan/kyb` |
| `verification.tranche2` | POST `/api/v1/verification/tranche2` |
| `verification.get` | GET `/api/v1/verification/info/{id}` |
| `verification.image` | GET `/api/v1/verification/image/{verificationId}/{imageId}` |
