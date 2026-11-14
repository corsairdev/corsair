# @corsair-dev/customjs

CustomJS plugin for Corsair: render HTML or Markdown to PDF, capture screenshots, run inline JavaScript, scrape pages with an AI agent or exact steps, and manage hosted HTML pages.

## Install

```bash
pnpm add @corsair-dev/customjs
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `auth.check` | `customjs.api.auth.check` | `read` | Verify the API key and read its workspace name, rate-limit window and suspension state; the key and JWT in the raw answer are dropped |
| `javascript.run` | `customjs.api.javascript.run` | `write` | Run JavaScript inline with the given input and return what it produced as text; the code can call any bundled NPM module and reach the network |
| `javascript.runBinary` | `customjs.api.javascript.runBinary` | `write` | Run JavaScript inline and return its Buffer result as base64, for PDFs and images; the code can call any bundled NPM module and reach the network |
| `pages.create` | `customjs.api.pages.create` | `write` | Publish an HTML page to a new live URL; CustomJS does not enforce unique names, so a repeated call publishes a second page |
| `pages.delete` | `customjs.api.pages.delete` | `destructive` | Delete a hosted page, which takes its live URL down permanently; an unknown page ID fails with a 404 |
| `pages.list` | `customjs.api.pages.list` | `read` | List the hosted HTML pages in the workspace with their live URLs |
| `pages.update` | `customjs.api.pages.update` | `write` | Replace the HTML of a hosted page in place, keeping its live URL, and optionally rename it |
| `pdf.fromHtml` | `customjs.api.pdf.fromHtml` | `read` | Render HTML or a Nunjucks template to PDF in Chromium, returning the bytes as base64 with an optional page size |
| `pdf.fromMarkdown` | `customjs.api.pdf.fromMarkdown` | `read` | Render Markdown to PDF, returning the bytes as base64 |
| `scrape.agent` | `customjs.api.scrape.agent` | `destructive` | Give an AI agent a plain-language goal and let it drive a browser for up to maxSteps actions; it bills model tokens and can submit forms on the site it visits |
| `scrape.page` | `customjs.api.scrape.page` | `write` | Drive a browser through exact steps (navigate, click, type, evaluate and extract) and return the extracted values, with no model tokens spent per step |
| `screenshot.capture` | `customjs.api.screenshot.capture` | `write` | Capture a URL as PNG after optional click, type, wait and scroll steps, cropped to a box when one is given |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/customjs

## License

Apache-2.0
