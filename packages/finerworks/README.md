# @corsair-dev/finerworks

FinerWorks plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/finerworks
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getCompanyInfo` | `finerworks.api.account.getCompanyInfo` | `read` | Get FinerWorks' site identifier, company address and business hours |
| `account.getUser` | `finerworks.api.account.getUser` | `read` | Get the authenticated FinerWorks account profile, including billing and business addresses |
| `account.updateAppDetails` | `finerworks.api.account.updateAppDetails` | `write` | Update the calling application's name, description and live mode |
| `account.updateUser` | `finerworks.api.account.updateUser` | `write` | Update the FinerWorks account profile, including billing and payment information |
| `framing.getFrameDetails` | `finerworks.api.framing.getFrameDetails` | `read` | Get dimensions, pricing, materials and imagery for a specific frame |
| `framing.listCollections` | `finerworks.api.framing.listCollections` | `read` | List available frame collections and categories |
| `framing.listGlazing` | `finerworks.api.framing.listGlazing` | `read` | List available glazing and glass options |
| `framing.listMats` | `finerworks.api.framing.listMats` | `read` | List matting specifications, colours and pricing |
| `galleries.addOrUpdateCollection` | `finerworks.api.galleries.addOrUpdateCollection` | `write` | Create a personal gallery collection, or update one by supplying its id |
| `galleries.list` | `finerworks.api.galleries.list` | `read` | List GeoGalleries.com galleries, with optional filtering |
| `galleries.listThemes` | `finerworks.api.galleries.listThemes` | `read` | List the theme options available for gallery customisation |
| `images.add` | `finerworks.api.images.add` | `write` | Add up to five prepared images to a FinerWorks library |
| `images.delete` | `finerworks.api.images.delete` | `destructive` | Delete image files by GUID, along with any virtual inventory products assigned to them |
| `images.list` | `finerworks.api.images.list` | `read` | List image files uploaded to the FinerWorks account, with pagination |
| `images.listFileSelection` | `finerworks.api.images.listFileSelection` | `read` | List the image GUIDs grouped under a file-selection key |
| `images.update` | `finerworks.api.images.update` | `write` | Update image metadata by GUID |
| `images.updateFileSelection` | `finerworks.api.images.updateFileSelection` | `write` | Replace the image files held under a selection GUID |
| `inventory.delete` | `finerworks.api.inventory.delete` | `destructive` | Delete virtual inventory products by SKU and disconnect their third-party sync |
| `inventory.disconnect` | `finerworks.api.inventory.disconnect` | `write` | Disconnect every virtual inventory item from a third-party platform |
| `inventory.list` | `finerworks.api.inventory.list` | `read` | List the virtual inventory products on the account, with pagination |
| `inventory.update` | `finerworks.api.inventory.update` | `write` | Update virtual inventory pricing, stock and third-party integrations |
| `orders.deletePending` | `finerworks.api.orders.deletePending` | `destructive` | Remove orders that were saved as pending |
| `orders.fetchStatus` | `finerworks.api.orders.fetchStatus` | `read` | Get production status and tracking information for orders |
| `orders.listStatusDefinitions` | `finerworks.api.orders.listStatusDefinitions` | `read` | List every production status an order can have |
| `orders.savePending` | `finerworks.api.orders.savePending` | `write` | Save orders to temporary storage for review before submission |
| `orders.submit` | `finerworks.api.orders.submit` | `write` | Submit up to five new orders for production |
| `orders.validateRecipientAddress` | `finerworks.api.orders.validateRecipientAddress` | `read` | Validate a recipient address before submitting an order |
| `products.getPrices` | `finerworks.api.products.getPrices` | `read` | Get pricing for a set of FinerWorks product SKUs |
| `products.listMediaTypes` | `finerworks.api.products.listMediaTypes` | `read` | List printing substrates (canvas, paper, vinyl) and their product information |
| `products.listProductTypes` | `finerworks.api.products.listProductTypes` | `read` | List printing categories such as Canvas Prints and Metal Prints |
| `products.listStyleTypes` | `finerworks.api.products.listStyleTypes` | `read` | List print formatting options including borders and canvas wraps |
| `shipping.getOptionIds` | `finerworks.api.shipping.getOptionIds` | `read` | List shipping method identifiers for cross-reference |
| `shipping.listOptionsMultiple` | `finerworks.api.shipping.listOptionsMultiple` | `read` | Get shipping options and rates for a batch of orders |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/finerworks

## License

Apache-2.0
