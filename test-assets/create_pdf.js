const fs = require('fs');
const path = require('path');

function createSimplePdf(outputPath, lines) {
  // Construct text content stream
  let streamContent = "BT\n/F1 12 Tf\n50 750 Td\n18 TL\n";
  for (const line of lines) {
    const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamContent += `(${escaped}) '\n`;
  }
  streamContent += "ET";

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  let pdf = "%PDF-1.4\n";
  const offsets = [];

  function addObj(content) {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'));
    pdf += content + "\n";
  }

  // Obj 1: Catalog
  addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  // Obj 2: Pages
  addObj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  // Obj 3: Page
  addObj("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj");
  // Obj 4: Contents
  addObj(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`);
  // Obj 5: Font
  addObj("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");

  const xrefOffset = Buffer.byteLength(pdf, 'utf-8');
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  for (const offset of offsets) {
    pdf += String(offset).padStart(10, '0') + " 00000 n \n";
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  fs.writeFileSync(outputPath, pdf, 'utf-8');
  console.log("Successfully created valid PDF at:", outputPath);
}

const cvLines = [
  "ALEX VANCE - SENIOR SOFTWARE ENGINEER",
  "Email: candidate@hiresmart.ai | Phone: +33 6 12 34 56 78",
  "Location: Paris, France",
  "",
  "PROFESSIONAL SUMMARY:",
  "Passionate Full-Stack Developer with 4+ years of hands-on engineering experience.",
  "Specialized in architecting cloud-native distributed backends and reactive web frontends.",
  "",
  "CORE TECHNICAL COMPETENCIES:",
  "Languages & Frameworks: Java, Spring Boot, Angular, TypeScript",
  "Tools & Methodologies: Git, REST APIs, HTML/CSS, Tailwind CSS",
  "",
  "WORK EXPERIENCE:",
  "Full-Stack Engineer at TechNova Lab (2022 - Present)",
  "- Developed REST APIs with Java and Spring Boot.",
  "- Built single page application dashboards with Angular.",
  "- Utilized Git for distributed version control.",
  "",
  "EDUCATION:",
  "M.Sc. in Computer Science & Information Technology (2022)"
];

const dest = path.join(__dirname, 'synthetic_alex_vance_cv.pdf');
createSimplePdf(dest, cvLines);
