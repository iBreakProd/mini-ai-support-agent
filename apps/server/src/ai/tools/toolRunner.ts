import { getOrderById, listAllOrders } from "../../services/db/orderServices";
import {
  getProductById,
  listAllProducts,
} from "../../services/db/productServices";
import {
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
  switch (toolName) {
    case "getOrderById":
      return getOrderById(toolArgs.orderId);
    case "getProductById":
      return getProductById(toolArgs.productId);
    case "listAllOrders":
      return listAllOrders();
    case "listAllProducts":
      return listAllProducts();
    case "getCompanyInformation":
      return fetchCompanyInformation();
    case "getShippingPolicy":
      return fetchShippingPolicy();
    case "getReturnsAndRefundsPolicy":
      return fetchReturnsAndRefundsPolicy();
    case "getUserProfile":
      userId = toolArgs.userId ?? context?.userId;
      if (!userId) {
        return JSON.stringify({ error: "User ID is required to fetch profile" });
      }
      const profile = await getUserProfileByUserId(userId);
      return JSON.stringify(profile);
    case "updateUserProfile":
      userId = toolArgs.userId ?? context?.userId;
      if (!userId) {
        return JSON.stringify({ error: "User ID is required to update profile" });
      }
      const { userId: _, ...data } = toolArgs;
      const updated = await upsertUserProfileByUserId(userId, data as { activityLevel: string, climate: string, dietaryPreference?: string, hydrationGoal?: string });
      return JSON.stringify(updated);
    default:
      throw new AppError("Unknown tool requested, please try again", 500);
  }
};
