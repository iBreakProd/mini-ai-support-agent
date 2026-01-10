import { Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import {
  Package,
  ShoppingBag,
  FileText,
  Droplets,
  MessageCircle,
  Code2,
  Cpu,
  Database,
  Zap,
  Shield,
  Bot,
} from "lucide-react";

const DEMO_EMBEDDINGS = [
  { type: "product" as const, name: "TITAN X-1", image: "/images/products/B-1.png", price: "$120" },
  { type: "product" as const, name: "MIDNIGHT OPS", image: "/images/products/B-3.png", price: "$85" },
  { type: "product" as const, name: "ALABASTER", image: "/images/products/B-4.png", price: "$75" },
];

const DEMO_ORDER = {
  type: "order" as const,
  shortId: "22C56AE4",
  total: "120.00",
  image: "/images/products/B-1.png",
};

function DemoEmbeddingCard({ item }: { item: typeof DEMO_EMBEDDINGS[0] | typeof DEMO_ORDER }) {
  const isProduct = "name" in item;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-border bg-white/5">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
        <img src={item.image} alt={isProduct ? item.name : `Order`} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {isProduct ? item.name : `#ORD-${item.shortId} · $${item.total}`}
        </p>
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isProduct ? "bg-primary/20 text-primary" : "bg-purple-500/20 text-purple-400"}`}>
          {isProduct ? "Product" : "Order"}
        </span>
      </div>
    </div>
  );
}

export function DocsPage() {
  return (
    <AppShell>
      <main className="lg:pl-20 relative bg-grid-pattern min-h-screen">
        <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-40 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-12 pt-24 lg:pt-16 pb-16">
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-primary" />
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                Documentation
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              AI Support Bot
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              The AI support chatbot is the primary way to interact with Arctic.
              It helps with orders, products, policies, and personalized
              hydration advice. <br/> 
              <i>Everything else in the app exists to support this experience.</i>
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed">
              You can find the <strong>Source Code</strong> and <strong>Author (By Harshit)</strong> links at the top right of the landing page hero section.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 font-display flex items-center gap-2">
              <Code2 className="size-6 text-primary" />
              Architecture
            </h2>
            <p className="text-gray-400 mb-6">
              We built the AI pipeline from scratch with no external agent
              framework. No LangChain, LlamaIndex, or Vercel AI SDK—just the raw
              OpenAI API and custom orchestration.
            </p>
            <div className="space-y-6">
              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Cpu className="size-5 text-primary" />
                  Tool-running loop
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  When the model returns <code className="text-primary">tool_calls</code>, we execute the
                  requested function, append the result to the conversation, and
                  call the API again. The model sees the tool output and can
                  either call another tool or respond to the user. This loop runs
                  up to 5 iterations—AI effectively &quot;talks to itself&quot; until it
                  has enough data to answer.
                </p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto">
{`while (finish_reason === "tool_calls") {
  toolResult = await toolRunner(name, args);
  messages.push(assistantMsg, { role: "tool", content: toolResult });
  res = await openai.chat.completions.create({ messages, tools });
}`}
                </pre>
                <p className="text-gray-500 text-xs mt-3 font-medium">Example flow:</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`User: "Where is order #ORD-22C56AE4?"
  → Model calls getOrderById({ orderId: "22C56AE4" })
  → Tool returns order JSON (status, items, shipping)
  → Model responds with answer`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Zap className="size-5 text-primary" />
                  Custom tool runner
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Tools are plain functions. A switch dispatches by name to DB
                  services (orders, products, user profiles) or knowledge fetchers
                  (markdown policies). No plugin system, no reflection—just a
                  direct mapping.
                </p>
                <ul className="text-sm text-gray-400 space-y-3">
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="flex flex-wrap gap-1.5">
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getOrderById
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        listAllOrders
                      </code>
                    </span>
                    <span className="text-gray-500">→</span>
                    <span>Drizzle/Postgres</span>
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="flex flex-wrap gap-1.5">
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getProductById
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        listAllProducts
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        searchProducts
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getProductCatalog
                      </code>
                    </span>
                    <span className="text-gray-500">→</span>
                    <span>Drizzle/Postgres</span>
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="flex flex-wrap gap-1.5">
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getAppPurpose
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getCompanyInformation
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getShippingPolicy
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getReturnsAndRefundsPolicy
                      </code>
                    </span>
                    <span className="text-gray-500">→</span>
                    <span>Markdown fetch</span>
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="flex flex-wrap gap-1.5">
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        getUserProfile
                      </code>
                      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                        updateUserProfile
                      </code>
                    </span>
                    <span className="text-gray-500">→</span>
                    <span>User profile service</span>
                  </li>
                </ul>
                <p className="text-gray-500 text-xs mt-4 font-medium">Example: getOrderById</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`Input:  { orderId: "22C56AE4" }
Output: { id, shippingStatus, items: [...], total, deliveryDate }`}
                </pre>
                <p className="text-gray-500 text-xs mt-3 font-medium">Example: getProductCatalog</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`Output: {
  categories: ["Titanium", "Copper", "Ceramic", "Midnight", "Insulated"],
  subCategories: ["750ml", "1000ml", "500ml", ...],
  priceRange: { min: 75, max: 349 }
}`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Database className="size-5 text-primary" />
                  Knowledge without vectors
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Company info, shipping, and returns policies live as markdown
                  files. When the model calls a policy tool, we fetch and return
                  the raw text. No embeddings, no vector DB—the model gets the
                  full policy in-context and answers from it.
                </p>
                <p className="text-gray-500 text-xs font-medium">Example: getShippingPolicy returns</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1 max-h-32 overflow-y-auto">
{`# Shipping Policy
Processing time: 1-2 business days.
Methods: Standard (3-5 days), Express (1-2 days).
Rates: Standard $5.99, Free over $75...`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Structured output</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Responses are validated with Zod. The model must return JSON
                  matching a discriminated union: either{" "}
                  <code className="text-primary">answer</code> (with response
                  and optional embeddings for product/order cards) or{" "}
                  <code className="text-primary">ambiguity</code> (with
                  id_array and resourceType for disambiguation). Invalid output
                  is rejected.
                </p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto ">
{`{ type: "answer", response: "...", embeddings?: [{ type, id }] }
{ type: "ambiguity", response: "...", id_array: [...], resourceType: "product" | "order" }`}
                </pre>
                <p className="text-gray-500 text-xs mt-3 font-medium">Example: answer with embeddings</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`{
  "type": "answer",
  "response": "Here are 3 bottles under $100:\\n1. TITAN X-1 ($120)\\n2. MIDNIGHT OPS ($85)...",
  "embeddings": [
    { "type": "product", "id": "3d75f079-f92b-4d1d-956c-cc4ca19c1594" },
    { "type": "product", "id": "a1b2c3d4-..." }
  ]
}`}
                </pre>
                <p className="text-gray-500 text-xs mt-3 font-medium">Example: ambiguity</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`{
  "type": "ambiguity",
  "response": "Which product did you mean?",
  "id_array": ["uuid-1", "uuid-2"],
  "resourceType": "product"
}`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <MessageCircle className="size-5 text-primary" />
                  Product & order embeddings
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  When the AI references specific products or orders, it can attach
                  embeddings—IDs that render as clickable cards in the chat. Users
                  can jump directly to product detail or order status from the
                  message. The model is instructed to include at most 6 embeddings
                  and to guide users to the Products/Orders pages when more exist.
                </p>
                <p className="text-gray-500 text-xs font-medium">Rendered in chat:</p>
                <div className="mt-2 flex flex-col gap-1 items-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="size-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="chat-bubble-received rounded-lg px-4 py-2.5 text-gray-200">
                        <p className="text-sm">
                          Here are 3 bottles under $100: TITAN X-1 ($120), MIDNIGHT OPS ($85), ALABASTER ($75).
                          Visit the Products page for more options.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {DEMO_EMBEDDINGS.map((item, i) => (
                          <DemoEmbeddingCard key={i} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono ml-10">Just now</span>
                </div>
                <p className="text-gray-500 text-xs font-medium mt-4">Order embedding:</p>
                <div className="mt-2">
                  <DemoEmbeddingCard item={DEMO_ORDER} />
                </div>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Parallel tool calls</h3>
                <p className="text-gray-400 text-sm mb-4">
                  When the model requests multiple tools in one turn (e.g.
                  getUserProfile and getProductCatalog for personalized advice),
                  we execute all of them and append each result before the next API
                  call. This keeps recommendations fast and grounded in catalog data.
                </p>
                <p className="text-gray-500 text-xs font-medium">Example: &quot;Which product should I go with?&quot;</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`Turn 1: Model calls getUserProfile + getProductCatalog in parallel
  → Both results appended to messages
Turn 2: Model calls searchProducts({ category: "Titanium", maxPrice: 120 })
  → Returns product list
Turn 3: Model produces final answer with embeddings`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Context injection</h3>
                <p className="text-gray-400 text-sm mb-4">
                  When the user is logged in, we append{" "}
                  <code className="text-primary">userId</code> to the system
                  prompt. The model uses it to call{" "}
                  <code className="text-primary">getUserProfile</code> and{" "}
                  <code className="text-primary">updateUserProfile</code> for
                  personalized hydration advice. Without login, those tools are
                  skipped.
                </p>
                <p className="text-gray-500 text-xs font-medium">Example: appended to system prompt</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`The current user id is 95f42ea5-6417-4451-addd-81e33058671b.
Use getUserProfile tool when the user asks about hydration or lifestyle.`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Disambiguation</h3>
                <p className="text-gray-400 text-sm mb-4">
                  When multiple products or orders match a query, the model
                  returns up to 4 candidates with{" "}
                  <code className="text-primary">ambiguity</code> type. The UI
                  can prompt the user to pick one, or ask them to specify
                  product/order + name if none match. No guessing—the model is
                  instructed to never exceed 4 options.
                </p>
                <p className="text-gray-500 text-xs font-medium">Example: user picks → we send</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`User selected "3d75f079-f92b-4d1d-956c-cc4ca19c1594"
→ Next message: "I meant the product 3d75f079-f92b-4d1d-956c-cc4ca19c1594"
→ Model calls getProductById and answers`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Resilience</h3>
                <p className="text-gray-400 text-sm">
                  Tool parse errors, execution failures, and API errors (auth,
                  timeout) are caught and returned as user-friendly messages.
                  Request body is validated with Zod before processing.
                </p>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  Rate limiting
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  All sensitive endpoints are protected by Redis-backed
                  fixed-window rate limiting. Limits are applied per user (when
                  logged in) or per IP for anonymous requests.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-neutral-border">
                        <th className="py-2 pr-4">Endpoint</th>
                        <th className="py-2 pr-4">Window</th>
                        <th className="py-2">Max</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-400">
                      <tr className="border-b border-neutral-border/50">
                        <td className="py-2 pr-4 font-mono">AI chat</td>
                        <td className="py-2 pr-4">60s</td>
                        <td className="py-2">10</td>
                      </tr>
                      <tr className="border-b border-neutral-border/50">
                        <td className="py-2 pr-4 font-mono">Create order</td>
                        <td className="py-2 pr-4">24h</td>
                        <td className="py-2">5</td>
                      </tr>
                      <tr className="border-b border-neutral-border/50">
                        <td className="py-2 pr-4 font-mono">Create product</td>
                        <td className="py-2 pr-4">24h</td>
                        <td className="py-2">5</td>
                      </tr>
                      <tr className="border-b border-neutral-border/50">
                        <td className="py-2 pr-4 font-mono">Generate description</td>
                        <td className="py-2 pr-4">24h</td>
                        <td className="py-2">5</td>
                      </tr>
                      <tr className="border-b border-neutral-border/50">
                        <td className="py-2 pr-4 font-mono">Login / Signup</td>
                        <td className="py-2 pr-4">60s</td>
                        <td className="py-2">10</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">Profile update</td>
                        <td className="py-2 pr-4">1h</td>
                        <td className="py-2">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-500 text-xs mt-4">
                  When a limit is exceeded, requests return 429 with a
                  user-friendly message and optional retry-after.
                </p>
                <p className="text-gray-500 text-xs mt-3 font-medium">Example: 429 response</p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`{
  "status": 429,
  "message": "Too many requests. Try again in 30 seconds.",
  "retryAfterSeconds": 30
}`}
                </pre>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 font-display">
              What you can ask
            </h2>
            <div className="mb-8 p-4 rounded-lg border border-primary/30 bg-primary/5">
              <p className="text-gray-500 text-xs font-medium mb-2">Example conversation</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400"><span className="text-primary">You:</span> Which product should I go with? I'm active and live in a dry climate.</p>
                <p className="text-gray-400"><span className="text-primary">AI:</span> Based on your profile (active, dry climate), I’d suggest the TITAN X-1 for durability and the CHROME SERIES for insulation. Here are a few options—[product cards]. Visit the Products page for more.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="border-l-2 border-primary pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="size-5 text-primary" />
                  <h3 className="text-lg font-bold">Orders</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Track order status, look up an order by ID, or list all your
                  orders to find the one you need.
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>Where is my order?</li>
                  <li>Track order #ORD-22C56AE4 (short ID supported)</li>
                  <li>Show me my recent orders</li>
                </ul>
              </div>

              <div className="border-l-2 border-primary pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="size-5 text-primary" />
                  <h3 className="text-lg font-bold">Products</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Browse the catalog, get specs, and compare products.
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>Tell me about the Obsidian X-200</li>
                  <li>Which product should I personally go with? (personalized via profile)</li>
                  <li>Show me bottles under $100 or titanium options</li>
                </ul>
              </div>

              <div className="border-l-2 border-primary pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="size-5 text-primary" />
                  <h3 className="text-lg font-bold">Policies</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Shipping, returns, refunds, and company information—all
                  grounded in our actual policies.
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>What&apos;s your return policy?</li>
                  <li>Do you ship to Canada?</li>
                  <li>How do I start a return?</li>
                </ul>
              </div>

              <div className="border-l-2 border-primary pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="size-5 text-primary" />
                  <h3 className="text-lg font-bold">Hydration</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Get personalized hydration and lifestyle advice when logged in.
                  General tips are available without an account.
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>How much water should I drink?</li>
                  <li>Give me tips for my climate</li>
                  <li>I&apos;m more active now—update my profile</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 font-display">
              API example
            </h2>
            <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
              <p className="text-gray-400 text-sm mb-4">
                Send a message to the AI. Include <code className="text-primary">conversationId</code> to
                continue a thread, or omit it to start a new one.
              </p>
              <p className="text-gray-500 text-xs font-medium">Request: POST /api/v1/conversations</p>
              <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`{
  "text": "Where is my order #ORD-22C56AE4?",
  "conversationId": "dce839b7-1e7a-4b4a-b110-ab2e80c27f08"  // optional
}`}
              </pre>
              <p className="text-gray-500 text-xs mt-4 font-medium">Response</p>
              <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto mt-1">
{`{
  "success": true,
  "data": {
    "type": "answer",
    "response": "Order #ORD-22C56AE4 is shipped. Expected delivery: Feb 15...",
    "embeddings": [{ "type": "order", "id": "..." }]
  },
  "conversationId": "dce839b7-1e7a-4b4a-b110-ab2e80c27f08"
}`}
              </pre>
            </div>
          </section>

          <section className="border border-neutral-border rounded-xl p-8 bg-background-dark/50">
            <h2 className="text-xl font-bold mb-4 font-display">
              Getting started
            </h2>
            <p className="text-gray-400 mb-6">
              The AI chat is available as a floating widget on every page—click
              the blue icon in the bottom-right. For full conversation history and
              past chats, visit the Support page. Markdown responses (lists,
              bold, images) render nicely in the chat bubbles.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors"
              >
                <MessageCircle className="size-5" />
                Support page
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors"
              >
                <ShoppingBag className="size-5" />
                Products
              </Link>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
