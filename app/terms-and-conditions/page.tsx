import { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms and Conditions | SoleToolkit',
  description: 'Terms for using the SoleToolkit website.',
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      lastUpdated="13 March 2026"
      intro="By using SoleToolkit, you agree to the terms below."
    >
      <h2>Website use</h2>
      <p>
        You may use this website for personal and business research. You must not misuse the website, interfere with operations, or attempt unauthorised access.
      </p>

      <h2>Content and editorial policy</h2>
      <p>
        Our reviews are opinion-based editorial content intended for informational purposes. You should carry out your own due diligence before purchasing software.
      </p>

      <h2>No professional advice</h2>
      <p>
        Content on this site does not constitute legal, tax, accounting, or financial advice.
      </p>

      <h2>External links</h2>
      <p>
        We may link to third-party websites. We are not responsible for third-party content, pricing, uptime, or changes.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent permitted by law, SoleToolkit excludes liability for loss arising from use of this website.
      </p>

      <h2>Changes to terms</h2>
      <p>
        We may update these terms at any time by publishing a revised version on this page.
      </p>
    </LegalPage>
  );
}
