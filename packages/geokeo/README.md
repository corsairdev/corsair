# @corsair-dev/geokeo

Geokeo plugin for Corsair: turn an address or place name into coordinates and components, and turn coordinates back into the places nearest them, from OpenStreetMap data.

## Install

```bash
pnpm add @corsair-dev/geokeo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `geocode.forward` | `geokeo.api.geocode.forward` | `read` | Turn an address or place name into coordinates, a formatted address and its components, with the OpenStreetMap class and type of the match |
| `geocode.reverse` | `geokeo.api.geocode.reverse` | `read` | Turn a latitude and longitude into the places nearest it, each with its address, its components and how far away it is |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/geokeo

## License

Apache-2.0
