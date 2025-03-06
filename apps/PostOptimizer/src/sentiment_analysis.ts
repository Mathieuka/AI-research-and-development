/**
 * This file implements a workflow for sentiment analysis using the Hugging Face Transformers and
 * Langchain libraries. The workflow is built around a state graph that processes messages to determine
 * their sentiment.
 *
 * Dependencies:
 * - @huggingface/transformers: Used to load a pre-trained text classification pipeline.
 * - @langchain/core/messages: Provides message structures for handling conversations.
 * - @langchain/langgraph: Used to create and manipulate state graphs.
 *
 * Key Features:
 * - Loads a pre-trained text classification pipeline for sentiment analysis.
 * - Defines a function `analyzeSentiment` that uses the pipeline to analyze the sentiment of the
 *   latest message in a given state.
 * - Constructs a state graph (`StateGraph`) with a node for sentiment analysis and transitions
 *   between start and end states.
 * - Compiles the workflow and invokes it with a sample message to demonstrate sentiment analysis.
 */

import { pipeline } from "@huggingface/transformers";
import { HumanMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";

const textClassificationPipeline = await pipeline(
	"sentiment-analysis",
	"Xenova/distilbert-base-uncased-finetuned-sst-2-english",
	{
		dtype: "fp32",
	},
);

async function analyzeSentiment(state: typeof MessagesAnnotation.State) {
	const text = state.messages[state.messages.length - 1].content;
	const result = await textClassificationPipeline(text as string);

	return { messages: [{ role: "assistant", content: result }] };
}

const workflow = new StateGraph(MessagesAnnotation)
	.addNode("sentiment", analyzeSentiment)
	.addEdge("__start__", "sentiment")
	.addEdge("sentiment", "__end__");

const app = workflow.compile();

const result = await app.invoke({
	messages: [new HumanMessage("Je déteste ce nouveau produit !")],
});

console.log(result.messages[result.messages.length - 1].content);
