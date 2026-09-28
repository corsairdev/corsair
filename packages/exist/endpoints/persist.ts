import type { ExistContext } from '../index';
import type {
	AttributesListResponse,
	AttributesListWithValuesResponse,
} from './types';

type AttributeRow = AttributesListResponse['results'][number];

function attributeRow(attribute: AttributeRow) {
	return {
		id: attribute.name,
		name: attribute.name,
		label: attribute.label,
		template: attribute.template ?? null,
		group_name: attribute.group.name,
		group_label: attribute.group.label,
		service_name: attribute.service?.name ?? null,
		active: attribute.active,
		manual: attribute.manual,
		priority: attribute.priority,
		value_type: attribute.value_type,
		value_type_description: attribute.value_type_description,
	};
}

/**
 * Mirrors attribute definitions locally. Persistence is best-effort: a failing
 * local write must not turn a successful API read into an error.
 */
export async function persistAttributes(
	ctx: ExistContext,
	attributes: readonly AttributeRow[],
): Promise<void> {
	if (!ctx.db.attributes) return;
	try {
		for (const attribute of attributes) {
			await ctx.db.attributes.upsertByEntityId(
				attribute.name,
				attributeRow(attribute),
			);
		}
	} catch (error) {
		console.warn('Failed to save Exist attributes to database:', error);
	}
}

/** Mirrors attribute definitions together with the day values Exist returned. */
export async function persistAttributesWithValues(
	ctx: ExistContext,
	attributes: readonly AttributesListWithValuesResponse['results'][number][],
): Promise<void> {
	await persistAttributes(ctx, attributes);
	if (!ctx.db.attributeValues) return;
	try {
		for (const attribute of attributes) {
			for (const entry of attribute.values) {
				await ctx.db.attributeValues.upsertByEntityId(
					`${attribute.name}:${entry.date}`,
					{
						id: `${attribute.name}:${entry.date}`,
						attribute: attribute.name,
						date: entry.date,
						value: entry.value,
					},
				);
			}
		}
	} catch (error) {
		console.warn('Failed to save Exist attribute values to database:', error);
	}
}
