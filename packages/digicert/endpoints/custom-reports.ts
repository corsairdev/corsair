import { logEventFromContext } from 'corsair/core';
import type { DigicertEndpoints } from '..';
import { makeDigicertRequest } from '../client';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './types';

function quote(value: string | number): string {
	return JSON.stringify(value);
}

export const customReportOrders: DigicertEndpoints['customReports']['orders'] =
	async (ctx, input) => {
		const parsed = DigicertEndpointInputSchemas.customReportQuery.parse(input);
		const args: string[] = [];
		const scalarArgs = {
			id: parsed.id,
			status: parsed.status,
			valid_from: parsed.valid_from,
			valid_till: parsed.valid_till,
			container_id: parsed.container_id,
			organization_id: parsed.organization_id,
			product_name_id: parsed.product_name_id,
			serial_number: parsed.serial_number,
			signature_hash: parsed.signature_hash,
			user_id: parsed.user_id,
			date_created: parsed.date_created,
			ca_cert_id: parsed.ca_cert_id,
			common_name: parsed.common_name,
			dns_names: parsed.dns_names,
			locale: parsed.locale,
			thumbprint: parsed.thumbprint,
			email: parsed.email,
			search: parsed.search,
			offset: parsed.offset,
			limit: parsed.limit,
		};
		for (const [key, value] of Object.entries(scalarArgs)) {
			if (value === undefined) continue;
			args.push(`${key}:${quote(value)}`);
		}
		if (parsed.sort)
			args.push(`sort:[${quote(parsed.sort[0])},${quote(parsed.sort[1])}]`);
		const query = `{order_details${args.length > 0 ? `(${args.join(',')})` : ''}{${parsed.fields.join(' ')}}}`;
		const response = await makeDigicertRequest(
			'certcentral',
			'/reports/query',
			ctx.key,
			{
				method: 'POST',
				region: ctx.options.certCentralRegion,
				body: { query },
			},
		);
		const output =
			DigicertEndpointOutputSchemas.customReportQuery.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.customReports.orders',
			{ count: output.data.order_details?.length ?? 0 },
			'completed',
		);
		return output;
	};

export const customReportOrderById: DigicertEndpoints['customReports']['orderById'] =
	async (ctx, input) => {
		const parsed = DigicertEndpointInputSchemas.customReportById.parse(input);
		const query = `{order_details_by_id(id:${parsed.id}){${parsed.fields.join(' ')}}}`;
		const response = await makeDigicertRequest(
			'certcentral',
			'/reports/query',
			ctx.key,
			{
				method: 'POST',
				region: ctx.options.certCentralRegion,
				body: { query },
			},
		);
		const output =
			DigicertEndpointOutputSchemas.customReportById.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.customReports.orderById',
			{},
			'completed',
		);
		return output;
	};
