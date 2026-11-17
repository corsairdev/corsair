# @corsair-dev/labs64netlicensing

Labs64 NetLicensing plugin for Corsair: manage products, product modules, license templates, licensees and licenses, validate licensees, and read transactions.

## Install

```bash
pnpm add @corsair-dev/labs64netlicensing
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `licenseTemplates.create` | `labs64netlicensing.api.licenseTemplates.create` | `write` | Create a license template in a product module. |
| `licenseTemplates.delete` | `labs64netlicensing.api.licenseTemplates.delete` | `destructive` | Delete a license template; forceCascade also deletes its licenses. |
| `licenseTemplates.get` | `labs64netlicensing.api.licenseTemplates.get` | `read` | Get one license template by number. |
| `licenseTemplates.list` | `labs64netlicensing.api.licenseTemplates.list` | `read` | List license templates. |
| `licenseTemplates.update` | `labs64netlicensing.api.licenseTemplates.update` | `write` | Update a license template. |
| `licensees.create` | `labs64netlicensing.api.licensees.create` | `write` | Create a licensee for a product. |
| `licensees.delete` | `labs64netlicensing.api.licensees.delete` | `destructive` | Delete a licensee; forceCascade also deletes its licenses. |
| `licensees.get` | `labs64netlicensing.api.licensees.get` | `read` | Get one licensee by number. |
| `licensees.list` | `labs64netlicensing.api.licensees.list` | `read` | List licensees (the vendor's customers). |
| `licensees.transfer` | `labs64netlicensing.api.licensees.transfer` | `destructive` | Move every license of a source licensee (marked for transfer) to this licensee; NetLicensing then removes the source licensee. |
| `licensees.update` | `labs64netlicensing.api.licensees.update` | `write` | Update a licensee. |
| `licensees.validate` | `labs64netlicensing.api.licensees.validate` | `write` | Check which product modules a licensee may use; floating checkouts and pay-per-use counts change unless dryRun is true. |
| `licenses.create` | `labs64netlicensing.api.licenses.create` | `write` | Create a license for a licensee from a license template. |
| `licenses.delete` | `labs64netlicensing.api.licenses.delete` | `destructive` | Delete a license. |
| `licenses.get` | `labs64netlicensing.api.licenses.get` | `read` | Get one license by number. |
| `licenses.list` | `labs64netlicensing.api.licenses.list` | `read` | List the vendor's licenses. |
| `licenses.update` | `labs64netlicensing.api.licenses.update` | `write` | Update a license, for example to deactivate it. |
| `productModules.create` | `labs64netlicensing.api.productModules.create` | `write` | Create a product module with a licensing model. |
| `productModules.delete` | `labs64netlicensing.api.productModules.delete` | `destructive` | Delete a product module; forceCascade also deletes what depends on it. |
| `productModules.get` | `labs64netlicensing.api.productModules.get` | `read` | Get one product module by number. |
| `productModules.list` | `labs64netlicensing.api.productModules.list` | `read` | List product modules. |
| `productModules.update` | `labs64netlicensing.api.productModules.update` | `write` | Update a product module. |
| `products.create` | `labs64netlicensing.api.products.create` | `write` | Create a product. |
| `products.delete` | `labs64netlicensing.api.products.delete` | `destructive` | Delete a product; forceCascade also deletes its modules, templates, licensees and licenses. |
| `products.get` | `labs64netlicensing.api.products.get` | `read` | Get one product by number. |
| `products.list` | `labs64netlicensing.api.products.list` | `read` | List the vendor's products. |
| `products.update` | `labs64netlicensing.api.products.update` | `write` | Update a product; fields left out stay as they are. |
| `transactions.get` | `labs64netlicensing.api.transactions.get` | `read` | Get one transaction by number. |
| `transactions.list` | `labs64netlicensing.api.transactions.list` | `read` | List transactions, newest first. |

## Auth

Auth: a NetLicensing API key (Settings > API Access), sent as HTTP Basic with the username `apiKey`. Its role limits the operations: Operation for licensees and licenses, Maintenance for products, modules and templates.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/labs64netlicensing

## License

Apache-2.0
