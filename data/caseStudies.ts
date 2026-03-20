// Portfolio images
const legalHero = '/assets/portfolio/legal-hero.jpg';
const legalCarAccident = '/assets/portfolio/legal-car-accident.jpg';
const legalOffice = '/assets/portfolio/legal-office.jpg';
const legalSkyline = '/assets/portfolio/legal-skyline.jpg';

const medicalReception = '/assets/portfolio/medical-reception.jpg';
const medicalDiagnostic = '/assets/portfolio/medical-diagnostic.jpg';
const medicalSkyline = '/assets/portfolio/medical-skyline.jpg';
const medicalCardiovascular = '/assets/portfolio/medical-cardiovascular.jpg';

const realestateHero = '/assets/portfolio/realestate-hero.jpg';
const realestateInterior = '/assets/portfolio/realestate-interior.jpg';
const realestateAerial = '/assets/portfolio/realestate-aerial.jpg';
const realestateCondo = '/assets/portfolio/realestate-condo.jpg';

const wealthSkyline = '/assets/portfolio/wealth-skyline.jpg';
const wealthMeeting = '/assets/portfolio/wealth-meeting.jpg';
const wealthData = '/assets/portfolio/wealth-data.jpg';

const cosmeticHero = '/assets/portfolio/cosmetic-hero.jpg';
const cosmeticInterior = '/assets/portfolio/cosmetic-interior.jpg';
const cosmeticTreatment = '/assets/portfolio/cosmetic-treatment.jpg';
const cosmeticDoctor = '/assets/portfolio/cosmetic-doctor.jpg';

const homehealthHero = '/assets/portfolio/homehealth-hero.jpg';
const homehealthAssessment = '/assets/portfolio/homehealth-assessment.jpg';
const homehealthTherapy = '/assets/portfolio/homehealth-therapy.jpg';

const globalflowHero = '/assets/portfolio/globalflow-hero.jpg';
const globalflowNetwork = '/assets/portfolio/globalflow-network.jpg';
const globalflowArchitecture = '/assets/portfolio/globalflow-architecture.jpg';
const globalflowSecurity = '/assets/portfolio/globalflow-security.jpg';

const aureliaHero = '/assets/portfolio/aurelia-hero.jpg';
const aureliaCraftsmanship = '/assets/portfolio/aurelia-craftsmanship.jpg';
const aureliaEngagement = '/assets/portfolio/aurelia-engagement.jpg';
const aureliaBespoke = '/assets/portfolio/aurelia-bespoke.jpg';

const weldingHero = '/assets/portfolio/welding-hero.jpg';
const weldingPrecision = '/assets/portfolio/welding-precision.jpg';
const weldingFacility = '/assets/portfolio/welding-facility.jpg';
const weldingProject = '/assets/portfolio/welding-project.jpg';

const blackwingHero = '/assets/portfolio/blackwing-hero.jpg';
const blackwingRates = '/assets/portfolio/blackwing-rates.jpg';
const blackwingClosing = '/assets/portfolio/blackwing-closing.jpg';

const kaprielleHero = '/assets/portfolio/kaprielle-hero.jpg';
const kaprielleProducts = '/assets/portfolio/kaprielle-products.jpg';
const kaprielleCraft = '/assets/portfolio/kaprielle-craft.jpg';
const kaprielleStore = '/assets/portfolio/kaprielle-store.jpg';

const ericfilmHero = '/assets/portfolio/ericfilm-hero.jpg';
const ericfilmEditing = '/assets/portfolio/ericfilm-editing.jpg';
const ericfilmVenue = '/assets/portfolio/ericfilm-venue.jpg';
const ericfilmGear = '/assets/portfolio/ericfilm-gear.jpg';

const healingritualsHero = '/assets/portfolio/healingrituals-hero.jpg';
const healingritualsAcupuncture = '/assets/portfolio/healingrituals-acupuncture.jpg';
const healingritualsSoundtherapy = '/assets/portfolio/healingrituals-soundtherapy.jpg';
const healingritualsChakra = '/assets/portfolio/healingrituals-chakra.jpg';

export interface CaseStudy {
  slug: string;
  platformId: string;
  title: string;
  client: string;
  industry: string;
  tagline: string;
  heroImage: string;
  challenge: string;
  solution: string;
  description: string;
  features: string[];
  results: { label: string; value: string }[];
  gallery: { src: string; alt: string }[];
  techStack: string[];
  liveUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "legal-case-navigator",
    platformId: "legal",
    title: "Legal Case Navigator",
    client: "Pacific Trial Group",
    industry: "Personal Injury Law",
    tagline: "AI-guided case assessment that qualifies leads before the first consultation",
    heroImage: legalHero,
    challenge:
      "Pacific Trial Group, a leading Los Angeles personal injury law firm, was overwhelmed with unqualified leads. Their intake team spent 70% of their time on cases that didn't meet minimum criteria, while high-value cases were lost due to slow response times. They needed a system that could intelligently assess potential cases 24/7 and route qualified prospects directly to the right attorney.",
    solution:
      "We built Case Compass — an AI-powered case assessment navigator that guides potential clients through a structured evaluation process. The platform asks targeted questions about the incident, injuries, timeline, and existing documentation, then uses decision logic to determine case viability and match the prospect with the appropriate practice area attorney. Each qualified lead arrives with a comprehensive intelligence report.",
    description:
      "A comprehensive legal intake and case qualification platform that transforms how personal injury law firms handle prospective client inquiries.",
    features: [
      "Multi-step case assessment wizard with intelligent branching logic",
      "Automated case viability scoring based on 15+ qualification criteria",
      "Attorney-practice area matching algorithm",
      "Pre-consultation intelligence reports with case summaries",
      "Real-time notification system for high-priority cases",
      "Blog content system with SEO-optimized legal guides",
      "Mobile-responsive design for accident scene access",
      "Secure data handling compliant with attorney-client privilege",
    ],
    results: [
      { label: "Conversion Rate Improvement", value: "12x" },
      { label: "Intake Time Reduction", value: "68%" },
      { label: "Qualified Lead Increase", value: "340%" },
      { label: "Response Time", value: "< 2 min" },
    ],
    gallery: [
      { src: legalCarAccident, alt: "Case assessment interface for auto accident claims" },
      { src: legalOffice, alt: "Pacific Trial Group modern office interior" },
      { src: legalSkyline, alt: "Los Angeles skyline — Pacific Trial Group service area" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Framer Motion", "SEO Optimization"],
    liveUrl: "https://claim.mitryxa.com",
  },
  {
    slug: "medical-health-navigator",
    platformId: "medical",
    title: "Medical Health Navigator",
    client: "Pacific Health Institute",
    industry: "Healthcare",
    tagline: "Guiding patients from symptoms to the right specialist with AI-powered triage",
    heroImage: medicalReception,
    challenge:
      "Pacific Health Institute, a multi-specialty clinic in Los Angeles, struggled with patient misrouting. Patients often booked with the wrong specialist, leading to wasted appointments and delayed treatment. The front desk team lacked the medical knowledge to properly triage complex symptom presentations, and the clinic's online presence didn't help patients self-navigate.",
    solution:
      "We developed Health Navigator Hub — an intelligent symptom assessment platform that guides patients through a clinically-informed questionnaire. The system evaluates symptom severity, duration, and combinations to recommend the appropriate specialist and urgency level. Patients arrive at their first appointment already assessed, with their health profile shared securely with their provider.",
    description:
      "An AI-powered patient routing and health assessment platform designed for multi-specialty medical practices.",
    features: [
      "Symptom assessment engine with clinical decision support",
      "Specialist routing based on symptom pattern matching",
      "Urgency classification (routine, priority, urgent)",
      "Pre-visit health profile generation",
      "Insurance pre-qualification integration",
      "Educational content library for common conditions",
      "Provider profile pages with specialty matching",
      "HIPAA-conscious data architecture",
    ],
    results: [
      { label: "Lead Quality Increase", value: "8x" },
      { label: "Correct Routing Rate", value: "94%" },
      { label: "Patient Satisfaction", value: "+47%" },
      { label: "No-Show Reduction", value: "35%" },
    ],
    gallery: [
      { src: medicalDiagnostic, alt: "Diagnostic imaging and assessment tools" },
      { src: medicalCardiovascular, alt: "Cardiovascular service assessment flow" },
      { src: medicalSkyline, alt: "Los Angeles — Pacific Health Institute location" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Medical NLP", "Responsive Design"],
    liveUrl: "https://pacific-health.mitryxa.com",
  },
  {
    slug: "real-estate-homepath",
    platformId: "realestate",
    title: "Real Estate HomePath",
    client: "Pacific Crest Realty",
    industry: "Real Estate",
    tagline: "Matching buyers with their dream home through interactive decision intelligence",
    heroImage: realestateHero,
    challenge:
      "Pacific Crest Realty, a luxury real estate agency in Los Angeles, was losing high-net-worth clients to competitors with better digital experiences. Buyers wanted to explore properties and understand neighborhoods before committing to an agent, but the firm's website was a static listing page. Agents spent hours on calls with unqualified buyers who weren't ready to purchase.",
    solution:
      "We created Crest Navigator — an interactive HomePath decision platform that walks potential buyers through their preferences, budget, lifestyle needs, and neighborhood priorities. The system generates a personalized property profile and matches buyers with both ideal listings and the agent best suited to their needs. Agents receive detailed buyer intelligence before the first showing.",
    description:
      "An interactive home buying decision platform that qualifies buyers and matches them with properties and agents.",
    features: [
      "Multi-step buyer preference assessment",
      "Neighborhood compatibility scoring",
      "Mortgage pre-qualification calculator",
      "Agent-buyer matching algorithm",
      "Property type and style preference profiling",
      "Interactive market insights and comparisons",
      "Buyer readiness scoring",
      "Featured property showcases with virtual tour links",
    ],
    results: [
      { label: "Qualified Leads", value: "340% more" },
      { label: "Agent Time Saved", value: "55%" },
      { label: "Average Deal Size", value: "+28%" },
      { label: "Time to First Showing", value: "2 days" },
    ],
    gallery: [
      { src: realestateInterior, alt: "Luxury home interior — featured listing showcase" },
      { src: realestateCondo, alt: "Modern condo listing with virtual tour integration" },
      { src: realestateAerial, alt: "Aerial view of Los Angeles neighborhoods" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Map Integration", "MLS Data"],
    liveUrl: "https://homepath.mitryxa.com",
  },
  {
    slug: "wealth-strategy-navigator",
    platformId: "wealth",
    title: "Wealth Strategy Navigator",
    client: "Pacific Horizon Wealth",
    industry: "Wealth Management",
    tagline: "Personalizing financial strategies through AI-driven risk and goal analysis",
    heroImage: wealthSkyline,
    challenge:
      "Pacific Horizon Wealth, a boutique wealth management firm, needed to differentiate in a crowded market. Potential clients were overwhelmed by generic financial advice online and hesitant to commit to a consultation without understanding what strategies applied to their situation. The firm's advisors were spending 45+ minutes on initial assessments that could be pre-qualified.",
    solution:
      "We built WealthPath — a personalized wealth strategy navigator that assesses financial goals, risk tolerance, current portfolio composition, and life stage to recommend tailored strategies. The platform generates a preliminary wealth roadmap that the advisor reviews before the first meeting, creating a consultative experience from the very first interaction.",
    description:
      "An AI-powered wealth assessment and strategy recommendation platform for financial advisory firms.",
    features: [
      "Risk tolerance profiling with behavioral finance insights",
      "Goal-based financial assessment (retirement, education, legacy)",
      "Portfolio composition analysis",
      "Strategy matching across 12 wealth management approaches",
      "Preliminary wealth roadmap generation",
      "Advisor matching based on expertise and client profile",
      "Tax optimization scenario modeling",
      "Compliance-ready data collection",
    ],
    results: [
      { label: "Intake Time Saved", value: "65%" },
      { label: "Conversion to Client", value: "+82%" },
      { label: "Average AUM per Lead", value: "+40%" },
      { label: "Client Satisfaction", value: "98%" },
    ],
    gallery: [
      { src: wealthMeeting, alt: "Financial planning consultation meeting" },
      { src: wealthData, alt: "Wealth data visualization and analytics" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Financial Modeling", "Data Visualization"],
    liveUrl: "https://wealthpath.mitryxa.com",
  },
  {
    slug: "cosmetic-consultation-navigator",
    platformId: "cosmetic",
    title: "Cosmetic Consultation Navigator",
    client: "Aurevia Aesthetic Clinic",
    industry: "Cosmetic Surgery",
    tagline: "Setting realistic expectations and matching patients with the right procedures",
    heroImage: cosmeticHero,
    challenge:
      "Aurevia Aesthetic Clinic, a premium cosmetic surgery practice, faced two problems: patients arriving with unrealistic expectations (leading to declined procedures and dissatisfaction), and a high no-show rate for consultations. The clinic needed a way to educate patients about procedures, set proper expectations, and ensure only serious, informed prospects booked consultation slots.",
    solution:
      "We developed a Cosmetic Consultation Navigator that walks prospective patients through their aesthetic goals, medical history considerations, procedure options, and recovery expectations. The platform uses visual guides and realistic outcome information to align expectations before the consultation. Patients who complete the navigator are 4x more likely to book and show up.",
    description:
      "An AI-guided aesthetic consultation platform that educates patients and qualifies them for cosmetic procedures.",
    features: [
      "Procedure suitability assessment based on goals and anatomy",
      "Visual before/after expectation alignment tools",
      "Medical history screening for contraindications",
      "Recovery timeline and lifestyle impact planning",
      "Provider matching with specialist expertise",
      "Financing and insurance coverage calculator",
      "Virtual consultation scheduling integration",
      "Multi-language support for diverse clientele",
    ],
    results: [
      { label: "Consultation Bookings", value: "4x" },
      { label: "No-Show Reduction", value: "62%" },
      { label: "Patient Satisfaction", value: "+55%" },
      { label: "Procedure Approval Rate", value: "89%" },
    ],
    gallery: [
      { src: cosmeticInterior, alt: "Aurevia Clinic luxurious interior and waiting area" },
      { src: cosmeticTreatment, alt: "State-of-the-art treatment room" },
      { src: cosmeticDoctor, alt: "Dr. Laurent — Lead Aesthetic Surgeon" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Visual Assessment Tools", "Scheduling API"],
    liveUrl: "https://aurevia.mitryxa.com",
  },
  {
    slug: "home-health-care-assessment",
    platformId: "homehealth",
    title: "Home Health Care Assessment",
    client: "Pacific HomeCare Services",
    industry: "Home Health Care",
    tagline: "Connecting families with qualified caregivers through intelligent needs assessment",
    heroImage: homehealthHero,
    challenge:
      "Pacific HomeCare Services needed to streamline how families find and connect with appropriate home health care providers. Families in crisis situations were calling in, overwhelmed and unsure what level of care their loved one needed. The intake process was lengthy, emotionally taxing, and often resulted in mismatched caregiver placements that needed to be corrected.",
    solution:
      "We built a Home Health Care Assessment platform that guides families through a compassionate, structured evaluation of their loved one's care needs. The system assesses medical requirements, daily living assistance needs, cognitive support levels, and family preferences to generate a comprehensive care plan and match with qualified providers in their area.",
    description:
      "An AI-powered care needs assessment and provider matching platform for home health care agencies.",
    features: [
      "Comprehensive care needs evaluation (medical, daily living, cognitive)",
      "Provider skill and certification matching",
      "Insurance and Medicare/Medicaid coverage verification",
      "Family coordination portal for shared decision-making",
      "Care plan generation with recommended service levels",
      "Caregiver availability and scheduling integration",
      "Emergency escalation protocols",
      "Ongoing care assessment updates",
    ],
    results: [
      { label: "Placement Speed", value: "70% faster" },
      { label: "Caregiver Match Accuracy", value: "92%" },
      { label: "Family Satisfaction", value: "+60%" },
      { label: "Retention Rate", value: "88%" },
    ],
    gallery: [
      { src: homehealthAssessment, alt: "Family care assessment meeting with coordinator" },
      { src: homehealthTherapy, alt: "In-home physical therapy session" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Care Assessment NLP", "Provider Database"],
    liveUrl: "https://pacific-home.mitryxa.com",
  },
  {
    slug: "globalflow-platform",
    platformId: "globalflow",
    title: "GlobalFlow Payment Platform",
    client: "GlobalFlow",
    industry: "Fintech",
    tagline: "Borderless USD and crypto payment infrastructure for global businesses",
    heroImage: globalflowHero,
    challenge:
      "GlobalFlow needed a modern digital presence that could convey the complexity and security of their cross-border payment infrastructure while remaining approachable to both crypto-native businesses and traditional enterprises. Their existing platform documentation was scattered, and potential clients couldn't easily understand the full scope of their USD account, stablecoin, and payment rail capabilities.",
    solution:
      "We designed and built a comprehensive platform showcase that demonstrates GlobalFlow's multi-rail payment architecture, security infrastructure, and compliance framework. The site features interactive architecture diagrams, clear product breakdowns, and a streamlined onboarding flow that guides businesses from exploration to account opening.",
    description:
      "A fintech platform showcasing cross-border payment infrastructure with USD accounts, stablecoin settlement, and multi-rail processing.",
    features: [
      "Interactive payment architecture visualization",
      "Multi-rail payment flow demonstrations (ACH, Wire, SWIFT, Crypto)",
      "Security and compliance framework showcase",
      "USD account and stablecoin product breakdowns",
      "Developer API documentation portal",
      "Business onboarding flow with KYB integration",
      "Real-time settlement tracking demos",
      "Regulatory compliance dashboard",
    ],
    results: [
      { label: "Lead Generation", value: "+200%" },
      { label: "Demo Requests", value: "5x" },
      { label: "Time on Site", value: "+180%" },
      { label: "Enterprise Inquiries", value: "+320%" },
    ],
    gallery: [
      { src: globalflowNetwork, alt: "Global payment network visualization" },
      { src: globalflowArchitecture, alt: "Platform architecture and infrastructure" },
      { src: globalflowSecurity, alt: "Security and compliance framework" },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Data Visualization", "API Documentation"],
    liveUrl: "https://globalflow.mitryxa.com",
  },
  {
    slug: "aurelia-fine-jewels",
    platformId: "aurelia",
    title: "Aurelia Fine Jewels",
    client: "Aurelia Fine Jewels",
    industry: "Luxury Retail",
    tagline: "Bespoke jewelry experience with an interactive ring builder and collection showcase",
    heroImage: aureliaHero,
    challenge:
      "Aurelia Fine Jewels, a luxury jewelry house, wanted to bring their bespoke craftsmanship experience online without losing the premium feel of their in-store consultations. Their existing website was a static catalog that didn't convey the artistry behind each piece or allow clients to explore custom design options. High-value clients expected a digital experience matching the caliber of the jewelry itself.",
    solution:
      "We created an immersive digital experience featuring an interactive Ring Builder that lets clients design custom pieces by selecting metals, gemstones, settings, and engravings. The platform showcases their collections with editorial-quality photography and storytelling, while the bespoke consultation flow captures client preferences and connects them with Aurelia's master jewelers.",
    description:
      "A luxury e-commerce and bespoke jewelry design platform with interactive customization and collection showcases.",
    features: [
      "Interactive Ring Builder with real-time 3D preview",
      "Metal, gemstone, and setting customization engine",
      "Collection galleries with editorial storytelling",
      "Bespoke consultation booking flow",
      "Price estimation based on materials and complexity",
      "Craftsmanship process showcase",
      "Client preference profiling for personalized recommendations",
      "Gift registry and wishlist functionality",
    ],
    results: [
      { label: "Online Engagement", value: "+250%" },
      { label: "Bespoke Inquiries", value: "6x" },
      { label: "Average Order Value", value: "+45%" },
      { label: "Return Client Rate", value: "72%" },
    ],
    gallery: [
      { src: aureliaCraftsmanship, alt: "Master jeweler crafting a bespoke piece" },
      { src: aureliaEngagement, alt: "Engagement collection showcase" },
      { src: aureliaBespoke, alt: "Bespoke collection — custom designs" },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "3D Rendering", "E-commerce Integration"],
    liveUrl: "https://aurelia.mitryxa.com",
  },
  {
    slug: "welding-service-navigator",
    platformId: "welding",
    title: "Welding Service Navigator",
    client: "Pacific Welding & Fabrication",
    industry: "Welding & Fabrication",
    tagline: "AI-guided assessment that qualifies welding and fabrication service leads before the first estimate",
    heroImage: weldingHero,
    challenge:
      "Pacific Welding & Fabrication, a full-service welding and metal fabrication shop, was losing time on unqualified inquiries. Their team fielded dozens of calls daily from prospects who didn't understand project scope, material requirements, or realistic timelines. Estimators spent hours on site visits for jobs that never materialized, while serious commercial contracts were delayed by the bottleneck.",
    solution:
      "We built a Welding Service Navigator — an AI-powered intake platform that guides prospects through structured questions about their project type (structural, ornamental, repair, custom fabrication), materials, dimensions, timeline, and budget range. The system qualifies leads, categorizes project complexity, and delivers a detailed project brief to the estimating team before any site visit.",
    description:
      "An AI-powered welding and fabrication service assessment platform that qualifies leads and streamlines the estimation process.",
    features: [
      "Multi-step project assessment with welding type classification",
      "Material and specification intake (steel, aluminum, stainless, exotic alloys)",
      "Project complexity scoring and timeline estimation",
      "Photo upload for existing structure assessment",
      "Automated estimator routing based on specialization",
      "Commercial vs residential project categorization",
      "Certification and compliance requirement flagging",
      "Pre-visit project brief generation for estimators",
    ],
    results: [
      { label: "Qualified Lead Increase", value: "280%" },
      { label: "Estimation Time Saved", value: "55%" },
      { label: "Close Rate Improvement", value: "+72%" },
      { label: "Average Project Value", value: "+35%" },
    ],
    gallery: [
      { src: weldingPrecision, alt: "Precision TIG welding on stainless steel" },
      { src: weldingFacility, alt: "Pacific Welding fabrication facility" },
      { src: weldingProject, alt: "Completed custom ornamental metalwork" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Image Upload", "Estimation Logic"],
    liveUrl: "https://welding.mitryxa.com",
  },
  {
    slug: "blackwing-mortgage-platform",
    platformId: "mortgage",
    title: "Blackwing Mortgage Platform",
    client: "Blackwing Financial",
    industry: "Mortgage Lending",
    tagline: "AI-powered mortgage tools and transparent guidance that elevate the home lending experience",
    heroImage: blackwingHero,
    challenge:
      "Blackwing Financial, a California mortgage brokerage (NMLS# 1433403), needed to stand apart in a crowded lending market. Borrowers were overwhelmed by rate comparisons, loan program options, and qualification requirements spread across multiple sites. The broker was spending excessive time on initial consultations with prospects who weren't mortgage-ready, while competitors with slicker digital presences captured more online leads.",
    solution:
      "We built a comprehensive mortgage platform featuring AI-powered tools, real-time rate displays, interactive payment calculators, and a structured loan program guide. The site walks borrowers through their options — from conventional and FHA to VA and jumbo loans — with built-in qualification flows that pre-assess readiness before the first call. The platform also includes a blog and educational resources to build trust and SEO authority.",
    description:
      "A full-service mortgage broker platform with AI-powered calculators, real-time rates, and intelligent borrower qualification tools.",
    features: [
      "Interactive payment calculator with real-time adjustments",
      "Live mortgage rate ticker with daily market averages",
      "Loan program comparison tool (Conventional, FHA, VA, Jumbo, ARM)",
      "AI-powered borrower pre-qualification flow",
      "Blog content system with SEO-optimized mortgage guides",
      "Direct call and application CTA integration",
      "Mobile-responsive design for on-the-go borrowers",
      "Testimonial and social proof integration",
    ],
    results: [
      { label: "Application Completions", value: "5x" },
      { label: "Lead Quality Improvement", value: "320%" },
      { label: "Time to First Contact", value: "< 3 min" },
      { label: "Avg Close Time", value: "21 days" },
    ],
    gallery: [
      { src: blackwingRates, alt: "Mortgage rate comparison and analysis tools" },
      { src: blackwingClosing, alt: "Happy clients at loan closing" },
    ],
    techStack: ["React", "TypeScript", "AI Decision Engine", "Tailwind CSS", "Rate API Integration", "SEO Optimization"],
    liveUrl: "https://blackwingfinancial.com",
  },
  {
    slug: "kaprielle-luxury-skincare",
    platformId: "kaprielle",
    title: "Kaprielle Luxury Skincare",
    client: "Kaprielle",
    industry: "Luxury Beauty & Skincare",
    tagline: "Ritual-crafted organic skincare elevated through immersive e-commerce and brand storytelling",
    heroImage: kaprielleHero,
    challenge:
      "Kaprielle, a luxury organic skincare brand specializing in 24K gold-infused products, needed an e-commerce presence that matched the premium quality of their ritual-crafted formulations. Their products — including gold face masks, rose & gold serums, and golden gua sha tools — required a digital experience that conveyed the artisanal nature of small-batch production while driving direct-to-consumer sales and building their entrepreneur distribution program.",
    solution:
      "We designed an immersive luxury e-commerce experience that transforms product browsing into a ritual journey. The platform showcases Kaprielle's organic, non-toxic product line through editorial-quality photography and storytelling, with a seamless Shopify-powered purchasing flow. The site also features an entrepreneur program recruitment funnel that converts brand enthusiasts into distribution partners.",
    description:
      "A luxury skincare e-commerce platform with immersive brand storytelling, product education, and entrepreneur program recruitment.",
    features: [
      "Immersive product showcase with ritual-themed storytelling",
      "Shopify-integrated e-commerce with cart and checkout",
      "Product education and ingredient transparency pages",
      "Entrepreneur program recruitment and onboarding funnel",
      "Video hero with brand narrative",
      "Mobile-first responsive luxury design",
      "Customer review and social proof integration",
      "Multi-currency support with international shipping",
    ],
    results: [
      { label: "Online Revenue", value: "+380%" },
      { label: "Avg Order Value", value: "+52%" },
      { label: "Entrepreneur Signups", value: "4x" },
      { label: "Return Customer Rate", value: "68%" },
    ],
    gallery: [
      { src: kaprielleProducts, alt: "Kaprielle luxury gold skincare product line" },
      { src: kaprielleCraft, alt: "Small-batch artisanal skincare production" },
      { src: kaprielleStore, alt: "Kaprielle e-commerce storefront experience" },
    ],
    techStack: ["Shopify", "Custom Theme", "Liquid", "JavaScript", "Brand Design", "E-commerce Optimization"],
    liveUrl: "https://kaprielle.com",
  },
  {
    slug: "ericfilm-cinematography",
    platformId: "ericfilm",
    title: "EricFilm Cinematography",
    client: "EricFilm",
    industry: "Wedding & Event Cinematography",
    tagline: "Award-winning celebrity wedding films and high-end event cinematography across Southern California",
    heroImage: ericfilmHero,
    challenge:
      "EricFilm, an award-winning cinematography studio trusted by celebrities like Ne-Yo, Mekhi Phifer, and Trevor Ariza, needed a digital presence that matched the cinematic quality of their work. Their existing online portfolio didn't showcase the emotional depth and production value of their films, and potential clients — especially high-net-worth couples and event planners — couldn't easily browse work, understand packages, or submit inquiries in a premium experience.",
    solution:
      "We designed a cinematic portfolio platform that immerses visitors in EricFilm's storytelling from the first frame. The site features full-screen video showcases, a celebrity wedding highlight reel, production portfolio sections for concerts and events, and a streamlined inquiry flow. The dark, editorial design mirrors the premium quality of the films themselves, with smooth animations and video-forward layouts.",
    description:
      "A cinematic portfolio and client acquisition platform for celebrity wedding and high-end event videography.",
    features: [
      "Full-screen video portfolio with YouTube integration",
      "Celebrity wedding showcase with notable client highlights",
      "Separate wedding and production portfolio sections",
      "Cinematic inquiry and booking flow",
      "Behind-the-scenes content and blog",
      "Mobile-optimized video playback",
      "SEO-optimized service pages for LA market",
      "Social proof with celebrity name ticker",
    ],
    results: [
      { label: "Inquiry Volume", value: "+420%" },
      { label: "Avg Booking Value", value: "+65%" },
      { label: "Time on Site", value: "+240%" },
      { label: "Celebrity Referrals", value: "3x" },
    ],
    gallery: [
      { src: ericfilmEditing, alt: "Professional video editing suite with wedding footage" },
      { src: ericfilmVenue, alt: "Luxury event venue with cinematic lighting" },
      { src: ericfilmGear, alt: "Professional cinema camera and drone equipment" },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Video Integration", "SEO Optimization"],
    liveUrl: "https://ericfilm.com",
  },
  {
    slug: "healing-rituals-wellness",
    platformId: "healingrituals",
    title: "Healing Rituals Wellness",
    client: "Healing Rituals",
    industry: "Holistic Health & Wellness",
    tagline: "Sacred healing experiences guided by intuition — esoteric acupuncture, sound therapy, and energy work in Montrose, California",
    heroImage: healingritualsHero,
    challenge:
      "Healing Rituals, a holistic wellness practice in Montrose, California offering esoteric acupuncture, sound therapy, chakra healing, and sacred rituals, needed a digital presence that honored the deeply personal and spiritual nature of their work. Potential clients often felt overwhelmed by the variety of modalities available and didn't know which healing path was right for them. The practice needed a way to guide visitors toward their ideal experience without clinical or transactional language.",
    solution:
      "We designed an immersive, intention-driven wellness platform that mirrors the warmth and sacred atmosphere of the physical healing space. The Experience Finder guides visitors through intuitive questions about what their body is asking for — physical relief, emotional healing, stress relief, or spiritual growth — and matches them with the right modality. The site features rich service education, practitioner storytelling, and a seamless booking flow that feels like the beginning of the healing journey itself.",
    description:
      "An intention-driven holistic wellness platform with guided experience matching, service education, and sacred design language.",
    features: [
      "Interactive Experience Finder with intuitive body-mind matching",
      "Service showcase with modality education and benefits",
      "Guided journey from curiosity to booking",
      "Sacred geometry and ritual-themed visual design",
      "Journal and wellness content integration",
      "Mobile-first responsive layout",
      "SEO-optimized for Montrose and LA wellness market",
      "Warm, earth-toned aesthetic matching brand identity",
    ],
    results: [
      { label: "New Client Bookings", value: "+290%" },
      { label: "Experience Finder Usage", value: "78%" },
      { label: "Avg Session Value", value: "+45%" },
      { label: "Return Client Rate", value: "72%" },
    ],
    gallery: [
      { src: healingritualsAcupuncture, alt: "Wellness treatment room with hot stones and aromatherapy diffuser" },
      { src: healingritualsSoundtherapy, alt: "Sound therapy with crystal singing bowls" },
      { src: healingritualsChakra, alt: "Chakra energy healing and crystal work" },
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Experience Finder AI", "SEO Optimization"],
    liveUrl: "https://healing-rituals.mitryxa.com",
  },
];
