export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    '/videos/:path*',
    '/planos/:path*',
    '/dashboard/:path*'
  ]
}