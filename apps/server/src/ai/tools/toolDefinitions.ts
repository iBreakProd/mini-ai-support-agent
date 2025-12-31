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
];
