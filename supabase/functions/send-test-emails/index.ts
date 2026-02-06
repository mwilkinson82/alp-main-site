import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// === Inline email templates ===
function wrapEmail(content: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #c9a44a; font-size: 28px; margin: 0 0 10px;">ALP</h1>
      </div>
      <div style="padding: 30px;">
        ${content}
      </div>
      <div style="background: #f5f5f5; padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
        <p style="margin: 0;">ALP — Accelerated Learning Program</p>
        <p style="margin: 5px 0 0;">marshallwilkinson.com</p>
      </div>
    </div>
  `;
}

const p = (text: string) => `<p style="font-size: 16px; color: #333; line-height: 1.6;">${text}</p>`;
const bold = (text: string) => `<strong>${text}</strong>`;
const heading = (text: string) => `<h2 style="font-size: 20px; color: #1a1a1a; margin: 28px 0 12px;">${text}</h2>`;
const bullet = (text: string) => `<li style="margin-bottom: 6px;">${text}</li>`;
const bulletList = (items: string[]) => `<ul style="font-size: 16px; color: #333; line-height: 1.8; padding-left: 20px;">${items.map(bullet).join("")}</ul>`;
const kajabiNote = `
  ${p(`For the best experience, we strongly recommend downloading the ${bold("Kajabi App")} from the iOS or Android app store. This gives you seamless, mobile, on-the-go access to every ALP program directly from your phone.`)}
  ${p("Welcome to the next level.")}
  ${p("ALP Team")}
`;

function alpUniversityEmail(): string {
  return wrapEmail(`
    ${heading("Welcome to ALP U.")}
    ${p("Your account has been created, and you will receive a separate email shortly (or have already) with your login details to access the full ALP training ecosystem.")}
    ${p("As an ALP U student, you now have on-demand access to the entire suite of ALP Courses, Trainings, and daily updates — including:")}
    ${bulletList(["Recorded Power Hour sessions","Contractor School","Sales &amp; Marketing School","New lessons and modules added continuously"])}
    ${p("Every live training we host is uploaded into ALP U for you to revisit anytime, giving you complete flexibility to learn, study, and sharpen at your own pace.")}
    ${kajabiNote}
  `);
}

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
    ${bulletList(["Come prepared with one specific issue you want solved","Bring numbers, context, and constraints","Expect direct answers and high-level clarity","Execute immediately after the session"])}
    ${p("This month is about one thing:")}
    ${p(`${bold("proving to yourself that you can operate at a higher standard.")}`)}
    ${p("Welcome to the room.")}
    ${kajabiNote}
  `);
}

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
    ${bulletList(["Eliminate bottlenecks slowing your growth","Sharpen your execution and decision-making","Strengthen your systems and structure","Expose blind spots that are costing you time and money","Apply pressure to the right moves at the right time"])}
    ${p("You won't leave sessions \"motivated.\"")}
    ${p(`You'll leave with ${bold("clarity")}, which is far more valuable.`)}
    ${heading("Your Role")}
    ${p("Show up each week with:")}
    ${bulletList(["What you're building","What's working","What's breaking","And what decision you've been avoiding"])}
    ${p("Because scaling doesn't come from comfort.")}
    ${p("It comes from compounding.<br>And compounding requires consistency.")}
    ${p("Welcome to the room.")}
    ${kajabiNote}
  `);
}

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
    ${bulletList(["Power Hour (Daily 8am EST)","Contractor School (Tuesdays 7pm EST)","Sales &amp; Marketing School (Wednesdays 7pm EST)","Full access to every recording","Group Discord community","20+ live sessions per month"])}
    ${p("You are now inside the ecosystem.")}
    ${p("And if you use it correctly, you'll feel the compounding quickly.")}
    ${heading("How It Works")}
    ${p("All live sessions are hosted directly inside the ALP Platform.")}
    ${p("When Marshall goes live, the ALP Platform will automatically send you an email notification to join the session.")}
    ${p("No Zoom links. No friction. Just direct access.")}
    ${heading("How To Get the Most Out of Your Membership")}
    ${p("This is simple, but most people don't do it:")}
    ${bulletList(["Show up consistently","Bring real problems, not vague questions","Apply what you learn immediately","Stay in motion long enough for compounding to take over"])}
    ${p("You don't need to be perfect.")}
    ${p(`You just need to ${bold("execute")}.`)}
    ${p("Welcome to the room.")}
    ${kajabiNote}
  `);
}

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
    ${bulletList(["Everything inside the ALP Growth Academy (20+ live sessions per month + full recordings)","10 private 1:1 sessions with Marshall","Direct group text chat access","Priority support","Private elite community access"])}
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
    ${bulletList(["Show up to live sessions consistently","Bring real numbers and real constraints","Use the group environment to pressure-test decisions","Use the 1:1 sessions for high-stakes moves and bottlenecks","Execute fast, then refine"])}
    ${p("Full Access is not about consuming.")}
    ${p(`It's about becoming ${bold("sharper, faster, and more decisive")}.`)}
    ${p("And if you apply pressure properly over the next six months, the results will speak for themselves.")}
    ${p(`${bold("Welcome to the inner circle.")}`)}
    ${kajabiNote}
  `);
}

function handbookSpecialEmail(name: string): string {
  const firstName = name.split(" ")[0];
  return wrapEmail(`
    ${heading("Welcome to ALP — Handbook Special! 📘")}
    ${p(`Hey ${firstName},`)}
    ${p(`Thank you for investing in yourself and joining the ${bold("Handbook Special")}. This is the beginning of something powerful.`)}
    ${p("You'll receive a separate email from Kajabi shortly with your login credentials and access to your courses. Keep an eye on your inbox.")}
    ${p(`${bold("What to expect:")}`)}
    ${bulletList(["Your Kajabi access email will arrive within a few minutes","Live session notifications will be sent directly to your email","Click \"Join Session\" in any notification to hop on live","All recordings are available in your Kajabi dashboard"])}
    ${p("If you have any questions, reply directly to this email — I read everything.")}
    ${p("Let's build something great together.")}
    ${p("— Marshall Wilkinson")}
    ${kajabiNote}
  `);
}

// === Main handler ===
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const testEmails = [
      { html: alpUniversityEmail(), subject: "Welcome to ALP University! 🎓" },
      { html: powerHour1MonthEmail(), subject: "Welcome to Power Hour! 🚀 (1 Month)" },
      { html: powerHour6MonthEmail(), subject: "Welcome to Power Hour! 🚀 (6 Months)" },
      { html: growthAcademyEmail(), subject: "Welcome to the ALP Growth Academy! 🏆" },
      { html: fullAccessEmail(), subject: "Welcome to ALP Full Access! ⭐" },
      { html: handbookSpecialEmail("Marshall Wilkinson"), subject: "Welcome to ALP — Handbook Special! 📘" },
    ];

    const results = [];
    for (const t of testEmails) {
      const { error } = await resend.emails.send({
        from: "ALP — Marshall Wilkinson <marshall@notifications.marshallwilkinson.com>",
        to: [email],
        subject: `[TEST] ${t.subject}`,
        html: t.html,
      });
      results.push({ subject: t.subject, success: !error, error: error?.message });
      console.log(`Sent: ${t.subject} -> ${error ? "FAIL: " + error.message : "OK"}`);
    }

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
