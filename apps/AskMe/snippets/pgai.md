# Pgai Vectorizer

https://github.com/timescale/pgai/blob/main/docs/vectorizer/quick-start.md
https://github.com/timescale/pgai/blob/main/docs/vectorizer/api-reference.md
https://github.com/timescale/pgai/blob/main/docs/vectorizer/overview.md#define-a-vectorizer

This project uses pgAI to create a vectorizer for user data, generating embeddings for semantic search.

## Setup

Ensure you have PostgreSQL with pgAI extension installed.

## Creating the Vectorizer

Run the following SQL command to create the vectorizer:

```sql
SELECT ai.create_vectorizer(
'user'::regclass,
destination => 'user_embeddings',
embedding => ai.embedding_ollama('nomic-embed-text', 768),
chunking => ai.chunking_recursive_character_text_splitter('name'),
formatting => ai.formatting_python_template('City: $city\nAge: ${age}::text\nChunk: $chunk')
);
```

This command:
- Uses the 'user' table as the source
- Creates 'user_embeddings' table for storing embeddings
- Uses 'nomic-embed-text' model with 768 dimensions
- Chunks data based on the 'name' field
- Formats each chunk with city, age, and name information

## Usage

After running the command, you can perform semantic searches on the user data using the generated embeddings.

## Note

Ensure the 'user' table has the necessary columns (city, age, name) before creating the vectorizer.
