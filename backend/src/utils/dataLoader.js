// backend/src/utils/dataLoader.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let salesData = [];

export async function loadSalesData() {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(__dirname, "..", "data", "sales.csv");
    const rows = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        salesData = rows;
        console.log(`Loaded ${salesData.length} rows from sales.csv`);
        resolve();
      })
      .on("error", (err) => {
        console.error("Error loading sales.csv:", err);
        reject(err);
      });
  });
}

export function getSalesData() {
  return salesData;
}
