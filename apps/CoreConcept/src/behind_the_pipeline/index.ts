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
