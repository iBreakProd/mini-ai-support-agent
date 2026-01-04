import { ChatCompletionTool } from "openai/resources/chat/completions.mjs";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getOrderById",
      description: "Get order by id",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The id of the order to get",
          },
        },
        required: ["orderId"],
        additionalProperties: false,
        example: {
          orderId: "123",
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
        "Get the user's hydration and lifestyle profile (activity level, climate, dietary preference, hydration goal). Use when the user asks about hydration tips, their routine, or personalized advice.",
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
        "Update the user's hydration/lifestyle profile. Use when the user explicitly states a change (e.g., 'I moved to a desert', 'I'm more active now').",
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
