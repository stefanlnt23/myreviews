import { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | SoleToolkit',
  description: 'How SoleToolkit collects, stores, and uses personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="13 March 2026"
      intro="This policy explains what data we collect, why we collect it, and your rights under UK GDPR and data protection law."
    >
      <h2>Who we are</h2>
      <p>
        SoleToolkit publishes independent software reviews for UK sole traders and small service businesses.
      </p>

      <h2>What data we collect</h2>
      <ul>
        <li>Basic analytics data such as page views and device/browser information.</li>
        <li>Voluntary contact data you send us by email.</li>
        <li>Technical logs used for security, performance, and fraud prevention.</li>
      </ul>

      <h2>How we use your data</h2>
      <ul>
        <li>To run and improve the website.</li>
        <li>To respond to enquiries.</li>
        <li>To detect abuse and keep the site secure.</li>
      </ul>

      <h2>Legal basis</h2>
      <p>
        We process data under legitimate interests (site operation, security, and improvement) and consent where required.
      </p>

      <h2>Data sharing</h2>
      <p>
        We use third-party providers for hosting and analytics. We do not sell your personal data.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep personal data only as long as needed for the purposes listed above, then delete or anonymise it.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access, correction, deletion, restriction, portability, and objection to processing, subject to legal limits.
      </p>

      <h2>Contact</h2>
      <p>
        For data-related questions, contact us via the contact details listed on this site.
      </p>
    </LegalPage>
  );
}
