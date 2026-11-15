import { z } from 'zod';

// Polygon OMS is a money-movement API: it quotes, then executes, transfers
// between crypto and fiat. Every operation validates its input before a request
// is sent, and every output is `.loose()` with documented fields nullish so a
// field OMS adds or omits cannot fail a call that has already happened.
// Reference: the published spec at https://docs.polygon.technology/api-reference/openapi.yaml

/** The networks OMS accepts as a `network` value, in its own wire vocabulary. */
export const POLYGON_CRYPTO_NETWORKS = [
	'ethereum',
	'polygon',
	'base',
	'solana',
	'tron',
	'bnb',
] as const;

const CryptoNetworkSchema = z.enum(POLYGON_CRYPTO_NETWORKS);

/** OMS ids are opaque strings with a type prefix, e.g. `cst_01H9Xa8F5dN6mP3q`. */
const IdSchema = z.string().min(1);

const TimestampSchema = z.string().nullish();

/** Non-auth POSTs require this header; reusing a value retries one attempt. */
const IdempotencyKeySchema = z
	.string()
	.min(1)
	.max(256)
	.optional()
	.describe(
		'Idempotency key for this write. Send the same value again to retry the same logical attempt rather than creating a second one; one is generated when omitted.',
	);

/** Pagination every list route shares: `limit`, forward cursor, backward cursor. */
const listQueryFields = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe(
			'Page size, an integer from 1 to 100. A value outside that range is rejected before the request is sent; when omitted, OMS applies its default page size for the resource.',
		),
	startingAfter: z
		.string()
		.min(1)
		.optional()
		.describe("The previous page's `nextCursor`."),
	endingBefore: z
		.string()
		.min(1)
		.optional()
		.describe("The previous page's `previousCursor`, to page backwards."),
};

const paginationOutputFields = {
	object: z.string().nullish(),
	limit: z.number().nullish().describe('The effective page size OMS applied.'),
	hasMore: z
		.boolean()
		.describe('True when more rows exist in the direction of travel.'),
	nextCursor: z.string().nullish().describe('Pass as `startingAfter`.'),
	previousCursor: z
		.string()
		.nullish()
		.describe('Pass as `endingBefore` to page backwards.'),
};

// ── customers ─────────────────────────────────────────────────────────────

export const POLYGON_CUSTOMER_STATUSES = [
	'pending',
	'actionRequired',
	'active',
	'rejected',
	'offboarded',
] as const;

export const CustomerHoldSchema = z
	.object({
		code: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export const CustomerFailureSchema = z
	.object({
		code: z.string().nullish(),
		message: z.string().nullish(),
		retryable: z.boolean().nullish(),
	})
	.loose();

/** One endorsement and where it stands; OMS returns these as objects. */
export const CustomerEndorsementSchema = z
	.object({
		type: z.string().nullish().describe('`basic`, `cryptoCustody` or `usd`.'),
		status: z.string().nullish(),
		// unknown: the requirement lists differ per endorsement and KYC policy.
		requirements: z.object({}).loose().nullish(),
		failure: CustomerFailureSchema.nullish(),
	})
	.loose();

export const CustomerSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		type: z.string().nullish().describe('`individual` or `business`.'),
		name: z
			.string()
			.nullish()
			.describe('The composed name, left out when the customer has none.'),
		firstName: z.string().nullish(),
		middleName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyLegalName: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		nationality: z.string().nullish(),
		externalId: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'Where the customer is in onboarding. A status OMS adds later must not fail a read, so this stays a string.',
			),
		hold: CustomerHoldSchema.nullish(),
		failure: CustomerFailureSchema.nullish(),
		signedAgreement: z.boolean().nullish(),
		endorsements: z.array(CustomerEndorsementSchema).nullish(),
		// unknown: the metadata map is the caller's own key-value data.
		metadata: z.record(z.string(), z.string()).nullish(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
	})
	.loose();

export type PolygonCustomer = z.infer<typeof CustomerSchema>;

const CustomersListInputSchema = z.object({
	status: z
		.enum(POLYGON_CUSTOMER_STATUSES)
		.optional()
		.describe('Only customers in this status.'),
	email: z
		.string()
		.min(1)
		.optional()
		.describe('Only this exact email address.'),
	externalId: z
		.string()
		.min(1)
		.optional()
		.describe('Only the customer carrying this `externalId`.'),
	createdAfter: z
		.string()
		.min(1)
		.optional()
		.describe('Only customers created after this ISO 8601 timestamp.'),
	createdBefore: z
		.string()
		.min(1)
		.optional()
		.describe('Only customers created before this ISO 8601 timestamp.'),
	// /customers pages with one `cursor`, not the starting/ending pair the
	// other list routes take.
	limit: listQueryFields.limit,
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe("The previous page's `cursor`."),
});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

const CustomersListOutputSchema = z.object({
	data: z.array(CustomerSchema),
	hasMore: z.boolean(),
	cursor: z
		.string()
		.nullish()
		.describe(
			'The next page cursor. While `hasMore` is true, pass it back as `cursor`; it is absent on the last page.',
		),
});

export type CustomersListOutput = z.infer<typeof CustomersListOutputSchema>;

const personFields = {
	firstName: z
		.string()
		.min(1)
		.optional()
		.describe('Legal first name. Individuals only.'),
	middleName: z.string().min(1).optional().describe('Individuals only.'),
	lastName: z
		.string()
		.min(1)
		.optional()
		.describe('Legal last name. Individuals only.'),
	birthDate: z
		.string()
		.min(1)
		.optional()
		.describe('YYYY-MM-DD. Write-only: OMS never returns it.'),
	nationality: z
		.string()
		.length(2)
		.optional()
		.describe('ISO 3166-1 alpha-2 country code.'),
	ipAddress: z
		.string()
		.min(1)
		.optional()
		.describe('Used for geo-based compliance checks. Write-only.'),
	residentialAddress: z
		.object({
			line1: z.string().min(1).optional(),
			line2: z.string().min(1).optional(),
			city: z.string().min(1).optional(),
			state: z.string().min(1).optional(),
			// OMS's own spelling of the field.
			zipCode: z.string().min(1).optional(),
			country: z.string().length(2).optional().describe('ISO 3166-1 alpha-2.'),
		})
		.optional()
		.describe(
			"Write-only: OMS never returns it. Which parts it requires depends on the project's KYC policy.",
		),
};

const businessFields = {
	companyLegalName: z
		.string()
		.min(1)
		.max(255)
		.optional()
		.describe(
			'Legal business name. Businesses only, and required to create one.',
		),
	dbaName: z.string().min(1).optional(),
	formationDate: z.string().min(1).optional(),
	registrationCountry: z.string().min(1).optional(),
	registrationNumber: z.string().min(1).optional(),
	websiteUrl: z.string().min(1).optional(),
	businessDescription: z.string().min(1).optional(),
};

export const CustomersCreateInputSchema = z
	.object({
		/** Reuse it to retry the same logical attempt instead of repeating the write. */
		idempotencyKey: IdempotencyKeySchema,
		type: z
			.enum(['individual', 'business'])
			.describe('Which KYC or KYB policy this customer follows.'),
		email: z.string().min(1).optional(),
		phone: z
			.string()
			.min(1)
			.optional()
			.describe('E.164 format, such as +12125551234.'),
		externalId: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Your own identifier, kept on the customer for cross-referencing.',
			),
		signedAgreement: z
			.boolean()
			.optional()
			.describe(
				'Whether the customer accepted the OMS terms. Defaults to false.',
			),
		...personFields,
		...businessFields,
	})
	.superRefine((value, ctx) => {
		if (value.type === 'individual') {
			if (value.firstName === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'An individual customer needs a firstName.',
					path: ['firstName'],
				});
			}
			if (value.lastName === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'An individual customer needs a lastName.',
					path: ['lastName'],
				});
			}
			if (value.companyLegalName !== undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'A business name is not accepted on an individual customer.',
					path: ['companyLegalName'],
				});
			}
		} else {
			if (value.companyLegalName === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'A business customer needs a companyLegalName.',
					path: ['companyLegalName'],
				});
			}
			if (value.email === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'A business customer needs an email.',
					path: ['email'],
				});
			}
			for (const field of ['firstName', 'middleName', 'lastName'] as const) {
				if (value[field] !== undefined) {
					ctx.addIssue({
						code: 'custom',
						message: `A business customer does not accept ${field}.`,
						path: [field],
					});
				}
			}
		}
	});

export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;

const CustomersGetInputSchema = z.object({
	customerId: IdSchema.describe('The `cst_` id of the customer.'),
});

export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;

const CustomersUpdateInputSchema = z
	.object({
		customerId: IdSchema.describe('The `cst_` id of the customer.'),
		email: z.string().min(1).optional(),
		phone: z.string().min(1).optional(),
		externalId: z.string().min(1).optional(),
		signedAgreement: z
			.boolean()
			.optional()
			.describe('One-way: OMS does not accept setting it back to false.'),
		endorsements: z
			.array(z.enum(['basic', 'cryptoCustody', 'usd']))
			.optional()
			.describe(
				'Request additional endorsements. Existing ones are not removed, and naming any triggers re-evaluation.',
			),
		...personFields,
		...businessFields,
	})
	.superRefine((value, ctx) => {
		const { customerId: _ignored, ...changes } = value;
		if (Object.values(changes).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one field to change.',
				path: ['customerId'],
			});
		}
	});

export type CustomersUpdateInput = z.infer<typeof CustomersUpdateInputSchema>;

const CustomersDeleteInputSchema = z.object({
	customerId: IdSchema.describe('The `cst_` id of the customer.'),
});

export type CustomersDeleteInput = z.infer<typeof CustomersDeleteInputSchema>;

// ── wallets ───────────────────────────────────────────────────────────────

/** One asset balance held in a wallet, as listed on the wallet itself. */
export const WalletResourceBalanceSchema = z
	.object({
		asset: z.string().nullish(),
		network: z.string().nullish(),
		balance: z
			.string()
			.nullish()
			.describe(
				'Signed fixed-point decimal string; negative after a clawback.',
			),
		estimatedValueUsd: z.string().nullish(),
	})
	.loose();

/** A crypto or fiat wallet (v0.13 `WalletResourceCrypto` / `WalletResourceFiat`). */
export const WalletSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		type: z.string().nullish().describe('`walletCrypto` or `walletFiat`.'),
		customer: z.object({ id: IdSchema.nullish() }).loose().nullish(),
		status: z
			.string()
			.nullish()
			.describe('`pending`, `active`, `frozen`, `suspended` or `closed`.'),
		asset: z.string().nullish(),
		network: z.string().nullish().describe('Crypto wallets only.'),
		address: z.string().nullish().describe('Crypto wallets only.'),
		// unknown: claim state of the wallet, whose fields vary by claimant.
		routing: z.object({}).loose().nullish(),
		provider: z.string().nullish(),
		label: z.string().nullish(),
		balances: z.array(WalletResourceBalanceSchema).nullish(),
		// unknown: the caller's own key-value data.
		metadata: z.object({}).loose().nullish(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
	})
	.loose();

export type PolygonWallet = z.infer<typeof WalletSchema>;

export const WalletBalanceEntrySchema = z
	.object({
		id: IdSchema.nullish(),
		customerId: IdSchema.nullish(),
		asset: z.string().nullish(),
		chain: z.string().nullish(),
		address: z.string().nullish(),
		balance: z
			.string()
			.nullish()
			.describe(
				'A fixed-point decimal string at the asset scale, and it can be negative after a clawback.',
			),
		currencyName: z.string().nullish(),
		estimatedBalanceValue: z.string().nullish(),
		updatedAt: TimestampSchema,
	})
	.loose();

export type PolygonWalletBalance = z.infer<typeof WalletBalanceEntrySchema>;

const WalletsListInputSchema = z.object({
	customerId: z
		.string()
		.min(1)
		.optional()
		.describe('Scope to one `cst_` customer.'),
	type: z
		.enum(['custodial', 'noncustodial', 'fiat'])
		.optional()
		.describe('Only wallets of this kind.'),
	search: z
		.string()
		.min(1)
		.optional()
		.describe('Matches a wallet id or an on-chain address.'),
	orderBy: z
		.string()
		.min(1)
		.optional()
		.describe("Orders by the balance's estimated USD value."),
	order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Balance sort direction. Needs `orderBy`.'),
	includeHidden: z
		.array(z.string().min(1))
		.optional()
		.describe('`claimed` adds wallets currently claimed by a live instrument.'),
	...listQueryFields,
});

export type WalletsListInput = z.infer<typeof WalletsListInputSchema>;

const WalletsListOutputSchema = z.object(paginationOutputFields).extend({
	data: z.array(WalletSchema),
});

export type WalletsListOutput = z.infer<typeof WalletsListOutputSchema>;

export const WALLET_CREATE_TYPES = [
	'custodial',
	'noncustodial',
	'fiat',
] as const;

export const WalletsCreateInputSchema = z
	.object({
		/** Reuse it to retry the same logical attempt instead of repeating the write. */
		idempotencyKey: IdempotencyKeySchema,
		customerId: IdSchema.describe('The `cst_` customer who owns the wallet.'),
		type: z
			.enum(WALLET_CREATE_TYPES)
			.describe(
				'`custodial` needs `details.network` and `details.asset`; `noncustodial` needs `details.networkFamily`; `fiat` needs `details.asset: usd`.',
			),
		details: z.object({
			network: CryptoNetworkSchema.optional().describe('Custodial only.'),
			asset: z
				.string()
				.min(1)
				.optional()
				.describe('Custodial: a crypto asset such as `usdc`. Fiat: `usd`.'),
			networkFamily: z
				.enum(['evm', 'solana', 'tron'])
				.optional()
				.describe('Noncustodial only.'),
		}),
		label: z.string().min(1).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.superRefine((value, ctx) => {
		const { network, asset, networkFamily } = value.details;
		const issue = (message: string, field: string) =>
			ctx.addIssue({ code: 'custom', message, path: ['details', field] });
		if (value.type === 'custodial') {
			if (network === undefined)
				issue('A custodial wallet needs details.network.', 'network');
			if (asset === undefined)
				issue('A custodial wallet needs details.asset.', 'asset');
			if (networkFamily !== undefined)
				issue('networkFamily is for noncustodial wallets.', 'networkFamily');
		} else if (value.type === 'noncustodial') {
			if (networkFamily === undefined)
				issue(
					'A noncustodial wallet needs details.networkFamily.',
					'networkFamily',
				);
			if (network !== undefined || asset !== undefined)
				issue(
					'A noncustodial wallet takes only details.networkFamily.',
					'network',
				);
		} else {
			if (asset !== 'usd')
				issue('A fiat wallet needs details.asset: usd.', 'asset');
			if (network !== undefined || networkFamily !== undefined)
				issue('A fiat wallet takes only details.asset.', 'network');
		}
	});

/**
 * 201 returns the wallet. 202 returns a pending `wallet.operation` instead, with
 * `operationId` and `walletId` once known, so both shapes parse here.
 */
const WalletsCreateOutputSchema = WalletSchema.extend({
	operationId: IdSchema.nullish(),
	customerId: IdSchema.nullish(),
	walletId: IdSchema.nullish(),
	// unknown: per-network provisioning state of a pending operation.
	pairs: z.array(z.object({}).loose()).nullish(),
});

export type WalletsCreateOutput = z.infer<typeof WalletsCreateOutputSchema>;

export type WalletsCreateInput = z.infer<typeof WalletsCreateInputSchema>;

const WalletsGetInputSchema = z.object({
	id: IdSchema.describe('The `wlt_` id of the wallet.'),
});

export type WalletsGetInput = z.infer<typeof WalletsGetInputSchema>;

const WalletsBalanceInputSchema = z.object({
	id: IdSchema.describe('The `wlt_` id of the wallet.'),
});

export type WalletsBalanceInput = z.infer<typeof WalletsBalanceInputSchema>;

const WalletsBalanceOutputSchema = z.object({
	data: WalletBalanceEntrySchema,
});

export type WalletsBalanceOutput = z.infer<typeof WalletsBalanceOutputSchema>;

// ── networks ──────────────────────────────────────────────────────────────

export const NetworkAssetSchema = z
	.object({
		asset: z.string().nullish(),
		contractAddress: z.string().nullish(),
		decimals: z.number().nullish(),
	})
	.loose();

/** Which OMS resources can use a network, and in which direction. */
export const DirectionalFlagSchema = z
	.object({
		asSource: z.boolean().nullish(),
		asDestination: z.boolean().nullish(),
	})
	.loose();

export const SupportedBySchema = z
	.object({
		externalAccount: z
			.object({
				asSource: z.array(z.string()).nullish(),
				asDestination: z.array(z.string()).nullish(),
			})
			.loose()
			.nullish(),
		// Each of these is a directional flag. OMS omits a flag it has not
		// established, so a missing entry is not false and stays nullish.
		depositAddress: DirectionalFlagSchema.nullish(),
		virtualAccount: DirectionalFlagSchema.nullish(),
		cashIn: DirectionalFlagSchema.nullish(),
		card: DirectionalFlagSchema.nullish(),
		wallet: DirectionalFlagSchema.nullish(),
	})
	.loose();

export type PolygonSupportedBy = z.infer<typeof SupportedBySchema>;

export const SupportedNetworkSchema = z
	.object({
		network: z
			.string()
			.describe('The token to send in a request `network` field.'),
		category: z.string().nullish(),
		type: z.string().nullish(),
		chainId: z.number().nullish().describe('Omitted for a non-EVM network.'),
		networkFamily: z.string().nullish(),
		displayName: z.string().nullish(),
		assets: z.array(NetworkAssetSchema).nullish(),
		supportedBy: SupportedBySchema.nullish(),
	})
	.loose();

export type PolygonSupportedNetwork = z.infer<typeof SupportedNetworkSchema>;

const NetworksListInputSchema = z.object({
	...listQueryFields,
});

export type NetworksListInput = z.infer<typeof NetworksListInputSchema>;

const NetworksListOutputSchema = z.object(paginationOutputFields).extend({
	data: z.array(SupportedNetworkSchema),
});

export type NetworksListOutput = z.infer<typeof NetworksListOutputSchema>;

// ── quotes ────────────────────────────────────────────────────────────────

const decimalString = z
	.string()
	.min(1)
	.describe('A decimal amount as a string, such as "100.00".');

const WalletCryptoSideSchema = z.object({
	type: z.literal('walletCrypto'),
	details: z.object({
		id: IdSchema.describe('OMS wallet ID (`wlt_` prefix).'),
		asset: z
			.string()
			.min(1)
			.describe('A crypto asset, such as `usdc` or `usdt`.'),
		network: CryptoNetworkSchema,
	}),
	amount: decimalString.optional(),
});

const WalletExternalSideSchema = z
	.object({
		type: z.literal('walletExternal'),
		details: z.object({
			id: z
				.string()
				.min(1)
				.optional()
				.describe('A registered ExternalAccount id (`ext_` prefix).'),
			blockchainAddress: z
				.string()
				.min(1)
				.optional()
				.describe('A raw on-chain address, when it is not registered.'),
			asset: z.string().min(1),
			network: CryptoNetworkSchema,
		}),
		amount: decimalString.optional(),
	})
	.superRefine((value, ctx) => {
		const hasId = value.details.id !== undefined;
		const hasAddress = value.details.blockchainAddress !== undefined;
		if (hasId === hasAddress) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Supply exactly one of `details.id` or `details.blockchainAddress`.',
				path: ['details', 'id'],
			});
		}
	});

const WalletFiatSideSchema = z.object({
	type: z.literal('walletFiat'),
	details: z.object({
		id: IdSchema.describe('OMS fiat wallet ID (`wlt_` prefix).'),
		asset: z.literal('usd').describe('Only `usd` today.'),
	}),
	amount: decimalString.optional(),
});

const BankUsSideSchema = z.object({
	type: z.literal('bankUs'),
	details: z.object({
		id: IdSchema.describe('US bank ExternalAccount id (`ext_` prefix).'),
		asset: z.literal('usd'),
		network: z
			.enum(['ach', 'achSameDay', 'wire', 'rtp', 'instant', 'intraBank'])
			.describe('The payout rail. OMS requires it on a bankUs side.'),
		memo: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Delivered with the payout. Each rail has its own character set and length limit, and a memo outside it is rejected rather than dropped.',
			),
	}),
	amount: decimalString.optional(),
});

const CardSideSchema = z.object({
	type: z.literal('card'),
	details: z.object({
		id: IdSchema.describe('Card ExternalAccount id (`ext_` prefix).'),
		asset: z.literal('usd'),
	}),
	amount: decimalString.optional(),
});

const CashSideSchema = z.object({
	type: z.literal('cash'),
	details: z.object({
		asset: z.literal('usd'),
		cashLocationId: z.string().min(1).describe('From `cashLocations.list`.'),
		cashLocationReference: z
			.string()
			.min(1)
			.describe("The location's provider reference, from the same call."),
		amount: decimalString.describe(
			'A multiple of 20.00, at most 400.00. This is the destination amount; OMS takes no top-level amount on a cash side.',
		),
	}),
});

/** What funds a quote: an OMS wallet, a fiat wallet, or a registered card. */
const QuoteSourceSchema = z.union([
	WalletCryptoSideSchema,
	WalletFiatSideSchema,
	CardSideSchema,
]);

/** Where a quote delivers: a wallet, a bank account, a card, or cash. */
const QuoteDestinationSchema = z.union([
	WalletCryptoSideSchema,
	WalletExternalSideSchema,
	WalletFiatSideSchema,
	BankUsSideSchema,
	CardSideSchema,
	CashSideSchema,
]);

export const QuotesCreateInputSchema = z
	.object({
		/** Reuse it to retry the same logical attempt instead of repeating the write. */
		idempotencyKey: IdempotencyKeySchema,
		customerId: IdSchema.describe('The `cst_` customer this quote is for.'),
		source: QuoteSourceSchema.describe('What funds the transaction.'),
		destination: QuoteDestinationSchema.describe(
			'The instrument that receives the funds.',
		),
		sponsorGas: z
			.boolean()
			.optional()
			.describe(
				'When true, OMS absorbs the on-chain gas for the delivery. Only true is supported today.',
			),
		metadata: z
			.record(z.string(), z.string())
			.optional()
			.describe('Free-form pairs, copied to the resulting transaction.'),
	})
	.superRefine((value, ctx) => {
		// OMS calculates the other side, so exactly one side carries the amount.
		const sourceAmount = value.source.amount !== undefined;
		// A cash side carries its amount inside details, which fixes that side.
		const destinationAmount =
			value.destination.type === 'cash' ||
			value.destination.amount !== undefined;
		if (sourceAmount && destinationAmount) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Set the amount on exactly one side; OMS calculates the other.',
				path: ['source', 'amount'],
			});
		}
		if (!sourceAmount && !destinationAmount) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Set the amount on exactly one side; OMS calculates the other.',
				path: ['source', 'amount'],
			});
		}
	});

export type QuotesCreateInput = z.infer<typeof QuotesCreateInputSchema>;

export const PricingFeeSchema = z
	.object({
		type: z.string().nullish(),
		amount: z.string().nullish(),
		asset: z.string().nullish(),
	})
	.loose();

export const PricingSideSchema = z
	.object({
		amount: z.string().nullish(),
		asset: z.string().nullish(),
	})
	.loose();

export const PricingSchema = z
	.object({
		source: PricingSideSchema.nullish(),
		destination: PricingSideSchema.nullish(),
		fees: z.array(PricingFeeSchema),
		exchangeRate: z.string().nullish(),
		fixedAmountSide: z.string().nullish(),
		sponsorGas: z.boolean().nullish(),
	})
	.loose();

export type PolygonPricing = z.infer<typeof PricingSchema>;

export const QuoteSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		status: z.string().nullish().describe('`open`, `accepted` or `expired`.'),
		sourceToDestination: z.string().nullish(),
		customerId: IdSchema.nullish(),
		pricing: PricingSchema.nullish(),
		expiresAt: TimestampSchema,
		createdAt: TimestampSchema,
	})
	.loose();

export type PolygonQuote = z.infer<typeof QuoteSchema>;

const QuotesGetInputSchema = z.object({
	quoteId: IdSchema.describe('The `qt_` id of the quote.'),
});

export type QuotesGetInput = z.infer<typeof QuotesGetInputSchema>;

// ── transactions ──────────────────────────────────────────────────────────

export const POLYGON_TRANSACTION_STATUSES = [
	'processing',
	'awaitingAction',
	'completed',
	'failed',
] as const;

/**
 * One side of a transaction. OMS discriminates on `type` and carries the
 * rail-specific fields inside `details`, so a loose object with the documented
 * shared fields keeps every instrument variant parseable without pinning a
 * shape that differs per corridor.
 */
export const InstrumentSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe(
				'`walletCrypto`, `walletExternal`, `walletFiat`, `bankUs`, `bankIban`, `bankCanada`, `card`, `cash`, `depositAddress` or `virtualAccount`.',
			),
		id: IdSchema.nullish().describe('The instrument id, when OMS has one.'),
		asset: z.string().nullish().describe('Lowercase asset symbol.'),
		network: z.string().nullish().describe('Lowercase network or rail.'),
		details: z
			.object({})
			.loose()
			.nullish()
			.describe('Rail-specific fields, such as a masked account number.'),
	})
	.loose();

export type PolygonInstrument = z.infer<typeof InstrumentSchema>;

/** What created a transaction, as a `{type, id}` reference. */
export const PrecursorSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe(
				'`quote`, `depositAddress`, `virtualAccount`, `cashIn`, `manual` or `walletDeposit`.',
			),
		id: IdSchema.nullish().describe(
			'Null for `manual` and `walletDeposit`, which have no originating resource.',
		),
	})
	.loose();

export type PolygonPrecursor = z.infer<typeof PrecursorSchema>;

/** One leg of a transaction, with the rail its money moved on. */
export const TransferRefSchema = z
	.object({
		id: IdSchema.nullish(),
		role: z.string().nullish().describe('`deposit`, `payout` or `refund`.'),
		rail: z
			.string()
			.nullish()
			.describe('How the money moved, such as `ach` or `blockchain`.'),
		attempt: z
			.number()
			.nullish()
			.describe('1 for the first send; a resend increments it.'),
	})
	.loose();

export type PolygonTransferRef = z.infer<typeof TransferRefSchema>;

export const TransactionSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		status: z.string().nullish().describe('The lifecycle status.'),
		subStatus: z
			.string()
			.nullish()
			.describe(
				'A finer, status-scoped state such as `processing.fundsPulled`.',
			),
		customer: z.object({ id: IdSchema.nullish() }).loose().nullish(),
		pricing: PricingSchema.nullish(),
		source: InstrumentSchema.nullish(),
		destination: InstrumentSchema.nullish(),
		precursor: PrecursorSchema.nullish(),
		transfers: z.array(TransferRefSchema).nullish(),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
	})
	.loose();

export type PolygonTransaction = z.infer<typeof TransactionSchema>;

const TransactionsListInputSchema = z.object({
	status: z
		.array(z.enum(POLYGON_TRANSACTION_STATUSES))
		.optional()
		.describe('Only transactions in these statuses.'),
	customerId: z
		.string()
		.min(1)
		.optional()
		.describe('Matches rows where the customer is on either side.'),
	walletId: z
		.string()
		.min(1)
		.optional()
		.describe('Transactions where this wallet is the source or destination.'),
	virtualAccountId: z
		.string()
		.min(1)
		.optional()
		.describe("The transaction's originating virtual account."),
	depositAddressId: z
		.string()
		.min(1)
		.optional()
		.describe("The transaction's originating deposit address."),
	cashInId: z
		.string()
		.min(1)
		.optional()
		.describe("The transaction's originating cash-in."),
	createdAfter: z
		.string()
		.min(1)
		.optional()
		.describe('Inclusive lower bound on `createdAt`.'),
	createdBefore: z
		.string()
		.min(1)
		.optional()
		.describe('Inclusive upper bound on `createdAt`.'),
	search: z
		.string()
		.min(1)
		.optional()
		.describe('Matches a transaction id, a customer id, or a customer email.'),
	...listQueryFields,
});

export type TransactionsListInput = z.infer<typeof TransactionsListInputSchema>;

const TransactionsListOutputSchema = z
	.object(paginationOutputFields)
	.extend({ data: z.array(TransactionSchema) });

export type TransactionsListOutput = z.infer<
	typeof TransactionsListOutputSchema
>;

const TransactionsGetInputSchema = z.object({
	transactionId: IdSchema.describe('The `txn_` id of the transaction.'),
});

export type TransactionsGetInput = z.infer<typeof TransactionsGetInputSchema>;

export const TransactionsCreateInputSchema = z.object({
	/** Reuse it to retry the same logical attempt instead of repeating the write. */
	idempotencyKey: IdempotencyKeySchema,
	quoteId: IdSchema.describe(
		'The `qt_` quote to accept. It must be `open` with unexpired pricing.',
	),
	deviceFingerprint: z
		.string()
		.min(1)
		.optional()
		.describe('The end user fingerprint, used for risk screening.'),
	webSessionId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The risk-session id from the Sardine SDK. Required when the quote funds from or delivers to a card, and rejected as 422 RiskSessionRequired when missing.',
		),
	metadata: z
		.record(z.string(), z.string())
		.optional()
		.describe('Free-form pairs, echoed back on reads.'),
});

export type TransactionsCreateInput = z.infer<
	typeof TransactionsCreateInputSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

export const POLYGON_WEBHOOK_STATUSES = [
	'enabled',
	'disabled',
	'suspended',
] as const;

export const WebhookSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		url: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('`enabled`, `disabled` or `suspended`.'),
		statusReason: z
			.string()
			.nullish()
			.describe('Why OMS suspended the endpoint.'),
		subscriptions: z
			.array(z.string())
			.nullish()
			.describe(
				'The event types this endpoint receives. `*` means every type.',
			),
		timeoutMs: z
			.number()
			.nullish()
			.describe('Defaults to 5000, capped at 10000.'),
		notifyThresholdSecs: z.number().nullish(),
		successCount: z.number().nullish(),
		failureCount: z.number().nullish(),
		mode: z.string().nullish().describe('`live` or `sandbox`.'),
		createdAt: TimestampSchema,
		updatedAt: TimestampSchema,
	})
	.loose();

export type PolygonWebhook = z.infer<typeof WebhookSchema>;

const WebhooksListInputSchema = z.object({
	status: z
		.enum(POLYGON_WEBHOOK_STATUSES)
		.optional()
		.describe('Only webhooks in this status.'),
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z
		.string()
		.min(1)
		.optional()
		.describe("The previous page's `cursor`."),
});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhookListItemSchema = z
	.object({
		webhook: WebhookSchema.nullish(),
		deliveryCount: z.number().nullish(),
		successCount: z.number().nullish(),
		failureCount: z.number().nullish(),
		failureRate: z
			.number()
			.nullish()
			.describe('Basis points, so 250 is 2.50%.'),
	})
	.loose();

const WebhooksListOutputSchema = z.object({
	data: z.array(WebhookListItemSchema),
	hasMore: z.boolean(),
	cursor: z.string().nullish().describe('Absent on the last page.'),
});

export type WebhooksListOutput = z.infer<typeof WebhooksListOutputSchema>;

export const WebhooksCreateInputSchema = z.object({
	/** Reuse it to retry the same logical attempt instead of repeating the write. */
	idempotencyKey: IdempotencyKeySchema,
	url: z.string().min(1).describe('Where OMS posts deliveries.'),
	subscriptions: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'Event types to receive, such as transaction.settled. `*` subscribes to every type.',
		),
	timeoutMs: z
		.number()
		.int()
		.min(1)
		.max(10_000)
		.optional()
		.describe('Per-delivery HTTP timeout. Defaults to 5000.'),
	notifyThresholdSecs: z
		.number()
		.int()
		.min(600)
		.max(86_400)
		.optional()
		.describe('Down-notification threshold. Defaults to 3600.'),
});

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

const WebhooksCreateOutputSchema = z.object({
	webhook: WebhookSchema,
	signingKey: z
		.string()
		.min(1)
		.describe(
			'The cleartext HMAC key, shown only here and on a same-key retry. Store it to verify deliveries.',
		),
});

export type WebhooksCreateOutput = z.infer<typeof WebhooksCreateOutputSchema>;

const WebhooksGetInputSchema = z.object({
	webhookId: IdSchema.describe('The `whk_` id of the webhook.'),
});

export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

const WebhooksUpdateInputSchema = z
	.object({
		webhookId: IdSchema.describe('The `whk_` id of the webhook.'),
		url: z.string().min(1).optional(),
		subscriptions: z.array(z.string().min(1)).optional(),
		timeoutMs: z.number().int().min(1).max(10_000).optional(),
		notifyThresholdSecs: z.number().int().min(600).max(86_400).optional(),
	})
	.superRefine((value, ctx) => {
		const { webhookId: _ignored, ...changes } = value;
		if (Object.values(changes).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one field to change.',
				path: ['webhookId'],
			});
		}
	});

export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

const WebhooksDeleteInputSchema = z.object({
	webhookId: IdSchema.describe('The `whk_` id of the webhook.'),
});

export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

// ── cash locations ────────────────────────────────────────────────────────

export const CashLocationSchema = z
	.object({
		id: IdSchema.nullish(),
		object: z.string().nullish(),
		cashLocationReference: z.string().nullish(),
		name: z.string().nullish(),
		provider: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zipCode: z.string().nullish(),
		country: z.string().nullish(),
		coordinates: z
			.object({
				latitude: z.number(),
				longitude: z.number(),
			})
			.loose()
			.nullish(),
		distance: z.number().nullish(),
		distanceUnit: z.string().nullish(),
		buyAllowed: z.boolean().nullish(),
		sellAllowed: z.boolean().nullish(),
		hours: z.string().nullish(),
		supportedAssets: z.array(z.string()).nullish(),
		maxTransaction: z.string().nullish(),
		maxDailyPerCustomer: z.string().nullish(),
	})
	.loose();

export type PolygonCashLocation = z.infer<typeof CashLocationSchema>;

const CashLocationsListInputSchema = z.object({
	provider: z
		.string()
		.min(1)
		.describe(
			'The cash provider configuration to query, as set up for this project.',
		),
	latitude: z.number().min(-90).max(90).describe('Search center latitude.'),
	longitude: z.number().min(-180).max(180).describe('Search center longitude.'),
	radius: z
		.number()
		.positive()
		.max(100)
		.optional()
		.describe('Search radius in miles, above 0 and at most 100.'),
	flow: z
		.enum(['cash_in', 'cash_out'])
		.optional()
		.describe(
			'Only locations that take deposits (`cash_in`) or pay out (`cash_out`).',
		),
	customerId: z
		.string()
		.min(1)
		.optional()
		.describe('Scope availability to one `cst_` customer.'),
	...listQueryFields,
});

export type CashLocationsListInput = z.infer<
	typeof CashLocationsListInputSchema
>;

const CashLocationsListOutputSchema = z.object(paginationOutputFields).extend({
	data: z.array(CashLocationSchema),
});

export type CashLocationsListOutput = z.infer<
	typeof CashLocationsListOutputSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PolygonEndpointInputs = {
	customersList: CustomersListInput;
	customersGet: CustomersGetInput;
	customersCreate: CustomersCreateInput;
	customersUpdate: CustomersUpdateInput;
	customersDelete: CustomersDeleteInput;
	walletsList: WalletsListInput;
	walletsGet: WalletsGetInput;
	walletsCreate: WalletsCreateInput;
	walletsBalance: WalletsBalanceInput;
	networksList: NetworksListInput;
	quotesCreate: QuotesCreateInput;
	quotesGet: QuotesGetInput;
	transactionsList: TransactionsListInput;
	transactionsGet: TransactionsGetInput;
	transactionsCreate: TransactionsCreateInput;
	webhooksList: WebhooksListInput;
	webhooksGet: WebhooksGetInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
	cashLocationsList: CashLocationsListInput;
};

export type PolygonEndpointOutputs = {
	customersList: CustomersListOutput;
	customersGet: PolygonCustomer;
	customersCreate: PolygonCustomer;
	customersUpdate: PolygonCustomer;
	customersDelete: PolygonCustomer;
	walletsList: WalletsListOutput;
	walletsGet: PolygonWallet;
	walletsCreate: WalletsCreateOutput;
	walletsBalance: WalletsBalanceOutput;
	networksList: NetworksListOutput;
	quotesCreate: PolygonQuote;
	quotesGet: PolygonQuote;
	transactionsList: TransactionsListOutput;
	transactionsGet: PolygonTransaction;
	transactionsCreate: PolygonTransaction;
	webhooksList: WebhooksListOutput;
	webhooksGet: PolygonWebhook;
	webhooksCreate: WebhooksCreateOutput;
	webhooksUpdate: PolygonWebhook;
	webhooksDelete: PolygonWebhook;
	cashLocationsList: CashLocationsListOutput;
};

export const PolygonEndpointInputSchemas = {
	customersList: CustomersListInputSchema,
	customersGet: CustomersGetInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersDelete: CustomersDeleteInputSchema,
	walletsList: WalletsListInputSchema,
	walletsGet: WalletsGetInputSchema,
	walletsCreate: WalletsCreateInputSchema,
	walletsBalance: WalletsBalanceInputSchema,
	networksList: NetworksListInputSchema,
	quotesCreate: QuotesCreateInputSchema,
	quotesGet: QuotesGetInputSchema,
	transactionsList: TransactionsListInputSchema,
	transactionsGet: TransactionsGetInputSchema,
	transactionsCreate: TransactionsCreateInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	cashLocationsList: CashLocationsListInputSchema,
} as const;

export const PolygonEndpointOutputSchemas = {
	customersList: CustomersListOutputSchema,
	customersGet: CustomerSchema,
	customersCreate: CustomerSchema,
	customersUpdate: CustomerSchema,
	customersDelete: CustomerSchema,
	walletsList: WalletsListOutputSchema,
	walletsGet: WalletSchema,
	walletsCreate: WalletsCreateOutputSchema,
	walletsBalance: WalletsBalanceOutputSchema,
	networksList: NetworksListOutputSchema,
	quotesCreate: QuoteSchema,
	quotesGet: QuoteSchema,
	transactionsList: TransactionsListOutputSchema,
	transactionsGet: TransactionSchema,
	transactionsCreate: TransactionSchema,
	webhooksList: WebhooksListOutputSchema,
	webhooksGet: WebhookSchema,
	webhooksCreate: WebhooksCreateOutputSchema,
	webhooksUpdate: WebhookSchema,
	webhooksDelete: WebhookSchema,
	cashLocationsList: CashLocationsListOutputSchema,
} as const;
