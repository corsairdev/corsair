# @corsair-dev/swaggerhub

SwaggerHub plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/swaggerhub
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apis.cloneVersion` | `swaggerhub.api.apis.cloneVersion` | `write` | Create a version that starts as a copy of an existing one |
| `apis.compare` | `swaggerhub.api.apis.compare` | `read` | Compare a definition against the stored version and list the differences |
| `apis.delete` | `swaggerhub.api.apis.delete` | `destructive` | Delete an API and every version of it. There is no undo and the comments go with it |
| `apis.deleteVersion` | `swaggerhub.api.apis.deleteVersion` | `destructive` | Delete one version of an API. The other versions stay, and there is no undo |
| `apis.disableNotifications` | `swaggerhub.api.apis.disableNotifications` | `write` | Disable every notification the caller has on one API. Nothing else about the API changes |
| `apis.forkVersion` | `swaggerhub.api.apis.forkVersion` | `write` | Fork a version into another owner and name, including another organisation |
| `apis.getCapabilities` | `swaggerhub.api.apis.getCapabilities` | `read` | Read what the token may do with one API version, such as seeing standardization errors |
| `apis.getDefaultVersion` | `swaggerhub.api.apis.getDefaultVersion` | `read` | Read which version the API shows by default. Null when none is set |
| `apis.getDefinition` | `swaggerhub.api.apis.getDefinition` | `read` | Read the stored definition of one API version as text, optionally resolved or flattened |
| `apis.getNotifications` | `swaggerhub.api.apis.getNotifications` | `read` | Read which notification scopes are enabled for one API, and for the caller |
| `apis.list` | `swaggerhub.api.apis.list` | `read` | List the APIs under one owner, with paging, sorting and a filter for the token user own APIs |
| `apis.listVersions` | `swaggerhub.api.apis.listVersions` | `read` | List every version of one API, with its default version and metadata |
| `apis.rename` | `swaggerhub.api.apis.rename` | `write` | Rename an API. Its published URLs change, so anything pointing at the old name breaks |
| `apis.save` | `swaggerhub.api.apis.save` | `write` | Save a definition to one API, creating the version or updating it. Answers 409 on a published version unless force is set |
| `apis.setDefaultVersion` | `swaggerhub.api.apis.setDefaultVersion` | `write` | Change which version the API shows by default. The version has to exist |
| `apis.setNotifications` | `swaggerhub.api.apis.setNotifications` | `write` | Turn on notification scopes for one API. The body is the bare list of scopes |
| `apiSettings.getLifecycle` | `swaggerhub.api.apiSettings.getLifecycle` | `read` | Read whether one API version is published |
| `apiSettings.getVisibility` | `swaggerhub.api.apiSettings.getVisibility` | `read` | Read whether one API version is private |
| `apiSettings.setLifecycle` | `swaggerhub.api.apiSettings.setLifecycle` | `write` | Publish or unpublish one API version. Publishing exposes it to everyone it is visible to |
| `apiSettings.setVisibility` | `swaggerhub.api.apiSettings.setVisibility` | `write` | Make one API version private or public. A private version leaves public view immediately |
| `comments.create` | `swaggerhub.api.comments.create` | `write` | Add a comment to one API version, optionally anchored to a line range |
| `comments.delete` | `swaggerhub.api.comments.delete` | `destructive` | Delete one comment and its replies. There is no undo |
| `comments.list` | `swaggerhub.api.comments.list` | `read` | List the comments on one API version with their replies and open or resolved status |
| `comments.reply` | `swaggerhub.api.comments.reply` | `write` | Add a reply to an existing comment |
| `comments.update` | `swaggerhub.api.comments.update` | `write` | Change the text of one comment |
| `domains.delete` | `swaggerhub.api.domains.delete` | `destructive` | Delete a domain and every version of it. There is no undo |
| `domains.deleteVersion` | `swaggerhub.api.domains.deleteVersion` | `destructive` | Delete one version of a domain. The other versions stay, and there is no undo |
| `domains.getDefinition` | `swaggerhub.api.domains.getDefinition` | `read` | Read the stored definition of one domain version as text |
| `domains.getVersions` | `swaggerhub.api.domains.getVersions` | `read` | List every version of one domain |
| `domains.list` | `swaggerhub.api.domains.list` | `read` | List the domains under one owner |
| `domains.save` | `swaggerhub.api.domains.save` | `write` | Save a definition to one domain, creating the version or updating it |
| `integrations.execute` | `swaggerhub.api.integrations.execute` | `write` | Run one integration once, which pushes the stored definition to its target such as a repository or gateway |
| `integrations.list` | `swaggerhub.api.integrations.list` | `read` | List the integrations configured on one API version, with their ids and enabled state |
| `projects.create` | `swaggerhub.api.projects.create` | `write` | Create a project from a list of API, domain and template names that already exist in the organisation |
| `projects.delete` | `swaggerhub.api.projects.delete` | `destructive` | Delete a project. The APIs, domains and templates it grouped stay on the account |
| `projects.get` | `swaggerhub.api.projects.get` | `read` | Read one project with the APIs, domains and templates it groups |
| `projects.list` | `swaggerhub.api.projects.list` | `read` | List the projects in one organisation |
| `projects.update` | `swaggerhub.api.projects.update` | `write` | Replace a project definition. A collection left out is cleared, so send all three |
| `specs.list` | `swaggerhub.api.specs.list` | `read` | List the specs visible to the account, filtered by type, owner, visibility, state or free text |
| `specs.validate` | `swaggerhub.api.specs.validate` | `read` | Validate an OpenAPI or AsyncAPI definition and get findings with line and column positions. Nothing is saved |
| `templates.delete` | `swaggerhub.api.templates.delete` | `destructive` | Delete one template version. There is no undo |
| `templates.get` | `swaggerhub.api.templates.get` | `read` | Read one template definition as text, optionally a built-in template |
| `templates.list` | `swaggerhub.api.templates.list` | `read` | List the template catalog, optionally narrowed to one owner, including the built-in templates |
| `templates.save` | `swaggerhub.api.templates.save` | `write` | Create or update a template and its version |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/swaggerhub

## License

Apache-2.0
