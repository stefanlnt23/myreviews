import { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = {
  title: 'Cookie Policy | SoleToolkit',
  description: 'How SoleToolkit uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="13 March 2026"
      intro="This page explains the cookies and similar technologies used on SoleToolkit."
    >
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website.
      </p>

      <h2>How we use cookies</h2>
      <ul>
        <li>Essential cookies for site functionality and security.</li>
        <li>Analytics cookies to understand traffic and improve content.</li>
        <li>Attribution cookies to measure affiliate link performance.</li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can control and delete cookies in your browser settings. Blocking some cookies may affect site performance.
      </p>

      <h2>Third-party cookies</h2>
      <p>
        Some third-party services we use may place their own cookies, subject to their own privacy policies.
      </p>
    </LegalPage>
  );
}
