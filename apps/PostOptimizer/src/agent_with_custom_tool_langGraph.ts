/**
 * This TypeScript file sets up a conversational AI workflow using LangChain and LangGraphJS.
 * It integrates with the Tavily API to enhance the AI's ability to answer user queries.
 *
 * Key Components:
 * - **Tavily Tool**: A custom tool that queries the Tavily API for information based on user questions.
 * - **ToolNode**: Manages the integration of the Tavily tool within the state graph.
 * - **Chat Model**: Utilizes the "gpt-4o-mini" model with deterministic response settings.
 * - **State Management**: Uses a state graph to control the flow of conversation and tool invocation.
 *
 * Workflow:
 * 1. Define and configure the Tavily tool with schema validation using Zod.
 * 2. Set up a chat model that can utilize the defined tool.
 * 3. Implement a state graph to manage transitions between nodes based on AI responses.
 * 4. Compile the workflow into a runnable application.
 * 5. Demonstrate usage with example queries about weather in different locations.
 *
 * References:
 * - [LangGraphJS Quickstart](https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/#how-does-it-work)
 * - [LangChain Tool Calling](https://js.langchain.com/docs/concepts/tool_calling/)
 */

import { type AIMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { tavily } from "@tavily/core";
import { z } from "zod";

// Custom tool
const tavilyTool = tool(
	async ({ question }: { question: string }) => {
		const env = process.env.TAVILY_API_KEY;
		const client = tavily({ apiKey: env });

		return client.search(question, {
			maxResults: 3,
		});
	},
	{
		name: "tavilyApi",
		description: "Tivaly API",
		schema: z.object({
			// The parameter `question` is semantically significant for the model's interaction with the tool.
			// For example, if we use `query` instead of `question`, the model will interpret and pass only a brief query to the tool.
			// E.G - With `question`, the model output might be: "What is the current weather in San Francisco?"
			// E.G - With `query`, the model output would be simply: "San Francisco"
			question: z.string(),
		}),
	},
);

// Define the tools for the agent to use
const toolNode = new ToolNode([tavilyTool]);

// Create a model and give it access to the tools
const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
}).bindTools([tavilyTool]);

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
	const lastMessage = messages[messages.length - 1] as AIMessage;

	// If the LLM makes a tool call, then we route to the "tools" node
	if (lastMessage.tool_calls?.length) {
		return "tools";
	}
	// Otherwise, we stop (reply to the user) using the special "__end__" node
	return "__end__";
}

// Define the function that calls the model
async function callModel(state: typeof MessagesAnnotation.State) {
	const response = await model.invoke(state.messages);

	// We return a list, because this will get added to the existing list
	return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
	.addNode("agent", callModel)
	.addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
	.addNode("tools", toolNode)
	.addEdge("tools", "agent")
	.addConditionalEdges("agent", shouldContinue);

// Finally, we compile it into a LangChain Runnable.
const app = workflow.compile();

// Use the agent
const finalState = await app.invoke({
	messages: [new HumanMessage("what is the weather in sf")],
});
console.log(finalState.messages[finalState.messages.length - 1].content);

const nextState = await app.invoke({
	// Including the messages from the previous run gives the LLM context.
	// This way it knows we're asking about the weather in NY
	messages: [...finalState.messages, new HumanMessage("what about ny")],
});
console.log(nextState.messages[nextState.messages.length - 1].content);
