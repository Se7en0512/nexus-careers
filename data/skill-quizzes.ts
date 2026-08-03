export interface SkillQuestion {
    q: string;
    options: string[];
    correct: number;
}

export interface SkillQuiz {
    key: string;
    title: string;
    questions: SkillQuestion[];
}

export const SKILL_QUIZZES: SkillQuiz[] = [
    {
        key: "workspace",
        title: "Google Workspace & Microsoft",
        questions: [
            {
                q: "In Gmail, how do you quickly filter emails from a specific person?",
                options: ["Search 'from:name@gmail.com'", "Click every email one by one", "Delete inbox and restart", "Use the CC field"],
                correct: 0,
            },
            {
                q: "Which Google Sheets formula is used to sum a range?",
                options: ["=AVERAGE()", "=SUM()", "=COUNT()", "=VLOOKUP()"],
                correct: 1,
            },
            {
                q: "How do you share a Google Doc with 'view-only' access?",
                options: ["Send a password", "Set sharing permission to Viewer", "Print and mail it", "Convert to PDF only"],
                correct: 1,
            },
            {
                q: "In Excel, what shortcut is used to copy a cell?",
                options: ["Ctrl+C", "Ctrl+X", "Ctrl+V", "Ctrl+Z"],
                correct: 0,
            },
            {
                q: "What is version history in Google Docs?",
                options: ["A list of fonts", "Previous versions of the document", "A spell checker", "A template gallery"],
                correct: 1,
            },
        ],
    },
    {
        key: "communication",
        title: "Communication Tools",
        questions: [
            {
                q: "In Slack, what is the difference between a channel and a direct message?",
                options: ["They are the same", "Channels are public/shared, DMs are private", "Channels cost money", "DMs are faster"],
                correct: 1,
            },
            {
                q: "How do you set a status in Slack?",
                options: ["Email the admin", "Click profile > set status", "Delete your account", "Use /status command only"],
                correct: 1,
            },
            {
                q: "What WhatsApp Business feature is not in regular WhatsApp?",
                options: ["Video calls", "Quick replies and labels", "Voice messages", "Group chats"],
                correct: 1,
            },
            {
                q: "In Telegram, how do you organize your chats?",
                options: ["Folders and pinned messages", "Delete old chats", "Use email", "Cannot organize"],
                correct: 0,
            },
            {
                q: "Why are threads important in Slack?",
                options: ["For more notifications", "To organize replies under one topic", "To quickly delete messages", "They are useless"],
                correct: 1,
            },
        ],
    },
    {
        key: "project",
        title: "Project Management",
        questions: [
            {
                q: "What is a kanban board?",
                options: ["A type of spreadsheet", "Visual task management with columns/cards", "A calendar view", "A chat tool"],
                correct: 1,
            },
            {
                q: "In Asana, what is a 'task'?",
                options: ["A user", "A specific piece of work", "A project", "A report"],
                correct: 1,
            },
            {
                q: "How do you assign a task in Trello?",
                options: ["Email the team", "Add a member to the card", "Print the board", "Cannot assign"],
                correct: 1,
            },
            {
                q: "What is Notion?",
                options: ["Only a chat app", "Docs + databases + wikis in one", "A video editor", "A payment platform"],
                correct: 1,
            },
            {
                q: "Why are due dates used in project management tools?",
                options: ["For decoration", "To track deadlines and priorities", "To delete tasks", "To increase storage"],
                correct: 1,
            },
        ],
    },
];

export function getSkillQuiz(key: string): SkillQuiz | undefined {
    return SKILL_QUIZZES.find((q) => q.key === key);
}