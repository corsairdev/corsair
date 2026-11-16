import { z } from 'zod';

/** Every Splitwise amount is a decimal string, e.g. `"25.0"` or `"-5.02"`. */
const MoneyString = z
	.string()
	.describe('Decimal amount as a string, e.g. "25.0"');

/**
 * Splitwise returns `null` for fields that do not apply (a group of `null` on a
 * friendship-only expense, a missing avatar size) and omits others, so output
 * fields are nullish rather than optional.
 */
const Nullable = <T extends z.ZodType>(schema: T) => schema.nullish();

const PictureSchema = z
	.object({
		small: Nullable(z.string()),
		medium: Nullable(z.string()),
		large: Nullable(z.string()),
	})
	.loose();

const CommentUserSchema = z
	.object({
		id: z.number(),
		first_name: Nullable(z.string()),
		last_name: Nullable(z.string()),
		picture: Nullable(PictureSchema),
	})
	.loose();

const BalanceSchema = z
	.object({
		currency_code: z.string(),
		amount: MoneyString,
	})
	.loose();

const DebtSchema = z
	.object({
		from: z.number().describe('User ID of the owing user'),
		to: z.number().describe('User ID of the owed user'),
		amount: MoneyString,
		currency_code: z.string(),
	})
	.loose();

const UserSchema = z
	.object({
		id: z.number(),
		first_name: Nullable(z.string()),
		last_name: Nullable(z.string()),
		email: Nullable(z.string()),
		registration_status: Nullable(z.string()),
		picture: Nullable(PictureSchema),
		custom_picture: Nullable(z.boolean()),
	})
	.loose();

const NotificationSettingsSchema = z
	.record(z.string(), z.boolean())
	.describe('Notification preferences, one boolean per notification type');

const CurrentUserSchema = UserSchema.extend({
	notifications_read: Nullable(z.string()),
	notifications_count: Nullable(z.number()),
	notifications: Nullable(NotificationSettingsSchema),
	default_currency: Nullable(z.string()),
	locale: Nullable(z.string()),
}).loose();

const FriendSchema = UserSchema.extend({
	groups: Nullable(
		z.array(
			z
				.object({
					group_id: z.number(),
					balance: Nullable(z.array(BalanceSchema)),
				})
				.loose(),
		),
	),
	balance: Nullable(z.array(BalanceSchema)),
	updated_at: Nullable(z.string()),
}).loose();

const GroupMemberSchema = UserSchema.extend({
	balance: Nullable(z.array(BalanceSchema)),
}).loose();

const AvatarSchema = z
	.object({
		original: Nullable(z.string()),
		xxlarge: Nullable(z.string()),
		xlarge: Nullable(z.string()),
		large: Nullable(z.string()),
		medium: Nullable(z.string()),
		small: Nullable(z.string()),
	})
	.loose();

const GroupSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		group_type: Nullable(z.string()),
		updated_at: Nullable(z.string()),
		simplify_by_default: Nullable(z.boolean()),
		members: Nullable(z.array(GroupMemberSchema)),
		original_debts: Nullable(z.array(DebtSchema)),
		simplified_debts: Nullable(z.array(DebtSchema)),
		avatar: Nullable(AvatarSchema),
		custom_avatar: Nullable(z.boolean()),
		cover_photo: Nullable(AvatarSchema),
	})
	.loose();

const CategorySchema = z
	.object({
		id: z.number(),
		name: z.string(),
		icon: Nullable(z.string()),
		icon_types: z
			.record(z.string(), z.record(z.string(), z.string()))
			.nullish(),
	})
	.loose();

const ShareSchema = z
	.object({
		user: Nullable(CommentUserSchema),
		user_id: z.number(),
		paid_share: MoneyString,
		owed_share: MoneyString,
		net_balance: MoneyString,
	})
	.loose();

const CommentSchema = z
	.object({
		id: z.number(),
		content: z.string(),
		comment_type: Nullable(z.string()),
		relation_type: Nullable(z.string()),
		relation_id: Nullable(z.number()),
		created_at: Nullable(z.string()),
		deleted_at: Nullable(z.string()),
		user: Nullable(CommentUserSchema),
	})
	.loose();

const ExpenseSchema = z
	.object({
		id: z.number(),
		group_id: Nullable(z.number()),
		friendship_id: Nullable(z.number()),
		expense_bundle_id: Nullable(z.number()),
		description: z.string(),
		details: Nullable(z.string()),
		cost: MoneyString,
		currency_code: z.string(),
		date: Nullable(z.string()),
		created_at: Nullable(z.string()),
		created_by: Nullable(UserSchema),
		updated_at: Nullable(z.string()),
		updated_by: Nullable(UserSchema),
		deleted_at: Nullable(z.string()),
		deleted_by: Nullable(UserSchema),
		category: Nullable(z.object({ id: z.number(), name: z.string() }).loose()),
		receipt: Nullable(
			z
				.object({ large: Nullable(z.string()), original: Nullable(z.string()) })
				.loose(),
		),
		repeats: Nullable(z.boolean()),
		repeat_interval: Nullable(z.string()),
		email_reminder: Nullable(z.boolean()),
		email_reminder_in_advance: Nullable(z.number()),
		next_repeat: Nullable(z.string()),
		comments_count: Nullable(z.number()),
		payment: Nullable(z.boolean()),
		transaction_confirmed: Nullable(z.boolean()),
		repayments: Nullable(
			z.array(
				z
					.object({
						from: z.number(),
						to: z.number(),
						amount: MoneyString,
					})
					.loose(),
			),
		),
		users: Nullable(z.array(ShareSchema)),
		comments: Nullable(z.array(CommentSchema)),
	})
	.loose();

const NotificationSchema = z
	.object({
		id: z.number(),
		type: z
			.number()
			.describe('Notification type; new values are added without notice'),
		created_at: Nullable(z.string()),
		created_by: Nullable(z.number()),
		source: Nullable(
			z
				.object({
					type: Nullable(z.string()),
					id: Nullable(z.number()),
					url: Nullable(z.string()),
				})
				.loose(),
		),
		image_url: Nullable(z.string()),
		image_shape: Nullable(z.string()),
		content: Nullable(z.string()),
	})
	.loose();

const CurrencySchema = z
	.object({
		currency_code: z.string(),
		unit: z.string(),
	})
	.loose();

const ParentCategorySchema = CategorySchema.extend({
	subcategories: z.array(CategorySchema),
}).loose();

/** The `errors` map Splitwise returns when a write answers 200 with failures. */
const WriteErrorsSchema = z.record(z.string(), z.array(z.string()));

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------

const GetCurrentUserInputSchema = z.object({});
export type GetCurrentUserInput = z.input<typeof GetCurrentUserInputSchema>;

const GetCurrentUserOutputSchema = z
	.object({ user: CurrentUserSchema })
	.loose();
export type GetCurrentUserOutput = z.output<typeof GetCurrentUserOutputSchema>;

const UserIdInputSchema = z.object({
	user_id: z
		.number()
		.int()
		.positive()
		.describe('Splitwise user ID, from `users.current` or a group member'),
});
export type UserIdInput = z.input<typeof UserIdInputSchema>;

const GetUserOutputSchema = z.object({ user: UserSchema }).loose();
export type GetUserOutput = z.output<typeof GetUserOutputSchema>;

// `update_user` takes the id in the path and every other field in the body, so
// the path parameter cannot be changed by the body.
const UpdateUserInputSchema = z.object({
	user_id: z.number().int().positive().describe('ID of the user to update'),
	first_name: z.string().min(1).optional(),
	last_name: z.string().min(1).optional(),
	email: z.email().optional(),
	password: z.string().min(1).optional(),
	locale: z
		.string()
		.optional()
		.describe('ISO 639-1 two-letter locale code, e.g. "en"'),
	default_currency: z
		.string()
		.optional()
		.describe('Currency code from `currencies.list`, e.g. "USD"'),
});
export type UpdateUserInput = z.input<typeof UpdateUserInputSchema>;

const UpdateUserOutputSchema = z.object({ user: UserSchema }).loose();
export type UpdateUserOutput = z.output<typeof UpdateUserOutputSchema>;

// ---------------------------------------------------------------------------
// groups
// ---------------------------------------------------------------------------

const ListGroupsInputSchema = z.object({});
export type ListGroupsInput = z.input<typeof ListGroupsInputSchema>;

const ListGroupsOutputSchema = z
	.object({
		groups: z.array(GroupSchema),
	})
	.loose();
export type ListGroupsOutput = z.output<typeof ListGroupsOutputSchema>;

const GroupIdInputSchema = z.object({
	group_id: z.number().int().positive().describe('Splitwise group ID'),
});
export type GroupIdInput = z.input<typeof GroupIdInputSchema>;

const GetGroupOutputSchema = z.object({ group: GroupSchema }).loose();
export type GetGroupOutput = z.output<typeof GetGroupOutputSchema>;

const GroupUserSchema = z
	.object({
		user_id: z.number().int().positive().optional(),
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		email: z.email().optional(),
	})
	.superRefine((value, ctx) => {
		// Splitwise accepts either a known user's ID or a new person's name and
		// email; a name without an email cannot be added.
		if (value.user_id === undefined) {
			if (!value.first_name || !value.email) {
				ctx.addIssue({
					code: 'custom',
					message:
						'A group member needs either `user_id`, or `first_name` and `email`',
					path: ['user_id'],
				});
			}
		}
	});
export type GroupUserInput = z.input<typeof GroupUserSchema>;

const CreateGroupInputSchema = z.object({
	name: z.string().min(1).describe('Name of the group'),
	group_type: z
		.enum(['home', 'trip', 'couple', 'other', 'apartment', 'house'])
		.optional()
		.describe('Splitwise recommends `home` in place of `house` or `apartment`'),
	simplify_by_default: z
		.boolean()
		.optional()
		.describe('Turn on simplify debts'),
	users: z
		.array(GroupUserSchema)
		.optional()
		.describe(
			'Members to add besides the current user, who is added automatically',
		),
});
export type CreateGroupInput = z.input<typeof CreateGroupInputSchema>;

const CreateGroupOutputSchema = z.object({ group: GroupSchema }).loose();
export type CreateGroupOutput = z.output<typeof CreateGroupOutputSchema>;

/** Routes that answer `{ success }` and may also carry an `errors` map. */
// Splitwise documents a successful delete as `{ success: true, errors: [] }`
// and a failure as `{ success: false, errors: { base: [...] } }`, so `errors`
// is read as either an array or the field map.
const SuccessOutputSchema = z
	.object({
		success: z.boolean(),
		errors: z.union([WriteErrorsSchema, z.array(z.string())]).nullish(),
	})
	.loose();
export type SuccessOutput = z.output<typeof SuccessOutputSchema>;

/**
 * `undelete_group` is the one conditional write whose `errors` is a plain array
 * of strings (`["You do not have permission to undelete this group."]`) rather
 * than the `{ field: [message] }` map every other route sends.
 */
const UndeleteGroupOutputSchema = z
	.object({
		success: z.boolean(),
		errors: z.array(z.string()).nullish(),
	})
	.loose();
export type UndeleteGroupOutput = z.output<typeof UndeleteGroupOutputSchema>;

const AddUserToGroupInputSchema = z
	.object({
		group_id: z.number().int().positive(),
		user_id: z.number().int().positive().optional(),
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		email: z.email().optional(),
	})
	.superRefine((value, ctx) => {
		// Splitwise requires `user_id`, or all three of first name, last name and
		// email for someone who is not a Splitwise user yet.
		if (value.user_id !== undefined) return;
		const missing = (['first_name', 'last_name', 'email'] as const).filter(
			(key) => value[key] === undefined,
		);
		if (missing.length > 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Without `user_id`, Splitwise needs `first_name`, `last_name` and `email`',
				path: missing,
			});
		}
	});
export type AddUserToGroupInput = z.input<typeof AddUserToGroupInputSchema>;

const AddUserToGroupOutputSchema = z
	.object({
		success: z.boolean(),
		user: UserSchema.nullish(),
		errors: WriteErrorsSchema.nullish(),
	})
	.loose();
export type AddUserToGroupOutput = z.output<typeof AddUserToGroupOutputSchema>;

const RemoveUserFromGroupInputSchema = z.object({
	group_id: z.number().int().positive(),
	user_id: z.number().int().positive(),
});
export type RemoveUserFromGroupInput = z.input<
	typeof RemoveUserFromGroupInputSchema
>;

// ---------------------------------------------------------------------------
// friends
// ---------------------------------------------------------------------------

const ListFriendsInputSchema = z.object({});
export type ListFriendsInput = z.input<typeof ListFriendsInputSchema>;

const ListFriendsOutputSchema = z
	.object({ friends: z.array(FriendSchema) })
	.loose();
export type ListFriendsOutput = z.output<typeof ListFriendsOutputSchema>;

const FriendIdInputSchema = z.object({
	friend_id: z.number().int().positive().describe("The friend's user ID"),
});
export type FriendIdInput = z.input<typeof FriendIdInputSchema>;

const GetFriendOutputSchema = z.object({ friend: FriendSchema }).loose();
export type GetFriendOutput = z.output<typeof GetFriendOutputSchema>;

const AddFriendInputSchema = z.object({
	user_email: z.email().describe("The friend's email address"),
	user_first_name: z
		.string()
		.min(1)
		.optional()
		.describe('Required only when the other person has no Splitwise account'),
	user_last_name: z.string().min(1).optional(),
});
export type AddFriendInput = z.input<typeof AddFriendInputSchema>;

const AddFriendOutputSchema = z.object({ friend: FriendSchema }).loose();
export type AddFriendOutput = z.output<typeof AddFriendOutputSchema>;

const AddFriendsInputSchema = z.object({
	users: z
		.array(
			z.object({
				email: z.email(),
				first_name: z
					.string()
					.min(1)
					.optional()
					.describe('Required only when the person has no Splitwise account'),
				last_name: z.string().min(1).optional(),
			}),
		)
		.min(1)
		.describe('Friends to add in one call'),
});
export type AddFriendsInput = z.input<typeof AddFriendsInputSchema>;

const AddFriendsOutputSchema = z
	.object({
		users: z.array(FriendSchema),
		errors: WriteErrorsSchema.nullish(),
	})
	.loose();
export type AddFriendsOutput = z.output<typeof AddFriendsOutputSchema>;

// ---------------------------------------------------------------------------
// expenses
// ---------------------------------------------------------------------------

const RepeatIntervalSchema = z.enum([
	'never',
	'weekly',
	'fortnightly',
	'monthly',
	'yearly',
]);

/** Whole cents of an amount that has at most two decimal places. */
function toCents(value: number): number {
	return Math.round(value * 100);
}

/**
 * Money goes to Splitwise as a two-decimal string, so an amount with more
 * decimals would be rounded on the way and could break the shares-equal-cost
 * check. Such amounts are refused instead.
 */
const MoneyAmount = z
	.number()
	.refine((value) => Math.abs(value * 100 - toCents(value)) < 1e-6, {
		message: 'Use at most two decimal places',
	});

const ExpenseShareSchema = z
	.object({
		user_id: z.number().int().positive().optional(),
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		email: z.email().optional(),
		paid_share: MoneyAmount.min(0).describe('What this user paid, e.g. 25.5'),
		owed_share: MoneyAmount.min(0).describe('What this user owes, e.g. 13.55'),
	})
	.superRefine((value, ctx) => {
		// Splitwise identifies a share by `user_id`, or by the person's full name
		// and email when they have no account.
		if (value.user_id !== undefined) return;
		const missing = (['first_name', 'last_name', 'email'] as const).filter(
			(key) => value[key] === undefined,
		);
		if (missing.length > 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Each share needs `user_id`, or `first_name`, `last_name` and `email`',
				path: missing,
			});
		}
	});

/**
 * The fields every expense write takes. `cost` is a number here and is sent as
 * a decimal string, which is the type Splitwise documents for it.
 */
const ExpenseFields = {
	description: z.string().min(1).describe('A short description of the expense'),
	cost: MoneyAmount.describe('Total cost of the expense, e.g. 25.5'),
	details: z.string().optional().describe('Free-text notes'),
	date: z.iso
		.datetime()
		.optional()
		.describe(
			'ISO 8601 date and time the expense took place, e.g. "2026-05-02T13:00:00Z"',
		),
	currency_code: z
		.string()
		.optional()
		.describe(
			'Currency code from `currencies.list`; defaults to the group currency',
		),
	category_id: z
		.number()
		.int()
		.optional()
		.describe(
			'A subcategory ID from `categories.list`; a parent category is rejected',
		),
	repeat_interval: RepeatIntervalSchema.optional(),
};

/**
 * `update_expense` documents the same body as `create_expense` but only needs
 * the fields that change, so `description` and `cost` are optional there.
 */
const EditableExpenseFields = {
	...ExpenseFields,
	description: ExpenseFields.description.optional(),
	cost: ExpenseFields.cost.optional(),
};

const ListExpensesInputSchema = z.object({
	group_id: z
		.number()
		.int()
		.optional()
		.describe('Only expenses in this group; `friend_id` is then ignored'),
	friend_id: z
		.number()
		.int()
		.optional()
		.describe('Only expenses between the current user and this user'),
	dated_after: z.iso.datetime().optional(),
	dated_before: z.iso.datetime().optional(),
	updated_after: z.iso.datetime().optional(),
	updated_before: z.iso.datetime().optional(),
	limit: z.number().int().positive().max(100).optional().describe('Default 20'),
	offset: z.number().int().min(0).optional().describe('Default 0'),
});
export type ListExpensesInput = z.input<typeof ListExpensesInputSchema>;

const ListExpensesOutputSchema = z
	.object({
		expenses: z.array(ExpenseSchema),
	})
	.loose();
export type ListExpensesOutput = z.output<typeof ListExpensesOutputSchema>;

const ExpenseIdInputSchema = z.object({
	expense_id: z.number().int().positive().describe('Splitwise expense ID'),
});
export type ExpenseIdInput = z.input<typeof ExpenseIdInputSchema>;

const GetExpenseOutputSchema = z.object({ expense: ExpenseSchema }).loose();
export type GetExpenseOutput = z.output<typeof GetExpenseOutputSchema>;

const CreateExpenseInputSchema = z
	.object({
		...ExpenseFields,
		/** Equal split. Only valid together with `group_id`. */
		split_equally: z
			.literal(true)
			.optional()
			.describe(
				'Split equally between the group; requires `group_id` and no `users`',
			),
		group_id: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe(
				'Group to put the expense in, or 0 for an expense outside a group',
			),
		users: z
			.array(ExpenseShareSchema)
			.optional()
			.describe(
				'One entry per person, each with `paid_share` and `owed_share`',
			),
	})
	.superRefine((value, ctx) => {
		// Splitwise offers exactly two shapes: an equal split inside a group, or
		// an explicit share per person. Anything else is rejected before the call.
		if (value.split_equally) {
			if (value.group_id === undefined || value.group_id === 0) {
				ctx.addIssue({
					code: 'custom',
					message: '`split_equally` needs a `group_id`',
					path: ['group_id'],
				});
			}
			if (value.users !== undefined) {
				ctx.addIssue({
					code: 'custom',
					message: '`split_equally` cannot be combined with `users`',
					path: ['users'],
				});
			}
			return;
		}
		if (value.users === undefined || value.users.length === 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Pass `users` with a share per person, or `split_equally` inside a group',
				path: ['users'],
			});
			return;
		}
		// A share list that does not add up to the cost is a data error the API
		// answers with a 400, and the user's own balance silently absorbs it.
		// Compared in whole cents, the same amounts the request will carry.
		const paid = value.users.reduce(
			(total, share) => total + toCents(share.paid_share),
			0,
		);
		const owed = value.users.reduce(
			(total, share) => total + toCents(share.owed_share),
			0,
		);
		if (paid !== toCents(value.cost)) {
			ctx.addIssue({
				code: 'custom',
				message: `The paid shares add up to ${paid / 100}, not the cost of ${value.cost}`,
				path: ['users'],
			});
		}
		if (owed !== toCents(value.cost)) {
			ctx.addIssue({
				code: 'custom',
				message: `The owed shares add up to ${owed / 100}, not the cost of ${value.cost}`,
				path: ['users'],
			});
		}
	});
export type CreateExpenseInput = z.input<typeof CreateExpenseInputSchema>;

const CreateExpenseOutputSchema = z
	.object({
		expenses: z.array(ExpenseSchema),
		errors: WriteErrorsSchema.nullish(),
	})
	.loose();
export type CreateExpenseOutput = z.output<typeof CreateExpenseOutputSchema>;

const UpdateExpenseInputSchema = z
	.object({
		...EditableExpenseFields,
		expense_id: z
			.number()
			.int()
			.positive()
			.describe('ID of the expense to update'),
		group_id: z.number().int().min(0).optional(),
		users: z
			.array(ExpenseShareSchema)
			.optional()
			.describe('Replaces every share on the expense when supplied'),
	})
	.superRefine((value, ctx) => {
		// Passing any share replaces all of them, so a partial list silently
		// drops the people it leaves out. Require a list that matches the cost.
		if (value.users === undefined) return;
		const cost = value.cost;
		if (cost === undefined) {
			ctx.addIssue({
				code: 'custom',
				message:
					'A `users` list replaces every share, so `cost` is required with it',
				path: ['cost'],
			});
			return;
		}
		const paid = value.users.reduce(
			(total, share) => total + toCents(share.paid_share),
			0,
		);
		const owed = value.users.reduce(
			(total, share) => total + toCents(share.owed_share),
			0,
		);
		if (paid !== toCents(cost) || owed !== toCents(cost)) {
			ctx.addIssue({
				code: 'custom',
				message: `The shares add up to paid ${paid / 100} and owed ${owed / 100}, not the cost of ${cost}`,
				path: ['users'],
			});
		}
	});
export type UpdateExpenseInput = z.input<typeof UpdateExpenseInputSchema>;

const UpdateExpenseOutputSchema = CreateExpenseOutputSchema;
export type UpdateExpenseOutput = z.output<typeof UpdateExpenseOutputSchema>;

// ---------------------------------------------------------------------------
// comments
// ---------------------------------------------------------------------------

const ListCommentsInputSchema = z.object({
	expense_id: z
		.number()
		.int()
		.positive()
		.describe('Expense whose comments to read'),
});
export type ListCommentsInput = z.input<typeof ListCommentsInputSchema>;

const ListCommentsOutputSchema = z
	.object({
		comments: z.array(CommentSchema),
	})
	.loose();
export type ListCommentsOutput = z.output<typeof ListCommentsOutputSchema>;

const CreateCommentInputSchema = z.object({
	expense_id: z.number().int().positive(),
	content: z.string().min(1).describe('Comment body'),
});
export type CreateCommentInput = z.input<typeof CreateCommentInputSchema>;

const CreateCommentOutputSchema = z.object({ comment: CommentSchema }).loose();
export type CreateCommentOutput = z.output<typeof CreateCommentOutputSchema>;

const CommentIdInputSchema = z.object({
	comment_id: z.number().int().positive(),
});
export type CommentIdInput = z.input<typeof CommentIdInputSchema>;

const DeleteCommentOutputSchema = z.object({ comment: CommentSchema }).loose();
export type DeleteCommentOutput = z.output<typeof DeleteCommentOutputSchema>;

// ---------------------------------------------------------------------------
// notifications
// ---------------------------------------------------------------------------

const ListNotificationsInputSchema = z.object({
	updated_after: z.iso
		.datetime()
		.optional()
		.describe('Only notifications created after this time'),
	limit: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Maximum to return; omit for the provider maximum'),
});
export type ListNotificationsInput = z.input<
	typeof ListNotificationsInputSchema
>;

const ListNotificationsOutputSchema = z
	.object({
		notifications: z.array(NotificationSchema),
	})
	.loose();
export type ListNotificationsOutput = z.output<
	typeof ListNotificationsOutputSchema
>;

// ---------------------------------------------------------------------------
// currencies and categories
// ---------------------------------------------------------------------------

const ListCurrenciesInputSchema = z.object({});
export type ListCurrenciesInput = z.input<typeof ListCurrenciesInputSchema>;

const ListCurrenciesOutputSchema = z
	.object({
		currencies: z.array(CurrencySchema),
	})
	.loose();
export type ListCurrenciesOutput = z.output<typeof ListCurrenciesOutputSchema>;

const ListCategoriesInputSchema = z.object({});
export type ListCategoriesInput = z.input<typeof ListCategoriesInputSchema>;

const ListCategoriesOutputSchema = z
	.object({
		categories: z.array(ParentCategorySchema),
	})
	.loose();
export type ListCategoriesOutput = z.output<typeof ListCategoriesOutputSchema>;

/** The keys every conditional-write envelope carries. */
export const SUCCESS_OUTPUT_KEYS = ['success'] as const;

export type SplitwiseEndpointInputs = {
	getCurrentUser: GetCurrentUserInput;
	getUser: UserIdInput;
	updateUser: UpdateUserInput;
	listGroups: ListGroupsInput;
	getGroup: GroupIdInput;
	createGroup: CreateGroupInput;
	deleteGroup: GroupIdInput;
	undeleteGroup: GroupIdInput;
	addUserToGroup: AddUserToGroupInput;
	removeUserFromGroup: RemoveUserFromGroupInput;
	listFriends: ListFriendsInput;
	getFriend: FriendIdInput;
	addFriend: AddFriendInput;
	addFriends: AddFriendsInput;
	deleteFriend: FriendIdInput;
	listExpenses: ListExpensesInput;
	getExpense: ExpenseIdInput;
	createExpense: CreateExpenseInput;
	updateExpense: UpdateExpenseInput;
	deleteExpense: ExpenseIdInput;
	undeleteExpense: ExpenseIdInput;
	listComments: ListCommentsInput;
	createComment: CreateCommentInput;
	deleteComment: CommentIdInput;
	listNotifications: ListNotificationsInput;
	listCurrencies: ListCurrenciesInput;
	listCategories: ListCategoriesInput;
};

export type SplitwiseEndpointOutputs = {
	getCurrentUser: GetCurrentUserOutput;
	getUser: GetUserOutput;
	updateUser: UpdateUserOutput;
	listGroups: ListGroupsOutput;
	getGroup: GetGroupOutput;
	createGroup: CreateGroupOutput;
	deleteGroup: SuccessOutput;
	undeleteGroup: UndeleteGroupOutput;
	addUserToGroup: AddUserToGroupOutput;
	removeUserFromGroup: SuccessOutput;
	listFriends: ListFriendsOutput;
	getFriend: GetFriendOutput;
	addFriend: AddFriendOutput;
	addFriends: AddFriendsOutput;
	deleteFriend: SuccessOutput;
	listExpenses: ListExpensesOutput;
	getExpense: GetExpenseOutput;
	createExpense: CreateExpenseOutput;
	updateExpense: UpdateExpenseOutput;
	deleteExpense: SuccessOutput;
	undeleteExpense: SuccessOutput;
	listComments: ListCommentsOutput;
	createComment: CreateCommentOutput;
	deleteComment: DeleteCommentOutput;
	listNotifications: ListNotificationsOutput;
	listCurrencies: ListCurrenciesOutput;
	listCategories: ListCategoriesOutput;
};

export const SplitwiseEndpointInputSchemas = {
	getCurrentUser: GetCurrentUserInputSchema,
	getUser: UserIdInputSchema,
	updateUser: UpdateUserInputSchema,
	listGroups: ListGroupsInputSchema,
	getGroup: GroupIdInputSchema,
	createGroup: CreateGroupInputSchema,
	deleteGroup: GroupIdInputSchema,
	undeleteGroup: GroupIdInputSchema,
	addUserToGroup: AddUserToGroupInputSchema,
	removeUserFromGroup: RemoveUserFromGroupInputSchema,
	listFriends: ListFriendsInputSchema,
	getFriend: FriendIdInputSchema,
	addFriend: AddFriendInputSchema,
	addFriends: AddFriendsInputSchema,
	deleteFriend: FriendIdInputSchema,
	listExpenses: ListExpensesInputSchema,
	getExpense: ExpenseIdInputSchema,
	createExpense: CreateExpenseInputSchema,
	updateExpense: UpdateExpenseInputSchema,
	deleteExpense: ExpenseIdInputSchema,
	undeleteExpense: ExpenseIdInputSchema,
	listComments: ListCommentsInputSchema,
	createComment: CreateCommentInputSchema,
	deleteComment: CommentIdInputSchema,
	listNotifications: ListNotificationsInputSchema,
	listCurrencies: ListCurrenciesInputSchema,
	listCategories: ListCategoriesInputSchema,
} as const;

export const SplitwiseEndpointOutputSchemas = {
	getCurrentUser: GetCurrentUserOutputSchema,
	getUser: GetUserOutputSchema,
	updateUser: UpdateUserOutputSchema,
	listGroups: ListGroupsOutputSchema,
	getGroup: GetGroupOutputSchema,
	createGroup: CreateGroupOutputSchema,
	deleteGroup: SuccessOutputSchema,
	undeleteGroup: UndeleteGroupOutputSchema,
	addUserToGroup: AddUserToGroupOutputSchema,
	removeUserFromGroup: SuccessOutputSchema,
	listFriends: ListFriendsOutputSchema,
	getFriend: GetFriendOutputSchema,
	addFriend: AddFriendOutputSchema,
	addFriends: AddFriendsOutputSchema,
	deleteFriend: SuccessOutputSchema,
	listExpenses: ListExpensesOutputSchema,
	getExpense: GetExpenseOutputSchema,
	createExpense: CreateExpenseOutputSchema,
	updateExpense: UpdateExpenseOutputSchema,
	deleteExpense: SuccessOutputSchema,
	undeleteExpense: SuccessOutputSchema,
	listComments: ListCommentsOutputSchema,
	createComment: CreateCommentOutputSchema,
	deleteComment: DeleteCommentOutputSchema,
	listNotifications: ListNotificationsOutputSchema,
	listCurrencies: ListCurrenciesOutputSchema,
	listCategories: ListCategoriesOutputSchema,
} as const;

export type {
	CommentSchema,
	CurrentUserSchema,
	ExpenseSchema,
	FriendSchema,
	GroupSchema,
	NotificationSchema,
	ParentCategorySchema,
	UserSchema,
};
