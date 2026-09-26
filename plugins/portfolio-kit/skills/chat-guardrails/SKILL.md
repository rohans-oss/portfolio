---
name: chat-guardrails
description: How the "Ask about Rohan" chat assistant decides what it will answer, and how to change it safely. Use when editing src/lib/scope.js, src/lib/localBrain.js, src/components/Chat.jsx or api/chat.js, or when the chat answers something it shouldn't (or refuses something it should answer).
---

# Chat assistant guardrails

The assistant has one job: answer questions about Rohan from his own data, and
politely refuse everything else. The refusal text is `REFUSAL` in
`src/lib/scope.js`.

## How a question flows

```
visitor types a question
  → isAboutRohan(question)        src/lib/scope.js
      no  → REFUSAL (no network call at all)
      yes → POST /api/chat          api/chat.js (Vercel only)
              isAboutRohan() again  (server doesn't trust the client)
              LLM with system prompt + buildKnowledgeBase()
            if the request fails or there is no API key (GitHub Pages)
              → localAnswer(question)   src/lib/localBrain.js
```

The guard runs in three places on purpose: the browser, the offline engine and
the server. Keep them all importing the same `isAboutRohan` and `REFUSAL`.

## How isAboutRohan works

1. If the question mentions Rohan or a pronoun that refers to him (`he`, `his`,
   `you`, …) → allowed.
2. If it names one of his projects → allowed.
3. Otherwise, strip filler words (`STOP`). If nothing is left (a greeting) → allowed.
4. Every remaining word must be a portfolio topic (`TOPICS`) or appear in his
   knowledge base. One unknown word — like a stranger's name — → refused.

This is why "who is manoj" is refused but "who is Rohan" is answered.

## Making changes

- **Chat refuses a fair question about Rohan:** add the missing word to `TOPICS`,
  or add a keyword to the right intent in `localBrain.js`. Don't weaken rule 4.
- **Chat answers something off-topic:** find which word let it through. Usually a
  word was added to `TOPICS` or `SELF` that is too general.
- **New fact about Rohan:** add it to `profile.js` (see the portfolio-content
  skill); both the knowledge base and the scope vocabulary pick it up.
- Add a test case for every bug you fix: on-topic questions go in `answered`,
  off-topic ones in `refused`, in `scripts/test-chat.mjs`.

## Checking

`npm run test:chat` runs every case against the offline engine and the
`/api/chat` handler. The PostToolUse hook runs it automatically after edits to
these files, and CI runs it before every deploy.
