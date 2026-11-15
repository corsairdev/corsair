# @corsair-dev/truvera

Truvera plugin for Corsair: create DIDs, issue and revoke verifiable credentials, manage schemas and revocation registries, and verify credentials.

## Install

```bash
pnpm add @corsair-dev/truvera
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `credentials.delete` | `truvera.api.credentials.delete` | `destructive` | Delete a credential metadata record; this does not revoke the credential |
| `credentials.get` | `truvera.api.credentials.get` | `read` | Read one credential metadata, and its contents when it was persisted |
| `credentials.issue` | `truvera.api.credentials.issue` | `write` | Issue and sign a verifiable credential, optionally distributing it to a holder, persisting it, or making it revocable |
| `credentials.list` | `truvera.api.credentials.list` | `read` | List the credential metadata on the account, with offset paging |
| `credentials.revoke` | `truvera.api.credentials.revoke` | `write` | Revoke a credential, which makes every verification of it fail |
| `credentials.unrevoke` | `truvera.api.credentials.unrevoke` | `write` | Unrevoke a credential, which restores it as valid |
| `dids.create` | `truvera.api.dids.create` | `write` | Create a DID with its keys, optionally with a DIDComm service endpoint |
| `dids.delete` | `truvera.api.dids.delete` | `destructive` | Delete a DID and its keys; credentials signed with it can no longer be verified against it |
| `dids.get` | `truvera.api.dids.get` | `read` | Resolve one DID and read its document |
| `dids.getMetadata` | `truvera.api.dids.getMetadata` | `read` | Read one DID resolution metadata: controller, versions and deactivation |
| `dids.list` | `truvera.api.dids.list` | `read` | List the DIDs the account controls |
| `jobs.get` | `truvera.api.jobs.get` | `read` | Read an async job that issuance or a registry write returned instead of a finished resource |
| `profiles.create` | `truvera.api.profiles.create` | `write` | Create a profile for a DID the account controls |
| `profiles.delete` | `truvera.api.profiles.delete` | `destructive` | Delete a profile; the DID itself remains |
| `profiles.get` | `truvera.api.profiles.get` | `read` | Read one profile by its DID |
| `profiles.list` | `truvera.api.profiles.list` | `read` | List the issuer profiles on the account |
| `profiles.update` | `truvera.api.profiles.update` | `write` | Change a profile's name, description, logo or contact details |
| `registries.create` | `truvera.api.registries.create` | `write` | Create a revocation registry |
| `registries.delete` | `truvera.api.registries.delete` | `destructive` | Delete a revocation registry, which removes every credential status it held |
| `registries.get` | `truvera.api.registries.get` | `read` | Read one revocation registry |
| `registries.list` | `truvera.api.registries.list` | `read` | List the revocation registries on the account |
| `registries.revocationStatus` | `truvera.api.registries.revocationStatus` | `read` | Read whether one credential in a registry is revoked |
| `registries.revoke` | `truvera.api.registries.revoke` | `write` | Revoke or unrevoke several credentials in one registry in one call |
| `schemas.create` | `truvera.api.schemas.create` | `write` | Create a JSON credential schema that a credential type and subject follow |
| `schemas.delete` | `truvera.api.schemas.delete` | `destructive` | Delete a schema; credentials already issued against it stay valid |
| `schemas.get` | `truvera.api.schemas.get` | `read` | Read one schema by its id |
| `schemas.list` | `truvera.api.schemas.list` | `read` | List the credential schemas on the account |
| `verify.verify` | `truvera.api.verify.verify` | `read` | Verify a credential or presentation and read the reasons when it fails |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/truvera

## License

Apache-2.0
