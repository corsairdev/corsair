# @corsair-dev/collegefootballdata

CollegeFootballData plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/collegefootballdata
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getUserInfo` | `collegefootballdata.api.account.getUserInfo` | `read` | Get the authenticated user's subscription tier and remaining API calls |
| `betting.getLines` | `collegefootballdata.api.betting.getLines` | `read` | Get betting lines and totals by game and provider |
| `coaches.list` | `collegefootballdata.api.coaches.list` | `read` | Get coaching records and history |
| `conferences.list` | `collegefootballdata.api.conferences.list` | `read` | List all conferences across every NCAA division |
| `conferences.listDivisions` | `collegefootballdata.api.conferences.listDivisions` | `read` | List conference divisions with active years and metadata |
| `conferences.listMemberships` | `collegefootballdata.api.conferences.listMemberships` | `read` | Get current/historical conference memberships for teams |
| `draft.listPicks` | `collegefootballdata.api.draft.listPicks` | `read` | List NFL draft picks |
| `draft.listPositions` | `collegefootballdata.api.draft.listPositions` | `read` | Get the standardized list of NFL draft positions |
| `draft.listTeams` | `collegefootballdata.api.draft.listTeams` | `read` | List NFL teams used in draft endpoints |
| `drives.list` | `collegefootballdata.api.drives.list` | `read` | Get drive-level data for games |
| `games.getAdvancedBoxScore` | `collegefootballdata.api.games.getAdvancedBoxScore` | `read` | Get advanced analytics for a single game |
| `games.getGamesAndResults` | `collegefootballdata.api.games.getGamesAndResults` | `read` | Get game schedules and results, filtered by season/week/team |
| `games.getMedia` | `collegefootballdata.api.games.getMedia` | `read` | Get broadcast/media information for games |
| `games.getPlayerStats` | `collegefootballdata.api.games.getPlayerStats` | `read` | Get player-level stats for games |
| `games.getTeamStats` | `collegefootballdata.api.games.getTeamStats` | `read` | Get team-level box score stats for games |
| `metrics.getFieldGoalExpectedPoints` | `collegefootballdata.api.metrics.getFieldGoalExpectedPoints` | `read` | Get field goal expected-points model data by distance |
| `metrics.getPregameWinProbabilities` | `collegefootballdata.api.metrics.getPregameWinProbabilities` | `read` | Get pregame win probabilities for games |
| `metrics.getWinProbability` | `collegefootballdata.api.metrics.getWinProbability` | `read` | Get play-by-play win probabilities for a game |
| `players.getReturningProduction` | `collegefootballdata.api.players.getReturningProduction` | `read` | Get returning production splits by team |
| `players.getUsage` | `collegefootballdata.api.players.getUsage` | `read` | Get player usage rates for a season |
| `players.listTransferPortal` | `collegefootballdata.api.players.listTransferPortal` | `read` | Get transfer portal entries for a season |
| `players.search` | `collegefootballdata.api.players.search` | `read` | Search for players by name |
| `plays.list` | `collegefootballdata.api.plays.list` | `read` | Get play-by-play data for games |
| `plays.listStats` | `collegefootballdata.api.plays.listStats` | `read` | Get player-level statistics tied to individual plays |
| `plays.listStatTypes` | `collegefootballdata.api.plays.listStatTypes` | `read` | List play-level stat type definitions |
| `plays.listTypes` | `collegefootballdata.api.plays.listTypes` | `read` | List available play types |
| `ppa.getByPlayerGame` | `collegefootballdata.api.ppa.getByPlayerGame` | `read` | Get player PPA by game |
| `ppa.getByPlayerSeason` | `collegefootballdata.api.ppa.getByPlayerSeason` | `read` | Get player PPA aggregated by season |
| `ppa.getByTeamGame` | `collegefootballdata.api.ppa.getByTeamGame` | `read` | Get team PPA by game |
| `ppa.getByTeamSeason` | `collegefootballdata.api.ppa.getByTeamSeason` | `read` | Get team PPA (Predicted Points Added) by season |
| `ppa.getPredictedPoints` | `collegefootballdata.api.ppa.getPredictedPoints` | `read` | Get expected points for a down/distance across field positions |
| `rankings.list` | `collegefootballdata.api.rankings.list` | `read` | Get poll rankings by season |
| `ratings.getConferenceSP` | `collegefootballdata.api.ratings.getConferenceSP` | `read` | Get SP+ ratings aggregated by conference |
| `ratings.getElo` | `collegefootballdata.api.ratings.getElo` | `read` | Get Elo ratings by season or team |
| `ratings.getFPI` | `collegefootballdata.api.ratings.getFPI` | `read` | Get ESPN FPI (Football Power Index) ratings |
| `ratings.getSP` | `collegefootballdata.api.ratings.getSP` | `read` | Get SP+ team ratings |
| `ratings.getSRS` | `collegefootballdata.api.ratings.getSRS` | `read` | Get SRS (Simple Rating System) ratings |
| `recruiting.getGroupRatings` | `collegefootballdata.api.recruiting.getGroupRatings` | `read` | Get recruiting data grouped by position |
| `recruiting.getTeamRankings` | `collegefootballdata.api.recruiting.getTeamRankings` | `read` | Get team recruiting class rankings |
| `recruiting.getTeamTalent` | `collegefootballdata.api.recruiting.getTeamTalent` | `read` | Get composite team talent rankings for a season |
| `recruiting.listRecruits` | `collegefootballdata.api.recruiting.listRecruits` | `read` | Get recruit rankings |
| `seasonTypes.list` | `collegefootballdata.api.seasonTypes.list` | `read` | Get the valid season-type vocabulary |
| `stats.getAdvancedGameStats` | `collegefootballdata.api.stats.getAdvancedGameStats` | `read` | Get advanced team metrics at the game level |
| `stats.getAdvancedSeasonStats` | `collegefootballdata.api.stats.getAdvancedSeasonStats` | `read` | Get advanced season-level team statistics |
| `stats.getGameHavocStats` | `collegefootballdata.api.stats.getGameHavocStats` | `read` | Get havoc statistics aggregated by game |
| `stats.getPlayerSeasonStats` | `collegefootballdata.api.stats.getPlayerSeasonStats` | `read` | Get aggregated season statistics for players |
| `stats.getTeamSeasonStats` | `collegefootballdata.api.stats.getTeamSeasonStats` | `read` | Get basic season stats aggregated by team |
| `stats.listCategories` | `collegefootballdata.api.stats.listCategories` | `read` | List valid team statistical category names |
| `teams.getATSRecords` | `collegefootballdata.api.teams.getATSRecords` | `read` | Get against-the-spread (ATS) summary by team |
| `teams.getMatchup` | `collegefootballdata.api.teams.getMatchup` | `read` | Get head-to-head matchup history between two teams |
| `teams.getRecords` | `collegefootballdata.api.teams.getRecords` | `read` | Get team win-loss records for a season |
| `teams.getRoster` | `collegefootballdata.api.teams.getRoster` | `read` | Get a team's roster for a season |
| `teams.list` | `collegefootballdata.api.teams.list` | `read` | List teams, optionally filtered by conference/season |
| `teams.listFBS` | `collegefootballdata.api.teams.listFBS` | `read` | List FBS teams for a season |
| `teams.listFCS` | `collegefootballdata.api.teams.listFCS` | `read` | List FCS teams for a season/conference |
| `venues.list` | `collegefootballdata.api.venues.list` | `read` | List venues with metadata |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/collegefootballdata

## License

Apache-2.0
