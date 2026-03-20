'use client';

import { useScrollReveal } from "@/hooks/useScrollReveal";
import SEOHead from "@/components/seo/SEOHead";

const TermsOfService = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="Terms of Service | Mitryxa"
        description="Mitryxa Labs LLC Terms of Service — the terms and conditions governing your use of our website and services."
        canonical="https://mitryxa.com/terms"
      />

      <div ref={ref} className="pt-16">
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 font-mono">&gt;_ Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-12 font-mono">Last updated: March 8, 2026</p>

            <div className="space-y-10 text-foreground/90 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Agreement to Terms</h2>
                <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("you" or "User") and Mitryxa Labs LLC ("Mitryxa," "we," "us," or "our"), governing your access to and use of the website located at mitryxa.com (the "Site") and all related services, platforms, tools, and content (collectively, the "Services").</p>
                <p className="mt-3">By accessing or using our Site and Services, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use our Site or Services.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Description of Services</h2>
                <p>Mitryxa provides AI-powered decision platforms and interactive client acquisition systems for professional service businesses. Our Services include:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>AI decision platform design, development, and deployment</li>
                  <li>Interactive lead qualification and routing systems</li>
                  <li>Decision calculators and educational client platforms</li>
                  <li>Lead intelligence reporting and analytics</li>
                  <li>The Project Intelligence Navigator tool</li>
                  <li>Consulting and strategy services related to the above</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Eligibility</h2>
                <p>You must be at least 18 years of age and have the legal capacity to enter into a binding agreement to use our Services. By using our Site and Services, you represent and warrant that you meet these requirements. If you are using our Services on behalf of a business entity, you represent that you have the authority to bind that entity to these Terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> User Conduct</h2>
                <p>You agree not to use our Site or Services to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Violate any applicable local, state, national, or international law or regulation</li>
                  <li>Infringe upon or violate the intellectual property rights of Mitryxa or any third party</li>
                  <li>Transmit any malicious code, viruses, or harmful software</li>
                  <li>Attempt to gain unauthorized access to our systems, networks, or data</li>
                  <li>Interfere with or disrupt the integrity or performance of our Services</li>
                  <li>Collect or harvest personal information of other users without consent</li>
                  <li>Use automated systems (bots, scrapers) to access our Services without our written permission</li>
                  <li>Submit false, misleading, or fraudulent information</li>
                  <li>Use our Services for any purpose that is harmful, deceptive, or unethical</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Intellectual Property</h2>
                <p>All content, features, and functionality of our Site and Services — including but not limited to text, graphics, logos, icons, images, audio clips, software, decision flow designs, platform architectures, and AI models — are the exclusive property of Mitryxa Labs LLC or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                <p className="mt-3">You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Site without our prior written consent, except as follows:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Your browser may temporarily store copies of materials for display purposes</li>
                  <li>You may print or download one copy of a reasonable number of pages for personal, non-commercial use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Client Platform Terms</h2>
                <p>If you engage Mitryxa to build a custom AI decision platform for your business:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Project scope, deliverables, timelines, and fees will be outlined in a separate Statement of Work (SOW) or Service Agreement</li>
                  <li>You retain ownership of your business data and content provided to us</li>
                  <li>Mitryxa retains ownership of the underlying platform technology, frameworks, and proprietary decision engine architectures</li>
                  <li>You receive a license to use the completed platform as specified in your Service Agreement</li>
                  <li>You are responsible for the accuracy of information you provide for platform configuration</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Data and Privacy</h2>
                <p>Your use of our Services is also governed by our <a href="/privacy" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</a>, which is incorporated into these Terms by reference. By using our Services, you consent to the collection and use of information as described in our Privacy Policy.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Disclaimers</h2>
                <p>OUR SITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                <p className="mt-3">We do not warrant that:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Our Services will be uninterrupted, timely, secure, or error-free</li>
                  <li>The results obtained from the use of our Services will be accurate or reliable</li>
                  <li>Any errors in our Services will be corrected</li>
                  <li>Our AI decision platforms will generate any specific business outcomes, conversion rates, or lead qualification results</li>
                </ul>
                <p className="mt-3">Any statistics, metrics, or case study results presented on our Site represent past performance and do not guarantee future results.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Limitation of Liability</h2>
                <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MITRYXA LABS LLC, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Your access to or use of (or inability to access or use) our Services</li>
                  <li>Any conduct or content of any third party on our Services</li>
                  <li>Any content obtained from our Services</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
                <p className="mt-3">Our total liability to you for any claims arising from or related to these Terms or your use of our Services shall not exceed the greater of $100 or the amount you have paid us in the twelve (12) months preceding the claim.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Indemnification</h2>
                <p>You agree to defend, indemnify, and hold harmless Mitryxa Labs LLC and its officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of our Services.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Governing Law and Jurisdiction</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in Los Angeles County, California, and you hereby consent to the personal jurisdiction and venue of such courts.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Modifications to Terms</h2>
                <p>We reserve the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last updated" date at the top of this page. Your continued use of our Site and Services after any modifications constitute your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Severability</h2>
                <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Entire Agreement</h2>
                <p>These Terms, together with our Privacy Policy and any separate Service Agreements or Statements of Work, constitute the entire agreement between you and Mitryxa Labs LLC regarding the use of our Site and Services, and supersede all prior and contemporaneous understandings, agreements, representations, and warranties.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3 font-mono"><span className="text-primary/50">&gt;_</span> Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us:</p>
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

export default TermsOfService;
