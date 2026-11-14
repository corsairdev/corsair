import { z } from 'zod';

// Every operation in Custom Api 2.0 answers the same envelope,
// `{ status, message, data }`, which `call.ts` unwraps before the output schema
// parses `data`. Output objects are `.loose()` and their documented fields
// nullish, so a field Pointagram adds or omits cannot fail a call that has
// already happened. Reference: Pointagram's published OpenAPI spec,
// https://www.pointagram.com/wp-content/uploads/2025/02/openapi.yaml

/**
 * Pointagram labels every scalar in its spec `string`, including the ones whose
 * examples print an unquoted number (`id: 527947`, `is_org_admin: 1`). Its
 * responses are PHP `json_encode` output, which sends an int as a number, so
 * both spellings are accepted rather than failing a read that has already
 * happened.
 */
const IdSchema = z.union([z.string().min(1), z.number()]);

/** Path identifiers: the spec types them `integer` while responses show strings. */
const PathIdSchema = z.union([z.string().min(1), z.number().int().positive()]);

/**
 * Pointagram writes its flags as the strings `"1"` and `"0"`. A caller may pass
 * either form; `normalizeFlag` turns it into the documented one before sending.
 */
const FlagInputSchema = z
	.union([
		z.boolean(),
		z.literal(0),
		z.literal(1),
		z.literal('0'),
		z.literal('1'),
	])
	.optional()
	.describe('1 or 0.');

/** The documented wire value for a flag, or undefined when it was not supplied. */
export function normalizeFlag(
	value: boolean | 0 | 1 | '0' | '1' | undefined,
): '1' | '0' | undefined {
	if (value === undefined) return undefined;
	return value === true || value === 1 || value === '1' ? '1' : '0';
}

export const PointagramPaginationSchema = z
	.object({
		limit: IdSchema.nullish(),
		offset: IdSchema.nullish(),
		next_offset: IdSchema.nullish().describe('Set while another page exists.'),
	})
	.loose();

export type PointagramPagination = z.infer<typeof PointagramPaginationSchema>;

// ── test.credentials ──────────────────────────────────────────────────────

const TestCredentialsInputSchema = z.object({});

export type TestCredentialsInput = z.infer<typeof TestCredentialsInputSchema>;

const TestCredentialsOutputSchema = z
	.object({
		organization: z
			.string()
			.nullish()
			.describe('The account the key belongs to.'),
	})
	.loose();

export type TestCredentialsOutput = z.infer<typeof TestCredentialsOutputSchema>;

// ── players ───────────────────────────────────────────────────────────────

export const PlayerSchema = z
	.object({
		id: IdSchema.nullish(),
		// The list uses `name`/`emailaddress`/`external_id`; the single-player
		// response documents `player_name`/`player_email`/`player_external_id`
		// instead, so one loose schema covers both documented shapes.
		name: z.string().nullish(),
		player_name: z.string().nullish(),
		emailaddress: z.string().nullish(),
		player_email: z.string().nullish(),
		external_id: IdSchema.nullish(),
		player_external_id: IdSchema.nullish(),
		is_org_admin: IdSchema.nullish(),
		icon: z.string().nullish(),
		icon_url: z.string().nullish(),
	})
	.loose();

export type PointagramPlayer = z.infer<typeof PlayerSchema>;

export const POINTAGRAM_DEFAULT_PAGE_SIZE = 50;
export const POINTAGRAM_MAX_PAGE_SIZE = 1000;

const searchBySchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Which player field the filter is matched against. The docs name Email, Name and External Id.',
	);

const pageLimitSchema = z
	.number()
	.int()
	.positive()
	.max(POINTAGRAM_MAX_PAGE_SIZE)
	.optional()
	.describe(
		`Page size. Defaults to ${POINTAGRAM_DEFAULT_PAGE_SIZE}, and the maximum is ${POINTAGRAM_MAX_PAGE_SIZE}.`,
	);

const pageOffsetSchema = z
	.string()
	.min(1)
	.optional()
	.describe("The previous page's `pagination.next_offset`.");

const PlayersListInputSchema = z.object({
	search_by: searchBySchema,
	filter: z
		.string()
		.min(1)
		.optional()
		.describe('Search value, matched against `search_by`.'),
	limit: pageLimitSchema,
	offset: pageOffsetSchema,
});

export type PlayersListInput = z.infer<typeof PlayersListInputSchema>;

const PlayersListOutputSchema = z.object({
	players: z.array(PlayerSchema),
	pagination: PointagramPaginationSchema.optional(),
});

export type PlayersListOutput = z.infer<typeof PlayersListOutputSchema>;

const PlayersGetInputSchema = z.object({
	id: PathIdSchema.describe('The profile id of the player.'),
});

export type PlayersGetInput = z.infer<typeof PlayersGetInputSchema>;

const PlayersCreateInputSchema = z.object({
	player_name: z.string().min(1).describe('The name shown in Pointagram.'),
	player_email: z
		.string()
		.min(1)
		.optional()
		.describe('Where the invitation goes.'),
	player_external_id: z
		.string()
		.min(1)
		.optional()
		.describe('Your own identifier, kept on the player.'),
	offline: FlagInputSchema.describe(
		'1 creates the player without sending an invitation; 0 invites them.',
	),
});

export type PlayersCreateInput = z.infer<typeof PlayersCreateInputSchema>;

const PlayersUpdateInputSchema = z.object({
	id: PathIdSchema.describe('The profile id of the player to update.'),
	// Every field is optional: the docs point update at the same Player body as
	// create without saying which fields are required to change one, and only
	// create states that a name is mandatory.
	player_name: z
		.string()
		.min(1)
		.optional()
		.describe('The name shown in Pointagram.'),
	player_email: z
		.string()
		.min(1)
		.optional()
		.describe('Where the invitation goes.'),
	player_external_id: z
		.string()
		.min(1)
		.optional()
		.describe('Your own identifier, kept on the player.'),
	offline: FlagInputSchema.describe(
		'1 keeps the player offline; 0 makes them online.',
	),
});

export type PlayersUpdateInput = z.infer<typeof PlayersUpdateInputSchema>;

const PlayersDeleteInputSchema = z.object({
	id: PathIdSchema.describe('The profile id of the player to remove.'),
});

export type PlayersDeleteInput = z.infer<typeof PlayersDeleteInputSchema>;

/**
 * A 200 whose envelope message is the only confirmation: `data` is `{}` here,
 * and Pointagram's docs warn that a missing player and an admin both answer
 * 200 with an error message rather than a failure status.
 */
const MessageOutputSchema = z.object({
	success: z.literal(true),
	message: z.string().min(1).describe("Pointagram's confirmation text."),
});

export type MessageOutput = z.infer<typeof MessageOutputSchema>;

const ProfileIdOutputSchema = z
	.object({
		profile_id: IdSchema.nullish(),
	})
	.loose();

export type ProfileIdOutput = z.infer<typeof ProfileIdOutputSchema>;

// ── teams ─────────────────────────────────────────────────────────────────

export const POINTAGRAM_TEAM_ICONS = [
	'Bears.png',
	'Bulls.png',
	'Cobras.png',
	'Lions.png',
	'Raccons.png',
	'Sharks.png',
	'Tigers.png',
] as const;

export const TeamSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		icon: z.string().nullish(),
		icon_url: z.string().nullish(),
	})
	.loose();

export type PointagramTeam = z.infer<typeof TeamSchema>;

const TeamsListInputSchema = z.object({});

export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

const TeamsListOutputSchema = z.object({
	teams: z.array(TeamSchema),
});

export type TeamsListOutput = z.infer<typeof TeamsListOutputSchema>;

const TeamsGetInputSchema = z.object({
	id: PathIdSchema.describe('The id of the team.'),
});

export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;

const TeamsCreateInputSchema = z.object({
	team_name: z.string().min(1).describe('The name shown in Pointagram.'),
	icon: z
		.string()
		.min(1)
		.describe(
			'The icon file name, from the standard set or one you uploaded in Pointagram.',
		),
	filter_ignore: FlagInputSchema.describe(
		'1 exempts this team from the account filter settings.',
	),
});

export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;

const TeamsUpdateInputSchema = z.object({
	id: PathIdSchema.describe('The id of the team to update.'),
	team_name: z.string().min(1).describe('The name shown in Pointagram.'),
	icon: z
		.string()
		.min(1)
		.describe(
			'The icon file name, from the standard set or one you uploaded in Pointagram.',
		),
	filter_ignore: FlagInputSchema.describe(
		'1 exempts this team from the account filter settings.',
	),
});

export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;

/** `player_id`, `player_external_id` or `player_email` identifies the player. */
export const TeamsAddPlayerInputSchema = z
	.object({
		id: PathIdSchema.describe('The id of the team.'),
		player_id: PathIdSchema.optional(),
		player_external_id: z.string().min(1).optional(),
		player_email: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		if (
			value.player_id === undefined &&
			value.player_external_id === undefined &&
			value.player_email === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Supply at least one of player_id, player_external_id or player_email.',
				path: ['player_id'],
			});
		}
	});

export type TeamsAddPlayerInput = z.infer<typeof TeamsAddPlayerInputSchema>;

const TeamIdOutputSchema = z
	.object({
		team_id: IdSchema.nullish(),
	})
	.loose();

export type TeamIdOutput = z.infer<typeof TeamIdOutputSchema>;

const TeamsListPlayersInputSchema = z.object({
	id: PathIdSchema.describe('The id of the team.'),
});

export type TeamsListPlayersInput = z.infer<typeof TeamsListPlayersInputSchema>;

const TeamMemberSchema = z
	.object({
		profile_id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type PointagramTeamMember = z.infer<typeof TeamMemberSchema>;

const TeamsListPlayersOutputSchema = z.object({
	players: z.array(TeamMemberSchema),
});

export type TeamsListPlayersOutput = z.infer<
	typeof TeamsListPlayersOutputSchema
>;

const TeamsRemovePlayerInputSchema = z.object({
	id: PathIdSchema.describe('The id of the team.'),
	player_id: PathIdSchema.describe('The profile id of the player to remove.'),
});

export type TeamsRemovePlayerInput = z.infer<
	typeof TeamsRemovePlayerInputSchema
>;

// ── scoreSeries ───────────────────────────────────────────────────────────

export const ScoreSeriesSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		point_name_singular: z.string().nullish(),
		point_name_plural: z.string().nullish(),
		icon: z.string().nullish(),
		icon_url: z.string().nullish(),
	})
	.loose();

export type PointagramScoreSeries = z.infer<typeof ScoreSeriesSchema>;

const ScoreSeriesListInputSchema = z.object({});

export type ScoreSeriesListInput = z.infer<typeof ScoreSeriesListInputSchema>;

const ScoreSeriesListOutputSchema = z.object({
	series: z.array(ScoreSeriesSchema),
});

export type ScoreSeriesListOutput = z.infer<typeof ScoreSeriesListOutputSchema>;

const ScoreSeriesGetInputSchema = z.object({
	id: PathIdSchema.describe('The id of the score series.'),
});

export type ScoreSeriesGetInput = z.infer<typeof ScoreSeriesGetInputSchema>;

export const PointTypeSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type PointagramPointType = z.infer<typeof PointTypeSchema>;

const ScoreSeriesPointTypesInputSchema = z.object({
	id: PathIdSchema.describe('The id of the score series.'),
});

export type ScoreSeriesPointTypesInput = z.infer<
	typeof ScoreSeriesPointTypesInputSchema
>;

const ScoreSeriesPointTypesOutputSchema = z.object({
	pointtypes: z.array(PointTypeSchema),
});

export type ScoreSeriesPointTypesOutput = z.infer<
	typeof ScoreSeriesPointTypesOutputSchema
>;

/** A tag carried with a scored point; sent as `[{ "name": "North" }]`. */
export const PointagramScoreTagSchema = z.object({
	name: z.string().min(1),
});

export type PointagramScoreTag = z.infer<typeof PointagramScoreTagSchema>;

export const ScoreSeriesAddPointsInputSchema = z
	.object({
		// One of these four identifies the player. The API accepts a name and an
		// email as well as the id, so all four are exposed.
		player_id: PathIdSchema.optional(),
		player_name: z.string().min(1).optional(),
		player_email: z.string().min(1).optional(),
		player_external_id: z.string().min(1).optional(),
		scoreseries_id: PathIdSchema.optional(),
		scoreseries_name: z.string().min(1).optional(),
		points: z
			.number()
			.int()
			.optional()
			.describe('How many points to add. Supply this or pointtype_name.'),
		pointtype_name: z
			.string()
			.min(1)
			.optional()
			.describe(
				'A point type scores a fixed number of points; the score series must define it.',
			),
		source_score_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Your transaction reference. Sending it again revokes the earlier transaction and adds a new one, so a retried call does not double-score.',
			),
		comment: z
			.string()
			.min(1)
			.optional()
			.describe('Shown with the point in the news feed.'),
		score_time: z
			.string()
			.min(1)
			.optional()
			.describe(
				'When the points were scored, if not now. Sent unchanged, so include the offset.',
			),
		tags: z
			.array(PointagramScoreTagSchema)
			.optional()
			.describe('Tags to display with the scored point.'),
		create_player: FlagInputSchema.describe(
			'1 creates the player when no player with that id, name, email or external id exists.',
		),
		create_tags: FlagInputSchema.describe(
			'1 creates tags that do not exist yet.',
		),
	})
	.superRefine((value, ctx) => {
		if (
			value.player_id === undefined &&
			value.player_name === undefined &&
			value.player_email === undefined &&
			value.player_external_id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Supply at least one of player_id, player_name, player_email or player_external_id.',
				path: ['player_id'],
			});
		}
		if (value.scoreseries_id === undefined) {
			if (value.scoreseries_name === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'Supply scoreseries_id or scoreseries_name.',
					path: ['scoreseries_id'],
				});
			}
		} else if (value.scoreseries_name !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply either scoreseries_id or scoreseries_name, not both.',
				path: ['scoreseries_name'],
			});
		}
		if (value.points === undefined && value.pointtype_name === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply points or pointtype_name.',
				path: ['points'],
			});
		}
	});

export type ScoreSeriesAddPointsInput = z.infer<
	typeof ScoreSeriesAddPointsInputSchema
>;

const ScoreSeriesAddPointsOutputSchema = z
	.object({
		insid: IdSchema.nullish().describe('The id of the transaction.'),
	})
	.loose();

export type ScoreSeriesAddPointsOutput = z.infer<
	typeof ScoreSeriesAddPointsOutputSchema
>;

export const HistoryEntrySchema = z
	.object({
		id: IdSchema.nullish(),
		profile_id: IdSchema.nullish(),
		icon: z.string().nullish(),
		name: z.string().nullish(),
		emailaddress: z.string().nullish(),
		score: IdSchema.nullish(),
		comment: z.string().nullish(),
		timestamp: z.string().nullish(),
	})
	.loose();

export type PointagramHistoryEntry = z.infer<typeof HistoryEntrySchema>;

export const POINTAGRAM_HISTORY_MAX_PAGE_SIZE = 1000;

/**
 * The docs filter history by `{ id, type }`, where type 1 is a tag and type 2 a
 * point type. `id` is documented as a quoted string and `type` as the integer.
 */
export const HistoryFilterSchema = z.object({
	id: z.string().min(1).describe('The tag or point type id.'),
	type: z
		.union([z.literal(1), z.literal(2)])
		.describe('1 matches a tag, 2 matches a point type.'),
});

export type PointagramHistoryFilter = z.infer<typeof HistoryFilterSchema>;

export const ScoreSeriesHistoryInputSchema = z.object({
	id: PathIdSchema.describe('The id of the score series.'),
	tags_filter: z
		.array(HistoryFilterSchema)
		.optional()
		.describe('Only points matching all of these tag or point type filters.'),
	tags_or_filter: z
		.array(HistoryFilterSchema)
		.optional()
		.describe('Only points matching any of these tag or point type filters.'),
	teams_filter: z
		.array(PathIdSchema)
		.optional()
		.describe('Only points scored by players in these teams.'),
	player_filter: z
		.array(PathIdSchema)
		.optional()
		.describe('Only points scored by these players.'),
	time_from: z
		.string()
		.min(1)
		.optional()
		.describe('UTC start, such as 2022-12-05 23:00:00.'),
	time_to: z
		.string()
		.min(1)
		.optional()
		.describe('UTC end, such as 2022-12-05 23:00:00.'),
	show_revoked: z
		.boolean()
		.optional()
		.describe('Include points that were revoked, which are hidden by default.'),
	limit: z
		.number()
		.int()
		.positive()
		.max(POINTAGRAM_HISTORY_MAX_PAGE_SIZE)
		.optional()
		.describe(
			`Page size. Defaults to ${POINTAGRAM_DEFAULT_PAGE_SIZE}, and the maximum is ${POINTAGRAM_HISTORY_MAX_PAGE_SIZE}.`,
		),
	offset: pageOffsetSchema,
});

export type ScoreSeriesHistoryInput = z.infer<
	typeof ScoreSeriesHistoryInputSchema
>;

const ScoreSeriesHistoryOutputSchema = z.object({
	history: z.array(HistoryEntrySchema),
	pagination: PointagramPaginationSchema.optional(),
});

export type ScoreSeriesHistoryOutput = z.infer<
	typeof ScoreSeriesHistoryOutputSchema
>;

// ── competitions ──────────────────────────────────────────────────────────

export const CompetitionSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		repeat_end_date: z.string().nullish(),
		grand_target: IdSchema.nullish(),
		// Pointagram's own spelling of the field.
		invindual_player_targets: IdSchema.nullish(),
		is_stopped: IdSchema.nullish(),
		access_key: z.string().nullish(),
		competition_type: IdSchema.nullish(),
		db_display_order: z.string().nullish(),
		use_target: IdSchema.nullish(),
		winner_rule: IdSchema.nullish(),
		groupingmode: IdSchema.nullish(),
	})
	.loose();

export type PointagramCompetition = z.infer<typeof CompetitionSchema>;

const CompetitionsListInputSchema = z.object({
	search_by: searchBySchema,
	filter: z
		.string()
		.min(1)
		.optional()
		.describe('Lists only competitions for the given player.'),
	competition_id: z
		.string()
		.min(1)
		.optional()
		.describe('Lists only the competition with this id.'),
	accesskey: z
		.string()
		.min(1)
		.optional()
		.describe('Lists only the competition with this access id.'),
});

export type CompetitionsListInput = z.infer<typeof CompetitionsListInputSchema>;

const CompetitionsListOutputSchema = z.object({
	competitions: z.array(CompetitionSchema),
});

export type CompetitionsListOutput = z.infer<
	typeof CompetitionsListOutputSchema
>;

const CompetitionsGetInputSchema = z.object({
	id: PathIdSchema.describe('The id of the competition.'),
});

export type CompetitionsGetInput = z.infer<typeof CompetitionsGetInputSchema>;

const CompetitionPlayerSchema = z
	.object({
		profile_id: IdSchema.nullish(),
		name: z.string().nullish(),
		invidual_target: IdSchema.nullish(),
		current_score: IdSchema.nullish(),
		rank: IdSchema.nullish(),
		rank_locked: IdSchema.nullish(),
	})
	.loose();

export type PointagramCompetitionPlayer = z.infer<
	typeof CompetitionPlayerSchema
>;

const CompetitionsPlayersInputSchema = z.object({
	id: PathIdSchema.describe('The id of the competition.'),
});

export type CompetitionsPlayersInput = z.infer<
	typeof CompetitionsPlayersInputSchema
>;

const CompetitionsPlayersOutputSchema = z.object({
	players: z.array(CompetitionPlayerSchema),
});

export type CompetitionsPlayersOutput = z.infer<
	typeof CompetitionsPlayersOutputSchema
>;

// ── rewardStore ───────────────────────────────────────────────────────────

const RewardStoreProfileIdSchema = z
	.string()
	.min(1)
	.describe('The profile id the request acts for.');

export const CurrencySchema = z
	.object({
		id: IdSchema.nullish(),
		icon: z.string().nullish(),
		name: z.string().nullish(),
		currencyid: IdSchema.nullish(),
		coins: IdSchema.nullish(),
	})
	.loose();

export type PointagramCurrency = z.infer<typeof CurrencySchema>;

const RewardStoreSettingsInputSchema = z.object({
	profileid: RewardStoreProfileIdSchema,
});

export type RewardStoreSettingsInput = z.infer<
	typeof RewardStoreSettingsInputSchema
>;

const RewardStoreSettingsOutputSchema = z
	.object({
		id: IdSchema.nullish(),
		pggroup: IdSchema.nullish(),
		name: z.string().nullish(),
		active: IdSchema.nullish(),
		canedit: IdSchema.nullish(),
		// The spec declares an array of objects but writes the example as a JSON
		// string, so both spellings are accepted rather than failing the read.
		currencies: z
			.union([z.array(CurrencySchema), z.string()])
			.nullish()
			.describe('The currencies this store accepts.'),
		orders: IdSchema.nullish(),
	})
	.loose();

export type RewardStoreSettingsOutput = z.infer<
	typeof RewardStoreSettingsOutputSchema
>;

/** The tag example Pointagram prints beside a reward item. */
export const RewardItemTagSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		linkid: IdSchema.nullish(),
	})
	.loose();

export const RewardItemSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		image: z.string().nullish(),
		currency: IdSchema.nullish(),
		price: IdSchema.nullish(),
		stock: IdSchema.nullish(),
		// Pointagram's camelCase fields, next to its snake_case ones.
		startDate: z.string().nullish(),
		endDate: z.string().nullish(),
		publishphase: IdSchema.nullish(),
		description: z.string().nullish(),
		scoreseriesid: IdSchema.nullish(),
		currencyname: z.string().nullish(),
		currencyicon: z.string().nullish(),
		currencysingular: z.string().nullish(),
		currencyplural: z.string().nullish(),
		coins: IdSchema.nullish(),
		// The docs show `{ id, name, linkid }` as a store tag.
		tags: z.array(RewardItemTagSchema).nullish(),
		image_url: z.string().nullish(),
		currencyicon_url: z.string().nullish(),
	})
	.loose();

export type PointagramRewardItem = z.infer<typeof RewardItemSchema>;

const RewardStoreItemsInputSchema = z.object({
	profileid: RewardStoreProfileIdSchema,
	storeid: z
		.string()
		.min(1)
		.optional()
		.describe('Which store to read items from.'),
});

export type RewardStoreItemsInput = z.infer<typeof RewardStoreItemsInputSchema>;

const RewardStoreItemsOutputSchema = z.object({
	reward_items: z.array(RewardItemSchema),
});

export type RewardStoreItemsOutput = z.infer<
	typeof RewardStoreItemsOutputSchema
>;

const RewardStoreItemInputSchema = z.object({
	id: PathIdSchema.describe('The id of the reward item.'),
	profileid: RewardStoreProfileIdSchema,
	storeid: z
		.string()
		.min(1)
		.optional()
		.describe('Which store to read the item from.'),
});

export type RewardStoreItemInput = z.infer<typeof RewardStoreItemInputSchema>;

export const OrderSchema = z
	.object({
		id: IdSchema.nullish(),
		group_member: IdSchema.nullish(),
		deliverystatus: z.string().nullish(),
		updated: z.string().nullish(),
		delivered_date: z.string().nullish(),
		bought_date: z.string().nullish(),
		reward_item: IdSchema.nullish(),
		quantity: IdSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		itemicon: z.string().nullish(),
		profile_id: IdSchema.nullish(),
		profileicon: z.string().nullish(),
		profilename: z.string().nullish(),
		itemicon_url: z.string().nullish(),
		profileicon_url: z.string().nullish(),
	})
	.loose();

export type PointagramOrder = z.infer<typeof OrderSchema>;

export const POINTAGRAM_DELIVERY_STATUSES = [
	'PURCHASED',
	'PROCESSED',
	'DELIVERED',
] as const;

const RewardStorePurchasesInputSchema = z.object({
	profileid: RewardStoreProfileIdSchema,
	viewmember: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The group id of a member whose orders to read, or 'all' for every purchase. Defaults to your own.",
		),
	storeid: z
		.string()
		.min(1)
		.optional()
		.describe('Which store to read orders from.'),
});

export type RewardStorePurchasesInput = z.infer<
	typeof RewardStorePurchasesInputSchema
>;

const RewardStorePurchasesOutputSchema = z.object({
	purchases: z.array(OrderSchema),
});

export type RewardStorePurchasesOutput = z.infer<
	typeof RewardStorePurchasesOutputSchema
>;

const RewardStorePurchaseInputSchema = z.object({
	profileid: z
		.string()
		.min(1)
		.describe(
			'The player the order is for. Without admin access it must be your own profile id.',
		),
	quantity: z.number().int().positive().describe('How many of the item.'),
	itemid: PathIdSchema.describe('The id of the reward item to order.'),
});

export type RewardStorePurchaseInput = z.infer<
	typeof RewardStorePurchaseInputSchema
>;

const RewardStorePurchaseOutputSchema = z
	.object({
		purchase_id: IdSchema.nullish(),
	})
	.loose();

export type RewardStorePurchaseOutput = z.infer<
	typeof RewardStorePurchaseOutputSchema
>;

const RewardStoreUpdatePurchaseInputSchema = z.object({
	id: PathIdSchema.describe('The id of the purchase.'),
	profileid: RewardStoreProfileIdSchema,
	deliverystatus: z
		.enum(POINTAGRAM_DELIVERY_STATUSES)
		.describe('The new delivery status. Needs admin rights.'),
});

export type RewardStoreUpdatePurchaseInput = z.infer<
	typeof RewardStoreUpdatePurchaseInputSchema
>;

const RewardStoreRevokePurchaseInputSchema = z.object({
	id: PathIdSchema.describe('The id of the purchase to revoke.'),
	profileid: RewardStoreProfileIdSchema,
});

export type RewardStoreRevokePurchaseInput = z.infer<
	typeof RewardStoreRevokePurchaseInputSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PointagramEndpointInputs = {
	testCredentials: TestCredentialsInput;
	playersList: PlayersListInput;
	playersGet: PlayersGetInput;
	playersCreate: PlayersCreateInput;
	playersUpdate: PlayersUpdateInput;
	playersDelete: PlayersDeleteInput;
	teamsList: TeamsListInput;
	teamsGet: TeamsGetInput;
	teamsCreate: TeamsCreateInput;
	teamsUpdate: TeamsUpdateInput;
	teamsAddPlayer: TeamsAddPlayerInput;
	teamsListPlayers: TeamsListPlayersInput;
	teamsRemovePlayer: TeamsRemovePlayerInput;
	scoreSeriesList: ScoreSeriesListInput;
	scoreSeriesGet: ScoreSeriesGetInput;
	scoreSeriesAddPoints: ScoreSeriesAddPointsInput;
	scoreSeriesPointTypes: ScoreSeriesPointTypesInput;
	scoreSeriesHistory: ScoreSeriesHistoryInput;
	competitionsList: CompetitionsListInput;
	competitionsGet: CompetitionsGetInput;
	competitionsPlayers: CompetitionsPlayersInput;
	rewardStoreSettings: RewardStoreSettingsInput;
	rewardStoreItems: RewardStoreItemsInput;
	rewardStoreItem: RewardStoreItemInput;
	rewardStorePurchases: RewardStorePurchasesInput;
	rewardStorePurchase: RewardStorePurchaseInput;
	rewardStoreUpdatePurchase: RewardStoreUpdatePurchaseInput;
	rewardStoreRevokePurchase: RewardStoreRevokePurchaseInput;
};

export type PointagramEndpointOutputs = {
	testCredentials: TestCredentialsOutput;
	playersList: PlayersListOutput;
	playersGet: PointagramPlayer;
	playersCreate: ProfileIdOutput;
	playersUpdate: ProfileIdOutput;
	playersDelete: MessageOutput;
	teamsList: TeamsListOutput;
	teamsGet: PointagramTeam;
	teamsCreate: TeamIdOutput;
	teamsUpdate: TeamIdOutput;
	teamsAddPlayer: MessageOutput;
	teamsListPlayers: TeamsListPlayersOutput;
	teamsRemovePlayer: MessageOutput;
	scoreSeriesList: ScoreSeriesListOutput;
	scoreSeriesGet: PointagramScoreSeries;
	scoreSeriesAddPoints: ScoreSeriesAddPointsOutput;
	scoreSeriesPointTypes: ScoreSeriesPointTypesOutput;
	scoreSeriesHistory: ScoreSeriesHistoryOutput;
	competitionsList: CompetitionsListOutput;
	competitionsGet: PointagramCompetition;
	competitionsPlayers: CompetitionsPlayersOutput;
	rewardStoreSettings: RewardStoreSettingsOutput;
	rewardStoreItems: RewardStoreItemsOutput;
	rewardStoreItem: PointagramRewardItem;
	rewardStorePurchases: RewardStorePurchasesOutput;
	rewardStorePurchase: RewardStorePurchaseOutput;
	rewardStoreUpdatePurchase: MessageOutput;
	rewardStoreRevokePurchase: MessageOutput;
};

export const PointagramEndpointInputSchemas = {
	testCredentials: TestCredentialsInputSchema,
	playersList: PlayersListInputSchema,
	playersGet: PlayersGetInputSchema,
	playersCreate: PlayersCreateInputSchema,
	playersUpdate: PlayersUpdateInputSchema,
	playersDelete: PlayersDeleteInputSchema,
	teamsList: TeamsListInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsAddPlayer: TeamsAddPlayerInputSchema,
	teamsListPlayers: TeamsListPlayersInputSchema,
	teamsRemovePlayer: TeamsRemovePlayerInputSchema,
	scoreSeriesList: ScoreSeriesListInputSchema,
	scoreSeriesGet: ScoreSeriesGetInputSchema,
	scoreSeriesAddPoints: ScoreSeriesAddPointsInputSchema,
	scoreSeriesPointTypes: ScoreSeriesPointTypesInputSchema,
	scoreSeriesHistory: ScoreSeriesHistoryInputSchema,
	competitionsList: CompetitionsListInputSchema,
	competitionsGet: CompetitionsGetInputSchema,
	competitionsPlayers: CompetitionsPlayersInputSchema,
	rewardStoreSettings: RewardStoreSettingsInputSchema,
	rewardStoreItems: RewardStoreItemsInputSchema,
	rewardStoreItem: RewardStoreItemInputSchema,
	rewardStorePurchases: RewardStorePurchasesInputSchema,
	rewardStorePurchase: RewardStorePurchaseInputSchema,
	rewardStoreUpdatePurchase: RewardStoreUpdatePurchaseInputSchema,
	rewardStoreRevokePurchase: RewardStoreRevokePurchaseInputSchema,
} as const;

export const PointagramEndpointOutputSchemas = {
	testCredentials: TestCredentialsOutputSchema,
	playersList: PlayersListOutputSchema,
	playersGet: PlayerSchema,
	playersCreate: ProfileIdOutputSchema,
	playersUpdate: ProfileIdOutputSchema,
	playersDelete: MessageOutputSchema,
	teamsList: TeamsListOutputSchema,
	teamsGet: TeamSchema,
	teamsCreate: TeamIdOutputSchema,
	teamsUpdate: TeamIdOutputSchema,
	teamsAddPlayer: MessageOutputSchema,
	teamsListPlayers: TeamsListPlayersOutputSchema,
	teamsRemovePlayer: MessageOutputSchema,
	scoreSeriesList: ScoreSeriesListOutputSchema,
	scoreSeriesGet: ScoreSeriesSchema,
	scoreSeriesAddPoints: ScoreSeriesAddPointsOutputSchema,
	scoreSeriesPointTypes: ScoreSeriesPointTypesOutputSchema,
	scoreSeriesHistory: ScoreSeriesHistoryOutputSchema,
	competitionsList: CompetitionsListOutputSchema,
	competitionsGet: CompetitionSchema,
	competitionsPlayers: CompetitionsPlayersOutputSchema,
	rewardStoreSettings: RewardStoreSettingsOutputSchema,
	rewardStoreItems: RewardStoreItemsOutputSchema,
	rewardStoreItem: RewardItemSchema,
	rewardStorePurchases: RewardStorePurchasesOutputSchema,
	rewardStorePurchase: RewardStorePurchaseOutputSchema,
	rewardStoreUpdatePurchase: MessageOutputSchema,
	rewardStoreRevokePurchase: MessageOutputSchema,
} as const;
