// backend/src/controllers/salesController.js
import { querySales } from "../services/salesService.js";

export async function getSales(req, res) {
  try {
    // Just pass all query params straight to the service
    const result = await querySales(req.query);

    // result has { items, page, pageSize, totalItems, totalPages }
    res.json(result);
  } catch (err) {
    console.error("Error in getSales:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
