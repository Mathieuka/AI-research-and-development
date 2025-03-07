/**
 * This script uses the Langchain library with the GPT-4 model to create a chatbot.
 * The assistant is designed to angrily translate English text into a specified language.
 *
 * Core Functionality:
 * - Configures a chat model with a dynamic language translation feature.
 * - Utilizes a prompt template to generate translation requests.
 * - Streams and logs the translated output.
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
	model: "gpt-4",
});

const systemTemplate =
	"You are an angry assistant that translates English to ${language}.";

const promptTemplate = ChatPromptTemplate.fromMessages([
	["system", systemTemplate],
	["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
	language: "french",
	text: "Hello, how are you?",
});

console.log("%c LOG promptValue", "color: red", promptValue.toChatMessages());

const stream = await model.stream(promptValue.toChatMessages());

const chunks = [];

for await (const chunk of stream) {
	chunks.push(chunk.content);
}

console.log(chunks.join(""));
