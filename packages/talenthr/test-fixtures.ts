// Fixtures built from the response bodies in TalentHR's published API
// collection (https://apidocs.talenthr.io), not from the prose descriptions.
// Every successful TalentHR answer is `{ success: true, data }`; the deletes
// leave `data` out and answer `{ success: true }` alone.

export const directoryResponse = {
	success: true,
	data: {
		total: 1,
		rows: [
			{
				id: 19,
				user_id: 19,
				reports_to_employee_id: 1,
				photo_url:
					'https://d2spisfw2i7npf.cloudfront.net/public-assets/people/default-avatar.png',
				u_id: 19,
				first_name: 'John',
				last_name: 'Doe',
				email: 'jdoe@example.com',
				division_id: 13,
				division: 'Europe',
				employment_status_id: 1,
				employment_status_name: 'Full-Time',
				department_id: 6,
				department: 'Administration & Operations',
				job_title_id: 26,
				job_title: 'Business Analyst',
				location_id: 36,
				location: 'Athens',
				termination_date: null,
				hire_date: '2023-11-28',
				linked_in_url: null,
				work_phone: null,
				address: 'Address name',
				city: 'Athens',
				postal_code: '105 63',
				country: 'Greece',
				sec_address: 'Secondary address name',
				sec_city: 'Athens',
				sec_postal_code: '105 63',
				sec_country: 'Greece',
				custom_fields: [],
				user_role: { id: 3, slug: 'employee', name: 'Employee' },
			},
		],
	},
};

export const employeeResponse = {
	success: true,
	data: {
		id: 15,
		ssn: null,
		birth_date: '1997-05-30',
		hire_date: '2012-01-02',
		hire_date_utc: '2012-01-02 14:45:25',
		personal_email: 'johndoe@example.com',
		marital_status: null,
		nationality: null,
		work_phone: 'phone-number',
		country: null,
		address: null,
		postal_code: null,
		city: null,
		linked_in_url: null,
		photo_url:
			'https://d2spisfw2i7npf.cloudfront.net/testdomain1/avatars/15_1700059591.jpg',
		citizenship: null,
		termination_date: null,
		gender: 'Male',
		job_title_id: 25,
		division_id: 13,
		department_id: 6,
		location_id: 36,
		employee_number: null,
		user_role: { id: 3, name: 'Employee', slug: 'employee' },
		seniority: { years: 12, months: 1, days: 27 },
		termination_reason: '',
		custom_fields: [
			{
				custom_field_id: 47,
				custom_field_slug: 'custom-field-001',
				custom_field_name: 'Custom Field 001',
				values: [{ value: 'https://www.mydomain.com/custom-fields' }],
			},
		],
		default_avatar: false,
		location_name: 'Athens',
		division_name: 'Europe',
		department_name: 'Administration & Operations',
		job_title_name: 'Business Analyst',
		is_terminated: false,
		visa_status: null,
		user: {
			first_name: 'John',
			last_name: 'Doe',
			middle_name: null,
			email: 'john.doe@example.com',
			last_login_at: null,
		},
	},
};

export const hiredEmployeeResponse = {
	success: true,
	data: {
		hire_date_utc: '2024-02-28 22:00:00',
		photo_url:
			'https://d2spisfw2i7npf.cloudfront.net/public-assets/people/default-avatar.png',
		hire_date: '2024-02-29',
		id: 41,
		user_role: { id: 3, name: 'Employee', slug: 'employee' },
		seniority: { years: 0, months: 0, days: 0 },
		termination_reason: '',
		custom_fields: [],
		default_avatar: true,
		location_name: null,
		division_name: null,
		department_name: null,
		job_title_name: null,
		short_manager: {
			manager_id: 15,
			manager_name: 'Black Mia',
			manager_employee_number: null,
			location_name: 'Athens',
			department_name: 'Administration & Operations',
			division_name: 'Europe',
			job_title_name: 'Administrative Assistant',
			linked_in_url: null,
			work_phone: 'work-phone',
			email: 'mblack@example.com',
			photo_url:
				'https://d2spisfw2i7npf.cloudfront.net/testdomain1/avatars/15_1700059591.jpg',
			is_me: false,
		},
		is_terminated: false,
		visa_status: null,
		user: {
			first_name: 'John',
			last_name: 'Doe',
			middle_name: null,
			email: 'john.doe@example.com',
			last_login_at: null,
		},
		hire_packet: {
			id: 5,
			employee_id: 41,
			who_id: 15,
			instructions: 'these are instructions',
			address: 'address-name',
			when_time: '2024-03-01 00:00:00',
			timezone: 'Europe/Athens',
			created_at: '2024-02-29T10:37:33.000000Z',
			updated_at: '2024-02-29T10:37:33.000000Z',
			deleted_at: null,
		},
		emergency_contact: null,
	},
};

export const terminatedResponse = {
	success: true,
	data: {
		id: 39,
		employee_id: 34,
		effective_date: '2024-03-04',
		employment_status_id: 4,
		// TalentHR sends an integer here, not a boolean.
		is_active: 0,
		end_date: null,
		created_at: '2024-03-04 10:19:18',
		updated_at: '2024-03-04 10:19:18',
		deleted_at: null,
		termination_reason: null,
		termination_type: 'termination',
		regrettable_status: null,
		employment_status: {
			id: 4,
			name: 'Terminated',
			object_type: 'employment_status',
		},
	},
};

export const rehireResponse = {
	success: true,
	data: { employee_id: 34 },
};

export const deletedResponse = { success: true };

export const employmentStatusesResponse = {
	success: true,
	data: [
		{
			id: 15,
			employee_id: 15,
			cycle_id: 4,
			effective_date: '2012-01-02',
			employment_status_id: 1,
			is_hire_event: 0,
			working_hours: 8,
			end_date: null,
			created_at: '2023-11-15 14:45:25',
			updated_at: null,
			deleted_at: null,
			termination_reason: null,
			termination_type: null,
			regrettable_status: null,
			employment_status: { id: 1, name: 'Full-Time' },
		},
	],
};

export const timeOffListResponse = {
	success: true,
	data: {
		total: 5,
		rows: [
			{
				id: 20,
				approved: true,
				note: null,
				// Budgets arrive as strings with three decimals.
				budget: '2.000',
				is_canceled: true,
				start_date: '2024-01-08',
				end_date: '2024-01-10',
				employee_id: 1,
				created_at: '2024-01-10 11:22:09',
				updated_at: '2024-01-10 12:10:03',
				deleted_at: null,
				timeoff_type_id: 4,
				timeoff_type_name: 'Vacation',
				timeoff_type_slug: 'vacation',
				allow_cancel: false,
			},
		],
	},
};

export const timeOffCreatedResponse = {
	success: true,
	data: {
		id: 2402,
		timeoff_type_id: 1,
		start_date: '2024-03-04',
		end_date: '2024-03-08',
		employee_id: 15,
		budget: '2.000',
		approved: null,
		created_at: '2026-05-11 10:00:00',
		updated_at: '2026-05-11 10:00:00',
		deleted_at: null,
		working_hours: 8,
		budget_days: '2.000',
		budget_hours: null,
		attachment_url: null,
		attachment_name: null,
		time_off_type: { id: 1, name: 'Sick Leave', slug: 'sick-leave' },
	},
};

export const timeOffTypesResponse = {
	success: true,
	data: [
		{
			id: 1,
			name: 'Sick Leave',
			slug: 'sick-leave',
			budget: '5.000',
			period: 'days',
			paid: true,
			is_default: true,
			is_disabled: false,
			needs_approval: true,
			calendar_blocking: true,
			visible_internally: true,
			allow_exceeding: true,
			use_calendar_days: false,
			created_at: '2023-06-15 06:08:13',
			updated_at: '2023-06-15 06:08:13',
			deleted_at: null,
		},
	],
};

export const timeOffBudgetsResponse = {
	success: true,
	data: [
		{
			id: 10,
			employee_id: 1,
			budget: '10.000',
			time_off_cycle_id: 3,
			timeoff_type_id: 4,
			timeoff_type_name: 'Vacation',
			timeoff_type_slug: 'vacation',
			timeoff_allow_exceeding: false,
			original_budget: '10.000',
			used_budget: '0.000',
			paid: true,
			has_unlimited_timeoff: false,
			unlimited_used_budget: null,
			employee_has_accrual: true,
			accrual_original_budget: '5.000',
			accrual_budget: '5.000',
			accrual_used_budget: '0.000',
			accrual_carry_on_budget: '2.000',
			accrual_carry_on_used_budget: '0.000',
			accrual_carry_on_original_budget: '2.000',
		},
	],
};

export const divisionsResponse = {
	success: true,
	data: [
		{ id: 12, name: 'North America', object_type: 'division' },
		{ id: 13, name: 'Europe', object_type: 'division' },
	],
};

export const divisionResponse = {
	success: true,
	data: { id: 12, name: 'North America', object_type: 'division' },
};

export const locationsResponse = {
	success: true,
	data: [
		{
			id: 34,
			name: 'California',
			object_type: 'location',
			field_data: { address: 'address-name', is_remote: false },
		},
	],
};

export const departmentsResponse = {
	success: true,
	data: [
		{
			id: 6,
			name: 'Administration & Operations',
			object_type: 'department',
		},
	],
};

export const jobTitlesResponse = {
	success: true,
	data: [{ id: 29, name: 'Accountant', object_type: 'job-title' }],
};

export const employmentStatusOptionsResponse = {
	success: true,
	data: [
		{ id: 1, name: 'Full-Time' },
		{ id: 2, name: 'Part-Time' },
		{ id: 3, name: 'Contractor' },
	],
};

// A rejected key: TalentHR answers 401 with the same tenant-not-found body it
// sends for a missing tenant, so the status is what identifies an auth failure.
export const unauthorizedResponse = {
	success: false,
	error: {
		message: "We can't find that resource.",
		hr_code: 40,
		hr_code_key: 'not_found_tenancy',
		code: 401,
	},
};

export const notFoundResponse = {
	success: false,
	error: {
		message: "We can't find that resource.",
		hr_code: 40,
		hr_code_key: 'not_found_tenancy',
		code: 404,
	},
};
