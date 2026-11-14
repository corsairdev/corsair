import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Competitions,
	Players,
	RewardStore,
	ScoreSeries,
	Teams,
	Test,
} from './endpoints';
import type {
	PointagramEndpointInputs,
	PointagramEndpointOutputs,
} from './endpoints/types';
import {
	PointagramEndpointInputSchemas,
	PointagramEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PointagramSchema } from './schema';

/**
 * Pointagram authenticates with two headers, `Api-Key` and `Api-User`, and the
 * account key manager only creates accessors for account-level fields, so the
 * login goes here beside `api_key` rather than under `integration`.
 */
export const pointagramAuthConfig = {
	api_key: {
		account: ['api_user'] as const,
	},
} as const satisfies PluginAuthConfig;

export type PointagramPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The integration key. `key` is the binder-resolved credential for endpoint
	 * calls; this option is the override for scripts and tests.
	 */
	key?: string;
	hooks?: InternalPointagramPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pointagramEndpointsNested>;
};

export type PointagramContext = CorsairPluginContext<
	typeof PointagramSchema,
	PointagramPluginOptions,
	undefined,
	typeof pointagramAuthConfig
>;

export type PointagramKeyBuilderContext = KeyBuilderContext<
	PointagramPluginOptions,
	typeof pointagramAuthConfig
>;

export type PointagramBoundEndpoints = BindEndpoints<
	typeof pointagramEndpointsNested
>;

type PointagramEndpoint<K extends keyof PointagramEndpointOutputs> =
	CorsairEndpoint<
		PointagramContext,
		PointagramEndpointInputs[K],
		PointagramEndpointOutputs[K]
	>;

export type PointagramEndpoints = {
	testCredentials: PointagramEndpoint<'testCredentials'>;
	playersList: PointagramEndpoint<'playersList'>;
	playersGet: PointagramEndpoint<'playersGet'>;
	playersCreate: PointagramEndpoint<'playersCreate'>;
	playersUpdate: PointagramEndpoint<'playersUpdate'>;
	playersDelete: PointagramEndpoint<'playersDelete'>;
	teamsList: PointagramEndpoint<'teamsList'>;
	teamsGet: PointagramEndpoint<'teamsGet'>;
	teamsCreate: PointagramEndpoint<'teamsCreate'>;
	teamsUpdate: PointagramEndpoint<'teamsUpdate'>;
	teamsAddPlayer: PointagramEndpoint<'teamsAddPlayer'>;
	teamsListPlayers: PointagramEndpoint<'teamsListPlayers'>;
	teamsRemovePlayer: PointagramEndpoint<'teamsRemovePlayer'>;
	scoreSeriesList: PointagramEndpoint<'scoreSeriesList'>;
	scoreSeriesGet: PointagramEndpoint<'scoreSeriesGet'>;
	scoreSeriesAddPoints: PointagramEndpoint<'scoreSeriesAddPoints'>;
	scoreSeriesPointTypes: PointagramEndpoint<'scoreSeriesPointTypes'>;
	scoreSeriesHistory: PointagramEndpoint<'scoreSeriesHistory'>;
	competitionsList: PointagramEndpoint<'competitionsList'>;
	competitionsGet: PointagramEndpoint<'competitionsGet'>;
	competitionsPlayers: PointagramEndpoint<'competitionsPlayers'>;
	rewardStoreSettings: PointagramEndpoint<'rewardStoreSettings'>;
	rewardStoreItems: PointagramEndpoint<'rewardStoreItems'>;
	rewardStoreItem: PointagramEndpoint<'rewardStoreItem'>;
	rewardStorePurchases: PointagramEndpoint<'rewardStorePurchases'>;
	rewardStorePurchase: PointagramEndpoint<'rewardStorePurchase'>;
	rewardStoreUpdatePurchase: PointagramEndpoint<'rewardStoreUpdatePurchase'>;
	rewardStoreRevokePurchase: PointagramEndpoint<'rewardStoreRevokePurchase'>;
};

const pointagramEndpointsNested = {
	test: {
		credentials: Test.credentials,
	},
	players: {
		list: Players.list,
		get: Players.get,
		create: Players.create,
		update: Players.update,
		delete: Players.remove,
	},
	teams: {
		list: Teams.list,
		get: Teams.get,
		create: Teams.create,
		update: Teams.update,
		addPlayer: Teams.addPlayer,
		listPlayers: Teams.listPlayers,
		removePlayer: Teams.removePlayer,
	},
	scoreSeries: {
		list: ScoreSeries.list,
		get: ScoreSeries.get,
		addPoints: ScoreSeries.addPoints,
		pointTypes: ScoreSeries.pointTypes,
		history: ScoreSeries.history,
	},
	competitions: {
		list: Competitions.list,
		get: Competitions.get,
		players: Competitions.players,
	},
	rewardStore: {
		settings: RewardStore.settings,
		items: RewardStore.items,
		item: RewardStore.item,
		purchases: RewardStore.purchases,
		purchase: RewardStore.purchase,
		updatePurchase: RewardStore.updatePurchase,
		revokePurchase: RewardStore.revokePurchase,
	},
} as const;

export const pointagramEndpointSchemas = {
	'test.credentials': {
		input: PointagramEndpointInputSchemas.testCredentials,
		output: PointagramEndpointOutputSchemas.testCredentials,
	},
	'players.list': {
		input: PointagramEndpointInputSchemas.playersList,
		output: PointagramEndpointOutputSchemas.playersList,
	},
	'players.get': {
		input: PointagramEndpointInputSchemas.playersGet,
		output: PointagramEndpointOutputSchemas.playersGet,
	},
	'players.create': {
		input: PointagramEndpointInputSchemas.playersCreate,
		output: PointagramEndpointOutputSchemas.playersCreate,
	},
	'players.update': {
		input: PointagramEndpointInputSchemas.playersUpdate,
		output: PointagramEndpointOutputSchemas.playersUpdate,
	},
	'players.delete': {
		input: PointagramEndpointInputSchemas.playersDelete,
		output: PointagramEndpointOutputSchemas.playersDelete,
	},
	'teams.list': {
		input: PointagramEndpointInputSchemas.teamsList,
		output: PointagramEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: PointagramEndpointInputSchemas.teamsGet,
		output: PointagramEndpointOutputSchemas.teamsGet,
	},
	'teams.create': {
		input: PointagramEndpointInputSchemas.teamsCreate,
		output: PointagramEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: PointagramEndpointInputSchemas.teamsUpdate,
		output: PointagramEndpointOutputSchemas.teamsUpdate,
	},
	'teams.addPlayer': {
		input: PointagramEndpointInputSchemas.teamsAddPlayer,
		output: PointagramEndpointOutputSchemas.teamsAddPlayer,
	},
	'teams.listPlayers': {
		input: PointagramEndpointInputSchemas.teamsListPlayers,
		output: PointagramEndpointOutputSchemas.teamsListPlayers,
	},
	'teams.removePlayer': {
		input: PointagramEndpointInputSchemas.teamsRemovePlayer,
		output: PointagramEndpointOutputSchemas.teamsRemovePlayer,
	},
	'scoreSeries.list': {
		input: PointagramEndpointInputSchemas.scoreSeriesList,
		output: PointagramEndpointOutputSchemas.scoreSeriesList,
	},
	'scoreSeries.get': {
		input: PointagramEndpointInputSchemas.scoreSeriesGet,
		output: PointagramEndpointOutputSchemas.scoreSeriesGet,
	},
	'scoreSeries.addPoints': {
		input: PointagramEndpointInputSchemas.scoreSeriesAddPoints,
		output: PointagramEndpointOutputSchemas.scoreSeriesAddPoints,
	},
	'scoreSeries.pointTypes': {
		input: PointagramEndpointInputSchemas.scoreSeriesPointTypes,
		output: PointagramEndpointOutputSchemas.scoreSeriesPointTypes,
	},
	'scoreSeries.history': {
		input: PointagramEndpointInputSchemas.scoreSeriesHistory,
		output: PointagramEndpointOutputSchemas.scoreSeriesHistory,
	},
	'competitions.list': {
		input: PointagramEndpointInputSchemas.competitionsList,
		output: PointagramEndpointOutputSchemas.competitionsList,
	},
	'competitions.get': {
		input: PointagramEndpointInputSchemas.competitionsGet,
		output: PointagramEndpointOutputSchemas.competitionsGet,
	},
	'competitions.players': {
		input: PointagramEndpointInputSchemas.competitionsPlayers,
		output: PointagramEndpointOutputSchemas.competitionsPlayers,
	},
	'rewardStore.settings': {
		input: PointagramEndpointInputSchemas.rewardStoreSettings,
		output: PointagramEndpointOutputSchemas.rewardStoreSettings,
	},
	'rewardStore.items': {
		input: PointagramEndpointInputSchemas.rewardStoreItems,
		output: PointagramEndpointOutputSchemas.rewardStoreItems,
	},
	'rewardStore.item': {
		input: PointagramEndpointInputSchemas.rewardStoreItem,
		output: PointagramEndpointOutputSchemas.rewardStoreItem,
	},
	'rewardStore.purchases': {
		input: PointagramEndpointInputSchemas.rewardStorePurchases,
		output: PointagramEndpointOutputSchemas.rewardStorePurchases,
	},
	'rewardStore.purchase': {
		input: PointagramEndpointInputSchemas.rewardStorePurchase,
		output: PointagramEndpointOutputSchemas.rewardStorePurchase,
	},
	'rewardStore.updatePurchase': {
		input: PointagramEndpointInputSchemas.rewardStoreUpdatePurchase,
		output: PointagramEndpointOutputSchemas.rewardStoreUpdatePurchase,
	},
	'rewardStore.revokePurchase': {
		input: PointagramEndpointInputSchemas.rewardStoreRevokePurchase,
		output: PointagramEndpointOutputSchemas.rewardStoreRevokePurchase,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pointagramEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const pointagramEndpointMeta = {
	'test.credentials': {
		riskLevel: 'read',
		description:
			'Confirm the Api-Key and Api-User pair and read the organization it belongs to; touches no tenant data',
	},
	'players.list': {
		riskLevel: 'read',
		description:
			'List players, optionally filtered by name, email or external id, with `next_offset` paging',
	},
	'players.get': {
		riskLevel: 'read',
		description: 'Read one player by profile id',
	},
	'players.create': {
		// Creating an online player sends them an invitation, and R8 classifies any
		// operation that sends a message as destructive. R9 settles that a risk
		// level is per operation, not per input, so the offline path shares it.
		riskLevel: 'destructive',
		description:
			'Create a player; an online player is also invited. A player that already exists is reported as a failure, not created twice',
	},
	'players.update': {
		riskLevel: 'write',
		description: "Update a player's name, email, external id or online status",
	},
	'players.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft delete a player. Pointagram keeps the record for you to anonymize in the app, and refuses to remove admin users',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Read one team by id',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team with a name and an icon',
	},
	'teams.update': {
		riskLevel: 'write',
		description: "Update a team's name, icon or filter setting",
	},
	'teams.addPlayer': {
		riskLevel: 'write',
		description:
			'Add a player to a team, identified by player id, external id or email',
	},
	'teams.listPlayers': {
		riskLevel: 'read',
		description: 'List the players in a team',
	},
	'teams.removePlayer': {
		riskLevel: 'destructive',
		description:
			'Remove a player from a team. The player keeps their points and stays in Pointagram',
	},
	'scoreSeries.list': {
		riskLevel: 'read',
		description: 'List score series',
	},
	'scoreSeries.get': {
		riskLevel: 'read',
		description: 'Read one score series by id',
	},
	'scoreSeries.addPoints': {
		riskLevel: 'write',
		description:
			'Score points for a player in a score series, optionally with a comment, tags and a transaction reference that makes a repeat call replace the earlier one',
	},
	'scoreSeries.pointTypes': {
		riskLevel: 'read',
		description: 'List the point types a score series defines',
	},
	'scoreSeries.history': {
		riskLevel: 'read',
		description:
			'Read the points history of a score series, filtered by tag, point type, team, player and time window, with `next_offset` paging',
	},
	'competitions.list': {
		riskLevel: 'read',
		description:
			'List competitions, optionally narrowed to one player, id or access key',
	},
	'competitions.get': {
		riskLevel: 'read',
		description: 'Read one competition by id',
	},
	'competitions.players': {
		riskLevel: 'read',
		description: 'List the players in a competition with their score and rank',
	},
	'rewardStore.settings': {
		riskLevel: 'read',
		description: 'Read the reward store settings and currencies for a profile',
	},
	'rewardStore.items': {
		riskLevel: 'read',
		description: 'List the items in a reward store',
	},
	'rewardStore.item': {
		riskLevel: 'read',
		description: 'Read one reward store item',
	},
	'rewardStore.purchases': {
		riskLevel: 'read',
		description:
			'List the orders in a reward store, for one member or for everyone',
	},
	'rewardStore.purchase': {
		riskLevel: 'destructive',
		description:
			"Spend a player's currency on a reward store item, which creates an order to fulfil",
	},
	'rewardStore.updatePurchase': {
		riskLevel: 'write',
		description:
			'Move an order along its delivery status: PURCHASED, PROCESSED or DELIVERED. Needs admin rights',
	},
	'rewardStore.revokePurchase': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke an order. The docs do not say whether the spent currency is returned, so treat it as final',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof pointagramEndpointsNested
>;

export type BasePointagramPlugin<T extends PointagramPluginOptions> =
	CorsairPlugin<
		'pointagram',
		typeof PointagramSchema,
		typeof pointagramEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof pointagramAuthConfig
	>;

export type InternalPointagramPlugin =
	BasePointagramPlugin<PointagramPluginOptions>;

export type ExternalPointagramPlugin<T extends PointagramPluginOptions> =
	BasePointagramPlugin<T>;

export function pointagram<const T extends PointagramPluginOptions>(
	incomingOptions: PointagramPluginOptions & T = {} as PointagramPluginOptions &
		T,
): ExternalPointagramPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pointagram',
		authConfig: pointagramAuthConfig,
		schema: PointagramSchema,
		options,
		hooks: options.hooks,
		endpoints: pointagramEndpointsNested,
		webhooks: {},
		endpointMeta: pointagramEndpointMeta,
		endpointSchemas: pointagramEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PointagramKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pointagram', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPointagramPlugin;
}

export { PointagramAPIError } from './client';
export type {
	CompetitionsGetInput,
	CompetitionsListInput,
	CompetitionsListOutput,
	CompetitionsPlayersInput,
	CompetitionsPlayersOutput,
	MessageOutput,
	PlayersCreateInput,
	PlayersDeleteInput,
	PlayersGetInput,
	PlayersListInput,
	PlayersListOutput,
	PlayersUpdateInput,
	PointagramCompetition,
	PointagramCompetitionPlayer,
	PointagramCurrency,
	PointagramEndpointInputs,
	PointagramEndpointOutputs,
	PointagramHistoryEntry,
	PointagramHistoryFilter,
	PointagramOrder,
	PointagramPagination,
	PointagramPlayer,
	PointagramPointType,
	PointagramRewardItem,
	PointagramScoreSeries,
	PointagramScoreTag,
	PointagramTeam,
	PointagramTeamMember,
	ProfileIdOutput,
	RewardStoreItemInput,
	RewardStoreItemsInput,
	RewardStorePurchaseInput,
	RewardStorePurchasesInput,
	RewardStoreRevokePurchaseInput,
	RewardStoreSettingsInput,
	RewardStoreUpdatePurchaseInput,
	ScoreSeriesAddPointsInput,
	ScoreSeriesAddPointsOutput,
	ScoreSeriesGetInput,
	ScoreSeriesHistoryInput,
	ScoreSeriesHistoryOutput,
	ScoreSeriesListInput,
	ScoreSeriesListOutput,
	ScoreSeriesPointTypesInput,
	ScoreSeriesPointTypesOutput,
	TeamIdOutput,
	TeamsAddPlayerInput,
	TeamsCreateInput,
	TeamsGetInput,
	TeamsListInput,
	TeamsListOutput,
	TeamsListPlayersInput,
	TeamsRemovePlayerInput,
	TeamsUpdateInput,
	TestCredentialsInput,
	TestCredentialsOutput,
} from './endpoints/types';
