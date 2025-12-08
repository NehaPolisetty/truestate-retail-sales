function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      placeholder="Search customer name or phone"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;
