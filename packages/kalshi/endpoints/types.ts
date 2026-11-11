import { z } from 'zod';

// ── Shared building blocks ──────────────────────────────────────────────────

/** Prices are fixed-point dollar strings with up to 4 decimals, e.g. "0.5600". */
const DollarsInput = z
	.string()
	.regex(
		/^\d+(\.\d{1,4})?$/,
		'Price must be a dollar string with up to 4 decimals',
	);

/** Counts are fixed-point strings with up to 2 decimals, e.g. "10.00". */
const CountInput = z
	.string()
	.regex(/^\d+(\.\d{1,2})?$/, 'Count must be a string with up to 2 decimals');

const BookSide = z.enum(['bid', 'ask']);
const Limit = z.number().int().positive().optional();
const Cursor = z.string().optional();
const Subaccount = z.number().int().nonnegative().optional();

// ── Output models (loose: Kalshi may add fields; unknown ones pass through) ──

const PriceRangeSchema = z.object({
	start: z.string(),
	end: z.string(),
	step: z.string(),
});

const MarketSchema = z.looseObject({
	ticker: z.string(),
	event_ticker: z.string(),
	market_type: z.enum(['binary', 'scalar']).optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	yes_sub_title: z.string().optional(),
	no_sub_title: z.string().optional(),
	status: z.string(),
	open_time: z.string().optional(),
	close_time: z.string().optional(),
	yes_bid_dollars: z.string().optional(),
	yes_ask_dollars: z.string().optional(),
	no_bid_dollars: z.string().optional(),
	no_ask_dollars: z.string().optional(),
	last_price_dollars: z.string().optional(),
	volume_fp: z.string().optional(),
	volume_24h_fp: z.string().optional(),
	open_interest_fp: z.string().optional(),
	result: z.string().optional(),
	price_ranges: z.array(PriceRangeSchema).optional(),
});

const EventSchema = z.looseObject({
	event_ticker: z.string(),
	series_ticker: z.string(),
	title: z.string(),
	sub_title: z.string().optional(),
	category: z.string().optional(),
	mutually_exclusive: z.boolean().optional(),
	markets: z.array(MarketSchema).optional(),
});

const SeriesSchema = z.looseObject({
	ticker: z.string(),
	title: z.string(),
	frequency: z.string().optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).nullable().optional(),
	volume_fp: z.string().optional(),
});

const TradeSchema = z.looseObject({
	trade_id: z.string(),
	ticker: z.string(),
	count_fp: z.string(),
	yes_price_dollars: z.string(),
	no_price_dollars: z.string(),
	taker_outcome_side: z.string().optional(),
	created_time: z.string(),
});

const OrderSchema = z.looseObject({
	order_id: z.string(),
	client_order_id: z.string().optional(),
	ticker: z.string(),
	status: z.string(),
	outcome_side: z.string().optional(),
	book_side: z.string().optional(),
	type: z.string().optional(),
	yes_price_dollars: z.string().optional(),
	no_price_dollars: z.string().optional(),
	initial_count_fp: z.string().optional(),
	fill_count_fp: z.string().optional(),
	remaining_count_fp: z.string().optional(),
	created_time: z.string().nullable().optional(),
});

const FillSchema = z.looseObject({
	fill_id: z.string(),
	order_id: z.string(),
	ticker: z.string(),
	count_fp: z.string(),
	yes_price_dollars: z.string(),
	no_price_dollars: z.string(),
	is_taker: z.boolean().optional(),
	created_time: z.string().optional(),
});

const MarketPositionSchema = z.looseObject({
	ticker: z.string(),
	position_fp: z.string(),
	market_exposure_dollars: z.string().optional(),
	realized_pnl_dollars: z.string().optional(),
	fees_paid_dollars: z.string().optional(),
});

const EventPositionSchema = z.looseObject({
	event_ticker: z.string(),
	event_exposure_dollars: z.string().optional(),
	realized_pnl_dollars: z.string().optional(),
});

const SettlementSchema = z.looseObject({
	ticker: z.string(),
	event_ticker: z.string().optional(),
	market_result: z.string().optional(),
	settled_time: z.string().optional(),
	revenue: z.number().optional(),
});

const NewOrderSchema = z.object({
	ticker: z.string().min(1),
	client_order_id: z.string().optional(),
	side: BookSide,
	count: CountInput,
	price: DollarsInput,
	expiration_time: z.number().int().nonnegative().optional(),
	time_in_force: z.enum([
		'fill_or_kill',
		'good_till_canceled',
		'immediate_or_cancel',
	]),
	post_only: z.boolean().optional(),
	self_trade_prevention_type: z
		.enum(['taker_at_cross', 'maker'])
		.default('taker_at_cross'),
	cancel_order_on_pause: z.boolean().optional(),
	reduce_only: z.boolean().optional(),
	subaccount: Subaccount,
});

// ── exchange ────────────────────────────────────────────────────────────────

const ExchangeStatusInputSchema = z.object({});
export type ExchangeStatusInput = z.infer<typeof ExchangeStatusInputSchema>;
const ExchangeStatusResponseSchema = z.looseObject({
	exchange_active: z.boolean(),
	trading_active: z.boolean(),
	exchange_estimated_resume_time: z.string().nullable().optional(),
});
export type ExchangeStatusResponse = z.infer<
	typeof ExchangeStatusResponseSchema
>;

const ExchangeScheduleInputSchema = z.object({});
export type ExchangeScheduleInput = z.infer<typeof ExchangeScheduleInputSchema>;
const ExchangeScheduleResponseSchema = z.looseObject({
	schedule: z.looseObject({
		standard_hours: z.array(z.looseObject({})).optional(),
		maintenance_windows: z
			.array(
				z.object({
					start_datetime: z.string(),
					end_datetime: z.string(),
				}),
			)
			.optional(),
	}),
});
export type ExchangeScheduleResponse = z.infer<
	typeof ExchangeScheduleResponseSchema
>;

// ── markets ─────────────────────────────────────────────────────────────────

const MarketsListInputSchema = z.object({
	limit: Limit,
	cursor: Cursor,
	event_ticker: z.string().optional(),
	series_ticker: z.string().optional(),
	status: z.string().optional(),
	/** Comma-separated market tickers. */
	tickers: z.string().optional(),
	min_close_ts: z.number().int().optional(),
	max_close_ts: z.number().int().optional(),
	/** `exclude` hides multivariate (combo) markets; `only` returns just those. */
	mve_filter: z.enum(['only', 'exclude']).optional(),
});
export type MarketsListInput = z.infer<typeof MarketsListInputSchema>;
const MarketsListResponseSchema = z.object({
	markets: z.array(MarketSchema),
	/** Empty string or null once there are no more pages. */
	cursor: z.string().nullable().optional(),
});
export type MarketsListResponse = z.infer<typeof MarketsListResponseSchema>;

const MarketsGetInputSchema = z.object({ ticker: z.string().min(1) });
export type MarketsGetInput = z.infer<typeof MarketsGetInputSchema>;
const MarketsGetResponseSchema = z.object({ market: MarketSchema });
export type MarketsGetResponse = z.infer<typeof MarketsGetResponseSchema>;

const MarketsOrderbookInputSchema = z.object({
	ticker: z.string().min(1),
	depth: z.number().int().nonnegative().optional(),
});
export type MarketsOrderbookInput = z.infer<typeof MarketsOrderbookInputSchema>;
const MarketsOrderbookResponseSchema = z.object({
	orderbook_fp: z.object({
		yes_dollars: z.array(z.array(z.string())),
		no_dollars: z.array(z.array(z.string())),
	}),
});
export type MarketsOrderbookResponse = z.infer<
	typeof MarketsOrderbookResponseSchema
>;

const MarketsTradesInputSchema = z.object({
	ticker: z.string().optional(),
	limit: Limit,
	cursor: Cursor,
	min_ts: z.number().int().optional(),
	max_ts: z.number().int().optional(),
});
export type MarketsTradesInput = z.infer<typeof MarketsTradesInputSchema>;
const MarketsTradesResponseSchema = z.object({
	trades: z.array(TradeSchema),
	cursor: z.string().nullable().optional(),
});
export type MarketsTradesResponse = z.infer<typeof MarketsTradesResponseSchema>;

// ── events ──────────────────────────────────────────────────────────────────

const EventsListInputSchema = z.object({
	limit: Limit,
	cursor: Cursor,
	with_nested_markets: z.boolean().optional(),
	status: z.string().optional(),
	series_ticker: z.string().optional(),
	/** Comma-separated event tickers. */
	tickers: z.string().optional(),
	min_close_ts: z.number().int().optional(),
});
export type EventsListInput = z.infer<typeof EventsListInputSchema>;
const EventsListResponseSchema = z.object({
	events: z.array(EventSchema),
	cursor: z.string().nullable().optional(),
});
export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

const EventsGetInputSchema = z.object({
	event_ticker: z.string().min(1),
	with_nested_markets: z.boolean().optional(),
});
export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;
const EventsGetResponseSchema = z.object({
	event: EventSchema,
	markets: z.array(MarketSchema).optional(),
});
export type EventsGetResponse = z.infer<typeof EventsGetResponseSchema>;

// ── series ──────────────────────────────────────────────────────────────────

const SeriesListInputSchema = z.object({
	category: z.string().optional(),
	tags: z.string().optional(),
	include_volume: z.boolean().optional(),
});
export type SeriesListInput = z.infer<typeof SeriesListInputSchema>;
const SeriesListResponseSchema = z.object({ series: z.array(SeriesSchema) });
export type SeriesListResponse = z.infer<typeof SeriesListResponseSchema>;

const SeriesGetInputSchema = z.object({
	series_ticker: z.string().min(1),
	include_volume: z.boolean().optional(),
});
export type SeriesGetInput = z.infer<typeof SeriesGetInputSchema>;
const SeriesGetResponseSchema = z.object({ series: SeriesSchema });
export type SeriesGetResponse = z.infer<typeof SeriesGetResponseSchema>;

// ── portfolio ───────────────────────────────────────────────────────────────

const PortfolioBalanceInputSchema = z.object({ subaccount: Subaccount });
export type PortfolioBalanceInput = z.infer<typeof PortfolioBalanceInputSchema>;
const PortfolioBalanceResponseSchema = z.looseObject({
	balance: z.number(),
	balance_dollars: z.string().optional(),
	portfolio_value: z.number().optional(),
	updated_ts: z.number().optional(),
});
export type PortfolioBalanceResponse = z.infer<
	typeof PortfolioBalanceResponseSchema
>;

const PortfolioPositionsInputSchema = z.object({
	limit: Limit,
	cursor: Cursor,
	count_filter: z.string().optional(),
	settlement_status: z.string().optional(),
	ticker: z.string().optional(),
	event_ticker: z.string().optional(),
	subaccount: Subaccount,
});
export type PortfolioPositionsInput = z.infer<
	typeof PortfolioPositionsInputSchema
>;
const PortfolioPositionsResponseSchema = z.object({
	market_positions: z.array(MarketPositionSchema),
	event_positions: z.array(EventPositionSchema),
	cursor: z.string().nullable().optional(),
});
export type PortfolioPositionsResponse = z.infer<
	typeof PortfolioPositionsResponseSchema
>;

const PortfolioFillsInputSchema = z.object({
	ticker: z.string().optional(),
	order_id: z.string().optional(),
	min_ts: z.number().int().optional(),
	max_ts: z.number().int().optional(),
	limit: Limit,
	cursor: Cursor,
	subaccount: Subaccount,
});
export type PortfolioFillsInput = z.infer<typeof PortfolioFillsInputSchema>;
const PortfolioFillsResponseSchema = z.object({
	fills: z.array(FillSchema),
	cursor: z.string().nullable().optional(),
});
export type PortfolioFillsResponse = z.infer<
	typeof PortfolioFillsResponseSchema
>;

const PortfolioSettlementsInputSchema = z.object({
	limit: Limit,
	cursor: Cursor,
	ticker: z.string().optional(),
	event_ticker: z.string().optional(),
	min_ts: z.number().int().optional(),
	max_ts: z.number().int().optional(),
	subaccount: Subaccount,
});
export type PortfolioSettlementsInput = z.infer<
	typeof PortfolioSettlementsInputSchema
>;
const PortfolioSettlementsResponseSchema = z.object({
	settlements: z.array(SettlementSchema),
	cursor: z.string().nullable().optional(),
});
export type PortfolioSettlementsResponse = z.infer<
	typeof PortfolioSettlementsResponseSchema
>;

// ── orders ──────────────────────────────────────────────────────────────────

const OrdersListInputSchema = z.object({
	ticker: z.string().optional(),
	event_ticker: z.string().optional(),
	min_ts: z.number().int().optional(),
	max_ts: z.number().int().optional(),
	status: z.enum(['resting', 'canceled', 'executed']).optional(),
	limit: Limit,
	cursor: Cursor,
	subaccount: Subaccount,
});
export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;
const OrdersListResponseSchema = z.object({
	orders: z.array(OrderSchema),
	cursor: z.string().nullable().optional(),
});
export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

const OrdersGetInputSchema = z.object({ order_id: z.string().min(1) });
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;
const OrdersGetResponseSchema = z.object({ order: OrderSchema });
export type OrdersGetResponse = z.infer<typeof OrdersGetResponseSchema>;

const OrdersCreateInputSchema = NewOrderSchema;
export type OrdersCreateInput = z.input<typeof OrdersCreateInputSchema>;
const OrdersCreateResponseSchema = z.looseObject({
	order_id: z.string(),
	client_order_id: z.string().optional(),
	fill_count: z.string(),
	remaining_count: z.string(),
	average_fill_price: z.string().optional(),
	average_fee_paid: z.string().optional(),
	ts_ms: z.number(),
});
export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;

const OrdersAmendInputSchema = z.object({
	order_id: z.string().min(1),
	ticker: z.string().min(1),
	side: BookSide,
	price: DollarsInput,
	/** Total fillable count: already-filled contracts plus the new resting size. */
	count: CountInput,
	client_order_id: z.string().optional(),
	updated_client_order_id: z.string().optional(),
	expiration_time: z.number().int().nonnegative().optional(),
	subaccount: Subaccount,
});
export type OrdersAmendInput = z.infer<typeof OrdersAmendInputSchema>;
const OrdersAmendResponseSchema = z.looseObject({
	order_id: z.string(),
	client_order_id: z.string().optional(),
	remaining_count: z.string().nullable().optional(),
	fill_count: z.string().nullable().optional(),
	average_fill_price: z.string().nullable().optional(),
	average_fee_paid: z.string().nullable().optional(),
	ts_ms: z.number(),
});
export type OrdersAmendResponse = z.infer<typeof OrdersAmendResponseSchema>;

const OrdersCancelInputSchema = z.object({
	order_id: z.string().min(1),
	subaccount: Subaccount,
	market_ticker: z.string().optional(),
});
export type OrdersCancelInput = z.infer<typeof OrdersCancelInputSchema>;
const OrdersCancelResponseSchema = z.looseObject({
	order_id: z.string(),
	client_order_id: z.string().optional(),
	reduced_by: z.string(),
	ts_ms: z.number(),
});
export type OrdersCancelResponse = z.infer<typeof OrdersCancelResponseSchema>;

const OrdersBatchCreateInputSchema = z.object({
	orders: z.array(NewOrderSchema).min(1),
});
export type OrdersBatchCreateInput = z.input<
	typeof OrdersBatchCreateInputSchema
>;
const OrdersBatchCreateResponseSchema = z.object({
	orders: z.array(
		z.looseObject({
			order_id: z.string().optional(),
			client_order_id: z.string().nullable().optional(),
			fill_count: z.string().optional(),
			remaining_count: z.string().optional(),
			ts_ms: z.number().nullable().optional(),
			error: z.unknown().optional(),
		}),
	),
});
export type OrdersBatchCreateResponse = z.infer<
	typeof OrdersBatchCreateResponseSchema
>;

// ── Maps used by the plugin definition ──────────────────────────────────────

export type KalshiEndpointInputs = {
	exchangeStatus: ExchangeStatusInput;
	exchangeSchedule: ExchangeScheduleInput;
	marketsList: MarketsListInput;
	marketsGet: MarketsGetInput;
	marketsOrderbook: MarketsOrderbookInput;
	marketsTrades: MarketsTradesInput;
	eventsList: EventsListInput;
	eventsGet: EventsGetInput;
	seriesList: SeriesListInput;
	seriesGet: SeriesGetInput;
	portfolioBalance: PortfolioBalanceInput;
	portfolioPositions: PortfolioPositionsInput;
	portfolioFills: PortfolioFillsInput;
	portfolioSettlements: PortfolioSettlementsInput;
	ordersList: OrdersListInput;
	ordersGet: OrdersGetInput;
	ordersCreate: OrdersCreateInput;
	ordersAmend: OrdersAmendInput;
	ordersCancel: OrdersCancelInput;
	ordersBatchCreate: OrdersBatchCreateInput;
};

export type KalshiEndpointOutputs = {
	exchangeStatus: ExchangeStatusResponse;
	exchangeSchedule: ExchangeScheduleResponse;
	marketsList: MarketsListResponse;
	marketsGet: MarketsGetResponse;
	marketsOrderbook: MarketsOrderbookResponse;
	marketsTrades: MarketsTradesResponse;
	eventsList: EventsListResponse;
	eventsGet: EventsGetResponse;
	seriesList: SeriesListResponse;
	seriesGet: SeriesGetResponse;
	portfolioBalance: PortfolioBalanceResponse;
	portfolioPositions: PortfolioPositionsResponse;
	portfolioFills: PortfolioFillsResponse;
	portfolioSettlements: PortfolioSettlementsResponse;
	ordersList: OrdersListResponse;
	ordersGet: OrdersGetResponse;
	ordersCreate: OrdersCreateResponse;
	ordersAmend: OrdersAmendResponse;
	ordersCancel: OrdersCancelResponse;
	ordersBatchCreate: OrdersBatchCreateResponse;
};

export const KalshiEndpointInputSchemas = {
	exchangeStatus: ExchangeStatusInputSchema,
	exchangeSchedule: ExchangeScheduleInputSchema,
	marketsList: MarketsListInputSchema,
	marketsGet: MarketsGetInputSchema,
	marketsOrderbook: MarketsOrderbookInputSchema,
	marketsTrades: MarketsTradesInputSchema,
	eventsList: EventsListInputSchema,
	eventsGet: EventsGetInputSchema,
	seriesList: SeriesListInputSchema,
	seriesGet: SeriesGetInputSchema,
	portfolioBalance: PortfolioBalanceInputSchema,
	portfolioPositions: PortfolioPositionsInputSchema,
	portfolioFills: PortfolioFillsInputSchema,
	portfolioSettlements: PortfolioSettlementsInputSchema,
	ordersList: OrdersListInputSchema,
	ordersGet: OrdersGetInputSchema,
	ordersCreate: OrdersCreateInputSchema,
	ordersAmend: OrdersAmendInputSchema,
	ordersCancel: OrdersCancelInputSchema,
	ordersBatchCreate: OrdersBatchCreateInputSchema,
} as const;

export const KalshiEndpointOutputSchemas = {
	exchangeStatus: ExchangeStatusResponseSchema,
	exchangeSchedule: ExchangeScheduleResponseSchema,
	marketsList: MarketsListResponseSchema,
	marketsGet: MarketsGetResponseSchema,
	marketsOrderbook: MarketsOrderbookResponseSchema,
	marketsTrades: MarketsTradesResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsGet: EventsGetResponseSchema,
	seriesList: SeriesListResponseSchema,
	seriesGet: SeriesGetResponseSchema,
	portfolioBalance: PortfolioBalanceResponseSchema,
	portfolioPositions: PortfolioPositionsResponseSchema,
	portfolioFills: PortfolioFillsResponseSchema,
	portfolioSettlements: PortfolioSettlementsResponseSchema,
	ordersList: OrdersListResponseSchema,
	ordersGet: OrdersGetResponseSchema,
	ordersCreate: OrdersCreateResponseSchema,
	ordersAmend: OrdersAmendResponseSchema,
	ordersCancel: OrdersCancelResponseSchema,
	ordersBatchCreate: OrdersBatchCreateResponseSchema,
} as const;
