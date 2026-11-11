# @corsair-dev/googleslides

Google Slides plugin for Corsair: create presentations, build slides, edit text and elements, read speaker notes, and export to PDF or PPTX.

## Install

```bash
pnpm add @corsair-dev/googleslides
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batch.update` | `googleslides.api.batch.update` | `destructive` | Apply raw Slides batchUpdate requests atomically, for operations without a typed endpoint. Deletions are refused; use the typed operation. |
| `elements.createImage` | `googleslides.api.elements.createImage` | `write` | Add an image to a slide from a public URL |
| `elements.createShape` | `googleslides.api.elements.createShape` | `write` | Add a shape or text box to a slide |
| `elements.createTable` | `googleslides.api.elements.createTable` | `write` | Add an empty table to a slide |
| `elements.group` | `googleslides.api.elements.group` | `write` | Group page elements into one object |
| `elements.setAltText` | `googleslides.api.elements.setAltText` | `write` | Set the alt text on a page element |
| `elements.ungroup` | `googleslides.api.elements.ungroup` | `write` | Ungroup previously grouped page elements |
| `elements.updateTransform` | `googleslides.api.elements.updateTransform` | `write` | Move, scale or rotate a page element |
| `elements.zOrder` | `googleslides.api.elements.zOrder` | `write` | Change which elements sit in front of others |
| `presentations.copy` | `googleslides.api.presentations.copy` | `write` | Copy a presentation to a new file |
| `presentations.create` | `googleslides.api.presentations.create` | `write` | Create a blank presentation |
| `presentations.delete` | `googleslides.api.presentations.delete` | `destructive` | Permanently delete a presentation from Drive, without using the trash [DESTRUCTIVE · IRREVERSIBLE] |
| `presentations.exportPdf` | `googleslides.api.presentations.exportPdf` | `read` | Export a presentation to PDF or PPTX as base64 |
| `presentations.get` | `googleslides.api.presentations.get` | `read` | Read a presentation with slide and layout counts |
| `presentations.list` | `googleslides.api.presentations.list` | `read` | List presentations in Drive, filtered and paged |
| `slides.create` | `googleslides.api.slides.create` | `write` | Add a slide from a predefined or named layout |
| `slides.duplicate` | `googleslides.api.slides.duplicate` | `write` | Duplicate a slide |
| `slides.get` | `googleslides.api.slides.get` | `read` | Read one slide with its page elements |
| `slides.getNotes` | `googleslides.api.slides.getNotes` | `read` | Read the speaker notes on a slide |
| `slides.getThumbnail` | `googleslides.api.slides.getThumbnail` | `read` | Get a signed thumbnail URL for a slide, valid 30 minutes |
| `slides.list` | `googleslides.api.slides.list` | `read` | List the slides in a presentation, in order |
| `slides.move` | `googleslides.api.slides.move` | `write` | Move slides to a new position |
| `slides.remove` | `googleslides.api.slides.remove` | `destructive` | Delete a slide from a presentation [DESTRUCTIVE · IRREVERSIBLE] |
| `slides.setNotes` | `googleslides.api.slides.setNotes` | `write` | Replace the speaker notes on a slide |
| `slides.setSkipped` | `googleslides.api.slides.setSkipped` | `write` | Mark a slide skipped or unskipped in presentation mode |
| `text.createBullets` | `googleslides.api.text.createBullets` | `write` | Turn paragraphs into a bulleted or numbered list |
| `text.delete` | `googleslides.api.text.delete` | `destructive` | Delete a range of text from a shape or table cell |
| `text.insert` | `googleslides.api.text.insert` | `write` | Insert text into a shape or table cell |
| `text.removeBullets` | `googleslides.api.text.removeBullets` | `write` | Remove list formatting from paragraphs |
| `text.replaceAll` | `googleslides.api.text.replaceAll` | `write` | Find and replace text across slides, by string or regex |
| `text.updateStyle` | `googleslides.api.text.updateStyle` | `write` | Apply text styling such as bold, size or colour |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googleslides

## License

Apache-2.0
