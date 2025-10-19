import { type AnyPgColumn, type PgPolicyToOption } from "../pg-core/index.cjs";
import { PgRole } from "../pg-core/roles.cjs";
import { type SQL } from "../sql/sql.cjs";
/**
 * Generates a set of PostgreSQL row-level security (RLS) policies for CRUD operations based on the provided options.
 *
 * @param options - An object containing the policy configuration.
 * @param options.role - The PostgreSQL role(s) to apply the policy to. Can be a single `PgRole` instance or an array of `PgRole` instances or role names.
 * @param options.read - The SQL expression or boolean value that defines the read policy. Set to `true` to allow all reads, `false` to deny all reads, or provide a custom SQL expression. Set to `null` to prevent the policy from being generated.
 * @param options.modify - The SQL expression or boolean value that defines the modify (insert, update, delete) policies. Set to `true` to allow all modifications, `false` to deny all modifications, or provide a custom SQL expression. Set to `null` to prevent policies from being generated.
 * @returns An array of PostgreSQL policy definitions, one for each CRUD operation.
 */
export declare const crudPolicy: (options: {
    role: PgPolicyToOption;
    read: SQL | boolean | null;
    modify: SQL | boolean | null;
}) => (import("../pg-core/index.ts").PgPolicy | undefined)[];
export declare const authenticatedRole: PgRole;
export declare const anonymousRole: PgRole;
export declare const authUid: (userIdColumn: AnyPgColumn) => SQL<unknown>;
