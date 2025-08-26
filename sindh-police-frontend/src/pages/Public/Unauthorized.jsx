export default function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <h1>401 - Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <a href="/">Return to Home</a>
    </div>
  );
}