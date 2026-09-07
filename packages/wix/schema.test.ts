import type { z } from 'zod';
import { wixRoutes } from './endpoints/routes';
import {
	WixEndpointInputSchemas,
	WixEndpointOutputSchemas,
} from './endpoints/types';
import { WixSchema } from './schema';
import {
	WixBookingCategory,
	WixBrand,
	WixCampaign,
	WixContact,
	WixCoupon,
	WixCurrency,
	WixCustomField,
	WixExtendedBooking,
	WixForm,
	WixFormSubmission,
	WixGroupRequest,
	WixInventoryItem,
	WixLocation,
	WixManualTaxMapping,
	WixModerationRule,
	WixOrder,
	WixProduct,
	WixSiteFolder,
	WixTaxGroup,
} from './schema/database';

describe('Wix schema', () => {
	it('declares a semver version', () => {
		expect(WixSchema.version).toBeDefined();
		expect(WixSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WixSchema.entities).toBe('object');
		expect(WixSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WixSchema.entities))).toBe(true);
		for (const entity of Object.values(WixSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Wix input schemas accept valid input', () => {
	it('accepts a contacts query with pagination', () => {
		const parsed = WixEndpointInputSchemas.queryContacts.parse({
			siteId: 'site-1',
			limit: 50,
			offset: 0,
			fieldsets: ['BASIC'],
		});
		expect(parsed).toBeDefined();
		expect(parsed.limit).toBe(50);
	});

	it('accepts label operations with required fields', () => {
		const add = WixEndpointInputSchemas.addContactLabels.parse({
			contactId: 'contact-1',
			labelKeys: ['contacts.customers'],
		});
		expect(add.contactId).toBe('contact-1');

		const unlabel = WixEndpointInputSchemas.unlabelContact.parse({
			contactId: 'contact-1',
			labelKeys: ['contacts.customers'],
		});
		expect(unlabel.labelKeys).toEqual(['contacts.customers']);
	});

	it('accepts bulk delete inputs with id lists', () => {
		const parsed = WixEndpointInputSchemas.bulkDeleteProducts.parse({
			ids: ['product-1', 'product-2'],
		});
		expect(parsed.ids).toHaveLength(2);
	});

	it('validates bulk order inputs against the typed order contract', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkUpdateOrders.parse({
				orders: [{ order: { id: 'o1', status: 5 } }],
			}),
		).toThrow();
		expect(
			WixEndpointInputSchemas.bulkUpdateOrders.parse({
				orders: [{ order: { id: 'o1', status: 'APPROVED' } }],
			}).orders,
		).toHaveLength(1);
		// Documented field removal: null status must reach Wix.
		expect(
			WixEndpointInputSchemas.bulkUpdateOrders.parse({
				orders: [{ order: { id: 'o1', status: null } }],
			}).orders,
		).toHaveLength(1);
		// Read contract stays non-nullable: responses never carry null status.
		expect(() =>
			WixEndpointOutputSchemas.queryEcomOrders.parse({
				orders: [{ id: 'o1', status: null }],
			}),
		).toThrow();
	});

	it('accepts member registration input', () => {
		const parsed = WixEndpointInputSchemas.registerMemberV2.parse({
			loginId: { email: 'member@example.com' },
			password: 'secret',
		});
		expect(parsed.loginId.email).toBe('member@example.com');
	});

	it('accepts every route with an empty object only when nothing is required', () => {
		let optionalOnly = 0;
		for (const route of wixRoutes) {
			const schema =
				WixEndpointInputSchemas[
					route.key as keyof typeof WixEndpointInputSchemas
				];
			const result = schema.safeParse({});
			if (result.success) optionalOnly += 1;
		}
		// Three form queries require a namespace filter, so fewer routes
		// accept an empty object than before.
		expect(optionalOnly).toBeGreaterThanOrEqual(45);
	});
});

describe('Wix input schemas reject invalid input', () => {
	it('rejects label operations without label keys', () => {
		expect(() =>
			WixEndpointInputSchemas.addContactLabels.parse({
				contactId: 'contact-1',
				labelKeys: [],
			}),
		).toThrow();
	});

	it('rejects bulk deletes without ids', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteProducts.parse({}),
		).toThrow();
	});

	it('rejects member registration without credentials', () => {
		expect(() =>
			WixEndpointInputSchemas.registerMemberV2.parse({
				loginId: { email: 'member@example.com' },
			}),
		).toThrow();
	});

	it('rejects by-filter deletes without a filter', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteRsvpsByFilter.parse({}),
		).toThrow();
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteRsvpsByFilter.parse({ filter: {} }),
		).toThrow();
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteBenefitItemsByFilter.parse({}),
		).toThrow();
		expect(() =>
			WixEndpointInputSchemas.bulkDeleteBenefitItemsByFilter.parse({
				filter: {},
			}),
		).toThrow();
	});

	it('rejects limits above the Wix maximum', () => {
		expect(() =>
			WixEndpointInputSchemas.queryContacts.parse({ limit: 5000 }),
		).toThrow();
	});

	it('rejects namespaced form queries without a filter', () => {
		for (const key of [
			'queryDeletedForms',
			'queryFormSubmissionsByNamespace',
			'queryFormsFormSubmissions',
		] as const) {
			expect(() => WixEndpointInputSchemas[key].parse({})).toThrow();
			expect(
				WixEndpointInputSchemas[key].parse({
					filter: { namespace: { $eq: 'wix-forms' } },
				}),
			).toBeDefined();
		}
	});
});

describe('Wix query filter grammar', () => {
	it('accepts operator-object filters', () => {
		const parsed = WixEndpointInputSchemas.queryContacts.parse({
			filter: { name: { $eq: 'Ada' } },
		});
		expect(parsed).toBeDefined();
	});

	it('accepts logical operators with filter arrays', () => {
		const parsed = WixEndpointInputSchemas.queryContacts.parse({
			filter: {
				$or: [{ name: { $eq: 'Ada' } }, { email: { $ne: 'x@example.com' } }],
			},
		});
		expect(parsed).toBeDefined();
	});

	it('accepts an empty filter', () => {
		expect(
			WixEndpointInputSchemas.queryContacts.parse({ filter: {} }),
		).toBeDefined();
	});

	it('accepts Wix scalar equality shorthand for a field', () => {
		// The Wix API Query Language documents `{"field": "value"}` as the
		// equality shorthand for `{"field": {"$eq": "value"}}`.
		expect(
			WixEndpointInputSchemas.queryContacts.parse({
				filter: { name: 'Ada' },
			}),
		).toBeDefined();
		expect(
			WixEndpointInputSchemas.queryContacts.parse({
				filter: { age: 30 },
			}),
		).toBeDefined();
	});

	it('rejects by-filter updates with malformed filters', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkUpdateProductsByFilter.parse({
				filter: { visible: () => 'not JSON' },
				update: { visible: false },
			}),
		).toThrow();
	});

	it('accepts documented Wix filter operators with shape-valid operands', () => {
		const accepted = [
			{ status: { $eq: 'DONE' } },
			{ amount: { $gt: 10 } },
			{ tags: { $hasSome: ['a', 'b'] } },
			{ name: { $startsWith: 'Ad' } },
			{ slug: { $urlized: 'ada-lovelace' } },
			{ archived: { $exists: true } },
			{ $or: [{ status: 'DONE' }, { status: { $ne: 'VOID' } }] },
			{ $not: { status: 'VOID' } },
		];
		for (const filter of accepted) {
			expect(
				WixEndpointInputSchemas.queryContacts.parse({ filter }),
			).toBeDefined();
		}
	});

	it('rejects JSON-valid but grammatically malformed Wix filters', () => {
		const rejected = [
			{ status: { $not: 5 } }, // $not is logical, not a comparison operand
			{ status: { $sw: 'A' } }, // unknown operator
			{ tags: { $in: [] } }, // $in requires a non-empty array
			{ tags: { $in: 'a' } }, // $in requires an array
			{ name: { $startsWith: 5 } }, // $startsWith requires a string
			{ archived: { $exists: 'yes' } }, // $exists requires a boolean
			{ $and: [] }, // logical operators require a non-empty array
			{ $and: ['DONE'] }, // logical operands must be nested filter objects
			{ $or: ['PUBLISHED'] }, // scalar logical operand
			{ $not: 5 }, // $not requires a nested filter
			{ slug: { $urlized: ['ada-lovelace'] } }, // $urlized takes a scalar string
			{ $wibble: { $eq: 1 } }, // unknown logical key
		];
		for (const filter of rejected) {
			expect(() =>
				WixEndpointInputSchemas.queryContacts.parse({ filter }),
			).toThrow();
		}
	});

	it('accepts deeply nested JSON patch and filter payloads', () => {
		const parsed = WixEndpointInputSchemas.bulkUpdateProductsByFilter.parse({
			filter: { visible: { $eq: true } },
			update: { product: { variants: [1, 'x', { sku: null }] } },
		});
		expect(parsed).toBeDefined();
	});

	it('rejects non-JSON values in patch payloads', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkUpdateProductsByFilter.parse({
				filter: { visible: { $eq: true } },
				update: { visible: undefined },
			}),
		).toThrow();
		expect(() =>
			WixEndpointInputSchemas.bulkUpdateProductsByFilter.parse({
				filter: { visible: { $eq: true } },
				update: { visible: () => 'nope' },
			}),
		).toThrow();
	});

	it('rejects string field masks', () => {
		expect(() =>
			WixEndpointInputSchemas.bulkUpdateContacts.parse({
				fieldMask: 'name.first',
			}),
		).toThrow();
		expect(
			WixEndpointInputSchemas.bulkUpdateContacts.parse({
				fieldMask: { paths: ['name.first'] },
			}),
		).toBeDefined();
	});
});

describe('Wix output schemas', () => {
	it('parses representative query responses', () => {
		const contacts = WixEndpointOutputSchemas.queryContacts.parse({
			contacts: [{ id: 'contact-1' }],
			pagingMetadata: { count: 1, offset: 0, total: 1 },
		});
		expect(contacts.contacts).toHaveLength(1);

		const orders = WixEndpointOutputSchemas.queryEcomOrders.parse({
			orders: [],
			pagingMetadata: { count: 0, total: 0 },
		}) as { pagingMetadata?: { total?: number } };
		expect(orders.pagingMetadata?.total).toBe(0);
	});

	it('infers query response item fields as arrays at the type level', () => {
		type QueryContactsOutput = z.infer<
			typeof WixEndpointOutputSchemas.queryContacts
		>;
		type ContactsIsArray = NonNullable<
			QueryContactsOutput['contacts']
		> extends unknown[]
			? true
			: false;
		const typeCheck: ContactsIsArray = true;
		expect(typeCheck).toBe(true);
	});

	it('rejects mistyped resource payloads in query responses', () => {
		expect(() =>
			WixEndpointOutputSchemas.queryContacts.parse({
				contacts: [{ id: 123 }],
			}),
		).toThrow();
		// Live 2026-09-08: contacts v4 returns numeric `revision`,
		// so it must be accepted and normalized, not rejected.
		const parsedLive = WixEndpointOutputSchemas.queryContacts.parse({
			contacts: [{ id: 'c1', revision: 3 }],
		}) as { contacts?: Array<{ revision?: unknown }> };
		expect(parsedLive.contacts?.[0]?.revision).toBe('3');
	});

	it('rejects mistyped bulk action results', () => {
		expect(() =>
			WixEndpointOutputSchemas.bulkDeleteProducts.parse({
				results: [{ id: 42 }],
				bulkActionMetadata: { totalSuccesses: 0, totalFailures: 0 },
			}),
		).toThrow();
	});

	it('rejects mistyped inventory and coupon payloads in query responses', () => {
		expect(() =>
			WixEndpointOutputSchemas.queryInventoryItems.parse({
				inventoryItems: [{ id: 'inv-1', quantity: 'ten' }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryInventoryItems.parse({
				inventoryItems: [{ id: 'inv-1', trackQuantity: 'yes' }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryCoupons.parse({
				coupons: [{ id: 'c1', specification: { code: 123 } }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryCoupons.parse({
				coupons: [{ id: 'c1', specification: { active: 'yes' } }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryCoupons.parse({
				coupons: [{ id: 'c1', expired: 'never' }],
			}),
		).toThrow();
	});

	it('parses bulk action responses', () => {
		const parsed = WixEndpointOutputSchemas.bulkDeleteProducts.parse({
			results: [],
			bulkActionMetadata: { totalSuccesses: 2, totalFailures: 0 },
		});
		expect(parsed.bulkActionMetadata?.totalSuccesses).toBe(2);
	});
});

describe('Wix database entities', () => {
	it('accepts documented contact, product, and order shapes', () => {
		expect(
			WixContact.safeParse({
				id: 'contact-1',
				revision: '3',
				createdDate: '2026-01-01T00:00:00.000Z',
			}).success,
		).toBe(true);
		expect(
			WixProduct.safeParse({ id: 'product-1', name: 'Shirt', slug: 'shirt' })
				.success,
		).toBe(true);
		expect(
			WixOrder.safeParse({ id: 'order-1', status: 'APPROVED' }).success,
		).toBe(true);
	});

	it('rejects mistyped entity fields', () => {
		expect(WixContact.safeParse({ id: 123 }).success).toBe(false);
		// Numeric contact revision is live-valid (normalized to string).
		expect(WixContact.safeParse({ revision: 3 }).success).toBe(true);
		expect(WixProduct.safeParse({ revision: 42 }).success).toBe(false);
		expect(WixProduct.safeParse({ visible: 'yes' }).success).toBe(false);
		expect(WixOrder.safeParse({ status: 7 }).success).toBe(false);
		expect(WixInventoryItem.safeParse({ quantity: 'ten' }).success).toBe(false);
		expect(WixInventoryItem.safeParse({ trackQuantity: 1 }).success).toBe(
			false,
		);
		expect(WixCoupon.safeParse({ specification: { code: 123 } }).success).toBe(
			false,
		);
		expect(
			WixCoupon.safeParse({ specification: { active: 'yes' } }).success,
		).toBe(false);
		expect(WixCoupon.safeParse({ expired: 'never' }).success).toBe(false);
		expect(WixBookingCategory.safeParse({ name: 123 }).success).toBe(false);
		expect(WixSiteFolder.safeParse({ siteCount: 'many' }).success).toBe(false);
		expect(WixCampaign.safeParse({ title: 123 }).success).toBe(false);
		expect(WixForm.safeParse({ namespace: 123 }).success).toBe(false);
		expect(WixFormSubmission.safeParse({ status: 123 }).success).toBe(false);
		expect(WixLocation.safeParse({ timeZone: 123 }).success).toBe(false);
		expect(WixModerationRule.safeParse({ enabled: 'yes' }).success).toBe(false);
		expect(WixTaxGroup.safeParse({ name: 123 }).success).toBe(false);
		expect(
			WixExtendedBooking.safeParse({ booking: { status: 123 } }).success,
		).toBe(false);
		expect(WixManualTaxMapping.safeParse({ taxRate: 5 }).success).toBe(false);
		expect(WixCustomField.safeParse({ name: 123 }).success).toBe(false);
		expect(WixGroupRequest.safeParse({ status: 123 }).success).toBe(false);
		expect(WixCurrency.safeParse({ code: 123 }).success).toBe(false);
		expect(WixBrand.safeParse({ name: 123 }).success).toBe(false);
	});

	it('accepts documented inventory and coupon shapes', () => {
		expect(
			WixInventoryItem.safeParse({
				id: 'inv-1',
				variantId: 'v-1',
				productId: 'p-1',
				trackQuantity: true,
				quantity: 5,
				availabilityStatus: 'IN_STOCK',
			}).success,
		).toBe(true);
		expect(
			WixCoupon.safeParse({
				id: 'c1',
				expired: false,
				specification: { code: 'SAVE10', name: 'Save 10', active: true },
			}).success,
		).toBe(true);
		expect(
			WixBookingCategory.safeParse({
				id: 'cat-1',
				name: 'Hair Services',
				revision: '2',
			}).success,
		).toBe(true);
	});

	it('rejects mistyped booking-category payloads in query responses', () => {
		expect(() =>
			WixEndpointOutputSchemas.queryBookingsCategories.parse({
				categories: [{ id: 'cat-1', name: 123 }],
			}),
		).toThrow();
	});

	it('rejects mistyped site-folder payloads in query responses', () => {
		expect(() =>
			WixEndpointOutputSchemas.querySiteFolders.parse({
				folders: [{ id: 'f1', siteCount: 'many' }],
			}),
		).toThrow();
		expect(
			WixSiteFolder.safeParse({
				id: 'f1',
				name: 'Clients',
				siteCount: 3,
			}).success,
		).toBe(true);
	});

	it('rejects mistyped campaign payloads in query responses', () => {
		expect(() =>
			WixEndpointOutputSchemas.listEmailCampaigns.parse({
				campaigns: [{ campaignId: 'c1', title: 123 }],
			}),
		).toThrow();
		expect(
			WixCampaign.safeParse({
				campaignId: 'c1',
				title: 'Launch',
				status: 'ACTIVE',
			}).success,
		).toBe(true);
	});

	it('rejects mistyped form, submission, and location payloads', () => {
		expect(() =>
			WixEndpointOutputSchemas.queryDeletedForms.parse({
				forms: [{ id: 'f1', namespace: 123 }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryFormSubmissionsByNamespace.parse({
				submissions: [{ id: 's1', status: 123 }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryLocations.parse({
				locations: [{ id: 'l1', timeZone: 123 }],
			}),
		).toThrow();
		expect(
			WixForm.safeParse({ id: 'f1', namespace: 'wix.form', name: 'N' }).success,
		).toBe(true);
		expect(
			WixFormSubmission.safeParse({ id: 's1', status: 'CONFIRMED' }).success,
		).toBe(true);
		expect(WixLocation.safeParse({ id: 'l1', status: 'ACTIVE' }).success).toBe(
			true,
		);
		expect(
			WixModerationRule.safeParse({
				id: 'r1',
				namespace: 'comments',
				enabled: true,
			}).success,
		).toBe(true);
	});

	it('rejects mistyped moderation-rule payloads', () => {
		expect(() =>
			WixEndpointOutputSchemas.queryModerationRules.parse({
				rules: [{ id: 'r1', enabled: 'yes' }],
			}),
		).toThrow();
	});

	it('accepts and rejects tax-group and extended-booking payloads', () => {
		expect(WixTaxGroup.safeParse({ id: 'tg1', name: 'VAT' }).success).toBe(
			true,
		);
		expect(() =>
			WixEndpointOutputSchemas.queryTaxGroups.parse({
				taxGroups: [{ id: 'tg1', name: 123 }],
			}),
		).toThrow();
		expect(
			WixExtendedBooking.safeParse({
				booking: { id: 'b1', status: 'CONFIRMED' },
			}).success,
		).toBe(true);
		expect(() =>
			WixEndpointOutputSchemas.queryExtendedBookings.parse({
				extendedBookings: [{ booking: { id: 'b1', status: 123 } }],
			}),
		).toThrow();
	});

	it('accepts and rejects manual-tax-mapping payloads', () => {
		expect(
			WixManualTaxMapping.safeParse({
				id: 'm1',
				taxGroupId: 'tg1',
				taxRate: '0.05',
			}).success,
		).toBe(true);
		expect(() =>
			WixEndpointOutputSchemas.queryManualTaxMappings.parse({
				manualTaxMappings: [{ id: 'm1', taxRate: 5 }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.listManualTaxMappings.parse({
				manualTaxMappings: [{ id: 'm1', taxGroupId: 123 }],
			}),
		).toThrow();
	});

	it('accepts correct keys and rejects mistyped custom-field, memberIds, group-request payloads', () => {
		expect(
			WixCustomField.safeParse({ id: 'cf1', name: 'Nickname', key: 'nick' })
				.success,
		).toBe(true);
		expect(() =>
			WixEndpointOutputSchemas.listMembersCustomFields.parse({
				fields: [{ id: 'cf1', name: 123 }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.listMemberFollowing.parse({
				memberIds: ['m1', 123],
			}),
		).toThrow();
		expect(
			WixEndpointOutputSchemas.listMemberFollowing.parse({
				memberIds: ['m1', 'm2'],
			}),
		).toBeDefined();
		expect(
			WixGroupRequest.safeParse({ id: 'gr1', status: 'PENDING' }).success,
		).toBe(true);
		expect(WixCurrency.safeParse({ code: 'USD' }).success).toBe(true);
		expect(WixBrand.safeParse({ id: 'b1', name: 'Nike' }).success).toBe(true);
		expect(() =>
			WixEndpointOutputSchemas.listCurrencies.parse({
				currencies: [{ code: 123 }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.bulkGetOrCreateBrands.parse({
				brands: [{ id: 'b1', name: 123 }],
			}),
		).toThrow();
		expect(() =>
			WixEndpointOutputSchemas.queryGroupRequests.parse({
				groupRequests: [{ id: 'gr1', status: 123 }],
			}),
		).toThrow();
	});
});
