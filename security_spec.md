# REIVON VALE — Firestore Security Specification

## 1. Data Invariants
1. **Owner-Only Administrative Mutations**: Only the verified owner (`webrokib@gmail.com` with `email_verified == true`) or a server-provisioned `/admins/{uid}` record can create, update, or delete `profiles`, `skills`, `projects`, `gallery`, `social_links`, or `site_settings`.
2. **No Self-Registered Admins**: Client writes (`create`, `update`, `delete`) to `/admins/{uid}` are unconditionally denied.
3. **Contact Message PII Isolation**: `contact_messages` contains visitor email addresses and messages. Public visitors can ONLY `create` a new message with `status == 'unread'`, strict field length/regex limits, and server `request.time`. Public `get`, `list`, `update`, and `delete` are strictly denied; only the verified admin can read, update status, or delete messages.
4. **No Shadow Fields**: Every collection enforces `keys().hasAll(...)` and `keys().hasOnly(...)` on create and `affectedKeys().hasOnly(...)` on update.
5. **Temporal Integrity & Immutability**: `createdAt` must equal `request.time` on creation and remain immutable on update; `updatedAt` must equal `request.time` on writes.
6. **Path ID Hardening**: All single-document target operations validate document IDs against `^[a-zA-Z0-9_\-]+$` with max length 128.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Admin Self-Escalation**: Non-admin attempts `create` on `/admins/{attackerUid}` with `{ role: "admin" }`.
2. **Unverified Email Spoof**: Caller with `email: "webrokib@gmail.com"` and `email_verified: false` attempts to update `/profiles/main`.
3. **Public Contact PII Scraping**: Unauthenticated or non-admin authenticated user attempts `list` or `get` on `/contact_messages`.
4. **Contact Ghost Field Injection**: Public visitor submits contact message with extra field `{ isAdmin: true, name: "...", email: "a@b.com", subject: "Hi", message: "Long enough message", status: "unread" }`.
5. **Contact Status Forgery**: Public visitor submits contact message with `{ status: "replied" }` instead of `"unread"`.
6. **Contact Timestamp Forgery**: Public visitor submits contact message with client-supplied past timestamp instead of `request.time`.
7. **Resource Exhaustion / 1MB ID Poisoning**: Attacker writes to `/contact_messages/<200-char-invalid-id>` or injects `message` > 3000 chars.
8. **Invalid Email Format**: Visitor submits `{ email: "not-an-email" }` to `/contact_messages`.
9. **Unauthorized Project Deletion**: Signed-in non-admin user attempts `delete` on `/projects/proj-1`.
10. **Project Shadow Update**: Admin attempts update on `/projects/proj-1` adding undeclared field `{ hacked: true }`.
11. **Project Immutability Tampering**: Admin attempts update changing `createdAt` on `/projects/proj-1`.
12. **Array Overflow Attack**: Admin attempts creating `/projects/proj-x` with 15 items in `technologies` (max 12) or non-string array element.
