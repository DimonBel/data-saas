// services/costService.ts
export const calculateTotalCost = (rows: number, column: string) => {
  let costPerRow = 0;
  if (column === "LinkedIn") {
    costPerRow = 1;
  } else if (column === "Phone") {
    costPerRow = 1;
  }
  return rows * costPerRow;
};
