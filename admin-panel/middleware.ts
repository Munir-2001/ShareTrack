// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { supabase } from "@/lib/supabaseClient";

// export async function middleware(req: NextRequest) {
//   const { data } = await supabase.auth.getSession();

//   if (!data.session) return NextResponse.redirect(new URL("/login", req.url));

//   // Ensure user is an admin (assuming role column exists in DB)
//   const { data: user } = await supabase
//     .from("users")
//     .select("role")
//     .eq("id", data.session.user.id)
//     .single();

//   if (user?.role !== "admin") return NextResponse.redirect(new URL("/login", req.url));

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // Protects all dashboard pages
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { supabase } from "@/lib/supabaseClient";

// export async function middleware(req: NextRequest) {
//   const { data } = await supabase.auth.getSession();

//   if (!data.session) return NextResponse.redirect(new URL("/login", req.url));

//   // Fetch user role
//   const { data: user, error } = await supabase
//     .from("users")
//     .select("role")
//     .eq("id", data.session.user.id)
//     .single();

//   if (error || user?.role !== "admin") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // Protects all dashboard routes
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next(); // Required for Supabase auth cookies

  const supabase = createMiddlewareClient({ req, res });

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Fetch user role (consider caching roles for performance)
  const { data: user, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (error || user?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protects all dashboard routes
};
