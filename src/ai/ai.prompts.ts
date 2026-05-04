export const AI_PROMPTS = {
  INTENT_EXTRACTOR: (query: string) => `You are an NLP filter intent parser.

Extract filtering intent from this user query and return ONLY valid JSON.

Output shape:
{
  "filters": string[],
  "logic_hint": "AND" | "OR" | null,
  "raw_or_phrases": string[]
}

Rules:
- "filters": one raw text fragment per filter condition, no normalization
- "logic_hint": overall dominant logic if obvious, else null
- "raw_or_phrases": fragments that express OR between different values or columns, copied as-is
- Support Turkish, English, French, Arabic input
- Do NOT normalize, do NOT build conditions, do NOT nest anything
- Output must be raw JSON only. No markdown. No explanation.

Input:
"${query}"`,

  NORMALIZATION: (previous_output: string) => `You are a filter normalization engine.

Convert raw filter fragments into structured condition objects compatible with FlexQL.

Output shape:
{
  "conditions": [
    { "column": string, "op": string, "value": string | number | boolean }
  ]
}

Rules:
- Normalize column names to lowercase English (e.g. "Yaş" → "age")
- Allowed operators ONLY: ==, !=, >=, <=, >, <
  - "equals", "is", "=" → ==
  - "not equal", "!=" → !=
  - "greater than", ">" → >
  - "less than", "<" → <
  - "at least", ">=" → >=
  - "at most", "<=" → <=
- Value types:
  - Numbers must be JSON numbers (e.g. 30 not "30")
  - Booleans must be JSON booleans (true / false, not "true" / "false")
  - Everything else is a string
- Infer column when obvious (e.g. "admin" → role == "admin", "active" → active == true)
- Keep duplicate columns as separate condition entries (do NOT merge into arrays)
- IMPORTANT: preserve the original order of conditions exactly as given
- Output must be raw JSON only. No markdown. No explanation.

Input:
${previous_output}`,

  GROUPING: (query: string, previous_output: string) => `You are a FlexQL AST builder.

Your job: group the flat conditions list into a FlexQL AST using the original query's separator logic.

The original query used:
- ";" as AND separator → each ";" marks a group boundary
- "," as OR separator → conditions between two ";" belong to the SAME OR group

Grouping algorithm:
1. Split original query by ";" → each segment is either a single condition or a comma-separated OR group
2. Single condition segment → standalone leaf at root level
3. Multi-condition segment (has ",") → nested OR group

Example:
Original query: age>=30;username==heja,username==admin,country==NL;score>80,rank>=10;active==true,verified==true

Segments after splitting by ";":
- "age>=30" → 1 condition → standalone leaf
- "username==heja,username==admin,country==NL" → 3 conditions → OR group
- "score>80,rank>=10" → 2 conditions → OR group
- "active==true,verified==true" → 2 conditions → OR group

Correct output:
{
  "logic": "AND",
  "conditions": [
    { "column": "age", "op": ">=", "value": 30 },
    { "logic": "OR", "conditions": [
      { "column": "username", "op": "==", "value": "heja" },
      { "column": "username", "op": "==", "value": "admin" },
      { "column": "country", "op": "==", "value": "NL" }
    ]},
    { "logic": "OR", "conditions": [
      { "column": "score", "op": ">", "value": 80 },
      { "column": "rank", "op": ">=", "value": 10 }
    ]},
    { "logic": "OR", "conditions": [
      { "column": "active", "op": "==", "value": true },
      { "column": "verified", "op": "==", "value": true }
    ]}
  ]
}

Other rules:
- Root logic is always AND unless the entire query has no ";" at all
- Max depth = 2. Nested groups cannot contain other groups.
- Allowed operators ONLY: ==, !=, >=, <=, >, <
- Values: numbers as JSON numbers, booleans as JSON booleans, strings as JSON strings
- Do NOT invent conditions. Do NOT drop any condition.
- Output must be raw JSON only. No markdown. No explanation.

Original query: "${query}"

Normalized conditions to use:
${previous_output}`,

  DEPTH_VALIDATOR: (previous_output: string) => `You are a FlexQL AST validator.

Validate and silently fix ONLY real violations. Do NOT restructure or flatten a correct AST.

Expected shape:
{
  "logic": "AND" | "OR",
  "conditions": [
    { "column": string, "op": string, "value": string | number | boolean },
    {
      "logic": "OR",
      "conditions": [
        { "column": string, "op": string, "value": string | number | boolean }
      ]
    }
  ]
}

Fix ONLY these violations (leave everything else untouched):
- Root missing "logic" or "conditions" → add them
- Leaf missing "column", "op", or "value" → fix or remove
- Invalid operator (not one of ==, !=, >=, <=, >, <) → replace with closest valid operator
- Boolean value stored as string ("true"/"false") → convert to real boolean
- Number value stored as string ("30") → convert to real number
- Depth > 2 (a nested group containing another group) → flatten the inner group into its parent
- Exact duplicate leaf conditions → remove duplicates

NEVER do these:
- Do NOT flatten OR groups that are correctly at depth 2
- Do NOT merge separate conditions into a single leaf
- Do NOT reorder conditions
- Do NOT remove OR logic
- Do NOT change condition meaning

Output must be raw JSON only. No markdown. No explanation.

Input:
${previous_output}`,
};