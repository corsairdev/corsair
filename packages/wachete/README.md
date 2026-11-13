# @corsair-dev/wachete

Wachete plugin for Corsair - create and manage web change monitors, read their check history and diffs, list triggered notifications, and organise monitors into folders.

## Install

```bash
pnpm add @corsair-dev/wachete
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `data.list` | `wachete.api.data.list` | `read` | Read a monitor's check history, optionally as a diff per entry |
| `folders.delete` | `wachete.api.folders.delete` | `destructive` | Delete a folder with every subfolder and monitor inside it; this cannot be undone |
| `folders.list` | `wachete.api.folders.list` | `read` | List a folder subfolders and monitors, with the path to that folder |
| `folders.move` | `wachete.api.folders.move` | `write` | Move monitors and folders into another folder |
| `folders.upsert` | `wachete.api.folders.upsert` | `write` | Create a folder, or rename and move one by sending its id |
| `notifications.get` | `wachete.api.notifications.get` | `read` | Read one notification as the HTML that was sent |
| `notifications.list` | `wachete.api.notifications.list` | `read` | List triggered notifications newest first, filtered by monitor and date range |
| `tasks.delete` | `wachete.api.tasks.delete` | `destructive` | Permanently delete a monitor and its history; this cannot be undone |
| `tasks.get` | `wachete.api.tasks.get` | `read` | Read one monitor with its settings, its last value and when that value changed |
| `tasks.pages` | `wachete.api.tasks.pages` | `read` | List the pages a Portal monitor is crawling |
| `tasks.search` | `wachete.api.tasks.search` | `read` | Search monitors by name, returning at most 500 and no paging |
| `tasks.upsert` | `wachete.api.tasks.upsert` | `write` | Create a monitor, or update one by sending its id; sets the URL, the part of the page watched, how often to check and who to notify |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/wachete

## License

Apache-2.0
