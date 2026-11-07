# @corsair-dev/fidel

Fidel plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/fidel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `brands.createBrand` | `fidel.api.brands.createBrand` | `write` | Create a brand on Fidel |
| `brands.deleteBrand` | `fidel.api.brands.deleteBrand` | `destructive` | Delete a brand from the Fidel account |
| `brands.listBrands` | `fidel.api.brands.listBrands` | `read` | List the brands on the Fidel account |
| `brands.retrieveBrand` | `fidel.api.brands.retrieveBrand` | `read` | Retrieve a brand by ID |
| `brands.updateBrand` | `fidel.api.brands.updateBrand` | `write` | Update the details of a brand |
| `cards.createCard` | `fidel.api.cards.createCard` | `write` | Link a payment card to a program on Fidel |
| `cards.deleteCard` | `fidel.api.cards.deleteCard` | `destructive` | Remove a linked card from a program |
| `cards.listCards` | `fidel.api.cards.listCards` | `read` | List the linked cards of a program |
| `cards.listCardsFromMetadataId` | `fidel.api.cards.listCardsFromMetadataId` | `read` | List the linked cards matching a metadata identifier |
| `cards.retrieveCard` | `fidel.api.cards.retrieveCard` | `read` | Retrieve a linked card by ID |
| `cards.updateCardMetadata` | `fidel.api.cards.updateCardMetadata` | `write` | Replace the metadata of a linked card |
| `locations.createLocation` | `fidel.api.locations.createLocation` | `write` | Create a location under a program and brand |
| `locations.deleteLocation` | `fidel.api.locations.deleteLocation` | `destructive` | Delete a location from a program |
| `locations.listLocations` | `fidel.api.locations.listLocations` | `read` | List the locations of a program |
| `locations.listLocationsByBrand` | `fidel.api.locations.listLocationsByBrand` | `read` | List the locations of a brand within a program |
| `locations.listLocationsByOffer` | `fidel.api.locations.listLocationsByOffer` | `read` | List the locations linked to an offer |
| `locations.retrieveLocation` | `fidel.api.locations.retrieveLocation` | `read` | Retrieve a location by ID |
| `locations.updateLocation` | `fidel.api.locations.updateLocation` | `write` | Update the details of a location |
| `offers.activateOfferOnCard` | `fidel.api.offers.activateOfferOnCard` | `write` | Activate an offer on a linked card |
| `offers.createOffer` | `fidel.api.offers.createOffer` | `write` | Create an offer on Fidel |
| `offers.deleteOffer` | `fidel.api.offers.deleteOffer` | `destructive` | Delete an offer from Fidel |
| `offers.linkAllBrandLocationsToOffer` | `fidel.api.offers.linkAllBrandLocationsToOffer` | `write` | Link every location of a brand in a program to an offer |
| `offers.linkLocationToOffer` | `fidel.api.offers.linkLocationToOffer` | `write` | Link a location to an offer |
| `offers.listCardsWithActiveOffer` | `fidel.api.offers.listCardsWithActiveOffer` | `read` | List the linked cards with an active offer |
| `offers.listOffers` | `fidel.api.offers.listOffers` | `read` | List the offers of a program |
| `offers.retrieveActiveOfferOnCard` | `fidel.api.offers.retrieveActiveOfferOnCard` | `read` | Check whether an offer is active on a linked card |
| `offers.retrieveOffer` | `fidel.api.offers.retrieveOffer` | `read` | Retrieve an offer by ID |
| `offers.sendOfferToBrand` | `fidel.api.offers.sendOfferToBrand` | `destructive` | Notify a brand about an offer on the live environment |
| `offers.unlinkCardFromOffer` | `fidel.api.offers.unlinkCardFromOffer` | `destructive` | Deactivate an offer on a linked card and reset its usage |
| `offers.unlinkLocationToOffer` | `fidel.api.offers.unlinkLocationToOffer` | `destructive` | Unlink a location from an offer |
| `offers.updateOffer` | `fidel.api.offers.updateOffer` | `write` | Update the details of an offer |
| `programs.createProgram` | `fidel.api.programs.createProgram` | `write` | Create a program on Fidel |
| `programs.listPrograms` | `fidel.api.programs.listPrograms` | `read` | List the programs on the Fidel account |
| `programs.retrieveProgram` | `fidel.api.programs.retrieveProgram` | `read` | Retrieve a program by ID |
| `programs.updateProgram` | `fidel.api.programs.updateProgram` | `write` | Update the details of a program |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/fidel

## License

Apache-2.0
