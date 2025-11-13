import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value ?? "";
      },
      set(name: string, value: string, options: CookieOptions = {}) {
        res.cookies.set({
          name,
          value,
          path: "/",
          ...options,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      },
      remove(name: string, options: CookieOptions = {}) {
        res.cookies.set({
          name,
          value: "",
          path: "/",
          ...options,
          maxAge: 0,
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas públicas que NO requieren autenticación
  const publicPaths = ["/", "/login"];
  const isPublicPath = publicPaths.some((path) =>
    path === "/"
      ? req.nextUrl.pathname === "/"
      : req.nextUrl.pathname === path ||
        req.nextUrl.pathname.startsWith(path + "/")
  );

  // Si el usuario NO está logueado y NO está en una ruta pública, redirigir al login
  if (!session && !isPublicPath) {
    const redirectUrl = new URL("/login", req.url);
    // Guardar la URL a la que intentaba acceder para redirigir después del login
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si el usuario está logueado y intenta acceder al login, redirigir a la página principal
  if (session && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas request excepto:
     * 1. /api/ (rutas API)
     * 2. /_next/static (archivos estáticos)
     * 3. /_next/image (optimización de imágenes)
     * 4. /favicon.ico (favicon)
     * 5. /manifest.json (PWA manifest)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
