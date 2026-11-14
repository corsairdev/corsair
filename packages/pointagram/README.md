# @corsair-dev/pointagram

Gamification platform for player scoring, teams and competitions, exposed by Corsair.

## Install

```bash
pnpm add @corsair-dev/pointagram
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `competitions.get` | `pointagram.api.competitions.get` | `read` | Read one competition by id |
| `competitions.list` | `pointagram.api.competitions.list` | `read` | List competitions, optionally narrowed to one player, id or access key |
| `competitions.players` | `pointagram.api.competitions.players` | `read` | List the players in a competition with their score and rank |
| `players.create` | `pointagram.api.players.create` | `write` | Create a player; an online player is also invited. A player that already exists is reported as a failure, not created twice |
| `players.delete` | `pointagram.api.players.delete` | `destructive` | Soft delete a player. Pointagram keeps the record for you to anonymize in the app, and refuses to remove admin users |
| `players.get` | `pointagram.api.players.get` | `read` | Read one player by profile id |
| `players.list` | `pointagram.api.players.list` | `read` | List players, optionally filtered by name, email or external id, with `next_offset` paging |
| `players.update` | `pointagram.api.players.update` | `write` | Update a player's name, email, external id or online status |
| `rewardStore.item` | `pointagram.api.rewardStore.item` | `read` | Read one reward store item |
| `rewardStore.items` | `pointagram.api.rewardStore.items` | `read` | List the items in a reward store |
| `rewardStore.purchase` | `pointagram.api.rewardStore.purchase` | `destructive` | Spend a player's currency on a reward store item, which creates an order to fulfil |
| `rewardStore.purchases` | `pointagram.api.rewardStore.purchases` | `read` | List the orders in a reward store, for one member or for everyone |
| `rewardStore.revokePurchase` | `pointagram.api.rewardStore.revokePurchase` | `destructive` | Revoke an order. The docs do not say whether the spent currency is returned, so treat it as final |
| `rewardStore.settings` | `pointagram.api.rewardStore.settings` | `read` | Read the reward store settings and currencies for a profile |
| `rewardStore.updatePurchase` | `pointagram.api.rewardStore.updatePurchase` | `write` | Move an order along its delivery status: PURCHASED, PROCESSED or DELIVERED. Needs admin rights |
| `scoreSeries.addPoints` | `pointagram.api.scoreSeries.addPoints` | `write` | Score points for a player in a score series, optionally with a comment, tags and a transaction reference that makes a repeat call replace the earlier one |
| `scoreSeries.get` | `pointagram.api.scoreSeries.get` | `read` | Read one score series by id |
| `scoreSeries.history` | `pointagram.api.scoreSeries.history` | `read` | Read the points history of a score series, filtered by tag, point type, team, player and time window, with `next_offset` paging |
| `scoreSeries.list` | `pointagram.api.scoreSeries.list` | `read` | List score series |
| `scoreSeries.pointTypes` | `pointagram.api.scoreSeries.pointTypes` | `read` | List the point types a score series defines |
| `teams.addPlayer` | `pointagram.api.teams.addPlayer` | `write` | Add a player to a team, identified by player id, external id or email |
| `teams.create` | `pointagram.api.teams.create` | `write` | Create a team with a name and an icon |
| `teams.get` | `pointagram.api.teams.get` | `read` | Read one team by id |
| `teams.list` | `pointagram.api.teams.list` | `read` | List teams |
| `teams.listPlayers` | `pointagram.api.teams.listPlayers` | `read` | List the players in a team |
| `teams.removePlayer` | `pointagram.api.teams.removePlayer` | `destructive` | Remove a player from a team. The player keeps their points and stays in Pointagram |
| `teams.update` | `pointagram.api.teams.update` | `write` | Update a team's name, icon or filter setting |
| `test.credentials` | `pointagram.api.test.credentials` | `read` | Confirm the Api-Key and Api-User pair and read the organization it belongs to; touches no tenant data |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pointagram

## License

Apache-2.0
