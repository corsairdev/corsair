import { deleteOf, getOf, listOf, saveOf } from './crud';
import { transfer, validate } from './licensees';
import { listLicenses, listProducts } from './list';
import {
	LicenseCreateInputSchema,
	LicenseDeleteInputSchema,
	LicenseeCreateInputSchema,
	LicenseeDeleteInputSchema,
	LicenseeGetInputSchema,
	LicenseeUpdateInputSchema,
	LicenseGetInputSchema,
	LicenseTemplateCreateInputSchema,
	LicenseTemplateDeleteInputSchema,
	LicenseTemplateGetInputSchema,
	LicenseTemplateUpdateInputSchema,
	LicenseUpdateInputSchema,
	ProductCreateInputSchema,
	ProductDeleteInputSchema,
	ProductGetInputSchema,
	ProductModuleCreateInputSchema,
	ProductModuleDeleteInputSchema,
	ProductModuleGetInputSchema,
	ProductModuleUpdateInputSchema,
	ProductUpdateInputSchema,
	TransactionGetInputSchema,
} from './types';

export { listLicenses, listProducts };

const ev = (name: string) => `labs64netlicensing.${name}`;

export const Products = {
	list: listProducts,
	get: getOf(
		'product',
		ev('products.get'),
		ProductGetInputSchema,
		'productNumber',
	),
	create: saveOf('product', ev('products.create'), ProductCreateInputSchema),
	update: saveOf(
		'product',
		ev('products.update'),
		ProductUpdateInputSchema,
		'productNumber',
	),
	delete: deleteOf(
		'product',
		ev('products.delete'),
		ProductDeleteInputSchema,
		'productNumber',
	),
};

export const ProductModules = {
	list: listOf('productmodule', ev('productModules.list')),
	get: getOf(
		'productmodule',
		ev('productModules.get'),
		ProductModuleGetInputSchema,
		'productModuleNumber',
	),
	create: saveOf(
		'productmodule',
		ev('productModules.create'),
		ProductModuleCreateInputSchema,
	),
	update: saveOf(
		'productmodule',
		ev('productModules.update'),
		ProductModuleUpdateInputSchema,
		'productModuleNumber',
	),
	delete: deleteOf(
		'productmodule',
		ev('productModules.delete'),
		ProductModuleDeleteInputSchema,
		'productModuleNumber',
	),
};

export const LicenseTemplates = {
	list: listOf('licensetemplate', ev('licenseTemplates.list')),
	get: getOf(
		'licensetemplate',
		ev('licenseTemplates.get'),
		LicenseTemplateGetInputSchema,
		'licenseTemplateNumber',
	),
	create: saveOf(
		'licensetemplate',
		ev('licenseTemplates.create'),
		LicenseTemplateCreateInputSchema,
	),
	update: saveOf(
		'licensetemplate',
		ev('licenseTemplates.update'),
		LicenseTemplateUpdateInputSchema,
		'licenseTemplateNumber',
	),
	delete: deleteOf(
		'licensetemplate',
		ev('licenseTemplates.delete'),
		LicenseTemplateDeleteInputSchema,
		'licenseTemplateNumber',
	),
};

export const Licensees = {
	list: listOf('licensee', ev('licensees.list')),
	get: getOf(
		'licensee',
		ev('licensees.get'),
		LicenseeGetInputSchema,
		'licenseeNumber',
	),
	create: saveOf('licensee', ev('licensees.create'), LicenseeCreateInputSchema),
	update: saveOf(
		'licensee',
		ev('licensees.update'),
		LicenseeUpdateInputSchema,
		'licenseeNumber',
	),
	delete: deleteOf(
		'licensee',
		ev('licensees.delete'),
		LicenseeDeleteInputSchema,
		'licenseeNumber',
	),
	validate,
	transfer,
};

export const Licenses = {
	list: listLicenses,
	get: getOf(
		'license',
		ev('licenses.get'),
		LicenseGetInputSchema,
		'licenseNumber',
	),
	create: saveOf('license', ev('licenses.create'), LicenseCreateInputSchema),
	update: saveOf(
		'license',
		ev('licenses.update'),
		LicenseUpdateInputSchema,
		'licenseNumber',
	),
	delete: deleteOf(
		'license',
		ev('licenses.delete'),
		LicenseDeleteInputSchema,
		'licenseNumber',
	),
};

export const Transactions = {
	list: listOf('transaction', ev('transactions.list')),
	get: getOf(
		'transaction',
		ev('transactions.get'),
		TransactionGetInputSchema,
		'transactionNumber',
	),
};
