import { z } from 'zod';

// Teams and their members (developer.mixmax.com/reference, Teams section).
// Field names, types, and required-ness mirror the official Team, TeamMember,
// TeamMemberInvite and TeamPage schemas and the /v1/teams/* operation
// definitions.

// One person on a team, matching the official TeamMember schema. A pending
// invitee who is not a Mixmax user has `email` and no `userId`, and `name`
// and `email` only appear with `expand=members.userId`, so those stay
// optional and the object stays passthrough because the provider adds
// expanded detail it does not pin down.
export const TeamMemberSchema = z
	.object({
		// The member's id on this team; use it to remove the member. This is
		// not the user id.
		memberId: z.string(),
		// The member's Mixmax user id; missing for invitees who are not Mixmax
		// users yet.
		userId: z.string().optional(),
		// The invitee's email when they are not a Mixmax user yet; with
		// `members.userId` expanded, also the email of members who are.
		email: z.string().optional(),
		// The member's name; only with `members.userId` expanded.
		name: z.string().optional(),
		// The member's role on the team.
		role: z.enum(['admin', 'member']),
		// `true` once the invite is accepted, `false` if it was declined;
		// missing while the invite is pending.
		accepted: z.boolean().optional(),
		// When the member accepted or declined the invite.
		acceptedAt: z.string().optional(),
		// When the member was first added.
		createdAt: z.string().optional(),
		// When the invite was last sent.
		invitedAt: z.string(),
	})
	.passthrough();

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// A team, matching the official Team schema. Documented fields stay optional
// where the provider omits them and the document passthrough because the
// provider may add team detail it does not pin down.
export const TeamSchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		// ISO 8601 date-time strings.
		createdAt: z.string(),
		// When the team was created or last renamed.
		modifiedAt: z.string(),
		// The team's members, including pending invites. Present only with
		// `expand=members`.
		members: z.array(TeamMemberSchema).optional(),
	})
	.passthrough();

export type Team = z.infer<typeof TeamSchema>;

// A person to invite to a team, matching the official TeamMemberInvite
// schema: `email` is required and the role defaults to `member` on the
// provider.
export const TeamMemberInviteSchema = z.object({
	// The person's email address. It is trimmed and lowercased.
	email: z.string().min(1),
	// The role to give them on the team.
	role: z.enum(['admin', 'member']).optional(),
});

export type TeamMemberInvite = z.infer<typeof TeamMemberInviteSchema>;

// A page of teams, matching the official TeamPage schema. The cursors and
// flags stay optional like every other page in this plugin, while `results`
// is the page's payload.
export const TeamPageSchema = z.object({
	results: z.array(TeamSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type TeamPage = z.infer<typeof TeamPageSchema>;

export const TeamsListInputSchema = z.object({
	// Comma-separated. `members` adds each team's members;
	// `members,members.userId` also adds `name` and `email` to members who
	// are Mixmax users.
	expand: z.string().optional(),
	// Pass `myself` to list only the teams you are a member of, without the
	// teams you see as a workspace admin.
	accessThrough: z.enum(['myself']).optional(),
	// How many teams per page. Defaults to 100, at most 500.
	limit: z.coerce.number().int().max(500).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

export const TeamsListOutputSchema = TeamPageSchema;

export type TeamsListOutput = z.infer<typeof TeamsListOutputSchema>;

export const TeamsCreateInputSchema = z.object({
	// The name of the new team.
	name: z.string().min(1),
	// The workspace the team belongs to. It must be your own workspace, and
	// every Mixmax user in `members` must belong to it.
	orgId: z.string().optional(),
	// People to add to the team and send invites to. Leave out yourself.
	members: z.array(TeamMemberInviteSchema).optional(),
});

export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;

// POST /v1/teams answers 200 with the new team, its members expanded with
// names and emails.
export const TeamsCreateOutputSchema = TeamSchema;

export type TeamsCreateOutput = z.infer<typeof TeamsCreateOutputSchema>;

export const TeamsGetInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated; see `TeamsListInputSchema.expand`.
	expand: z.string().optional(),
});

export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;

export const TeamsGetOutputSchema = TeamSchema;

export type TeamsGetOutput = z.infer<typeof TeamsGetOutputSchema>;

export const TeamsUpdateInputSchema = z.object({
	id: z.string().min(1),
	// The new name of the team. `name` is the only field the provider
	// changes, and an empty body fails with `No properties provided to update
	// the team`, so it is required here even though the official body schema
	// does not mark it.
	name: z.string().min(1),
});

export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;

// PATCH /v1/teams/{id} answers 200 with the team's `_id` as a JSON string,
// not the whole team.
export const TeamsUpdateOutputSchema = z.string();

export type TeamsUpdateOutput = z.infer<typeof TeamsUpdateOutputSchema>;

export const TeamsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;

// DELETE /v1/teams/{id} answers 204 with no body.
export const TeamsDeleteOutputSchema = z.undefined();

export type TeamsDeleteOutput = z.infer<typeof TeamsDeleteOutputSchema>;

export const TeamsMembersListInputSchema = z.object({
	id: z.string().min(1),
	// Pass exactly `members.userId` to add `name` and `email` to members who
	// are Mixmax users.
	expand: z.enum(['members.userId']).optional(),
});

export type TeamsMembersListInput = z.infer<typeof TeamsMembersListInputSchema>;

// GET /v1/teams/{id}/members answers 200 with every member in one response;
// this list is not paginated.
export const TeamsMembersListOutputSchema = z.object({
	results: z.array(TeamMemberSchema),
});

export type TeamsMembersListOutput = z.infer<
	typeof TeamsMembersListOutputSchema
>;

export const TeamsMembersAddInputSchema = z.object({
	id: z.string().min(1),
	// People to add. The provider rejects a missing or empty array with 400,
	// so at least one invite is required.
	members: z.array(TeamMemberInviteSchema).min(1),
});

export type TeamsMembersAddInput = z.infer<typeof TeamsMembersAddInputSchema>;

// POST /v1/teams/{id}/members answers 200 with the full list of members
// after the change, without names or emails.
export const TeamsMembersAddOutputSchema = z.array(TeamMemberSchema);

export type TeamsMembersAddOutput = z.infer<typeof TeamsMembersAddOutputSchema>;

export const TeamsMembersRemoveInputSchema = z.object({
	id: z.string().min(1),
	// The member's `memberId` from the team's member list. This is not the
	// user id.
	memberId: z.string().min(1),
});

export type TeamsMembersRemoveInput = z.infer<
	typeof TeamsMembersRemoveInputSchema
>;

// DELETE /v1/teams/{id}/members/{memberId} answers 200 with the literal
// `true`.
export const TeamsMembersRemoveOutputSchema = z.boolean();

export type TeamsMembersRemoveOutput = z.infer<
	typeof TeamsMembersRemoveOutputSchema
>;

export const TeamsMembersUpdateInputSchema = z.object({
	id: z.string().min(1),
	// The member's `memberId` from the team's member list. This is not the
	// user id.
	memberId: z.string().min(1),
	// The member's new role on the team. Only members who have accepted
	// their invite can be changed.
	role: z.enum(['admin', 'member']),
});

export type TeamsMembersUpdateInput = z.infer<
	typeof TeamsMembersUpdateInputSchema
>;

// PATCH /v1/teams/{id}/members/{memberId} answers 200 with the literal
// `true`.
export const TeamsMembersUpdateOutputSchema = z.boolean();

export type TeamsMembersUpdateOutput = z.infer<
	typeof TeamsMembersUpdateOutputSchema
>;
