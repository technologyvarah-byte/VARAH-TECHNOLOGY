# Security Specification — VARAH MANAGEMENT CCTV Business OS

## 1. Data Invariants
1. **Default-Deny Catch-All**: All paths outside `/admins/{adminId}` and `/erp_items/{itemId}` are strictly denied (`allow read, write: if false;`).
2. **Verified Authentication & Ownership**: Every write operation requires a signed-in user (`request.auth != null`) with `request.auth.token.email_verified == true`. Every `ErpItem` document must have `ownerId == request.auth.uid` on creation and `ownerId` is immutable on updates.
3. **Strict Schema & Volumetric Bounds**: All 26 keys of `ErpItem` must be present (`hasAll` and `hasOnly`), preventing shadow/ghost field injection. Every string has a strict maximum length (`.size() <= MAX`), numbers are bounded (`>= 0 && <= 100000000`), and `tags` list is bounded (`<= 10`).
4. **Query Enforcer & PII Isolation**: `allow list` and `allow get` on `/erp_items/{itemId}` strictly verify `resource.data.ownerId == request.auth.uid || isAdmin()`, preventing cross-tenant PII leaks and unauthorized list scraping.
5. **Terminal State Locking**: Once an `ErpItem` reaches `status == 'Closed'`, no non-admin updates are permitted.
6. **Temporal Integrity**: `createdAt` must equal `request.time` on creation and remain immutable on update; `updatedAt` must equal `request.time` on both creation and update.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection**: Adding `"isSuperAdmin": true` to `/erp_items/item_1`.
2. **Owner Spoofing on Create**: Setting `"ownerId": "victim_uid"` while authenticated as `"attacker_uid"`.
3. **Owner Mutation on Update**: Updating `"ownerId"` from `"attacker_uid"` to `"victim_uid"`.
4. **Unverified Email Write**: Attempting to create `/erp_items/item_1` with `email_verified: false`.
5. **ID Poisoning Attack**: Creating a document with a 500-character or special-character document ID `item!@#$%^&*()`.
6. **Denial-of-Wallet String Overflow**: Sending a 10,000-character `notes` string (exceeds `maxLength: 2000`).
7. **Unbounded Array Injection**: Sending `tags` with 50 items (exceeds `size() <= 10`).
8. **Array Element Type Poisoning**: Sending `tags: [12345]` instead of strings.
9. **Terminal State Bypass**: Attempting to update an `ErpItem` whose existing `status` is `'Closed'` as a non-admin.
10. **Client Timestamp Forgery**: Setting `createdAt` or `updatedAt` to a past/future timestamp instead of `request.time`.
11. **Cross-Tenant PII Read**: Authenticated user `"attacker_uid"` attempting `get` or `list` on `/erp_items` owned by `"victim_uid"`.
12. **Self-Assigned Admin Privilege Escalation**: Non-bootstrapped user attempting to create `/admins/attacker_uid`.
