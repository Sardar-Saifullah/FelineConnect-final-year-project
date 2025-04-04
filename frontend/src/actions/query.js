import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/client";
const fetchProducts = async (page = 1, limit = 10) => {
  try {
    const res = await client.get(`/products?page=${page}&limit=${limit}`);
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error("Error fetching products");
  }
};
export function useProducts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => fetchProducts(page, limit),
    keepPreviousData: true,
  });
}
const fetchUsers = async (page = 1, limit = 10) => {
  try {
    const res = await client.get(`/users?page=${page}&limit=${limit}`);
    return res.data;
  } catch (e) {
    console.log(e);
    throw new Error("Error fetching products");
  }
};
export function useUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
    keepPreviousData: true,
  });
}
export function useStatisticData() {
  return useQuery({
    queryKey: ["statistic"],
    queryFn: async () => {
      try {
        const res = await client.get("/users/stats");
        const data = res?.data || null;
        console.log("This is data ", data);
        return data;
      } catch (e) {
        console.log(e);
        throw Error("Invalid error");
      }
    },
  });
}
export function useGetProductByTitle(title) {
  return useQuery({
    enabled: !!title,
    queryKey: ["products", title],
    queryFn: async () => {
      const res = await client.get(`/products/product/${title}`);
      const data = res?.data;
      return data || null;
    },
  });
}
export function useGetProductById(id) {
  return useQuery({
    enabled: !!id,
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await client.get(`/products/${id}`);
      const data = res?.data;
      return data || null;
    },
  });
}
export function useProductCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await client.get(`/categories`);
      const data = res?.data;
      return data || null;
    },
  });
}
export function useProductReview(page = 1, limit = 10, productId) {
  return useQuery({
    enabled: !!productId,
    queryKey: ["product-reviews", productId, page, limit],
    queryFn: async () => {
      const res = await client.get(
        `/reviews/product/${productId}?page=${page}&limit=${limit}`
      );
      const data = res?.data;
      return data || null;
    },
  });
}
