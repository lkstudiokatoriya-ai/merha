# Security Specification: Merha Village Digital Portal

## 1. Data Invariants

1. **Public Readability vs. PII Isolation**:
   - `/village_portal/{docId}` (specifically `docId == 'main'`) is publicly readable (`get`) by all visitors so the Merha Village website loads immediately for everyone.
   - `/contact_suggestions/{suggestionId}` contains citizen contact info (`name`, `contact`, `message`) and MUST NOT be publicly readable. Only verified administrators (`isAdmin()`) may `get`, `list`, or `delete` documents in `/contact_suggestions`.
2. **Strict Admin-Only Portal Mutation**:
   - Creating or updating `/village_portal/main` requires a verified administrator (`isAdmin()`), strict schema validation (`isValidVillagePortalConfig(incoming())`), and server timestamp verification (`incoming().updatedAt == request.time`).
3. **Strict Schema & Volumetric Guards**:
   - Every string and list field in both `/village_portal/{docId}` and `/contact_suggestions/{suggestionId}` is bounded by explicit `.size()` constraints and key allowlists (`hasAll` + `hasOnly`).

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Shadow Field Injection on Portal Config**: Adding `"isSuperAdmin": true` to `/village_portal/main`.
2. **Unverified Email Spoof Attack**: Attempting to write to `/village_portal/main` with `email == 'vishwanathmandalbnk99@gmail.com'` when `email_verified == false`.
3. **Oversized String DoS on Contact Suggestion**: Submitting a `message` field of 50,000 characters to `/contact_suggestions/{id}`.
4. **Client Timestamp Forgery**: Submitting a forged past or future timestamp instead of `request.time` for `createdAt` or `updatedAt`.
5. **PII Scraping Attack**: An unauthenticated or non-admin user attempting `get` or `list` on `/contact_suggestions`.
6. **ID Poisoning Attack**: Creating a document in `/contact_suggestions` with a 500-character junk ID containing special characters.
7. **Missing Required Keys**: Creating a contact suggestion without the `contact` or `topic` field.
8. **Type Confusion on Village Arrays**: Writing a string or boolean into `gallery` or `newsUpdates` instead of a bounded `list`.
9. **Unauthorized Update on Contact Suggestions**: Attempting to `update` an existing citizen suggestion in `/contact_suggestions/{id}` (suggestions are append-only/immutable after creation).
10. **Arbitrary Document Creation in `/village_portal`**: Attempting to create `/village_portal/random_doc` instead of the singleton `'main'`.
11. **UpdatedBy Identity Spoofing**: Admin writing a forged `updatedBy` UID that does not match `request.auth.uid`.
12. **Unbounded Array Exhaustion**: Attempting to push 500 items into `gallery` or `newsUpdates` exceeding the maximum list limit.
