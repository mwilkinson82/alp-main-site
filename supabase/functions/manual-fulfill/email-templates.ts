// Shared email wrapper
function wrapEmail(content: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%); padding: 48px 30px; text-align: center; border-bottom: 3px solid #c9a44a;">
        <h1 style="color: #c9a44a; font-size: 36px; font-weight: 800; letter-spacing: 6px; margin: 0; text-transform: uppercase;">ALP</h1>
        <p style="color: #888; font-size: 11px; letter-spacing: 3px; margin: 8px 0 0; text-transform: uppercase;">Altitude Logic Pressure</p>
      </div>
      <div style="padding: 30px;">
        ${content}
      </div>
      <div style="background: #1a1a1a; padding: 24px 30px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0; color: #c9a44a; font-weight: 600;">ALP — Altitude Logic Pressure</p>
        <p style="margin: 8px 0 0;"><a href="https://altitudelogicpressure.com" style="color: #888; text-decoration: none;">altitudelogicpressure.com</a></p>
      </div>
    </div>
  `;
}

const p = (text: string) => `<p style="font-size: 16px; color: #333; line-height: 1.6;">${text}</p>`;
const bold = (text: string) => `<strong>${text}</strong>`;
const heading = (text: string) => `<h2 style="font-size: 20px; color: #1a1a1a; margin: 28px 0 12px;">${text}</h2>`;
const bullet = (text: string) => `<li style="margin-bottom: 6px;">${text}</li>`;
const bulletList = (items: string[]) => `<ul style="font-size: 16px; color: #333; line-height: 1.8; padding-left: 20px;">${items.map(bullet).join("")}</ul>`;

// Product-specific Discord invite links
const DISCORD_LINKS = {
  powerHour: "https://discord.gg/HNFGs7G8ts",
  contractorSchool: "https://discord.gg/X69TRWU7wb",
  salesMarketing: "https://discord.gg/Hcn5m9MDYu",
  general: "https://discord.gg/jnwDPTY6D3",
};

function kajabiNote(discordUrl: string): string {
  return `
  ${p(`For the best experience, we strongly recommend downloading the ${bold("Kajabi App")} from the iOS or Android app store. This gives you seamless, mobile, on-the-go access to every ALP program directly from your phone.`)}
  ${p(`Be sure to join the ${bold("ALP Discord")} and introduce yourself to the group: <a href="${discordUrl}" style="color: #c9a44a; text-decoration: underline;">Join the ALP Discord</a>`)}
  ${p("Welcome to the next level.")}
  ${p("ALP Team")}
`;
}

// --- ALP University ---
function alpUniversityEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to ALP U.")}
    ${p("Your account has been created, and you will receive a separate email shortly (or have already) with your login details to access the full ALP training ecosystem.")}
    ${p("As an ALP U student, you now have on-demand access to the entire suite of ALP Courses, Trainings, and daily updates — including:")}
    ${bulletList([
      "Recorded Power Hour sessions",
      "Contractor School",
      "Sales &amp; Marketing School",
      "New lessons and modules added continuously",
    ])}
    ${p("Every live training we host is uploaded into ALP U for you to revisit anytime, giving you complete flexibility to learn, study, and sharpen at your own pace.")}
    ${kajabiNote(DISCORD_LINKS.general)}
  `);
}

// --- Power Hour 1 Month ---
function powerHour1MonthEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to Power Hour.")}
    ${p("You just made a decision most people avoid:")}
    ${p(`${bold("You invested in execution instead of motivation.")}`)}
    ${p("Power Hour is not a webinar.<br>It's not a mastermind.<br>And it's definitely not a place where people sit around and talk about what they should do.")}
    ${p("This is where we sharpen decision-making, remove friction, and apply pressure to the moves that create real momentum.")}
    ${p("Over the next month, your job is simple:")}
    ${p(`${bold("Show up. Bring your real bottlenecks. Execute what we clarify.")}`)}
    ${p("That's how compounding begins.")}

    ${heading("How Power Hour Works")}
    ${p("Power Hour is hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("There is no Zoom link to manage, and no extra steps required — just click and enter when the alert goes out.")}

    ${heading("How to Get the Most Out of This")}
    ${bulletList([
      "Come prepared with one specific issue you want solved",
      "Bring numbers, context, and constraints",
      "Expect direct answers and high-level clarity",
      "Execute immediately after the session",
    ])}
    ${p("This month is about one thing:")}
    ${p(`${bold("proving to yourself that you can operate at a higher standard.")}`)}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.powerHour)}
  `);
}

// --- Power Hour 6 Months ---
function powerHour6MonthEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to Power Hour.")}
    ${p("And congratulations — because you didn't just purchase access.")}
    ${p(`${bold("You made a long-term decision to build something most people never will:")}`)}
    ${p("a business with structure, clarity, and repeatable execution.")}
    ${p("Six months is long enough to change your revenue.<br>Six months is long enough to tighten your systems.<br>Six months is long enough to sharpen your decision-making until you become dangerous.")}
    ${p("But only if you show up the right way.")}
    ${p(`Power Hour is not built for spectators.<br>${bold("It's built for operators.")}`)}

    ${heading("How Power Hour Works")}
    ${p("Power Hour is hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No external software. No friction — just click the notification and enter the room.")}

    ${heading("What to Expect Over the Next Six Months")}
    ${p("Over the next six months, we will:")}
    ${bulletList([
      "Eliminate bottlenecks slowing your growth",
      "Sharpen your execution and decision-making",
      "Strengthen your systems and structure",
      "Expose blind spots that are costing you time and money",
      "Apply pressure to the right moves at the right time",
    ])}
    ${p("You won't leave sessions \"motivated.\"")}
    ${p(`You'll leave with ${bold("clarity")}, which is far more valuable.`)}

    ${heading("Your Role")}
    ${p("Show up each week with:")}
    ${bulletList([
      "What you're building",
      "What's working",
      "What's breaking",
      "And what decision you've been avoiding",
    ])}
    ${p("Because scaling doesn't come from comfort.")}
    ${p("It comes from compounding.<br>And compounding requires consistency.")}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.powerHour)}
  `);
}

// --- Contractor School Monthly ---
function contractorSchoolMonthlyEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to Contractor School.")}
    ${p("You just invested in the one thing that separates contractors who stay stuck from those who scale:")}
    ${p(`${bold("Business education designed specifically for construction.")}`)}
    ${p("Contractor School isn't generic business advice repackaged for builders. This is purpose-built training covering the exact systems you need to run a profitable, scalable construction company.")}

    ${heading("What You Now Have Access To")}
    ${bulletList([
      "Live weekly training every Tuesday at 7pm EST",
      "Estimating, project management, legal &amp; contracts",
      "Accounting, C-suite activities, and operations",
      "Full recordings of every session",
      "Direct access to Marshall during live sessions",
    ])}

    ${heading("How It Works")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No friction. Just direct access.")}

    ${heading("How to Get the Most Out of This")}
    ${bulletList([
      "Show up consistently every Tuesday",
      "Bring real problems from your job sites and office",
      "Apply what you learn immediately — don't wait",
      "Use the community to pressure-test your decisions",
    ])}
    ${p(`This is about building a ${bold("business")}, not just running jobs.`)}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.contractorSchool)}
  `);
}

// --- Contractor School Quarter ---
function contractorSchoolQuarterEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to Contractor School.")}
    ${p("You locked in your quarter — and that tells me something about how you operate.")}
    ${p(`${bold("You're not here to dabble. You're here to build.")}`)}
    ${p("Over the next three months, you'll have consistent access to the systems, strategies, and frameworks that separate contractors who scale from those who stay stuck trading time for money.")}

    ${heading("What You Now Have Access To")}
    ${bulletList([
      "Live weekly training every Tuesday at 7pm EST",
      "Estimating, project management, legal &amp; contracts",
      "Accounting, C-suite activities, and operations",
      "Full recordings of every session",
      "Direct access to Marshall during live sessions",
    ])}

    ${heading("How It Works")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No friction. Just direct access.")}

    ${heading("Your Quarter Game Plan")}
    ${bulletList([
      "Month 1: Identify and fix your biggest operational bottleneck",
      "Month 2: Install the systems that create leverage",
      "Month 3: Optimize and scale what's working",
    ])}
    ${p("Three months of consistent execution will change your trajectory.")}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.contractorSchool)}
  `);
}

// --- Sales & Marketing School Monthly ---
function salesMarketingMonthlyEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to Sales & Marketing School.")}
    ${p("You just made the decision that most business owners avoid:")}
    ${p(`${bold("You invested in learning how to consistently generate revenue.")}`)}
    ${p("Sales & Marketing School isn't theory. It's the exact playbook for building a lead generation machine, closing deals with confidence, and growing revenue predictably.")}

    ${heading("What You Now Have Access To")}
    ${bulletList([
      "Live weekly training every Wednesday at 7pm EST",
      "Presentations, negotiation &amp; closing techniques",
      "Website, landing pages &amp; retargeting campaigns",
      "Offline marketing &amp; lead generation systems",
      "Full recordings of every session",
      "Direct access to Marshall during live sessions",
    ])}

    ${heading("How It Works")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No friction. Just direct access.")}

    ${heading("How to Get the Most Out of This")}
    ${bulletList([
      "Show up every Wednesday ready to learn and apply",
      "Bring your real sales challenges and marketing questions",
      "Implement one new strategy each week",
      "Track your results and share wins with the group",
    ])}
    ${p(`Revenue growth isn't luck — it's ${bold("systems")}.`)}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.salesMarketing)}
  `);
}

// --- Sales & Marketing School Quarter ---
function salesMarketingQuarterEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to Sales & Marketing School.")}
    ${p("You locked in your quarter — which means you're serious about building a revenue machine.")}
    ${p(`${bold("Three months is enough time to completely transform how your business generates and closes leads.")}`)}

    ${heading("What You Now Have Access To")}
    ${bulletList([
      "Live weekly training every Wednesday at 7pm EST",
      "Presentations, negotiation &amp; closing techniques",
      "Website, landing pages &amp; retargeting campaigns",
      "Offline marketing &amp; lead generation systems",
      "Full recordings of every session",
      "Direct access to Marshall during live sessions",
    ])}

    ${heading("How It Works")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No friction. Just direct access.")}

    ${heading("Your Quarter Game Plan")}
    ${bulletList([
      "Month 1: Audit your current pipeline and install lead generation systems",
      "Month 2: Sharpen your sales process and close rate",
      "Month 3: Scale what's working and build predictable revenue",
    ])}
    ${p("Consistent execution over three months will compound into serious results.")}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.salesMarketing)}
  `);
}

// --- Growth Academy ---
function growthAcademyEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to the ALP Growth Academy.")}
    ${p("You now have access to what most entrepreneurs spend years searching for:")}
    ${p(`${bold("live proximity, real execution standards, and an ecosystem designed to compound.")}`)}
    ${p("This is not a course library.<br>This is not \"content.\"<br>This is a live operating environment built to sharpen your thinking, your execution, and your results week after week.")}
    ${p("The Growth Academy is designed for one type of person:")}
    ${p(`${bold("the entrepreneur who wants acceleration, not excuses.")}`)}

    ${heading("What You Now Have Access To")}
    ${p("Inside the ALP Growth Academy, your membership includes:")}
    ${bulletList([
      "Power Hour (Daily 8am EST)",
      "Contractor School (Tuesdays 7pm EST)",
      "Sales &amp; Marketing School (Wednesdays 7pm EST)",
      "Full access to every recording",
      "Group Discord community",
      "20+ live sessions per month",
    ])}
    ${p("You are now inside the ecosystem.")}
    ${p("And if you use it correctly, you'll feel the compounding quickly.")}

    ${heading("How It Works")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No friction. Just direct access.")}

    ${heading("How To Get the Most Out of Your Membership")}
    ${p("This is simple, but most people don't do it:")}
    ${bulletList([
      "Show up consistently",
      "Bring real problems, not vague questions",
      "Apply what you learn immediately",
      "Stay in motion long enough for compounding to take over",
    ])}
    ${p("You don't need to be perfect.")}
    ${p(`You just need to ${bold("execute")}.`)}
    ${p("Welcome to the room.")}
    ${kajabiNote(DISCORD_LINKS.general)}
  `);
}

// --- Full Access ---
function fullAccessEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to ALP Full Access.")}
    ${p(`${bold("This is the highest level of access inside the ALP ecosystem.")}`)}
    ${p("And it's not for everyone.")}
    ${p("You didn't just purchase programs.")}
    ${p("You purchased direct proximity, private coaching, and priority-level support designed to compress time and eliminate mistakes before they cost you money.")}
    ${p("This tier is built for entrepreneurs who understand one truth:")}
    ${p(`${bold("speed comes from clarity, and clarity comes from access.")}`)}

    ${heading("What Full Access Includes")}
    ${p("Your Full Access membership includes:")}
    ${bulletList([
      "Everything inside the ALP Growth Academy (20+ live sessions per month + full recordings)",
      "10 private 1:1 sessions with Marshall",
      "Direct group text chat access",
      "Priority support",
      "Private elite community access",
    ])}
    ${p("This tier is designed for serious operators.")}
    ${p("People who don't want theory. They want decisions. Direction. Execution.")}

    ${heading("How Live Sessions Work")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No outside tools. Just direct access.")}

    ${heading("Setting Up Your 1:1 Sessions")}
    ${p("Marshall will personally contact you through the group Discord or by email to coordinate and schedule your private 1:1 sessions.")}
    ${p("You do not need to take any additional steps right now — just keep an eye on your inbox and Discord notifications.")}

    ${heading("How To Get the Most Out of Full Access")}
    ${p("If you want to maximize your return here, follow this:")}
    ${bulletList([
      "Show up to live sessions consistently",
      "Bring real numbers and real constraints",
      "Use the group environment to pressure-test decisions",
      "Use the 1:1 sessions for high-stakes moves and bottlenecks",
      "Execute fast, then refine",
    ])}
    ${p("Full Access is not about consuming.")}
    ${p(`It's about becoming ${bold("sharper, faster, and more decisive")}.`)}
    ${p("And if you apply pressure properly over the next six months, the results will speak for themselves.")}
    ${p(`${bold("Welcome to the inner circle.")}`)}
    ${kajabiNote(DISCORD_LINKS.general)}
  `);
}

// --- 1-on-1 Coaching: Single Session ---
function coachingSingleEmail(name: string): string {
  const firstName = name.split(" ")[0];
  return wrapEmail(`
    ${heading("Welcome — Your 1-on-1 Session Is Confirmed.")}
    ${p(`${firstName},`)}
    ${p(`Congratulations — you just made a move that separates you from 99% of business owners:`)}
    ${p(`${bold("You invested in direct, expert-level guidance.")}`)}
    ${p("This isn't a generic consultation. This is a focused, high-impact hour designed to give you the clarity and direction most people spend months searching for.")}

    ${heading("What Happens Next")}
    ${p(`Marshall will personally follow up with you via email within the next 24–48 hours to:`)}
    ${bulletList([
      "Schedule your session at a time that works for you",
      "Lay out an agenda so every minute is maximized",
      "Set up a brief introductory call (if needed) to align on your biggest priorities before the deep-dive",
    ])}
    ${p("There's nothing you need to do right now — just keep an eye on your inbox.")}

    ${heading("How to Prepare")}
    ${p("When the time comes, bring:")}
    ${bulletList([
      "Your single biggest bottleneck or decision you need clarity on",
      "Any relevant numbers, context, or constraints",
      "An open mind — the best sessions come from real honesty about what's not working",
    ])}
    ${p(`This hour will be ${bold("direct, strategic, and built entirely around your situation")}.`)}
    ${p("No fluff. No filler. Just execution-ready clarity.")}
    ${p("Welcome to the room.")}
    ${p("— Marshall Wilkinson")}
  `);
}

// --- 1-on-1 Coaching: 6-Session Intensive ---
function coaching6SessionEmail(name: string): string {
  const firstName = name.split(" ")[0];
  return wrapEmail(`
    ${heading("Welcome — Your 6-Session Intensive Begins Now.")}
    ${p(`${firstName},`)}
    ${p(`Congratulations — and I mean that.`)}
    ${p(`Most people talk about getting a coach. Most people talk about investing in themselves. ${bold("You actually did it.")}`)}
    ${p("The 6-Session Intensive is not a casual engagement. It's a strategic partnership designed to compress months of progress into weeks — with direct access to me between sessions.")}

    ${heading("What Happens Next")}
    ${p(`I'll personally follow up with you via email within the next 24–48 hours to:`)}
    ${bulletList([
      "Schedule your first session",
      "Lay out an initial agenda based on your goals",
      "Set up a brief introductory call so we can align on priorities and hit the ground running from session one",
    ])}
    ${p("There's nothing you need to do right now — just keep an eye on your inbox.")}

    ${heading("What You Get Over the Next 6 Sessions")}
    ${bulletList([
      "Six 1-hour deep-dive sessions tailored entirely to your business",
      "Direct text & Discord access to me between sessions",
      "A custom strategic scaling roadmap built around your situation",
      "Real-time support when decisions can't wait for the next call",
    ])}

    ${heading("Join the ALP Community")}
    ${p(`As part of your coaching engagement, you have access to the ALP Discord community — connect with other high-level operators and get support between sessions: <a href="${DISCORD_LINKS.general}" style="color: #c9a44a; text-decoration: underline;">Join the ALP Discord</a>`)}

    ${heading("How to Get the Most Out of This")}
    ${p("The entrepreneurs who get the biggest results from this do three things:")}
    ${bulletList([
      "Come prepared with real numbers and real constraints",
      "Execute between sessions — don't wait for permission",
      "Use the direct access line for high-stakes decisions, not just check-ins",
    ])}
    ${p(`This is about ${bold("compounding momentum")} — each session builds on the last.`)}
    ${p("And if you stay disciplined, the trajectory shift will be undeniable.")}
    ${p("Looking forward to working with you.")}
    ${p("— Marshall Wilkinson")}
  `);
}

// --- Handbook Special ---
function handbookSpecialEmail(name: string): string {
  const firstName = name.split(" ")[0];
  return wrapEmail(`
    ${heading("Welcome to ALP — Handbook Special! 📘")}
    ${p(`Hey ${firstName},`)}
    ${p(`Thank you for investing in yourself and joining the ${bold("Handbook Special")}. This is the beginning of something powerful.`)}
    ${p("You'll receive a separate email from Kajabi shortly with your login credentials and access to your courses. Keep an eye on your inbox.")}
    ${p(`${bold("What to expect:")}`)}
    ${bulletList([
      "Your Kajabi access email will arrive within a few minutes",
      "Live session notifications will be sent directly to your email",
      "Click \"Join Session\" in any notification to hop on live",
      "All recordings are available in your Kajabi dashboard",
    ])}
    ${p("If you have any questions, reply directly to this email — I read everything.")}
    ${p("Let's build something great together.")}
    ${p("— Marshall Wilkinson")}
    ${kajabiNote(DISCORD_LINKS.general)}
  `);
}

// --- Ask Marshall Welcome ---
function askMarshallEmail(name: string, email: string): string {
  const firstName = name.split(" ")[0];
  return wrapEmail(`
    ${heading("Your Ask Marshall Submission Is Ready.")}
    ${p(`${firstName},`)}
    ${p(`Thank you for your purchase! You're one step away from getting Marshall's expert analysis on your toughest question.`)}
    ${p(`${bold("Click the link below to submit your question:")}`)}
    ${p(`<a href="https://altitudelogicpressure.com/ask-marshall?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}" style="display: inline-block; background: #c9a44a; color: #000; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Submit Your Question →</a>`)}
    
    ${heading("What Happens Next")}
    ${bulletList([
      "Click the link above to access the submission form",
      "Describe your question in as much detail as possible",
      "Upload any supporting documents (contracts, financials, proposals, etc.)",
      "Within 24 hours, Marshall will send you a personalized Loom video with his analysis and recommendations",
    ])}
    ${p(`The more context you provide, the better Marshall's analysis will be. Don't hold back.`)}
    ${p("— ALP Team")}
  `);
}

// --- Exported map ---
export type ProductKey = string;

export function getWelcomeEmailHtml(productKey: string, customerName: string, customerEmail?: string): string {
  // Legacy Power Hour
  if (productKey === "7sYeVeaO52iGgMo4n8eQM0J") return powerHour1MonthEmail();
  if (productKey === "bJe6oI8FX2iG9jW4n8eQM0I") return powerHour6MonthEmail();
  // New Power Hour
  if (productKey === "7sYdRacWd9L8gMocTEeQM10") return powerHour1MonthEmail();
  if (productKey === "8x25kE7BT5uS53Gf1MeQM11") return powerHour6MonthEmail();
  // Contractor School
  if (productKey === "5kQcN6g8p8H41RubPAeQM12") return contractorSchoolMonthlyEmail();
  if (productKey === "bJebJ22hzg9w7bO3j4eQM13") return contractorSchoolQuarterEmail();
  // Sales & Marketing School
  if (productKey === "dRm4gAe0hg9w1Ru4n8eQM14") return salesMarketingMonthlyEmail();
  if (productKey === "00w9AU09r4qObs4dXIeQM15") return salesMarketingQuarterEmail();
  // Growth Academy (all tiers)
  if (["00wbJ23lDbTgfIk8DoeQM0z", "eVq28sbS9cXkgMo6vgeQM0A", "6oUbJ2aO53mK53G9HseQM0C"].includes(productKey)) return growthAcademyEmail();
  // Full Access (all tiers)
  if (["4gMaEY09r4qO67K8DoeQM0D", "3cI8wQ7BT1eCbs4bPAeQM0E"].includes(productKey)) return fullAccessEmail();
  // Handbook Special
  if (productKey === "8x2bJ28FXg9wgMo1aWeQM0K") return handbookSpecialEmail(customerName);
  // ALP University
  if (productKey === "8x2dRa1dvg9w1RudXIeQM0T") return alpUniversityEmail();
  // 1-on-1 Coaching: Single Session
  if (productKey === "bJeaEYe0h9L8ao0g5QeQM0R") return coachingSingleEmail(customerName);
  // 1-on-1 Coaching: 6-Session Intensive
  if (productKey === "14A5kEf4l0ay7bOaLweQM0Q") return coaching6SessionEmail(customerName);
  // Ask Marshall
  if (productKey === "cNi4gA1dvbTg1Ru5rceQM0S") return askMarshallEmail(customerName, customerEmail || "");

  // Fallback generic
  const firstName = customerName.split(" ")[0];
  return wrapEmail(`
    ${heading("Welcome to ALP.")}
    ${p(`Hey ${firstName},`)}
    ${p("Thank you for investing in yourself. You'll receive a separate email shortly with your login credentials and access details.")}
    ${p("If you have any questions, reply directly to this email.")}
    ${p("— Marshall Wilkinson")}
    ${kajabiNote(DISCORD_LINKS.general)}
  `);
}
