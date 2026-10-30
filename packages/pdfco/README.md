# @corsair-dev/pdfco

Pdfco plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/pdfco
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accountBalance` | `pdfco.api.accountBalance` | `read` | Get remaining PDF.co credit balance |
| `barcodeGenerate` | `pdfco.api.barcodeGenerate` | `write` | Generate a barcode image |
| `documentParser` | `pdfco.api.documentParser` | `read` | Extract structured data with a parser template |
| `excelToCsv` | `pdfco.api.excelToCsv` | `read` | Convert Excel to CSV |
| `excelToHtml` | `pdfco.api.excelToHtml` | `read` | Convert Excel to HTML |
| `excelToJson` | `pdfco.api.excelToJson` | `read` | Convert Excel to JSON |
| `excelToText` | `pdfco.api.excelToText` | `read` | Convert Excel to plain text |
| `excelToXml` | `pdfco.api.excelToXml` | `read` | Convert Excel to XML |
| `fileUpload` | `pdfco.api.fileUpload` | `write` | Upload a file URL to PDF.co storage |
| `fileUploadBase64` | `pdfco.api.fileUploadBase64` | `write` | Upload base64 content to PDF.co storage |
| `jobCheck` | `pdfco.api.jobCheck` | `read` | Check an async job status |
| `pdfAdd` | `pdfco.api.pdfAdd` | `write` | Overlay text, images, or form values on a PDF |
| `pdfChangeTextSearchable` | `pdfco.api.pdfChangeTextSearchable` | `write` | Make scanned PDF text searchable with OCR |
| `pdfDeletePages` | `pdfco.api.pdfDeletePages` | `write` | Delete pages from a PDF |
| `pdfExtractAttachments` | `pdfco.api.pdfExtractAttachments` | `read` | Extract embedded PDF attachments |
| `pdfFind` | `pdfco.api.pdfFind` | `read` | Find text and coordinates in a PDF |
| `pdfFormsInfoReader` | `pdfco.api.pdfFormsInfoReader` | `read` | Read PDF form field info |
| `pdfFromEmail` | `pdfco.api.pdfFromEmail` | `write` | Convert an email file to PDF |
| `pdfFromHtml` | `pdfco.api.pdfFromHtml` | `write` | Generate PDF from HTML markup |
| `pdfFromText` | `pdfco.api.pdfFromText` | `write` | Convert a text document to PDF |
| `pdfInfoReader` | `pdfco.api.pdfInfoReader` | `read` | Read PDF metadata and properties |
| `pdfMerge` | `pdfco.api.pdfMerge` | `write` | Merge multiple PDFs into one |
| `pdfRotate` | `pdfco.api.pdfRotate` | `write` | Rotate selected PDF pages |
| `pdfSearchAndDeleteText` | `pdfco.api.pdfSearchAndDeleteText` | `write` | Search and delete text in a PDF |
| `pdfSearchAndReplaceText` | `pdfco.api.pdfSearchAndReplaceText` | `write` | Search and replace text in a PDF |
| `pdfSplit` | `pdfco.api.pdfSplit` | `write` | Split a PDF into multiple files |
| `pdfToCsv` | `pdfco.api.pdfToCsv` | `read` | Convert PDF to CSV |
| `pdfToHtml` | `pdfco.api.pdfToHtml` | `read` | Convert PDF to HTML |
| `pdfToImage` | `pdfco.api.pdfToImage` | `read` | Convert PDF pages to images |
| `pdfToJson` | `pdfco.api.pdfToJson` | `read` | Convert PDF to JSON |
| `pdfToText` | `pdfco.api.pdfToText` | `read` | Convert PDF to plain text |
| `pdfToXls` | `pdfco.api.pdfToXls` | `read` | Convert PDF to XLS |
| `pdfToXlsx` | `pdfco.api.pdfToXlsx` | `read` | Convert PDF to XLSX |
| `pdfToXml` | `pdfco.api.pdfToXml` | `read` | Convert PDF to XML |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pdfco

## License

Apache-2.0
