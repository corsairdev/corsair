# @corsair-dev/imagekit

ImageKit plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/imagekit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cache.getPurgeStatus` | `imagekit.api.cache.getPurgeStatus` | `read` | Where a cache purge stands; status Pending or Completed |
| `cache.purge` | `imagekit.api.cache.purge` | `write` | Purge the CDN cache of one delivered file URL; follow with cache.getPurgeStatus until status is Completed |
| `files.addTags` | `imagekit.api.files.addTags` | `write` | Add tags to up to 50 files at once; the answer splits successes from per-file errors |
| `files.bulkDelete` | `imagekit.api.files.bulkDelete` | `destructive` | Permanently delete up to 100 files by ID; a 207 answer lists per-file failures in errors |
| `files.copy` | `imagekit.api.files.copy` | `write` | Copy a file to another folder, optionally with all of its versions |
| `files.delete` | `imagekit.api.files.delete` | `destructive` | Permanently delete a file and all of its versions; there is no trash and no restore |
| `files.getDetails` | `imagekit.api.files.getDetails` | `read` | Read one file by ID: path, URL, tags, AI tags, size, versions and custom metadata |
| `files.list` | `imagekit.api.files.list` | `read` | List and search files and folders with paging (limit and skip), a folder path filter, file type and a searchQuery expression |
| `files.move` | `imagekit.api.files.move` | `write` | Move a file to another folder |
| `files.removeAITags` | `imagekit.api.files.removeAITags` | `write` | Remove AI-generated tags from up to 50 files at once |
| `files.removeTags` | `imagekit.api.files.removeTags` | `write` | Remove tags from up to 50 files at once |
| `files.rename` | `imagekit.api.files.rename` | `write` | Rename a file in place; with purgeCache the old URL stops resolving from CDN cache, reported by purgeRequestId |
| `files.updateDetails` | `imagekit.api.files.updateDetails` | `write` | Change a file: replace tags, set custom metadata, coordinates or description, remove AI tags (names or all), or publish or unpublish it (that call alone) |
| `files.upload` | `imagekit.api.files.upload` | `write` | Upload a file from an https URL or base64 content into the media library, optionally into a folder and with tags |
| `fileVersions.delete` | `imagekit.api.fileVersions.delete` | `destructive` | Permanently delete one non-current version of a file; the current version cannot be deleted |
| `fileVersions.getDetails` | `imagekit.api.fileVersions.getDetails` | `read` | Read one stored version of a file |
| `fileVersions.list` | `imagekit.api.fileVersions.list` | `read` | List every stored version of a file, newest first |
| `fileVersions.restore` | `imagekit.api.fileVersions.restore` | `write` | Make a stored version the current version of a file |
| `folders.copy` | `imagekit.api.folders.copy` | `write` | Copy a folder subtree into another folder as a background job; follow with folders.getJobStatus until status is Completed |
| `folders.create` | `imagekit.api.folders.create` | `write` | Create a folder in a parent folder path |
| `folders.delete` | `imagekit.api.folders.delete` | `destructive` | Permanently delete a folder and everything inside it; there is no trash and no restore |
| `folders.getJobStatus` | `imagekit.api.folders.getJobStatus` | `read` | Where a folder bulk job stands; status Pending or Completed |
| `folders.move` | `imagekit.api.folders.move` | `write` | Move a folder subtree into another folder as a background job; follow with folders.getJobStatus |
| `folders.rename` | `imagekit.api.folders.rename` | `write` | Rename a folder as a background job; follow with folders.getJobStatus. purgeCache also purges old CDN paths |
| `metadata.getByFileId` | `imagekit.api.metadata.getByFileId` | `read` | Read image or video metadata of a stored file: dimensions, format, pHash, EXIF |
| `metadata.getByUrl` | `imagekit.api.metadata.getByUrl` | `read` | Read metadata of any delivered file URL, including transformed variants |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/imagekit

## License

Apache-2.0
