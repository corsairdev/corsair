# @corsair-dev/handwrytten

Handwrytten plugin for Corsair. Automates sending physical handwritten cards and direct mail using robotics with real pens.

## Install

```bash
pnpm add @corsair-dev/handwrytten
```

## Authentication

Pass your Handwrytten API key directly in the `Authorization` request header without a `Bearer` prefix:

```http
Authorization: YOUR_API_KEY
```

API keys can be created and managed on the [Integrations](https://app.handwrytten.com/integrations) page in your Handwrytten dashboard. Test mode is also available in the dashboard to simulate orders without fulfillment charges.

## Operations

| Operation | Risk | Description |
|-----------|------|-------------|
| `cards.list` | `read` | List available greeting cards and designs with filtering and pagination |
| `cards.get` | `read` | Get details, dimensions, and cover image for a specific card |
| `cards.sections` | `read` | List cards grouped by category sections |
| `cards.categories` | `read` | List all card categories and taxonomies |
| `customCards.dimensions` | `read` | List supported card dimensions and print orientations |
| `customCards.presetImages` | `read` | List preset cover images available for custom card design |
| `customCards.listImages` | `read` | List custom logos and user-uploaded images |
| `customCards.uploadImage` | `write` | Upload a custom logo or image for card customization |
| `customCards.checkImage` | `read` | Check image quality, resolution, and DPI for printing compatibility |
| `customCards.deleteImage` | `destructive` | Delete a previously uploaded custom logo or image |
| `customCards.create` | `write` | Create a custom card template with uploaded cover or inside artwork |
| `customCards.delete` | `destructive` | Permanently delete a custom card template |
| `orders.sendSingle` | `destructive` | Place a single real handwritten card order (spends credits / triggers robotic fulfillment) |
| `orders.addToBasket` | `write` | Add a handwritten card order to the shopping basket |
| `orders.get` | `read` | Get status and details for an existing order by ID |
| `orders.cancel` | `destructive` | Cancel an order before it enters robotic production |
| `basket.count` | `read` | Get current item count in the shopping basket |
| `basket.clear` | `destructive` | Remove all pending orders and clear the shopping basket |
| `basket.send` | `destructive` | Submit and charge all pending orders in the shopping basket |
| `fonts.list` | `read` | List available realistic handwriting font styles |
| `signatures.list` | `read` | List user handwriting signatures saved on the account |
| `addressBook.countries` | `read` | List supported destination countries and country codes |
| `addressBook.states` | `read` | List states and provinces for a given country |
| `addressBook.listRecipients` | `read` | List saved recipient mailing addresses |
| `addressBook.addRecipient` | `destructive` | Add a new recipient address to the user address book |
| `addressBook.updateRecipient` | `destructive` | Update an existing recipient address in the user address book |
| `addressBook.deleteRecipient` | `destructive` | Delete a recipient address from the user address book |
| `addressBook.listSenders` | `read` | List saved return/sender addresses from the account |
| `addressBook.getSender` | `read` | Get default sender return address and account billing info |
| `addressBook.addSender` | `destructive` | Add a new sender return address to the account |
| `addressBook.updateSender` | `destructive` | Update the sender return address on the account |
| `addressBook.deleteSender` | `destructive` | Delete a sender return address from the account |
| `addressBook.setDefaultSender` | `destructive` | Set an address as the default sender return address |
| `templates.categories` | `read` | List template categories available for card messages |
| `templates.list` | `read` | List saved message templates with optional category filter |
| `templates.get` | `read` | Get a specific message template by ID |
| `templates.create` | `destructive` | Create a new saved message template in the user account |
| `templates.update` | `destructive` | Update an existing message template in the user account |
| `templates.delete` | `destructive` | Delete a message template from the user account |
| `giftCards.list` | `read` | List physical merchant gift cards and denominations |
| `inserts.list` | `read` | List custom marketing inserts available for envelope insertion |
| `bundles.list` | `read` | List product bundles and gift pairings |
| `qrCodes.list` | `read` | List trackable QR codes created in the account |
| `qrCodes.create` | `write` | Create a dynamic trackable QR code to print on handwritten cards |
| `qrCodes.delete` | `destructive` | Delete a trackable QR code by ID |
| `qrCodes.dashboard` | `read` | Get scan analytics and statistics for created QR codes |
| `qrCodes.frames` | `read` | List decorative frame designs available for printed QR codes |
| `shipping.stampOptions` | `read` | List postage stamp options (first-class vs presorted mail) |
| `prospecting.calculateTargets` | `read` | Calculate target recipient counts based on demographic filters |
| `prospecting.preview` | `read` | Preview prospecting order pricing and recipient volume |
| `prospecting.createOrder` | `destructive` | Create a direct-mail prospecting campaign order |
| `auth.getUser` | `read` | Get authenticated user profile details, email, and credit balance |
| `auth.checkAuth` | `read` | Check API key authentication status and test mode status |
| `auth.setTestMode` | `write` | Enable or disable account test mode |
| `auth.logout` | `write` | Invalidate current session credentials |

## Retries and Rate Limiting

The plugin implements single-owner rate limiting: core's HTTP transport owns 429 retries, parsing the `Retry-After` header and respecting provider backoff. The plugin's `RATE_LIMIT_ERROR` error handler returns `{ maxRetries: 0 }` to avoid multiplier retry storms.

## Webhooks

No inbound webhooks. Outbound notifications can be configured in the Handwrytten dashboard.

## Reference

- [Handwrytten API Documentation](https://www.handwrytten.com/api/)
- [Handwrytten OpenAPI Specification](https://www.handwrytten.com/openapi.json)
- [Corsair Handwrytten Documentation](https://docs.corsair.dev/plugins/handwrytten)

## License

Apache-2.0
