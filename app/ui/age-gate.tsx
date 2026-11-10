"use client";

import { useEffect, useState } from "react";

export default function AgeGate() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(localStorage.getItem("afterhours-age-ok") !== "yes"); }, []);
  if (!visible) return null;
  return <div className="age-backdrop" role="dialog" aria-modal="true" aria-labelledby="age-title">
    <div className="age-panel"><span className="eyebrow">AFTERHOURS / 18+</span><h2 id="age-title">Adults only.</h2><p>This site contains sexually explicit material. By continuing, you confirm you are at least 18 years old, or the age of majority where you live.</p><button className="button button-light" onClick={() => { localStorage.setItem("afterhours-age-ok", "yes"); setVisible(false); }}>I am 18 or older <span aria-hidden="true">↗</span></button><a className="leave-link" href="https://www.google.com">I am under 18 — leave</a></div>
  </div>;
}
