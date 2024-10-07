import { DataItem } from "../types/data";
import { enrichPhoneData, enrichLinkedInData } from "../services/enrichmentService";

export const handleEnrichment = async (data: DataItem[], selectedColumn: string): Promise<DataItem[]> => {
    const enrichedDataPromises = data.map(async (item, index) => {
        let enrichedItem = { ...item };

        await new Promise((resolve) => setTimeout(resolve, 2000 * index)); // Rate limiting delay

        if (selectedColumn === "Phone" && item.Phone) {
            const apiData = await enrichPhoneData(item.Phone);
            enrichedItem = {
                ...enrichedItem,
                PhoneValid: apiData.phone_valid ? "Valid" : "Invalid",
                CarrierInfo: apiData.carrier || "Unknown Carrier",
                PhoneType: apiData.phone_type || "Unknown Type",
                CountryInfo: apiData.country || "Unknown Country",
            };
        }

        if (selectedColumn === "LinkedIn" && item.LinkedIn) {
            const linkedinData = await enrichLinkedInData(item.LinkedIn);
            const linkedinProfile = linkedinData.data || {};
            enrichedItem = {
                ...enrichedItem,
                About: linkedinProfile.about || "No About Info",
                Skills: linkedinProfile.skills ? linkedinProfile.skills.join(", ") : "No Skills",
                Certifications: linkedinProfile.certifications ? linkedinProfile.certifications.map((cert: any) => cert.name).join(", ") : "No Certifications",
                Projects: linkedinProfile.projects ? linkedinProfile.projects.map((proj: any) => proj.name).join(", ") : "No Projects",
                Honors: linkedinProfile.honors_and_awards ? linkedinProfile.honors_and_awards.map((hon: any) => hon.title).join(", ") : "No Honors",
                Experience: linkedinProfile.experiences ? linkedinProfile.experiences.map((exp: any) => exp.title).join(", ") : "No Experience",
                Education: linkedinProfile.educations ? linkedinProfile.educations.map((edu: any) => edu.degree).join(", ") : "No Education",
                Company: linkedinProfile.company || "No Company Info",
                CompanyDomain: linkedinProfile.company_domain || "No Domain Info",
                CompanyIndustry: linkedinProfile.company_industry || "No Industry Info",
                Location: linkedinProfile.location || "No Location Info",
                City: linkedinProfile.city || "No City Info",
                Country: linkedinProfile.country || "No Country Info",
            };
        }

        return enrichedItem;
    });

    return Promise.all(enrichedDataPromises);
};
