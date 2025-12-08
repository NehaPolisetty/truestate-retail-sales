// backend/src/utils/dataLoader.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const __dirname = path.resolve();
let salesData = [];

export function getSalesData() {
  return salesData;
}

export function loadSalesData() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "src", "data", "sales.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Convert/normalize important numeric + date fields
        const parsedRow = {
          ...row,
          Age: row.Age ? Number(row.Age) : null,
          Quantity: row.Quantity ? Number(row.Quantity) : null,
          PricePerUnit: row["Price per Unit"]
            ? Number(row["Price per Unit"])
            : null,
          DiscountPercentage: row["Discount Percentage"]
            ? Number(row["Discount Percentage"])
            : null,
          TotalAmount: row["Total Amount"] ? Number(row["Total Amount"]) : null,
          FinalAmount: row["Final Amount"] ? Number(row["Final Amount"]) : null,
          Date: row.Date ? new Date(row.Date) : null
        };
        results.push(parsedRow);
      })
      .on("end", () => {
        salesData = results;
        console.log(`Loaded ${salesData.length} sales records.`);
        resolve();
      })
      .on("error", (err) => {
        console.error("Error loading CSV:", err);
        reject(err);
      });
  });
}
