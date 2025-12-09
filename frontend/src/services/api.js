// src/services/api.js

const API_BASE_URL = "https://truestate-retail-sales-2.onrender.com/api";


/**
 * Build query string and call the backend.
 * Backend: GET /api/sales
 */
export async function fetchSales({
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'date',
  sortOrder = 'desc',
  filters = {},
} = {}) {
  const params = new URLSearchParams();

  params.set('page', page);
  params.set('pageSize', pageSize);
  params.set('sortBy', sortBy);
  params.set('sortOrder', sortOrder);

  if (search.trim()) {
    params.set('search', search.trim());
  }

  // Multi-select filters – we join them with commas
  if (filters.region && filters.region.length) {
    params.set('region', filters.region.join(','));
  }
  if (filters.gender && filters.gender.length) {
    params.set('gender', filters.gender.join(','));
  }
  if (filters.category && filters.category.length) {
    params.set('category', filters.category.join(','));
  }
  if (filters.tags && filters.tags.length) {
    params.set('tags', filters.tags.join(','));
  }
  if (filters.paymentMethod && filters.paymentMethod.length) {
    params.set('paymentMethod', filters.paymentMethod.join(','));
  }

  // Range filters
  if (filters.ageMin != null && filters.ageMin !== '') {
    params.set('ageMin', filters.ageMin);
  }
  if (filters.ageMax != null && filters.ageMax !== '') {
    params.set('ageMax', filters.ageMax);
  }
  if (filters.startDate) {
    params.set('startDate', filters.startDate);
  }
  if (filters.endDate) {
    params.set('endDate', filters.endDate);
  }

  const url = `${API_BASE_URL}/sales?${params.toString()}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }

    const data = await res.json();

    // Normalise shape – in your API we know there is items[]
    const items = data.items || [];
    const totalItems =
      data.totalItems != null
        ? data.totalItems
        : items.length;

    const pageSizeUsed = pageSize || 10;
    const totalPages =
      data.totalPages != null
        ? data.totalPages
        : Math.max(1, Math.ceil(totalItems / pageSizeUsed));

    return {
      items,
      totalItems,
      totalPages,
    };
  } catch (err) {
    console.error('Failed to fetch sales:', err);
    throw err;
  }
}

/**
 * Optional: get distinct filter values from the first page of data
 * (region, gender, etc.)
 */
export function getFilterOptionsFromItems(items) {
  const sets = {
    region: new Set(),
    gender: new Set(),
    category: new Set(),
    paymentMethod: new Set(),
  };

  items.forEach((item) => {
    if (item['Customer Region']) sets.region.add(item['Customer Region']);
    if (item['Gender']) sets.gender.add(item['Gender']);
    if (item['Product Category']) sets.category.add(item['Product Category']);
    if (item['Payment Method']) sets.paymentMethod.add(item['Payment Method']);
  });

  return {
    region: Array.from(sets.region).sort(),
    gender: Array.from(sets.gender).sort(),
    category: Array.from(sets.category).sort(),
    paymentMethod: Array.from(sets.paymentMethod).sort(),
  };
}
