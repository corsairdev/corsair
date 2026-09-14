# @corsair-dev/dropboxsign

Dropbox Sign plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dropboxsign
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.create` | `dropboxsign.api.account.create` | `write` | Creates a new Dropbox Sign account |
| `account.get` | `dropboxsign.api.account.get` | `read` | Retrieves detailed information about a Dropbox Sign account |
| `account.update` | `dropboxsign.api.account.update` | `write` | Updates Dropbox Sign account settings |
| `account.verify` | `dropboxsign.api.account.verify` | `read` | Verifies whether a Dropbox Sign account exists |
| `apiApps.authorize` | `dropboxsign.api.apiApps.authorize` | `read` | Generates OAuth authorization URL |
| `apiApps.create` | `dropboxsign.api.apiApps.create` | `write` | Creates a new API App |
| `apiApps.delete` | `dropboxsign.api.apiApps.delete` | `write` | Deletes an API App |
| `apiApps.get` | `dropboxsign.api.apiApps.get` | `read` | Retrieves API App details |
| `apiApps.list` | `dropboxsign.api.apiApps.list` | `read` | Lists API Apps |
| `apiApps.update` | `dropboxsign.api.apiApps.update` | `write` | Updates an existing API App |
| `bulkSend.createEmbeddedWithTemplate` | `dropboxsign.api.bulkSend.createEmbeddedWithTemplate` | `write` | Bulk creates embedded signature requests with template |
| `bulkSend.getJob` | `dropboxsign.api.bulkSend.getJob` | `read` | Gets bulk send job status |
| `bulkSend.listJobs` | `dropboxsign.api.bulkSend.listJobs` | `read` | Lists bulk send jobs |
| `bulkSend.sendWithTemplate` | `dropboxsign.api.bulkSend.sendWithTemplate` | `write` | Bulk sends signature requests with template |
| `drafts.createEmbeddedUnclaimedWithTemplate` | `dropboxsign.api.drafts.createEmbeddedUnclaimedWithTemplate` | `write` | Creates embedded unclaimed draft with template |
| `drafts.createUnclaimed` | `dropboxsign.api.drafts.createUnclaimed` | `write` | Creates an unclaimed draft |
| `drafts.editAndResendUnclaimed` | `dropboxsign.api.drafts.editAndResendUnclaimed` | `write` | Edits and resends an unclaimed draft |
| `embedded.getSignUrl` | `dropboxsign.api.embedded.getSignUrl` | `read` | Gets embedded signing URL |
| `embedded.getTemplateEditUrl` | `dropboxsign.api.embedded.getTemplateEditUrl` | `read` | Gets embedded template edit URL |
| `faxAndReports.createReport` | `dropboxsign.api.faxAndReports.createReport` | `write` | Requests CSV report generation |
| `faxAndReports.deleteFax` | `dropboxsign.api.faxAndReports.deleteFax` | `write` | Deletes a fax |
| `faxAndReports.getAreaCodes` | `dropboxsign.api.faxAndReports.getAreaCodes` | `read` | Gets available fax line area codes |
| `faxAndReports.listFaxes` | `dropboxsign.api.faxAndReports.listFaxes` | `read` | Lists faxes |
| `faxAndReports.listFaxLines` | `dropboxsign.api.faxAndReports.listFaxLines` | `read` | Lists fax lines |
| `signatureRequests.cancel` | `dropboxsign.api.signatureRequests.cancel` | `write` | Cancels an incomplete signature request |
| `signatureRequests.createEmbedded` | `dropboxsign.api.signatureRequests.createEmbedded` | `write` | Creates an embedded signature request |
| `signatureRequests.createEmbeddedWithTemplate` | `dropboxsign.api.signatureRequests.createEmbeddedWithTemplate` | `write` | Creates an embedded signature request with template |
| `signatureRequests.downloadFiles` | `dropboxsign.api.signatureRequests.downloadFiles` | `read` | Downloads signature request files |
| `signatureRequests.editAndResend` | `dropboxsign.api.signatureRequests.editAndResend` | `write` | Edits and resends a signature request |
| `signatureRequests.editAndResendEmbedded` | `dropboxsign.api.signatureRequests.editAndResendEmbedded` | `write` | Edits and resends an embedded signature request |
| `signatureRequests.editAndResendEmbeddedTemplate` | `dropboxsign.api.signatureRequests.editAndResendEmbeddedTemplate` | `write` | Edits and resends an embedded signature request with template |
| `signatureRequests.get` | `dropboxsign.api.signatureRequests.get` | `read` | Retrieves details of a signature request |
| `signatureRequests.getFilesAsDataUri` | `dropboxsign.api.signatureRequests.getFilesAsDataUri` | `read` | Gets signature request files as Data URI |
| `signatureRequests.getFilesAsFileUrl` | `dropboxsign.api.signatureRequests.getFilesAsFileUrl` | `read` | Gets temporary file URL for signature request |
| `signatureRequests.list` | `dropboxsign.api.signatureRequests.list` | `read` | Lists signature requests |
| `signatureRequests.releaseHold` | `dropboxsign.api.signatureRequests.releaseHold` | `write` | Releases a held signature request |
| `signatureRequests.remind` | `dropboxsign.api.signatureRequests.remind` | `write` | Sends a reminder to a signer |
| `signatureRequests.send` | `dropboxsign.api.signatureRequests.send` | `write` | Sends a signature request |
| `signatureRequests.update` | `dropboxsign.api.signatureRequests.update` | `write` | Updates signer contact information on signature request |
| `teams.addMember` | `dropboxsign.api.teams.addMember` | `write` | Invites or adds a user to team |
| `teams.getCurrent` | `dropboxsign.api.teams.getCurrent` | `read` | Gets current team membership |
| `teams.getInfo` | `dropboxsign.api.teams.getInfo` | `read` | Retrieves team details |
| `teams.list` | `dropboxsign.api.teams.list` | `read` | Lists all accessible teams |
| `teams.listMembers` | `dropboxsign.api.teams.listMembers` | `read` | Lists team members |
| `teams.listSubTeams` | `dropboxsign.api.teams.listSubTeams` | `read` | Lists sub-teams for a team |
| `templates.addUser` | `dropboxsign.api.templates.addUser` | `write` | Adds user access to template |
| `templates.create` | `dropboxsign.api.templates.create` | `write` | Creates a reusable template |
| `templates.createEmbeddedDraft` | `dropboxsign.api.templates.createEmbeddedDraft` | `write` | Creates an embedded template draft |
| `templates.delete` | `dropboxsign.api.templates.delete` | `write` | Deletes a template |
| `templates.get` | `dropboxsign.api.templates.get` | `read` | Retrieves a template by ID |
| `templates.getFiles` | `dropboxsign.api.templates.getFiles` | `read` | Downloads template documents |
| `templates.getFilesAsDataUri` | `dropboxsign.api.templates.getFilesAsDataUri` | `read` | Gets template files as Data URI |
| `templates.getFilesAsFileUrl` | `dropboxsign.api.templates.getFilesAsFileUrl` | `read` | Gets template files as URL |
| `templates.list` | `dropboxsign.api.templates.list` | `read` | Lists templates |
| `templates.removeUser` | `dropboxsign.api.templates.removeUser` | `write` | Removes user access from template |
| `templates.updateFiles` | `dropboxsign.api.templates.updateFiles` | `write` | Updates files for a template |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dropboxsign

## License

Apache-2.0
