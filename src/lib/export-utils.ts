// Utility functions for exporting data as downloadable files

export function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPDF(filename: string, title: string, content: string) {
  // Generate a simple HTML-based printable document
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0B2545; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0B2545; }
    .logo span { color: #D4A843; }
    .subtitle { font-size: 12px; color: #666; }
    .date { font-size: 12px; color: #666; text-align: right; }
    h1 { font-size: 20px; color: #0B2545; margin-bottom: 5px; }
    h2 { font-size: 16px; color: #0B2545; margin-top: 25px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; }
    th { background: #0B2545; color: white; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
    td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #f8f9fb; }
    .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #999; text-align: center; }
    .summary-box { background: #f0f4f8; border: 1px solid #d1d9e0; border-radius: 8px; padding: 15px; margin: 15px 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
    .summary-row strong { color: #0B2545; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-orange { background: #fff7ed; color: #9a3412; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">ICS <span>Pay</span>Scale</div>
      <div class="subtitle">International Community School Ghana</div>
    </div>
    <div class="date">
      Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}<br/>
      By: Kwame Mensah, HR Director
    </div>
  </div>
  ${content}
  <div class="footer">
    ICS PayScale — Powered by Brownshift Technologies | Confidential Document
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => {
      win.print();
    };
  }
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function formatCurrency(amount: number): string {
  return `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
