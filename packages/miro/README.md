# @corsair-dev/miro

Miro plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/miro
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `boards.copy` | `miro.api.boards.copy` | `write` | Copy an existing board, including its content, into a new board with its own name and team |
| `boards.create` | `miro.api.boards.create` | `write` | Create a board with a name, description and sharing policy, optionally in a given team or project |
| `boards.get` | `miro.api.boards.get` | `read` | Read one board: its name, owner, team, project, sharing policy and the membership of the calling user |
| `boards.list` | `miro.api.boards.list` | `read` | List the boards the token can reach, filtered by team, project, owner or name, with offset paging |
| `boards.remove` | `miro.api.boards.remove` | `destructive` | Delete a board and everything on it; Miro moves it to Trash, where an owner can restore it in the Miro UI for 90 days, but there is no API call to do so |
| `boards.update` | `miro.api.boards.update` | `write` | Change a board name, description or sharing policy; the policy controls who can view, comment and edit |
| `cards.create` | `miro.api.cards.create` | `write` | Add a card with a title, description, due date and assignee, for task boards |
| `cards.update` | `miro.api.cards.update` | `write` | Change a card title, description, due date, assignee or position |
| `connectors.create` | `miro.api.connectors.create` | `write` | Connect two existing items with an arrow, line style, caps and captions; both endpoints must already exist |
| `connectors.get` | `miro.api.connectors.get` | `read` | Read one connector by id |
| `connectors.list` | `miro.api.connectors.list` | `read` | Page through the connectors on a board, with their endpoints and style |
| `connectors.remove` | `miro.api.connectors.remove` | `destructive` | Delete a connector; the two items it joined stay on the board |
| `connectors.update` | `miro.api.connectors.update` | `write` | Change a connector shape, stroke style or captions |
| `embeds.create` | `miro.api.embeds.create` | `write` | Embed content from a URL, such as a video or a web page |
| `embeds.update` | `miro.api.embeds.update` | `write` | Change an embed URL, mode, position or size |
| `frames.create` | `miro.api.frames.create` | `write` | Add a frame, which groups other items into a region such as a section or a slide |
| `frames.update` | `miro.api.frames.update` | `write` | Change a frame title, position, size or whether it shows its content |
| `items.get` | `miro.api.items.get` | `read` | Read one item by id, whatever its kind: sticky note, shape, card, text, frame, embed or connector |
| `items.list` | `miro.api.items.list` | `read` | Page through a board items, optionally only one type or only what sits inside a frame |
| `items.remove` | `miro.api.items.remove` | `destructive` | Delete any board item by id; its content cannot be restored |
| `members.get` | `miro.api.members.get` | `read` | Read one board member's role and details |
| `members.list` | `miro.api.members.list` | `read` | List who has access to a board, with their role |
| `members.remove` | `miro.api.members.remove` | `destructive` | Remove a member's access to a board; their role cannot be restored by another call |
| `members.share` | `miro.api.members.share` | `write` | Invite email addresses to a board with a role, which grants them access to its content |
| `members.update` | `miro.api.members.update` | `write` | Change a board member's role, for example promoting a viewer to an editor |
| `shapes.create` | `miro.api.shapes.create` | `write` | Draw a shape such as a rectangle, circle or flowchart node, with text and styling, for diagrams |
| `shapes.update` | `miro.api.shapes.update` | `write` | Change a shape text, style, position or size |
| `stickyNotes.create` | `miro.api.stickyNotes.create` | `write` | Add a sticky note with text, shape and colour at a position, optionally inside a frame |
| `stickyNotes.update` | `miro.api.stickyNotes.update` | `write` | Change a sticky note text, shape, colour, position or size |
| `tags.attach` | `miro.api.tags.attach` | `write` | Attach an existing tag to an item; card and sticky items accept up to eight |
| `tags.create` | `miro.api.tags.create` | `write` | Create a tag with a title and colour for categorising board items |
| `tags.get` | `miro.api.tags.get` | `read` | Read one tag by id, with its title, colour and links |
| `tags.items` | `miro.api.tags.items` | `read` | List the items that carry a given tag, with offset paging |
| `tags.list` | `miro.api.tags.list` | `read` | List the tags defined on a board, with their colours |
| `tags.ofItem` | `miro.api.tags.ofItem` | `read` | List the tags attached to one item |
| `tags.remove` | `miro.api.tags.remove` | `destructive` | Delete a tag from the board; it is detached from every item that carried it |
| `tags.removeFromItem` | `miro.api.tags.removeFromItem` | `destructive` | Detach a tag from one item; the tag itself stays on the board |
| `tags.update` | `miro.api.tags.update` | `write` | Change a tag title or colour |
| `texts.create` | `miro.api.texts.create` | `write` | Add a text item, for labels and annotations |
| `texts.update` | `miro.api.texts.update` | `write` | Change a text item content, style, position or size |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/miro

## License

Apache-2.0
