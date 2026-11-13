# Sendbird Chat

This integration covers 15 Sendbird Chat Platform API v3 operations: list, get, create, update, and delete users and group channels; list, get, send, update, and delete messages. See the [official API reference](https://docs.sendbird.com/docs/chat/platform-api/v3/overview).

The generated docs require a manual correction after regeneration: API handlers do not automatically populate or sync the local database entities, and both the API token and application ID are required.

Configure the API token and its application ID together. With managed credentials, set `api_key` and `applicationId` on the same tenant; alternatively pass both `key` and `applicationId` to `sendbird()`. A registration token takes precedence and fails if its registration application ID is missing; registration application IDs are never mixed with tenant tokens. Sendbird warns that mismatched pairs may currently affect the token's application rather than the URL's application: verify that both values belong to the intended application.

```ts
import { sendbird } from '@corsair-dev/sendbird';

const plugin = sendbird({ applicationId: process.env.SENDBIRD_APP_ID, key: process.env.SENDBIRD_API_TOKEN });
```

After registering the plugin with Corsair, a text-message workflow can use:

```ts
await corsair.sendbird.api.users.create({ user_id: 'user-1', nickname: 'A', profile_url: '' });
await corsair.sendbird.api.channels.create({ user_ids: ['user-1'], channel_url: 'room-1' });
await corsair.sendbird.api.messages.send({
  channel_type: 'group_channels', channel_url: 'room-1',
  body: { message_type: 'MESG', user_id: 'user-1', message: 'Hello!' },
});
```

Users and group channels use `token` and `next` for pagination. Message lists require `message_ts` or `message_id` and support `prev_limit` and `next_limit`. Deletes return `undefined`. The integration does not automatically retry writes, including rate-limited requests.

The initial write scope is JSON only: user profiles and channel covers use URLs, group channel creation uses `user_ids`, and message send/update accepts `message_type: 'MESG'` text messages. The alternative `users` channel-creation form, file uploads, file/admin message writes, advanced text message options such as push templates and sorted metaarrays, other API families, moderation, bots, outbound webhook management, and inbound webhooks are not implemented. Message reads can return other message types.

Use unescaped query values; Corsair URL-encodes them, including comma-separated filters. List members containing literal commas are not supported by these string filters. Provider identifiers are validated as individual path components before encoding.
