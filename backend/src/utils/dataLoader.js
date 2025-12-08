// backend/src/utils/dataLoader.js
import https from "https";
import csv from "csv-parser";

const DATA_URL =
  "https://drive.usercontent.google.com/download?id=10BGpvV075CaMPMDAYX5xborIgdoeUhot&export=download";

let cache = null;

/**
 * Download and cache sales data from Google Drive CSV.
 * Returns a Promise that resolves to an array of normalized records.
 */
export function loadSalesData() {
  if (cache) {
    return Promise.resolve(cache);
  }

  return new Promise((resolve, reject) => {
    const results = [];

    https
      .get(DATA_URL, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(`Failed to download CSV. Status: ${res.statusCode}`)
          );
          return;
        }

        res
          .pipe(csv())
          .on("data", (row) => {
            // Normalize column names into JS-friendly fields
            try {
              results.push({
                transactionId: row["Transaction ID"],
                date: row["Date"],

                customerId: row["Customer ID"],
                customerName: row["Customer Name"],
                phoneNumber: row["Phone Number"],
                gender: row["Gender"],
                age: row["Age"] ? Number(row["Age"]) : null,
                customerRegion: row["Customer Region"],
                customerType: row["Customer Type"],

                productId: row["Product ID"],
                productName: row["Product Name"],
                brand: row["Brand"],
                productCategory: row["Product Category"],
                tags: row["Tags"],

                quantity: row["Quantity"] ? Number(row["Quantity"]) : 0,
                pricePerUnit: row["Price per Unit"]
                  ? Number(row["Price per Unit"])
                  : 0,
                discountPercentage: row["Discount Percentage"]
                  ? Number(row["Discount Percentage"])
                  : 0,
                totalAmount: row["Total Amount"]
                  ? Number(row["Total Amount"])
                  : 0,
                finalAmount: row["Final Amount"]
                  ? Number(row["Final Amount"])
                  : 0,

                paymentMethod: row["Payment Method"],
                orderStatus: row["Order Status"],
                deliveryType: row["Delivery Type"],
                storeId: row["Store ID"],
                storeLocation: row["Store Location"],
                salespersonId: row["Salesperson ID"],
                employeeName: row["Employee Name"],
              });
            } catch (e) {
              // If a row is malformed, just skip it instead of crashing
              console.error("Row parse error:", e.message);
            }
          })
          .on("end", () => {
            cache = results;
            resolve(cache);
          })
          .on("error", reject);
      })
      .on("error", reject);
  });
}
