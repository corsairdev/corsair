# @corsair-dev/listclean

Email verification with Listclean - verify single addresses or batches of up to 3000, read verification logs and analytics, manage result lists, download cleaned results and check the credit balance.

## Install

```bash
pnpm add @corsair-dev/listclean
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getCredits` | `listclean.api.account.getCredits` | `read` | Read the remaining credit balance; useful before billed calls, which spend one credit per address |
| `lists.delete` | `listclean.api.lists.delete` | `destructive` | Permanently delete a list and its results; there is no undo and the rows cannot be fetched again afterwards |
| `lists.getList` | `listclean.api.lists.getList` | `read` | Read one list, including its SUBMITTED, INPROCESS or COMPLETED status and its analytics once done; this is how a batch job is polled |
| `lists.getListResults` | `listclean.api.lists.getListResults` | `read` | Download one completed list's verified rows as JSON, choosing the clean, dirty or unknown addresses |
| `lists.listLists` | `listclean.api.lists.listLists` | `read` | List the bulk lists with their status, per-list analytics and cost, newest page first |
| `verify.getAnalytics` | `listclean.api.verify.getAnalytics` | `read` | Read verification totals, per-date summaries and graph data for a date range, with optional source and status filters |
| `verify.getVerificationLogs` | `listclean.api.verify.getVerificationLogs` | `read` | Read past verifications in a date range of up to 30 days, with optional email, source and status filters and offset paging |
| `verify.startBatchVerification` | `listclean.api.verify.startBatchVerification` | `write` | Start an async bulk verification of up to 3000 addresses; each one spends a credit when the job runs. Answers the list id to poll with lists.getList and fetch with lists.getListResults. Not replayed on failure: a repeat would start a second billed job. |
| `verify.verifyEmail` | `listclean.api.verify.verifyEmail` | `read` | Verify one email address and read back its verdict, MX and mailbox details. Billed: this spends one credit per call even when the answer is lost, so it is never retried. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/listclean

## License

Apache-2.0
