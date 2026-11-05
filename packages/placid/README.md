# @corsair-dev/placid

Placid plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/placid
```

## Usage

```ts
import { createCorsair } from 'corsair';
import { placid } from '@corsair-dev/placid';

const corsair = createCorsair({
	plugins: [placid()],
	database: db,
	kek: process.env.CORSAIR_KEK,
});

await corsair.placid.keys.set_api_key(process.env.PLACID_API_KEY);

// Renders are queued: poll the polling_url until status is `finished`.
const started = await corsair.placid.api.images.create({
	template_uuid: 'ospo24ysn',
	layers: { title: { text: 'Meet Singh' } },
});

const image = await corsair.placid.api.images.get({ id: started.id });
if (image.status === 'finished') console.log(image.image_url);
```

Five things catch callers out, each checked against the live API:

- A render that fails still returns 200 from the create call. Read `status`, then `error_code`.
- `polling_url` and the file URL are null until the render finishes. Images with `create_now: true` often finish inline; PDFs and videos usually queue.
- Deleting a generated file answers 204 and clears its URL, but a later `get` still returns 200 with an empty URL, not a 404.
- `templates.list`, `collections.list` and `fonts.list` page by cursor. Pass `links.next` from the previous page as `cursor`; template and font pages hold 20 rows.
- The API token is project-scoped. A token from another project returns 401, not an empty list.

`media.upload` and `fonts.create` fetch a public `file_url`, so private and
loopback addresses are rejected, each redirect hop is checked, and the download
has a 30 second deadline and a 25 MB cap.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collections.create` | `placid.api.collections.create` | `write` | Create a collection, such as one per customer of your SaaS, holding up to 500 templates |
| `collections.delete` | `placid.api.collections.delete` | `destructive` | Permanently delete a collection. The templates inside it are not deleted |
| `collections.get` | `placid.api.collections.get` | `read` | Read one collection and the template UUIDs it holds |
| `collections.list` | `placid.api.collections.list` | `read` | List template collections, either all at once or cursor-paged with `per_page` |
| `collections.update` | `placid.api.collections.update` | `write` | Change a collection: replace its whole template list with `template_uuids`, or add and remove individual templates |
| `fonts.create` | `placid.api.fonts.create` | `write` | Upload a ttf, otf, woff or woff2 font from a public URL. `terms_accepted` must be true. The returned `uuid` is the value to set as the `font` property on a text layer |
| `fonts.delete` | `placid.api.fonts.delete` | `destructive` | Delete a custom font. Fails with 409 when a template still uses it unless `force` is set, which leaves those templates on the default font |
| `fonts.get` | `placid.api.fonts.get` | `read` | Read one custom font by its `uuid` |
| `fonts.list` | `placid.api.fonts.list` | `read` | List the custom fonts in the project, optionally including legacy account-wide fonts |
| `fonts.update` | `placid.api.fonts.update` | `write` | Rename a custom font. The file itself cannot be replaced: upload a new font instead |
| `images.create` | `placid.api.images.create` | `write` | Render a template to an image. The reply is usually `queued`: poll `polling_url` or set `webhook_success` to get the finished URL. One image costs one credit. |
| `images.delete` | `placid.api.images.delete` | `destructive` | Permanently delete an image. Placid only keeps generated files for a limited time, so store them yourself if you need them |
| `images.get` | `placid.api.images.get` | `read` | Read an image by id, including `image_url` once `status` is `finished` and the render error fields when it is `error` |
| `media.upload` | `placid.api.media.upload` | `write` | Upload a file from a public URL to Placid storage and get a URL back for a picture layer. Placid keeps it for a limited time |
| `pdfs.create` | `placid.api.pdfs.create` | `write` | Render one template per page into a single PDF, merged in the order given. Each page costs two credits |
| `pdfs.delete` | `placid.api.pdfs.delete` | `destructive` | Permanently delete a PDF |
| `pdfs.get` | `placid.api.pdfs.get` | `read` | Read a PDF by id, including `pdf_url` once `status` is `finished` |
| `pdfs.merge` | `placid.api.pdfs.merge` | `write` | Merge 2 to 10 existing PDFs from public URLs into one file, without rendering a template |
| `templates.create` | `placid.api.templates.create` | `write` | Create an empty template, or duplicate an existing one with `from_template`, optionally adding it to collections |
| `templates.delete` | `placid.api.templates.delete` | `destructive` | Permanently delete a template |
| `templates.get` | `placid.api.templates.get` | `read` | Read one template, including every dynamic layer that can be filled in |
| `templates.list` | `placid.api.templates.list` | `read` | List templates with their layer names and types, optionally filtered by collection, title or tag and sorted; paged 20 at a time |
| `templates.update` | `placid.api.templates.update` | `write` | Change a template's title, tags or custom_data |
| `videos.create` | `placid.api.videos.create` | `write` | Render one template per clip into a video of up to 3 minutes, optionally with audio. Each 10 seconds of video costs 10 credits |
| `videos.delete` | `placid.api.videos.delete` | `destructive` | Permanently delete a video |
| `videos.get` | `placid.api.videos.get` | `read` | Read a video by id, including `video_url` once `status` is `finished` |

## Auth

Auth: API key. Create an API project in Placid, open the project, then click API Tokens in the left menu. Tokens are project-scoped: a token only reaches the templates of the project that owns it.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/placid

## License

Apache-2.0
