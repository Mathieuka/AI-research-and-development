import { describe, expect, it } from "vitest";
import { graph, stateGraph } from "../graph.ts";

describe("Graph", () => {
	it("should create a graph", async () => {
		const { channels, nodes, edges } = stateGraph;

		expect(channels).toEqual(
			expect.objectContaining({
				answer: expect.any(Object),
				question: expect.any(Object),
			}),
		);

		expect(nodes).toEqual({
			generate_query: expect.any(Object),
			retrieve_documents: expect.any(Object),
			generate: expect.any(Object),
		});

		expect(edges.size).toEqual(3);

		const response = await graph.invoke({
			question: "Find this document",
		});

		expect(response).toEqual({
			question: "Find this document",
			answer:
				"Find this document rephrased as a query!\n" +
				"\n" +
				"some random document\n" +
				"\n" +
				"Find this document",
		});
	});
});
