export const OWNER_ADMIN_EMAIL = 'webrokib@gmail.com';

export interface AuthUserLike {
  email?: string | null;
  emailVerified?: boolean | null;
}

/**
 * Strictly authorizes ONLY the verified owner Gmail account (`webrokib@gmail.com`).
 * Rejects every other email address, alias, or unverified account.
 */
export function isAuthorizedOwnerAccount(user: AuthUserLike | null | undefined): boolean {
  if (!user) return false;
  if (user.emailVerified !== true) return false;
  const normalizedEmail = (user.email ?? '').trim().toLowerCase();
  return normalizedEmail === OWNER_ADMIN_EMAIL;
}
