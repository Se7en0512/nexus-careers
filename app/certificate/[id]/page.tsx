import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

interface CertRow {
  id: number;
  user_id: number;
  stage_key: string;
  stage_title: string;
  date_issued: string;
}

async function getCertificate(id: string) {
  const row = (await db
    .prepare(
      `SELECT c.*, u.name AS user_name, u.email AS user_email
       FROM certificates c JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`
    )
    .get(Number(id))) as unknown as (CertRow & { user_name: string; user_email: string }) | undefined;
  return row;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const row = await getCertificate(id);
  return { title: row ? `Certificate — ${row.user_name}` : "Certificate" };
}

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getCertificate(id);
  if (!row) notFound();

  const issued = new Date(row.date_issued + "Z").toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const year = new Date().getFullYear();

  return (
    <div className="py-16 px-6">
      <div className="max-w-[860px] mx-auto">
        <div className="mb-8 print:hidden">
          <PrintButton />
        </div>

        <div
          id="certificate"
          className="certificate"
          style={{
            border: "1.5px solid #D9A94E",
            padding: "56px 64px",
            position: "relative",
            background:
              "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(217,169,78,0.08), transparent 55%), linear-gradient(rgba(217,169,78,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(217,169,78,0.05) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 34px 34px, 34px 34px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "1px solid rgba(217,169,78,0.45)",
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "#D9A94E",
                textTransform: "uppercase",
              }}
            >
              Nexus Careers — Official Certificate
            </p>
            <h1
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 44,
                fontWeight: 500,
                marginTop: 26,
                color: "#F4F2EC",
              }}
            >
              Certificate of Completion
            </h1>
            <p style={{ marginTop: 12, color: "#8B93A5", fontSize: 13, fontFamily: "'Public Sans', sans-serif" }}>
              This certifies that
            </p>
            <p
              style={{
                marginTop: 22,
                fontSize: 30,
                fontFamily: "'Newsreader', serif",
                color: "#D9A94E",
              }}
            >
              {row.user_name}
            </p>
            <p
              style={{
                marginTop: 22,
                maxWidth: 480,
                color: "#C6C9CF",
                fontSize: 14.5,
                lineHeight: 1.65,
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              has fully completed the <strong style={{ color: "#F4F2EC" }}>{row.stage_title} Stage</strong> of{" "}
              <strong style={{ color: "#F4F2EC" }}>Nexus Careers Roadmap</strong> — 30 days of foundation, skills,
              and job applications for remote work as a Virtual Assistant.
            </p>
            <p
              style={{
                marginTop: 26,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "#8B93A5",
              }}
            >
              ACHIEVED ON: {issued} · YEAR: {year}
            </p>
            <p
              style={{
                marginTop: 26,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "#8B93A5",
              }}
            >
              #{String(row.id).padStart(6, "0")} · {row.user_email}
            </p>
          </div>
        </div>

        <style>{`
          @media print {
            body * { visibility: hidden; }
            #certificate, #certificate * { visibility: visible; }
            #certificate {
              position: absolute;
              inset: 0;
              width: 100%;
              background: #0B1220 !important;
              border: 1.5px solid #D9A94E !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
