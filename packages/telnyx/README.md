# @corsair-dev/telnyx

Telnyx plugin for Corsair: send SMS and MMS, manage messaging profiles and phone numbers, search available numbers, place and control calls, and manage call control applications.

## Install

```bash
pnpm add @corsair-dev/telnyx
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `availablePhoneNumbers.list` | `telnyx.api.availablePhoneNumbers.list` | `read` | Search the numbers available to buy in a country, filtered by area code, locality or type |
| `callControlApplications.create` | `telnyx.api.callControlApplications.create` | `write` | Create a call control application, which is what calls.create dials through |
| `callControlApplications.delete` | `telnyx.api.callControlApplications.delete` | `destructive` | Delete a call control application; calls that reference it stop working |
| `callControlApplications.get` | `telnyx.api.callControlApplications.get` | `read` | Read one call control application by ID |
| `callControlApplications.list` | `telnyx.api.callControlApplications.list` | `read` | List the call control applications with their webhook URLs |
| `callControlApplications.update` | `telnyx.api.callControlApplications.update` | `write` | Change an application's webhook URL, name or active state |
| `calls.create` | `telnyx.api.calls.create` | `write` | Place an outbound call through a call control application, which dials the number and bills per minute |
| `calls.get` | `telnyx.api.calls.get` | `read` | Read one call with its state, direction and timestamps |
| `calls.hangup` | `telnyx.api.calls.hangup` | `write` | Hang up an active call, ending it for both legs |
| `calls.speak` | `telnyx.api.calls.speak` | `write` | Read text aloud on an active call using text to speech |
| `messages.delete` | `telnyx.api.messages.delete` | `destructive` | Delete a message record from the messaging log; the message itself was already delivered or failed |
| `messages.get` | `telnyx.api.messages.get` | `read` | Read one message with its delivery status, parts, cost and any errors |
| `messages.send` | `telnyx.api.messages.send` | `write` | Send an SMS or MMS from a Telnyx number, charging the account per part; text or at least one media URL is required |
| `messagingProfiles.create` | `telnyx.api.messagingProfiles.create` | `write` | Create a messaging profile, which groups numbers and sets where inbound messages are delivered |
| `messagingProfiles.delete` | `telnyx.api.messagingProfiles.delete` | `destructive` | Delete a messaging profile, which detaches its numbers and stops inbound delivery |
| `messagingProfiles.get` | `telnyx.api.messagingProfiles.get` | `read` | Read one messaging profile by ID |
| `messagingProfiles.list` | `telnyx.api.messagingProfiles.list` | `read` | List the messaging profiles with their webhook destination and enabled state |
| `messagingProfiles.update` | `telnyx.api.messagingProfiles.update` | `write` | Change a profile's name, webhook destination or whitelisted destinations |
| `phoneNumbers.delete` | `telnyx.api.phoneNumbers.delete` | `destructive` | Release a phone number from the account; it cannot be recovered once released |
| `phoneNumbers.get` | `telnyx.api.phoneNumbers.get` | `read` | Read one phone number record by ID |
| `phoneNumbers.list` | `telnyx.api.phoneNumbers.list` | `read` | List the numbers on the account with their connection and messaging profile |
| `phoneNumbers.update` | `telnyx.api.phoneNumbers.update` | `write` | Attach a number to a call control or messaging application, set its emergency address, or retag it |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/telnyx

## License

Apache-2.0
