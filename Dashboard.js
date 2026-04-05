import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/applications")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>My Applications</h1>
      {data.map(item => (
        <div key={item._id}>
          <p>{item.name}</p>
          <p>Status: {item.status}</p>
          <p>Result: {item.result || "Pending"}</p>
        </div>
      ))}
    </div>
  );
}
