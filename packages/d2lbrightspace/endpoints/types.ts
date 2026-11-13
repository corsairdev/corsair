import { z } from 'zod';

// D2L IDs are path segments. Reject traversal and path delimiters before encoding.
export const D2LIdSchema = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Invalid Brightspace ID',
	);

export const RoleSchema = z
	.object({
		Identifier: z.string(),
		DisplayName: z.string(),
		Code: z.string(),
		Description: z.string().optional(),
		RoleAlias: z.string().optional(),
		IsCascading: z.boolean().optional(),
		AccessFutureCourses: z.boolean().optional(),
		AccessInactiveCourses: z.boolean().optional(),
		AccessPastCourses: z.boolean().optional(),
		ShowInGrades: z.boolean().optional(),
		ShowInUserProgress: z.boolean().optional(),
		InClassList: z.boolean().optional(),
	})
	.passthrough();

export const WhoAmISchema = z
	.object({
		Identifier: z.string(),
		FirstName: z.string(),
		LastName: z.string(),
		UniqueName: z.string(),
		ProfileIdentifier: z.string(),
		Pronouns: z.string().nullable().optional(),
	})
	.passthrough();

const activation = z.object({ IsActive: z.boolean() });
const userNamePart = z.string().refine((value) => value.trim().length > 0, {
	message: 'Name must not be blank',
});
const user = z
	.object({
		OrgId: z.number(),
		UserId: z.number(),
		FirstName: z.string().optional(),
		MiddleName: z.string().nullable().optional(),
		LastName: z.string().optional(),
		UserName: z.string().optional(),
		ExternalEmail: z.string().nullable().optional(),
		OrgDefinedId: z.string().nullable().optional(),
		UniqueIdentifier: z.string().optional(),
		Activation: activation.optional(),
		DisplayName: z.string().optional(),
		LastAccessedDate: z.string().nullable().optional(),
		Pronouns: z.string().optional(),
		FirstLoginDate: z.string().nullable().optional(),
	})
	.passthrough();
const createUserBody = z.object({
	OrgDefinedId: z.string().nullable(),
	FirstName: userNamePart,
	MiddleName: z.string().nullable(),
	LastName: userNamePart,
	ExternalEmail: z.string().nullable(),
	UserName: z.string(),
	RoleId: z.number(),
	IsActive: z.boolean(),
	SendCreationEmail: z.boolean(),
	Pronouns: z.string().nullable(),
	PasswordData: z
		.object({
			Password: z.string(),
			ForcePasswordReset: z.boolean().optional(),
		})
		.nullable()
		.optional(),
});
const updateUserBody = z.object({
	OrgDefinedId: z.string(),
	FirstName: userNamePart,
	MiddleName: z.string().nullable(),
	LastName: userNamePart,
	ExternalEmail: z.string().nullable(),
	UserName: z.string(),
	Activation: activation,
	Pronouns: z.string().nullable(),
});
const userQuery = z
	.object({ subOrganizationOrgUnitId: D2LIdSchema.optional() })
	.optional();
const richTextInput = z.object({
	Content: z.string(),
	Type: z.enum(['Text', 'Html']),
});
const richTextOutput = z
	.object({
		Text: z.string().optional(),
		Html: z.string().nullable().optional(),
	})
	.passthrough();
const code = z
	.string()
	.max(50)
	.refine((value) => !/[\\:*?"<>|'#,%&\r\n]/.test(value));
const template = z
	.object({
		Identifier: z.string(),
		Name: z.string(),
		Code: z.string(),
		Path: z.string(),
	})
	.passthrough();
const orgUnit = z.object({
	Identifier: z.string(),
	Name: z.string(),
	Code: z.string(),
});
const course = template.extend({
	IsActive: z.boolean(),
	StartDate: z.string().nullable(),
	EndDate: z.string().nullable(),
	LocaleId: z.number().nullable().optional(),
	ForceLocale: z.boolean().optional(),
	CourseTemplate: orgUnit.nullable(),
	Semester: orgUnit.nullable(),
	Department: orgUnit.nullable(),
	Description: richTextOutput,
	CanSelfRegister: z.boolean(),
	ShowAddressBook: z.boolean().optional(),
});
const schemaElement = z.object({
	Type: z.object({ Id: z.number(), Code: z.string(), Name: z.string() }),
	IsNotAllowed: z.boolean(),
	IsRequired: z.boolean(),
});
const courseFields = {
	Name: z.string(),
	Code: code,
	StartDate: z.string().nullable(),
	EndDate: z.string().nullable(),
	LocaleId: z.number().nullable(),
	ForceLocale: z.boolean(),
	ShowAddressBook: z.boolean(),
	IsActive: z.boolean(),
	Description: richTextInput,
	CanSelfRegister: z.boolean().nullable(),
};
const demographicEntry = z.object({
	Name: z.string(),
	Values: z.array(z.string()),
});
const demographicUser = z.object({
	UserId: z.number(),
	EntryValues: z.array(demographicEntry),
});
const gradeFields = {
	Name: z.string().max(128),
	ShortName: z.string().max(128),
	CategoryId: z.number().nullable(),
	Description: richTextInput,
	IsHidden: z.boolean().optional(),
};
const gradedFields = {
	MaxPoints: z.number().min(0.01).max(9999999999),
	IsBonus: z.boolean(),
	ExcludeFromFinalGradeCalculation: z.boolean(),
};
const gradeBody = z.discriminatedUnion('GradeType', [
	z.object({
		...gradeFields,
		...gradedFields,
		GradeType: z.literal('Numeric'),
		CanExceedMaxPoints: z.boolean(),
		GradeSchemeId: z.number().nullable(),
	}),
	z.object({
		...gradeFields,
		...gradedFields,
		GradeType: z.literal('PassFail'),
		GradeSchemeId: z.number().nullable(),
	}),
	z.object({
		...gradeFields,
		...gradedFields,
		GradeType: z.literal('SelectBox'),
		GradeSchemeId: z.number(),
	}),
	z.object({ ...gradeFields, GradeType: z.literal('Text') }),
]);
const grade = z
	.object({
		Id: z.number(),
		GradeType: z.string(),
		Name: z.string(),
		ShortName: z.string(),
		CategoryId: z.number().nullable(),
		Description: richTextOutput,
		MaxPoints: z.number().optional(),
		CanExceedMaxPoints: z.boolean().optional(),
		IsBonus: z.boolean().optional(),
		ExcludeFromFinalGradeCalculation: z.boolean().optional(),
		GradeSchemeId: z.number().nullable().optional(),
		Weight: z.number().nullable().optional(),
		GradeSchemeUrl: z.string().optional(),
		IsHidden: z.boolean().optional(),
		AssociatedTool: z
			.object({ ToolId: z.number(), ToolItemId: z.number() })
			.nullable()
			.optional(),
	})
	.passthrough();
const gradeSetup = z.object({
	GradingSystem: z.enum(['Points', 'Weighted', 'Formula']),
	IsNullGradeZero: z.boolean(),
	DefaultGradeSchemeId: z.number(),
});
const accessPage = z.object({
	Next: z.string().nullable(),
	Objects: z.array(z.object({ UserId: z.number(), HasAccess: z.boolean() })),
});
const gradeIdInput = { orgUnitId: D2LIdSchema, gradeObjectId: D2LIdSchema };
const displayedInput = z.object({
	Text: richTextInput,
	IsDisplayed: z.boolean(),
});
const displayedOutput = z.object({
	Text: richTextOutput,
	IsDisplayed: z.boolean(),
});
const quizBody = z.object({
	Name: z.string(),
	IsActive: z.boolean(),
	SortOrder: z.number(),
	AutoExportToGrades: z.boolean().nullable(),
	GradeItemId: z.number().nullable(),
	IsAutoSetGraded: z.boolean(),
	Instructions: displayedInput,
	Description: displayedInput,
	StartDate: z.string().nullable(),
	EndDate: z.string().nullable(),
	DueDate: z.string().nullable(),
	DisplayInCalendar: z.boolean(),
	NumberOfAttemptsAllowed: z.number().min(1).max(10).nullable(),
	LateSubmissionInfo: z.object({
		LateSubmissionOption: z.number(),
		LateLimitMinutes: z.number().nullable(),
	}),
	SubmissionTimeLimit: z.object({
		IsEnforced: z.boolean(),
		ShowClock: z.boolean(),
		TimeLimitValue: z.number(),
	}),
	SubmissionGracePeriod: z.number().nullable(),
	Password: z.string().nullable(),
	Header: displayedInput,
	Footer: displayedInput,
	AllowHints: z.boolean(),
	DisableRightClick: z.boolean(),
	DisablePagerAndAlerts: z.boolean(),
	NotificationEmail: z.string().nullable(),
	CalcTypeId: z.number(),
	RestrictIPAddressRange: z
		.array(
			z.object({ IPRangeStart: z.string(), IPRangeEnd: z.string().nullable() }),
		)
		.nullable(),
	CategoryId: z.number().nullable(),
	PreventMovingBackwards: z.boolean(),
	Shuffle: z.boolean(),
	AllowOnlyUsersWithSpecialAccess: z.boolean(),
	IsRetakeIncorrectOnly: z.boolean(),
	PagingTypeId: z.number().nullable(),
	IsSynchronous: z.boolean(),
	DeductionPercentage: z.number().nullable(),
});
const quiz = z
	.object({
		QuizId: z.number(),
		Name: z.string(),
		IsActive: z.boolean(),
		SortOrder: z.number(),
		AutoExportToGrades: z.boolean().nullable().optional(),
		GradeItemId: z.number().nullable().optional(),
		IsAutoSetGraded: z.boolean().optional(),
		Instructions: displayedOutput.optional(),
		Description: displayedOutput.optional(),
		Header: displayedOutput.optional(),
		Footer: displayedOutput.optional(),
		StartDate: z.string().nullable().optional(),
		EndDate: z.string().nullable().optional(),
		DueDate: z.string().nullable().optional(),
		DisplayInCalendar: z.boolean().optional(),
		AttemptsAllowed: z
			.object({
				IsUnlimited: z.boolean(),
				NumberOfAttemptsAllowed: z.number().nullable(),
			})
			.optional(),
		LateSubmissionInfo: z
			.object({
				LateSubmissionOption: z.number(),
				LateLimitMinutes: z.number().nullable(),
			})
			.optional(),
		SubmissionTimeLimit: z
			.object({
				IsEnforced: z.boolean(),
				ShowClock: z.boolean(),
				TimeLimitValue: z.number(),
			})
			.optional(),
		SubmissionGracePeriod: z.number().nullable().optional(),
		Password: z.string().nullable().optional(),
		AllowHints: z.boolean().optional(),
		DisableRightClick: z.boolean().optional(),
		DisablePagerAndAlerts: z.boolean().optional(),
		NotificationEmail: z.string().nullable().optional(),
		CalcTypeId: z.number().optional(),
		RestrictIPAddressRange: z
			.array(
				z.object({
					IPRangeStart: z.string(),
					IPRangeEnd: z.string().nullable(),
				}),
			)
			.nullable()
			.optional(),
		CategoryId: z.number().nullable().optional(),
		PreventMovingBackwards: z.boolean().optional(),
		Shuffle: z.boolean().optional(),
		ActivityId: z.string().nullable().optional(),
		AllowOnlyUsersWithSpecialAccess: z.boolean().optional(),
		IsRetakeIncorrectOnly: z.boolean().optional(),
		PagingTypeId: z.number().nullable().optional(),
		IsSynchronous: z.boolean().optional(),
		DeductionPercentage: z.number().nullable().optional(),
		HideQuestionPoints: z.boolean().optional(),
		IsSingleSession: z.boolean().optional(),
		AnnotationToolsEnabled: z.boolean().optional(),
	})
	.passthrough();
const quizCategoryBody = z.object({ Name: z.string(), SortOrder: z.number() });
const quizCategory = quizCategoryBody.extend({ CategoryId: z.number() });
const attempt = z.object({
	AttemptId: z.number(),
	QuizId: z.number(),
	UserId: z.number(),
	AttemptNumber: z.number(),
	Score: z.number().nullable(),
	Started: z.string(),
	Completed: z.string().nullable(),
	AttemptFeedback: richTextOutput,
	FeedbackLastModified: z.string().nullable(),
	IsPublished: z.boolean(),
	IsRetakeIncorrectOnly: z.boolean(),
	AttemptDueDate: z.string().nullable(),
	AttemptEnforceTimeLimit: z.boolean(),
	AttemptSubmissionTimeLimit: z.number(),
	AttemptSubmissionGraceLimit: z.number(),
	AttemptSubmissionLateTypeId: z.number(),
	AttemptSubmissionLateData: z.number(),
	AttemptIsSynchronous: z.boolean(),
	DeductionPercentage: z.number().nullable(),
});
const question = z.object({
	QuestionId: z.number(),
	QuestionTypeId: z.number(),
	Name: z.string().nullable(),
	QuestionText: richTextOutput,
	Points: z.number(),
	Difficulty: z.number(),
	Bonus: z.boolean(),
	Mandatory: z.boolean(),
	Hint: richTextOutput,
	Feedback: richTextOutput,
	LastModified: z.string(),
	LastModifiedBy: z.number().nullable(),
	SectionId: z.number(),
	QuestionTemplateId: z.number(),
	QuestionTemplateVersionId: z.number(),
	// QuestionInfo is a provider-defined union varying by question type.
	QuestionInfo: z.record(z.string(), z.unknown()),
});
const page = <T extends z.ZodType>(item: T) =>
	z.object({ Next: z.string().nullable(), Objects: z.array(item) });
const quizIdInput = { orgUnitId: D2LIdSchema, quizId: D2LIdSchema };
const categoryIdInput = { orgUnitId: D2LIdSchema, categoryId: D2LIdSchema };

export const D2LBrightspaceEndpointInputSchemas = {
	currentUser: z.object({}),
	listUsers: z.object({
		query: z
			.object({
				orgDefinedId: z.string().optional(),
				userName: z.string().optional(),
				externalEmail: z.string().optional(),
				bookmark: z.string().optional(),
				subOrganizationOrgUnitId: D2LIdSchema.optional(),
			})
			.optional(),
	}),
	getUser: z.object({ userId: D2LIdSchema, query: userQuery }),
	createUser: z.object({ body: createUserBody, query: userQuery }),
	updateUser: z.object({
		userId: D2LIdSchema,
		body: updateUserBody,
		query: userQuery,
	}),
	deleteUser: z.object({ userId: D2LIdSchema, query: userQuery }),
	getCourse: z.object({ orgUnitId: D2LIdSchema }),
	getCourseSchema: z.object({}),
	createCourse: z.object({
		body: z.object({
			...courseFields,
			Path: z.string(),
			CourseTemplateId: z.number(),
			SemesterId: z.number().nullable(),
		}),
	}),
	updateCourse: z.object({
		orgUnitId: D2LIdSchema,
		body: z.object(courseFields),
	}),
	deleteCourse: z.object({ orgUnitId: D2LIdSchema }),
	getTemplate: z.object({ orgUnitId: D2LIdSchema }),
	getTemplateSchema: z.object({}),
	createTemplate: z.object({
		body: z.object({
			Name: z.string(),
			Code: code,
			Path: z.string(),
			ParentOrgUnitIds: z.array(z.number()),
		}),
	}),
	updateTemplate: z.object({
		orgUnitId: D2LIdSchema,
		body: z.object({ Name: z.string(), Code: code }),
	}),
	deleteTemplate: z.object({ orgUnitId: D2LIdSchema }),
	getOrgUnitDemographics: z.object({
		orgUnitId: D2LIdSchema,
		query: z
			.object({
				fieldIds: z.string().optional(),
				roleIds: z.string().optional(),
				userIds: z.string().optional(),
				search: z.string().optional(),
				bookmark: z.string().optional(),
			})
			.optional(),
	}),
	deleteUserDemographics: z.object({
		userId: D2LIdSchema,
		query: z.object({ entryIds: z.string().optional() }).optional(),
	}),
	listGrades: z.object({ orgUnitId: D2LIdSchema }),
	getGrade: z.object(gradeIdInput),
	createGrade: z.object({ orgUnitId: D2LIdSchema, body: gradeBody }),
	updateGrade: z.object({ ...gradeIdInput, body: gradeBody }),
	deleteGrade: z.object(gradeIdInput),
	getGradeAccess: z.object({
		...gradeIdInput,
		query: z
			.object({
				userId: D2LIdSchema.optional(),
				roleId: D2LIdSchema.optional(),
				bookmark: z.string().optional(),
			})
			.optional(),
		next: z.string().optional(),
	}),
	getGradeStatistics: z.object(gradeIdInput),
	getGradeSetup: z.object({ orgUnitId: D2LIdSchema }),
	updateGradeSetup: z.object({ orgUnitId: D2LIdSchema, body: gradeSetup }),
	listQuizzes: z.object({
		orgUnitId: D2LIdSchema,
		next: z.string().optional(),
	}),
	getQuiz: z.object(quizIdInput),
	createQuiz: z.object({ orgUnitId: D2LIdSchema, body: quizBody }),
	updateQuiz: z.object({ ...quizIdInput, body: quizBody }),
	deleteQuiz: z.object(quizIdInput),
	getQuizAccess: z.object({
		...quizIdInput,
		query: z
			.object({
				userId: D2LIdSchema.optional(),
				roleId: D2LIdSchema.optional(),
			})
			.optional(),
		next: z.string().optional(),
	}),
	listAttempts: z.object({
		...quizIdInput,
		query: z.object({ userId: D2LIdSchema.optional() }).optional(),
		next: z.string().optional(),
	}),
	getAttempt: z.object({ ...quizIdInput, attemptId: D2LIdSchema }),
	listQuestions: z.object({ ...quizIdInput, next: z.string().optional() }),
	listQuizCategories: z.object({
		orgUnitId: D2LIdSchema,
		next: z.string().optional(),
	}),
	getQuizCategory: z.object(categoryIdInput),
	createQuizCategory: z.object({
		orgUnitId: D2LIdSchema,
		body: quizCategoryBody,
	}),
	updateQuizCategory: z.object({ ...categoryIdInput, body: quizCategoryBody }),
	deleteQuizCategory: z.object(categoryIdInput),
	listRoles: z.object({}),
	getRole: z.object({ roleId: D2LIdSchema }),
	getEnrolledRoles: z.object({ orgUnitId: D2LIdSchema }),
	copyRole: z.object({
		deepCopyRoleId: D2LIdSchema,
		body: z.object({ RoleName: z.string().min(1) }),
	}),
} as const;

export const D2LBrightspaceEndpointOutputSchemas = {
	currentUser: WhoAmISchema,
	listUsers: z.union([
		user,
		z.array(user),
		z.object({
			PagingInfo: z.object({
				Bookmark: z.string().nullable(),
				HasMoreItems: z.boolean(),
			}),
			Items: z.array(user),
		}),
	]),
	getUser: user,
	createUser: user,
	updateUser: user,
	deleteUser: z.void(),
	getCourse: course,
	getCourseSchema: z.array(schemaElement),
	createCourse: course,
	updateCourse: z.void(),
	deleteCourse: z.void(),
	getTemplate: template,
	getTemplateSchema: z.array(schemaElement),
	createTemplate: template,
	updateTemplate: z.void(),
	deleteTemplate: z.void(),
	getOrgUnitDemographics: z.object({
		PagingInfo: z.object({
			Bookmark: z.string().nullable(),
			HasMoreItems: z.boolean(),
		}),
		Items: z.array(demographicUser),
	}),
	deleteUserDemographics: z.void(),
	listGrades: z.array(grade),
	getGrade: grade,
	createGrade: grade,
	updateGrade: grade,
	deleteGrade: z.void(),
	getGradeAccess: accessPage,
	getGradeStatistics: z.object({
		OrgUnitId: z.number(),
		GradeObjectId: z.number(),
		Minimum: z.number().nullable(),
		Maximum: z.number().nullable(),
		Average: z.number().nullable(),
		Mode: z.array(z.number()),
		Median: z.number().nullable(),
		StandardDeviation: z.number().nullable(),
	}),
	getGradeSetup: gradeSetup,
	updateGradeSetup: gradeSetup,
	listQuizzes: page(quiz),
	getQuiz: quiz,
	createQuiz: quiz,
	updateQuiz: quiz,
	deleteQuiz: z.void(),
	getQuizAccess: accessPage,
	listAttempts: page(attempt),
	getAttempt: attempt,
	listQuestions: page(question),
	listQuizCategories: page(quizCategory),
	getQuizCategory: quizCategory,
	createQuizCategory: quizCategory,
	updateQuizCategory: quizCategory,
	deleteQuizCategory: z.void(),
	listRoles: z.array(RoleSchema),
	getRole: RoleSchema,
	getEnrolledRoles: z.array(RoleSchema),
	copyRole: RoleSchema,
} as const;

export type D2LBrightspaceEndpointInputs = {
	[K in keyof typeof D2LBrightspaceEndpointInputSchemas]: z.infer<
		(typeof D2LBrightspaceEndpointInputSchemas)[K]
	>;
};
export type D2LBrightspaceEndpointOutputs = {
	[K in keyof typeof D2LBrightspaceEndpointOutputSchemas]: z.infer<
		(typeof D2LBrightspaceEndpointOutputSchemas)[K]
	>;
};
