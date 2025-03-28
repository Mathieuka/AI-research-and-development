/**
 * This module sets up a state graph using `@langchain/langgraph` and `@langchain/openai` for processing questions:
 *
 * 1. **Response Formatting**: Utilizes `zod` to define a schema (`ResponseFormatter`) for structuring model outputs.
 * 2. **Model Configuration**: Configures a `ChatOpenAI` model with structured output using the `ResponseFormatter`.
 * 3. **State Graph Nodes**:
 *    - `generateQuery`: Rephrases the question into a query using the model.
 *    - `retrieveDocuments`: Retrieves documents based on the generated query.
 *    - `generate`: Generates an answer from the retrieved documents.
 *
 * The graph connects these nodes and orchestrates the flow from query generation to document retrieval and answer generation.
 *
 * Usage:
 * - Invoke the graph with a question, such as "get all reports of type closed".
 * - The resulting answer is logged to the console.
 */

// import { tool } from "@langchain/core/tools";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Create a tool using the ResponseFormatter schema, where the description of the output guides the model in determining how to utilize the output.
const ResponseFormatter = z.object({
	answer: z.string().describe("The answer to the user's question"),
	question: z.string().describe("A followup question the user could ask"),
});

// Develop a tool using the ResponseFormatter schema, allowing the model to decide whether or not to utilize the tool.
// const responseFormatterTool = tool(async () => {}, {
// 	name: "responseFormatter",
// 	schema: ResponseFormatter,
// });

const modelTemp = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
});

const model = modelTemp.withStructuredOutput(ResponseFormatter);

// The overall state of the graph
const OverallStateAnnotation = Annotation.Root({
	question: Annotation<string>,
	answer: Annotation<string>,
});

// This is what the node that generates the query will return
const QueryOutputAnnotation = Annotation.Root({
	query: Annotation<string>,
});

// This is what the node that retrieves the documents will return
const DocumentOutputAnnotation = Annotation.Root({
	docs: Annotation<string[]>,
});

// This is what the node that retrieves the documents will return
const GenerateOutputAnnotation = Annotation.Root({
	...OverallStateAnnotation.spec,
	...DocumentOutputAnnotation.spec,
});

// Node to generate query
const generateQuery = async (state: typeof OverallStateAnnotation.State) => {
	const response = await model.invoke(
		`${state.question}, rephrased as a query!`,
	);

	return {
		query: response.answer,
	};
};

// Node to retrieve documents
const retrieveDocuments = async (state: typeof QueryOutputAnnotation.State) => {
	// implement retrieval logic
	// const response = retrievalLogic(
	return {
		docs: { query: state.query, result: "some random document" },
	};
};

// Node to generate answer
const generate = async (state: typeof GenerateOutputAnnotation.State) => {
	return {
		answer: state.docs,
	};
};

export const stateGraph = new StateGraph(OverallStateAnnotation)
	.addNode("generate_query", generateQuery)
	.addNode("retrieve_documents", retrieveDocuments, {
		input: QueryOutputAnnotation,
	})
	.addNode("generate", generate, { input: GenerateOutputAnnotation })
	.addEdge("__start__", "generate_query")
	.addEdge("generate_query", "retrieve_documents")
	.addEdge("retrieve_documents", "generate");

export const graph_with_model = stateGraph.compile();

const result = await graph_with_model.invoke({
	question: "get all reports of type closed",
});

console.log("");
console.log("Result => ", result);
