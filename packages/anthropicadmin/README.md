# Anthropic Administrator Integration

This plugin integrates the [Anthropic Admin API](https://docs.anthropic.com/en/api/admin-api) with Corsair. It enables organization-level administrative actions, such as managing workspaces and members.

## Authentication

This integration uses the `api_key` authentication method.
You must provide an **Admin API Key** (typically prefixed with `sk-ant-admin...`), which is different from a standard inference API key.
You can generate this key in the [Anthropic Console](https://console.anthropic.com/) under **Organization Settings** -> **Admin Keys**.

## Endpoints

Currently supported endpoints:
- `workspaces.list`: Fetch a list of all workspaces within the organization.

## Webhooks

The Anthropic Admin API does not currently rely on webhooks for administrative events, so none are implemented at this time.
