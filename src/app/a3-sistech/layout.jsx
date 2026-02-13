export default function Layout({ children }) {
  return (
    <div
      style={{
        padding: "40px",
        border: "5px solid red",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h2>🚀 A3 Layout Wrapper</h2>
      <hr style={{ marginBottom: "20px" }} />

      {children}
    </div>
  );
}