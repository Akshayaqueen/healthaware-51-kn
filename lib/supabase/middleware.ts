import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // We keep Supabase session cookies in sync, but DO NOT enforce route redirects here.
  // Client-side Firebase-based <ProtectedRoute> continues to guard feature pages.
  return supabaseResponse

  // Public routes (should never redirect even if unauthenticated)
  const publicRoutes = [
    "/", // homepage
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/login", // keep old allowance just in case
    "/auth", // allow any /auth/* route from examples
  ]

  const pathname = request.nextUrl.pathname

  const isPublic = publicRoutes.some((p) => pathname === p || pathname.startsWith(p + "/"))

  // Only protect known sections of the app; leave everything else visible
  const protectedPrefixes = ["/ai-radio", "/ai-podcast", "/settings", "/profile", "/recommendations", "/comics/new"]
  const requiresAuth = protectedPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (!user && requiresAuth && !isPublic) {
    const url = request.nextUrl.clone()
    // Redirect to the Firebase sign-in page used by the app
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  // Public routes, protected prefixes, and redirect logic below are intentionally bypassed
  // by the early return above to prevent redirect loops when using Firebase auth.
}
