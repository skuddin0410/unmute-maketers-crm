/* Marketers Unmuted CRM: schema + demo data.
   Every person and company below is invented for the Phase 1 design review.
   The SCHEMA object mirrors the Supabase tables planned for Phase 2. */

window.MU = window.MU || {};

MU.SCHEMA = {
  leads: {
    label: "Lead", plural: "Leads",
    stages: [
      { id: "mined", name: "Mined", hint: "Pulled from a source" },
      { id: "analyzed", name: "Analyzed", hint: "Fit scored" },
      { id: "enriched", name: "Enriched", hint: "Email and LinkedIn found" },
      { id: "ready", name: "Ready to invite", hint: "Picked for outreach" },
      { id: "invited", name: "Invited", hint: "Invite sent" }
    ],
    fields: [
      { key: "name", label: "Full name", required: true },
      { key: "title", label: "Job title", required: true },
      { key: "company", label: "Company", required: true },
      { key: "level", label: "Level", type: "select", options: ["CMO", "Director", "Manager", "Executive"] },
      { key: "region", label: "Region", type: "select", options: ["Canada", "United States", "Europe", "Middle East & Africa", "Asia-Pacific"] },
      { key: "city", label: "City" },
      { key: "industry", label: "Industry" },
      { key: "source", label: "Source", type: "select", options: ["Apollo", "CMA public pages", "AMA Toronto public pages", "LinkedIn", "Guest referral", "Nomination", "Past sponsor", "Website sign-up", "People Moves"] },
      { key: "fit", label: "Fit score", type: "number" },
      { key: "sponsor", label: "Sponsor potential", type: "select", options: ["High", "Medium", "Low"] },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone" },
      { key: "linkedin", label: "LinkedIn URL" }
    ]
  },
  guests: {
    label: "Guest", plural: "Guests & episodes",
    stages: [
      { id: "booked", name: "Booked", hint: "Slot confirmed" },
      { id: "recorded", name: "Recorded", hint: "In the can" },
      { id: "editing", name: "Editing", hint: "Clips and notes" },
      { id: "published", name: "Published", hint: "Live on site + YouTube" },
      { id: "shared", name: "Shared", hint: "Guest posted it" }
    ],
    fields: [
      { key: "name", label: "Guest name", required: true },
      { key: "title", label: "Job title", required: true },
      { key: "company", label: "Company", required: true },
      { key: "series", label: "Series", type: "select", options: ["CMO Edition", "Director Edition", "Manager Edition", "Global Edition"] },
      { key: "region", label: "Region", type: "select", options: ["Canada", "United States", "Europe", "Middle East & Africa", "Asia-Pacific"] },
      { key: "recordAt", label: "Recording", type: "datetime-local" },
      { key: "format", label: "Format", type: "select", options: ["Studio", "Remote"] },
      { key: "episode", label: "Episode title" },
      { key: "email", label: "Email", type: "email" }
    ]
  },
  partners: {
    label: "Association", plural: "Partnerships",
    stages: [
      { id: "research", name: "Research" },
      { id: "contacted", name: "Contacted" },
      { id: "meeting", name: "Meeting" },
      { id: "proposal", name: "Proposal" },
      { id: "partner", name: "Partner" }
    ],
    fields: [
      { key: "org", label: "Association", required: true },
      { key: "region", label: "Region", type: "select", options: ["Canada", "United States", "Europe", "Middle East & Africa", "Asia-Pacific"] },
      { key: "city", label: "City" },
      { key: "contactRole", label: "Contact role" },
      { key: "offer", label: "Our offer" },
      { key: "nextStep", label: "Next step" },
      { key: "nextDate", label: "Next step date", type: "date" }
    ]
  },
  deals: {
    label: "Deal", plural: "Sponsors & deals",
    stages: [
      { id: "conversation", name: "Conversation" },
      { id: "proposal", name: "Proposal sent" },
      { id: "negotiation", name: "Negotiation" },
      { id: "won", name: "Won" },
      { id: "lost", name: "Lost" }
    ],
    fields: [
      { key: "company", label: "Company", required: true },
      { key: "contact", label: "Contact", required: true },
      { key: "product", label: "What they're buying", type: "select", options: ["Series sponsorship", "Newsletter sponsorship", "Top 100 presenting partner", "Small Business Show sponsorship", "Magazine campaign", "Sponsored podcast", "Featured job posts"] },
      { key: "value", label: "Value (CAD)", type: "number" },
      { key: "fromGuest", label: "Came from guest" },
      { key: "closeDate", label: "Expected close", type: "date" }
    ]
  },
  content: {
    label: "Content item", plural: "Content",
    stages: [
      { id: "idea", name: "Idea" },
      { id: "drafting", name: "Drafting" },
      { id: "review", name: "In review" },
      { id: "scheduled", name: "Scheduled" },
      { id: "published", name: "Published" }
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "type", label: "Type", type: "select", options: ["Unmuted Brief newsletter", "Marketer of the Week", "Question of the Week", "Sponsor slot"] },
      { key: "date", label: "Publish date", type: "date" },
      { key: "owner", label: "Owner", type: "select", options: ["Claude", "Raoof", "SK", "Design team"] }
    ]
  },
  followups: {
    label: "Follow-up", plural: "Follow-ups",
    fields: [
      { key: "who", label: "Person", required: true },
      { key: "kind", label: "Type", type: "select", options: ["Day 1 thank-you + share kit", "Day 14 VIP invite", "Day 30 partnership chat", "No-reply nudge", "Association follow-up", "Sponsor follow-up"] },
      { key: "due", label: "Due", type: "date", required: true },
      { key: "owner", label: "Owner", type: "select", options: ["Claude", "Raoof", "SK", "Sales team"] }
    ]
  },
  posts: {
    label: "Post", plural: "Social posts",
    stages: [
      { id: "draft", name: "Draft", hint: "Claude wrote it" },
      { id: "approved", name: "Approved", hint: "You said yes" },
      { id: "scheduled", name: "Scheduled", hint: "Has a time" },
      { id: "posted", name: "Posted", hint: "Live" }
    ],
    fields: [
      { key: "caption", label: "Caption", required: true, type: "textarea" },
      { key: "channel", label: "Channel", type: "select", required: true, options: ["LinkedIn page", "LinkedIn (SK)", "Facebook", "Instagram", "X", "YouTube Shorts"] },
      { key: "format", label: "Format", type: "select", options: ["Video clip", "Quote card", "Text post", "Carousel", "Guest share kit"] },
      { key: "episode", label: "From episode / guest" },
      { key: "scheduledAt", label: "Post time", type: "datetime-local" },
      { key: "firstComment", label: "Link for first comment" }
    ]
  },
  accounts: {
    label: "Account", plural: "Social accounts",
    fields: [
      { key: "name", label: "Account name", required: true },
      { key: "platform", label: "Platform", type: "select", required: true, options: ["LinkedIn", "Facebook", "Instagram", "X", "YouTube", "TikTok"] },
      { key: "handle", label: "Handle" },
      { key: "url", label: "Profile URL", type: "url" },
      { key: "loginNote", label: "Who logs in" }
    ]
  },
  profiles: {
    label: "Profile", plural: "Marketer directory",
    stages: [
      { id: "draft", name: "Draft", hint: "Claude wrote it" },
      { id: "sent", name: "With guest", hint: "Waiting for approval" },
      { id: "approved", name: "Approved", hint: "Guest said yes" },
      { id: "published", name: "Published", hint: "Live on the site" }
    ],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "title", label: "Current role", required: true },
      { key: "company", label: "Company", required: true },
      { key: "city", label: "City" },
      { key: "region", label: "Region", type: "select", options: ["Canada", "United States", "Europe", "Middle East & Africa", "Asia-Pacific"] },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "bio", label: "Their story", type: "textarea" },
      { key: "timelineText", label: "Career timeline (one per line: year | role | company)", type: "textarea" },
      { key: "achievementsText", label: "Achievements (one per line)", type: "textarea" },
      { key: "proudest", label: "Proudest campaign", type: "textarea" },
      { key: "flop", label: "The flop", type: "textarea" },
      { key: "tool", label: "Favourite tool" },
      { key: "shoutout", label: "Team shout-out", type: "textarea" },
      { key: "quote", label: "Pull quote", type: "textarea" },
      { key: "slug", label: "Page address (slug)" }
    ]
  },
  articles: {
    label: "Article", plural: "Articles",
    stages: [
      { id: "draft", name: "Draft" }, { id: "review", name: "In review" },
      { id: "scheduled", name: "Scheduled" }, { id: "published", name: "Published" }
    ],
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "category", label: "Category", type: "select", options: ["Guide", "Episode recap", "Guest column", "Research", "News"] },
      { key: "author", label: "Author" },
      { key: "date", label: "Publish date", type: "date" },
      { key: "slug", label: "Page address (slug)" },
      { key: "excerpt", label: "Summary", type: "textarea" },
      { key: "body", label: "Article", type: "textarea" },
      { key: "seoTitle", label: "Search title" }
    ]
  },
  moves: {
    label: "People Move", plural: "People Moves",
    stages: [
      { id: "spotted", name: "Spotted" }, { id: "verified", name: "Verified" },
      { id: "published", name: "Published" }
    ],
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "newRole", label: "New role", required: true },
      { key: "company", label: "Company", required: true },
      { key: "prevRole", label: "Previous role" },
      { key: "region", label: "Region", type: "select", options: ["Canada", "United States", "Europe", "Middle East & Africa", "Asia-Pacific"] },
      { key: "date", label: "Announced", type: "date" },
      { key: "source", label: "Source link", type: "url" }
    ]
  },
  pages: {
    label: "Page", plural: "Site pages",
    fields: [
      { key: "name", label: "Page", required: true },
      { key: "path", label: "Address", required: true },
      { key: "status", label: "Status", type: "select", options: ["Live", "Draft", "Hidden"] },
      { key: "seoTitle", label: "Search title" },
      { key: "seoDesc", label: "Search description", type: "textarea" }
    ]
  },
  nominations: {
    label: "Nomination", plural: "Top 100 nominations",
    stages: [
      { id: "received", name: "Received" }, { id: "researched", name: "Researched" },
      { id: "shortlisted", name: "Shortlisted" }, { id: "selected", name: "Selected" }
    ],
    fields: [
      { key: "name", label: "Nominee", required: true },
      { key: "company", label: "Company", required: true },
      { key: "category", label: "Category", type: "select", options: ["CMO", "Director", "Rising star", "B2B", "Brand"] },
      { key: "nominatedBy", label: "Nominated by" }
    ]
  },
  events: {
    label: "Event", plural: "Events",
    fields: [
      { key: "title", label: "Event", required: true },
      { key: "type", label: "Type", type: "select", options: ["Toronto breakfast", "Online meetup", "Ask a CMO", "Small Business Show", "Association event"] },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "city", label: "City" },
      { key: "capacity", label: "Capacity", type: "number" }
    ]
  }
};

/* ---------- Demo data (deterministic) ---------- */
MU.buildDemo = function () {
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const day = 864e5;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const iso = (offsetDays) => { const d = new Date(now.getTime() + offsetDays * day); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const pad = (x) => String(x).padStart(2, "0");
  const at = (offsetDays, h, m) => { const d = new Date(now.getTime() + offsetDays * day); d.setHours(h, m || 0); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(h) + ":" + pad(m || 0); };
  let n = 0; const id = (p) => p + "_" + (++n).toString(36);

  const first = ["Avery", "Maya", "Jordan", "Priya", "Liam", "Sofia", "Noah", "Amara", "Ethan", "Chloe", "Daniel", "Hana", "Marcus", "Leila", "Owen", "Grace", "Rohan", "Zoe", "Gabriel", "Nadia", "Theo", "Isla", "Samir", "Elena", "Kai", "Fatima", "Lucas", "Mei", "Adrian", "Tessa", "Victor", "Yara", "Felix", "Anika", "Caleb", "Rosa", "Imran", "Clara", "Mateo", "Jade"];
  const last = ["Tremblay", "Okafor", "Nguyen", "Sharma", "MacLeod", "Rossi", "Bouchard", "Haddad", "Kowalski", "Chen", "Fraser", "Mensah", "Dubois", "Park", "Singh", "Lindqvist", "Moreau", "Adeyemi", "Walsh", "Costa", "Ibrahim", "Kaur", "Lambert", "Novak", "Reyes"];
  const companies = [
    ["Northwind Grocers", "Retail"], ["Maple Ridge Bank", "Banking"], ["Lakeshore Telecom", "Telecom"], ["Brightpath Software", "SaaS"],
    ["Cedar & Stone Insurance", "Insurance"], ["Harbourline Logistics", "Logistics"], ["Polar Bean Coffee", "Food & beverage"], ["Summit Ledger", "Fintech"],
    ["Aurora Home Goods", "Retail"], ["Trailhead Outdoor Co.", "Retail"], ["Clearwave Health", "Healthcare"], ["Ironleaf Manufacturing", "Manufacturing"],
    ["Pinecrest Realty", "Real estate"], ["Bluefin Payments", "Fintech"], ["Kestrel Analytics", "SaaS"], ["Riverbend Foods", "Food & beverage"],
    ["Granite Peak Energy", "Energy"], ["Willow Lane Apparel", "Retail"], ["Novaline Media", "Media"], ["Copperfield Credit Union", "Banking"]
  ];
  const regions = [["Canada", ["Toronto", "Vancouver", "Montréal", "Calgary", "Ottawa", "Halifax"]], ["United States", ["New York", "Chicago", "Austin", "Boston", "Seattle"]], ["Europe", ["London", "Berlin", "Amsterdam", "Paris"]], ["Middle East & Africa", ["Dubai", "Lagos", "Nairobi"]], ["Asia-Pacific", ["Singapore", "Mumbai", "Sydney"]]];
  const titles = { CMO: ["Chief Marketing Officer", "VP Marketing"], Director: ["Director of Marketing", "Director, Brand", "Director, Growth Marketing"], Manager: ["Marketing Manager", "Brand Manager", "Demand Gen Manager"], Executive: ["Marketing Executive", "Senior Marketing Specialist"] };
  const sources = ["Apollo", "Apollo", "Apollo", "CMA public pages", "AMA Toronto public pages", "LinkedIn", "Guest referral", "Nomination", "Past sponsor", "Website sign-up"];
  const stages = ["mined", "mined", "analyzed", "analyzed", "analyzed", "enriched", "enriched", "ready", "invited", "invited"];
  const person = () => pick(first) + " " + pick(last);
  const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "");

  const leads = [];
  for (let i = 0; i < 64; i++) {
    const [company, industry] = pick(companies);
    const r = rnd() < 0.62 ? regions[0] : rnd() < 0.6 ? regions[1] : pick(regions.slice(2));
    const level = pick(["CMO", "Director", "Director", "Manager", "Manager", "Executive"]);
    const stage = pick(stages);
    const name = person();
    const scored = stage !== "mined";
    const enriched = ["enriched", "ready", "invited"].includes(stage);
    leads.push({
      id: id("ld"), name, title: pick(titles[level]), company, industry, level,
      region: r[0], city: pick(r[1]), source: pick(sources), stage,
      fit: scored ? Math.round(45 + rnd() * 55) : null,
      sponsor: scored ? pick(["High", "Medium", "Medium", "Low"]) : "",
      email: enriched ? slug(name.split(" ")[0]) + "@" + slug(company) + ".example" : "",
      phone: enriched && rnd() < 0.5 ? "+1 (555) 01" + Math.floor(10 + rnd() * 89) : "",
      linkedin: enriched ? "linkedin.com/in/" + slug(name) + "-demo" : "",
      createdAt: iso(-Math.floor(rnd() * 30)), notes: []
    });
  }

  const series = { CMO: "CMO Edition", Director: "Director Edition", Manager: "Manager Edition", Executive: "Manager Edition" };
  const guestPlan = [
    ["booked", 0, 10, 0], ["booked", 0, 11, 30], ["booked", 0, 14, 0], ["booked", 0, 16, 0],
    ["booked", 1, 10, 0], ["booked", 1, 13, 0], ["booked", 2, 11, 0], ["booked", 3, 15, 0],
    ["recorded", -1, 10, 0], ["recorded", -1, 14, 0], ["recorded", -2, 11, 0],
    ["editing", -3, 10, 0], ["editing", -3, 15, 0], ["editing", -4, 12, 0],
    ["published", -6, 10, 0], ["published", -7, 14, 0], ["published", -8, 11, 0],
    ["shared", -10, 10, 0], ["shared", -12, 13, 0], ["shared", -15, 11, 0], ["shared", -16, 10, 0], ["shared", -20, 14, 0]
  ];
  const topics = ["The campaign that almost didn't launch", "Building a brand on a small budget", "What our flop taught the whole team", "Why I gave my team the mic", "Loyalty programs that people actually use", "B2B content that sales teams share", "Rebranding a 50-year-old company", "Marketing to SMBs across Canada"];
  const guests = guestPlan.map(([stage, d, h, m], i) => {
    const level = pick(["CMO", "Director", "Director", "Manager"]);
    const [company] = pick(companies);
    const remote = rnd() < 0.45;
    const r = i % 5 === 4 ? pick(regions.slice(1)) : regions[0];
    return {
      id: id("gs"), name: person(), title: pick(titles[level]), company,
      series: r[0] === "Canada" ? series[level] : (rnd() < 0.5 ? "Global Edition" : series[level]),
      region: r[0], recordAt: at(d, h, m), format: remote ? "Remote" : "Studio",
      episode: stage === "booked" ? "" : pick(topics), stage,
      email: "guest" + (i + 1) + "@example.com", notes: []
    };
  });

  const followups = [];
  guests.forEach((g) => {
    const rec = new Date(g.recordAt); rec.setHours(0, 0, 0, 0);
    const off = Math.round((rec - now) / day);
    if (["recorded", "editing", "published", "shared"].includes(g.stage)) {
      followups.push({ id: id("fu"), who: g.name, company: g.company, kind: "Day 1 thank-you + share kit", due: iso(off + 1), owner: "Claude", done: off + 1 < -1 });
      followups.push({ id: id("fu"), who: g.name, company: g.company, kind: "Day 14 VIP invite", due: iso(off + 14), owner: "Claude", done: false });
      followups.push({ id: id("fu"), who: g.name, company: g.company, kind: "Day 30 partnership chat", due: iso(off + 30), owner: "Raoof", done: false });
    }
  });
  leads.filter((l) => l.stage === "invited").slice(0, 5).forEach((l, i) => followups.push({ id: id("fu"), who: l.name, company: l.company, kind: "No-reply nudge", due: iso(i - 2), owner: "Claude", done: false }));

  const partners = [
    { org: "AMA Toronto", region: "Canada", city: "Toronto", contactRole: "Partnerships lead", stage: "contacted", offer: "Feature your members free; cover the CMO Panel", nextStep: "Send first 3 episodes as proof", nextDate: iso(2) },
    { org: "Canadian Marketing Association (CMA)", region: "Canada", city: "Toronto", contactRole: "Media relations", stage: "research", offer: "\"60 Years of Canadian Marketing\" series + CMA Marketing Week media partner", nextStep: "Draft partnership email", nextDate: iso(4) },
    { org: "BCAMA", region: "Canada", city: "Vancouver", contactRole: "Board, events", stage: "research", offer: "Feature BC members; promote events", nextStep: "Find events lead", nextDate: iso(10) },
    { org: "AMA Montréal", region: "Canada", city: "Montréal", contactRole: "Board", stage: "research", offer: "Feature members (EN/FR)", nextStep: "Research contacts", nextDate: iso(14) },
    { org: "American Marketing Association (head office)", region: "United States", city: "Chicago", contactRole: "Partnerships", stage: "research", offer: "Media partnership request", nextStep: "Wait until AMA Toronto is on board", nextDate: iso(45) },
    { org: "AMA New York", region: "United States", city: "New York", contactRole: "Chapter president", stage: "research", offer: "Feature NY members in Director Edition", nextStep: "Research contacts", nextDate: iso(40) },
    { org: "Chartered Institute of Marketing", region: "Europe", city: "London", contactRole: "Media team", stage: "research", offer: "Global Edition guests", nextStep: "Phase 2", nextDate: iso(90) },
    { org: "Regional marketing society (Dubai)", region: "Middle East & Africa", city: "Dubai", contactRole: "To identify", stage: "research", offer: "Online meetup co-host", nextStep: "Phase 2", nextDate: iso(100) },
    { org: "Marketing association (Singapore)", region: "Asia-Pacific", city: "Singapore", contactRole: "To identify", stage: "research", offer: "APAC-time online sessions", nextStep: "Phase 2", nextDate: iso(110) }
  ].map((p) => Object.assign({ id: id("pt"), notes: [] }, p));

  const deals = [
    ["Brightpath Software", "conversation", "Series sponsorship", 18000, 21],
    ["Maple Ridge Bank", "proposal", "Small Business Show sponsorship", 25000, 30],
    ["Kestrel Analytics", "conversation", "Newsletter sponsorship", 6000, 28],
    ["Bluefin Payments", "negotiation", "Top 100 presenting partner", 30000, 14],
    ["Polar Bean Coffee", "won", "Magazine campaign", 9500, -5],
    ["Trailhead Outdoor Co.", "proposal", "Sponsored podcast", 7500, 18],
    ["Clearwave Health", "lost", "Newsletter sponsorship", 4000, -10],
    ["Summit Ledger", "conversation", "Featured job posts", 1500, 12]
  ].map(([company, stage, product, value, close]) => ({ id: id("dl"), company, contact: person(), stage, product, value, fromGuest: rnd() < 0.7 ? pick(guests).name : "", closeDate: iso(close), notes: [] }));

  const content = [
    ["The Unmuted Brief #1", "Unmuted Brief newsletter", "drafting", 3, "Claude"],
    ["Marketer of the Week", "Marketer of the Week", "scheduled", 0, "Claude"],
    ["What's the one tool you can't drop?", "Question of the Week", "scheduled", 0, "Claude"],
    ["The Unmuted Brief #2", "Unmuted Brief newsletter", "idea", 10, "Claude"],
    ["Marketer of the Week (next)", "Marketer of the Week", "drafting", 7, "Claude"],
    ["Launch sponsor slot", "Sponsor slot", "idea", 10, "Raoof"]
  ].map(([title, type, stage, d, owner]) => ({ id: id("ct"), title, type, stage, date: iso(d), owner, notes: [] }));

  const nominations = Array.from({ length: 10 }, () => {
    const [company] = pick(companies);
    return { id: id("nm"), name: person(), company, category: pick(["CMO", "Director", "Rising star", "B2B", "Brand"]), nominatedBy: pick(["Self", "Colleague", "Past guest", "Association"]), stage: pick(["received", "received", "researched", "shortlisted"]), notes: [] };
  });

  const coffee = Array.from({ length: 6 }, (_, i) => ({ id: id("cm"), a: person(), b: person(), match: pick(["Same level", "Same industry", "Same region"]), status: i < 2 ? "Met" : i < 4 ? "Scheduled" : "Intro sent" }));

  const events = [
    { title: "Marketers Unmuted online meetup", type: "Online meetup", date: iso(9), city: "Online", capacity: 100, rsvps: 34 },
    { title: "Ask a CMO: budgets for next year", type: "Ask a CMO", date: iso(16), city: "Online", capacity: 150, rsvps: 51 },
    { title: "Toronto marketers breakfast", type: "Toronto breakfast", date: iso(38), city: "Toronto", capacity: 30, rsvps: 8 },
    { title: "Small Business Show 2027", type: "Small Business Show", date: iso(120), city: "Toronto", capacity: 1500, rsvps: 22 }
  ].map((e) => Object.assign({ id: id("ev"), notes: [] }, e));

  const chans = ["LinkedIn page", "LinkedIn page", "LinkedIn (SK)", "Instagram", "Facebook", "X", "YouTube Shorts"];
  const fmts = { "LinkedIn page": "Video clip", "LinkedIn (SK)": "Text post", Instagram: "Quote card", Facebook: "Video clip", X: "Text post", "YouTube Shorts": "Video clip" };
  const caps = [
    "Her proudest campaign almost never launched. Here's what changed her mind.",
    "\"Give your team the mic.\" One director on why shout-outs beat bonuses.",
    "The flop that taught a whole marketing team to test smaller.",
    "Favourite tool? Not what you'd expect from a CMO.",
    "This week on Marketers Unmuted: three marketers, three campaigns, zero fluff.",
    "New episode: building a brand on a small-business budget.",
    "Congratulations to this week's People Moves. Who should we feature next?"
  ];
  const doneGuests = guests.filter((g) => ["editing", "published", "shared"].includes(g.stage));
  const posts = Array.from({ length: 14 }, (_, i) => {
    const channel = chans[i % chans.length];
    const stage = i < 3 ? "posted" : i < 6 ? "scheduled" : i < 9 ? "approved" : "draft";
    const off = stage === "posted" ? -(i + 1) : stage === "scheduled" ? i - 3 : i - 5;
    const g = doneGuests[i % Math.max(1, doneGuests.length)];
    return { id: id("po"), caption: caps[i % caps.length], channel, format: fmts[channel], episode: g ? g.name + ", " + g.company : "", scheduledAt: stage === "draft" ? "" : at(off, [9, 12, 15, 17][i % 4], 0), firstComment: channel.startsWith("LinkedIn") ? "marketersunmuted.com/episodes" : "", stage, notes: [] };
  });
  const accounts = [
    { name: "Marketers Unmuted", platform: "LinkedIn", handle: "Company page (to create)", url: "https://www.linkedin.com/", loginNote: "Raoof (page admin)" },
    { name: "SK Uddin", platform: "LinkedIn", handle: "Personal profile", url: "https://www.linkedin.com/", loginNote: "SK" },
    { name: "Marketers Unmuted", platform: "Facebook", handle: "Page (to create)", url: "https://www.facebook.com/", loginNote: "Raoof" },
    { name: "Marketers Unmuted", platform: "Instagram", handle: "@marketersunmuted (check)", url: "https://www.instagram.com/", loginNote: "Raoof" },
    { name: "Marketers Unmuted", platform: "X", handle: "@marketersunmuted (check)", url: "https://x.com/", loginNote: "Raoof" },
    { name: "Marketers Unmuted", platform: "YouTube", handle: "Channel (to create)", url: "https://studio.youtube.com/", loginNote: "Podcast editing team" }
  ].map((a) => Object.assign({ id: id("ac"), notes: [] }, a));

  const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const roleSteps = [["Marketing Coordinator", "Brand Associate"], ["Marketing Manager", "Brand Manager"], ["Senior Manager, Marketing", "Head of Brand"]];
  const wins = ["Grew branded search 3x in two years", "Led a rebrand across 40 locations", "Launched a loyalty program with 200,000 members", "Built the company's first in-house content studio", "Named to an industry rising-stars list", "Cut cost per lead by 35% while doubling volume", "Mentors new marketers through a local association", "Took a regional brand national"];
  const proud = ["A neighbourhood campaign that turned customers into the ads. Real people, real stores, and sales up in every market we ran it.", "Our first B2B podcast. Sales started sending episodes instead of brochures.", "Relaunching a 50-year-old brand without losing the people who loved it."];
  const flops = ["We launched a clever campaign nobody understood. The lesson: if you need to explain it, it isn't working.", "We bet the quarter on one channel and the algorithm changed. Now we never put more than a third anywhere.", "A contest that attracted entries, but none of them were customers."];
  const tools = ["A shared spreadsheet the whole team can edit", "Customer interviews, every month, no exceptions", "A whiteboard and a timer", "Search data before any brief"];
  const shouts = ["To my content lead, who turns rough ideas into work people actually read.", "To our designer, who never says it can't be done.", "To the sales team, who tell us the truth about what customers say."];
  const quotes = ["Marketing is a promise. The product is whether you keep it.", "If the team can't explain the campaign in one sentence, customers won't either.", "Small budgets force you to be clear. Clarity wins."];
  const profiles = guests.filter((g) => ["editing", "published", "shared"].includes(g.stage)).map((g, i) => {
    const start = 2008 + (i % 6);
    const prevCo = pick(companies)[0];
    const steps = roleSteps.map((r, k) => (start + k * 4) + " | " + pick(r) + " | " + (k === 2 ? prevCo : pick(companies)[0]));
    steps.push((start + 12) + " | " + g.title + " | " + g.company);
    const status = g.stage === "editing" ? (i % 2 ? "sent" : "draft") : g.stage === "published" ? (i % 2 ? "approved" : "published") : "published";
    return {
      id: id("pf"), guestId: g.id, name: g.name, title: g.title, company: g.company, city: g.region === "Canada" ? pick(regions[0][1]) : pick((regions.find((r) => r[0] === g.region) || regions[1])[1]), region: g.region,
      series: g.series, episode: g.episode,
      headline: g.title + " at " + g.company + ". " + (14 + (i % 8)) + " years building brands people talk about.",
      bio: g.name.split(" ")[0] + " started in a two-person marketing team and learned every job in it. Today " + g.name.split(" ")[0] + " leads marketing at " + g.company + ", where the focus is simple: understand customers better than anyone else, then say less, more clearly.",
      timelineText: steps.join("\n"),
      achievementsText: [wins[i % wins.length], wins[(i + 3) % wins.length], wins[(i + 5) % wins.length]].join("\n"),
      proudest: proud[i % proud.length], flop: flops[i % flops.length], tool: tools[i % tools.length], shoutout: shouts[i % shouts.length], quote: quotes[i % quotes.length],
      slug: slugify(g.name), stage: status, congrats: status === "published" ? 5 + Math.floor(rnd() * 60) : 0, views: status === "published" ? 80 + Math.floor(rnd() * 900) : 0, notes: []
    };
  });
  guests.forEach((g) => { if (["published", "shared"].includes(g.stage)) { g.youtube = "youtube.com/@marketersunmuted"; g.spotify = "open.spotify.com/show/marketersunmuted"; } });

  const articles = [
    ["5 lessons from campaigns that flopped", "Guide", "draft", 10, "Claude (for SK)"],
    ["How directors build a team people want to join", "Episode recap", "review", 4, "Claude (for SK)"],
    ["What Canadian SMBs want from brands in 2027", "Research", "draft", 21, "Editorial desk"],
    ["Why we feature managers, not just CMOs", "Guest column", "published", -3, "SK"],
    ["Welcome to Marketers Unmuted", "News", "published", -6, "SK"]
  ].map(([title, category, stage, d, author]) => ({ id: id("ar"), title, category, stage, date: iso(d), author, slug: slugify(title),
    excerpt: "A short, practical read for marketing leaders, drawn from conversations on Marketers Unmuted.",
    body: "Start with the problem your reader has today.\n\nThen give them three things they can do this week, each with a real example from an episode.\n\nEnd with one question they can take to their next team meeting.",
    seoTitle: title + " | Marketers Unmuted", notes: [] }));

  const moves = Array.from({ length: 8 }, (_, i) => {
    const [company] = pick(companies);
    return { id: id("mv"), name: person(), newRole: pick(["Chief Marketing Officer", "VP Marketing", "Director of Marketing", "Head of Brand", "Director, Growth"]), company, prevRole: pick(["Director of Marketing", "Senior Brand Manager", "Head of Content", "Marketing Manager"]) + " at " + pick(companies)[0], region: i < 6 ? "Canada" : "United States", date: iso(-i * 2), source: "", stage: i < 3 ? "published" : i < 5 ? "verified" : "spotted", congrats: i < 3 ? 3 + Math.floor(rnd() * 30) : 0, notes: [] };
  });

  const pages = [
    ["Home", "/", "Live"], ["Episodes", "/episodes", "Live"], ["Marketer directory", "/marketers", "Live"], ["Articles", "/articles", "Live"],
    ["People Moves", "/people-moves", "Live"], ["Top 100 Marketers", "/top-100", "Draft"], ["Nominate a marketer", "/nominate", "Draft"],
    ["Be a guest", "/be-a-guest", "Live"], ["Newsletter sign-up", "/newsletter", "Live"], ["Events", "/events", "Live"], ["Jobs", "/jobs", "Hidden"],
    ["Community waitlist", "/community", "Live"], ["About", "/about", "Live"], ["Partner with us", "/partners", "Draft"]
  ].map(([name, path, status], i) => ({ id: id("pg"), name, path, status, seoTitle: name + " | Marketers Unmuted", seoDesc: "", updated: iso(-i), notes: [] }));

  return { profiles, articles, moves, pages, posts, accounts, leads, guests, followups, partners, deals, content, nominations, coffee, events, waitlist: 47, newsletterSubs: 312, version: 1 };
};

MU.GOALS = [
  { key: "episodes", label: "Episodes recorded", target: 350, note: "6-month goal from the briefing" },
  { key: "shareRate", label: "Guests who share their episode", target: 70, unit: "%", note: "Goal: 70% or more" },
  { key: "subs", label: "Newsletter subscribers", target: 1000, note: "Placeholder until Month 1 sets the goal" },
  { key: "coffee", label: "Coffee Match pairs", target: 20, note: "Grow every month" },
  { key: "partnerships", label: "Association conversations under way", target: 2, note: "AMA Toronto + CMA" }
];
