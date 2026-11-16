# @corsair-dev/niftyimages

NiftyImages plugin for Corsair: list widgets, read per-widget view and click stats, page the recipients a widget recorded and the images it generated, and read one recipient’s aggregated stats.

## Install

```bash
pnpm add @corsair-dev/niftyimages
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `widgets.images` | `niftyimages.api.widgets.images` | `read` | List the images a widget generated in a time window, with each image’s URL and own counts |
| `widgets.list` | `niftyimages.api.widgets.list` | `read` | List the account’s widgets with their names and keys, which every other widget call needs |
| `widgets.stats` | `niftyimages.api.widgets.stats` | `read` | Read per-widget view and click counts for a time window, for every widget at once |
| `widgets.userImages` | `niftyimages.api.widgets.userImages` | `read` | List the images a widget generated for one recipient |
| `widgets.users` | `niftyimages.api.widgets.users` | `read` | List the recipients one widget recorded in a time window, with their view and click counts |
| `widgets.userStats` | `niftyimages.api.widgets.userStats` | `read` | Read aggregated stats for one recipient of one widget |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/niftyimages

## License

Apache-2.0
