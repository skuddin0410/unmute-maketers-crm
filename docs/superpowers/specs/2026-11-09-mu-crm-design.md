# Marketers Unmuted CRM: design

Date: 2026-11-09 · Owner: Raoof (CanadianSME) · Built with Claude

## Goal
One place to run Marketers Unmuted end to end: find marketers, book and record them, publish, follow up, and turn relationships into association partnerships and sponsor deals. Raoof runs most of it himself with Claude doing the repetitive work.

## Phases
1. **Demo CRM (this build).** Static web app with the final menus, pages and flows, filled with invented demo data. Saved in the browser only. Goal: agree on design and categories.
2. **Real backend.** Supabase database (tables match `MU.SCHEMA` in `js/data.js`), Supabase Auth logins for the team, hosting on Netlify, row-level security.
3. **Live data and flow.** Import real leads (public CMA/AMA pages plus Apollo/Seamless enrichment via CSV), run the full guest journey, Claude drafting invites, briefs, show notes and newsletters.

## Menu and modules
| Group | Page | What it holds |
|---|---|---|
| Overview | Dashboard | Today's recordings ("On air today"), due follow-ups, lead funnel, 6-month goals from the briefing, Canada partnerships, sponsor pipeline |
| CRM | Leads | Mined → Analyzed → Enriched → Ready to invite → Invited. Board and table, filters, CSV import (Apollo/Seamless), "Book as guest" |
| | Guests & episodes | Booked → Recorded → Editing → Published → Shared. Moving to Recorded creates Day 1/14/30 follow-ups |
| | Follow-ups | Overdue / Today / Next 7 days / Later / Done |
| CRM | Partnerships | Associations by region and phase (Canada now, U.S. next, EU/MEA/APAC later) |
| | Sponsors & deals | Conversation → Proposal → Negotiation → Won/Lost, with values and "from a guest" |
| Website | Marketer directory | One page per guest: journey, achievements, episode stories. Draft → With guest → Approved → Published. Built from the pre-interview form and episode, never copied from LinkedIn |
| | Episodes | What's live on the site and podcast apps, linked to each guest and profile |
| | Articles | Editor with live website preview |
| | People Moves | Spotted → Verified → Published; "Add to leads" turns a new appointment into a sales lead |
| | Site pages | Fixed pages, addresses, search titles, site settings |
| Audience | Socials | Accounts, weekly post calendar, approval queue |
| | Newsletter | Unmuted Brief, Marketer and Question of the Week |
| | Community | Top 100 nominations, events, Coffee Match, waitlist |
| Admin | Team & setup | Team roles, build phases, the briefing's rules |

## One backend
CRM and website share one database: a lead becomes a guest, the guest gets a website profile, and the episode feeds the profile, Episodes page, newsletter and socials. Phase 2 roles keep sponsor data private and give editors only the Website section.

## Design
Brand from the team briefing: navy `#101B31`, lime `#D7FB6B`, signal red `#E6333F`, Manrope type, wordmark and MU badge cropped from the briefing cover. Cool light work area for long sessions; the navy "On air today" strip is the one bold element.

## Lead sourcing rule
The CMA member directory is members-only and not used. Leads come from public pages (CMA board/councils/awards/speakers, AMA chapters), Apollo and Seamless enrichment, guest referrals, nominations and website sign-ups.

## Tech
No build step (package installs unavailable in the build session): `index.html`, `css/app.css`, `js/data.js`, `js/app.js`. Hash routing, localStorage persistence in Phase 1.
