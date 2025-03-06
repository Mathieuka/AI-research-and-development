/**
 * @fileoverview This script demonstrates how to perform sequence classification
 * using the Hugging Face Transformers library. The example uses the
 * 'distilbert-base-uncased-finetuned-sst-2-english' model for sentiment analysis.
 *
 * Steps:
 * 1. Load the tokenizer using the specified model checkpoint.
 * 2. Tokenize the input text to prepare it for the model.
 * 3. Load the sequence classification model.
 * 4. Pass the tokenized input to the model to generate logits.
 * 5. Apply the softmax function to convert logits into probabilities.
 *
 * Dependencies:
 * - @huggingface/transformers
 *
 * Usage:
 * Ensure you have the necessary dependencies installed and then execute this script
 * to classify the sentiment of the input text.
 *
 * Example:
 * Input: "i'm sad"
 * Output: Probabilities indicating the sentiment classification.
 */

import {
	AutoModelForSequenceClassification,
	AutoTokenizer,
	type EncodingSingle,
	type PreTrainedTokenizer,
	env,
	softmax,
} from "@huggingface/transformers";

env.cacheDir = "./cache";

const checkpoint = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";

// Step 1: Load the tokenizer with the model
const tokenizer: PreTrainedTokenizer =
	await AutoTokenizer.from_pretrained(checkpoint);

const rawInput = "i'm sad";

// Step 2: Tokenize the input
const inputs: EncodingSingle = tokenizer(rawInput, {
	padding: true,
	truncation: true,
	return_tensors: "pt",
});

// Step 3: Load the model
const model = await AutoModelForSequenceClassification.from_pretrained(
	checkpoint,
	{
		dtype: "fp32",
	},
);

// console.log(
//     "%c LOG model",
//     "background: #222; color: #bada55",
//     model.config.label2id,
// );

// Step 4: Pass the input to gnerate the logits
const modelOutput = await model(inputs);

const logitsData = modelOutput.logits.ort_tensor.cpuData;

console.log(
	"%c LOG logitsData",
	"background: #222; color: #bada55",
	logitsData,
);

// Step 5: Use softmax to get the probabilities results
const output = softmax(logitsData);

console.log("%c LOG softmax", "background: #222; color: #bada55", output);
