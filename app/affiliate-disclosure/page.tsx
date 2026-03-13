import { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | SoleToolkit',
  description: 'How affiliate links work on SoleToolkit and how we stay independent.',
};

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      title="Affiliate Disclosure"
      lastUpdated="13 March 2026"
      intro="SoleToolkit is reader-supported and may earn commission from some links."
    >
      <h2>How affiliate links work</h2>
      <p>
        Some links on this website are affiliate links. If you click one and sign up or buy, we may receive a commission at no extra cost to you.
      </p>

      <h2>Editorial independence</h2>
      <p>
        Commission does not determine our rankings, scores, or conclusions. We aim to keep our reviews honest, useful, and independent.
      </p>

      <h2>Pricing and product changes</h2>
      <p>
        Product pricing and features can change. Always verify details on the provider website before purchasing.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about our disclosures, contact us via the contact details on this website.
      </p>
    </LegalPage>
  );
}
