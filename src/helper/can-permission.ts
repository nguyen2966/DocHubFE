export function can(
  permissions: string[] | undefined,
  permission: string,
) {
  return !!permissions?.includes(permission)
}