import { ChatCompletionTool } from "openai/resources/chat/completions.mjs";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getOrderById",
      description:
        "Get order by id. Accepts full UUID or the short format users see: #ORD-22C56AE4, ORD-22C56AE4, or 22C56AE4 (last 8 chars of the order UUID).",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description:
              "Order id: full UUID, or short format like 22C56AE4, ORD-22C56AE4, #ORD-22C56AE4",
          },
        },
        required: ["orderId"],
        additionalProperties: false,
        example: {
          orderId: "22C56AE4",
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProductById",
      description: "Get product by id",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "The id of the product to get",
          },
        },
        required: ["productId"],
        additionalProperties: false,
        example: {
          productId: "123",
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "listAllOrders",
      description: "List all orders",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "listAllProducts",
      description: "List all products",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getProductCatalog",
      description:
        "Get available product categories, subcategories, and price range. Call this BEFORE searchProducts when making personalized recommendations—it tells you the exact values to use (e.g. category: Titanium, Ceramic; subCategory: 750ml, 1000ml).",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchProducts",
      description:
        "Search/filter products by criteria. Use this when the user mentions a specific product name, description, or feature. Call getProductCatalog first if unsure about categories.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Product name, feature, or natural language search query (e.g., 'ergonomic chair')",
          },
          category: {
            type: "string",
            description: "Product category filter (partial match)",
          },
          subCategory: {
            type: "string",
            description: "Sub-category filter e.g. capacity or variant (partial match)",
          },
          maxPrice: {
            type: "number",
            description: "Maximum price in dollars",
          },
          minPrice: {
            type: "number",
            description: "Minimum price in dollars",
          },
          limit: {
            type: "number",
            description: "Max results to return (default 10, max 50)",
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getAppPurpose",
      description:
        "Get information about the app's purpose. Use when the user asks: What is this app? What does Arctic do? What is the AI's purpose? What does this application do? Why was this built?",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getBotDocumentation",
      description:
        "Get documentation on how the AI bot works—architecture, tool-running loop, tools, embeddings, API, rate limits. Use when the user asks: How does this bot work? How are you built? What tools do you have? How does the AI work? Architecture? API? Documentation?",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getCompanyInformation",
      description:
        "Get company information, includes support details, mission, terms and conditions, sourcing and quality, sustainability, etc.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getShippingPolicy",
      description:
        "Get shipping policy, includes processing time, shipping methods, rates, cash on delivery, delivery attempts, tracking, address accuracy, damaged, leaking, or missing items, heat sensitivity, contact details, etc.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getReturnsAndRefundsPolicy",
      description:
        "Get returns and refunds policy, includes return window, how to start a return, condition requirements, refunds, exchanges, damaged/defective on arrival, return shipping, RTO (return to origin) / refused deliveries, etc.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
        example: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getUserProfile",
      description:
        "Get the user's hydration and lifestyle profile (activity level, climate, dietary preference, hydration goal). Only call when userId is in context (user is logged in). If no userId in context, do NOT call—instead tell the user they can log in for personalised advice and help with products/orders/policies. Use when the user asks about hydration tips, their routine, or personalized advice.",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "The id of the user whose profile to fetch",
          },
        },
        required: ["userId"],
        additionalProperties: false,
        example: { userId: "uuid-here" },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "updateUserProfile",
      description:
        "Update the user's hydration/lifestyle profile. Only call when userId is in context (user is logged in). If no userId, do NOT call. Use when the user explicitly states a change (e.g., 'I moved to a desert', 'I'm more active now').",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "The id of the user" },
          activityLevel: { type: "string", description: "sedentary | moderate | active" },
          climate: { type: "string", description: "dry | humid | temperate" },
          dietaryPreference: { type: "string" },
          hydrationGoal: { type: "string" },
        },
        required: ["userId"],
        additionalProperties: false,
        example: { userId: "uuid", activityLevel: "active", climate: "dry" },
      },
    },
  },
];
