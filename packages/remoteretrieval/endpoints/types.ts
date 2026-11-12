import { z } from 'zod';

// Inputs use the API's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field the API adds or omits cannot fail a
// call that has already happened. Shapes come from
// https://www.remoteretrieval.com/api-integration.
//
// Two things worth knowing before reading the models:
//
// - The list routes disagree about their container. `pending-orders`,
//   `new-orders`, `inprogress-orders` and `device_returns` answer a bare array;
//   `/orders` answers `{next, previous, results}`; `create-order` answers a single
//   object. There is no shared envelope, so each route has its own model.
// - The request fields and the response fields for the same address are named
//   differently. A create takes `employee_info.address_city`; a list answers
//   `employee_info.city`. The models follow each side rather than renaming.

// ── shared ────────────────────────────────────────────────────────────────

/** The four device types the API documents. */
export const RPV_EQUIPMENT_TYPES = [
	'Laptop',
	'Monitor',
	'Cell Phone',
	'Tablet',
] as const;

/**
 * The device type as a create accepts it, which also includes `Monitor_27`: the
 * docs map it to displays of 24 to 27 inches, where plain `Monitor` means 17 to 23.
 */
export const RPV_CREATE_EQUIPMENT_TYPES = [
	'Laptop',
	'Monitor',
	'Monitor_27',
	'Cell Phone',
	'Tablet',
] as const;

export const RPV_ORDER_TYPES = [
	'Return To Company',
	'Recycle with Data Destruction',
] as const;

/** Both equipment lists, for a price row, which can include either set. */
const PriceEquipmentSchema = z
	.string()
	.describe(
		'Laptop, Monitor, Monitor_27, Cell Phone or Tablet. Monitor_27 is a 24-to-27-inch display; Monitor alone is 17 to 23 inches.',
	);

// ── validate.get ──────────────────────────────────────────────────────────

const ValidateInputSchema = z.object({});

const ValidateResponseSchema = z
	.object({
		message: z.string().nullish().describe('"Valid Key!" on success.'),
		email: z.string().nullish().describe('The account the key belongs to.'),
		status: z.string().nullish().describe('Success.'),
		response_code: z.number().nullish(),
	})
	.loose();

export type ValidateResponse = z.infer<typeof ValidateResponseSchema>;

// ── orders.create ─────────────────────────────────────────────────────────

/**
 * The employee the box ships to.
 *
 * Every field here is the `address_`-prefixed spelling a create expects, which
 * differs from the `city`/`state`/`zip` a list returns.
 */
const EmployeeInputSchema = z.object({
	email: z.string().min(1),
	name: z.string().min(1).describe("The employee's full name."),
	address_line_1: z.string().min(1),
	address_line_2: z.string().optional(),
	address_city: z.string().min(1),
	address_state: z.string().min(1),
	address_country: z.string().min(1),
	address_zip: z.string().min(1),
	phone: z.string().min(1),
});

export type RemoteRetrievalEmployeeInput = z.infer<typeof EmployeeInputSchema>;

/** Where the device goes when it comes back. */
const CompanyInputSchema = z.object({
	return_person_name: z.string().min(1),
	return_company_name: z.string().min(1),
	return_address_line_1: z.string().min(1),
	return_address_line_2: z.string().optional(),
	return_address_city: z.string().min(1),
	return_address_state: z.string().min(1),
	return_address_country: z.string().min(1),
	return_address_zip: z.string().min(1),
	email: z.string().min(1),
	phone: z.string().min(1),
});

export type RemoteRetrievalCompanyInput = z.infer<typeof CompanyInputSchema>;

/**
 * Required only when `return_add_srv` is 2 (data wipe and delivery to a new
 * employee), which the schema enforces at the order level.
 */
const NewEmployeeInputSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	phone: z.string().min(1),
	email: z.string().min(1),
	address_line_1: z.string().min(1),
	address_city: z.string().min(1),
	address_state: z.string().min(1),
	address_zip: z.string().min(1),
	address_country: z.string().min(1),
	newemp_msg: z.string().optional().describe('A message for the new employee.'),
});

export type RemoteRetrievalNewEmployeeInput = z.infer<
	typeof NewEmployeeInputSchema
>;

/**
 * One order.
 *
 * `return_add_srv` is the additional service: 1 is data wipe and return to the
 * company, 2 is data wipe and delivery to a new employee. Choosing 2 without
 * `new_employee_info` is rejected here, because the API would create an order it
 * cannot fulfil.
 */
const OrderInputSchema = z
	.object({
		type_of_equipment: z.enum(RPV_CREATE_EQUIPMENT_TYPES),
		order_type: z.enum(RPV_ORDER_TYPES),
		return_add_srv: z
			.union([z.literal(1), z.literal(2)])
			.optional()
			.describe(
				'1 is data wipe then return to the company; 2 is data wipe then delivery to a new employee, which needs new_employee_info. Only valid with order_type Return To Company.',
			),
		ins_active: z
			.union([z.literal(0), z.literal(1)])
			.optional()
			.describe('1 insures the device, and then ins_amount is required.'),
		ins_amount: z
			.number()
			.positive()
			.optional()
			.describe('The insured value. Required when ins_active is 1.'),
		custom_msg: z
			.string()
			.optional()
			.describe(
				'A message for the shipment. In the provider Postman collection, not in the API reference.',
			),
		employee_info: EmployeeInputSchema,
		company_info: CompanyInputSchema,
		new_employee_info: NewEmployeeInputSchema.optional(),
	})
	.superRefine((order, ctx) => {
		if (order.return_add_srv === 2 && order.new_employee_info === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['new_employee_info'],
				message:
					'return_add_srv 2 delivers the device to a new employee, so new_employee_info is required.',
			});
		}
		if (order.ins_active === 1 && order.ins_amount === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['ins_amount'],
				message:
					'ins_active 1 needs ins_amount; the API rejects the order otherwise.',
			});
		}
		if (
			order.return_add_srv !== undefined &&
			order.order_type !== 'Return To Company'
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['return_add_srv'],
				message:
					'return_add_srv only applies to order_type Return To Company; a recycle order has no return path.',
			});
		}
	});

export type RemoteRetrievalOrderInput = z.infer<typeof OrderInputSchema>;

/**
 * The create takes an `orders` array, so a single order is wrapped on the wire.
 * The array is required even for one, which is why the input has no scalar form.
 */
const OrdersCreateInputSchema = z.object({
	orders: z.array(OrderInputSchema).min(1),
});

export type OrdersCreateInput = z.infer<typeof OrdersCreateInputSchema>;

/**
 * The create answers a status and a message. `order` is documented as a string
 * ("212"), not a number, and only one id comes back even when several orders were
 * sent, because it is the batch reference.
 */
const OrdersCreateResponseSchema = z
	.object({
		order: z
			.string()
			.nullish()
			.describe(
				'The created order reference, as a string. One id comes back for a batch.',
			),
		message: z.string().nullish(),
		status: z.string().nullish().describe('Success.'),
		response_code: z.number().nullish(),
	})
	.loose();

export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;

// ── the address shapes a list returns ─────────────────────────────────────

/**
 * The employee as a list returns it. The fields are `city`, `state` and `zip`,
 * without the `address_` prefix a create expects.
 */
const EmployeeViewSchema = z
	.object({
		email: z.string().nullish(),
		name: z.string().nullish(),
		address_line_1: z.string().nullish(),
		address_line_2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
	})
	.loose();

const CompanyViewSchema = z
	.object({
		email: z.string().nullish(),
		name: z.string().nullish(),
		address_line_1: z.string().nullish(),
		address_line_2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
	})
	.loose();

/** `---` is what the API sends before a shipment starts. */
const ShipmentsSchema = z
	.object({
		device_type: z.string().nullish(),
		send_status: z
			.string()
			.nullish()
			.describe('The outbound box status, or --- before it ships.'),
		return_status: z
			.string()
			.nullish()
			.describe('The return-leg status, or --- before it starts.'),
	})
	.loose();

/** One order as the list routes return it. */
const OrderViewSchema = z
	.object({
		order_id: z.number().nullish(),
		payment_status: z
			.string()
			.nullish()
			.describe('Completed or Pending. Only /orders includes it.'),
		order_status: z
			.string()
			.nullish()
			.describe(
				'A phrase such as "Ship to Company: DELIVERED". Only /orders includes it.',
			),
		employee_info: EmployeeViewSchema.nullish(),
		company_info: CompanyViewSchema.nullish(),
		shipments: ShipmentsSchema.nullish(),
	})
	.loose();

export type RemoteRetrievalOrderView = z.infer<typeof OrderViewSchema>;

// ── the four list routes ──────────────────────────────────────────────────

const PageInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('A page holds up to 25 orders. Defaults to 1.'),
});

export type OrderListPageInput = z.infer<typeof PageInputSchema>;

/** The four list routes answer a bare array, not an envelope. */
const OrderArrayResponseSchema = z
	.array(OrderViewSchema)
	.describe(
		'A bare array of orders; these routes have no pagination envelope.',
	);

export type OrderArrayResponse = z.infer<typeof OrderArrayResponseSchema>;

const OrdersListInputSchema = z.object({
	cursor: z
		.string()
		.optional()
		.describe(
			"The previous response's next link, passed as it came back; the plugin reads the cursor out of it. A bare cursor value also works.",
		),
});

export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;

/** `/orders` is the one list route with a pagination envelope. */
const OrdersListResponseSchema = z
	.object({
		next: z.string().nullish(),
		previous: z.string().nullish(),
		results: z.array(OrderViewSchema).nullish(),
	})
	.loose();

export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

// ── orders.get ────────────────────────────────────────────────────────────

const OrderGetInputSchema = z.object({
	oid: z.number().int().describe('The order ID.'),
});

export type OrderGetInput = z.infer<typeof OrderGetInputSchema>;

/** `device_returns` answers an array even for one id. */
const OrderGetResponseSchema = z.array(OrderViewSchema);

export type OrderGetResponse = z.infer<typeof OrderGetResponseSchema>;

// ── company.get ───────────────────────────────────────────────────────────

const CompanyGetInputSchema = z.object({});

const CompanyGetResponseSchema = z
	.object({
		company_name: z.string().nullish(),
		company_email: z.string().nullish(),
		address_1: z.string().nullish(),
		address_2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		created_date: z
			.string()
			.nullish()
			.describe('A date such as 24-Jun-2024, not ISO 8601.'),
	})
	.loose();

export type CompanyGetResponse = z.infer<typeof CompanyGetResponseSchema>;

// ── prices ────────────────────────────────────────────────────────────────

const PricesInputSchema = z.object({});

const PriceSchema = z
	.object({
		equipment_type: PriceEquipmentSchema.nullish(),
		order_amount: z.number().nullish().describe('In US dollars.'),
		option_lbl: z
			.string()
			.nullish()
			.describe('A display label such as Laptop($77).'),
	})
	.loose();

const PricesResponseSchema = z.array(PriceSchema);

export type PricesResponse = z.infer<typeof PricesResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RemoteRetrievalEndpointInputs = {
	validate: z.infer<typeof ValidateInputSchema>;
	ordersCreate: OrdersCreateInput;
	pendingOrders: OrderListPageInput;
	newOrders: OrderListPageInput;
	inprogressOrders: OrderListPageInput;
	ordersList: OrdersListInput;
	orderGet: OrderGetInput;
	companyGet: z.infer<typeof CompanyGetInputSchema>;
	prices: z.infer<typeof PricesInputSchema>;
};

export type RemoteRetrievalEndpointOutputs = {
	validate: ValidateResponse;
	ordersCreate: OrdersCreateResponse;
	pendingOrders: OrderArrayResponse;
	newOrders: OrderArrayResponse;
	inprogressOrders: OrderArrayResponse;
	ordersList: OrdersListResponse;
	orderGet: OrderGetResponse;
	companyGet: CompanyGetResponse;
	prices: PricesResponse;
};

export const RemoteRetrievalEndpointInputSchemas = {
	validate: ValidateInputSchema,
	ordersCreate: OrdersCreateInputSchema,
	pendingOrders: PageInputSchema,
	newOrders: PageInputSchema,
	inprogressOrders: PageInputSchema,
	ordersList: OrdersListInputSchema,
	orderGet: OrderGetInputSchema,
	companyGet: CompanyGetInputSchema,
	prices: PricesInputSchema,
} as const;

export const RemoteRetrievalEndpointOutputSchemas = {
	validate: ValidateResponseSchema,
	ordersCreate: OrdersCreateResponseSchema,
	pendingOrders: OrderArrayResponseSchema,
	newOrders: OrderArrayResponseSchema,
	inprogressOrders: OrderArrayResponseSchema,
	ordersList: OrdersListResponseSchema,
	orderGet: OrderGetResponseSchema,
	companyGet: CompanyGetResponseSchema,
	prices: PricesResponseSchema,
} as const;
