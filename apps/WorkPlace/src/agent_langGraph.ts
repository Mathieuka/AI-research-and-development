/**
 * This file implements a conversational agent workflow using the Langchain and OpenAI libraries.
 * The agent is designed to handle user queries and determine appropriate actions, such as using
 * tools to fetch external information.
 *
 * Dependencies:
 * - @langchain/community/tools/tavily_search: Provides search result tools for querying external data.
 * - @langchain/core/messages: Supplies message structures for managing conversation flows.
 * - @langchain/langgraph: Used to create and manipulate state graphs.
 * - @langchain/langgraph/prebuilt: Provides prebuilt nodes for tool integration.
 * - @langchain/openai: Facilitates interaction with OpenAI's language models.
 *
 * Key Features:
 * - Defines tools for the agent, such as `TavilySearchResults`, to fetch up to 3 search results.
 * - Configures a language model (`ChatOpenAI`) with access to these tools.
 * - Implements a decision function `shouldContinue` to determine the next step based on the agent's
 *   last message, directing to tool usage or ending the conversation.
 * - Defines a `callModel` function to invoke the language model with the current state messages.
 * - Constructs a state graph (`StateGraph`) to manage the workflow, with nodes for the agent and tools,
 *   and conditional edges based on the agent's responses.
 * - Compiles the workflow into a runnable application using Langchain.
 * - Demonstrates the agent's usage by invoking it with sample messages and printing the responses.
 */

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { type AIMessage, HumanMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// Define the tools for the agent to use
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
}).bindTools(tools);

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
