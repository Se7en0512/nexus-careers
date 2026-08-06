/**
 * Feature Flags
 *
 * Central configuration for temporarily disabled features.
 * Each flag controls a specific feature that can be toggled on/off.
 */

// TEMPORARILY DISABLED
// Re-enable once a verified email domain is configured on Resend.
// When false: users are auto-verified on signup, no verification email is sent,
//             and all email_verified checks are bypassed.
// When true:  users must verify their email via the link sent to their inbox.
export const EMAIL_VERIFICATION_ENABLED = false;
