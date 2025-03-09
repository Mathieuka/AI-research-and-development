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
	// Replace this with real logic
	return {
		query: `${state.question} rephrased as a query!`,
	};
};

// Node to retrieve documents
const retrieveDocuments = async (state: typeof QueryOutputAnnotation.State) => {
	// Replace this with real logic
	return {
		docs: [state.query, "some random document"],
	};
};

// Node to generate answer
const generate = async (state: typeof GenerateOutputAnnotation.State) => {
	return {
		answer: state.docs.concat([state.question]).join("\n\n"),
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

await graph.invoke({
	question: "How are you?",
});
