'use client';

import { ChevronRight } from "lucide-react";

const CtaChevrons = () => (
  <span className="cta-chevrons">
    <ChevronRight size={16} strokeWidth={2.5} />
    <ChevronRight size={16} strokeWidth={2.5} style={{ marginLeft: -8 }} />
    <ChevronRight size={16} strokeWidth={2.5} style={{ marginLeft: -8 }} />
  </span>
);

export default CtaChevrons;
