import { spawn } from "node:child_process";
import { Command } from "commander";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const workPlaceDirectory = path.resolve(path.dirname(__filename), "..");

const program = new Command();

const validScripts = [
	"agent_langGraph",
	"agent_with_custom_tool_langGraph",
	"sentiment_analysis",
	"llm_with_chat_model",
	"semantic_search",
	"chatbot",
	"retrieval_augmented_generation",
];

program.argument("<script>", "The script to run").action((script: string) => {
	const command = `node --env-file=.env --import=tsx --watch ${workPlaceDirectory}/src/${script}.ts`;
	spawn(command, { stdio: "inherit", shell: true });
});

if (!validScripts.includes(process.argv.slice(2)[0])) {
	console.error("Error: Invalid script name provided.\n");
	console.log("Please provide one of the following valid script names:");
	for (const script of validScripts) {
		console.log(`- ${script}`);
	}

	console.log("\nE.G - npm run start <script-name>");
	process.exit(1);
}

program.parse(process.argv);
