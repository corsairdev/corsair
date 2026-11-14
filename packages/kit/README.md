# @corsair-dev/kit

Kit plugin for Corsair: manage subscribers, tags, custom fields and forms, subscribe an address through a form, unsubscribe a subscriber, and read the account with its plan and sending addresses.

## Install

```bash
pnpm add @corsair-dev/kit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `kit.api.account.get` | `read` | The account and its user: plan, primary address, timezone and the sending addresses with their verification and DMARC status |
| `customFields.create` | `kit.api.customFields.create` | `write` | Create a custom field; Kit derives its `key` from the label |
| `customFields.list` | `kit.api.customFields.list` | `read` | Every custom field with the `key` a subscriber’s `fields` map uses |
| `customFields.update` | `kit.api.customFields.update` | `write` | Change a custom field’s label |
| `forms.list` | `kit.api.forms.list` | `read` | Forms by status, cursor-paged, optionally with each one’s subscriber count |
| `forms.subscribe` | `kit.api.forms.subscribe` | `destructive` | Add an existing subscriber to a form, which applies the form’s incentive and records when they were added. Create the subscriber first |
| `subscribers.create` | `kit.api.subscribers.create` | `write` | Create a subscriber, or return the existing one for an address already on the list. Unknown custom field keys are ignored and named in `warnings` |
| `subscribers.get` | `kit.api.subscribers.get` | `read` | One subscriber with their custom field values and location |
| `subscribers.list` | `kit.api.subscribers.list` | `read` | Subscribers by state, address or date, cursor-paged, with optional attribution, tags and location |
| `subscribers.unsubscribe` | `kit.api.subscribers.unsubscribe` | `destructive` | Unsubscribe a subscriber, which stops every future send to them; re-subscribing takes their own action, not a call |
| `subscribers.update` | `kit.api.subscribers.update` | `write` | Change a subscriber’s address, first name or custom field values |
| `tags.create` | `kit.api.tags.create` | `write` | Create a tag, or return the existing one when the name is taken |
| `tags.list` | `kit.api.tags.list` | `read` | Every tag, optionally with its active subscriber count |
| `tags.tagSubscriber` | `kit.api.tags.tagSubscriber` | `write` | Add a tag to an existing subscriber, found by email address |
| `tags.untagSubscriber` | `kit.api.tags.untagSubscriber` | `write` | Remove a tag from a subscriber, found by email address |
| `tags.update` | `kit.api.tags.update` | `write` | Rename a tag |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/kit

## License

Apache-2.0
