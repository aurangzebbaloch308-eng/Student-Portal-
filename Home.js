import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  const submit = async () => {
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    data.append("image", image);

    const res = await axios.post("http://localhost:5000/apply", data);
    alert("Submitted! PDF Generated");
    window.open("http://localhost:5000/" + res.data.pdf);
  };

  return (
    <div>
      <h1>Apply for Test</h1>

      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      
      <select onChange={(e)=>setForm({...form,class:e.target.value})}>
        <option>Class 6</option>
        <option>Class 7</option>
        <option>Class 8</option>
        <option>Class 9</option>
        <option>Class 10</option>
        <option>Class 11</option>
        <option>Class 12</option>
      </select>

      <input placeholder="City" onChange={(e)=>setForm({...form,city:e.target.value})}/>
      
      <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>

      <button onClick={submit}>Submit</button>
    </div>
  );
}
