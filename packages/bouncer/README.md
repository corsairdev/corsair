# @corsair-dev/bouncer

Bouncer plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bouncer
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getCredits` | `bouncer.api.account.getCredits` | `read` | Retrieve current credit balance for the Bouncer account |
| `email.createBatchRequest` | `bouncer.api.email.createBatchRequest` | `write` | Initiate an asynchronous batch email verification request |
| `email.deleteBatchRequest` | `bouncer.api.email.deleteBatchRequest` | `destructive` | Permanently delete a batch email verification request and its data |
| `email.finishBatch` | `bouncer.api.email.finishBatch` | `write` | Mark a batch verification process as finished early |
| `email.getBatchResults` | `bouncer.api.email.getBatchResults` | `read` | Retrieve the results of a batch email verification process |
| `email.getBatchStatus` | `bouncer.api.email.getBatchStatus` | `read` | Check the processing status of a batch, optionally with per-status stats |
| `email.verifyDomain` | `bouncer.api.email.verifyDomain` | `read` | Verify domain MX records and catch-all setup |
| `email.verifyEmail` | `bouncer.api.email.verifyEmail` | `read` | Verify a single email address in real-time |
| `toxicity.checkToxicityListJobStatus` | `bouncer.api.toxicity.checkToxicityListJobStatus` | `read` | Check the status and results of a toxicity list job |
| `toxicity.createToxicityListJob` | `bouncer.api.toxicity.createToxicityListJob` | `write` | Create a toxicity analysis job for a list of email addresses |
| `toxicity.deleteToxicityListJob` | `bouncer.api.toxicity.deleteToxicityListJob` | `destructive` | Delete a specific toxicity list job by ID |
| `toxicity.getToxicityListResults` | `bouncer.api.toxicity.getToxicityListResults` | `read` | Download the per-address toxicity scores of a completed job |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bouncer

## License

Apache-2.0
