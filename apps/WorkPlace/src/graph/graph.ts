/**
 * This module defines a state graph using `@langchain/langgraph` to process a question by:
 *
 * 1. **Generating a Query**: Rephrases the input question.
 * 2. **Retrieving Documents**: Fetches documents based on the query.
 * 3. **Generating an Answer**: Produces an answer from the retrieved documents.
 *
 * The graph consists of nodes (`generateQuery`, `retrieveDocuments`, `generate`) and edges that define the processing flow.
 *
 * Usage:
 * - Invoke the graph with a question, e.g., "get all reports of type closed".
 * - The result is logged to the console.
 */

import { Annotation, StateGraph } from "@langchain/langgraph";

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
	return {
		query: `${state.question} rephrased as a query!`,
	};
};

// Node to retrieve documents
const retrieveDocuments = async (state: typeof QueryOutputAnnotation.State) => {
	// implement retrieval logic here
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

export const graph = stateGraph.compile();

const result = await graph.invoke({
	question: "get all reports of type closed",
});

console.log("");
console.log("Result => ", result);
