# AI Support Bot — How It Works

This document describes how the Arctic AI support chatbot is built and operates. Users can ask the AI about this documentation; call `getBotDocumentation` to retrieve it.

## Overview

The AI support chatbot is the primary way to interact with Arctic. Users can chat without logging in: they get help with products, orders, shipping, returns, and company policies. Only personalised hydration/lifestyle advice (based on user profile) requires login. The app is built to showcase the AI's capabilities in a hydration e-commerce context.

**Key principle:** Everything in the app exists to support the chat experience. We built the AI pipeline from scratch with no external agent framework—no LangChain, LlamaIndex, or Vercel AI SDK. Just the raw OpenAI API and custom orchestration.

## Architecture

### Tool-Running Loop

When the model returns `tool_calls`, we execute the requested function, append the result to the conversation, and call the API again. The model sees the tool output and can either call another tool or respond to the user. This loop runs up to 5 iterations—the AI effectively "talks to itself" until it has enough data to answer.

```
while (finish_reason === "tool_calls") {
  toolResult = await toolRunner(name, args);
  messages.push(assistantMsg, { role: "tool", content: toolResult });
  res = await openai.chat.completions.create({ messages, tools });
}
```

Example flow:
- User: "Where is order #ORD-22C56AE4?"
- Model calls `getOrderById({ orderId: "22C56AE4" })`
- Tool returns order JSON (status, items, shipping)
- Model responds with answer

### Custom Tool Runner

Tools are plain functions. A switch dispatches by name to DB services (orders, products, user profiles) or knowledge fetchers (markdown policies). No plugin system, no reflection—just a direct mapping.

**Data tools (Drizzle/Postgres):**
- `getOrderById`, `listAllOrders` → orders
- `getProductById`, `listAllProducts`, `searchProducts`, `getProductCatalog` → products
- `getUserProfile`, `updateUserProfile` → user profile service

**Knowledge tools (markdown fetch):**
- `getAppPurpose` → app purpose and showcase context
- `getBotDocumentation` → this document (how the bot works)
- `getCompanyInformation` → company info, mission, support
- `getShippingPolicy` → shipping policy
- `getReturnsAndRefundsPolicy` → returns and refunds policy

Example: `getOrderById`
- Input: `{ orderId: "22C56AE4" }`
- Output: `{ id, shippingStatus, items: [...], total, deliveryDate }`

Example: `getProductCatalog`
- Output: `{ categories: ["Titanium", "Copper", "Ceramic", ...], subCategories: ["750ml", "1000ml", ...], priceRange: { min, max } }`

### Knowledge Without Vectors

Company info, shipping, and returns policies live as markdown files. When the model calls a policy tool, we fetch and return the raw text. No embeddings, no vector DB—the model gets the full content in-context and answers from it.

## Structured Output

Responses are validated with Zod. The model must return JSON matching a discriminated union:

- **answer**: `{ type: "answer", response: "...", embeddings?: [{ type, id }] }`
- **ambiguity**: `{ type: "ambiguity", response: "...", id_array: [...], resourceType: "product" | "order" }`

Invalid output is rejected.

### Product & Order Embeddings

When the AI references specific products or orders, it attaches embeddings—IDs that render as clickable cards in the chat. Users can jump directly to product detail or order status. The model is instructed to include at most 6 embeddings and to guide users to the Products/Orders pages when more exist.

Images are shown via embedding cards, not in the markdown response text.

### Disambiguation

When multiple products or orders match a query, the model returns up to 4 candidates with `ambiguity` type. The UI prompts the user to pick one, or asks them to specify product/order + name if none match. No guessing—the model never exceeds 4 options.

Example: user picks a product → we send "I meant the product [uuid]" → model calls `getProductById` and answers.

## Context Injection

Users can chat without logging in; the model helps with products, orders, policies, and general hydration. When the user is logged in, we append `userId` to the system prompt so the model can call `getUserProfile` and `updateUserProfile` for personalized hydration advice. When not logged in, we inject a reminder not to call those tools and to prompt login only for personalised advice.

When logged in (userId in context):
```
The current user id is [uuid].
Use getUserProfile tool when the user asks about hydration or lifestyle.
```

When not logged in: the model is told not to call getUserProfile/updateUserProfile and to suggest logging in only for personalised advice, while helping with everything else (products, orders, shipping, general tips) without login.

## Parallel Tool Calls

When the model requests multiple tools in one turn (e.g. `getUserProfile` and `getProductCatalog` for personalized advice), we execute all of them and append each result before the next API call. This keeps recommendations fast and grounded in catalog data.

Example flow for "Which product should I go with?":
- Turn 1: Model calls `getUserProfile` + `getProductCatalog` in parallel → both results appended
- Turn 2: Model calls `searchProducts({ category: "Titanium", maxPrice: 120 })`
- Turn 3: Model produces final answer with embeddings

## Resilience & Rate Limiting

Tool parse errors, execution failures, and API errors (auth, timeout) are caught and returned as user-friendly messages. Request body is validated with Zod before processing.

All sensitive endpoints use Redis-backed fixed-window rate limiting (per user when logged in, per IP for anonymous):

| Endpoint        | Window | Max |
|----------------|--------|-----|
| AI chat         | 60s    | 10  |
| Create order    | 24h    | 5   |
| Create product  | 24h    | 5   |
| Generate description | 24h | 5   |
| Login / Signup  | 60s    | 10  |
| Profile update  | 1h     | 1   |

When exceeded, requests return 429 with a user-friendly message and optional retry-after.

## API

Send a message: `POST /api/v1/conversations`

Request:
```json
{
  "text": "Where is my order #ORD-22C56AE4?",
  "conversationId": "uuid"  // optional, omit for new conversation
}
```

Response:
```json
{
  "success": true,
  "data": {
    "type": "answer",
    "response": "Order #ORD-22C56AE4 is shipped...",
    "embeddings": [{ "type": "order", "id": "..." }]
  },
  "conversationId": "uuid"
}
```

## What Users Can Ask

- **Orders:** Track status, look up by ID, list recent orders
- **Products:** Browse catalog, get specs, compare, get personalized recommendations
- **Policies:** Shipping, returns, refunds, company information
- **Hydration:** Personalized advice when logged in; general tips without account
- **Bot documentation:** How the AI works, architecture, tools, API—this document
