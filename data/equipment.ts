export interface EquipmentItem {
  name: string;
  estimate: string;
  note: string;
  buy?: string;
}

export interface EquipmentTier {
  key: string;
  title: string;
  total: string;
  tagline: string;
  items: EquipmentItem[];
}

export const EQUIPMENT_TIERS: EquipmentTier[] = [
  {
    key: "pinakamura",
    title: "Budget",
    total: "≈ ₱25,000–30,000",
    tagline: "For just getting started — it works, it's just not perfect yet.",
    items: [
      {
        name: "Laptop (second-hand)",
        estimate: "₱18,000–₱25,000",
        note: "Examples: ThinkPad T480/T490, i5, 16GB RAM, 256GB SSD. Look on marketplaces that offer a shop warranty.",
        buy: "Shopee, Carousell, Facebook Marketplace",
      },
      {
        name: "Internet (fiber 35 Mbps)",
        estimate: "₱1,299/month",
        note: "Globe or PLDT fiber. Don't rely on mobile data for interviews or day-to-day work.",
        buy: "Globe Fiber, PLDT Fibr",
      },
      {
        name: "Headset with mic",
        estimate: "₱500–₱1,200",
        note: "A basic one with noise isolation is enough. Test it on a voice call before buying.",
        buy: "Shopee, Lazada",
      },
      {
        name: "Mouse + keyboard",
        estimate: "₱400–₱800",
        note: "Wireless combo or wired — either is fine, as long as it's comfortable.",
        buy: "Shopee, Lazada",
      },
      {
        name: "Backup internet",
        estimate: "₱500/month",
        note: "A mobile data plan for emergencies. Dead internet during an interview costs more than this.",
        buy: "Globe, Smart, DITO",
      },
    ],
  },
  {
    key: "gitna",
    title: "Mid-Range",
    total: "≈ ₱42,000–₱50,000",
    tagline: "For those actively applying — a setup that won't leave you stranded mid-task.",
    items: [
      {
        name: "New laptop",
        estimate: "₱32,000–₱40,000",
        note: "Ryzen 5 / Core i5, 16GB RAM, 512GB SSD. Will last 4–5 years under a VA workload.",
        buy: "Shopee, Lazada, Official Store",
      },
      {
        name: "Internet (fiber 100 Mbps)",
        estimate: "₱1,699/month",
        note: "Enough for video calls, cloud backups, and several apps running at once.",
        buy: "Globe Fiber, PLDT Fibr",
      },
      {
        name: "Headset (mid-range)",
        estimate: "₱1,200–₱2,000",
        note: "Better mic and noise cancellation — a big deal in interviews and meetings.",
        buy: "Shopee, Lazada",
      },
      {
        name: "UPS or AVR",
        estimate: "₱2,500–₱4,000",
        note: "Protection against brownouts and sudden power cuts. Worth it in the provinces.",
        buy: "Shopee, Lazada, local appliance stores",
      },
      {
        name: "Webcam",
        estimate: "₱1,000–₱2,000",
        note: "If your laptop's built-in camera is blurry — a 1080p webcam is enough.",
        buy: "Shopee, Lazada",
      },
      {
        name: "External drive (1TB)",
        estimate: "₱2,500–₱3,500",
        note: "For local backups of client files. A client only trusts you if files never get lost.",
        buy: "Shopee, Lazada",
      },
    ],
  },
  {
    key: "komportable",
    title: "Comfortable",
    total: "≈ ₱75,000 and up",
    tagline: "For those already earning — an investment that raises the quality of your work.",
    items: [
      {
        name: "MacBook Air M1/M2 (2nd hand) or high-end Windows",
        estimate: "₱45,000–₱65,000",
        note: "Battery life and build quality — worth it once your income can afford it.",
        buy: "Shopee, Carousell, Apple Authorized Resellers",
      },
      {
        name: "Internet (200–300 Mbps)",
        estimate: "₱2,500–₱4,000/month",
        note: "PLDT or Converge plans, or a dual-fiber setup for redundancy.",
        buy: "PLDT Fibr, Converge ICT",
      },
      {
        name: "Noise-cancelling headset",
        estimate: "₱2,500–₱5,000",
        note: "Anker, JBL, or Jabra — clear audio even in a noisy room.",
        buy: "Shopee, Lazada, official store",
      },
      {
        name: "Mechanical keyboard",
        estimate: "₱1,500–₱4,000",
        note: "More comfortable for all-day typing. Choose quiet switches if you live with other people.",
        buy: "Shopee, Lazada",
      },
      {
        name: "Two monitors",
        estimate: "₱8,000–₱15,000",
        note: "For multitasking — one monitor for the call, another for the work.",
        buy: "Shopee, Lazada",
      },
      {
        name: "UPS with battery backup",
        estimate: "₱5,000–₱8,000",
        note: "Enough power to finish and save your work during a brownout.",
        buy: "Shopee, Lazada, local appliance stores",
      },
    ],
  },
];