import pptxgen from "pptxgenjs";
import { writeFileSync } from "fs";

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Brownshift Technologies";
pptx.company = "Brownshift Technologies";
pptx.subject = "ICS PayScale - Payroll Software Proposal";

const NAVY = "0B2545";
const GOLD = "D4A843";
const WHITE = "FFFFFF";
const GRAY = "666666";
const LIGHT = "F0F4F8";

// Slide 1: Title
let slide = pptx.addSlide();
slide.background = { color: NAVY };
slide.addText("Brownshift Technologies", { x: 1, y: 1.2, w: 11, fontSize: 18, color: GOLD, fontFace: "Segoe UI", bold: true });
slide.addText("ICS PayScale", { x: 1, y: 2.2, w: 11, fontSize: 48, color: WHITE, fontFace: "Segoe UI", bold: true });
slide.addText("A Payroll System Built Around How ICS Operates", { x: 1, y: 3.5, w: 11, fontSize: 20, color: "AABBCC", fontFace: "Segoe UI" });
slide.addText("April 2026", { x: 1, y: 5.5, w: 11, fontSize: 12, color: GRAY, fontFace: "Segoe UI" });

// Slide 2: About Us (short)
slide = pptx.addSlide();
slide.addText("Who We Are", { x: 0.8, y: 0.4, w: 11, fontSize: 28, color: NAVY, fontFace: "Segoe UI", bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2.5, h: 0.04, fill: { color: GOLD } });

slide.addText("Senior engineers across Ghana, UK, US, and Canada.\nCore team in Ghana — we know SSNIT, GRA, and the Labour Act firsthand.", { x: 1, y: 1.4, w: 11, fontSize: 16, color: "333333", fontFace: "Segoe UI", lineSpacingMultiple: 1.4 });

const points = [
  "We build custom systems — no off-the-shelf compromises",
  "You own the source code completely",
  "We specialise in growing organisations like ICS",
];
points.forEach((p, i) => {
  slide.addText(`→  ${p}`, { x: 1, y: 2.8 + i * 0.55, w: 11, fontSize: 15, color: "444444", fontFace: "Segoe UI" });
});

slide.addShape(pptx.ShapeType.roundRect, { x: 1, y: 4.6, w: 11, h: 0.8, fill: { color: LIGHT }, rectRadius: 0.1 });
slide.addText("Local expertise + international engineering standards", { x: 1.3, y: 4.7, w: 10.5, fontSize: 16, color: GOLD, fontFace: "Segoe UI", bold: true, italic: true });

// Slide 3: What You Get
slide = pptx.addSlide();
slide.addText("What You're Getting", { x: 0.8, y: 0.4, w: 11, fontSize: 28, color: NAVY, fontFace: "Segoe UI", bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2.5, h: 0.04, fill: { color: GOLD } });

const features = [
  { name: "Payroll Processing", desc: "Run payroll for one campus or all three. SSNIT, PAYE, pensions, overtime — all calculated automatically." },
  { name: "Salary Disbursement", desc: "Send money to employee bank accounts directly. No manual bank visits or file uploads." },
  { name: "Statutory Filing", desc: "Submit SSNIT and PAYE to government portals from inside the system. Get confirmation numbers instantly." },
  { name: "Employee Management", desc: "All staff records in one place — contracts, salaries, leave, payroll history. Onboard new hires in minutes." },
  { name: "Reports & Analytics", desc: "Campus comparisons, budget vs actual, compliance reports. Export as CSV or PDF with one click." },
  { name: "System Connections", desc: "Connects to your HR system, accounting software, and bank. Data flows automatically." },
];

features.forEach((f, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.8 + col * 6.2;
  const y = 1.3 + row * 1.45;
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 5.8, h: 1.2, fill: { color: LIGHT }, rectRadius: 0.1 });
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.07, h: 1.2, fill: { color: NAVY } });
  slide.addText(f.name, { x: x + 0.25, y: y + 0.1, w: 5.3, fontSize: 14, color: NAVY, fontFace: "Segoe UI", bold: true });
  slide.addText(f.desc, { x: x + 0.25, y: y + 0.5, w: 5.3, fontSize: 11, color: GRAY, fontFace: "Segoe UI" });
});

// Slide 4: Ghana Compliance
slide = pptx.addSlide();
slide.addText("Ghana Compliance — Fully Covered", { x: 0.8, y: 0.4, w: 11, fontSize: 28, color: NAVY, fontFace: "Segoe UI", bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2.5, h: 0.04, fill: { color: GOLD } });

slide.addText("Every statutory obligation is automated. No manual calculations. No missed deadlines.", { x: 1, y: 1.3, w: 11, fontSize: 14, color: GRAY, fontFace: "Segoe UI" });

const compRows = [
  ["SSNIT Tier 1", "13% employer / 5.5% employee", "Auto-calculated, filed to SSNIT portal"],
  ["PAYE Income Tax", "GRA graduated brackets", "Monthly returns filed electronically"],
  ["Tier 2 Pension", "5% employer", "Auto-calculated and reported"],
  ["Tier 3 Provident", "5% voluntary", "Opt-in per employee"],
  ["Overtime", "1.5× / 2×", "Weekday and weekend rates"],
  ["Severance", "Per contract", "Calculated on exit"],
  ["Leave", "Per Labour Act", "21 annual, 10 sick, 12wk maternity"],
];

slide.addTable(
  [
    [
      { text: "Obligation", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 11 } },
      { text: "Rate", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 11 } },
      { text: "How It's Handled", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 11 } },
    ],
    ...compRows.map((r, i) => r.map((c) => ({ text: c, options: { fill: { color: i % 2 === 0 ? WHITE : LIGHT }, fontSize: 12 } }))),
  ],
  { x: 0.8, y: 1.8, w: 11.4, fontFace: "Segoe UI", colW: [3, 3.2, 5.2], border: { type: "solid", pt: 0.5, color: "DDDDDD" } }
);

// Slide 5: Multi-Campus
slide = pptx.addSlide();
slide.addText("Built for Three Campuses, Two Cities", { x: 0.8, y: 0.4, w: 11, fontSize: 28, color: NAVY, fontFace: "Segoe UI", bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2.5, h: 0.04, fill: { color: GOLD } });

const campuses = [
  { name: "Pakyi Campus", city: "Kumasi", adj: "Baseline", x: 1.0 },
  { name: "Ogbojo Campus", city: "Accra", adj: "+15% COL", x: 5.0 },
  { name: "East Legon Campus", city: "Accra", adj: "+25% COL", x: 9.0 },
];
campuses.forEach((c) => {
  slide.addShape(pptx.ShapeType.roundRect, { x: c.x, y: 1.4, w: 3.3, h: 1.6, fill: { color: LIGHT }, rectRadius: 0.12 });
  slide.addText(c.name, { x: c.x, y: 1.55, w: 3.3, fontSize: 15, color: NAVY, fontFace: "Segoe UI", bold: true, align: "center" });
  slide.addText(c.city, { x: c.x, y: 2.0, w: 3.3, fontSize: 12, color: GRAY, fontFace: "Segoe UI", align: "center" });
  slide.addText(c.adj, { x: c.x, y: 2.4, w: 3.3, fontSize: 13, color: GOLD, fontFace: "Segoe UI", bold: true, align: "center" });
});

const campusFeatures = [
  "Run payroll per campus or all at once — with consolidated reporting",
  "Cost-of-living adjustments handled automatically between cities",
  "Switch between campuses from any screen in the system",
  "Campus-level budgeting, headcount tracking, and analytics",
];
campusFeatures.forEach((f, i) => {
  slide.addText(`→  ${f}`, { x: 1, y: 3.5 + i * 0.45, w: 11, fontSize: 13, color: "444444", fontFace: "Segoe UI" });
});

// Slide 6: How We Deliver
slide = pptx.addSlide();
slide.addText("How We'll Deliver It", { x: 0.8, y: 0.4, w: 11, fontSize: 28, color: NAVY, fontFace: "Segoe UI", bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2.5, h: 0.04, fill: { color: GOLD } });

slide.addText("A dedicated team of 2–3 senior engineers for the full 4 months.", { x: 1, y: 1.3, w: 11, fontSize: 14, color: GRAY, fontFace: "Segoe UI" });

const phases = [
  { num: "1", name: "Understand Your Flow", time: "Weeks 1–3", desc: "Embed with your HR & Finance teams. Learn how you actually work." },
  { num: "2", name: "Plan, Build & Iterate", time: "Weeks 4–12", desc: "Build in short cycles. Working software every 1–2 weeks. You give feedback, we adjust." },
  { num: "3", name: "Training, Testing & Go Live", time: "Weeks 13–16", desc: "Your team tests it. We train staff at each campus. Deploy and go live." },
];
phases.forEach((p, i) => {
  const y = 1.9 + i * 1.2;
  slide.addShape(pptx.ShapeType.ellipse, { x: 1, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: NAVY } });
  slide.addText(p.num, { x: 1, y: y + 0.08, w: 0.5, h: 0.5, fontSize: 15, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center", valign: "middle" });
  slide.addText(p.name, { x: 1.7, y: y - 0.02, w: 4, fontSize: 15, color: NAVY, fontFace: "Segoe UI", bold: true });
  slide.addText(p.time, { x: 1.7, y: y + 0.32, w: 4, fontSize: 12, color: GOLD, fontFace: "Segoe UI", bold: true });
  slide.addText(p.desc, { x: 6.2, y: y + 0.05, w: 6, fontSize: 12, color: GRAY, fontFace: "Segoe UI" });
  if (i < phases.length - 1) {
    slide.addShape(pptx.ShapeType.rect, { x: 1.22, y: y + 0.62, w: 0.04, h: 0.22, fill: { color: "CCCCCC" } });
  }
});

// Slide 7: Why Brownshift
slide = pptx.addSlide();
slide.background = { color: NAVY };
slide.addText("Why Brownshift", { x: 0.8, y: 0.4, w: 11, fontSize: 28, color: WHITE, fontFace: "Segoe UI", bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.0, w: 2.5, h: 0.04, fill: { color: GOLD } });

const whyItems = [
  { title: "We're here", desc: "Main team in Ghana. We deal with SSNIT and GRA ourselves." },
  { title: "It's built for you", desc: "Every screen is designed around how ICS operates. Not generic." },
  { title: "You own it", desc: "Full source code. No vendor lock-in. Your system, your control." },
  { title: "We've already shown you", desc: "The working demo isn't a slideshow — it's the actual system." },
];
whyItems.forEach((item, i) => {
  const y = 1.4 + i * 1.0;
  slide.addShape(pptx.ShapeType.roundRect, { x: 1, y, w: 11, h: 0.75, fill: { color: "0D2D52" }, rectRadius: 0.1 });
  slide.addText(item.title, { x: 1.3, y: y + 0.08, w: 3.5, fontSize: 16, color: GOLD, fontFace: "Segoe UI", bold: true });
  slide.addText(item.desc, { x: 5, y: y + 0.08, w: 6.8, fontSize: 14, color: "AABBCC", fontFace: "Segoe UI" });
});

// Slide 8: Thank You
slide = pptx.addSlide();
slide.background = { color: NAVY };
slide.addText("Let's Build This Together", { x: 1, y: 1.8, w: 11, fontSize: 42, color: WHITE, fontFace: "Segoe UI", bold: true, align: "center" });
slide.addText("We've shown you what ICS PayScale can do.\nLet's talk about making it yours.", { x: 1, y: 3.2, w: 11, fontSize: 18, color: "AABBCC", fontFace: "Segoe UI", align: "center", lineSpacingMultiple: 1.4 });
slide.addText("Brownshift Technologies", { x: 1, y: 4.8, w: 11, fontSize: 16, color: GOLD, fontFace: "Segoe UI", bold: true, align: "center" });
slide.addText("Ghana  •  United Kingdom  •  United States  •  Canada", { x: 1, y: 5.2, w: 11, fontSize: 12, color: GRAY, fontFace: "Segoe UI", align: "center" });

// Generate
const outPath = "public/ICS-PayScale-Proposal.pptx";
pptx.write("nodebuffer").then((buffer) => {
  writeFileSync(outPath, buffer);
  console.log(`✅ PowerPoint saved to ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
});
