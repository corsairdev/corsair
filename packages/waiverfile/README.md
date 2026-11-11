# @corsair-dev/waiverfile

WaiverFile plugin for Corsair - read signed waivers and their PDFs, search and page through waiver data, manage events and event categories, list waiver forms, and subscribe URLs to WaiverFile webhooks.

## Install

```bash
pnpm add @corsair-dev/waiverfile
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `eventCategories.create` | `waiverfile.api.eventCategories.create` | `write` | Create an event category, active or not |
| `eventCategories.delete` | `waiverfile.api.eventCategories.delete` | `destructive` | Delete an event category; the events in it survive and lose their category |
| `eventCategories.list` | `waiverfile.api.eventCategories.list` | `read` | List event categories, optionally including disabled ones |
| `eventCategories.update` | `waiverfile.api.eventCategories.update` | `write` | Rename an event category and set whether it is active |
| `events.byCategory` | `waiverfile.api.events.byCategory` | `read` | List events in one category within a date range |
| `events.byDateRange` | `waiverfile.api.events.byDateRange` | `read` | List events in any category that fall within a date range |
| `events.create` | `waiverfile.api.events.create` | `write` | Create an event with its dates, category, attached forms and manager invitations; the credentials go in the body on this route |
| `events.delete` | `waiverfile.api.events.delete` | `destructive` | Delete an event permanently; the call is a GET, so it must not be replayed on a failure |
| `events.get` | `waiverfile.api.events.get` | `read` | Read one event with its forms, waivers and manager list |
| `events.inviteManagers` | `waiverfile.api.events.inviteManagers` | `write` | Invite people to manage an event, optionally skipping those who already have an account |
| `events.removeManagers` | `waiverfile.api.events.removeManagers` | `write` | Remove event manager access for the given addresses |
| `events.upcoming` | `waiverfile.api.events.upcoming` | `read` | List events within a date range, capped at 3,000 by the API |
| `events.update` | `waiverfile.api.events.update` | `write` | Change an event name, dates, category and attached forms, replacing the form list |
| `events.waivers` | `waiverfile.api.events.waivers` | `read` | List the waivers signed for one event |
| `forms.active` | `waiverfile.api.forms.active` | `read` | List the waiver forms currently active on the site |
| `forms.all` | `waiverfile.api.forms.all` | `read` | List every waiver form, including disabled and deleted ones, to resolve an older waiver |
| `ping.check` | `waiverfile.api.ping.check` | `read` | Check that the service is up and that the API key and site ID are valid; the cheapest way to verify credentials |
| `site.get` | `waiverfile.api.site.get` | `read` | Read the site behind the credentials: its name, timezone and contact details |
| `subscribers.list` | `waiverfile.api.subscribers.list` | `read` | List SMS subscribers added within a date range |
| `subscribers.optedOut` | `waiverfile.api.subscribers.optedOut` | `read` | List subscribers who opted out within a date range, which is what a suppression list needs |
| `waivers.byReference` | `waiverfile.api.waivers.byReference` | `read` | Find waivers by your own reference IDs, exactly matching any of the three fields |
| `waivers.data` | `waiverfile.api.waivers.data` | `read` | Read report-style rows, one per participant, optionally with custom form columns; pageIndex starts at 1 |
| `waivers.dataCount` | `waiverfile.api.waivers.dataCount` | `read` | Count the report rows a date range would return |
| `waivers.get` | `waiverfile.api.waivers.get` | `read` | Read a signed waiver in full: the agreement accepted, every participant, the signatures and the form answers |
| `waivers.getLite` | `waiverfile.api.waivers.getLite` | `read` | Read a signed waiver without the agreement text, event detail or signatures |
| `waivers.list` | `waiverfile.api.waivers.list` | `read` | Page through full waivers signed in a date range; pageIndex starts at 0 |
| `waivers.listLite` | `waiverfile.api.waivers.listLite` | `read` | Page through waivers signed in a date range, with the collected data only |
| `waivers.pageCount` | `waiverfile.api.waivers.pageCount` | `read` | Count the waivers in a date range, to plan the paging |
| `waivers.pdf` | `waiverfile.api.waivers.pdf` | `read` | Download a signed waiver as a PDF; the plugin reports the byte length rather than parsing the file |
| `waivers.search` | `waiverfile.api.waivers.search` | `read` | Search waivers by name, or by whatever the site configures as quick-search fields |
| `webhooks.subscribe` | `waiverfile.api.webhooks.subscribe` | `write` | Subscribe a URL to one WaiverFile trigger, such as newwaiver or newevent, so it is posted to on each occurrence |
| `webhooks.unsubscribe` | `waiverfile.api.webhooks.unsubscribe` | `write` | Unsubscribe a URL from one trigger, which stops its deliveries without touching any other URL |

## Auth

Auth: an API key and a site ID, packed into the one key slot as `<api key>\n<site ID>` with a real newline between them. A bare key is rejected before any request is sent. A call with no saved key throws `AuthMissingError`; store the packed value for the tenant, connect through Hub, or pass `waiverfile({ key })`.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/waiverfile

## License

Apache-2.0
