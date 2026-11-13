import { z } from 'zod';

// Contract: https://developers.make.com/api-documentation/api-reference/scenarios
// Unstructured objects represent provider-defined dynamic scenario data.
export const listInput = z
	.object({
		teamId: z.number().int().optional(),
		organizationId: z.number().int().optional(),
		'id[]': z.array(z.number().int()).optional(),
		folderId: z.number().int().optional(),
		includeSubfolders: z.boolean().optional(),
		'labelIds[]': z.array(z.number().int().min(0)).optional(),
		isActive: z.boolean().optional(),
		concept: z.boolean().optional(),
		type: z.enum(['scenario', 'tool']).optional(),
		deleted: z.boolean().optional(),
		name: z.string().optional(),
		search: z.string().optional(),
		isinvalid: z.boolean().optional(),
		islocked: z.boolean().optional(),
		createdByUserName: z.string().optional(),
		updatedByUserName: z.string().optional(),
		dlqCount: z.number().int().min(0).optional(),
		'cols[]': z
			.array(
				z.enum([
					'id',
					'name',
					'teamId',
					'hookId',
					'devices',
					'deviceId',
					'deviceScope',
					'description',
					'folderId',
					'concept',
					'folderPath',
					'isinvalid',
					'islinked',
					'isActive',
					'islocked',
					'isPaused',
					'usedPackages',
					'usedModules',
					'lastEdit',
					'scheduling',
					'iswaiting',
					'dlqCount',
					'allDlqCount',
					'chainingRole',
					'isShared',
					'type',
					'createdByUser',
					'updatedByUser',
					'created',
					'nextExec',
					'operations',
					'centicredits',
					'transfer',
					'executions',
					'errors',
					'customProperties',
					'templateMetadata',
					'deleted',
					'deletedAt',
					'labels',
				]),
			)
			.optional(),
		'pg[offset]': z.number().int().optional(),
		'pg[limit]': z.number().int().optional(),
		'pg[sortBy]': z
			.enum([
				'proprietal',
				'id',
				'name',
				'teamId',
				'folderId',
				'isActive',
				'islinked',
				'isinvalid',
				'islocked',
				'lastEdit',
				'createdByUserName',
				'updatedByUserName',
				'created',
				'dlqCount',
				'operations',
				'executions',
				'centicredits',
				'transfer',
				'errors',
			])
			.optional(),
		'pg[sortDir]': z.enum(['asc', 'desc']).optional(),
	})
	.refine(
		(v) => (v.teamId === undefined) !== (v.organizationId === undefined),
		{ message: 'Provide either teamId or organizationId' },
	);
export const listOutput = z
	.object({
		scenarios: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						teamId: z.number().int().optional(),
						hookId: z.number().int().optional(),
						devices: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										scope: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						deviceId: z.number().int().optional(),
						deviceScope: z.string().optional(),
						description: z.string().optional(),
						folderId: z.number().int().nullable().optional(),
						concept: z.boolean().optional(),
						folderPath: z.string().nullable().optional(),
						isinvalid: z.boolean().optional(),
						islinked: z.boolean().optional(),
						isActive: z.boolean().optional(),
						islocked: z.boolean().optional(),
						isPaused: z.boolean().optional(),
						usedPackages: z.array(z.string()).optional(),
						usedModules: z
							.array(
								z
									.object({
										packageName: z.string().optional(),
										moduleName: z.string().optional(),
									})
									.passthrough(),
							)
							.optional(),
						lastEdit: z.string().optional(),
						scheduling: z
							.object({
								type: z.string().optional(),
								interval: z.number().int().optional(),
							})
							.passthrough()
							.optional(),
						iswaiting: z.boolean().optional(),
						dlqCount: z.number().int().optional(),
						allDlqCount: z.number().int().optional(),
						createdByUser: z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								email: z.string().optional(),
							})
							.passthrough()
							.optional(),
						updatedByUser: z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								email: z.string().optional(),
							})
							.passthrough()
							.optional(),
						nextExec: z.string().optional(),
						created: z.string().optional(),
						scenarioVersion: z.number().int().optional(),
						moduleSequenceId: z.number().int().optional(),
						type: z.enum(['scenario', 'tool']).optional(),
						chainingRole: z.string().nullable().optional(),
						isShared: z.boolean().optional(),
						operations: z.number().int().optional(),
						centicredits: z.number().int().optional(),
						transfer: z.number().int().optional(),
						executions: z.number().int().optional(),
						errors: z.number().int().optional(),
						customProperties: z
							.record(z.string(), z.unknown())
							.nullable()
							.optional(),
						templateMetadata: z
							.object({
								isOem: z.boolean().optional(),
								versionId: z.number().int().optional(),
								metadataId: z.number().int().optional(),
								instantiableId: z.number().int().optional(),
							})
							.passthrough()
							.nullable()
							.optional(),
						deleted: z.boolean().optional(),
						deletedAt: z.string().nullable().optional(),
						labels: z
							.array(
								z
									.object({
										id: z.number().int().optional(),
										name: z.string().optional(),
										colour: z
											.enum([
												'white',
												'neutral',
												'brand',
												'info',
												'success',
												'warning',
												'danger',
												'pink',
											])
											.optional(),
										scope: z.enum(['team']).optional(),
										teamId: z.number().int().optional(),
										description: z.string().nullable().optional(),
										createdBy: z.number().int().nullable().optional(),
										created: z.string().optional(),
										updated: z.string().nullable().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		pg: z
			.object({
				last: z.string().optional(),
				showLast: z.boolean().optional(),
				sortBy: z.string().optional(),
				sortDir: z.string().optional(),
				limit: z.number().int().optional(),
				offset: z.number().int().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const createInput = z.object({
	'cols[]': z
		.array(
			z.enum([
				'id',
				'name',
				'teamId',
				'hookId',
				'devices',
				'deviceId',
				'deviceScope',
				'description',
				'folderId',
				'concept',
				'folderPath',
				'isinvalid',
				'islinked',
				'isActive',
				'islocked',
				'isPaused',
				'usedPackages',
				'usedModules',
				'lastEdit',
				'scheduling',
				'iswaiting',
				'dlqCount',
				'allDlqCount',
				'chainingRole',
				'isShared',
				'type',
				'createdByUser',
				'updatedByUser',
				'created',
				'nextExec',
				'operations',
				'centicredits',
				'transfer',
				'executions',
				'errors',
				'customProperties',
				'templateMetadata',
				'deleted',
				'deletedAt',
				'labels',
			]),
		)
		.optional(),
	confirmed: z.boolean().optional(),
	body: z
		.object({
			blueprint: z.string(),
			teamId: z.number().int(),
			scheduling: z.string(),
			folderId: z.number().int().optional(),
			basedon: z.number().int().optional(),
			description: z.string().optional(),
			metadata: z
				.object({
					input_spec: z.array(z.record(z.string(), z.unknown())).optional(),
					output_spec: z.array(z.record(z.string(), z.unknown())).optional(),
					template_metadata: z.record(z.string(), z.unknown()).optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),
});
export const createOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				teamId: z.number().int().optional(),
				hookId: z.number().int().optional(),
				devices: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								scope: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				deviceId: z.number().int().optional(),
				deviceScope: z.string().optional(),
				description: z.string().optional(),
				folderId: z.number().int().nullable().optional(),
				concept: z.boolean().optional(),
				folderPath: z.string().nullable().optional(),
				isinvalid: z.boolean().optional(),
				islinked: z.boolean().optional(),
				isActive: z.boolean().optional(),
				islocked: z.boolean().optional(),
				isPaused: z.boolean().optional(),
				usedPackages: z.array(z.string()).optional(),
				usedModules: z
					.array(
						z
							.object({
								packageName: z.string().optional(),
								moduleName: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				lastEdit: z.string().optional(),
				scheduling: z
					.object({
						type: z.string().optional(),
						interval: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				iswaiting: z.boolean().optional(),
				dlqCount: z.number().int().optional(),
				allDlqCount: z.number().int().optional(),
				createdByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				updatedByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				nextExec: z.string().optional(),
				created: z.string().optional(),
				scenarioVersion: z.number().int().optional(),
				moduleSequenceId: z.number().int().optional(),
				type: z.enum(['scenario', 'tool']).optional(),
				chainingRole: z.string().nullable().optional(),
				isShared: z.boolean().optional(),
				operations: z.number().int().optional(),
				centicredits: z.number().int().optional(),
				transfer: z.number().int().optional(),
				executions: z.number().int().optional(),
				errors: z.number().int().optional(),
				customProperties: z
					.record(z.string(), z.unknown())
					.nullable()
					.optional(),
				templateMetadata: z
					.object({
						isOem: z.boolean().optional(),
						versionId: z.number().int().optional(),
						metadataId: z.number().int().optional(),
						instantiableId: z.number().int().optional(),
					})
					.passthrough()
					.nullable()
					.optional(),
				deleted: z.boolean().optional(),
				deletedAt: z.string().nullable().optional(),
				labels: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								colour: z
									.enum([
										'white',
										'neutral',
										'brand',
										'info',
										'success',
										'warning',
										'danger',
										'pink',
									])
									.optional(),
								scope: z.enum(['team']).optional(),
								teamId: z.number().int().optional(),
								description: z.string().nullable().optional(),
								createdBy: z.number().int().nullable().optional(),
								created: z.string().optional(),
								updated: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		scenarioVersion: z
			.object({
				version: z.number().int().optional(),
				draft: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const countTrashInput = z.object({ teamId: z.number().int() });
export const countTrashOutput = z
	.object({ scenariosTrashedTotal: z.number().int().optional() })
	.passthrough();
export const moveToTrashInput = z.object({
	body: z
		.object({
			teamId: z.number().int().min(1).max(2147483647),
			scenarioIds: z
				.array(z.number().int().min(1).max(2147483647))
				.min(1)
				.max(1000)
				.refine(
					(ids) => new Set(ids).size === ids.length,
					'Scenario IDs must be unique',
				),
		})
		.strict(),
});
export const moveToTrashOutput = z
	.object({
		trashedScenarioIds: z.array(z.number().int()),
		rejectedScenarios: z.array(
			z
				.object({
					scenarioId: z.number().int(),
					code: z.string(),
					detail: z.string(),
				})
				.passthrough(),
		),
		summary: z
			.object({
				total: z.number().int(),
				trashed: z.number().int(),
				rejected: z.number().int(),
			})
			.passthrough(),
	})
	.passthrough();
export const getInput = z.object({
	scenarioId: z.number().int(),
	'cols[]': z
		.array(
			z.enum([
				'id',
				'name',
				'teamId',
				'hookId',
				'devices',
				'deviceId',
				'deviceScope',
				'description',
				'folderId',
				'concept',
				'folderPath',
				'isinvalid',
				'islinked',
				'isActive',
				'islocked',
				'isPaused',
				'usedPackages',
				'usedModules',
				'lastEdit',
				'scheduling',
				'iswaiting',
				'dlqCount',
				'allDlqCount',
				'chainingRole',
				'isShared',
				'type',
				'createdByUser',
				'updatedByUser',
				'created',
				'nextExec',
				'operations',
				'centicredits',
				'transfer',
				'executions',
				'errors',
				'customProperties',
				'templateMetadata',
				'deleted',
				'deletedAt',
				'labels',
			]),
		)
		.optional(),
});
export const getOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				teamId: z.number().int().optional(),
				hookId: z.number().int().optional(),
				devices: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								scope: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				deviceId: z.number().int().optional(),
				deviceScope: z.string().optional(),
				description: z.string().optional(),
				folderId: z.number().int().nullable().optional(),
				concept: z.boolean().optional(),
				folderPath: z.string().nullable().optional(),
				isinvalid: z.boolean().optional(),
				islinked: z.boolean().optional(),
				isActive: z.boolean().optional(),
				islocked: z.boolean().optional(),
				isPaused: z.boolean().optional(),
				usedPackages: z.array(z.string()).optional(),
				usedModules: z
					.array(
						z
							.object({
								packageName: z.string().optional(),
								moduleName: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				lastEdit: z.string().optional(),
				scheduling: z
					.object({
						type: z.string().optional(),
						interval: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				iswaiting: z.boolean().optional(),
				dlqCount: z.number().int().optional(),
				allDlqCount: z.number().int().optional(),
				createdByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				updatedByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				nextExec: z.string().optional(),
				created: z.string().optional(),
				scenarioVersion: z.number().int().optional(),
				moduleSequenceId: z.number().int().optional(),
				type: z.enum(['scenario', 'tool']).optional(),
				chainingRole: z.string().nullable().optional(),
				isShared: z.boolean().optional(),
				operations: z.number().int().optional(),
				centicredits: z.number().int().optional(),
				transfer: z.number().int().optional(),
				executions: z.number().int().optional(),
				errors: z.number().int().optional(),
				customProperties: z
					.record(z.string(), z.unknown())
					.nullable()
					.optional(),
				templateMetadata: z
					.object({
						isOem: z.boolean().optional(),
						versionId: z.number().int().optional(),
						metadataId: z.number().int().optional(),
						instantiableId: z.number().int().optional(),
					})
					.passthrough()
					.nullable()
					.optional(),
				deleted: z.boolean().optional(),
				deletedAt: z.string().nullable().optional(),
				labels: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								colour: z
									.enum([
										'white',
										'neutral',
										'brand',
										'info',
										'success',
										'warning',
										'danger',
										'pink',
									])
									.optional(),
								scope: z.enum(['team']).optional(),
								teamId: z.number().int().optional(),
								description: z.string().nullable().optional(),
								createdBy: z.number().int().nullable().optional(),
								created: z.string().optional(),
								updated: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const deleteInput = z.object({ scenarioId: z.number().int() });
export const deleteOutput = z
	.object({ scenario: z.number().int().optional() })
	.passthrough();
export const updateInput = z.object({
	scenarioId: z.number().int(),
	'cols[]': z
		.array(
			z.enum([
				'id',
				'name',
				'teamId',
				'hookId',
				'devices',
				'deviceId',
				'deviceScope',
				'description',
				'folderId',
				'concept',
				'folderPath',
				'isinvalid',
				'islinked',
				'isActive',
				'islocked',
				'isPaused',
				'usedPackages',
				'usedModules',
				'lastEdit',
				'scheduling',
				'iswaiting',
				'dlqCount',
				'allDlqCount',
				'chainingRole',
				'isShared',
				'type',
				'createdByUser',
				'updatedByUser',
				'created',
				'nextExec',
				'operations',
				'centicredits',
				'transfer',
				'executions',
				'errors',
				'customProperties',
				'templateMetadata',
				'deleted',
				'deletedAt',
				'labels',
			]),
		)
		.optional(),
	confirmed: z.boolean().optional(),
	body: z
		.object({
			blueprint: z.string().optional(),
			scheduling: z.string().optional(),
			folderId: z.number().int().nullable().optional(),
			name: z.string().optional(),
			baseVersion: z.number().int().min(0).optional(),
		})
		.passthrough()
		.optional(),
});
export const updateOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				teamId: z.number().int().optional(),
				hookId: z.number().int().optional(),
				devices: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								scope: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				deviceId: z.number().int().optional(),
				deviceScope: z.string().optional(),
				description: z.string().optional(),
				folderId: z.number().int().nullable().optional(),
				concept: z.boolean().optional(),
				folderPath: z.string().nullable().optional(),
				isinvalid: z.boolean().optional(),
				islinked: z.boolean().optional(),
				isActive: z.boolean().optional(),
				islocked: z.boolean().optional(),
				isPaused: z.boolean().optional(),
				usedPackages: z.array(z.string()).optional(),
				usedModules: z
					.array(
						z
							.object({
								packageName: z.string().optional(),
								moduleName: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				lastEdit: z.string().optional(),
				scheduling: z
					.object({
						type: z.string().optional(),
						interval: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				iswaiting: z.boolean().optional(),
				dlqCount: z.number().int().optional(),
				allDlqCount: z.number().int().optional(),
				createdByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				updatedByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				nextExec: z.string().optional(),
				created: z.string().optional(),
				scenarioVersion: z.number().int().optional(),
				moduleSequenceId: z.number().int().optional(),
				type: z.enum(['scenario', 'tool']).optional(),
				chainingRole: z.string().nullable().optional(),
				isShared: z.boolean().optional(),
				operations: z.number().int().optional(),
				centicredits: z.number().int().optional(),
				transfer: z.number().int().optional(),
				executions: z.number().int().optional(),
				errors: z.number().int().optional(),
				customProperties: z
					.record(z.string(), z.unknown())
					.nullable()
					.optional(),
				templateMetadata: z
					.object({
						isOem: z.boolean().optional(),
						versionId: z.number().int().optional(),
						metadataId: z.number().int().optional(),
						instantiableId: z.number().int().optional(),
					})
					.passthrough()
					.nullable()
					.optional(),
				deleted: z.boolean().optional(),
				deletedAt: z.string().nullable().optional(),
				labels: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								colour: z
									.enum([
										'white',
										'neutral',
										'brand',
										'info',
										'success',
										'warning',
										'danger',
										'pink',
									])
									.optional(),
								scope: z.enum(['team']).optional(),
								teamId: z.number().int().optional(),
								description: z.string().nullable().optional(),
								createdBy: z.number().int().nullable().optional(),
								created: z.string().optional(),
								updated: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
		scenarioVersion: z
			.object({
				scenarioId: z.number().int().optional(),
				version: z.number().int().optional(),
				draft: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const getTriggersInput = z.object({ scenarioId: z.number().int() });
export const getTriggersOutput = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		udid: z.string().optional(),
		scope: z.string().optional(),
		queueCount: z.number().int().optional(),
		queueLimit: z.number().int().optional(),
		typeName: z.string().optional(),
		type: z.string().optional(),
		url: z.string().optional(),
		flags: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export const cloneInput = z.object({
	scenarioId: z.number().int(),
	organizationId: z.number().int(),
	'cols[]': z
		.array(
			z.enum([
				'id',
				'name',
				'teamId',
				'hookId',
				'devices',
				'deviceId',
				'deviceScope',
				'description',
				'folderId',
				'concept',
				'folderPath',
				'isinvalid',
				'islinked',
				'isActive',
				'islocked',
				'isPaused',
				'usedPackages',
				'usedModules',
				'lastEdit',
				'scheduling',
				'iswaiting',
				'dlqCount',
				'allDlqCount',
				'chainingRole',
				'isShared',
				'type',
				'createdByUser',
				'updatedByUser',
				'created',
				'nextExec',
				'operations',
				'centicredits',
				'transfer',
				'executions',
				'errors',
				'customProperties',
				'templateMetadata',
				'deleted',
				'deletedAt',
				'labels',
			]),
		)
		.optional(),
	confirmed: z.boolean().optional(),
	notAnalyze: z.boolean().optional(),
	body: z
		.object({
			name: z.string(),
			teamId: z.number().int(),
			account: z.record(z.string(), z.unknown()).optional(),
			key: z.record(z.string(), z.unknown()).optional(),
			hook: z.record(z.string(), z.unknown()).optional(),
			device: z.record(z.string(), z.unknown()).optional(),
			udt: z.record(z.string(), z.unknown()).optional(),
			datastore: z.record(z.string(), z.unknown()).optional(),
			states: z.boolean(),
		})
		.passthrough(),
});
export const cloneOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
				teamId: z.number().int().optional(),
				hookId: z.number().int().optional(),
				devices: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								scope: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				deviceId: z.number().int().optional(),
				deviceScope: z.string().optional(),
				description: z.string().optional(),
				folderId: z.number().int().nullable().optional(),
				concept: z.boolean().optional(),
				folderPath: z.string().nullable().optional(),
				isinvalid: z.boolean().optional(),
				islinked: z.boolean().optional(),
				isActive: z.boolean().optional(),
				islocked: z.boolean().optional(),
				isPaused: z.boolean().optional(),
				usedPackages: z.array(z.string()).optional(),
				usedModules: z
					.array(
						z
							.object({
								packageName: z.string().optional(),
								moduleName: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				lastEdit: z.string().optional(),
				scheduling: z
					.object({
						type: z.string().optional(),
						interval: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				iswaiting: z.boolean().optional(),
				dlqCount: z.number().int().optional(),
				allDlqCount: z.number().int().optional(),
				createdByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				updatedByUser: z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough()
					.optional(),
				nextExec: z.string().optional(),
				created: z.string().optional(),
				scenarioVersion: z.number().int().optional(),
				moduleSequenceId: z.number().int().optional(),
				type: z.enum(['scenario', 'tool']).optional(),
				chainingRole: z.string().nullable().optional(),
				isShared: z.boolean().optional(),
				operations: z.number().int().optional(),
				centicredits: z.number().int().optional(),
				transfer: z.number().int().optional(),
				executions: z.number().int().optional(),
				errors: z.number().int().optional(),
				customProperties: z
					.record(z.string(), z.unknown())
					.nullable()
					.optional(),
				templateMetadata: z
					.object({
						isOem: z.boolean().optional(),
						versionId: z.number().int().optional(),
						metadataId: z.number().int().optional(),
						instantiableId: z.number().int().optional(),
					})
					.passthrough()
					.nullable()
					.optional(),
				deleted: z.boolean().optional(),
				deletedAt: z.string().nullable().optional(),
				labels: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								name: z.string().optional(),
								colour: z
									.enum([
										'white',
										'neutral',
										'brand',
										'info',
										'success',
										'warning',
										'danger',
										'pink',
									])
									.optional(),
								scope: z.enum(['team']).optional(),
								teamId: z.number().int().optional(),
								description: z.string().nullable().optional(),
								createdBy: z.number().int().nullable().optional(),
								created: z.string().optional(),
								updated: z.string().nullable().optional(),
							})
							.passthrough(),
					)
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const restoreInput = z.object({ scenarioId: z.number().int() });
export const restoreOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				deleted: z.boolean().optional(),
				deletedAt: z.string().nullable().optional(),
				containsErrors: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		strippedModules: z
			.array(
				z
					.object({
						moduleId: z.number().int().optional(),
						moduleName: z.string().optional(),
						entities: z
							.array(
								z
									.object({
										entityType: z.enum(['connection', 'key']).optional(),
										entityId: z.number().int().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export const getModuleDataInput = z.object({
	scenarioId: z.number().int(),
	moduleId: z.number().int(),
});
export const getModuleDataOutput = z
	.object({ exists: z.boolean().optional() })
	.passthrough();
export const activateInput = z.object({ scenarioId: z.number().int() });
export const activateOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				isActive: z.boolean().optional(),
				islinked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const deactivateInput = z.object({ scenarioId: z.number().int() });
export const deactivateOutput = z
	.object({
		scenario: z
			.object({
				id: z.number().int().optional(),
				isActive: z.boolean().optional(),
				islinked: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const runInput = z.object({
	scenarioId: z.number().int(),
	body: z
		.object({
			data: z.record(z.string(), z.unknown()).optional(),
			responsive: z.boolean().optional(),
			callbackUrl: z.string().optional(),
		})
		.passthrough()
		.optional(),
});
export const runOutput = z
	.object({ executionId: z.string().optional(), status: z.string().optional() })
	.passthrough();
export const replayInput = z.object({
	scenarioId: z.number().int(),
	body: z
		.object({
			executionIds: z
				.array(z.string().min(32).max(32).regex(new RegExp('^[a-zA-Z0-9]+$')))
				.min(1)
				.max(100)
				.refine(
					(ids) => new Set(ids).size === ids.length,
					'Execution IDs must be unique',
				),
		})
		.passthrough(),
});
export const replayOutput = z
	.object({
		executionId: z.string(),
		replayed: z.array(
			z
				.object({ executionId: z.string(), replayExecutionId: z.string() })
				.passthrough(),
		),
		failed: z.array(
			z
				.object({
					executionId: z.string(),
					code: z.string(),
					message: z.string(),
				})
				.passthrough(),
		),
	})
	.passthrough();
export const getInterfaceInput = z.object({ scenarioId: z.number().int() });
export const getInterfaceOutput = z
	.object({ interface: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export const updateInterfaceInput = z.object({
	scenarioId: z.number().int(),
	body: z
		.object({ interface: z.record(z.string(), z.unknown()).optional() })
		.passthrough()
		.optional(),
});
export const updateInterfaceOutput = z
	.object({ interface: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export const getUsageInput = z.object({
	scenarioId: z.number().int(),
	organizationTimezone: z.boolean().optional(),
});
export const getUsageOutput = z
	.object({
		data: z
			.array(
				z
					.object({
						date: z.string().optional(),
						operations: z.number().int().optional(),
						dataTransfer: z.number().int().optional(),
						centicredits: z.number().int().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export const listBuildVariablesInput = z.object({
	scenarioId: z.number().int(),
});
export const listBuildVariablesOutput = z
	.object({ variables: z.record(z.string(), z.unknown()).optional() })
	.passthrough();
export const addBuildVariablesInput = z.object({
	scenarioId: z.number().int(),
	body: z
		.object({
			input: z
				.array(
					z
						.object({
							name: z.string().optional(),
							value: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough()
		.optional(),
});
export const addBuildVariablesOutput = z
	.object({ ok: z.number().int().optional() })
	.passthrough();
export const updateBuildVariablesInput = z.object({
	scenarioId: z.number().int(),
	body: z
		.object({
			input: z
				.array(
					z
						.object({
							name: z.string().optional(),
							value: z.string().optional(),
						})
						.passthrough(),
				)
				.optional(),
		})
		.passthrough()
		.optional(),
});
export const updateBuildVariablesOutput = z
	.object({ ok: z.number().int().optional() })
	.passthrough();
export const deleteBuildVariableInput = z.object({
	scenarioId: z.number().int(),
	value: z.string(),
});
export const deleteBuildVariableOutput = z
	.object({ ok: z.number().int().optional() })
	.passthrough();
export const listAiAgentsInput = z.object({
	teamId: z.number().int(),
	'pg[offset]': z.number().int().optional(),
	'pg[limit]': z.number().int().optional(),
});
export const listAiAgentsOutput = z
	.object({
		scenarios: z
			.array(
				z
					.object({
						id: z.number().int().optional(),
						name: z.string().optional(),
						description: z.string().nullable().optional(),
						isActive: z.boolean().optional(),
						teamId: z.number().int().optional(),
						created: z.string().optional(),
						lastEdit: z.string().optional(),
						scheduling: z.record(z.string(), z.unknown()).optional(),
						usedPackages: z.array(z.string()).optional(),
						agentCount: z.number().int().optional(),
						createdByUser: z
							.object({
								id: z.number().int().optional(),
								name: z.string().nullable().optional(),
								email: z.string().optional(),
							})
							.passthrough()
							.nullable()
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		pg: z
			.object({
				limit: z.number().int().optional(),
				offset: z.number().int().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export const getAiAgentModulesInput = z.object({
	teamId: z.number().int(),
	'pg[offset]': z.number().int().optional(),
	'pg[limit]': z.number().int().optional(),
	body: z
		.object({
			scenarioIds: z.array(z.number().int()).min(1).max(100).optional(),
		})
		.passthrough()
		.optional(),
});
export const getAiAgentModulesOutput = z
	.object({
		agentModules: z
			.array(
				z
					.object({
						scenarioId: z.number().int().optional(),
						id: z.number().int().optional(),
						module: z.string().optional(),
						userLabel: z.string().nullable().optional(),
						evaluationMode: z
							.enum(['disabled', 'measured', 'measuredAndInferred'])
							.optional(),
						tools: z
							.array(
								z
									.object({
										moduleId: z.number().int().optional(),
										module: z.string().optional(),
										name: z.string().optional(),
										fileIds: z.array(z.string()).optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		pg: z
			.object({
				limit: z.number().int().optional(),
				offset: z.number().int().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
