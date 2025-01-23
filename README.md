`hono-i18n` provides internationalization functionality for [Hono](https://www.npmjs.com/package/hono). With first-class TypeScript support, it ensures type safety and simplifies managing translations across languages.

# 🚀 Quick Start

```tsx
import { createI18n } from "hono-i18n"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"

// Create i18n
const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": {
      addToCart: "Add to cart",
      checkout: "Proceed to checkout",
      errors: {
        outOfStock: "This item is out of stock",
        invalidPayment: "Invalid payment method",
      },
    },
    "de-DE": {
      addToCart: "In den Warenkorb",
      checkout: "Zur Kasse",
      errors: {
        outOfStock: "Dieser Artikel ist ausverkauft",
        invalidPayment: "Ungültige Zahlungsmethode",
      },
    },
  } as const, // TypeScript: "as const" assertion for better type safety
  defaultLocale: "en-EN",
  // Example locale getter based on cookie
  // Fallbacks to defaultLocale if selected locale is not matching given locales
  getLocale: (c) => getCookie(c, "locale-cookie"),
})

// Hono instance
const app = new Hono()

// Register i18n middleware
app.use(i18nMiddleware)

app.get("/stock", (c) => {
  // Create translate function with getI18n util
  const t = getI18n(c)
  
  // Use t() to retrieve translation
  return c.text(t("errors.outOfStock"))
})
```

# API

## `createI18n`

### Parameters

- **`options`** Configuration object
- **`options.messages`** `Record<string, Record<string, unknown>>`
    
    Object with [BCP 47 language tag](https://www.techonthenet.com/js/language_tags.php) keys and their corresponding messages:
    `{ "en-EN": {...}, "de-DE": {...} }`.
    
    **Note:** Use `as const` assertion in TypeScript to ensure message values are inferred as literal types for better type safety: `{ "en-EN": {...}, "de-DE": {...} } as const`.
    
- **`options.defaultLocale`** `string`
    
    Fallback locale if no match is found for **`options.getLocale`** in given locales.
    
- **`options.getLocale`** `(c: Context, locales: string[], defaultLocale: string) => string | null | undefined`
    
    Callback function to determine the locale based on the request, typically using `Accept-Language` header, cookies or other request data.
    

### Basic usage

```tsx
import { createI18n } from "hono-i18n"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"

const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": { greeting: "Hi!" },
    "de-DE": { greeting: "Hallo!" },
  } as const, // TypeScript: "as const" assertion for better type safety
  defaultLocale: "en-EN",
  getLocale: (c, locales, defaultLocale) => getCookie(c, "locale-cookie"), // "locale-cookie" value: "de-DE"
})

const app = new Hono()

app.use(i18nMiddleware)

app.get("/hello-world", (c) => {
  const t = getI18n(c)
  return c.text(t("greeting"))
  // Result: "Hallo!"
})
```

### Placeholders

Placeholders are variables for content, following the pattern `{placeholder}`, where:

1. **Curly Braces** `{}`: Mark the placeholder’s start and end to distinguish it from regular text.
2. **Placeholder Name**: A descriptive name inside the braces, e.g. `{name}` for a name.

```tsx
const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": { farewell: "Goodbye, {city}!" },
    "de-DE": { farewell: "Auf Wiedersehen, {city}!" },
  } as const,
  defaultLocale: "en-EN",
  getLocale: (c) => getCookie(c, "locale-cookie"),
})

...

app.get("/goodbye-world", (c) => {
  const t = getI18n(c)
  return c.text(t("farewell", { city: "Berlin" }))
  // Result: "Goodbye, Berlin!"
})
```

### Cardinal plurals (default)

Plural integration uses the [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API:

- Check [compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules#browser_compatibility)
- For detailed information about the rules and their usage, refer to the [Plural Rules](https://cldr.unicode.org/index/cldr-spec/plural-rules) documentation.
- For a comprehensive list of rules and their application across different languages, see the [LDML Language Plural Rules](https://www.unicode.org/cldr/charts/43/supplemental/language_plural_rules.html).

Declare plural translations by appending `#` followed by `zero`, `one`, `two`, `few`, `many`, or `other`:

```tsx
const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": {
      "availability#zero": "Item currently unavailable",
      "availability#one": "Only one item available",
      "availability#other": "Many items available",
    },
  } as const,
  defaultLocale: "en-EN",
  getLocale: (c) => getCookie(c, "locale-cookie"),
})

...

app.get("/stock", (c) => {
  const t = getI18n(c)
  return c.text(t("availability", { count: 1 }))
  // Result: "Only one item available"
})
```

Special translations for `{ count: 0 }` are allowed to enable more natural language. If a `#zero` entry exists, it replaces the default plural form:

```tsx
const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": {
      "apple#zero": "You have no apples.",
      "apple#other": "You have {count} apples.",
    },
  } as const,
  defaultLocale: "en-EN",
  getLocale: (c) => getCookie(c, "locale-cookie"),
})

...

app.get("/stock", (c) => {
  const t = getI18n(c)
  return c.text(t("apple", { count: 0 }))
  // Result: "You have no apples."
})
```

### Ordinal plurals

Ordinal numbers are also supported (e.g. “1st”, “2nd”, “3rd” in English). The `ordinal` option ensures the correct plural key is selected based on the ordinal value.

```tsx
const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": {
      "direction#zero": "zero",
      "direction#one": "Take the {count}st right.",
      "direction#two": "Take the {count}nd right.",
      "direction#few": "Take the {count}rd right.",
      "direction#other": "Take the {count}th right.",
    },
  } as const,
  defaultLocale: "en-EN",
  getLocale: (c) => getCookie(c, "locale-cookie"),
})

...

app.get("/direction", (c) => {
  const t = getI18n(c)
  return c.text(t("direction", { count: 3, ordinal: true }))
  // Result: "Take the 3rd right."
})
```

# Type safety

Type safety in i18n ensures that only valid translation keys are used, catching errors like missing keys or wrong placeholders during development. This improves developer productivity, reduces runtime bugs, and ensures a consistent, error-free user experience across all languages.

## Translation keys

Strict key validation ensures only valid translation keys are used.

![Type safety for keys](https://github.com/user-attachments/assets/9c6680bf-1709-4708-bfb2-c050c7660593)

## Placeholders & Pluralization

Supports placeholders and pluralization with type-safe suggestions for required properties.

![Type safety for placeholders](https://github.com/user-attachments/assets/9509938d-2772-493f-a9a6-09523a93cad5)

![Type safety for plural keys](https://github.com/user-attachments/assets/0029a24a-2e46-4a73-8902-3335265aadf0)