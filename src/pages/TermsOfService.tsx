import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last Updated: 10/21/25</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <p>
            Welcome to <a href="https://www.altitudelogicpressure.com" className="text-primary">www.altitudelogicpressure.com</a> (the "Site"). These Terms of Service ("Terms") govern your access to and use of the Site and any related services or content offered by Altitude Logic Pressure ("we," "us," or "our"). By accessing or using the Site, you agree to be bound by these Terms.
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              You acknowledge that you have read, understood, and agree to be bound by these Terms, in addition to our Privacy Policy. If you do not agree to these Terms, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time by posting updated Terms on the Site. Your continued use of the Site after such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Use of the Site</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to use the Site only for lawful purposes and in a manner consistent with these Terms.</li>
              <li>You will not engage in any conduct that could damage, disable, overburden or impair the Site.</li>
              <li>You shall not attempt to gain unauthorized access to any part of the Site, other users' accounts, or our systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Site and its contents (including text, graphics, logos, images, audio/video clips, software) are owned by or licensed to Altitude Logic Pressure and are protected by intellectual property laws.</li>
              <li>You may view, download, and print content for your personal, non-commercial use only, provided you keep intact all copyright and other proprietary notices.</li>
              <li>You shall not reproduce, distribute, publicly display, or create derivative works from the Site content without our prior written consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. User Content</h2>
            <p>
              If you submit any content to the Site (e.g., comments, feedback, forms) you grant us a non-exclusive, royalty-free, worldwide, perpetual licence to use, reproduce, adapt, publish and display such content for our business purposes. You represent and warrant that you own or have the right to grant such rights, and that your content will not violate any third-party rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Third-Party Links & Services</h2>
            <p>
              The Site may include links to third-party websites, services or resources that we do not control. We are not responsible for the content or practices of such third-parties. Your use of any third-party site is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Disclaimer of Warranties</h2>
            <p>
              The Site is provided on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permitted by law, we disclaim all warranties, whether express or implied, including merchantability, fitness for a particular purpose, title and non-infringement. We do not guarantee the accuracy, completeness or reliability of the Site or its content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Altitude Logic Pressure, its officers, directors, employees, agents or affiliates be liable for any indirect, incidental, special, consequential or punitive damages arising out of or related to your access to or use of the Site, even if we have been advised of the possibility of such damages. Our total liability to you for any claim arising out of or related to these Terms or the Site shall not exceed the greater of (i) the amount you paid us (if any) in the last 12 months, or (ii) USD 100.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend and hold harmless Altitude Logic Pressure and its affiliates, and their officers, directors, employees, agents and licensors, from and against any claim, liability, damages, losses or expenses (including legal fees) arising out of or in connection with your use of the Site, your content, or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Arizona, without regard to its conflict of laws provisions. Any dispute arising from or related to these Terms or the Site shall be resolved exclusively in the state or federal courts located in Arizona.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your access to the Site at any time, with or without cause, and without prior notice. Upon termination, the provisions of Sections 4 (Intellectual Property), 7 (Disclaimer), 8 (Limitation of Liability), 9 (Indemnification), 10 (Governing Law) and any other provision that by its nature should survive termination shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Severability</h2>
            <p>
              If any provision of these Terms is held invalid or unenforceable, that provision shall be deemed modified to the extent necessary and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Waiver</h2>
            <p>
              Our failure to enforce any right or provision under these Terms shall not constitute a waiver of future enforcement of that right or provision.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Entire Agreement</h2>
            <p>
              These Terms (and our Privacy Policy) constitute the entire agreement between you and Altitude Logic Pressure regarding your use of the Site, superseding any prior agreements between you and us relating to the subject matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
            <p>For questions about these Terms, please contact:</p>
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

export default TermsOfService;
