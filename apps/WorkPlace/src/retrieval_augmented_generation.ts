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

// Define prompt for question-answering

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

const inputs = {
	question: "Do you know my email ?",
};

const result = await graph.invoke(inputs);
console.log(result.answer);
