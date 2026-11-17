# Sendbird

The Sendbird plugin provides 15 Chat Platform API v3 operations for users, group channels, and messages. Configure `sendbird({ key, applicationId })` with a matching Sendbird API token and application ID, or store both for the same tenant. Verify that they belong to the intended application: Sendbird warns mismatched credentials may target the token's application.

Users and group channels use token pagination; message lists use a timestamp or message ID. Writes support JSON profiles and covers by URL, group channel creation by user IDs, and text messages only. File uploads, other message writes, and webhooks are not implemented. See the [source usage guide](https://github.com/corsairdev/corsair/blob/main/packages/sendbird/USAGE.md) for examples and details.

| Group | Operations |
| --- | --- |
| users | list, get, create, update, delete |
| channels | list, get, create, update, delete |
| messages | list, get, send, update, delete |

See the [Sendbird API reference](https://docs.sendbird.com/docs/chat/platform-api/v3/overview).
