# @corsair-dev/paperform

Paperform plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/paperform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `coupons.create` | `paperform.api.coupons.create` | `write` | Create a coupon code on a form, with a fixed amount or percentage off. |
| `coupons.delete` | `paperform.api.coupons.delete` | `destructive` | Delete a coupon code from a form. |
| `coupons.get` | `paperform.api.coupons.get` | `read` | Get one coupon on a form by code. |
| `coupons.list` | `paperform.api.coupons.list` | `read` | List the coupon codes on a form. |
| `coupons.update` | `paperform.api.coupons.update` | `write` | Change a coupon (enable or disable, discount, expiry). Fields you leave out stay as they are. |
| `fields.list` | `paperform.api.fields.list` | `read` | List the questions on a form: each field key, title and type. Submission answers are keyed by these field keys. |
| `files.sign` | `paperform.api.files.sign` | `read` | Get a signed download link for a file uploaded in a submission. Links last 7 days. |
| `forms.get` | `paperform.api.forms.get` | `read` | Get one form by slug, custom slug or id. |
| `forms.list` | `paperform.api.forms.list` | `read` | List forms, newest first by default. Filter with search, page with limit and skip. |
| `partialSubmissions.get` | `paperform.api.partialSubmissions.get` | `read` | Get one partial submission of a form. |
| `partialSubmissions.list` | `paperform.api.partialSubmissions.list` | `read` | List partial (unfinished) submissions of a form. Paperform keeps them only when partial submissions are turned on for the form. |
| `products.get` | `paperform.api.products.get` | `read` | Get one product on a form by SKU. |
| `products.list` | `paperform.api.products.list` | `read` | List the products sold on a form, with price and stock. |
| `products.update` | `paperform.api.products.update` | `write` | Change a product on a form (name, price, stock, min/max per order). Fields you leave out stay as they are. |
| `spaces.forms` | `paperform.api.spaces.forms` | `read` | List the forms in one space. |
| `spaces.get` | `paperform.api.spaces.get` | `read` | Get one space by id. |
| `spaces.list` | `paperform.api.spaces.list` | `read` | List spaces (folders of forms). |
| `submissions.delete` | `paperform.api.submissions.delete` | `destructive` | Delete one submission. It cannot be recovered. |
| `submissions.get` | `paperform.api.submissions.get` | `read` | Get one submission of a form, with its answers. |
| `submissions.list` | `paperform.api.submissions.list` | `read` | List the completed submissions of a form, with their answers keyed by field key. Filter by date or id, page with limit and skip. |
| `translations.list` | `paperform.api.translations.list` | `read` | List form translations (title and language). The mapping text is not stored. |
| `webhooks.create` | `paperform.api.webhooks.create` | `write` | Add a webhook that posts each new submission (and optionally partial submission) of a form to an https URL. |
| `webhooks.delete` | `paperform.api.webhooks.delete` | `destructive` | Delete a webhook by id. |
| `webhooks.list` | `paperform.api.webhooks.list` | `read` | List a form's webhooks. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/paperform

## License

Apache-2.0
