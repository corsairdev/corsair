# @corsair-dev/figma

Figma plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/figma
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activityLogs.list` | `figma.api.activityLogs.list` | `read` | List Figma organization activity logs |
| `comments.add` | `figma.api.comments.add` | `write` | Add a comment to a Figma file |
| `comments.addReaction` | `figma.api.comments.addReaction` | `write` | Add a reaction to a comment |
| `comments.delete` | `figma.api.comments.delete` | `destructive` | Delete a comment from a Figma file [DESTRUCTIVE] |
| `comments.deleteReaction` | `figma.api.comments.deleteReaction` | `write` | Delete a reaction from a comment |
| `comments.getReactions` | `figma.api.comments.getReactions` | `read` | Get reactions on a comment |
| `comments.list` | `figma.api.comments.list` | `read` | List comments on a Figma file |
| `components.get` | `figma.api.components.get` | `read` | Get a Figma component by key |
| `components.getComponentSet` | `figma.api.components.getComponentSet` | `read` | Get a Figma component set by key |
| `components.getComponentSetsForFile` | `figma.api.components.getComponentSetsForFile` | `read` | Get all component sets in a Figma file |
| `components.getComponentSetsForTeam` | `figma.api.components.getComponentSetsForTeam` | `read` | Get all component sets for a Figma team |
| `components.getForFile` | `figma.api.components.getForFile` | `read` | Get all components in a Figma file |
| `components.getForTeam` | `figma.api.components.getForTeam` | `read` | Get all components for a Figma team |
| `designTools.designTokensToTailwind` | `figma.api.designTools.designTokensToTailwind` | `read` | Convert Figma design tokens to a Tailwind CSS configuration |
| `designTools.discoverResources` | `figma.api.designTools.discoverResources` | `read` | Discover Figma files, projects, and teams |
| `designTools.downloadImages` | `figma.api.designTools.downloadImages` | `read` | Download rendered images for Figma nodes |
| `designTools.extractDesignTokens` | `figma.api.designTools.extractDesignTokens` | `read` | Extract design tokens (variables and styles) from a Figma file |
| `designTools.extractPrototypeInteractions` | `figma.api.designTools.extractPrototypeInteractions` | `read` | Extract prototype interactions and flows from a Figma file |
| `devResources.create` | `figma.api.devResources.create` | `write` | Create dev resources on a Figma file |
| `devResources.delete` | `figma.api.devResources.delete` | `destructive` | Delete a dev resource from a Figma file [DESTRUCTIVE] |
| `devResources.get` | `figma.api.devResources.get` | `read` | Get dev resources for a Figma file |
| `devResources.update` | `figma.api.devResources.update` | `write` | Update dev resources on a Figma file |
| `files.getImageFills` | `figma.api.files.getImageFills` | `read` | Get image fills from a Figma file |
| `files.getJSON` | `figma.api.files.getJSON` | `read` | Get full Figma file JSON |
| `files.getMetadata` | `figma.api.files.getMetadata` | `read` | Get Figma file metadata |
| `files.getNodes` | `figma.api.files.getNodes` | `read` | Get specific nodes from a Figma file |
| `files.getProjectFiles` | `figma.api.files.getProjectFiles` | `read` | Get all files in a Figma project |
| `files.getStyles` | `figma.api.files.getStyles` | `read` | Get styles from a Figma file |
| `files.getVersions` | `figma.api.files.getVersions` | `read` | Get version history of a Figma file |
| `files.renderImages` | `figma.api.files.renderImages` | `read` | Render Figma nodes as images |
| `libraryAnalytics.componentActions` | `figma.api.libraryAnalytics.componentActions` | `read` | Get library component action analytics |
| `libraryAnalytics.componentUsages` | `figma.api.libraryAnalytics.componentUsages` | `read` | Get library component usage analytics |
| `libraryAnalytics.styleActions` | `figma.api.libraryAnalytics.styleActions` | `read` | Get library style action analytics |
| `libraryAnalytics.styleUsages` | `figma.api.libraryAnalytics.styleUsages` | `read` | Get library style usage analytics |
| `libraryAnalytics.variableActions` | `figma.api.libraryAnalytics.variableActions` | `read` | Get library variable action analytics |
| `libraryAnalytics.variableUsages` | `figma.api.libraryAnalytics.variableUsages` | `read` | Get library variable usage analytics |
| `payments.get` | `figma.api.payments.get` | `read` | Get payment information for a Figma plugin or widget |
| `projects.getTeamProjects` | `figma.api.projects.getTeamProjects` | `read` | Get all projects for a Figma team |
| `styles.get` | `figma.api.styles.get` | `read` | Get a Figma style by key |
| `styles.getForTeam` | `figma.api.styles.getForTeam` | `read` | Get all styles for a Figma team |
| `users.getCurrent` | `figma.api.users.getCurrent` | `read` | Get the currently authenticated Figma user |
| `variables.createModifyDelete` | `figma.api.variables.createModifyDelete` | `write` | Create, modify, or delete variables in a Figma file |
| `variables.getLocal` | `figma.api.variables.getLocal` | `read` | Get local variables from a Figma file |
| `variables.getPublished` | `figma.api.variables.getPublished` | `read` | Get published variables from a Figma file |
| `webhooks.create` | `figma.api.webhooks.create` | `write` | Create a Figma webhook |
| `webhooks.delete` | `figma.api.webhooks.delete` | `destructive` | Delete a Figma webhook [DESTRUCTIVE] |
| `webhooks.get` | `figma.api.webhooks.get` | `read` | Get a Figma webhook by ID |
| `webhooks.getRequests` | `figma.api.webhooks.getRequests` | `read` | Get webhook request history |
| `webhooks.list` | `figma.api.webhooks.list` | `read` | List Figma webhooks |
| `webhooks.update` | `figma.api.webhooks.update` | `write` | Update a Figma webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/figma

## License

Apache-2.0
