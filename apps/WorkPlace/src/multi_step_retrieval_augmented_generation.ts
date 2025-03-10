/**
 * PDF Question-Answering System
 *
 * This script implements a question-answering system based on PDF documents using LangChain and OpenAI technologies.
 * It demonstrates how to load a PDF, split it into chunks, index these chunks in a vector store,
 * and then use this information to answer user queries.
 *
 * Key Features:
 * - PDF loading and parsing
 * - Text chunking and indexing
 * - Vector similarity search
 * - LLM-based question answering
 * - State management using LangChain's StateGraph
 *
 * Process Flow:
 * 1. Load PDF document
 * 2. Split document into chunks
 * 3. Generate embeddings and index chunks in vector store
 * 4. Define state graph for question-answering process
 * 5. Execute graph with user query
 * 6. Return generated answer
 *
 * Note: This script is designed for educational and demonstration purposes.
 * Ensure compliance with OpenAI's use-case policies and licensing terms of all libraries used.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import type { Document } from "@langchain/core/documents";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pull } from "langchain/hub";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const llm = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
});

const embeddings = new OpenAIEmbeddings({
	model: "text-embedding-3-large",
});

const vectorStore = new MemoryVectorStore(embeddings);

const loader = new PDFLoader(path.resolve(__dirname, "../private/foo.pdf"));

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});
const allSplits = await splitter.splitDocuments(docs);

// Index chunks
await vectorStore.addDocuments(allSplits);

// Define state for application
const InputStateAnnotation = Annotation.Root({
	question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
	question: Annotation<string>,
	context: Annotation<Document[]>,
	answer: Annotation<string>,
});

const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");

// Define application steps
const retrieve = async (state: typeof InputStateAnnotation.State) => {
	const retrievedDocs = await vectorStore.similaritySearch(state.question);
	return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
	const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
	const messages = await promptTemplate.invoke({
		question: state.question,
		context: docsContent,
	});
	const response = await llm.invoke(messages);
	return { answer: response.content };
};

// Compile application and test
const graph = new StateGraph(StateAnnotation)
	.addNode("retrieve", retrieve)
	.addNode("generate", generate)
	.addEdge("__start__", "retrieve")
	.addEdge("retrieve", "generate")
	.addEdge("generate", "__end__")
	.compile();

// const input1 = {
// 	question: "Do you know my email ?",
// };
//
// const result1 = await graph.invoke(input1);
// console.log(result1.answer);

const input2 = { question: "What is Task Decomposition?" };
// const result2 = await graph.invoke(input2);
// console.log(`\nAnswer: ${result2.answer}`);

// console.log("\n====\n");
// for await (const chunk of await graph.stream(input2, {
// 	streamMode: "updates",
// })) {
// 	console.log("response : ", chunk);
// 	console.log("\n====\n");
// }

// Stream tokens
const stream = await graph.stream(input2, { streamMode: "messages" });

for await (const [message, _metadata] of stream) {
	process.stdout.write(message.content);
}
