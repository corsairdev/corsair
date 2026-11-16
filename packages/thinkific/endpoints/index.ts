import * as Bundles from './bundles';
import * as Categories from './categories';
import * as CategoryMemberships from './category-memberships';
import * as Chapters from './chapters';
import * as Contents from './contents';
import * as Coupons from './coupons';
import * as CourseReviews from './course-reviews';
import * as Courses from './courses';
import * as CustomProfileFields from './custom-profile-fields';
import * as Enrollments from './enrollments';
import * as ExternalOrders from './external-orders';
import * as GroupAnalysts from './group-analysts';
import * as GroupUsers from './group-users';
import * as Groups from './groups';
import * as Instructors from './instructors';
import * as Orders from './orders';
import * as ProductPublishRequests from './product-publish-requests';
import * as Products from './products';
import * as Promotions from './promotions';
import {
	ThinkificOperationInputSchemas,
	ThinkificOperationOutputSchemas,
} from './schemas';
import * as Users from './users';

export const thinkificEndpointsNested = {
	bundles: {
		get: Bundles.get,
		listCourses: Bundles.listCourses,
		listEnrollments: Bundles.listEnrollments,
		createEnrollment: Bundles.createEnrollment,
		updateEnrollments: Bundles.updateEnrollments,
	},
	chapters: {
		get: Chapters.get,
		listContents: Chapters.listContents,
	},
	categories: {
		list: Categories.list,
		create: Categories.create,
		get: Categories.get,
		update: Categories.update,
		remove: Categories.remove,
		listProducts: Categories.listProducts,
	},
	categoryMemberships: {
		addProducts: CategoryMemberships.addProducts,
		removeProducts: CategoryMemberships.removeProducts,
	},
	coupons: {
		list: Coupons.list,
		create: Coupons.create,
		bulkCreate: Coupons.bulkCreate,
		get: Coupons.get,
		update: Coupons.update,
		remove: Coupons.remove,
	},
	contents: {
		get: Contents.get,
	},
	courses: {
		list: Courses.list,
		get: Courses.get,
		listChapters: Courses.listChapters,
	},
	customProfileFields: {
		list: CustomProfileFields.list,
	},
	enrollments: {
		list: Enrollments.list,
		create: Enrollments.create,
		get: Enrollments.get,
		update: Enrollments.update,
	},
	externalOrders: {
		create: ExternalOrders.create,
		refund: ExternalOrders.refund,
		purchase: ExternalOrders.purchase,
	},
	groups: {
		list: Groups.list,
		create: Groups.create,
		get: Groups.get,
		remove: Groups.remove,
		listAnalysts: Groups.listAnalysts,
		assignAnalysts: Groups.assignAnalysts,
		removeAnalyst: Groups.removeAnalyst,
	},
	groupAnalysts: {
		addGroup: GroupAnalysts.addGroup,
		removeGroup: GroupAnalysts.removeGroup,
	},
	instructors: {
		list: Instructors.list,
		create: Instructors.create,
		get: Instructors.get,
		update: Instructors.update,
		remove: Instructors.remove,
	},
	orders: {
		list: Orders.list,
		get: Orders.get,
	},
	groupUsers: {
		addUsers: GroupUsers.addUsers,
	},
	productPublishRequests: {
		list: ProductPublishRequests.list,
		get: ProductPublishRequests.get,
		approve: ProductPublishRequests.approve,
		deny: ProductPublishRequests.deny,
	},
	products: {
		list: Products.list,
		get: Products.get,
		listRelated: Products.listRelated,
	},
	promotions: {
		list: Promotions.list,
		create: Promotions.create,
		get: Promotions.get,
		update: Promotions.update,
		remove: Promotions.remove,
		getByCoupon: Promotions.getByCoupon,
	},
	courseReviews: {
		list: CourseReviews.list,
		create: CourseReviews.create,
		get: CourseReviews.get,
	},
	users: {
		list: Users.list,
		create: Users.create,
		get: Users.get,
		update: Users.update,
		remove: Users.remove,
		getAuthentication: Users.getAuthentication,
		createExpressSignInLink: Users.createExpressSignInLink,
	},
} as const;

export const thinkificEndpointSchemas = {
	'bundles.get': {
		input: ThinkificOperationInputSchemas.bundles_get,
		output: ThinkificOperationOutputSchemas.bundles_get,
	},
	'bundles.listCourses': {
		input: ThinkificOperationInputSchemas.bundles_listCourses,
		output: ThinkificOperationOutputSchemas.bundles_listCourses,
	},
	'bundles.listEnrollments': {
		input: ThinkificOperationInputSchemas.bundles_listEnrollments,
		output: ThinkificOperationOutputSchemas.bundles_listEnrollments,
	},
	'bundles.createEnrollment': {
		input: ThinkificOperationInputSchemas.bundles_createEnrollment,
		output: ThinkificOperationOutputSchemas.bundles_createEnrollment,
	},
	'bundles.updateEnrollments': {
		input: ThinkificOperationInputSchemas.bundles_updateEnrollments,
		output: ThinkificOperationOutputSchemas.bundles_updateEnrollments,
	},
	'chapters.get': {
		input: ThinkificOperationInputSchemas.chapters_get,
		output: ThinkificOperationOutputSchemas.chapters_get,
	},
	'chapters.listContents': {
		input: ThinkificOperationInputSchemas.chapters_listContents,
		output: ThinkificOperationOutputSchemas.chapters_listContents,
	},
	'categories.list': {
		input: ThinkificOperationInputSchemas.categories_list,
		output: ThinkificOperationOutputSchemas.categories_list,
	},
	'categories.create': {
		input: ThinkificOperationInputSchemas.categories_create,
		output: ThinkificOperationOutputSchemas.categories_create,
	},
	'categories.get': {
		input: ThinkificOperationInputSchemas.categories_get,
		output: ThinkificOperationOutputSchemas.categories_get,
	},
	'categories.update': {
		input: ThinkificOperationInputSchemas.categories_update,
		output: ThinkificOperationOutputSchemas.categories_update,
	},
	'categories.remove': {
		input: ThinkificOperationInputSchemas.categories_remove,
		output: ThinkificOperationOutputSchemas.categories_remove,
	},
	'categories.listProducts': {
		input: ThinkificOperationInputSchemas.categories_listProducts,
		output: ThinkificOperationOutputSchemas.categories_listProducts,
	},
	'categoryMemberships.addProducts': {
		input: ThinkificOperationInputSchemas.categoryMemberships_addProducts,
		output: ThinkificOperationOutputSchemas.categoryMemberships_addProducts,
	},
	'categoryMemberships.removeProducts': {
		input: ThinkificOperationInputSchemas.categoryMemberships_removeProducts,
		output: ThinkificOperationOutputSchemas.categoryMemberships_removeProducts,
	},
	'coupons.list': {
		input: ThinkificOperationInputSchemas.coupons_list,
		output: ThinkificOperationOutputSchemas.coupons_list,
	},
	'coupons.create': {
		input: ThinkificOperationInputSchemas.coupons_create,
		output: ThinkificOperationOutputSchemas.coupons_create,
	},
	'coupons.bulkCreate': {
		input: ThinkificOperationInputSchemas.coupons_bulkCreate,
		output: ThinkificOperationOutputSchemas.coupons_bulkCreate,
	},
	'coupons.get': {
		input: ThinkificOperationInputSchemas.coupons_get,
		output: ThinkificOperationOutputSchemas.coupons_get,
	},
	'coupons.update': {
		input: ThinkificOperationInputSchemas.coupons_update,
		output: ThinkificOperationOutputSchemas.coupons_update,
	},
	'coupons.remove': {
		input: ThinkificOperationInputSchemas.coupons_remove,
		output: ThinkificOperationOutputSchemas.coupons_remove,
	},
	'contents.get': {
		input: ThinkificOperationInputSchemas.contents_get,
		output: ThinkificOperationOutputSchemas.contents_get,
	},
	'courses.list': {
		input: ThinkificOperationInputSchemas.courses_list,
		output: ThinkificOperationOutputSchemas.courses_list,
	},
	'courses.get': {
		input: ThinkificOperationInputSchemas.courses_get,
		output: ThinkificOperationOutputSchemas.courses_get,
	},
	'courses.listChapters': {
		input: ThinkificOperationInputSchemas.courses_listChapters,
		output: ThinkificOperationOutputSchemas.courses_listChapters,
	},
	'customProfileFields.list': {
		input: ThinkificOperationInputSchemas.customProfileFields_list,
		output: ThinkificOperationOutputSchemas.customProfileFields_list,
	},
	'enrollments.list': {
		input: ThinkificOperationInputSchemas.enrollments_list,
		output: ThinkificOperationOutputSchemas.enrollments_list,
	},
	'enrollments.create': {
		input: ThinkificOperationInputSchemas.enrollments_create,
		output: ThinkificOperationOutputSchemas.enrollments_create,
	},
	'enrollments.get': {
		input: ThinkificOperationInputSchemas.enrollments_get,
		output: ThinkificOperationOutputSchemas.enrollments_get,
	},
	'enrollments.update': {
		input: ThinkificOperationInputSchemas.enrollments_update,
		output: ThinkificOperationOutputSchemas.enrollments_update,
	},
	'externalOrders.create': {
		input: ThinkificOperationInputSchemas.externalOrders_create,
		output: ThinkificOperationOutputSchemas.externalOrders_create,
	},
	'externalOrders.refund': {
		input: ThinkificOperationInputSchemas.externalOrders_refund,
		output: ThinkificOperationOutputSchemas.externalOrders_refund,
	},
	'externalOrders.purchase': {
		input: ThinkificOperationInputSchemas.externalOrders_purchase,
		output: ThinkificOperationOutputSchemas.externalOrders_purchase,
	},
	'groups.list': {
		input: ThinkificOperationInputSchemas.groups_list,
		output: ThinkificOperationOutputSchemas.groups_list,
	},
	'groups.create': {
		input: ThinkificOperationInputSchemas.groups_create,
		output: ThinkificOperationOutputSchemas.groups_create,
	},
	'groups.get': {
		input: ThinkificOperationInputSchemas.groups_get,
		output: ThinkificOperationOutputSchemas.groups_get,
	},
	'groups.remove': {
		input: ThinkificOperationInputSchemas.groups_remove,
		output: ThinkificOperationOutputSchemas.groups_remove,
	},
	'groups.listAnalysts': {
		input: ThinkificOperationInputSchemas.groups_listAnalysts,
		output: ThinkificOperationOutputSchemas.groups_listAnalysts,
	},
	'groups.assignAnalysts': {
		input: ThinkificOperationInputSchemas.groups_assignAnalysts,
		output: ThinkificOperationOutputSchemas.groups_assignAnalysts,
	},
	'groups.removeAnalyst': {
		input: ThinkificOperationInputSchemas.groups_removeAnalyst,
		output: ThinkificOperationOutputSchemas.groups_removeAnalyst,
	},
	'groupAnalysts.addGroup': {
		input: ThinkificOperationInputSchemas.groupAnalysts_addGroup,
		output: ThinkificOperationOutputSchemas.groupAnalysts_addGroup,
	},
	'groupAnalysts.removeGroup': {
		input: ThinkificOperationInputSchemas.groupAnalysts_removeGroup,
		output: ThinkificOperationOutputSchemas.groupAnalysts_removeGroup,
	},
	'instructors.list': {
		input: ThinkificOperationInputSchemas.instructors_list,
		output: ThinkificOperationOutputSchemas.instructors_list,
	},
	'instructors.create': {
		input: ThinkificOperationInputSchemas.instructors_create,
		output: ThinkificOperationOutputSchemas.instructors_create,
	},
	'instructors.get': {
		input: ThinkificOperationInputSchemas.instructors_get,
		output: ThinkificOperationOutputSchemas.instructors_get,
	},
	'instructors.update': {
		input: ThinkificOperationInputSchemas.instructors_update,
		output: ThinkificOperationOutputSchemas.instructors_update,
	},
	'instructors.remove': {
		input: ThinkificOperationInputSchemas.instructors_remove,
		output: ThinkificOperationOutputSchemas.instructors_remove,
	},
	'orders.list': {
		input: ThinkificOperationInputSchemas.orders_list,
		output: ThinkificOperationOutputSchemas.orders_list,
	},
	'orders.get': {
		input: ThinkificOperationInputSchemas.orders_get,
		output: ThinkificOperationOutputSchemas.orders_get,
	},
	'groupUsers.addUsers': {
		input: ThinkificOperationInputSchemas.groupUsers_addUsers,
		output: ThinkificOperationOutputSchemas.groupUsers_addUsers,
	},
	'productPublishRequests.list': {
		input: ThinkificOperationInputSchemas.productPublishRequests_list,
		output: ThinkificOperationOutputSchemas.productPublishRequests_list,
	},
	'productPublishRequests.get': {
		input: ThinkificOperationInputSchemas.productPublishRequests_get,
		output: ThinkificOperationOutputSchemas.productPublishRequests_get,
	},
	'productPublishRequests.approve': {
		input: ThinkificOperationInputSchemas.productPublishRequests_approve,
		output: ThinkificOperationOutputSchemas.productPublishRequests_approve,
	},
	'productPublishRequests.deny': {
		input: ThinkificOperationInputSchemas.productPublishRequests_deny,
		output: ThinkificOperationOutputSchemas.productPublishRequests_deny,
	},
	'products.list': {
		input: ThinkificOperationInputSchemas.products_list,
		output: ThinkificOperationOutputSchemas.products_list,
	},
	'products.get': {
		input: ThinkificOperationInputSchemas.products_get,
		output: ThinkificOperationOutputSchemas.products_get,
	},
	'products.listRelated': {
		input: ThinkificOperationInputSchemas.products_listRelated,
		output: ThinkificOperationOutputSchemas.products_listRelated,
	},
	'promotions.list': {
		input: ThinkificOperationInputSchemas.promotions_list,
		output: ThinkificOperationOutputSchemas.promotions_list,
	},
	'promotions.create': {
		input: ThinkificOperationInputSchemas.promotions_create,
		output: ThinkificOperationOutputSchemas.promotions_create,
	},
	'promotions.get': {
		input: ThinkificOperationInputSchemas.promotions_get,
		output: ThinkificOperationOutputSchemas.promotions_get,
	},
	'promotions.update': {
		input: ThinkificOperationInputSchemas.promotions_update,
		output: ThinkificOperationOutputSchemas.promotions_update,
	},
	'promotions.remove': {
		input: ThinkificOperationInputSchemas.promotions_remove,
		output: ThinkificOperationOutputSchemas.promotions_remove,
	},
	'promotions.getByCoupon': {
		input: ThinkificOperationInputSchemas.promotions_getByCoupon,
		output: ThinkificOperationOutputSchemas.promotions_getByCoupon,
	},
	'courseReviews.list': {
		input: ThinkificOperationInputSchemas.courseReviews_list,
		output: ThinkificOperationOutputSchemas.courseReviews_list,
	},
	'courseReviews.create': {
		input: ThinkificOperationInputSchemas.courseReviews_create,
		output: ThinkificOperationOutputSchemas.courseReviews_create,
	},
	'courseReviews.get': {
		input: ThinkificOperationInputSchemas.courseReviews_get,
		output: ThinkificOperationOutputSchemas.courseReviews_get,
	},
	'users.list': {
		input: ThinkificOperationInputSchemas.users_list,
		output: ThinkificOperationOutputSchemas.users_list,
	},
	'users.create': {
		input: ThinkificOperationInputSchemas.users_create,
		output: ThinkificOperationOutputSchemas.users_create,
	},
	'users.get': {
		input: ThinkificOperationInputSchemas.users_get,
		output: ThinkificOperationOutputSchemas.users_get,
	},
	'users.update': {
		input: ThinkificOperationInputSchemas.users_update,
		output: ThinkificOperationOutputSchemas.users_update,
	},
	'users.remove': {
		input: ThinkificOperationInputSchemas.users_remove,
		output: ThinkificOperationOutputSchemas.users_remove,
	},
	'users.getAuthentication': {
		input: ThinkificOperationInputSchemas.users_getAuthentication,
		output: ThinkificOperationOutputSchemas.users_getAuthentication,
	},
	'users.createExpressSignInLink': {
		input: ThinkificOperationInputSchemas.users_createExpressSignInLink,
		output: ThinkificOperationOutputSchemas.users_createExpressSignInLink,
	},
} as const;

export const thinkificEndpointMeta = {
	'bundles.get': { riskLevel: 'read', description: 'List a bundle' },
	'bundles.listCourses': {
		riskLevel: 'read',
		description: 'List Courses by bundle ID',
	},
	'bundles.listEnrollments': {
		riskLevel: 'read',
		description: 'List a enrollments in a bundle',
	},
	'bundles.createEnrollment': {
		riskLevel: 'destructive',
		description:
			'Create an Enrollment in a Bundle of Courses (Thinkific can email the learner)',
	},
	'bundles.updateEnrollments': {
		riskLevel: 'write',
		description: 'Update Enrollments in a Bundle',
	},
	'chapters.get': { riskLevel: 'read', description: 'Get Chapters' },
	'chapters.listContents': {
		riskLevel: 'read',
		description: 'Get Contents by Chapter id',
	},
	'categories.list': { riskLevel: 'read', description: 'Get Collections' },
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a new Category',
	},
	'categories.get': { riskLevel: 'read', description: 'Get Collections by Id' },
	'categories.update': {
		riskLevel: 'write',
		description: 'Update collection by ID',
	},
	'categories.remove': {
		riskLevel: 'destructive',
		description: 'Delete collection by ID',
	},
	'categories.listProducts': {
		riskLevel: 'read',
		description: 'Get products by Collections id',
	},
	'categoryMemberships.addProducts': {
		riskLevel: 'write',
		description: 'Add Product to Category',
	},
	'categoryMemberships.removeProducts': {
		riskLevel: 'destructive',
		description: 'Delete Products by ID',
	},
	'coupons.list': { riskLevel: 'read', description: 'Get Coupons' },
	'coupons.create': { riskLevel: 'write', description: 'Create a Coupon' },
	'coupons.bulkCreate': {
		riskLevel: 'write',
		description: 'Bulk Create Coupons',
	},
	'coupons.get': { riskLevel: 'read', description: 'Get a Coupon by ID' },
	'coupons.update': { riskLevel: 'write', description: 'Update a Coupon' },
	'coupons.remove': {
		riskLevel: 'destructive',
		description: 'Delete Coupon by ID',
	},
	'contents.get': { riskLevel: 'read', description: 'Get Contents by Id' },
	'courses.list': { riskLevel: 'read', description: 'Get Courses' },
	'courses.get': { riskLevel: 'read', description: 'Get courses by ID' },
	'courses.listChapters': {
		riskLevel: 'read',
		description: 'Get Chapters by Course ID',
	},
	'customProfileFields.list': {
		riskLevel: 'read',
		description: 'Get Custom profile field definition',
	},
	'enrollments.list': { riskLevel: 'read', description: 'Get Enrollments' },
	'enrollments.create': {
		riskLevel: 'destructive',
		description: 'Create enrollment (Thinkific can email the learner)',
	},
	'enrollments.get': {
		riskLevel: 'read',
		description: 'Get enrollments by ID',
	},
	'enrollments.update': {
		riskLevel: 'write',
		description: 'Update enrollment',
	},
	'externalOrders.create': {
		riskLevel: 'write',
		description: 'Create a new external order',
	},
	'externalOrders.refund': {
		riskLevel: 'destructive',
		description: 'refund transaction',
	},
	'externalOrders.purchase': {
		riskLevel: 'destructive',
		description: 'purchase transaction',
	},
	'groups.list': { riskLevel: 'read', description: 'Get Groups' },
	'groups.create': { riskLevel: 'write', description: 'Create Group' },
	'groups.get': { riskLevel: 'read', description: 'Get Group' },
	'groups.remove': {
		riskLevel: 'destructive',
		description: 'Delete Group by ID',
	},
	'groups.listAnalysts': {
		riskLevel: 'read',
		description: 'Get Group Analysts',
	},
	'groups.assignAnalysts': {
		riskLevel: 'write',
		description: 'Assign Analysts to a Group',
	},
	'groups.removeAnalyst': {
		riskLevel: 'destructive',
		description: 'Delete Analyst',
	},
	'groupAnalysts.addGroup': {
		riskLevel: 'write',
		description: 'Add Analyst to Groups',
	},
	'groupAnalysts.removeGroup': {
		riskLevel: 'destructive',
		description: 'Delete Analyst',
	},
	'instructors.list': { riskLevel: 'read', description: 'Get Instructors' },
	'instructors.create': {
		riskLevel: 'write',
		description: 'Create instructor',
	},
	'instructors.get': { riskLevel: 'read', description: 'Get Instructor by ID' },
	'instructors.update': {
		riskLevel: 'write',
		description: 'Update instructor',
	},
	'instructors.remove': {
		riskLevel: 'destructive',
		description: 'Delete instructor',
	},
	'orders.list': { riskLevel: 'read', description: 'Get Orders' },
	'orders.get': { riskLevel: 'read', description: 'Get orders by ID' },
	'groupUsers.addUsers': {
		riskLevel: 'write',
		description: 'Create a User to existing Groups',
	},
	'productPublishRequests.list': {
		riskLevel: 'read',
		description: 'Get List of unhandled product publish requests',
	},
	'productPublishRequests.get': {
		riskLevel: 'read',
		description: 'Get product publish request by ID',
	},
	'productPublishRequests.approve': {
		riskLevel: 'destructive',
		description: 'Approves Product Publish Request',
	},
	'productPublishRequests.deny': {
		riskLevel: 'destructive',
		description: 'Denies Product Publish Request',
	},
	'products.list': { riskLevel: 'read', description: 'List products' },
	'products.get': { riskLevel: 'read', description: 'Get product by ID' },
	'products.listRelated': {
		riskLevel: 'read',
		description: 'Get related products',
	},
	'promotions.list': { riskLevel: 'read', description: 'List promotions' },
	'promotions.create': {
		riskLevel: 'write',
		description: 'Create a new promotion',
	},
	'promotions.get': {
		riskLevel: 'read',
		description: 'Get promotion by provided ID',
	},
	'promotions.update': {
		riskLevel: 'write',
		description: 'Update promotion by provided ID',
	},
	'promotions.remove': {
		riskLevel: 'destructive',
		description: 'Delete promotion by provided ID',
	},
	'promotions.getByCoupon': {
		riskLevel: 'read',
		description: 'Get Promotion associated with the provided Coupon code.',
	},
	'courseReviews.list': {
		riskLevel: 'read',
		description: 'Get Course Reviews',
	},
	'courseReviews.create': {
		riskLevel: 'write',
		description: 'Create a course review',
	},
	'courseReviews.get': {
		riskLevel: 'read',
		description: 'Get Course Reviews By ID',
	},
	'users.list': { riskLevel: 'read', description: 'List Users' },
	'users.create': { riskLevel: 'destructive', description: 'Create user' },
	'users.get': { riskLevel: 'read', description: 'List Users by ID' },
	'users.update': { riskLevel: 'write', description: 'Update user by ID' },
	'users.remove': {
		riskLevel: 'destructive',
		description: 'Delete user by ID',
	},
	'users.getAuthentication': {
		riskLevel: 'read',
		description: 'Get User Auth data by ID and Provider',
	},
	'users.createExpressSignInLink': {
		riskLevel: 'destructive',
		description: "Get a learner's Express Sign In Link",
	},
} as const;
