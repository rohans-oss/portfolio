---
description: Run the chat assistant tests, or try specific questions against it
argument-hint: [question to try]
allowed-tools: Bash(npm run test:chat), Bash(node -e *)
---

!`npm run test:chat --silent`

Above are the results of the chat test suite. Summarise them in a couple of lines:
how many passed, and for any failure, what the question was and what went wrong.

If I gave a question here — "$ARGUMENTS" — also run it through the offline engine with
`node -e "import('./src/lib/localBrain.js').then(m => console.log(m.localAnswer(process.argv[1])))" "<question>"`
and tell me whether it was answered or refused, and whether that's the right
behaviour according to the chat-guardrails skill.
