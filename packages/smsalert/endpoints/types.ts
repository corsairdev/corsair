import { z } from 'zod';

const text = z.string().min(1);
const optionalText = z.string().optional();
const page = z.number().int().positive().optional();
const pagination = { page, limit: page, order: optionalText };
const record = <T extends z.ZodType>(description: T) =>
	z.object({ status: z.literal('success'), description }).loose();
const message = record(z.string());
const fields = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		creationdate: z.string().optional(),
	})
	.loose();
const batch = record(
	z
		.object({
			desc: z.string(),
			batchid: z.string(),
			batch_dtl: z.array(
				z
					.object({
						mobileno: z.string(),
						msgid: z.string(),
						status: z.string(),
					})
					.loose(),
			),
		})
		.loose(),
);

export const SmsalertEndpointInputSchemas = {
	profile: z.object({}),
	register: z.object({
		username: text,
		mobilenumber: text,
		emailid: text,
		firstname: text,
		lastname: text,
	}),
	forgotPassword: z.object({ username_email: text }),
	changePassword: z.object({ pwd: text, newpwd: text, cnfpwd: text }),
	updateProfile: z.object({
		firstname: optionalText,
		lastname: optionalText,
		mobilenumber: optionalText,
		emailid: optionalText,
		fcm_id: optionalText,
	}),
	balance: z.object({}),
	senders: z.object({}),
	listGroups: z.object({ ...pagination, q: optionalText }),
	createGroup: z.object({ name: text }),
	deleteGroup: z.object({ id: text }),
	updateGroup: z.object({ id: text, name: text }),
	sendGroup: z.object({
		id: text,
		sender: text,
		text,
		route: optionalText,
		schedule: optionalText,
	}),
	listContacts: z.object({ group_id: text, ...pagination }),
	createContact: z.object({ grpname: text, name: text, number: text }),
	updateContact: z.object({ id: text, name: text, number: text }),
	deleteContact: z.object({ id: text }),
	listTemplates: z.object(pagination),
	createTemplate: z.object({ name: text, text }),
	updateTemplate: z.object({ id: text, name: text, text }),
	deleteTemplate: z.object({ id: text }),
	sendSms: z.object({
		sender: text,
		mobileno: text,
		text,
		schedule: optionalText,
		reference: optionalText,
		dlrurl: optionalText,
	}),
	updateSchedule: z.object({ batchid: text, schedule: text }),
	cancelSchedule: z.object({ batchid: text }),
	sentReport: z.object({
		page,
		limit: page,
		q: optionalText,
		schedule: optionalText,
	}),
	deliveryReport: z.object({
		batchid: text,
		schedule: optionalText,
		sender: optionalText,
		text: optionalText,
	}),
	generateOtp: z.object({
		sender: optionalText,
		mobileno: text,
		template: text.regex(
			/\[otp(?:\s[^\]]*)?\]/,
			'OTP template must include an [otp] tag',
		),
	}),
	validateOtp: z.object({ mobileno: text, code: text }),
	createShortUrl: z.object({ url: text }),
	deleteShortUrl: z.object({ id: text }),
} as const;

export const SmsalertEndpointOutputSchemas = {
	profile: record(
		z
			.object({
				id: z.string(),
				username: z.string(),
				firstname: z.string().optional(),
				lastname: z.string().optional(),
				mobilenumber: z.string().optional(),
				emailid: z.string().optional(),
				allowedprefix: z.string().optional(),
				parent_id: z.string().optional(),
				expirydate: z.string().optional(),
				mobile_verified: z.number().optional(),
				kyc_status: z.number().optional(),
				android_push: z.number().optional(),
				two_factor_auth: z.number().optional(),
			})
			.loose(),
	),
	register: message,
	forgotPassword: z
		.object({ status: z.literal('success'), msg: z.string() })
		.loose(),
	changePassword: message,
	updateProfile: message,
	balance: record(
		z
			.object({
				desc: z.string(),
				routes: z.array(
					z
						.object({
							route: z.string(),
							display_name: z.string(),
							credits: z.string(),
						})
						.loose(),
				),
			})
			.loose(),
	),
	senders: record(
		z.array(
			z
				.object({
					Senderid: z
						.object({
							sender: z.string(),
							approved: z.boolean(),
							open: z.boolean(),
							datetime: z.string(),
						})
						.loose(),
				})
				.loose(),
		),
	),
	listGroups: record(
		z.array(
			z
				.object({
					Group: fields.extend({
						group_data: z.string().nullable().optional(),
						groupfields: z.string().nullable().optional(),
						members: z.string().optional(),
					}),
				})
				.loose(),
		),
	),
	createGroup: message,
	deleteGroup: message,
	updateGroup: message,
	sendGroup: batch,
	listContacts: record(
		z.array(
			z
				.object({
					Groupmember: fields.extend({
						number: z.string().optional(),
						datas: z.string().nullable().optional(),
					}),
				})
				.loose(),
		),
	),
	createContact: message,
	updateContact: message,
	deleteContact: message,
	listTemplates: record(
		z.array(
			z
				.object({
					Smstemplate: fields.extend({
						title: z.string().optional(),
						template: z.string().optional(),
					}),
					// The reference only shows an empty User array and does not define its contents.
					User: z.unknown().optional(),
				})
				.loose(),
		),
	),
	createTemplate: message,
	updateTemplate: message,
	deleteTemplate: message,
	sendSms: batch,
	updateSchedule: message,
	cancelSchedule: message,
	sentReport: record(
		z.array(
			z
				.object({
					Smscampaignlog: z
						.object({
							id: z.string(),
							userid: z.string().optional(),
							senderid: z.string().optional(),
							text: z.string().optional(),
							campaignname: z.string().optional(),
							source: z.string().optional(),
							ipaddress: z.string().optional(),
							route: z.string().optional(),
							smscount: z.string().optional(),
							creditsrefunded: z.string().optional(),
							creditscharged: z.string().optional(),
							schedule: z.boolean().optional(),
							scheduletime: z.string().optional(),
							datetime: z.string().optional(),
						})
						.loose(),
				})
				.loose(),
		),
	),
	deliveryReport: record(
		z
			.object({
				desc: z.string(),
				report: z.array(
					z
						.object({
							mobileno: z.string(),
							sender: z.string(),
							text: z.string(),
							msgid: z.string(),
							status: z.string(),
							schedule: z.string(),
							lastupdated: z.string(),
						})
						.loose(),
				),
			})
			.loose(),
	),
	generateOtp: batch,
	validateOtp: record(z.object({ desc: z.string() }).loose()),
	createShortUrl: record(
		z
			.object({
				id: z.string(),
				status: z.string(),
				message: z.string(),
				data: z
					.object({
						Link: z
							.object({
								long_url: z.string(),
								short_url: z.string(),
								alias: z.string(),
								title: z.string().optional(),
								description: z.string().optional(),
								clicks: z.string().optional(),
								updated: z.string().nullable().optional(),
								created: z.string().optional(),
							})
							.loose(),
					})
					.loose(),
			})
			.loose(),
	),
	deleteShortUrl: message,
} as const;

export type SmsalertEndpointInputs = {
	[K in keyof typeof SmsalertEndpointInputSchemas]: z.infer<
		(typeof SmsalertEndpointInputSchemas)[K]
	>;
};
export type SmsalertEndpointOutputs = {
	[K in keyof typeof SmsalertEndpointOutputSchemas]: z.infer<
		(typeof SmsalertEndpointOutputSchemas)[K]
	>;
};
