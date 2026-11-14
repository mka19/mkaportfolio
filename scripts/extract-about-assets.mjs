import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(root, "modules", "about", "index.html");
const outputDirectory = join(root, "modules", "about", "assets", "embedded");
const extensions = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/svg+xml", "svg"],
]);

mkdirSync(outputDirectory, { recursive: true });
const source = readFileSync(sourcePath, "utf8");
let extracted = 0;

const rewritten = source.replace(
  /data:([\w/+.-]+);base64,([A-Za-z0-9+/=]+)/g,
  (uri, mimeType, encoded) => {
    const extension = extensions.get(mimeType);
    if (!extension) return uri;
    const bytes = Buffer.from(encoded, "base64");
    const digest = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const filename = `${digest}.${extension}`;
    writeFileSync(join(outputDirectory, filename), bytes);
    extracted += 1;
    return `assets/embedded/${filename}`;
  },
);

writeFileSync(sourcePath, rewritten, "utf8");
console.log(`Extracted ${extracted} exact embedded assets.`);
