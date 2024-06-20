/**
 * An array of routes that are accessible to the public 
 * These routes does not require authentication
 * @type {string[]}
*/
export const publicRoutes: string[] = [
  "/"
]

/**
 * An array of routes that are for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
*/
export const authRoutes: string[] = [
  "/user/login",
  "/user/register",
  "/org/login",
  "/org/register"
]

/**
 * prefix for API authentication route
 * Route the start with this prefix are used for API authentication purposes
 * @type {string}
*/
export const apiAuthPrefix: string = "/api/auth"

/**
 * Default login redirect path after logging in
 * @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard"
