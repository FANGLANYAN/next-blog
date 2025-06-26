import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    if (!hasEnvVars) {
        return supabaseResponse;
    }

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // ✅ 1. 如果访问首页 `/`，重定向到 `/categories`
    if (pathname === "/") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/categories";
        return NextResponse.redirect(redirectUrl);
    }

    // ✅ 2. 如果未登录，且访问的是受保护页面，则跳转到 `/auth/login`
    const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/login");

    if (!user && !isAuthPage) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/auth/login";
        return NextResponse.redirect(redirectUrl);
    }

    // ✅ 3. 如果已登录，却访问 `/auth/login`，重定向到 `/`
    if (user && pathname === "/auth/login") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        // return NextResponse.redirect(redirectUrl);
        return new NextResponse(null, { status: 204 }); // No Content
    }

    return supabaseResponse;
}
