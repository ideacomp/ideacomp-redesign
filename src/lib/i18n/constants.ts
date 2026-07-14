// Plain constants shared by server (layout.tsx reading cookies()) and
// client ("use client" locale-context.tsx) code. Deliberately not exported
// from locale-context.tsx itself — plain value exports from a "use client"
// module don't reliably cross the server/client boundary.
export const LOCALE_COOKIE = "NEXT_LOCALE";
