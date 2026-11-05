import { z } from 'zod';

const TimelyId = z.union([z.string(), z.number()]);

const TimelyResourceSchema = z.record(z.string(), z.unknown());
export type TimelyResource = z.infer<typeof TimelyResourceSchema>;

const AccountsListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).max(100).optional(),
	per_page: z.number().int().min(1).max(100).optional(),
});
export type AccountsListInput = z.infer<typeof AccountsListInputSchema>;

const AccountsGetInputSchema = z.object({
	id: TimelyId,
});
export type AccountsGetInput = z.infer<typeof AccountsGetInputSchema>;

const AccountsListOutputSchema = z.array(TimelyResourceSchema);
export type AccountsListOutput = z.infer<typeof AccountsListOutputSchema>;

const AccountsGetOutputSchema = TimelyResourceSchema;
export type AccountsGetOutput = z.infer<typeof AccountsGetOutputSchema>;

function accountScopedInput() {
	return z.object({
		accountId: TimelyId.optional(),
		account_id: TimelyId.optional(),
		page: z.number().int().min(1).optional(),
		perPage: z.number().int().min(1).max(100).optional(),
		per_page: z.number().int().min(1).max(100).optional(),
	});
}

const ClientsListInputSchema = accountScopedInput().extend({
	id: TimelyId.optional(),
});
// override: require accountId at runtime via refinement not needed
export type ClientsListInput = z.infer<typeof ClientsListInputSchema>;

const ClientsGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type ClientsGetInput = z.infer<typeof ClientsGetInputSchema>;

const ProjectsListInputSchema = accountScopedInput();
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const UsersListInputSchema = accountScopedInput();
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

const TeamsListInputSchema = accountScopedInput();
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

const TeamsGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;

const TagsListInputSchema = accountScopedInput();
export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const TagsGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type TagsGetInput = z.infer<typeof TagsGetInputSchema>;

const TimeEntriesListInputSchema = accountScopedInput();
export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;

const TimeEntriesGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;

const ReportsListInputSchema = accountScopedInput();
export type ReportsListInput = z.infer<typeof ReportsListInputSchema>;

const ReportsGetInputSchema = z.object({
	accountId: TimelyId.optional(),
	account_id: TimelyId.optional(),
	id: TimelyId,
});
export type ReportsGetInput = z.infer<typeof ReportsGetInputSchema>;

const ListOutputSchema = z.array(TimelyResourceSchema);
const GetOutputSchema = TimelyResourceSchema;

export type TimelyEndpointInputs = {
	accountsList: AccountsListInput;
	accountsGet: AccountsGetInput;
	clientsList: ClientsListInput;
	clientsGet: ClientsGetInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	teamsList: TeamsListInput;
	teamsGet: TeamsGetInput;
	tagsList: TagsListInput;
	tagsGet: TagsGetInput;
	timeEntriesList: TimeEntriesListInput;
	timeEntriesGet: TimeEntriesGetInput;
	reportsList: ReportsListInput;
	reportsGet: ReportsGetInput;
};

export type TimelyEndpointOutputs = {
	accountsList: AccountsListOutput;
	accountsGet: AccountsGetOutput;
	clientsList: typeof ListOutputSchema extends z.ZodTypeAny
		? z.infer<typeof ListOutputSchema>
		: never;
	clientsGet: z.infer<typeof GetOutputSchema>;
	projectsList: z.infer<typeof ListOutputSchema>;
	projectsGet: z.infer<typeof GetOutputSchema>;
	usersList: z.infer<typeof ListOutputSchema>;
	usersGet: z.infer<typeof GetOutputSchema>;
	teamsList: z.infer<typeof ListOutputSchema>;
	teamsGet: z.infer<typeof GetOutputSchema>;
	tagsList: z.infer<typeof ListOutputSchema>;
	tagsGet: z.infer<typeof GetOutputSchema>;
	timeEntriesList: z.infer<typeof ListOutputSchema>;
	timeEntriesGet: z.infer<typeof GetOutputSchema>;
	reportsList: z.infer<typeof ListOutputSchema>;
	reportsGet: z.infer<typeof GetOutputSchema>;
};

export const TimelyEndpointInputSchemas = {
	accountsList: AccountsListInputSchema,
	accountsGet: AccountsGetInputSchema,
	clientsList: ClientsListInputSchema,
	clientsGet: ClientsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	teamsList: TeamsListInputSchema,
	teamsGet: TeamsGetInputSchema,
	tagsList: TagsListInputSchema,
	tagsGet: TagsGetInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
	timeEntriesGet: TimeEntriesGetInputSchema,
	reportsList: ReportsListInputSchema,
	reportsGet: ReportsGetInputSchema,
} as const;

export const TimelyEndpointOutputSchemas = {
	accountsList: AccountsListOutputSchema,
	accountsGet: AccountsGetOutputSchema,
	clientsList: ListOutputSchema,
	clientsGet: GetOutputSchema,
	projectsList: ListOutputSchema,
	projectsGet: GetOutputSchema,
	usersList: ListOutputSchema,
	usersGet: GetOutputSchema,
	teamsList: ListOutputSchema,
	teamsGet: GetOutputSchema,
	tagsList: ListOutputSchema,
	tagsGet: GetOutputSchema,
	timeEntriesList: ListOutputSchema,
	timeEntriesGet: GetOutputSchema,
	reportsList: ListOutputSchema,
	reportsGet: GetOutputSchema,
} as const;
