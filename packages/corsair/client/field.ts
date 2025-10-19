export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "datetime"
  | "enum"
  | "markdown"
  | "image"
  | "relation"
  | "relationMany"
  | "computed";

// Field definition - internal representation
export interface FieldDefinition {
  type: FieldType;
  config: any;
  targetModel?: string; // For relations
  computeFn?: () => string; // For computed fields
}

// Base field configuration
export interface BaseFieldConfig {
  nullable?: boolean;
  unique?: boolean;
}

// String field configuration
export interface StringFieldConfig extends BaseFieldConfig {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  default?: string;
}

function string(config?: StringFieldConfig): FieldDefinition {
  return {
    type: "string",
    config: config || {},
  };
}

// Number field configuration
export interface NumberFieldConfig extends BaseFieldConfig {
  min?: number;
  max?: number;
  integer?: boolean;
  default?: number;
}

function number(config?: NumberFieldConfig): FieldDefinition {
  return {
    type: "number",
    config: config || {},
  };
}

function boolean(config?: BaseFieldConfig): FieldDefinition {
  return {
    type: "boolean",
    config: config || {},
  };
}

// Datetime field configuration
export interface DatetimeFieldConfig extends BaseFieldConfig {
  default?: "now" | string;
}

function datetime(config?: DatetimeFieldConfig): FieldDefinition {
  return {
    type: "datetime",
    config: config || {},
  };
}

// Enum field configuration
export interface EnumFieldConfig<T extends readonly string[]>
  extends BaseFieldConfig {
  default?: T[number];
}

function enumField<T extends readonly string[]>(
  values: T,
  config?: EnumFieldConfig<T>
): FieldDefinition {
  return {
    type: "enum",
    config: {
      values: [...values],
      ...(config || {}),
    },
  };
}

function markdown(config?: StringFieldConfig): FieldDefinition {
  return {
    type: "markdown",
    config: config || {},
  };
}

// Relation field configuration
export interface RelationFieldConfig extends BaseFieldConfig {}

function relation(
  targetModel: string,
  config?: RelationFieldConfig
): FieldDefinition {
  return {
    type: "relation",
    targetModel,
    config: config || {},
  };
}

// RelationMany field configuration
export interface RelationManyFieldConfig {
  as?: string; // For self-referential relationships
  through?: string; // For explicit join table
}

function relationMany(
  targetModel: string,
  config?: RelationManyFieldConfig
): FieldDefinition {
  return {
    type: "relationMany",
    targetModel,
    config: config || {},
  };
}

// Computed field configuration
export interface ComputedFieldConfig {
  description: string;
}

function computed(config?: ComputedFieldConfig): FieldDefinition {
  return {
    type: "computed",
    config: config || {},
  };
}

export const field = {
  string,
  number,
  boolean,
  datetime,
  enum: enumField,
  markdown,
  relation,
  relationMany,
  computed,
};

// Access control rules
export type AccessRule = string; // Natural language access rules

export interface AccessControl {
  read?: AccessRule;
  create?: AccessRule;
  update?: AccessRule;
  delete?: AccessRule;
}

// Constraints
export type Constraints = Record<string, string>; // Natural language constraints

// Model schema definition
export type ModelSchema = {
  fields: Record<string, FieldDefinition>;
  access?: AccessControl;
  constraints?: Constraints;
};

// Schema type - recursive definition to enforce relation constraints
export type Schema = Record<string, ModelSchema>;
