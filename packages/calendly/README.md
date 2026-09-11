# @corsair-dev/calendly

Calendly plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/calendly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activityLog.list` | `calendly.api.activityLog.list` | `read` | List activity log entries for an organization |
| `activityLog.listOutgoingCommunications` | `calendly.api.activityLog.listOutgoingCommunications` | `read` | List outgoing communications for an organization |
| `eventTypes.create` | `calendly.api.eventTypes.create` | `write` | Create a new event type |
| `eventTypes.createOneOff` | `calendly.api.eventTypes.createOneOff` | `write` | Create a one-off event type |
| `eventTypes.get` | `calendly.api.eventTypes.get` | `read` | Get an event type by UUID |
| `eventTypes.list` | `calendly.api.eventTypes.list` | `read` | List all event types |
| `eventTypes.listAvailableTimes` | `calendly.api.eventTypes.listAvailableTimes` | `read` | List available times for an event type |
| `eventTypes.listHosts` | `calendly.api.eventTypes.listHosts` | `read` | List hosts for an event type |
| `eventTypes.update` | `calendly.api.eventTypes.update` | `write` | Update an event type |
| `eventTypes.updateAvailability` | `calendly.api.eventTypes.updateAvailability` | `write` | Update availability for an event type |
| `groups.get` | `calendly.api.groups.get` | `read` | Get a group by UUID |
| `groups.getRelationship` | `calendly.api.groups.getRelationship` | `read` | Get a group relationship by UUID |
| `groups.list` | `calendly.api.groups.list` | `read` | List groups in an organization |
| `groups.listRelationships` | `calendly.api.groups.listRelationships` | `read` | List relationships for a group |
| `invitees.create` | `calendly.api.invitees.create` | `write` | Create an invitee for a one-off event type |
| `invitees.deleteData` | `calendly.api.invitees.deleteData` | `destructive` | Delete all data for specified invitee emails [DESTRUCTIVE] |
| `invitees.deleteNoShow` | `calendly.api.invitees.deleteNoShow` | `destructive` | Delete an invitee no-show record [DESTRUCTIVE] |
| `invitees.get` | `calendly.api.invitees.get` | `read` | Get an event invitee by UUID |
| `invitees.getNoShow` | `calendly.api.invitees.getNoShow` | `read` | Get an invitee no-show record |
| `invitees.list` | `calendly.api.invitees.list` | `read` | List invitees for a scheduled event |
| `invitees.markNoShow` | `calendly.api.invitees.markNoShow` | `write` | Mark an invitee as a no-show |
| `organizations.deleteMembership` | `calendly.api.organizations.deleteMembership` | `destructive` | Delete an organization membership [DESTRUCTIVE] |
| `organizations.get` | `calendly.api.organizations.get` | `read` | Get an organization by UUID |
| `organizations.getInvitation` | `calendly.api.organizations.getInvitation` | `read` | Get an organization invitation |
| `organizations.getMembership` | `calendly.api.organizations.getMembership` | `read` | Get an organization membership |
| `organizations.invite` | `calendly.api.organizations.invite` | `write` | Invite a user to an organization |
| `organizations.listInvitations` | `calendly.api.organizations.listInvitations` | `read` | List organization invitations |
| `organizations.listMemberships` | `calendly.api.organizations.listMemberships` | `read` | List organization memberships |
| `organizations.removeMember` | `calendly.api.organizations.removeMember` | `destructive` | Remove a user from the organization [DESTRUCTIVE] |
| `organizations.revokeInvitation` | `calendly.api.organizations.revokeInvitation` | `destructive` | Revoke a user's organization invitation [DESTRUCTIVE] |
| `routingForms.get` | `calendly.api.routingForms.get` | `read` | Get a routing form by UUID |
| `routingForms.getSampleWebhookData` | `calendly.api.routingForms.getSampleWebhookData` | `read` | Get sample webhook data for an event type |
| `routingForms.getSubmission` | `calendly.api.routingForms.getSubmission` | `read` | Get a routing form submission by UUID |
| `routingForms.list` | `calendly.api.routingForms.list` | `read` | List routing forms in an organization |
| `scheduledEvents.cancel` | `calendly.api.scheduledEvents.cancel` | `destructive` | Cancel a scheduled event [DESTRUCTIVE] |
| `scheduledEvents.deleteData` | `calendly.api.scheduledEvents.deleteData` | `destructive` | Delete all scheduled event data in a time range [DESTRUCTIVE] |
| `scheduledEvents.get` | `calendly.api.scheduledEvents.get` | `read` | Get a scheduled event by UUID |
| `scheduledEvents.list` | `calendly.api.scheduledEvents.list` | `read` | List all scheduled events |
| `schedulingLinks.create` | `calendly.api.schedulingLinks.create` | `write` | Create a scheduling link |
| `schedulingLinks.createShare` | `calendly.api.schedulingLinks.createShare` | `write` | Create a share link for an event type |
| `schedulingLinks.createSingleUse` | `calendly.api.schedulingLinks.createSingleUse` | `write` | Create a single-use scheduling link |
| `users.get` | `calendly.api.users.get` | `read` | Get a user by UUID |
| `users.getAvailabilitySchedule` | `calendly.api.users.getAvailabilitySchedule` | `read` | Get a user availability schedule |
| `users.getCurrent` | `calendly.api.users.getCurrent` | `read` | Get the currently authenticated user (deprecated) |
| `users.listAvailabilitySchedules` | `calendly.api.users.listAvailabilitySchedules` | `read` | List all availability schedules for a user |
| `users.listBusyTimes` | `calendly.api.users.listBusyTimes` | `read` | List busy times for a user |
| `users.listEventTypes` | `calendly.api.users.listEventTypes` | `read` | List event types for a user (deprecated) |
| `users.listMeetingLocations` | `calendly.api.users.listMeetingLocations` | `read` | List meeting locations for a user |
| `webhookSubscriptions.create` | `calendly.api.webhookSubscriptions.create` | `write` | Create a webhook subscription |
| `webhookSubscriptions.delete` | `calendly.api.webhookSubscriptions.delete` | `destructive` | Delete a webhook subscription [DESTRUCTIVE] |
| `webhookSubscriptions.get` | `calendly.api.webhookSubscriptions.get` | `read` | Get a webhook subscription by UUID |
| `webhookSubscriptions.list` | `calendly.api.webhookSubscriptions.list` | `read` | List webhook subscriptions |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/calendly

## License

Apache-2.0
