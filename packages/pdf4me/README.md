# @corsair-dev/pdf4me

PDF4me is a PDF and document processing SaaS. This plugin merges, splits, compresses and organizes PDFs, converts them to Word and renders HTML to PDF, runs OCR, reads PDF metadata, extracts tables and form data, and polls asynchronous processing jobs. File answers come back base64-encoded.

## Install

```bash
pnpm add @corsair-dev/pdf4me
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `pdf.merge` | `pdf4me.api.pdf.merge` | `destructive` | Merge multiple PDFs into one; array order is the merge order |
| `pdf.split` | `pdf4me.api.pdf.split` | `destructive` | Split a PDF after a page, every N pages, after listed pages or by page ranges; the parts come back in documents |
| `pdf.compress` | `pdf4me.api.pdf.compress` | `destructive` | Compress a PDF with a documented profile (Max, Web, Print, Default) |
| `pdf.extractPages` | `pdf4me.api.pdf.extractPages` | `destructive` | Extract the given pages into a new PDF |
| `pdf.deletePages` | `pdf4me.api.pdf.deletePages` | `destructive` | Return a copy of a PDF without the given pages; the source file is not changed |
| `pdf.getInfo` | `pdf4me.api.pdf.getInfo` | `read` | Read PDF metadata: page count, dimensions, author and more |
| `convert.pdfToWord` | `pdf4me.api.convert.pdfToWord` | `destructive` | Convert a PDF to a Word document; the API answers a job, so poll jobs.status for the file |
| `convert.htmlToPdf` | `pdf4me.api.convert.htmlToPdf` | `destructive` | Render HTML content into a PDF |
| `convert.ocrPdf` | `pdf4me.api.convert.ocrPdf` | `destructive` | Run OCR on a scanned PDF to make its text editable; the API answers a job, so poll jobs.status for the file |
| `extract.tableFromPdf` | `pdf4me.api.extract.tableFromPdf` | `read` | Extract tables from a PDF |
| `extract.pdfFormData` | `pdf4me.api.extract.pdfFormData` | `read` | Extract the values of filled PDF form fields |
| `jobs.status` | `pdf4me.api.jobs.status` | `read` | Poll a job (isAsync, or PDF-to-Word and OCR, which always run as jobs); a finished job answers its file |

## Auth

Auth: API key (the raw key in the Authorization header). Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks. Async jobs report through `jobs.status` (or the optional `callBackUrl`).

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pdf4me
