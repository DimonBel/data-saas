export interface TogetherData {
    Name: string;
    Email: string;
    Phone: string;
    Role: string;
    Company: string;
    LinkedIn: string;
    Additional_Info: string;
}

export const fetchTogetherData = async (): Promise<TogetherData[]> => {
    const response = await fetch('http://localhost:3000/api/together');
    const data = await response.json();
    console.log("!!!!!!!!!!!!!    the returned json data from togetherServices.ts:  ", data);
    return data.extractedJson;
};
