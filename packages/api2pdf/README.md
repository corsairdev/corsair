# @corsair-dev/api2pdf

API2PDF plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/api2pdf
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chrome.addHeaderFooter` | `api2pdf.api.chrome.addHeaderFooter` | `write` | Render HTML to PDF with custom headers and footers |
| `libreoffice.libreOfficePdfToHtml` | `api2pdf.api.libreoffice.libreOfficePdfToHtml` | `write` | Convert a PDF to HTML using LibreOffice |
| `libreoffice.libreOfficeThumbnail` | `api2pdf.api.libreoffice.libreOfficeThumbnail` | `write` | Generate a thumbnail preview of a document |
| `pdfsharp.extractPages` | `api2pdf.api.pdfsharp.extractPages` | `write` | Extract a page range from a PDF |
| `pdfsharp.mergePdfs` | `api2pdf.api.pdfsharp.mergePdfs` | `write` | Merge multiple PDF URLs into a single document |
| `pdfsharp.optimizePdf` | `api2pdf.api.pdfsharp.optimizePdf` | `write` | Compress a PDF to reduce file size |
| `pdfsharp.watermarkPdf` | `api2pdf.api.pdfsharp.watermarkPdf` | `write` | Stamp a text watermark onto every page of a PDF |
| `utility.checkStatus` | `api2pdf.api.utility.checkStatus` | `read` | Check API2PDF service health status |
| `utility.deletePdf` | `api2pdf.api.utility.deletePdf` | `write` | Delete a previously generated PDF by response ID |
| `zebra.generateBarcode` | `api2pdf.api.zebra.generateBarcode` | `write` | Generate a barcode or QR code image |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/api2pdf

## License

Apache-2.0
