#!/usr/bin/env python3
"""One-shot generator for API-Sports endpoint modules."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENDPOINTS = ROOT / "endpoints"

# (group, key, sport, path, description)
ROUTES: list[tuple[str, str, str, str, str]] = [
    # Football / core
    ("core", "getCountries", "football", "/countries", "Get Countries"),
    ("core", "getTimezone", "football", "/timezone", "Get Timezone"),
    ("core", "getLeagues", "football", "/leagues", "Get Leagues"),
    ("core", "getLeagueSeasons", "football", "/leagues/seasons", "Get League Seasons"),
    ("core", "getTeams", "football", "/teams", "Get Teams"),
    ("core", "getTeamSeasons", "football", "/teams/seasons", "Get Team Seasons"),
    ("core", "getTeamStatistics", "football", "/teams/statistics", "Get Team Statistics"),
    ("core", "getVenues", "football", "/venues", "Get Venues"),
    ("core", "getCoaches", "football", "/coachs", "Get Coaches"),
    ("core", "getInjuries", "football", "/injuries", "Get Injuries"),
    ("core", "getSidelined", "football", "/sidelined", "Get Sidelined"),
    ("core", "getTransfers", "football", "/transfers", "Get Transfers"),
    ("core", "getTrophies", "football", "/trophies", "Get Trophies"),
    ("core", "getPredictions", "football", "/predictions", "Get Predictions"),
    # Fixtures
    ("fixtures", "getFixtures", "football", "/fixtures", "Get Fixtures"),
    ("fixtures", "getFixturesRounds", "football", "/fixtures/rounds", "Get Fixtures Rounds"),
    ("fixtures", "getHeadToHeadFixtures", "football", "/fixtures/headtohead", "Get Head-to-Head Fixtures"),
    ("fixtures", "getFixtureLineups", "football", "/fixtures/lineups", "Get Fixture Lineups"),
    ("fixtures", "getFixtureStatistics", "football", "/fixtures/statistics", "Get Fixture Statistics"),
    ("fixtures", "getFixturesEvents", "football", "/fixtures/events", "Get Fixtures Events"),
    ("fixtures", "getFixturesPlayers", "football", "/fixtures/players", "Get Fixtures Players"),
    # NFL standings helpers
    ("standings", "getStandingsStages", "nfl", "/standings/stages", "Get Standings Stages"),
    ("standings", "getStandingsGroups", "nfl", "/standings/groups", "Get Standings Groups"),
    ("standings", "getStandingsDivisions", "nfl", "/standings/divisions", "Get Standings Divisions"),
    ("standings", "getNflStandingsConferences", "nfl", "/standings/conferences", "Get NFL Standings Conferences"),
    # Players
    ("players", "getPlayers", "football", "/players", "Get Players"),
    ("players", "getPlayersProfiles", "football", "/players/profiles", "Get Players Profiles"),
    ("players", "getPlayersSeasons", "football", "/players/seasons", "Get Players Seasons"),
    ("players", "getPlayersSquads", "football", "/players/squads", "Get Players Squads"),
    ("players", "getPlayersTeams", "football", "/players/teams", "Get Players Teams"),
    ("players", "getPlayersTopScorers", "football", "/players/topscorers", "Get Players Top Scorers"),
    ("players", "getPlayersTopAssists", "football", "/players/topassists", "Get Players Top Assists"),
    ("players", "getPlayersTopYellowCards", "football", "/players/topyellowcards", "Get Players Top Yellow Cards"),
    ("players", "getPlayersTopRedCards", "football", "/players/topredcards", "Get Players Top Red Cards"),
    # Odds
    ("odds", "getOdds", "football", "/odds", "Get Odds"),
    ("odds", "getOddsBets", "football", "/odds/bets", "Get Odds Bets"),
    ("odds", "getOddsBookmakers", "football", "/odds/bookmakers", "Get Odds Bookmakers"),
    ("odds", "getOddsMapping", "football", "/odds/mapping", "Get Odds Mapping"),
    ("odds", "getInPlayOdds", "football", "/odds/live", "Get In-Play Odds"),
    ("odds", "getLiveOddsBets", "football", "/odds/live/bets", "Get Live Odds Bets"),
    # Basketball / NBA
    ("basketball", "getBasketballStatistics", "basketball", "/statistics", "Get Basketball Statistics"),
    ("basketball", "getBasketballBets", "basketball", "/bets", "Get Basketball Bets"),
    ("basketball", "getBasketballBookmakers", "basketball", "/bookmakers", "Get Basketball Bookmakers"),
    ("basketball", "getNbaGameStatistics", "nba", "/games/statistics", "Get NBA Game Statistics"),
    ("basketball", "getPlayerStatistics", "nba", "/players/statistics", "Get Player Statistics"),
    ("basketball", "getGameStatisticsByTeams", "nba", "/games/statistics", "Get Game Statistics by Teams"),
    ("basketball", "getGamesEvents", "nba", "/games/events", "Get Games Events"),
    # AFL
    ("afl", "getAflSeasons", "afl", "/seasons", "Get AFL Seasons"),
    ("afl", "getAflGames", "afl", "/games", "Get AFL Games"),
    ("afl", "getAflGamesQuarters", "afl", "/games/quarters", "Get AFL Games Quarters"),
    ("afl", "getAflGamePlayerStatistics", "afl", "/games/statistics/players", "Get AFL Game Player Statistics"),
    ("afl", "getAflStandings", "afl", "/standings", "Get AFL Standings"),
    # Baseball
    ("baseball", "getBaseballGamesHeadToHead", "baseball", "/games/h2h", "Get Baseball Games Head-to-Head"),
    # Formula 1
    ("formula1", "getFormula1Circuits", "formula1", "/circuits", "Get Formula 1 Circuits"),
    ("formula1", "getFormula1Competitions", "formula1", "/competitions", "Get Formula 1 Competitions"),
    ("formula1", "getFormula1Races", "formula1", "/races", "Get Formula 1 Races"),
    ("formula1", "getFormula1DriverRankings", "formula1", "/rankings/drivers", "Get Formula 1 Driver Rankings"),
    ("formula1", "getFormula1TeamRankings", "formula1", "/rankings/teams", "Get Formula 1 Team Rankings"),
    ("formula1", "getFormula1StartingGrid", "formula1", "/rankings/startinggrid", "Get Formula 1 Starting Grid"),
    ("formula1", "getFastestLapsRankings", "formula1", "/rankings/fastestlaps", "Get Fastest Laps Rankings"),
    ("formula1", "getRaceRankings", "formula1", "/rankings/races", "Get Race Rankings"),
    # MMA
    ("mma", "getMmaCategories", "mma", "/categories", "Get MMA Categories"),
    ("mma", "getMmaFighters", "mma", "/fighters", "Get MMA Fighters"),
    ("mma", "getMmaFights", "mma", "/fights", "Get MMA Fights"),
    ("mma", "getMmaFightResults", "mma", "/fights/results", "Get MMA Fight Results"),
    ("mma", "getMmaFighterStatistics", "mma", "/fights/statistics/fighters", "Get MMA Fighter Statistics"),
    ("mma", "getFightersRecords", "mma", "/fighters/records", "Get Fighters Records"),
]

assert len(ROUTES) == 67, f"expected 67 routes, got {len(ROUTES)}"


def pascal(s: str) -> str:
    return "".join(part.capitalize() for part in s.split("_"))


def write_routes_ts() -> None:
    lines = [
        "import type { ApiSport } from '../client';",
        "",
        "export type ApiSportsRoute = {",
        "\tsport: ApiSport;",
        "\tpath: string;",
        "\tdescription: string;",
        "};",
        "",
        "export const API_SPORTS_ROUTES = {",
    ]
    for group, key, sport, path, desc in ROUTES:
        lines.append(f"\t{key}: {{ sport: '{sport}', path: '{path}', description: {json.dumps(desc)} }},")
    lines.append("} as const satisfies Record<string, ApiSportsRoute>;")
    lines.append("")
    lines.append("export type ApiSportsRouteKey = keyof typeof API_SPORTS_ROUTES;")
    (ENDPOINTS / "routes.ts").write_text("\n".join(lines) + "\n")


def write_group_file(group: str, routes: list[tuple[str, str, str, str, str]]) -> None:
    lines = [
        "import { logEventFromContext } from 'corsair/core';",
        "import { makeApiSportsRequest } from '../client';",
        "import type { ApiSportsEndpoints } from '../index';",
        "import type { ApiSportsEndpointOutputs } from './types';",
        "import { API_SPORTS_ROUTES } from './routes';",
        "",
    ]
    for _, key, _, path, desc in routes:
        route = f"API_SPORTS_ROUTES.{key}"
        lines.extend([
            f"/** {desc} */",
            f"export const {key}: ApiSportsEndpoints['{key}'] = async (ctx, input) => {{",
            f"\tconst route = {route};",
            f"\tconst response = await makeApiSportsRequest<ApiSportsEndpointOutputs['{key}']>(",
            f"\t\troute.sport,",
            f"\t\troute.path,",
            f"\t\t{{ apiKey: ctx.key, query: input }},",
            f"\t);",
            f"\tawait logEventFromContext(ctx, 'api_sports.{group}.{key}', input ?? {{}}, 'completed');",
            f"\treturn response;",
            f"}};",
            "",
        ])
    (ENDPOINTS / f"{group}.ts").write_text("\n".join(lines))


def write_types_ts() -> None:
    keys = [key for _, key, _, _, _ in ROUTES]
    lines = [
        "import { z } from 'zod';",
        "",
        "/** Query params vary per sport API; callers pass documented filter fields. */",
        "export const ApiSportsQueryInputSchema = z",
        "\t.record(",
        "\t\tz.string(),",
        "\t\tz.union([",
        "\t\t\tz.string(),",
        "\t\t\tz.number(),",
        "\t\t\tz.boolean(),",
        "\t\t\tz.array(z.union([z.string(), z.number()])),",
        "\t\t]),",
        "\t)",
        "\t.optional();",
        "",
        "export type ApiSportsQueryInput = z.infer<typeof ApiSportsQueryInputSchema>;",
        "",
        "export const ApiSportsResponseSchema = z",
        "\t.object({",
        "\t\tget: z.string().optional(),",
        "\t\tparameters: z",
        "\t\t\t.union([z.record(z.string(), z.unknown()), z.array(z.unknown())])",
        "\t\t\t.optional(),",
        "\t\terrors: z.array(z.unknown()).optional(),",
        "\t\tresults: z.number().optional(),",
        "\t\tpaging: z",
        "\t\t\t.object({",
        "\t\t\t\tcurrent: z.number().optional(),",
        "\t\t\t\ttotal: z.number().optional(),",
        "\t\t\t})",
        "\t\t\t.optional(),",
        "\t\tresponse: z.unknown(),",
        "\t})",
        "\t.loose();",
        "",
        "export type ApiSportsResponse = z.infer<typeof ApiSportsResponseSchema>;",
        "",
        "export type ApiSportsEndpointInputs = {",
    ]
    for key in keys:
        lines.append(f"\t{key}: ApiSportsQueryInput;")
    lines.append("};")
    lines.append("")
    lines.append("export type ApiSportsEndpointOutputs = {")
    for key in keys:
        lines.append(f"\t{key}: ApiSportsResponse;")
    lines.append("};")
    lines.append("")
    lines.append("export const ApiSportsEndpointInputSchemas = {")
    for key in keys:
        lines.append(f"\t{key}: ApiSportsQueryInputSchema,")
    lines.append("} as const;")
    lines.append("")
    lines.append("export const ApiSportsEndpointOutputSchemas = {")
    for key in keys:
        lines.append(f"\t{key}: ApiSportsResponseSchema,")
    lines.append("} as const;")
    (ENDPOINTS / "types.ts").write_text("\n".join(lines) + "\n")


def write_index_ts() -> None:
    groups: dict[str, list[str]] = {}
    for group, key, *_ in ROUTES:
        groups.setdefault(group, []).append(key)

    imports = [f"import * as {pascal(group)} from './endpoints/{group}';" for group in groups]
    nested = []
    schema_lines = []
    meta_lines = []

    for group, keys in groups.items():
        gp = pascal(group)
        nested.append(f"\t{group}: {{")
        for key in keys:
            nested.append(f"\t\t{key}: {gp}.{key},")
            desc = next(d for g, k, _, _, d in ROUTES if g == group and k == key).replace("'", "\\'")
            schema_lines.append(
                "\t'{}': {{\n\t\tinput: ApiSportsEndpointInputSchemas.{},\n\t\toutput: ApiSportsEndpointOutputSchemas.{},\n\t}},".format(
                    f"{group}.{key}", key, key
                )
            )
            meta_lines.append(
                "\t'{}': {{\n\t\t\triskLevel: 'read',\n\t\t\tdescription: '{}',\n\t\t}},".format(
                    f"{group}.{key}", desc
                )
            )
        nested.append("\t},")

    endpoint_types = [f"\t{key}: ApiSportsEndpoint<'{key}'>;" for _, key, *_ in ROUTES]

    content = f"""import type {{
\tAuthTypes,
\tBindEndpoints,
\tCorsairEndpoint,
\tCorsairErrorHandler,
\tCorsairPlugin,
\tCorsairPluginContext,
\tKeyBuilderContext,
\tPickAuth,
\tPluginAuthConfig,
\tPluginPermissionsConfig,
\tRequiredPluginEndpointMeta,
\tRequiredPluginEndpointSchemas,
}} from 'corsair/core';
import {{ AuthMissingError }} from 'corsair/core';
{chr(10).join(imports)}
import type {{
\tApiSportsEndpointInputs,
\tApiSportsEndpointOutputs,
}} from './endpoints/types';
import {{
\tApiSportsEndpointInputSchemas,
\tApiSportsEndpointOutputSchemas,
}} from './endpoints/types';
import {{ errorHandlers }} from './error-handlers';
import {{ ApiSportsSchema }} from './schema';

export type ApiSportsPluginOptions = {{
\tauthType?: PickAuth<'api_key'>;
\tkey?: string;
\thooks?: InternalApiSportsPlugin['hooks'];
\terrorHandlers?: CorsairErrorHandler;
\tpermissions?: PluginPermissionsConfig<typeof apiSportsEndpointsNested>;
}};

export type ApiSportsContext = CorsairPluginContext<
\ttypeof ApiSportsSchema,
\tApiSportsPluginOptions
>;

export type ApiSportsKeyBuilderContext = KeyBuilderContext<ApiSportsPluginOptions>;

export type ApiSportsBoundEndpoints = BindEndpoints<typeof apiSportsEndpointsNested>;

type ApiSportsEndpoint<K extends keyof ApiSportsEndpointOutputs> = CorsairEndpoint<
\tApiSportsContext,
\tApiSportsEndpointInputs[K],
\tApiSportsEndpointOutputs[K]
>;

export type ApiSportsEndpoints = {{
{chr(10).join(endpoint_types)}
}};

const apiSportsEndpointsNested = {{
{chr(10).join(nested)}
}} as const;

const apiSportsWebhooksNested = {{}} as const;

export const apiSportsEndpointSchemas = {{
{chr(10).join(schema_lines)}
}} satisfies RequiredPluginEndpointSchemas<typeof apiSportsEndpointsNested>;

const apiSportsEndpointMeta = {{
{chr(10).join(meta_lines)}
}} satisfies RequiredPluginEndpointMeta<typeof apiSportsEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const apiSportsAuthConfig = {{
\tapi_key: {{}},
}} as const satisfies PluginAuthConfig;

export type BaseApiSportsPlugin<T extends ApiSportsPluginOptions> = CorsairPlugin<
\t'api_sports',
\ttypeof ApiSportsSchema,
\ttypeof apiSportsEndpointsNested,
\ttypeof apiSportsWebhooksNested,
\tT,
\ttypeof defaultAuthType
>;

export type InternalApiSportsPlugin = BaseApiSportsPlugin<ApiSportsPluginOptions>;

export type ExternalApiSportsPlugin<T extends ApiSportsPluginOptions> =
\tBaseApiSportsPlugin<T>;

export function apiSports<const T extends ApiSportsPluginOptions>(
\tincomingOptions: ApiSportsPluginOptions &
\t\tT = {{}} as ApiSportsPluginOptions & T,
): ExternalApiSportsPlugin<T> {{
\tconst options = {{
\t\t...incomingOptions,
\t\tauthType: incomingOptions.authType ?? defaultAuthType,
\t}};
\treturn {{
\t\tid: 'api_sports',
\t\tauthConfig: apiSportsAuthConfig,
\t\tschema: ApiSportsSchema,
\t\toptions,
\t\thooks: options.hooks,
\t\twebhookHooks: undefined,
\t\tendpoints: apiSportsEndpointsNested,
\t\twebhooks: apiSportsWebhooksNested,
\t\tendpointMeta: apiSportsEndpointMeta,
\t\tendpointSchemas: apiSportsEndpointSchemas,
\t\tpluginWebhookMatcher: undefined,
\t\terrorHandlers: {{
\t\t\t...errorHandlers,
\t\t\t...options.errorHandlers,
\t\t}},
\t\tkeyBuilder: async (ctx: ApiSportsKeyBuilderContext, source) => {{
\t\t\tif (source === 'endpoint' && options.key) {{
\t\t\t\treturn options.key;
\t\t\t}}
\t\t\tif (source === 'endpoint' && ctx.authType === 'api_key') {{
\t\t\t\tconst res = await ctx.keys.get_api_key();
\t\t\t\treturn res ?? '';
\t\t\t}}
\t\t\tthrow new AuthMissingError('api_sports', 'api_key');
\t\t}},
\t}} satisfies InternalApiSportsPlugin;
}}

export type {{
\tApiSportsEndpointInputs,
\tApiSportsEndpointOutputs,
\tApiSportsQueryInput,
\tApiSportsResponse,
}} from './endpoints/types';

export {{
\tApiSportsEndpointInputSchemas,
\tApiSportsEndpointOutputSchemas,
\tApiSportsQueryInputSchema,
\tApiSportsResponseSchema,
}} from './endpoints/types';
"""
    (ROOT / "index.ts").write_text(content)


def write_endpoints_index() -> None:
    groups = sorted({group for group, *_ in ROUTES})
    lines = []
    for group in groups:
        gp = pascal(group)
        lines.append(f"export * as {gp} from './{group}';")
    lines.append("export * from './types';")
    lines.append("export * from './routes';")
    (ENDPOINTS / "index.ts").write_text("\n".join(lines) + "\n")


def main() -> None:
    ENDPOINTS.mkdir(parents=True, exist_ok=True)
    write_routes_ts()
    write_types_ts()
    groups: dict[str, list] = {}
    for route in ROUTES:
        groups.setdefault(route[0], []).append(route)
    for group, routes in groups.items():
        write_group_file(group, routes)
    write_endpoints_index()
    write_index_ts()
    print(f"Generated {len(ROUTES)} endpoints in {len(groups)} groups")


if __name__ == "__main__":
    main()
