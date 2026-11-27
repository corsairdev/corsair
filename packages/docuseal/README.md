# @corsair-dev/docuseal

DocuSeal e-signature plugin: manage templates and submissions, create signatures from templates, PDFs, HTML or DOCX, and track submitters. Webhook deliveries are configured in the DocuSeal console; Corsair does not handle them.

## Install

```bash
pnpm add @corsair-dev/docuseal
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `submissions.archive` | `docuseal.api.submissions.archive` | `write` | Archive a submission; DocuSeal has no hard delete, so it can be restored with submissions.update and archived: false |
| `submissions.create` | `docuseal.api.submissions.create` | `write` | Create a submission from a template, one submitter per signing role; sends the signature-request emails unless send_email is false |
| `submissions.createFromDocx` | `docuseal.api.submissions.createFromDocx` | `write` | Create a one-off submission from base64-encoded DOCX files with {{...}} tags; may require a paid (Pro) plan |
| `submissions.createFromEmails` | `docuseal.api.submissions.createFromEmails` | `write` | Create one submission per address in a comma-separated list, all from one template |
| `submissions.createFromHtml` | `docuseal.api.submissions.createFromHtml` | `write` | Create a one-off submission from HTML documents without saving a template; sends signature-request emails unless send_email is false |
| `submissions.createFromPdf` | `docuseal.api.submissions.createFromPdf` | `write` | Create a one-off submission from base64-encoded PDF files without saving a template; sends signature-request emails unless send_email is false |
| `submissions.get` | `docuseal.api.submissions.get` | `read` | Read one submission with its submitters, documents and event history |
| `submissions.getDocuments` | `docuseal.api.submissions.getDocuments` | `write` | Read the URLs of a submission's documents, which are signed and final once the submission is completed; the URLs act as bearer credentials, so treat the result as sensitive |
| `submissions.list` | `docuseal.api.submissions.list` | `read` | List submissions with template, status and folder filters, newest id first, one page at a time |
| `submissions.update` | `docuseal.api.submissions.update` | `write` | Rename a submission, change or clear its expiry, or archive and restore it with the archived flag |
| `submitters.get` | `docuseal.api.submitters.get` | `read` | Read one submitter with the values they filled in and their documents |
| `submitters.list` | `docuseal.api.submitters.list` | `read` | List submitters with completion-date and external-id filters, newest id first, one page at a time |
| `submitters.update` | `docuseal.api.submitters.update` | `write` | Edit a submitter, resend their invitation, or fill their fields; passing completed: true counter-signs the document as this submitter and cannot be undone |
| `templates.archive` | `docuseal.api.templates.archive` | `write` | Archive a template; DocuSeal has no hard delete, so it can be restored with templates.update and archived: false |
| `templates.clone` | `docuseal.api.templates.clone` | `write` | Copy an existing template into a new one |
| `templates.createFromDocx` | `docuseal.api.templates.createFromDocx` | `write` | Build a template from base64-encoded DOCX files with {{...}} tags; may require a paid (Pro) plan |
| `templates.createFromHtml` | `docuseal.api.templates.createFromHtml` | `write` | Build a template from an HTML document with fillable field tags |
| `templates.createFromPdf` | `docuseal.api.templates.createFromPdf` | `write` | Build a template from base64-encoded PDF files, optionally placing signature fields up front; may require a paid (Pro) plan |
| `templates.get` | `docuseal.api.templates.get` | `read` | Read one template with its documents, field schema and signing roles |
| `templates.list` | `docuseal.api.templates.list` | `read` | List templates with search and folder filters, newest id first, one page at a time |
| `templates.merge` | `docuseal.api.templates.merge` | `write` | Combine several templates into one new template; the sources are kept; may require a paid (Pro) plan |
| `templates.update` | `docuseal.api.templates.update` | `write` | Rename a template, move it to a folder, rename its roles, or archive and restore it with the archived flag |
| `templates.updateDocuments` | `docuseal.api.templates.updateDocuments` | `write` | Add, replace or remove the documents attached to a template; may require a paid (Pro) plan |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/docuseal

## License

Apache-2.0
