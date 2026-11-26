# @corsair-dev/moretrees

Climate action with More Trees - read the account credit balance, forest stats, planting projects and CO2 figures, look up accounts, and plant trees for yourself or as gifts.

## Install

```bash
pnpm add @corsair-dev/moretrees
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `moretrees.api.account.get` | `read` | Read one account: name, credit balance, forest name and slug |
| `account.lookup` | `moretrees.api.account.lookup` | `read` | Look up accounts by account code or email address: code, name, email and status |
| `forest.get` | `moretrees.api.forest.get` | `read` | Read one virtual forest: branding plus planted, gifted and received tree totals and CO2 captured |
| `projects.calculateCo2` | `moretrees.api.projects.calculateCo2` | `read` | Calculate the CO2 captured and projects supported for a set of tree counts; plants nothing |
| `projects.getTree` | `moretrees.api.projects.getTree` | `read` | Read one tree in a project: credits per tree, credit type and the project and tree names |
| `projects.list` | `moretrees.api.projects.list` | `read` | List every active planting project with country, supplier and the trees you can plant in it |
| `trees.plant` | `moretrees.api.trees.plant` | `destructive` | Plant trees from the payment account for yourself or as gifts; spends credits unless test mode is on |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moretrees

## License

Apache-2.0
