import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen">
      <Header />
      
      <article className="container mx-auto px-4 py-24 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-smooth mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last Updated: 10/21/25</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <p>
            This Privacy Policy applies to the website located at <a href="https://www.altitudelogicpressure.com" className="text-primary">www.altitudelogicpressure.com</a> (the "Site") and any related services provided by Altitude Logic Pressure ("we," "us," or "our"). By accessing or using the Site, you agree to this Privacy Policy.
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We may collect the following types of information when you use the Site:</p>
            <p className="mb-2"><strong>Personal Information You Provide.</strong> Such as your name, email address, phone number, postal address, payment information (if applicable), contact form inputs, etc.</p>
            <p className="mb-2"><strong>Automatically Collected Information.</strong> Including your IP address, browser type and version, operating system, device identifiers, pages visited, time spent on pages, referring URLs, location data (if enabled), cookies and similar tracking technologies.</p>
            <p><strong>Third-Party Data.</strong> Information we obtain from third-party sources (e.g., analytics providers, advertising networks) in accordance with their terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect for purposes such as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing, maintaining and improving the Site and our services.</li>
              <li>Communicating with you (e.g., responding to your inquiries, sending updates or marketing materials if you opt in).</li>
              <li>Personalizing your experience on the Site.</li>
              <li>Detecting and preventing fraud, abuse or other potentially illegal or harmful activity.</li>
              <li>Complying with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Sharing of Your Information</h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With service providers and contractors who assist us (e.g., hosting, analytics, email communication).</li>
              <li>With third parties if required by law or to respond to legal process (e.g., subpoenas).</li>
              <li>In connection with a corporate transaction (e.g., sale, merger, reorganization) where your information may be one of the transferred assets.</li>
              <li>With your consent or as otherwise disclosed at the time of collection.</li>
            </ul>
            <p className="mt-4">We do not sell your personal information to third parties for their marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Cookies, Tracking & Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies (e.g., web beacons, pixels) to collect information about your interaction with the Site, to remember your preferences, to analyze Site usage, and to support advertising and remarketing efforts. You may control or disable cookies through your browser settings, but doing so may affect your ability to use parts of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. When information is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="mb-4">Depending on your jurisdiction, you may have rights such as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access the personal information we hold about you.</li>
              <li>The right to request correction or deletion of your information.</li>
              <li>The right to restrict or object to certain processing of your information.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent where we rely on it.</li>
            </ul>
            <p className="mt-4">To exercise these rights or for other privacy questions, please contact us as set out below.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration or destruction. However, no website, transmission or system is completely secure; we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <p>
              The Site is not directed to children under the age of 16 (or your local applicable age of digital majority). We do not knowingly collect personal information from children under that age. If you believe we have inadvertently collected such information, please contact us and we will delete the data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own, where data protection laws may differ. By using the Site, you consent to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the updated version on the Site and revise the "Last Updated" date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <p className="mt-4">
              <strong>Altitude Logic Pressure</strong><br />
              <a href="mailto:info@altitudelogicpressure.com" className="text-primary">info@altitudelogicpressure.com</a>
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
