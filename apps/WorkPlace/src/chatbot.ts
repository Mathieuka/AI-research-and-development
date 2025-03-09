/**
 * This module creates a conversational workflow using `@langchain/langgraph` and `@langchain/openai` to interact with a language model:
 *
 * 1. **Message Trimming**: Utilizes `trimMessages` to manage message length with a strategy focusing on the last messages.
 * 2. **Language Model Configuration**: Sets up a `ChatOpenAI` model for interaction, configured with specific parameters.
 * 3. **State Graph**:
 *    - Defines a node (`callModel`) to invoke the model with trimmed messages.
 *    - Constructs a state graph to manage the flow of conversation from start to end.
 *
 * 4. **Memory Management**: Incorporates `MemorySaver` to preserve conversation state.
 *
 * 5. **Prompt Templates**: Utilizes `ChatPromptTemplate` to structure conversational prompts, adapting to different user inputs.
 *
 * Usage:
 * - Initiate the conversation with a prompt, such as asking the model for the user's name.
 * - Continue the interaction with follow-up questions, e.g., readiness to assist the user.
 * - The model's responses are logged to the console.
 */

import { trimMessages } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
	END,
	MemorySaver,
	MessagesAnnotation,
	START,
	StateGraph,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";

const config = { configurable: { thread_id: uuidv4() } };

const trimmer = trimMessages({
	maxTokens: 10,
	strategy: "last",
	tokenCounter: (msgs) => msgs.length,
	includeSystem: true,
	allowPartial: false,
	startOn: "human",
});

const llm = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
});

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
	const response = await llm.invoke(await trimmer.invoke(state.messages));

	return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
	// Define the node and edge
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const promptTemplate = ChatPromptTemplate.fromMessages([
	["system", "I'm student, my name is Toto and you are my assistant"],
	["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
	text: "What is my name ?",
});

const output = await app.invoke(promptValue, config);

console.log(output.messages[output.messages.length - 1].content);

const promptTemplate2 = ChatPromptTemplate.fromMessages(["user", "{text}"]);

const promptValue2 = await promptTemplate2.invoke({
	text: "Are you ready to help me to become a better student ?",
});

const output2 = await app.invoke(promptValue2, config);

console.log(output2.messages[output2.messages.length - 1].content);
