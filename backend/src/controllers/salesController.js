// backend/src/controllers/salesController.js
import { querySales } from "../services/salesService.js";

export function getSales(req, res) {
  try {
    const {
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      categories,
      tags,
      paymentMethods,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page,
      pageSize
    } = req.query;

    const parseMulti = (val) =>
      val ? val.split(",").map((v) => v.trim()).filter(Boolean) : [];

    const result = querySales({
      search: search || "",
      regions: parseMulti(regions),
      genders: parseMulti(genders),
      categories: parseMulti(categories),
      tags: parseMulti(tags),
      paymentMethods: parseMulti(paymentMethods),
      ageMin: ageMin ? Number(ageMin) : null,
      ageMax: ageMax ? Number(ageMax) : null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      sortBy: sortBy || "date",
      sortOrder: sortOrder || "desc",
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10
    });

    res.json(result);
  } catch (err) {
    console.error("Error in getSales:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
