// Cookies.jsx
export default function Cookies() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4">Cookie Policy</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cookie Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Cookie Name</th>
                <th className="text-left py-3 px-4">Purpose</th>
                <th className="text-left py-3 px-4">Duration</th>
                <th className="text-left py-3 px-4">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono">session_id</td>
                <td className="py-3 px-4">Authentication token</td>
                <td className="py-3 px-4">Browser session</td>
                <td className="py-3 px-4">Essential</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-mono">_ga</td>
                <td className="py-3 px-4">Google Analytics</td>
                <td className="py-3 px-4">2 years</td>
                <td className="py-3 px-4">Analytical</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm">Full cookie declaration updated quarterly[5][10].</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Consent Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Opt-In Mechanisms</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Granular category selection</li>
              <li>Preference center dashboard</li>
              <li>API endpoints for programmatic control</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Compliance Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IAB TCF 2.2 support</li>
              <li>Automated DNSS requests</li>
              <li>Consent receipt generation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Technical Implementation</h2>
        <div className="space-y-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Cookie Consent API</h3>
            <pre className="bg-gray-100 p-4 rounded">
              {`fetch('/api/consent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    essential: true,
    analytics: false,
    marketing: false
  })
})`}
            </pre>
          </div>

          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Header Configuration</h3>
            <pre className="bg-gray-100 p-4 rounded">
              {`Permissions-Policy: interest-cohort=()\n`}
              {`Set-Cookie: session_id=abc123; SameSite=Lax; Secure; HttpOnly`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}