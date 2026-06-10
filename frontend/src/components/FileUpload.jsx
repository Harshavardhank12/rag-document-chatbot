export default function FileUpload({ onUpload }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData
    });
    onUpload();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Upload a PDF</h3>
      <input type="file" accept=".pdf" onChange={handleUpload} />
    </div>
  );
}
