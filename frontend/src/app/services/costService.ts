// services/costService.ts
export const calculateTotalCost = (rows: number, column: string) => {
    let costPerRow = 0;
    if (column === "LinkedIn") {
      costPerRow = 0.1;
    } else if (column === "Phone") {
      costPerRow = 0.01;
    }
    return rows * costPerRow;
  };
  