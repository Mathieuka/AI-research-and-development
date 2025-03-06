// import {
// 	type PipelineType,
// 	type TextGenerationPipeline,
// 	env,
// 	pipeline,
// } from "@huggingface/transformers";
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { BaseChatModel } from "@langchain/core/language_models/chat_models";
// import {
// 	AIMessage,
// 	type BaseMessage,
// 	HumanMessage,
// } from "@langchain/core/messages";
// import type { ChatResult } from "@langchain/core/outputs";
// import type { Tool } from "@langchain/core/tools";
// import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
//
// // Define the tools for the agent to use
// const tools = [new TavilySearchResults({ maxResults: 3 })];
// const toolNode = new ToolNode(tools);
//
// env.cacheDir = "./cache";
//
// class HuggingFaceChatModel extends BaseChatModel {
// 	private task: PipelineType = "text-generation";
// 	private model = "HuggingFaceTB/SmolLM2-360M-Instruct";
// 	private instance: Promise<TextGenerationPipeline> | undefined = undefined;
// 	private tools: Tool[] = [];
//
// 	getInstance() {
// 		if (this.instance === undefined) {
// 			this.instance = pipeline(this.task, this.model, {
// 				dtype: "fp32",
// 				progress_callback: () => {
// 					// console.log("progress : ", progress);
// 				},
// 			}) as Promise<TextGenerationPipeline>;
// 		}
//
// 		return this.instance;
// 	}
//
// 	async _generate(messages: BaseMessage[]): Promise<ChatResult> {
// 		const toolDescriptions = this.tools
// 			.map((tool) => `- ${tool.name}: ${tool.description}`)
// 			.join("\n");
//
// 		const prompt = `\nHuman: ${messages[messages.length - 1].content} \n to respond you have only one time access to the following tools and you should use it:\n${toolDescriptions}\n\nrespond with: [TOOL_CALL]tool_name:tool_input[/TOOL_CALL]\n`;
//
// 		const instance = await this.getInstance();
// 		const response = await instance(prompt, {
// 			max_new_tokens: 500,
// 			do_sample: true,
// 			temperature: 0.7,
// 		});
//
// 		const generatedText = response[0].generated_text
//
// 		const toolCalls = this._extractToolCalls(generatedText);
//
// 		return {
// 			generations: [
// 				{
// 					text: generatedText,
// 					message: new AIMessage(generatedText, { tool_calls: toolCalls }),
// 				},
// 			],
// 		};
// 	}
//
// 	private _extractToolCalls(text: string): any[] {
// 		const toolCallRegex = /\[TOOL_CALL\](.*?):(.*?)\[\/TOOL_CALL\]/g;
// 		const toolCalls = [];
// 		let match;
//
// 		while ((match = toolCallRegex.exec(text)) !== null) {
// 			toolCalls.push({
// 				type: "function",
// 				function: {
// 					name: match[1].trim(),
// 					arguments: match[2].trim(),
// 				},
// 			});
// 		}
//
// 		return toolCalls;
// 	}
//
// 	bindTools(tools: Tool[]) {
// 		this.tools = tools;
//
// 		return this;
// 	}
//
// 	async invoke(messages: BaseMessage[]): Promise<AIMessage> {
// 		const result = await this._generate(messages);
// 		return result.generations[0].message;
// 	}
//
// 	_llmType() {
// 		return "custom_huggingface";
// 	}
// }
//
// const modelHuggingface = new HuggingFaceChatModel({}).bindTools(tools);
//
// // Define the function that determines whether to continue or not
// function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
// 	const lastMessage = messages[messages.length - 1] as AIMessage;
//
// 	// If the LLM makes a tool call, then we route to the "tools" node
// 	if (lastMessage.tool_calls?.length) {
// 		return "tools";
// 	}
//
// 	// Otherwise, we stop (reply to the user) using the special "__end__" node
// 	return "__end__";
// }
//
// // Define the function that calls the model
// async function callModel(state: typeof MessagesAnnotation.State) {
// 	const response = await modelHuggingface.invoke(state.messages);
//
// 	// We return a list, because this will get added to the existing list
// 	return { messages: [response] };
// }
//
// // Define a new graph
// const workflow = new StateGraph(MessagesAnnotation)
// 	.addNode("agent", callModel)
// 	.addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
// 	.addNode("tools", toolNode)
// 	.addEdge("tools", "agent")
// 	.addConditionalEdges("agent", shouldContinue);
//
// // Finally, we compile it into a LangChain Runnable.
// const app = workflow.compile();
//
// // Use the agent
// const finalState = await app.invoke({
// 	messages: [new HumanMessage("what is the weather in sf")],
// });
//
// console.log(finalState.messages[finalState.messages.length - 1].content);
//
// const nextState = await app.invoke({
// 	// Including the messages from the previous run gives the LLM context.
// 	// This way it knows we're asking about the weather in NY
// 	messages: [
// 		...finalState.messages,
// 		new HumanMessage("donne moi la date du jour l'heure a paris"),
// 	],
// });
//
// console.log(nextState.messages[nextState.messages.length - 1].content);
