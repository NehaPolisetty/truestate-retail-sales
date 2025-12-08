function SortDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="date">Date (Newest)</option>
      <option value="quantity">Quantity</option>
      <option value="customerName">Customer Name</option>
    </select>
  );
}

export default SortDropdown;
