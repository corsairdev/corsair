# @corsair-dev/apaleo

Apaleo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apaleo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `properties.archive` | `apaleo.api.properties.archive` | `write` | Archive a live property (sets isArchived to true) |
| `properties.clone` | `apaleo.api.properties.clone` | `write` | Clone a property, creating a new property with inventory and rate plans |
| `properties.count` | `apaleo.api.properties.count` | `read` | Return total count of properties |
| `properties.countries` | `apaleo.api.properties.countries` | `read` | List ISO country codes that can be used to create properties |
| `properties.create` | `apaleo.api.properties.create` | `write` | Create a new property |
| `properties.exists` | `apaleo.api.properties.exists` | `read` | Check if a property exists by id |
| `properties.get` | `apaleo.api.properties.get` | `read` | Get a property by id |
| `properties.list` | `apaleo.api.properties.list` | `read` | Get the list of properties |
| `properties.reset` | `apaleo.api.properties.reset` | `write` | Delete transactional data for a property in Test status |
| `properties.setLive` | `apaleo.api.properties.setLive` | `write` | Move a test property to Live status |
| `unitAttributes.create` | `apaleo.api.unitAttributes.create` | `write` | Create a new unit attribute |
| `unitAttributes.delete` | `apaleo.api.unitAttributes.delete` | `write` | Delete a unit attribute |
| `unitAttributes.exists` | `apaleo.api.unitAttributes.exists` | `read` | Check if a unit attribute exists |
| `unitAttributes.get` | `apaleo.api.unitAttributes.get` | `read` | Get a unit attribute by id |
| `unitAttributes.list` | `apaleo.api.unitAttributes.list` | `read` | Get the unit attribute list |
| `unitGroups.count` | `apaleo.api.unitGroups.count` | `read` | Return number of unit groups matching the filter |
| `unitGroups.create` | `apaleo.api.unitGroups.create` | `write` | Create a new unit group |
| `unitGroups.delete` | `apaleo.api.unitGroups.delete` | `write` | Delete a unit group |
| `unitGroups.exists` | `apaleo.api.unitGroups.exists` | `read` | Check if a unit group exists by id |
| `unitGroups.get` | `apaleo.api.unitGroups.get` | `read` | Get a unit group by id |
| `unitGroups.list` | `apaleo.api.unitGroups.list` | `read` | Get the list of unit groups |
| `unitGroups.replace` | `apaleo.api.unitGroups.replace` | `write` | Replace a unit group |
| `units.count` | `apaleo.api.units.count` | `read` | Return number of units matching the filter |
| `units.create` | `apaleo.api.units.create` | `write` | Create a new unit |
| `units.createBulk` | `apaleo.api.units.createBulk` | `write` | Create multiple units |
| `units.delete` | `apaleo.api.units.delete` | `write` | Delete a unit |
| `units.exists` | `apaleo.api.units.exists` | `read` | Check if a unit exists by id |
| `units.get` | `apaleo.api.units.get` | `read` | Get a unit by id |
| `units.list` | `apaleo.api.units.list` | `read` | Get the list of units |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apaleo

## License

Apache-2.0
