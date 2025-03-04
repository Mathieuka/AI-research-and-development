import {
	type PipelineType,
	type ProgressCallback,
	type TextClassificationPipeline,
	type TextGenerationPipeline,
	type TextGenerationSingle,
	env,
	pipeline,
} from "@huggingface/transformers";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { type AIMessage, HumanMessage } from "@langchain/core/messages";
import {
	MemorySaver,
	MessagesAnnotation,
	StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { ChatOpenAI } from "@langchain/openai";

// Define the tools for the agent to use
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

env.cacheDir = "./cache";

class HuggingFaceTransformersCustom {
	private task: PipelineType = "text-generation";
	private model = "HuggingFaceTB/SmolLM2-360M-Instruct";
	private instance: Promise<TextClassificationPipeline> | undefined = undefined;

	getInstance() {
		if (this.instance === undefined) {
			this.instance = pipeline(this.task, this.model, {
				dtype: "fp32",
				progress_callback: () => {
					// console.log("progress : ", progress);
				},
			}) as Promise<TextClassificationPipeline>;
		}

		return this.instance;
	}
}

const instance = await new HuggingFaceTransformersCustom().getInstance();

const response = await instance("Try it!");
console.log("response", response);

// Create model and give it access to the tools
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
const memorySaver = new MemorySaver();
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
const app = workflow.compile({
	checkpointer: memorySaver,
});

// Use the agent
const finalState = await app.invoke(
	{
		messages: [new HumanMessage("what is the weather in sf")],
	},
	{
		configurable: {
			thread_id: 42,
		},
	},
);
console.log(finalState.messages[finalState.messages.length - 1].content);

const nextState = await app.invoke(
	{
		// Including the messages from the previous run gives the LLM context.
		// This way it knows we're asking about the weather in NY
		messages: [...finalState.messages, new HumanMessage("what about ny")],
	},
	{
		configurable: {
			thread_id: 42,
		},
	},
);
console.log(nextState.messages[nextState.messages.length - 1].content);
