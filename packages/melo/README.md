# @corsair-dev/melo

Melo (Stream Estate API) plugin for Corsair: search French real-estate listings, read market indicators and manage saved searches. The webhook simulate call is an API request; inbound webhook deliveries are not handled.

## Install

```bash
pnpm add @corsair-dev/melo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `indicators.cities` | `melo.api.indicators.cities` | `read` | List cities by INSEE code, zipcode, name, label, slug or polygon, with paging |
| `indicators.locations` | `melo.api.indicators.locations` | `read` | Search cities and departments by name and get the IRIs used in includedCities and includedDepartments filters; needs a key here although the API serves it publicly |
| `indicators.pointsOfInterest` | `melo.api.indicators.pointsOfInterest` | `read` | List schools, kindergartens, restaurants, hospitals or parking within a radius of a coordinate |
| `indicators.pricePerMeter` | `melo.api.indicators.pricePerMeter` | `read` | Average, median and time series of the price per meter for properties matching the same filters as properties.list |
| `properties.get` | `melo.api.properties.get` | `read` | Get one property by UUID, with its adverts, city, stations and price events |
| `properties.list` | `melo.api.properties.list` | `read` | List French real-estate properties matching filters (location, price, surface, rooms, energy class and more), with paging via nextPage |
| `properties.listSimilar` | `melo.api.properties.listSimilar` | `read` | List properties similar to a given property, with paging |
| `searches.create` | `melo.api.searches.create` | `write` | Create a saved search; with notificationEnabled and a webhook or email recipient, Melo starts sending matches and events there |
| `searches.delete` | `melo.api.searches.delete` | `destructive` | Permanently delete a saved search; its notifications stop and it cannot be restored |
| `searches.get` | `melo.api.searches.get` | `read` | Get one saved search by UUID |
| `searches.list` | `melo.api.searches.list` | `read` | List your saved searches, with paging |
| `searches.update` | `melo.api.searches.update` | `write` | Replace a saved search (PUT) with a full definition, including the required title, transactionType and propertyTypes |
| `webhooks.simulate` | `melo.api.webhooks.simulate` | `write` | Ask Melo to send a test match or event payload to a URL you give; this is an API call that sends a request to that URL, not an inbound webhook handler |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/melo

## License

Apache-2.0
