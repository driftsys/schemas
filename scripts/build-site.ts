#!/usr/bin/env -S deno run --allow-read --allow-write
// scripts/build-site.ts — Build schemas contract site
// Renders README.md contract pages to HTML + copies as raw markdown for agents.
// Copies all v*.json schema files preserving directory structure.
// Style matches driftsys/refhub (Pico CSS classless + IBM Plex).

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layoutHtml(
  title: string,
  content: string,
  depth: number,
  breadcrumbs?: { label: string; href?: string }[],
): string {
  const root = depth === 0 ? "." : Array(depth).fill("..").join("/");
  const crumbs = breadcrumbs
    ? `<nav aria-label="breadcrumb"><ul>${breadcrumbs
        .map((b, i) =>
          i === breadcrumbs.length - 1
            ? `<li>${esc(b.label)}</li>`
            : `<li><a href="${b.href}">${esc(b.label)}</a></li>`,
        )
        .join("")}</ul></nav>`
    : "";

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${root}/assets/vendor/pico.classless.min.css">
  <link rel="stylesheet" href="${root}/assets/style.css">
  <link rel="alternate" type="text/markdown" href="index.md">
</head>
<body>
  <header>
    <nav>
      <ul><li><a href="${root}/"><strong>DriftSys Schemas</strong></a></li></ul>
      <ul><li><a href="https://github.com/driftsys/schemas" aria-label="GitHub"><svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a></li></ul>
    </nav>
  </header>
  <main>
    ${crumbs}
    ${content}
  </main>
  <footer>
    <small>
      <a href="https://driftsys.github.io">DriftSys</a> &middot;
      <a href="https://github.com/driftsys/schemas">Source</a> &middot;
      MIT License
    </small>
  </footer>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// CSS — same tokens as refhub
// ---------------------------------------------------------------------------

function styleCss(): string {
  return `/* DriftSys Schemas — Pico CSS token overrides */

:root {
  --pico-font-family: "IBM Plex Sans", "Segoe UI", "Helvetica Neue",
    "DejaVu Sans", sans-serif;
  --pico-font-family-monospace: "IBM Plex Mono", "Cascadia Mono", "SF Mono",
    "DejaVu Sans Mono", monospace;
  --pico-font-size: 100%;
  --pico-line-height: 1.6;
  --pico-font-weight: 400;
  --pico-color: #1a1a1a;
  --pico-h1-color: #1a1a1a;
  --pico-h2-color: #1a1a1a;
  --pico-h3-color: #1a1a1a;
  --pico-muted-color: #6b6b6b;
  --pico-primary: #0072b2;
  --pico-primary-hover: #005580;
  --pico-primary-focus: rgba(0, 114, 178, 0.15);
  --pico-secondary: #6b6b6b;
  --pico-code-background-color: #f5f5f5;
  --pico-muted-border-color: #d4d4d4;
  --pico-background-color: #ffffff;
  --pico-card-background-color: #ffffff;
  --pico-card-border-color: #d4d4d4;
  --pico-block-spacing-vertical: 1rem;
  --pico-block-spacing-horizontal: 1.25rem;
}

h1 { font-weight: 600; }
h2 { font-weight: 600; }
h3 { font-weight: 600; }

header nav svg {
  vertical-align: -0.15em;
  opacity: 0.6;
  transition: opacity 0.15s;
}
header nav a:hover svg { opacity: 1; }

nav[aria-label="breadcrumb"] ul {
  list-style: none;
  display: flex;
  gap: 0.25rem;
  padding: 0;
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
  color: var(--pico-muted-color);
}
nav[aria-label="breadcrumb"] li + li::before {
  content: "›";
  margin-right: 0.25rem;
}

table { font-size: 0.875rem; }
table code { font-size: 0.8rem; }
`;
}

// ---------------------------------------------------------------------------
// Markdown → HTML (minimal, no AST — handles headings, paragraphs, tables,
// code blocks, lists, inline code, bold, links, horizontal rules)
// ---------------------------------------------------------------------------

function renderMarkdown(md: string): string {
  // Remove badge lines ([![...](badge-url)](link-url))
  md = md.replace(/^\s*\[!\[.*?\]\(https?:\/\/img\.shields\.io\/.*?\)\]\(.*?\)\s*$/gm, "");
  // Also remove simple badges without outer link
  md = md.replace(/^\s*!\[.*?\]\(https?:\/\/img\.shields\.io\/.*?\)\s*$/gm, "");

  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      out.push(
        `<pre><code${lang ? ` class="language-${esc(lang)}"` : ""}>${esc(codeLines.join("\n"))}</code></pre>`,
      );
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = inlineFormat(headingMatch[2]);
      out.push(`<h${level}>${text}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push("<hr>");
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1])) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // Unordered list
    if (/^\s*-\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*-\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*-\s+/, ""));
        i++;
      }
      out.push(
        `<ul>${listItems.map((li) => `<li>${inlineFormat(li)}</li>`).join("\n")}</ul>`,
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      out.push(
        `<ol>${listItems.map((li) => `<li>${inlineFormat(li)}</li>`).join("\n")}</ol>`,
      );
      continue;
    }

    // HTML comment (pass through)
    if (line.trim().startsWith("<!--")) {
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — collect lines until blank
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !/^\s*-\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i]) && !(lines[i].includes("|") && i + 1 < lines.length && /^[\s|:-]+$/.test(lines[i + 1]))) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const text = paraLines.join(" ").replace(/\\$/gm, "<br>");
      out.push(`<p>${inlineFormat(text)}</p>`);
    }
  }

  return out.join("\n");
}

function inlineFormat(s: string): string {
  // Links: [text](url) — rewrite README.md hrefs to directory paths for HTML nav
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
    href = rewriteHref(href, text);
    return `<a href="${href}">${text}</a>`;
  });
  // Bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Inline code: `text`
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

/** Rewrite README.md links for Pages: human links get directory paths,
 *  agent links (display text contains README.md) keep README.md. */
function rewriteHref(href: string, linkText: string): string {
  if (linkText.includes("README.md")) return href;
  if (href === "README.md") return "./";
  if (href.endsWith("/README.md")) return href.slice(0, -"README.md".length);
  return href;
}

function renderTable(lines: string[]): string {
  const parseRow = (line: string): string[] =>
    line.split("|").map((c) => c.trim()).filter(Boolean);

  const headers = parseRow(lines[0]);
  // Skip separator line (lines[1])
  const rows = lines.slice(2).map(parseRow);

  const thead = `<thead><tr>${headers.map((h) => `<th>${inlineFormat(h)}</th>`).join("")}</tr></thead>`;
  const tbody = rows.length > 0
    ? `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inlineFormat(c)}</td>`).join("")}</tr>`).join("\n")}</tbody>`
    : "";

  return `<table role="grid">${thead}${tbody}</table>`;
}

// ---------------------------------------------------------------------------
// File system helpers
// ---------------------------------------------------------------------------

async function ensureDir(path: string): Promise<void> {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) throw e;
  }
}

async function writeFile(path: string, content: string): Promise<void> {
  const dir = path.replace(/\/[^/]+$/, "");
  await ensureDir(dir);
  await Deno.writeTextFile(path, content);
}

async function copyFile(src: string, dest: string): Promise<void> {
  const dir = dest.replace(/\/[^/]+$/, "");
  await ensureDir(dir);
  await Deno.copyFile(src, dest);
}

// ---------------------------------------------------------------------------
// Contract page rendering
// ---------------------------------------------------------------------------

interface ContractPage {
  srcReadme: string;  // e.g. "README.md", "project/README.md"
  outDir: string;     // e.g. "", "project", "markspec"
  title: string;
  depth: number;
  breadcrumbs?: { label: string; href?: string }[];
}

const CONTRACT_PAGES: ContractPage[] = [
  {
    srcReadme: "README.md",
    outDir: "",
    title: "DriftSys Schema Contracts",
    depth: 0,
  },
  {
    srcReadme: "project/README.md",
    outDir: "project",
    title: "Project Schema Contract",
    depth: 1,
    breadcrumbs: [
      { label: "Schemas", href: "../" },
      { label: "Project" },
    ],
  },
  {
    srcReadme: "markspec/README.md",
    outDir: "markspec",
    title: "MarkSpec Schema Contract",
    depth: 1,
    breadcrumbs: [
      { label: "Schemas", href: "../" },
      { label: "MarkSpec" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const root = new URL("../", import.meta.url).pathname.replace(/\/$/, "");
  const outDir = `${root}/_site`;

  // Clean output
  try {
    await Deno.remove(outDir, { recursive: true });
  } catch { /* ok if missing */ }

  let filesWritten = 0;

  // --- Contract pages (HTML + index.md) ---
  for (const page of CONTRACT_PAGES) {
    const src = `${root}/${page.srcReadme}`;
    const md = await Deno.readTextFile(src);
    const html = renderMarkdown(md);
    const outPath = page.outDir ? `${outDir}/${page.outDir}` : outDir;

    // Agent markdown: rewrite README.md links to index.md, strip badges
    const agentMd = md
      .replace(/\(([^)]*?)README\.md\)/g, "($1index.md)")
      .replace(/^\s*\[!\[.*?\]\(https?:\/\/img\.shields\.io\/.*?\)\]\(.*?\)\s*$/gm, "")
      .replace(/^\s*!\[.*?\]\(https?:\/\/img\.shields\.io\/.*?\)\s*$/gm, "");

    await writeFile(`${outPath}/index.html`, layoutHtml(page.title, html, page.depth, page.breadcrumbs));
    await writeFile(`${outPath}/index.md`, agentMd);
    filesWritten += 2;
  }

  // --- Schema JSON files ---
  const findSchemas = async (dir: string): Promise<string[]> => {
    const files: string[] = [];
    for await (const entry of Deno.readDir(dir)) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory && entry.name !== "_site" && entry.name !== "public" && entry.name !== ".git" && entry.name !== "node_modules" && entry.name !== "docs" && entry.name !== "scripts" && entry.name !== ".github" && entry.name !== ".vscode" && entry.name !== "assets") {
        files.push(...await findSchemas(path));
      } else if (entry.isFile && /^v\d+\.json$/.test(entry.name)) {
        files.push(path);
      }
    }
    return files;
  };

  const schemaFiles = await findSchemas(root);
  for (const f of schemaFiles) {
    const rel = f.slice(root.length + 1);
    await copyFile(f, `${outDir}/${rel}`);
    filesWritten++;
  }

  // --- Assets ---
  const vendorSrc = `${root}/assets/vendor/pico.classless.min.css`;
  try {
    await copyFile(vendorSrc, `${outDir}/assets/vendor/pico.classless.min.css`);
  } catch {
    console.warn("Warning: pico.classless.min.css not found in assets/vendor/");
  }
  await writeFile(`${outDir}/assets/style.css`, styleCss());
  filesWritten += 2;

  // Summary
  console.log(`\nSchemas site build complete`);
  console.log(`  Contract pages: ${CONTRACT_PAGES.length}`);
  console.log(`  Schema files: ${schemaFiles.length}`);
  console.log(`  Files written: ${filesWritten}`);
  console.log(`  Output: ${outDir}/`);
}

main();
