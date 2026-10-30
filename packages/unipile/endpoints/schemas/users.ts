import { z } from 'zod';
import {
	AccountId,
	BinaryFileInput,
	BinaryFileSchema,
	NoContentSchema,
} from './shared';

// Generated from the per-operation OpenAPI definitions in Unipile's v2
// reference (API 2.62). Inputs follow the spec field for field; outputs
// type two levels of each response and pass the rest through.

const UsersListFollowersShape1 = z
	.object({
		id: z.string(),
		object: z.string(),
		type: z.string(),
		public_identifier: z.string().nullish(),
		display_name: z.string(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		profile_url: z.string().nullish(),
		public_picture_url: z.string().nullish(),
		private_picture_download_url: z.string().nullish(),
		description: z.string().nullish(),
		specifics: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const UsersListFollowersShape2 = z
	.object({
		data: z.array(UsersListFollowersShape1),
		total_count: z
			.number()
			.nullish()
			.describe('Total number of results if supported by the provider.'),
		next_cursor: z
			.string()
			.nullish()
			.describe(
				'Cursor to get the next page of results if supported. Else use `offset`.',
			),
	})
	.loose();

export const UsersInputSchemas = {
	usersSetPresence: z.object({
		account_id: AccountId,
		presence: z
			.enum(['online', 'restricted_online', 'offline', 'away'])
			.describe(
				'The presence of the user. - `online` if the user is online / available. _ `restricted_online` if the user is online to a restricted set of contacts. - `offline` if the user is offline / unavailable. - `away` if the user is away / busy.',
			),
	}),
	usersGetPresence: z.object({
		user_id: z
			.string()
			.min(1)
			.describe(
				'The ID of the User whose presence must be retrieved, as returned by the provider. Use `me` to specify the owner of the connected account, although providers do not always report the presence of the ac…',
			),
		account_id: AccountId,
	}),
	usersGetPicture: BinaryFileInput.extend({
		user_id: z.string().min(1),
		account_id: AccountId,
	}),
	usersUpdateProfile: z.object({
		user_id: z
			.string()
			.min(1)
			.describe(
				'The ID of the User to update. Use `me` to update the account owner profile.',
			),
		account_id: AccountId,
		first_name: z
			.string()
			.optional()
			.describe(
				'The first name of the User. Updating this field is not supported by LinkedIn and Instagram.',
			),
		last_name: z
			.string()
			.optional()
			.describe(
				'The last name of the User. Updating this field is not supported by LinkedIn and Instagram.',
			),
		description: z
			.string()
			.optional()
			.describe(
				'Description of the User. Updating this field is not supported by LinkedIn and Instagram.',
			),
		location: z
			.string()
			.optional()
			.describe(
				'Location of the User. Omit it to leave it unchanged. Updating this field is not supported by Instagram.',
			),
		bio: z
			.string()
			.optional()
			.describe(
				'Bio / About section. Omit it to leave it unchanged or use an empty string to clear it.',
			),
		picture: z
			.object({
				content: z
					.string()
					.describe(
						'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
					),
				content_type: z.string().describe('MIME type of the file.'),
				filename: z
					.string()
					.describe('Name of the file (including extension).'),
				metadata: z
					.object({
						duration: z
							.number()
							.optional()
							.describe('Duration of the media file.'),
					})
					.loose()
					.optional()
					.describe('Metadata of the the file.'),
			})
			.optional()
			.describe('A file to be uploaded.'),
		background_picture: z
			.object({
				content: z
					.string()
					.describe(
						'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
					),
				content_type: z.string().describe('MIME type of the file.'),
				filename: z
					.string()
					.describe('Name of the file (including extension).'),
				metadata: z
					.object({
						duration: z
							.number()
							.optional()
							.describe('Duration of the media file.'),
					})
					.loose()
					.optional()
					.describe('Metadata of the the file.'),
			})
			.optional()
			.describe('A file to be uploaded.'),
		specifics: z
			.object({
				linkedin: z
					.object({
						skills: z
							.array(
								z
									.object({
										name: z.string(),
										id: z
											.string()
											.optional()
											.describe(
												'A parameter ID. Use List Search Parameters with `SKILL` type to find out the possible values.',
											),
									})
									.loose(),
							)
							.optional()
							.describe(
								'Skills to add directly to the profile. This field is independent from `experience.skills` and `education.skills`; only send the field that matches the intended target.',
							),
						skills_follow: z
							.boolean()
							.optional()
							.describe(
								'Whether to follow the profile-level skills supplied in `skills`. It does not apply to experience or education skills.',
							),
						postal_code: z
							.string()
							.optional()
							.describe('Postal code associated with the location.'),
						headline: z
							.string()
							.optional()
							.describe(
								'Headline. Omit it to leave it unchanged or use an empty string to clear it.',
							),
						experience: z
							.union([
								z
									.object({
										notify_network: z
											.boolean()
											.optional()
											.describe(
												'Notify the network about the experience. Turn on to notify your network of key profile changes (such as new job) and work anniversaries. Updates can take up to 2 hours.',
											),
										job_title: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
													),
											})
											.loose()
											.describe('Job title of the experience.'),
										employment_type: z
											.string()
											.optional()
											.describe(
												'A parameter ID. Use List Search Parameters with `EMPLOYMENT_TYPE` type to find out the possible values. Employment type of the experience.',
											),
										company: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `COMPANY` type to find out the possible values.',
													),
											})
											.loose()
											.describe('Company of the experience.'),
										location: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `LOCATION` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Location of the experience.'),
										workplace_type: z
											.enum(['ON_SITE', 'HYBRID', 'REMOTE'])
											.optional()
											.describe(
												'The workplace type. Ex: Remote, Hybrid, On-site',
											),
										start_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.describe('The start date of the experience.'),
										end_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.optional()
											.describe('The end date of the experience.'),
										description: z
											.string()
											.optional()
											.describe(
												'Description of the experience. List your major duties and successes, highlighting specific projects.',
											),
										source_of_hire: z
											.enum([
												'INDEED',
												'LINKEDIN',
												'COMPANY_WEBSITE',
												'OTHER_JOB_SITES',
												'REFERRAL',
												'CONTACTED_BY_RECRUITER',
												'STAFFING_AGENCY',
												'OTHER',
											])
											.optional()
											.describe(
												'Where did you find this job? This information will be used to improve LinkedIn’s job search experience.',
											),
										skills: z
											.array(
												z
													.object({
														name: z.unknown(),
														id: z
															.unknown()
															.optional()
															.describe(
																'A parameter ID. Use List Search Parameters with `SKILL` type to find out the possible values.',
															),
													})
													.loose(),
											)
											.optional()
											.describe(
												'Skills to associate with this experience. Use this field only inside `experience`; it is independent from the profile-level and education `skills` fields. These skills also appear in the profile Skills section.',
											),
										media: z
											.union([
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														attachment: z
															.unknown()
															.describe('A file to be uploaded.'),
													})
													.loose(),
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														url: z.unknown().describe('URL of the link.'),
														thumbnail: z
															.unknown()
															.optional()
															.describe('A file to be uploaded.'),
													})
													.loose(),
											])
											.optional(),
										operation: z.enum(['create']),
									})
									.loose(),
								z
									.object({
										notify_network: z
											.boolean()
											.optional()
											.describe(
												'Notify the network about the experience. Turn on to notify your network of key profile changes (such as new job) and work anniversaries. Updates can take up to 2 hours.',
											),
										job_title: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Job title of the experience.'),
										employment_type: z
											.string()
											.optional()
											.describe(
												'A parameter ID. Use List Search Parameters with `EMPLOYMENT_TYPE` type to find out the possible values. Employment type of the experience.',
											),
										company: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `COMPANY` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Company of the experience.'),
										location: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `LOCATION` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Location of the experience.'),
										workplace_type: z
											.enum(['ON_SITE', 'HYBRID', 'REMOTE'])
											.optional()
											.describe(
												'The workplace type. Ex: Remote, Hybrid, On-site',
											),
										start_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.optional()
											.describe('The start date of the experience.'),
										end_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.optional()
											.describe('The end date of the experience.'),
										description: z
											.string()
											.optional()
											.describe(
												'Description of the experience. List your major duties and successes, highlighting specific projects.',
											),
										source_of_hire: z
											.enum([
												'INDEED',
												'LINKEDIN',
												'COMPANY_WEBSITE',
												'OTHER_JOB_SITES',
												'REFERRAL',
												'CONTACTED_BY_RECRUITER',
												'STAFFING_AGENCY',
												'OTHER',
											])
											.optional()
											.describe(
												'Where did you find this job? This information will be used to improve LinkedIn’s job search experience.',
											),
										skills: z
											.array(
												z
													.object({
														name: z.unknown(),
														id: z
															.unknown()
															.optional()
															.describe(
																'A parameter ID. Use List Search Parameters with `SKILL` type to find out the possible values.',
															),
													})
													.loose(),
											)
											.optional()
											.describe(
												'Skills to associate with this experience. Use this field only inside `experience`; it is independent from the profile-level and education `skills` fields. These skills also appear in the profile Skills section.',
											),
										media: z
											.union([
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														attachment: z
															.unknown()
															.describe('A file to be uploaded.'),
													})
													.loose(),
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														url: z.unknown().describe('URL of the link.'),
														thumbnail: z
															.unknown()
															.optional()
															.describe('A file to be uploaded.'),
													})
													.loose(),
											])
											.optional(),
										operation: z.enum(['edit']),
										id: z.string().describe('ID of the experience to edit.'),
									})
									.loose(),
								z
									.object({
										operation: z.enum(['delete']),
										id: z
											.string()
											.min(1)
											.describe('ID of the experience to delete.'),
									})
									.loose(),
							])
							.optional(),
						education: z
							.union([
								z
									.object({
										notify_network: z
											.boolean()
											.optional()
											.describe(
												'Notify the network about the education. Turn on to notify your network of key profile changes (such as new education) and work anniversaries.',
											),
										school: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `SCHOOL` type to find out the possible values.',
													),
											})
											.loose()
											.describe('School of the education.'),
										degree: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `DEGREE` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Degree of the education.'),
										field_of_study: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `FIELD_OF_STUDY` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Field of study of the education.'),
										start_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.describe('The start date of the education.'),
										end_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.optional()
											.describe('The end date of the education.'),
										grade: z
											.string()
											.optional()
											.describe('Grade of the education.'),
										activities: z
											.string()
											.optional()
											.describe(
												'Activities and societies. Ex: Alpha Phi Omega, Marching Brand, Volleyball',
											),
										description: z
											.string()
											.optional()
											.describe('Description of the education.'),
										skills: z
											.array(
												z
													.object({
														name: z.unknown(),
														id: z
															.unknown()
															.optional()
															.describe(
																'A parameter ID. Use List Search Parameters with `SKILL` type to find out the possible values.',
															),
													})
													.loose(),
											)
											.optional()
											.describe(
												'Skills to associate with this education entry. Use this field only inside `education`; it is independent from the profile-level and experience `skills` fields. These skills also appear in the profile Skills section.',
											),
										media: z
											.union([
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														attachment: z
															.unknown()
															.describe('A file to be uploaded.'),
													})
													.loose(),
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														url: z.unknown().describe('URL of the link.'),
														thumbnail: z
															.unknown()
															.optional()
															.describe('A file to be uploaded.'),
													})
													.loose(),
											])
											.optional(),
										operation: z.enum(['create']),
									})
									.loose(),
								z
									.object({
										notify_network: z
											.boolean()
											.optional()
											.describe(
												'Notify the network about the education. Turn on to notify your network of key profile changes (such as new education) and work anniversaries.',
											),
										school: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `SCHOOL` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('School of the education.'),
										degree: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `DEGREE` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Degree of the education.'),
										field_of_study: z
											.object({
												name: z.string(),
												id: z
													.string()
													.optional()
													.describe(
														'A parameter ID. Use List Search Parameters with `FIELD_OF_STUDY` type to find out the possible values.',
													),
											})
											.loose()
											.optional()
											.describe('Field of study of the education.'),
										start_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.optional()
											.describe('The start date of the education.'),
										end_date: z
											.object({
												month: z.number().describe('Month'),
												year: z.number().describe('Year'),
											})
											.loose()
											.optional()
											.describe('The end date of the education.'),
										grade: z
											.string()
											.optional()
											.describe('Grade of the education.'),
										activities: z
											.string()
											.optional()
											.describe(
												'Activities and societies. Ex: Alpha Phi Omega, Marching Brand, Volleyball',
											),
										description: z
											.string()
											.optional()
											.describe('Description of the education.'),
										skills: z
											.array(
												z
													.object({
														name: z.unknown(),
														id: z
															.unknown()
															.optional()
															.describe(
																'A parameter ID. Use List Search Parameters with `SKILL` type to find out the possible values.',
															),
													})
													.loose(),
											)
											.optional()
											.describe(
												'Skills to associate with this education entry. Use this field only inside `education`; it is independent from the profile-level and experience `skills` fields. These skills also appear in the profile Skills section.',
											),
										media: z
											.union([
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														attachment: z
															.unknown()
															.describe('A file to be uploaded.'),
													})
													.loose(),
												z
													.object({
														title: z
															.unknown()
															.optional()
															.describe('Title of the media.'),
														description: z
															.unknown()
															.optional()
															.describe('Description of the media.'),
														type: z.unknown(),
														url: z.unknown().describe('URL of the link.'),
														thumbnail: z
															.unknown()
															.optional()
															.describe('A file to be uploaded.'),
													})
													.loose(),
											])
											.optional(),
										operation: z.enum(['edit']),
										id: z.string().describe('ID of the education to edit.'),
									})
									.loose(),
								z
									.object({
										operation: z.enum(['delete']),
										id: z
											.string()
											.min(1)
											.describe('ID of the education to delete.'),
									})
									.loose(),
							])
							.optional(),
						picture_options: z
							.object({
								filter: z
									.enum([
										'original',
										'studio',
										'spotlight',
										'prime',
										'classic',
										'edge',
										'luminate',
									])
									.optional()
									.describe('A visual filter to be applied to the picture.'),
								layout: z
									.object({
										bottom_left: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
										bottom_right: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
										top_left: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
										top_right: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
									})
									.loose()
									.optional()
									.describe(
										'A list of spatial coordinates to manage picture positionning.',
									),
								contrast: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of contrast.'),
								vignette: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of vignetting.'),
								saturation: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of saturation.'),
								brightness: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of brightness.'),
							})
							.loose()
							.optional(),
						background_picture_options: z
							.object({
								filter: z
									.enum([
										'original',
										'studio',
										'spotlight',
										'prime',
										'classic',
										'edge',
										'luminate',
									])
									.optional()
									.describe('A visual filter to be applied to the picture.'),
								layout: z
									.object({
										bottom_left: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
										bottom_right: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
										top_left: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
										top_right: z
											.object({
												x: z
													.number()
													.describe(
														'The position of the corner on the `x` axis.',
													),
												y: z
													.number()
													.describe(
														'The position of the corner on the `y` axis.',
													),
											})
											.loose()
											.optional(),
									})
									.loose()
									.optional()
									.describe(
										'A list of spatial coordinates to manage picture positionning.',
									),
								contrast: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of contrast.'),
								vignette: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of vignetting.'),
								saturation: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of saturation.'),
								brightness: z
									.number()
									.min(-0.3)
									.max(0.3)
									.optional()
									.describe('The level of brightness.'),
							})
							.loose()
							.optional(),
						custom_link: z
							.object({
								type: z
									.enum(['STORE', 'WEBSITE', 'PORTFOLIO', 'BLOG', 'NEWSLETTER'])
									.describe('The type of link.'),
								url: z.string().describe('The URL of the link.'),
								display_on: z
									.enum(['PROFILE_ONLY', 'EVERYWHERE'])
									.optional()
									.describe(
										'Whether the link should be displayed everywhere or only on the profile.',
									),
							})
							.loose()
							.nullable()
							.optional(),
						open_to_work: z
							.object({
								job_title: z
									.array(
										z
											.object({
												title: z.string().describe('The title of the job.'),
												id: z
													.string()
													.describe(
														'A parameter ID. Use List Search Parameters with `JOB_TITLE` type to find out the possible values.',
													),
											})
											.loose(),
									)
									.describe('A list of job titles you would like to hold.'),
								workplace: z
									.array(
										z
											.object({
												type: z
													.enum(['ON_SITE', 'HYBRID', 'REMOTE'])
													.describe('The type of workplace.'),
												location: z
													.array(z.unknown())
													.describe(
														'A list of parameter IDs. Use List Search Parameters with `LOCATION` type to find out the possible values.',
													),
											})
											.loose(),
									)
									.describe('A list of desired workplaces.'),
								start_date: z
									.enum(['IMMEDIATELY', 'FLEXIBLE'])
									.optional()
									.describe('The timeframe by which you would like to start.'),
								employment_type: z
									.array(
										z.enum([
											'FULL_TIME',
											'PART_TIME',
											'CONTRACT',
											'INTERNSHIP',
											'TEMPORARY',
										]),
									)
									.optional()
									.describe('A list of employment types.'),
								visibility: z
									.enum(['ALL', 'RECRUITERS_ONLY'])
									.describe('Who can view that you are open to work.'),
							})
							.loose()
							.nullable()
							.optional(),
					})
					.loose()
					.optional()
					.describe(
						'LinkedIn profile mutations. Omitted properties remain unchanged; values replace existing values; empty strings clear supported text fields; null deletes nullable singleton resources.',
					),
			})
			.loose()
			.optional(),
	}),
	usersRemoveRelation: z.object({
		user_id: z
			.string()
			.min(1)
			.describe('The ID of the User to delete the relation with.'),
		account_id: AccountId,
	}),
	usersListFollowers: z.object({
		user_id: z
			.string()
			.min(1)
			.describe(
				'The ID of the User to get the followers from. Use `me` to get the followers of the account owner.',
			),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	usersListFollowing: z.object({
		user_id: z
			.string()
			.min(1)
			.describe(
				'The ID of the User to get the followed users from. Use `me` to get the followed users of the account owner.',
			),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	usersFollow: z.object({
		user_id: z.string().min(1).describe('The ID of the User to follow.'),
		account_id: AccountId,
	}),
	usersUnfollow: z.object({
		user_id: z.string().min(1).describe('The ID of the User to unfollow.'),
		account_id: AccountId,
	}),
} as const;

export const UsersOutputSchemas = {
	usersSetPresence: z.object({ object: z.string() }).loose(),
	usersGetPresence: z
		.object({
			object: z.string(),
			user_id: z
				.string()
				.describe('The ID of the User this presence belongs to.'),
			presence: z
				.string()
				.describe(
					'Whether the user is currently connected to the provider. - `online` if the user is connected right now. - `offline` if the user is not connected.',
				),
			last_online_at: z
				.string()
				.nullish()
				.describe(
					'Date and time when the user was last online. Only set when the user is offline and the provider exposes the exact date.',
				),
			provider: z
				.string()
				.describe(
					"The provider's of the Account. - `mock` is mock. - `whatsapp` is WhatsApp. - `linkedin` is LinkedIn. - `instagram` is Instagram. - `google` is Google.",
				),
		})
		.loose(),
	usersGetPicture: BinaryFileSchema,
	usersUpdateProfile: z.object({ object: z.string() }).loose(),
	usersRemoveRelation: NoContentSchema,
	usersListFollowers: UsersListFollowersShape2,
	usersListFollowing: UsersListFollowersShape2,
	usersFollow: z
		.object({
			object: z.string().nullish(),
			type: z
				.string()
				.nullish()
				.describe(
					'Type of the relation / follow request. - `sent` if the current user has asked another one to be in his relations.',
				),
			id: z
				.string()
				.nullish()
				.describe('The unique identifier of the invitation for the provider.'),
			created_at: z
				.string()
				.nullish()
				.describe('Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).'),
			message: z
				.string()
				.nullish()
				.describe('Any message that comes with the invitation.'),
			user: z
				.object({
					id: z
						.string()
						.describe(
							'Unique identifier of the user for the provider. Usually an internal identifier used by the API only.',
						),
					object: z.string(),
					type: z
						.string()
						.describe(
							'Type of the user - `individual` is an individual user. - `organization` is an organization / business entity. - `other` is an other type of entity.',
						),
					public_identifier: z
						.string()
						.nullish()
						.describe(
							'Public identifier of the user for the provider. Usually a shareable tag visible in urls and profiles.',
						),
					display_name: z
						.string()
						.describe('Display name of the user as exposed by the provider.'),
					first_name: z.string().nullish().describe('First name of the user.'),
					last_name: z.string().nullish().describe('Last name of the user.'),
					profile_url: z
						.string()
						.nullish()
						.describe('Public url to the profile of the user.'),
					public_picture_url: z
						.string()
						.nullish()
						.describe('Public url to the profile picture of the user.'),
					private_picture_download_url: z
						.string()
						.nullish()
						.describe(
							'Private url to download the profile picture of the user. This url require authentication.',
						),
					description: z
						.string()
						.nullish()
						.describe('Description of the user.'),
					specifics: z
						.object({
							contact_name: z.string().nullish(),
							messaging_identifier: z.string().nullish(),
							location: z.string().nullish(),
							network_distance: z.string().nullish(),
							industry: z.string().nullish(),
							is_following: z.boolean().nullish(),
							followers_count: z.number().nullish(),
							relations_count: z.number().nullish(),
							shared_relations_count: z.number().nullish(),
							website_url: z.string().nullish(),
							portfolio_url: z.string().nullish(),
							services_page_url: z.string().nullish(),
							is_premium: z.boolean().nullish(),
							is_verified: z.boolean().nullish(),
						})
						.loose()
						.nullish()
						.describe('Object containing provider-specific user profile data.'),
				})
				.loose()
				.nullish()
				.describe(
					'The user who is the target of the relation / follow request.',
				),
		})
		.loose(),
	usersUnfollow: z.object({ object: z.string() }).loose(),
} as const;
