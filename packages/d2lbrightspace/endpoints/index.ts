import type { D2LBrightspaceEndpoints } from '..';
import { makeD2LBrightspaceRequest, resolveNextPage } from '../client';
import {
	D2LBrightspaceEndpointInputSchemas as inputs,
	D2LBrightspaceEndpointOutputSchemas as outputs,
} from './types';

export const currentUser: D2LBrightspaceEndpoints['currentUser'] = async (
	ctx,
	raw,
) => {
	inputs.currentUser.parse(raw ?? {});
	return outputs.currentUser.parse(
		await makeD2LBrightspaceRequest('/d2l/api/lp/1.49/users/whoami', ctx.key, {
			baseUrl: ctx.options.baseUrl,
		}),
	);
};

export const listUsers: D2LBrightspaceEndpoints['listUsers'] = async (
	ctx,
	raw,
) => {
	const input = inputs.listUsers.parse(raw ?? {});
	return outputs.listUsers.parse(
		await makeD2LBrightspaceRequest('/d2l/api/lp/1.62/users/', ctx.key, {
			baseUrl: ctx.options.baseUrl,
			query: input.query,
		}),
	);
};

export const getUser: D2LBrightspaceEndpoints['getUser'] = async (ctx, raw) => {
	const input = inputs.getUser.parse(raw);
	return outputs.getUser.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/users/${encodeURIComponent(input.userId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, query: input.query },
		),
	);
};

export const createUser: D2LBrightspaceEndpoints['createUser'] = async (
	ctx,
	raw,
) => {
	const input = inputs.createUser.parse(raw);
	return outputs.createUser.parse(
		await makeD2LBrightspaceRequest('/d2l/api/lp/1.62/users/', ctx.key, {
			baseUrl: ctx.options.baseUrl,
			method: 'POST',
			query: input.query,
			body: input.body,
		}),
	);
};

export const updateUser: D2LBrightspaceEndpoints['updateUser'] = async (
	ctx,
	raw,
) => {
	const input = inputs.updateUser.parse(raw);
	return outputs.updateUser.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/users/${encodeURIComponent(input.userId)}`,
			ctx.key,
			{
				baseUrl: ctx.options.baseUrl,
				method: 'PUT',
				query: input.query,
				body: input.body,
			},
		),
	);
};

export const deleteUser: D2LBrightspaceEndpoints['deleteUser'] = async (
	ctx,
	raw,
) => {
	const input = inputs.deleteUser.parse(raw);
	return outputs.deleteUser.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/users/${encodeURIComponent(input.userId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'DELETE', query: input.query },
		),
	);
};

export const getCourse: D2LBrightspaceEndpoints['getCourse'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getCourse.parse(raw);
	return outputs.getCourse.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/courses/${encodeURIComponent(input.orgUnitId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const getCourseSchema: D2LBrightspaceEndpoints['getCourseSchema'] =
	async (ctx, raw) => {
		inputs.getCourseSchema.parse(raw ?? {});
		return outputs.getCourseSchema.parse(
			await makeD2LBrightspaceRequest(
				'/d2l/api/lp/1.62/courses/schema',
				ctx.key,
				{ baseUrl: ctx.options.baseUrl },
			),
		);
	};
export const createCourse: D2LBrightspaceEndpoints['createCourse'] = async (
	ctx,
	raw,
) => {
	const input = inputs.createCourse.parse(raw);
	return outputs.createCourse.parse(
		await makeD2LBrightspaceRequest('/d2l/api/lp/1.62/courses/', ctx.key, {
			baseUrl: ctx.options.baseUrl,
			method: 'POST',
			body: input.body,
		}),
	);
};
export const updateCourse: D2LBrightspaceEndpoints['updateCourse'] = async (
	ctx,
	raw,
) => {
	const input = inputs.updateCourse.parse(raw);
	return outputs.updateCourse.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/courses/${encodeURIComponent(input.orgUnitId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'PUT', body: input.body },
		),
	);
};
export const deleteCourse: D2LBrightspaceEndpoints['deleteCourse'] = async (
	ctx,
	raw,
) => {
	const input = inputs.deleteCourse.parse(raw);
	return outputs.deleteCourse.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/courses/${encodeURIComponent(input.orgUnitId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'DELETE' },
		),
	);
};
export const getTemplate: D2LBrightspaceEndpoints['getTemplate'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getTemplate.parse(raw);
	return outputs.getTemplate.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/coursetemplates/${encodeURIComponent(input.orgUnitId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const getTemplateSchema: D2LBrightspaceEndpoints['getTemplateSchema'] =
	async (ctx, raw) => {
		inputs.getTemplateSchema.parse(raw ?? {});
		return outputs.getTemplateSchema.parse(
			await makeD2LBrightspaceRequest(
				'/d2l/api/lp/1.62/coursetemplates/schema',
				ctx.key,
				{ baseUrl: ctx.options.baseUrl },
			),
		);
	};
export const createTemplate: D2LBrightspaceEndpoints['createTemplate'] = async (
	ctx,
	raw,
) => {
	const input = inputs.createTemplate.parse(raw);
	return outputs.createTemplate.parse(
		await makeD2LBrightspaceRequest(
			'/d2l/api/lp/1.62/coursetemplates/',
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'POST', body: input.body },
		),
	);
};
export const updateTemplate: D2LBrightspaceEndpoints['updateTemplate'] = async (
	ctx,
	raw,
) => {
	const input = inputs.updateTemplate.parse(raw);
	return outputs.updateTemplate.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/coursetemplates/${encodeURIComponent(input.orgUnitId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'PUT', body: input.body },
		),
	);
};
export const deleteTemplate: D2LBrightspaceEndpoints['deleteTemplate'] = async (
	ctx,
	raw,
) => {
	const input = inputs.deleteTemplate.parse(raw);
	return outputs.deleteTemplate.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.62/coursetemplates/${encodeURIComponent(input.orgUnitId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'DELETE' },
		),
	);
};

export const getOrgUnitDemographics: D2LBrightspaceEndpoints['getOrgUnitDemographics'] =
	async (ctx, raw) => {
		const input = inputs.getOrgUnitDemographics.parse(raw);
		return outputs.getOrgUnitDemographics.parse(
			await makeD2LBrightspaceRequest(
				`/d2l/api/lp/1.62/demographics/orgUnits/${encodeURIComponent(input.orgUnitId)}/users/`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl, query: input.query },
			),
		);
	};
export const deleteUserDemographics: D2LBrightspaceEndpoints['deleteUserDemographics'] =
	async (ctx, raw) => {
		const input = inputs.deleteUserDemographics.parse(raw);
		return outputs.deleteUserDemographics.parse(
			await makeD2LBrightspaceRequest(
				`/d2l/api/lp/1.62/demographics/users/${encodeURIComponent(input.userId)}`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl, method: 'DELETE', query: input.query },
			),
		);
	};

const gradePath = (orgUnitId: string, gradeObjectId?: string) =>
	`/d2l/api/le/1.82/${encodeURIComponent(orgUnitId)}/grades/${gradeObjectId ? encodeURIComponent(gradeObjectId) : ''}`;
export const listGrades: D2LBrightspaceEndpoints['listGrades'] = async (
	ctx,
	raw,
) => {
	const input = inputs.listGrades.parse(raw);
	return outputs.listGrades.parse(
		await makeD2LBrightspaceRequest(gradePath(input.orgUnitId), ctx.key, {
			baseUrl: ctx.options.baseUrl,
		}),
	);
};
export const getGrade: D2LBrightspaceEndpoints['getGrade'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getGrade.parse(raw);
	return outputs.getGrade.parse(
		await makeD2LBrightspaceRequest(
			gradePath(input.orgUnitId, input.gradeObjectId),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const createGrade: D2LBrightspaceEndpoints['createGrade'] = async (
	ctx,
	raw,
) => {
	const input = inputs.createGrade.parse(raw);
	return outputs.createGrade.parse(
		await makeD2LBrightspaceRequest(gradePath(input.orgUnitId), ctx.key, {
			baseUrl: ctx.options.baseUrl,
			method: 'POST',
			body: input.body,
		}),
	);
};
export const updateGrade: D2LBrightspaceEndpoints['updateGrade'] = async (
	ctx,
	raw,
) => {
	const input = inputs.updateGrade.parse(raw);
	return outputs.updateGrade.parse(
		await makeD2LBrightspaceRequest(
			gradePath(input.orgUnitId, input.gradeObjectId),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'PUT', body: input.body },
		),
	);
};
export const deleteGrade: D2LBrightspaceEndpoints['deleteGrade'] = async (
	ctx,
	raw,
) => {
	const input = inputs.deleteGrade.parse(raw);
	return outputs.deleteGrade.parse(
		await makeD2LBrightspaceRequest(
			gradePath(input.orgUnitId, input.gradeObjectId),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'DELETE' },
		),
	);
};
export const getGradeAccess: D2LBrightspaceEndpoints['getGradeAccess'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getGradeAccess.parse(raw);
	const path = `${gradePath(input.orgUnitId, input.gradeObjectId)}/access/`;
	return outputs.getGradeAccess.parse(
		await makeD2LBrightspaceRequest(
			input.next
				? resolveNextPage(ctx.options.baseUrl, path, input.next)
				: path,
			ctx.key,
			{
				baseUrl: ctx.options.baseUrl,
				query: input.next ? undefined : input.query,
			},
		),
	);
};
export const getGradeStatistics: D2LBrightspaceEndpoints['getGradeStatistics'] =
	async (ctx, raw) => {
		const input = inputs.getGradeStatistics.parse(raw);
		return outputs.getGradeStatistics.parse(
			await makeD2LBrightspaceRequest(
				`${gradePath(input.orgUnitId, input.gradeObjectId)}/statistics`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl },
			),
		);
	};
export const getGradeSetup: D2LBrightspaceEndpoints['getGradeSetup'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getGradeSetup.parse(raw);
	return outputs.getGradeSetup.parse(
		await makeD2LBrightspaceRequest(
			`${gradePath(input.orgUnitId)}setup/`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const updateGradeSetup: D2LBrightspaceEndpoints['updateGradeSetup'] =
	async (ctx, raw) => {
		const input = inputs.updateGradeSetup.parse(raw);
		return outputs.updateGradeSetup.parse(
			await makeD2LBrightspaceRequest(
				`${gradePath(input.orgUnitId)}setup/`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl, method: 'PUT', body: input.body },
			),
		);
	};

const quizPath = (orgUnitId: string, quizId?: string) =>
	`/d2l/api/le/1.82/${encodeURIComponent(orgUnitId)}/quizzes/${quizId ? encodeURIComponent(quizId) : ''}`;
const pagedPath = (baseUrl: string | undefined, path: string, next?: string) =>
	next ? resolveNextPage(baseUrl, path, next) : path;
export const listQuizzes: D2LBrightspaceEndpoints['listQuizzes'] = async (
	ctx,
	raw,
) => {
	const input = inputs.listQuizzes.parse(raw);
	return outputs.listQuizzes.parse(
		await makeD2LBrightspaceRequest(
			pagedPath(ctx.options.baseUrl, quizPath(input.orgUnitId), input.next),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const getQuiz: D2LBrightspaceEndpoints['getQuiz'] = async (ctx, raw) => {
	const input = inputs.getQuiz.parse(raw);
	return outputs.getQuiz.parse(
		await makeD2LBrightspaceRequest(
			quizPath(input.orgUnitId, input.quizId),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const createQuiz: D2LBrightspaceEndpoints['createQuiz'] = async (
	ctx,
	raw,
) => {
	const input = inputs.createQuiz.parse(raw);
	return outputs.createQuiz.parse(
		await makeD2LBrightspaceRequest(quizPath(input.orgUnitId), ctx.key, {
			baseUrl: ctx.options.baseUrl,
			method: 'POST',
			body: input.body,
		}),
	);
};
export const updateQuiz: D2LBrightspaceEndpoints['updateQuiz'] = async (
	ctx,
	raw,
) => {
	const input = inputs.updateQuiz.parse(raw);
	return outputs.updateQuiz.parse(
		await makeD2LBrightspaceRequest(
			quizPath(input.orgUnitId, input.quizId),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'PUT', body: input.body },
		),
	);
};
export const deleteQuiz: D2LBrightspaceEndpoints['deleteQuiz'] = async (
	ctx,
	raw,
) => {
	const input = inputs.deleteQuiz.parse(raw);
	return outputs.deleteQuiz.parse(
		await makeD2LBrightspaceRequest(
			quizPath(input.orgUnitId, input.quizId),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl, method: 'DELETE' },
		),
	);
};
export const getQuizAccess: D2LBrightspaceEndpoints['getQuizAccess'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getQuizAccess.parse(raw);
	const path = `${quizPath(input.orgUnitId, input.quizId)}/access/`;
	return outputs.getQuizAccess.parse(
		await makeD2LBrightspaceRequest(
			pagedPath(ctx.options.baseUrl, path, input.next),
			ctx.key,
			{
				baseUrl: ctx.options.baseUrl,
				query: input.next ? undefined : input.query,
			},
		),
	);
};
export const listAttempts: D2LBrightspaceEndpoints['listAttempts'] = async (
	ctx,
	raw,
) => {
	const input = inputs.listAttempts.parse(raw);
	const path = `${quizPath(input.orgUnitId, input.quizId)}/attempts/`;
	return outputs.listAttempts.parse(
		await makeD2LBrightspaceRequest(
			pagedPath(ctx.options.baseUrl, path, input.next),
			ctx.key,
			{
				baseUrl: ctx.options.baseUrl,
				query: input.next ? undefined : input.query,
			},
		),
	);
};
export const getAttempt: D2LBrightspaceEndpoints['getAttempt'] = async (
	ctx,
	raw,
) => {
	const input = inputs.getAttempt.parse(raw);
	return outputs.getAttempt.parse(
		await makeD2LBrightspaceRequest(
			`${quizPath(input.orgUnitId, input.quizId)}/attempts/${encodeURIComponent(input.attemptId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const listQuestions: D2LBrightspaceEndpoints['listQuestions'] = async (
	ctx,
	raw,
) => {
	const input = inputs.listQuestions.parse(raw);
	const path = `${quizPath(input.orgUnitId, input.quizId)}/questions/`;
	return outputs.listQuestions.parse(
		await makeD2LBrightspaceRequest(
			pagedPath(ctx.options.baseUrl, path, input.next),
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};
export const listQuizCategories: D2LBrightspaceEndpoints['listQuizCategories'] =
	async (ctx, raw) => {
		const input = inputs.listQuizCategories.parse(raw);
		const path = `${quizPath(input.orgUnitId)}categories/`;
		return outputs.listQuizCategories.parse(
			await makeD2LBrightspaceRequest(
				pagedPath(ctx.options.baseUrl, path, input.next),
				ctx.key,
				{ baseUrl: ctx.options.baseUrl },
			),
		);
	};
export const getQuizCategory: D2LBrightspaceEndpoints['getQuizCategory'] =
	async (ctx, raw) => {
		const input = inputs.getQuizCategory.parse(raw);
		return outputs.getQuizCategory.parse(
			await makeD2LBrightspaceRequest(
				`${quizPath(input.orgUnitId)}categories/${encodeURIComponent(input.categoryId)}`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl },
			),
		);
	};
export const createQuizCategory: D2LBrightspaceEndpoints['createQuizCategory'] =
	async (ctx, raw) => {
		const input = inputs.createQuizCategory.parse(raw);
		return outputs.createQuizCategory.parse(
			await makeD2LBrightspaceRequest(
				`${quizPath(input.orgUnitId)}categories/`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl, method: 'POST', body: input.body },
			),
		);
	};
export const updateQuizCategory: D2LBrightspaceEndpoints['updateQuizCategory'] =
	async (ctx, raw) => {
		const input = inputs.updateQuizCategory.parse(raw);
		return outputs.updateQuizCategory.parse(
			await makeD2LBrightspaceRequest(
				`${quizPath(input.orgUnitId)}categories/${encodeURIComponent(input.categoryId)}`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl, method: 'PUT', body: input.body },
			),
		);
	};
export const deleteQuizCategory: D2LBrightspaceEndpoints['deleteQuizCategory'] =
	async (ctx, raw) => {
		const input = inputs.deleteQuizCategory.parse(raw);
		return outputs.deleteQuizCategory.parse(
			await makeD2LBrightspaceRequest(
				`${quizPath(input.orgUnitId)}categories/${encodeURIComponent(input.categoryId)}`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl, method: 'DELETE' },
			),
		);
	};

export const listRoles: D2LBrightspaceEndpoints['listRoles'] = async (
	ctx,
	raw,
) => {
	inputs.listRoles.parse(raw ?? {});
	return outputs.listRoles.parse(
		await makeD2LBrightspaceRequest('/d2l/api/lp/1.49/roles/', ctx.key, {
			baseUrl: ctx.options.baseUrl,
		}),
	);
};

export const getRole: D2LBrightspaceEndpoints['getRole'] = async (ctx, raw) => {
	const input = inputs.getRole.parse(raw);
	return outputs.getRole.parse(
		await makeD2LBrightspaceRequest(
			`/d2l/api/lp/1.49/roles/${encodeURIComponent(input.roleId)}`,
			ctx.key,
			{ baseUrl: ctx.options.baseUrl },
		),
	);
};

export const getEnrolledRoles: D2LBrightspaceEndpoints['getEnrolledRoles'] =
	async (ctx, raw) => {
		const input = inputs.getEnrolledRoles.parse(raw);
		return outputs.getEnrolledRoles.parse(
			await makeD2LBrightspaceRequest(
				`/d2l/api/lp/1.49/${encodeURIComponent(input.orgUnitId)}/roles/`,
				ctx.key,
				{ baseUrl: ctx.options.baseUrl },
			),
		);
	};

/** D2L only exposes role copying in its unsupported unstable API namespace. */
export const copyRole: D2LBrightspaceEndpoints['copyRole'] = async (
	ctx,
	raw,
) => {
	const input = inputs.copyRole.parse(raw);
	return outputs.copyRole.parse(
		await makeD2LBrightspaceRequest('/d2l/api/lp/unstable/roles/', ctx.key, {
			baseUrl: ctx.options.baseUrl,
			method: 'POST',
			query: { deepCopyRoleId: input.deepCopyRoleId },
			body: input.body,
		}),
	);
};
