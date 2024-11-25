import axios from 'axios';

export async function getCreditPackages() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/credit-packages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit packages:", error);
    throw error;
  }
}
