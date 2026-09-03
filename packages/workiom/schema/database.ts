import { z } from 'zod';

/**
 * Official field dataType integers.
 * https://help.workiom.com/article/workiom-api-guide
 *
 * Text=0 Number=1 DateTime=2 Boolean=3 StaticSelect=4 LinkList=5 User=6
 * Website=7 Email=8 File=9 Rollup=10 PhoneNumber=11 Count=12 Currency=13
 * AutoNumber=14 CheckList=15
 */
export const WorkiomDataType = z.number().int();

/**
 * Official filter operators for Data/All.
 * https://help.workiom.com/article/workiom-api-guide
 *
 * Contains=1 DoesNotContain=2 Is=3 IsNot=4 Greater=5 Less=6
 * IsEmpty=7 IsNotEmpty=8 GreaterOrEqual=9 LessOrEqual=10
 * Between=11 In=12 NotIn=13
 */
export const WorkiomFilterOperator = z.number().int().min(1).max(13);

/**
 * App from GET /api/services/app/Apps/GetAll (ABP `result.items`).
 * Official sample: https://help.workiom.com/article/workiom-api-guide
 */
export const WorkiomApp = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.loose();

export type WorkiomApp = z.infer<typeof WorkiomApp>;

/**
 * List field from Lists/Get (expand Fields) / Lists/GetAll.
 * Official: https://help.workiom.com/article/workiom-api-guide
 */
export const WorkiomField = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		dataType: WorkiomDataType.optional(),
	})
	.loose();

export type WorkiomField = z.infer<typeof WorkiomField>;

/**
 * Filter object used on Data/All and on list views.
 * Official: { fieldId, operator, value }
 */
export const WorkiomFilter = z
	.object({
		fieldId: z.number(),
		operator: WorkiomFilterOperator,
		value: z.unknown().optional(),
	})
	.loose();

export type WorkiomFilter = z.infer<typeof WorkiomFilter>;

/**
 * List view from Lists/Get expand Views.
 * Official: https://help.workiom.com/article/workiom-api-guide
 */
export const WorkiomView = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		listId: z.string().optional(),
		isDefault: z.boolean().optional(),
		viewType: z.number().optional(),
		filters: z.array(WorkiomFilter).optional(),
	})
	.loose();

export type WorkiomView = z.infer<typeof WorkiomView>;

/**
 * List container (table) from GET /api/services/app/Lists/GetAll?appId=
 * and GET /api/services/app/Lists/Get.
 * Official: https://help.workiom.com/article/workiom-api-guide
 */
export const WorkiomList = z
	.object({
		id: z.string(),
		appId: z.string().optional(),
		name: z.string(),
		description: z.string().optional(),
		fields: z.array(WorkiomField).optional(),
		views: z.array(WorkiomView).optional(),
		filters: z.array(WorkiomFilter).optional(),
	})
	.loose();

export type WorkiomList = z.infer<typeof WorkiomList>;

/**
 * Record from POST /api/services/app/Data/All and Data/Create.
 * Official: keys are field IDs; live payloads also include `_id`.
 * https://help.workiom.com/article/workiom-api-guide
 */
export const WorkiomRecord = z
	.object({
		_id: z.string().optional(),
	})
	.loose();

export type WorkiomRecord = z.infer<typeof WorkiomRecord>;

/**
 * Data/All page envelope after ABP `result` unwrap.
 * Official: { summary, totalCount, items }
 */
export const WorkiomRecordPage = z
	.object({
		items: z.array(WorkiomRecord),
		totalCount: z.number(),
		summary: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type WorkiomRecordPage = z.infer<typeof WorkiomRecordPage>;
