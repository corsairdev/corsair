# @corsair-dev/googledocs

Google Docs plugin for Corsair. Covers document creation and editing,
text operations, document structure (headers, footers, footnotes, named
ranges, bullets), tables, and Drive-watch based triggers.

## Authentication

The plugin uses **OAuth 2.0** (`oauth_2`) against Google.

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
   and enable the **Google Docs API** and the **Google Drive API**
   (Drive powers search, export, copy, and the change-watch triggers).
2. Configure an OAuth consent screen and create an **OAuth client ID**
   (type: Web application). Add your Corsair callback URL as an
   authorized redirect URI.
3. Supply the client ID and secret to Corsair; the OAuth flow requests
   these scopes:
   - `https://www.googleapis.com/auth/documents`
   - `https://www.googleapis.com/auth/drive`

Access tokens are refreshed automatically before expiry and requests are
retried once on 401.

## Endpoints

35 operations across these domains:

| Domain      | Operations                                                                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `documents` | `createDocument`, `createBlankDocument`, `createDocumentMarkdown`, `copyDocument`, `getDocument`, `getDocumentPlaintext`, `updateDocumentMarkdown`, `updateDocumentSectionMarkdown`, `updateDocumentStyle`, `updateExistingDocument`, `updateDocumentBatch`, `exportDocumentAsPdf`, `searchDocuments`, `listSpreadsheetCharts` |
| `text`      | `insertText`, `replaceAllText`, `deleteContentRange`, `insertInlineImage`, `replaceImage`, `insertPageBreak`                                                                                                                                                                                                                   |
| `structure` | `createHeader`, `createFooter`, `createFootnote`, `createNamedRange`, `createParagraphBullets`, `deleteParagraphBullets`, `deleteHeader`, `deleteFooter`, `deleteNamedRange`                                                                                                                                                   |
| `tables`    | `insertTable`, `insertTableColumn`, `deleteTableColumn`, `deleteTableRow`, `unmergeTableCells`, `updateTableRowStyle`                                                                                                                                                                                                          |

## Triggers (webhooks)

Google Docs has no native push API, so triggers ride on a **Google Drive
changes watch channel** narrowed to Docs mime types. Supported events:

`documentCreated`, `documentUpdated`, `documentDeleted`,
`documentAdded`, `documentStructureChanged`,
`documentWordCountThreshold`, `documentPlaceholderFilled`,
`keywordDetected`, `docChanged`, `folderCreated`

Drive watch channels expire (max ~24h) and must be renewed. Create the
channel via the Drive API (`changes.watch`) with a channel ID prefixed
`googledocs-` — the plugin's webhook matcher requires that prefix to
tell Docs deliveries apart from `googledrive`, which rides the same
changes feed. The webhook handler resumes from the stored page token on
each notification.

## Provider quirks

- Document edits go through `documents.batchUpdate`; the granular
  endpoints (insert/replace/delete text, headers, tables, ...) build the
  batch requests internally.
- Markdown import/update works by converting markdown into batch update
  requests — complex markdown (nested tables, raw HTML) degrades to
  plain text.
- `exportDocumentAsPdf` and `searchDocuments` use the Drive API, not the
  Docs API.
- Index positions in the Docs API are 1-based UTF-16 offsets; ranges for
  delete operations must not span segment boundaries.
