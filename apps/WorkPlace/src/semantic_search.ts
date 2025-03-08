import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const loader = new PDFLoader(path.resolve(__dirname, "../private/foo.pdf"));

const docs = await loader.load();

console.log(docs.length);
