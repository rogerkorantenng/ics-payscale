"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";
import PageTransition from "@/components/page-transition";

export default function ProposalPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(content.innerHTML);
    win.document.close();
    win.onload = () => win.print();
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFP Proposal Document</h1>
          <p className="text-sm text-gray-500 mt-1">Ready to print or save as PDF</p>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-gradient-to-r from-[#0B2545] to-[#1a4a7a] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-[0.98]">
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      <div ref={printRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          dangerouslySetInnerHTML={{
            __html: `
<style>
  .proposal { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; line-height: 1.7; max-width: 780px; margin: 0 auto; padding: 50px; }
  .proposal h1 { font-size: 26px; color: #0B2545; margin-bottom: 4px; }
  .proposal h2 { font-size: 19px; color: #0B2545; margin-top: 32px; border-bottom: 2px solid #D4A843; padding-bottom: 6px; }
  .proposal h3 { font-size: 15px; color: #0B2545; margin-top: 18px; }
  .proposal p, .proposal li { font-size: 13px; color: #333; }
  .proposal ul { padding-left: 18px; }
  .proposal li { margin-bottom: 5px; }
  .proposal .cover { text-align: center; padding: 50px 0; border-bottom: 3px solid #0B2545; margin-bottom: 35px; }
  .proposal .cover .logo { font-size: 32px; font-weight: 800; color: #0B2545; }
  .proposal .cover .logo span { color: #D4A843; }
  .proposal .cover .tagline { font-size: 13px; color: #888; margin-top: 4px; }
  .proposal .cover .title { font-size: 20px; color: #0B2545; margin-top: 28px; font-weight: 700; }
  .proposal .cover .subtitle { font-size: 13px; color: #666; margin-top: 6px; }
  .proposal .cover .date { font-size: 11px; color: #aaa; margin-top: 18px; }
  .proposal .highlight { background: #f0f4f8; border-left: 4px solid #D4A843; padding: 12px 18px; margin: 14px 0; border-radius: 0 6px 6px 0; }
  .proposal .highlight p { margin: 0; }
  .proposal table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
  .proposal th { background: #0B2545; color: white; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
  .proposal td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
  .proposal tr:nth-child(even) { background: #f8f9fb; }
  .proposal .phase { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eee; }
  .proposal .phase-num { width: 26px; height: 26px; background: #0B2545; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; flex-shrink: 0; margin-top: 2px; }
  .proposal .phase-info strong { font-size: 13px; color: #0B2545; }
  .proposal .phase-info span { font-size: 12px; color: #666; }
  .proposal .footer { margin-top: 40px; padding-top: 15px; border-top: 2px solid #0B2545; text-align: center; font-size: 10px; color: #aaa; }
  @media print { .proposal { padding: 25px; } }
</style>
<div class="proposal">

  <div class="cover">
    <div class="logo">Brownshift <span>Technologies</span></div>
    <div class="tagline">Engineering Excellence Across Borders</div>
    <div class="title">Proposal: Payroll Software Solution</div>
    <div class="subtitle">Prepared for International Community School Ghana</div>
    <div class="date">April 2026 | Confidential</div>
  </div>

  <h2>About Us</h2>
  <p>Brownshift Technologies is a team of senior software engineers based in <strong>Ghana, the UK, the US, and Canada</strong>. Our core team operates from Ghana, so we understand local regulatory requirements firsthand — SSNIT, GRA, the Labour Act — while our international team ensures the software meets global quality standards.</p>
  <p>We specialise in building custom systems for growing organisations. We don't sell off-the-shelf products. We build exactly what you need, and you own it completely.</p>

  <h2>What We're Proposing</h2>
  <p>We will build <strong>ICS PayScale</strong> — a payroll management system designed around how ICS operates. It handles everything from calculating salaries to sending money to employee bank accounts to filing with SSNIT and GRA.</p>

  <div class="highlight">
    <p><strong>A working demo of ICS PayScale is included with this proposal.</strong> It contains realistic data for all three campuses so your team can explore the system firsthand.</p>
  </div>

  <h3>What the System Does</h3>
  <table>
    <tr><th style="width:30%">Feature</th><th>What It Means for ICS</th></tr>
    <tr><td><strong>Payroll Processing</strong></td><td>Run payroll for one campus or all three at once. The system automatically calculates every employee's SSNIT, PAYE tax, pension, overtime, and net pay — no manual spreadsheets.</td></tr>
    <tr><td><strong>Salary Disbursement</strong></td><td>Send salaries directly to employee bank accounts from within the system. No need to visit the bank or upload files manually. You see each payment's status in real time.</td></tr>
    <tr><td><strong>Statutory Filing</strong></td><td>Submit SSNIT contributions and PAYE returns to government portals directly from the system. You get confirmation numbers and a complete filing history.</td></tr>
    <tr><td><strong>Employee Management</strong></td><td>One place for all staff records across campuses — contracts, salary structures, leave balances, payroll history. Add new hires in minutes.</td></tr>
    <tr><td><strong>Compliance Reports</strong></td><td>Generate SSNIT, PAYE, and pension reports ready for filing or audit. Export as CSV or PDF with one click.</td></tr>
    <tr><td><strong>Campus Analytics</strong></td><td>Compare payroll costs across Pakyi, Ogbojo, and East Legon. See budget vs. actual spending, headcount trends, and cost-of-living differences between Kumasi and Accra.</td></tr>
    <tr><td><strong>Leave & Attendance</strong></td><td>Staff request leave, managers approve or reject, and balances update automatically — linked to payroll so deductions are accurate.</td></tr>
    <tr><td><strong>System Connections</strong></td><td>Connects to your existing HR system, accounting software, and bank. Data flows automatically so nobody re-enters information.</td></tr>
    <tr><td><strong>Security & Audit Trail</strong></td><td>Every action is logged — who did what, when, from where. Role-based access ensures people only see what they need. All data is encrypted.</td></tr>
  </table>

  <h3>Ghana Compliance — Fully Covered</h3>
  <table>
    <tr><th>Obligation</th><th>How It's Handled</th></tr>
    <tr><td>SSNIT Tier 1</td><td>Auto-calculated (13% employer, 5.5% employee). File directly to SSNIT portal.</td></tr>
    <tr><td>PAYE Income Tax</td><td>Auto-calculated using current GRA graduated brackets. Monthly returns filed electronically.</td></tr>
    <tr><td>Tier 2 Pension</td><td>5% employer contribution, auto-calculated and reported.</td></tr>
    <tr><td>Tier 3 Provident Fund</td><td>Voluntary opt-in per employee. System tracks enrolment and calculates automatically.</td></tr>
    <tr><td>Overtime</td><td>1.5× for weekdays, 2× for weekends/holidays. Added to gross pay automatically.</td></tr>
    <tr><td>Severance</td><td>Calculated based on years of service and contract terms when an employee exits.</td></tr>
    <tr><td>Leave Entitlements</td><td>Annual leave (21 days), sick leave (10 days), maternity leave (12 weeks) per the Labour Act.</td></tr>
  </table>

  <h2>How We'll Deliver It</h2>

  <p>We assign a dedicated team of <strong>2–3 senior engineers</strong> to your project for the full duration. Here's how the 4 months break down:</p>

  <div class="phase"><div class="phase-num">1</div><div class="phase-info"><strong>Understand Your Flow</strong> — Weeks 1–3<br/><span>We embed with your HR and Finance teams across campuses. We learn how you currently run payroll, what works, what doesn't, and design the system around your actual process — not the other way around.</span></div></div>

  <div class="phase"><div class="phase-num">2</div><div class="phase-info"><strong>Plan, Build & Iterate</strong> — Weeks 4–12<br/><span>We build in short cycles, showing you working software every 1–2 weeks. You give feedback, we adjust. By the end of this phase, the full system is built — payroll, disbursement, employees, compliance, analytics, integrations, everything.</span></div></div>

  <div class="phase"><div class="phase-num">3</div><div class="phase-info"><strong>Training, Testing & Go Live</strong> — Weeks 13–16<br/><span>Your team tests the system with real scenarios. We train staff at each campus — HR, finance, campus admins, and management. We deploy, migrate your data, and go live with full support.</span></div></div>

  <div class="highlight">
    <p><strong>Total: 4 months</strong> from kickoff to a fully operational system. A dedicated team of 2–3 engineers working on your project the entire time — not splitting attention across other clients.</p>
  </div>

  <h2>Training & Support</h2>
  <ul>
    <li><strong>On-site training</strong> at Pakyi (Kumasi) and Accra campuses</li>
    <li>Separate sessions for HR, finance, campus admins, and management — each group learns what's relevant to them</li>
    <li>User guides and video walkthroughs included</li>
    <li>Ongoing technical support with guaranteed response times</li>
    <li>We update the system whenever tax rates or regulations change</li>
  </ul>

  <h2>Pricing</h2>
  <table>
    <tr><th>Component</th><th>Structure</th></tr>
    <tr><td>Build & Implementation</td><td>Fixed fee per phase, paid on completion of each milestone</td></tr>
    <tr><td>Software Licence</td><td>One-time fee — ICS owns the system permanently</td></tr>
    <tr><td>Annual Maintenance</td><td>Covers regulatory updates, bug fixes, and minor improvements</td></tr>
    <tr><td>Support</td><td>Tiered options (Standard / Premium) based on response time needs</td></tr>
  </table>
  <div class="highlight">
    <p>Specific pricing will be provided upon shortlisting. We are committed to transparent, competitive pricing with no hidden fees.</p>
  </div>

  <h2>Why Brownshift</h2>
  <ul>
    <li><strong>We're here.</strong> Our main team is in Ghana. We understand SSNIT, GRA, and the Labour Act because we deal with them ourselves.</li>
    <li><strong>It's built for you.</strong> This isn't a generic product. Every screen is designed around how ICS operates across three campuses.</li>
    <li><strong>You own it.</strong> Full source code ownership. No ongoing licence lock-in. Your system, your data, your control.</li>
    <li><strong>We've already shown you.</strong> The working demo attached to this proposal isn't a slideshow — it's the actual system with real calculations. Try it.</li>
  </ul>

  <div class="footer">
    <strong>Brownshift Technologies</strong> — Ghana | United Kingdom | United States | Canada<br/>
    This document is confidential and prepared solely for International Community School Ghana.
  </div>

</div>
            `,
          }}
        />
      </div>
    </PageTransition>
  );
}
