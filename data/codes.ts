export interface CodeBlock {
  key: string;
  label: string;
  content: string;
}

export interface CodeGroup {
  key: string;
  eyebrow: string;
  title: string;
  lead: string;
  blocks: CodeBlock[];
}

export const CODE_GROUPS: CodeGroup[] = [
  {
    key: "sheets",
    eyebrow: "Google Sheets",
    title: "Formulas that think for you",
    lead: "Six formulas cover most VA spreadsheet work. Replace the example ranges with your own data and paste into a cell.",
    blocks: [
      {
        key: "xlookup",
        label: "XLOOKUP — find any value by matching",
        content: `=XLOOKUP("Maria", A2:A100, B2:B100)

What it does: finds "Maria" in column A and returns the matching
value in column B. Search for an email, order number, or client's name — anything.

Tip: if the value isn't found, it returns #N/A. Add a friendly fallback:

=IFERROR(XLOOKUP("Maria", A2:A100, B2:B100), "Not found")`,
      },
      {
        key: "countif",
        label: "COUNTIF / COUNTIFS — count matching items",
        content: `=COUNTIF(A2:A100, "Paid")

What it does: counts how many times "Paid" appears in column A.
Great for invoices, statuses, or attendance.

Multiple conditions — count rows whose status is "Paid" AND
whose value is above 1000:

=COUNTIFS(A2:A100, "Paid", B2:B100, ">1000")`,
      },
      {
        key: "if",
        label: "IF — different value per condition",
        content: `=IF(B2 > 30, "Overdue", "On time")

What it does: if the number in B2 is above 30, it shows "Overdue";
otherwise, "On time". Combine conditions with AND or OR:

=IF(AND(B2 > 30, C2 = "No reminder sent"), "Call client", "OK")`,
      },
      {
        key: "unique",
        label: "UNIQUE — remove duplicates in one step",
        content: `=UNIQUE(A2:A500)

What it does: returns one copy of each value in column A.
Instant dedupe for email lists, client names, or tags in no time.

Pair it with COUNTA to see how many unique values you have:

=COUNTA(UNIQUE(A2:A500))`,
      },
      {
        key: "split",
        label: "SPLIT & TEXT — clean messy data fast",
        content: `=SPLIT(A2, ", ")

What it does: splits a cell into separate columns wherever a comma appears.
Great for "Last Name, First Name" lists.

Convert a number to formatted text — e.g., show it as currency:

=TEXT(B2, "$#,##0.00")

Extract the date from a full timestamp:

=TEXT(A2, "MMM DD, YYYY")`,
      },
      {
        key: "filter",
        label: "FILTER — show only what you need",
        content: `=FILTER(A2:C100, B2:B100 = "High priority")

What it does: returns only the rows where column B says
"High priority". New sheet, paste, done — a live report that
updates itself as your data changes.`,
      },
    ],
  },
  {
    key: "gmail",
    eyebrow: "Gmail",
    title: "Your inbox that organizes itself",
    lead: "Search operators find anything in seconds. Filters sort your mail before you open it. This is a VA's daily bread.",
    blocks: [
      {
        key: "gsearch",
        label: "Search operators — find any email instantly",
        content: `from:client@company.com                    emails from one person
to:me has:attachment                       emails that have files
subject:"invoice"                          emails with "invoice" in the subject
after:2026/01/01 before:2026/02/01         emails within a date range
is:unread size:1M                          unread emails over 1MB
filename:pdf                               emails with a PDF attached
label:receipts is:important                receipts you've marked

String them together freely:  from:client after:2026/01/01 has:attachment`,
      },
      {
        key: "gkeys",
        label: "Keyboard shortcuts — enable once, benefit forever",
        content: `Enable: Settings → See all settings → General → Keyboard shortcuts → On.

e        archive the open message
r        reply
a        reply all
c        compose a new message
/        search
k / j    move between conversations
Enter    open a conversation
#        delete
s        star
v        move to folder/label

Your hands never leave the keyboard.`,
      },
      {
        key: "gfilter",
label: "Filter recipe — auto-label receipts, auto-archive newsletters",
        content: `_create: Gmail → search bar → "More" → "Create filter".

Receipts recipe:
1. In the "From" box: noreply@shop.com
2. Create filter → check "Apply the label" → a new label called "Receipts"
3. Check "Skip the Inbox" if you don't need to see it daily.
4. Also create a filter for "Never mark as spam" so order
   confirmations don't get buried.

Newsletter recipe:
1. In the "From" box: senders or text like "newsletter"
2. Create filter → "Skip the Inbox" → "Apply the label" → "Reading".

Result: your inbox only shows people. Everything else
is filed and findable.`,
      },
      {
        key: "gcanned",
label: "Canned responses — reuse the messages you send every day",
        content: `Enable: Settings → See all settings → Advanced → "Canned responses" → Enable.

How to use:
1. Compose a message you send often (e.g. "Your appointment is confirmed
   for [date] at [time]. Reply here if you need to reschedule.")
2. Click the three dots in the compose window → Canned responses →
   New canned response → name it.
3. Next time: three dots → Canned responses → select → send.
4. Want a shortcut? Name it starting with "!" so it
   sorts to the top of the list.`,
      },
    ],
  },
  {
    key: "win",
    eyebrow: "Windows & Chrome",
    title: "Shortcuts that save you time every week",
    lead: "Ten Windows shortcuts and seven Chrome moves — that's extra time for the important stuff.",
    blocks: [
      {
        key: "win",
        label: "Windows — the 10 you'll use every day",
        content: `Win + Shift + S    screenshot a region (paste directly)
Win + V            clipboard history (paste anything you copied earlier)
Win + .            emoji and symbols panel
Win + Arrow keys   snap the window to half the screen
Win + D            show the desktop
Win + Tab          switch window / virtual desktops
Win + L            lock your computer (do this when you step away)
Alt + Tab          switch between open apps
Ctrl + Shift + Esc open Task Manager directly
Ctrl + Shift + V   paste WITHOUT formatting (kills the ugly font jump)`,
      },
      {
        key: "chrome",
        label: "Chrome — tab control and faster research",
        content: `Ctrl + T            new tab
Ctrl + Shift + T    reopen the tab you just closed (saves lives)
Ctrl + W            close tab
Ctrl + Tab          next tab (Ctrl + Shift + Tab for previous)
Ctrl + L            jump to address bar (type to search)
Ctrl + F            search the page
Ctrl + Shift + A    search your open tabs
Right-click tab → "Pin" — pin Gmail, Drive, and the client portal
so they don't get accidentally closed.

Bookmark all client-related links in one folder: Settings →
manage bookmarks → create a "Client: [name]" folder.`,
      },
    ],
  },
];
