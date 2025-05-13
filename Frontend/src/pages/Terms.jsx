// Terms.jsx
export default function Terms() {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4">Terms of Service for resYOUme</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Contractual Relationship</h2>
        <p className="mb-4">These Terms of Service ("Terms") govern your access to and use of resYOUme's website, services, and applications (collectively "Service")[1][8]. By using the Service, you agree to be bound by these Terms and our Privacy Policy[3][9].</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Service Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Included Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automated portfolio generation from resume data</li>
              <li>Multi-template system with customization options</li>
              <li>Cloud hosting with 99.9% uptime SLA[2]</li>
              <li>API access for enterprise users</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-2">Restrictions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>No reverse engineering of template systems</li>
              <li>Prohibition on bulk account creation</li>
              <li>Commercial use requires enterprise plan</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Account Security</h3>
            <p>Users must maintain confidentiality of credentials and immediately notify us of unauthorized access[7][8].</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Content Guidelines</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prohibited content includes:
                <ul className="list-circle pl-6 mt-2">
                  <li>Malware/phishing components</li>
                  <li>Copyrighted material without authorization</li>
                  <li>Personally Identifiable Information (PII) of third parties</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Plan Type</th>
                <th className="text-left py-3 px-4">Billing Cycle</th>
                <th className="text-left py-3 px-4">Grace Period</th>
                <th className="text-left py-3 px-4">Chargeback Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Basic</td>
                <td className="py-3 px-4">Monthly</td>
                <td className="py-3 px-4">7 days</td>
                <td className="py-3 px-4">$50</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Pro</td>
                <td className="py-3 px-4">Annual</td>
                <td className="py-3 px-4">14 days</td>
                <td className="py-3 px-4">$100</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm">All prices exclude VAT/GST. Enterprise plans require custom MSA[2][8].</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Termination & Suspension</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">User-Initiated</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>30-day notice for enterprise contracts</li>
              <li>Immediate termination for individual plans</li>
              <li>Data export available for 90 days post-termination</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Company Rights</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immediate suspension for TOS violations</li>
              <li>30-day remediation period for SLA breaches</li>
              <li>Permanent ban for repeat offenders</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. International Compliance</h2>
        <div className="space-y-4">
          <p>Our Service adheres to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>GDPR (EU 2016/679)</li>
            <li>CCPA (California Civil Code §1798.100)</li>
            <li>PIPEDA (Canada)</li>
            <li>APP (Australia Privacy Principles)</li>
          </ul>
          <p>Data processing agreements available upon request[4][6][9].</p>
        </div>
      </section>
    </div>
  );
}
