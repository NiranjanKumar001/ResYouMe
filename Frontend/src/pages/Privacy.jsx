// Privacy.jsx
export default function Privacy() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4">Privacy Policy</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Processing Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Collected Directly</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Resume content</li>
              <li>Payment details</li>
              <li>User preferences</li>
            </ul>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Automated Collection</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Usage metrics</li>
              <li>Device fingerprints</li>
              <li>IP geolocation</li>
            </ul>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Third-Party Sources</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>LinkedIn API</li>
              <li>Google Workspace</li>
              <li>OAuth providers</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Flow Architecture</h2>
        <div className="space-y-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Storage Locations</h3>
            <ul className="list-disc pl-6">
              <li>Primary: AWS Frankfurt (eu-central-1)</li>
              <li>Backup: Google Cloud Stockholm (europe-north1)</li>
            </ul>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Encryption Standards</h3>
            <ul className="list-disc pl-6">
              <li>Data at rest: AES-256</li>
              <li>Data in transit: TLS 1.3+</li>
              <li>Key management: AWS KMS with HSM</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Third-Party Processors</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Processor</th>
                <th className="text-left py-3 px-4">Purpose</th>
                <th className="text-left py-3 px-4">Data Shared</th>
                <th className="text-left py-3 px-4">Compliance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Stripe</td>
                <td className="py-3 px-4">Payment processing</td>
                <td className="py-3 px-4">Billing details</td>
                <td className="py-3 px-4">PCI DSS Level 1</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">SendGrid</td>
                <td className="py-3 px-4">Transactional emails</td>
                <td className="py-3 px-4">Email addresses</td>
                <td className="py-3 px-4">SOC 2 Type II</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm">Complete list available in our DPA[4][9].</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">User Rights Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Access & Portability</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>JSON export of all stored data</li>
              <li>PDF report generation</li>
              <li>API access for automated requests</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Deletion Workflow</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immediate account deactivation</li>
              <li>30-day soft deletion period</li>
              <li>Cryptographic shredding after 90 days</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
