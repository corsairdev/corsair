# @corsair-dev/listclean

Email verification with Listclean - verify single addresses or batches of up to 3000, upload CSV files in chunks, read verification logs and analytics, manage result lists, download cleaned results as JSON or CSV, and read credits and the account profile.

## Install

```bash
pnpm add @corsair-dev/listclean
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getCredits` | `listclean.api.account.getCredits` | `read` | Read the remaining credit balance; useful before billed calls, which spend one credit per address |
| `account.getProfile` | `listclean.api.account.getProfile` | `read` | Read the account profile: name, address, phone, company, website, social handles and billing details |
| `account.updateProfile` | `listclean.api.account.updateProfile` | `write` | Update account profile fields; only the fields given are sent |
| `lists.delete` | `listclean.api.lists.delete` | `destructive` | Permanently delete a list and its results; there is no undo and the rows cannot be fetched again afterwards |
| `lists.getList` | `listclean.api.lists.getList` | `read` | Read one list, including its SUBMITTED, INPROCESS or COMPLETED status and its analytics once done; this is how a batch job is polled |
| `lists.getListResults` | `listclean.api.lists.getListResults` | `read` | Download one completed list's verified rows as JSON, choosing the clean, dirty or unknown addresses |
| `lists.getListResultsCsv` | `listclean.api.lists.getListResultsCsv` | `read` | Download one completed list's verified rows as the CSV file Listclean builds, choosing the clean, dirty or unknown addresses |
| `lists.listLists` | `listclean.api.lists.listLists` | `read` | List the bulk lists with their status, per-list analytics and cost, newest page first |
| `uploads.getUpload` | `listclean.api.uploads.getUpload` | `read` | Read one upload: its inprocess, success or error status, progress, chunk counts and the request id of the list it became |
| `uploads.listUploads` | `listclean.api.uploads.listUploads` | `read` | List the chunked CSV uploads with their status and progress |
| `uploads.startUpload` | `listclean.api.uploads.startUpload` | `write` | Open a chunked CSV upload: name the file, its chunk count and chunk size, and optional CSV characters and fast mode. Answers the upload id the chunks go to. Once every chunk is in, the list is verified and spends one credit per address. |
| `uploads.uploadChunk` | `listclean.api.uploads.uploadChunk` | `write` | Send one base64-encoded chunk of an upload, with its sequence number and an optional md5 checksum. The last chunk starts the billed verification. Not replayed after a 5xx or a lost answer. |
| `verify.getAnalytics` | `listclean.api.verify.getAnalytics` | `read` | Read verification totals, per-date summaries and graph data for a date range, with optional source and status filters |
| `verify.getVerificationLogs` | `listclean.api.verify.getVerificationLogs` | `read` | Read past verifications in a date range of up to 30 days, with optional email, source and status filters and offset paging |
| `verify.startBatchVerification` | `listclean.api.verify.startBatchVerification` | `write` | Start an async bulk verification of up to 3000 addresses; each one spends a credit when the job runs. Answers the list id to poll with lists.getList and fetch with lists.getListResults. Not replayed after a 5xx or a lost answer, since a repeat would start a second billed job; a 429 is retried by core because Listclean refused it before running. |
| `verify.verifyEmail` | `listclean.api.verify.verifyEmail` | `read` | Verify one email address and read back its verdict, MX and mailbox details. Billed: one credit per call, spent even when the answer is lost, so it is not retried after a 5xx or a dropped connection (a 429 is, since Listclean refused it before running). |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/listclean

## License

Apache-2.0
