"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

export default function BadgePrinter({ visitor }: { visitor: any }) {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (printing) {
      window.print();
      setPrinting(false);
    }
  }, [printing]);

  return (
    <>
      <button 
        type="button" 
        onClick={() => setPrinting(true)} 
        className="btn btn-outline" 
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem", gap: "0.25rem", color: "var(--primary)", borderColor: "var(--primary-light)" }}
      >
        <Printer size={14} /> Print
      </button>

      {printing && (
        <div id="printable-badge" style={{ padding: "20px", border: "2px solid #000", width: "4in", height: "3in", fontFamily: "sans-serif", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", background: "#fff" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px", marginTop: "0", letterSpacing: "2px" }}>VISITOR</h2>
          <h1 style={{ fontSize: "42px", margin: "10px 0", color: "#000", fontWeight: 800 }}>{visitor.full_name}</h1>
          <p style={{ fontSize: "20px", color: "#333", margin: "5px 0" }}>Host: {visitor.host_name}</p>
          <p style={{ fontSize: "18px", color: "#555", margin: "5px 0" }}>{visitor.purpose}</p>
          <div style={{ marginTop: "20px", padding: "10px", borderTop: "2px dashed #ccc", borderBottom: "2px dashed #ccc", fontWeight: "bold", fontSize: "24px" }}>
            {visitor.badge_number || "V-GUEST"}
          </div>
          <p style={{ marginTop: "20px", fontSize: "14px", color: "#000" }}>
            Date: {new Date(visitor.check_in_time).toLocaleDateString()}
          </p>
        </div>
      )}
    </>
  );
}
