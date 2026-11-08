# Plugin icon sources

Our own vector icons, one `<id>.svg` per plugin. `pnpm fetch:plugin-icons` serves
these as `explorer/icons/<id>.svg` and renders `<id>.png` (and `<id>.dark.png` for
largely black marks) from them on every run, without the network. A plugin with
no file here keeps a downloaded PNG.

## Adding or replacing an icon

```sh
pnpm import:plugin-icon -- <id> <url-or-file> [--note="what you changed"]
pnpm fetch:plugin-icons
```

The import sanitizes the file, refuses traces, sets a square viewBox tight around
the mark, drops the fixed size and comments, and records the source in
`SOURCES.json`. Edit the result by hand when needed (remove a wordmark or a ®,
inline a stylesheet, fix a colour) and say what you changed in `note`.

Before committing, look at the icon at full size (256px) and at 26px (Lug's
picker), next to the brand's own site icon:

- It is the brand's current mark, not an older logo or a different company with
  the same name.
- It is drawn, not traced. The import and CI refuse automatic raster-to-vector
  traces (a viewBox like `0.00 0.00 256.00 256.00`, hundreds of short rotated
  arcs, `vector-effect="non-scaling-stroke"`), AI redraws (QuiverAI) and rasters
  wrapped in SVG.
- No white background square: it shows as a white box on dark surfaces.

Good sources, best first: the brand's own SVG (press kit, the site's
`favicon.svg` or `icon.svg`), [svgl](https://svgl.app), the drawn files in
Composio's [logo-cdn](https://github.com/ComposioHQ/logo-cdn), and
[Simple Icons](https://simpleicons.org) for single-colour marks. Sites that only
serve a placeholder favicon (create-next-app's triangle, a parked-domain icon, a
globe) are no evidence of the brand's mark.

## Licences

Logos are trademarks of their owners and are used to identify the services the
plugins connect to. The files here were cleaned up from:

- Composio logo-cdn, MIT, Copyright (c) 2025 Composio (licence below).
- svgl, MIT, Copyright (c) 2022 Pablo Hdez.
- Simple Icons, CC0 1.0.
- The brands' own sites and Wikimedia Commons, as listed in `SOURCES.json`.

<details>
<summary>Composio logo-cdn licence</summary>

```
MIT License

Copyright (c) 2025 Composio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>
