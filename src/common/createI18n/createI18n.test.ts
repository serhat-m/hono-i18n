import { describe } from "node:test"
import { Hono } from "hono"
import { getCookie } from "hono/cookie"
import { expect, it } from "vitest"
import { createI18n } from "./createI18n"

const localeCookieName = "locale-cookie"

const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    "en-EN": { greeting: "Hi!" },
    "de-DE": { greeting: "Hallo!" },
  } as const,
  defaultLocale: "en-EN",
  getLocale: (c) => getCookie(c, localeCookieName),
})

describe("createI18n", () => {
  it("should throw an error if defaultLocale is not available in messages", () => {
    expect(() =>
      createI18n({
        messages: {
          "en-EN": { greeting: "Hi!" },
          "de-DE": { greeting: "Hallo!" },
        },
        // @ts-expect-error
        defaultLocale: "tr-TR",
        getLocale: (c) => getCookie(c, localeCookieName),
      }),
    ).toThrow("defaultLocale is not available in messages")
  })

  describe("i18nMiddleware", () => {
    it("should correctly register i18n context", async () => {
      const app = new Hono()

      app.use(i18nMiddleware)

      app.get("/search", (c) => {
        const i18nContext = c.get("i18n")
        return c.json(i18nContext)
      })

      const res = await app.request("/search", { headers: { Cookie: `${localeCookieName}=en-EN` } })

      expect(await res.json()).toEqual({
        locale: "en-EN",
      })
    })

    it("should register default locale if locale getter is not matching given locales", async () => {
      const app = new Hono()

      app.use(i18nMiddleware)

      app.get("/search", (c) => {
        const i18nContext = c.get("i18n")
        return c.json(i18nContext)
      })

      const res = await app.request("/search", { headers: { Cookie: `${localeCookieName}=tr-TR` } })

      expect(await res.json()).toEqual({
        locale: "en-EN",
      })
    })
  })

  describe("getI18n", () => {
    it("should throw an error if i18n middleware is not registered", async () => {
      const app = new Hono().onError((err) => {
        return new Response(err.message)
      })

      app.get("/search", (c) => {
        const t = getI18n(c)
        return c.text(t("greeting"))
      })

      const result = await app.request("/search")

      expect(await result.text()).toBe("createI18nMiddleware middleware not initialized")
    })

    it("should return translated response based on locale getter", async () => {
      const app = new Hono()

      app.use(i18nMiddleware)

      app.get("/search", (c) => {
        const t = getI18n(c)
        return c.text(t("greeting"))
      })

      const res = await app.request("/search", { headers: { Cookie: `${localeCookieName}=de-DE` } })

      expect(await res.text()).toBe("Hallo!")
    })

    it("should return translated response for default locale if locale getter is not matching", async () => {
      const app = new Hono()

      app.use(i18nMiddleware)

      app.get("/search", (c) => {
        const t = getI18n(c)
        return c.text(t("greeting"))
      })

      const res = await app.request("/search", { headers: { Cookie: `${localeCookieName}=tr-TR` } })

      expect(await res.text()).toBe("Hi!")
    })
  })
})
