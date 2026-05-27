import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormFieldSchema } from '../api';
import { Button, Input, Textarea } from './Primitives';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type FormValue =
	| string
	| number
	| boolean
	| null
	| FormValue[]
	| { [key: string]: FormValue };

type FieldRendererProps = {
	name: string;
	schema: FormFieldSchema;
	value: FormValue;
	onChange: (value: FormValue) => void;
	path?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function defaultValueFor(schema: FormFieldSchema): FormValue {
	if (schema.optional) return null;
	switch (schema.kind) {
		case 'string':
			return '';
		case 'number':
			return 0;
		case 'boolean':
			return false;
		case 'literal':
			return schema.value as FormValue;
		case 'object': {
			const obj: Record<string, FormValue> = {};
			for (const [key, field] of Object.entries(schema.fields)) {
				obj[key] = defaultValueFor(field);
			}
			return obj;
		}
		case 'array':
			return [];
		default:
			return null;
	}
}

// Returns `unknown` because the output shape depends on the schema —
// it could be a primitive, array, or nested object at any level.
function formValueToJson(value: FormValue): unknown {
	if (value === null || value === undefined) return undefined;
	if (Array.isArray(value)) return value.map(formValueToJson);
	if (typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, FormValue>)) {
			const json = formValueToJson(v);
			if (json !== undefined) out[k] = json;
		}
		return out;
	}
	return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldLabel
// ─────────────────────────────────────────────────────────────────────────────

function FieldLabel({
	name,
	schema,
}: {
	name: string;
	schema: FormFieldSchema;
}) {
	return (
		<label className="block text-xs font-medium text-[var(--color-text)] mb-1">
			{name}
			{!schema.optional && (
				<span className="text-[var(--color-err)] ml-0.5">*</span>
			)}
			{schema.description && (
				<span className="text-[var(--color-text-muted)] font-normal ml-1.5">
					{schema.description}
				</span>
			)}
		</label>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// StringField
// ─────────────────────────────────────────────────────────────────────────────

function StringField({
	schema,
	value,
	onChange,
}: {
	schema: Extract<FormFieldSchema, { kind: 'string' }>;
	value: FormValue;
	onChange: (v: FormValue) => void;
}) {
	if (schema.enum && schema.enum.length > 0) {
		return (
			<select
				className="w-full h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)]"
				value={String(value ?? '')}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="">-- select --</option>
				{schema.enum.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
		);
	}
	return (
		<Input
			type="text"
			value={String(value ?? '')}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// NumberField
// ─────────────────────────────────────────────────────────────────────────────

function NumberField({
	value,
	onChange,
}: {
	value: FormValue;
	onChange: (v: FormValue) => void;
}) {
	return (
		<Input
			type="number"
			value={value === null || value === undefined ? '' : String(value)}
			onChange={(e) => {
				const raw = e.target.value;
				onChange(raw === '' ? null : Number(raw));
			}}
		/>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// BooleanField
// ─────────────────────────────────────────────────────────────────────────────

function BooleanField({
	value,
	onChange,
}: {
	value: FormValue;
	onChange: (v: FormValue) => void;
}) {
	return (
		<label className="inline-flex items-center gap-2 text-xs cursor-pointer">
			<input
				type="checkbox"
				className="accent-[var(--color-accent)]"
				checked={!!value}
				onChange={(e) => onChange(e.target.checked)}
			/>
			<span className="text-[var(--color-text-muted)]">
				{value ? 'true' : 'false'}
			</span>
		</label>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// ObjectField
// ─────────────────────────────────────────────────────────────────────────────

function ObjectField({
	schema,
	value,
	onChange,
	path,
}: {
	schema: Extract<FormFieldSchema, { kind: 'object' }>;
	value: FormValue;
	onChange: (v: FormValue) => void;
	path: string;
}) {
	const objValue = (
		typeof value === 'object' && value !== null && !Array.isArray(value)
			? value
			: {}
	) as Record<string, FormValue>;

	const handleFieldChange = useCallback(
		(key: string, fieldVal: FormValue) => {
			onChange({ ...objValue, [key]: fieldVal });
		},
		[objValue, onChange],
	);

	return (
		<div className="border border-[var(--color-border)] rounded-md p-3 space-y-3 bg-[var(--color-bg)]/50">
			{Object.entries(schema.fields).map(([key, fieldSchema]) => (
				<FieldRenderer
					key={key}
					name={key}
					schema={fieldSchema}
					value={objValue[key] ?? defaultValueFor(fieldSchema)}
					onChange={(v) => handleFieldChange(key, v)}
					path={`${path}.${key}`}
				/>
			))}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// ArrayField
// ─────────────────────────────────────────────────────────────────────────────

function ArrayField({
	schema,
	value,
	onChange,
	path,
}: {
	schema: Extract<FormFieldSchema, { kind: 'array' }>;
	value: FormValue;
	onChange: (v: FormValue) => void;
	path: string;
}) {
	const arrValue = Array.isArray(value) ? value : [];

	const addItem = useCallback(() => {
		onChange([...arrValue, defaultValueFor(schema.items)]);
	}, [arrValue, onChange, schema.items]);

	const removeItem = useCallback(
		(index: number) => {
			onChange(arrValue.filter((_, i) => i !== index));
		},
		[arrValue, onChange],
	);

	const updateItem = useCallback(
		(index: number, itemVal: FormValue) => {
			const next = [...arrValue];
			next[index] = itemVal;
			onChange(next);
		},
		[arrValue, onChange],
	);

	return (
		<div className="space-y-2">
			{arrValue.map((item, i) => (
				<div key={`${path}-${i}`} className="flex items-start gap-2">
					<div className="flex-1">
						<FieldRenderer
							name={`[${i}]`}
							schema={schema.items}
							value={item}
							onChange={(v) => updateItem(i, v)}
							path={`${path}[${i}]`}
						/>
					</div>
					<Button
						type="button"
						variant="ghost"
						className="mt-5 text-[var(--color-err)] shrink-0"
						onClick={() => removeItem(i)}
					>
						Remove
					</Button>
				</div>
			))}
			<Button type="button" variant="ghost" onClick={addItem}>
				+ Add item
			</Button>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldRenderer
// ─────────────────────────────────────────────────────────────────────────────

function FieldRenderer({
	name,
	schema,
	value,
	onChange,
	path = '',
}: FieldRendererProps) {
	return (
		<div>
			<FieldLabel name={name} schema={schema} />
			{schema.kind === 'string' && (
				<StringField schema={schema} value={value} onChange={onChange} />
			)}
			{schema.kind === 'number' && (
				<NumberField value={value} onChange={onChange} />
			)}
			{schema.kind === 'boolean' && (
				<BooleanField value={value} onChange={onChange} />
			)}
			{schema.kind === 'object' && (
				<ObjectField
					schema={schema}
					value={value}
					onChange={onChange}
					path={path}
				/>
			)}
			{schema.kind === 'array' && (
				<ArrayField
					schema={schema}
					value={value}
					onChange={onChange}
					path={path}
				/>
			)}
			{schema.kind === 'literal' && (
				<Input
					type="text"
					value={String(value ?? schema.value)}
					disabled
					className="opacity-70"
				/>
			)}
			{schema.kind === 'unknown' && (
				<Input
					type="text"
					placeholder="(unsupported field type — use JSON editor)"
					disabled
				/>
			)}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// OperationInputForm (public)
// ─────────────────────────────────────────────────────────────────────────────

type OperationInputFormProps = {
	schema: FormFieldSchema;
	onChange: (json: Record<string, unknown>) => void;
	initialValue?: Record<string, unknown>;
};

export function OperationInputForm({
	schema,
	onChange,
	initialValue,
}: OperationInputFormProps) {
	// Intentionally empty deps — initial values are computed once per mount.
	// A new operation selection causes a full remount via React key, resetting state.
	const initial = useMemo<FormValue>(() => {
		if (initialValue && typeof initialValue === 'object') {
			return initialValue as FormValue;
		}
		return defaultValueFor(schema);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const [value, setValue] = useState<FormValue>(initial);

	useEffect(() => {
		const json = formValueToJson(value);
		onChange(
			json && typeof json === 'object' && !Array.isArray(json)
				? (json as Record<string, unknown>)
				: {},
		);
	}, [value, onChange]);

	if (schema.kind !== 'object') {
		return (
			<div className="text-xs text-[var(--color-text-muted)]">
				Top-level schema is not an object. Use the JSON editor.
			</div>
		);
	}

	return (
		<ObjectField schema={schema} value={value} onChange={setValue} path="" />
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// JsonFallbackEditor (public)
// ─────────────────────────────────────────────────────────────────────────────

export function JsonFallbackEditor({
	value,
	onChange,
	rows = 8,
}: {
	value: string;
	onChange: (value: string) => void;
	rows?: number;
}) {
	const [localError, setLocalError] = useState<string | null>(null);

	const handleChange = useCallback(
		(raw: string) => {
			onChange(raw);
			try {
				JSON.parse(raw);
				setLocalError(null);
			} catch (e) {
				setLocalError((e as Error).message);
			}
		},
		[onChange],
	);

	return (
		<div>
			<Textarea
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				rows={rows}
				className="font-mono"
			/>
			{localError && (
				<div className="text-xs text-[var(--color-err)] mt-1">
					JSON: {localError}
				</div>
			)}
		</div>
	);
}
