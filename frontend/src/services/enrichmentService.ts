// services/enrichmentService.ts
import axios from "axios";

export const enrichPhoneData = async (phone: string) => {
  const response = await axios.request({
    method: "GET",
    url: "https://veriphone.p.rapidapi.com/verify",
    params: { phone },
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_API_VERIPHONE,
      "x-rapidapi-host": "veriphone.p.rapidapi.com",
    },
  });
  return response.data;
};

export const enrichLinkedInData = async (linkedinUrl: string) => {
  let retryCount = 0;
  let success = false;
  let linkedinData = null;

  while (!success && retryCount < 5) {
    try {
      const response = await axios.request({
        method: "GET",
        url: "https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile",
        params: {
          linkedin_url: linkedinUrl,
          include_skills: true,
          include_certifications: true,
          include_projects: true,
          include_honors: true,
          include_experiences: true,
          include_educations: true,
          include_about: true,
          include_company_info: true,
          include_location: true,
        },
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_API_LINKEDIN,
          "x-rapidapi-host": "fresh-linkedin-profile-data.p.rapidapi.com",
        },
      });
      linkedinData = response.data;
      success = true; // If no error, mark as success
    } catch (error:any) {
      if (error.response && error.response.status === 429) {
        // Rate limit exceeded, wait and retry
        retryCount++;
        const waitTime = 2000 * retryCount; // Exponential backoff
        console.warn(
          `Rate limit hit for LinkedIn profile. Retrying in ${waitTime / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        console.error("Error fetching LinkedIn data:", error);
        break; // Break out of the loop for non-rate limit errors
      }
    }
  }
  return linkedinData;
};
