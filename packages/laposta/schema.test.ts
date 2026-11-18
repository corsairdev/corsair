import {
	CreateFieldInputSchema,
	CreateFieldOutputSchema,
	CreateListInputSchema,
	CreateListOutputSchema,
	CreateMemberInputSchema,
	CreateMemberOutputSchema,
	DeleteFieldInputSchema,
	DeleteFieldOutputSchema,
	DeleteListInputSchema,
	DeleteListOutputSchema,
	DeleteMemberInputSchema,
	DeleteMemberOutputSchema,
	GetCampaignInputSchema,
	GetCampaignOutputSchema,
	GetCampaignsInputSchema,
	GetCampaignsOutputSchema,
	GetFieldInputSchema,
	GetFieldOutputSchema,
	GetFieldsInputSchema,
	GetFieldsOutputSchema,
	GetListInputSchema,
	GetListOutputSchema,
	GetListsInputSchema,
	GetListsOutputSchema,
	GetMemberInputSchema,
	GetMemberOutputSchema,
	GetMembersInputSchema,
	GetMembersOutputSchema,
	GetReportInputSchema,
	GetReportOutputSchema,
	UpdateListInputSchema,
	UpdateListOutputSchema,
	UpdateMemberInputSchema,
	UpdateMemberOutputSchema,
} from './endpoints/types';
import { LapostaSchema } from './schema';
import { lapostaEntities } from './schema/database';

describe('Laposta schema', () => {
	it('declares a semver version', () => {
		expect(LapostaSchema.version).toBeDefined();
		expect(LapostaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(LapostaSchema.entities).toBe(lapostaEntities);
		expect(LapostaSchema.entities).toEqual({});
	});
});

describe('Laposta endpoint schemas', () => {
	it('validates lists endpoint schemas', () => {
		expect(GetListsInputSchema.safeParse({}).success).toBe(true);
		expect(GetListsOutputSchema.safeParse({ data: [] }).success).toBe(true);
		expect(
			GetListsOutputSchema.safeParse({
				data: [{ list_id: 'l1', name: 'Newsletter' }],
			}).success,
		).toBe(true);

		expect(GetListInputSchema.safeParse({ list_id: 'l1' }).success).toBe(true);
		expect(GetListInputSchema.safeParse({ list_id: '' }).success).toBe(false);
		expect(
			GetListOutputSchema.safeParse({
				list: { list_id: 'l1', name: 'Newsletter' },
			}).success,
		).toBe(true);

		expect(CreateListInputSchema.safeParse({ name: 'Subscribers' }).success).toBe(
			true,
		);
		expect(CreateListInputSchema.safeParse({ name: '' }).success).toBe(false);
		expect(
			CreateListOutputSchema.safeParse({
				list: { list_id: 'l2', name: 'Subscribers' },
			}).success,
		).toBe(true);

		expect(
			UpdateListInputSchema.safeParse({ list_id: 'l1', name: 'VIP' }).success,
		).toBe(true);
		expect(UpdateListInputSchema.safeParse({ list_id: '' }).success).toBe(false);
		expect(
			UpdateListOutputSchema.safeParse({
				list: { list_id: 'l1', name: 'VIP' },
			}).success,
		).toBe(true);

		expect(DeleteListInputSchema.safeParse({ list_id: 'l1' }).success).toBe(
			true,
		);
		expect(DeleteListInputSchema.safeParse({ list_id: '' }).success).toBe(false);
		expect(
			DeleteListOutputSchema.safeParse({
				list: { list_id: 'l1', state: 'deleted' },
			}).success,
		).toBe(true);
	});

	it('validates members endpoint schemas', () => {
		expect(GetMembersInputSchema.safeParse({ list_id: 'l1' }).success).toBe(
			true,
		);
		expect(
			GetMembersInputSchema.safeParse({ list_id: 'l1', state: 'active' })
				.success,
		).toBe(true);
		expect(GetMembersInputSchema.safeParse({ list_id: '' }).success).toBe(false);
		expect(GetMembersOutputSchema.safeParse({ data: [] }).success).toBe(true);

		expect(
			GetMemberInputSchema.safeParse({ list_id: 'l1', member_id: 'm1' })
				.success,
		).toBe(true);
		expect(
			GetMemberInputSchema.safeParse({ list_id: 'l1', member_id: '' }).success,
		).toBe(false);
		expect(
			GetMemberOutputSchema.safeParse({
				member: { member_id: 'm1', email: 'user@example.com' },
			}).success,
		).toBe(true);

		expect(
			CreateMemberInputSchema.safeParse({
				list_id: 'l1',
				email: 'user@example.com',
			}).success,
		).toBe(true);
		expect(
			CreateMemberInputSchema.safeParse({
				list_id: 'l1',
				email: 'not-an-email',
			}).success,
		).toBe(false);
		expect(
			CreateMemberOutputSchema.safeParse({
				member: { member_id: 'm2', email: 'user@example.com' },
			}).success,
		).toBe(true);

		expect(
			UpdateMemberInputSchema.safeParse({
				list_id: 'l1',
				member_id: 'm1',
				state: 'unsubscribed',
			}).success,
		).toBe(true);
		expect(
			UpdateMemberOutputSchema.safeParse({
				member: { member_id: 'm1', state: 'unsubscribed' },
			}).success,
		).toBe(true);

		expect(
			DeleteMemberInputSchema.safeParse({ list_id: 'l1', member_id: 'm1' })
				.success,
		).toBe(true);
		expect(
			DeleteMemberOutputSchema.safeParse({
				member: { member_id: 'm1', state: 'deleted' },
			}).success,
		).toBe(true);
	});

	it('validates fields endpoint schemas', () => {
		expect(GetFieldsInputSchema.safeParse({ list_id: 'l1' }).success).toBe(
			true,
		);
		expect(GetFieldsInputSchema.safeParse({ list_id: '' }).success).toBe(false);
		expect(GetFieldsOutputSchema.safeParse({ data: [] }).success).toBe(true);

		expect(
			GetFieldInputSchema.safeParse({ list_id: 'l1', field_id: 'f1' }).success,
		).toBe(true);
		expect(
			GetFieldOutputSchema.safeParse({
				field: { field_id: 'f1', name: 'Firstname' },
			}).success,
		).toBe(true);

		expect(
			CreateFieldInputSchema.safeParse({
				list_id: 'l1',
				name: 'Age',
				datatype: 'numeric',
			}).success,
		).toBe(true);
		expect(
			CreateFieldInputSchema.safeParse({ list_id: 'l1', name: '' }).success,
		).toBe(false);
		expect(
			CreateFieldOutputSchema.safeParse({
				field: { field_id: 'f2', name: 'Age' },
			}).success,
		).toBe(true);

		expect(
			DeleteFieldInputSchema.safeParse({ list_id: 'l1', field_id: 'f1' })
				.success,
		).toBe(true);
		expect(
			DeleteFieldOutputSchema.safeParse({
				field: { field_id: 'f1', state: 'deleted' },
			}).success,
		).toBe(true);
	});

	it('validates campaigns and reports endpoint schemas', () => {
		expect(GetCampaignsInputSchema.safeParse({}).success).toBe(true);
		expect(GetCampaignsOutputSchema.safeParse({ data: [] }).success).toBe(true);

		expect(
			GetCampaignInputSchema.safeParse({ campaign_id: 'c1' }).success,
		).toBe(true);
		expect(GetCampaignInputSchema.safeParse({ campaign_id: '' }).success).toBe(
			false,
		);
		expect(
			GetCampaignOutputSchema.safeParse({
				campaign: { campaign_id: 'c1', name: 'Monthly Digest' },
			}).success,
		).toBe(true);

		expect(GetReportInputSchema.safeParse({ campaign_id: 'c1' }).success).toBe(
			true,
		);
		expect(GetReportInputSchema.safeParse({ campaign_id: '' }).success).toBe(
			false,
		);
		expect(
			GetReportOutputSchema.safeParse({
				report: { campaign_id: 'c1', sent: 1500, opens: 600 },
			}).success,
		).toBe(true);
	});
});
