import { Type, FunctionDeclaration } from "@google/genai";
import { Message } from "./types";

export const defaultUserAvatar = 'https://i.pravatar.cc/40?u=user';
export const defaultAdminAvatar = 'https://i.pravatar.cc/40?u=bot';

export const initialBotMessage: Message = {
  id: 1,
  text: "Welcome to The Forge. Ready to build a legend? Ask me about our elite gear and supplements, or type 'help' to see what I can do.",
  sender: 'bot',
  avatarUrl: defaultAdminAvatar,
};

export const chatbotCommands: FunctionDeclaration[] = [
  {
    name: 'showProducts',
    description: 'Displays available products to the user, optionally filtered by category.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: 'The category of products to show (e.g., "laptops", "nutrition", "equipment", "accessories"). Defaults to all if not specified.',
        },
      },
      required: [],
    },
  },
  {
    name: 'addToCart',
    description: 'Adds a specified quantity of a product to the user\'s shopping cart.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productName: {
          type: Type.STRING,
          description: 'The exact name of the product to add to the cart.',
        },
        quantity: {
          type: Type.INTEGER,
          description: 'The number of units to add. Defaults to 1.',
        },
      },
      required: ['productName'],
    },
  },
  {
    name: 'manageCart',
    description: 'Manages items in the shopping cart. Can be used to remove an item or update its quantity.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productName: {
          type: Type.STRING,
          description: 'The exact name of the product to manage in the cart.',
        },
        action: {
          type: Type.STRING,
          description: 'The action to perform: "remove" or "update".',
        },
        quantity: {
          type: Type.INTEGER,
          description: 'The new quantity for the product. Only required when the action is "update".',
        },
      },
      required: ['productName', 'action'],
    },
  },
  {
    name: 'viewCart',
    description: 'Shows the current items, quantities, and total price in the shopping cart.',
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: 'emptyCart',
    description: 'Removes all items from the shopping cart.',
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: 'placeOrder',
    description: 'Places an order with the items currently in the cart and a shipping address.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        shippingAddress: {
          type: Type.STRING,
          description: 'The full shipping address where the order should be sent.',
        },
      },
      required: ['shippingAddress'],
    },
  },
  {
    name: 'checkOrderStatus',
    description: 'Checks the status of a previously placed order using its ID.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: {
          type: Type.STRING,
          description: 'The unique identifier of the order to check (e.g., "12345").',
        },
      },
      required: ['orderId'],
    },
  },
  {
    name: 'viewOrderHistory',
    description: 'Displays a list of the user\'s past orders and their status.',
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: 'compareProducts',
    description: 'Compares two or more products side-by-side based on their specifications.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productNames: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'An array of the exact names of the products to compare.',
        },
      },
      required: ['productNames'],
    },
  },
  {
    name: 'modifyOrder',
    description: 'Modifies a recently placed order. Can be used to cancel an order or change the shipping address if it is still processing.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderId: {
          type: Type.STRING,
          description: 'The unique identifier of the order to modify.',
        },
        action: {
          type: Type.STRING,
          description: 'The modification to perform. Supported actions are "cancel" or "changeAddress".',
        },
        newAddress: {
          type: Type.STRING,
          description: 'The new shipping address. Only required when the action is "changeAddress".',
        },
      },
      required: ['orderId', 'action'],
    },
  },
  {
    name: 'showHelp',
    description: 'Displays a help message to the user outlining the bot\'s capabilities.',
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: 'applyDiscountCode',
    description: 'Applies a discount code to the shopping cart.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        discountCode: {
          type: Type.STRING,
          description: 'The discount code to apply (e.g., "SUMMER20").',
        },
      },
      required: ['discountCode'],
    },
  },
];