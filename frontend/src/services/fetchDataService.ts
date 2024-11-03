// services/fetchDataService.ts
import { fetchTogetherData, TogetherData } from "./togetherService";

export const fetchData = async (): Promise<TogetherData[]> => {
  try {
    const data = await fetchTogetherData();
    return data;
  } catch (error) {
    console.error("Error fetching together data:", error);
    throw error;
  }
};
