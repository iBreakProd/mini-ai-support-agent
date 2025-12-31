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

export const toolRunner = async (
  toolName: string,
  toolArgs: Record<string, any>
) => {
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
    default:
      throw new AppError("Unknown tool requested, please try again", 500);
  }
};
