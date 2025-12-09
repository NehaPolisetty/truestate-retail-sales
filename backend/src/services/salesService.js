// backend/src/services/salesService.js
import { getSalesData } from "../utils/dataLoader.js";

export function querySales(params) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    region,
    gender,
    category,
    paymentMethod,
    sortBy = "date",
    sortOrder = "desc",
  } = params;

  let data = getSalesData();

  // --- Search (name or phone) ---
  const searchTerm = search.trim().toLowerCase();
  if (searchTerm) {
    data = data.filter((row) => {
      const name = (row["Customer Name"] || "").toLowerCase();
      const phone = (row["Phone Number"] || "").toLowerCase();
      return name.includes(searchTerm) || phone.includes(searchTerm);
    });
  }

  // --- Filters ---
  const multiFilter = (value, selected) =>
    !selected || selected.length === 0 || selected.includes(value);

  if (region?.length) {
    data = data.filter((row) => multiFilter(row["Customer Region"], region));
  }
  if (gender?.length) {
    data = data.filter((row) => multiFilter(row["Gender"], gender));
  }
  if (category?.length) {
    data = data.filter((row) => multiFilter(row["Product Category"], category));
  }
  if (paymentMethod?.length) {
    data = data.filter((row) => multiFilter(row["Payment Method"], paymentMethod));
  }

  // --- Sorting ---
  const sorted = [...data].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;

    if (sortBy === "date") {
      const da = new Date(a["Date"]);
      const db = new Date(b["Date"]);
      return (da - db) * dir;
    }

    if (sortBy === "quantity") {
      const qa = Number(a["Quantity"] || 0);
      const qb = Number(b["Quantity"] || 0);
      return (qa - qb) * dir;
    }

    if (sortBy === "customer") {
      const na = (a["Customer Name"] || "").toLowerCase();
      const nb = (b["Customer Name"] || "").toLowerCase();
      return na < nb ? -1 * dir : na > nb ? 1 * dir : 0;
    }

    return 0;
  });

  // --- Pagination ---
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  };
}
