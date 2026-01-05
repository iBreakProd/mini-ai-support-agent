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
} from "lucide-react";

export function DocsPage() {
  return (
    <AppShell>
      <main className="lg:pl-20 relative bg-grid-pattern min-h-screen">
        <div className="max-w-3xl mx-auto px-4 md:px-12 pt-24 lg:pt-16 pb-16">
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
                    </span>
                    <span className="text-gray-500">→</span>
                    <span>Drizzle/Postgres</span>
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span className="flex flex-wrap gap-1.5">
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
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Database className="size-5 text-primary" />
                  Knowledge without vectors
                </h3>
                <p className="text-gray-400 text-sm">
                  Company info, shipping, and returns policies live as markdown
                  files. When the model calls a policy tool, we fetch and return
                  the raw text. No embeddings, no vector DB—the model gets the
                  full policy in-context and answers from it.
                </p>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Structured output</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Responses are validated with Zod. The model must return JSON
                  matching a discriminated union: either{" "}
                  <code className="text-primary">answer</code> (with a response
                  string) or <code className="text-primary">ambiguity</code> (with
                  id_array and resourceType for disambiguation). Invalid output
                  is rejected.
                </p>
                <pre className="text-xs text-gray-500 bg-black/30 p-4 rounded overflow-x-auto ">
{`{ type: "answer", response: "..." }
{ type: "ambiguity", response: "...", id_array: [...], resourceType: "product" | "order" }`}
                </pre>
              </div>

              <div className="border border-neutral-border rounded-lg p-6 bg-background-dark/50">
                <h3 className="text-lg font-bold mb-3">Context injection</h3>
                <p className="text-gray-400 text-sm">
                  When the user is logged in, we append{" "}
                  <code className="text-primary">userId</code> to the system
                  prompt. The model uses it to call{" "}
                  <code className="text-primary">getUserProfile</code> and{" "}
                  <code className="text-primary">updateUserProfile</code> for
                  personalized hydration advice. Without login, those tools are
                  skipped.
                </p>
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
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 font-display">
              What you can ask
            </h2>
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
                  <li>Track shipment for order #123</li>
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
                  <li>Compare capacities of your bottles</li>
                  <li>What materials do you use?</li>
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

          <section className="border border-neutral-border rounded-xl p-8 bg-background-dark/50">
            <h2 className="text-xl font-bold mb-4 font-display">
              Getting started
            </h2>
            <p className="text-gray-400 mb-6">
              The chat is available on the Support page. Open it and ask anything
              about orders, products, policies, or hydration.
            </p>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors"
            >
              <MessageCircle className="size-5" />
              Go to Support
            </Link>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
