import Papa from "papaparse";

export default class FileService {
  static async parseFile(file: File): Promise<{ columns: string[]; data: any[] }> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length) reject(result.errors);
          resolve({
            columns: Object.keys(result.data[0] || {}),
            data: result.data,
          });
        },
        error: (error) => reject(error),
      });
    });
  }

  static async uploadFileToStrapi(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload file to Strapi");
    return response.json();
  }

  static async createDataset(dataset: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}datasets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(dataset),
    });

    if (!response.ok) throw new Error("Failed to create dataset");
    return response.json();
  }

  static async uploadRows(rows: any[], datasetId: number): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      const rowData = {
        data: {
          dataset: datasetId,
          row_index: i + 1,
          name: rows[i].name,
          surname: rows[i].surname,
          function: rows[i].function,
          email: rows[i].email,
          gender: rows[i].gender,
          language: rows[i].language,
          phone: rows[i].phone,
          country: rows[i].country,
          linkedin: rows[i].linkedin,
        },

      };

      console.log("Posting row data:", rowData);



      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}rows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify(rowData),
      });
      console.log(rowData);

      if (!response.ok) throw new Error("Failed to upload rows");
    }
  }
}