import { describe, expect, it } from "vitest";
import { stateGraph } from "../graph.ts";

describe("Graph", () => {
	it("should correctly initialize the stateGraph", () => {
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
	});
});
