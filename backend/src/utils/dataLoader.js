import fs from "fs";
import path from "path";
import https from "https";

const DATA_DIR = path.join(process.cwd(), "tmp");
const CSV_PATH = path.join(DATA_DIR, "sales.csv");

const DATASET_URL = "https://drive.google.com/uc?export=download&id=10BGpvV075CaMPMDAYX5xborIgdoeUhot";

function downloadCSV() {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(CSV_PATH)) {
      return resolve(CSV_PATH);
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });

    const file = fs.createWriteStream(CSV_PATH);

    https.get(DATASET_URL, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(CSV_PATH);
      });
    }).on("error", (err) => {
      fs.unlinkSync(CSV_PATH);
      reject(err);
    });
  });
}

export async function loadSalesData() {
  const csvPath = await downloadCSV();
  return csvPath;
}
