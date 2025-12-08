// backend/src/services/salesService.js
import { getSalesData } from "../utils/dataLoader.js";

export function querySales(options) {
  const {
    search,             // string
    regions,            // array of strings
    genders,            // array of strings
    ageMin,
    ageMax,
    categories,         // array of strings
    tags,               // array of strings
    paymentMethods,     // array of strings
    dateFrom,
    dateTo,
    sortBy,             // "date" | "quantity" | "customerName"
    sortOrder,          // "asc" | "desc"
    page,
    pageSize
  } = options;

  let data = [...getSalesData()];

  // 1. SEARCH (Customer Name, Phone Number)
  if (search && search.trim() !== "") {
    const q = search.toLowerCase();
    data = data.filter((row) => {
      const name = (row["Customer Name"] || "").toLowerCase();
      const phone = (row["Phone Number"] || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }

  // 2. FILTERS
  if (regions?.length) {
    data = data.filter((row) =>
      regions.includes(row["Customer Region"] || row["Region"])
    );
  }

  if (genders?.length) {
    data = data.filter((row) => genders.includes(row["Gender"]));
  }

  if (ageMin != null || ageMax != null) {
    data = data.filter((row) => {
      const age = row.Age;
      if (age == null || Number.isNaN(age)) return false;
      if (ageMin != null && age < ageMin) return false;
      if (ageMax != null && age > ageMax) return false;
      return true;
    });
  }

  if (categories?.length) {
    data = data.filter((row) =>
      categories.includes(row["Product Category"])
    );
  }

  if (tags?.length) {
    data = data.filter((row) => {
      const rowTags = (row["Tags"] || "").split(",").map((t) => t.trim());
      return tags.some((t) => rowTags.includes(t));
    });
  }

  if (paymentMethods?.length) {
    data = data.filter((row) =>
      paymentMethods.includes(row["Payment Method"])
    );
  }

  if (dateFrom || dateTo) {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    data = data.filter((row) => {
      const d = row.Date;
      if (!d) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  // 3. SORTING
  if (sortBy) {
    data.sort((a, b) => {
      let valA, valB;

      if (sortBy === "date") {
        valA = a.Date;
        valB = b.Date;
      } else if (sortBy === "quantity") {
        valA = a.Quantity;
        valB = b.Quantity;
      } else if (sortBy === "customerName") {
        valA = (a["Customer Name"] || "").toLowerCase();
        valB = (b["Customer Name"] || "").toLowerCase();
      }

      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  // 4. PAGINATION
  const totalItems = data.length;
  const currentPage = page || 1;
  const size = pageSize || 10;
  const start = (currentPage - 1) * size;
  const end = start + size;

  const paginated = data.slice(start, end);

  return {
    items: paginated,
    totalItems,
    totalPages: Math.ceil(totalItems / size),
    page: currentPage,
    pageSize: size
  };
}
