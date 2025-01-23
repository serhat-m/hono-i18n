import { type Locale, type Messages, createTranslate } from "core-i18n"
import type { Context, Next } from "hono"

declare module "hono" {
  interface ContextVariableMap {
    i18n?: {
      locale: Locale
    }
  }
}

type GetLocale<Ctx extends Context, DefaultLocale extends string> = (
  c: Ctx,
  locales: Locale[],
  defaultLocale: DefaultLocale,
) => string | null | undefined

function createGetI18n<TMessages extends Messages>(messages: TMessages) {
  return <Ctx extends Context>(c: Ctx) => {
    const i18n = c.get("i18n")

    if (!i18n) {
      throw new Error("createI18nMiddleware middleware not initialized")
    }

    const { locale } = i18n

    return createTranslate(messages, locale)
  }
}

function createI18nMiddleware<Ctx extends Context, Locales extends string[], DefaultLocale extends Locales[number]>({
  locales,
  defaultLocale,
  getLocale,
}: {
  locales: Locale[]
  defaultLocale: DefaultLocale
  getLocale: GetLocale<Ctx, DefaultLocale>
}) {
  return async (c: Ctx, next: Next) => {
    const selectedLocale = getLocale(c, locales, defaultLocale)
    const locale = typeof selectedLocale === "string" && locales.includes(selectedLocale) ? selectedLocale : defaultLocale

    c.set("i18n", { locale: locale })

    await next()
  }
}

/**
 * Creates i18n instance for [Hono](https://www.npmjs.com/package/hono).
 *
 * @param options - Configuration object
 * @param options.messages - Object with [BCP 47 language tag](https://www.techonthenet.com/js/language_tags.php) keys and their corresponding messages: `{ "en-EN": {...}, "de-DE": {...} }`.
 *
 * **Note:** Use `as const` assertion in TypeScript to ensure message values are inferred as literal types for better type safety: `{ "en-EN": {...}, "de-DE": {...} } as const`.
 * @param options.defaultLocale - Fallback locale if no match is found for `options.getLocale` in given locales.
 * @param options.getLocale - Callback function to determine the locale based on the request, typically using `Accept-Language` header, cookies or other request data.
 * @returns An object containing `i18nMiddleware` for Hono integration and `getI18n` util for creating translate function.
 *
 * @example
 */
export function createI18n<
  Ctx extends Context,
  TMessages extends Messages,
  DefaultLocale extends keyof TMessages extends string ? keyof TMessages : string,
>({
  messages,
  defaultLocale,
  getLocale,
}: {
  messages: TMessages
  defaultLocale: DefaultLocale
  getLocale: GetLocale<Ctx, DefaultLocale>
}) {
  if (!Object.keys(messages).includes(defaultLocale)) {
    throw new Error("defaultLocale is not available in messages")
  }

  return {
    getI18n: createGetI18n(messages),
    i18nMiddleware: createI18nMiddleware({ locales: Object.keys(messages), defaultLocale, getLocale }),
  }
}
