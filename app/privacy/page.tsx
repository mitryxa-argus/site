'use client';

import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";

const PrivacyPolicy = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="Privacy Policy | Mitryxa"
        description="Mitryxa Labs LLC Privacy Policy — how we collect, use, and protect your personal information."
        canonical="https://mitryxa.com/privacy"
      />

      <div ref={ref} className="pt-16">
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-12 font-mono">Last updated: March 8, 2026</p>

            <div className="space-y-10 text-foreground/90 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Introduction</h2>
                <p>Mitryxa Labs LLC ("Mitryxa," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at mitryxa.com (the "Site") and use our AI decision platforms and related services (collectively, the "Services").</p>
                <p className="mt-3">By using our Site and Services, you consent to the data practices described in this Privacy Policy. If you do not agree with any part of this policy, please do not use our Site or Services.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Information We Collect</h2>
                <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide when you:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Fill out a contact form or request a consultation</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Interact with our AI decision platforms or Project Navigator</li>
                  <li>Communicate with us via our contact form or social media</li>
                  <li>Provide feedback or participate in surveys</li>
                </ul>
                <p className="mt-3">This information may include your name, email address, phone number, company name, industry, job title, and any other information you choose to provide.</p>

                <h3 className="text-base font-semibold text-foreground mt-4 mb-2">Automatically Collected Information</h3>
                <p>When you visit our Site, we automatically collect certain information, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>IP address, browser type, and operating system</li>
                  <li>Pages viewed, time spent on pages, and navigation paths</li>
                  <li>Referring website or source</li>
                  <li>Device information and screen resolution</li>
                  <li>Interaction data from our AI decision platforms (responses, completion rates, engagement metrics)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>To provide, maintain, and improve our Site and Services</li>
                  <li>To respond to your inquiries and fulfill your requests</li>
                  <li>To send you marketing communications (with your consent)</li>
                  <li>To personalize your experience on our Site</li>
                  <li>To analyze usage trends and improve our AI decision platforms</li>
                  <li>To generate lead intelligence reports for our clients</li>
                  <li>To detect, prevent, and address technical issues and security threats</li>
                  <li>To comply with legal obligations and enforce our terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Data Sharing and Disclosure</h2>
                <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li><strong>Service Providers:</strong> We share data with trusted third-party vendors who assist us in operating our Site and Services (e.g., hosting, analytics, email delivery).</li>
                  <li><strong>Client Platforms:</strong> When you interact with an AI decision platform built for a specific business, your responses and lead intelligence data may be shared with that business client.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or governmental authority.</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                  <li><strong>With Your Consent:</strong> We may share your information for other purposes with your explicit consent.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Cookies and Tracking Technologies</h2>
                <p>We use cookies, web beacons, and similar technologies to collect information about your browsing activity. These technologies help us:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you interact with our Site and platforms</li>
                  <li>Analyze traffic and measure the effectiveness of our marketing</li>
                  <li>Deliver relevant content and advertisements</li>
                </ul>
                <p className="mt-3">You can control cookies through your browser settings. Disabling cookies may affect the functionality of our Site.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS/SSL) and at rest, access controls, regular security assessments, and data isolation for client platforms. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Data Retention</h2>
                <p>We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Your Rights</h2>
                <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request that we delete your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Restriction:</strong> Request that we restrict processing of your data under certain circumstances</li>
                </ul>
                <p className="mt-3">To exercise any of these rights, please contact us through our <a href="/contact" className="text-primary hover:text-primary/80 transition-colors">contact form</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> California Privacy Rights (CCPA)</h2>
                <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your information, and the right to opt out of the sale of your information. As stated above, we do not sell personal information.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Children's Privacy</h2>
                <p>Our Site and Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Third-Party Links</h2>
                <p>Our Site may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our Site with a revised "Last updated" date. Your continued use of our Site and Services after any changes constitutes your acceptance of the updated policy.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Contact Us</h2>
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="glass-terminal rounded-xl p-6 mt-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary" />
                  <p className="font-mono text-sm"><strong>Mitryxa Labs LLC</strong></p>
                  <p className="text-muted-foreground text-sm mt-1">Los Angeles, California</p>
                  <p className="text-muted-foreground text-sm mt-1">Contact us via our <a href="/contact" className="text-primary hover:text-primary/80 transition-colors">contact form</a>.</p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;
