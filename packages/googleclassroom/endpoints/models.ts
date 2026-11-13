import { z } from 'zod';

const CloudPubsubTopicSchema = z
	.object({
		topicName: z
			.string()
			.describe(
				'The `name` field of a Cloud Pub/Sub [Topic](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics#Topic).',
			)
			.optional()
			.describe(
				'The `name` field of a Cloud Pub/Sub [Topic](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics#Topic).',
			),
	})
	.strict();
const CloudPubsubTopicResponseSchema = z
	.object({
		topicName: z
			.string()
			.describe(
				'The `name` field of a Cloud Pub/Sub [Topic](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics#Topic).',
			)
			.optional()
			.describe(
				'The `name` field of a Cloud Pub/Sub [Topic](https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics#Topic).',
			),
	})
	.strict();

const DriveFolderSchema = z
	.object({
		title: z
			.string()
			.describe('Title of the Drive folder. Read-only.')
			.optional()
			.describe('Title of the Drive folder. Read-only.'),
		alternateLink: z
			.string()
			.describe('URL that can be used to access the Drive folder. Read-only.')
			.optional()
			.describe('URL that can be used to access the Drive folder. Read-only.'),
		id: z
			.string()
			.describe('Drive API resource ID.')
			.optional()
			.describe('Drive API resource ID.'),
	})
	.strict();
const DriveFolderResponseSchema = z
	.object({
		title: z
			.string()
			.describe('Title of the Drive folder. Read-only.')
			.optional()
			.describe('Title of the Drive folder. Read-only.'),
		alternateLink: z
			.string()
			.describe('URL that can be used to access the Drive folder. Read-only.')
			.optional()
			.describe('URL that can be used to access the Drive folder. Read-only.'),
		id: z
			.string()
			.describe('Drive API resource ID.')
			.optional()
			.describe('Drive API resource ID.'),
	})
	.strict();

const AssignmentSchema = z
	.object({
		studentWorkFolder: DriveFolderSchema.optional().describe(
			'Drive folder where attachments from student submissions are placed. This is only populated for course teachers and administrators.',
		),
	})
	.strict();
const AssignmentResponseSchema = z
	.object({
		studentWorkFolder: DriveFolderResponseSchema.optional().describe(
			'Drive folder where attachments from student submissions are placed. This is only populated for course teachers and administrators.',
		),
	})
	.strict();

const GeminiGemSchema = z
	.object({
		id: z
			.string()
			.describe('Gems resource id.')
			.optional()
			.describe('Gems resource id.'),
		url: z
			.string()
			.describe('URL that can be used to access the Gem.')
			.optional()
			.describe('URL that can be used to access the Gem.'),
		title: z
			.string()
			.describe('Title of the Gem.')
			.optional()
			.describe('Title of the Gem.'),
	})
	.strict();
const GeminiGemResponseSchema = z
	.object({
		id: z
			.string()
			.describe('Gems resource id.')
			.optional()
			.describe('Gems resource id.'),
		url: z
			.string()
			.describe('URL that can be used to access the Gem.')
			.optional()
			.describe('URL that can be used to access the Gem.'),
		title: z
			.string()
			.describe('Title of the Gem.')
			.optional()
			.describe('Title of the Gem.'),
	})
	.strict();

const YouTubeVideoSchema = z
	.object({
		id: z
			.string()
			.describe('YouTube API resource ID.')
			.optional()
			.describe('YouTube API resource ID.'),
		title: z
			.string()
			.describe('Title of the YouTube video. Read-only.')
			.optional()
			.describe('Title of the YouTube video. Read-only.'),
		alternateLink: z
			.string()
			.describe('URL that can be used to view the YouTube video. Read-only.')
			.optional()
			.describe('URL that can be used to view the YouTube video. Read-only.'),
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the YouTube video. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the YouTube video. Read-only.'),
	})
	.strict();
const YouTubeVideoResponseSchema = z
	.object({
		id: z
			.string()
			.describe('YouTube API resource ID.')
			.optional()
			.describe('YouTube API resource ID.'),
		title: z
			.string()
			.describe('Title of the YouTube video. Read-only.')
			.optional()
			.describe('Title of the YouTube video. Read-only.'),
		alternateLink: z
			.string()
			.describe('URL that can be used to view the YouTube video. Read-only.')
			.optional()
			.describe('URL that can be used to view the YouTube video. Read-only.'),
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the YouTube video. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the YouTube video. Read-only.'),
	})
	.strict();

const FormSchema = z
	.object({
		title: z
			.string()
			.describe('Title of the Form. Read-only.')
			.optional()
			.describe('Title of the Form. Read-only.'),
		formUrl: z
			.string()
			.describe('URL of the form.')
			.optional()
			.describe('URL of the form.'),
		responseUrl: z
			.string()
			.describe(
				'URL of the form responses document. Only set if responses have been recorded and only when the requesting user is an editor of the form. Read-only.',
			)
			.optional()
			.describe(
				'URL of the form responses document. Only set if responses have been recorded and only when the requesting user is an editor of the form. Read-only.',
			),
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the Form. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the Form. Read-only.'),
	})
	.strict();
const FormResponseSchema = z
	.object({
		title: z
			.string()
			.describe('Title of the Form. Read-only.')
			.optional()
			.describe('Title of the Form. Read-only.'),
		formUrl: z
			.string()
			.describe('URL of the form.')
			.optional()
			.describe('URL of the form.'),
		responseUrl: z
			.string()
			.describe(
				'URL of the form responses document. Only set if responses have been recorded and only when the requesting user is an editor of the form. Read-only.',
			)
			.optional()
			.describe(
				'URL of the form responses document. Only set if responses have been recorded and only when the requesting user is an editor of the form. Read-only.',
			),
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the Form. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the Form. Read-only.'),
	})
	.strict();

const DriveFileSchema = z
	.object({
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the Drive item. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the Drive item. Read-only.'),
		alternateLink: z
			.string()
			.describe('URL that can be used to access the Drive item. Read-only.')
			.optional()
			.describe('URL that can be used to access the Drive item. Read-only.'),
		id: z
			.string()
			.describe('Drive API resource ID.')
			.optional()
			.describe('Drive API resource ID.'),
		title: z
			.string()
			.describe('Title of the Drive item. Read-only.')
			.optional()
			.describe('Title of the Drive item. Read-only.'),
	})
	.strict();
const DriveFileResponseSchema = z
	.object({
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the Drive item. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the Drive item. Read-only.'),
		alternateLink: z
			.string()
			.describe('URL that can be used to access the Drive item. Read-only.')
			.optional()
			.describe('URL that can be used to access the Drive item. Read-only.'),
		id: z
			.string()
			.describe('Drive API resource ID.')
			.optional()
			.describe('Drive API resource ID.'),
		title: z
			.string()
			.describe('Title of the Drive item. Read-only.')
			.optional()
			.describe('Title of the Drive item. Read-only.'),
	})
	.strict();

const SharedDriveFileSchema = z
	.object({
		driveFile: DriveFileSchema.optional().describe('Drive file details.'),
		shareMode: z
			.enum(['UNKNOWN_SHARE_MODE', 'VIEW', 'EDIT', 'STUDENT_COPY'])
			.optional()
			.describe('Mechanism by which students access the Drive item.'),
	})
	.strict();
const SharedDriveFileResponseSchema = z
	.object({
		driveFile: DriveFileResponseSchema.optional().describe(
			'Drive file details.',
		),
		shareMode: z
			.enum(['UNKNOWN_SHARE_MODE', 'VIEW', 'EDIT', 'STUDENT_COPY'])
			.optional()
			.describe('Mechanism by which students access the Drive item.'),
	})
	.strict();

const NotebookLmNotebookSchema = z
	.object({
		url: z
			.string()
			.describe('URL that can be used to access the Notebook.')
			.optional()
			.describe('URL that can be used to access the Notebook.'),
		id: z
			.string()
			.describe('Notebook resource id.')
			.optional()
			.describe('Notebook resource id.'),
		title: z
			.string()
			.describe('Title of the Notebook.')
			.optional()
			.describe('Title of the Notebook.'),
	})
	.strict();
const NotebookLmNotebookResponseSchema = z
	.object({
		url: z
			.string()
			.describe('URL that can be used to access the Notebook.')
			.optional()
			.describe('URL that can be used to access the Notebook.'),
		id: z
			.string()
			.describe('Notebook resource id.')
			.optional()
			.describe('Notebook resource id.'),
		title: z
			.string()
			.describe('Title of the Notebook.')
			.optional()
			.describe('Title of the Notebook.'),
	})
	.strict();

const LinkSchema = z
	.object({
		url: z
			.string()
			.describe(
				'URL to link to. This must be a valid UTF-8 string containing between 1 and 2024 characters.',
			)
			.optional()
			.describe(
				'URL to link to. This must be a valid UTF-8 string containing between 1 and 2024 characters.',
			),
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the target URL. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the target URL. Read-only.'),
		title: z
			.string()
			.describe('Title of the target of the URL. Read-only.')
			.optional()
			.describe('Title of the target of the URL. Read-only.'),
	})
	.strict();
const LinkResponseSchema = z
	.object({
		url: z
			.string()
			.describe(
				'URL to link to. This must be a valid UTF-8 string containing between 1 and 2024 characters.',
			)
			.optional()
			.describe(
				'URL to link to. This must be a valid UTF-8 string containing between 1 and 2024 characters.',
			),
		thumbnailUrl: z
			.string()
			.describe('URL of a thumbnail image of the target URL. Read-only.')
			.optional()
			.describe('URL of a thumbnail image of the target URL. Read-only.'),
		title: z
			.string()
			.describe('Title of the target of the URL. Read-only.')
			.optional()
			.describe('Title of the target of the URL. Read-only.'),
	})
	.strict();

const MaterialSchema = z
	.object({
		gem: GeminiGemSchema.optional().describe('Gemini Gem material. Read-only.'),
		youtubeVideo: YouTubeVideoSchema.optional().describe(
			'YouTube video material.',
		),
		form: FormSchema.optional().describe('Google Forms material. Read-only.'),
		driveFile: SharedDriveFileSchema.optional().describe(
			'Google Drive file material.',
		),
		notebook: NotebookLmNotebookSchema.optional().describe(
			'NotebookLM Notebook material. Read-only.',
		),
		link: LinkSchema.optional().describe(
			'Link material. On creation, this is upgraded to a more appropriate type if possible, and this is reflected in the response.',
		),
	})
	.strict();
const MaterialResponseSchema = z
	.object({
		gem: GeminiGemResponseSchema.optional().describe(
			'Gemini Gem material. Read-only.',
		),
		youtubeVideo: YouTubeVideoResponseSchema.optional().describe(
			'YouTube video material.',
		),
		form: FormResponseSchema.optional().describe(
			'Google Forms material. Read-only.',
		),
		driveFile: SharedDriveFileResponseSchema.optional().describe(
			'Google Drive file material.',
		),
		notebook: NotebookLmNotebookResponseSchema.optional().describe(
			'NotebookLM Notebook material. Read-only.',
		),
		link: LinkResponseSchema.optional().describe(
			'Link material. On creation, this is upgraded to a more appropriate type if possible, and this is reflected in the response.',
		),
	})
	.strict();

const IndividualStudentsOptionsSchema = z
	.object({
		studentIds: z
			.array(z.string())
			.optional()
			.describe(
				'Identifiers for the students that have access to the coursework/announcement.',
			),
	})
	.strict();
const IndividualStudentsOptionsResponseSchema = z
	.object({
		studentIds: z
			.array(z.string())
			.optional()
			.describe(
				'Identifiers for the students that have access to the coursework/announcement.',
			),
	})
	.strict();

const AnnouncementSchema = z
	.object({
		materials: z
			.array(MaterialSchema)
			.optional()
			.describe(
				'Additional materials. Announcements must have no more than 20 material items.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Assignee mode of the announcement. If unspecified, the default value is `ALL_STUDENTS`.',
			),
		scheduledTime: z
			.string()
			.describe(
				'Optional timestamp when this announcement is scheduled to be published.',
			)
			.optional()
			.describe(
				'Optional timestamp when this announcement is scheduled to be published.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier of this announcement, unique per course. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier of this announcement, unique per course. Read-only.',
			),
		individualStudentsOptions:
			IndividualStudentsOptionsSchema.optional().describe(
				'Identifiers of students with access to the announcement. This field is set only if `assigneeMode` is `INDIVIDUAL_STUDENTS`. If the `assigneeMode` is `INDIVIDUAL_STUDENTS`, then only students specified in this field can see the announcement.',
			),
		creationTime: z
			.string()
			.describe('Timestamp when this announcement was created. Read-only.')
			.optional()
			.describe('Timestamp when this announcement was created. Read-only.'),
		updateTime: z
			.string()
			.describe(
				'Timestamp of the most recent change to this announcement. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp of the most recent change to this announcement. Read-only.',
			),
		state: z
			.enum(['ANNOUNCEMENT_STATE_UNSPECIFIED', 'PUBLISHED', 'DRAFT', 'DELETED'])
			.optional()
			.describe(
				'Status of this announcement. If unspecified, the default state is `DRAFT`.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this announcement in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this announcement in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			),
		creatorUserId: z
			.string()
			.describe(
				'Identifier for the user that created the announcement. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the user that created the announcement. Read-only.',
			),
		text: z
			.string()
			.describe(
				'Description of this announcement. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			)
			.optional()
			.describe(
				'Description of this announcement. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			),
	})
	.strict();
const AnnouncementResponseSchema = z
	.object({
		materials: z
			.array(MaterialResponseSchema)
			.optional()
			.describe(
				'Additional materials. Announcements must have no more than 20 material items.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Assignee mode of the announcement. If unspecified, the default value is `ALL_STUDENTS`.',
			),
		scheduledTime: z
			.string()
			.describe(
				'Optional timestamp when this announcement is scheduled to be published.',
			)
			.optional()
			.describe(
				'Optional timestamp when this announcement is scheduled to be published.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier of this announcement, unique per course. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier of this announcement, unique per course. Read-only.',
			),
		individualStudentsOptions:
			IndividualStudentsOptionsResponseSchema.optional().describe(
				'Identifiers of students with access to the announcement. This field is set only if `assigneeMode` is `INDIVIDUAL_STUDENTS`. If the `assigneeMode` is `INDIVIDUAL_STUDENTS`, then only students specified in this field can see the announcement.',
			),
		creationTime: z
			.string()
			.describe('Timestamp when this announcement was created. Read-only.')
			.optional()
			.describe('Timestamp when this announcement was created. Read-only.'),
		updateTime: z
			.string()
			.describe(
				'Timestamp of the most recent change to this announcement. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp of the most recent change to this announcement. Read-only.',
			),
		state: z
			.enum(['ANNOUNCEMENT_STATE_UNSPECIFIED', 'PUBLISHED', 'DRAFT', 'DELETED'])
			.optional()
			.describe(
				'Status of this announcement. If unspecified, the default state is `DRAFT`.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this announcement in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this announcement in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			),
		creatorUserId: z
			.string()
			.describe(
				'Identifier for the user that created the announcement. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the user that created the announcement. Read-only.',
			),
		text: z
			.string()
			.describe(
				'Description of this announcement. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			)
			.optional()
			.describe(
				'Description of this announcement. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			),
	})
	.strict();

const TimeOfDaySchema = z
	.object({
		hours: z
			.number()
			.int()
			.describe(
				'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
			)
			.optional()
			.describe(
				'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
			),
		minutes: z
			.number()
			.int()
			.describe(
				'Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.',
			)
			.optional()
			.describe(
				'Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.',
			),
		seconds: z
			.number()
			.int()
			.describe(
				'Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.',
			)
			.optional()
			.describe(
				'Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.',
			),
		nanos: z
			.number()
			.int()
			.describe(
				'Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.',
			)
			.optional()
			.describe(
				'Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.',
			),
	})
	.strict();
const TimeOfDayResponseSchema = z
	.object({
		hours: z
			.number()
			.int()
			.describe(
				'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
			)
			.optional()
			.describe(
				'Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.',
			),
		minutes: z
			.number()
			.int()
			.describe(
				'Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.',
			)
			.optional()
			.describe(
				'Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.',
			),
		seconds: z
			.number()
			.int()
			.describe(
				'Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.',
			)
			.optional()
			.describe(
				'Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.',
			),
		nanos: z
			.number()
			.int()
			.describe(
				'Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.',
			)
			.optional()
			.describe(
				'Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.',
			),
	})
	.strict();

const ModifyIndividualStudentsOptionsSchema = z
	.object({
		removeStudentIds: z
			.array(z.string())
			.optional()
			.describe(
				'IDs of students to be removed from having access to this coursework/announcement.',
			),
		addStudentIds: z
			.array(z.string())
			.optional()
			.describe(
				'IDs of students to be added as having access to this coursework/announcement.',
			),
	})
	.strict();
const ModifyIndividualStudentsOptionsResponseSchema = z
	.object({
		removeStudentIds: z
			.array(z.string())
			.optional()
			.describe(
				'IDs of students to be removed from having access to this coursework/announcement.',
			),
		addStudentIds: z
			.array(z.string())
			.optional()
			.describe(
				'IDs of students to be added as having access to this coursework/announcement.',
			),
	})
	.strict();

const ModifyAnnouncementAssigneesRequestSchema = z
	.object({
		modifyIndividualStudentsOptions:
			ModifyIndividualStudentsOptionsSchema.optional().describe(
				'Set which students can view or cannot view the announcement. Must be specified only when `assigneeMode` is `INDIVIDUAL_STUDENTS`.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Mode of the announcement describing whether it is accessible by all students or specified individual students.',
			),
	})
	.strict();
const ModifyAnnouncementAssigneesRequestResponseSchema = z
	.object({
		modifyIndividualStudentsOptions:
			ModifyIndividualStudentsOptionsResponseSchema.optional().describe(
				'Set which students can view or cannot view the announcement. Must be specified only when `assigneeMode` is `INDIVIDUAL_STUDENTS`.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Mode of the announcement describing whether it is accessible by all students or specified individual students.',
			),
	})
	.strict();

const ReclaimStudentSubmissionRequestSchema = z.object({}).strict();
const ReclaimStudentSubmissionRequestResponseSchema = z.object({}).strict();

const NameSchema = z
	.object({
		fullName: z
			.string()
			.describe(
				"The user's full name formed by concatenating the first and last name values. Read-only.",
			)
			.optional()
			.describe(
				"The user's full name formed by concatenating the first and last name values. Read-only.",
			),
		familyName: z
			.string()
			.describe("The user's last name. Read-only.")
			.optional()
			.describe("The user's last name. Read-only."),
		givenName: z
			.string()
			.describe("The user's first name. Read-only.")
			.optional()
			.describe("The user's first name. Read-only."),
	})
	.strict();
const NameResponseSchema = z
	.object({
		fullName: z
			.string()
			.describe(
				"The user's full name formed by concatenating the first and last name values. Read-only.",
			)
			.optional()
			.describe(
				"The user's full name formed by concatenating the first and last name values. Read-only.",
			),
		familyName: z
			.string()
			.describe("The user's last name. Read-only.")
			.optional()
			.describe("The user's last name. Read-only."),
		givenName: z
			.string()
			.describe("The user's first name. Read-only.")
			.optional()
			.describe("The user's first name. Read-only."),
	})
	.strict();

const GlobalPermissionSchema = z
	.object({
		permission: z
			.enum(['PERMISSION_UNSPECIFIED', 'CREATE_COURSE'])
			.optional()
			.describe('Permission value.'),
	})
	.strict();
const GlobalPermissionResponseSchema = z
	.object({
		permission: z
			.enum(['PERMISSION_UNSPECIFIED', 'CREATE_COURSE'])
			.optional()
			.describe('Permission value.'),
	})
	.strict();

const UserProfileSchema = z
	.object({
		name: NameSchema.optional().describe('Name of the user. Read-only.'),
		id: z
			.string()
			.describe('Identifier of the user. Read-only.')
			.optional()
			.describe('Identifier of the user. Read-only.'),
		photoUrl: z
			.string()
			.describe(
				"URL of user's profile photo. Must request `https://www.googleapis.com/auth/classroom.profile.photos` scope for this field to be populated in a response body. Read-only.",
			)
			.optional()
			.describe(
				"URL of user's profile photo. Must request `https://www.googleapis.com/auth/classroom.profile.photos` scope for this field to be populated in a response body. Read-only.",
			),
		permissions: z
			.array(GlobalPermissionSchema)
			.optional()
			.describe('Global permissions of the user. Read-only.'),
		emailAddress: z
			.string()
			.describe(
				'Email address of the user. Must request `https://www.googleapis.com/auth/classroom.profile.emails` scope for this field to be populated in a response body. Read-only.',
			)
			.optional()
			.describe(
				'Email address of the user. Must request `https://www.googleapis.com/auth/classroom.profile.emails` scope for this field to be populated in a response body. Read-only.',
			),
		verifiedTeacher: z
			.boolean()
			.describe(
				"Represents whether a Google Workspace for Education user's domain administrator has explicitly verified them as being a teacher. This field is always false if the user is not a member of a Google Workspace for Education domain. Read-only",
			)
			.optional()
			.describe(
				"Represents whether a Google Workspace for Education user's domain administrator has explicitly verified them as being a teacher. This field is always false if the user is not a member of a Google Workspace for Education domain. Read-only",
			),
	})
	.strict();
const UserProfileResponseSchema = z
	.object({
		name: NameResponseSchema.optional().describe(
			'Name of the user. Read-only.',
		),
		id: z
			.string()
			.describe('Identifier of the user. Read-only.')
			.optional()
			.describe('Identifier of the user. Read-only.'),
		photoUrl: z
			.string()
			.describe(
				"URL of user's profile photo. Must request `https://www.googleapis.com/auth/classroom.profile.photos` scope for this field to be populated in a response body. Read-only.",
			)
			.optional()
			.describe(
				"URL of user's profile photo. Must request `https://www.googleapis.com/auth/classroom.profile.photos` scope for this field to be populated in a response body. Read-only.",
			),
		permissions: z
			.array(GlobalPermissionResponseSchema)
			.optional()
			.describe('Global permissions of the user. Read-only.'),
		emailAddress: z
			.string()
			.describe(
				'Email address of the user. Must request `https://www.googleapis.com/auth/classroom.profile.emails` scope for this field to be populated in a response body. Read-only.',
			)
			.optional()
			.describe(
				'Email address of the user. Must request `https://www.googleapis.com/auth/classroom.profile.emails` scope for this field to be populated in a response body. Read-only.',
			),
		verifiedTeacher: z
			.boolean()
			.describe(
				"Represents whether a Google Workspace for Education user's domain administrator has explicitly verified them as being a teacher. This field is always false if the user is not a member of a Google Workspace for Education domain. Read-only",
			)
			.optional()
			.describe(
				"Represents whether a Google Workspace for Education user's domain administrator has explicitly verified them as being a teacher. This field is always false if the user is not a member of a Google Workspace for Education domain. Read-only",
			),
	})
	.strict();

const StudentSchema = z
	.object({
		studentWorkFolder: DriveFolderSchema.optional().describe(
			"Information about a Drive Folder for this student's work in this course. Only visible to the student and domain administrators. Read-only.",
		),
		userId: z
			.string()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			)
			.optional()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			),
		profile: UserProfileSchema.optional().describe(
			'Global user information for the student. Read-only.',
		),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
	})
	.strict();
const StudentResponseSchema = z
	.object({
		studentWorkFolder: DriveFolderResponseSchema.optional().describe(
			"Information about a Drive Folder for this student's work in this course. Only visible to the student and domain administrators. Read-only.",
		),
		userId: z
			.string()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			)
			.optional()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			),
		profile: UserProfileResponseSchema.optional().describe(
			'Global user information for the student. Read-only.',
		),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
	})
	.strict();

const ListStudentsResponseSchema = z
	.object({
		students: z
			.array(StudentSchema)
			.optional()
			.describe('Students who match the list request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListStudentsResponseResponseSchema = z
	.object({
		students: z
			.array(StudentResponseSchema)
			.optional()
			.describe('Students who match the list request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const AddOnAttachmentStudentSubmissionSchema = z
	.object({
		postSubmissionState: z
			.enum([
				'SUBMISSION_STATE_UNSPECIFIED',
				'NEW',
				'CREATED',
				'TURNED_IN',
				'RETURNED',
				'RECLAIMED_BY_STUDENT',
			])
			.optional()
			.describe(
				"Submission state of add-on attachment's parent post (i.e. assignment).",
			),
		pointsEarned: z
			.number()
			.describe('Student grade on this attachment. If unset, no grade was set.')
			.optional()
			.describe(
				'Student grade on this attachment. If unset, no grade was set.',
			),
		courseWorkSubmissionId: z
			.string()
			.describe(
				'Output only. Identifier of the course work submission under which this attachment submission was made.',
			)
			.optional()
			.describe(
				'Output only. Identifier of the course work submission under which this attachment submission was made.',
			),
		userId: z
			.string()
			.describe(
				'Identifier for the student that owns this submission. Requires the user to be a teacher in the course and have permission to read student submissions. See [`courseWork.studentSubmissions.get`](/workspace/classroom/reference/rest/v1/courses.courseWork.studentSubmissions/get#authorization-scopes) for the list of acceptable OAuth scopes for this field. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the student that owns this submission. Requires the user to be a teacher in the course and have permission to read student submissions. See [`courseWork.studentSubmissions.get`](/workspace/classroom/reference/rest/v1/courses.courseWork.studentSubmissions/get#authorization-scopes) for the list of acceptable OAuth scopes for this field. Read-only.',
			),
		id: z
			.string()
			.describe(
				'Output only. Classroom-assigned identifier for this student submission. This is unique among submissions for the relevant course work and add-on attachment combination.',
			)
			.optional()
			.describe(
				'Output only. Classroom-assigned identifier for this student submission. This is unique among submissions for the relevant course work and add-on attachment combination.',
			),
	})
	.strict();
const AddOnAttachmentStudentSubmissionResponseSchema = z
	.object({
		postSubmissionState: z
			.enum([
				'SUBMISSION_STATE_UNSPECIFIED',
				'NEW',
				'CREATED',
				'TURNED_IN',
				'RETURNED',
				'RECLAIMED_BY_STUDENT',
			])
			.optional()
			.describe(
				"Submission state of add-on attachment's parent post (i.e. assignment).",
			),
		pointsEarned: z
			.number()
			.describe('Student grade on this attachment. If unset, no grade was set.')
			.optional()
			.describe(
				'Student grade on this attachment. If unset, no grade was set.',
			),
		courseWorkSubmissionId: z
			.string()
			.describe(
				'Output only. Identifier of the course work submission under which this attachment submission was made.',
			)
			.optional()
			.describe(
				'Output only. Identifier of the course work submission under which this attachment submission was made.',
			),
		userId: z
			.string()
			.describe(
				'Identifier for the student that owns this submission. Requires the user to be a teacher in the course and have permission to read student submissions. See [`courseWork.studentSubmissions.get`](/workspace/classroom/reference/rest/v1/courses.courseWork.studentSubmissions/get#authorization-scopes) for the list of acceptable OAuth scopes for this field. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the student that owns this submission. Requires the user to be a teacher in the course and have permission to read student submissions. See [`courseWork.studentSubmissions.get`](/workspace/classroom/reference/rest/v1/courses.courseWork.studentSubmissions/get#authorization-scopes) for the list of acceptable OAuth scopes for this field. Read-only.',
			),
		id: z
			.string()
			.describe(
				'Output only. Classroom-assigned identifier for this student submission. This is unique among submissions for the relevant course work and add-on attachment combination.',
			)
			.optional()
			.describe(
				'Output only. Classroom-assigned identifier for this student submission. This is unique among submissions for the relevant course work and add-on attachment combination.',
			),
	})
	.strict();

const ListAddOnAttachmentStudentSubmissionsResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			)
			.optional()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			),
		addOnAttachmentStudentSubmissions: z
			.array(AddOnAttachmentStudentSubmissionSchema)
			.optional()
			.describe(
				'Add-on attachment student submissions that match the request.',
			),
	})
	.strict();
const ListAddOnAttachmentStudentSubmissionsResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			)
			.optional()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			),
		addOnAttachmentStudentSubmissions: z
			.array(AddOnAttachmentStudentSubmissionResponseSchema)
			.optional()
			.describe(
				'Add-on attachment student submissions that match the request.',
			),
	})
	.strict();

const DateSchema = z
	.object({
		year: z
			.number()
			.int()
			.describe(
				'Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.',
			)
			.optional()
			.describe(
				'Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.',
			),
		month: z
			.number()
			.int()
			.describe(
				'Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.',
			)
			.optional()
			.describe(
				'Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.',
			),
		day: z
			.number()
			.int()
			.describe(
				"Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
			)
			.optional()
			.describe(
				"Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
			),
	})
	.strict();
const DateResponseSchema = z
	.object({
		year: z
			.number()
			.int()
			.describe(
				'Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.',
			)
			.optional()
			.describe(
				'Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.',
			),
		month: z
			.number()
			.int()
			.describe(
				'Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.',
			)
			.optional()
			.describe(
				'Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.',
			),
		day: z
			.number()
			.int()
			.describe(
				"Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
			)
			.optional()
			.describe(
				"Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
			),
	})
	.strict();

const GradingPeriodSchema = z
	.object({
		endDate: DateSchema.describe(
			'Required. End date, in UTC, of the grading period. Inclusive.',
		),
		title: z
			.string()
			.describe(
				'Required. Title of the grading period. For example, “Semester 1”.',
			)
			.describe(
				'Required. Title of the grading period. For example, “Semester 1”.',
			),
		startDate: DateSchema.describe(
			'Required. Start date, in UTC, of the grading period. Inclusive.',
		),
		id: z
			.string()
			.describe('Output only. System generated grading period ID. Read-only.')
			.optional()
			.describe('Output only. System generated grading period ID. Read-only.'),
	})
	.strict();
const GradingPeriodResponseSchema = z
	.object({
		endDate: DateResponseSchema.optional().describe(
			'Required. End date, in UTC, of the grading period. Inclusive.',
		),
		title: z
			.string()
			.describe(
				'Required. Title of the grading period. For example, “Semester 1”.',
			)
			.optional()
			.describe(
				'Required. Title of the grading period. For example, “Semester 1”.',
			),
		startDate: DateResponseSchema.optional().describe(
			'Required. Start date, in UTC, of the grading period. Inclusive.',
		),
		id: z
			.string()
			.describe('Output only. System generated grading period ID. Read-only.')
			.optional()
			.describe('Output only. System generated grading period ID. Read-only.'),
	})
	.strict();

const GradingPeriodSettingsSchema = z
	.object({
		gradingPeriods: z
			.array(GradingPeriodSchema)
			.optional()
			.describe(
				'The list of grading periods in a specific course. Grading periods must not have overlapping date ranges and must be listed in chronological order. Each grading period must have a unique title within a course.',
			),
		applyToExistingCoursework: z
			.boolean()
			.describe(
				'Supports toggling the application of grading periods on existing stream items. Once set, this value is persisted meaning that it does not need to be set in every request to update `GradingPeriodSettings`. If not previously set, the default is False.',
			)
			.optional()
			.describe(
				'Supports toggling the application of grading periods on existing stream items. Once set, this value is persisted meaning that it does not need to be set in every request to update `GradingPeriodSettings`. If not previously set, the default is False.',
			),
	})
	.strict();
const GradingPeriodSettingsResponseSchema = z
	.object({
		gradingPeriods: z
			.array(GradingPeriodResponseSchema)
			.optional()
			.describe(
				'The list of grading periods in a specific course. Grading periods must not have overlapping date ranges and must be listed in chronological order. Each grading period must have a unique title within a course.',
			),
		applyToExistingCoursework: z
			.boolean()
			.describe(
				'Supports toggling the application of grading periods on existing stream items. Once set, this value is persisted meaning that it does not need to be set in every request to update `GradingPeriodSettings`. If not previously set, the default is False.',
			)
			.optional()
			.describe(
				'Supports toggling the application of grading periods on existing stream items. Once set, this value is persisted meaning that it does not need to be set in every request to update `GradingPeriodSettings`. If not previously set, the default is False.',
			),
	})
	.strict();

const LevelSchema = z
	.object({
		points: z
			.number()
			.describe(
				'Optional points associated with this level. If set, all levels within the rubric must specify points and the value must be distinct across all levels within a single criterion. 0 is distinct from no points.',
			)
			.optional()
			.describe(
				'Optional points associated with this level. If set, all levels within the rubric must specify points and the value must be distinct across all levels within a single criterion. 0 is distinct from no points.',
			),
		description: z
			.string()
			.describe('The description of the level.')
			.optional()
			.describe('The description of the level.'),
		title: z
			.string()
			.describe(
				'The title of the level. If the level has no points set, title must be set.',
			)
			.optional()
			.describe(
				'The title of the level. If the level has no points set, title must be set.',
			),
		id: z
			.string()
			.describe('The level ID. On creation, an ID is assigned.')
			.optional()
			.describe('The level ID. On creation, an ID is assigned.'),
	})
	.strict();
const LevelResponseSchema = z
	.object({
		points: z
			.number()
			.describe(
				'Optional points associated with this level. If set, all levels within the rubric must specify points and the value must be distinct across all levels within a single criterion. 0 is distinct from no points.',
			)
			.optional()
			.describe(
				'Optional points associated with this level. If set, all levels within the rubric must specify points and the value must be distinct across all levels within a single criterion. 0 is distinct from no points.',
			),
		description: z
			.string()
			.describe('The description of the level.')
			.optional()
			.describe('The description of the level.'),
		title: z
			.string()
			.describe(
				'The title of the level. If the level has no points set, title must be set.',
			)
			.optional()
			.describe(
				'The title of the level. If the level has no points set, title must be set.',
			),
		id: z
			.string()
			.describe('The level ID. On creation, an ID is assigned.')
			.optional()
			.describe('The level ID. On creation, an ID is assigned.'),
	})
	.strict();

const CriterionSchema = z
	.object({
		description: z
			.string()
			.describe('The description of the criterion.')
			.optional()
			.describe('The description of the criterion.'),
		id: z
			.string()
			.describe('The criterion ID. On creation, an ID is assigned.')
			.optional()
			.describe('The criterion ID. On creation, an ID is assigned.'),
		title: z
			.string()
			.describe('The title of the criterion.')
			.optional()
			.describe('The title of the criterion.'),
		levels: z
			.array(LevelSchema)
			.optional()
			.describe('The list of levels within this criterion.'),
	})
	.strict();
const CriterionResponseSchema = z
	.object({
		description: z
			.string()
			.describe('The description of the criterion.')
			.optional()
			.describe('The description of the criterion.'),
		id: z
			.string()
			.describe('The criterion ID. On creation, an ID is assigned.')
			.optional()
			.describe('The criterion ID. On creation, an ID is assigned.'),
		title: z
			.string()
			.describe('The title of the criterion.')
			.optional()
			.describe('The title of the criterion.'),
		levels: z
			.array(LevelResponseSchema)
			.optional()
			.describe('The list of levels within this criterion.'),
	})
	.strict();

const RubricSchema = z
	.object({
		criteria: z
			.array(CriterionSchema)
			.optional()
			.describe(
				'List of criteria. Each criterion is a dimension on which performance is rated.',
			),
		updateTime: z
			.string()
			.describe(
				'Output only. Timestamp of the most recent change to this rubric. Read-only.',
			)
			.optional()
			.describe(
				'Output only. Timestamp of the most recent change to this rubric. Read-only.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier for the rubric. This is unique among rubrics for the relevant course work. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier for the rubric. This is unique among rubrics for the relevant course work. Read-only.',
			),
		courseWorkId: z
			.string()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			),
		creationTime: z
			.string()
			.describe(
				'Output only. Timestamp when this rubric was created. Read-only.',
			)
			.optional()
			.describe(
				'Output only. Timestamp when this rubric was created. Read-only.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		sourceSpreadsheetId: z
			.string()
			.describe(
				'Input only. Immutable. Google Sheets ID of the spreadsheet. This spreadsheet must contain formatted rubric settings. See [Create or reuse a rubric for an assignment](https://support.google.com/edu/classroom/answer/9335069). Use of this field requires the `https://www.googleapis.com/auth/spreadsheets.readonly` or `https://www.googleapis.com/auth/spreadsheets` scope.',
			)
			.optional()
			.describe(
				'Input only. Immutable. Google Sheets ID of the spreadsheet. This spreadsheet must contain formatted rubric settings. See [Create or reuse a rubric for an assignment](https://support.google.com/edu/classroom/answer/9335069). Use of this field requires the `https://www.googleapis.com/auth/spreadsheets.readonly` or `https://www.googleapis.com/auth/spreadsheets` scope.',
			),
	})
	.strict();
const RubricResponseSchema = z
	.object({
		criteria: z
			.array(CriterionResponseSchema)
			.optional()
			.describe(
				'List of criteria. Each criterion is a dimension on which performance is rated.',
			),
		updateTime: z
			.string()
			.describe(
				'Output only. Timestamp of the most recent change to this rubric. Read-only.',
			)
			.optional()
			.describe(
				'Output only. Timestamp of the most recent change to this rubric. Read-only.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier for the rubric. This is unique among rubrics for the relevant course work. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier for the rubric. This is unique among rubrics for the relevant course work. Read-only.',
			),
		courseWorkId: z
			.string()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			),
		creationTime: z
			.string()
			.describe(
				'Output only. Timestamp when this rubric was created. Read-only.',
			)
			.optional()
			.describe(
				'Output only. Timestamp when this rubric was created. Read-only.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		sourceSpreadsheetId: z
			.string()
			.describe(
				'Input only. Immutable. Google Sheets ID of the spreadsheet. This spreadsheet must contain formatted rubric settings. See [Create or reuse a rubric for an assignment](https://support.google.com/edu/classroom/answer/9335069). Use of this field requires the `https://www.googleapis.com/auth/spreadsheets.readonly` or `https://www.googleapis.com/auth/spreadsheets` scope.',
			)
			.optional()
			.describe(
				'Input only. Immutable. Google Sheets ID of the spreadsheet. This spreadsheet must contain formatted rubric settings. See [Create or reuse a rubric for an assignment](https://support.google.com/edu/classroom/answer/9335069). Use of this field requires the `https://www.googleapis.com/auth/spreadsheets.readonly` or `https://www.googleapis.com/auth/spreadsheets` scope.',
			),
	})
	.strict();

const MultipleChoiceQuestionSchema = z
	.object({
		choices: z.array(z.string()).optional().describe('Possible choices.'),
	})
	.strict();
const MultipleChoiceQuestionResponseSchema = z
	.object({
		choices: z.array(z.string()).optional().describe('Possible choices.'),
	})
	.strict();

const GradeHistorySchema = z
	.object({
		gradeChangeType: z
			.enum([
				'UNKNOWN_GRADE_CHANGE_TYPE',
				'DRAFT_GRADE_POINTS_EARNED_CHANGE',
				'ASSIGNED_GRADE_POINTS_EARNED_CHANGE',
				'MAX_POINTS_CHANGE',
			])
			.optional()
			.describe(
				'The type of grade change at this time in the submission grade history.',
			),
		gradeTimestamp: z
			.string()
			.describe('When the grade of the submission was changed.')
			.optional()
			.describe('When the grade of the submission was changed.'),
		pointsEarned: z
			.number()
			.describe(
				'The numerator of the grade at this time in the submission grade history.',
			)
			.optional()
			.describe(
				'The numerator of the grade at this time in the submission grade history.',
			),
		maxPoints: z
			.number()
			.describe(
				'The denominator of the grade at this time in the submission grade history.',
			)
			.optional()
			.describe(
				'The denominator of the grade at this time in the submission grade history.',
			),
		actorUserId: z
			.string()
			.describe('The teacher who made the grade change.')
			.optional()
			.describe('The teacher who made the grade change.'),
	})
	.strict();
const GradeHistoryResponseSchema = z
	.object({
		gradeChangeType: z
			.enum([
				'UNKNOWN_GRADE_CHANGE_TYPE',
				'DRAFT_GRADE_POINTS_EARNED_CHANGE',
				'ASSIGNED_GRADE_POINTS_EARNED_CHANGE',
				'MAX_POINTS_CHANGE',
			])
			.optional()
			.describe(
				'The type of grade change at this time in the submission grade history.',
			),
		gradeTimestamp: z
			.string()
			.describe('When the grade of the submission was changed.')
			.optional()
			.describe('When the grade of the submission was changed.'),
		pointsEarned: z
			.number()
			.describe(
				'The numerator of the grade at this time in the submission grade history.',
			)
			.optional()
			.describe(
				'The numerator of the grade at this time in the submission grade history.',
			),
		maxPoints: z
			.number()
			.describe(
				'The denominator of the grade at this time in the submission grade history.',
			)
			.optional()
			.describe(
				'The denominator of the grade at this time in the submission grade history.',
			),
		actorUserId: z
			.string()
			.describe('The teacher who made the grade change.')
			.optional()
			.describe('The teacher who made the grade change.'),
	})
	.strict();

const CourseRosterChangesInfoSchema = z
	.object({
		courseId: z
			.string()
			.describe(
				'The `course_id` of the course to subscribe to roster changes for.',
			)
			.optional()
			.describe(
				'The `course_id` of the course to subscribe to roster changes for.',
			),
	})
	.strict();
const CourseRosterChangesInfoResponseSchema = z
	.object({
		courseId: z
			.string()
			.describe(
				'The `course_id` of the course to subscribe to roster changes for.',
			)
			.optional()
			.describe(
				'The `course_id` of the course to subscribe to roster changes for.',
			),
	})
	.strict();

const CopyHistorySchema = z
	.object({
		courseId: z
			.string()
			.describe('Immutable. Identifier of the course.')
			.optional()
			.describe('Immutable. Identifier of the course.'),
		postId: z
			.string()
			.describe('Immutable. Deprecated, use `item_id` instead.')
			.optional()
			.describe('Immutable. Deprecated, use `item_id` instead.'),
		itemId: z
			.string()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			)
			.optional()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			),
		attachmentId: z
			.string()
			.describe('Immutable. Identifier of the attachment.')
			.optional()
			.describe('Immutable. Identifier of the attachment.'),
	})
	.strict();
const CopyHistoryResponseSchema = z
	.object({
		courseId: z
			.string()
			.describe('Immutable. Identifier of the course.')
			.optional()
			.describe('Immutable. Identifier of the course.'),
		postId: z
			.string()
			.describe('Immutable. Deprecated, use `item_id` instead.')
			.optional()
			.describe('Immutable. Deprecated, use `item_id` instead.'),
		itemId: z
			.string()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			)
			.optional()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			),
		attachmentId: z
			.string()
			.describe('Immutable. Identifier of the attachment.')
			.optional()
			.describe('Immutable. Identifier of the attachment.'),
	})
	.strict();

const AttachmentSchema = z
	.object({
		link: LinkSchema.optional().describe('Link attachment.'),
		form: FormSchema.optional().describe('Google Forms attachment.'),
		youTubeVideo: YouTubeVideoSchema.optional().describe(
			'Youtube video attachment.',
		),
		driveFile: DriveFileSchema.optional().describe(
			'Google Drive file attachment.',
		),
	})
	.strict();
const AttachmentResponseSchema = z
	.object({
		link: LinkResponseSchema.optional().describe('Link attachment.'),
		form: FormResponseSchema.optional().describe('Google Forms attachment.'),
		youTubeVideo: YouTubeVideoResponseSchema.optional().describe(
			'Youtube video attachment.',
		),
		driveFile: DriveFileResponseSchema.optional().describe(
			'Google Drive file attachment.',
		),
	})
	.strict();

const CourseAliasSchema = z
	.object({
		alias: z
			.string()
			.describe(
				'Alias string. The format of the string indicates the desired alias scoping. * `d:` indicates a domain-scoped alias. Example: `d:math_101` * `p:` indicates a project-scoped alias. Example: `p:abc123` This field has a maximum length of 256 characters.',
			)
			.optional()
			.describe(
				'Alias string. The format of the string indicates the desired alias scoping. * `d:` indicates a domain-scoped alias. Example: `d:math_101` * `p:` indicates a project-scoped alias. Example: `p:abc123` This field has a maximum length of 256 characters.',
			),
	})
	.strict();
const CourseAliasResponseSchema = z
	.object({
		alias: z
			.string()
			.describe(
				'Alias string. The format of the string indicates the desired alias scoping. * `d:` indicates a domain-scoped alias. Example: `d:math_101` * `p:` indicates a project-scoped alias. Example: `p:abc123` This field has a maximum length of 256 characters.',
			)
			.optional()
			.describe(
				'Alias string. The format of the string indicates the desired alias scoping. * `d:` indicates a domain-scoped alias. Example: `d:math_101` * `p:` indicates a project-scoped alias. Example: `p:abc123` This field has a maximum length of 256 characters.',
			),
	})
	.strict();

const ListCourseAliasesResponseSchema = z
	.object({
		aliases: z
			.array(CourseAliasSchema)
			.optional()
			.describe('The course aliases.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListCourseAliasesResponseResponseSchema = z
	.object({
		aliases: z
			.array(CourseAliasResponseSchema)
			.optional()
			.describe('The course aliases.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const RubricGradeSchema = z
	.object({
		levelId: z
			.string()
			.describe(
				'Optional. Optional level ID of the selected level. If empty, no level was selected.',
			)
			.optional()
			.describe(
				'Optional. Optional level ID of the selected level. If empty, no level was selected.',
			),
		criterionId: z
			.string()
			.describe('Optional. Criterion ID.')
			.optional()
			.describe('Optional. Criterion ID.'),
		points: z
			.number()
			.describe(
				'Optional. Optional points assigned for this criterion, typically based on the level. Levels might or might not have points. If unset, no points were set for this criterion.',
			)
			.optional()
			.describe(
				'Optional. Optional points assigned for this criterion, typically based on the level. Levels might or might not have points. If unset, no points were set for this criterion.',
			),
	})
	.strict();
const RubricGradeResponseSchema = z
	.object({
		levelId: z
			.string()
			.describe(
				'Optional. Optional level ID of the selected level. If empty, no level was selected.',
			)
			.optional()
			.describe(
				'Optional. Optional level ID of the selected level. If empty, no level was selected.',
			),
		criterionId: z
			.string()
			.describe('Optional. Criterion ID.')
			.optional()
			.describe('Optional. Criterion ID.'),
		points: z
			.number()
			.describe(
				'Optional. Optional points assigned for this criterion, typically based on the level. Levels might or might not have points. If unset, no points were set for this criterion.',
			)
			.optional()
			.describe(
				'Optional. Optional points assigned for this criterion, typically based on the level. Levels might or might not have points. If unset, no points were set for this criterion.',
			),
	})
	.strict();

const ListRubricsResponseSchema = z
	.object({
		rubrics: z
			.array(RubricSchema)
			.optional()
			.describe('Rubrics that match the request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListRubricsResponseResponseSchema = z
	.object({
		rubrics: z
			.array(RubricResponseSchema)
			.optional()
			.describe('Rubrics that match the request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const ModifyCourseWorkAssigneesRequestSchema = z
	.object({
		modifyIndividualStudentsOptions:
			ModifyIndividualStudentsOptionsSchema.optional().describe(
				'Set which students are assigned or not assigned to the coursework. Must be specified only when `assigneeMode` is `INDIVIDUAL_STUDENTS`.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Mode of the coursework describing whether it will be assigned to all students or specified individual students.',
			),
	})
	.strict();
const ModifyCourseWorkAssigneesRequestResponseSchema = z
	.object({
		modifyIndividualStudentsOptions:
			ModifyIndividualStudentsOptionsResponseSchema.optional().describe(
				'Set which students are assigned or not assigned to the coursework. Must be specified only when `assigneeMode` is `INDIVIDUAL_STUDENTS`.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Mode of the coursework describing whether it will be assigned to all students or specified individual students.',
			),
	})
	.strict();

const GradeCategorySchema = z
	.object({
		defaultGradeDenominator: z
			.number()
			.int()
			.describe(
				'Default value of denominator. Only applicable when grade calculation type is TOTAL_POINTS.',
			)
			.optional()
			.describe(
				'Default value of denominator. Only applicable when grade calculation type is TOTAL_POINTS.',
			),
		id: z
			.string()
			.describe('ID of the grade category.')
			.optional()
			.describe('ID of the grade category.'),
		weight: z
			.number()
			.int()
			.describe(
				'The weight of the category average as part of overall average. A weight of 12.34% is represented as 123400 (100% is 1,000,000). The last two digits should always be zero since we use two decimal precision. Only applicable when grade calculation type is WEIGHTED_CATEGORIES.',
			)
			.optional()
			.describe(
				'The weight of the category average as part of overall average. A weight of 12.34% is represented as 123400 (100% is 1,000,000). The last two digits should always be zero since we use two decimal precision. Only applicable when grade calculation type is WEIGHTED_CATEGORIES.',
			),
		name: z
			.string()
			.describe('Name of the grade category.')
			.optional()
			.describe('Name of the grade category.'),
	})
	.strict();
const GradeCategoryResponseSchema = z
	.object({
		defaultGradeDenominator: z
			.number()
			.int()
			.describe(
				'Default value of denominator. Only applicable when grade calculation type is TOTAL_POINTS.',
			)
			.optional()
			.describe(
				'Default value of denominator. Only applicable when grade calculation type is TOTAL_POINTS.',
			),
		id: z
			.string()
			.describe('ID of the grade category.')
			.optional()
			.describe('ID of the grade category.'),
		weight: z
			.number()
			.int()
			.describe(
				'The weight of the category average as part of overall average. A weight of 12.34% is represented as 123400 (100% is 1,000,000). The last two digits should always be zero since we use two decimal precision. Only applicable when grade calculation type is WEIGHTED_CATEGORIES.',
			)
			.optional()
			.describe(
				'The weight of the category average as part of overall average. A weight of 12.34% is represented as 123400 (100% is 1,000,000). The last two digits should always be zero since we use two decimal precision. Only applicable when grade calculation type is WEIGHTED_CATEGORIES.',
			),
		name: z
			.string()
			.describe('Name of the grade category.')
			.optional()
			.describe('Name of the grade category.'),
	})
	.strict();

const GradebookSettingsSchema = z
	.object({
		gradeCategories: z
			.array(GradeCategorySchema)
			.optional()
			.describe(
				'Grade categories that are available for coursework in the course.',
			),
		calculationType: z
			.enum([
				'CALCULATION_TYPE_UNSPECIFIED',
				'TOTAL_POINTS',
				'WEIGHTED_CATEGORIES',
			])
			.optional()
			.describe('Indicates how the overall grade is calculated.'),
		displaySetting: z
			.enum([
				'DISPLAY_SETTING_UNSPECIFIED',
				'SHOW_OVERALL_GRADE',
				'HIDE_OVERALL_GRADE',
				'SHOW_TEACHERS_ONLY',
			])
			.optional()
			.describe('Indicates who can see the overall grade..'),
	})
	.strict();
const GradebookSettingsResponseSchema = z
	.object({
		gradeCategories: z
			.array(GradeCategoryResponseSchema)
			.optional()
			.describe(
				'Grade categories that are available for coursework in the course.',
			),
		calculationType: z
			.enum([
				'CALCULATION_TYPE_UNSPECIFIED',
				'TOTAL_POINTS',
				'WEIGHTED_CATEGORIES',
			])
			.optional()
			.describe('Indicates how the overall grade is calculated.'),
		displaySetting: z
			.enum([
				'DISPLAY_SETTING_UNSPECIFIED',
				'SHOW_OVERALL_GRADE',
				'HIDE_OVERALL_GRADE',
				'SHOW_TEACHERS_ONLY',
			])
			.optional()
			.describe('Indicates who can see the overall grade..'),
	})
	.strict();

const CourseMaterialSchema = z
	.object({
		driveFile: DriveFileSchema.optional().describe(
			'Google Drive file attachment.',
		),
		youTubeVideo: YouTubeVideoSchema.optional().describe(
			'Youtube video attachment.',
		),
		link: LinkSchema.optional().describe('Link atatchment.'),
		form: FormSchema.optional().describe('Google Forms attachment.'),
	})
	.strict();
const CourseMaterialResponseSchema = z
	.object({
		driveFile: DriveFileResponseSchema.optional().describe(
			'Google Drive file attachment.',
		),
		youTubeVideo: YouTubeVideoResponseSchema.optional().describe(
			'Youtube video attachment.',
		),
		link: LinkResponseSchema.optional().describe('Link atatchment.'),
		form: FormResponseSchema.optional().describe('Google Forms attachment.'),
	})
	.strict();

const CourseMaterialSetSchema = z
	.object({
		title: z
			.string()
			.describe('Title for this set.')
			.optional()
			.describe('Title for this set.'),
		materials: z
			.array(CourseMaterialSchema)
			.optional()
			.describe('Materials attached to this set.'),
	})
	.strict();
const CourseMaterialSetResponseSchema = z
	.object({
		title: z
			.string()
			.describe('Title for this set.')
			.optional()
			.describe('Title for this set.'),
		materials: z
			.array(CourseMaterialResponseSchema)
			.optional()
			.describe('Materials attached to this set.'),
	})
	.strict();

const CourseSchema = z
	.object({
		courseState: z
			.enum([
				'COURSE_STATE_UNSPECIFIED',
				'ACTIVE',
				'ARCHIVED',
				'PROVISIONED',
				'DECLINED',
				'SUSPENDED',
			])
			.optional()
			.describe(
				'State of the course. If unspecified, the default state is `PROVISIONED`.',
			),
		descriptionHeading: z
			.string()
			.describe(
				'Optional heading for the description. For example, "Welcome to 10th Grade Biology." If set, this field must be a valid UTF-8 string and no longer than 3600 characters.',
			)
			.optional()
			.describe(
				'Optional heading for the description. For example, "Welcome to 10th Grade Biology." If set, this field must be a valid UTF-8 string and no longer than 3600 characters.',
			),
		guardiansEnabled: z
			.boolean()
			.describe(
				'Whether or not guardian notifications are enabled for this course. Read-only.',
			)
			.optional()
			.describe(
				'Whether or not guardian notifications are enabled for this course. Read-only.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this course in the Classroom web UI. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this course in the Classroom web UI. Read-only.',
			),
		room: z
			.string()
			.describe(
				'Optional room location. For example, "301". If set, this field must be a valid UTF-8 string and no longer than 650 characters.',
			)
			.optional()
			.describe(
				'Optional room location. For example, "301". If set, this field must be a valid UTF-8 string and no longer than 650 characters.',
			),
		ownerId: z
			.string()
			.describe(
				'The identifier of the owner of a course. When specified as a parameter of a create course request, this field is required. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user This must be set in a create request. Admins can also specify this field in a patch course request to transfer ownership. In other contexts, it is read-only.',
			)
			.describe(
				'The identifier of the owner of a course. When specified as a parameter of a create course request, this field is required. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user This must be set in a create request. Admins can also specify this field in a patch course request to transfer ownership. In other contexts, it is read-only.',
			),
		id: z
			.string()
			.describe(
				'Identifier for this course assigned by Classroom. When creating a course, you may optionally set this identifier to an alias string in the request to create a corresponding alias. The `id` is still assigned by Classroom and cannot be updated after the course is created. Specifying this field in a course update mask results in an error.',
			)
			.optional()
			.describe(
				'Identifier for this course assigned by Classroom. When creating a course, you may optionally set this identifier to an alias string in the request to create a corresponding alias. The `id` is still assigned by Classroom and cannot be updated after the course is created. Specifying this field in a course update mask results in an error.',
			),
		teacherGroupEmail: z
			.string()
			.describe(
				'The email address of a Google group containing all teachers of the course. This group does not accept email and can only be used for permissions. Read-only.',
			)
			.optional()
			.describe(
				'The email address of a Google group containing all teachers of the course. This group does not accept email and can only be used for permissions. Read-only.',
			),
		enrollmentCode: z
			.string()
			.describe(
				'Enrollment code to use when joining this course. Specifying this field in a course update mask results in an error. Read-only.',
			)
			.optional()
			.describe(
				'Enrollment code to use when joining this course. Specifying this field in a course update mask results in an error. Read-only.',
			),
		teacherFolder: DriveFolderSchema.optional().describe(
			'Information about a Drive Folder that is shared with all teachers of the course. This field will only be set for teachers of the course and domain administrators. Read-only.',
		),
		name: z
			.string()
			.describe(
				'Name of the course. For example, "10th Grade Biology". The name is required. It must be between 1 and 750 characters and a valid UTF-8 string.',
			)
			.describe(
				'Name of the course. For example, "10th Grade Biology". The name is required. It must be between 1 and 750 characters and a valid UTF-8 string.',
			),
		updateTime: z
			.string()
			.describe(
				'Time of the most recent update to this course. Specifying this field in a course update mask results in an error. Read-only.',
			)
			.optional()
			.describe(
				'Time of the most recent update to this course. Specifying this field in a course update mask results in an error. Read-only.',
			),
		levels: z
			.string()
			.describe(
				'Optional. Levels for the course. Examples: "9th grade", "Middle school", "4th - 5th", "K-2", "3000". If set, this field must be a valid UTF-8 string and fewer than 1000 characters. This field can only be cleared using the `PatchCourse` method.',
			)
			.optional()
			.describe(
				'Optional. Levels for the course. Examples: "9th grade", "Middle school", "4th - 5th", "K-2", "3000". If set, this field must be a valid UTF-8 string and fewer than 1000 characters. This field can only be cleared using the `PatchCourse` method.',
			),
		section: z
			.string()
			.describe(
				'Section of the course. For example, "Period 2". If set, this field must be a valid UTF-8 string and no longer than 2800 characters.',
			)
			.optional()
			.describe(
				'Section of the course. For example, "Period 2". If set, this field must be a valid UTF-8 string and no longer than 2800 characters.',
			),
		gradebookSettings: GradebookSettingsSchema.optional().describe(
			"The gradebook settings that specify how a student's overall grade for the course will be calculated and who it will be displayed to. Read-only.",
		),
		calendarId: z
			.string()
			.describe(
				'The Calendar ID for a calendar that all course members can see, to which Classroom adds events for course work and announcements in the course. The Calendar for a course is created asynchronously when the course is set to `CourseState.ACTIVE` for the first time (at creation time or when it is updated to `ACTIVE` through the UI or the API). The Calendar ID will not be populated until the creation process is completed. Read-only.',
			)
			.optional()
			.describe(
				'The Calendar ID for a calendar that all course members can see, to which Classroom adds events for course work and announcements in the course. The Calendar for a course is created asynchronously when the course is set to `CourseState.ACTIVE` for the first time (at creation time or when it is updated to `ACTIVE` through the UI or the API). The Calendar ID will not be populated until the creation process is completed. Read-only.',
			),
		subject: z
			.string()
			.describe('Optional. The subject of the course.')
			.optional()
			.describe('Optional. The subject of the course.'),
		description: z
			.string()
			.describe(
				'Optional description. For example, "We\'ll be learning about the structure of living creatures from a combination of textbooks, guest lectures, and lab work. Expect to be excited!" If set, this field must be a valid UTF-8 string and no longer than 30,000 characters.',
			)
			.optional()
			.describe(
				'Optional description. For example, "We\'ll be learning about the structure of living creatures from a combination of textbooks, guest lectures, and lab work. Expect to be excited!" If set, this field must be a valid UTF-8 string and no longer than 30,000 characters.',
			),
		courseGroupEmail: z
			.string()
			.describe(
				'The email address of a Google group containing all members of the course. This group does not accept email and can only be used for permissions. Read-only.',
			)
			.optional()
			.describe(
				'The email address of a Google group containing all members of the course. This group does not accept email and can only be used for permissions. Read-only.',
			),
		creationTime: z
			.string()
			.describe(
				'Creation time of the course. Specifying this field in a course update mask results in an error. Read-only.',
			)
			.optional()
			.describe(
				'Creation time of the course. Specifying this field in a course update mask results in an error. Read-only.',
			),
		courseMaterialSets: z
			.array(CourseMaterialSetSchema)
			.optional()
			.describe(
				'Sets of materials that appear on the "about" page of this course. Read-only.',
			),
	})
	.strict();
const CourseResponseSchema = z
	.object({
		courseState: z
			.enum([
				'COURSE_STATE_UNSPECIFIED',
				'ACTIVE',
				'ARCHIVED',
				'PROVISIONED',
				'DECLINED',
				'SUSPENDED',
			])
			.optional()
			.describe(
				'State of the course. If unspecified, the default state is `PROVISIONED`.',
			),
		descriptionHeading: z
			.string()
			.describe(
				'Optional heading for the description. For example, "Welcome to 10th Grade Biology." If set, this field must be a valid UTF-8 string and no longer than 3600 characters.',
			)
			.optional()
			.describe(
				'Optional heading for the description. For example, "Welcome to 10th Grade Biology." If set, this field must be a valid UTF-8 string and no longer than 3600 characters.',
			),
		guardiansEnabled: z
			.boolean()
			.describe(
				'Whether or not guardian notifications are enabled for this course. Read-only.',
			)
			.optional()
			.describe(
				'Whether or not guardian notifications are enabled for this course. Read-only.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this course in the Classroom web UI. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this course in the Classroom web UI. Read-only.',
			),
		room: z
			.string()
			.describe(
				'Optional room location. For example, "301". If set, this field must be a valid UTF-8 string and no longer than 650 characters.',
			)
			.optional()
			.describe(
				'Optional room location. For example, "301". If set, this field must be a valid UTF-8 string and no longer than 650 characters.',
			),
		ownerId: z
			.string()
			.describe(
				'The identifier of the owner of a course. When specified as a parameter of a create course request, this field is required. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user This must be set in a create request. Admins can also specify this field in a patch course request to transfer ownership. In other contexts, it is read-only.',
			)
			.optional()
			.describe(
				'The identifier of the owner of a course. When specified as a parameter of a create course request, this field is required. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user This must be set in a create request. Admins can also specify this field in a patch course request to transfer ownership. In other contexts, it is read-only.',
			),
		id: z
			.string()
			.describe(
				'Identifier for this course assigned by Classroom. When creating a course, you may optionally set this identifier to an alias string in the request to create a corresponding alias. The `id` is still assigned by Classroom and cannot be updated after the course is created. Specifying this field in a course update mask results in an error.',
			)
			.optional()
			.describe(
				'Identifier for this course assigned by Classroom. When creating a course, you may optionally set this identifier to an alias string in the request to create a corresponding alias. The `id` is still assigned by Classroom and cannot be updated after the course is created. Specifying this field in a course update mask results in an error.',
			),
		teacherGroupEmail: z
			.string()
			.describe(
				'The email address of a Google group containing all teachers of the course. This group does not accept email and can only be used for permissions. Read-only.',
			)
			.optional()
			.describe(
				'The email address of a Google group containing all teachers of the course. This group does not accept email and can only be used for permissions. Read-only.',
			),
		enrollmentCode: z
			.string()
			.describe(
				'Enrollment code to use when joining this course. Specifying this field in a course update mask results in an error. Read-only.',
			)
			.optional()
			.describe(
				'Enrollment code to use when joining this course. Specifying this field in a course update mask results in an error. Read-only.',
			),
		teacherFolder: DriveFolderResponseSchema.optional().describe(
			'Information about a Drive Folder that is shared with all teachers of the course. This field will only be set for teachers of the course and domain administrators. Read-only.',
		),
		name: z
			.string()
			.describe(
				'Name of the course. For example, "10th Grade Biology". The name is required. It must be between 1 and 750 characters and a valid UTF-8 string.',
			)
			.optional()
			.describe(
				'Name of the course. For example, "10th Grade Biology". The name is required. It must be between 1 and 750 characters and a valid UTF-8 string.',
			),
		updateTime: z
			.string()
			.describe(
				'Time of the most recent update to this course. Specifying this field in a course update mask results in an error. Read-only.',
			)
			.optional()
			.describe(
				'Time of the most recent update to this course. Specifying this field in a course update mask results in an error. Read-only.',
			),
		levels: z
			.string()
			.describe(
				'Optional. Levels for the course. Examples: "9th grade", "Middle school", "4th - 5th", "K-2", "3000". If set, this field must be a valid UTF-8 string and fewer than 1000 characters. This field can only be cleared using the `PatchCourse` method.',
			)
			.optional()
			.describe(
				'Optional. Levels for the course. Examples: "9th grade", "Middle school", "4th - 5th", "K-2", "3000". If set, this field must be a valid UTF-8 string and fewer than 1000 characters. This field can only be cleared using the `PatchCourse` method.',
			),
		section: z
			.string()
			.describe(
				'Section of the course. For example, "Period 2". If set, this field must be a valid UTF-8 string and no longer than 2800 characters.',
			)
			.optional()
			.describe(
				'Section of the course. For example, "Period 2". If set, this field must be a valid UTF-8 string and no longer than 2800 characters.',
			),
		gradebookSettings: GradebookSettingsResponseSchema.optional().describe(
			"The gradebook settings that specify how a student's overall grade for the course will be calculated and who it will be displayed to. Read-only.",
		),
		calendarId: z
			.string()
			.describe(
				'The Calendar ID for a calendar that all course members can see, to which Classroom adds events for course work and announcements in the course. The Calendar for a course is created asynchronously when the course is set to `CourseState.ACTIVE` for the first time (at creation time or when it is updated to `ACTIVE` through the UI or the API). The Calendar ID will not be populated until the creation process is completed. Read-only.',
			)
			.optional()
			.describe(
				'The Calendar ID for a calendar that all course members can see, to which Classroom adds events for course work and announcements in the course. The Calendar for a course is created asynchronously when the course is set to `CourseState.ACTIVE` for the first time (at creation time or when it is updated to `ACTIVE` through the UI or the API). The Calendar ID will not be populated until the creation process is completed. Read-only.',
			),
		subject: z
			.string()
			.describe('Optional. The subject of the course.')
			.optional()
			.describe('Optional. The subject of the course.'),
		description: z
			.string()
			.describe(
				'Optional description. For example, "We\'ll be learning about the structure of living creatures from a combination of textbooks, guest lectures, and lab work. Expect to be excited!" If set, this field must be a valid UTF-8 string and no longer than 30,000 characters.',
			)
			.optional()
			.describe(
				'Optional description. For example, "We\'ll be learning about the structure of living creatures from a combination of textbooks, guest lectures, and lab work. Expect to be excited!" If set, this field must be a valid UTF-8 string and no longer than 30,000 characters.',
			),
		courseGroupEmail: z
			.string()
			.describe(
				'The email address of a Google group containing all members of the course. This group does not accept email and can only be used for permissions. Read-only.',
			)
			.optional()
			.describe(
				'The email address of a Google group containing all members of the course. This group does not accept email and can only be used for permissions. Read-only.',
			),
		creationTime: z
			.string()
			.describe(
				'Creation time of the course. Specifying this field in a course update mask results in an error. Read-only.',
			)
			.optional()
			.describe(
				'Creation time of the course. Specifying this field in a course update mask results in an error. Read-only.',
			),
		courseMaterialSets: z
			.array(CourseMaterialSetResponseSchema)
			.optional()
			.describe(
				'Sets of materials that appear on the "about" page of this course. Read-only.',
			),
	})
	.strict();

const ListCoursesResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		courses: z
			.array(CourseSchema)
			.optional()
			.describe('Courses that match the list request.'),
	})
	.strict();
const ListCoursesResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		courses: z
			.array(CourseResponseSchema)
			.optional()
			.describe('Courses that match the list request.'),
	})
	.strict();

const StudentGroupMemberSchema = z
	.object({
		courseId: z
			.string()
			.describe('The identifier of the course.')
			.optional()
			.describe('The identifier of the course.'),
		userId: z
			.string()
			.describe('Identifier of the student.')
			.optional()
			.describe('Identifier of the student.'),
		studentGroupId: z
			.string()
			.describe('The identifier of the student group.')
			.optional()
			.describe('The identifier of the student group.'),
	})
	.strict();
const StudentGroupMemberResponseSchema = z
	.object({
		courseId: z
			.string()
			.describe('The identifier of the course.')
			.optional()
			.describe('The identifier of the course.'),
		userId: z
			.string()
			.describe('Identifier of the student.')
			.optional()
			.describe('Identifier of the student.'),
		studentGroupId: z
			.string()
			.describe('The identifier of the student group.')
			.optional()
			.describe('The identifier of the student group.'),
	})
	.strict();

const ListStudentGroupMembersResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		studentGroupMembers: z
			.array(StudentGroupMemberSchema)
			.optional()
			.describe('The student group members.'),
	})
	.strict();
const ListStudentGroupMembersResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		studentGroupMembers: z
			.array(StudentGroupMemberResponseSchema)
			.optional()
			.describe('The student group members.'),
	})
	.strict();

const EmptySchema = z.object({}).strict();
const EmptyResponseSchema = z.object({}).strict();

const AssignmentSubmissionSchema = z
	.object({
		attachments: z
			.array(AttachmentSchema)
			.optional()
			.describe(
				'Attachments added by the student. Drive files that correspond to materials with a share mode of STUDENT_COPY may not exist yet if the student has not accessed the assignment in Classroom. Some attachment metadata is only populated if the requesting user has permission to access it. Identifier and alternate_link fields are always available, but others (for example, title) may not be.',
			),
	})
	.strict();
const AssignmentSubmissionResponseSchema = z
	.object({
		attachments: z
			.array(AttachmentResponseSchema)
			.optional()
			.describe(
				'Attachments added by the student. Drive files that correspond to materials with a share mode of STUDENT_COPY may not exist yet if the student has not accessed the assignment in Classroom. Some attachment metadata is only populated if the requesting user has permission to access it. Identifier and alternate_link fields are always available, but others (for example, title) may not be.',
			),
	})
	.strict();

const StateHistorySchema = z
	.object({
		state: z
			.enum([
				'STATE_UNSPECIFIED',
				'CREATED',
				'TURNED_IN',
				'RETURNED',
				'RECLAIMED_BY_STUDENT',
				'STUDENT_EDITED_AFTER_TURN_IN',
			])
			.optional()
			.describe('The workflow pipeline stage.'),
		actorUserId: z
			.string()
			.describe('The teacher or student who made the change.')
			.optional()
			.describe('The teacher or student who made the change.'),
		stateTimestamp: z
			.string()
			.describe('When the submission entered this state.')
			.optional()
			.describe('When the submission entered this state.'),
	})
	.strict();
const StateHistoryResponseSchema = z
	.object({
		state: z
			.enum([
				'STATE_UNSPECIFIED',
				'CREATED',
				'TURNED_IN',
				'RETURNED',
				'RECLAIMED_BY_STUDENT',
				'STUDENT_EDITED_AFTER_TURN_IN',
			])
			.optional()
			.describe('The workflow pipeline stage.'),
		actorUserId: z
			.string()
			.describe('The teacher or student who made the change.')
			.optional()
			.describe('The teacher or student who made the change.'),
		stateTimestamp: z
			.string()
			.describe('When the submission entered this state.')
			.optional()
			.describe('When the submission entered this state.'),
	})
	.strict();

const SubmissionHistorySchema = z
	.object({
		gradeHistory: GradeHistorySchema.optional().describe(
			'The grade history information of the submission, if present.',
		),
		stateHistory: StateHistorySchema.optional().describe(
			'The state history information of the submission, if present.',
		),
	})
	.strict();
const SubmissionHistoryResponseSchema = z
	.object({
		gradeHistory: GradeHistoryResponseSchema.optional().describe(
			'The grade history information of the submission, if present.',
		),
		stateHistory: StateHistoryResponseSchema.optional().describe(
			'The state history information of the submission, if present.',
		),
	})
	.strict();

const CourseWorkChangesInfoSchema = z
	.object({
		courseId: z
			.string()
			.describe(
				'The `course_id` of the course to subscribe to work changes for.',
			)
			.optional()
			.describe(
				'The `course_id` of the course to subscribe to work changes for.',
			),
	})
	.strict();
const CourseWorkChangesInfoResponseSchema = z
	.object({
		courseId: z
			.string()
			.describe(
				'The `course_id` of the course to subscribe to work changes for.',
			)
			.optional()
			.describe(
				'The `course_id` of the course to subscribe to work changes for.',
			),
	})
	.strict();

const FeedSchema = z
	.object({
		feedType: z
			.enum([
				'FEED_TYPE_UNSPECIFIED',
				'DOMAIN_ROSTER_CHANGES',
				'COURSE_ROSTER_CHANGES',
				'COURSE_WORK_CHANGES',
			])
			.optional()
			.describe('The type of feed.'),
		courseWorkChangesInfo: CourseWorkChangesInfoSchema.optional().describe(
			'Information about a `Feed` with a `feed_type` of `COURSE_WORK_CHANGES`. This field must be specified if `feed_type` is `COURSE_WORK_CHANGES`.',
		),
		courseRosterChangesInfo: CourseRosterChangesInfoSchema.optional().describe(
			'Information about a `Feed` with a `feed_type` of `COURSE_ROSTER_CHANGES`. This field must be specified if `feed_type` is `COURSE_ROSTER_CHANGES`.',
		),
	})
	.strict();
const FeedResponseSchema = z
	.object({
		feedType: z
			.enum([
				'FEED_TYPE_UNSPECIFIED',
				'DOMAIN_ROSTER_CHANGES',
				'COURSE_ROSTER_CHANGES',
				'COURSE_WORK_CHANGES',
			])
			.optional()
			.describe('The type of feed.'),
		courseWorkChangesInfo:
			CourseWorkChangesInfoResponseSchema.optional().describe(
				'Information about a `Feed` with a `feed_type` of `COURSE_WORK_CHANGES`. This field must be specified if `feed_type` is `COURSE_WORK_CHANGES`.',
			),
		courseRosterChangesInfo:
			CourseRosterChangesInfoResponseSchema.optional().describe(
				'Information about a `Feed` with a `feed_type` of `COURSE_ROSTER_CHANGES`. This field must be specified if `feed_type` is `COURSE_ROSTER_CHANGES`.',
			),
	})
	.strict();

const RegistrationSchema = z
	.object({
		expiryTime: z
			.string()
			.describe(
				'The time until which the `Registration` is effective. This is a read-only field assigned by the server.',
			)
			.optional()
			.describe(
				'The time until which the `Registration` is effective. This is a read-only field assigned by the server.',
			),
		registrationId: z
			.string()
			.describe(
				'A server-generated unique identifier for this `Registration`. Read-only.',
			)
			.optional()
			.describe(
				'A server-generated unique identifier for this `Registration`. Read-only.',
			),
		cloudPubsubTopic: CloudPubsubTopicSchema.optional().describe(
			'The Cloud Pub/Sub topic that notifications are to be sent to.',
		),
		feed: FeedSchema.optional().describe(
			'Specification for the class of notifications that Classroom should deliver to the destination.',
		),
	})
	.strict();
const RegistrationResponseSchema = z
	.object({
		expiryTime: z
			.string()
			.describe(
				'The time until which the `Registration` is effective. This is a read-only field assigned by the server.',
			)
			.optional()
			.describe(
				'The time until which the `Registration` is effective. This is a read-only field assigned by the server.',
			),
		registrationId: z
			.string()
			.describe(
				'A server-generated unique identifier for this `Registration`. Read-only.',
			)
			.optional()
			.describe(
				'A server-generated unique identifier for this `Registration`. Read-only.',
			),
		cloudPubsubTopic: CloudPubsubTopicResponseSchema.optional().describe(
			'The Cloud Pub/Sub topic that notifications are to be sent to.',
		),
		feed: FeedResponseSchema.optional().describe(
			'Specification for the class of notifications that Classroom should deliver to the destination.',
		),
	})
	.strict();

const ListAnnouncementsResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		announcements: z
			.array(AnnouncementSchema)
			.optional()
			.describe('Announcement items that match the request.'),
	})
	.strict();
const ListAnnouncementsResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		announcements: z
			.array(AnnouncementResponseSchema)
			.optional()
			.describe('Announcement items that match the request.'),
	})
	.strict();

const TeacherContextSchema = z.object({}).strict();
const TeacherContextResponseSchema = z.object({}).strict();

const TurnInStudentSubmissionRequestSchema = z.object({}).strict();
const TurnInStudentSubmissionRequestResponseSchema = z.object({}).strict();

const InvitationSchema = z
	.object({
		id: z
			.string()
			.describe('Identifier assigned by Classroom. Read-only.')
			.optional()
			.describe('Identifier assigned by Classroom. Read-only.'),
		role: z
			.enum(['COURSE_ROLE_UNSPECIFIED', 'STUDENT', 'TEACHER', 'OWNER'])
			.optional()
			.describe(
				'Role to invite the user to have. Must not be `COURSE_ROLE_UNSPECIFIED`.',
			),
		userId: z
			.string()
			.describe(
				'Identifier of the invited user. When specified as a parameter of a request, this identifier can be set to one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			)
			.optional()
			.describe(
				'Identifier of the invited user. When specified as a parameter of a request, this identifier can be set to one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			),
		courseId: z
			.string()
			.describe('Identifier of the course to invite the user to.')
			.optional()
			.describe('Identifier of the course to invite the user to.'),
	})
	.strict();
const InvitationResponseSchema = z
	.object({
		id: z
			.string()
			.describe('Identifier assigned by Classroom. Read-only.')
			.optional()
			.describe('Identifier assigned by Classroom. Read-only.'),
		role: z
			.enum(['COURSE_ROLE_UNSPECIFIED', 'STUDENT', 'TEACHER', 'OWNER'])
			.optional()
			.describe(
				'Role to invite the user to have. Must not be `COURSE_ROLE_UNSPECIFIED`.',
			),
		userId: z
			.string()
			.describe(
				'Identifier of the invited user. When specified as a parameter of a request, this identifier can be set to one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			)
			.optional()
			.describe(
				'Identifier of the invited user. When specified as a parameter of a request, this identifier can be set to one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			),
		courseId: z
			.string()
			.describe('Identifier of the course to invite the user to.')
			.optional()
			.describe('Identifier of the course to invite the user to.'),
	})
	.strict();

const EmbedUriSchema = z
	.object({
		uri: z
			.string()
			.describe(
				'Required. URI to be iframed after being populated with query parameters. This must be a valid UTF-8 string containing between 1 and 1800 characters.',
			)
			.describe(
				'Required. URI to be iframed after being populated with query parameters. This must be a valid UTF-8 string containing between 1 and 1800 characters.',
			),
	})
	.strict();
const EmbedUriResponseSchema = z
	.object({
		uri: z
			.string()
			.describe(
				'Required. URI to be iframed after being populated with query parameters. This must be a valid UTF-8 string containing between 1 and 1800 characters.',
			)
			.optional()
			.describe(
				'Required. URI to be iframed after being populated with query parameters. This must be a valid UTF-8 string containing between 1 and 1800 characters.',
			),
	})
	.strict();

const ModifyAttachmentsRequestSchema = z
	.object({
		addAttachments: z
			.array(AttachmentSchema)
			.optional()
			.describe(
				'Attachments to add. A student submission may not have more than 20 attachments. Form attachments are not supported.',
			),
	})
	.strict();
const ModifyAttachmentsRequestResponseSchema = z
	.object({
		addAttachments: z
			.array(AttachmentResponseSchema)
			.optional()
			.describe(
				'Attachments to add. A student submission may not have more than 20 attachments. Form attachments are not supported.',
			),
	})
	.strict();

const ReturnStudentSubmissionRequestSchema = z.object({}).strict();
const ReturnStudentSubmissionRequestResponseSchema = z.object({}).strict();

const AddOnAttachmentSchema = z
	.object({
		dueTime: TimeOfDaySchema.optional().describe(
			'Time of day, in UTC, that work on this attachment is due. This must be specified if `due_date` is specified.',
		),
		copyHistory: z
			.array(CopyHistorySchema)
			.optional()
			.describe(
				'Output only. Identifiers of attachments that were previous copies of this attachment. If the attachment was previously copied by virtue of its parent post being copied, this enumerates the identifiers of attachments that were its previous copies in ascending chronological order of copy.',
			),
		gradeSyncEnabled: z
			.boolean()
			.describe(
				"Output only. Whether changes to `pointsEarned` values on this attachment's student submissions will be copied to the `pointsEarned` field on the students' CourseWork submissions. This field can be `true` for at most one add-on attachment per stream item.",
			)
			.optional()
			.describe(
				"Output only. Whether changes to `pointsEarned` values on this attachment's student submissions will be copied to the `pointsEarned` field on the students' CourseWork submissions. This field can be `true` for at most one add-on attachment per stream item.",
			),
		title: z
			.string()
			.describe(
				'Required. Title of this attachment. The title must be between 1 and 1000 characters.',
			)
			.describe(
				'Required. Title of this attachment. The title must be between 1 and 1000 characters.',
			),
		studentViewUri: EmbedUriSchema.describe(
			'Required. URI to show the student view of the attachment. The URI will be opened in an iframe with the `courseId`, `itemId`, `itemType`, and `attachmentId` query parameters set.',
		),
		itemId: z
			.string()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. Unique per course.',
			)
			.optional()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. Unique per course.',
			),
		dueDate: DateSchema.optional().describe(
			'Date, in UTC, that work on this attachment is due. This must be specified if `due_time` is specified.',
		),
		studentWorkReviewUri: EmbedUriSchema.optional().describe(
			'URI for the teacher to see student work on the attachment, if applicable. The URI will be opened in an iframe with the `courseId`, `itemId`, `itemType`, `attachmentId`, and `submissionId` query parameters set. This is the same `submissionId` returned in the [`AddOnContext.studentContext`](/workspace/classroom/reference/rest/v1/AddOnContext#StudentContext) field when a student views the attachment. If the URI is omitted or removed, `max_points` will also be discarded.',
		),
		postId: z
			.string()
			.describe('Immutable. Deprecated, use `item_id` instead.')
			.optional()
			.describe('Immutable. Deprecated, use `item_id` instead.'),
		teacherViewUri: EmbedUriSchema.describe(
			'Required. URI to show the teacher view of the attachment. The URI will be opened in an iframe with the `courseId`, `itemId`, `itemType`, and `attachmentId` query parameters set.',
		),
		maxPoints: z
			.number()
			.describe(
				'Maximum grade for this attachment. Can only be set if `studentWorkReviewUri` is set. Set to a non-zero value to indicate that the attachment supports grade passback. If set, this must be a non-negative integer value. When set to zero, the attachment will not support grade passback.',
			)
			.optional()
			.describe(
				'Maximum grade for this attachment. Can only be set if `studentWorkReviewUri` is set. Set to a non-zero value to indicate that the attachment supports grade passback. If set, this must be a non-negative integer value. When set to zero, the attachment will not support grade passback.',
			),
		id: z
			.string()
			.describe(
				'Immutable. Classroom-assigned identifier for this attachment, unique per post.',
			)
			.optional()
			.describe(
				'Immutable. Classroom-assigned identifier for this attachment, unique per post.',
			),
		courseId: z
			.string()
			.describe('Immutable. Identifier of the course.')
			.optional()
			.describe('Immutable. Identifier of the course.'),
	})
	.strict();
const AddOnAttachmentResponseSchema = z
	.object({
		dueTime: TimeOfDayResponseSchema.optional().describe(
			'Time of day, in UTC, that work on this attachment is due. This must be specified if `due_date` is specified.',
		),
		copyHistory: z
			.array(CopyHistoryResponseSchema)
			.optional()
			.describe(
				'Output only. Identifiers of attachments that were previous copies of this attachment. If the attachment was previously copied by virtue of its parent post being copied, this enumerates the identifiers of attachments that were its previous copies in ascending chronological order of copy.',
			),
		gradeSyncEnabled: z
			.boolean()
			.describe(
				"Output only. Whether changes to `pointsEarned` values on this attachment's student submissions will be copied to the `pointsEarned` field on the students' CourseWork submissions. This field can be `true` for at most one add-on attachment per stream item.",
			)
			.optional()
			.describe(
				"Output only. Whether changes to `pointsEarned` values on this attachment's student submissions will be copied to the `pointsEarned` field on the students' CourseWork submissions. This field can be `true` for at most one add-on attachment per stream item.",
			),
		title: z
			.string()
			.describe(
				'Required. Title of this attachment. The title must be between 1 and 1000 characters.',
			)
			.optional()
			.describe(
				'Required. Title of this attachment. The title must be between 1 and 1000 characters.',
			),
		studentViewUri: EmbedUriResponseSchema.optional().describe(
			'Required. URI to show the student view of the attachment. The URI will be opened in an iframe with the `courseId`, `itemId`, `itemType`, and `attachmentId` query parameters set.',
		),
		itemId: z
			.string()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. Unique per course.',
			)
			.optional()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. Unique per course.',
			),
		dueDate: DateResponseSchema.optional().describe(
			'Date, in UTC, that work on this attachment is due. This must be specified if `due_time` is specified.',
		),
		studentWorkReviewUri: EmbedUriResponseSchema.optional().describe(
			'URI for the teacher to see student work on the attachment, if applicable. The URI will be opened in an iframe with the `courseId`, `itemId`, `itemType`, `attachmentId`, and `submissionId` query parameters set. This is the same `submissionId` returned in the [`AddOnContext.studentContext`](/workspace/classroom/reference/rest/v1/AddOnContext#StudentContext) field when a student views the attachment. If the URI is omitted or removed, `max_points` will also be discarded.',
		),
		postId: z
			.string()
			.describe('Immutable. Deprecated, use `item_id` instead.')
			.optional()
			.describe('Immutable. Deprecated, use `item_id` instead.'),
		teacherViewUri: EmbedUriResponseSchema.optional().describe(
			'Required. URI to show the teacher view of the attachment. The URI will be opened in an iframe with the `courseId`, `itemId`, `itemType`, and `attachmentId` query parameters set.',
		),
		maxPoints: z
			.number()
			.describe(
				'Maximum grade for this attachment. Can only be set if `studentWorkReviewUri` is set. Set to a non-zero value to indicate that the attachment supports grade passback. If set, this must be a non-negative integer value. When set to zero, the attachment will not support grade passback.',
			)
			.optional()
			.describe(
				'Maximum grade for this attachment. Can only be set if `studentWorkReviewUri` is set. Set to a non-zero value to indicate that the attachment supports grade passback. If set, this must be a non-negative integer value. When set to zero, the attachment will not support grade passback.',
			),
		id: z
			.string()
			.describe(
				'Immutable. Classroom-assigned identifier for this attachment, unique per post.',
			)
			.optional()
			.describe(
				'Immutable. Classroom-assigned identifier for this attachment, unique per post.',
			),
		courseId: z
			.string()
			.describe('Immutable. Identifier of the course.')
			.optional()
			.describe('Immutable. Identifier of the course.'),
	})
	.strict();

const ListAddOnAttachmentsResponseSchema = z
	.object({
		addOnAttachments: z
			.array(AddOnAttachmentSchema)
			.optional()
			.describe('Attachments under the given post.'),
		nextPageToken: z
			.string()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			)
			.optional()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			),
	})
	.strict();
const ListAddOnAttachmentsResponseResponseSchema = z
	.object({
		addOnAttachments: z
			.array(AddOnAttachmentResponseSchema)
			.optional()
			.describe('Attachments under the given post.'),
		nextPageToken: z
			.string()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			)
			.optional()
			.describe(
				'A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted, there are no subsequent pages.',
			),
	})
	.strict();

const TeacherSchema = z
	.object({
		profile: UserProfileSchema.optional().describe(
			'Global user information for the teacher. Read-only.',
		),
		userId: z
			.string()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			)
			.optional()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
	})
	.strict();
const TeacherResponseSchema = z
	.object({
		profile: UserProfileResponseSchema.optional().describe(
			'Global user information for the teacher. Read-only.',
		),
		userId: z
			.string()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			)
			.optional()
			.describe(
				'Identifier of the user. When specified as a parameter of a request, this identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
	})
	.strict();

const ListTeachersResponseSchema = z
	.object({
		teachers: z
			.array(TeacherSchema)
			.optional()
			.describe('Teachers who match the list request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListTeachersResponseResponseSchema = z
	.object({
		teachers: z
			.array(TeacherResponseSchema)
			.optional()
			.describe('Teachers who match the list request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const GuardianInvitationSchema = z
	.object({
		invitationId: z
			.string()
			.describe('Unique identifier for this invitation. Read-only.')
			.optional()
			.describe('Unique identifier for this invitation. Read-only.'),
		creationTime: z
			.string()
			.describe('The time that this invitation was created. Read-only.')
			.optional()
			.describe('The time that this invitation was created. Read-only.'),
		studentId: z
			.string()
			.describe('ID of the student (in standard format)')
			.optional()
			.describe('ID of the student (in standard format)'),
		state: z
			.enum(['GUARDIAN_INVITATION_STATE_UNSPECIFIED', 'PENDING', 'COMPLETE'])
			.optional()
			.describe('The state that this invitation is in.'),
		invitedEmailAddress: z
			.string()
			.describe(
				'Email address that the invitation was sent to. This field is only visible to domain administrators.',
			)
			.optional()
			.describe(
				'Email address that the invitation was sent to. This field is only visible to domain administrators.',
			),
	})
	.strict();
const GuardianInvitationResponseSchema = z
	.object({
		invitationId: z
			.string()
			.describe('Unique identifier for this invitation. Read-only.')
			.optional()
			.describe('Unique identifier for this invitation. Read-only.'),
		creationTime: z
			.string()
			.describe('The time that this invitation was created. Read-only.')
			.optional()
			.describe('The time that this invitation was created. Read-only.'),
		studentId: z
			.string()
			.describe('ID of the student (in standard format)')
			.optional()
			.describe('ID of the student (in standard format)'),
		state: z
			.enum(['GUARDIAN_INVITATION_STATE_UNSPECIFIED', 'PENDING', 'COMPLETE'])
			.optional()
			.describe('The state that this invitation is in.'),
		invitedEmailAddress: z
			.string()
			.describe(
				'Email address that the invitation was sent to. This field is only visible to domain administrators.',
			)
			.optional()
			.describe(
				'Email address that the invitation was sent to. This field is only visible to domain administrators.',
			),
	})
	.strict();

const MultipleChoiceSubmissionSchema = z
	.object({
		answer: z
			.string()
			.describe("Student's select choice.")
			.optional()
			.describe("Student's select choice."),
	})
	.strict();
const MultipleChoiceSubmissionResponseSchema = z
	.object({
		answer: z
			.string()
			.describe("Student's select choice.")
			.optional()
			.describe("Student's select choice."),
	})
	.strict();

const ShortAnswerSubmissionSchema = z
	.object({
		answer: z
			.string()
			.describe('Student response to a short-answer question.')
			.optional()
			.describe('Student response to a short-answer question.'),
	})
	.strict();
const ShortAnswerSubmissionResponseSchema = z
	.object({
		answer: z
			.string()
			.describe('Student response to a short-answer question.')
			.optional()
			.describe('Student response to a short-answer question.'),
	})
	.strict();

const StudentSubmissionSchema = z
	.object({
		creationTime: z
			.string()
			.describe(
				'Creation time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			)
			.optional()
			.describe(
				'Creation time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			),
		assignedGrade: z
			.number()
			.describe(
				'Optional grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This may be modified only by course teachers.',
			)
			.optional()
			.describe(
				'Optional grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This may be modified only by course teachers.',
			),
		assignmentSubmission: AssignmentSubmissionSchema.optional().describe(
			'Submission content when course_work_type is ASSIGNMENT. Students can modify this content using ModifyAttachments.',
		),
		courseWorkType: z
			.enum([
				'COURSE_WORK_TYPE_UNSPECIFIED',
				'ASSIGNMENT',
				'SHORT_ANSWER_QUESTION',
				'MULTIPLE_CHOICE_QUESTION',
			])
			.optional()
			.describe('Type of course work this submission is for. Read-only.'),
		submissionHistory: z
			.array(SubmissionHistorySchema)
			.optional()
			.describe(
				'The history of the submission (includes state and grade histories). Read-only.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned Identifier for the student submission. This is unique among submissions for the relevant course work. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned Identifier for the student submission. This is unique among submissions for the relevant course work. Read-only.',
			),
		assignedRubricGrades: z
			.record(z.string(), RubricGradeSchema)
			.optional()
			.describe(
				"Assigned rubric grades based on the rubric's Criteria. This map is empty if there is no rubric attached to this course work or if a rubric is attached, but no grades have been set on any Criteria. Entries are only populated for grades that have been set. Key: The rubric's criterion ID. Read-only.",
			),
		draftRubricGrades: z
			.record(z.string(), RubricGradeSchema)
			.optional()
			.describe(
				"Pending rubric grades based on the rubric's criteria. This map is empty if there is no rubric attached to this course work or if a rubric is attached, but no grades have been set on any criteria. Entries are only populated for grades that have been set. Key: The rubric's criterion ID. Read-only.",
			),
		associatedWithDeveloper: z
			.boolean()
			.describe(
				'Whether this student submission is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			)
			.optional()
			.describe(
				'Whether this student submission is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to the submission in the Classroom web UI. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to the submission in the Classroom web UI. Read-only.',
			),
		state: z
			.enum([
				'SUBMISSION_STATE_UNSPECIFIED',
				'NEW',
				'CREATED',
				'TURNED_IN',
				'RETURNED',
				'RECLAIMED_BY_STUDENT',
			])
			.optional()
			.describe('State of this submission. Read-only.'),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		courseWorkId: z
			.string()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			),
		late: z
			.boolean()
			.describe('Whether this submission is late. Read-only.')
			.optional()
			.describe('Whether this submission is late. Read-only.'),
		multipleChoiceSubmission:
			MultipleChoiceSubmissionSchema.optional().describe(
				'Submission content when course_work_type is MULTIPLE_CHOICE_QUESTION.',
			),
		updateTime: z
			.string()
			.describe(
				'Last update time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			)
			.optional()
			.describe(
				'Last update time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			),
		userId: z
			.string()
			.describe(
				'Identifier for the student that owns this submission. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the student that owns this submission. Read-only.',
			),
		draftGrade: z
			.number()
			.describe(
				'Optional pending grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This is only visible to and modifiable by course teachers.',
			)
			.optional()
			.describe(
				'Optional pending grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This is only visible to and modifiable by course teachers.',
			),
		shortAnswerSubmission: ShortAnswerSubmissionSchema.optional().describe(
			'Submission content when course_work_type is SHORT_ANSWER_QUESTION.',
		),
	})
	.strict();
const StudentSubmissionResponseSchema = z
	.object({
		creationTime: z
			.string()
			.describe(
				'Creation time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			)
			.optional()
			.describe(
				'Creation time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			),
		assignedGrade: z
			.number()
			.describe(
				'Optional grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This may be modified only by course teachers.',
			)
			.optional()
			.describe(
				'Optional grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This may be modified only by course teachers.',
			),
		assignmentSubmission:
			AssignmentSubmissionResponseSchema.optional().describe(
				'Submission content when course_work_type is ASSIGNMENT. Students can modify this content using ModifyAttachments.',
			),
		courseWorkType: z
			.enum([
				'COURSE_WORK_TYPE_UNSPECIFIED',
				'ASSIGNMENT',
				'SHORT_ANSWER_QUESTION',
				'MULTIPLE_CHOICE_QUESTION',
			])
			.optional()
			.describe('Type of course work this submission is for. Read-only.'),
		submissionHistory: z
			.array(SubmissionHistoryResponseSchema)
			.optional()
			.describe(
				'The history of the submission (includes state and grade histories). Read-only.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned Identifier for the student submission. This is unique among submissions for the relevant course work. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned Identifier for the student submission. This is unique among submissions for the relevant course work. Read-only.',
			),
		assignedRubricGrades: z
			.record(z.string(), RubricGradeResponseSchema)
			.optional()
			.describe(
				"Assigned rubric grades based on the rubric's Criteria. This map is empty if there is no rubric attached to this course work or if a rubric is attached, but no grades have been set on any Criteria. Entries are only populated for grades that have been set. Key: The rubric's criterion ID. Read-only.",
			),
		draftRubricGrades: z
			.record(z.string(), RubricGradeResponseSchema)
			.optional()
			.describe(
				"Pending rubric grades based on the rubric's criteria. This map is empty if there is no rubric attached to this course work or if a rubric is attached, but no grades have been set on any criteria. Entries are only populated for grades that have been set. Key: The rubric's criterion ID. Read-only.",
			),
		associatedWithDeveloper: z
			.boolean()
			.describe(
				'Whether this student submission is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			)
			.optional()
			.describe(
				'Whether this student submission is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to the submission in the Classroom web UI. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to the submission in the Classroom web UI. Read-only.',
			),
		state: z
			.enum([
				'SUBMISSION_STATE_UNSPECIFIED',
				'NEW',
				'CREATED',
				'TURNED_IN',
				'RETURNED',
				'RECLAIMED_BY_STUDENT',
			])
			.optional()
			.describe('State of this submission. Read-only.'),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		courseWorkId: z
			.string()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the course work this corresponds to. Read-only.',
			),
		late: z
			.boolean()
			.describe('Whether this submission is late. Read-only.')
			.optional()
			.describe('Whether this submission is late. Read-only.'),
		multipleChoiceSubmission:
			MultipleChoiceSubmissionResponseSchema.optional().describe(
				'Submission content when course_work_type is MULTIPLE_CHOICE_QUESTION.',
			),
		updateTime: z
			.string()
			.describe(
				'Last update time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			)
			.optional()
			.describe(
				'Last update time of this submission. This may be unset if the student has not accessed this item. Read-only.',
			),
		userId: z
			.string()
			.describe(
				'Identifier for the student that owns this submission. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the student that owns this submission. Read-only.',
			),
		draftGrade: z
			.number()
			.describe(
				'Optional pending grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This is only visible to and modifiable by course teachers.',
			)
			.optional()
			.describe(
				'Optional pending grade. If unset, no grade was set. This value must be non-negative. Decimal (that is, non-integer) values are allowed, but are rounded to two decimal places. This is only visible to and modifiable by course teachers.',
			),
		shortAnswerSubmission:
			ShortAnswerSubmissionResponseSchema.optional().describe(
				'Submission content when course_work_type is SHORT_ANSWER_QUESTION.',
			),
	})
	.strict();

const ListStudentSubmissionsResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		studentSubmissions: z
			.array(StudentSubmissionSchema)
			.optional()
			.describe('Student work that matches the request.'),
	})
	.strict();
const ListStudentSubmissionsResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		studentSubmissions: z
			.array(StudentSubmissionResponseSchema)
			.optional()
			.describe('Student work that matches the request.'),
	})
	.strict();

const CourseWorkMaterialSchema = z
	.object({
		scheduledTime: z
			.string()
			.describe(
				'Optional timestamp when this course work material is scheduled to be published.',
			)
			.optional()
			.describe(
				'Optional timestamp when this course work material is scheduled to be published.',
			),
		state: z
			.enum([
				'COURSEWORK_MATERIAL_STATE_UNSPECIFIED',
				'PUBLISHED',
				'DRAFT',
				'DELETED',
			])
			.optional()
			.describe(
				'Status of this course work material. If unspecified, the default state is `DRAFT`.',
			),
		materials: z
			.array(MaterialSchema)
			.optional()
			.describe(
				'Additional materials. A course work material must have no more than 20 material items.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this course work material in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this course work material in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			),
		creatorUserId: z
			.string()
			.describe(
				'Identifier for the user that created the course work material. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the user that created the course work material. Read-only.',
			),
		updateTime: z
			.string()
			.describe(
				'Timestamp of the most recent change to this course work material. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp of the most recent change to this course work material. Read-only.',
			),
		individualStudentsOptions:
			IndividualStudentsOptionsSchema.optional().describe(
				'Identifiers of students with access to the course work material. This field is set only if `assigneeMode` is `INDIVIDUAL_STUDENTS`. If the `assigneeMode` is `INDIVIDUAL_STUDENTS`, then only students specified in this field can see the course work material.',
			),
		description: z
			.string()
			.describe(
				'Optional description of this course work material. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			)
			.optional()
			.describe(
				'Optional description of this course work material. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			),
		topicId: z
			.string()
			.describe(
				'Identifier for the topic that this course work material is associated with. Must match an existing topic in the course.',
			)
			.optional()
			.describe(
				'Identifier for the topic that this course work material is associated with. Must match an existing topic in the course.',
			),
		creationTime: z
			.string()
			.describe(
				'Timestamp when this course work material was created. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp when this course work material was created. Read-only.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Assignee mode of the course work material. If unspecified, the default value is `ALL_STUDENTS`.',
			),
		title: z
			.string()
			.describe(
				'Title of this course work material. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			)
			.optional()
			.describe(
				'Title of this course work material. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier of this course work material, unique per course. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier of this course work material, unique per course. Read-only.',
			),
	})
	.strict();
const CourseWorkMaterialResponseSchema = z
	.object({
		scheduledTime: z
			.string()
			.describe(
				'Optional timestamp when this course work material is scheduled to be published.',
			)
			.optional()
			.describe(
				'Optional timestamp when this course work material is scheduled to be published.',
			),
		state: z
			.enum([
				'COURSEWORK_MATERIAL_STATE_UNSPECIFIED',
				'PUBLISHED',
				'DRAFT',
				'DELETED',
			])
			.optional()
			.describe(
				'Status of this course work material. If unspecified, the default state is `DRAFT`.',
			),
		materials: z
			.array(MaterialResponseSchema)
			.optional()
			.describe(
				'Additional materials. A course work material must have no more than 20 material items.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this course work material in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this course work material in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			),
		creatorUserId: z
			.string()
			.describe(
				'Identifier for the user that created the course work material. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the user that created the course work material. Read-only.',
			),
		updateTime: z
			.string()
			.describe(
				'Timestamp of the most recent change to this course work material. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp of the most recent change to this course work material. Read-only.',
			),
		individualStudentsOptions:
			IndividualStudentsOptionsResponseSchema.optional().describe(
				'Identifiers of students with access to the course work material. This field is set only if `assigneeMode` is `INDIVIDUAL_STUDENTS`. If the `assigneeMode` is `INDIVIDUAL_STUDENTS`, then only students specified in this field can see the course work material.',
			),
		description: z
			.string()
			.describe(
				'Optional description of this course work material. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			)
			.optional()
			.describe(
				'Optional description of this course work material. The text must be a valid UTF-8 string containing no more than 30,000 characters.',
			),
		topicId: z
			.string()
			.describe(
				'Identifier for the topic that this course work material is associated with. Must match an existing topic in the course.',
			)
			.optional()
			.describe(
				'Identifier for the topic that this course work material is associated with. Must match an existing topic in the course.',
			),
		creationTime: z
			.string()
			.describe(
				'Timestamp when this course work material was created. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp when this course work material was created. Read-only.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Assignee mode of the course work material. If unspecified, the default value is `ALL_STUDENTS`.',
			),
		title: z
			.string()
			.describe(
				'Title of this course work material. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			)
			.optional()
			.describe(
				'Title of this course work material. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier of this course work material, unique per course. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier of this course work material, unique per course. Read-only.',
			),
	})
	.strict();

const ListCourseWorkMaterialResponseSchema = z
	.object({
		courseWorkMaterial: z
			.array(CourseWorkMaterialSchema)
			.optional()
			.describe('Course work material items that match the request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListCourseWorkMaterialResponseResponseSchema = z
	.object({
		courseWorkMaterial: z
			.array(CourseWorkMaterialResponseSchema)
			.optional()
			.describe('Course work material items that match the request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const ListGuardianInvitationsResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		guardianInvitations: z
			.array(GuardianInvitationSchema)
			.optional()
			.describe('Guardian invitations that matched the list request.'),
	})
	.strict();
const ListGuardianInvitationsResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		guardianInvitations: z
			.array(GuardianInvitationResponseSchema)
			.optional()
			.describe('Guardian invitations that matched the list request.'),
	})
	.strict();

const StudentGroupSchema = z
	.object({
		title: z
			.string()
			.describe('The title of the student group.')
			.optional()
			.describe('The title of the student group.'),
		id: z
			.string()
			.describe('The identifier of the student group.')
			.optional()
			.describe('The identifier of the student group.'),
		courseId: z
			.string()
			.describe('The identifier of the course.')
			.optional()
			.describe('The identifier of the course.'),
	})
	.strict();
const StudentGroupResponseSchema = z
	.object({
		title: z
			.string()
			.describe('The title of the student group.')
			.optional()
			.describe('The title of the student group.'),
		id: z
			.string()
			.describe('The identifier of the student group.')
			.optional()
			.describe('The identifier of the student group.'),
		courseId: z
			.string()
			.describe('The identifier of the course.')
			.optional()
			.describe('The identifier of the course.'),
	})
	.strict();

const StudentContextSchema = z
	.object({
		submissionId: z
			.string()
			.describe(
				"Requesting user's submission id to be used for grade passback and to identify the student when showing student work to the teacher. This is set exactly when `supportsStudentWork` is `true`.",
			)
			.optional()
			.describe(
				"Requesting user's submission id to be used for grade passback and to identify the student when showing student work to the teacher. This is set exactly when `supportsStudentWork` is `true`.",
			),
	})
	.strict();
const StudentContextResponseSchema = z
	.object({
		submissionId: z
			.string()
			.describe(
				"Requesting user's submission id to be used for grade passback and to identify the student when showing student work to the teacher. This is set exactly when `supportsStudentWork` is `true`.",
			)
			.optional()
			.describe(
				"Requesting user's submission id to be used for grade passback and to identify the student when showing student work to the teacher. This is set exactly when `supportsStudentWork` is `true`.",
			),
	})
	.strict();

const AddOnContextSchema = z
	.object({
		supportsStudentWork: z
			.boolean()
			.describe(
				'Optional. Whether the post allows the teacher to see student work and passback grades.',
			)
			.optional()
			.describe(
				'Optional. Whether the post allows the teacher to see student work and passback grades.',
			),
		teacherContext: TeacherContextSchema.optional().describe(
			"Add-on context corresponding to the requesting user's role as a teacher. Its presence implies that the requesting user is a teacher in the course.",
		),
		studentContext: StudentContextSchema.optional().describe(
			"Add-on context corresponding to the requesting user's role as a student. Its presence implies that the requesting user is a student in the course.",
		),
		courseId: z
			.string()
			.describe('Immutable. Identifier of the course.')
			.optional()
			.describe('Immutable. Identifier of the course.'),
		postId: z
			.string()
			.describe('Immutable. Deprecated, use `item_id` instead.')
			.optional()
			.describe('Immutable. Deprecated, use `item_id` instead.'),
		itemId: z
			.string()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			)
			.optional()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			),
	})
	.strict();
const AddOnContextResponseSchema = z
	.object({
		supportsStudentWork: z
			.boolean()
			.describe(
				'Optional. Whether the post allows the teacher to see student work and passback grades.',
			)
			.optional()
			.describe(
				'Optional. Whether the post allows the teacher to see student work and passback grades.',
			),
		teacherContext: TeacherContextResponseSchema.optional().describe(
			"Add-on context corresponding to the requesting user's role as a teacher. Its presence implies that the requesting user is a teacher in the course.",
		),
		studentContext: StudentContextResponseSchema.optional().describe(
			"Add-on context corresponding to the requesting user's role as a student. Its presence implies that the requesting user is a student in the course.",
		),
		courseId: z
			.string()
			.describe('Immutable. Identifier of the course.')
			.optional()
			.describe('Immutable. Identifier of the course.'),
		postId: z
			.string()
			.describe('Immutable. Deprecated, use `item_id` instead.')
			.optional()
			.describe('Immutable. Deprecated, use `item_id` instead.'),
		itemId: z
			.string()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			)
			.optional()
			.describe(
				'Immutable. Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached.',
			),
	})
	.strict();

const ListInvitationsResponseSchema = z
	.object({
		invitations: z
			.array(InvitationSchema)
			.optional()
			.describe('Invitations that match the list request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListInvitationsResponseResponseSchema = z
	.object({
		invitations: z
			.array(InvitationResponseSchema)
			.optional()
			.describe('Invitations that match the list request.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const TopicSchema = z
	.object({
		topicId: z
			.string()
			.describe('Unique identifier for the topic. Read-only.')
			.optional()
			.describe('Unique identifier for the topic. Read-only.'),
		updateTime: z
			.string()
			.describe('The time the topic was last updated by the system. Read-only.')
			.optional()
			.describe(
				'The time the topic was last updated by the system. Read-only.',
			),
		name: z
			.string()
			.describe(
				'The name of the topic, generated by the user. Leading and trailing whitespaces, if any, are trimmed. Also, multiple consecutive whitespaces are collapsed into one inside the name. The result must be a non-empty string. Topic names are case sensitive, and must be no longer than 100 characters.',
			)
			.optional()
			.describe(
				'The name of the topic, generated by the user. Leading and trailing whitespaces, if any, are trimmed. Also, multiple consecutive whitespaces are collapsed into one inside the name. The result must be a non-empty string. Topic names are case sensitive, and must be no longer than 100 characters.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
	})
	.strict();
const TopicResponseSchema = z
	.object({
		topicId: z
			.string()
			.describe('Unique identifier for the topic. Read-only.')
			.optional()
			.describe('Unique identifier for the topic. Read-only.'),
		updateTime: z
			.string()
			.describe('The time the topic was last updated by the system. Read-only.')
			.optional()
			.describe(
				'The time the topic was last updated by the system. Read-only.',
			),
		name: z
			.string()
			.describe(
				'The name of the topic, generated by the user. Leading and trailing whitespaces, if any, are trimmed. Also, multiple consecutive whitespaces are collapsed into one inside the name. The result must be a non-empty string. Topic names are case sensitive, and must be no longer than 100 characters.',
			)
			.optional()
			.describe(
				'The name of the topic, generated by the user. Leading and trailing whitespaces, if any, are trimmed. Also, multiple consecutive whitespaces are collapsed into one inside the name. The result must be a non-empty string. Topic names are case sensitive, and must be no longer than 100 characters.',
			),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
	})
	.strict();

const CourseWorkSchema = z
	.object({
		gradingPeriodId: z
			.string()
			.describe(
				'Identifier of the grading period associated with the coursework. * At creation, if unspecified, the grading period ID will be set based on the `dueDate` (or `scheduledTime` if no `dueDate` is set). * To indicate no association to any grading period, set this field to an empty string (""). * If specified, it must match an existing grading period ID in the course.',
			)
			.optional()
			.describe(
				'Identifier of the grading period associated with the coursework. * At creation, if unspecified, the grading period ID will be set based on the `dueDate` (or `scheduledTime` if no `dueDate` is set). * To indicate no association to any grading period, set this field to an empty string (""). * If specified, it must match an existing grading period ID in the course.',
			),
		creationTime: z
			.string()
			.describe('Timestamp when this course work was created. Read-only.')
			.optional()
			.describe('Timestamp when this course work was created. Read-only.'),
		state: z
			.enum(['COURSE_WORK_STATE_UNSPECIFIED', 'PUBLISHED', 'DRAFT', 'DELETED'])
			.optional()
			.describe(
				'Status of this course work. If unspecified, the default state is `DRAFT`.',
			),
		dueDate: DateSchema.optional().describe(
			'Optional date, in UTC, that submissions for this course work are due. This must be specified if `due_time` is specified.',
		),
		topicId: z
			.string()
			.describe(
				'Identifier for the topic that this coursework is associated with. Must match an existing topic in the course.',
			)
			.optional()
			.describe(
				'Identifier for the topic that this coursework is associated with. Must match an existing topic in the course.',
			),
		gradeCategory: GradeCategorySchema.optional().describe(
			"The category that this coursework's grade contributes to. Present only when a category has been chosen for the coursework. May be used in calculating the overall grade. Read-only.",
		),
		materials: z
			.array(MaterialSchema)
			.optional()
			.describe(
				'Additional materials. CourseWork must have no more than 20 material items.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Assignee mode of the coursework. If unspecified, the default value is `ALL_STUDENTS`.',
			),
		associatedWithDeveloper: z
			.boolean()
			.describe(
				'Whether this course work item is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			)
			.optional()
			.describe(
				'Whether this course work item is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			),
		updateTime: z
			.string()
			.describe(
				'Timestamp of the most recent change to this course work. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp of the most recent change to this course work. Read-only.',
			),
		description: z
			.string()
			.describe(
				'Optional description of this course work. If set, the description must be a valid UTF-8 string containing no more than 30,000 characters.',
			)
			.optional()
			.describe(
				'Optional description of this course work. If set, the description must be a valid UTF-8 string containing no more than 30,000 characters.',
			),
		dueTime: TimeOfDaySchema.optional().describe(
			'Optional time of day, in UTC, that submissions for this course work are due. This must be specified if `due_date` is specified.',
		),
		multipleChoiceQuestion: MultipleChoiceQuestionSchema.optional().describe(
			'Multiple choice question details. For read operations, this field is populated only when `work_type` is `MULTIPLE_CHOICE_QUESTION`. For write operations, this field must be specified when creating course work with a `work_type` of `MULTIPLE_CHOICE_QUESTION`, and it must not be set otherwise.',
		),
		maxPoints: z
			.number()
			.describe(
				'Maximum grade for this course work. If zero or unspecified, this assignment is considered ungraded. This must be a non-negative integer value.',
			)
			.optional()
			.describe(
				'Maximum grade for this course work. If zero or unspecified, this assignment is considered ungraded. This must be a non-negative integer value.',
			),
		assignment: AssignmentSchema.optional().describe(
			'Assignment details. This is populated only when `work_type` is `ASSIGNMENT`. Read-only.',
		),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		submissionModificationMode: z
			.enum([
				'SUBMISSION_MODIFICATION_MODE_UNSPECIFIED',
				'MODIFIABLE_UNTIL_TURNED_IN',
				'MODIFIABLE',
			])
			.optional()
			.describe(
				'Setting to determine when students are allowed to modify submissions. If unspecified, the default value is `MODIFIABLE_UNTIL_TURNED_IN`.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier of this course work, unique per course. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier of this course work, unique per course. Read-only.',
			),
		workType: z
			.enum([
				'COURSE_WORK_TYPE_UNSPECIFIED',
				'ASSIGNMENT',
				'SHORT_ANSWER_QUESTION',
				'MULTIPLE_CHOICE_QUESTION',
			])
			.optional()
			.describe(
				'Type of this course work. The type is set when the course work is created and cannot be changed.',
			),
		title: z
			.string()
			.describe(
				'Title of this course work. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			)
			.optional()
			.describe(
				'Title of this course work. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			),
		scheduledTime: z
			.string()
			.describe(
				'Optional timestamp when this course work is scheduled to be published.',
			)
			.optional()
			.describe(
				'Optional timestamp when this course work is scheduled to be published.',
			),
		individualStudentsOptions:
			IndividualStudentsOptionsSchema.optional().describe(
				'Identifiers of students with access to the coursework. This field is set only if `assigneeMode` is `INDIVIDUAL_STUDENTS`. If the `assigneeMode` is `INDIVIDUAL_STUDENTS`, then only students specified in this field are assigned the coursework.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this course work in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this course work in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			),
		creatorUserId: z
			.string()
			.describe(
				'Identifier for the user that created the coursework. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the user that created the coursework. Read-only.',
			),
	})
	.strict();
const CourseWorkResponseSchema = z
	.object({
		gradingPeriodId: z
			.string()
			.describe(
				'Identifier of the grading period associated with the coursework. * At creation, if unspecified, the grading period ID will be set based on the `dueDate` (or `scheduledTime` if no `dueDate` is set). * To indicate no association to any grading period, set this field to an empty string (""). * If specified, it must match an existing grading period ID in the course.',
			)
			.optional()
			.describe(
				'Identifier of the grading period associated with the coursework. * At creation, if unspecified, the grading period ID will be set based on the `dueDate` (or `scheduledTime` if no `dueDate` is set). * To indicate no association to any grading period, set this field to an empty string (""). * If specified, it must match an existing grading period ID in the course.',
			),
		creationTime: z
			.string()
			.describe('Timestamp when this course work was created. Read-only.')
			.optional()
			.describe('Timestamp when this course work was created. Read-only.'),
		state: z
			.enum(['COURSE_WORK_STATE_UNSPECIFIED', 'PUBLISHED', 'DRAFT', 'DELETED'])
			.optional()
			.describe(
				'Status of this course work. If unspecified, the default state is `DRAFT`.',
			),
		dueDate: DateResponseSchema.optional().describe(
			'Optional date, in UTC, that submissions for this course work are due. This must be specified if `due_time` is specified.',
		),
		topicId: z
			.string()
			.describe(
				'Identifier for the topic that this coursework is associated with. Must match an existing topic in the course.',
			)
			.optional()
			.describe(
				'Identifier for the topic that this coursework is associated with. Must match an existing topic in the course.',
			),
		gradeCategory: GradeCategoryResponseSchema.optional().describe(
			"The category that this coursework's grade contributes to. Present only when a category has been chosen for the coursework. May be used in calculating the overall grade. Read-only.",
		),
		materials: z
			.array(MaterialResponseSchema)
			.optional()
			.describe(
				'Additional materials. CourseWork must have no more than 20 material items.',
			),
		assigneeMode: z
			.enum([
				'ASSIGNEE_MODE_UNSPECIFIED',
				'ALL_STUDENTS',
				'INDIVIDUAL_STUDENTS',
			])
			.optional()
			.describe(
				'Assignee mode of the coursework. If unspecified, the default value is `ALL_STUDENTS`.',
			),
		associatedWithDeveloper: z
			.boolean()
			.describe(
				'Whether this course work item is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			)
			.optional()
			.describe(
				'Whether this course work item is associated with the Developer Console project making the request. See CreateCourseWork for more details. Read-only.',
			),
		updateTime: z
			.string()
			.describe(
				'Timestamp of the most recent change to this course work. Read-only.',
			)
			.optional()
			.describe(
				'Timestamp of the most recent change to this course work. Read-only.',
			),
		description: z
			.string()
			.describe(
				'Optional description of this course work. If set, the description must be a valid UTF-8 string containing no more than 30,000 characters.',
			)
			.optional()
			.describe(
				'Optional description of this course work. If set, the description must be a valid UTF-8 string containing no more than 30,000 characters.',
			),
		dueTime: TimeOfDayResponseSchema.optional().describe(
			'Optional time of day, in UTC, that submissions for this course work are due. This must be specified if `due_date` is specified.',
		),
		multipleChoiceQuestion:
			MultipleChoiceQuestionResponseSchema.optional().describe(
				'Multiple choice question details. For read operations, this field is populated only when `work_type` is `MULTIPLE_CHOICE_QUESTION`. For write operations, this field must be specified when creating course work with a `work_type` of `MULTIPLE_CHOICE_QUESTION`, and it must not be set otherwise.',
			),
		maxPoints: z
			.number()
			.describe(
				'Maximum grade for this course work. If zero or unspecified, this assignment is considered ungraded. This must be a non-negative integer value.',
			)
			.optional()
			.describe(
				'Maximum grade for this course work. If zero or unspecified, this assignment is considered ungraded. This must be a non-negative integer value.',
			),
		assignment: AssignmentResponseSchema.optional().describe(
			'Assignment details. This is populated only when `work_type` is `ASSIGNMENT`. Read-only.',
		),
		courseId: z
			.string()
			.describe('Identifier of the course. Read-only.')
			.optional()
			.describe('Identifier of the course. Read-only.'),
		submissionModificationMode: z
			.enum([
				'SUBMISSION_MODIFICATION_MODE_UNSPECIFIED',
				'MODIFIABLE_UNTIL_TURNED_IN',
				'MODIFIABLE',
			])
			.optional()
			.describe(
				'Setting to determine when students are allowed to modify submissions. If unspecified, the default value is `MODIFIABLE_UNTIL_TURNED_IN`.',
			),
		id: z
			.string()
			.describe(
				'Classroom-assigned identifier of this course work, unique per course. Read-only.',
			)
			.optional()
			.describe(
				'Classroom-assigned identifier of this course work, unique per course. Read-only.',
			),
		workType: z
			.enum([
				'COURSE_WORK_TYPE_UNSPECIFIED',
				'ASSIGNMENT',
				'SHORT_ANSWER_QUESTION',
				'MULTIPLE_CHOICE_QUESTION',
			])
			.optional()
			.describe(
				'Type of this course work. The type is set when the course work is created and cannot be changed.',
			),
		title: z
			.string()
			.describe(
				'Title of this course work. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			)
			.optional()
			.describe(
				'Title of this course work. The title must be a valid UTF-8 string containing between 1 and 3000 characters.',
			),
		scheduledTime: z
			.string()
			.describe(
				'Optional timestamp when this course work is scheduled to be published.',
			)
			.optional()
			.describe(
				'Optional timestamp when this course work is scheduled to be published.',
			),
		individualStudentsOptions:
			IndividualStudentsOptionsResponseSchema.optional().describe(
				'Identifiers of students with access to the coursework. This field is set only if `assigneeMode` is `INDIVIDUAL_STUDENTS`. If the `assigneeMode` is `INDIVIDUAL_STUDENTS`, then only students specified in this field are assigned the coursework.',
			),
		alternateLink: z
			.string()
			.describe(
				'Absolute link to this course work in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			)
			.optional()
			.describe(
				'Absolute link to this course work in the Classroom web UI. This is only populated if `state` is `PUBLISHED`. Read-only.',
			),
		creatorUserId: z
			.string()
			.describe(
				'Identifier for the user that created the coursework. Read-only.',
			)
			.optional()
			.describe(
				'Identifier for the user that created the coursework. Read-only.',
			),
	})
	.strict();

const GuardianSchema = z
	.object({
		guardianProfile: UserProfileSchema.optional().describe(
			'User profile for the guardian.',
		),
		studentId: z
			.string()
			.describe(
				'Identifier for the student to whom the guardian relationship applies.',
			)
			.optional()
			.describe(
				'Identifier for the student to whom the guardian relationship applies.',
			),
		guardianId: z
			.string()
			.describe('Identifier for the guardian.')
			.optional()
			.describe('Identifier for the guardian.'),
		invitedEmailAddress: z
			.string()
			.describe(
				'The email address to which the initial guardian invitation was sent. This field is only visible to domain administrators.',
			)
			.optional()
			.describe(
				'The email address to which the initial guardian invitation was sent. This field is only visible to domain administrators.',
			),
	})
	.strict();
const GuardianResponseSchema = z
	.object({
		guardianProfile: UserProfileResponseSchema.optional().describe(
			'User profile for the guardian.',
		),
		studentId: z
			.string()
			.describe(
				'Identifier for the student to whom the guardian relationship applies.',
			)
			.optional()
			.describe(
				'Identifier for the student to whom the guardian relationship applies.',
			),
		guardianId: z
			.string()
			.describe('Identifier for the guardian.')
			.optional()
			.describe('Identifier for the guardian.'),
		invitedEmailAddress: z
			.string()
			.describe(
				'The email address to which the initial guardian invitation was sent. This field is only visible to domain administrators.',
			)
			.optional()
			.describe(
				'The email address to which the initial guardian invitation was sent. This field is only visible to domain administrators.',
			),
	})
	.strict();

const ListGuardiansResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		guardians: z
			.array(GuardianSchema)
			.optional()
			.describe(
				'Guardians on this page of results that met the criteria specified in the request.',
			),
	})
	.strict();
const ListGuardiansResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		guardians: z
			.array(GuardianResponseSchema)
			.optional()
			.describe(
				'Guardians on this page of results that met the criteria specified in the request.',
			),
	})
	.strict();

const ListStudentGroupsResponseSchema = z
	.object({
		studentGroups: z
			.array(StudentGroupSchema)
			.optional()
			.describe('The student groups.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();
const ListStudentGroupsResponseResponseSchema = z
	.object({
		studentGroups: z
			.array(StudentGroupResponseSchema)
			.optional()
			.describe('The student groups.'),
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
	})
	.strict();

const ListCourseWorkResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		courseWork: z
			.array(CourseWorkSchema)
			.optional()
			.describe('Course work items that match the request.'),
	})
	.strict();
const ListCourseWorkResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		courseWork: z
			.array(CourseWorkResponseSchema)
			.optional()
			.describe('Course work items that match the request.'),
	})
	.strict();

const ListTopicResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		topic: z
			.array(TopicSchema)
			.optional()
			.describe('Topic items that match the request.'),
	})
	.strict();
const ListTopicResponseResponseSchema = z
	.object({
		nextPageToken: z
			.string()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			)
			.optional()
			.describe(
				'Token identifying the next page of results to return. If empty, no further results are available.',
			),
		topic: z
			.array(TopicResponseSchema)
			.optional()
			.describe('Topic items that match the request.'),
	})
	.strict();

export const GoogleClassroomModelSchemas = {
	CloudPubsubTopic: CloudPubsubTopicSchema,
	DriveFolder: DriveFolderSchema,
	Assignment: AssignmentSchema,
	GeminiGem: GeminiGemSchema,
	YouTubeVideo: YouTubeVideoSchema,
	Form: FormSchema,
	DriveFile: DriveFileSchema,
	SharedDriveFile: SharedDriveFileSchema,
	NotebookLmNotebook: NotebookLmNotebookSchema,
	Link: LinkSchema,
	Material: MaterialSchema,
	IndividualStudentsOptions: IndividualStudentsOptionsSchema,
	Announcement: AnnouncementSchema,
	TimeOfDay: TimeOfDaySchema,
	ModifyIndividualStudentsOptions: ModifyIndividualStudentsOptionsSchema,
	ModifyAnnouncementAssigneesRequest: ModifyAnnouncementAssigneesRequestSchema,
	ReclaimStudentSubmissionRequest: ReclaimStudentSubmissionRequestSchema,
	Name: NameSchema,
	GlobalPermission: GlobalPermissionSchema,
	UserProfile: UserProfileSchema,
	Student: StudentSchema,
	ListStudentsResponse: ListStudentsResponseSchema,
	AddOnAttachmentStudentSubmission: AddOnAttachmentStudentSubmissionSchema,
	ListAddOnAttachmentStudentSubmissionsResponse:
		ListAddOnAttachmentStudentSubmissionsResponseSchema,
	Date: DateSchema,
	GradingPeriod: GradingPeriodSchema,
	GradingPeriodSettings: GradingPeriodSettingsSchema,
	Level: LevelSchema,
	Criterion: CriterionSchema,
	Rubric: RubricSchema,
	MultipleChoiceQuestion: MultipleChoiceQuestionSchema,
	GradeHistory: GradeHistorySchema,
	CourseRosterChangesInfo: CourseRosterChangesInfoSchema,
	CopyHistory: CopyHistorySchema,
	Attachment: AttachmentSchema,
	CourseAlias: CourseAliasSchema,
	ListCourseAliasesResponse: ListCourseAliasesResponseSchema,
	RubricGrade: RubricGradeSchema,
	ListRubricsResponse: ListRubricsResponseSchema,
	ModifyCourseWorkAssigneesRequest: ModifyCourseWorkAssigneesRequestSchema,
	GradeCategory: GradeCategorySchema,
	GradebookSettings: GradebookSettingsSchema,
	CourseMaterial: CourseMaterialSchema,
	CourseMaterialSet: CourseMaterialSetSchema,
	Course: CourseSchema,
	ListCoursesResponse: ListCoursesResponseSchema,
	StudentGroupMember: StudentGroupMemberSchema,
	ListStudentGroupMembersResponse: ListStudentGroupMembersResponseSchema,
	Empty: EmptySchema,
	AssignmentSubmission: AssignmentSubmissionSchema,
	StateHistory: StateHistorySchema,
	SubmissionHistory: SubmissionHistorySchema,
	CourseWorkChangesInfo: CourseWorkChangesInfoSchema,
	Feed: FeedSchema,
	Registration: RegistrationSchema,
	ListAnnouncementsResponse: ListAnnouncementsResponseSchema,
	TeacherContext: TeacherContextSchema,
	TurnInStudentSubmissionRequest: TurnInStudentSubmissionRequestSchema,
	Invitation: InvitationSchema,
	EmbedUri: EmbedUriSchema,
	ModifyAttachmentsRequest: ModifyAttachmentsRequestSchema,
	ReturnStudentSubmissionRequest: ReturnStudentSubmissionRequestSchema,
	AddOnAttachment: AddOnAttachmentSchema,
	ListAddOnAttachmentsResponse: ListAddOnAttachmentsResponseSchema,
	Teacher: TeacherSchema,
	ListTeachersResponse: ListTeachersResponseSchema,
	GuardianInvitation: GuardianInvitationSchema,
	MultipleChoiceSubmission: MultipleChoiceSubmissionSchema,
	ShortAnswerSubmission: ShortAnswerSubmissionSchema,
	StudentSubmission: StudentSubmissionSchema,
	ListStudentSubmissionsResponse: ListStudentSubmissionsResponseSchema,
	CourseWorkMaterial: CourseWorkMaterialSchema,
	ListCourseWorkMaterialResponse: ListCourseWorkMaterialResponseSchema,
	ListGuardianInvitationsResponse: ListGuardianInvitationsResponseSchema,
	StudentGroup: StudentGroupSchema,
	StudentContext: StudentContextSchema,
	AddOnContext: AddOnContextSchema,
	ListInvitationsResponse: ListInvitationsResponseSchema,
	Topic: TopicSchema,
	CourseWork: CourseWorkSchema,
	Guardian: GuardianSchema,
	ListGuardiansResponse: ListGuardiansResponseSchema,
	ListStudentGroupsResponse: ListStudentGroupsResponseSchema,
	ListCourseWorkResponse: ListCourseWorkResponseSchema,
	ListTopicResponse: ListTopicResponseSchema,
} as const;

export const GoogleClassroomResponseSchemas = {
	CloudPubsubTopic: CloudPubsubTopicResponseSchema,
	DriveFolder: DriveFolderResponseSchema,
	Assignment: AssignmentResponseSchema,
	GeminiGem: GeminiGemResponseSchema,
	YouTubeVideo: YouTubeVideoResponseSchema,
	Form: FormResponseSchema,
	DriveFile: DriveFileResponseSchema,
	SharedDriveFile: SharedDriveFileResponseSchema,
	NotebookLmNotebook: NotebookLmNotebookResponseSchema,
	Link: LinkResponseSchema,
	Material: MaterialResponseSchema,
	IndividualStudentsOptions: IndividualStudentsOptionsResponseSchema,
	Announcement: AnnouncementResponseSchema,
	TimeOfDay: TimeOfDayResponseSchema,
	ModifyIndividualStudentsOptions:
		ModifyIndividualStudentsOptionsResponseSchema,
	ModifyAnnouncementAssigneesRequest:
		ModifyAnnouncementAssigneesRequestResponseSchema,
	ReclaimStudentSubmissionRequest:
		ReclaimStudentSubmissionRequestResponseSchema,
	Name: NameResponseSchema,
	GlobalPermission: GlobalPermissionResponseSchema,
	UserProfile: UserProfileResponseSchema,
	Student: StudentResponseSchema,
	ListStudentsResponse: ListStudentsResponseResponseSchema,
	AddOnAttachmentStudentSubmission:
		AddOnAttachmentStudentSubmissionResponseSchema,
	ListAddOnAttachmentStudentSubmissionsResponse:
		ListAddOnAttachmentStudentSubmissionsResponseResponseSchema,
	Date: DateResponseSchema,
	GradingPeriod: GradingPeriodResponseSchema,
	GradingPeriodSettings: GradingPeriodSettingsResponseSchema,
	Level: LevelResponseSchema,
	Criterion: CriterionResponseSchema,
	Rubric: RubricResponseSchema,
	MultipleChoiceQuestion: MultipleChoiceQuestionResponseSchema,
	GradeHistory: GradeHistoryResponseSchema,
	CourseRosterChangesInfo: CourseRosterChangesInfoResponseSchema,
	CopyHistory: CopyHistoryResponseSchema,
	Attachment: AttachmentResponseSchema,
	CourseAlias: CourseAliasResponseSchema,
	ListCourseAliasesResponse: ListCourseAliasesResponseResponseSchema,
	RubricGrade: RubricGradeResponseSchema,
	ListRubricsResponse: ListRubricsResponseResponseSchema,
	ModifyCourseWorkAssigneesRequest:
		ModifyCourseWorkAssigneesRequestResponseSchema,
	GradeCategory: GradeCategoryResponseSchema,
	GradebookSettings: GradebookSettingsResponseSchema,
	CourseMaterial: CourseMaterialResponseSchema,
	CourseMaterialSet: CourseMaterialSetResponseSchema,
	Course: CourseResponseSchema,
	ListCoursesResponse: ListCoursesResponseResponseSchema,
	StudentGroupMember: StudentGroupMemberResponseSchema,
	ListStudentGroupMembersResponse:
		ListStudentGroupMembersResponseResponseSchema,
	Empty: EmptyResponseSchema,
	AssignmentSubmission: AssignmentSubmissionResponseSchema,
	StateHistory: StateHistoryResponseSchema,
	SubmissionHistory: SubmissionHistoryResponseSchema,
	CourseWorkChangesInfo: CourseWorkChangesInfoResponseSchema,
	Feed: FeedResponseSchema,
	Registration: RegistrationResponseSchema,
	ListAnnouncementsResponse: ListAnnouncementsResponseResponseSchema,
	TeacherContext: TeacherContextResponseSchema,
	TurnInStudentSubmissionRequest: TurnInStudentSubmissionRequestResponseSchema,
	Invitation: InvitationResponseSchema,
	EmbedUri: EmbedUriResponseSchema,
	ModifyAttachmentsRequest: ModifyAttachmentsRequestResponseSchema,
	ReturnStudentSubmissionRequest: ReturnStudentSubmissionRequestResponseSchema,
	AddOnAttachment: AddOnAttachmentResponseSchema,
	ListAddOnAttachmentsResponse: ListAddOnAttachmentsResponseResponseSchema,
	Teacher: TeacherResponseSchema,
	ListTeachersResponse: ListTeachersResponseResponseSchema,
	GuardianInvitation: GuardianInvitationResponseSchema,
	MultipleChoiceSubmission: MultipleChoiceSubmissionResponseSchema,
	ShortAnswerSubmission: ShortAnswerSubmissionResponseSchema,
	StudentSubmission: StudentSubmissionResponseSchema,
	ListStudentSubmissionsResponse: ListStudentSubmissionsResponseResponseSchema,
	CourseWorkMaterial: CourseWorkMaterialResponseSchema,
	ListCourseWorkMaterialResponse: ListCourseWorkMaterialResponseResponseSchema,
	ListGuardianInvitationsResponse:
		ListGuardianInvitationsResponseResponseSchema,
	StudentGroup: StudentGroupResponseSchema,
	StudentContext: StudentContextResponseSchema,
	AddOnContext: AddOnContextResponseSchema,
	ListInvitationsResponse: ListInvitationsResponseResponseSchema,
	Topic: TopicResponseSchema,
	CourseWork: CourseWorkResponseSchema,
	Guardian: GuardianResponseSchema,
	ListGuardiansResponse: ListGuardiansResponseResponseSchema,
	ListStudentGroupsResponse: ListStudentGroupsResponseResponseSchema,
	ListCourseWorkResponse: ListCourseWorkResponseResponseSchema,
	ListTopicResponse: ListTopicResponseResponseSchema,
} as const;

export type GoogleClassroomModelName = keyof typeof GoogleClassroomModelSchemas;
