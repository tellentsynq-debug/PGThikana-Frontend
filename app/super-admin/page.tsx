export default function Page() {
  return (
    <div
      style={{
        marginLeft: "60px", // ✅ sidebar collapsed width
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        backgroundColor:"white",
        minHeight: "100vh", // better than height: 100%
        transition: "0.3s"
      }}
    >
      <h2>Dashboard Content</h2>
    </div>
  );
}