# @corsair-dev/apisports

API-Sports plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apisports
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `afl.getAflGamePlayerStatistics` | `apisports.api.afl.getAflGamePlayerStatistics` | `read` | Get AFL Game Player Statistics |
| `afl.getAflGames` | `apisports.api.afl.getAflGames` | `read` | Get AFL Games |
| `afl.getAflGamesQuarters` | `apisports.api.afl.getAflGamesQuarters` | `read` | Get AFL Games Quarters |
| `afl.getAflSeasons` | `apisports.api.afl.getAflSeasons` | `read` | Get AFL Seasons |
| `afl.getAflStandings` | `apisports.api.afl.getAflStandings` | `read` | Get AFL Standings |
| `baseball.getBaseballGamesHeadToHead` | `apisports.api.baseball.getBaseballGamesHeadToHead` | `read` | Get Baseball Games Head-to-Head |
| `basketball.getBasketballBets` | `apisports.api.basketball.getBasketballBets` | `read` | Get Basketball Bets |
| `basketball.getBasketballBookmakers` | `apisports.api.basketball.getBasketballBookmakers` | `read` | Get Basketball Bookmakers |
| `basketball.getBasketballStatistics` | `apisports.api.basketball.getBasketballStatistics` | `read` | Get Basketball Statistics |
| `basketball.getGamesEvents` | `apisports.api.basketball.getGamesEvents` | `read` | Get Games Events |
| `basketball.getGameStatisticsByTeams` | `apisports.api.basketball.getGameStatisticsByTeams` | `read` | Get Game Statistics by Teams |
| `basketball.getNbaGameStatistics` | `apisports.api.basketball.getNbaGameStatistics` | `read` | Get NBA Game Statistics |
| `basketball.getPlayerStatistics` | `apisports.api.basketball.getPlayerStatistics` | `read` | Get Player Statistics |
| `core.getCoaches` | `apisports.api.core.getCoaches` | `read` | Get Coaches |
| `core.getCountries` | `apisports.api.core.getCountries` | `read` | Get Countries |
| `core.getInjuries` | `apisports.api.core.getInjuries` | `read` | Get Injuries |
| `core.getLeagues` | `apisports.api.core.getLeagues` | `read` | Get Leagues |
| `core.getLeagueSeasons` | `apisports.api.core.getLeagueSeasons` | `read` | Get League Seasons |
| `core.getPredictions` | `apisports.api.core.getPredictions` | `read` | Get Predictions |
| `core.getSidelined` | `apisports.api.core.getSidelined` | `read` | Get Sidelined |
| `core.getTeams` | `apisports.api.core.getTeams` | `read` | Get Teams |
| `core.getTeamSeasons` | `apisports.api.core.getTeamSeasons` | `read` | Get Team Seasons |
| `core.getTeamStatistics` | `apisports.api.core.getTeamStatistics` | `read` | Get Team Statistics |
| `core.getTimezone` | `apisports.api.core.getTimezone` | `read` | Get Timezone |
| `core.getTransfers` | `apisports.api.core.getTransfers` | `read` | Get Transfers |
| `core.getTrophies` | `apisports.api.core.getTrophies` | `read` | Get Trophies |
| `core.getVenues` | `apisports.api.core.getVenues` | `read` | Get Venues |
| `fixtures.getFixtureLineups` | `apisports.api.fixtures.getFixtureLineups` | `read` | Get Fixture Lineups |
| `fixtures.getFixtures` | `apisports.api.fixtures.getFixtures` | `read` | Get Fixtures |
| `fixtures.getFixturesEvents` | `apisports.api.fixtures.getFixturesEvents` | `read` | Get Fixtures Events |
| `fixtures.getFixturesPlayers` | `apisports.api.fixtures.getFixturesPlayers` | `read` | Get Fixtures Players |
| `fixtures.getFixturesRounds` | `apisports.api.fixtures.getFixturesRounds` | `read` | Get Fixtures Rounds |
| `fixtures.getFixtureStatistics` | `apisports.api.fixtures.getFixtureStatistics` | `read` | Get Fixture Statistics |
| `fixtures.getHeadToHeadFixtures` | `apisports.api.fixtures.getHeadToHeadFixtures` | `read` | Get Head-to-Head Fixtures |
| `formula1.getFastestLapsRankings` | `apisports.api.formula1.getFastestLapsRankings` | `read` | Get Fastest Laps Rankings |
| `formula1.getFormula1Circuits` | `apisports.api.formula1.getFormula1Circuits` | `read` | Get Formula 1 Circuits |
| `formula1.getFormula1Competitions` | `apisports.api.formula1.getFormula1Competitions` | `read` | Get Formula 1 Competitions |
| `formula1.getFormula1DriverRankings` | `apisports.api.formula1.getFormula1DriverRankings` | `read` | Get Formula 1 Driver Rankings |
| `formula1.getFormula1Races` | `apisports.api.formula1.getFormula1Races` | `read` | Get Formula 1 Races |
| `formula1.getFormula1StartingGrid` | `apisports.api.formula1.getFormula1StartingGrid` | `read` | Get Formula 1 Starting Grid |
| `formula1.getFormula1TeamRankings` | `apisports.api.formula1.getFormula1TeamRankings` | `read` | Get Formula 1 Team Rankings |
| `formula1.getRaceRankings` | `apisports.api.formula1.getRaceRankings` | `read` | Get Race Rankings |
| `mma.getFightersRecords` | `apisports.api.mma.getFightersRecords` | `read` | Get Fighters Records |
| `mma.getMmaCategories` | `apisports.api.mma.getMmaCategories` | `read` | Get MMA Categories |
| `mma.getMmaFighters` | `apisports.api.mma.getMmaFighters` | `read` | Get MMA Fighters |
| `mma.getMmaFighterStatistics` | `apisports.api.mma.getMmaFighterStatistics` | `read` | Get MMA Fighter Statistics |
| `mma.getMmaFightResults` | `apisports.api.mma.getMmaFightResults` | `read` | Get MMA Fight Results |
| `mma.getMmaFights` | `apisports.api.mma.getMmaFights` | `read` | Get MMA Fights |
| `odds.getInPlayOdds` | `apisports.api.odds.getInPlayOdds` | `read` | Get In-Play Odds |
| `odds.getLiveOddsBets` | `apisports.api.odds.getLiveOddsBets` | `read` | Get Live Odds Bets |
| `odds.getOdds` | `apisports.api.odds.getOdds` | `read` | Get Odds |
| `odds.getOddsBets` | `apisports.api.odds.getOddsBets` | `read` | Get Odds Bets |
| `odds.getOddsBookmakers` | `apisports.api.odds.getOddsBookmakers` | `read` | Get Odds Bookmakers |
| `odds.getOddsMapping` | `apisports.api.odds.getOddsMapping` | `read` | Get Odds Mapping |
| `players.getPlayers` | `apisports.api.players.getPlayers` | `read` | Get Players |
| `players.getPlayersProfiles` | `apisports.api.players.getPlayersProfiles` | `read` | Get Players Profiles |
| `players.getPlayersSeasons` | `apisports.api.players.getPlayersSeasons` | `read` | Get Players Seasons |
| `players.getPlayersSquads` | `apisports.api.players.getPlayersSquads` | `read` | Get Players Squads |
| `players.getPlayersTeams` | `apisports.api.players.getPlayersTeams` | `read` | Get Players Teams |
| `players.getPlayersTopAssists` | `apisports.api.players.getPlayersTopAssists` | `read` | Get Players Top Assists |
| `players.getPlayersTopRedCards` | `apisports.api.players.getPlayersTopRedCards` | `read` | Get Players Top Red Cards |
| `players.getPlayersTopScorers` | `apisports.api.players.getPlayersTopScorers` | `read` | Get Players Top Scorers |
| `players.getPlayersTopYellowCards` | `apisports.api.players.getPlayersTopYellowCards` | `read` | Get Players Top Yellow Cards |
| `standings.getNflStandingsConferences` | `apisports.api.standings.getNflStandingsConferences` | `read` | Get NFL Standings Conferences |
| `standings.getStandingsDivisions` | `apisports.api.standings.getStandingsDivisions` | `read` | Get Standings Divisions |
| `standings.getStandingsGroups` | `apisports.api.standings.getStandingsGroups` | `read` | Get Standings Groups |
| `standings.getStandingsStages` | `apisports.api.standings.getStandingsStages` | `read` | Get Standings Stages |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apisports

## License

Apache-2.0
