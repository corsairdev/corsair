import { z } from 'zod';

// Provider responses are documented as extensible objects; known fields are checked while future fields pass through.
export const operationDefinitions = {
	accountAddressesSchema: {
		group: 'accountAddresses',
		tag: 'Account Addresses',
		method: 'GET',
		path: '/accountAddresses/schema',
		pathKeys: [],
		operationId: 'account-addresses-schema',
		summary: 'Account Addresses schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						address1: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						address2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						city: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						countryId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						postcode: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						region: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listAccountAddresses: {
		group: 'accountAddresses',
		tag: 'Account Addresses',
		method: 'GET',
		path: '/accountAddresses',
		pathKeys: [],
		operationId: 'list-account-addresses',
		summary: 'List Account Addresses',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					address1: z.string().optional(),
					address2: z.string().nullable().optional(),
					city: z.string().optional(),
					countryId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().nullable().optional(),
					dateUpdated: z.string().nullable().optional(),
					deleted: z.boolean().optional(),
					description: z.string().nullable().optional(),
					id: z.number().int().optional(),
					postcode: z.string().optional(),
					region: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().nullable().optional(),
					salesRepIdUpdated: z.number().int().nullable().optional(),
				})
				.passthrough(),
		),
	},
	createAccountAddress: {
		group: 'accountAddresses',
		tag: 'Account Addresses',
		method: 'POST',
		path: '/accountAddresses',
		pathKeys: [],
		operationId: 'create-account-address',
		summary: 'Create Account Address',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountId: z.number().int().optional(),
						address1: z.string().optional(),
						address2: z.string().optional(),
						city: z.string().optional(),
						countryId: z.number().int().optional(),
						description: z.string().optional(),
						postcode: z.string().optional(),
						region: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getAccountAddress: {
		group: 'accountAddresses',
		tag: 'Account Addresses',
		method: 'GET',
		path: '/accountAddresses/{ID}',
		pathKeys: ['id'],
		operationId: 'get-account-address',
		summary: 'Get Account Address',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				address1: z.string().optional(),
				address2: z.string().nullable().optional(),
				city: z.string().optional(),
				countryId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.string().nullable().optional(),
				dateUpdated: z.string().nullable().optional(),
				deleted: z.boolean().optional(),
				description: z.string().nullable().optional(),
				id: z.number().int().optional(),
				postcode: z.string().optional(),
				region: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().nullable().optional(),
				salesRepIdUpdated: z.number().int().nullable().optional(),
			})
			.passthrough(),
	},
	updateAccountAddress: {
		group: 'accountAddresses',
		tag: 'Account Addresses',
		method: 'PUT',
		path: '/accountAddresses/{ID}',
		pathKeys: ['id'],
		operationId: 'update-account-address',
		summary: 'Update Account Address',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						address1: z.string().optional(),
						city: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteAccountAddress: {
		group: 'accountAddresses',
		tag: 'Account Addresses',
		method: 'DELETE',
		path: '/accountAddresses/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-account-address',
		summary: 'Delete Account Address',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	accountsSchema: {
		group: 'accountsEntity',
		tag: 'Accounts / Entity',
		method: 'GET',
		path: '/accounts/schema',
		pathKeys: [],
		operationId: 'accounts-schema',
		summary: 'Accounts schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						address1: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						address2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						city: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						comment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						countryId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateGeocoded: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						email: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fax: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						geocoded: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						geocodingAccuracy: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						latitude: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						longitude: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						marketingCommunications: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						name: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						permissionLevel: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phone: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phone2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phone3: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						postcode: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						public: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						rateId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						region: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId1: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId2: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId3: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId4: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId5: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						segmentId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						statusId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						typeId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						vatNumber: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						website: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listAccounts: {
		group: 'accountsEntity',
		tag: 'Accounts / Entity',
		method: 'GET',
		path: '/accounts',
		pathKeys: [],
		operationId: 'list-accounts',
		summary: 'List Accounts',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					address1: z.string().optional(),
					address2: z.string().optional(),
					branchId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					city: z.string().optional(),
					comment: z.string().optional(),
					countryId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					email: z.string().optional(),
					extId: z.json().optional(),
					fax: z.string().optional(),
					geocoded: z.boolean().optional(),
					geocodingAccuracy: z.number().int().optional(),
					id: z.number().int().optional(),
					latitude: z.number().optional(),
					longitude: z.number().optional(),
					name: z.string().optional(),
					permissionLevel: z.number().int().optional(),
					phone: z.string().optional(),
					phone2: z.string().optional(),
					phone3: z.string().optional(),
					postcode: z.string().optional(),
					public: z.boolean().optional(),
					rateId: z.json().optional(),
					readOnly: z.boolean().optional(),
					region: z.string().optional(),
					salesRepId1: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepId2: z.json().optional(),
					salesRepId3: z.json().optional(),
					salesRepId4: z.json().optional(),
					salesRepId5: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					segmentId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					statusId: z.json().optional(),
					typeId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					vatNumber: z.json().optional(),
					website: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createAccount: {
		group: 'accountsEntity',
		tag: 'Accounts / Entity',
		method: 'POST',
		path: '/accounts',
		pathKeys: [],
		operationId: 'create-account',
		summary: 'Create Account',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						address1: z.string().optional(),
						address2: z.string().optional(),
						branchId: z.number().int(),
						city: z.string().optional(),
						comment: z.string().optional(),
						countryId: z.number().int().optional(),
						email: z.string().optional(),
						fax: z.string().optional(),
						geocoded: z.boolean().optional(),
						geocodingAccuracy: z.number().int().optional(),
						latitude: z.number().optional(),
						longitude: z.number().optional(),
						name: z.string(),
						permissionLevel: z.number().int().optional(),
						phone: z.string().optional(),
						phone2: z.string().optional(),
						phone3: z.string().optional(),
						postcode: z.string().optional(),
						public: z.boolean().optional(),
						rateId: z.number().int().optional(),
						readOnly: z.boolean().optional(),
						region: z.string().optional(),
						salesRepId1: z.number().int(),
						segmentId: z.number().int().optional(),
						statusId: z.number().int().optional(),
						typeId: z.number().int().optional(),
						vatNumber: z.string().optional(),
						website: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getAccount: {
		group: 'accountsEntity',
		tag: 'Accounts / Entity',
		method: 'GET',
		path: '/accounts/{ID}',
		pathKeys: ['id'],
		operationId: 'get-account',
		summary: 'Get Account',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				address1: z.string().optional(),
				address2: z.json().optional(),
				branchId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				city: z.string().optional(),
				comment: z.json().optional(),
				countryId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateGeocoded: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				email: z.string().optional(),
				extId: z.string().optional(),
				fax: z.json().optional(),
				geocoded: z.boolean().optional(),
				geocodingAccuracy: z.json().optional(),
				id: z.number().int().optional(),
				latitude: z.number().optional(),
				longitude: z.number().optional(),
				marketingCommunications: z.boolean().optional(),
				name: z.string().optional(),
				permissionLevel: z.number().int().optional(),
				phone: z.json().optional(),
				phone2: z.json().optional(),
				phone3: z.json().optional(),
				postcode: z.string().optional(),
				public: z.json().optional(),
				rateId: z.json().optional(),
				readOnly: z.boolean().optional(),
				region: z.string().optional(),
				salesRepId1: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepId2: z.json().optional(),
				salesRepId3: z.json().optional(),
				salesRepId4: z.json().optional(),
				salesRepId5: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				segmentId: z.json().optional(),
				statusId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				typeId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				vatNumber: z.json().optional(),
				website: z.string().optional(),
			})
			.passthrough(),
	},
	updateAccount: {
		group: 'accountsEntity',
		tag: 'Accounts / Entity',
		method: 'PUT',
		path: '/accounts/{ID}',
		pathKeys: ['id'],
		operationId: 'update-account',
		summary: 'Update Account',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						address1: z.string().optional(),
						phone3: z.string().optional(),
						website: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteAccount: {
		group: 'accountsEntity',
		tag: 'Accounts / Entity',
		method: 'DELETE',
		path: '/accounts/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-account',
		summary: 'Delete Account',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	accountTypesSchema: {
		group: 'accountsTypes',
		tag: 'Accounts / Types',
		method: 'GET',
		path: '/accountTypes/schema',
		pathKeys: [],
		operationId: 'account-types-schema',
		summary: 'Account Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						computeSfm: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						internal: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listAccountTypes: {
		group: 'accountsTypes',
		tag: 'Accounts / Types',
		method: 'GET',
		path: '/accountTypes',
		pathKeys: [],
		operationId: 'list-account-types',
		summary: 'List Account Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.json().optional(),
					computeSfm: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					internal: z.boolean().optional(),
					order: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createAccountType: {
		group: 'accountsTypes',
		tag: 'Accounts / Types',
		method: 'POST',
		path: '/accountTypes',
		pathKeys: [],
		operationId: 'create-account-type',
		summary: 'Create Account Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getAccountType: {
		group: 'accountsTypes',
		tag: 'Accounts / Types',
		method: 'GET',
		path: '/accountTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'get-account-type',
		summary: 'Get Account Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.json().optional(),
				computeSfm: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				internal: z.boolean().optional(),
				order: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateAccountType: {
		group: 'accountsTypes',
		tag: 'Accounts / Types',
		method: 'PUT',
		path: '/list/accountTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'update-account-type',
		summary: 'Update Account Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						computeSfm: z.boolean().optional(),
						internal: z.boolean().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteAccountType: {
		group: 'accountsTypes',
		tag: 'Accounts / Types',
		method: 'DELETE',
		path: '/list/accountTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-account-type',
		summary: 'Delete Account Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	accountSegmentsSchema: {
		group: 'accountsSegments',
		tag: 'Accounts / Segments',
		method: 'GET',
		path: '/accountSegments/schema',
		pathKeys: [],
		operationId: 'account-segments-schema',
		summary: 'Account Segments schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						visitCycle: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listAccountSegments: {
		group: 'accountsSegments',
		tag: 'Accounts / Segments',
		method: 'GET',
		path: '/accountSegments',
		pathKeys: [],
		operationId: 'list-account-segments',
		summary: 'List Account Segments',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.json().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					order: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					visitCycle: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createAccountSegment: {
		group: 'accountsSegments',
		tag: 'Accounts / Segments',
		method: 'POST',
		path: '/accountSegments',
		pathKeys: [],
		operationId: 'create-account-segment',
		summary: 'Create Account Segment',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						visitCycle: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getAccountSegment: {
		group: 'accountsSegments',
		tag: 'Accounts / Segments',
		method: 'GET',
		path: '/accountSegments/{ID}',
		pathKeys: ['id'],
		operationId: 'get-account-segment',
		summary: 'Get Account Segment',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.json().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				order: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				visitCycle: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateAccountSegment: {
		group: 'accountsSegments',
		tag: 'Accounts / Segments',
		method: 'PUT',
		path: '/accountSegments/{ID}',
		pathKeys: ['id'],
		operationId: 'update-account-segment',
		summary: 'Update Account Segment',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ visitCycle: z.number().int().optional() }).strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteAccountSegment: {
		group: 'accountsSegments',
		tag: 'Accounts / Segments',
		method: 'DELETE',
		path: '/accountSegments/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-account-segment',
		summary: 'Delete Account Segment',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	accountStatusesSchema: {
		group: 'accountsStatuses',
		tag: 'Accounts / Statuses',
		method: 'GET',
		path: '/accountStatuses/schema',
		pathKeys: [],
		operationId: 'account-statuses-schema',
		summary: 'Account Statuses schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lost: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						won: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listAccountStatuses: {
		group: 'accountsStatuses',
		tag: 'Accounts / Statuses',
		method: 'GET',
		path: '/accountStatuses',
		pathKeys: [],
		operationId: 'list-account-statuses',
		summary: 'List Account Statuses',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					lost: z.boolean().optional(),
					order: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdUpdated: z.json().optional(),
					won: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createAccountStatus: {
		group: 'accountsStatuses',
		tag: 'Accounts / Statuses',
		method: 'POST',
		path: '/accountStatuses',
		pathKeys: [],
		operationId: 'create-account-status',
		summary: 'Create Account Status',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						lost: z.boolean().optional(),
						branchVisibility: z
							.array(z.record(z.string(), z.json()))
							.optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getAccountStatus: {
		group: 'accountsStatuses',
		tag: 'Accounts / Statuses',
		method: 'GET',
		path: '/accountStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'get-account-status',
		summary: 'Get Account Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				lost: z.boolean().optional(),
				order: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				won: z.boolean().optional(),
			})
			.passthrough(),
	},
	updateAccountStatus: {
		group: 'accountsStatuses',
		tag: 'Accounts / Statuses',
		method: 'PUT',
		path: '/accountStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'update-account-status',
		summary: 'Update Account Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						lost: z.boolean().optional(),
						won: z.boolean().optional(),
						branchVisibility: z
							.array(z.record(z.string(), z.json()))
							.optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteAccountStatus: {
		group: 'accountsStatuses',
		tag: 'Accounts / Statuses',
		method: 'DELETE',
		path: '/accountStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-account-status',
		summary: 'Delete Account Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	activitiesSchema: {
		group: 'activitiesEntity',
		tag: 'Activities / Entity',
		method: 'GET',
		path: '/activities/schema',
		pathKeys: [],
		operationId: 'activities-schema',
		summary: 'Activities schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						checkin: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						checkinTypeId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						checkoutDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						comment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						contactId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						date: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						geocoded: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						geocodingAccuracy: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						latitude: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						longitude: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						opportunityId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						permissionLevel: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						typeId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listActivities: {
		group: 'activitiesEntity',
		tag: 'Activities / Entity',
		method: 'GET',
		path: '/activities',
		pathKeys: [],
		operationId: 'list-activities',
		summary: 'List Activities',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					checkin: z.boolean().optional(),
					checkinTypeId: z.number().int().optional(),
					checkoutDate: z.json().optional(),
					comment: z.string().optional(),
					contactId: z.json().optional(),
					date: z.string().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					extId: z.json().optional(),
					geocoded: z.boolean().optional(),
					geocodingAccuracy: z.number().int().optional(),
					id: z.number().int().optional(),
					latitude: z.number().optional(),
					longitude: z.number().optional(),
					opportunityId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					permissionLevel: z.number().int().optional(),
					readOnly: z.boolean().optional(),
					salesRepId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					typeId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough(),
		),
	},
	createActivity: {
		group: 'activitiesEntity',
		tag: 'Activities / Entity',
		method: 'POST',
		path: '/activities',
		pathKeys: [],
		operationId: 'create-activity',
		summary: 'Create Activity',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountId: z.number().int().optional(),
						date: z.string().optional(),
						checkin: z.boolean().optional(),
						checkinTypeId: z.number().int().optional(),
						comment: z.string().optional(),
						opportunityId: z.number().int().optional(),
						permissionLevel: z.number().int().optional(),
						salesRepId: z.number().int().optional(),
						typeId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getActivity: {
		group: 'activitiesEntity',
		tag: 'Activities / Entity',
		method: 'GET',
		path: '/activities/{ID}',
		pathKeys: ['id'],
		operationId: 'get-activity',
		summary: 'Get Activity',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				checkin: z.boolean().optional(),
				checkinTypeId: z.number().int().optional(),
				checkoutDate: z.json().optional(),
				comment: z.string().optional(),
				contactId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				date: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				extId: z.json().optional(),
				geocoded: z.boolean().optional(),
				geocodingAccuracy: z.number().int().optional(),
				id: z.number().int().optional(),
				latitude: z.number().optional(),
				longitude: z.number().optional(),
				opportunityId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				permissionLevel: z.number().int().optional(),
				readOnly: z.boolean().optional(),
				salesRepId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				typeId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	updateActivity: {
		group: 'activitiesEntity',
		tag: 'Activities / Entity',
		method: 'PUT',
		path: '/activities/{ID}',
		pathKeys: ['id'],
		operationId: 'update-activity',
		summary: 'Update Activity',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						comment: z.string().optional(),
						geocoded: z.boolean().optional(),
						geocodingAccuracy: z.number().int().optional(),
						latitude: z.number().optional(),
						longitude: z.number().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteActivity: {
		group: 'activitiesEntity',
		tag: 'Activities / Entity',
		method: 'DELETE',
		path: '/activities/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-activity',
		summary: 'Delete Activity',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	activityTypesSchema: {
		group: 'activitiesTypes',
		tag: 'Activities / Types',
		method: 'GET',
		path: '/activityTypes/schema',
		pathKeys: [],
		operationId: 'activity-types-schema',
		summary: 'Activity Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						automatic: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						checkin: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fastCheckin: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						general: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						hide: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phoneCall: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						system: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						videoCall: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						visibleInActivities: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						visibleInAgendaActivities: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						visit: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						workflow: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listActivityTypes: {
		group: 'activitiesTypes',
		tag: 'Activities / Types',
		method: 'GET',
		path: '/activityTypes',
		pathKeys: [],
		operationId: 'list-activity-types',
		summary: 'List Activity Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					automatic: z.boolean().optional(),
					branchVisibility: z.json().optional(),
					checkin: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					fastCheckin: z.boolean().optional(),
					general: z.boolean().optional(),
					hide: z.boolean().optional(),
					id: z.number().int().optional(),
					order: z.json().optional(),
					phoneCall: z.boolean().optional(),
					salesRepIdCreated: z.json().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					system: z.boolean().optional(),
					videoCall: z.boolean().optional(),
					visibleInActivities: z.boolean().optional(),
					visibleInAgendaActivities: z.boolean().optional(),
					visit: z.boolean().optional(),
					workflow: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createActivityType: {
		group: 'activitiesTypes',
		tag: 'Activities / Types',
		method: 'POST',
		path: '/activityTypes',
		pathKeys: [],
		operationId: 'create-activity-type',
		summary: 'Create Activity Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						branchVisibility: z
							.array(z.record(z.string(), z.json()))
							.optional(),
						checkin: z.boolean().optional(),
						descriptionEN: z.string().optional(),
						descriptionES: z.string().optional(),
						fastCheckin: z.boolean().optional(),
						general: z.boolean().optional(),
						order: z.string().optional(),
						phoneCall: z.boolean().optional(),
						visit: z.boolean().optional(),
						videocall: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getActivityType: {
		group: 'activitiesTypes',
		tag: 'Activities / Types',
		method: 'GET',
		path: '/activityTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'get-activity-type',
		summary: 'Get Activity Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				automatic: z.boolean().optional(),
				branchVisibility: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				checkin: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.string().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				fastCheckin: z.boolean().optional(),
				general: z.boolean().optional(),
				hide: z.boolean().optional(),
				id: z.number().int().optional(),
				order: z.json().optional(),
				phoneCall: z.boolean().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				system: z.boolean().optional(),
				videoCall: z.boolean().optional(),
				visibleInActivities: z.boolean().optional(),
				visibleInAgendaActivities: z.boolean().optional(),
				visit: z.boolean().optional(),
				workflow: z.boolean().optional(),
			})
			.passthrough(),
	},
	updateActivityType: {
		group: 'activitiesTypes',
		tag: 'Activities / Types',
		method: 'PUT',
		path: '/activityTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'update-activity-type',
		summary: 'Update Activity Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionFR: z.string().optional(),
						descriptionIT: z.string().optional(),
						descriptionPT: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteActivityType: {
		group: 'activitiesTypes',
		tag: 'Activities / Types',
		method: 'DELETE',
		path: '/activityTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-activity-type',
		summary: 'Delete Activity Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	listActivityPoints: {
		group: 'activitiesPoints',
		tag: 'Activities / Points',
		method: 'GET',
		path: '/activity/points',
		pathKeys: [],
		operationId: 'list-activity-points',
		summary: 'List Activity Points',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				IntervalDays: z.number().int().optional(),
				PointsPerActivity: z.number().int().optional(),
				PointsPerCheckin: z.number().int().optional(),
				PointsPerEmail: z.number().int().optional(),
				PointsPerFastCheckin: z.number().int().optional(),
				PointsPerInternalEmail: z.number().int().optional(),
				PointsPerInternalPhoneCallMinute: z.number().int().optional(),
				PointsPerOpportunity: z.number().int().optional(),
				PointsPerPhoneCallMinute: z.number().int().optional(),
				PointsPerQuote: z.number().int().optional(),
				PointsPerSalesOrder: z.number().int().optional(),
				PointsPerVisit: z.number().int().optional(),
				SalesInput: z.number().int().optional(),
				ScoringPerEnvironment: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateActivityPoints: {
		group: 'activitiesPoints',
		tag: 'Activities / Points',
		method: 'PUT',
		path: '/activity/points',
		pathKeys: [],
		operationId: 'update-activity-points',
		summary: 'Update Activity Points',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						IntervalDays: z.number().int().optional(),
						PointsPerActivity: z.number().int().optional(),
						PointsPerCheckin: z.number().int().optional(),
						PointsPerEmail: z.number().int().optional(),
						PointsPerFastCheckin: z.number().int().optional(),
						PointsPerInternalEmail: z.number().int().optional(),
						PointsPerInternalPhoneCallMinute: z.number().int().optional(),
						PointsPerOpportunity: z.number().int().optional(),
						PointsPerPhoneCallMinute: z.number().int().optional(),
						PointsPerQuote: z.number().int().optional(),
						PointsPerSalesOrder: z.number().int().optional(),
						PointsPerVisit: z.number().int().optional(),
						SalesInput: z.number().int().optional(),
						ScoringPerEnvironment: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				IntervalDays: z.number().int().optional(),
				PointsPerActivity: z.number().int().optional(),
				PointsPerCheckin: z.number().int().optional(),
				PointsPerEmail: z.number().int().optional(),
				PointsPerInternalEmail: z.number().int().optional(),
				PointsPerInternalPhoneCallMinute: z.number().int().optional(),
				PointsPerOpportunity: z.number().int().optional(),
				PointsPerPhoneCallMinute: z.number().int().optional(),
				PointsPerQuote: z.number().int().optional(),
				PointsPerVisit: z.number().int().optional(),
				SalesInput: z.number().int().optional(),
				ScoringPerEnvironment: z.number().int().optional(),
			})
			.passthrough(),
	},
	branchesSchema: {
		group: 'branches',
		tag: 'Branches',
		method: 'GET',
		path: '/branches/schema',
		pathKeys: [],
		operationId: 'branches-schema',
		summary: 'Branches schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						currencyId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						default: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						imperialSystem: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						mainEnvironment: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						timeZoneId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listBranches: {
		group: 'branches',
		tag: 'Branches',
		method: 'GET',
		path: '/branches',
		pathKeys: [],
		operationId: 'list-branches',
		summary: 'List Branches',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					currencyId: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					default: z.boolean().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					extId: z.string().optional(),
					id: z.number().int().optional(),
					imperialSystem: z.boolean().optional(),
					mainEnvironment: z.boolean().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					timeZoneId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough(),
		),
	},
	getBranch: {
		group: 'branches',
		tag: 'Branches',
		method: 'GET',
		path: '/branches/{ID}',
		pathKeys: ['id'],
		operationId: 'get-branch',
		summary: 'Get Branch',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				currencyId: z.json().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				default: z.boolean().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				extId: z.string().optional(),
				id: z.number().int().optional(),
				imperialSystem: z.boolean().optional(),
				mainEnvironment: z.boolean().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				timeZoneId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	deleteBranch: {
		group: 'branches',
		tag: 'Branches',
		method: 'DELETE',
		path: '/branches/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-branch',
		summary: 'Delete Branch',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	bulkCreateResources: {
		group: 'bulks',
		tag: 'Bulks',
		method: 'POST',
		path: '/VALUE/bulk',
		pathKeys: ['value'],
		operationId: 'bulk-create-resources',
		summary: 'Bulk Create Resources',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.array(z.record(z.string(), z.json())),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					message: z.string().optional(),
					guid: z.string().optional(),
					code: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	bulkUpdateResources: {
		group: 'bulks',
		tag: 'Bulks',
		method: 'PUT',
		path: '/VALUE/bulk',
		pathKeys: ['value'],
		operationId: 'bulk-update-resources',
		summary: 'Bulk Update Resources',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.array(z.record(z.string(), z.json())),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					message: z.string().optional(),
					guid: z.string().optional(),
					code: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	bulkDeleteResources: {
		group: 'bulks',
		tag: 'Bulks',
		method: 'DELETE',
		path: '/VALUE/bulk',
		pathKeys: ['value'],
		operationId: 'bulk-delete-resources',
		summary: 'Bulk Delete Resources',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					message: z.string().optional(),
					guid: z.string().optional(),
					code: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	listCalls: {
		group: 'calls',
		tag: 'Calls',
		method: 'GET',
		path: '/calls',
		pathKeys: [],
		operationId: 'list-calls',
		summary: 'List Calls',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					duration: z.number().int().optional(),
					startDate: z.string().optional(),
					endDate: z.string().optional(),
					type: z.number().int().optional(),
					terminalType: z.number().int().optional(),
					phone: z.string().optional(),
					accountId: z.number().int().optional(),
					contactId: z.number().int().optional(),
					salesRepId: z.number().int().optional(),
					opportunityId: z.number().int().optional(),
					phoneAlias: z.string().optional(),
					description: z.string().optional(),
					timeZoneId: z.number().int().optional(),
					deleted: z.boolean().optional(),
					dateCreated: z.json().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createCallByUserId: {
		group: 'calls',
		tag: 'Calls',
		method: 'POST',
		path: '/calls',
		pathKeys: [],
		operationId: 'create-call-by-user-id',
		summary: 'Create Call by User ID',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						startDate: z.string().optional(),
						endDate: z.string().optional(),
						type: z.number().int().optional(),
						terminalType: z.number().int().optional(),
						phone: z.string().optional(),
						accountId: z.number().int().optional(),
						contactId: z.number().int().optional(),
						salesRepId: z.number().int().optional(),
						opportunityId: z.number().int().optional(),
						phoneAlias: z.string().optional(),
						timeZoneId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					duration: z.number().int().optional(),
					startDate: z.string().optional(),
					endDate: z.string().optional(),
					type: z.number().int().optional(),
					terminalType: z.number().int().optional(),
					phone: z.string().optional(),
					accountId: z.number().int().optional(),
					contactId: z.number().int().optional(),
					salesRepId: z.number().int().optional(),
					opportunityId: z.number().int().optional(),
					phoneAlias: z.string().optional(),
					description: z.string().optional(),
					timeZoneId: z.number().int().optional(),
					deleted: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createCallByUserPhoneNumber: {
		group: 'calls',
		tag: 'Calls',
		method: 'POST',
		path: '/calls/identify',
		pathKeys: [],
		operationId: 'create-call-by-user-phone-number',
		summary: 'Create Call by User Phone Number',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						startDate: z.string().optional(),
						endDate: z.string().optional(),
						type: z.number().int().optional(),
						terminalType: z.number().int().optional(),
						phone: z.string().optional(),
						accountId: z.number().int().optional(),
						contactId: z.number().int().optional(),
						userPhoneFM: z.string().optional(),
						opportunityId: z.number().int().optional(),
						phoneAlias: z.string().optional(),
						timeZoneId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ message: z.string().optional() }).passthrough(),
	},
	getCall: {
		group: 'calls',
		tag: 'Calls',
		method: 'GET',
		path: '/calls/{ID}',
		pathKeys: ['id'],
		operationId: 'get-call',
		summary: 'Get Call',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				duration: z.number().int().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				type: z.number().int().optional(),
				terminalType: z.number().int().optional(),
				phone: z.string().optional(),
				accountId: z.number().int().optional(),
				contactId: z.number().int().optional(),
				salesRepId: z.number().int().optional(),
				opportunityId: z.number().int().optional(),
				phoneAlias: z.string().optional(),
				description: z.string().optional(),
				timeZoneId: z.number().int().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.json().optional(),
				dateDeleted: z.string().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateCall: {
		group: 'calls',
		tag: 'Calls',
		method: 'PUT',
		path: '/calls/{ID}',
		pathKeys: ['id'],
		operationId: 'update-call',
		summary: 'Update Call',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						startDate: z.string().optional(),
						endDate: z.string().optional(),
						phone: z.string().optional(),
						accountId: z.number().int().optional(),
						contactId: z.number().int().optional(),
						salesRepId: z.number().int().optional(),
						opportunityId: z.number().int().optional(),
						phoneAlias: z.string().optional(),
						timeZoneId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				duration: z.number().int().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				type: z.number().int().optional(),
				terminalType: z.number().int().optional(),
				phone: z.string().optional(),
				accountId: z.number().int().optional(),
				contactId: z.number().int().optional(),
				salesRepId: z.number().int().optional(),
				opportunityId: z.number().int().optional(),
				phoneAlias: z.string().optional(),
				description: z.string().optional(),
				timeZoneId: z.number().int().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.json().optional(),
				dateDeleted: z.string().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	deleteCall: {
		group: 'calls',
		tag: 'Calls',
		method: 'DELETE',
		path: '/calls/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-call',
		summary: 'Delete Call',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.json(),
	},
	getResourcesByPhoneNumber: {
		group: 'calls',
		tag: 'Calls',
		method: 'GET',
		path: '/calls/phone/VALUE',
		pathKeys: ['value'],
		operationId: 'get-resources-by-phone-number',
		summary: 'Get Resources by Phone Number',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				userIds: z.array(z.json()).optional(),
				contactIds: z.array(z.number().int()).optional(),
				accountIds: z.array(z.number().int()).optional(),
			})
			.passthrough(),
	},
	listCampaigns: {
		group: 'campaignsEntity',
		tag: 'Campaigns / Entity',
		method: 'GET',
		path: '/campaigns',
		pathKeys: [],
		operationId: 'list-campaigns',
		summary: 'List Campaigns',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					title: z.string().optional(),
					description: z.string().optional(),
					ownerId: z.number().int().optional(),
					statusId: z.number().int().optional(),
					typeId: z.number().int().optional(),
					startDate: z.string().optional(),
					endDate: z.string().optional(),
					deleted: z.boolean().optional(),
					videoUrl: z.string().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createCampaign: {
		group: 'campaignsEntity',
		tag: 'Campaigns / Entity',
		method: 'POST',
		path: '/campaigns',
		pathKeys: [],
		operationId: 'create-campaign',
		summary: 'Create Campaign',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						title: z.string().optional(),
						description: z.string().optional(),
						ownerId: z.number().int().optional(),
						statusId: z.number().int().optional(),
						typeId: z.number().int().optional(),
						startDate: z.string().optional(),
						endDate: z.string().optional(),
						deleted: z.boolean().optional(),
						videoUrl: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				title: z.string().optional(),
				description: z.string().optional(),
				ownerId: z.number().int().optional(),
				statusId: z.number().int().optional(),
				typeId: z.number().int().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				deleted: z.boolean().optional(),
				videoUrl: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	getCampaign: {
		group: 'campaignsEntity',
		tag: 'Campaigns / Entity',
		method: 'GET',
		path: '/campaigns/{ID}',
		pathKeys: ['id'],
		operationId: 'get-campaign',
		summary: 'Get Campaign',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				title: z.string().optional(),
				description: z.string().optional(),
				ownerId: z.number().int().optional(),
				statusId: z.number().int().optional(),
				typeId: z.number().int().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				deleted: z.boolean().optional(),
				videoUrl: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateCampaign: {
		group: 'campaignsEntity',
		tag: 'Campaigns / Entity',
		method: 'PUT',
		path: '/campaigns/{ID}',
		pathKeys: ['id'],
		operationId: 'update-campaign',
		summary: 'Update Campaign',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						startDate: z.string().optional(),
						endDate: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				title: z.string().optional(),
				description: z.string().optional(),
				ownerId: z.number().int().optional(),
				statusId: z.number().int().optional(),
				typeId: z.number().int().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
				deleted: z.boolean().optional(),
				videoUrl: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	deleteCampaign: {
		group: 'campaignsEntity',
		tag: 'Campaigns / Entity',
		method: 'DELETE',
		path: '/campaigns/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-campaign',
		summary: 'Delete Campaign',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ message: z.string().optional() }).passthrough(),
	},
	listOpportunityTypes: {
		group: 'opportunitiesTypes',
		tag: 'Opportunities / Types',
		method: 'GET',
		path: '/opportunityTypes',
		pathKeys: [],
		operationId: 'list-opportunity-types',
		summary: 'List Opportunity Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.string(),
	},
	createOpportunityType: {
		group: 'opportunitiesTypes',
		tag: 'Opportunities / Types',
		method: 'POST',
		path: '/opportunityTypes',
		pathKeys: [],
		operationId: 'create-opportunity-type',
		summary: 'Create Opportunity Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						branchVisibility: z
							.array(z.record(z.string(), z.json()))
							.optional(),
						descriptionEN: z.string().optional(),
						defaultStatus: z.number().int().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	listCampaignStatuses: {
		group: 'campaignsStatuses',
		tag: 'Campaigns / Statuses',
		method: 'GET',
		path: '/campaignStatuses',
		pathKeys: [],
		operationId: 'list-campaign-statuses',
		summary: 'List Campaign Statuses',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionDE: z.string().optional(),
					descriptionPT: z.string().optional(),
					descriptionUS: z.string().optional(),
					descriptionBR: z.string().optional(),
					descriptionRU: z.string().optional(),
					descriptionDK: z.string().optional(),
				})
				.passthrough(),
		),
	},
	listCampaignAccounts: {
		group: 'campaignsAccounts',
		tag: 'Campaigns / Accounts',
		method: 'GET',
		path: '/campaigns/{ID}/entities',
		pathKeys: ['id'],
		operationId: 'list-campaign-accounts',
		summary: 'List Campaign Accounts',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.json(),
	},
	createCampaignAccount: {
		group: 'campaignsAccounts',
		tag: 'Campaigns / Accounts',
		method: 'POST',
		path: '/campaigns/{ID}/entities/VALUE',
		pathKeys: ['id', 'value'],
		operationId: 'create-campaign-account',
		summary: 'Create Campaign Account',
		input: z
			.object({
				path: z
					.object({
						id: z.union([z.number().int(), z.string().min(1)]),
						value: z.string().min(1),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						activityId: z.number().int().optional(),
						completed: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				campaignId: z.number().int().optional(),
				accountId: z.number().int().optional(),
				activityId: z.number().int().optional(),
				completed: z.boolean().optional(),
				deleted: z.boolean().optional(),
				DateCreated: z.string().optional(),
				DateDeleted: z.json().optional(),
				DateUpdated: z.json().optional(),
				SalesRepIdCreated: z.number().int().optional(),
				SalesRepIdUpdated: z.number().int().optional(),
				SalesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	getCampaignAccount: {
		group: 'campaignsAccounts',
		tag: 'Campaigns / Accounts',
		method: 'GET',
		path: '/campaigns/{ID}/entities/VALUE',
		pathKeys: ['id', 'value'],
		operationId: 'get-campaign-account',
		summary: 'Get Campaign Account',
		input: z
			.object({
				path: z
					.object({
						id: z.union([z.number().int(), z.string().min(1)]),
						value: z.string().min(1),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				campaignId: z.number().int().optional(),
				accountId: z.number().int().optional(),
				activityId: z.number().int().optional(),
				completed: z.boolean().optional(),
				deleted: z.boolean().optional(),
				DateCreated: z.string().optional(),
				DateDeleted: z.json().optional(),
				DateUpdated: z.json().optional(),
				SalesRepIdCreated: z.number().int().optional(),
				SalesRepIdUpdated: z.number().int().optional(),
				SalesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateCampaignAccount: {
		group: 'campaignsAccounts',
		tag: 'Campaigns / Accounts',
		method: 'PUT',
		path: '/campaigns/{ID}/entities/VALUE',
		pathKeys: ['id', 'value'],
		operationId: 'update-campaign-account',
		summary: 'Update Campaign Account',
		input: z
			.object({
				path: z
					.object({
						id: z.union([z.number().int(), z.string().min(1)]),
						value: z.string().min(1),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						activityId: z.number().int().optional(),
						completed: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				campaignId: z.number().int().optional(),
				accountId: z.number().int().optional(),
				activityId: z.number().int().optional(),
				completed: z.boolean().optional(),
				deleted: z.boolean().optional(),
				DateCreated: z.string().optional(),
				DateDeleted: z.json().optional(),
				DateUpdated: z.string().optional(),
				SalesRepIdCreated: z.number().int().optional(),
				SalesRepIdUpdated: z.number().int().optional(),
				SalesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	deleteCampaignAccount: {
		group: 'campaignsAccounts',
		tag: 'Campaigns / Accounts',
		method: 'DELETE',
		path: '/campaigns/{ID}/entities/VALUE',
		pathKeys: ['id', 'value'],
		operationId: 'delete-campaign-account',
		summary: 'Delete Campaign Account',
		input: z
			.object({
				path: z
					.object({
						id: z.union([z.number().int(), z.string().min(1)]),
						value: z.string().min(1),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ message: z.string().optional() }).passthrough(),
	},
	listCampaignQuestions: {
		group: 'campaignsQuestions',
		tag: 'Campaigns / Questions',
		method: 'GET',
		path: '/campaignQuestions',
		pathKeys: [],
		operationId: 'list-campaign-questions',
		summary: 'List Campaign Questions',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					campaignId: z.number().int().optional(),
					textES: z.string().optional(),
					textEN: z.string().optional(),
					textIT: z.string().optional(),
					textFR: z.string().optional(),
					textDE: z.string().optional(),
					textPT: z.string().optional(),
					textUS: z.string().optional(),
					textBR: z.string().optional(),
					textRU: z.string().optional(),
					textDK: z.string().optional(),
					type: z.string().optional(),
					mandatory: z.boolean().optional(),
					deleted: z.boolean().optional(),
					order: z.number().int().optional(),
					valueListName: z.string().optional(),
					linkedEntity: z.string().optional(),
					linkedEntityField: z.string().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
					custom: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createCampaignQuestion: {
		group: 'campaignsQuestions',
		tag: 'Campaigns / Questions',
		method: 'POST',
		path: '/campaignQuestions',
		pathKeys: [],
		operationId: 'create-campaign-question',
		summary: 'Create Campaign Question',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.array(z.record(z.string(), z.json())),
			})
			.strict(),
		output: z.array(
			z
				.object({
					campaignId: z.number().int().optional(),
					textES: z.string().optional(),
					textEN: z.string().optional(),
					textIT: z.string().optional(),
					textFR: z.string().optional(),
					textDE: z.string().optional(),
					textPT: z.string().optional(),
					textUS: z.string().optional(),
					textBR: z.string().optional(),
					textRU: z.string().optional(),
					textDK: z.string().optional(),
					type: z.string().optional(),
					mandatory: z.boolean().optional(),
					deleted: z.boolean().optional(),
					order: z.number().int().optional(),
					valueListName: z.string().optional(),
					linkedEntity: z.string().optional(),
					linkedEntityField: z.string().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
					custom: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	getCampaignQuestion: {
		group: 'campaignsQuestions',
		tag: 'Campaigns / Questions',
		method: 'GET',
		path: '/campaignQuestions/{ID}',
		pathKeys: ['id'],
		operationId: 'get-campaign-question',
		summary: 'Get Campaign Question',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				campaignId: z.number().int().optional(),
				textES: z.string().optional(),
				textEN: z.string().optional(),
				textIT: z.string().optional(),
				textFR: z.string().optional(),
				textDE: z.string().optional(),
				textPT: z.string().optional(),
				textUS: z.string().optional(),
				textBR: z.string().optional(),
				textRU: z.string().optional(),
				textDK: z.string().optional(),
				type: z.string().optional(),
				mandatory: z.boolean().optional(),
				deleted: z.boolean().optional(),
				order: z.number().int().optional(),
				valueListName: z.string().optional(),
				linkedEntity: z.string().optional(),
				linkedEntityField: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
				custom: z.boolean().optional(),
			})
			.passthrough(),
	},
	updateCampaignQuestion: {
		group: 'campaignsQuestions',
		tag: 'Campaigns / Questions',
		method: 'PUT',
		path: '/campaignQuestions/{ID}',
		pathKeys: ['id'],
		operationId: 'update-campaign-question',
		summary: 'Update Campaign Question',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						textEN: z.string().optional(),
						mandatory: z.boolean().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				campaignId: z.number().int().optional(),
				textES: z.string().optional(),
				textEN: z.string().optional(),
				textIT: z.string().optional(),
				textFR: z.string().optional(),
				textDE: z.string().optional(),
				textPT: z.string().optional(),
				textUS: z.string().optional(),
				textBR: z.string().optional(),
				textRU: z.string().optional(),
				textDK: z.string().optional(),
				type: z.string().optional(),
				mandatory: z.boolean().optional(),
				deleted: z.boolean().optional(),
				order: z.number().int().optional(),
				valueListName: z.string().optional(),
				linkedEntity: z.string().optional(),
				linkedEntityField: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
				custom: z.boolean().optional(),
			})
			.passthrough(),
	},
	deleteCampaignQuestion: {
		group: 'campaignsQuestions',
		tag: 'Campaigns / Questions',
		method: 'DELETE',
		path: '/campaignQuestions/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-campaign-question',
		summary: 'Delete Campaign Question',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ message: z.string().optional() }).passthrough(),
	},
	listQuestionAnswers: {
		group: 'campaignsQuestionAnswers',
		tag: 'Campaigns / Question Answers',
		method: 'GET',
		path: '/campaignQuestions/VALUE/answers',
		pathKeys: ['value'],
		operationId: 'list-question-answers',
		summary: 'List Question Answers',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					questionId: z.number().int().optional(),
					activityId: z.number().int().optional(),
					value: z.string().optional(),
					deleted: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createQuestionAnswer: {
		group: 'campaignsQuestionAnswers',
		tag: 'Campaigns / Question Answers',
		method: 'POST',
		path: '/campaignQuestions/VALUE/answers',
		pathKeys: ['value'],
		operationId: 'create-question-answer',
		summary: 'Create Question Answer',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						activityId: z.number().int().optional(),
						value: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				questionId: z.number().int().optional(),
				activityId: z.number().int().optional(),
				value: z.string().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	getQuestionAnswer: {
		group: 'campaignsQuestionAnswers',
		tag: 'Campaigns / Question Answers',
		method: 'GET',
		path: '/campaignQuestions/VALUE/answers/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'get-question-answer',
		summary: 'Get Question Answer',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				questionId: z.number().int().optional(),
				activityId: z.number().int().optional(),
				value: z.string().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateQuestionAnswer: {
		group: 'campaignsQuestionAnswers',
		tag: 'Campaigns / Question Answers',
		method: 'PUT',
		path: '/campaignQuestions/VALUE/answers/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'update-question-answer',
		summary: 'Update Question Answer',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						activityId: z.number().int().optional(),
						value: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				questionId: z.number().int().optional(),
				activityId: z.number().int().optional(),
				value: z.string().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	deleteQuestionAnswer: {
		group: 'campaignsQuestionAnswers',
		tag: 'Campaigns / Question Answers',
		method: 'DELETE',
		path: '/campaignQuestions/VALUE/answers/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'delete-question-answer',
		summary: 'Delete Question Answer',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ message: z.string().optional() }).passthrough(),
	},
	listQuestionValues: {
		group: 'campaignsQuestionValues',
		tag: 'Campaigns / Question Values',
		method: 'GET',
		path: '/campaignQuestions/VALUE/values',
		pathKeys: ['value'],
		operationId: 'list-question-values',
		summary: 'List Question Values',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					questionId: z.number().int().optional(),
					textES: z.string().optional(),
					textEN: z.string().optional(),
					textIT: z.string().optional(),
					textFR: z.string().optional(),
					textDE: z.string().optional(),
					textPT: z.string().optional(),
					textUS: z.string().optional(),
					textBR: z.string().optional(),
					textRU: z.string().optional(),
					textDK: z.string().optional(),
					deleted: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					id: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createQuestionValue: {
		group: 'campaignsQuestionValues',
		tag: 'Campaigns / Question Values',
		method: 'POST',
		path: '/campaignQuestions/{ID}/values',
		pathKeys: ['id'],
		operationId: 'create-question-value',
		summary: 'Create Question Value',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ textEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z
			.object({
				questionId: z.number().int().optional(),
				textES: z.string().optional(),
				textEN: z.string().optional(),
				textIT: z.string().optional(),
				textFR: z.string().optional(),
				textDE: z.string().optional(),
				textPT: z.string().optional(),
				textUS: z.string().optional(),
				textBR: z.string().optional(),
				textRU: z.string().optional(),
				textDK: z.string().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	getQuestionValue: {
		group: 'campaignsQuestionValues',
		tag: 'Campaigns / Question Values',
		method: 'GET',
		path: '/campaignQuestions/VALUE/values/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'get-question-value',
		summary: 'Get Question Value',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				questionId: z.number().int().optional(),
				textES: z.string().optional(),
				textEN: z.string().optional(),
				textIT: z.string().optional(),
				textFR: z.string().optional(),
				textDE: z.string().optional(),
				textPT: z.string().optional(),
				textUS: z.string().optional(),
				textBR: z.string().optional(),
				textRU: z.string().optional(),
				textDK: z.string().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateQuestionValue: {
		group: 'campaignsQuestionValues',
		tag: 'Campaigns / Question Values',
		method: 'PUT',
		path: '/campaignQuestions/VALUE/values/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'update-question-value',
		summary: 'Update Question Value',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ textEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z
			.object({
				questionId: z.number().int().optional(),
				textES: z.string().optional(),
				textEN: z.string().optional(),
				textIT: z.string().optional(),
				textFR: z.string().optional(),
				textDE: z.string().optional(),
				textPT: z.string().optional(),
				textUS: z.string().optional(),
				textBR: z.string().optional(),
				textRU: z.string().optional(),
				textDK: z.string().optional(),
				deleted: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				id: z.number().int().optional(),
			})
			.passthrough(),
	},
	deleteQuestionValue: {
		group: 'campaignsQuestionValues',
		tag: 'Campaigns / Question Values',
		method: 'DELETE',
		path: '/campaignQuestions/VALUE/values/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'delete-question-value',
		summary: 'Delete Question Value',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ message: z.string().optional() }).passthrough(),
	},
	contactsSchema: {
		group: 'contactsEntity',
		tag: 'Contacts / Entity',
		method: 'GET',
		path: '/contacts/schema',
		pathKeys: [],
		operationId: 'contacts-schema',
		summary: 'Contacts schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						UseCompanyAddress: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						address1: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						birthday: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						city: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						comment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						countryId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						email: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						email2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						email3: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fax: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						firstName: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						gender: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lastName: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						linkedin: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						marketingCommunications: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						permissionLevel: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phone1: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phone2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						postcode: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						region: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						skype: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						typeId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listContacts: {
		group: 'contactsEntity',
		tag: 'Contacts / Entity',
		method: 'GET',
		path: '/contacts',
		pathKeys: [],
		operationId: 'list-contacts',
		summary: 'List Contacts',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					UseCompanyAddress: z.boolean().optional(),
					accountId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					address1: z.string().optional(),
					birthday: z.json().optional(),
					city: z.string().optional(),
					comment: z.string().optional(),
					countryId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					email: z.string().optional(),
					email2: z.json().optional(),
					email3: z.json().optional(),
					extId: z.json().optional(),
					fax: z.string().optional(),
					firstName: z.string().optional(),
					gender: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					id: z.number().int().optional(),
					lastName: z.string().optional(),
					linkedin: z.string().optional(),
					marketingCommunications: z.boolean().optional(),
					permissionLevel: z.number().int().optional(),
					phone1: z.string().optional(),
					phone2: z.string().optional(),
					postcode: z.string().optional(),
					readOnly: z.boolean().optional(),
					region: z.string().optional(),
					salesRepId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					skype: z.string().optional(),
					typeId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough(),
		),
	},
	createContact: {
		group: 'contactsEntity',
		tag: 'Contacts / Entity',
		method: 'POST',
		path: '/contacts',
		pathKeys: [],
		operationId: 'create-contact',
		summary: 'Create Contact',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountId: z.number().int(),
						address1: z.string().optional(),
						city: z.string().optional(),
						comment: z.string().optional(),
						countryId: z.number().int().optional(),
						email: z.string().optional(),
						fax: z.string().optional(),
						firstName: z.string(),
						gender: z.number().int().optional(),
						lastName: z.string(),
						linkedin: z.string().optional(),
						permissionLevel: z.number().int().optional(),
						phone1: z.string().optional(),
						phone2: z.string().optional(),
						postcode: z.string().optional(),
						readOnly: z.boolean().optional(),
						region: z.string().optional(),
						salesRepId: z.number().int(),
						skype: z.string().optional(),
						typeId: z.number().int().optional(),
						birthday: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getContact: {
		group: 'contactsEntity',
		tag: 'Contacts / Entity',
		method: 'GET',
		path: '/contacts/{ID}',
		pathKeys: ['id'],
		operationId: 'get-contact',
		summary: 'Get Contact',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				UseCompanyAddress: z.boolean().optional(),
				accountId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				address1: z.string().optional(),
				birthday: z.string().optional(),
				city: z.string().optional(),
				comment: z.string().optional(),
				countryId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				email: z.string().optional(),
				email2: z.json().optional(),
				email3: z.json().optional(),
				extId: z.json().optional(),
				fax: z.string().optional(),
				firstName: z.string().optional(),
				gender: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				id: z.number().int().optional(),
				lastName: z.string().optional(),
				linkedin: z.string().optional(),
				marketingCommunications: z.boolean().optional(),
				permissionLevel: z.number().int().optional(),
				phone1: z.string().optional(),
				phone2: z.string().optional(),
				postcode: z.string().optional(),
				readOnly: z.boolean().optional(),
				region: z.string().optional(),
				salesRepId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				skype: z.string().optional(),
				typeId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	updateContact: {
		group: 'contactsEntity',
		tag: 'Contacts / Entity',
		method: 'PUT',
		path: '/contacts/{ID}',
		pathKeys: ['id'],
		operationId: 'update-contact',
		summary: 'Update Contact',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						address1: z.string().optional(),
						city: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteContact: {
		group: 'contactsEntity',
		tag: 'Contacts / Entity',
		method: 'DELETE',
		path: '/contacts/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-contact',
		summary: 'Delete Contact',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	contactTypesSchema: {
		group: 'contactsTypes',
		tag: 'Contacts / Types',
		method: 'GET',
		path: '/contactTypes/schema',
		pathKeys: [],
		operationId: 'contact-types-schema',
		summary: 'Contact Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listContactTypes: {
		group: 'contactsTypes',
		tag: 'Contacts / Types',
		method: 'GET',
		path: '/contactTypes',
		pathKeys: [],
		operationId: 'list-contact-types',
		summary: 'List Contact Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					order: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createContactType: {
		group: 'contactsTypes',
		tag: 'Contacts / Types',
		method: 'POST',
		path: '/contactTypes',
		pathKeys: [],
		operationId: 'create-contact-type',
		summary: 'Create Contact Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getContactType: {
		group: 'contactsTypes',
		tag: 'Contacts / Types',
		method: 'GET',
		path: '/contactTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'get-contact-type',
		summary: 'Get Contact Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.json().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.string().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				order: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateContactType: {
		group: 'contactsTypes',
		tag: 'Contacts / Types',
		method: 'PUT',
		path: '/contactTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'update-contact-type',
		summary: 'Update Contact Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteContactType: {
		group: 'contactsTypes',
		tag: 'Contacts / Types',
		method: 'DELETE',
		path: '/contactTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-contact-type',
		summary: 'Delete Contact Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	countriesSchema: {
		group: 'countries',
		tag: 'Countries',
		method: 'GET',
		path: '/countries/schema',
		pathKeys: [],
		operationId: 'countries-schema',
		summary: 'Countries schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionde: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionen: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionfr: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionit: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionpt: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						iso2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						iso3: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						isoNum: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phoneCode: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						strName: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listCountries: {
		group: 'countries',
		tag: 'Countries',
		method: 'GET',
		path: '/countries',
		pathKeys: [],
		operationId: 'list-countries',
		summary: 'List Countries',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.string().optional(),
					descriptionDK: z.string().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.string().optional(),
					descriptionde: z.string().optional(),
					descriptionen: z.string().optional(),
					descriptionfr: z.string().optional(),
					descriptionit: z.string().optional(),
					descriptionpt: z.string().optional(),
					id: z.number().int().optional(),
					iso2: z.string().optional(),
					iso3: z.string().optional(),
					isoNum: z.number().int().optional(),
					phoneCode: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					strName: z.string().optional(),
				})
				.passthrough(),
		),
	},
	currenciesSchema: {
		group: 'currencies',
		tag: 'Currencies',
		method: 'GET',
		path: '/currencies/schema',
		pathKeys: [],
		operationId: 'currencies-schema',
		summary: 'Currencies schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						isoCode: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						symbol: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listCurrencies: {
		group: 'currencies',
		tag: 'Currencies',
		method: 'GET',
		path: '/currencies',
		pathKeys: [],
		operationId: 'list-currencies',
		summary: 'List Currencies',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.json().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					isoCode: z.string().optional(),
					salesRepIdCreated: z.json().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					symbol: z.string().optional(),
				})
				.passthrough(),
		),
	},
	listDocuments: {
		group: 'documentsEntity',
		tag: 'Documents / Entity',
		method: 'GET',
		path: '/documents',
		pathKeys: [],
		operationId: 'list-documents',
		summary: 'List Documents',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					description: z.string().optional(),
					name: z.string().optional(),
					extension: z.string().optional(),
					folderId: z.number().int().optional(),
					opportunityId: z.number().int().optional(),
					quoteId: z.number().int().optional(),
					deleted: z.boolean().optional(),
					dateDeleted: z.json().optional(),
					userId: z.number().int().optional(),
					size: z.number().int().optional(),
					level: z.number().int().optional(),
					accountId: z.number().int().optional(),
					contactId: z.number().int().optional(),
					activityId: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					extId: z.json().optional(),
					link: z.string().optional(),
					salesOrderId: z.number().int().optional(),
					formId: z.number().int().optional(),
					billboardId: z.number().int().optional(),
					carrousel: z.boolean().optional(),
					campaignId: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	addDocument: {
		group: 'documentsEntity',
		tag: 'Documents / Entity',
		method: 'POST',
		path: '/documents',
		pathKeys: [],
		operationId: 'add-document',
		summary: 'Add Document',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						folderId: z.string().optional(),
						name: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.json(),
	},
	listDocumentsOfAResource: {
		group: 'documentsEntity',
		tag: 'Documents / Entity',
		method: 'GET',
		path: '/VALUE/VALUE/documents',
		pathKeys: ['value', 'value2'],
		operationId: 'list-documents-of-a-resource',
		summary: 'List Documents of a Resource',
		input: z
			.object({
				path: z
					.object({ value: z.string().min(1), value2: z.string().min(1) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					description: z.string().optional(),
					name: z.string().optional(),
					extension: z.string().optional(),
					folderId: z.number().int().optional(),
					opportunityId: z.number().int().optional(),
					quoteId: z.number().int().optional(),
					deleted: z.boolean().optional(),
					dateDeleted: z.json().optional(),
					userId: z.number().int().optional(),
					size: z.number().int().optional(),
					level: z.number().int().optional(),
					accountId: z.number().int().optional(),
					activityId: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					extId: z.json().optional(),
					link: z.string().optional(),
					salesOrderId: z.number().int().optional(),
					formId: z.number().int().optional(),
					billboardId: z.number().int().optional(),
					campaignId: z.number().int().optional(),
					contactId: z.number().int().optional(),
					isCarroussel: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	addDocumentToAResource: {
		group: 'documentsEntity',
		tag: 'Documents / Entity',
		method: 'POST',
		path: '/VALUE/VALUE/documents',
		pathKeys: ['value', 'value2'],
		operationId: 'add-document-to-a-resource',
		summary: 'Add Document to a Resource',
		input: z
			.object({
				path: z
					.object({ value: z.string().min(1), value2: z.string().min(1) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						folderId: z.string().optional(),
						name: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.json(),
	},
	deletePicture: {
		group: 'productsCarousel',
		tag: 'Products / Carousel',
		method: 'DELETE',
		path: '/documents/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-picture',
		summary: 'Delete Picture',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	listFolders: {
		group: 'documentsFolders',
		tag: 'Documents / Folders',
		method: 'GET',
		path: '/documents/folders',
		pathKeys: [],
		operationId: 'list-folders',
		summary: 'List Folders',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.json().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					dateDeleted: z.json().optional(),
					name: z.string().optional(),
					folderId: z.number().int().optional(),
					restrictSucursales: z.boolean().optional(),
					level: z.number().int().optional(),
					entityId: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createFolder: {
		group: 'documentsFolders',
		tag: 'Documents / Folders',
		method: 'POST',
		path: '/documents/folders',
		pathKeys: [],
		operationId: 'create-folder',
		summary: 'Create Folder',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						folderId: z.number().int().optional(),
						name: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	listFoldersOfAResource: {
		group: 'documentsFolders',
		tag: 'Documents / Folders',
		method: 'GET',
		path: '/VALUE/VALUE/documents/folders',
		pathKeys: ['value', 'value2'],
		operationId: 'list-folders-of-a-resource',
		summary: 'List Folders of a Resource',
		input: z
			.object({
				path: z
					.object({ value: z.string().min(1), value2: z.string().min(1) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.json().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					dateDeleted: z.json().optional(),
					name: z.string().optional(),
					folderId: z.number().int().optional(),
					restrictSucursales: z.boolean().optional(),
					level: z.number().int().optional(),
					entityId: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createFolderForAResource: {
		group: 'documentsFolders',
		tag: 'Documents / Folders',
		method: 'POST',
		path: '/VALUE/VALUE/documents/folders',
		pathKeys: ['value', 'value2'],
		operationId: 'create-folder-for-a-resource',
		summary: 'Create Folder for a Resource',
		input: z
			.object({
				path: z
					.object({ value: z.string().min(1), value2: z.string().min(1) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						folderId: z.number().int().optional(),
						name: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	emailsSchema: {
		group: 'emails',
		tag: 'Emails',
		method: 'GET',
		path: '/emails/schema',
		pathKeys: [],
		operationId: 'emails-schema',
		summary: 'Emails schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountId: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						attachments: z
							.object({
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										name: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						body: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						contactId: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						date: z
							.object({
								properties: z
									.object({
										time: z
											.object({
												format: z.string().optional(),
												readOnly: z.boolean().optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough()
											.optional(),
										timeStamp: z
											.object({
												format: z.string().optional(),
												readOnly: z.boolean().optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough()
											.optional(),
										timeZone: z
											.object({
												readOnly: z.boolean().optional(),
												type: z.array(z.string()).optional(),
											})
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
							})
							.passthrough()
							.optional(),
						date_created: z
							.object({
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						date_deleted: z
							.object({
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						date_updated: z
							.object({
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						emailFrom: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						emailTo: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						mailFolder: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						opportunityId: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						subject: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						type: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						user_created: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						user_deleted: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						user_updated: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listEmails: {
		group: 'emails',
		tag: 'Emails',
		method: 'GET',
		path: '/emails',
		pathKeys: [],
		operationId: 'list-emails',
		summary: 'List Emails',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					emailTo: z.string().optional(),
					attachments: z.array(z.json()).optional(),
					extId: z.json().optional(),
					accountId: z.number().int().optional(),
					contactId: z.number().int().optional(),
					opportunityId: z.json().optional(),
					salesRepId: z.number().int().optional(),
					emailFrom: z.string().optional(),
					body: z.string().optional(),
					date: z
						.object({
							time: z.string().optional(),
							timeStamp: z.number().int().optional(),
							timeZone: z.string().optional(),
						})
						.passthrough()
						.optional(),
					type: z.number().int().optional(),
					mailFolder: z.json().optional(),
					subject: z.string().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.json().optional(),
					dateDeleted: z.json().optional(),
					deleted: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createEmail: {
		group: 'emails',
		tag: 'Emails',
		method: 'POST',
		path: '/emails',
		pathKeys: [],
		operationId: 'create-email',
		summary: 'Create Email',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						emailTo: z.array(z.record(z.string(), z.json())).optional(),
						attachments: z.array(z.record(z.string(), z.json())).optional(),
						extId: z.string().optional(),
						accountId: z.number().int().optional(),
						contactId: z.number().int().optional(),
						opportunityId: z.number().int().optional(),
						salesRepId: z.number().int().optional(),
						emailFrom: z.string().optional(),
						body: z.string().optional(),
						date: z.string().optional(),
						type: z.number().int().optional(),
						mailFolder: z.string().optional(),
						subject: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					emailTo: z.string().optional(),
				})
				.passthrough(),
		),
	},
	getEmail: {
		group: 'emails',
		tag: 'Emails',
		method: 'GET',
		path: '/emails/{ID}',
		pathKeys: ['id'],
		operationId: 'get-email',
		summary: 'Get Email',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.json(),
	},
	entityContactsSchema: {
		group: 'entityContacts',
		tag: 'Entity Contacts',
		method: 'GET',
		path: '/contactsEntities/schema',
		pathKeys: [],
		operationId: 'entity-contacts-schema',
		summary: 'Entity Contacts schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.json(),
	},
	listEntityContacts: {
		group: 'entityContacts',
		tag: 'Entity Contacts',
		method: 'GET',
		path: '/contactsEntities',
		pathKeys: [],
		operationId: 'list-entity-contacts',
		summary: 'List Entity Contacts',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.json(),
	},
	entityOwnersSchema: {
		group: 'entityOwners',
		tag: 'Entity Owners',
		method: 'GET',
		path: '/entityOwners/schema',
		pathKeys: [],
		operationId: 'entity-owners-schema',
		summary: 'Entity Owners schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						entityId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						entityTypeId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepOrder: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listEntityOwners: {
		group: 'entityOwners',
		tag: 'Entity Owners',
		method: 'GET',
		path: '/entityOwners',
		pathKeys: [],
		operationId: 'list-entity-owners',
		summary: 'List Entity Owners',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					entityId: z.number().int().optional(),
					entityTypeId: z.number().int().optional(),
					id: z.number().int().optional(),
					salesRepId: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					salesRepOrder: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	calendarSchema: {
		group: 'eventsTasks',
		tag: 'Events/Tasks',
		method: 'GET',
		path: '/calendar/schema',
		pathKeys: [],
		operationId: 'calendar-schema',
		summary: 'Calendar schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						Completed: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						allDay: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						comment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						contactId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						endDate: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						endHour: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						opportunityId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						permissionLevel: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reminder: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						sendNotification: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						startDate: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						startHour: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						subject: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						task: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						typeId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						videoCallMeetingDetails: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						videoCallProviderId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listCalendar: {
		group: 'eventsTasks',
		tag: 'Events/Tasks',
		method: 'GET',
		path: '/calendar',
		pathKeys: [],
		operationId: 'list-calendar',
		summary: 'List Calendar',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountId: z.json().optional(),
					allDay: z.boolean().optional(),
					branchId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					comment: z.string().optional(),
					completed: z.boolean().optional(),
					contactId: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					endDate: z.json().optional(),
					endHour: z.json().optional(),
					extId: z.json().optional(),
					id: z.number().int().optional(),
					opportunityId: z.json().optional(),
					permissionLevel: z.number().int().optional(),
					readOnly: z.boolean().optional(),
					reminder: z.number().int().optional(),
					salesRepId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					sendNotification: z.boolean().optional(),
					startDate: z.string().optional(),
					startHour: z.string().optional(),
					subject: z.string().optional(),
					task: z.boolean().optional(),
					typeId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough(),
		),
	},
	createCalendar: {
		group: 'eventsTasks',
		tag: 'Events/Tasks',
		method: 'POST',
		path: '/calendar',
		pathKeys: [],
		operationId: 'create-calendar',
		summary: 'Create Calendar',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountId: z.number().int().optional(),
						allDay: z.boolean().optional(),
						branchId: z.number().int().optional(),
						comment: z.string().optional(),
						contactId: z.number().int().optional(),
						endDate: z.string().optional(),
						salesRepId: z.number().int().optional(),
						sendNotification: z.boolean().optional(),
						startDate: z.string().optional(),
						startHour: z.string().optional(),
						subject: z.string().optional(),
						task: z.boolean().optional(),
						typeId: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getCalendar: {
		group: 'eventsTasks',
		tag: 'Events/Tasks',
		method: 'GET',
		path: '/calendar/{ID}',
		pathKeys: ['id'],
		operationId: 'get-calendar',
		summary: 'Get Calendar',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				allDay: z.boolean().optional(),
				branchId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				comment: z.string().optional(),
				completed: z.boolean().optional(),
				contactId: z.json().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				endDate: z.string().optional(),
				endHour: z.string().optional(),
				extId: z.json().optional(),
				id: z.number().int().optional(),
				opportunityId: z.json().optional(),
				permissionLevel: z.number().int().optional(),
				readOnly: z.boolean().optional(),
				reminder: z.number().int().optional(),
				salesRepId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				sendNotification: z.boolean().optional(),
				startDate: z.string().optional(),
				startHour: z.string().optional(),
				subject: z.string().optional(),
				task: z.boolean().optional(),
				typeId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	updateCalendar: {
		group: 'eventsTasks',
		tag: 'Events/Tasks',
		method: 'PUT',
		path: '/calendar/{ID}',
		pathKeys: ['id'],
		operationId: 'update-calendar',
		summary: 'Update Calendar',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						salesRepId: z.string().optional(),
						sendNotification: z.boolean().optional(),
						startDate: z.string().optional(),
						startHour: z.string().optional(),
						subject: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteCalendar: {
		group: 'eventsTasks',
		tag: 'Events/Tasks',
		method: 'DELETE',
		path: '/calendar/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-calendar',
		summary: 'Delete Calendar',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	extraFieldsSchemaByResource: {
		group: 'extraFieldsEntity',
		tag: 'Extra Fields / Entity',
		method: 'GET',
		path: '/extrafields/VALUE/schema',
		pathKeys: ['value'],
		operationId: 'extra-fields-schema-by-resource',
		summary: 'Extra Fields schema by Resource',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branches: z
							.object({
								items: z
									.object({
										maxLength: z.number().int().optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						defaultValue: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dependenceField: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dynamicField: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dynamicFieldValues: z
							.object({
								items: z
									.object({ type: z.string().optional() })
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						entity: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fieldName: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						idsDynamism: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						length: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						mandatory: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						mobileVisibility: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						multilanguage: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						order: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						restApi: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						searchable: z
							.object({
								format: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						tabId: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						type: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						valueListRelated: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						visibleInList: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
						visibleInPhoneCallForm: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						webVisibility: z
							.object({ type: z.array(z.string()).optional() })
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listExtraFieldsByResource: {
		group: 'extraFieldsEntity',
		tag: 'Extra Fields / Entity',
		method: 'GET',
		path: '/extrafields/VALUE',
		pathKeys: ['value'],
		operationId: 'list-extra-fields-by-resource',
		summary: 'List Extra Fields by Resource',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					entity: z.string().optional(),
					fieldName: z.string().optional(),
					valueListRelated: z.string().optional(),
					description: z.string().optional(),
					deleted: z.boolean().optional(),
					dateDeleted: z.json().optional(),
					searchable: z.boolean().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.json().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.json().optional(),
					visibleInList: z.boolean().optional(),
					order: z.number().int().optional(),
					webVisibility: z.boolean().optional(),
					tabId: z.number().int().optional(),
					mobileVisibility: z.boolean().optional(),
					mandatory: z.boolean().optional(),
					readOnly: z.boolean().optional(),
					descriptionEN: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionDE: z.string().optional(),
					descriptionPT: z.string().optional(),
					descriptionUS: z.string().optional(),
					descriptionRU: z.string().optional(),
					descriptionBR: z.string().optional(),
					descriptionDK: z.string().optional(),
					branches: z.json().optional(),
					defaultValue: z.string().optional(),
					restApi: z.boolean().optional(),
					idsDynamism: z.json().optional(),
					visibleInPhoneCallForm: z.boolean().optional(),
					type: z.string().optional(),
					length: z.number().int().optional(),
					dynamicField: z.json().optional(),
					dynamicFieldValues: z.json().optional(),
					dependenceField: z.json().optional(),
					fuzzySearch: z.json().optional(),
					includeTime: z.boolean().optional(),
					mandatoryRestApi: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createExtraFieldForResource: {
		group: 'extraFieldsEntity',
		tag: 'Extra Fields / Entity',
		method: 'POST',
		path: '/extrafields/VALUE',
		pathKeys: ['value'],
		operationId: 'create-extra-field-for-resource',
		summary: 'Create Extra Field for Resource',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						fieldName: z.string().optional(),
						valueListRelated: z.string().optional(),
						description: z.string().optional(),
						searchable: z.boolean().optional(),
						visibleInList: z.boolean().optional(),
						order: z.number().int().optional(),
						webVisibility: z.boolean().optional(),
						tabId: z.number().int().optional(),
						multilanguage: z.boolean().optional(),
						mobileVisibility: z.boolean().optional(),
						mandatory: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						descriptionEN: z.string().optional(),
						descriptionIT: z.string().optional(),
						descriptionFR: z.string().optional(),
						descriptionDE: z.string().optional(),
						descriptionPT: z.string().optional(),
						descriptionUS: z.string().optional(),
						descriptionRU: z.string().optional(),
						descriptionBR: z.string().optional(),
						descriptionDK: z.string().optional(),
						branches: z.array(z.record(z.string(), z.json())).optional(),
						defaultValue: z.string().optional(),
						restApi: z.boolean().optional(),
						visibleInPhoneCallForm: z.boolean().optional(),
						type: z.string().optional(),
						length: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	listTabs: {
		group: 'extraFieldsTabs',
		tag: 'Extra Fields / Tabs',
		method: 'GET',
		path: '/extrafieldsTabs',
		pathKeys: [],
		operationId: 'list-tabs',
		summary: 'List Tabs',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.json().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					order: z.number().int().optional(),
					entity: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createTabs: {
		group: 'extraFieldsTabs',
		tag: 'Extra Fields / Tabs',
		method: 'POST',
		path: '/extrafieldsTabs',
		pathKeys: [],
		operationId: 'create-tabs',
		summary: 'Create Tabs',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string().optional(),
						order: z.number().int().optional(),
						entity: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getTabs: {
		group: 'extraFieldsTabs',
		tag: 'Extra Fields / Tabs',
		method: 'GET',
		path: '/extrafieldsTabs/{ID}',
		pathKeys: ['id'],
		operationId: 'get-tabs',
		summary: 'Get Tabs',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.string(),
	},
	updateTabs: {
		group: 'extraFieldsTabs',
		tag: 'Extra Fields / Tabs',
		method: 'PUT',
		path: '/extrafieldsTabs/{ID}',
		pathKeys: ['id'],
		operationId: 'update-tabs',
		summary: 'Update Tabs',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteTabs: {
		group: 'extraFieldsTabs',
		tag: 'Extra Fields / Tabs',
		method: 'DELETE',
		path: '/extrafieldsTabs/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-tabs',
		summary: 'Delete Tabs',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	getForm: {
		group: 'formsEntity',
		tag: 'Forms / Entity',
		method: 'GET',
		path: '/forms/{ID}',
		pathKeys: ['id'],
		operationId: 'get-form',
		summary: 'Get Form',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				list: z.string().optional(),
				detail: z.string().optional(),
				jsonData: z.string().optional(),
				formTemplateId: z.number().int().optional(),
				statusId: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.json().optional(),
				dateCreated: z.string().optional(),
				dateUpdated: z.json().optional(),
				dateDeleted: z.string().optional(),
				deleted: z.boolean().optional(),
			})
			.passthrough(),
	},
	getFormState: {
		group: 'formsStates',
		tag: 'Forms / States',
		method: 'GET',
		path: '/forms/{ID}/state',
		pathKeys: ['id'],
		operationId: 'get-form-state',
		summary: 'Get Form State',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				intOrder: z.number().int().optional(),
				idParent: z.json().optional(),
				blnEndState: z.boolean().optional(),
				strIdEnvironment: z.string().optional(),
				descriptionEN: z.json().optional(),
				description: z.string().optional(),
				descriptionIT: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionUS: z.json().optional(),
				descriptionBR: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionDK: z.json().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.json().optional(),
				dateCreated: z.string().optional(),
				dateUpdated: z.json().optional(),
				dateDeleted: z.json().optional(),
				deleted: z.boolean().optional(),
			})
			.passthrough(),
	},
	getFormTemplate: {
		group: 'formsTemplates',
		tag: 'Forms / Templates',
		method: 'GET',
		path: '/forms/{ID}/template',
		pathKeys: ['id'],
		operationId: 'get-form-template',
		summary: 'Get Form Template',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				guid: z.string().optional(),
				type: z.number().int().optional(),
				typeDescription: z.string().optional(),
				url: z.string().optional(),
				active: z.boolean().optional(),
				idRole: z.json().optional(),
				extraFields: z.json().optional(),
				deleted: z.boolean().optional(),
				userDeleted: z.json().optional(),
				userCreated: z.number().int().optional(),
				userUpdated: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateUpdated: z.string().optional(),
				dateDeleted: z.json().optional(),
				descriptionEN: z.json().optional(),
				description: z.string().optional(),
				descriptionIT: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionUS: z.json().optional(),
				descriptionBR: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionDK: z.json().optional(),
			})
			.passthrough(),
	},
	listNews: {
		group: 'news',
		tag: 'News',
		method: 'GET',
		path: '/news',
		pathKeys: [],
		operationId: 'list-news',
		summary: 'List News',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionText: z.string().optional(),
					endDate: z.string().optional(),
					id: z.number().int().optional(),
					salesRepIDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.json().optional(),
					startDate: z.string().optional(),
					status: z.number().int().optional(),
					subject: z.string().optional(),
					totalUsers: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	opportunitiesSchema: {
		group: 'opportunitiesEntity',
		tag: 'Opportunities / Entity',
		method: 'GET',
		path: '/opportunities/schema',
		pathKeys: [],
		operationId: 'opportunities-schema',
		summary: 'Opportunities schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountId1: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountId2: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountId3: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						address1: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						address2: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						city: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						closedDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						comments: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						countryId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						currencyId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateGeocoded: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						geocoded: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						geocodingAccuracy: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						latitude: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						longitude: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lostDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						permissionLevel: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						postcode: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reference: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						region: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesForecastDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesProbability: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						statusId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						total: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						type_id: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						wonDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listOpportunities: {
		group: 'opportunitiesEntity',
		tag: 'Opportunities / Entity',
		method: 'GET',
		path: '/opportunities',
		pathKeys: [],
		operationId: 'list-opportunities',
		summary: 'List Opportunities',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountId1: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					accountId2: z.json().optional(),
					accountId3: z.json().optional(),
					address1: z.json().optional(),
					address2: z.json().optional(),
					branchId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					city: z.json().optional(),
					closedDate: z.string().optional(),
					comments: z.json().optional(),
					countryId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					currencyId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateGeocoded: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					extId: z.string().optional(),
					geocoded: z.boolean().optional(),
					geocodingAccuracy: z.json().optional(),
					id: z.number().int().optional(),
					latitude: z.json().optional(),
					longitude: z.json().optional(),
					lostDate: z.json().optional(),
					permissionLevel: z.number().int().optional(),
					postcode: z.json().optional(),
					readOnly: z.boolean().optional(),
					reference: z.string().optional(),
					region: z.json().optional(),
					salesForecastDate: z.string().optional(),
					salesProbability: z.number().int().optional(),
					salesRepId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					statusId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					total: z.number().int().optional(),
					type_id: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					wonDate: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createOpportunity: {
		group: 'opportunitiesEntity',
		tag: 'Opportunities / Entity',
		method: 'POST',
		path: '/opportunities',
		pathKeys: [],
		operationId: 'create-opportunity',
		summary: 'Create Opportunity',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountId1: z.number().int().optional(),
						address1: z.string().optional(),
						branchId: z.number().int(),
						city: z.string().optional(),
						comments: z.string().optional(),
						currencyId: z.number().int().optional(),
						geocoded: z.boolean().optional(),
						geocodingAccuracy: z.number().int().optional(),
						latitude: z.number().optional(),
						longitude: z.number().optional(),
						lostDate: z.string().optional(),
						permissionLevel: z.number().int().optional(),
						postcode: z.string().optional(),
						readOnly: z.boolean().optional(),
						reference: z.string(),
						salesProbability: z.number().int(),
						salesRepId: z.number().int(),
						statusId: z.number().int(),
						total: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getOpportunity: {
		group: 'opportunitiesEntity',
		tag: 'Opportunities / Entity',
		method: 'GET',
		path: '/opportunities/{ID}',
		pathKeys: ['id'],
		operationId: 'get-opportunity',
		summary: 'Get Opportunity',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountId1: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				accountId2: z.json().optional(),
				accountId3: z.json().optional(),
				address1: z.string().optional(),
				address2: z.json().optional(),
				branchId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				city: z.string().optional(),
				closedDate: z.json().optional(),
				comments: z.string().optional(),
				countryId: z.json().optional(),
				currencyId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateGeocoded: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				extId: z.json().optional(),
				geocoded: z.boolean().optional(),
				geocodingAccuracy: z.number().int().optional(),
				id: z.number().int().optional(),
				latitude: z.number().optional(),
				longitude: z.number().optional(),
				lostDate: z.json().optional(),
				permissionLevel: z.number().int().optional(),
				postcode: z.string().optional(),
				readOnly: z.boolean().optional(),
				reference: z.string().optional(),
				region: z.json().optional(),
				salesForecastDate: z.json().optional(),
				salesProbability: z.number().int().optional(),
				salesRepId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				statusId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				total: z.number().int().optional(),
				type_id: z.json().optional(),
				wonDate: z.json().optional(),
			})
			.passthrough(),
	},
	updateOpportunity: {
		group: 'opportunitiesEntity',
		tag: 'Opportunities / Entity',
		method: 'PUT',
		path: '/opportunities/{ID}',
		pathKeys: ['id'],
		operationId: 'update-opportunity',
		summary: 'Update Opportunity',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						salesProbability: z.number().int(),
						total: z.number().optional(),
						comments: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOpportunity: {
		group: 'opportunitiesEntity',
		tag: 'Opportunities / Entity',
		method: 'DELETE',
		path: '/opportunities/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-opportunity',
		summary: 'Delete Opportunity',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	opportunityTypesSchema: {
		group: 'opportunitiesTypes',
		tag: 'Opportunities / Types',
		method: 'GET',
		path: '/opportunityTypes/schema',
		pathKeys: [],
		operationId: 'opportunity-types-schema',
		summary: 'Opportunity Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						defaultStatus: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	getOpportunityTypes: {
		group: 'opportunitiesTypes',
		tag: 'Opportunities / Types',
		method: 'GET',
		path: '/opportunityTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'get-opportunity-types',
		summary: 'Get Opportunity Types',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				defaultStatus: z.number().int().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				order: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateOpportunityType: {
		group: 'opportunitiesTypes',
		tag: 'Opportunities / Types',
		method: 'PUT',
		path: '/opportunityTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'update-opportunity-type',
		summary: 'Update Opportunity Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionES: z.string().optional() }).strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOpportunityType: {
		group: 'opportunitiesTypes',
		tag: 'Opportunities / Types',
		method: 'DELETE',
		path: '/opportunityTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-opportunity-type',
		summary: 'Delete Opportunity Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	opportunityStatusesSchema: {
		group: 'opportunitiesStatuses',
		tag: 'Opportunities / Statuses',
		method: 'GET',
		path: '/opportunityStatuses/schema',
		pathKeys: [],
		operationId: 'opportunity-statuses-schema',
		summary: 'Opportunity Statuses schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						endStatus: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesProbability: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						won: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listOpportunityStatuses: {
		group: 'opportunitiesStatuses',
		tag: 'Opportunities / Statuses',
		method: 'GET',
		path: '/opportunityStatuses',
		pathKeys: [],
		operationId: 'list-opportunity-statuses',
		summary: 'List Opportunity Statuses',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					endStatus: z.boolean().optional(),
					id: z.number().int().optional(),
					idParent: z.json().optional(),
					order: z.number().int().optional(),
					salesProbability: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					won: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createOpportunityStatus: {
		group: 'opportunitiesStatuses',
		tag: 'Opportunities / Statuses',
		method: 'POST',
		path: '/opportunityStatuses',
		pathKeys: [],
		operationId: 'create-opportunity-status',
		summary: 'Create Opportunity Status',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionBR: z.string().optional(),
						descriptionDE: z.string().optional(),
						descriptionDK: z.string().optional(),
						descriptionEN: z.string().optional(),
						descriptionES: z.string().optional(),
						descriptionFR: z.string().optional(),
						descriptionIT: z.string().optional(),
						descriptionPT: z.string().optional(),
						descriptionRU: z.string().optional(),
						descriptionUS: z.string().optional(),
						endStatus: z.boolean().optional(),
						order: z.number().int().optional(),
						won: z.number().int().optional(),
						idParent: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getOpportunityStatus: {
		group: 'opportunitiesStatuses',
		tag: 'Opportunities / Statuses',
		method: 'GET',
		path: '/opportunityStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'get-opportunity-status',
		summary: 'Get Opportunity Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.json().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.string().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.string().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.string().optional(),
				endStatus: z.boolean().optional(),
				id: z.number().int().optional(),
				idParent: z.number().int().optional(),
				order: z.number().int().optional(),
				salesProbability: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				won: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateOpportunityStatus: {
		group: 'opportunitiesStatuses',
		tag: 'Opportunities / Statuses',
		method: 'PUT',
		path: '/opportunityStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'update-opportunity-status',
		summary: 'Update Opportunity Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						branchVisibility: z
							.array(z.record(z.string(), z.json()))
							.optional(),
						descriptionEN: z.string().optional(),
						descriptionES: z.string().optional(),
						descriptionFR: z.string().optional(),
						descriptionIT: z.string().optional(),
						endStatus: z.boolean().optional(),
						won: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOpportunityStatus: {
		group: 'opportunitiesStatuses',
		tag: 'Opportunities / Statuses',
		method: 'DELETE',
		path: '/opportunityStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-opportunity-status',
		summary: 'Delete Opportunity Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	orderHeadersSchema: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'GET',
		path: '/salesorders/schema',
		pathKeys: [],
		operationId: 'order-headers-schema',
		summary: 'Order Headers schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountAddressId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						archived: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						blocked: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						closedDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						comment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						contactId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						currencyId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount1: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount2: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount3: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount4: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						internalComment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						internalCommentUpdateDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						internalCommentUpdateSalesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						mainSalesorder: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						number: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						opportunityId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						rateId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reference: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesForcecastDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						statusId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						total: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						year: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listOrderHeaders: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'GET',
		path: '/salesorders',
		pathKeys: [],
		operationId: 'list-order-headers',
		summary: 'List Order Headers',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountAddressId: z.json().optional(),
					accountId: z.json().optional(),
					archived: z.json().optional(),
					blocked: z.boolean().optional(),
					branchId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					closedDate: z.json().optional(),
					comment: z.string().optional(),
					contactId: z.json().optional(),
					currencyId: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					discount1: z.number().int().optional(),
					discount2: z.number().int().optional(),
					discount3: z.number().int().optional(),
					discount4: z.number().int().optional(),
					extId: z.json().optional(),
					id: z.number().int().optional(),
					internalComment: z.string().optional(),
					internalCommentUpdateDate: z.json().optional(),
					internalCommentUpdateSalesRepId: z.json().optional(),
					mainSalesorder: z.json().optional(),
					number: z.number().int().optional(),
					opportunityId: z.number().int().optional(),
					rateId: z.number().int().optional(),
					readOnly: z.boolean().optional(),
					reference: z.string().optional(),
					salesForcecastDate: z.json().optional(),
					salesRepId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					statusId: z.json().optional(),
					salesOrderType: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					total: z.number().int().optional(),
					year: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createOrderHeader: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'POST',
		path: '/salesorders',
		pathKeys: [],
		operationId: 'create-order-header',
		summary: 'Create Order Header',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountAddressId: z.string().optional(),
						accountId: z.number().int().optional(),
						archived: z.boolean().optional(),
						branchId: z.number().int(),
						closedDate: z.string().optional(),
						comment: z.string().optional(),
						contactId: z.string().optional(),
						currencyId: z.string().optional(),
						discount1: z.number().int().optional(),
						discount2: z.number().int().optional(),
						discount3: z.number().int().optional(),
						discount4: z.number().int().optional(),
						extId: z.string().optional(),
						internalComment: z.string().optional(),
						internalCommentUpdateDate: z.string().optional(),
						internalCommentUpdateSalesRepId: z.string().optional(),
						mainSalesorder: z.string().optional(),
						number: z.number().int().optional(),
						opportunityId: z.string().optional(),
						rateId: z.number().int().optional(),
						readOnly: z.boolean().optional(),
						reference: z.string(),
						salesRepId: z.number().int(),
						statusId: z.number().int().optional(),
						total: z.number().int().optional(),
						year: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getOrderHeader: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'GET',
		path: '/salesorders/{ID}',
		pathKeys: ['id'],
		operationId: 'get-order-header',
		summary: 'Get Order Header',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountAddressId: z.json().optional(),
				accountId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				archived: z.boolean().optional(),
				branchId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				closedDate: z.json().optional(),
				comment: z.string().optional(),
				contactId: z.json().optional(),
				currencyId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				discount1: z.number().int().optional(),
				discount2: z.number().int().optional(),
				discount3: z.number().int().optional(),
				discount4: z.number().int().optional(),
				extId: z.json().optional(),
				id: z.number().int().optional(),
				internalComment: z.string().optional(),
				internalCommentUpdateDate: z.json().optional(),
				internalCommentUpdateSalesRepId: z.json().optional(),
				mainSalesorder: z.json().optional(),
				number: z.number().int().optional(),
				opportunityId: z.json().optional(),
				rateId: z.json().optional(),
				readOnly: z.boolean().optional(),
				reference: z.string().optional(),
				salesForcecastDate: z.string().optional(),
				salesRepId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				statusId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				total: z.number().int().optional(),
				year: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateOrderHeader: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'PUT',
		path: '/salesorders/{ID}',
		pathKeys: ['id'],
		operationId: 'update-order-header',
		summary: 'Update Order Header',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						comment: z.string().optional(),
						discount1: z.number().int().optional(),
						discount2: z.number().int().optional(),
						total: z.number().int().optional(),
						year: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOrderHeader: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'DELETE',
		path: '/salesorders/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-order-header',
		summary: 'Delete Order Header',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	orderLinesSchema: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'GET',
		path: '/salesordersLines/schema',
		pathKeys: [],
		operationId: 'order-lines-schema',
		summary: 'Order Lines schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount1: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount2: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount3: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount4: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						price: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						productId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						quantity: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesorderId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						total: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listOrderLines: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'GET',
		path: '/salesordersLines',
		pathKeys: [],
		operationId: 'list-order-lines',
		summary: 'List Order Lines',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					description: z.string().optional(),
					discount1: z.number().int().optional(),
					discount2: z.number().int().optional(),
					discount3: z.number().int().optional(),
					discount4: z.number().int().optional(),
					id: z.number().int().optional(),
					price: z.number().int().optional(),
					productId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					quantity: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesorderId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					total: z.number().optional(),
				})
				.passthrough(),
		),
	},
	createOrderLine: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'POST',
		path: '/salesOrdersLines',
		pathKeys: [],
		operationId: 'create-order-line',
		summary: 'Create Order Line',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						description: z.string().optional(),
						discount1: z.number().int().optional(),
						price: z.number().int(),
						productId: z.number().int(),
						quantity: z.number().int(),
						salesorderId: z.number().int().optional(),
						total: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getOrderLine: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'GET',
		path: '/salesordersLines/{ID}',
		pathKeys: ['id'],
		operationId: 'get-order-line',
		summary: 'Get Order Line',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				dateCreated: z.string().optional(),
				dateDeleted: z.string().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				description: z.string().optional(),
				discount1: z.number().int().optional(),
				discount2: z.number().int().optional(),
				discount3: z.number().int().optional(),
				discount4: z.number().int().optional(),
				id: z.number().int().optional(),
				price: z.number().int().optional(),
				productId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				quantity: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				salesorderId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				total: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateOrderLine: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'PUT',
		path: '/salesordersLines/{ID}',
		pathKeys: ['id'],
		operationId: 'update-order-line',
		summary: 'Update Order Line',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						discount1: z.number().int().optional(),
						price: z.number().int().optional(),
						quantity: z.number().int().optional(),
						total: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOrderLine: {
		group: 'ordersEntity',
		tag: 'Orders / Entity',
		method: 'DELETE',
		path: '/salesordersLines/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-order-line',
		summary: 'Delete Order Line',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	orderStatusesSchema: {
		group: 'ordersStatuses',
		tag: 'Orders / Statuses',
		method: 'GET',
		path: '/salesorderStatuses/schema',
		pathKeys: [],
		operationId: 'order-statuses-schema',
		summary: 'Order Statuses schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lost: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						won: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listOrderStatuses: {
		group: 'ordersStatuses',
		tag: 'Orders / Statuses',
		method: 'GET',
		path: '/salesorderStatuses',
		pathKeys: [],
		operationId: 'list-order-statuses',
		summary: 'List Order Statuses',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.array(z.json()).optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.json().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					lost: z.json().optional(),
					order: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					won: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createOrderStatus: {
		group: 'ordersStatuses',
		tag: 'Orders / Statuses',
		method: 'POST',
		path: '/salesorderStatuses',
		pathKeys: [],
		operationId: 'create-order-status',
		summary: 'Create Order Status',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						order: z.number().int().optional(),
						won: z.boolean().optional(),
						lost: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getOrderStatus: {
		group: 'ordersStatuses',
		tag: 'Orders / Statuses',
		method: 'GET',
		path: '/salesorderStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'get-order-status',
		summary: 'Get Order Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.array(z.json()).optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				lost: z.json().optional(),
				order: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				won: z.boolean().optional(),
			})
			.passthrough(),
	},
	updateOrderStatus: {
		group: 'ordersStatuses',
		tag: 'Orders / Statuses',
		method: 'PUT',
		path: '/salesorderStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'update-order-status',
		summary: 'Update Order Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						lost: z.boolean().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOrderStatus: {
		group: 'ordersStatuses',
		tag: 'Orders / Statuses',
		method: 'DELETE',
		path: '/salesorderStatuses/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-order-status',
		summary: 'Delete Order Status',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	orderTypesSchema: {
		group: 'ordersTypes',
		tag: 'Orders / Types',
		method: 'GET',
		path: '/orderTypes/schema',
		pathKeys: [],
		operationId: 'order-types-schema',
		summary: 'Order Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lost: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						won: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listOrderTypes: {
		group: 'ordersTypes',
		tag: 'Orders / Types',
		method: 'GET',
		path: '/orderTypes',
		pathKeys: [],
		operationId: 'list-order-types',
		summary: 'List Order Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.array(z.json()).optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.json().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					lost: z.json().optional(),
					order: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					won: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createOrderTypes: {
		group: 'ordersTypes',
		tag: 'Orders / Types',
		method: 'POST',
		path: '/orderTypes',
		pathKeys: [],
		operationId: 'create-order-types',
		summary: 'Create Order Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string(),
						order: z.number().int().optional(),
						won: z.boolean().optional(),
						lost: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getOrderTypes: {
		group: 'ordersTypes',
		tag: 'Orders / Types',
		method: 'GET',
		path: '/orderTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'get-order-types',
		summary: 'Get Order Types',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.array(z.json()).optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				lost: z.json().optional(),
				order: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				won: z.boolean().optional(),
			})
			.passthrough(),
	},
	updateOrderTypes: {
		group: 'ordersTypes',
		tag: 'Orders / Types',
		method: 'PUT',
		path: '/orderTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'update-order-types',
		summary: 'Update Order Types',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						lost: z.boolean().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteOrderTypes: {
		group: 'ordersTypes',
		tag: 'Orders / Types',
		method: 'DELETE',
		path: '/orderTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-order-types',
		summary: 'Delete Order Types',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	productsSchema: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'GET',
		path: '/products/schema',
		pathKeys: [],
		operationId: 'products-schema',
		summary: 'Products schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						categoryId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						cost: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						familyId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						maxDiscount: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						model: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						notAvailable: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						permissionLevel: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						price: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						readOnly: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						stock: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProducts: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'GET',
		path: '/products',
		pathKeys: [],
		operationId: 'list-products',
		summary: 'List Products',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					Z_SKU: z.string().optional(),
					categoryId: z.json().optional(),
					cost: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					description: z.string().optional(),
					extId: z.json().optional(),
					familyId: z.json().optional(),
					id: z.number().int().optional(),
					maxDiscount: z.json().optional(),
					model: z.string().optional(),
					notAvailable: z.boolean().optional(),
					permissionLevel: z.number().int().optional(),
					price: z.number().int().optional(),
					readOnly: z.boolean().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					stock: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createProduct: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'POST',
		path: '/products',
		pathKeys: [],
		operationId: 'create-product',
		summary: 'Create Product',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						categoryId: z.number().int().optional(),
						cost: z.number().int().optional(),
						description: z.string().optional(),
						familyId: z.number().int().optional(),
						maxDiscount: z.number().int().optional(),
						permissionLevel: z.number().int().optional(),
						price: z.number().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProduct: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'GET',
		path: '/products/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product',
		summary: 'Get Product',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				Z_SKU: z.string().optional(),
				categoryId: z.json().optional(),
				cost: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				description: z.string().optional(),
				extId: z.json().optional(),
				familyId: z.json().optional(),
				id: z.number().int().optional(),
				maxDiscount: z.number().int().optional(),
				model: z.string().optional(),
				notAvailable: z.boolean().optional(),
				permissionLevel: z.number().int().optional(),
				price: z.number().int().optional(),
				readOnly: z.boolean().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				stock: z.json().optional(),
			})
			.passthrough(),
	},
	updateProduct: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'PUT',
		path: '/products/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product',
		summary: 'Update Product',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						cost: z.number().int().optional(),
						description: z.string().optional(),
						maxDiscount: z.number().int().optional(),
						price: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProduct: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'DELETE',
		path: '/products/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-product',
		summary: 'Delete Product',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	bulkCreateProducts: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'POST',
		path: '/products/bulk',
		pathKeys: [],
		operationId: 'bulk-create-products',
		summary: 'Bulk Create Products',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.array(z.record(z.string(), z.json())).max(100),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					message: z.string().optional(),
					guid: z.string().optional(),
					code: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	bulkUpdateProducts: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'PUT',
		path: '/products/bulk',
		pathKeys: [],
		operationId: 'bulk-update-products',
		summary: 'Bulk Update Products',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.array(z.record(z.string(), z.json())).max(100),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					message: z.string().optional(),
					guid: z.string().optional(),
					code: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	bulkDeleteProducts: {
		group: 'productsEntity',
		tag: 'Products / Entity',
		method: 'DELETE',
		path: '/products/bulk',
		pathKeys: [],
		operationId: 'bulk-delete-products',
		summary: 'Bulk Delete Products',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					message: z.string().optional(),
					guid: z.string().optional(),
					code: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	addPicture: {
		group: 'productsCarousel',
		tag: 'Products / Carousel',
		method: 'POST',
		path: '/products/VALUE/documents',
		pathKeys: ['value'],
		operationId: 'add-picture',
		summary: 'Add Picture',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						name: z.string().optional(),
						isCarrousel: z.boolean().optional(),
						folderId: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({ locator: z.string().optional(), id: z.string().optional() })
			.passthrough(),
	},
	productFamiliesSchema: {
		group: 'productsFamilies',
		tag: 'Products / Families',
		method: 'GET',
		path: '/productFamilies/schema',
		pathKeys: [],
		operationId: 'product-families-schema',
		summary: 'Product Families schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchRestriction: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						notAvailable: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProductFamilies: {
		group: 'productsFamilies',
		tag: 'Products / Families',
		method: 'GET',
		path: '/productFamilies',
		pathKeys: [],
		operationId: 'list-product-families',
		summary: 'List Product Families',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchRestriction: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.string().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.string().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.string().optional(),
					descriptionRU: z.string().optional(),
					descriptionUS: z.string().optional(),
					id: z.number().int().optional(),
					idParent: z.number().int().optional(),
					notAvailable: z.boolean().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createProductFamily: {
		group: 'productsFamilies',
		tag: 'Products / Families',
		method: 'POST',
		path: '/productFamilies',
		pathKeys: [],
		operationId: 'create-product-family',
		summary: 'Create Product Family',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						branchRestriction: z.boolean().optional(),
						notAvailable: z.boolean().optional(),
						idParent: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProductFamily: {
		group: 'productsFamilies',
		tag: 'Products / Families',
		method: 'GET',
		path: '/productFamilies/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product-family',
		summary: 'Get Product Family',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchRestriction: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.string().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.string().optional(),
				descriptionDE: z.string().optional(),
				descriptionDK: z.string().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.string().optional(),
				descriptionRU: z.string().optional(),
				descriptionUS: z.string().optional(),
				id: z.number().int().optional(),
				idParent: z.number().int().optional(),
				notAvailable: z.boolean().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateProductFamily: {
		group: 'productsFamilies',
		tag: 'Products / Families',
		method: 'PUT',
		path: '/productFamilies/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product-family',
		summary: 'Update Product Family',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						branchRestriction: z.boolean().optional(),
						descriptionEN: z.string().optional(),
						idParent: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProductFamily: {
		group: 'productsFamilies',
		tag: 'Products / Families',
		method: 'DELETE',
		path: '/productFamilies/232',
		pathKeys: [],
		operationId: 'delete-product-family',
		summary: 'Delete Product Family',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	productUnitsOfMeasureSchema: {
		group: 'productUnitsOfMeasure',
		tag: 'Product Units Of Measure',
		method: 'GET',
		path: '/productUnitsOfMeasure/schema',
		pathKeys: [],
		operationId: 'product-units-of-measure-schema',
		summary: 'Product Units Of Measure schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						factor: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						idProducto: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						idUnitOfMeasure: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						integrationField: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						isActive: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						isBase: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						minStep: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						name: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						specialPrice: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						strIdEnvironment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						useSpecialPrice: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProductUnitsOfMeasure: {
		group: 'productUnitsOfMeasure',
		tag: 'Product Units Of Measure',
		method: 'GET',
		path: '/productUnitsOfMeasure',
		pathKeys: [],
		operationId: 'list-product-units-of-measure',
		summary: 'List Product Units Of Measure',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					extId: z.json().optional(),
					factor: z.number().int().optional(),
					id: z.number().int().optional(),
					idParent: z.json().optional(),
					idProducto: z.number().int().optional(),
					idUnitOfMeasure: z.number().int().optional(),
					integrationField: z.json().optional(),
					isActive: z.boolean().optional(),
					isBase: z.boolean().optional(),
					minStep: z.number().int().optional(),
					name: z.string().optional(),
					order: z.number().int().optional(),
					specialPrice: z.json().optional(),
					strIdEnvironment: z.json().optional(),
					useSpecialPrice: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createProductUnitOfMeasure: {
		group: 'productUnitsOfMeasure',
		tag: 'Product Units Of Measure',
		method: 'POST',
		path: '/productUnitsOfMeasure',
		pathKeys: [],
		operationId: 'create-product-unit-of-measure',
		summary: 'Create Product Unit Of Measure',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						idProducto: z.number().int(),
						idUnitOfMeasure: z.number().int(),
						factor: z.number(),
						extId: z.string().optional(),
						idParent: z.number().int().optional(),
						integrationField: z.string().optional(),
						isActive: z.boolean().optional(),
						isBase: z.boolean().optional(),
						minStep: z.number().optional(),
						name: z.string().optional(),
						order: z.number().int().optional(),
						specialPrice: z.number().optional(),
						strIdEnvironment: z.string().optional(),
						useSpecialPrice: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProductUnitOfMeasure: {
		group: 'productUnitsOfMeasure',
		tag: 'Product Units Of Measure',
		method: 'GET',
		path: '/productUnitsOfMeasure/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product-unit-of-measure',
		summary: 'Get Product Unit Of Measure',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				extId: z.string().optional(),
				factor: z.number().int().optional(),
				id: z.number().int().optional(),
				idParent: z.number().int().optional(),
				idProducto: z.number().int().optional(),
				idUnitOfMeasure: z.number().int().optional(),
				integrationField: z.json().optional(),
				isActive: z.boolean().optional(),
				isBase: z.boolean().optional(),
				minStep: z.number().int().optional(),
				name: z.string().optional(),
				order: z.number().int().optional(),
				specialPrice: z.number().optional(),
				strIdEnvironment: z.json().optional(),
				useSpecialPrice: z.boolean().optional(),
			})
			.passthrough(),
	},
	updateProductUnitOfMeasure: {
		group: 'productUnitsOfMeasure',
		tag: 'Product Units Of Measure',
		method: 'PUT',
		path: '/productUnitsOfMeasure/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product-unit-of-measure',
		summary: 'Update Product Unit Of Measure',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						name: z.string().optional(),
						isActive: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProductUnitOfMeasure: {
		group: 'productUnitsOfMeasure',
		tag: 'Product Units Of Measure',
		method: 'DELETE',
		path: '/productUnitsOfMeasure/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-product-unit-of-measure',
		summary: 'Delete Product Unit Of Measure',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	unitsOfMeasureSchema: {
		group: 'unitsOfMeasure',
		tag: 'Units Of Measure',
		method: 'GET',
		path: '/unitsOfMeasure/schema',
		pathKeys: [],
		operationId: 'units-of-measure-schema',
		summary: 'Units Of Measure schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						description_BR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_DE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_DK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_EN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_FR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_IT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_PT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_RU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_US: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						description_frca: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						integrationField: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						order: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						status: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						strIdEnvironment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						symbol: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listUnitsOfMeasure: {
		group: 'unitsOfMeasure',
		tag: 'Units Of Measure',
		method: 'GET',
		path: '/unitsOfMeasure',
		pathKeys: [],
		operationId: 'list-units-of-measure',
		summary: 'List Units Of Measure',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					descriptionES: z.string().optional(),
					description_BR: z.json().optional(),
					description_DE: z.json().optional(),
					description_DK: z.json().optional(),
					description_EN: z.string().optional(),
					description_FR: z.json().optional(),
					description_IT: z.json().optional(),
					description_PT: z.json().optional(),
					description_RU: z.json().optional(),
					description_US: z.json().optional(),
					description_frca: z.json().optional(),
					extId: z.json().optional(),
					id: z.number().int().optional(),
					idParent: z.json().optional(),
					integrationField: z.json().optional(),
					order: z.number().int().optional(),
					status: z.number().int().optional(),
					strIdEnvironment: z.json().optional(),
					symbol: z.string().optional(),
				})
				.passthrough(),
		),
	},
	createUnitOfMeasure: {
		group: 'unitsOfMeasure',
		tag: 'Units Of Measure',
		method: 'POST',
		path: '/unitsOfMeasure',
		pathKeys: [],
		operationId: 'create-unit-of-measure',
		summary: 'Create Unit Of Measure',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string(),
						description_BR: z.string().optional(),
						description_DE: z.string().optional(),
						description_DK: z.string().optional(),
						description_EN: z.string().optional(),
						description_FR: z.string().optional(),
						description_IT: z.string().optional(),
						description_PT: z.string().optional(),
						description_RU: z.string().optional(),
						description_US: z.string().optional(),
						description_frca: z.string().optional(),
						extId: z.string().optional(),
						idParent: z.number().int().optional(),
						integrationField: z.string().optional(),
						order: z.number().int().optional(),
						status: z.number().int().optional(),
						strIdEnvironment: z.string().optional(),
						symbol: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getUnitOfMeasure: {
		group: 'unitsOfMeasure',
		tag: 'Units Of Measure',
		method: 'GET',
		path: '/unitsOfMeasure/{ID}',
		pathKeys: ['id'],
		operationId: 'get-unit-of-measure',
		summary: 'Get Unit Of Measure',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				descriptionES: z.string().optional(),
				description_BR: z.json().optional(),
				description_DE: z.json().optional(),
				description_DK: z.json().optional(),
				description_EN: z.string().optional(),
				description_FR: z.json().optional(),
				description_IT: z.json().optional(),
				description_PT: z.json().optional(),
				description_RU: z.json().optional(),
				description_US: z.json().optional(),
				description_frca: z.json().optional(),
				extId: z.string().optional(),
				id: z.number().int().optional(),
				idParent: z.number().int().optional(),
				integrationField: z.json().optional(),
				order: z.number().int().optional(),
				status: z.number().int().optional(),
				strIdEnvironment: z.json().optional(),
				symbol: z.string().optional(),
			})
			.passthrough(),
	},
	updateUnitOfMeasure: {
		group: 'unitsOfMeasure',
		tag: 'Units Of Measure',
		method: 'PUT',
		path: '/unitsOfMeasure/{ID}',
		pathKeys: ['id'],
		operationId: 'update-unit-of-measure',
		summary: 'Update Unit Of Measure',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string().optional(),
						symbol: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteUnitOfMeasure: {
		group: 'unitsOfMeasure',
		tag: 'Units Of Measure',
		method: 'DELETE',
		path: '/unitsOfMeasure/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-unit-of-measure',
		summary: 'Delete Unit Of Measure',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	taxRatesSchema: {
		group: 'taxRates',
		tag: 'Tax Rates',
		method: 'GET',
		path: '/taxRates/schema',
		pathKeys: [],
		operationId: 'tax-rates-schema',
		summary: 'Tax Rates schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						Descripcion: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_BR: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_DE: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_DK: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_EN: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_FR: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_IT: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_PT: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_RU: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_US: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_frca: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extID: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						integrationField: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						intOrder: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						isActive: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						percentage: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						strIdEnvironment: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listTaxRates: {
		group: 'taxRates',
		tag: 'Tax Rates',
		method: 'GET',
		path: '/taxRates',
		pathKeys: [],
		operationId: 'list-tax-rates',
		summary: 'List Tax Rates',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					Descripcion: z.string().optional(),
					Descripcion_BR: z.json().optional(),
					Descripcion_DE: z.json().optional(),
					Descripcion_DK: z.json().optional(),
					Descripcion_EN: z.string().optional(),
					Descripcion_FR: z.json().optional(),
					Descripcion_IT: z.json().optional(),
					Descripcion_PT: z.json().optional(),
					Descripcion_RU: z.json().optional(),
					Descripcion_US: z.json().optional(),
					Descripcion_frca: z.json().optional(),
					extID: z.json().optional(),
					id: z.number().int().optional(),
					idParent: z.json().optional(),
					integrationField: z.json().optional(),
					intOrder: z.number().int().optional(),
					isActive: z.boolean().optional(),
					percentage: z.number().int().optional(),
					strIdEnvironment: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createTaxRate: {
		group: 'taxRates',
		tag: 'Tax Rates',
		method: 'POST',
		path: '/taxRates',
		pathKeys: [],
		operationId: 'create-tax-rate',
		summary: 'Create Tax Rate',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						Descripcion: z.string(),
						Descripcion_BR: z.string().optional(),
						Descripcion_DE: z.string().optional(),
						Descripcion_DK: z.string().optional(),
						Descripcion_EN: z.string().optional(),
						Descripcion_FR: z.string().optional(),
						Descripcion_IT: z.string().optional(),
						Descripcion_PT: z.string().optional(),
						Descripcion_RU: z.string().optional(),
						Descripcion_US: z.string().optional(),
						Descripcion_frca: z.string().optional(),
						extID: z.string().optional(),
						idParent: z.number().int().optional(),
						integrationField: z.number().int().optional(),
						intOrder: z.number().int().optional(),
						isActive: z.boolean().optional(),
						percentage: z.number(),
						strIdEnvironment: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getTaxRate: {
		group: 'taxRates',
		tag: 'Tax Rates',
		method: 'GET',
		path: '/taxRates/{ID}',
		pathKeys: ['id'],
		operationId: 'get-tax-rate',
		summary: 'Get Tax Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				Descripcion: z.string().optional(),
				Descripcion_BR: z.json().optional(),
				Descripcion_DE: z.json().optional(),
				Descripcion_DK: z.json().optional(),
				Descripcion_EN: z.string().optional(),
				Descripcion_FR: z.json().optional(),
				Descripcion_IT: z.json().optional(),
				Descripcion_PT: z.json().optional(),
				Descripcion_RU: z.json().optional(),
				Descripcion_US: z.json().optional(),
				Descripcion_frca: z.json().optional(),
				extID: z.string().optional(),
				id: z.number().int().optional(),
				idParent: z.number().int().optional(),
				integrationField: z.json().optional(),
				intOrder: z.number().int().optional(),
				isActive: z.boolean().optional(),
				percentage: z.number().int().optional(),
				strIdEnvironment: z.json().optional(),
			})
			.passthrough(),
	},
	updateTaxRate: {
		group: 'taxRates',
		tag: 'Tax Rates',
		method: 'PUT',
		path: '/taxRates/{ID}',
		pathKeys: ['id'],
		operationId: 'update-tax-rate',
		summary: 'Update Tax Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						Descripcion: z.string().optional(),
						Descripcion_BR: z.string().optional(),
						Descripcion_DE: z.string().optional(),
						Descripcion_DK: z.string().optional(),
						Descripcion_EN: z.string().optional(),
						Descripcion_FR: z.string().optional(),
						Descripcion_IT: z.string().optional(),
						Descripcion_PT: z.string().optional(),
						Descripcion_RU: z.string().optional(),
						Descripcion_US: z.string().optional(),
						Descripcion_frca: z.string().optional(),
						extID: z.string().optional(),
						idParent: z.number().int().optional(),
						integrationField: z.number().int().optional(),
						intOrder: z.number().int().optional(),
						isActive: z.boolean().optional(),
						percentage: z.number().optional(),
						strIdEnvironment: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteTaxRate: {
		group: 'taxRates',
		tag: 'Tax Rates',
		method: 'DELETE',
		path: '/taxRates/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-tax-rate',
		summary: 'Delete Tax Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	taxProfilesSchema: {
		group: 'taxProfiles',
		tag: 'Tax Profiles',
		method: 'GET',
		path: '/taxProfiles/schema',
		pathKeys: [],
		operationId: 'tax-profiles-schema',
		summary: 'Tax Profiles schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						Descripcion: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_BR: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_DE: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_DK: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_EN: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_FR: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_IT: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_PT: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_RU: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_US: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						Descripcion_frca: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extID: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						integrationField: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						intOrder: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						isExempt: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						strIdEnvironment: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listTaxProfiles: {
		group: 'taxProfiles',
		tag: 'Tax Profiles',
		method: 'GET',
		path: '/taxProfiles',
		pathKeys: [],
		operationId: 'list-tax-profiles',
		summary: 'List Tax Profiles',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					Descripcion: z.string().optional(),
					Descripcion_BR: z.json().optional(),
					Descripcion_DE: z.json().optional(),
					Descripcion_DK: z.json().optional(),
					Descripcion_EN: z.string().optional(),
					Descripcion_FR: z.json().optional(),
					Descripcion_IT: z.json().optional(),
					Descripcion_PT: z.json().optional(),
					Descripcion_RU: z.json().optional(),
					Descripcion_US: z.json().optional(),
					Descripcion_frca: z.json().optional(),
					extID: z.json().optional(),
					id: z.number().int().optional(),
					idParent: z.json().optional(),
					integrationField: z.json().optional(),
					intOrder: z.number().int().optional(),
					isExempt: z.boolean().optional(),
					strIdEnvironment: z.json().optional(),
				})
				.passthrough(),
		),
	},
	getTaxProfile: {
		group: 'taxProfiles',
		tag: 'Tax Profiles',
		method: 'GET',
		path: '/taxProfiles/{ID}',
		pathKeys: ['id'],
		operationId: 'get-tax-profile',
		summary: 'Get Tax Profile',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				Descripcion: z.string().optional(),
				Descripcion_BR: z.json().optional(),
				Descripcion_DE: z.json().optional(),
				Descripcion_DK: z.json().optional(),
				Descripcion_EN: z.string().optional(),
				Descripcion_FR: z.json().optional(),
				Descripcion_IT: z.json().optional(),
				Descripcion_PT: z.json().optional(),
				Descripcion_RU: z.json().optional(),
				Descripcion_US: z.json().optional(),
				Descripcion_frca: z.json().optional(),
				extID: z.string().optional(),
				id: z.number().int().optional(),
				idParent: z.number().int().optional(),
				integrationField: z.json().optional(),
				intOrder: z.number().int().optional(),
				isExempt: z.boolean().optional(),
				strIdEnvironment: z.json().optional(),
			})
			.passthrough(),
	},
	productFamiliesBranchesSchema: {
		group: 'productFamiliesBranches',
		tag: 'Product Families Branches',
		method: 'GET',
		path: '/productFamiliesBranches/schema',
		pathKeys: [],
		operationId: 'product-families-branches-schema',
		summary: 'Product Families Branches schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						productFamilyId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProductFamiliesBranches: {
		group: 'productFamiliesBranches',
		tag: 'Product Families Branches',
		method: 'GET',
		path: '/productFamiliesBranches',
		pathKeys: [],
		operationId: 'list-product-families-branches',
		summary: 'List Product Families Branches',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchId: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					id: z.number().int().optional(),
					productFamilyId: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createProductFamiliesBranch: {
		group: 'productFamiliesBranches',
		tag: 'Product Families Branches',
		method: 'POST',
		path: '/productFamiliesBranches',
		pathKeys: [],
		operationId: 'create-product-families-branch',
		summary: 'Create Product Families Branch',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						productFamilyId: z.number().int(),
						branchId: z.number().int(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProductFamiliesBranch: {
		group: 'productFamiliesBranches',
		tag: 'Product Families Branches',
		method: 'GET',
		path: '/productFamiliesBranches/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product-families-branch',
		summary: 'Get Product Families Branch',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchId: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				id: z.number().int().optional(),
				productFamilyId: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateProductFamiliesBranch: {
		group: 'productFamiliesBranches',
		tag: 'Product Families Branches',
		method: 'PUT',
		path: '/productFamiliesBranches/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product-families-branch',
		summary: 'Update Product Families Branch',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						productFamilyId: z.number().int().optional(),
						branchId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProductFamiliesBranch: {
		group: 'productFamiliesBranches',
		tag: 'Product Families Branches',
		method: 'DELETE',
		path: '/productFamiliesBranches/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-product-families-branch',
		summary: 'Delete Product Families Branch',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	productEnvironmentsSchema: {
		group: 'productEnvironments',
		tag: 'Product Environments',
		method: 'GET',
		path: '/productEnvironments/schema',
		pathKeys: [],
		operationId: 'product-environments-schema',
		summary: 'Product Environments schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.string().optional(),
							})
							.passthrough()
							.optional(),
						productId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProductEnvironments: {
		group: 'productEnvironments',
		tag: 'Product Environments',
		method: 'GET',
		path: '/productEnvironments',
		pathKeys: [],
		operationId: 'list-product-environments',
		summary: 'List Product Environments',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchId: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					id: z.number().int().optional(),
					productId: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createProductEnvironment: {
		group: 'productEnvironments',
		tag: 'Product Environments',
		method: 'POST',
		path: '/productEnvironments',
		pathKeys: [],
		operationId: 'create-product-environment',
		summary: 'Create Product Environment',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						productId: z.number().int().optional(),
						branchId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProductEnvironment: {
		group: 'productEnvironments',
		tag: 'Product Environments',
		method: 'GET',
		path: '/productEnvironments/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product-environment',
		summary: 'Get Product Environment',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchId: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				id: z.number().int().optional(),
				productId: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateProductEnvironment: {
		group: 'productEnvironments',
		tag: 'Product Environments',
		method: 'PUT',
		path: '/productEnvironments/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product-environment',
		summary: 'Update Product Environment',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						productId: z.number().int().optional(),
						branchId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProductEnvironment: {
		group: 'productEnvironments',
		tag: 'Product Environments',
		method: 'DELETE',
		path: '/productEnvironments/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-product-environment',
		summary: 'Delete Product Environment',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	productCategoriesSchema: {
		group: 'productsCategories',
		tag: 'Products / Categories',
		method: 'GET',
		path: '/productCategories/schema',
		pathKeys: [],
		operationId: 'product-categories-schema',
		summary: 'Product Categories schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						cLevel2: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProductCategories: {
		group: 'productsCategories',
		tag: 'Products / Categories',
		method: 'GET',
		path: '/productCategories',
		pathKeys: [],
		operationId: 'list-product-categories',
		summary: 'List Product Categories',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					cLevel2: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.json().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.json().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createProductCategory: {
		group: 'productsCategories',
		tag: 'Products / Categories',
		method: 'POST',
		path: '/productCategories',
		pathKeys: [],
		operationId: 'create-product-category',
		summary: 'Create Product Category',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						cLevel2: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProductCategory: {
		group: 'productsCategories',
		tag: 'Products / Categories',
		method: 'GET',
		path: '/productCategories/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product-category',
		summary: 'Get Product Category',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				cLevel2: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.json().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.json().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateProductCategory: {
		group: 'productsCategories',
		tag: 'Products / Categories',
		method: 'PUT',
		path: '/productCategories/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product-category',
		summary: 'Update Product Category',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ cLevel2: z.number().int().optional() }).strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProductCategory: {
		group: 'productsCategories',
		tag: 'Products / Categories',
		method: 'DELETE',
		path: '/productCategories/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-product-category',
		summary: 'Delete Product Category',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	productRatesSchema: {
		group: 'productsRates',
		tag: 'Products / Rates',
		method: 'GET',
		path: '/productRates/schema',
		pathKeys: [],
		operationId: 'product-rates-schema',
		summary: 'Product Rates schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						costPrice: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount1: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount2: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount3: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						discount4: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						productId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						rateId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salePrice: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						tempBuyingPrice: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						tempListedPrice: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listProductRates: {
		group: 'productsRates',
		tag: 'Products / Rates',
		method: 'GET',
		path: '/productRates',
		pathKeys: [],
		operationId: 'list-product-rates',
		summary: 'List Product Rates',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.json(),
	},
	createProductRate: {
		group: 'productsRates',
		tag: 'Products / Rates',
		method: 'POST',
		path: '/productRates',
		pathKeys: [],
		operationId: 'create-product-rate',
		summary: 'Create Product Rate',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						costPrice: z.number().int().optional(),
						discount1: z.number().int().optional(),
						discount2: z.number().int().optional(),
						discount3: z.number().int().optional(),
						discount4: z.number().int().optional(),
						productId: z.number().int().optional(),
						rateId: z.number().int().optional(),
						salePrice: z.number().int().optional(),
						tempBuyingPrice: z.number().int().optional(),
						tempListedPrice: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getProductRate: {
		group: 'productsRates',
		tag: 'Products / Rates',
		method: 'GET',
		path: '/productRates/{ID}',
		pathKeys: ['id'],
		operationId: 'get-product-rate',
		summary: 'Get Product Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				costPrice: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				discount1: z.number().int().optional(),
				discount2: z.number().int().optional(),
				discount3: z.number().int().optional(),
				discount4: z.number().int().optional(),
				productId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				rateId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salePrice: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				tempBuyingPrice: z.number().int().optional(),
				tempListedPrice: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateProductRate: {
		group: 'productsRates',
		tag: 'Products / Rates',
		method: 'PUT',
		path: '/productRates/{ID}',
		pathKeys: ['id'],
		operationId: 'update-product-rate',
		summary: 'Update Product Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						costPrice: z.number().int().optional(),
						salePrice: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteProductRate: {
		group: 'productsRates',
		tag: 'Products / Rates',
		method: 'DELETE',
		path: '/productRates/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-product-rate',
		summary: 'Delete Product Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	ratesSchema: {
		group: 'rates',
		tag: 'Rates',
		method: 'GET',
		path: '/rates/schema',
		pathKeys: [],
		operationId: 'rates-schema',
		summary: 'Rates schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						Comments: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						currencyId: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						endDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extID: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						startDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listRates: {
		group: 'rates',
		tag: 'Rates',
		method: 'GET',
		path: '/rates',
		pathKeys: [],
		operationId: 'list-rates',
		summary: 'List Rates',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					Comments: z.string().optional(),
					branchId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					branchVisibility: z
						.array(
							z
								.object({
									id: z.number().int().optional(),
									value: z.string().optional(),
								})
								.passthrough(),
						)
						.optional(),
					currencyId: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.string().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.string().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.string().optional(),
					descriptionRU: z.string().optional(),
					descriptionUS: z.string().optional(),
					endDate: z.json().optional(),
					extID: z.json().optional(),
					id: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					startDate: z.string().optional(),
				})
				.passthrough(),
		),
	},
	createRate: {
		group: 'rates',
		tag: 'Rates',
		method: 'POST',
		path: '/rates',
		pathKeys: [],
		operationId: 'create-rate',
		summary: 'Create Rate',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string().optional(),
						branchId: z.number().int().optional(),
						comments: z.string().optional(),
						currencyId: z.number().int().optional(),
						startDate: z.string().optional(),
						endDate: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getRate: {
		group: 'rates',
		tag: 'Rates',
		method: 'GET',
		path: '/rates/{ID}',
		pathKeys: ['id'],
		operationId: 'get-rate',
		summary: 'Get Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				Comments: z.string().optional(),
				branchId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				branchVisibility: z
					.array(
						z
							.object({
								id: z.number().int().optional(),
								value: z.string().optional(),
							})
							.passthrough(),
					)
					.optional(),
				currencyId: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.string().optional(),
				descriptionDE: z.string().optional(),
				descriptionDK: z.string().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.string().optional(),
				descriptionRU: z.string().optional(),
				descriptionUS: z.string().optional(),
				endDate: z.json().optional(),
				extID: z.json().optional(),
				id: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				startDate: z.string().optional(),
			})
			.passthrough(),
	},
	updateRate: {
		group: 'rates',
		tag: 'Rates',
		method: 'PUT',
		path: '/rates/{ID}',
		pathKeys: ['id'],
		operationId: 'update-rate',
		summary: 'Update Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						branchId: z.number().int().optional(),
						branchVisibility: z
							.array(z.record(z.string(), z.json()))
							.optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteRate: {
		group: 'rates',
		tag: 'Rates',
		method: 'DELETE',
		path: '/rates/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-rate',
		summary: 'Delete Rate',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	relatedAccountsSchema: {
		group: 'relatedAccountsEntity',
		tag: 'Related Accounts / Entity',
		method: 'GET',
		path: '/accountsRelated/schema',
		pathKeys: [],
		operationId: 'related-accounts-schema',
		summary: 'Related Accounts schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountOneId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountTwoId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						relationId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listRelatedAccounts: {
		group: 'relatedAccountsEntity',
		tag: 'Related Accounts / Entity',
		method: 'GET',
		path: '/accountsRelated',
		pathKeys: [],
		operationId: 'list-related-accounts',
		summary: 'List Related Accounts',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountOneId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					accountTwoId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					id: z.number().int().optional(),
					relationId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createRelatedAccount: {
		group: 'relatedAccountsEntity',
		tag: 'Related Accounts / Entity',
		method: 'POST',
		path: '/accountsRelated',
		pathKeys: [],
		operationId: 'create-related-account',
		summary: 'Create Related Account',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountOneId: z.number().int().optional(),
						accountTwoId: z.number().int().optional(),
						relationId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	retrieveRelatedAccount: {
		group: 'relatedAccountsEntity',
		tag: 'Related Accounts / Entity',
		method: 'GET',
		path: '/accountsRelated/{ID}',
		pathKeys: ['id'],
		operationId: 'retrieve-related-account',
		summary: 'Retrieve Related Account',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountOneId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				accountTwoId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				id: z.number().int().optional(),
				relationId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateRelatedAccount: {
		group: 'relatedAccountsEntity',
		tag: 'Related Accounts / Entity',
		method: 'PUT',
		path: '/accountsRelated/{ID}',
		pathKeys: ['id'],
		operationId: 'update-related-account',
		summary: 'Update Related Account',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountOneId: z.number().int().optional(),
						accountTwoId: z.number().int().optional(),
						relationId: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteRelatedAccount: {
		group: 'relatedAccountsEntity',
		tag: 'Related Accounts / Entity',
		method: 'DELETE',
		path: '/accountsRelated/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-related-account',
		summary: 'Delete Related Account',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	relatedAccountTypesSchema: {
		group: 'relatedAccountsTypes',
		tag: 'Related Accounts / Types',
		method: 'GET',
		path: '/accountsRelations/schema',
		pathKeys: [],
		operationId: 'related-account-types-schema',
		summary: 'Related Account Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						reverseDescriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listRelatedAccountTypes: {
		group: 'relatedAccountsTypes',
		tag: 'Related Accounts / Types',
		method: 'GET',
		path: '/accountsRelations',
		pathKeys: [],
		operationId: 'list-related-account-types',
		summary: 'List Related Account Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					reverseDescriptionBR: z.json().optional(),
					reverseDescriptionDE: z.json().optional(),
					reverseDescriptionDK: z.json().optional(),
					reverseDescriptionEN: z.json().optional(),
					reverseDescriptionES: z.json().optional(),
					reverseDescriptionFR: z.json().optional(),
					reverseDescriptionIT: z.json().optional(),
					reverseDescriptionPT: z.json().optional(),
					reverseDescriptionRU: z.json().optional(),
					reverseDescriptionUS: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
				})
				.passthrough(),
		),
	},
	createRelatedAccountType: {
		group: 'relatedAccountsTypes',
		tag: 'Related Accounts / Types',
		method: 'POST',
		path: '/accountsRelations',
		pathKeys: [],
		operationId: 'create-related-account-type',
		summary: 'Create Related Account Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionEN: z.string().optional(),
						reverseDescriptionEN: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	retrieveRelatedAccountType: {
		group: 'relatedAccountsTypes',
		tag: 'Related Accounts / Types',
		method: 'GET',
		path: '/accountsRelations/{ID}',
		pathKeys: ['id'],
		operationId: 'retrieve-related-account-type',
		summary: 'Retrieve Related Account Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.string().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.string().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				reverseDescriptionBR: z.json().optional(),
				reverseDescriptionDE: z.json().optional(),
				reverseDescriptionDK: z.json().optional(),
				reverseDescriptionEN: z.json().optional(),
				reverseDescriptionES: z.json().optional(),
				reverseDescriptionFR: z.json().optional(),
				reverseDescriptionIT: z.json().optional(),
				reverseDescriptionPT: z.json().optional(),
				reverseDescriptionRU: z.json().optional(),
				reverseDescriptionUS: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
			})
			.passthrough(),
	},
	updateRelatedAccountType: {
		group: 'relatedAccountsTypes',
		tag: 'Related Accounts / Types',
		method: 'PUT',
		path: '/accountsRelations/{ID}',
		pathKeys: ['id'],
		operationId: 'update-related-account-type',
		summary: 'Update Related Account Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteRelatedAccountType: {
		group: 'relatedAccountsTypes',
		tag: 'Related Accounts / Types',
		method: 'DELETE',
		path: '/accountsRelations/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-related-account-type',
		summary: 'Delete Related Account Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	getResources: {
		group: 'resources',
		tag: 'Resources',
		method: 'GET',
		path: '/resources',
		pathKeys: [],
		operationId: 'get-resources',
		summary: 'Get Resources',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					end_point: z.string().optional(),
					description: z.string().optional(),
					schema: z.string().optional(),
					operations: z
						.object({
							create: z.boolean().optional(),
							read: z.boolean().optional(),
							update: z.boolean().optional(),
							delete: z.boolean().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough(),
		),
	},
	rolesSchema: {
		group: 'roles',
		tag: 'Roles',
		method: 'GET',
		path: '/roles/schema',
		pathKeys: [],
		operationId: 'roles-schema',
		summary: 'Roles schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branches: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
												required: z.array(z.string()).optional(),
												type: z.string().optional(),
											})
											.passthrough()
											.optional(),
										readOnly: z.boolean().optional(),
										table: z.string().optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						dataDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						level: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						name: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listRoles: {
		group: 'roles',
		tag: 'Roles',
		method: 'GET',
		path: '/roles',
		pathKeys: [],
		operationId: 'list-roles',
		summary: 'List Roles',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					extId: z.json().optional(),
					level: z.number().int().optional(),
					name: z.string().optional(),
					branches: z.array(z.number().int()).optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					dateDeleted: z.string().optional(),
					deleted: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	getRole: {
		group: 'roles',
		tag: 'Roles',
		method: 'GET',
		path: '/roles/{ID}',
		pathKeys: ['id'],
		operationId: 'get-role',
		summary: 'Get Role',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				extId: z.json().optional(),
				level: z.number().int().optional(),
				name: z.string().optional(),
				branches: z.json().optional(),
				salesRepIdDeleted: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				dateCreated: z.string().optional(),
				dateUpdated: z.string().optional(),
				dateDeleted: z.string().optional(),
				deleted: z.boolean().optional(),
			})
			.passthrough(),
	},
	listRolesOfUser: {
		group: 'roles',
		tag: 'Roles',
		method: 'GET',
		path: '/users/{ID}/roles',
		pathKeys: ['id'],
		operationId: 'list-roles-of-user',
		summary: 'List Roles of User',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					extId: z.json().optional(),
					level: z.number().int().optional(),
					name: z.string().optional(),
					branches: z.array(z.json()).optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					dateDeleted: z.string().optional(),
					deleted: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	addRolesInUser: {
		group: 'roles',
		tag: 'Roles',
		method: 'PUT',
		path: '/users/{ID}/roles',
		pathKeys: ['id'],
		operationId: 'add-roles-in-user',
		summary: 'Add Roles in User',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						rolesId: z.array(z.record(z.string(), z.json())).optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					extId: z.json().optional(),
					level: z.number().int().optional(),
					name: z.string().optional(),
					branches: z.array(z.json()).optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					dateDeleted: z.string().optional(),
					deleted: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	deleteRolesInUser: {
		group: 'roles',
		tag: 'Roles',
		method: 'DELETE',
		path: '/users/{ID}/roles',
		pathKeys: ['id'],
		operationId: 'delete-roles-in-user',
		summary: 'Delete Roles in User',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					extId: z.json().optional(),
					level: z.number().int().optional(),
					name: z.string().optional(),
					branches: z.array(z.json()).optional(),
					salesRepIdDeleted: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					dateDeleted: z.string().optional(),
					deleted: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	listUsersInRole: {
		group: 'roles',
		tag: 'Roles',
		method: 'GET',
		path: '/roles/{ID}/users',
		pathKeys: ['id'],
		operationId: 'list-users-in-role',
		summary: 'List Users in Role',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					extId: z.string().optional(),
					billable: z.boolean().optional(),
					lastPasswordChangeDate: z.json().optional(),
					branches: z
						.object({
							id: z.number().int().optional(),
							description: z.string().optional(),
						})
						.passthrough()
						.optional(),
					userTypeId: z
						.object({
							id: z.number().int().optional(),
							description: z.string().optional(),
						})
						.passthrough()
						.optional(),
					level: z.number().int().optional(),
					name: z.string().optional(),
					lastName: z.string().optional(),
					email: z.string().optional(),
					nic: z.string().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.string().optional(),
					dateDeleted: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.number().int().optional(),
					salesRepIdDeleted: z.number().int().optional(),
					deleted: z.boolean().optional(),
					phone: z.string().optional(),
					phoneExtension: z.string().optional(),
					managerId: z
						.object({
							id: z.number().int().optional(),
							name: z.json().optional(),
						})
						.passthrough()
						.optional(),
					rateId: z
						.object({
							id: z.number().int().optional(),
							name: z.json().optional(),
						})
						.passthrough()
						.optional(),
					computeSfm: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	salesSchema: {
		group: 'sales',
		tag: 'Sales',
		method: 'GET',
		path: '/sales/schema',
		pathKeys: [],
		operationId: 'sales-schema',
		summary: 'Sales schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						accountExtId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						accountId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						date: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepExtId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						total: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listSales: {
		group: 'sales',
		tag: 'Sales',
		method: 'GET',
		path: '/sales',
		pathKeys: [],
		operationId: 'list-sales',
		summary: 'List Sales',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					accountExtId: z.string().optional(),
					accountId: z
						.object({
							id: z.number().int().optional(),
							value: z.string().optional(),
						})
						.passthrough()
						.optional(),
					date: z.string().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.number().int().optional(),
					extId: z.string().optional(),
					id: z.number().int().optional(),
					salesRepExtId: z.string().optional(),
					salesRepId: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					total: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createSale: {
		group: 'sales',
		tag: 'Sales',
		method: 'POST',
		path: '/sales',
		pathKeys: [],
		operationId: 'create-sale',
		summary: 'Create Sale',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountExtId: z.string().optional(),
						accountId: z.number().int().optional(),
						date: z.string().optional(),
						extId: z.string().optional(),
						salesRepExtId: z.string().optional(),
						total: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getSale: {
		group: 'sales',
		tag: 'Sales',
		method: 'GET',
		path: '/sales/{ID}',
		pathKeys: ['id'],
		operationId: 'get-sale',
		summary: 'Get Sale',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				accountExtId: z.string().optional(),
				accountId: z
					.object({
						id: z.number().int().optional(),
						value: z.string().optional(),
					})
					.passthrough()
					.optional(),
				date: z.string().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				deleted: z.number().int().optional(),
				extId: z.string().optional(),
				id: z.number().int().optional(),
				salesRepExtId: z.string().optional(),
				salesRepId: z.json().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				total: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateSale: {
		group: 'sales',
		tag: 'Sales',
		method: 'PUT',
		path: '/sales/{ID}',
		pathKeys: ['id'],
		operationId: 'update-sale',
		summary: 'Update Sale',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						accountId: z.number().int().optional(),
						date: z.string().optional(),
						salesRepExtId: z.string().optional(),
						total: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteSale: {
		group: 'sales',
		tag: 'Sales',
		method: 'DELETE',
		path: '/sales/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-sale',
		summary: 'Delete Sale',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	listTimezones: {
		group: 'timeZones',
		tag: 'TimeZones',
		method: 'GET',
		path: '/timezones',
		pathKeys: [],
		operationId: 'list-timezones',
		summary: 'List TimeZones',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionPT: z.string().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.string().optional(),
					fullDescription: z.string().optional(),
					id: z.number().int().optional(),
					idIanaZone: z.string().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					shortDescription: z.string().optional(),
				})
				.passthrough(),
		),
	},
	usersSchema: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'GET',
		path: '/users/schema',
		pathKeys: [],
		operationId: 'users-schema',
		summary: 'Users schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						billable: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branch: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branchRestriction: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						branches: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										description: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										readOnly: z.boolean().optional(),
										required: z.array(z.string()).optional(),
										table: z.string().optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						computeInSfm: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						computeSfm: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dataDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dbLanguage: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						email: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						idPrefix: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										readOnly: z.boolean().optional(),
										required: z.array(z.string()).optional(),
										table: z.string().optional(),
										type: z.array(z.string()).optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						isActive: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lastName: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						lastPasswordChangeDate: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						level: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						locale: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						managerId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										readOnly: z.boolean().optional(),
										required: z.array(z.string()).optional(),
										table: z.string().optional(),
										type: z.array(z.string()).optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						name: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						nic: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						password: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phone: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						phoneExtension: z
							.object({
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						rateId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										name: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
										readOnly: z.boolean().optional(),
										required: z.array(z.string()).optional(),
										table: z.string().optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
						responsible: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						session: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						uiLanguage: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						userType: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										value: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								required: z.array(z.string()).optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						userTypeId: z
							.object({
								description: z.string().optional(),
								properties: z
									.object({
										description: z
											.object({ type: z.array(z.string()).optional() })
											.passthrough()
											.optional(),
										id: z
											.object({ type: z.string().optional() })
											.passthrough()
											.optional(),
										readOnly: z.boolean().optional(),
										required: z.array(z.string()).optional(),
										table: z.string().optional(),
										type: z.array(z.string()).optional(),
									})
									.passthrough()
									.optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listUsers: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'GET',
		path: '/users',
		pathKeys: [],
		operationId: 'list-users',
		summary: 'List Users',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					billable: z.boolean().optional(),
					branches: z
						.object({
							description: z.string().optional(),
							id: z.number().int().optional(),
						})
						.passthrough()
						.optional(),
					computeSfm: z.boolean().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.string().optional(),
					dateUpdated: z.json().optional(),
					dbLanguage: z.json().optional(),
					deleted: z.boolean().optional(),
					email: z.string().optional(),
					extId: z.string().optional(),
					id: z.number().int().optional(),
					idPrefix: z.json().optional(),
					isActive: z.boolean().optional(),
					lastName: z.string().optional(),
					lastPasswordChangeDate: z.string().optional(),
					level: z.number().int().optional(),
					locale: z.json().optional(),
					managerId: z
						.object({
							description: z.string().optional(),
							id: z.number().int().optional(),
						})
						.passthrough()
						.optional(),
					name: z.string().optional(),
					nic: z.string().optional(),
					phone: z.string().optional(),
					phoneExtension: z.json().optional(),
					rateId: z
						.object({
							description: z.json().optional(),
							id: z.number().int().optional(),
						})
						.passthrough()
						.optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.json().optional(),
					uiLanguage: z.json().optional(),
					userTypeId: z
						.object({
							description: z.string().optional(),
							id: z.number().int().optional(),
						})
						.passthrough()
						.optional(),
				})
				.passthrough(),
		),
	},
	createUser: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'POST',
		path: '/users',
		pathKeys: [],
		operationId: 'create-user',
		summary: 'Create User',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						extId: z.string().optional(),
						isActive: z.boolean().optional(),
						branches: z.number().int().optional(),
						userTypeId: z.number().int().optional(),
						level: z.number().int().optional(),
						name: z.string().optional(),
						lastName: z.string().optional(),
						email: z.string().optional(),
						nic: z.string().optional(),
						password: z.string().optional(),
						phone: z.string().optional(),
						phoneExtension: z.string().optional(),
						idPrefix: z.number().int().optional(),
						managerId: z.number().int().optional(),
						rateId: z.number().int().optional(),
						computeSfm: z.boolean().optional(),
						dbLanguage: z.string().optional(),
						uiLanguage: z.string().optional(),
						locale: z.string().optional(),
						deleted: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				billable: z.boolean().optional(),
				branches: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				computeSfm: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				dbLanguage: z.string().optional(),
				deleted: z.boolean().optional(),
				email: z.string().optional(),
				extId: z.string().optional(),
				id: z.number().int().optional(),
				idPrefix: z.number().int().optional(),
				isActive: z.boolean().optional(),
				lastName: z.string().optional(),
				lastPasswordChangeDate: z.string().optional(),
				level: z.number().int().optional(),
				locale: z.string().optional(),
				managerId: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				name: z.string().optional(),
				nic: z.string().optional(),
				phone: z.string().optional(),
				phoneExtension: z.string().optional(),
				rateId: z
					.object({
						description: z.json().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				uiLanguage: z.string().optional(),
				userTypeId: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	getUser: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'GET',
		path: '/users/{ID}',
		pathKeys: ['id'],
		operationId: 'get-user',
		summary: 'Get User',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				billable: z.boolean().optional(),
				branches: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				computeSfm: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.json().optional(),
				dbLanguage: z.string().optional(),
				deleted: z.boolean().optional(),
				email: z.string().optional(),
				extId: z.string().optional(),
				id: z.number().int().optional(),
				idPrefix: z.number().int().optional(),
				isActive: z.boolean().optional(),
				lastName: z.string().optional(),
				lastPasswordChangeDate: z.string().optional(),
				level: z.number().int().optional(),
				locale: z.string().optional(),
				managerId: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				name: z.string().optional(),
				nic: z.string().optional(),
				phone: z.string().optional(),
				phoneExtension: z.string().optional(),
				rateId: z
					.object({
						description: z.json().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.json().optional(),
				uiLanguage: z.string().optional(),
				userTypeId: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	updateUser: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'PUT',
		path: '/users/{ID}',
		pathKeys: ['id'],
		operationId: 'update-user',
		summary: 'Update User',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						extId: z.string().optional(),
						isActive: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				billable: z.boolean().optional(),
				branches: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				computeSfm: z.boolean().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				dbLanguage: z.string().optional(),
				deleted: z.boolean().optional(),
				email: z.string().optional(),
				extId: z.string().optional(),
				id: z.number().int().optional(),
				idPrefix: z.number().int().optional(),
				isActive: z.boolean().optional(),
				lastName: z.string().optional(),
				lastPasswordChangeDate: z.string().optional(),
				level: z.number().int().optional(),
				locale: z.string().optional(),
				managerId: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				name: z.string().optional(),
				nic: z.string().optional(),
				phone: z.string().optional(),
				phoneExtension: z.string().optional(),
				rateId: z
					.object({
						description: z.json().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
				uiLanguage: z.string().optional(),
				userTypeId: z
					.object({
						description: z.string().optional(),
						id: z.number().int().optional(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough(),
	},
	deleteUser: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'DELETE',
		path: '/users/{ID}',
		pathKeys: ['id'],
		operationId: 'delete-user',
		summary: 'Delete User',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	listUserHierarchy: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'GET',
		path: '/users/{ID}/hierarchy',
		pathKeys: ['id'],
		operationId: 'list-user-hierarchy',
		summary: 'List User Hierarchy',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					name: z.string().optional(),
				})
				.passthrough(),
		),
	},
	listUsersScores: {
		group: 'usersEntity',
		tag: 'Users / Entity',
		method: 'GET',
		path: '/users/scores',
		pathKeys: [],
		operationId: 'list-users-scores',
		summary: 'List Users Scores',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					points: z.number().int().optional(),
					sales: z.number().int().optional(),
					lastUpdate: z.string().optional(),
				})
				.passthrough(),
		),
	},
	userTypesSchema: {
		group: 'usersTypes',
		tag: 'Users / Types',
		method: 'GET',
		path: '/userTypes/schema',
		pathKeys: [],
		operationId: 'user-types-schema',
		summary: 'User Types schema',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						branchVisibility: z
							.object({
								description: z.string().optional(),
								items: z
									.object({
										properties: z
											.object({
												id: z
													.object({
														type: z.string().optional(),
														value: z
															.object({ type: z.array(z.string()).optional() })
															.passthrough()
															.optional(),
													})
													.passthrough()
													.optional(),
											})
											.passthrough()
											.optional(),
										required: z.array(z.string()).optional(),
										type: z.string().optional(),
									})
									.passthrough()
									.optional(),
								readOnly: z.boolean().optional(),
								table: z.string().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateCreated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateDeleted: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						dateUpdated: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						deleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionBR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDE: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionDK: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionEN: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionES: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionFR: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionIT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionPT: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionRU: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descriptionUS: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdCreated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdDeleted: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						salesRepIdUpdated: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.json()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	listUserTypes: {
		group: 'usersTypes',
		tag: 'Users / Types',
		method: 'GET',
		path: '/userTypes',
		pathKeys: [],
		operationId: 'list-user-types',
		summary: 'List User Types',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.number().int().positive().optional(),
						extraFieldDescription: z.enum(['0', '1']).optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					branchVisibility: z.json().optional(),
					dateCreated: z.string().optional(),
					dateDeleted: z.json().optional(),
					dateUpdated: z.string().optional(),
					deleted: z.boolean().optional(),
					descriptionBR: z.json().optional(),
					descriptionDE: z.string().optional(),
					descriptionDK: z.json().optional(),
					descriptionEN: z.string().optional(),
					descriptionES: z.string().optional(),
					descriptionFR: z.json().optional(),
					descriptionIT: z.json().optional(),
					descriptionPT: z.json().optional(),
					descriptionRU: z.json().optional(),
					descriptionUS: z.json().optional(),
					id: z.number().int().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdUpdated: z.number().int().optional(),
				})
				.passthrough(),
		),
	},
	createUserType: {
		group: 'usersTypes',
		tag: 'Users / Types',
		method: 'POST',
		path: '/userTypes',
		pathKeys: [],
		operationId: 'create-user-type',
		summary: 'Create User Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	getUserType: {
		group: 'usersTypes',
		tag: 'Users / Types',
		method: 'GET',
		path: '/userTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'get-user-type',
		summary: 'Get User Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				branchVisibility: z.json().optional(),
				dateCreated: z.string().optional(),
				dateDeleted: z.json().optional(),
				dateUpdated: z.string().optional(),
				deleted: z.boolean().optional(),
				descriptionBR: z.json().optional(),
				descriptionDE: z.string().optional(),
				descriptionDK: z.json().optional(),
				descriptionEN: z.string().optional(),
				descriptionES: z.string().optional(),
				descriptionFR: z.json().optional(),
				descriptionIT: z.json().optional(),
				descriptionPT: z.json().optional(),
				descriptionRU: z.json().optional(),
				descriptionUS: z.json().optional(),
				id: z.number().int().optional(),
				salesRepIdCreated: z.number().int().optional(),
				salesRepIdDeleted: z.json().optional(),
				salesRepIdUpdated: z.number().int().optional(),
			})
			.passthrough(),
	},
	updateUserType: {
		group: 'usersTypes',
		tag: 'Users / Types',
		method: 'PUT',
		path: '/userTypes/{ID}',
		pathKeys: ['id'],
		operationId: 'update-user-type',
		summary: 'Update User Type',
		input: z
			.object({
				path: z
					.object({ id: z.union([z.number().int(), z.string().min(1)]) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionDE: z.string().optional() }).strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteUserType: {
		group: 'usersTypes',
		tag: 'Users / Types',
		method: 'DELETE',
		path: '/userTypes/7',
		pathKeys: [],
		operationId: 'delete-user-type',
		summary: 'Delete User Type',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	listLists: {
		group: 'valueListsEntity',
		tag: 'Value Lists / Entity',
		method: 'GET',
		path: '/list',
		pathKeys: [],
		operationId: 'list-lists',
		summary: 'List Lists',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					databaseName: z.string().optional(),
					description: z.string().optional(),
					descriptionEN: z.string().optional(),
					descriptionIT: z.string().optional(),
					descriptionFR: z.string().optional(),
					descriptionDE: z.string().optional(),
					descriptionPT: z.string().optional(),
					descriptionUS: z.string().optional(),
					descriptionBR: z.string().optional(),
					descriptionRU: z.string().optional(),
					descriptionDK: z.string().optional(),
				})
				.passthrough(),
		),
	},
	createList: {
		group: 'valueListsEntity',
		tag: 'Value Lists / Entity',
		method: 'POST',
		path: '/list',
		pathKeys: [],
		operationId: 'create-list',
		summary: 'Create List',
		input: z
			.object({
				path: z.object({}).strict().optional(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						databaseName: z.string().optional(),
						description: z.string().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				databaseName: z.string().optional(),
				description: z.string().optional(),
				descriptionEN: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionDE: z.string().optional(),
				descriptionPT: z.string().optional(),
				descriptionUS: z.string().optional(),
				descriptionBR: z.string().optional(),
				descriptionRU: z.string().optional(),
				descriptionDK: z.string().optional(),
			})
			.passthrough(),
	},
	updateList: {
		group: 'valueListsEntity',
		tag: 'Value Lists / Entity',
		method: 'PUT',
		path: '/list/VALUE',
		pathKeys: ['value'],
		operationId: 'update-list',
		summary: 'Update List',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.object({ descriptionEN: z.string().optional() }).strict(),
			})
			.strict(),
		output: z
			.object({
				databaseName: z.string().optional(),
				description: z.string().optional(),
				descriptionEN: z.string().optional(),
				descriptionIT: z.string().optional(),
				descriptionFR: z.string().optional(),
				descriptionDE: z.string().optional(),
				descriptionPT: z.string().optional(),
				descriptionUS: z.string().optional(),
				descriptionBR: z.string().optional(),
				descriptionRU: z.string().optional(),
				descriptionDK: z.string().optional(),
			})
			.passthrough(),
	},
	deleteList: {
		group: 'valueListsEntity',
		tag: 'Value Lists / Entity',
		method: 'DELETE',
		path: '/list/VALUE',
		pathKeys: ['value'],
		operationId: 'delete-list',
		summary: 'Delete List',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				code: z.number().int().optional(),
				message: z.string().optional(),
			})
			.passthrough(),
	},
	listValues: {
		group: 'valueListsValues',
		tag: 'Value Lists / Values',
		method: 'GET',
		path: '/list/VALUE',
		pathKeys: ['value'],
		operationId: 'list-values',
		summary: 'List Values',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					UserBorrado: z.json().optional(),
					UserCreado: z.number().int().optional(),
					UserModificado: z.json().optional(),
					borrado: z.boolean().optional(),
					descripcion: z.string().optional(),
					descripcion_br: z.string().optional(),
					descripcion_de: z.string().optional(),
					descripcion_dk: z.string().optional(),
					descripcion_en: z.string().optional(),
					descripcion_fr: z.string().optional(),
					descripcion_it: z.string().optional(),
					descripcion_pt: z.string().optional(),
					descripcion_ru: z.string().optional(),
					descripcion_us: z.string().optional(),
					extId: z.string().optional(),
					fCreado: z.string().optional(),
					fModificado: z.json().optional(),
					fborrado: z.json().optional(),
					id: z.number().int().optional(),
					idParent: z.number().int().optional(),
					intOrder: z.number().int().optional(),
					strIdEnvironment: z.string().optional(),
				})
				.passthrough(),
		),
	},
	createValue: {
		group: 'valueListsValues',
		tag: 'Value Lists / Values',
		method: 'POST',
		path: '/list/VALUE',
		pathKeys: ['value'],
		operationId: 'create-value',
		summary: 'Create Value',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	valuesListSchema: {
		group: 'valueListsValues',
		tag: 'Value Lists / Values',
		method: 'GET',
		path: '/list/VALUE/schema',
		pathKeys: ['value'],
		operationId: 'values-list-schema',
		summary: 'Values List schema',
		input: z
			.object({
				path: z.object({ value: z.string().min(1) }).strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				properties: z
					.object({
						UserBorrado: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						UserCreado: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						UserModificado: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						borrado: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_br: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_de: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_dk: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_en: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_fr: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_it: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_pt: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_ru: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						descripcion_us: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						extId: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fCreado: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fModificado: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						fborrado: z
							.object({
								description: z.string().optional(),
								format: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						id: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						idParent: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						intOrder: z
							.object({
								description: z.string().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
						strIdEnvironment: z
							.object({
								description: z.string().optional(),
								maxLength: z.number().int().optional(),
								readOnly: z.boolean().optional(),
								type: z.array(z.string()).optional(),
							})
							.passthrough()
							.optional(),
					})
					.passthrough()
					.optional(),
				required: z.array(z.string()).optional(),
				title: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough(),
	},
	getValue: {
		group: 'valueListsValues',
		tag: 'Value Lists / Values',
		method: 'GET',
		path: '/list/VALUE/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'get-value',
		summary: 'Get Value',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				UserBorrado: z.json().optional(),
				UserCreado: z.number().int().optional(),
				UserModificado: z.json().optional(),
				borrado: z.boolean().optional(),
				descripcion: z.string().optional(),
				descripcion_br: z.json().optional(),
				descripcion_de: z.json().optional(),
				descripcion_dk: z.json().optional(),
				descripcion_en: z.json().optional(),
				descripcion_fr: z.json().optional(),
				descripcion_it: z.json().optional(),
				descripcion_pt: z.json().optional(),
				descripcion_ru: z.json().optional(),
				descripcion_us: z.json().optional(),
				extId: z.json().optional(),
				fCreado: z.string().optional(),
				fModificado: z.json().optional(),
				fborrado: z.json().optional(),
				id: z.number().int().optional(),
				idParent: z.json().optional(),
				intOrder: z.json().optional(),
				strIdEnvironment: z.json().optional(),
			})
			.passthrough(),
	},
	updateValue: {
		group: 'valueListsValues',
		tag: 'Value Lists / Values',
		method: 'PUT',
		path: '/list/VALUE/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'update-value',
		summary: 'Update Value',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						descriptionES: z.string().optional(),
						order: z.number().int().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	deleteValue: {
		group: 'valueListsValues',
		tag: 'Value Lists / Values',
		method: 'DELETE',
		path: '/list/VALUE/{ID}',
		pathKeys: ['value', 'id'],
		operationId: 'delete-value',
		summary: 'Delete Value',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						id: z.union([z.number().int(), z.string().min(1)]),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.object({ Message: z.string().optional() }).passthrough(),
	},
	listWarningsOfAResource: {
		group: 'warnings',
		tag: 'Warnings',
		method: 'GET',
		path: '/VALUE/VALUE/warnings',
		pathKeys: ['value', 'value2'],
		operationId: 'list-warnings-of-a-resource',
		summary: 'List Warnings of a Resource',
		input: z
			.object({
				path: z
					.object({ value: z.string().min(1), value2: z.string().min(1) })
					.strict(),
				query: z
					.object({
						page: z.number().int().min(0).optional(),
						where: z.string().optional(),
						order: z.string().optional(),
						lang: z.string().optional(),
						filters: z
							.record(
								z.string(),
								z.union([z.string(), z.number(), z.boolean()]),
							)
							.optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z.array(
			z
				.object({
					id: z.number().int().optional(),
					text: z.string().optional(),
					dateCreated: z.string().optional(),
					dateUpdated: z.json().optional(),
					dateDeleted: z.json().optional(),
					salesRepIdDeleted: z.json().optional(),
					salesRepIdCreated: z.number().int().optional(),
					salesRepIdUpdated: z.json().optional(),
					deleted: z.boolean().optional(),
					enabled: z.boolean().optional(),
				})
				.passthrough(),
		),
	},
	createWarningForAResourceCopy: {
		group: 'warnings',
		tag: 'Warnings',
		method: 'POST',
		path: '/VALUE/VALUE/warnings',
		pathKeys: ['value', 'value2'],
		operationId: 'create-warning-for-a-resource-copy',
		summary: 'Create Warning for a Resource Copy',
		input: z
			.object({
				path: z
					.object({ value: z.string().min(1), value2: z.string().min(1) })
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						text: z.string().optional(),
						enabled: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	updateWarningOfAResource: {
		group: 'warnings',
		tag: 'Warnings',
		method: 'PUT',
		path: '/VALUE/VALUE/warnings/VALUE',
		pathKeys: ['value', 'value2', 'value3'],
		operationId: 'update-warning-of-a-resource',
		summary: 'Update Warning of a Resource',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						value2: z.string().min(1),
						value3: z.string().min(1),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z
					.object({
						text: z.string().optional(),
						enabled: z.boolean().optional(),
					})
					.strict(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
	deleteWarningOfAResource: {
		group: 'warnings',
		tag: 'Warnings',
		method: 'DELETE',
		path: '/VALUE/VALUE/warnings/VALUE',
		pathKeys: ['value', 'value2', 'value3'],
		operationId: 'delete-warning-of-a-resource',
		summary: 'Delete Warning of a Resource',
		input: z
			.object({
				path: z
					.object({
						value: z.string().min(1),
						value2: z.string().min(1),
						value3: z.string().min(1),
					})
					.strict(),
				query: z
					.object({
						page: z.never().optional(),
						where: z.never().optional(),
						order: z.never().optional(),
						lang: z.never().optional(),
						filters: z.never().optional(),
					})
					.strict()
					.optional(),
				headers: z
					.object({
						count: z.never().optional(),
						extraFieldDescription: z.never().optional(),
					})
					.strict()
					.optional(),
				body: z.never().optional(),
			})
			.strict(),
		output: z
			.object({
				id: z.number().int().optional(),
				Message: z.string().optional(),
			})
			.passthrough(),
	},
} as const;

export const operationKeys = [
	'accountAddressesSchema',
	'listAccountAddresses',
	'createAccountAddress',
	'getAccountAddress',
	'updateAccountAddress',
	'deleteAccountAddress',
	'accountsSchema',
	'listAccounts',
	'createAccount',
	'getAccount',
	'updateAccount',
	'deleteAccount',
	'accountTypesSchema',
	'listAccountTypes',
	'createAccountType',
	'getAccountType',
	'updateAccountType',
	'deleteAccountType',
	'accountSegmentsSchema',
	'listAccountSegments',
	'createAccountSegment',
	'getAccountSegment',
	'updateAccountSegment',
	'deleteAccountSegment',
	'accountStatusesSchema',
	'listAccountStatuses',
	'createAccountStatus',
	'getAccountStatus',
	'updateAccountStatus',
	'deleteAccountStatus',
	'activitiesSchema',
	'listActivities',
	'createActivity',
	'getActivity',
	'updateActivity',
	'deleteActivity',
	'activityTypesSchema',
	'listActivityTypes',
	'createActivityType',
	'getActivityType',
	'updateActivityType',
	'deleteActivityType',
	'listActivityPoints',
	'updateActivityPoints',
	'branchesSchema',
	'listBranches',
	'getBranch',
	'deleteBranch',
	'bulkCreateResources',
	'bulkUpdateResources',
	'bulkDeleteResources',
	'listCalls',
	'createCallByUserId',
	'createCallByUserPhoneNumber',
	'getCall',
	'updateCall',
	'deleteCall',
	'getResourcesByPhoneNumber',
	'listCampaigns',
	'createCampaign',
	'getCampaign',
	'updateCampaign',
	'deleteCampaign',
	'listOpportunityTypes',
	'createOpportunityType',
	'listCampaignStatuses',
	'listCampaignAccounts',
	'createCampaignAccount',
	'getCampaignAccount',
	'updateCampaignAccount',
	'deleteCampaignAccount',
	'listCampaignQuestions',
	'createCampaignQuestion',
	'getCampaignQuestion',
	'updateCampaignQuestion',
	'deleteCampaignQuestion',
	'listQuestionAnswers',
	'createQuestionAnswer',
	'getQuestionAnswer',
	'updateQuestionAnswer',
	'deleteQuestionAnswer',
	'listQuestionValues',
	'createQuestionValue',
	'getQuestionValue',
	'updateQuestionValue',
	'deleteQuestionValue',
	'contactsSchema',
	'listContacts',
	'createContact',
	'getContact',
	'updateContact',
	'deleteContact',
	'contactTypesSchema',
	'listContactTypes',
	'createContactType',
	'getContactType',
	'updateContactType',
	'deleteContactType',
	'countriesSchema',
	'listCountries',
	'currenciesSchema',
	'listCurrencies',
	'listDocuments',
	'addDocument',
	'listDocumentsOfAResource',
	'addDocumentToAResource',
	'deletePicture',
	'listFolders',
	'createFolder',
	'listFoldersOfAResource',
	'createFolderForAResource',
	'emailsSchema',
	'listEmails',
	'createEmail',
	'getEmail',
	'entityContactsSchema',
	'listEntityContacts',
	'entityOwnersSchema',
	'listEntityOwners',
	'calendarSchema',
	'listCalendar',
	'createCalendar',
	'getCalendar',
	'updateCalendar',
	'deleteCalendar',
	'extraFieldsSchemaByResource',
	'listExtraFieldsByResource',
	'createExtraFieldForResource',
	'listTabs',
	'createTabs',
	'getTabs',
	'updateTabs',
	'deleteTabs',
	'getForm',
	'getFormState',
	'getFormTemplate',
	'listNews',
	'opportunitiesSchema',
	'listOpportunities',
	'createOpportunity',
	'getOpportunity',
	'updateOpportunity',
	'deleteOpportunity',
	'opportunityTypesSchema',
	'getOpportunityTypes',
	'updateOpportunityType',
	'deleteOpportunityType',
	'opportunityStatusesSchema',
	'listOpportunityStatuses',
	'createOpportunityStatus',
	'getOpportunityStatus',
	'updateOpportunityStatus',
	'deleteOpportunityStatus',
	'orderHeadersSchema',
	'listOrderHeaders',
	'createOrderHeader',
	'getOrderHeader',
	'updateOrderHeader',
	'deleteOrderHeader',
	'orderLinesSchema',
	'listOrderLines',
	'createOrderLine',
	'getOrderLine',
	'updateOrderLine',
	'deleteOrderLine',
	'orderStatusesSchema',
	'listOrderStatuses',
	'createOrderStatus',
	'getOrderStatus',
	'updateOrderStatus',
	'deleteOrderStatus',
	'orderTypesSchema',
	'listOrderTypes',
	'createOrderTypes',
	'getOrderTypes',
	'updateOrderTypes',
	'deleteOrderTypes',
	'productsSchema',
	'listProducts',
	'createProduct',
	'getProduct',
	'updateProduct',
	'deleteProduct',
	'bulkCreateProducts',
	'bulkUpdateProducts',
	'bulkDeleteProducts',
	'addPicture',
	'productFamiliesSchema',
	'listProductFamilies',
	'createProductFamily',
	'getProductFamily',
	'updateProductFamily',
	'deleteProductFamily',
	'productUnitsOfMeasureSchema',
	'listProductUnitsOfMeasure',
	'createProductUnitOfMeasure',
	'getProductUnitOfMeasure',
	'updateProductUnitOfMeasure',
	'deleteProductUnitOfMeasure',
	'unitsOfMeasureSchema',
	'listUnitsOfMeasure',
	'createUnitOfMeasure',
	'getUnitOfMeasure',
	'updateUnitOfMeasure',
	'deleteUnitOfMeasure',
	'taxRatesSchema',
	'listTaxRates',
	'createTaxRate',
	'getTaxRate',
	'updateTaxRate',
	'deleteTaxRate',
	'taxProfilesSchema',
	'listTaxProfiles',
	'getTaxProfile',
	'productFamiliesBranchesSchema',
	'listProductFamiliesBranches',
	'createProductFamiliesBranch',
	'getProductFamiliesBranch',
	'updateProductFamiliesBranch',
	'deleteProductFamiliesBranch',
	'productEnvironmentsSchema',
	'listProductEnvironments',
	'createProductEnvironment',
	'getProductEnvironment',
	'updateProductEnvironment',
	'deleteProductEnvironment',
	'productCategoriesSchema',
	'listProductCategories',
	'createProductCategory',
	'getProductCategory',
	'updateProductCategory',
	'deleteProductCategory',
	'productRatesSchema',
	'listProductRates',
	'createProductRate',
	'getProductRate',
	'updateProductRate',
	'deleteProductRate',
	'ratesSchema',
	'listRates',
	'createRate',
	'getRate',
	'updateRate',
	'deleteRate',
	'relatedAccountsSchema',
	'listRelatedAccounts',
	'createRelatedAccount',
	'retrieveRelatedAccount',
	'updateRelatedAccount',
	'deleteRelatedAccount',
	'relatedAccountTypesSchema',
	'listRelatedAccountTypes',
	'createRelatedAccountType',
	'retrieveRelatedAccountType',
	'updateRelatedAccountType',
	'deleteRelatedAccountType',
	'getResources',
	'rolesSchema',
	'listRoles',
	'getRole',
	'listRolesOfUser',
	'addRolesInUser',
	'deleteRolesInUser',
	'listUsersInRole',
	'salesSchema',
	'listSales',
	'createSale',
	'getSale',
	'updateSale',
	'deleteSale',
	'listTimezones',
	'usersSchema',
	'listUsers',
	'createUser',
	'getUser',
	'updateUser',
	'deleteUser',
	'listUserHierarchy',
	'listUsersScores',
	'userTypesSchema',
	'listUserTypes',
	'createUserType',
	'getUserType',
	'updateUserType',
	'deleteUserType',
	'listLists',
	'createList',
	'updateList',
	'deleteList',
	'listValues',
	'createValue',
	'valuesListSchema',
	'getValue',
	'updateValue',
	'deleteValue',
	'listWarningsOfAResource',
	'createWarningForAResourceCopy',
	'updateWarningOfAResource',
	'deleteWarningOfAResource',
] as const;

export const operationTestInputs = {
	accountAddressesSchema: {
		query: {
			page: 0,
		},
	},
	listAccountAddresses: {
		query: {
			page: 0,
		},
	},
	createAccountAddress: {
		body: {},
	},
	getAccountAddress: {
		path: {
			id: 1,
		},
	},
	updateAccountAddress: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteAccountAddress: {
		path: {
			id: 1,
		},
	},
	accountsSchema: {},
	listAccounts: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createAccount: {
		body: {
			branchId: 1,
			name: 'sample',
			salesRepId1: 1,
		},
	},
	getAccount: {
		path: {
			id: 1,
		},
		headers: {
			extraFieldDescription: '0',
		},
	},
	updateAccount: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteAccount: {
		path: {
			id: 1,
		},
	},
	accountTypesSchema: {},
	listAccountTypes: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createAccountType: {
		body: {},
	},
	getAccountType: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateAccountType: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteAccountType: {
		path: {
			id: 1,
		},
	},
	accountSegmentsSchema: {},
	listAccountSegments: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createAccountSegment: {
		body: {},
	},
	getAccountSegment: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateAccountSegment: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteAccountSegment: {
		path: {
			id: 1,
		},
	},
	accountStatusesSchema: {},
	listAccountStatuses: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createAccountStatus: {
		body: {},
	},
	getAccountStatus: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateAccountStatus: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteAccountStatus: {
		path: {
			id: 1,
		},
	},
	activitiesSchema: {},
	listActivities: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createActivity: {
		body: {},
	},
	getActivity: {
		path: {
			id: 1,
		},
		headers: {
			extraFieldDescription: '0',
		},
	},
	updateActivity: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteActivity: {
		path: {
			id: 1,
		},
	},
	activityTypesSchema: {},
	listActivityTypes: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createActivityType: {
		body: {},
	},
	getActivityType: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateActivityType: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteActivityType: {
		path: {
			id: 1,
		},
	},
	listActivityPoints: {
		query: {
			page: 0,
		},
	},
	updateActivityPoints: {
		body: {},
	},
	branchesSchema: {},
	listBranches: {
		query: {
			page: 0,
		},
	},
	getBranch: {
		path: {
			id: 1,
		},
	},
	deleteBranch: {
		path: {
			id: 1,
		},
	},
	bulkCreateResources: {
		path: {
			value: 'sample',
		},
		body: [],
	},
	bulkUpdateResources: {
		path: {
			value: 'sample',
		},
		body: [],
	},
	bulkDeleteResources: {
		path: {
			value: 'sample',
		},
	},
	listCalls: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createCallByUserId: {
		body: {},
	},
	createCallByUserPhoneNumber: {
		body: {},
	},
	getCall: {
		path: {
			id: 1,
		},
	},
	updateCall: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteCall: {
		path: {
			id: 1,
		},
	},
	getResourcesByPhoneNumber: {
		path: {
			value: 'sample',
		},
	},
	listCampaigns: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createCampaign: {
		body: {},
	},
	getCampaign: {
		path: {
			id: 1,
		},
	},
	updateCampaign: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteCampaign: {
		path: {
			id: 1,
		},
	},
	listOpportunityTypes: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createOpportunityType: {
		body: {},
	},
	listCampaignStatuses: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	listCampaignAccounts: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createCampaignAccount: {
		path: {
			id: 1,
			value: 'sample',
		},
		body: {},
	},
	getCampaignAccount: {
		path: {
			id: 1,
			value: 'sample',
		},
	},
	updateCampaignAccount: {
		path: {
			id: 1,
			value: 'sample',
		},
		body: {},
	},
	deleteCampaignAccount: {
		path: {
			id: 1,
			value: 'sample',
		},
	},
	listCampaignQuestions: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createCampaignQuestion: {
		body: [],
	},
	getCampaignQuestion: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateCampaignQuestion: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteCampaignQuestion: {
		path: {
			id: 1,
		},
	},
	listQuestionAnswers: {
		path: {
			value: 'sample',
		},
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createQuestionAnswer: {
		path: {
			value: 'sample',
		},
		body: {},
	},
	getQuestionAnswer: {
		path: {
			value: 'sample',
			id: 1,
		},
	},
	updateQuestionAnswer: {
		path: {
			value: 'sample',
			id: 1,
		},
		body: {},
	},
	deleteQuestionAnswer: {
		path: {
			value: 'sample',
			id: 1,
		},
	},
	listQuestionValues: {
		path: {
			value: 'sample',
		},
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createQuestionValue: {
		path: {
			id: 1,
		},
		body: {},
	},
	getQuestionValue: {
		path: {
			value: 'sample',
			id: 1,
		},
	},
	updateQuestionValue: {
		path: {
			value: 'sample',
			id: 1,
		},
		body: {},
	},
	deleteQuestionValue: {
		path: {
			value: 'sample',
			id: 1,
		},
	},
	contactsSchema: {},
	listContacts: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createContact: {
		body: {
			accountId: 1,
			firstName: 'sample',
			lastName: 'sample',
			salesRepId: 1,
		},
	},
	getContact: {
		path: {
			id: 1,
		},
	},
	updateContact: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteContact: {
		path: {
			id: 1,
		},
	},
	contactTypesSchema: {},
	listContactTypes: {
		query: {
			page: 0,
		},
		headers: {
			extraFieldDescription: '0',
		},
	},
	createContactType: {
		body: {},
	},
	getContactType: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateContactType: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteContactType: {
		path: {
			id: 1,
		},
	},
	countriesSchema: {},
	listCountries: {
		query: {
			page: 0,
		},
	},
	currenciesSchema: {},
	listCurrencies: {
		query: {
			page: 0,
		},
	},
	listDocuments: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	addDocument: {
		body: {},
	},
	listDocumentsOfAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
		},
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	addDocumentToAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
		},
		body: {},
	},
	deletePicture: {
		path: {
			id: 1,
		},
	},
	listFolders: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createFolder: {
		body: {},
	},
	listFoldersOfAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
		},
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createFolderForAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
		},
		body: {},
	},
	emailsSchema: {},
	listEmails: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createEmail: {
		body: {},
	},
	getEmail: {
		path: {
			id: 1,
		},
	},
	entityContactsSchema: {},
	listEntityContacts: {
		query: {
			page: 0,
		},
	},
	entityOwnersSchema: {},
	listEntityOwners: {
		query: {
			page: 0,
		},
	},
	calendarSchema: {},
	listCalendar: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createCalendar: {
		body: {},
	},
	getCalendar: {
		path: {
			id: 1,
		},
		headers: {
			extraFieldDescription: '0',
		},
	},
	updateCalendar: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteCalendar: {
		path: {
			id: 1,
		},
	},
	extraFieldsSchemaByResource: {
		path: {
			value: 'sample',
		},
		query: {
			page: 0,
		},
	},
	listExtraFieldsByResource: {
		path: {
			value: 'sample',
		},
		query: {
			page: 0,
		},
	},
	createExtraFieldForResource: {
		path: {
			value: 'sample',
		},
		body: {},
	},
	listTabs: {
		query: {
			page: 0,
		},
	},
	createTabs: {
		body: {},
	},
	getTabs: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateTabs: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteTabs: {
		path: {
			id: 1,
		},
	},
	getForm: {
		path: {
			id: 1,
		},
	},
	getFormState: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	getFormTemplate: {
		path: {
			id: 1,
		},
	},
	listNews: {
		query: {
			page: 0,
		},
	},
	opportunitiesSchema: {},
	listOpportunities: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createOpportunity: {
		body: {
			branchId: 1,
			reference: 'sample',
			salesProbability: 1,
			salesRepId: 1,
			statusId: 1,
		},
	},
	getOpportunity: {
		path: {
			id: 1,
		},
	},
	updateOpportunity: {
		path: {
			id: 1,
		},
		body: {
			salesProbability: 1,
		},
	},
	deleteOpportunity: {
		path: {
			id: 1,
		},
	},
	opportunityTypesSchema: {},
	getOpportunityTypes: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateOpportunityType: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteOpportunityType: {
		path: {
			id: 1,
		},
	},
	opportunityStatusesSchema: {},
	listOpportunityStatuses: {
		query: {
			page: 0,
		},
	},
	createOpportunityStatus: {
		body: {},
	},
	getOpportunityStatus: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateOpportunityStatus: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteOpportunityStatus: {
		path: {
			id: 1,
		},
	},
	orderHeadersSchema: {
		query: {
			page: 0,
		},
	},
	listOrderHeaders: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createOrderHeader: {
		body: {
			branchId: 1,
			reference: 'sample',
			salesRepId: 1,
		},
	},
	getOrderHeader: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateOrderHeader: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteOrderHeader: {
		path: {
			id: 1,
		},
	},
	orderLinesSchema: {
		query: {
			page: 0,
		},
	},
	listOrderLines: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createOrderLine: {
		body: {
			price: 1,
			productId: 1,
			quantity: 1,
		},
	},
	getOrderLine: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateOrderLine: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteOrderLine: {
		path: {
			id: 1,
		},
	},
	orderStatusesSchema: {
		query: {
			page: 0,
		},
	},
	listOrderStatuses: {
		query: {
			page: 0,
		},
	},
	createOrderStatus: {
		body: {},
	},
	getOrderStatus: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateOrderStatus: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteOrderStatus: {
		path: {
			id: 1,
		},
	},
	orderTypesSchema: {
		query: {
			page: 0,
		},
	},
	listOrderTypes: {
		query: {
			page: 0,
		},
	},
	createOrderTypes: {
		body: {
			descriptionEN: 'sample',
		},
	},
	getOrderTypes: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateOrderTypes: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteOrderTypes: {
		path: {
			id: 1,
		},
	},
	productsSchema: {},
	listProducts: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createProduct: {
		body: {},
	},
	getProduct: {
		path: {
			id: 1,
		},
		headers: {
			extraFieldDescription: '0',
		},
	},
	updateProduct: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProduct: {
		path: {
			id: 1,
		},
	},
	bulkCreateProducts: {
		body: [],
	},
	bulkUpdateProducts: {
		body: [],
	},
	bulkDeleteProducts: {},
	addPicture: {
		path: {
			value: 'sample',
		},
		body: {},
	},
	productFamiliesSchema: {},
	listProductFamilies: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createProductFamily: {
		body: {},
	},
	getProductFamily: {
		path: {
			id: 1,
		},
	},
	updateProductFamily: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProductFamily: {},
	productUnitsOfMeasureSchema: {
		query: {
			page: 0,
		},
	},
	listProductUnitsOfMeasure: {
		query: {
			page: 0,
		},
	},
	createProductUnitOfMeasure: {
		body: {
			idProducto: 1,
			idUnitOfMeasure: 1,
			factor: 1,
		},
	},
	getProductUnitOfMeasure: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateProductUnitOfMeasure: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProductUnitOfMeasure: {
		path: {
			id: 1,
		},
	},
	unitsOfMeasureSchema: {
		query: {
			page: 0,
		},
	},
	listUnitsOfMeasure: {
		query: {
			page: 0,
		},
	},
	createUnitOfMeasure: {
		body: {
			descriptionES: 'sample',
		},
	},
	getUnitOfMeasure: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateUnitOfMeasure: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteUnitOfMeasure: {
		path: {
			id: 1,
		},
	},
	taxRatesSchema: {
		query: {
			page: 0,
		},
	},
	listTaxRates: {
		query: {
			page: 0,
		},
	},
	createTaxRate: {
		body: {
			Descripcion: 'sample',
			percentage: 1,
		},
	},
	getTaxRate: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateTaxRate: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteTaxRate: {
		path: {
			id: 1,
		},
	},
	taxProfilesSchema: {
		query: {
			page: 0,
		},
	},
	listTaxProfiles: {
		query: {
			page: 0,
		},
	},
	getTaxProfile: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	productFamiliesBranchesSchema: {
		query: {
			page: 0,
		},
	},
	listProductFamiliesBranches: {
		query: {
			page: 0,
		},
	},
	createProductFamiliesBranch: {
		body: {
			productFamilyId: 1,
			branchId: 1,
		},
	},
	getProductFamiliesBranch: {
		path: {
			id: 1,
		},
	},
	updateProductFamiliesBranch: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProductFamiliesBranch: {
		path: {
			id: 1,
		},
	},
	productEnvironmentsSchema: {
		query: {
			page: 0,
		},
	},
	listProductEnvironments: {
		query: {
			page: 0,
		},
	},
	createProductEnvironment: {
		body: {},
	},
	getProductEnvironment: {
		path: {
			id: 1,
		},
	},
	updateProductEnvironment: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProductEnvironment: {
		path: {
			id: 1,
		},
	},
	productCategoriesSchema: {},
	listProductCategories: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createProductCategory: {
		body: {},
	},
	getProductCategory: {
		path: {
			id: 1,
		},
	},
	updateProductCategory: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProductCategory: {
		path: {
			id: 1,
		},
	},
	productRatesSchema: {},
	listProductRates: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createProductRate: {
		body: {},
	},
	getProductRate: {
		path: {
			id: 1,
		},
	},
	updateProductRate: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteProductRate: {
		path: {
			id: 1,
		},
	},
	ratesSchema: {},
	listRates: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createRate: {
		body: {},
	},
	getRate: {
		path: {
			id: 1,
		},
	},
	updateRate: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteRate: {
		path: {
			id: 1,
		},
	},
	relatedAccountsSchema: {},
	listRelatedAccounts: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createRelatedAccount: {
		body: {},
	},
	retrieveRelatedAccount: {
		path: {
			id: 1,
		},
	},
	updateRelatedAccount: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteRelatedAccount: {
		path: {
			id: 1,
		},
	},
	relatedAccountTypesSchema: {},
	listRelatedAccountTypes: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createRelatedAccountType: {
		body: {},
	},
	retrieveRelatedAccountType: {
		path: {
			id: 1,
		},
	},
	updateRelatedAccountType: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteRelatedAccountType: {
		path: {
			id: 1,
		},
	},
	getResources: {
		query: {
			page: 0,
		},
	},
	rolesSchema: {},
	listRoles: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	getRole: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	listRolesOfUser: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	addRolesInUser: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteRolesInUser: {
		path: {
			id: 1,
		},
	},
	listUsersInRole: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	salesSchema: {
		headers: {
			count: 1,
		},
	},
	listSales: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createSale: {
		body: {},
	},
	getSale: {
		path: {
			id: 1,
		},
	},
	updateSale: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteSale: {
		path: {
			id: 1,
		},
	},
	listTimezones: {
		query: {
			page: 0,
		},
	},
	usersSchema: {},
	listUsers: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createUser: {
		body: {},
	},
	getUser: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateUser: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteUser: {
		path: {
			id: 1,
		},
	},
	listUserHierarchy: {
		path: {
			id: 1,
		},
	},
	listUsersScores: {
		query: {
			page: 0,
		},
	},
	userTypesSchema: {},
	listUserTypes: {
		query: {
			page: 0,
		},
		headers: {
			count: 1,
		},
	},
	createUserType: {
		body: {},
	},
	getUserType: {
		path: {
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateUserType: {
		path: {
			id: 1,
		},
		body: {},
	},
	deleteUserType: {},
	listLists: {
		query: {
			page: 0,
		},
	},
	createList: {
		body: {},
	},
	updateList: {
		path: {
			value: 'sample',
		},
		body: {},
	},
	deleteList: {
		path: {
			value: 'sample',
		},
	},
	listValues: {
		path: {
			value: 'sample',
		},
		query: {
			page: 0,
		},
	},
	createValue: {
		path: {
			value: 'sample',
		},
		body: {},
	},
	valuesListSchema: {
		path: {
			value: 'sample',
		},
	},
	getValue: {
		path: {
			value: 'sample',
			id: 1,
		},
		query: {
			page: 0,
		},
	},
	updateValue: {
		path: {
			value: 'sample',
			id: 1,
		},
		body: {},
	},
	deleteValue: {
		path: {
			value: 'sample',
			id: 1,
		},
	},
	listWarningsOfAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
		},
		query: {
			page: 0,
		},
	},
	createWarningForAResourceCopy: {
		path: {
			value: 'sample',
			value2: 'sample',
		},
		body: {},
	},
	updateWarningOfAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
			value3: 'sample',
		},
		body: {},
	},
	deleteWarningOfAResource: {
		path: {
			value: 'sample',
			value2: 'sample',
			value3: 'sample',
		},
	},
} as const satisfies {
	[K in keyof typeof operationDefinitions]: z.infer<
		(typeof operationDefinitions)[K]['input']
	>;
};

export const operationTestOutputs = {
	accountAddressesSchema: {},
	listAccountAddresses: [],
	createAccountAddress: {},
	getAccountAddress: {},
	updateAccountAddress: {},
	deleteAccountAddress: {},
	accountsSchema: {},
	listAccounts: [],
	createAccount: {},
	getAccount: {},
	updateAccount: {},
	deleteAccount: {},
	accountTypesSchema: {},
	listAccountTypes: [],
	createAccountType: {},
	getAccountType: {},
	updateAccountType: {},
	deleteAccountType: {},
	accountSegmentsSchema: {},
	listAccountSegments: [],
	createAccountSegment: {},
	getAccountSegment: {},
	updateAccountSegment: {},
	deleteAccountSegment: {},
	accountStatusesSchema: {},
	listAccountStatuses: [],
	createAccountStatus: {},
	getAccountStatus: {},
	updateAccountStatus: {},
	deleteAccountStatus: {},
	activitiesSchema: {},
	listActivities: [],
	createActivity: {},
	getActivity: {},
	updateActivity: {},
	deleteActivity: {},
	activityTypesSchema: {},
	listActivityTypes: [],
	createActivityType: {},
	getActivityType: {},
	updateActivityType: {},
	deleteActivityType: {},
	listActivityPoints: {},
	updateActivityPoints: {},
	branchesSchema: {},
	listBranches: [],
	getBranch: {},
	deleteBranch: {},
	bulkCreateResources: [],
	bulkUpdateResources: [],
	bulkDeleteResources: [],
	listCalls: [],
	createCallByUserId: [],
	createCallByUserPhoneNumber: {},
	getCall: {},
	updateCall: {},
	deleteCall: {},
	getResourcesByPhoneNumber: {},
	listCampaigns: [],
	createCampaign: {},
	getCampaign: {},
	updateCampaign: {},
	deleteCampaign: {},
	listOpportunityTypes: 'sample',
	createOpportunityType: {},
	listCampaignStatuses: [],
	listCampaignAccounts: {},
	createCampaignAccount: {},
	getCampaignAccount: {},
	updateCampaignAccount: {},
	deleteCampaignAccount: {},
	listCampaignQuestions: [],
	createCampaignQuestion: [],
	getCampaignQuestion: {},
	updateCampaignQuestion: {},
	deleteCampaignQuestion: {},
	listQuestionAnswers: [],
	createQuestionAnswer: {},
	getQuestionAnswer: {},
	updateQuestionAnswer: {},
	deleteQuestionAnswer: {},
	listQuestionValues: [],
	createQuestionValue: {},
	getQuestionValue: {},
	updateQuestionValue: {},
	deleteQuestionValue: {},
	contactsSchema: {},
	listContacts: [],
	createContact: {},
	getContact: {},
	updateContact: {},
	deleteContact: {},
	contactTypesSchema: {},
	listContactTypes: [],
	createContactType: {},
	getContactType: {},
	updateContactType: {},
	deleteContactType: {},
	countriesSchema: {},
	listCountries: [],
	currenciesSchema: {},
	listCurrencies: [],
	listDocuments: [],
	addDocument: {},
	listDocumentsOfAResource: [],
	addDocumentToAResource: {},
	deletePicture: {},
	listFolders: [],
	createFolder: {},
	listFoldersOfAResource: [],
	createFolderForAResource: {},
	emailsSchema: {},
	listEmails: [],
	createEmail: [],
	getEmail: {},
	entityContactsSchema: {},
	listEntityContacts: {},
	entityOwnersSchema: {},
	listEntityOwners: [],
	calendarSchema: {},
	listCalendar: [],
	createCalendar: {},
	getCalendar: {},
	updateCalendar: {},
	deleteCalendar: {},
	extraFieldsSchemaByResource: {},
	listExtraFieldsByResource: [],
	createExtraFieldForResource: {},
	listTabs: [],
	createTabs: {},
	getTabs: 'sample',
	updateTabs: {},
	deleteTabs: {},
	getForm: {},
	getFormState: {},
	getFormTemplate: {},
	listNews: [],
	opportunitiesSchema: {},
	listOpportunities: [],
	createOpportunity: {},
	getOpportunity: {},
	updateOpportunity: {},
	deleteOpportunity: {},
	opportunityTypesSchema: {},
	getOpportunityTypes: {},
	updateOpportunityType: {},
	deleteOpportunityType: {},
	opportunityStatusesSchema: {},
	listOpportunityStatuses: [],
	createOpportunityStatus: {},
	getOpportunityStatus: {},
	updateOpportunityStatus: {},
	deleteOpportunityStatus: {},
	orderHeadersSchema: {},
	listOrderHeaders: [],
	createOrderHeader: {},
	getOrderHeader: {},
	updateOrderHeader: {},
	deleteOrderHeader: {},
	orderLinesSchema: {},
	listOrderLines: [],
	createOrderLine: {},
	getOrderLine: {},
	updateOrderLine: {},
	deleteOrderLine: {},
	orderStatusesSchema: {},
	listOrderStatuses: [],
	createOrderStatus: {},
	getOrderStatus: {},
	updateOrderStatus: {},
	deleteOrderStatus: {},
	orderTypesSchema: {},
	listOrderTypes: [],
	createOrderTypes: {},
	getOrderTypes: {},
	updateOrderTypes: {},
	deleteOrderTypes: {},
	productsSchema: {},
	listProducts: [],
	createProduct: {},
	getProduct: {},
	updateProduct: {},
	deleteProduct: {},
	bulkCreateProducts: [],
	bulkUpdateProducts: [],
	bulkDeleteProducts: [],
	addPicture: {},
	productFamiliesSchema: {},
	listProductFamilies: [],
	createProductFamily: {},
	getProductFamily: {},
	updateProductFamily: {},
	deleteProductFamily: {},
	productUnitsOfMeasureSchema: {},
	listProductUnitsOfMeasure: [],
	createProductUnitOfMeasure: {},
	getProductUnitOfMeasure: {},
	updateProductUnitOfMeasure: {},
	deleteProductUnitOfMeasure: {},
	unitsOfMeasureSchema: {},
	listUnitsOfMeasure: [],
	createUnitOfMeasure: {},
	getUnitOfMeasure: {},
	updateUnitOfMeasure: {},
	deleteUnitOfMeasure: {},
	taxRatesSchema: {},
	listTaxRates: [],
	createTaxRate: {},
	getTaxRate: {},
	updateTaxRate: {},
	deleteTaxRate: {},
	taxProfilesSchema: {},
	listTaxProfiles: [],
	getTaxProfile: {},
	productFamiliesBranchesSchema: {},
	listProductFamiliesBranches: [],
	createProductFamiliesBranch: {},
	getProductFamiliesBranch: {},
	updateProductFamiliesBranch: {},
	deleteProductFamiliesBranch: {},
	productEnvironmentsSchema: {},
	listProductEnvironments: [],
	createProductEnvironment: {},
	getProductEnvironment: {},
	updateProductEnvironment: {},
	deleteProductEnvironment: {},
	productCategoriesSchema: {},
	listProductCategories: [],
	createProductCategory: {},
	getProductCategory: {},
	updateProductCategory: {},
	deleteProductCategory: {},
	productRatesSchema: {},
	listProductRates: {},
	createProductRate: {},
	getProductRate: {},
	updateProductRate: {},
	deleteProductRate: {},
	ratesSchema: {},
	listRates: [],
	createRate: {},
	getRate: {},
	updateRate: {},
	deleteRate: {},
	relatedAccountsSchema: {},
	listRelatedAccounts: [],
	createRelatedAccount: {},
	retrieveRelatedAccount: {},
	updateRelatedAccount: {},
	deleteRelatedAccount: {},
	relatedAccountTypesSchema: {},
	listRelatedAccountTypes: [],
	createRelatedAccountType: {},
	retrieveRelatedAccountType: {},
	updateRelatedAccountType: {},
	deleteRelatedAccountType: {},
	getResources: [],
	rolesSchema: {},
	listRoles: [],
	getRole: {},
	listRolesOfUser: [],
	addRolesInUser: [],
	deleteRolesInUser: [],
	listUsersInRole: [],
	salesSchema: {},
	listSales: [],
	createSale: {},
	getSale: {},
	updateSale: {},
	deleteSale: {},
	listTimezones: [],
	usersSchema: {},
	listUsers: [],
	createUser: {},
	getUser: {},
	updateUser: {},
	deleteUser: {},
	listUserHierarchy: [],
	listUsersScores: [],
	userTypesSchema: {},
	listUserTypes: [],
	createUserType: {},
	getUserType: {},
	updateUserType: {},
	deleteUserType: {},
	listLists: [],
	createList: {},
	updateList: {},
	deleteList: {},
	listValues: [],
	createValue: {},
	valuesListSchema: {},
	getValue: {},
	updateValue: {},
	deleteValue: {},
	listWarningsOfAResource: [],
	createWarningForAResourceCopy: {},
	updateWarningOfAResource: {},
	deleteWarningOfAResource: {},
} as const satisfies {
	[K in keyof typeof operationDefinitions]: z.infer<
		(typeof operationDefinitions)[K]['output']
	>;
};

// Non-PII response fixtures exercise nested records and nullable fields documented by the provider.
export const representativeResponseFixtures = {
	listAccountAddresses: [
		{
			accountId: { id: 42, value: 'Sample account' },
			address1: '1 Main Street',
			address2: null,
			city: 'Sample City',
			countryId: { id: 1, value: 'US' },
			dateCreated: '2024-01-02T03:04:05Z',
			dateDeleted: null,
			dateUpdated: null,
			deleted: false,
			description: null,
			id: 7,
			postcode: '10000',
			region: 'CA',
			salesRepIdCreated: 9,
			salesRepIdDeleted: null,
			salesRepIdUpdated: null,
		},
	],
	getAccount: {
		address1: '1 Main Street',
		address2: null,
		branchId: { id: 3, value: 'Headquarter' },
		city: 'Sample City',
		comment: null,
		countryId: { id: 1, value: 'US' },
		dateCreated: '2024-01-02T03:04:05Z',
		dateDeleted: null,
		dateGeocoded: null,
		dateUpdated: '2024-01-03T03:04:05Z',
		deleted: false,
		geocoded: false,
		id: 42,
		latitude: 37.5,
		longitude: -122.3,
		name: 'Sample account',
		permissionLevel: 1,
		readOnly: false,
		salesRepId1: { id: 9, value: 'Sales representative' },
		salesRepIdCreated: 9,
		salesRepIdUpdated: 9,
		statusId: { id: 5, value: 'Customer' },
		typeId: { id: 2, value: 'Distributor' },
	},
	getActivity: {
		accountId: { id: 42, value: 'Sample account' },
		checkin: false,
		checkinTypeId: 1,
		checkoutDate: null,
		comment: 'Discussed next steps',
		contactId: { id: 12, value: 'Sample contact' },
		date: '2024-01-02T03:04:05Z',
		dateCreated: '2024-01-02T03:04:05Z',
		dateDeleted: null,
		dateUpdated: '2024-01-03T03:04:05Z',
		deleted: false,
		extId: null,
		geocoded: true,
		geocodingAccuracy: 1,
		id: 8,
		latitude: 37.5,
		longitude: -122.3,
		opportunityId: { id: 2, value: 'Sample opportunity' },
		permissionLevel: 1,
		readOnly: false,
		salesRepId: { id: 9, value: 'Sales representative' },
		salesRepIdCreated: 9,
		salesRepIdDeleted: null,
		salesRepIdUpdated: 9,
		typeId: { id: 4, value: 'Visit' },
	},
} as const satisfies Partial<{
	[K in keyof typeof operationDefinitions]: z.infer<
		(typeof operationDefinitions)[K]['output']
	>;
}>;
