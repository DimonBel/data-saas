

import axios from 'axios';

class PhoneEnrichmentService {
  private apiKey: string;
  private apiHost: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_API_VERIPHONE || '';
    this.apiHost = 'veriphone.p.rapidapi.com';
  }

  public async enrichPhoneNumber(phone: string, options: string[]): Promise<any> {
    try {
      const response = await axios.get(`https://${this.apiHost}/verify`, {
        params: { phone },
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost,
        },
      });
      const data = response.data;
      const enrichedData: any = {};

      if (options.includes('verifyPhoneNumber')) {
        enrichedData.PhoneValid = data.phone_valid ? 'Valid' : 'Invalid';
      }
      if (options.includes('getCarrierInfo')) {
        enrichedData.CarrierInfo = data.carrier || 'Unknown Carrier';
      }
      if (options.includes('getPhoneType')) {
        enrichedData.PhoneType = data.phone_type || 'Unknown Type';
      }
      if (options.includes('getCountryInfo')) {
        enrichedData.CountryInfo = data.country || 'Unknown Country';
      }

      return enrichedData;
    } catch (error) {
      console.error('Error fetching phone data:', error);
      throw error;
    }
  }
}

export default PhoneEnrichmentService;
