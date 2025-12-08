// src/App.jsx
import { useEffect, useState, useMemo } from 'react';
import { fetchSales, getFilterOptionsFromItems } from './services/api';
import './styles/app.css';

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Date (Newest)' },
  { value: 'date_asc', label: 'Date (Oldest)' },
  { value: 'quantity_desc', label: 'Quantity (High → Low)' },
  { value: 'quantity_asc', label: 'Quantity (Low → High)' },
  { value: 'customer_asc', label: 'Customer (A–Z)' },
  { value: 'customer_desc', label: 'Customer (Z–A)' },
];

export default function App() {
  const [sales, setSales] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortValue, setSortValue] = useState('date_desc');

  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    category: [],
    paymentMethod: [],
  });

  const [filterOptions, setFilterOptions] = useState({
    region: [],
    gender: [],
    category: [],
    paymentMethod: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Map sortValue to backend sortBy/sortOrder
  const sortConfig = useMemo(() => {
    const [field, dir] = sortValue.split('_');
    switch (field) {
      case 'date':
        return { sortBy: 'date', sortOrder: dir === 'desc' ? 'desc' : 'asc' };
      case 'quantity':
        return { sortBy: 'quantity', sortOrder: dir };
      case 'customer':
        return { sortBy: 'customerName', sortOrder: dir };
      default:
        return { sortBy: 'date', sortOrder: 'desc' };
    }
  }, [sortValue]);

  // Fetch data whenever search / filters / sort / page changes
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const { items, totalItems, totalPages } = await fetchSales({
          page,
          pageSize: PAGE_SIZE,
          search,
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder,
          filters,
        });

        if (ignore) return;

        setSales(items);
        setTotalItems(totalItems);
        setTotalPages(totalPages || 1);

        // Only set filter options once (first time) if still empty
        setFilterOptions((prev) => {
          const alreadyHave =
            prev.region.length ||
            prev.gender.length ||
            prev.category.length ||
            prev.paymentMethod.length;

          if (alreadyHave) return prev;

          return getFilterOptionsFromItems(items);
        });
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load data');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page, search, sortConfig, filters]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page
  };

  const handleMultiSelectChange = (name, e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFilters((prev) => ({ ...prev, [name]: selected }));
    setPage(1);
  };

  const handlePrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="title">Retail Sales Management</h1>
      </header>

      <main className="content">
        <div className="top-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search customer name or phone"
            value={search}
            onChange={handleSearchChange}
          />

          <select
            className="sort-select"
            value={sortValue}
            onChange={(e) => {
              setSortValue(e.target.value);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <section className="layout">
          {/* FILTER PANEL */}
          <aside className="filters-card">
            <h2 className="filters-title">Filters</h2>

            <div className="filter-group">
              <label className="filter-label">Region</label>
              <select
                multiple
                className="filter-select"
                value={filters.region}
                onChange={(e) => handleMultiSelectChange('region', e)}
              >
                {filterOptions.region.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Gender</label>
              <select
                multiple
                className="filter-select"
                value={filters.gender}
                onChange={(e) => handleMultiSelectChange('gender', e)}
              >
                {filterOptions.gender.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Product Category</label>
              <select
                multiple
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleMultiSelectChange('category', e)}
              >
                {filterOptions.category.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Payment Method</label>
              <select
                multiple
                className="filter-select"
                value={filters.paymentMethod}
                onChange={(e) =>
                  handleMultiSelectChange('paymentMethod', e)
                }
              >
                {filterOptions.paymentMethod.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* TABLE AREA */}
          <section className="table-card">
            {loading ? (
              <div className="center-text">Loading...</div>
            ) : error ? (
              <div className="center-text error-text">
                {error}
              </div>
            ) : sales.length === 0 ? (
              <div className="center-text">No records found.</div>
            ) : (
              <>
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Region</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Final Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((row) => (
                      <tr key={row['Transaction ID']}>
                        <td>
                          {new Date(row.Date).toISOString().slice(0, 10)}
                        </td>
                        <td>{row['Customer Name']}</td>
                        <td>{row['Phone Number']}</td>
                        <td>{row['Customer Region']}</td>
                        <td>{row['Product Name']}</td>
                        <td>{row.Quantity}</td>
                        <td>{row['Final Amount']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <span className="page-info">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    className="pager-btn"
                    onClick={handlePrev}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="pager-btn"
                    onClick={handleNext}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
