import { createI18n } from "@inlang/paraglide-sveltekit"
import * as runtime from "$lib/paraglide/runtime.js"
import * as m from "$lib/paraglide/messages.js"
import { match as int } from "../params/int.js"

export const i18n = createI18n(runtime, {
    pathnames: {
        "/": {
            en: "/en",
            ja: "/ja",
        },

        // You can use parameters
        // All translations must use identical parameters and names
        "/user/[id=int]/[...rest]": {
            en: "/name/[id=int]/[...rest]",
            ja: "/名前/[id=int]/[...rest]",
        },
        // Instead of a map, you can also pass a message-function reference
        "/admin": m.admin_path
    }

	// If you're using matchers in the pathnames, you need to pass them
	matchers: { int }
})
