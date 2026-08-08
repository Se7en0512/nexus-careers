/**
 * Feature Flags
 *
 * Central configuration for temporarily disabled features.
 * Each flag controls a specific feature that can be toggled on/off.
 */

// Email verification is enabled; emails are sent via Gmail SMTP (GMAIL_USER /
// GMAIL_APP_PASSWORD). When true: users must verify their email via the link
// sent to their inbox.
export const EMAIL_VERIFICATION_ENABLED = true;
