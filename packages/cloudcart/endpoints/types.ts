import { z } from 'zod';

const IdParamSchema = z.union([z.string(), z.number()]);

const BaseEntityInputSchema = z.object({
	id: IdParamSchema.optional(),
	product_id: IdParamSchema.optional(),
	customer_id: IdParamSchema.optional(),
	property_id: IdParamSchema.optional(),
	discount_id: IdParamSchema.optional(),
	'page[number]': z.coerce.number().int().positive().optional(),
	'page[size]': z.coerce.number().int().positive().max(250).optional(),
	sort: z.string().optional(),
	include: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

const GenericResponseSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
	z.null(),
	z.undefined(),
]);

export const CreateProductInputSchema = BaseEntityInputSchema;
export const GetProductInputSchema = BaseEntityInputSchema;
export const GetProductWithRelationsInputSchema = BaseEntityInputSchema;
export const ListProductsInputSchema = BaseEntityInputSchema;
export const UpdateProductInputSchema = BaseEntityInputSchema;
export const DeleteProductInputSchema = BaseEntityInputSchema;
export const CreateLinkedProductsInputSchema = BaseEntityInputSchema;
export const GetProductsLinkedProductInputSchema = BaseEntityInputSchema;
export const GetProductsLinkedProductsInputSchema = BaseEntityInputSchema;
export const UpdateLinkedProductInputSchema = BaseEntityInputSchema;
export const DeleteLinkedProductsInputSchema = BaseEntityInputSchema;
export const CreateImageInputSchema = BaseEntityInputSchema;
export const GetImageInputSchema = BaseEntityInputSchema;
export const ListImagesInputSchema = BaseEntityInputSchema;
export const DeleteImageInputSchema = BaseEntityInputSchema;

export const CreateCategoryInputSchema = BaseEntityInputSchema;
export const GetCategoryInputSchema = BaseEntityInputSchema;
export const ListCategoriesInputSchema = BaseEntityInputSchema;
export const UpdateCategoryInputSchema = BaseEntityInputSchema;
export const DeleteCategoryInputSchema = BaseEntityInputSchema;
export const GetCategoryPropertiesInputSchema = BaseEntityInputSchema;
export const AddCategoryPropertiesInputSchema = BaseEntityInputSchema;

export const CreatePropertyInputSchema = BaseEntityInputSchema;
export const GetPropertyInputSchema = BaseEntityInputSchema;
export const ListPropertiesInputSchema = BaseEntityInputSchema;
export const UpdatePropertyInputSchema = BaseEntityInputSchema;
export const DeletePropertyInputSchema = BaseEntityInputSchema;
export const CreatePropertyOptionInputSchema = BaseEntityInputSchema;
export const GetPropertyOptionInputSchema = BaseEntityInputSchema;
export const ListPropertyOptionsInputSchema = BaseEntityInputSchema;
export const UpdatePropertyOptionInputSchema = BaseEntityInputSchema;
export const DeletePropertyOptionInputSchema = BaseEntityInputSchema;
export const CreateProductsPropertyOptionsInputSchema = BaseEntityInputSchema;
export const GetPropertyOptionsRelationshipInputSchema = BaseEntityInputSchema;

export const CreateVariantInputSchema = BaseEntityInputSchema;
export const GetVariantInputSchema = BaseEntityInputSchema;
export const ListVariantsInputSchema = BaseEntityInputSchema;
export const UpdateVariantInputSchema = BaseEntityInputSchema;
export const DeleteVariantInputSchema = BaseEntityInputSchema;
export const CreateVariantOptionInputSchema = BaseEntityInputSchema;
export const CreateVariantOptionsInputSchema = BaseEntityInputSchema;
export const GetVariantOptionInputSchema = BaseEntityInputSchema;
export const ListVariantOptionsInputSchema = BaseEntityInputSchema;
export const UpdateVariantOptionInputSchema = BaseEntityInputSchema;
export const DeleteVariantOptionInputSchema = BaseEntityInputSchema;
export const CreateVariantParameterInputSchema = BaseEntityInputSchema;
export const CreateVariantParameterForVariantInputSchema = BaseEntityInputSchema;
export const GetVariantParameterInputSchema = BaseEntityInputSchema;
export const ListVariantParametersInputSchema = BaseEntityInputSchema;
export const UpdateVariantParameterInputSchema = BaseEntityInputSchema;
export const DeleteVariantParameterInputSchema = BaseEntityInputSchema;

export const CreateCustomerInputSchema = BaseEntityInputSchema;
export const GetCustomerInputSchema = BaseEntityInputSchema;
export const ListCustomersInputSchema = BaseEntityInputSchema;
export const UpdateCustomerInputSchema = BaseEntityInputSchema;
export const DeleteCustomerInputSchema = BaseEntityInputSchema;
export const CreateCustomerGroupInputSchema = BaseEntityInputSchema;
export const GetCustomerGroupInputSchema = BaseEntityInputSchema;
export const ListCustomerGroupsInputSchema = BaseEntityInputSchema;
export const GetCustomerGroupsCustomersInputSchema = BaseEntityInputSchema;
export const UpdateCustomerGroupInputSchema = BaseEntityInputSchema;
export const DeleteCustomerGroupInputSchema = BaseEntityInputSchema;
export const CreateCustomerBillingAddressInputSchema = BaseEntityInputSchema;
export const GetCustomerBillingAddressInputSchema = BaseEntityInputSchema;
export const ListCustomerBillingAddressesInputSchema = BaseEntityInputSchema;
export const UpdateCustomerBillingAddressInputSchema = BaseEntityInputSchema;
export const DeleteCustomerBillingAddressInputSchema = BaseEntityInputSchema;
export const CreateCustomerShippingAddressInputSchema = BaseEntityInputSchema;
export const GetCustomerShippingAddressInputSchema = BaseEntityInputSchema;
export const ListCustomerShippingAddressesInputSchema = BaseEntityInputSchema;
export const UpdateCustomerShippingAddressInputSchema = BaseEntityInputSchema;
export const DeleteCustomerShippingAddressInputSchema = BaseEntityInputSchema;
export const CreateCustomerTagInputSchema = BaseEntityInputSchema;
export const GetCustomerTagInputSchema = BaseEntityInputSchema;
export const ListCustomerTagsInputSchema = BaseEntityInputSchema;
export const UpdateCustomerTagInputSchema = BaseEntityInputSchema;
export const DeleteCustomerTagInputSchema = BaseEntityInputSchema;

export const CreateOrderInputSchema = BaseEntityInputSchema;
export const ListOrdersInputSchema = BaseEntityInputSchema;
export const UpdateOrderInputSchema = BaseEntityInputSchema;
export const DeleteOrderInputSchema = BaseEntityInputSchema;
export const ListOrderBillingAddressesInputSchema = BaseEntityInputSchema;
export const ListOrderShippingAddressesInputSchema = BaseEntityInputSchema;
export const ListOrderProductsInputSchema = BaseEntityInputSchema;
export const ListOrderProductsOptionsInputSchema = BaseEntityInputSchema;
export const ListOrderPaymentsInputSchema = BaseEntityInputSchema;
export const ListOrderPaymentV2InputSchema = BaseEntityInputSchema;
export const ListOrderShippingInputSchema = BaseEntityInputSchema;
export const ListOrderStatusInputSchema = BaseEntityInputSchema;

export const GetCartInputSchema = BaseEntityInputSchema;
export const AddToCartInputSchema = BaseEntityInputSchema;
export const UpdateCartItemInputSchema = BaseEntityInputSchema;
export const RemoveFromCartInputSchema = BaseEntityInputSchema;
export const ClearCartInputSchema = BaseEntityInputSchema;

export const CreateDiscountInputSchema = BaseEntityInputSchema;
export const DeleteDiscountInputSchema = BaseEntityInputSchema;
export const CreateDiscountCodeInputSchema = BaseEntityInputSchema;
export const ListDiscountCodesInputSchema = BaseEntityInputSchema;
export const UpdateDiscountCodeInputSchema = BaseEntityInputSchema;
export const DeleteDiscountCodeInputSchema = BaseEntityInputSchema;
export const GenerateDiscountCodesInputSchema = BaseEntityInputSchema;
export const CreateProductToDiscountInputSchema = BaseEntityInputSchema;
export const DeleteProductToDiscountInputSchema = BaseEntityInputSchema;

export const CreateSubscriberInputSchema = BaseEntityInputSchema;
export const GetSubscriberInputSchema = BaseEntityInputSchema;
export const ListSubscribersInputSchema = BaseEntityInputSchema;
export const UpdateSubscriberInputSchema = BaseEntityInputSchema;
export const DeleteSubscriberInputSchema = BaseEntityInputSchema;
export const CreateSubscriberChannelInputSchema = BaseEntityInputSchema;
export const GetSubscribersChannelInputSchema = BaseEntityInputSchema;
export const ListSubscribersChannelsInputSchema = BaseEntityInputSchema;
export const UpdateSubscribersChannelInputSchema = BaseEntityInputSchema;
export const DeleteSubscribersChannelInputSchema = BaseEntityInputSchema;
export const CreateSubscriberTagInputSchema = BaseEntityInputSchema;
export const GetSubscriberTagInputSchema = BaseEntityInputSchema;
export const ListSubscribersTagsInputSchema = BaseEntityInputSchema;
export const UpdateSubscriberTagInputSchema = BaseEntityInputSchema;
export const DeleteSubscriberTagInputSchema = BaseEntityInputSchema;

export const CreateBlogPostInputSchema = BaseEntityInputSchema;
export const GetBlogPostInputSchema = BaseEntityInputSchema;
export const ListBlogPostsInputSchema = BaseEntityInputSchema;
export const UpdateBlogPostInputSchema = BaseEntityInputSchema;
export const DeleteBlogPostInputSchema = BaseEntityInputSchema;
export const CreateBlogCategoryInputSchema = BaseEntityInputSchema;
export const GetBlogCategoryInputSchema = BaseEntityInputSchema;
export const ListBlogCategoriesInputSchema = BaseEntityInputSchema;
export const UpdateBlogCategoryInputSchema = BaseEntityInputSchema;
export const DeleteBlogCategoryInputSchema = BaseEntityInputSchema;
export const CreateBlogTagInputSchema = BaseEntityInputSchema;
export const GetBlogTagInputSchema = BaseEntityInputSchema;
export const ListBlogTagsInputSchema = BaseEntityInputSchema;
export const UpdateBlogTagInputSchema = BaseEntityInputSchema;
export const DeleteBlogTagInputSchema = BaseEntityInputSchema;
export const GetBlogAuthorInputSchema = BaseEntityInputSchema;

export const CreateVendorInputSchema = BaseEntityInputSchema;
export const GetVendorInputSchema = BaseEntityInputSchema;
export const ListVendorsInputSchema = BaseEntityInputSchema;
export const UpdateVendorInputSchema = BaseEntityInputSchema;
export const DeleteVendorInputSchema = BaseEntityInputSchema;
export const CreateRedirectInputSchema = BaseEntityInputSchema;
export const ListRedirectsInputSchema = BaseEntityInputSchema;
export const DeleteRedirectInputSchema = BaseEntityInputSchema;
export const GetPaymentMethodsInputSchema = BaseEntityInputSchema;
export const ListPaymentProvidersInputSchema = BaseEntityInputSchema;
export const GetShippingMethodsInputSchema = BaseEntityInputSchema;
export const ListShippingProvidersInputSchema = BaseEntityInputSchema;

export const CreateWebhookInputSchema = BaseEntityInputSchema;
export const GetWebhookInputSchema = BaseEntityInputSchema;
export const ListWebhooksInputSchema = BaseEntityInputSchema;
export const UpdateWebhookInputSchema = BaseEntityInputSchema;
export const DeleteWebhookInputSchema = BaseEntityInputSchema;

export type CloudcartEndpointInputs = {
	createProduct: z.infer<typeof CreateProductInputSchema>;
	getProduct: z.infer<typeof GetProductInputSchema>;
	getProductWithRelations: z.infer<typeof GetProductWithRelationsInputSchema>;
	listProducts: z.infer<typeof ListProductsInputSchema>;
	updateProduct: z.infer<typeof UpdateProductInputSchema>;
	deleteProduct: z.infer<typeof DeleteProductInputSchema>;
	createLinkedProducts: z.infer<typeof CreateLinkedProductsInputSchema>;
	getProductsLinkedProduct: z.infer<typeof GetProductsLinkedProductInputSchema>;
	getProductsLinkedProducts: z.infer<typeof GetProductsLinkedProductsInputSchema>;
	updateLinkedProduct: z.infer<typeof UpdateLinkedProductInputSchema>;
	deleteLinkedProducts: z.infer<typeof DeleteLinkedProductsInputSchema>;
	createImage: z.infer<typeof CreateImageInputSchema>;
	getImage: z.infer<typeof GetImageInputSchema>;
	listImages: z.infer<typeof ListImagesInputSchema>;
	deleteImage: z.infer<typeof DeleteImageInputSchema>;

	createCategory: z.infer<typeof CreateCategoryInputSchema>;
	getCategory: z.infer<typeof GetCategoryInputSchema>;
	listCategories: z.infer<typeof ListCategoriesInputSchema>;
	updateCategory: z.infer<typeof UpdateCategoryInputSchema>;
	deleteCategory: z.infer<typeof DeleteCategoryInputSchema>;
	getCategoryProperties: z.infer<typeof GetCategoryPropertiesInputSchema>;
	addCategoryProperties: z.infer<typeof AddCategoryPropertiesInputSchema>;

	createProperty: z.infer<typeof CreatePropertyInputSchema>;
	getProperty: z.infer<typeof GetPropertyInputSchema>;
	listProperties: z.infer<typeof ListPropertiesInputSchema>;
	updateProperty: z.infer<typeof UpdatePropertyInputSchema>;
	deleteProperty: z.infer<typeof DeletePropertyInputSchema>;
	createPropertyOption: z.infer<typeof CreatePropertyOptionInputSchema>;
	getPropertyOption: z.infer<typeof GetPropertyOptionInputSchema>;
	listPropertyOptions: z.infer<typeof ListPropertyOptionsInputSchema>;
	updatePropertyOption: z.infer<typeof UpdatePropertyOptionInputSchema>;
	deletePropertyOption: z.infer<typeof DeletePropertyOptionInputSchema>;
	createProductsPropertyOptions: z.infer<typeof CreateProductsPropertyOptionsInputSchema>;
	getPropertyOptionsRelationship: z.infer<typeof GetPropertyOptionsRelationshipInputSchema>;

	createVariant: z.infer<typeof CreateVariantInputSchema>;
	getVariant: z.infer<typeof GetVariantInputSchema>;
	listVariants: z.infer<typeof ListVariantsInputSchema>;
	updateVariant: z.infer<typeof UpdateVariantInputSchema>;
	deleteVariant: z.infer<typeof DeleteVariantInputSchema>;
	createVariantOption: z.infer<typeof CreateVariantOptionInputSchema>;
	createVariantOptions: z.infer<typeof CreateVariantOptionsInputSchema>;
	getVariantOption: z.infer<typeof GetVariantOptionInputSchema>;
	listVariantOptions: z.infer<typeof ListVariantOptionsInputSchema>;
	updateVariantOption: z.infer<typeof UpdateVariantOptionInputSchema>;
	deleteVariantOption: z.infer<typeof DeleteVariantOptionInputSchema>;
	createVariantParameter: z.infer<typeof CreateVariantParameterInputSchema>;
	createVariantParameterForVariant: z.infer<typeof CreateVariantParameterForVariantInputSchema>;
	getVariantParameter: z.infer<typeof GetVariantParameterInputSchema>;
	listVariantParameters: z.infer<typeof ListVariantParametersInputSchema>;
	updateVariantParameter: z.infer<typeof UpdateVariantParameterInputSchema>;
	deleteVariantParameter: z.infer<typeof DeleteVariantParameterInputSchema>;

	createCustomer: z.infer<typeof CreateCustomerInputSchema>;
	getCustomer: z.infer<typeof GetCustomerInputSchema>;
	listCustomers: z.infer<typeof ListCustomersInputSchema>;
	updateCustomer: z.infer<typeof UpdateCustomerInputSchema>;
	deleteCustomer: z.infer<typeof DeleteCustomerInputSchema>;
	createCustomerGroup: z.infer<typeof CreateCustomerGroupInputSchema>;
	getCustomerGroup: z.infer<typeof GetCustomerGroupInputSchema>;
	listCustomerGroups: z.infer<typeof ListCustomerGroupsInputSchema>;
	getCustomerGroupsCustomers: z.infer<typeof GetCustomerGroupsCustomersInputSchema>;
	updateCustomerGroup: z.infer<typeof UpdateCustomerGroupInputSchema>;
	deleteCustomerGroup: z.infer<typeof DeleteCustomerGroupInputSchema>;
	createCustomerBillingAddress: z.infer<typeof CreateCustomerBillingAddressInputSchema>;
	getCustomerBillingAddress: z.infer<typeof GetCustomerBillingAddressInputSchema>;
	listCustomerBillingAddresses: z.infer<typeof ListCustomerBillingAddressesInputSchema>;
	updateCustomerBillingAddress: z.infer<typeof UpdateCustomerBillingAddressInputSchema>;
	deleteCustomerBillingAddress: z.infer<typeof DeleteCustomerBillingAddressInputSchema>;
	createCustomerShippingAddress: z.infer<typeof CreateCustomerShippingAddressInputSchema>;
	getCustomerShippingAddress: z.infer<typeof GetCustomerShippingAddressInputSchema>;
	listCustomerShippingAddresses: z.infer<typeof ListCustomerShippingAddressesInputSchema>;
	updateCustomerShippingAddress: z.infer<typeof UpdateCustomerShippingAddressInputSchema>;
	deleteCustomerShippingAddress: z.infer<typeof DeleteCustomerShippingAddressInputSchema>;
	createCustomerTag: z.infer<typeof CreateCustomerTagInputSchema>;
	getCustomerTag: z.infer<typeof GetCustomerTagInputSchema>;
	listCustomerTags: z.infer<typeof ListCustomerTagsInputSchema>;
	updateCustomerTag: z.infer<typeof UpdateCustomerTagInputSchema>;
	deleteCustomerTag: z.infer<typeof DeleteCustomerTagInputSchema>;

	createOrder: z.infer<typeof CreateOrderInputSchema>;
	listOrders: z.infer<typeof ListOrdersInputSchema>;
	updateOrder: z.infer<typeof UpdateOrderInputSchema>;
	deleteOrder: z.infer<typeof DeleteOrderInputSchema>;
	listOrderBillingAddresses: z.infer<typeof ListOrderBillingAddressesInputSchema>;
	listOrderShippingAddresses: z.infer<typeof ListOrderShippingAddressesInputSchema>;
	listOrderProducts: z.infer<typeof ListOrderProductsInputSchema>;
	listOrderProductsOptions: z.infer<typeof ListOrderProductsOptionsInputSchema>;
	listOrderPayments: z.infer<typeof ListOrderPaymentsInputSchema>;
	listOrderPaymentV2: z.infer<typeof ListOrderPaymentV2InputSchema>;
	listOrderShipping: z.infer<typeof ListOrderShippingInputSchema>;
	listOrderStatus: z.infer<typeof ListOrderStatusInputSchema>;

	getCart: z.infer<typeof GetCartInputSchema>;
	addToCart: z.infer<typeof AddToCartInputSchema>;
	updateCartItem: z.infer<typeof UpdateCartItemInputSchema>;
	removeFromCart: z.infer<typeof RemoveFromCartInputSchema>;
	clearCart: z.infer<typeof ClearCartInputSchema>;

	createDiscount: z.infer<typeof CreateDiscountInputSchema>;
	deleteDiscount: z.infer<typeof DeleteDiscountInputSchema>;
	createDiscountCode: z.infer<typeof CreateDiscountCodeInputSchema>;
	listDiscountCodes: z.infer<typeof ListDiscountCodesInputSchema>;
	updateDiscountCode: z.infer<typeof UpdateDiscountCodeInputSchema>;
	deleteDiscountCode: z.infer<typeof DeleteDiscountCodeInputSchema>;
	generateDiscountCodes: z.infer<typeof GenerateDiscountCodesInputSchema>;
	createProductToDiscount: z.infer<typeof CreateProductToDiscountInputSchema>;
	deleteProductToDiscount: z.infer<typeof DeleteProductToDiscountInputSchema>;

	createSubscriber: z.infer<typeof CreateSubscriberInputSchema>;
	getSubscriber: z.infer<typeof GetSubscriberInputSchema>;
	listSubscribers: z.infer<typeof ListSubscribersInputSchema>;
	updateSubscriber: z.infer<typeof UpdateSubscriberInputSchema>;
	deleteSubscriber: z.infer<typeof DeleteSubscriberInputSchema>;
	createSubscriberChannel: z.infer<typeof CreateSubscriberChannelInputSchema>;
	getSubscribersChannel: z.infer<typeof GetSubscribersChannelInputSchema>;
	listSubscribersChannels: z.infer<typeof ListSubscribersChannelsInputSchema>;
	updateSubscribersChannel: z.infer<typeof UpdateSubscribersChannelInputSchema>;
	deleteSubscribersChannel: z.infer<typeof DeleteSubscribersChannelInputSchema>;
	createSubscriberTag: z.infer<typeof CreateSubscriberTagInputSchema>;
	getSubscriberTag: z.infer<typeof GetSubscriberTagInputSchema>;
	listSubscribersTags: z.infer<typeof ListSubscribersTagsInputSchema>;
	updateSubscriberTag: z.infer<typeof UpdateSubscriberTagInputSchema>;
	deleteSubscriberTag: z.infer<typeof DeleteSubscriberTagInputSchema>;

	createBlogPost: z.infer<typeof CreateBlogPostInputSchema>;
	getBlogPost: z.infer<typeof GetBlogPostInputSchema>;
	listBlogPosts: z.infer<typeof ListBlogPostsInputSchema>;
	updateBlogPost: z.infer<typeof UpdateBlogPostInputSchema>;
	deleteBlogPost: z.infer<typeof DeleteBlogPostInputSchema>;
	createBlogCategory: z.infer<typeof CreateBlogCategoryInputSchema>;
	getBlogCategory: z.infer<typeof GetBlogCategoryInputSchema>;
	listBlogCategories: z.infer<typeof ListBlogCategoriesInputSchema>;
	updateBlogCategory: z.infer<typeof UpdateBlogCategoryInputSchema>;
	deleteBlogCategory: z.infer<typeof DeleteBlogCategoryInputSchema>;
	createBlogTag: z.infer<typeof CreateBlogTagInputSchema>;
	getBlogTag: z.infer<typeof GetBlogTagInputSchema>;
	listBlogTags: z.infer<typeof ListBlogTagsInputSchema>;
	updateBlogTag: z.infer<typeof UpdateBlogTagInputSchema>;
	deleteBlogTag: z.infer<typeof DeleteBlogTagInputSchema>;
	getBlogAuthor: z.infer<typeof GetBlogAuthorInputSchema>;

	createVendor: z.infer<typeof CreateVendorInputSchema>;
	getVendor: z.infer<typeof GetVendorInputSchema>;
	listVendors: z.infer<typeof ListVendorsInputSchema>;
	updateVendor: z.infer<typeof UpdateVendorInputSchema>;
	deleteVendor: z.infer<typeof DeleteVendorInputSchema>;
	createRedirect: z.infer<typeof CreateRedirectInputSchema>;
	listRedirects: z.infer<typeof ListRedirectsInputSchema>;
	deleteRedirect: z.infer<typeof DeleteRedirectInputSchema>;
	getPaymentMethods: z.infer<typeof GetPaymentMethodsInputSchema>;
	listPaymentProviders: z.infer<typeof ListPaymentProvidersInputSchema>;
	getShippingMethods: z.infer<typeof GetShippingMethodsInputSchema>;
	listShippingProviders: z.infer<typeof ListShippingProvidersInputSchema>;

	createWebhook: z.infer<typeof CreateWebhookInputSchema>;
	getWebhook: z.infer<typeof GetWebhookInputSchema>;
	listWebhooks: z.infer<typeof ListWebhooksInputSchema>;
	updateWebhook: z.infer<typeof UpdateWebhookInputSchema>;
	deleteWebhook: z.infer<typeof DeleteWebhookInputSchema>;
};

export type CloudcartEndpointOutputs = {
	[K in keyof CloudcartEndpointInputs]: z.infer<typeof GenericResponseSchema>;
};

export const CloudcartEndpointInputSchemas = {
	createProduct: CreateProductInputSchema,
	getProduct: GetProductInputSchema,
	getProductWithRelations: GetProductWithRelationsInputSchema,
	listProducts: ListProductsInputSchema,
	updateProduct: UpdateProductInputSchema,
	deleteProduct: DeleteProductInputSchema,
	createLinkedProducts: CreateLinkedProductsInputSchema,
	getProductsLinkedProduct: GetProductsLinkedProductInputSchema,
	getProductsLinkedProducts: GetProductsLinkedProductsInputSchema,
	updateLinkedProduct: UpdateLinkedProductInputSchema,
	deleteLinkedProducts: DeleteLinkedProductsInputSchema,
	createImage: CreateImageInputSchema,
	getImage: GetImageInputSchema,
	listImages: ListImagesInputSchema,
	deleteImage: DeleteImageInputSchema,

	createCategory: CreateCategoryInputSchema,
	getCategory: GetCategoryInputSchema,
	listCategories: ListCategoriesInputSchema,
	updateCategory: UpdateCategoryInputSchema,
	deleteCategory: DeleteCategoryInputSchema,
	getCategoryProperties: GetCategoryPropertiesInputSchema,
	addCategoryProperties: AddCategoryPropertiesInputSchema,

	createProperty: CreatePropertyInputSchema,
	getProperty: GetPropertyInputSchema,
	listProperties: ListPropertiesInputSchema,
	updateProperty: UpdatePropertyInputSchema,
	deleteProperty: DeletePropertyInputSchema,
	createPropertyOption: CreatePropertyOptionInputSchema,
	getPropertyOption: GetPropertyOptionInputSchema,
	listPropertyOptions: ListPropertyOptionsInputSchema,
	updatePropertyOption: UpdatePropertyOptionInputSchema,
	deletePropertyOption: DeletePropertyOptionInputSchema,
	createProductsPropertyOptions: CreateProductsPropertyOptionsInputSchema,
	getPropertyOptionsRelationship: GetPropertyOptionsRelationshipInputSchema,

	createVariant: CreateVariantInputSchema,
	getVariant: GetVariantInputSchema,
	listVariants: ListVariantsInputSchema,
	updateVariant: UpdateVariantInputSchema,
	deleteVariant: DeleteVariantInputSchema,
	createVariantOption: CreateVariantOptionInputSchema,
	createVariantOptions: CreateVariantOptionsInputSchema,
	getVariantOption: GetVariantOptionInputSchema,
	listVariantOptions: ListVariantOptionsInputSchema,
	updateVariantOption: UpdateVariantOptionInputSchema,
	deleteVariantOption: DeleteVariantOptionInputSchema,
	createVariantParameter: CreateVariantParameterInputSchema,
	createVariantParameterForVariant: CreateVariantParameterForVariantInputSchema,
	getVariantParameter: GetVariantParameterInputSchema,
	listVariantParameters: ListVariantParametersInputSchema,
	updateVariantParameter: UpdateVariantParameterInputSchema,
	deleteVariantParameter: DeleteVariantParameterInputSchema,

	createCustomer: CreateCustomerInputSchema,
	getCustomer: GetCustomerInputSchema,
	listCustomers: ListCustomersInputSchema,
	updateCustomer: UpdateCustomerInputSchema,
	deleteCustomer: DeleteCustomerInputSchema,
	createCustomerGroup: CreateCustomerGroupInputSchema,
	getCustomerGroup: GetCustomerGroupInputSchema,
	listCustomerGroups: ListCustomerGroupsInputSchema,
	getCustomerGroupsCustomers: GetCustomerGroupsCustomersInputSchema,
	updateCustomerGroup: UpdateCustomerGroupInputSchema,
	deleteCustomerGroup: DeleteCustomerGroupInputSchema,
	createCustomerBillingAddress: CreateCustomerBillingAddressInputSchema,
	getCustomerBillingAddress: GetCustomerBillingAddressInputSchema,
	listCustomerBillingAddresses: ListCustomerBillingAddressesInputSchema,
	updateCustomerBillingAddress: UpdateCustomerBillingAddressInputSchema,
	deleteCustomerBillingAddress: DeleteCustomerBillingAddressInputSchema,
	createCustomerShippingAddress: CreateCustomerShippingAddressInputSchema,
	getCustomerShippingAddress: GetCustomerShippingAddressInputSchema,
	listCustomerShippingAddresses: ListCustomerShippingAddressesInputSchema,
	updateCustomerShippingAddress: UpdateCustomerShippingAddressInputSchema,
	deleteCustomerShippingAddress: DeleteCustomerShippingAddressInputSchema,
	createCustomerTag: CreateCustomerTagInputSchema,
	getCustomerTag: GetCustomerTagInputSchema,
	listCustomerTags: ListCustomerTagsInputSchema,
	updateCustomerTag: UpdateCustomerTagInputSchema,
	deleteCustomerTag: DeleteCustomerTagInputSchema,

	createOrder: CreateOrderInputSchema,
	listOrders: ListOrdersInputSchema,
	updateOrder: UpdateOrderInputSchema,
	deleteOrder: DeleteOrderInputSchema,
	listOrderBillingAddresses: ListOrderBillingAddressesInputSchema,
	listOrderShippingAddresses: ListOrderShippingAddressesInputSchema,
	listOrderProducts: ListOrderProductsInputSchema,
	listOrderProductsOptions: ListOrderProductsOptionsInputSchema,
	listOrderPayments: ListOrderPaymentsInputSchema,
	listOrderPaymentV2: ListOrderPaymentV2InputSchema,
	listOrderShipping: ListOrderShippingInputSchema,
	listOrderStatus: ListOrderStatusInputSchema,

	getCart: GetCartInputSchema,
	addToCart: AddToCartInputSchema,
	updateCartItem: UpdateCartItemInputSchema,
	removeFromCart: RemoveFromCartInputSchema,
	clearCart: ClearCartInputSchema,

	createDiscount: CreateDiscountInputSchema,
	deleteDiscount: DeleteDiscountInputSchema,
	createDiscountCode: CreateDiscountCodeInputSchema,
	listDiscountCodes: ListDiscountCodesInputSchema,
	updateDiscountCode: UpdateDiscountCodeInputSchema,
	deleteDiscountCode: DeleteDiscountCodeInputSchema,
	generateDiscountCodes: GenerateDiscountCodesInputSchema,
	createProductToDiscount: CreateProductToDiscountInputSchema,
	deleteProductToDiscount: DeleteProductToDiscountInputSchema,

	createSubscriber: CreateSubscriberInputSchema,
	getSubscriber: GetSubscriberInputSchema,
	listSubscribers: ListSubscribersInputSchema,
	updateSubscriber: UpdateSubscriberInputSchema,
	deleteSubscriber: DeleteSubscriberInputSchema,
	createSubscriberChannel: CreateSubscriberChannelInputSchema,
	getSubscribersChannel: GetSubscribersChannelInputSchema,
	listSubscribersChannels: ListSubscribersChannelsInputSchema,
	updateSubscribersChannel: UpdateSubscribersChannelInputSchema,
	deleteSubscribersChannel: DeleteSubscribersChannelInputSchema,
	createSubscriberTag: CreateSubscriberTagInputSchema,
	getSubscriberTag: GetSubscriberTagInputSchema,
	listSubscribersTags: ListSubscribersTagsInputSchema,
	updateSubscriberTag: UpdateSubscriberTagInputSchema,
	deleteSubscriberTag: DeleteSubscriberTagInputSchema,

	createBlogPost: CreateBlogPostInputSchema,
	getBlogPost: GetBlogPostInputSchema,
	listBlogPosts: ListBlogPostsInputSchema,
	updateBlogPost: UpdateBlogPostInputSchema,
	deleteBlogPost: DeleteBlogPostInputSchema,
	createBlogCategory: CreateBlogCategoryInputSchema,
	getBlogCategory: GetBlogCategoryInputSchema,
	listBlogCategories: ListBlogCategoriesInputSchema,
	updateBlogCategory: UpdateBlogCategoryInputSchema,
	deleteBlogCategory: DeleteBlogCategoryInputSchema,
	createBlogTag: CreateBlogTagInputSchema,
	getBlogTag: GetBlogTagInputSchema,
	listBlogTags: ListBlogTagsInputSchema,
	updateBlogTag: UpdateBlogTagInputSchema,
	deleteBlogTag: DeleteBlogTagInputSchema,
	getBlogAuthor: GetBlogAuthorInputSchema,

	createVendor: CreateVendorInputSchema,
	getVendor: GetVendorInputSchema,
	listVendors: ListVendorsInputSchema,
	updateVendor: UpdateVendorInputSchema,
	deleteVendor: DeleteVendorInputSchema,
	createRedirect: CreateRedirectInputSchema,
	listRedirects: ListRedirectsInputSchema,
	deleteRedirect: DeleteRedirectInputSchema,
	getPaymentMethods: GetPaymentMethodsInputSchema,
	listPaymentProviders: ListPaymentProvidersInputSchema,
	getShippingMethods: GetShippingMethodsInputSchema,
	listShippingProviders: ListShippingProvidersInputSchema,

	createWebhook: CreateWebhookInputSchema,
	getWebhook: GetWebhookInputSchema,
	listWebhooks: ListWebhooksInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
} as const;

export const CloudcartEndpointOutputSchemas = {
	createProduct: GenericResponseSchema,
	getProduct: GenericResponseSchema,
	getProductWithRelations: GenericResponseSchema,
	listProducts: GenericResponseSchema,
	updateProduct: GenericResponseSchema,
	deleteProduct: GenericResponseSchema,
	createLinkedProducts: GenericResponseSchema,
	getProductsLinkedProduct: GenericResponseSchema,
	getProductsLinkedProducts: GenericResponseSchema,
	updateLinkedProduct: GenericResponseSchema,
	deleteLinkedProducts: GenericResponseSchema,
	createImage: GenericResponseSchema,
	getImage: GenericResponseSchema,
	listImages: GenericResponseSchema,
	deleteImage: GenericResponseSchema,

	createCategory: GenericResponseSchema,
	getCategory: GenericResponseSchema,
	listCategories: GenericResponseSchema,
	updateCategory: GenericResponseSchema,
	deleteCategory: GenericResponseSchema,
	getCategoryProperties: GenericResponseSchema,
	addCategoryProperties: GenericResponseSchema,

	createProperty: GenericResponseSchema,
	getProperty: GenericResponseSchema,
	listProperties: GenericResponseSchema,
	updateProperty: GenericResponseSchema,
	deleteProperty: GenericResponseSchema,
	createPropertyOption: GenericResponseSchema,
	getPropertyOption: GenericResponseSchema,
	listPropertyOptions: GenericResponseSchema,
	updatePropertyOption: GenericResponseSchema,
	deletePropertyOption: GenericResponseSchema,
	createProductsPropertyOptions: GenericResponseSchema,
	getPropertyOptionsRelationship: GenericResponseSchema,

	createVariant: GenericResponseSchema,
	getVariant: GenericResponseSchema,
	listVariants: GenericResponseSchema,
	updateVariant: GenericResponseSchema,
	deleteVariant: GenericResponseSchema,
	createVariantOption: GenericResponseSchema,
	createVariantOptions: GenericResponseSchema,
	getVariantOption: GenericResponseSchema,
	listVariantOptions: GenericResponseSchema,
	updateVariantOption: GenericResponseSchema,
	deleteVariantOption: GenericResponseSchema,
	createVariantParameter: GenericResponseSchema,
	createVariantParameterForVariant: GenericResponseSchema,
	getVariantParameter: GenericResponseSchema,
	listVariantParameters: GenericResponseSchema,
	updateVariantParameter: GenericResponseSchema,
	deleteVariantParameter: GenericResponseSchema,

	createCustomer: GenericResponseSchema,
	getCustomer: GenericResponseSchema,
	listCustomers: GenericResponseSchema,
	updateCustomer: GenericResponseSchema,
	deleteCustomer: GenericResponseSchema,
	createCustomerGroup: GenericResponseSchema,
	getCustomerGroup: GenericResponseSchema,
	listCustomerGroups: GenericResponseSchema,
	getCustomerGroupsCustomers: GenericResponseSchema,
	updateCustomerGroup: GenericResponseSchema,
	deleteCustomerGroup: GenericResponseSchema,
	createCustomerBillingAddress: GenericResponseSchema,
	getCustomerBillingAddress: GenericResponseSchema,
	listCustomerBillingAddresses: GenericResponseSchema,
	updateCustomerBillingAddress: GenericResponseSchema,
	deleteCustomerBillingAddress: GenericResponseSchema,
	createCustomerShippingAddress: GenericResponseSchema,
	getCustomerShippingAddress: GenericResponseSchema,
	listCustomerShippingAddresses: GenericResponseSchema,
	updateCustomerShippingAddress: GenericResponseSchema,
	deleteCustomerShippingAddress: GenericResponseSchema,
	createCustomerTag: GenericResponseSchema,
	getCustomerTag: GenericResponseSchema,
	listCustomerTags: GenericResponseSchema,
	updateCustomerTag: GenericResponseSchema,
	deleteCustomerTag: GenericResponseSchema,

	createOrder: GenericResponseSchema,
	listOrders: GenericResponseSchema,
	updateOrder: GenericResponseSchema,
	deleteOrder: GenericResponseSchema,
	listOrderBillingAddresses: GenericResponseSchema,
	listOrderShippingAddresses: GenericResponseSchema,
	listOrderProducts: GenericResponseSchema,
	listOrderProductsOptions: GenericResponseSchema,
	listOrderPayments: GenericResponseSchema,
	listOrderPaymentV2: GenericResponseSchema,
	listOrderShipping: GenericResponseSchema,
	listOrderStatus: GenericResponseSchema,

	getCart: GenericResponseSchema,
	addToCart: GenericResponseSchema,
	updateCartItem: GenericResponseSchema,
	removeFromCart: GenericResponseSchema,
	clearCart: GenericResponseSchema,

	createDiscount: GenericResponseSchema,
	deleteDiscount: GenericResponseSchema,
	createDiscountCode: GenericResponseSchema,
	listDiscountCodes: GenericResponseSchema,
	updateDiscountCode: GenericResponseSchema,
	deleteDiscountCode: GenericResponseSchema,
	generateDiscountCodes: GenericResponseSchema,
	createProductToDiscount: GenericResponseSchema,
	deleteProductToDiscount: GenericResponseSchema,

	createSubscriber: GenericResponseSchema,
	getSubscriber: GenericResponseSchema,
	listSubscribers: GenericResponseSchema,
	updateSubscriber: GenericResponseSchema,
	deleteSubscriber: GenericResponseSchema,
	createSubscriberChannel: GenericResponseSchema,
	getSubscribersChannel: GenericResponseSchema,
	listSubscribersChannels: GenericResponseSchema,
	updateSubscribersChannel: GenericResponseSchema,
	deleteSubscribersChannel: GenericResponseSchema,
	createSubscriberTag: GenericResponseSchema,
	getSubscriberTag: GenericResponseSchema,
	listSubscribersTags: GenericResponseSchema,
	updateSubscriberTag: GenericResponseSchema,
	deleteSubscriberTag: GenericResponseSchema,

	createBlogPost: GenericResponseSchema,
	getBlogPost: GenericResponseSchema,
	listBlogPosts: GenericResponseSchema,
	updateBlogPost: GenericResponseSchema,
	deleteBlogPost: GenericResponseSchema,
	createBlogCategory: GenericResponseSchema,
	getBlogCategory: GenericResponseSchema,
	listBlogCategories: GenericResponseSchema,
	updateBlogCategory: GenericResponseSchema,
	deleteBlogCategory: GenericResponseSchema,
	createBlogTag: GenericResponseSchema,
	getBlogTag: GenericResponseSchema,
	listBlogTags: GenericResponseSchema,
	updateBlogTag: GenericResponseSchema,
	deleteBlogTag: GenericResponseSchema,
	getBlogAuthor: GenericResponseSchema,

	createVendor: GenericResponseSchema,
	getVendor: GenericResponseSchema,
	listVendors: GenericResponseSchema,
	updateVendor: GenericResponseSchema,
	deleteVendor: GenericResponseSchema,
	createRedirect: GenericResponseSchema,
	listRedirects: GenericResponseSchema,
	deleteRedirect: GenericResponseSchema,
	getPaymentMethods: GenericResponseSchema,
	listPaymentProviders: GenericResponseSchema,
	getShippingMethods: GenericResponseSchema,
	listShippingProviders: GenericResponseSchema,

	createWebhook: GenericResponseSchema,
	getWebhook: GenericResponseSchema,
	listWebhooks: GenericResponseSchema,
	updateWebhook: GenericResponseSchema,
	deleteWebhook: GenericResponseSchema,
} as const;

