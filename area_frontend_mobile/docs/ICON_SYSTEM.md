# Icon System Implementation Guide

This document explains the implementation of the `IconSymbol` component in `area_frontend_mobile/components/ui/icon-symbol.tsx`, specifically focusing on the TypeScript strategies used to map Apple SF Symbols to Material Icons in a type-safe manner.

## The Problem: Incompatible Icon Sets

We are building a cross-platform app using:
- **SF Symbols** (standard on iOS)
- **Material Icons** (via `@expo/vector-icons` for Android/Web)

We need a mapping object, `MAPPING`, that translates SF Symbol names (e.g., `house.fill`) to their Material Icon equivalents (e.g., `home`).

### The Type Error

Initially, we tried to define the mapping like this:

```typescript
type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

const MAPPING = {
  'house.fill': 'home',
  // ... a few other entries
} as IconMapping;
```

This caused a TypeScript error:
> Type '{ ... }' is missing the following properties from type 'IconMapping': number, function, "0.circle", "0.circle.fill", and 9144 more.

**Why?**
The `Record<K, V>` utility type in TypeScript forces the object to be **exhaustive**. It means "this object MUST have a key for EVERY single value in `K`". Since `SymbolViewProps['name']` contains over 9,000 valid SF Symbol names, TypeScript expected our `MAPPING` object to define all 9,000+ of them.

## The Solution

We solved this using a combination of `Partial`, `satisfies`, and `as const`.

### 1. `Partial<Record<...>>`

We changed the type definition to:

```typescript
type IconMapping = Partial<Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>>;
```

- **`Record<...>`**: Still defines the relationship (Key is an SF Symbol, Value is a Material Icon).
- **`Partial<...>`**: Wraps the Record, telling TypeScript "it's okay if this object only contains *some* of the possible keys". This removed the requirement to map all 9,000 icons.

### 2. `satisfies` vs `as`

We replaced `as IconMapping` with `satisfies IconMapping`:

```typescript
const MAPPING = {
  'house.fill': 'home',
} satisfies IconMapping;
```

- **`as IconMapping` (Type Assertion)**: Tells TypeScript "Trust me, this is an `IconMapping`, even if it doesn't look like it." This is dangerous because it can hide typos. If we cast it, TypeScript might assume missing keys exist, potentially leading to crashes if we try to access `MAPPING['non.existent.icon']`.
- **`satisfies IconMapping` (Type Validation)**: Tells TypeScript "Check that this object *conforms* to `IconMapping`, but **keep the specific type** of the object."
    - It ensures every key we *do* add is a valid SF Symbol.
    - It ensures every value is a valid Material Icon.
    - Crucially, it remembers exactly which keys are present.

### 3. `as const` for Literal Inference

We added `as const` to the object:

```typescript
const MAPPING = {
  // ...
} as const satisfies IconMapping;
```

Without `as const`, TypeScript infers the values as generic `string`. With `as const`, it infers them as specific string literals (e.g., `'home'`). This is important because the `MaterialIcons` component expects specific icon names, not just any string.

## How to Add New Icons

To add a new icon to the app:

1.  **Find the icon names**:
    - **iOS**: Look up the icon in the [SF Symbols app](https://developer.apple.com/sf-symbols/).
    - **Android**: Look up the icon in the [Material Icons directory](https://icons.expo.fyi).

2.  **Add to `MAPPING`**:
    Open `area_frontend_mobile/components/ui/icon-symbol.tsx` and add a new line to the `MAPPING` object:

    ```typescript
    const MAPPING = {
       // ... existing icons
       'sf.symbol.name': 'material-icon-name',
    } as const satisfies IconMapping;
    ```

3.  **Use it in code**:
    Use the `IconSymbol` component with the SF Symbol name:

    ```tsx
    <IconSymbol name="sf.symbol.name" />
    ```

    If you typed the name correctly, it will work. If you made a typo, TypeScript will now immediately flag it as an error because `satisfies` preserved the exact list of valid keys.
