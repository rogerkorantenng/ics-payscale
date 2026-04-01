// ICS PayScale - Mock Data for Demo

export const campuses = [
  { id: "all", name: "All Campuses" },
  { id: "pakyi", name: "Pakyi Campus, Kumasi" },
  { id: "ogbojo", name: "Ogbojo Campus, Accra" },
  { id: "east-legon", name: "East Legon Campus, Accra" },
];

export const departments = [
  "Teaching",
  "Administration",
  "IT",
  "Finance",
  "Facilities",
  "Transport",
  "Catering",
];

export const roleTypes = ["Teaching Staff", "Non-Teaching Staff", "Management"];

// Ghana statutory rates
export const statutoryRates = {
  ssnit: { employer: 0.13, employee: 0.055, label: "SSNIT Tier 1" },
  tier2: { employer: 0.05, employee: 0, label: "Tier 2 Pension" },
  tier3: { voluntary: 0.05, label: "Tier 3 Provident Fund" },
};

// Ghana PAYE tax brackets (2026 monthly)
export const payeBrackets = [
  { min: 0, max: 490, rate: 0 },
  { min: 490, max: 600, rate: 0.05 },
  { min: 600, max: 730, rate: 0.1 },
  { min: 730, max: 3896.67, rate: 0.175 },
  { min: 3896.67, max: 19896.67, rate: 0.25 },
  { min: 19896.67, max: 53563.33, rate: 0.3 },
  { min: 53563.33, max: Infinity, rate: 0.35 },
];

export function calculatePAYE(taxableIncome: number): number {
  let tax = 0;
  let remaining = taxableIncome;
  for (const bracket of payeBrackets) {
    const width = bracket.max - bracket.min;
    const taxable = Math.min(remaining, width);
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    remaining -= taxable;
  }
  return Math.round(tax * 100) / 100;
}

const ghanaianFirstNames = [
  "Kwame", "Ama", "Kofi", "Akua", "Kwesi", "Abena", "Yaw", "Yaa",
  "Kwaku", "Afia", "Nana", "Efua", "Kojo", "Adjoa", "Kwabena", "Akosua",
  "Nii", "Adwoa", "Papa", "Esi", "Fiifi", "Maame", "Ekow", "Araba",
  "Paa", "Baaba", "Kobby", "Gifty", "Bright", "Mercy", "Emmanuel", "Priscilla",
  "Samuel", "Joyce", "Daniel", "Beatrice", "Isaac", "Comfort", "Joseph", "Grace",
  "Michael", "Rita", "Francis", "Lydia", "Patrick", "Doris", "Richard", "Agnes",
  "Stephen", "Vivian",
];

const ghanaianLastNames = [
  "Mensah", "Owusu", "Asante", "Boateng", "Osei", "Agyemang", "Amoah", "Appiah",
  "Badu", "Sarpong", "Frimpong", "Antwi", "Darko", "Nyarko", "Acheampong", "Bonsu",
  "Ofori", "Gyasi", "Asamoah", "Yeboah", "Addo", "Amponsah", "Tetteh", "Quaye",
  "Adjei", "Opoku", "Boakye", "Kusi", "Nkrumah", "Manu", "Adu", "Asare",
  "Afriyie", "Danso", "Twum", "Baffour", "Kyei", "Amankwah", "Prempeh", "Obeng",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  campusId: string;
  department: string;
  roleType: string;
  position: string;
  startDate: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  grossSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  ssnitEmployee: number;
  ssnitEmployer: number;
  tier2: number;
  tier3: number;
  paye: number;
  totalDeductions: number;
  netPay: number;
  leaveBalance: number;
  yearsOfService: number;
  severancePay: number;
  status: "active" | "on-leave" | "terminated";
}

const positions: Record<string, string[]> = {
  Teaching: ["Class Teacher", "Subject Teacher", "Head of Department", "Senior Teacher", "Teaching Assistant"],
  Administration: ["Admin Officer", "Receptionist", "Secretary", "Office Manager", "Records Officer"],
  IT: ["IT Support", "Systems Administrator", "IT Manager", "Network Engineer"],
  Finance: ["Accountant", "Finance Officer", "Bursar", "Accounts Clerk"],
  Facilities: ["Maintenance Supervisor", "Groundskeeper", "Janitor", "Facilities Manager"],
  Transport: ["Driver", "Fleet Supervisor", "Transport Coordinator"],
  Catering: ["Head Cook", "Kitchen Assistant", "Catering Manager", "Server"],
};

const salaryRanges: Record<string, [number, number]> = {
  Teaching: [3500, 12000],
  Administration: [2500, 8000],
  IT: [3000, 10000],
  Finance: [3000, 10000],
  Facilities: [2000, 5000],
  Transport: [2000, 4500],
  Catering: [2000, 4500],
  Management: [8000, 15000],
};

// Seed random for consistency
let seed = 42;
function seededRandom(): number {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function seededFrom<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function seededBetween(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];
  const campusIds = ["pakyi", "ogbojo", "east-legon"];
  const campusDist = [0.4, 0.35, 0.25]; // 40% Pakyi, 35% Ogbojo, 25% East Legon

  for (let i = 0; i < count; i++) {
    const r = seededRandom();
    const campusId = r < campusDist[0] ? campusIds[0] : r < campusDist[0] + campusDist[1] ? campusIds[1] : campusIds[2];

    const isManagement = seededRandom() < 0.08;
    const department = isManagement ? seededFrom(departments) : seededFrom(departments);
    const roleType = isManagement ? "Management" : department === "Teaching" ? "Teaching Staff" : "Non-Teaching Staff";

    const range = isManagement ? salaryRanges.Management : salaryRanges[department];
    const basicSalary = Math.round(seededBetween(range[0], range[1]) / 100) * 100;
    const housingAllowance = Math.round(basicSalary * 0.15 / 100) * 100;
    const transportAllowance = Math.round(basicSalary * 0.1 / 100) * 100;
    // Overtime: ~20% of employees have overtime hours
    const hasOvertime = seededRandom() < 0.2;
    const overtimeHours = hasOvertime ? seededBetween(4, 20) : 0;
    const hourlyRate = basicSalary / 176; // 22 working days * 8 hours
    const overtimeRate = seededRandom() < 0.7 ? 1.5 : 2.0; // weekday 1.5x, weekend 2x
    const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeRate * 100) / 100;

    const grossSalary = basicSalary + housingAllowance + transportAllowance + overtimePay;

    const ssnitEmployee = Math.round(grossSalary * statutoryRates.ssnit.employee * 100) / 100;
    const ssnitEmployer = Math.round(grossSalary * statutoryRates.ssnit.employer * 100) / 100;
    const tier2 = Math.round(grossSalary * statutoryRates.tier2.employer * 100) / 100;
    const tier3 = seededRandom() < 0.3 ? Math.round(grossSalary * statutoryRates.tier3.voluntary * 100) / 100 : 0;
    const taxableIncome = grossSalary - ssnitEmployee;
    const paye = calculatePAYE(taxableIncome);
    const totalDeductions = Math.round((ssnitEmployee + paye + tier3) * 100) / 100;
    const netPay = Math.round((grossSalary - totalDeductions) * 100) / 100;

    // Severance: based on years of service (1 month basic per year)
    const startYear = seededBetween(2005, 2025);
    const yearsOfService = 2026 - startYear;
    const severancePay = Math.round(basicSalary * yearsOfService * 100) / 100;

    const firstName = seededFrom(ghanaianFirstNames);
    const lastName = seededFrom(ghanaianLastNames);
    const pos = isManagement ? seededFrom(["Head of Department", "Vice Principal", "Campus Director", "Head of Section"]) : seededFrom(positions[department]);

    employees.push({
      id: `EMP${String(i + 1).padStart(4, "0")}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@icsghana.info`,
      phone: `+233 ${seededBetween(20, 59)}${seededBetween(1000000, 9999999)}`,
      campusId,
      department,
      roleType,
      position: pos,
      startDate: `${startYear}-${String(seededBetween(1, 12)).padStart(2, "0")}-${String(seededBetween(1, 28)).padStart(2, "0")}`,
      basicSalary,
      housingAllowance,
      transportAllowance,
      grossSalary,
      overtimeHours,
      overtimeRate,
      overtimePay,
      ssnitEmployee,
      ssnitEmployer,
      tier2,
      tier3,
      paye,
      totalDeductions,
      netPay,
      leaveBalance: seededBetween(0, 25),
      yearsOfService,
      severancePay,
      status: seededRandom() < 0.9 ? "active" : seededRandom() < 0.5 ? "on-leave" : "terminated",
    });
  }
  return employees;
}

export const employees = generateEmployees(248);

export const activeEmployees = employees.filter((e) => e.status === "active");

// Payroll summary by campus
export function getPayrollByCampus(campusId?: string) {
  const filtered = campusId && campusId !== "all" ? activeEmployees.filter((e) => e.campusId === campusId) : activeEmployees;
  return {
    totalEmployees: filtered.length,
    totalGross: filtered.reduce((s, e) => s + e.grossSalary, 0),
    totalNet: filtered.reduce((s, e) => s + e.netPay, 0),
    totalDeductions: filtered.reduce((s, e) => s + e.totalDeductions, 0),
    totalSSNIT: filtered.reduce((s, e) => s + e.ssnitEmployee + e.ssnitEmployer, 0),
    totalPAYE: filtered.reduce((s, e) => s + e.paye, 0),
    totalTier2: filtered.reduce((s, e) => s + e.tier2, 0),
    totalTier3: filtered.reduce((s, e) => s + e.tier3, 0),
    byDepartment: departments.map((d) => ({
      department: d,
      count: filtered.filter((e) => e.department === d).length,
      totalGross: filtered.filter((e) => e.department === d).reduce((s, e) => s + e.grossSalary, 0),
    })),
  };
}

// Monthly payroll history (last 6 months)
export const payrollHistory = [
  { month: "Oct 2025", pakyi: 892400, ogbojo: 764200, eastLegon: 542800, status: "completed" as const },
  { month: "Nov 2025", pakyi: 898100, ogbojo: 771500, eastLegon: 548200, status: "completed" as const },
  { month: "Dec 2025", pakyi: 945600, ogbojo: 812300, eastLegon: 576400, status: "completed" as const },
  { month: "Jan 2026", pakyi: 902300, ogbojo: 778900, eastLegon: 551600, status: "completed" as const },
  { month: "Feb 2026", pakyi: 908700, ogbojo: 782400, eastLegon: 554100, status: "completed" as const },
  { month: "Mar 2026", pakyi: 915200, ogbojo: 789600, eastLegon: 558900, status: "completed" as const },
];

export const payrollRuns = [
  { id: "PR-2026-03", period: "March 2026", campus: "All Campuses", status: "completed" as const, processedDate: "2026-03-28", totalGross: 2263700, totalNet: 1798400, employeeCount: 228 },
  { id: "PR-2026-02", period: "February 2026", campus: "All Campuses", status: "completed" as const, processedDate: "2026-02-27", totalGross: 2245200, totalNet: 1783600, employeeCount: 226 },
  { id: "PR-2026-01", period: "January 2026", campus: "All Campuses", status: "completed" as const, processedDate: "2026-01-29", totalGross: 2232800, totalNet: 1771200, employeeCount: 225 },
  { id: "PR-2025-12", period: "December 2025", campus: "All Campuses", status: "completed" as const, processedDate: "2025-12-22", totalGross: 2334300, totalNet: 1852100, employeeCount: 230 },
  { id: "PR-2025-11", period: "November 2025", campus: "All Campuses", status: "completed" as const, processedDate: "2025-11-28", totalGross: 2217800, totalNet: 1760400, employeeCount: 224 },
  { id: "PR-2025-10", period: "October 2025", campus: "All Campuses", status: "completed" as const, processedDate: "2025-10-29", totalGross: 2199400, totalNet: 1746300, employeeCount: 223 },
];

export const complianceItems = [
  { id: 1, type: "SSNIT Tier 1", period: "March 2026", dueDate: "2026-04-14", status: "pending" as const, amount: 421560 },
  { id: 2, type: "PAYE/GRA", period: "March 2026", dueDate: "2026-04-15", status: "pending" as const, amount: 312400 },
  { id: 3, type: "Tier 2 Pension", period: "March 2026", dueDate: "2026-04-14", status: "pending" as const, amount: 113185 },
  { id: 4, type: "SSNIT Tier 1", period: "February 2026", dueDate: "2026-03-14", status: "filed" as const, amount: 418200 },
  { id: 5, type: "PAYE/GRA", period: "February 2026", dueDate: "2026-03-15", status: "filed" as const, amount: 309800 },
  { id: 6, type: "Tier 2 Pension", period: "February 2026", dueDate: "2026-03-14", status: "filed" as const, amount: 112260 },
  { id: 7, type: "SSNIT Tier 1", period: "January 2026", dueDate: "2026-02-14", status: "filed" as const, amount: 415600 },
  { id: 8, type: "PAYE/GRA", period: "January 2026", dueDate: "2026-02-15", status: "filed" as const, amount: 307200 },
];

export const recentActivity = [
  { id: 1, action: "Payroll processed", detail: "March 2026 payroll for All Campuses", user: "Kwame Mensah", time: "2 hours ago" },
  { id: 2, action: "Employee onboarded", detail: "Ama Boateng added to Ogbojo Campus", user: "Akua Asante", time: "5 hours ago" },
  { id: 3, action: "SSNIT filed", detail: "February 2026 SSNIT contribution submitted", user: "Kofi Osei", time: "1 day ago" },
  { id: 4, action: "Leave approved", detail: "Annual leave for Yaw Frimpong (5 days)", user: "Nana Agyemang", time: "1 day ago" },
  { id: 5, action: "Salary adjusted", detail: "Pay grade update for 12 employees - Pakyi Campus", user: "Kwame Mensah", time: "2 days ago" },
  { id: 6, action: "Report generated", detail: "Q1 2026 campus comparison report exported", user: "Esi Darko", time: "3 days ago" },
];

export const headcountTrends = [
  { month: "Apr 2025", pakyi: 95, ogbojo: 78, eastLegon: 52 },
  { month: "May 2025", pakyi: 96, ogbojo: 79, eastLegon: 53 },
  { month: "Jun 2025", pakyi: 94, ogbojo: 78, eastLegon: 52 },
  { month: "Jul 2025", pakyi: 94, ogbojo: 79, eastLegon: 53 },
  { month: "Aug 2025", pakyi: 97, ogbojo: 81, eastLegon: 54 },
  { month: "Sep 2025", pakyi: 99, ogbojo: 82, eastLegon: 55 },
  { month: "Oct 2025", pakyi: 100, ogbojo: 83, eastLegon: 56 },
  { month: "Nov 2025", pakyi: 100, ogbojo: 84, eastLegon: 57 },
  { month: "Dec 2025", pakyi: 98, ogbojo: 83, eastLegon: 56 },
  { month: "Jan 2026", pakyi: 100, ogbojo: 84, eastLegon: 57 },
  { month: "Feb 2026", pakyi: 101, ogbojo: 85, eastLegon: 58 },
  { month: "Mar 2026", pakyi: 102, ogbojo: 86, eastLegon: 60 },
];

export const auditLog = [
  { id: 1, timestamp: "2026-03-31 14:23:00", user: "Kwame Mensah", action: "Processed Payroll", detail: "March 2026 - All Campuses", ip: "192.168.1.45" },
  { id: 2, timestamp: "2026-03-31 10:15:00", user: "Akua Asante", action: "Added Employee", detail: "Ama Boateng - EMP0249", ip: "192.168.1.32" },
  { id: 3, timestamp: "2026-03-30 16:45:00", user: "Kofi Osei", action: "Filed SSNIT", detail: "February 2026 contributions", ip: "192.168.2.18" },
  { id: 4, timestamp: "2026-03-30 11:20:00", user: "Nana Agyemang", action: "Approved Leave", detail: "Yaw Frimpong - 5 days annual", ip: "192.168.1.45" },
  { id: 5, timestamp: "2026-03-29 15:30:00", user: "Kwame Mensah", action: "Updated Salary", detail: "Batch update - 12 employees", ip: "192.168.1.45" },
  { id: 6, timestamp: "2026-03-29 09:10:00", user: "Esi Darko", action: "Generated Report", detail: "Q1 2026 Campus Comparison", ip: "192.168.3.22" },
  { id: 7, timestamp: "2026-03-28 14:00:00", user: "Kwame Mensah", action: "Modified Tax Table", detail: "Updated PAYE brackets", ip: "192.168.1.45" },
  { id: 8, timestamp: "2026-03-28 10:30:00", user: "Akua Asante", action: "Terminated Employee", detail: "EMP0087 - End of contract", ip: "192.168.1.32" },
  { id: 9, timestamp: "2026-03-27 16:15:00", user: "Kofi Osei", action: "Exported Report", detail: "PAYE summary - CSV", ip: "192.168.2.18" },
  { id: 10, timestamp: "2026-03-27 11:00:00", user: "Nana Agyemang", action: "Updated Employee", detail: "EMP0156 - Campus transfer", ip: "192.168.1.45" },
];

export function formatGHS(amount: number): string {
  return `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
