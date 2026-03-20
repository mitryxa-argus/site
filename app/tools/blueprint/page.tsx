'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Compass, ArrowRight, ArrowLeft, Check, Cpu, Shield, FileDown, MessageSquare, Send, X, Terminal, Loader2, Zap, BarChart3, Globe, Target, Users, TrendingUp, DollarSign, Clock, Camera } from "lucide-react";
import TerminalCodeStream from "@/components/ui/TerminalCodeStream";
import SEOHead from "@/components/seo/SEOHead";
import { openBrandedPdf } from "@/lib/brandedPdf";
import TalkToMitryxa from "@/components/tools/TalkToMitryxa";
import ReportChatPanel from "@/components/tools/ReportChatPanel";
import StickyReportActions from "@/components/tools/StickyReportActions";
import { generateFingerprint } from "@/lib/fingerprint";

// ─── Translations ───

type Lang = "en" | "es" | "hy" | "fa";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    tagline: "Your",
    tagline_accent: "Digital Blueprint",
    subtitle: "A comprehensive digital growth assessment personalized for your business.",
    price_label: "One-time assessment:",
    generate: "Generate Blueprint",
    pay_btn: "Get Blueprint — $35",
    redirecting: "Redirecting...",
    analyzing: "Building your digital blueprint...",
    scanning: "Researching your market and analyzing your presence...",
    discuss: "Discuss Report",
    hide_chat: "Hide Chat",
    download: "Download Report",
    talk: "Talk to Mitryxa",
    chat_placeholder: "Ask about your blueprint...",
    chat_empty: "Ask anything about your digital blueprint...",
    coupon_label: "Have a coupon code?",
    coupon_placeholder: "Enter code...",
    try_again: ">_ Try again",
    review_confirm: "Confirm your inputs.",
    review_costs: "This assessment costs",
    intake_placeholder: "Type your answer or tap an option...",
    intake_thinking: "Thinking...",
    topics_covered: "topics covered",
    step9_title: "Review & Pay",
    industry: "Industry",
    business_name: "Business Name",
    years: "Years in Business",
    locations: "Locations",
    employees: "Employees",
    website_url: "Website URL",
    geography: "Geography",
    presence: "Digital Presence",
    time_weekly: "Weekly Marketing Hours",
    skills: "Content Skills",
    diy: "Currently DIY",
    pain_points: "Pain Points",
    goals: "12-Month Goals",
    content_method: "Content Method",
    budget: "Monthly Budget",
    social_platforms: "Social Platforms",
    language_label: "Language",
    back: "Back",
  },
  es: {
    welcome: "Bienvenido",
    tagline: "Tu",
    tagline_accent: "Plan Digital",
    subtitle: "Una evaluación integral de crecimiento digital personalizada para tu negocio.",
    price_label: "Evaluación única:",
    generate: "Generar Plan",
    pay_btn: "Obtener Plan — $35",
    redirecting: "Redirigiendo...",
    analyzing: "Construyendo tu plan digital...",
    scanning: "Investigando tu mercado y analizando tu presencia...",
    discuss: "Discutir Informe",
    hide_chat: "Ocultar Chat",
    download: "Descargar Informe",
    talk: "Hablar con Mitryxa",
    chat_placeholder: "Pregunta sobre tu plan...",
    chat_empty: "Pregunta lo que quieras sobre tu plan digital...",
    coupon_label: "¿Tienes un código de cupón?",
    coupon_placeholder: "Ingresar código...",
    try_again: ">_ Intentar de nuevo",
    review_confirm: "Confirma tus datos.",
    review_costs: "Esta evaluación cuesta",
    intake_placeholder: "Escribe tu respuesta o toca una opción...",
    intake_thinking: "Pensando...",
    topics_covered: "temas cubiertos",
    step9_title: "Revisar y Pagar",
    industry: "Industria",
    business_name: "Nombre del Negocio",
    years: "Años en el Negocio",
    locations: "Ubicaciones",
    employees: "Empleados",
    website_url: "URL del Sitio Web",
    geography: "Geografía",
    presence: "Presencia Digital",
    time_weekly: "Horas Semanales de Marketing",
    skills: "Habilidades de Contenido",
    diy: "Hago Yo Mismo",
    pain_points: "Problemas",
    goals: "Objetivos a 12 Meses",
    content_method: "Método de Contenido",
    budget: "Presupuesto Mensual",
    social_platforms: "Redes Sociales",
    language_label: "Idioma",
    back: "Atrás",
  },
  hy: {
    welcome: "\u0532\u0561\u0580\u056B \u0563\u0561\u056C\u0578\u0582\u057D\u057F",
    tagline: "Ձեր",
    tagline_accent: "Թվային Ծրագիրը",
    subtitle: "\u0540\u0561\u0574\u0561\u057A\u0561\u0580\u0583\u0561\u056F \u0569\u057E\u0561\u0575\u056B\u0576 \u0561\u0573\u056B \u0563\u0576\u0561\u0570\u0561\u057F\u0578\u0582\u0574 \u0561\u0576\u0570\u0561\u057F\u0561\u056F\u0561\u0576\u0561\u057A\u0565\u057D \u0571\u0565\u0580 \u0562\u056B\u0566\u0576\u0565\u057D\u056B \u0570\u0561\u0574\u0561\u0580\u0589",
    price_label: "\u0544\u056B\u0561\u0576\u0563\u0561\u0574\u0575\u0561 \u0563\u0576\u0561\u0570\u0561\u057F\u0578\u0582\u0574.",
    generate: "\u054D\u057F\u0565\u0572\u056E\u0565\u056C \u056E\u0580\u0561\u0563\u056B\u0580",
    pay_btn: "\u054D\u057F\u0561\u0576\u0561\u056C \u056E\u0580\u0561\u0563\u056B\u0580 \u2014 $35",
    redirecting: "\u054E\u0565\u0580\u0561\u0570\u0572\u0578\u0582\u0574...",
    analyzing: "\u054D\u057F\u0565\u0572\u056E\u0578\u0582\u0574 \u0565\u0576\u0584 \u0571\u0565\u0580 \u0569\u057E\u0561\u0575\u056B\u0576 \u056E\u0580\u0561\u0563\u056B\u0580\u0568...",
    scanning: "\u0540\u0565\u057F\u0561\u0566\u0578\u057F\u0578\u0582\u0574 \u0565\u0576\u0584 \u0571\u0565\u0580 \u0577\u0578\u0582\u056F\u0561\u0576 \u0587 \u057E\u0565\u0580\u056C\u0578\u0582\u056E\u0578\u0582\u0574 \u0571\u0565\u0580 \u0576\u0565\u0580\u056F\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568...",
    discuss: "\u0554\u0576\u0576\u0561\u0580\u056F\u0565\u056C \u0566\u0565\u056F\u0578\u0582\u0575\u0581\u0568",
    hide_chat: "\u0539\u0561\u0584\u0581\u0576\u0565\u056C \u0566\u0580\u0578\u0582\u0575\u0581\u0568",
    download: "\u0546\u0565\u0580\u0562\u0565\u057C\u0576\u0565\u056C \u0566\u0565\u056F\u0578\u0582\u0575\u0581\u0568",
    talk: "\u053D\u0578\u057D\u0565\u056C Mitryxa-\u056B \u0570\u0565\u057F",
    chat_placeholder: "\u0540\u0561\u0580\u0581\u0580\u0565\u0584 \u0571\u0565\u0580 \u056E\u0580\u0561\u0563\u0580\u056B \u0574\u0561\u057D\u056B\u0576...",
    chat_empty: "\u0540\u0561\u0580\u0581\u0580\u0565\u0584 \u0581\u0561\u0576\u056F\u0561\u0581\u0561\u056E \u0570\u0561\u0580\u0581 \u0571\u0565\u0580 \u0569\u057E\u0561\u0575\u056B\u0576 \u056E\u0580\u0561\u0563\u0580\u056B \u0574\u0561\u057D\u056B\u0576...",
    coupon_label: "\u0536\u0565\u0572\u0573\u056B \u056F\u0578\u0564 \u0578\u0582\u0576\u0565\u055E\u0584\u055E",
    coupon_placeholder: "\u0544\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0565\u0584 \u056F\u0578\u0564\u0568...",
    try_again: ">_ \u0553\u0578\u0580\u0571\u0565\u0584 \u056F\u0580\u056F\u056B\u0576",
    review_confirm: "\u0540\u0561\u057D\u057F\u0561\u057F\u0565\u0584 \u0571\u0565\u0580 \u057F\u057E\u0575\u0561\u056C\u0576\u0565\u0580\u0568\u0589",
    review_costs: "\u0531\u0575\u057D \u0563\u0576\u0561\u0570\u0561\u057F\u0574\u0561\u0576 \u0561\u0580\u056A\u0565\u0584\u0568",
    intake_placeholder: "\u0533\u0580\u0565\u0584 \u0571\u0565\u0580 \u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u0568...",
    intake_thinking: "\u0544\u057F\u0561\u056E\u0578\u0582\u0574 \u0565\u0574...",
    topics_covered: "\u0569\u0565\u0574\u0561 \u056C\u0578\u0582\u057D\u0561\u056E",
    step9_title: "\u054E\u0565\u0580\u0561\u0576\u0561\u0575\u0565\u056C \u0587 \u057E\u0573\u0561\u0580\u0565\u056C",
    industry: "\u0548\u056C\u0578\u0580\u057F",
    business_name: "\u0532\u056B\u0566\u0576\u0565\u057D\u056B \u0561\u0576\u0578\u0582\u0576",
    years: "\u054F\u0561\u0580\u056B\u0576\u0565\u0580 \u0562\u056B\u0566\u0576\u0565\u057D\u0578\u0582\u0574",
    locations: "\u054F\u0565\u0572\u0561\u0564\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580",
    employees: "\u0531\u0577\u056D\u0561\u057F\u0561\u056F\u056B\u0581\u0576\u0565\u0580",
    website_url: "\u053F\u0561\u0575\u0584\u056B \u0570\u0561\u057D\u0581\u0565",
    geography: "\u0531\u0577\u056D\u0561\u0580\u0570\u0561\u0563\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    presence: "\u0539\u057E\u0561\u0575\u056B\u0576 \u0576\u0565\u0580\u056F\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    time_weekly: "\u0547\u0561\u0562\u0561\u0569\u0561\u056F\u0561\u0576 \u0574\u0561\u0580\u056F\u0565\u057F\u056B\u0576\u0563\u056B \u056A\u0561\u0574\u0565\u0580",
    skills: "\u0532\u0578\u057E\u0561\u0576\u0564\u0561\u056F\u0578\u0582\u0569\u0575\u0561\u0576 \u0570\u0574\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580",
    diy: "\u053B\u0576\u0584\u057D \u0565\u0574 \u0561\u0576\u0578\u0582\u0574",
    pain_points: "\u053D\u0576\u0564\u056B\u0580\u0576\u0565\u0580",
    goals: "12 \u0561\u0574\u057D\u057E\u0561 \u0576\u057A\u0561\u057F\u0561\u056F\u0576\u0565\u0580",
    content_method: "\u0532\u0578\u057E\u0561\u0576\u0564\u0561\u056F\u0578\u0582\u0569\u0575\u0561\u0576 \u0574\u0565\u0569\u0578\u0564",
    budget: "\u0531\u0574\u057D\u0561\u056F\u0561\u0576 \u0562\u0575\u0578\u0582\u057B\u0565",
    social_platforms: "\u054D\u0578\u0581\u056B\u0561\u056C\u0561\u056F\u0561\u0576 \u0581\u0561\u0576\u0581\u0565\u0580",
    language_label: "\u053C\u0565\u0566\u0578\u0582",
    back: "\u0540\u0565\u057F",
  },
  fa: {
    welcome: "\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F",
    tagline: "",
    tagline_accent: "نقشه راه دیجیتال شما",
    subtitle: "\u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u062C\u0627\u0645\u0639 \u0631\u0634\u062F \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u0634\u062E\u0635\u06CC\u200C\u0633\u0627\u0632\u06CC \u0634\u062F\u0647 \u0628\u0631\u0627\u06CC \u06A9\u0633\u0628\u200C\u0648\u06A9\u0627\u0631 \u0634\u0645\u0627.",
    price_label: "\u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u06CC\u06A9\u0628\u0627\u0631\u0647:",
    generate: "\u0627\u06CC\u062C\u0627\u062F \u0646\u0642\u0634\u0647 \u0631\u0627\u0647",
    pay_btn: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u0642\u0634\u0647 \u0631\u0627\u0647 \u2014 $35",
    redirecting: "\u062F\u0631 \u062D\u0627\u0644 \u0627\u0646\u062A\u0642\u0627\u0644...",
    analyzing: "\u062F\u0631 \u062D\u0627\u0644 \u0633\u0627\u062E\u062A \u0646\u0642\u0634\u0647 \u0631\u0627\u0647 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u0634\u0645\u0627...",
    scanning: "\u062F\u0631 \u062D\u0627\u0644 \u062A\u062D\u0642\u06CC\u0642 \u0628\u0627\u0632\u0627\u0631 \u0648 \u062A\u062D\u0644\u06CC\u0644 \u062D\u0636\u0648\u0631 \u0634\u0645\u0627...",
    discuss: "\u0628\u062D\u062B \u062F\u0631\u0628\u0627\u0631\u0647 \u06AF\u0632\u0627\u0631\u0634",
    hide_chat: "\u0645\u062E\u0641\u06CC \u06A9\u0631\u062F\u0646 \u0686\u062A",
    download: "\u062F\u0627\u0646\u0644\u0648\u062F \u06AF\u0632\u0627\u0631\u0634",
    talk: "\u0635\u062D\u0628\u062A \u0628\u0627 Mitryxa",
    chat_placeholder: "\u062F\u0631\u0628\u0627\u0631\u0647 \u0646\u0642\u0634\u0647 \u0631\u0627\u0647 \u0628\u067E\u0631\u0633\u06CC\u062F...",
    chat_empty: "\u0647\u0631 \u0633\u0648\u0627\u0644\u06CC \u062F\u0631\u0628\u0627\u0631\u0647 \u0646\u0642\u0634\u0647 \u0631\u0627\u0647 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u062E\u0648\u062F \u0628\u067E\u0631\u0633\u06CC\u062F...",
    coupon_label: "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641 \u062F\u0627\u0631\u06CC\u062F\u061F",
    coupon_placeholder: "\u06A9\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F...",
    try_again: ">_ \u062F\u0648\u0628\u0627\u0631\u0647 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646\u06CC\u062F",
    review_confirm: "\u0648\u0631\u0648\u062F\u06CC\u200C\u0647\u0627\u06CC \u062E\u0648\u062F \u0631\u0627 \u062A\u0623\u06CC\u06CC\u062F \u06A9\u0646\u06CC\u062F.",
    review_costs: "\u0647\u0632\u06CC\u0646\u0647 \u0627\u06CC\u0646 \u0627\u0631\u0632\u06CC\u0627\u0628\u06CC",
    intake_placeholder: "\u067E\u0627\u0633\u062E \u062E\u0648\u062F \u0631\u0627 \u0628\u0646\u0648\u06CC\u0633\u06CC\u062F...",
    intake_thinking: "\u062F\u0631 \u062D\u0627\u0644 \u0641\u06A9\u0631...",
    topics_covered: "\u0645\u0648\u0636\u0648\u0639 \u067E\u0648\u0634\u0634 \u062F\u0627\u062F\u0647 \u0634\u062F\u0647",
    step9_title: "\u0628\u0631\u0631\u0633\u06CC \u0648 \u067E\u0631\u062F\u0627\u062E\u062A",
    industry: "\u0635\u0646\u0639\u062A",
    business_name: "\u0646\u0627\u0645 \u06A9\u0633\u0628\u200C\u0648\u06A9\u0627\u0631",
    years: "\u0633\u0627\u0644\u200C\u0647\u0627 \u062F\u0631 \u06A9\u0633\u0628\u200C\u0648\u06A9\u0627\u0631",
    locations: "\u0645\u06A9\u0627\u0646\u200C\u0647\u0627",
    employees: "\u06A9\u0627\u0631\u0645\u0646\u062F\u0627\u0646",
    website_url: "\u0622\u062F\u0631\u0633 \u0648\u0628\u200C\u0633\u0627\u06CC\u062A",
    geography: "\u062C\u063A\u0631\u0627\u0641\u06CC\u0627",
    presence: "\u062D\u0636\u0648\u0631 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644",
    time_weekly: "\u0633\u0627\u0639\u0627\u062A \u0628\u0627\u0632\u0627\u0631\u06CC\u0627\u0628\u06CC \u0647\u0641\u062A\u06AF\u06CC",
    skills: "\u0645\u0647\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0645\u062D\u062A\u0648\u0627",
    diy: "\u062E\u0648\u062F\u0645 \u0627\u0646\u062C\u0627\u0645 \u0645\u06CC\u200C\u062F\u0647\u0645",
    pain_points: "\u0645\u0634\u06A9\u0644\u0627\u062A",
    goals: "\u0627\u0647\u062F\u0627\u0641 \u06F1\u06F2 \u0645\u0627\u0647\u0647",
    content_method: "\u0631\u0648\u0634 \u0645\u062D\u062A\u0648\u0627",
    budget: "\u0628\u0648\u062F\u062C\u0647 \u0645\u0627\u0647\u0627\u0646\u0647",
    social_platforms: "\u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC",
    language_label: "\u0632\u0628\u0627\u0646",
    back: "\u0642\u0628\u0644\u06CC",
  },
};

const langNames: Record<Lang, string> = { en: "English", es: "Español", hy: "Հայերեն", fa: "فارسی" };

// ─── Types & Constants ───

type Selections = {
  lang: Lang | "";
  industry: string;
  customIndustry: string;
  businessName: string;
  yearsInBusiness: string;
  locationCount: string;
  employeeCount: string;
  geographyScope: string;
  targetLocations: string[];
  customLocation: string;
  presence: string[];
  websiteUrl: string;
  selectedSocials: string[];
  socialUrls: Record<string, string>;
  timeWeekly: string;
  skills: string[];
  diy: string[];
  painPoints: string[];
  goals: string[];
  contentMethod: string;
  budget: string;
  extraContext: string;
};

const INITIAL: Selections = {
  lang: "" as Lang | "",
  industry: "",
  customIndustry: "",
  businessName: "",
  yearsInBusiness: "",
  locationCount: "",
  employeeCount: "",
  geographyScope: "",
  targetLocations: [],
  customLocation: "",
  presence: [],
  websiteUrl: "",
  selectedSocials: [],
  socialUrls: {},
  timeWeekly: "",
  skills: [],
  diy: [],
  painPoints: [],
  goals: [],
  contentMethod: "",
  budget: "",
  extraContext: "",
};

const TOKEN_KEY = "mitryxa_blueprint_token";
const REPORT_KEY = "mitryxa_blueprint_report";
const SELECTIONS_KEY = "mitryxa_blueprint_selections";
const TOOL_PRICE = "$35";
type Phase = "intake" | "review" | "paying" | "analyzing" | "complete" | "error";
type IntakeMsg = {
  role: "user" | "assistant";
  content: string;
  options?: string[];
  optionType?: "single" | "multi";
};
type ChatMsg = { role: "user" | "assistant"; content: string };

function saveData(data: { selections: Selections; report: string }) {
  try { sessionStorage.setItem(REPORT_KEY, JSON.stringify(data)); } catch {}
}
function loadData(): { selections: Selections; report: string } | null {
  try { const r = sessionStorage.getItem(REPORT_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

// Count how many required topics are filled
function countTopics(sel: Selections): number {
  let count = 0;
  if (sel.industry) count++;
  if (sel.geographyScope) count++;
  if (sel.presence.length > 0) count++;
  if (sel.timeWeekly) count++;
  if (sel.painPoints.length > 0 || sel.goals.length > 0) count++;
  if (sel.contentMethod) count++;
  if (sel.budget) count++;
  return count;
}

const sectionIcons: Record<string, React.ReactNode> = {
  "Where You Are": <Globe size={18} />,
  "Market Reality": <BarChart3 size={18} />,
  "Leaving on the Table": <TrendingUp size={18} />,
  "Social Media": <Users size={18} />,
  "Time vs": <Clock size={18} />,
  "Website": <Target size={18} />,
  "Advertising": <DollarSign size={18} />,
  "Content Production": <Camera size={18} />,
  "Tax Write": <DollarSign size={18} />,
  "Systems": <Cpu size={18} />,
  "Action Plan": <Zap size={18} />,
  "Investment Summary": <DollarSign size={18} />,
  "Executive": <Terminal size={18} />,
};
function getIconForSection(title: string) {
  for (const [k, icon] of Object.entries(sectionIcons)) {
    if (title.includes(k)) return icon;
  }
  return <Cpu size={18} />;
}

const MAX_INTAKE_MESSAGES = 40;

const BlueprintInner = () => {
  const searchParams = useSearchParams();
  const [sel, setSel] = useState<Selections>(INITIAL);
  const [phase, setPhase] = useState<Phase>("intake");
  const [report, setReport] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const actionRowRef = useRef<HTMLDivElement>(null);
  const [showStickyActions, setShowStickyActions] = useState(false);

  // Intake chat state
  const [intakeMessages, setIntakeMessages] = useState<IntakeMsg[]>([{
    role: "assistant",
    content: "Hey! Let's build your Digital Blueprint. Tell me — what does your business do?",
    options: [],
    optionType: "single",
  }]);
  const [intakeInput, setIntakeInput] = useState("");
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [intakeError, setIntakeError] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const intakeEndRef = useRef<HTMLDivElement>(null);
  const intakeInputRef = useRef<HTMLInputElement>(null);

  const [toolToken, setToolToken] = useState<string | null>(() => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  });
  const updateToken = useCallback((t: string | null) => {
    setToolToken(t);
    try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch {}
  }, []);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  
  const [talkOpen, setTalkOpen] = useState(false);

  // Sticky action bar observer
  useEffect(() => {
    const el = actionRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyActions(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  const t = translations[(sel.lang as string) as keyof typeof translations] || translations.en;
  const isRtl = sel.lang === "fa";

  // Initialize — load saved report or start intake
  useEffect(() => {
    generateFingerprint().then(setFingerprint);
    const saved = loadData();
    if (saved?.report) {
      setSel(saved.selections);
      setReport(saved.report);
      setPhase("complete");
    }
  }, []);

  // Stripe redirect
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;
    /* searchParams is read-only in Next.js */;
    (async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-tool-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}` },
          body: JSON.stringify({ sessionId, toolType: "blueprint" }),
        });
        const data = await resp.json();
        if (data.valid && data.toolToken) {
          updateToken(data.toolToken);
          const saved = sessionStorage.getItem(SELECTIONS_KEY);
          if (saved) {
            const ps = JSON.parse(saved);
            setSel(ps);
            setTimeout(() => runAnalysis(ps, data.toolToken), 100);
          }
        } else { setErrorMsg(data.error || "Payment verification failed."); setPhase("error"); }
      } catch { setErrorMsg("Could not verify payment."); setPhase("error"); }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (reportRef.current && (phase === "analyzing" || phase === "complete"))
      reportRef.current.scrollTop = reportRef.current.scrollHeight;
  }, [report, phase]);
  
  useEffect(() => {
    if (intakeMessages.length > 1) {
      const container = document.getElementById("intake-chat-scroll");
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [intakeMessages, intakeLoading]);

  // ─── Intake Conversation ───

  const sendIntakeMessage = async (userMessage: string | null, currentSel: Selections) => {
    setIntakeLoading(true);
    setIntakeError("");

    const newMessages = userMessage
      ? [...intakeMessages, { role: "user" as const, content: userMessage }]
      : intakeMessages;

    if (userMessage) {
      setIntakeMessages(newMessages);
    }

    // Build message history for AI (just role + content)
    const aiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/blueprint-intake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: aiMessages, selections: currentSel }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        if (err.strike) {
          setIntakeError(err.error);
        } else {
          throw new Error(err.error || `Error ${resp.status}`);
        }
        setIntakeLoading(false);
        return;
      }

      const data = await resp.json();

      // Update selections from AI
      const updatedSel: Selections = {
        ...currentSel,
        ...data.selections,
        extraContext: data.extraContext || currentSel.extraContext,
      };
      setSel(updatedSel);

      // Add AI message with options
      const aiMsg: IntakeMsg = {
        role: "assistant",
        content: data.message,
        options: data.options,
        optionType: data.optionType,
      };
      setIntakeMessages(prev => [...prev, aiMsg]);
      setSelectedChips([]);

      // Check if intake is complete
      if (data.complete) {
        setTimeout(() => setPhase("review"), 1500);
      }
    } catch (err: any) {
      setIntakeError(err.message || "Something went wrong");
    } finally {
      setIntakeLoading(false);
    }
  };

  const handleIntakeSend = useCallback(() => {
    if (!intakeInput.trim() || intakeLoading) return;
    if (intakeMessages.length >= MAX_INTAKE_MESSAGES) {
      setPhase("review");
      return;
    }
    const msg = intakeInput.trim();
    setIntakeInput("");
    sendIntakeMessage(msg, sel);
  }, [intakeInput, intakeLoading, intakeMessages, sel]);

  const handleChipClick = useCallback((option: string, optionType: string) => {
    if (intakeLoading) return;
    if (intakeMessages.length >= MAX_INTAKE_MESSAGES) {
      setPhase("review");
      return;
    }
    if (optionType === "multi") {
      setSelectedChips(prev =>
        prev.includes(option) ? prev.filter(c => c !== option) : [...prev, option]
      );
    } else {
      sendIntakeMessage(option, sel);
    }
  }, [intakeLoading, intakeMessages, sel]);

  const handleMultiSubmit = useCallback(() => {
    if (selectedChips.length === 0 || intakeLoading) return;
    const msg = selectedChips.join(", ");
    setSelectedChips([]);
    sendIntakeMessage(msg, sel);
  }, [selectedChips, intakeLoading, sel]);

  // ─── Report Generation ───

  const runAnalysis = async (sels: Selections, token: string) => {
    setPhase("analyzing");
    setReport("");
    setErrorMsg("");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
        "x-tool-token": token,
      };
      if (fingerprint) headers["x-client-fingerprint"] = fingerprint;

      const locationString = sels.geographyScope === "National" ? "National (United States)" :
        [...sels.targetLocations, ...(sels.customLocation.trim() ? [sels.customLocation.trim()] : [])].join(", ");

      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tools-blueprint`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          selections: {
            ...sels,
            industry: sels.industry === "Other" ? sels.customIndustry || "Other" : sels.industry,
            geography: locationString,
          },
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        setErrorMsg(err.error || `Error ${resp.status}`); setPhase("error"); return;
      }
      if (!resp.body) { setErrorMsg("No response stream"); setPhase("error"); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") break;
          try {
            const c = JSON.parse(j).choices?.[0]?.delta?.content;
            if (c) { full += c; setReport(full); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
      if (buf.trim()) {
        for (let raw of buf.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || !raw.trim() || !raw.startsWith("data: ")) continue;
          const j = raw.slice(6).trim();
          if (j === "[DONE]") continue;
          try { const c = JSON.parse(j).choices?.[0]?.delta?.content; if (c) { full += c; setReport(full); } } catch {}
        }
      }
      setPhase("complete");
      saveData({ selections: sels, report: full });
      updateToken(null);
      sessionStorage.removeItem(SELECTIONS_KEY);
    } catch (err: any) { setErrorMsg(err.message || "Something went wrong"); setPhase("error"); }
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    setCouponError("");
    sessionStorage.setItem(SELECTIONS_KEY, JSON.stringify(sel));
    try {
      const body: Record<string, string> = { toolType: "blueprint" };
      if (couponCode.trim()) body.couponCode = couponCode.trim();
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-tool-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      if (data.free && data.toolToken) { updateToken(data.toolToken); setCouponApplied(true); runAnalysis(sel, data.toolToken); return; }
      if (data.error) { setCouponError(data.error); setPurchaseLoading(false); return; }
      if (data.url) { window.location.href = data.url; }
      else { setErrorMsg("Could not create checkout session."); setPurchaseLoading(false); }
    } catch (err: any) { setErrorMsg(err.message || "Purchase failed"); setPurchaseLoading(false); }
  };

  const handleSubmit = () => { if (toolToken) runAnalysis(sel, toolToken); else handlePurchase(); };

  // ─── Post-Report Chat ───

  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: chatInput.trim() };
    setChatMessages(p => [...p, userMsg]);
    setChatInput("");
    setChatLoading(true);
    setChatError("");
    let ac = "";
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tools-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: [...chatMessages, userMsg], reportContext: report }),
      });
      if (!resp.ok) throw new Error((await resp.json().catch(() => ({}))).error || `Error ${resp.status}`);
      if (!resp.body) throw new Error("No stream");
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || !line.trim() || !line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") break;
          try {
            const c = JSON.parse(j).choices?.[0]?.delta?.content;
            if (c) {
              ac += c;
              setChatMessages(p => {
                const last = p[p.length - 1];
                if (last?.role === "assistant") return p.map((m, i) => i === p.length - 1 ? { ...m, content: ac } : m);
                return [...p, { role: "assistant", content: ac }];
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (err: any) { setChatError(err.message || "Chat failed"); }
    finally { setChatLoading(false); }
  }, [chatInput, chatLoading, chatMessages, report]);

  const handleDownload = useCallback(() => {
    const ind = sel.industry === "Other" ? sel.customIndustry : sel.industry;
    const clientReport = report.replace(/## \[ADMIN:[\s\S]*$/, "").trim();
    openBrandedPdf({
      title: `Digital Blueprint — ${ind}`,
      subtitle: `${sel.geographyScope === "National" ? "National" : sel.targetLocations.join(", ") || sel.customLocation || sel.geographyScope} • ${sel.yearsInBusiness}`,
      report: clientReport,
    });
  }, [report, sel]);

  // Filter admin block from displayed sections
  const clientReport = report.replace(/## \[ADMIN:[\s\S]*$/, "").trim();
  const sections = clientReport.split(/(?=^## )/m).filter(s => s.trim()).map(s => {
    const m = s.match(/^## (.+)/);
    return { title: m?.[1] || "", content: s };
  });

  const topicCount = countTopics(sel);

  // Review data for display
  const reviewRows = [
    { label: t.language_label, value: sel.lang ? langNames[sel.lang as Lang] : "English" },
    { label: t.industry, value: sel.industry },
    sel.businessName ? { label: t.business_name, value: sel.businessName } : null,
    { label: t.geography, value: sel.geographyScope === "National" ? "National" : [...sel.targetLocations, ...(sel.customLocation.trim() ? [sel.customLocation.trim()] : [])].join(", ") || sel.geographyScope },
    { label: t.presence, value: sel.presence.join(", ") || "—" },
    sel.selectedSocials.length > 0 ? { label: t.social_platforms, value: sel.selectedSocials.join(", ") } : null,
    { label: t.time_weekly, value: sel.timeWeekly || "—" },
    { label: t.content_method, value: sel.contentMethod || "—" },
    { label: t.budget, value: sel.budget || "Not specified" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <SEOHead title="Digital Blueprint | Mitryxa" description="Complete digital growth assessment — AI-powered multilingual report with website audit, social media analysis, market research, and 12-month roadmap." />
      <div className="relative min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-28 pb-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
              <Compass size={14} className="text-primary" />
              Mitryxa Digital Blueprint™
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              {t.tagline}{t.tagline ? " " : ""}<span className="text-gradient">{t.tagline_accent}</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{t.subtitle}</p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10">
              <DollarSign size={14} className="text-primary" />
              <span className="text-sm font-mono text-muted-foreground">{t.price_label} <span className="text-foreground font-semibold">{TOOL_PRICE}</span></span>
            </div>
          </div>

          {/* ─── INTAKE PHASE (AI Chat) ─── */}
          {phase === "intake" && (
            <div className="max-w-xl mx-auto">
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 flex items-center gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${i < topicCount ? "bg-primary" : "bg-primary/10"}`} />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground ml-3">{topicCount}/7 {t.topics_covered}</span>
              </div>

              {/* Chat container */}
              <div className="glass-terminal rounded-xl overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-primary to-secondary" />
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4" id="intake-chat-scroll">
                  {intakeMessages.map((msg, i) => (
                    <div key={i}>
                      <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-primary/10 text-foreground font-mono"
                            : "bg-secondary/5 text-muted-foreground"
                        }`}>
                          <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      {/* Quick-tap chips */}
                      {msg.role === "assistant" && msg.options && msg.options.length > 0 && i === intakeMessages.length - 1 && !intakeLoading && (
                        <div className="space-y-2 mt-2 ml-1">
                          <div className="flex flex-wrap gap-1.5">
                            {msg.options.map((option) => {
                              const isMulti = msg.optionType === "multi";
                              const isSelected = isMulti && selectedChips.includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleChipClick(option, msg.optionType || "single")}
                                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all duration-200 ${
                                    isSelected
                                      ? "border-primary/50 text-primary bg-primary/10"
                                      : "border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                                  }`}
                                >
                                  {isMulti && isSelected && <Check size={10} className="inline mr-1" />}
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          {msg.optionType === "multi" && selectedChips.length > 0 && (
                            <button
                              type="button"
                              onClick={handleMultiSubmit}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              <Check size={12} />
                              Submit ({selectedChips.length})
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {intakeLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/5 rounded-lg px-3 py-2.5 flex items-center gap-2">
                        <TerminalCodeStream />
                      </div>
                    </div>
                  )}
                  {intakeError && (
                    <div className="flex justify-center">
                      <p className="text-xs text-destructive font-mono bg-destructive/5 px-3 py-2 rounded-lg">{intakeError}</p>
                    </div>
                  )}
                  <div ref={intakeEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-primary/10 p-3">
                  <form onSubmit={e => { e.preventDefault(); handleIntakeSend(); }} className="flex gap-2">
                    <input
                      ref={intakeInputRef}
                      type="text"
                      value={intakeInput}
                      onChange={e => setIntakeInput(e.target.value.slice(0, 500))}
                      placeholder={t.intake_placeholder}
                      disabled={intakeLoading}
                      className="flex-1 bg-background/50 border border-primary/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={intakeLoading || !intakeInput.trim()}
                      className="px-3 py-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                  <p className="text-[10px] font-mono text-muted-foreground/40 mt-1 text-right">{intakeInput.length}/500</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── REVIEW PHASE ─── */}
          {phase === "review" && (
            <div className="max-w-xl mx-auto">
              <div className="glass-terminal rounded-xl p-6" style={{ animation: "fade-up 0.3s ease-out" }}>
                <h2 className="text-lg font-mono font-bold text-foreground mb-1">{t.step9_title}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.review_confirm} {!toolToken && <>{t.review_costs} <span className="text-foreground font-semibold">{TOOL_PRICE}</span>.</>}
                </p>
                <div className="space-y-3 text-sm font-mono">
                  {reviewRows.map((row, i) => (
                    <div key={i} className={`flex justify-between ${i < reviewRows.length - 1 ? "border-b border-primary/10 pb-2" : "pb-2"}`}>
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="text-foreground text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}
                </div>
                {!toolToken && (
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <label className="text-xs font-mono text-muted-foreground mb-2 block">{t.coupon_label}</label>
                    <input type="text" value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      placeholder={t.coupon_placeholder} className="w-full bg-background/50 border border-primary/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/30 font-mono" />
                    {couponError && <p className="text-xs text-destructive mt-1 font-mono">{couponError}</p>}
                  </div>
                )}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/10">
                  <button onClick={() => setPhase("intake")} className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={12} /> {t.back}
                  </button>
                  <button onClick={handleSubmit} disabled={purchaseLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold rounded-lg bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all disabled:opacity-40">
                    {purchaseLoading ? <><Loader2 size={14} className="animate-spin" /> {t.redirecting}</> :
                     toolToken ? <><Zap size={14} /> {t.generate}</> :
                     <><DollarSign size={14} /> {t.pay_btn}</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analyzing */}
          {phase === "analyzing" && !report && (
            <div className="max-w-xl mx-auto glass-terminal rounded-xl p-6 text-center">
              <Cpu size={24} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm font-mono text-muted-foreground">{t.scanning}</p>
            </div>
          )}

          {/* Report */}
          {(phase === "analyzing" || phase === "complete") && report && (
            <div ref={reportRef} className="max-w-4xl mx-auto space-y-6">
              {phase === "analyzing" && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Cpu size={16} className="text-primary animate-spin" />
                  <span className="text-sm font-mono text-muted-foreground">{t.analyzing}</span>
                </div>
              )}
              {phase === "complete" && (
                <div ref={actionRowRef} className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => setChatOpen(!chatOpen)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare size={14} />{chatOpen ? t.hide_chat : t.discuss}
                  </button>
                  <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <FileDown size={14} />{t.download}
                  </button>
                  <button onClick={() => setTalkOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg glass text-muted-foreground hover:text-foreground transition-colors">
                    <Send size={14} />{t.talk}
                  </button>
                </div>
              )}
              {sections.map((section, i) => (
                <div key={i} className="glass-terminal rounded-xl overflow-hidden" style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s both` }}>
                  <div className="h-[2px] bg-gradient-to-r from-primary to-secondary" />
                  <div className="p-5">
                    {section.title && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">{getIconForSection(section.title)}</div>
                        <h2 className="text-base font-mono font-bold text-foreground">{section.title}</h2>
                      </div>
                    )}
                    <div className="prose prose-sm prose-invert max-w-none text-muted-foreground [&_strong]:text-foreground [&_h3]:text-foreground [&_h3]:text-sm [&_h3]:font-mono [&_li]:text-muted-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content.replace(/^## .+\n/, "")}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div className="max-w-xl mx-auto glass-terminal rounded-xl p-6 border-destructive/30 text-center">
              <Shield size={24} className="text-destructive mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-mono mb-4">{errorMsg}</p>
              <button onClick={() => { setPhase("review"); setErrorMsg(""); }} className="text-xs font-mono text-primary hover:underline">{t.try_again}</button>
            </div>
          )}
        </div>
      </div>

      <ReportChatPanel
        open={chatOpen && phase === "complete"}
        onClose={() => setChatOpen(false)}
        title={t.discuss}
        placeholder={t.chat_placeholder}
        emptyText={t.chat_empty}
        messages={chatMessages}
        loading={chatLoading}
        error={chatError}
        input={chatInput}
        onInputChange={setChatInput}
        onSend={handleChatSend}
      />

      <TalkToMitryxa
        open={talkOpen}
        onClose={() => setTalkOpen(false)}
        toolType="blueprint"
        reportMarkdown={report}
        metadata={{
          language: sel.lang ? langNames[sel.lang as Lang] : "English",
          industry: sel.industry,
          businessName: sel.businessName,
          geography: sel.geographyScope === "National" ? "National" : [...sel.targetLocations, ...(sel.customLocation.trim() ? [sel.customLocation.trim()] : [])].join(", "),
          presence: sel.presence,
          selectedSocials: sel.selectedSocials,
          timeWeekly: sel.timeWeekly,
          skills: sel.skills,
          contentMethod: sel.contentMethod,
          budget: sel.budget,
          painPoints: sel.painPoints,
          goals: sel.goals,
        }}
      />

      <StickyReportActions
        visible={showStickyActions && phase === "complete"}
        onDiscuss={() => setChatOpen(!chatOpen)}
        onDownload={handleDownload}
        onTalk={() => setTalkOpen(true)}
        chatOpen={chatOpen}
        labels={{ discuss: t.discuss, hideChat: t.hide_chat, download: t.download, talk: t.talk }}
      />
    </>
  );
};


export default function Blueprint() {
  return (
    <Suspense fallback={null}>
      <BlueprintInner />
    </Suspense>
  );
}
