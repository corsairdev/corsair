# @corsair-dev/cosmic

Cosmic plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cosmic
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `media.delete` | `cosmic.api.media.delete` | `write` | Delete Media by id |
| `media.find` | `cosmic.api.media.find` | `read` | List Media in a Bucket |
| `media.findOne` | `cosmic.api.media.findOne` | `read` | Get a single Media item by name |
| `media.insert` | `cosmic.api.media.insert` | `write` | Upload Media to a Bucket |
| `media.update` | `cosmic.api.media.update` | `write` | Update Media metadata by id |
| `objects.batch` | `cosmic.api.objects.batch` | `write` | Run up to 25 Object operations in one request |
| `objects.delete` | `cosmic.api.objects.delete` | `write` | Delete an Object by id |
| `objects.find` | `cosmic.api.objects.find` | `read` | List Objects in a Bucket with filtering and pagination |
| `objects.findOne` | `cosmic.api.objects.findOne` | `read` | Get a single Object by type and slug |
| `objects.getById` | `cosmic.api.objects.getById` | `read` | Get a single Object by id |
| `objects.insert` | `cosmic.api.objects.insert` | `write` | Create an Object in a Bucket |
| `objects.update` | `cosmic.api.objects.update` | `write` | Update an Object by id |
| `objectTypes.delete` | `cosmic.api.objectTypes.delete` | `write` | Delete an Object type by slug |
| `objectTypes.find` | `cosmic.api.objectTypes.find` | `read` | List Object types in a Bucket |
| `objectTypes.findOne` | `cosmic.api.objectTypes.findOne` | `read` | Get a single Object type by slug |
| `objectTypes.insert` | `cosmic.api.objectTypes.insert` | `write` | Create an Object type |
| `objectTypes.update` | `cosmic.api.objectTypes.update` | `write` | Update an Object type by slug |
| `revisions.find` | `cosmic.api.revisions.find` | `read` | List Revisions for an Object |
| `revisions.findOne` | `cosmic.api.revisions.findOne` | `read` | Get a single Revision by id |
| `revisions.insert` | `cosmic.api.revisions.insert` | `write` | Add a draft Revision to an Object |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cosmic

## License

Apache-2.0
