export default function FileUpload({ onUpload }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData
    });
    
    const data = await res.json();
    console.log(data);
    onUpload();
  };

  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <h3>Upload a PDF</h3>
      <input type="file" accept=".pdf" onChange={handleUpload} />
    </div>
  );
}
