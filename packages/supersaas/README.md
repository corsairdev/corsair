# @corsair-dev/supersaas

Online appointment scheduling from SuperSaaS: manage users, bookings and capacity slots, read schedule changes and availability, and look up a user agenda.

## Install

```bash
pnpm add @corsair-dev/supersaas
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bookings.create` | `supersaas.api.bookings.create` | `destructive` | Book an appointment. A resource schedule needs start and finish, a capacity schedule needs a slot id, and the two are not interchangeable |
| `bookings.delete` | `supersaas.api.bookings.delete` | `destructive` | Delete a booking, which frees its time for someone else and cannot be undone |
| `bookings.get` | `supersaas.api.bookings.get` | `read` | Read a single booking by id |
| `bookings.list` | `supersaas.api.bookings.list` | `read` | List bookings for a schedule, optionally within a start and finish window (resource and service schedules) |
| `bookings.update` | `supersaas.api.bookings.update` | `destructive` | Change a booking's time or details |
| `schedules.agenda` | `supersaas.api.schedules.agenda` | `read` | Read one user's appointments, either within a schedule or across the account |
| `schedules.changes` | `supersaas.api.schedules.changes` | `read` | Read the changes to a schedule since a time, which is how a sync catches up; omitting the time gives the ten most recent |
| `schedules.free` | `supersaas.api.schedules.free` | `read` | Read the free spaces in a schedule after a time, which is the availability check |
| `schedules.range` | `supersaas.api.schedules.range` | `read` | List the appointments in a schedule between two times |
| `slots.create` | `supersaas.api.slots.create` | `write` | Create a slot on a capacity schedule, which appointments are then booked into |
| `slots.delete` | `supersaas.api.slots.delete` | `destructive` | Delete a slot and the capacity it offered, and this cannot be undone |
| `slots.get` | `supersaas.api.slots.get` | `read` | Read one slot with its capacity and how many places are taken |
| `slots.list` | `supersaas.api.slots.list` | `read` | List the slots of a capacity schedule in a time window |
| `slots.update` | `supersaas.api.slots.update` | `write` | Change a slot's time or capacity |
| `users.create` | `supersaas.api.users.create` | `write` | Create a user. The name is the login name and is the only required field; SuperSaaS assigns the id and returns it in a Location header |
| `users.createWithKey` | `supersaas.api.users.createWithKey` | `write` | Create a user under a key you choose. Reusing that key updates the existing record instead of creating another |
| `users.delete` | `supersaas.api.users.delete` | `destructive` | Delete a user. Their login stops working and their bookings lose the link, and this cannot be undone |
| `users.get` | `supersaas.api.users.get` | `read` | Read one user by SuperSaaS id or by your own key in the form 1234fk |
| `users.list` | `supersaas.api.users.list` | `read` | List the users on the account, paging with limit and offset; more than 1000 records needs offset |
| `users.update` | `supersaas.api.users.update` | `write` | Update a user. A PUT to an unknown id creates it unless notfound says otherwise, so an update can silently become a create |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/supersaas

## License

Apache-2.0
