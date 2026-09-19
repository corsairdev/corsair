# @corsair-dev/ably

Ably plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ably
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `application.getServiceTime` | `ably.api.application.getServiceTime` | `read` | Get the current Ably service time. |
| `application.getStats` | `ably.api.application.getStats` | `read` | Retrieve application usage statistics. |
| `application.requestAccessToken` | `ably.api.application.requestAccessToken` | `write` | Request an Ably access token. |
| `channels.batchPresence` | `ably.api.channels.batchPresence` | `read` | Retrieve presence information for multiple channels. |
| `channels.batchPresenceHistory` | `ably.api.channels.batchPresenceHistory` | `read` | Retrieve presence history for multiple channels. |
| `channels.getChannelDetails` | `ably.api.channels.getChannelDetails` | `read` | Retrieve details for an active channel. |
| `channels.getChannelHistory` | `ably.api.channels.getChannelHistory` | `read` | Retrieve message history for a channel. |
| `channels.getChannelPresence` | `ably.api.channels.getChannelPresence` | `read` | Retrieve current channel presence members. |
| `channels.getMessageVersions` | `ably.api.channels.getMessageVersions` | `read` | Retrieve historical versions of a message. |
| `channels.getPresenceHistory` | `ably.api.channels.getPresenceHistory` | `read` | Retrieve presence history for a channel. |
| `channels.listChannels` | `ably.api.channels.listChannels` | `read` | List active Ably channels. |
| `channels.publishBatchMessages` | `ably.api.channels.publishBatchMessages` | `write` | Publish messages to multiple Ably channels. |
| `channels.publishMessageToChannel` | `ably.api.channels.publishMessageToChannel` | `write` | Publish a message to an Ably channel. |
| `push.createPushChannelSubscription` | `ably.api.push.createPushChannelSubscription` | `write` | Subscribe a device or client to a push channel. |
| `push.deleteChannelSubscription` | `ably.api.push.deleteChannelSubscription` | `destructive` | Delete matching push channel subscriptions. |
| `push.getPushDevice` | `ably.api.push.getPushDevice` | `read` | Retrieve a push device registration. |
| `push.listPushChannels` | `ably.api.push.listPushChannels` | `read` | List channels with push subscribers. |
| `push.listPushChannelSubscriptions` | `ably.api.push.listPushChannelSubscriptions` | `read` | List push channel subscriptions. |
| `push.listRegisteredPushDevices` | `ably.api.push.listRegisteredPushDevices` | `read` | List registered push notification devices. |
| `push.patchPushDeviceRegistration` | `ably.api.push.patchPushDeviceRegistration` | `write` | Partially update a push device registration. |
| `push.publishPushNotification` | `ably.api.push.publishPushNotification` | `write` | Publish a push notification. |
| `push.publishPushNotificationsBatch` | `ably.api.push.publishPushNotificationsBatch` | `write` | Publish a batch of push notifications. |
| `push.registerPushDevice` | `ably.api.push.registerPushDevice` | `write` | Register a device for push notifications. |
| `push.unregisterAllPushDevices` | `ably.api.push.unregisterAllPushDevices` | `destructive` | Delete matching push device registrations. |
| `push.unregisterPushDevice` | `ably.api.push.unregisterPushDevice` | `destructive` | Delete a push device registration. |
| `push.updatePushDevice` | `ably.api.push.updatePushDevice` | `write` | Create or replace a push device registration. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ably

## License

Apache-2.0
