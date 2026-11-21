import type {
	openApiSchemaContracts,
	zohoBooksOperationContracts,
} from '../openapi';
import type {
	JsonValue,
	ZohoBooksBinaryFile,
	ZohoBooksOperationDefinition,
} from './openapi-types';

type Operation = (typeof zohoBooksOperationContracts)[number];
type OperationGroup = keyof typeof openApiSchemaContracts;
type SchemaGroups = typeof openApiSchemaContracts;
type Depth = readonly 0[];

export const zohoBooksOperationId: unique symbol = Symbol(
	'zohoBooksOperationId',
);

type Simplify<T> = { [Key in keyof T]: T[Key] } & {};

type UnionToIntersection<Union> = (
	Union extends Union
		? (value: Union) => void
		: never
) extends (value: infer Intersection) => void
	? Intersection
	: never;

type SchemaReference<
	Group extends OperationGroup,
	Reference extends string,
	CurrentDepth extends Depth,
> = Reference extends `#/components/schemas/${infer Name}`
	? Name extends keyof SchemaGroups[Group]
		? SchemaToType<SchemaGroups[Group][Name], Group, [...CurrentDepth, 0]>
		: JsonValue
	: JsonValue;

type RequiredSchemaKeys<Schema> = Schema extends {
	required: readonly (infer Key extends string)[];
}
	? Key
	: never;

type PatternProperties<
	Properties,
	Group extends OperationGroup,
	CurrentDepth extends Depth,
> = Properties extends object
	? UnionToIntersection<
			{
				[Pattern in keyof Properties]: Pattern extends '^cf_[A-Za-z0-9_]+$'
					? {
							[key in `cf_${string}`]: SchemaToType<
								Properties[Pattern],
								Group,
								[...CurrentDepth, 0]
							>;
						}
					: Record<
							string,
							SchemaToType<Properties[Pattern], Group, [...CurrentDepth, 0]>
						>;
			}[keyof Properties]
		>
	: {};

type ObjectProperties<
	Schema,
	Group extends OperationGroup,
	CurrentDepth extends Depth,
> = Schema extends {
	properties: infer Properties extends object;
}
	? Simplify<
			{
				[Key in Extract<
					RequiredSchemaKeys<Schema>,
					keyof Properties
				>]-?: SchemaToType<Properties[Key], Group, [...CurrentDepth, 0]>;
			} & {
				[Key in Exclude<
					keyof Properties,
					RequiredSchemaKeys<Schema>
				>]?: SchemaToType<Properties[Key], Group, [...CurrentDepth, 0]>;
			} & (Schema extends { patternProperties: infer Patterns }
					? PatternProperties<Patterns, Group, CurrentDepth>
					: {})
		>
	: Schema extends { additionalProperties: infer Additional }
		? Additional extends false
			? Record<never, never>
			: Additional extends true
				? Record<string, JsonValue>
				: SchemaToType<
							Additional,
							Group,
							[...CurrentDepth, 0]
						> extends infer Value
					? Record<string, Value>
					: Record<string, JsonValue>
		: Record<string, JsonValue>;

type SchemaToType<
	Schema,
	Group extends OperationGroup,
	CurrentDepth extends Depth = [],
> = CurrentDepth['length'] extends 12
	? JsonValue
	: Schema extends { $ref: infer Reference extends string }
		? SchemaReference<Group, Reference, CurrentDepth>
		: Schema extends { const: infer Constant }
			? Constant extends JsonValue
				? Constant
				: JsonValue
			: Schema extends { enum: readonly (infer Member)[] }
				? Member extends JsonValue
					? Member
					: JsonValue
				: Schema extends { oneOf: readonly (infer Variant)[] }
					? SchemaToType<Variant, Group, [...CurrentDepth, 0]>
					: Schema extends { anyOf: readonly (infer Variant)[] }
						? SchemaToType<Variant, Group, [...CurrentDepth, 0]>
						: Schema extends { allOf: readonly (infer Part)[] }
							? UnionToIntersection<
									SchemaToType<Part, Group, [...CurrentDepth, 0]>
								>
							: Schema extends { format: 'binary' }
								? ZohoBooksBinaryFile | string
								: Schema extends { type: 'string' }
									? string
									: Schema extends { type: 'integer' | 'number' }
										? number
										: Schema extends { type: 'boolean' }
											? boolean
											: Schema extends {
														items: infer Item;
														type: 'array';
													}
												? SchemaToType<Item, Group, [...CurrentDepth, 0]>[]
												: Schema extends { type: 'object' }
													? ObjectProperties<Schema, Group, CurrentDepth>
													: Schema extends { nullable: true }
														? JsonValue | null
														: JsonValue;

type ParametersFor<
	OperationType,
	Location extends ZohoBooksOperationDefinition['parameters'][number]['in'],
> = OperationType extends {
	parameters: readonly (infer Parameter)[];
}
	? Extract<Parameter, { in: Location }>
	: never;

type ParameterName<Parameter> = Parameter extends {
	name: infer Name extends string;
}
	? Name
	: never;

type ParameterFields<
	OperationType,
	Location extends ZohoBooksOperationDefinition['parameters'][number]['in'],
	Group extends OperationGroup,
> = UnionToIntersection<
	ParametersFor<OperationType, Location> extends infer Parameter
		? Parameter extends { name: infer Name extends string }
			? Parameter extends { schema: infer Schema }
				? Parameter extends { required: true }
					? { [Key in Name]: SchemaToType<Schema, Group> }
					: { [Key in Name]?: SchemaToType<Schema, Group> }
				: Parameter extends { required: true }
					? { [Key in Name]: JsonValue }
					: { [Key in Name]?: JsonValue }
			: never
		: never
>;

type RequiredParameterNames<
	OperationType,
	Location extends ZohoBooksOperationDefinition['parameters'][number]['in'],
> = ParameterName<
	Extract<ParametersFor<OperationType, Location>, { required: true }>
>;

type ParameterGroupInput<
	OperationType,
	Location extends ZohoBooksOperationDefinition['parameters'][number]['in'],
	Group extends OperationGroup,
	Property extends 'pathParams' | 'query' | 'headers',
> = [RequiredParameterNames<OperationType, Location>] extends [never]
	? {
			[Key in Property]?: Simplify<
				ParameterFields<OperationType, Location, Group>
			>;
		}
	: {
			[Key in Property]: Simplify<
				ParameterFields<OperationType, Location, Group>
			>;
		};

type BodyInput<
	OperationType,
	Group extends OperationGroup,
> = OperationType extends {
	request: infer Request;
}
	? Request extends { schema: infer Schema }
		? Request extends { required: true }
			? { body: SchemaToType<Schema, Group> }
			: { body?: SchemaToType<Schema, Group> }
		: Request extends { required: true }
			? { body: JsonValue }
			: { body?: JsonValue }
	: { body?: never };

type InputForOperation<OperationType> = OperationType extends {
	group: infer Group extends OperationGroup;
}
	? Simplify<
			ParameterGroupInput<OperationType, 'path', Group, 'pathParams'> &
				ParameterGroupInput<OperationType, 'query', Group, 'query'> &
				ParameterGroupInput<OperationType, 'header', Group, 'headers'> &
				BodyInput<OperationType, Group>
		>
	: never;

type ResponseType<Response, Group extends OperationGroup> = Response extends {
	contentType: infer ContentType extends string;
}
	? Lowercase<ContentType> extends 'application/x-empty'
		? null
		: Lowercase<ContentType> extends `${string}json${string}`
			? Response extends { schema: infer Schema }
				? SchemaToType<Schema, Group>
				: JsonValue
			: ZohoBooksOperationOutputBinary
	: JsonValue;

type ZohoBooksOperationOutputBinary = {
	kind: 'binary';
	contentType: string;
	base64: string;
	byteLength: number;
};

type OutputForOperation<OperationType> = OperationType extends {
	group: infer Group extends OperationGroup;
	responses: readonly (infer Response)[];
}
	? ResponseType<Response, Group>
	: never;

export type ZohoBooksOperationId = Operation['id'];

export type ZohoBooksOperationFor<Id extends ZohoBooksOperationId> = Extract<
	Operation,
	{ id: Id }
>;

export type ZohoBooksOperationInputFor<Id extends ZohoBooksOperationId> =
	InputForOperation<ZohoBooksOperationFor<Id>>;

export type ZohoBooksOperationOutputFor<Id extends ZohoBooksOperationId> =
	OutputForOperation<ZohoBooksOperationFor<Id>>;

export type AnyZohoBooksOperationInput = InputForOperation<Operation>;

type OperationIdOf<Endpoint> = Endpoint extends {
	readonly [zohoBooksOperationId]: infer Id;
}
	? Id
	: never;

type BindZohoBooksOperationEndpoint<Endpoint> =
	OperationIdOf<Endpoint> extends infer Id
		? Id extends ZohoBooksOperationId
			? (
					input: ZohoBooksOperationInputFor<Id>,
				) => Promise<ZohoBooksOperationOutputFor<Id>>
			: never
		: never;

type BindZohoBooksOperationTree<Tree> = {
	[Key in keyof Tree]: [OperationIdOf<Tree[Key]>] extends [never]
		? Tree[Key] extends object
			? BindZohoBooksOperationTree<Tree[Key]>
			: never
		: BindZohoBooksOperationEndpoint<Tree[Key]>;
};

export type BindZohoBooksOperationEndpoints<Tree> =
	BindZohoBooksOperationTree<Tree>;
