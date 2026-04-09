export declare function jsonbTextField<Data extends Record<string, unknown>>(key: Extract<keyof Data, string>): import("kysely").RawBuilder<string>;
export declare function jsonbNumberField<Data extends Record<string, unknown>>(key: Extract<keyof Data, string>): import("kysely").RawBuilder<number>;
export declare function jsonbBooleanField<Data extends Record<string, unknown>>(key: Extract<keyof Data, string>): import("kysely").RawBuilder<boolean>;
export declare function jsonbTimestampField<Data extends Record<string, unknown>>(key: Extract<keyof Data, string>): import("kysely").RawBuilder<Date>;
//# sourceMappingURL=postgres.d.ts.map