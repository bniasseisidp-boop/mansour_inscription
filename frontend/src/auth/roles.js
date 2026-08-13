export function defaultRouteForRole(role) {
  if (role === 'admin' || role === 'super_admin') {
    return '/admin'
  }
  return '/'
}
