function SalesTable({ rows }) {
  return (
    <table className="table">
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
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.Date?.split("T")[0]}</td>
            <td>{r["Customer Name"]}</td>
            <td>{r["Phone Number"]}</td>
            <td>{r["Customer Region"]}</td>
            <td>{r["Product Name"]}</td>
            <td>{r.Quantity}</td>
            <td>{r["Final Amount"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SalesTable;
