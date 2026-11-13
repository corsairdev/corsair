# @corsair-dev/rudderstacktransform

RudderStack Transformations plugin for Corsair - create, version, publish and connect transformations, and manage reusable libraries.

## Install

```bash
pnpm add @corsair-dev/rudderstacktransform
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `libraries.create` | `rudderstacktransform.api.libraries.create` | `write` | Create a reusable library whose importName transformations import it by |
| `libraries.delete` | `rudderstacktransform.api.libraries.delete` | `destructive` | Delete a library by ID |
| `libraries.get` | `rudderstacktransform.api.libraries.get` | `read` | Read one published library by ID |
| `libraries.getVersion` | `rudderstacktransform.api.libraries.getVersion` | `read` | Read one revision of a library |
| `libraries.list` | `rudderstacktransform.api.libraries.list` | `read` | List the published libraries in the workspace |
| `libraries.listVersions` | `rudderstacktransform.api.libraries.listVersions` | `read` | List the revisions of a library, newest or oldest first |
| `libraries.publish` | `rudderstacktransform.api.libraries.publish` | `write` | Publish chosen transformation and library revisions after RudderStack runs their code, so a failing test publishes nothing |
| `libraries.update` | `rudderstacktransform.api.libraries.update` | `write` | Update a library, writing a new revision and publishing it only when publish is true; the name and language cannot change |
| `transformations.connect` | `rudderstacktransform.api.transformations.connect` | `write` | Connect a published transformation to a destination, replacing any transformation already connected to it |
| `transformations.create` | `rudderstacktransform.api.transformations.create` | `write` | Create a transformation; unpublished unless publish is true, and only a published one can be connected to a destination |
| `transformations.delete` | `rudderstacktransform.api.transformations.delete` | `destructive` | Delete a published transformation; its revisions are never deleted |
| `transformations.disconnect` | `rudderstacktransform.api.transformations.disconnect` | `write` | Disconnect a transformation from a destination |
| `transformations.get` | `rudderstacktransform.api.transformations.get` | `read` | Read one published transformation by ID |
| `transformations.getVersion` | `rudderstacktransform.api.transformations.getVersion` | `read` | Read one revision of a transformation |
| `transformations.list` | `rudderstacktransform.api.transformations.list` | `read` | List the published transformations in the workspace with their code, language and connected destinations |
| `transformations.listVersions` | `rudderstacktransform.api.transformations.listVersions` | `read` | List the revisions of a transformation, newest or oldest first |
| `transformations.update` | `rudderstacktransform.api.transformations.update` | `write` | Update a transformation, which always writes a new revision and makes it live only when publish is true |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/rudderstacktransform

## License

Apache-2.0
