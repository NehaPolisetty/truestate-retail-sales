// backend/src/services/salesService.js
import { loadSalesData } from "../utils/dataLoader.js";

/**
 * Main query function used by the controller.
 * Called as: querySales(req.query)
 */
export async function querySales(query) {
  const {
    page = "1",
    pageSize = "10",
    search = "",
    region,
    gender,
    category,
    paymentMethod,
    tags,
    sortBy = "date",
    sortOrder = "desc",
    startDate,
    endDate,
    minAge,
    maxAge,
  } = query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.max(1, parseInt(pageSize, 10) || 10);

  const searchTerm = search.trim().toLowerCase();

  const regionList = splitParam(region);
  const genderList = splitParam(gender);
  const categoryList = splitParam(category);
  const paymentList = splitParam(paymentMethod);
  const tagList = splitParam(tags);

  const minAgeNum = minAge ? Number(minAge) : null;
  const maxAgeNum = maxAge ? Number(maxAge) : null;

  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  const data = await loadSalesData();

  // 1) SEARCH + FILTERS
  let filtered = data.filter((row) => {
    // search: customer name OR phone
    if (searchTerm) {
      const name = (row.customerName || "").toLowerCase();
      const phone = (row.phoneNumber || "").toLowerCase();
      if (!name.includes(searchTerm) && !phone.includes(searchTerm)) {
        return false;
      }
    }

    // region
    if (regionList.length && !regionList.includes(row.customerRegion)) {
      return false;
    }

    // gender
    if (genderList.length && !genderList.includes(row.gender)) {
      return false;
    }

    // product category
    if (categoryList.length && !categoryList.includes(row.productCategory)) {
      return false;
    }

    // payment method
    if (paymentList.length && !paymentList.includes(row.paymentMethod)) {
      return false;
    }

    // tags (simple contains check)
    if (tagList.length) {
      const rowTags = (row.tags || "").toLowerCase();
      const hasOneTag = tagList.some((t) => rowTags.includes(t.toLowerCase()));
      if (!hasOneTag) {
        return false;
      }
    }

    // age range
    if (minAgeNum !== null && row.age !== null && row.age < minAgeNum) {
      return false;
    }
    if (maxAgeNum !== null && row.age !== null && row.age > maxAgeNum) {
      return false;
    }

    // date range
    if (startDateObj || endDateObj) {
      const d = new Date(row.date);
      if (startDateObj && d < startDateObj) return false;
      if (endDateObj && d > endDateObj) return false;
    }

    return true;
  });

  // 2) SORTING
  filtered.sort((a, b) => {
    let valA;
    let valB;

    switch (sortBy) {
      case "quantity":
        valA = a.quantity || 0;
        valB = b.quantity || 0;
        break;
      case "customer":
        valA = (a.customerName || "").toLowerCase();
        valB = (b.customerName || "").toLowerCase();
        break;
      case "date":
      default:
        valA = new Date(a.date);
        valB = new Date(b.date);
        break;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 3) PAGINATION
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / sizeNum));

  const startIndex = (pageNum - 1) * sizeNum;
  const endIndex = startIndex + sizeNum;

  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    page: pageNum,
    pageSize: sizeNum,
    totalItems,
    totalPages,
  };
}

/**
 * Helper: "a,b,c" -> ["a","b","c"]
 */
function splitParam(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
