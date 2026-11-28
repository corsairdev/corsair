# @corsair-dev/docuseal

DocuSeal e-signature plugin: manage templates and submissions, create signatures from templates, PDFs, HTML or DOCX, and track submitters. Verifies DocuSeal's signed webhook deliveries for form, submission and template events.

## Install

```bash
pnpm add @corsair-dev/docuseal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `events.listFormCompleted` | `docuseal.api.events.listFormCompleted` | `read` | List form.completed events (one per signer who finished), oldest first by completion time in Unix seconds; a polling alternative to webhooks |
| `events.listSubmissionCompleted` | `docuseal.api.events.listSubmissionCompleted` | `read` | List submission.completed events (one per fully signed submission), paged by completion time in Unix seconds; a polling alternative to webhooks |
| `submissions.archive` | `docuseal.api.submissions.archive` | `write` | Archive a submission; DocuSeal has no hard delete, so it can be restored with submissions.update and archived: false |
| `submissions.create` | `docuseal.api.submissions.create` | `destructive` | Create a submission from a template, one submitter per signing role; sends the signature-request emails unless send_email is false |
| `submissions.createFromDocx` | `docuseal.api.submissions.createFromDocx` | `destructive` | Create a one-off submission from base64-encoded DOCX files with {{...}} tags; sends signature-request emails unless send_email is false; may require a paid (Pro) plan |
| `submissions.createFromEmails` | `docuseal.api.submissions.createFromEmails` | `destructive` | Create one submission per address in a comma-separated list, all from one template; sends a signature-request email to each address unless send_email is false. On DocuSeal Cloud without Pro only the first address gets a submission |
| `submissions.createFromHtml` | `docuseal.api.submissions.createFromHtml` | `destructive` | Create a one-off submission from HTML documents without saving a template; sends signature-request emails unless send_email is false |
| `submissions.createFromPdf` | `docuseal.api.submissions.createFromPdf` | `destructive` | Create a one-off submission from base64-encoded PDF files without saving a template; sends signature-request emails unless send_email is false |
| `submissions.get` | `docuseal.api.submissions.get` | `read` | Read one submission with its submitters, documents and event history |
| `submissions.getDocuments` | `docuseal.api.submissions.getDocuments` | `read` | Read the URLs of a submission's documents, which are signed and final once the submission is completed; the URLs act as bearer credentials, so treat the result as sensitive |
| `submissions.list` | `docuseal.api.submissions.list` | `read` | List submissions with template, status and folder filters, newest id first, one page at a time |
| `submissions.update` | `docuseal.api.submissions.update` | `write` | Rename a submission, change or clear its expiry, or archive and restore it with the archived flag |
| `submitters.get` | `docuseal.api.submitters.get` | `read` | Read one submitter with the values they filled in and their documents |
| `submitters.list` | `docuseal.api.submitters.list` | `read` | List submitters with completion-date and external-id filters, newest id first, one page at a time |
| `submitters.update` | `docuseal.api.submitters.update` | `destructive` | Edit a submitter, resend their invitation, or fill their fields; passing completed: true counter-signs the document as this submitter and cannot be undone |
| `templates.archive` | `docuseal.api.templates.archive` | `write` | Archive a template; DocuSeal has no hard delete, so it can be restored with templates.update and archived: false |
| `templates.clone` | `docuseal.api.templates.clone` | `write` | Copy an existing template into a new one |
| `templates.createFromDocx` | `docuseal.api.templates.createFromDocx` | `write` | Build a template from base64-encoded DOCX files with {{...}} tags; may require a paid (Pro) plan |
| `templates.createFromHtml` | `docuseal.api.templates.createFromHtml` | `write` | Build a template from an HTML document with fillable field tags |
| `templates.createFromPdf` | `docuseal.api.templates.createFromPdf` | `write` | Build a template from base64-encoded PDF files, optionally placing signature fields up front; may require a paid (Pro) plan |
| `templates.get` | `docuseal.api.templates.get` | `read` | Read one template with its documents, field schema and signing roles |
| `templates.list` | `docuseal.api.templates.list` | `read` | List templates with search and folder filters, newest id first, one page at a time |
| `templates.merge` | `docuseal.api.templates.merge` | `write` | Combine several templates into one new template; the sources are kept; may require a paid (Pro) plan |
| `templates.update` | `docuseal.api.templates.update` | `write` | Rename a template, move it to a folder, rename its roles, or archive and restore it with the archived flag |
| `templates.updateDocuments` | `docuseal.api.templates.updateDocuments` | `destructive` | Add, replace or remove the documents attached to a template, or merge them into one PDF; a removed document can only come back by uploading it again; may require a paid (Pro) plan |
| `tools.mergePdfs` | `docuseal.api.tools.mergePdfs` | `read` | Merge two or more base64-encoded PDFs into one and return it base64-encoded; stores nothing |
| `tools.verifyPdf` | `docuseal.api.tools.verifyPdf` | `read` | Check a base64-encoded signed PDF's digital signatures and whether it matches a document this account completed |
| `users.me` | `docuseal.api.users.me` | `read` | Read the user the API key belongs to: id, first and last name, and email |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 11 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docuseal

## License

Apache-2.0
