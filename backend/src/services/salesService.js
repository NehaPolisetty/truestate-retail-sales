// backend/src/services/salesService.js

const { loadSalesData } = require('../utils/dataLoader');

// In–memory cache so we don’t keep re-reading the CSV / remote dataset
let salesCache = [];
let isLoaded = false;

/**
 * Ensure data is loaded exactly once.
 */
async function ensureDataLoaded() {
  if (!isLoaded) {
    salesCache = await loadSalesData();
    isLoaded = true;
  }
}

/**
 * Turn querystring values into an array.
 * Supports:
 *   region=East,West  OR  region=East&region=West
 */
function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

/**
 * Parse query params and give back a normalized filter object.
 */
function parseFilters(query = {}) {
  const page = Number.parseInt(query.page, 10) || 1;
  const pageSize = Number.parseInt(query.pageSize, 10) || 10;

  return {
    search: (query.search || '').trim().toLowerCase(),

    regions: toArray(query.region),
    genders: toArray(query.gender),
    categories: toArray(query.category),
    paymentMethods: toArray(query.paymentMethod),
    tags: toArray(query.tags),

    // Optional numeric range
    minAge: query.minAge ? Number(query.minAge) : null,
    maxAge: query.maxAge ? Number(query.maxAge) : null,

    // Optional date range (ISO string: 2023-09-01)
    dateFrom: query.dateFrom ? new Date(query.dateFrom) : null,
    dateTo: query.dateTo ? new Date(query.dateTo) : null,

    sortBy: query.sortBy || 'date',        // 'date' | 'quantity' | 'customer'
    sortOrder: query.sortOrder || 'desc',  // 'asc' | 'desc'
    page: page < 1 ? 1 : page,
    pageSize: pageSize > 0 ? pageSize : 10,
  };
}

/**
 * Apply search + filter conditions on the dataset.
 */
function applySearchAndFilters(data, filters) {
  const {
    search,
    regions,
    genders,
    categories,
    paymentMethods,
    tags,
    minAge,
    maxAge,
    dateFrom,
    dateTo,
  } = filters;

  return data.filter(row => {
    // --- Search (customer name / phone, case-insensitive) ---
    if (search) {
      const name = String(row['Customer Name'] || '').toLowerCase();
      const phone = String(row['Phone Number'] || '').toLowerCase();

      if (!name.includes(search) && !phone.includes(search)) {
        return false;
      }
    }

    // --- Region filter (multi-select) ---
    if (regions.length && !regions.includes(row['Customer Region'])) {
      return false;
    }

    // --- Gender filter (multi-select) ---
    if (genders.length && !genders.includes(row['Gender'])) {
      return false;
    }

    // --- Product category ---
    if (categories.length && !categories.includes(row['Product Category'])) {
      return false;
    }

    // --- Payment method ---
    if (paymentMethods.length && !paymentMethods.includes(row['Payment Method'])) {
      return false;
    }

    // --- Tags (at least one must match) ---
    if (tags.length) {
      const rowTags = String(row['Tags'] || '')
        .split('|')
        .map(t => t.trim())
        .filter(Boolean);

      const hasAnyTag = tags.some(tag => rowTags.includes(tag));
      if (!hasAnyTag) return false;
    }

    // --- Age range ---
    if (minAge !== null || maxAge !== null) {
      const age = Number(row['Age']);
      if (Number.isFinite(age)) {
        if (minAge !== null && age < minAge) return false;
        if (maxAge !== null && age > maxAge) return false;
      }
    }

    // --- Date range ---
    if (dateFrom || dateTo) {
      const rowDate = new Date(row['Date']);
      if (Number.isNaN(rowDate.getTime())) {
        return false;
      }
      if (dateFrom && rowDate < dateFrom) return false;
      if (dateTo && rowDate > dateTo) return false;
    }

    return true;
  });
}

/**
 * Sort the filtered data based on sortBy + sortOrder.
 */
function applySorting(data, filters) {
  const { sortBy, sortOrder } = filters;
  const dir = sortOrder === 'asc' ? 1 : -1;

  const sorted = [...data];

  sorted.sort((a, b) => {
    let cmp = 0;

    if (sortBy === 'quantity') {
      const qa = Number(a['Quantity']) || 0;
      const qb = Number(b['Quantity']) || 0;
      cmp = qa - qb;
    } else if (sortBy === 'customer') {
      const na = String(a['Customer Name'] || '');
      const nb = String(b['Customer Name'] || '');
      cmp = na.localeCompare(nb);
    } else {
      // default: date (newest first)
      const da = new Date(a['Date']);
      const db = new Date(b['Date']);
      cmp = da - db;
    }

    return cmp * dir;
  });

  return sorted;
}

/**
 * Build unique option lists for filter dropdowns.
 * (Uses the full dataset, not just filtered items.)
 */
function buildFilterOptions(data) {
  const unique = key =>
    [...new Set(data.map(row => row[key]).filter(Boolean))].sort();

  return {
    regions: unique('Customer Region'),
    genders: unique('Gender'),
    categories: unique('Product Category'),
    paymentMethods: unique('Payment Method'),
    tags: unique('Tags'),
  };
}

/**
 * Main service function called by the controller.
 * Returns paginated + filtered sales plus metadata.
 */
async function getSales(query) {
  await ensureDataLoaded();

  const filters = parseFilters(query);

  // 1. Search + filter
  const filtered = applySearchAndFilters(salesCache, filters);

  // 2. Sorting
  const sorted = applySorting(filtered, filters);

  // 3. Pagination
  const { pageSize } = filters;
  let { page } = filters;

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (page > totalPages) page = totalPages;

  const startIndex = (page - 1) * pageSize;
  const items = sorted.slice(startIndex, startIndex + pageSize);

  // 4. Filter options for the UI
  const filterOptions = buildFilterOptions(salesCache);

  return {
    items,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    filters: filterOptions,
  };
}

module.exports = {
  getSales,
};
