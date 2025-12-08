function FiltersPanel({ region, gender, setRegion, setGender }) {
  const regions = ["North", "South", "East", "West", "Central"];
  const genders = ["Male", "Female"];

  const handleSelect = (e, setter) => {
    const values = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setter(values);
  };

  return (
    <div className="filters">
      <h3>Filters</h3>

      <label>
        Region
        <select
          multiple
          value={region}
          onChange={(e) => handleSelect(e, setRegion)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <label>
        Gender
        <select
          multiple
          value={gender}
          onChange={(e) => handleSelect(e, setGender)}
        >
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FiltersPanel;
