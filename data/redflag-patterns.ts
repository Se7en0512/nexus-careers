export interface RedFlagPattern {
    id: string;
    pattern: RegExp;
    label: string;
    severity: "high" | "medium" | "low";
    explanation: string;
}

export const RED_FLAG_PATTERNS: RedFlagPattern[] = [
    {
        id: "upfront-payment",
        pattern: /(upfront|advance|starter kit|training fee|reservation fee|registration fee|payment to start)/i,
        label: "Request for upfront payment / equipment purchase",
        severity: "high",
        explanation: "A real employer will never make you pay to get in. Training fee, starter kit, or 'advance' payments are classic scam signals.",
    },
    {
        id: "no-interview-fast-hire",
        pattern: /(you're hired|you are hired|congratulations.*accepted|no interview.*required|start immediately)/i,
        label: "Immediate hire with no interview",
        severity: "high",
        explanation: "Real hiring processes involve at least one conversation. A fast 'you're hired' with no interview is usually a scam.",
    },
    {
        id: "move-off-platform",
        pattern: /(outside.*platform|not.*platform|telegram|whatsapp.*only|leave.*upwork|skip.*screening)/i,
        label: "Asked to leave the platform immediately",
        severity: "high",
        explanation: "Legitimate clients keep initial conversations on the platform for buyer protection.",
    },
    {
        id: "vague-description",
        pattern: /(general assistant|do everything|all-rounder|no skills.*required|easy work.*high pay)/i,
        label: "Unusually vague job description",
        severity: "medium",
        explanation: "If you can't answer 'what exactly will I be doing' after reading it, the role likely isn't real.",
    },
    {
        id: "sensitive-info",
        pattern: /(sss.*number|tin.*number|bank.*details|credit card|passport.*copy|send.*id.*before)/i,
        label: "Asking for sensitive personal info before contract",
        severity: "high",
        explanation: "Only share sensitive info (SSS/TIN/bank) AFTER a signed contract. Asking beforehand is a red flag.",
    },
    {
        id: "too-good-to-be-true",
        pattern: /(big salary|high pay|no experience.*high|earn.*dollar|weekly.*salary.*high)/i,
        label: "Pay is unrealistically high for the role",
        severity: "medium",
        explanation: "Big salary with no interview or skill verification is a classic phishing lure.",
    },
    {
        id: "personal-account-payment",
        pattern: /(gcash.*personal|personal.*account|send.*payment.*to|pay.*to my|direct.*to.*bank)/i,
        label: "Payment requested to a personal account",
        severity: "high",
        explanation: "Legitimate companies pay through company accounts or official platforms. Payment to a personal account is a scam indicator.",
    },
    {
        id: "no-company-presence",
        pattern: /(no website|no linkedin|we are a new company|can't share company)/i,
        label: "No verifiable company presence",
        severity: "medium",
        explanation: "If you can't find a website, LinkedIn, or any trace of the business, verify first.",
    },
    {
        id: "pressure-tactics",
        pattern: /(moneygram|western union|send.*money.*first|urgent.*vacancy|limited slots|apply.*now)/i,
        label: "Pressure tactics or spoofed urgency",
        severity: "medium",
        explanation: "Real companies don't pressure you with 'limited slots' or 'urgent vacancy' without a reason.",
    },
    {
        id: "unpaid-trial",
        pattern: /(overtime.*no pay|unpaid.*trial|work first.*pay later)/i,
        label: "Unrealistic work expectations / unpaid trial",
        severity: "medium",
        explanation: "A short paid trial is normal. Unpaid work 'to prove yourself' is exploitation.",
    },
    {
        id: "signup-fee",
        pattern: /(membership fee|signup fee|activation fee|account fee|verification.*fee)/i,
        label: "Membership / signup fee requested",
        severity: "high",
        explanation: "You should never pay a fee just to work. Payments flowing from you to them is the scam direction.",
    },
];

export function scanRedFlags(text: string): RedFlagPattern[] {
    return RED_FLAG_PATTERNS.filter((p) => p.pattern.test(text));
}