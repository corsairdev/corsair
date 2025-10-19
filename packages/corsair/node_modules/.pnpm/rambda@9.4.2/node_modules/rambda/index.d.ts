export type RambdaTypes = "Object" | "Number" | "Boolean" | "String" | "Null" | "Array" | "RegExp" | "NaN" | "Function" | "Undefined" | "Async" | "Promise" | "Symbol" | "Set" | "Error" | "Map" | "WeakMap" | "Generator" | "GeneratorFunction" | "BigInt" | "ArrayBuffer" | "Date"

export type NonEmptyArray<T> = [T, ...T[]];
export type ReadonlyNonEmptyArray<T> = readonly [T, ...T[]];

type LastArrayElement<ValueType extends readonly unknown[]> =
	ValueType extends readonly [infer ElementType]
		? ElementType
		: ValueType extends readonly [infer _, ...infer Tail]
			? LastArrayElement<Tail>
			: ValueType extends ReadonlyArray<infer ElementType>
				? ElementType
				: never;
type FirstArrayElement<ValueType extends readonly unknown[]> =
	ValueType extends readonly [infer ElementType]
		? ElementType
		: ValueType extends readonly [...infer Head, infer _]
			? FirstArrayElement<Head>
			: ValueType extends ReadonlyArray<infer ElementType>
				? ElementType
				: never;

export function reduceStopper<T>(input: T) : T
export type IndexedIterator<T, U> = (x: T, i: number) => U;
export type Iterator<T, U> = (x: T) => U;
export type ObjectIterator<T, U> = (x: T, prop: string, inputObj: Dictionary<T>) => U;
type Ord = number | string | boolean | Date;
type Ordering = -1 | 0 | 1;
type Path = string | (number | string)[];
export type RamdaPath = (number | string)[];
export type Predicate<T> = (x: T) => boolean;
export type IndexedPredicate<T> = (x: T, i: number) => boolean;
export type ObjectPredicate<T> = (x: T, prop: string, inputObj: Dictionary<T>) => boolean;
type CondPair<T extends any[], R> = [(...val: T) => boolean, (...val: T) => R]
type Prop<T, P extends keyof never> = P extends keyof Exclude<T, undefined>
    ? T extends undefined ? undefined : T[Extract<P, keyof T>]
    : undefined;

type ValueOfRecord<R> =
  R extends Record<any, infer T>
  ? T
  : never;

interface KeyValuePair<K, V> extends Array<K | V> {
  0: K;
  1: V;
}
export type Functor<A> = { map: <B>(fn: (a: A) => B) => Functor<B>; [key: string]: any };
export type Lens<S, A> = (functorFactory: (a: A) => Functor<A>) => (s: S) => Functor<S>;

export type ObjPred<T = unknown> = (value: any, key: unknown extends T ? string : keyof T) => boolean;

type Arity1Fn = (x: any) => any;
type Arity2Fn = (x: any, y: any) => any;

type Pred = (...x: any[]) => boolean;

export interface Dictionary<T> {[index: string]: T}
type Partial<T> = { [P in keyof T]?: T[P]};

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;

type Evolvable<E extends Evolver> = {[P in keyof E]?: Evolved<E[P]>};

type Evolver<T extends Evolvable<any> = any> = {   [key in keyof Partial<T>]: ((value: T[key]) => T[key]) | (T[key] extends Evolvable<any> ? Evolver<T[key]> : never);
};

type Evolve<O extends Evolvable<E>, E extends Evolver> = {   [P in keyof O]: P extends keyof E
                  ? EvolveValue<O[P], E[P]>
                  : O[P];
};

type Evolved<A> =
    A extends (value: infer V) => any
    ? V
    : A extends Evolver
      ? Evolvable<A>
      : never;

type EvolveNestedValue<O, E extends Evolver> =
    O extends object
    ? O extends Evolvable<E>
      ? Evolve<O, E>
      : never
    : never;

type EvolveValue<V, E> =
    E extends (value: V) => any
    ? ReturnType<E>
    : E extends Evolver
      ? EvolveNestedValue<V, E>
      : never;

type AtLeastOneFunctionsFlowFromRightToLeft<TArgs extends any[], TResult> =
    | [(...args: any) => TResult, ...Array<(args: any) => any>, (...args: TArgs) => any]
    | [(...args: TArgs) => TResult];

type AnyFunction = (...args: any[]) => unknown;
type AnyConstructor = new (...args: any[]) => unknown;

type RegExpReplacerFn =
  | ((m: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, p4: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, p4: string, p5: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, p7: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, p7: string, p8: string, offset: number, s: string, groups?: Record<string, string>) => string)
  | ((m: string, p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, p7: string, p8: string, p9: string, offset: number, s: string, groups?: Record<string, string>) => string)
type RegExpReplacer = string | RegExpReplacerFn

/** `First`, when `First` is a supertype of `Second`; otherwise `never`. */
type IsFirstSubtypeOfSecond<First, Second> = (First extends Second ? Second : never);

// RAMBDAX INTERFACES
// ============================================
type Func<T> = (input: any) => T;
type VoidInputFunc<T> = () => T;
type Fn<In, Out> = (x: In) => Out;
export type SortObjectPredicate<T> = (aProp: string, bProp: string, aValue: T, bValue: T) => number;

export type IdentityFunction<T> = (x: T) => T;

interface Filter<T> {
  (list: T[]): T[];
  (obj: Dictionary<T>): Dictionary<T>;
}

type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never;
type isfn<T> = (x: any, y: any) => T;

interface Switchem<T> {
  is: isfn<Switchem<T>>;
  default: IdentityFunction<T>;
}

interface Schema {
  [key: string]: any;
}

interface SchemaAsync {
  [key: string]: Promise<boolean>;
}

export interface IsValid {
  input: object;
  schema: Schema;
}

export interface IsValidAsync {
  input: object;
  schema: Schema | SchemaAsync;
}

export type ProduceRules<Output,K extends keyof Output, Input> = {   [P in K]: (input: Input) => Output[P];
};
export type ProduceAsyncRules<Output,K extends keyof Output, Input> = {   [P in K]: (input: Input) => Promise<Output[P]>;
};
type ProduceAsyncRule<Input> = (input: Input) => Promise<any>;
type Async<T> = (x: any) => Promise<T>;
type AsyncIterable<T, K> = (x: T) => Promise<K>;
type AsyncIterableIndexed<T, K> = (x: T, i: number) => Promise<K>;
type AsyncPredicate<T> = (x: T) => Promise<boolean>;
type AsyncPredicateIndexed<T> = (x: T, i: number) => Promise<boolean>;
type AsyncWithProp<T> = (x: any, prop?: string) => Promise<T>;

export type ApplyDiffUpdate = {op:'update', path: string, value: any};
export type ApplyDiffAdd = {op:'add', path: string, value: any};
export type ApplyDiffRemove = {op:'remove', path: string};
export type ApplyDiffRule = ApplyDiffUpdate | ApplyDiffAdd | ApplyDiffRemove;


export function F(): boolean;

export function T(): boolean;

/**
 * It adds `a` and `b`.
 */
export function add(a: number, b: number): number;
export function add(a: number): (b: number) => number;

export function addIndex(originalFn: any): (fn: any) => (list: any[]) => any[];
export function addIndex(originalFn: any): (fn: any, list: any[]) => any[];

/**
 * Same as `R.addIndex`, but it will passed indexes are decreasing, instead of increasing.
 */
export function addIndexRight(originalFn: any): (fn: any) => (list: any[]) => any[];
export function addIndexRight(originalFn: any): (fn: any, list: any[]) => any[];

/**
 * It replaces `index` in array `list` with the result of `replaceFn(list[i])`.
 */
export function adjust<T>(index: number, replaceFn: (x: T) => T, list: T[]): T[];
export function adjust<T>(index: number, replaceFn: (x: T) => T): (list: T[]) => T[];

/**
 * It returns `true`, if all members of array `list` returns `true`, when applied as argument to `predicate` function.
 */
export function all<T>(predicate: (x: T) => boolean, list: T[]): boolean;
export function all<T>(predicate: (x: T) => boolean): (list: T[]) => boolean;

/**
 * It returns `true`, if all functions of `predicates` return `true`, when `input` is their argument.
 */
export function allPass<T>(predicates: ((x: T) => boolean)[]): (input: T) => boolean;
export function allPass<T>(predicates: ((...inputs: T[]) => boolean)[]): (...inputs: T[]) => boolean;

/**
 * It returns function that always returns `x`.
 */
export function always<T>(x: T): (...args: unknown[]) => T;

/**
 * Logical AND
 */
export function and<T, U>(x: T, y: U): T | U;
export function and<T>(x: T): <U>(y: U) => T | U;

/**
 * It returns `true`, if at least one member of `list` returns true, when passed to a `predicate` function.
 */
export function any<T>(predicate: (x: T) => boolean, list: T[]): boolean;
export function any<T>(predicate: (x: T) => boolean): (list: T[]) => boolean;

/**
 * It accepts list of `predicates` and returns a function. This function with its `input` will return `true`, if any of `predicates` returns `true` for this `input`.
 */
export function anyPass<T>(predicates: ((x: T) => boolean)[]): (input: T) => boolean;
export function anyPass<T>(predicates: ((...inputs: T[]) => boolean)[]): (...inputs: T[]) => boolean;

/**
 * It takes a list of functions and a list of values. Then it returns a list of values obtained by applying each function to each value.
 */
export function ap<T, U>(fns: Array<(a: T) => U>[], vs: T[]): U[];
export function ap<T, U>(fns: Array<(a: T) => U>): (vs: T[]) => U[];
export function ap<R, A, B>(fn: (r: R, a: A) => B, fn1: (r: R) => A): (r: R) => B;

/**
 * It returns a new list, composed of consecutive `n`-tuples from a `list`.
 */
export function aperture<N extends number, T>(n: N, list: T[]): Array<Tuple<T, N>> | [];
export function aperture<N extends number>(n: N): <T>(list: T[]) => Array<Tuple<T, N>> | [];

/**
 * It adds element `x` at the end of `iterable`.
 */
export function append<T>(xToAppend: T, iterable: T[]): T[];
export function append<T, U>(xToAppend: T, iterable: IsFirstSubtypeOfSecond<T, U>[]) : U[];
export function append<T>(xToAppend: T): <U>(iterable: IsFirstSubtypeOfSecond<T, U>[]) => U[];
export function append<T>(xToAppend: T): (iterable: T[]) => T[];

/**
 * It applies function `fn` to the list of arguments.
 * 
 * This is useful for creating a fixed-arity function from a variadic function. `fn` should be a bound function if context is significant.
 */
export function apply<T = any>(fn: (...args: any[]) => T, args: any[]): T;
export function apply<T = any>(fn: (...args: any[]) => T): (args: any[]) => T;

export function applySpec<Spec extends Record<string, AnyFunction>>(
  spec: Spec
): (
  ...args: Parameters<ValueOfRecord<Spec>>
) => { [Key in keyof Spec]: ReturnType<Spec[Key]> };
export function applySpec<T>(spec: any): (...args: unknown[]) => T;

export function applyTo<T, U>(el: T, fn: (t: T) => U): U;
export function applyTo<T>(el: T): <U>(fn: (t: T) => U) => U;

export function ascend<T>(fn: (obj: T) => Ord, a: T, b: T): Ordering;
export function ascend<T>(fn: (obj: T) => Ord): (a: T, b: T) => Ordering;

/**
 * It makes a shallow clone of `obj` with setting or overriding the property `prop` with `newValue`.
 */
export function assoc<K extends PropertyKey>(prop: K): {
  <T>(val: T): <U extends Record<K, T>>(obj: U) => U;
  <U extends Record<K, T>, T>(val: T, obj: U): U;
};
export function assoc<T, K extends PropertyKey>(prop: K, val: T): {
  <U>(obj: U): U extends Record<K, any> ? U[K] extends T ? U : Record<K, T> & Omit<U, K> : U & Record<K, T>;
};
export function assoc<U, K extends keyof U, T extends U[K]>(prop: K, val: T, obj: U): U;

/**
 * It makes a shallow clone of `obj` with setting or overriding with `newValue` the property found with `path`.
 */
export function assocPath<Output>(path: Path, newValue: any, obj: object): Output;
export function assocPath<Output>(path: Path, newValue: any): (obj: object) => Output;
export function assocPath<Output>(path: Path): (newValue: any) => (obj: object) => Output;

export function binary<T extends (...arg: any[]) => any>(fn: T): (...args: any[]) => ReturnType<T>;

/**
 * Creates a function that is bound to a context.
 */
export function bind<F extends AnyFunction, T>(fn: F, thisObj: T): (...args: Parameters<F>) => ReturnType<F>;
export function bind<F extends AnyFunction, T>(fn: F): (thisObj: T) => (...args: Parameters<F>) => ReturnType<F>;

/**
 * It returns a function with `input` argument.
 * 
 * This function will return `true`, if both `firstCondition` and `secondCondition` return `true` when `input` is passed as their argument.
 */
export function both(pred1: Pred, pred2: Pred): Pred;
export function both<T>(pred1: Predicate<T>, pred2: Predicate<T>): Predicate<T>;
export function both<T>(pred1: Predicate<T>): (pred2: Predicate<T>) => Predicate<T>;
export function both(pred1: Pred): (pred2: Pred) => Pred;

export function call<T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>): ReturnType<T>;

/**
 * The method is also known as `flatMap`.
 */
export function chain<T, U>(fn: (n: T) => U[], list: T[]): U[];
export function chain<T, U>(fn: (n: T) => U[]): (list: T[]) => U[];

/**
 * Restrict a number `input` to be within `min` and `max` limits.
 * 
 * If `input` is bigger than `max`, then the result is `max`.
 * 
 * If `input` is smaller than `min`, then the result is `min`.
 */
export function clamp(min: number, max: number, input: number): number;
export function clamp(min: number, max: number): (input: number) => number;

/**
 * It creates a deep copy of the `input`, which may contain (nested) Arrays and Objects, Numbers, Strings, Booleans and Dates.
 */
export function clone<T>(input: T): T;
export function clone<T>(input: T[]): T[];

export function collectBy<T, K extends PropertyKey>(keyFn: (value: T) => K, list: T[]): T[][];
export function collectBy<T, K extends PropertyKey>(keyFn: (value: T) => K): (list: T[]) => T[][];

/**
 * It returns a comparator function that can be used in `sort` method.
 */
export function comparator<T>(pred: (a: T, b: T) => boolean): (x: T, y: T) => Ordering;

/**
 * It returns `inverted` version of `origin` function that accept `input` as argument.
 * 
 * The return value of `inverted` is the negative boolean value of `origin(input)`.
 */
export function complement<T extends any[]>(predicate: (...args: T) => unknown): (...args: T) => boolean;

/**
 * It performs right-to-left function composition.
 */
export function compose<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7, TResult>(
  ...func: [
      fnLast: (a: any) => TResult,
      ...func: Array<(a: any) => any>,
      f7: (a: R6) => R7,
      f6: (a: R5) => R6,
      f5: (a: R4) => R5,
      f4: (a: R3) => R4,
      f3: (a: R2) => R3,
      f2: (a: R1) => R2,
      f1: (...args: TArgs) => R1
  ]
): (...args: TArgs) => TResult;
export function compose<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7, TResult>(
  f7: (a: R6) => R7,
  f6: (a: R5) => R6,
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R7;
export function compose<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7>(
  f7: (a: R6) => R7,
  f6: (a: R5) => R6,
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R7;
export function compose<TArgs extends any[], R1, R2, R3, R4, R5, R6>(
  f6: (a: R5) => R6,
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R6;
export function compose<TArgs extends any[], R1, R2, R3, R4, R5>(
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R5;
export function compose<TArgs extends any[], R1, R2, R3, R4>(
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R4;
export function compose<TArgs extends any[], R1, R2, R3>(
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R3;
export function compose<TArgs extends any[], R1, R2>(
  f2: (a: R1) => R2,
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R2;
export function compose<TArgs extends any[], R1>(
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R1;

export function composeWith<TArgs extends any[], TResult>(
  transformer: (fn: (...args: any[]) => any, intermediatResult: any) => any,
  fns: AtLeastOneFunctionsFlowFromRightToLeft<TArgs, TResult>,
): (...args: TArgs) => TResult;
export function composeWith(
  transformer: (fn: (...args: any[]) => any, intermediatResult: any) => any,
): <TArgs extends any[], TResult>(
  fns: AtLeastOneFunctionsFlowFromRightToLeft<TArgs, TResult>,
) => (...args: TArgs) => TResult;

/**
 * It returns a new string or array, which is the result of merging `x` and `y`.
 */
export function concat<T>(x: T[], y: T[]): T[];
export function concat<T>(x: T[]): (y: T[]) => T[];
export function concat(x: string, y: string): string;
export function concat(x: string): (y: string) => string;

/**
 * It takes list with `conditions` and returns a new function `fn` that expects `input` as argument.
 * 
 * This function will start evaluating the `conditions` in order to find the first winner(order of conditions matter).
 * 
 * The winner is this condition, which left side returns `true` when `input` is its argument. Then the evaluation of the right side of the winner will be the final result.
 * 
 * If no winner is found, then `fn` returns `undefined`.
 */
export function cond<T extends any[], R>(conditions: Array<CondPair<T, R>>): (...args: T) => R;

/**
 * Accepts a converging function and a list of branching functions and returns a new function. When invoked, this new function is applied to some arguments, each branching function is applied to those same arguments. The results of each branching function are passed as arguments to the converging function to produce the return value.
 */
export function converge(after: ((...a: any[]) => any), fns: ((...x: any[]) => any)[]): (...y: any[]) => any;

/**
 * It counts how many times `predicate` function returns `true`, when supplied with iteration of `list`.
 */
export function count<T>(predicate: (x: T) => boolean, list: T[]): number;
export function count<T>(predicate: (x: T) => boolean): (list: T[]) => number;

/**
 * It counts elements in a list after each instance of the input list is passed through `transformFn` function.
 */
export function countBy<T extends unknown>(transformFn: (x: T) => any, list: T[]): Record<string, number>;
export function countBy<T extends unknown>(transformFn: (x: T) => any): (list: T[]) => Record<string, number>;

/**
 * It expects a function as input and returns its curried version.
 */
export function curry(fn: AnyFunction): (...a: any[]) => any;

/**
 * It returns a curried equivalent of the provided function, with the specified arity.
 */
export function curryN(length: number, fn: AnyFunction): (...a: any[]) => any;

/**
 * It decrements a number.
 */
export function dec(x: number): number;

/**
 * It returns `defaultValue`, if all of `inputArguments` are `undefined`, `null` or `NaN`.
 * 
 * Else, it returns the first truthy `inputArguments` instance(from left to right).
 */
export function defaultTo<T>(defaultValue: T, input: T | null | undefined): T;
export function defaultTo<T>(defaultValue: T): (input: T | null | undefined) => T;

export function descend<T>(fn: (obj: T) => Ord, a: T, b: T): Ordering;
export function descend<T>(fn: (obj: T) => Ord): (a: T, b: T) => Ordering;

/**
 * It returns the uniq set of all elements in the first list `a` not contained in the second list `b`.
 * 
 * `R.equals` is used to determine equality.
 */
export function difference<T>(a: T[], b: T[]): T[];
export function difference<T>(a: T[]): (b: T[]) => T[];

export function differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
  list1: T1[],
  list2: T2[],
): T1[];
export function differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
): (list1: T1[], list2: T2[]) => T1[];
export function differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
  list1: T1[],
): (list2: T2[]) => T1[];

/**
 * It returns a new object that does not contain property `prop`.
 */
export function dissoc<K extends PropertyKey>(prop: K): <U extends { [P in K]?: any}>(obj: string extends keyof U ? U : undefined extends U[K] ? U : never) => U;
export function dissoc<U, K extends keyof U>(prop: string extends keyof U ? K : undefined extends U[K] ? K : never, obj: U): U;

export function dissocPath<T>(path: Path, obj: any): T;
export function dissocPath<T>(path: Path): (obj: any) => T;

export function divide(x: number, y: number): number;
export function divide(x: number): (y: number) => number;

/**
 * It returns `howMany` items dropped from beginning of list or string `input`.
 */
export function drop<T>(howMany: number, input: T[]): T[];
export function drop(howMany: number, input: string): string;
export function drop<T>(howMany: number): {
  <T>(input: T[]): T[];
  (input: string): string;
};

/**
 * It returns `howMany` items dropped from the end of list or string `input`.
 */
export function dropLast<T>(howMany: number, input: T[]): T[];
export function dropLast(howMany: number, input: string): string;
export function dropLast<T>(howMany: number): {
  <T>(input: T[]): T[];
  (input: string): string;
};

export function dropLastWhile(predicate: (x: string) => boolean, iterable: string): string;
export function dropLastWhile(predicate: (x: string) => boolean): (iterable: string) => string;
export function dropLastWhile<T>(predicate: (x: T) => boolean, iterable: T[]): T[];
export function dropLastWhile<T>(predicate: (x: T) => boolean): <T>(iterable: T[]) => T[];

/**
 * It removes any successive duplicates according to `R.equals`.
 */
export function dropRepeats<T>(list: T[]): T[];

export function dropRepeatsBy<T, U>(fn: (a: T) => U, list: T[]): T[];
export function dropRepeatsBy<T, U>(
  fn: (a: T) => U
): (list: T[]) => T[];
export function dropRepeatsBy(fn: any): <T>(list: T[]) => T[];

export function dropRepeatsWith<T>(predicate: (x: T, y: T) => boolean, list: T[]): T[];
export function dropRepeatsWith<T>(predicate: (x: T, y: T) => boolean): (list: T[]) => T[];

export function dropWhile(fn: Predicate<string>, iterable: string): string;
export function dropWhile(fn: Predicate<string>): (iterable: string) => string;
export function dropWhile<T>(fn: Predicate<T>, iterable: T[]): T[];
export function dropWhile<T>(fn: Predicate<T>): (iterable: T[]) => T[];

/**
 * It returns a new `predicate` function from `firstPredicate` and `secondPredicate` inputs.
 * 
 * This `predicate` function will return `true`, if any of the two input predicates return `true`.
 */
export function either(firstPredicate: Pred, secondPredicate: Pred): Pred;
export function either<T>(firstPredicate: Predicate<T>, secondPredicate: Predicate<T>): Predicate<T>;
export function either<T>(firstPredicate: Predicate<T>): (secondPredicate: Predicate<T>) => Predicate<T>;
export function either(firstPredicate: Pred): (secondPredicate: Pred) => Pred;

export function empty<T>(x: T): T;

/**
 * When iterable is a string, then it behaves as `String.prototype.endsWith`.
 * When iterable is a list, then it uses R.equals to determine if the target list ends in the same way as the given target.
 */
export function endsWith<T extends string>(question: T, str: string): boolean;
export function endsWith<T extends string>(question: T): (str: string) => boolean;
export function endsWith<T>(question: T[], list: T[]): boolean;
export function endsWith<T>(question: T[]): (list: T[]) => boolean;

export function eqBy<T>(fn: (a: T) => unknown, a: T, b: T): boolean;
export function eqBy<T>(fn: (a: T) => unknown, a: T): (b: T) => boolean;
export function eqBy<T>(fn: (a: T) => unknown): {
  (a: T, b: T): boolean;
  (a: T): (b: T) => boolean;
};

/**
 * It returns `true` if property `prop` in `obj1` is equal to property `prop` in `obj2` according to `R.equals`.
 */
export function eqProps<T, U>(prop: string, obj1: T, obj2: U): boolean;
export function eqProps<P extends string>(prop: P): <T, U>(obj1: Record<P, T>, obj2: Record<P, U>) => boolean;
export function eqProps<T>(prop: string, obj1: T): <U>(obj2: U) => boolean;

/**
 * It deeply compares `x` and `y` and returns `true` if they are equal.
 */
export function equals<T>(x: T, y: T): boolean;
export function equals<T>(x: T): (y: T) => boolean;

/**
 * It takes object or array of functions as set of rules. These `rules` are applied to the `iterable` input to produce the result.
 */
export function evolve<T, U>(rules: ((x: T) => U)[], list: T[]): U[];
export function evolve<T, U>(rules: ((x: T) => U)[]) : (list: T[]) => U[];
export function evolve<E extends Evolver, V extends Evolvable<E>>(rules: E, obj: V): Evolve<V, E>;
export function evolve<E extends Evolver>(rules: E): <V extends Evolvable<E>>(obj: V) => Evolve<V, E>;

/**
 * It filters list or object `input` using a `predicate` function.
 */
export function filter<T>(predicate: Predicate<T>): (input: T[]) => T[];
export function filter<T>(predicate: Predicate<T>, input: T[]): T[];
export function filter<T, U>(predicate: ObjectPredicate<T>): (x: Dictionary<T>) => Dictionary<T>;
export function filter<T>(predicate: ObjectPredicate<T>, x: Dictionary<T>): Dictionary<T>;

/**
 * It returns the first element of `list` that satisfy the `predicate`.
 * 
 * If there is no such element, it returns `undefined`.
 */
export function find<T>(predicate: (x: T) => boolean, list: T[]): T | undefined;
export function find<T>(predicate: (x: T) => boolean): (list: T[]) => T | undefined;

/**
 * It returns the index of the first element of `list` satisfying the `predicate` function.
 * 
 * If there is no such element, then `-1` is returned.
 */
export function findIndex<T>(predicate: (x: T) => boolean, list: T[]): number;
export function findIndex<T>(predicate: (x: T) => boolean): (list: T[]) => number;

/**
 * It returns the last element of `list` satisfying the `predicate` function.
 * 
 * If there is no such element, then `undefined` is returned.
 */
export function findLast<T>(fn: (x: T) => boolean, list: T[]): T | undefined;
export function findLast<T>(fn: (x: T) => boolean): (list: T[]) => T | undefined;

/**
 * It returns the index of the last element of `list` satisfying the `predicate` function.
 * 
 * If there is no such element, then `-1` is returned.
 */
export function findLastIndex<T>(predicate: (x: T) => boolean, list: T[]): number;
export function findLastIndex<T>(predicate: (x: T) => boolean): (list: T[]) => number;

/**
 * It deeply flattens an array.
 */
export function flatten<T>(list: any[]): T[];

/**
 * It returns function which calls `fn` with exchanged first and second argument.
 */
export function flip<T, U, TResult>(fn: (arg0: T, arg1: U) => TResult): (arg1: U, arg0?: T) => TResult;

/**
 * It applies `iterable` function over all members of `list` and returns `list`.
 */
export function forEach<T>(fn: Iterator<T, void>, list: T[]): T[];
export function forEach<T>(fn: Iterator<T, void>): (list: T[]) => T[];
export function forEach<T>(fn: ObjectIterator<T, void>, list: Dictionary<T>): Dictionary<T>;
export function forEach<T, U>(fn: ObjectIterator<T, void>): (list: Dictionary<T>) => Dictionary<T>;

export function forEachObjIndexed<T>(fn: (value: T[keyof T], key: keyof T, obj: T) => void, obj: T): T;
export function forEachObjIndexed<T>(fn: (value: T[keyof T], key: keyof T, obj: T) => void): (obj: T) => T;

/**
 * It transforms a `listOfPairs` to an object.
 */
export function fromPairs<V>(listOfPairs: ([number, V])[]): { [index: number]: V };
export function fromPairs<V>(listOfPairs: ([string, V])[]): { [index: string]: V };

/**
 * It splits `list` according to a provided `groupFn` function and returns an object.
 */
export function groupBy<T, K extends string = string>(fn: (a: T) => K): (list: T[]) => Partial<Record<K, T[]>>;
export function groupBy<T, K extends string = string>(fn: (a: T) => K, list: T[]): Partial<Record<K, T[]>>;

/**
 * It returns separated version of list or string `input`, where separation is done with equality `compareFn` function.
 */
export function groupWith<T>(compareFn: (x: T, y: T) => boolean): (input: T[]) => (T[])[];
export function groupWith<T>(compareFn: (x: T, y: T) => boolean, input: T[]): (T[])[];
export function groupWith<T>(compareFn: (x: T, y: T) => boolean, input: string): string[];

export function gt<T, U>(x: T, y: U): boolean;
export function gt<T, U>(x: T): (y: U) => boolean;

export function gte<T, U>(x: T, y: U): boolean;
export function gte<T, U>(x: T): (y: U) => boolean;

/**
 * It returns `true` if `obj` has property `prop`.
 */
export function has<T>(prop: string, obj: T): boolean;
export function has(prop: string): <T>(obj: T) => boolean;

export function hasIn(searchProperty: string): <T>(obj: T) => boolean;
export function hasIn<T>(searchProperty: string, obj: T): boolean;

/**
 * It will return true, if `input` object has truthy `path`(calculated with `R.path`).
 */
export function hasPath<T>(
  path: string | string[],
  input: object
): boolean;
export function hasPath<T>(
  path: string | string[]
): (input: object) => boolean;

/**
 * It returns the first element of list or string `input`. It returns `undefined` if array has length of 0.
 */
export function head(str: string): string;
export function head(str: ''): undefined;
export function head(list: readonly[]): undefined;
export function head<T>(list: never[]): undefined;
export function head<T extends unknown[]>(array: T): FirstArrayElement<T>
export function head<T extends readonly unknown[]>(array: T): FirstArrayElement<T>

/**
 * It returns `true` if its arguments `a` and `b` are identical.
 * 
 * Otherwise, it returns `false`.
 */
export function identical<T>(x: T, y: T): boolean;
export function identical<T>(x: T): (y: T) => boolean;

/**
 * It just passes back the supplied `input` argument.
 */
export function identity<T>(input: T): T;

/**
 * It expects `condition`, `onTrue` and `onFalse` functions as inputs and it returns a new function with example name of `fn`.
 * 
 * When `fn`` is called with `input` argument, it will return either `onTrue(input)` or `onFalse(input)` depending on `condition(input)` evaluation.
 */
export function ifElse<T, TFiltered extends T, TOnTrueResult, TOnFalseResult>(
  pred: (a: T) => a is TFiltered,
  onTrue: (a: TFiltered) => TOnTrueResult,
  onFalse: (a: Exclude<T, TFiltered>) => TOnFalseResult,
): (a: T) => TOnTrueResult | TOnFalseResult;
export function ifElse<TArgs extends any[], TOnTrueResult, TOnFalseResult>(fn: (...args: TArgs) => boolean, onTrue: (...args: TArgs) => TOnTrueResult, onFalse: (...args: TArgs) => TOnFalseResult): (...args: TArgs) => TOnTrueResult | TOnFalseResult;

/**
 * It increments a number.
 */
export function inc(x: number): number;

/**
 * If `input` is string, then this method work as native `String.includes`.
 * 
 * If `input` is array, then `R.equals` is used to define if `valueToFind` belongs to the list.
 */
export function includes<T extends string>(valueToFind: T, input: string): boolean;
export function includes<T extends string>(valueToFind: T): (input: string) => boolean;
export function includes<T>(valueToFind: T, input: T[]): boolean;
export function includes<T>(valueToFind: T): (input: T[]) => boolean;

/**
 * It generates object with properties provided by `condition` and values provided by `list` array.
 * 
 * If `condition` is a function, then all list members are passed through it.
 * 
 * If `condition` is a string, then all list members are passed through `R.path(condition)`.
 */
export function indexBy<T, K extends string | number = string>(condition: (key: T) => K, list: T[]): { [key in K]: T };
export function indexBy<T, K extends string | number | undefined = string>(condition: (key: T) => K, list: T[]): { [key in NonNullable<K>]?: T };
export function indexBy<T, K extends string | number = string>(condition: (key: T) => K): (list: T[]) => { [key in K]: T };
export function indexBy<T, K extends string | number | undefined = string>(condition: (key: T) => K | undefined): (list: T[]) => { [key in NonNullable<K>]?: T };
export function indexBy<T>(condition: string, list: T[]): { [key: string]: T };
export function indexBy<T>(condition: string): (list: T[]) => { [key: string]: T };

/**
 * It returns the index of the first element of `list` equals to `valueToFind`.
 * 
 * If there is no such element, it returns `-1`.
 */
export function indexOf<T>(valueToFind: T, list: T[]): number;
export function indexOf<T>(valueToFind: T): (list: T[]) => number;

/**
 * It returns all but the last element of list or string `input`.
 */
export function init<T extends unknown[]>(input: T): T extends readonly [...infer U, any] ? U : [...T];
export function init(input: string): string;

/**
 * It returns a new list by applying a `predicate` function to all elements of `list1` and `list2` and keeping only these elements where `predicate` returns `true`.
 */
export function innerJoin<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
): (list1: T1[], list2: T2[]) => T1[];
export function innerJoin<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
  list1: T1[],
): (list2: T2[]) => T1[];
export function innerJoin<T1, T2>(pred: (a: T1, b: T2) => boolean, list1: T1[], list2: T2[]): T1[];

export function insert(index: number): <T>(itemToInsert: T, list: T[]) => T[];
export function insert<T>(index: number, itemToInsert: T): (list: T[]) => T[];
export function insert<T>(index: number, itemToInsert: T, list: T[]): T[];

export function insertAll(index: number): <T>(itemsToInsert: T[], list: T[]) => T[];
export function insertAll<T>(index: number, itemsToInsert: T[]): (list: T[]) => T[];
export function insertAll<T>(index: number, itemsToInsert: T[], list: T[]): T[];

/**
 * It loops through `listA` and `listB` and returns the intersection of the two according to `R.equals`.
 */
export function intersection<T>(listA: T[], listB: T[]): T[];
export function intersection<T>(listA: T[]): (listB: T[]) => T[];

/**
 * It adds a `separator` between members of `list`.
 */
export function intersperse<T>(separator: T, list: T[]): T[];
export function intersperse<T>(separator: T): (list: T[]) => T[];

/**
 * It returns `true` if `x` is instance of `targetPrototype`.
 */
export function is<C extends () => any>(targetPrototype: C, val: any): val is ReturnType<C>;
export function is<C extends new () => any>(targetPrototype: C, val: any): val is InstanceType<C>;
export function is<C extends () => any>(targetPrototype: C): (val: any) => val is ReturnType<C>;
export function is<C extends new () => any>(targetPrototype: C): (val: any) => val is InstanceType<C>;

/**
 * It returns `true` if `x` is `empty`.
 */
export function isEmpty<T>(x: T): boolean;

/**
 * It returns `true` if `x` is either `null` or `undefined`.
 */
export function isNil(x: any): x is null | undefined;

export function isNotEmpty<T>(value: T[]): value is NonEmptyArray<T>;
export function isNotEmpty<T>(value: readonly T[]): value is ReadonlyNonEmptyArray<T>;
export function isNotEmpty(value: any): boolean;

export function isNotNil<T>(value: T): value is NonNullable<T>;

/**
 * It returns a string of all `list` instances joined with a `glue`.
 */
export function join<T>(glue: string, list: T[]): string;
export function join<T>(glue: string): (list: T[]) => string;

/**
 * It applies list of function to a list of inputs.
 */
export function juxt<A extends any[], R1>(fns: [(...a: A) => R1]): (...a: A) => [R1];
export function juxt<A extends any[], R1, R2>(fns: [(...a: A) => R1, (...a: A) => R2]): (...a: A) => [R1, R2];
export function juxt<A extends any[], R1, R2, R3>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3]): (...a: A) => [R1, R2, R3];
export function juxt<A extends any[], R1, R2, R3, R4>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3, (...a: A) => R4]): (...a: A) => [R1, R2, R3, R4];
export function juxt<A extends any[], R1, R2, R3, R4, R5>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3, (...a: A) => R4, (...a: A) => R5]): (...a: A) => [R1, R2, R3, R4, R5];
export function juxt<A extends any[], U>(fns: Array<(...args: A) => U>): (...args: A) => U[];

/**
 * It applies `Object.keys` over `x` and returns its keys.
 */
export function keys<T extends object>(x: T): (keyof T & string)[];
export function keys<T>(x: T): string[];

/**
 * It returns the last element of `input`, as the `input` can be either a string or an array. It returns `undefined` if array has length of 0.
 */
export function last(str: ''): undefined;
export function last(str: string): string;
export function last(list: readonly[]): undefined;
export function last(list: never[]): undefined;
export function last<T extends unknown[]>(array: T): LastArrayElement<T>;
export function last<T extends readonly unknown[]>(array: T): LastArrayElement<T>;
export function last(str: string): string | undefined;

/**
 * It returns the last index of `target` in `list` array.
 * 
 * `R.equals` is used to determine equality between `target` and members of `list`.
 * 
 * If there is no such index, then `-1` is returned.
 */
export function lastIndexOf<T>(target: T, list: T[]): number;
export function lastIndexOf<T>(target: T): (list: T[]) => number;

/**
 * It returns the `length` property of list or string `input`.
 */
export function length<T>(input: T[]): number;

/**
 * It returns a `lens` for the given `getter` and `setter` functions.
 * 
 * The `getter` **gets** the value of the focus; the `setter` **sets** the value of the focus.
 * 
 * The setter should not mutate the data structure.
 */
export function lens<S, A>(getter: (s: S) => A, setter: (a: A, s: S) => S): Lens<S, A>;

/**
 * It returns a lens that focuses on specified `index`.
 */
export function lensIndex<A>(n: number): Lens<A[], A>;
export function lensIndex<A extends any[], N extends number>(n: N): Lens<A, A[N]>;

/**
 * It returns a lens that focuses on specified `path`.
 */
export function lensPath<S, K0 extends keyof S = keyof S>(path: [K0]): Lens<S, S[K0]>;
export function lensPath<S, K0 extends keyof S = keyof S, K1 extends keyof S[K0] = keyof S[K0]>(
  path: [K0, K1],
): Lens<S, S[K0][K1]>;
export function lensPath<
  S,
  K0 extends keyof S = keyof S,
  K1 extends keyof S[K0] = keyof S[K0],
  K2 extends keyof S[K0][K1] = keyof S[K0][K1]
>(path: [K0, K1, K2]): Lens<S, S[K0][K1][K2]>;
export function lensPath<
  S,
  K0 extends keyof S = keyof S,
  K1 extends keyof S[K0] = keyof S[K0],
  K2 extends keyof S[K0][K1] = keyof S[K0][K1],
  K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2]
>(path: [K0, K1, K2, K3]): Lens<S, S[K0][K1][K2][K3]>;
export function lensPath<
  S,
  K0 extends keyof S = keyof S,
  K1 extends keyof S[K0] = keyof S[K0],
  K2 extends keyof S[K0][K1] = keyof S[K0][K1],
  K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
  K4 extends keyof S[K0][K1][K2][K3] = keyof S[K0][K1][K2][K3]
>(path: [K0, K1, K2, K3, K4]): Lens<S, S[K0][K1][K2][K3][K4]>;
export function lensPath<
  S,
  K0 extends keyof S = keyof S,
  K1 extends keyof S[K0] = keyof S[K0],
  K2 extends keyof S[K0][K1] = keyof S[K0][K1],
  K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
  K4 extends keyof S[K0][K1][K2][K3] = keyof S[K0][K1][K2][K3],
  K5 extends keyof S[K0][K1][K2][K3][K4] = keyof S[K0][K1][K2][K3][K4]
>(path: [K0, K1, K2, K3, K4, K5]): Lens<S, S[K0][K1][K2][K3][K4][K5]>;
export function lensPath<S = any, A = any>(path: Path): Lens<S, A>;

/**
 * It returns a lens that focuses on specified property `prop`.
 */
export function lensProp<S, K extends keyof S = keyof S>(prop: K): Lens<S, S[K]>;

export function lt<T, U>(x: T, y: U): boolean;
export function lt<T, U>(x: T): (y: U) => boolean;

export function lte<T, U>(x: T, y: U): boolean;
export function lte<T, U>(x: T): (y: U) => boolean;

/**
 * It returns the result of looping through `iterable` with `fn`.
 * 
 * It works with both array and object.
 */
export function map<T, U>(fn: ObjectIterator<T, U>, iterable: Dictionary<T>): Dictionary<U>;
export function map<T, U>(fn: Iterator<T, U>, iterable: T[]): U[];
export function map<T, U>(fn: Iterator<T, U>): (iterable: T[]) => U[];
export function map<T, U, S>(fn: ObjectIterator<T, U>): (iterable: Dictionary<T>) => Dictionary<U>;
export function map<T>(fn: Iterator<T, T>): (iterable: T[]) => T[];
export function map<T>(fn: Iterator<T, T>, iterable: T[]): T[];

/**
 * It works the same way as `R.map` does for objects. It is added as Ramda also has this method.
 */
export function mapObjIndexed<T>(fn: ObjectIterator<T, T>, iterable: Dictionary<T>): Dictionary<T>;
export function mapObjIndexed<T, U>(fn: ObjectIterator<T, U>, iterable: Dictionary<T>): Dictionary<U>;
export function mapObjIndexed<T>(fn: ObjectIterator<T, T>): (iterable: Dictionary<T>) => Dictionary<T>;
export function mapObjIndexed<T, U>(fn: ObjectIterator<T, U>): (iterable: Dictionary<T>) => Dictionary<U>;

/**
 * Curried version of `String.prototype.match` which returns empty array, when there is no match.
 */
export function match(regExpression: RegExp, str: string): string[];
export function match(regExpression: RegExp): (str: string) => string[];

/**
 * `R.mathMod` behaves like the modulo operator should mathematically, unlike the `%` operator (and by extension, `R.modulo`). So while `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`.
 */
export function mathMod(x: number, y: number): number;
export function mathMod(x: number): (y: number) => number;

/**
 * It returns the greater value between `x` and `y`.
 */
export function max<T extends Ord>(x: T, y: T): T;
export function max<T extends Ord>(x: T): (y: T) => T;

/**
 * It returns the greater value between `x` and `y` according to `compareFn` function.
 */
export function maxBy<T>(compareFn: (input: T) => Ord, x: T, y: T): T;
export function maxBy<T>(compareFn: (input: T) => Ord, x: T): (y: T) => T;
export function maxBy<T>(compareFn: (input: T) => Ord): (x: T) => (y: T) => T;

/**
 * It returns the mean value of `list` input.
 */
export function mean(list: number[]): number;

/**
 * It returns the median value of `list` input.
 */
export function median(list: number[]): number;

/**
 * Same as `R.mergeRight`.
 */
export function merge<A, B>(target: A, newProps: B): A & B
export function merge<Output>(target: any): (newProps: any) => Output;

/**
 * It merges all objects of `list` array sequentially and returns the result.
 */
export function mergeAll<T>(list: object[]): T;
export function mergeAll(list: object[]): object;

export function mergeDeepLeft<Output>(newProps: object, target: object): Output;
export function mergeDeepLeft<Output>(newProps: object): (target: object) => Output;

/**
 * Creates a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects:
 * 
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 */
export function mergeDeepRight<Output>(target: object, newProps: object): Output;
export function mergeDeepRight<Output>(target: object): (newProps: object) => Output;

/**
 * Same as `R.merge`, but in opposite direction.
 */
export function mergeLeft<Output>(newProps: object, target: object): Output;
export function mergeLeft<Output>(newProps: object): (target: object) => Output;

/**
 * It creates a copy of `target` object with overwritten `newProps` properties. Previously known as `R.merge` but renamed after Ramda did the same.
 */
export function mergeRight<A, B>(target: A, newProps: B): A & B
export function mergeRight<Output>(target: any): (newProps: any) => Output;

/**
 * It takes two objects and a function, which will be used when there is an overlap between the keys.
 */
export function mergeWith(fn: (x: any, z: any) => any, a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown>;
export function mergeWith<Output>(fn: (x: any, z: any) => any, a: Record<string, unknown>, b: Record<string, unknown>): Output;
export function mergeWith(fn: (x: any, z: any) => any, a: Record<string, unknown>): (b: Record<string, unknown>) => Record<string, unknown>;
export function mergeWith<Output>(fn: (x: any, z: any) => any, a: Record<string, unknown>): (b: Record<string, unknown>) => Output;
export function mergeWith(fn: (x: any, z: any) => any): <U, V>(a: U, b: V) => Record<string, unknown>;
export function mergeWith<Output>(fn: (x: any, z: any) => any): <U, V>(a: U, b: V) => Output;

/**
 * It returns the lesser value between `x` and `y`.
 */
export function min<T extends Ord>(x: T, y: T): T;
export function min<T extends Ord>(x: T): (y: T) => T;

/**
 * It returns the lesser value between `x` and `y` according to `compareFn` function.
 */
export function minBy<T>(compareFn: (input: T) => Ord, x: T, y: T): T;
export function minBy<T>(compareFn: (input: T) => Ord, x: T): (y: T) => T;
export function minBy<T>(compareFn: (input: T) => Ord): (x: T) => (y: T) => T;

export function modify<K extends PropertyKey, T>(prop: K, fn: (value: T) => T): <U extends Record<K, T>>(object: U) => U;
export function modify<U, K extends keyof U>(prop: K, fn: (value: U[K]) => U[K], object: U): U;
export function modify<K extends PropertyKey>(prop: K): {
  <T>(fn: (value: T) => T): <U extends Record<K, T>>(object: U) => U;
  <T, U extends Record<K, T>>(fn: (value: T) => T, object: U): U;
};

/**
 * It changes a property of object on the base of provided path and transformer function.
 */
export function modifyPath<T extends Record<string, unknown>>(path: Path, fn: (x: any) => unknown, object: Record<string, unknown>): T;
export function modifyPath<T extends Record<string, unknown>>(path: Path, fn: (x: any) => unknown): (object: Record<string, unknown>) => T;
export function modifyPath<T extends Record<string, unknown>>(path: Path): (fn: (x: any) => unknown) => (object: Record<string, unknown>) => T;

/**
 * Curried version of `x%y`.
 */
export function modulo(x: number, y: number): number;
export function modulo(x: number): (y: number) => number;

/**
 * It returns a copy of `list` with exchanged `fromIndex` and `toIndex` elements.
 */
export function move<T>(fromIndex: number, toIndex: number, list: T[]): T[];
export function move(fromIndex: number, toIndex: number): <T>(list: T[]) => T[];
export function move(fromIndex: number): {
    <T>(toIndex: number, list: T[]): T[];
    (toIndex: number): <T>(list: T[]) => T[];
};

/**
 * Curried version of `x*y`.
 */
export function multiply(x: number, y: number): number;
export function multiply(x: number): (y: number) => number;

export function negate(x: number): number;

/**
 * It returns `true`, if all members of array `list` returns `false`, when applied as argument to `predicate` function.
 */
export function none<T>(predicate: (x: T) => boolean, list: T[]): boolean;
export function none<T>(predicate: (x: T) => boolean): (list: T[]) => boolean;

/**
 * It returns a boolean negated version of `input`.
 */
export function not(input: any): boolean;

/**
 * Curried version of `input[index]`.
 */
export function nth(index: number, input: string): string;	
export function nth<T>(index: number, input: T[]): T | undefined;	
export function nth(n: number): {
  <T>(input: T[]): T | undefined;
  (input: string): string;
};

/**
 * It creates an object with a single key-value pair.
 */
export function objOf<T, K extends string>(key: K, value: T): Record<K, T>;
export function objOf<K extends string>(key: K): <T>(value: T) => Record<K, T>;

export function of<T>(x: T): T[];

/**
 * It returns a partial copy of an `obj` without `propsToOmit` properties.
 */
export function omit<T, K extends string>(propsToOmit: K[], obj: T): Omit<T, K>;
export function omit<K extends string>(propsToOmit: K[]): <T>(obj: T) => Omit<T, K>;
export function omit<T, U>(propsToOmit: string, obj: T): U;
export function omit<T, U>(propsToOmit: string): (obj: T) => U;
export function omit<T>(propsToOmit: string, obj: object): T;
export function omit<T>(propsToOmit: string): (obj: object) => T;

/**
 * It passes the two inputs through `unaryFn` and then the results are passed as inputs the the `binaryFn` to receive the final result(`binaryFn(unaryFn(FIRST_INPUT), unaryFn(SECOND_INPUT))`).
 * 
 * This method is also known as P combinator.
 */
export function on<T, U, R>(binaryFn: (a: U, b: U) => R, unaryFn: (value: T) => U, a: T, b: T): R;
export function on<T, U, R>(binaryFn: (a: U, b: U) => R, unaryFn: (value: T) => U, a: T): (b: T) => R;
export function on<T, U, R>(binaryFn: (a: U, b: U) => R, unaryFn: (value: T) => U): {
    (a: T, b: T): R;
    (a: T): (b: T) => R;
};

/**
 * It returns a function, which invokes only once `fn` function.
 */
export function once<T extends AnyFunction, C = unknown>(fn: T, context?: C): T;

/**
 * Logical OR
 */
export function or<T, U>(a: T, b: U): T | U;
export function or<T>(a: T): <U>(b: U) => T | U;

/**
 * It returns a copied **Object** or **Array** with modified value received by applying function `fn` to `lens` focus.
 */
export function over<S, A>(lens: Lens<S, A>): {
  (fn: (a: A) => A): (value: S) => S;
  (fn: (a: A) => A, value: S): S;
};
export function over<S, A>(lens: Lens<S, A>, fn: (a: A) => A): (value: S) => S;
export function over<S, A>(lens: Lens<S, A>, fn: (a: A) => A, value: S): S;

/**
 * It is very similar to `R.curry`, but you can pass initial arguments when you create the curried function.
 * 
 * `R.partial` will keep returning a function until all the arguments that the function `fn` expects are passed.
 * The name comes from the fact that you partially inject the inputs.
 */
export function partial<V0, V1, T>(fn: (x0: V0, x1: V1) => T, args: [V0]): (x1: V1) => T;
export function partial<V0, V1, V2, T>(fn: (x0: V0, x1: V1, x2: V2) => T, args: [V0, V1]): (x2: V2) => T;
export function partial<V0, V1, V2, T>(fn: (x0: V0, x1: V1, x2: V2) => T, args: [V0]): (x1: V1, x2: V2) => T;
export function partial<V0, V1, V2, V3, T>(
  fn: (x0: V0, x1: V1, x2: V2, x3: V3) => T,
  args: [V0, V1, V2],
): (x2: V3) => T;
export function partial<V0, V1, V2, V3, T>(
  fn: (x0: V0, x1: V1, x2: V2, x3: V3) => T,
  args: [V0, V1],
): (x2: V2, x3: V3) => T;
export function partial<V0, V1, V2, V3, T>(
  fn: (x0: V0, x1: V1, x2: V2, x3: V3) => T,
  args: [V0],
): (x1: V1, x2: V2, x3: V3) => T;
export function partial<T>(fn: (...a: any[]) => T, args: any[]): (...a: any[]) => T;

/**
 * `R.partialObject` is a curry helper designed specifically for functions accepting object as a single argument.
 * 
 * Initially the function knows only a part from the whole input object and then `R.partialObject` helps in preparing the function for the second part, when it receives the rest of the input.
 */
export function partialObject<Input, PartialInput, Output>(
  fn: (input: Input) => Output, 
  partialInput: PartialInput,
): (input: Pick<Input, Exclude<keyof Input, keyof PartialInput>>) => Output;

/**
 * It will return array of two objects/arrays according to `predicate` function. The first member holds all instances of `input` that pass the `predicate` function, while the second member - those who doesn't.
 */
export function partition<T>(
  predicate: Predicate<T>,
  input: T[]
): [T[], T[]];
export function partition<T>(
  predicate: Predicate<T>
): (input: T[]) => [T[], T[]];
export function partition<T>(
  predicate: (x: T, prop?: string) => boolean,
  input: { [key: string]: T}
): [{ [key: string]: T}, { [key: string]: T}];
export function partition<T>(
  predicate: (x: T, prop?: string) => boolean
): (input: { [key: string]: T}) => [{ [key: string]: T}, { [key: string]: T}];

/**
 * If `pathToSearch` is `'a.b'` then it will return `1` if `obj` is `{a:{b:1}}`.
 * 
 * It will return `undefined`, if such path is not found.
 */
export function path<S, K0 extends keyof S = keyof S>(path: [K0], obj: S): S[K0];
export function path<S, K0 extends keyof S = keyof S, K1 extends keyof S[K0] = keyof S[K0]>(path: [K0, K1], obj: S): S[K0][K1];
export function path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1]
>(path: [K0, K1, K2], obj: S): S[K0][K1][K2];
export function path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1],
    K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
>(path: [K0, K1, K2, K3], obj: S): S[K0][K1][K2][K3];
export function path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1],
    K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
    K4 extends keyof S[K0][K1][K2][K3] = keyof S[K0][K1][K2][K3],
>(path: [K0, K1, K2, K3, K4], obj: S): S[K0][K1][K2][K3][K4];
export function path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1],
    K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
    K4 extends keyof S[K0][K1][K2][K3] = keyof S[K0][K1][K2][K3],
    K5 extends keyof S[K0][K1][K2][K3][K4] = keyof S[K0][K1][K2][K3][K4],
>(path: [K0, K1, K2, K3, K4, K5], obj: S): S[K0][K1][K2][K3][K4][K5];
export function path<T>(pathToSearch: string, obj: any): T | undefined;
export function path<T>(pathToSearch: string): (obj: any) => T | undefined;
export function path<T>(pathToSearch: RamdaPath): (obj: any) => T | undefined;
export function path<T>(pathToSearch: RamdaPath, obj: any): T | undefined;

/**
 * It returns `true` if `pathToSearch` of `input` object is equal to `target` value.
 * 
 * `pathToSearch` is passed to `R.path`, which means that it can be either a string or an array. Also equality between `target` and the found value is determined by `R.equals`.
 */
export function pathEq(pathToSearch: Path, target: any, input: any): boolean;
export function pathEq(pathToSearch: Path, target: any): (input: any) => boolean;
export function pathEq(pathToSearch: Path): (target: any) => (input: any) => boolean;

/**
 * It reads `obj` input and returns either `R.path(pathToSearch, Record<string, unknown>)` result or `defaultValue` input.
 */
export function pathOr<T>(defaultValue: T, pathToSearch: Path, obj: any): T;
export function pathOr<T>(defaultValue: T, pathToSearch: Path): (obj: any) => T;
export function pathOr<T>(defaultValue: T): (pathToSearch: Path) => (obj: any) => T;

export function pathSatisfies<T, U>(pred: (val: T) => boolean, path: Path): (obj: U) => boolean;
export function pathSatisfies<T, U>(pred: (val: T) => boolean, path: Path, obj: U): boolean;

/**
 * It loops over members of `pathsToSearch` as `singlePath` and returns the array produced by `R.path(singlePath, Record<string, unknown>)`.
 * 
 * Because it calls `R.path`, then `singlePath` can be either string or a list.
 */
export function paths<Input, T>(pathsToSearch: Path[], obj: Input): (T | undefined)[];
export function paths<Input, T>(pathsToSearch: Path[]): (obj: Input) => (T | undefined)[];
export function paths<T>(pathsToSearch: Path[], obj: any): (T | undefined)[];
export function paths<T>(pathsToSearch: Path[]): (obj: any) => (T | undefined)[];

/**
 * It returns a partial copy of an `input` containing only `propsToPick` properties.
 * 
 * `input` can be either an object or an array.
 * 
 * String annotation of `propsToPick` is one of the differences between `Rambda` and `Ramda`.
 */
export function pick<T, K extends string | number | symbol>(propsToPick: K[], input: T): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
export function pick<K extends string | number | symbol>(propsToPick: K[]): <T>(input: T) => Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
export function pick<T, U>(propsToPick: string, input: T): U;
export function pick<T, U>(propsToPick: string): (input: T) => U;
export function pick<T>(propsToPick: string, input: object): T;
export function pick<T>(propsToPick: string): (input: object) => T;

/**
 * Same as `R.pick` but it won't skip the missing props, i.e. it will assign them to `undefined`.
 */
export function pickAll<T, K extends keyof T>(propsToPicks: K[], input: T): Pick<T, K>;
export function pickAll<T, U>(propsToPicks: string[], input: T): U;
export function pickAll(propsToPicks: string[]): <T, U>(input: T) => U;
export function pickAll<T, U>(propsToPick: string, input: T): U;
export function pickAll<T, U>(propsToPick: string): (input: T) => U;

export function pickBy<T>(pred: ObjPred<T>): <U, V extends T>(obj: V) => U;
export function pickBy<T, U>(pred: ObjPred<T>, obj: T): U;

/**
 * It performs left-to-right function composition.
 */
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7, TResult>(
  ...funcs: [
      f1: (...args: TArgs) => R1,
      f2: (a: R1) => R2,
      f3: (a: R2) => R3,
      f4: (a: R3) => R4,
      f5: (a: R4) => R5,
      f6: (a: R5) => R6,
      f7: (a: R6) => R7,
      ...func: Array<(a: any) => any>,
      fnLast: (a: any) => TResult
  ]
): (...args: TArgs) => TResult;  // fallback overload if number of piped functions greater than 7
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5,
  f6: (a: R5) => R6,
  f7: (a: R6) => R7
): (...args: TArgs) => R7;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5,
  f6: (a: R5) => R6
): (...args: TArgs) => R6;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5
): (...args: TArgs) => R5;
export function pipe<TArgs extends any[], R1, R2, R3, R4>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4
): (...args: TArgs) => R4;
export function pipe<TArgs extends any[], R1, R2, R3>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3
): (...args: TArgs) => R3;
export function pipe<TArgs extends any[], R1, R2>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2
): (...args: TArgs) => R2;
export function pipe<TArgs extends any[], R1>(
  f1: (...args: TArgs) => R1
): (...args: TArgs) => R1;

/**
 * It returns list of the values of `property` taken from the all objects inside `list`.
 */
export function pluck<K extends keyof T, T>(property: K, list: T[]): T[K][];
export function pluck<T>(property: number, list: { [k: number]: T }[]):  T[];
export function pluck<P extends string>(property: P): <T>(list: Record<P, T>[]) => T[];
export function pluck(property: number): <T>(list: { [k: number]: T }[]) => T[];

/**
 * It adds element `x` at the beginning of `list`.
 */
export function prepend<T>(xToPrepend: T, iterable: T[]): T[];
export function prepend<T, U>(xToPrepend: T, iterable: IsFirstSubtypeOfSecond<T, U>[]) : U[];
export function prepend<T>(xToPrepend: T): <U>(iterable: IsFirstSubtypeOfSecond<T, U>[]) => U[];
export function prepend<T>(xToPrepend: T): (iterable: T[]) => T[];

export function product(list: number[]): number;

/**
 * It returns the value of property `propToFind` in `obj`.
 * 
 * If there is no such property, it returns `undefined`.
 */
export function prop<_, P extends keyof never, T>(p: P, value: T): Prop<T, P>;
export function prop<V>(p: keyof never, value: unknown): V;
export function prop<_, P extends keyof never>(p: P): <T>(value: T) => Prop<T, P>;
export function prop<V>(p: keyof never): (value: unknown) => V;

/**
 * It returns true if `obj` has property `propToFind` and its value is equal to `valueToMatch`.
 */
export function propEq<K extends string | number>(valueToMatch: any, propToFind: K, obj: Record<K, any>): boolean;
export function propEq<K extends string | number>(valueToMatch: any, propToFind: K): (obj: Record<K, any>) => boolean;
export function propEq(valueToMatch: any): {
  <K extends string | number>(propToFind: K, obj: Record<K, any>): boolean;
  <K extends string | number>(propToFind: K): (obj: Record<K, any>) => boolean;
};

/**
 * It returns `true` if `property` of `obj` is from `target` type.
 */
export function propIs<C extends AnyFunction, K extends keyof any>(type: C, name: K, obj: any): obj is Record<K, ReturnType<C>>;
export function propIs<C extends AnyConstructor, K extends keyof any>(type: C, name: K, obj: any): obj is Record<K, InstanceType<C>>;
export function propIs<C extends AnyFunction, K extends keyof any>(type: C, name: K): (obj: any) => obj is Record<K, ReturnType<C>>;
export function propIs<C extends AnyConstructor, K extends keyof any>(type: C, name: K): (obj: any) => obj is Record<K, InstanceType<C>>;
export function propIs<C extends AnyFunction>(type: C): {
    <K extends keyof any>(name: K, obj: any): obj is Record<K, ReturnType<C>>;
    <K extends keyof any>(name: K): (obj: any) => obj is Record<K, ReturnType<C>>;
};

/**
 * It returns either `defaultValue` or the value of `property` in `obj`.
 */
export function propOr<T, P extends string>(defaultValue: T, property: P, obj: Partial<Record<P, T>> | undefined): T;
export function propOr<T, P extends string>(defaultValue: T, property: P): (obj: Partial<Record<P, T>> | undefined) => T;
export function propOr<T>(defaultValue: T): {
  <P extends string>(property: P, obj: Partial<Record<P, T>> | undefined): T;
  <P extends string>(property: P): (obj: Partial<Record<P, T>> | undefined) => T;
}

/**
 * It returns `true` if the object property satisfies a given predicate.
 */
export function propSatisfies<T>(predicate: Predicate<T>, property: string, obj: Record<string, T>): boolean;
export function propSatisfies<T>(predicate: Predicate<T>, property: string): (obj: Record<string, T>) => boolean;

/**
 * It takes list with properties `propsToPick` and returns a list with property values in `obj`.
 */
export function props<P extends string, T>(propsToPick: P[], obj: Record<P, T>): T[];
export function props<P extends string>(propsToPick: P[]): <T>(obj: Record<P, T>) => T[];
export function props<P extends string, T>(propsToPick: P[]): (obj: Record<P, T>) => T[];

/**
 * It returns list of numbers between `startInclusive` to `endExclusive` markers.
 */
export function range(startInclusive: number, endExclusive: number): number[];
export function range(startInclusive: number): (endExclusive: number) => number[];

export function reduce<T, TResult>(reducer: (prev: TResult, current: T, i: number) => TResult, initialValue: TResult, list: T[]): TResult;
export function reduce<T, TResult>(reducer: (prev: TResult, current: T) => TResult, initialValue: TResult, list: T[]): TResult;
export function reduce<T, TResult>(reducer: (prev: TResult, current: T, i: number) => TResult): (initialValue: TResult, list: T[]) => TResult;
export function reduce<T, TResult>(reducer: (prev: TResult, current: T, i: number) => TResult, initialValue: TResult): (list: T[]) => TResult;

export function reduceBy<T, TResult>(
  valueFn: (acc: TResult, elem: T) => TResult,
): (a: TResult, b: (elem: T) => string, c: T[]) => { [index: string]: TResult }
export function reduceBy<T, TResult>(
  valueFn: (acc: TResult, elem: T) => TResult,
  acc: TResult,
): (a: (elem: T) => string, b: T[]) => { [index: string]: TResult }
export function reduceBy<T, TResult>(
  valueFn: (acc: TResult, elem: T) => TResult,
  acc: TResult,
  keyFn: (elem: T) => string,
): (list: T[]) => { [index: string]: TResult };
export function reduceBy<T, TResult>(
  valueFn: (acc: TResult, elem: T) => TResult,
  acc: TResult,
  keyFn: (elem: T) => string,
  list: T[],
): { [index: string]: TResult };

/**
 * It has the opposite effect of `R.filter`.
 */
export function reject<T>(predicate: Predicate<T>, list: T[]): T[];
export function reject<T>(predicate: Predicate<T>): (list: T[]) => T[];
export function reject<T>(predicate: Predicate<T>, obj: Dictionary<T>): Dictionary<T>;
export function reject<T, U>(predicate: Predicate<T>): (obj: Dictionary<T>) => Dictionary<T>;

/**
 * It returns a copy of `list` input with removed `index`.
 */
export function removeIndex<T>(index: number, list: T[]): T[];
export function removeIndex(index: number): <T>(list: T[]) => T[];

export function repeat<T>(x: T): (timesToRepeat: number) => T[];
export function repeat<T>(x: T, timesToRepeat: number): T[];

/**
 * It replaces `strOrRegex` found in `str` with `replacer`.
 */
export function replace(strOrRegex: RegExp | string, replacer: RegExpReplacer, str: string): string;
export function replace(strOrRegex: RegExp | string, replacer: RegExpReplacer): (str: string) => string;
export function replace(strOrRegex: RegExp | string): (replacer: RegExpReplacer) => (str: string) => string;

/**
 * It returns a reversed copy of list or string `input`.
 */
export function reverse<T>(input: T[]): T[];
export function reverse(input: string): string;

/**
 * It returns a copied **Object** or **Array** with modified `lens` focus set to `replacer` value.
 */
export function set<S, A>(lens: Lens<S, A>): {
  (a: A): (obj: S) => S
  (a: A, obj: S): S
};
export function set<S, A>(lens: Lens<S, A>, a: A): (obj: S) => S;
export function set<S, A>(lens: Lens<S, A>, a: A, obj: S): S;

export function slice(from: number, to: number, input: string): string;
export function slice<T>(from: number, to: number, input: T[]): T[];
export function slice(from: number, to: number): {
  (input: string): string;
  <T>(input: T[]): T[];
};
export function slice(from: number): {
  (to: number, input: string): string;
  <T>(to: number, input: T[]): T[];
};

/**
 * It returns copy of `list` sorted by `sortFn` function, where `sortFn` needs to return only `-1`, `0` or `1`.
 */
export function sort<T>(sortFn: (a: T, b: T) => number, list: T[]): T[];
export function sort<T>(sortFn: (a: T, b: T) => number): (list: T[]) => T[];

/**
 * It returns copy of `list` sorted by `sortFn` function, where `sortFn` function returns a value to compare, i.e. it doesn't need to return only `-1`, `0` or `1`.
 */
export function sortBy<T>(sortFn: (a: T) => Ord, list: T[]): T[];
export function sortBy<T>(sortFn: (a: T) => Ord): (list: T[]) => T[];
export function sortBy(sortFn: (a: any) => Ord): <T>(list: T[]) => T[];

export function sortWith<T>(fns: Array<(a: T, b: T) => number>): (list: T[]) => T[];
export function sortWith<T>(fns: Array<(a: T, b: T) => number>, list: T[]): T[];

/**
 * Curried version of `String.prototype.split`
 */
export function split(separator: string | RegExp): (str: string) => string[];
export function split(separator: string | RegExp, str: string): string[];

/**
 * It splits string or array at a given index.
 */
export function splitAt<T>(index: number, input: T[]): [T[], T[]];
export function splitAt(index: number, input: string): [string, string];
export function splitAt(index: number): {
    <T>(input: T[]): [T[], T[]];
    (input: string): [string, string];
};

/**
 * It splits `input` into slices of `sliceLength`.
 */
export function splitEvery<T>(sliceLength: number, input: T[]): (T[])[];
export function splitEvery(sliceLength: number, input: string): string[];
export function splitEvery(sliceLength: number): {
  (input: string): string[];
  <T>(input: T[]): (T[])[];
};

/**
 * It splits `list` to two arrays according to a `predicate` function.
 * 
 * The first array contains all members of `list` before `predicate` returns `true`.
 */
export function splitWhen<T, U>(predicate: Predicate<T>, list: U[]): (U[])[];
export function splitWhen<T>(predicate: Predicate<T>): <U>(list: U[]) => (U[])[];

/**
 * When iterable is a string, then it behaves as `String.prototype.startsWith`.
 * When iterable is a list, then it uses R.equals to determine if the target list starts in the same way as the given target.
 */
export function startsWith<T extends string>(question: T, input: string): boolean;
export function startsWith<T extends string>(question: T): (input: string) => boolean;
export function startsWith<T>(question: T[], input: T[]): boolean;
export function startsWith<T>(question: T[]): (input: T[]) => boolean;

/**
 * Curried version of `x - y`
 */
export function subtract(x: number, y: number): number;
export function subtract(x: number): (y: number) => number;

export function sum(list: number[]): number;

export function swap(indexA: number, indexB: number): <T>(list: T[]) => T[];
export function swap<T>(indexA: number, indexB: number, list: T[]): T[];

/**
 * It returns a merged list of `x` and `y` with all equal elements removed.
 * 
 * `R.equals` is used to determine equality.
 */
export function symmetricDifference<T>(x: T[], y: T[]): T[];
export function symmetricDifference<T>(x: T[]): <T>(y: T[]) => T[];

/**
 * It returns all but the first element of `input`.
 */
export function tail<T extends unknown[]>(input: T): T extends [any, ...infer U] ? U : [...T];
export function tail(input: string): string;

/**
 * It returns the first `howMany` elements of `input`.
 */
export function take<T>(howMany: number, input: T): T extends string ? string : T;
export function take<T>(howMany: number) : (input: T) => T extends string ? string : T;

/**
 * It returns the last `howMany` elements of `input`.
 */
export function takeLast<T>(howMany: number, input: T): T extends string ? string : T;
export function takeLast<T>(howMany: number) : (input: T) => T extends string ? string : T;

export function takeLastWhile(predicate: (x: string) => boolean, input: string): string;
export function takeLastWhile(predicate: (x: string) => boolean): (input: string) => string;
export function takeLastWhile<T>(predicate: (x: T) => boolean, input: T[]): T[];
export function takeLastWhile<T>(predicate: (x: T) => boolean): <T>(input: T[]) => T[];

export function takeWhile(fn: Predicate<string>, iterable: string): string;
export function takeWhile(fn: Predicate<string>): (iterable: string) => string;
export function takeWhile<T>(fn: Predicate<T>, iterable: T[]): T[];
export function takeWhile<T>(fn: Predicate<T>): (iterable: T[]) => T[];

/**
 * It applies function `fn` to input `x` and returns `x`.
 * 
 * One use case is debugging in the middle of `R.compose`.
 */
export function tap<T>(fn: (x: T) => void, input: T): T;
export function tap<T>(fn: (x: T) => void): (input: T) => T;

/**
 * It determines whether `str` matches `regExpression`.
 */
export function test(regExpression: RegExp): (str: string) => boolean;
export function test(regExpression: RegExp, str: string): boolean;

/**
 * It returns the result of applying function `fn` over members of range array.
 * 
 * The range array includes numbers between `0` and `howMany`(exclusive).
 */
export function times<T>(fn: (i: number) => T, howMany: number): T[];
export function times<T>(fn: (i: number) => T): (howMany: number) => T[];

export function toLower<S extends string>(str: S): Lowercase<S>;
export function toLower(str: string): string;

/**
 * It transforms an object to a list.
 */
export function toPairs<O extends object, K extends Extract<keyof O, string | number>>(obj: O): Array<{ [key in K]: [`${key}`, O[key]] }[K]>;
export function toPairs<S>(obj: Record<string | number, S>): Array<[string, S]>;

export function toString(x: unknown): string;

export function toUpper<S extends string>(str: S): Uppercase<S>;
export function toUpper(str: string): string;

export function transpose<T>(list: (T[])[]): (T[])[];

export function trim(str: string): string;

/**
 * It returns function that runs `fn` in `try/catch` block. If there was an error, then `fallback` is used to return the result. Note that `fn` can be value or asynchronous/synchronous function(unlike `Ramda` where fallback can only be a synchronous function).
 */
export function tryCatch<T, U>(
  fn: (input: T) => U,
  fallback: U
): (input: T) => U;
export function tryCatch<T, U>(
  fn: (input: T) => U,
  fallback: (input: T) => U
): (input: T) => U;
export function tryCatch<T>(
  fn: (input: any) => Promise<any>,
  fallback: T
): (input: any) => Promise<T>;
export function tryCatch<T>(
  fn: (input: any) => Promise<any>,
  fallback: (input: any) => Promise<any>,
): (input: any) => Promise<T>;

/**
 * It accepts any input and it returns its type.
 */
export function type(x: any): RambdaTypes;

/**
 * It calls a function `fn` with the list of values of the returned function.
 * 
 * `R.unapply` is the opposite of `R.apply` method.
 */
export function unapply<T = any>(fn: (args: any[]) => T): (...args: any[]) => T;

/**
 * It takes two lists and return a new list containing a merger of both list with removed duplicates.
 * 
 * `R.equals` is used to compare for duplication.
 */
export function union<T>(x: T[], y: T[]): T[];
export function union<T>(x: T[]): (y: T[]) => T[];

/**
 * It returns a new array containing only one copy of each element of `list`.
 * 
 * `R.equals` is used to determine equality.
 */
export function uniq<T>(list: T[]): T[];

/**
 * It applies uniqueness to input list based on function that defines what to be used for comparison between elements.
 * 
 * `R.equals` is used to determine equality.
 */
export function uniqBy<T, U>(fn: (a: T) => U, list: T[]): T[];
export function uniqBy<T, U>(fn: (a: T) => U): (list: T[]) => T[];

/**
 * It returns a new array containing only one copy of each element in `list` according to `predicate` function.
 * 
 * This predicate should return true, if two elements are equal.
 */
export function uniqWith<T, U>(predicate: (x: T, y: T) => boolean, list: T[]): T[];
export function uniqWith<T, U>(predicate: (x: T, y: T) => boolean): (list: T[]) => T[];

/**
 * The method returns function that will be called with argument `input`.
 * 
 * If `predicate(input)` returns `false`, then the end result will be the outcome of `whenFalse(input)`.
 * 
 * In the other case, the final output will be the `input` itself.
 */
export function unless<T, U>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => U, x: T): T | U;
export function unless<T, U>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => U): (x: T) => T | U;
export function unless<T>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => T, x: T): T;
export function unless<T>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => T): (x: T) => T;

export function unnest(list: unknown[]): unknown[];
export function unnest<T>(list: unknown[]): T;

export function unwind<T, U>(prop: keyof T, obj: T): U[];
export function unwind<T, U>(prop: keyof T): (obj: T) => U[];

/**
 * It returns a copy of `list` with updated element at `index` with `newValue`.
 */
export function update<T>(index: number, newValue: T, list: T[]): T[];
export function update<T>(index: number, newValue: T): (list: T[]) => T[];

/**
 * With correct input, this is nothing more than `Object.values(Record<string, unknown>)`. If `obj` is not an object, then it returns an empty array.
 */
export function values<T extends object, K extends keyof T>(obj: T): T[K][];

/**
 * It returns the value of `lens` focus over `target` object.
 */
export function view<S, A>(lens: Lens<S, A>): (obj: S) => A;
export function view<S, A>(lens: Lens<S, A>, obj: S): A;

/**
 * It pass `input` to `predicate` function and if the result is `true`, it will return the result of `whenTrueFn(input)`.
 * If the `predicate` returns `false`, then it will simply return `input`.
 */
export function when<T, U>(predicate: (x: T) => boolean, whenTrueFn: (a: T) => U, input: T): T | U;
export function when<T, U>(predicate: (x: T) => boolean, whenTrueFn: (a: T) => U): (input: T) => T | U;
export function when<T, U>(predicate: (x: T) => boolean): ((whenTrueFn: (a: T) => U) => (input: T) => T | U);

/**
 * It returns `true` if all each property in `conditions` returns `true` when applied to corresponding property in `input` object.
 */
export function where<T, U>(conditions: T, input: U): boolean;
export function where<T>(conditions: T): <U>(input: U) => boolean;
export function where<ObjFunc2, U>(conditions: ObjFunc2, input: U): boolean;
export function where<ObjFunc2>(conditions: ObjFunc2): <U>(input: U) => boolean;

/**
 * Same as `R.where`, but it will return `true` if at least one condition check returns `true`.
 */
export function whereAny<T, U>(conditions: T, input: U): boolean;
export function whereAny<T>(conditions: T): <U>(input: U) => boolean;
export function whereAny<ObjFunc2, U>(conditions: ObjFunc2, input: U): boolean;
export function whereAny<ObjFunc2>(conditions: ObjFunc2): <U>(input: U) => boolean;

/**
 * It will return `true` if all of `input` object fully or partially include `rule` object.
 * 
 * `R.equals` is used to determine equality.
 */
export function whereEq<T, U>(condition: T, input: U): boolean;
export function whereEq<T>(condition: T): <U>(input: U) => boolean;

/**
 * It will return a new array, based on all members of `source` list that are not part of `matchAgainst` list.
 * 
 * `R.equals` is used to determine equality.
 */
export function without<T>(matchAgainst: T[], source: T[]): T[];
export function without<T>(matchAgainst: T[]): (source: T[]) => T[];

/**
 * Logical XOR
 */
export function xor(x: boolean, y: boolean): boolean;
export function xor(y: boolean): (y: boolean) => boolean;

/**
 * It will return a new array containing tuples of equally positions items from both `x` and `y` lists.
 * 
 * The returned list will be truncated to match the length of the shortest supplied list.
 */
export function zip<K, V>(x: K[], y: V[]): KeyValuePair<K, V>[];
export function zip<K>(x: K[]): <V>(y: V[]) => KeyValuePair<K, V>[];

/**
 * It will return a new object with keys of `keys` array and values of `values` array.
 */
export function zipObj<T, K extends string>(keys: K[], values: T[]): { [P in K]: T };
export function zipObj<K extends string>(keys: K[]): <T>(values: T[]) => { [P in K]: T };
export function zipObj<T, K extends number>(keys: K[], values: T[]): { [P in K]: T };
export function zipObj<K extends number>(keys: K[]): <T>(values: T[]) => { [P in K]: T };

export function zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult, list1: T[], list2: U[]): TResult[];
export function zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult, list1: T[]): (list2: U[]) => TResult[];
export function zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult): (list1: T[], list2: U[]) => TResult[];
