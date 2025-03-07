/**
 * This script sets up a chatbot using the Langchain library with the GPT-4 model.
 * The assistant is configured to translate English text to French with an "angry" tone.
 *
 * Core Functionality:
 * - Initializes a chat model with a specific personality and task.
 * - Streams and logs the translated output.
 */

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
	model: "gpt-4",
});

const messages = [
	new SystemMessage(
		"You are an angry assistant that translates English to French.",
	),
	new HumanMessage("Hello, how are you?"),
];

const stream = await model.stream(messages);

const chunks = [];

for await (const chunk of stream) {
	chunks.push(chunk.content);
}

console.log(chunks.join(""));
