/**
 * Portfolio Strength Scorer
 *
 * Evaluates portfolio completeness and provides a first-impression indicator.
 * Uses only objective data — no AI guessing.
 */

export interface PortfolioStrengthResult {
  score: number;
  level: string;
  levelKey: string;
  impression: "needs-improvement" | "good" | "excellent";
  impressionLabel: string;
  tips: Array<{ type: "warning" | "info" | "success"; text: string }>;
  checklist: Array<{ label: string; done: boolean; points: number }>;
}

interface PortfolioData {
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  links: { label: string; url: string }[];
  projects?: Array<{ title: string; description: string; role: string; tools: string; image: string; liveUrl: string; repoUrl: string }>;
  tagline?: string;
  location?: string;
  availability?: string;
  languages?: string[];
  timezone_info?: string;
  response_time?: string;
}

export function getPortfolioStrength(portfolio: PortfolioData): PortfolioStrengthResult {
  const checklist: PortfolioStrengthResult["checklist"] = [];
  const tips: PortfolioStrengthResult["tips"] = [];

  // 1. Name (5 pts)
  const hasName = !!portfolio.name && portfolio.name.length > 1;
  checklist.push({ label: "Professional name", done: hasName, points: 5 });

  // 2. Bio - short (10 pts)
  const bioLen = portfolio.bio?.trim().length || 0;
  const hasBioShort = bioLen >= 20;
  const hasBioGood = bioLen >= 60;
  checklist.push({ label: "Bio (20+ characters)", done: hasBioShort, points: 10 });
  if (!hasBioShort) {
    tips.push({ type: "warning", text: "Your bio is too short. Try adding 2–3 sentences about what you do and who you work with." });
  } else if (!hasBioGood) {
    tips.push({ type: "info", text: "Your bio could be stronger. Add more detail about your work style or results you've delivered." });
  }

  // 3. Tagline (5 pts)
  const hasTagline = !!(portfolio.tagline && portfolio.tagline.length > 5);
  checklist.push({ label: "Tagline", done: hasTagline, points: 5 });
  if (!hasTagline) {
    tips.push({ type: "info", text: "A short tagline (e.g. 'Executive Assistant | Calendar & Email Management') makes your profile memorable." });
  }

  // 4. Skills (10 pts)
  const skillCount = portfolio.skills?.length || 0;
  const hasSkills = skillCount >= 3;
  const hasManySkills = skillCount >= 5;
  checklist.push({ label: "3+ Skills listed", done: hasSkills, points: 10 });
  if (!hasSkills) {
    tips.push({ type: "warning", text: "Add at least 3 skills. Clients search by skill keywords." });
  }

  // 5. Experience (10 pts)
  const expLen = portfolio.experience?.trim().length || 0;
  const hasExperience = expLen >= 20;
  checklist.push({ label: "Experience or background", done: hasExperience, points: 10 });
  if (!hasExperience && skillCount > 0) {
    tips.push({ type: "info", text: "You listed skills but no experience. Even volunteer work or personal projects count — add them." });
  }

  // 6. Links (10 pts)
  const linkCount = portfolio.links?.filter(l => l.url)?.length || 0;
  const hasLinks = linkCount >= 1;
  const hasManyLinks = linkCount >= 3;
  checklist.push({ label: "1+ work sample link", done: hasLinks, points: 10 });
  if (!hasLinks) {
    tips.push({ type: "warning", text: "Add at least one work sample. Clients want to see your work before they hire you." });
  }

  // 7. Featured Projects (15 pts)
  const projectCount = portfolio.projects?.length || 0;
  const hasProjects = projectCount >= 1;
  const hasManyProjects = projectCount >= 3;
  checklist.push({ label: "1+ featured project", done: hasProjects, points: 15 });
  if (!hasProjects) {
    tips.push({ type: "info", text: "Featured projects make your portfolio stand out. Add a project with title, description, and tools used." });
  }

  // 8. Trust signals (10 pts)
  const hasLocation = !!(portfolio.location && portfolio.location.length > 1);
  const hasAvailability = !!(portfolio.availability && portfolio.availability.length > 1);
  const hasLanguages = !!(portfolio.languages && portfolio.languages.length > 0);
  const trustCount = [hasLocation, hasAvailability, hasLanguages].filter(Boolean).length;
  const hasTrust = trustCount >= 2;
  checklist.push({ label: "Trust signals (location, availability, languages)", done: hasTrust, points: 10 });
  if (!hasTrust) {
    tips.push({ type: "info", text: "Add location, availability, and languages to build trust with clients." });
  }

  // 9. Response time (5 pts)
  const hasResponseTime = !!(portfolio.response_time && portfolio.response_time.length > 1);
  checklist.push({ label: "Response time", done: hasResponseTime, points: 5 });
  if (!hasResponseTime) {
    tips.push({ type: "info", text: "Adding a response time (e.g. 'Within 24 hours') sets expectations and builds trust." });
  }

  // 10. Timezone (5 pts)
  const hasTimezone = !!(portfolio.timezone_info && portfolio.timezone_info.length > 1);
  checklist.push({ label: "Timezone", done: hasTimezone, points: 5 });
  if (!hasTimezone) {
    tips.push({ type: "info", text: "Include your timezone (e.g. 'GMT+8, Philippines') so clients know your working hours." });
  }

  // 11. Project with image (5 pts)
  const hasProjectImage = portfolio.projects?.some(p => p.image && p.image.length > 5) || false;
  checklist.push({ label: "Project with thumbnail", done: hasProjectImage, points: 5 });
  if (!hasProjects && !hasProjectImage) {
    // Don't add duplicate tip
  } else if (hasProjects && !hasProjectImage) {
    tips.push({ type: "info", text: "Add thumbnail images to your projects. Visual portfolios get more engagement." });
  }

  // Calculate score
  const totalPoints = checklist.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = checklist.filter(c => c.done).reduce((sum, c) => sum + c.points, 0);
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  // Determine level
  let level: string;
  let levelKey: string;
  if (score >= 90) { level = "Outstanding"; levelKey = "outstanding"; }
  else if (score >= 70) { level = "Strong"; levelKey = "strong"; }
  else if (score >= 50) { level = "Good Start"; levelKey = "good-start"; }
  else if (score >= 30) { level = "Needs Work"; levelKey = "needs-work"; }
  else { level = "Just Started"; levelKey = "just-started"; }

  // Determine first impression
  let impression: PortfolioStrengthResult["impression"];
  let impressionLabel: string;
  if (score >= 80) {
    impression = "excellent";
    impressionLabel = "Excellent First Impression";
  } else if (score >= 50) {
    impression = "good";
    impressionLabel = "Good First Impression";
  } else {
    impression = "needs-improvement";
    impressionLabel = "Needs Improvement";
  }

  // Sort tips: warnings first
  tips.sort((a, b) => {
    const order = { warning: 0, info: 1, success: 2 };
    return (order[a.type] ?? 1) - (order[b.type] ?? 1);
  });

  return { score, level, levelKey, impression, impressionLabel, tips: tips.slice(0, 5), checklist };
}
