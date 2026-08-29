import * as BlogsExports from './blogs';
import * as CartExports from './cart';
import * as CategoriesExports from './categories';
import * as CustomersExports from './customers';
import * as DiscountsExports from './discounts';
import * as MiscExports from './misc';
import * as OrdersExports from './orders';
import * as ProductsExports from './products';
import * as PropertiesExports from './properties';
import * as SubscribersExports from './subscribers';
import * as VariantsExports from './variants';
import * as WebhooksExports from './webhooks';

export const Products = ProductsExports;
export const Categories = CategoriesExports;
export const Properties = PropertiesExports;
export const Variants = VariantsExports;
export const Customers = CustomersExports;
export const Orders = OrdersExports;
export const Cart = CartExports;
export const Discounts = DiscountsExports;
export const Subscribers = SubscribersExports;
export const Blogs = BlogsExports;
export const Misc = MiscExports;
export const Webhooks = WebhooksExports;

export * from './types';
