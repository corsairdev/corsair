import { z } from 'zod';

const ns = z.string().nullable().optional();
const id = z.union([z.string(), z.number()]);

export const IdInput = z.union([z.string(), z.number()]);

export const PagingSchema = z.object({
	total_count: id.optional(),
	page: id.optional(),
	page_size: id.optional(),
});

export const AddressSchema = z
	.object({
		country: ns,
		state: ns,
		city: ns,
		building: ns,
		address_line: ns,
		address_line2: ns,
		floor: ns,
		flat: ns,
		zip_code: ns,
	})
	.passthrough();

/**
 * Official CustomFieldResponse is a field_type discriminator union.
 * Extra properties vary by type (text/number/date/dropdown/...).
 */
export const CustomFieldSchema = z
	.object({
		field_type: z.string(),
	})
	.passthrough();

export const FamilyMemberSchema = z
	.object({
		id: id.optional(),
		person_id: id.optional(),
		first_name: ns,
		last_name: ns,
		full_name: ns,
		family_role: ns,
	})
	.passthrough();

export const PersonSchema = z
	.object({
		id: id.optional(),
		first_name: ns,
		middle_name: ns,
		last_name: ns,
		full_name: ns,
		nick_name: ns,
		native_name: ns,
		email: ns,
		photo: ns,
		birth_date: ns,
		mobile: ns,
		do_not_text: z.boolean().nullable().optional(),
		do_not_email: z.boolean().nullable().optional(),
		created_on: ns,
		updated_on: ns,
		facebook: ns,
		gender: ns,
		social_status: ns,
		marriage_date: ns,
		engagement_date: ns,
		job_title: ns,
		work_place: ns,
		qualification: ns,
		education_level: ns,
		school: ns,
		father_name: ns,
		church: ns,
		is_deacon: z.boolean().nullable().optional(),
		rank: ns,
		bishop_donor: ns,
		family_role: ns,
		family: z.array(FamilyMemberSchema).nullable().optional(),
		baptism_date: ns,
		baptism_location: ns,
		grade: ns,
		graduation_year: z.union([z.string(), z.number()]).nullable().optional(),
		telephone: ns,
		talents_and_hobbies: ns,
		is_archived: z.boolean().optional(),
		archived_at: ns,
		address: AddressSchema.nullable().optional(),
		additional_fields: z.array(CustomFieldSchema).nullable().optional(),
	})
	.passthrough();

export const PersonWriteSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	middle_name: z.string().optional(),
	nick_name: z.string().optional(),
	native_name: z.string().optional(),
	email: z.string().optional(),
	birth_date: z.string().optional(),
	mobile: z.string().optional(),
	do_not_text: z.boolean().optional(),
	do_not_email: z.boolean().optional(),
	facebook: z.string().optional(),
	gender: z.string().optional(),
	social_status: z.string().optional(),
	engagement_date: z.string().optional(),
	marriage_date: z.string().optional(),
	job_title: z.string().optional(),
	work_place: z.string().optional(),
	qualification: z.string().optional(),
	education_level: z.string().optional(),
	school: z.string().optional(),
	father_name: z.string().optional(),
	church: z.string().optional(),
	is_deacon: z.boolean().optional(),
	rank: z.string().optional(),
	bishop_donor: z.string().optional(),
	baptism_date: z.string().optional(),
	baptism_location: z.string().optional(),
	grade: z.string().optional(),
	graduation_year: z.union([z.string(), z.number()]).optional(),
	telephone: z.string().optional(),
	talents_and_hobbies: z.string().optional(),
	address: AddressSchema.optional(),
	additional_fields: z.array(CustomFieldSchema).optional(),
});

export const PeopleListInputSchema = z.object({
	include_family_members: z.boolean().optional(),
	include_additional_fields: z.boolean().optional(),
	include_organizations: z.boolean().optional(),
	name: z.string().optional(),
	mobile: z.string().optional(),
	email: z.string().optional(),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const PersonIdInputSchema = z.object({
	id: IdInput,
});

export const PersonCreateInputSchema = PersonWriteSchema;
export const PersonUpdateInputSchema = PersonWriteSchema.extend({
	id: IdInput,
});

export const PersonOrganizationsInputSchema = z.object({
	person_id: IdInput,
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const OrganizationSchema = z
	.object({
		id: ns,
		type: z.enum(['diocese', 'church', 'ministry']).optional(),
		name: ns,
		parent_id: ns,
		created_on: ns,
		is_main: z.boolean().optional(),
	})
	.passthrough();

export const OrganizationsListInputSchema = z.object({
	search_text: z.string().optional(),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const OrganizationIdInputSchema = z.object({
	organization_id: z.string().min(1),
});

export const OrganizationPeopleListInputSchema = z.object({
	organization_id: z.string().min(1),
	include_family_members: z.boolean().optional(),
	include_additional_fields: z.boolean().optional(),
	include_organizations: z.boolean().optional(),
	name: z.string().optional(),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const OrganizationPersonInputSchema = z.object({
	organization_id: z.string().min(1),
	person_id: IdInput,
});

/** Official LookupFieldDefinition uses `value`; some responses emit `Value`. */
export const LookupFieldSchema = z.preprocess((raw) => {
	if (raw && typeof raw === 'object' && 'Value' in raw && !('value' in raw)) {
		const row = raw as { Value?: string | null };
		return { ...row, value: row.Value };
	}
	return raw;
}, z.object({ value: ns }).passthrough());

export const SettingsGetInputSchema = z.object({});

export const SettingsGetOutputSchema = z.object({
	genders: z.array(LookupFieldSchema),
	social_statuses: z.array(LookupFieldSchema),
	grade_values: z.array(LookupFieldSchema),
	family_roles: z.array(LookupFieldSchema),
	fields: z
		.object({
			sections: z.array(z.object({}).passthrough()).nullable().optional(),
		})
		.passthrough(),
});

export const EventScheduleSchema = z
	.object({
		all_day: z.boolean().optional(),
		start_time: ns,
		end_time: ns,
		duration_days: id.optional(),
	})
	.passthrough();

export const EventLocationSchema = z
	.object({
		name: ns,
		formatted_address: ns,
		latitude: z.union([z.number(), z.string()]).nullable().optional(),
		longitude: z.union([z.number(), z.string()]).nullable().optional(),
	})
	.passthrough();

export const EventSchema = z
	.object({
		id: id.optional(),
		title: ns,
		description: ns,
		start_date: ns,
		schedule: EventScheduleSchema.optional(),
		recurrence: z.object({}).passthrough().nullable().optional(),
		location: EventLocationSchema.nullable().optional(),
		visibility: z.string().nullable().optional(),
		image_url: ns,
	})
	.passthrough();

export const EventsListInputSchema = z.object({
	from: z.string().min(1),
	to: z.string().min(1),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const EventIdInputSchema = z.object({
	event_id: IdInput,
});

export const EventOccurrencesInputSchema = z.object({
	event_id: IdInput,
	from: z.string().min(1),
	to: z.string().min(1),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const OccurrenceSchema = z
	.object({
		occurrence_id: ns,
		event_id: id.optional(),
		title: ns,
		description: ns,
		start: ns,
		end: ns,
		materialized: z.boolean().optional(),
		image_url: ns,
	})
	.passthrough();

export const AttendanceSchema = z
	.object({
		person: z
			.object({
				person_id: id.nullable().optional(),
				first_name: ns,
				last_name: ns,
				full_name: ns,
				mobile: ns,
				email: ns,
			})
			.passthrough()
			.optional(),
		status: z.enum(['absent', 'attended']).optional(),
		checked_in_at: ns,
		checked_out_at: ns,
		check_in_code: ns,
	})
	.passthrough();

export const AttendanceListInputSchema = z.object({
	occurrence_id: z.string().min(1),
	status: z.enum(['absent', 'attended']).optional(),
	group_id: IdInput.optional(),
	ungrouped: z.boolean().optional(),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const GroupSchema = z
	.object({
		id: id.optional(),
		name: ns,
		description: ns,
		privacy: z.enum(['internal', 'members', 'public']).optional(),
		join_request_option: z
			.enum(['open', 'closed', 'approval_required'])
			.optional(),
		is_visible_to_non_members: z.boolean().optional(),
		is_members_visible: z.boolean().optional(),
		is_group_leaders_visible: z.boolean().optional(),
		is_chat_enabled: z.boolean().optional(),
		created_on: ns,
	})
	.passthrough();

export const GroupsListInputSchema = z.object({
	search_text: z.string().optional(),
});

export const GroupIdInputSchema = z.object({
	group_id: IdInput,
});

export const GroupWriteSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	privacy: z.enum(['internal', 'members', 'public']).optional(),
	join_request_option: z
		.enum(['open', 'closed', 'approval_required'])
		.optional(),
	is_visible_to_non_members: z.boolean().optional(),
	is_members_visible: z.boolean().optional(),
	is_group_leaders_visible: z.boolean().optional(),
	is_chat_enabled: z.boolean().optional(),
});

export const GroupUpdateInputSchema = GroupWriteSchema.extend({
	group_id: IdInput,
});

export const GroupMemberInputSchema = z.object({
	group_id: IdInput,
	person_id: IdInput,
});

export const FamilySchema = z
	.object({
		family_id: id.optional(),
		members: z.array(FamilyMemberSchema).nullable().optional(),
	})
	.passthrough();

export const FamiliesListInputSchema = z.object({
	search_text: z.string().optional(),
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const FamilyIdInputSchema = z.object({
	id: IdInput,
});

export const FamilyCreateInputSchema = z.object({
	members: z
		.array(
			z.object({
				person_id: IdInput,
				family_role: z.string().min(1),
			}),
		)
		.min(1),
});

export const NoteSchema = z
	.object({
		id: id.optional(),
		note: ns,
		person_id: id.optional(),
		created_on: ns,
		updated_on: ns,
	})
	.passthrough();

export const NotesListInputSchema = z.object({
	person_id: IdInput,
	page: z.number().int().optional(),
	page_size: z.number().int().optional(),
});

export const PagedPeopleSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(PersonSchema),
});
export const PagedOrganizationsSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(OrganizationSchema),
});
export const PagedEventsSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(EventSchema),
});
export const PagedOccurrencesSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(OccurrenceSchema),
});
export const PagedAttendanceSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(AttendanceSchema),
});
export const PagedFamiliesSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(FamilySchema),
});
export const PagedNotesSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(NoteSchema),
});
export const OrganizationListSchema = z.object({
	paging: PagingSchema.optional(),
	data: z.array(OrganizationSchema),
});
export const GroupListSchema = z.array(GroupSchema);
export const SuccessSchema = z.object({ success: z.literal(true) });

export type ChMeetingsEndpointInputs = {
	peopleList: z.infer<typeof PeopleListInputSchema>;
	peopleGet: z.infer<typeof PersonIdInputSchema>;
	peopleCreate: z.infer<typeof PersonCreateInputSchema>;
	peopleUpdate: z.infer<typeof PersonUpdateInputSchema>;
	peopleDelete: z.infer<typeof PersonIdInputSchema>;
	peopleListOrganizations: z.infer<typeof PersonOrganizationsInputSchema>;
	settingsGet: z.infer<typeof SettingsGetInputSchema>;
	organizationsList: z.infer<typeof OrganizationsListInputSchema>;
	organizationsGet: z.infer<typeof OrganizationIdInputSchema>;
	organizationsListPeople: z.infer<typeof OrganizationPeopleListInputSchema>;
	organizationsAddPerson: z.infer<typeof OrganizationPersonInputSchema>;
	organizationsRemovePerson: z.infer<typeof OrganizationPersonInputSchema>;
	eventsList: z.infer<typeof EventsListInputSchema>;
	eventsGet: z.infer<typeof EventIdInputSchema>;
	eventsListOccurrences: z.infer<typeof EventOccurrencesInputSchema>;
	attendanceList: z.infer<typeof AttendanceListInputSchema>;
	groupsList: z.infer<typeof GroupsListInputSchema>;
	groupsGet: z.infer<typeof GroupIdInputSchema>;
	groupsCreate: z.infer<typeof GroupWriteSchema>;
	groupsUpdate: z.infer<typeof GroupUpdateInputSchema>;
	groupsDelete: z.infer<typeof GroupIdInputSchema>;
	groupsAddMember: z.infer<typeof GroupMemberInputSchema>;
	groupsRemoveMember: z.infer<typeof GroupMemberInputSchema>;
	familiesList: z.infer<typeof FamiliesListInputSchema>;
	familiesGet: z.infer<typeof FamilyIdInputSchema>;
	familiesCreate: z.infer<typeof FamilyCreateInputSchema>;
	familiesDelete: z.infer<typeof FamilyIdInputSchema>;
	notesList: z.infer<typeof NotesListInputSchema>;
};

export type ChMeetingsEndpointOutputs = {
	peopleList: z.infer<typeof PagedPeopleSchema>;
	peopleGet: z.infer<typeof PersonSchema>;
	peopleCreate: z.infer<typeof PersonSchema>;
	peopleUpdate: z.infer<typeof SuccessSchema>;
	peopleDelete: z.infer<typeof SuccessSchema>;
	peopleListOrganizations: z.infer<typeof OrganizationListSchema>;
	settingsGet: z.infer<typeof SettingsGetOutputSchema>;
	organizationsList: z.infer<typeof PagedOrganizationsSchema>;
	organizationsGet: z.infer<typeof OrganizationSchema>;
	organizationsListPeople: z.infer<typeof PagedPeopleSchema>;
	organizationsAddPerson: z.infer<typeof SuccessSchema>;
	organizationsRemovePerson: z.infer<typeof SuccessSchema>;
	eventsList: z.infer<typeof PagedEventsSchema>;
	eventsGet: z.infer<typeof EventSchema>;
	eventsListOccurrences: z.infer<typeof PagedOccurrencesSchema>;
	attendanceList: z.infer<typeof PagedAttendanceSchema>;
	groupsList: z.infer<typeof GroupListSchema>;
	groupsGet: z.infer<typeof GroupSchema>;
	groupsCreate: z.infer<typeof GroupSchema>;
	groupsUpdate: z.infer<typeof GroupSchema>;
	groupsDelete: z.infer<typeof SuccessSchema>;
	groupsAddMember: z.infer<typeof SuccessSchema>;
	groupsRemoveMember: z.infer<typeof SuccessSchema>;
	familiesList: z.infer<typeof PagedFamiliesSchema>;
	familiesGet: z.infer<typeof FamilySchema>;
	familiesCreate: z.infer<typeof FamilySchema>;
	familiesDelete: z.infer<typeof SuccessSchema>;
	notesList: z.infer<typeof PagedNotesSchema>;
};

export const ChMeetingsEndpointInputSchemas = {
	peopleList: PeopleListInputSchema,
	peopleGet: PersonIdInputSchema,
	peopleCreate: PersonCreateInputSchema,
	peopleUpdate: PersonUpdateInputSchema,
	peopleDelete: PersonIdInputSchema,
	peopleListOrganizations: PersonOrganizationsInputSchema,
	settingsGet: SettingsGetInputSchema,
	organizationsList: OrganizationsListInputSchema,
	organizationsGet: OrganizationIdInputSchema,
	organizationsListPeople: OrganizationPeopleListInputSchema,
	organizationsAddPerson: OrganizationPersonInputSchema,
	organizationsRemovePerson: OrganizationPersonInputSchema,
	eventsList: EventsListInputSchema,
	eventsGet: EventIdInputSchema,
	eventsListOccurrences: EventOccurrencesInputSchema,
	attendanceList: AttendanceListInputSchema,
	groupsList: GroupsListInputSchema,
	groupsGet: GroupIdInputSchema,
	groupsCreate: GroupWriteSchema,
	groupsUpdate: GroupUpdateInputSchema,
	groupsDelete: GroupIdInputSchema,
	groupsAddMember: GroupMemberInputSchema,
	groupsRemoveMember: GroupMemberInputSchema,
	familiesList: FamiliesListInputSchema,
	familiesGet: FamilyIdInputSchema,
	familiesCreate: FamilyCreateInputSchema,
	familiesDelete: FamilyIdInputSchema,
	notesList: NotesListInputSchema,
} as const;

export const ChMeetingsEndpointOutputSchemas = {
	peopleList: PagedPeopleSchema,
	peopleGet: PersonSchema,
	peopleCreate: PersonSchema,
	peopleUpdate: SuccessSchema,
	peopleDelete: SuccessSchema,
	peopleListOrganizations: OrganizationListSchema,
	settingsGet: SettingsGetOutputSchema,
	organizationsList: PagedOrganizationsSchema,
	organizationsGet: OrganizationSchema,
	organizationsListPeople: PagedPeopleSchema,
	organizationsAddPerson: SuccessSchema,
	organizationsRemovePerson: SuccessSchema,
	eventsList: PagedEventsSchema,
	eventsGet: EventSchema,
	eventsListOccurrences: PagedOccurrencesSchema,
	attendanceList: PagedAttendanceSchema,
	groupsList: GroupListSchema,
	groupsGet: GroupSchema,
	groupsCreate: GroupSchema,
	groupsUpdate: GroupSchema,
	groupsDelete: SuccessSchema,
	groupsAddMember: SuccessSchema,
	groupsRemoveMember: SuccessSchema,
	familiesList: PagedFamiliesSchema,
	familiesGet: FamilySchema,
	familiesCreate: FamilySchema,
	familiesDelete: SuccessSchema,
	notesList: PagedNotesSchema,
} as const;
