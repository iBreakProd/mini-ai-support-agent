import {
  getOrderByIdWithItems,
  listAllOrders,
} from "../../services/db/orderServices";
import {
  getProductById,
  getProductCatalogSummary,
  listAllProducts,
  searchProducts,
} from "../../services/db/productServices";
import {
  fetchAppPurpose,
  fetchBotDocumentation,
  fetchCompanyInformation,
  fetchShippingPolicy,
  fetchReturnsAndRefundsPolicy,
} from "../../services/knowledge/fetchServices";
import { AppError } from "../../utils/errorClasses";
import { getUserProfileByUserId } from "../../services/db/userProfileServices";
import { upsertUserProfileByUserId } from "../../services/db/userProfileServices";

export const toolRunner = async (
  toolName: string,
  toolArgs: Record<string, any>,
  context?: { userId?: string }
) => {
  let userId: string | undefined;
  let result: string;
  try {
  switch (toolName) {
    case "getOrderById": {
      const orderId = toolArgs.orderId ?? "";
      const orderWithItems = await getOrderByIdWithItems(orderId);
      result = orderWithItems ? JSON.stringify(orderWithItems) : JSON.stringify({ error: "Order not found. Try the full order ID or short format like #ORD-22C56AE4" });
      return result;
    }
    case "getProductById": {
      result = await getProductById(toolArgs.productId);
      return result;
    }
    case "listAllOrders": {
      result = await listAllOrders();
      return result;
    }
    case "listAllProducts": {
      result = await listAllProducts();
      return result;
    }
    case "getProductCatalog": {
      const catalog = await getProductCatalogSummary();
      result = JSON.stringify(catalog);
      return result;
    }
    case "searchProducts": {
      result = await searchProducts({
        category: toolArgs.category,
        subCategory: toolArgs.subCategory,
        maxPrice: toolArgs.maxPrice,
        minPrice: toolArgs.minPrice,
        limit: toolArgs.limit,
      });
      return result;
    }
    case "getAppPurpose": {
      result = await fetchAppPurpose();
      return result;
    }
    case "getBotDocumentation": {
      result = await fetchBotDocumentation();
      return result;
    }
    case "getCompanyInformation": {
      result = await fetchCompanyInformation();
      return result;
    }
    case "getShippingPolicy": {
      result = await fetchShippingPolicy();
      return result;
    }
    case "getReturnsAndRefundsPolicy": {
      result = await fetchReturnsAndRefundsPolicy();
      return result;
    }
    case "getUserProfile": {
      userId = toolArgs.userId ?? context?.userId;
      if (!userId) {
        return JSON.stringify({
          profile: null,
          reason: "no_user_id",
          message: "User ID was not provided. The user may need to log in or refresh the page.",
        });
      }
      const profile = await getUserProfileByUserId(userId);
      if (!profile) {
        return JSON.stringify({
          profile: null,
          reason: "profile_not_set_up",
          message: "User is logged in but has not set up their hydration profile yet. They should visit the Profile page to add their activity level, climate, and goals. You can still give general product recommendations using searchProducts.",
        });
      }
      return JSON.stringify(profile);
    }
    case "updateUserProfile": {
      userId = toolArgs.userId ?? context?.userId;
      if (!userId) {
        return JSON.stringify({ error: "User ID is required to update profile" });
      }
      const { userId: _, ...data } = toolArgs;
      const updated = await upsertUserProfileByUserId(userId, data as { activityLevel: string, climate: string, dietaryPreference?: string, hydrationGoal?: string });
      return JSON.stringify(updated);
    }
    default:
      throw new AppError("Unknown tool requested, please try again", 500);
  }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw err;
  }
};
