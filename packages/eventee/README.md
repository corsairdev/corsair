# @corsair-dev/eventee

Eventee's public REST API plugin for managing an event program and its related content, partners, attendees, registrations and reviews.

## Install and authenticate

```bash
pnpm add @corsair-dev/eventee
```

Create an API token in the Eventee admin settings for the event, then configure it as the plugin's API key. Requests use `Authorization: Bearer <token>`; the token scopes every operation to one event. API access is available on selected Eventee plans. Treat the token as a secret: it allows reading and modifying that event.

## Coverage

The plugin implements all 31 REST operations in the [official Eventee Public API OpenAPI specification](https://docs.eventee.com/openapi.yaml), using its `https://eventee.com/public/api/v1` routes. All request inputs are strict Zod objects and all responses are validated. The API publishes no pagination parameters; list operations return the full collection. No SSE or binary endpoints are documented, and the OpenAPI specification defines no inbound webhook contract.

| Operation | Method and path |
| --- | --- |
| `content.get` | `GET /public/api/v1/content` |
| `contentReset.delete` | `DELETE /public/api/v1/test/content` |
| `hall.post` | `POST /public/api/v1/hall` |
| `hall.patch` | `PATCH /public/api/v1/hall/{hall_id}` |
| `hall.delete` | `DELETE /public/api/v1/hall/{hall_id}` |
| `session.post` | `POST /public/api/v1/lecture` |
| `session.patch` | `PATCH /public/api/v1/lecture/{lecture_id}` |
| `session.delete` | `DELETE /public/api/v1/lecture/{lecture_id}` |
| `pause.post` | `POST /public/api/v1/pause` |
| `pause.patch` | `PATCH /public/api/v1/pause/{pause_id}` |
| `pause.delete` | `DELETE /public/api/v1/pause/{pause_id}` |
| `speaker.post` | `POST /public/api/v1/speaker` |
| `speaker.patch` | `PATCH /public/api/v1/speaker/{speakerTmp_id}` |
| `speaker.delete` | `DELETE /public/api/v1/speaker/{speakerTmp_id}` |
| `label.post` | `POST /public/api/v1/label` |
| `label.patch` | `PATCH /public/api/v1/label/{track_id}` |
| `label.delete` | `DELETE /public/api/v1/label/{track_id}` |
| `partner.post` | `POST /public/api/v1/partner` |
| `partner.patch` | `PATCH /public/api/v1/partner/{partner_id}` |
| `partner.delete` | `DELETE /public/api/v1/partner/{partner_id}` |
| `partnerSections.patch` | `PATCH /public/api/v1/partner/{partner_id}/sections` |
| `partner.get` | `GET /public/api/v1/partners` |
| `attendeeInvite.put` | `PUT /public/api/v1/attendee/invite` |
| `attendeeCheckIn.patch` | `PATCH /public/api/v1/attendee/{attendee_id}/checkin` |
| `attendees.get` | `GET /public/api/v1/participants` |
| `attendees.delete` | `DELETE /public/api/v1/attendee?email=…` |
| `registrationInvite.put` | `PUT /public/api/v1/registration/invite` |
| `registrations.get` | `GET /public/api/v1/registrations` |
| `registrations.delete` | `DELETE /public/api/v1/registration?email=…` |
| `groups.get` | `GET /public/api/v1/groups` |
| `reviews.get` | `GET /public/api/v1/reviews` |

## Behavior and limitations

- Eventee limits requests to 200 per minute. The documented limit response is HTTP 400 without `Retry-After`; pause bulk jobs until the 60-second window resets rather than retrying automatically.
- Attendee invitations and registrations process the first 25 entries immediately and the rest in the background. Eventee silently skips invalid entries; invitation also skips event admins and moderators.
- Destructive operations are marked `destructive`. In particular, deleting a hall removes its sessions, deleting a session removes its related questions/polls/bookings/ratings, and deleting all test content removes all sessions, breaks, halls, speakers and labels. Inviting attendees and creating registrations are `destructive` too, because `send_email: true` emails each person.
- Eventee accepts image/file URLs for some partner and speaker content and downloads those assets itself. The API returns JSON, not file bytes.
- No documented REST operation is excluded. No webhook support is included because the official OpenAPI documents no webhook contract.

## Reference

- [Eventee Public API](https://docs.eventee.com)
- [Official OpenAPI](https://docs.eventee.com/openapi.yaml)

## License

Apache-2.0
