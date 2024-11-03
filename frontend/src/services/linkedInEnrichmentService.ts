
import axios from 'axios';

class LinkedInEnrichmentService {
  private apiKey: string;
  private apiHost: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_API_LINKEDIN || '';
    this.apiHost = 'fresh-linkedin-profile-data.p.rapidapi.com';
  }

  public async enrichLinkedInProfile(
    linkedInUrl: string,
    options: string[]
  ): Promise<any> {
    try {
      const params: any = {
        linkedin_url: linkedInUrl,
      };

      // Map enrichment options to API parameters
      options.forEach((option) => {
        switch (option) {
          case 'getSkills':
            params.include_skills = 'true';
            break;
          case 'getCertifications':
            params.include_certifications = 'true';
            break;
          case 'getProjects':
            params.include_projects = 'true';
            break;
          case 'getHonors':
            params.include_honors = 'true';
            break;
          case 'getExperience':
            params.include_experiences = 'true';
            break;
          case 'getEducation':
            params.include_educations = 'true';
            break;
          case 'getAbout':
            params.include_about = 'true';
            break;
          case 'getCompanyInfo':
            params.include_company_info = 'true';
            break;
          case 'getLocation':
            params.include_location = 'true';
            break;
          default:
            break;
        }
      });

      const response = await axios.get(`https://${this.apiHost}/get-linkedin-profile`, {
        params,
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
        },
      });

      const linkedinData = response.data.data || {};
      const enrichedData: any = {};

      // Extract fields based on options
      if (options.includes('getAbout')) {
        enrichedData.About = linkedinData.about || 'No About Info';
      }
      if (options.includes('getSkills')) {
        enrichedData.Skills =
          linkedinData.skills && linkedinData.skills.length > 0
            ? linkedinData.skills.replace(/\|/g, ', ')
            : 'No Skills';
      }
      if (options.includes('getCertifications')) {
        enrichedData.Certifications =
          linkedinData.certifications && linkedinData.certifications.length > 0
            ? linkedinData.certifications.map((cert: any) => cert.name).join(', ')
            : 'No Certifications';
      }
      if (options.includes('getProjects')) {
        enrichedData.Projects =
          linkedinData.projects && linkedinData.projects.length > 0
            ? linkedinData.projects.map((project: any) => project.name).join(', ')
            : 'No Projects';
      }
      if (options.includes('getHonors')) {
        enrichedData.Honors =
          linkedinData.honors_and_awards && linkedinData.honors_and_awards.length > 0
            ? linkedinData.honors_and_awards.map((honor: any) => honor.title).join(', ')
            : 'No Honors';
      }
      if (options.includes('getExperience')) {
        enrichedData.Experience =
          linkedinData.experiences && linkedinData.experiences.length > 0
            ? linkedinData.experiences.map((exp: any) => exp.title).join(', ')
            : 'No Experience';
      }
      if (options.includes('getEducation')) {
        enrichedData.Education =
          linkedinData.educations && linkedinData.educations.length > 0
            ? linkedinData.educations.map((edu: any) => edu.degree).join(', ')
            : 'No Education';
      }
      if (options.includes('getCompanyInfo')) {
        enrichedData.Company = linkedinData.company || 'No Company Info';
        enrichedData.CompanyDomain = linkedinData.company_domain || 'No Domain Info';
        enrichedData.CompanyIndustry = linkedinData.company_industry || 'No Industry Info';
      }
      if (options.includes('getLocation')) {
        enrichedData.Location = linkedinData.location || 'No Location Info';
        enrichedData.City = linkedinData.city || 'No City Info';
        enrichedData.Country = linkedinData.country || 'No Country Info';
      }

      return enrichedData;
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      throw error;
    }
  }
}

export default LinkedInEnrichmentService;
