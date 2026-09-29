# @corsair-dev/whautomate

Whautomate plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/whautomate
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getAccountInfo` | `whautomate.api.account.getAccountInfo` | `read` | Fetch account name and owner email |
| `broadcasts.getBroadcastById` | `whautomate.api.broadcasts.getBroadcastById` | `read` | Fetch a single broadcast by ID |
| `broadcasts.getBroadcasts` | `whautomate.api.broadcasts.getBroadcasts` | `read` | List broadcasts with status and date filters |
| `contacts.addContact` | `whautomate.api.contacts.addContact` | `write` | Create a new contact |
| `contacts.getContacts` | `whautomate.api.contacts.getContacts` | `read` | List contacts with pagination and filters |
| `contacts.getMessagesOfContact` | `whautomate.api.contacts.getMessagesOfContact` | `read` | Get chat messages for a contact with pagination and date filters |
| `segments.deleteSegment` | `whautomate.api.segments.deleteSegment` | `destructive` | Delete a segment by ID |
| `segments.getSegments` | `whautomate.api.segments.getSegments` | `read` | List segments with name filter and pagination |
| `serviceCategories.deleteServiceCategory` | `whautomate.api.serviceCategories.deleteServiceCategory` | `destructive` | Delete a service category by ID |
| `serviceCategories.getServiceCategories` | `whautomate.api.serviceCategories.getServiceCategories` | `read` | List service categories with pagination |
| `services.getServiceById` | `whautomate.api.services.getServiceById` | `read` | Fetch a single service by ID |
| `services.getServices` | `whautomate.api.services.getServices` | `read` | List services with filters |
| `services.updateService` | `whautomate.api.services.updateService` | `write` | Update service name, pricing, duration, and active status |
| `staff.getStaffAvailabilityBlocks` | `whautomate.api.staff.getStaffAvailabilityBlocks` | `read` | Get staff availability blocks by date range |
| `staff.getStaffById` | `whautomate.api.staff.getStaffById` | `read` | Fetch a single staff member by ID |
| `staff.getStaffs` | `whautomate.api.staff.getStaffs` | `read` | List staff members with pagination and search |
| `webhooks.getAllWebhooks` | `whautomate.api.webhooks.getAllWebhooks` | `read` | Retrieve registered webhooks |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/whautomate

## License

Apache-2.0
