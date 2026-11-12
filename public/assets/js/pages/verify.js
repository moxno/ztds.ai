(function () {
  'use strict';

(function() {
      "use strict";

      // ZTDS Official Ed25519 SPKI Public Key (Base64)
      const DEFAULT_SPKI_B64 = "MCowBQYDK2VwAyEAg3N98ZgL4Uqbu0PmqvG8KN8vUicYkgKfUNVgwlLObr4=";

      // Sample Pre-generated Tokens
      const SAMPLES = {
        valid: "ZTDS-CERT-v1.eyJhdXRob3JpdHkiOiJaVERTIEFJIENvbnNvcnRpdW0gJiBTdGFuZGFyZHMgQXV0aG9yaXR5IChCcmFuZE1lV2ViIEVjb3N5c3RlbSkiLCJiYWRnZV91cmwiOiJodHRwczovL3p0ZHMuYWkvYmFkZ2UvcHJpdmFjeXNjcnViYmVyLXdlYi5zdmciLCJjZXJ0aWZpY2F0ZV9pZCI6IlpURFMtQ0VSVC0yMDI2LVBSSVZBQ1lTQ1JVQkJFUi1XRUItRDAyREM2IiwiZXhwaXJlc19hdCI6IjIwMjctMDktMjZUMTk6MzU6NDUuMzM2WiIsImludmFyaWFudHMiOnsiaW52YXJpYW50XzFfemVyb19lZ3Jlc3MiOiJQQVNTIiwiaW52YXJpYW50XzJfcmV2ZXJzaWJsZV90b2tlbnMiOiJQQVNTIiwiaW52YXJpYW50XzNfaW5fbWVtb3J5X2lzb2xhdGlvbiI6IlBBU1MiLCJpbnZhcmlhbnRfNF96ZXJvX3N1YnByb2Nlc3NvcnMiOiJQQVNTIn0sImlzc3VlZF9hdCI6IjIwMjYtMDktMjZUMTk6MzU6NDUuMzM2WiIsImxldmVsIjoiTGV2ZWwgMjogVmVyaWZpZWQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uIiwicmVnaXN0cnlfdmVyaWZpY2F0aW9uX3VybCI6Imh0dHBzOi8venRkcy5haS9yZWdpc3RyeS8jcHJpdmFjeXNjcnViYmVyLXdlYiIsInNwZWNpZmljYXRpb25fdXJsIjoiaHR0cHM6Ly96dGRzLmFpL3N0YW5kYXJkLyIsInN0YW5kYXJkIjoiWlREUyBSRkMgdjEuMCIsInN1YmplY3QiOnsiYXBwbGljYW50IjoiSWx5YSBTaWJpcnlha292IChCcmFuZE1lV2ViKSIsImF1ZGl0X2hhc2giOiJzaGEyNTY6N2Y4M2IxNjU5YTcyZDNlMTEwNGU2YzcwYjhhMjQ1ZDhiNzZjOTRmYTEwYjk4MWU3ZDIzZjQ2YTgxZTlkMGMyNCIsImNhdGVnb3J5IjoiQ2xpZW50LVNpZGUgRGF0YSBTYW5pdGl6YXRpb24gQXBwIiwicHJvZHVjdCI6IlByaXZhY3lTY3J1YmJlciBXZWIiLCJyZXBvc2l0b3J5IjoiaHR0cHM6Ly9wcml2YWN5c2NydWJiZXIuY29tP3V0bV9zb3VyY2U9enRkcy5haSZ1dG1fbWVkaXVtPWVjb3N5c3RlbV9yZWdpc3RyeSZ1dG1fY2FtcGFpZ249Y2Fub25pY2FsX3Bpb25lZXIiLCJzY2FubmVkX2ZpbGVzX2NvdW50IjowfSwidmFsaWRpdHlfZGF5cyI6MzY1fQ.PrhvPJuiUREyCyixifE21aszcV_zlGMsk7PcZKamUoj3c5x73E4I2BMgHf7oT3G2aMY9ESOYKTJLC5CSb9qUDg",
        tampered: "ZTDS-CERT-v1.eyJhdXRob3JpdHkiOiJaVERTIEFJIENvbnNvcnRpdW0gJiBTdGFuZGFyZHMgQXV0aG9yaXR5IChCcmFuZE1lV2ViIEVjb3N5c3RlbSkiLCJiYWRnZV91cmwiOiJodHRwczovL3p0ZHMuYWkvYmFkZ2UvcHJpdmFjeXNjcnViYmVyLXdlYi5zdmciLCJjZXJ0aWZpY2F0ZV9pZCI6IlpURFMtQ0VSVC0yMDI2LVBSSVZBQ1lTQ1JVQkJFUi1XRUItRDAyREM2IiwiZXhwaXJlc19hdCI6IjIwMjctMDktMjZUMTk6MzU6NDUuMzM2WiIsImludmFyaWFudHMiOnsiaW52YXJpYW50XzFfemVyb19lZ3Jlc3MiOiJQQVNTIiwiaW52YXJpYW50XzJfcmV2ZXJzaWJsZV90b2tlbnMiOiJQQVNTIiwiaW52YXJpYW50XzNfaW5fbWVtb3J5X2lzb2xhdGlvbiI6IlBBU1MiLCJpbnZhcmlhbnRfNF96ZXJvX3N1YnByb2Nlc3NvcnMiOiJQQVNTIn0sImlzc3VlZF9hdCI6IjIwMjYtMDktMjZUMTk6MzU6NDUuMzM2WiIsImxldmVsIjoiTGV2ZWwgMjogVmVyaWZpZWQgUmVmZXJlbmNlIEltcGxlbWVudGF0aW9uIiwicmVnaXN0cnlfdmVyaWZpY2F0aW9uX3VybCI6Imh0dHBzOi8venRkcy5haS9yZWdpc3RyeS8jcHJpdmFjeXNjcnViYmVyLXdlYiIsInNwZWNpZmljYXRpb25fdXJsIjoiaHR0cHM6Ly96dGRzLmFpL3N0YW5kYXJkLyIsInN0YW5kYXJkIjoiWlREUyBSRkMgdjEuMCIsInN1YmplY3QiOnsiYXBwbGljYW50IjoiTWFsaWNpb3VzIEltcGVyc29uYXRvciAoSGFja2VkKSIsImF1ZGl0X2hhc2giOiJzaGEyNTY6N2Y4M2IxNjU5YTcyZDNlMTEwNGU2YzcwYjhhMjQ1ZDhiNzZjOTRmYTEwYjk4MWU3ZDIzZjQ2YTgxZTlkMGMyNCIsImNhdGVnb3J5IjoiQ2xpZW50LVNpZGUgRGF0YSBTYW5pdGl6YXRpb24gQXBwIiwicHJvZHVjdCI6IlByaXZhY3lTY3J1YmJlciBXZWIiLCJyZXBvc2l0b3J5IjoiaHR0cHM6Ly9wcml2YWN5c2NydWJiZXIuY29tP3V0bV9zb3VyY2U9enRkcy5haSZ1dG1fbWVkaXVtPWVjb3N5c3RlbV9yZWdpc3RyeSZ1dG1fY2FtcGFpZ249Y2Fub25pY2FsX3Bpb25lZXIiLCJzY2FubmVkX2ZpbGVzX2NvdW50IjowfSwidmFsaWRpdHlfZGF5cyI6MzY1fQ.PrhvPJuiUREyCyixifE21aszcV_zlGMsk7PcZKamUoj3c5x73E4I2BMgHf7oT3G2aMY9ESOYKTJLC5CSb9qUDg",
        expired: "ZTDS-CERT-v1.eyJhdXRob3JpdHkiOiJaVERTIEFJIENvbnNvcnRpdW0gJiBTdGFuZGFyZHMgQXV0aG9yaXR5IChCcmFuZE1lV2ViIEVjb3N5c3RlbSkiLCJiYWRnZV91cmwiOiJodHRwczovL3p0ZHMuYWkvYmFkZ2UvbGVnYWN5LXJhZy1waXBlbGluZS0uc3ZnIiwiY2VydGlmaWNhdGVfaWQiOiJaVERTLUNFUlQtMjAyNi1MRUdBQ1ktUkFHLVBJUEVMSU5FLS01Mjg3MDkiLCJleHBpcmVzX2F0IjoiMjAyNi0wOC0yMlQxOToyNjoxMS40MTRaIiwiaW52YXJpYW50cyI6eyJpbnZhcmlhbnRfMV96ZXJvX2VncmVzcyI6IlBBU1MiLCJpbnZhcmlhbnRfMl9yZXZlcnNpYmxlX3Rva2VucyI6IlBBU1MiLCJpbnZhcmlhbnRfM19pbl9tZW1vcnlfaXNvbGF0aW9uIjoiUEFTUyIsImludmFyaWFudF80X3plcm9fc3VicHJvY2Vzc29ycyI6IlBBU1MifSwiaXNzdWVkX2F0IjoiMjAyNS0wOC0yMlQxOToyNjoxMS40MTRaIiwibGV2ZWwiOiJMZXZlbCAxOiBBdXRvbWF0ZWQgQ1RTIEludmFyaWFudCBDb25mb3JtYW5jZSIsInJlZ2lzdHJ5X3ZlcmlmaWNhdGlvbl91cmwiOiJodHRwczovL3p0ZHMuYWkvcmVnaXN0cnkvI2xlZ2FjeS1yYWctcGlwZWxpbmUtIiwic3BlY2lmaWNhdGlvbl91cmwiOiJodHRwczovL3p0ZHMuYWkvc3RhbmRhcmQvIiwic3RhbmRhcmQiOiJaVERTIFJGQyB2MS4wIiwic3ViamVjdCI6eyJhcHBsaWNhbnQiOiJMZWdhY3kgQUkgTGFicyIsImF1ZGl0X2hhc2giOiJzaGEyNTY6NGEzYjhlNWMyZDFmMGE5YjhjN2Q2ZTVmNGEzYjJjMWQwZTlmOGE3YjZjNWQ0ZTNmMmExYjBjOWQ4ZTdmNmE1YiIsImNhdGVnb3J5IjoiRW50ZXJwcmlzZSBSQUcgSW5nZXN0aW9uIiwicHJvZHVjdCI6IkxlZ2FjeSBSQUcgUGlwZWxpbmUgdjAuOSIsInJlcG9zaXRvcnkiOiJodHRwczovL2dpdGh1Yi5jb20vbGVnYWN5L3JhZy1waXBlbGluZSIsInNjYW5uZWRfZmlsZXNfY291bnQiOjQyfSwidmFsaWRpdHlfZGF5cyI6MzY1fQ.AdUXYc6VIp2-hDNIj016kyjDqKAf4nHEzr8LZyx-SjoEwflmXELfpNUwa6o39RViGlN4EvwSgmZgpEwmE2uSBA"
      };

      // DOM Elements
      const certInput = document.getElementById("certInput");
      const dropZone = document.getElementById("dropZone");
      const dropOverlay = document.getElementById("dropOverlay");
      const fileInput = document.getElementById("fileInput");
      const btnBrowseFile = document.getElementById("btnBrowseFile");
      const fileInfoPill = document.getElementById("fileInfoPill");
      const fileNameMount = document.getElementById("fileNameMount");
      const fileSizeMount = document.getElementById("fileSizeMount");
      const btnRemoveFile = document.getElementById("btnRemoveFile");

      const tokenDiagnosticsBar = document.getElementById("tokenDiagnosticsBar");
      const tokenPartsIndicator = document.getElementById("tokenPartsIndicator");
      const tagPartHeader = document.getElementById("tagPartHeader");
      const tagPartPayload = document.getElementById("tagPartPayload");
      const tagPartSig = document.getElementById("tagPartSig");
      const tokenLengthCount = document.getElementById("tokenLengthCount");
      const formatStatusPill = document.getElementById("formatStatusPill");

      const btnVerify = document.getElementById("btnVerify");
      const btnClear = document.getElementById("btnClear");
      const btnLoadValid = document.getElementById("btnLoadValid");
      const btnLoadTampered = document.getElementById("btnLoadTampered");
      const btnLoadExpired = document.getElementById("btnLoadExpired");
      
      const emptyState = document.getElementById("emptyState");
      const resultsCard = document.getElementById("resultsCard");
      const statusBanner = document.getElementById("statusBanner");
      const statusIconMount = document.getElementById("statusIconMount");
      const statusTitle = document.getElementById("statusTitle");
      const statusPill = document.getElementById("statusPill");
      const statusDescription = document.getElementById("statusDescription");

      const metaCertId = document.getElementById("metaCertId");
      const metaApplicant = document.getElementById("metaApplicant");
      const metaProduct = document.getElementById("metaProduct");
      const metaLevel = document.getElementById("metaLevel");
      const metaIssued = document.getElementById("metaIssued");
      const metaExpires = document.getElementById("metaExpires");
      const metaHash = document.getElementById("metaHash");
      const metaFilesCount = document.getElementById("metaFilesCount");

      const badgeShowcaseCard = document.getElementById("badgeShowcaseCard");
      const verifiedBadgeMount = document.getElementById("verifiedBadgeMount");
      const btnDownloadBadgeSvg = document.getElementById("btnDownloadBadgeSvg");
      const btnDownloadCertJson = document.getElementById("btnDownloadCertJson");
      const badgeMarkdownInput = document.getElementById("badgeMarkdownInput");
      const btnCopyBadgeMd = document.getElementById("btnCopyBadgeMd");
      const badgeHtmlInput = document.getElementById("badgeHtmlInput");
      const btnCopyBadgeHtml = document.getElementById("btnCopyBadgeHtml");

      const btnToggleJson = document.getElementById("btnToggleJson");
      const jsonContainer = document.getElementById("jsonContainer");
      const jsonToggleIcon = document.getElementById("jsonToggleIcon");
      const jsonPayloadMount = document.getElementById("jsonPayloadMount");
      const btnCopyJson = document.getElementById("btnCopyJson");
      const btnCopyReport = document.getElementById("btnCopyReport");

      let currentVerificationResult = null;

      // Base64URL Decoders
      function base64urlToBytes(b64url) {
        let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
        while (b64.length % 4) b64 += "=";
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        return bytes;
      }

      function base64urlToString(b64url) {
        const bytes = base64urlToBytes(b64url);
        return new TextDecoder().decode(bytes);
      }

      // RFC 8785 Canonical JSON Sorter
      function canonicalizeJson(obj) {
        if (obj === null || typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(canonicalizeJson);
        const sortedKeys = Object.keys(obj).sort();
        const sorted = {};
        for (const key of sortedKeys) {
          sorted[key] = canonicalizeJson(obj[key]);
        }
        return sorted;
      }

      // Dynamic Verified Badge SVG Generator (RFC 8032 / ZTDS Standard Geometry)
      function generateVerifiedBadgeSvg(labelRight = "VERIFIED") {
        const wLeft = 58;
        const charWidth = 6.8;
        const cleanLabel = String(labelRight).toUpperCase().trim();
        const wRight = Math.max(64, Math.round(cleanLabel.length * charWidth + 16));
        const totalWidth = wLeft + wRight;
        const textXRight = wLeft + Math.round(wRight / 2);
        const colorRight = "#059669";

        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="22" viewBox="0 0 ${totalWidth} 22" fill="none">
  <defs>
    <clipPath id="ztdsVerifyClip">
      <rect width="${totalWidth}" height="22" rx="4"/>
    </clipPath>
  </defs>
  <g clip-path="url(#ztdsVerifyClip)">
    <rect width="${wLeft}" height="22" fill="#0f172a"/>
    <rect x="${wLeft}" width="${wRight}" height="22" fill="${colorRight}"/>
    <rect width="${totalWidth}" height="22" stroke="#0f172a" stroke-width="1" fill="none"/>
    <g transform="translate(6, 4)">
      <path d="M5.5 1.5C2.5 1.5 1 3.5 1 7C1 10.5 2.5 12.5 5.5 12.5V9.5C3.5 9.5 3.2 8 3.2 7C3.2 6 3.5 4.5 5.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M8.5 1.5C11.5 1.5 13 3.5 13 7C13 10.5 11.5 12.5 8.5 12.5V9.5C10.5 9.5 10.8 8 10.8 7C10.8 6 10.5 4.5 8.5 4.5V1.5Z" fill="#020617" stroke="#10b981" stroke-width="0.8"/>
      <path d="M7 3L9.5 7L7 11L4.5 7Z" fill="#10b981"/>
      <circle cx="7" cy="7" r="1" fill="#38bdf8"/>
    </g>
    <text x="24" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="10" font-weight="700" fill="#f8fafc" letter-spacing="0.5">ZTDS</text>
    <text x="${textXRight}" y="15" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif" font-size="9" font-weight="700" fill="#ffffff" letter-spacing="0.6">${cleanLabel}</text>
  </g>
</svg>`.trim();
      }

      // Download Helper
      function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Real-time Token Diagnostics Bar Updater
      function updateDiagnostics(rawToken) {
        const trimmed = (rawToken || "").trim();
        if (!trimmed) {
          if (tokenLengthCount) tokenLengthCount.textContent = "0 chars";
          if (formatStatusPill) {
            formatStatusPill.className = "px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200";
            formatStatusPill.textContent = "Awaiting Input";
          }
          if (tagPartHeader) {
            tagPartHeader.className = "px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-xs";
            tagPartHeader.textContent = "Header";
          }
          if (tagPartPayload) {
            tagPartPayload.className = "px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-xs";
            tagPartPayload.textContent = "Payload";
          }
          if (tagPartSig) {
            tagPartSig.className = "px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-xs";
            tagPartSig.textContent = "Sig (64B)";
          }
          return;
        }

        const charCount = trimmed.length;
        const byteCount = new TextEncoder().encode(trimmed).length;
        if (tokenLengthCount) tokenLengthCount.textContent = `${charCount} chars (${byteCount} B)`;

        const parts = trimmed.split(".");

        // Header check
        if (parts[0] === "ZTDS-CERT-v1") {
          if (tagPartHeader) {
            tagPartHeader.className = "px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs";
            tagPartHeader.textContent = "Header: v1";
          }
        } else if (parts[0].length > 0) {
          if (tagPartHeader) {
            tagPartHeader.className = "px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-xs";
            tagPartHeader.textContent = "Invalid Header";
          }
        } else {
          if (tagPartHeader) {
            tagPartHeader.className = "px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-xs";
            tagPartHeader.textContent = "Header";
          }
        }

        // Payload check
        if (parts.length > 1 && parts[1].length > 0) {
          if (tagPartPayload) {
            tagPartPayload.className = "px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs";
            tagPartPayload.textContent = `Payload (${parts[1].length}c)`;
          }
        } else {
          if (tagPartPayload) {
            tagPartPayload.className = "px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-xs";
            tagPartPayload.textContent = "Payload";
          }
        }

        // Sig check
        if (parts.length > 2 && parts[2].length > 0) {
          const isSig64B = parts[2].length >= 80 && parts[2].length <= 90;
          if (tagPartSig) {
            tagPartSig.className = isSig64B
              ? "px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs"
              : "px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs";
            tagPartSig.textContent = isSig64B ? "Sig: 64B" : `Sig (${parts[2].length}c)`;
          }
        } else {
          if (tagPartSig) {
            tagPartSig.className = "px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600 text-xs";
            tagPartSig.textContent = "Sig (64B)";
          }
        }

        // Overall format status pill
        if (formatStatusPill) {
          if (parts.length === 3 && parts[0] === "ZTDS-CERT-v1" && parts[1].length > 0 && parts[2].length > 0) {
            formatStatusPill.className = "px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300";
            formatStatusPill.textContent = "3 Segments OK";
          } else if (parts.length > 3) {
            formatStatusPill.className = "px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300";
            formatStatusPill.textContent = `${parts.length} Segments (Invalid)`;
          } else {
            formatStatusPill.className = "px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300";
            formatStatusPill.textContent = `${parts.length}/3 Segments`;
          }
        }
      }

      // File loader helper
      function handleLoadedFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          let content = String(event.target.result || "").trim();
          try {
            if (content.startsWith("{") && content.endsWith("}")) {
              const parsed = JSON.parse(content);
              if (typeof parsed.token === "string") content = parsed.token.trim();
              else if (typeof parsed.certificate_token === "string") content = parsed.certificate_token.trim();
              else if (typeof parsed.cert === "string") content = parsed.cert.trim();
            }
          } catch (ignore) {
            // Keep raw content
          }

          certInput.value = content;
          updateDiagnostics(content);

          if (fileNameMount) fileNameMount.textContent = file.name;
          if (fileSizeMount) {
            const sizeStr = file.size > 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${file.size} B`;
            fileSizeMount.textContent = sizeStr;
          }
          if (fileInfoPill) fileInfoPill.classList.remove("hidden");

          triggerVerification();
        };
        reader.readAsText(file);
      }

      function clearLoadedFile() {
        if (fileInfoPill) fileInfoPill.classList.add("hidden");
        if (fileInput) fileInput.value = "";
      }

      // Client-Side Cryptographic Verifier
      async function executeVerification(tokenString) {
        if (!tokenString || typeof tokenString !== "string") {
          throw new Error("Please provide a non-empty ZTDS certificate token.");
        }

        const trimmed = tokenString.trim();
        const parts = trimmed.split(".");
        if (parts.length !== 3 || parts[0] !== "ZTDS-CERT-v1") {
          throw new Error("Invalid token format. Token must begin with 'ZTDS-CERT-v1' and contain exactly three dot-separated segments.");
        }

        let payload;
        let signatureBytes;
        try {
          const payloadJson = base64urlToString(parts[1]);
          payload = JSON.parse(payloadJson);
          signatureBytes = base64urlToBytes(parts[2]);
        } catch (err) {
          throw new Error("Failed to decode token payload or signature: " + err.message);
        }

        // Canonicalize payload for byte-exact verification
        const canonical = canonicalizeJson(payload);
        const canonicalBytes = new TextEncoder().encode(JSON.stringify(canonical));

        // Import Public SPKI Key via Web Crypto
        let isSignatureValid = false;
        try {
          const spkiBytes = base64urlToBytes(DEFAULT_SPKI_B64);
          const cryptoKey = await window.crypto.subtle.importKey(
            "spki",
            spkiBytes,
            { name: "Ed25519" },
            false,
            ["verify"]
          );

          isSignatureValid = await window.crypto.subtle.verify(
            { name: "Ed25519" },
            cryptoKey,
            signatureBytes,
            canonicalBytes
          );
        } catch (cryptoErr) {
          throw new Error("SubtleCrypto Ed25519 execution error: " + cryptoErr.message);
        }

        const now = new Date();
        const expiresAt = new Date(payload.expires_at);
        const isExpired = now > expiresAt;
        const daysRemaining = Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24)));

        return {
          valid: isSignatureValid && !isExpired,
          signatureValid: isSignatureValid,
          isExpired: isExpired,
          daysRemaining: daysRemaining,
          payload: payload,
          canonicalJson: JSON.stringify(canonical, null, 2),
          token: trimmed
        };
      }

      // Render Verification Results to UI
      function renderResult(result) {
        currentVerificationResult = result;
        emptyState.classList.add("hidden");
        resultsCard.classList.remove("hidden");

        const p = result.payload;

        // Populate Metadata Cards
        metaCertId.textContent = p.certificate_id || "UNKNOWN";
        metaApplicant.textContent = p.subject?.applicant || p.authority || "Unknown Applicant";
        metaProduct.textContent = p.subject?.product || "Unknown Product";
        metaLevel.textContent = p.level || "Level 1: Automated CTS Invariant Conformance";
        metaIssued.textContent = p.issued_at ? new Date(p.issued_at).toLocaleString() : "Unknown";
        
        if (p.expires_at) {
          metaExpires.textContent = `${new Date(p.expires_at).toLocaleDateString()} (${result.daysRemaining} days left)`;
        } else {
          metaExpires.textContent = "Indefinite";
        }

        metaHash.textContent = p.subject?.audit_hash || "sha256:unknown";
        metaFilesCount.textContent = p.subject?.scanned_files_count ? `${p.subject.scanned_files_count} files audited` : "Automated AST scan";
        jsonPayloadMount.textContent = result.canonicalJson;

        const setStatusIconPath = (pathData) => {
          const ns = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(ns, "svg");
          svg.setAttribute("class", "w-6 h-6");
          svg.setAttribute("fill", "none");
          svg.setAttribute("stroke", "currentColor");
          svg.setAttribute("viewBox", "0 0 24 24");
          const pEl = document.createElementNS(ns, "path");
          pEl.setAttribute("stroke-linecap", "round");
          pEl.setAttribute("stroke-linejoin", "round");
          pEl.setAttribute("stroke-width", "2.5");
          pEl.setAttribute("d", pathData);
          svg.appendChild(pEl);
          statusIconMount.replaceChildren(svg);
        };

        // Update Dynamic Banner & Trust Seal
        if (result.valid) {
          statusBanner.className = "p-6 rounded-2xl border bg-emerald-50/90 border-emerald-300 text-emerald-900";
          statusIconMount.className = "w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm";
          setStatusIconPath("M5 13l4 4L19 7");
          statusTitle.textContent = "Cryptographically Authentic & Valid";
          statusPill.className = "text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300";
          statusPill.textContent = "VERIFIED RFC 8032";
          statusDescription.textContent = "Digital signature corresponds exactly to the official ZTDS AI Consortium root key. All four foundational invariants are cryptographically certified with zero network telemetry.";

          // Activate Verified Trust Seal Showcase Card
          if (badgeShowcaseCard) {
            badgeShowcaseCard.classList.remove("hidden");
            const productSlug = (p.subject?.product || "verified").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
            const svgXml = generateVerifiedBadgeSvg("VERIFIED");
            if (verifiedBadgeMount && window.ztdsMountBadgeSvg) {
              window.ztdsMountBadgeSvg(verifiedBadgeMount, "VERIFIED", "#059669");
            }

            const certUrl = `https://ztds.ai/verify/#cert=${encodeURIComponent(result.token)}`;
            const badgeUrl = `https://ztds.ai/badge/${productSlug}.svg`;
            const mdSnippet = `[![ZTDS Verified](${badgeUrl})](${certUrl})`;
            const htmlSnippet = `<a href="${certUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="ZTDS Verified" width="168" height="22" decoding="async" /></a>`;

            if (badgeMarkdownInput) badgeMarkdownInput.value = mdSnippet;
            if (badgeHtmlInput) badgeHtmlInput.value = htmlSnippet;

            if (btnDownloadBadgeSvg) {
              btnDownloadBadgeSvg.onclick = () => {
                downloadFile(`${productSlug}-ztds-verified.svg`, svgXml, "image/svg+xml;charset=utf-8");
              };
            }

            if (btnDownloadCertJson) {
              btnDownloadCertJson.onclick = () => {
                const jsonContent = JSON.stringify(p, null, 2);
                const certIdSlug = (p.certificate_id || productSlug).toLowerCase().replace(/[^a-z0-9-]/g, "-");
                downloadFile(`${certIdSlug}.json`, jsonContent, "application/json;charset=utf-8");
              };
            }

            const btnDownloadCertPdf = document.getElementById("btnDownloadCertPdf");
            if (btnDownloadCertPdf) {
              btnDownloadCertPdf.onclick = () => {
                openCertificateModal(result);
              };
            }

            if (btnCopyBadgeMd) {
              btnCopyBadgeMd.onclick = () => {
                navigator.clipboard.writeText(mdSnippet).then(() => {
                  const prev = btnCopyBadgeMd.textContent;
                  btnCopyBadgeMd.textContent = "Copied!";
                  setTimeout(() => btnCopyBadgeMd.textContent = prev, 2000);
                });
              };
            }

            if (btnCopyBadgeHtml) {
              btnCopyBadgeHtml.onclick = () => {
                navigator.clipboard.writeText(htmlSnippet).then(() => {
                  const prev = btnCopyBadgeHtml.textContent;
                  btnCopyBadgeHtml.textContent = "Copied!";
                  setTimeout(() => btnCopyBadgeHtml.textContent = prev, 2000);
                });
              };
            }
          }
        } else if (!result.signatureValid) {
          if (badgeShowcaseCard) badgeShowcaseCard.classList.add("hidden");
          statusBanner.className = "p-6 rounded-2xl border bg-rose-50/90 border-rose-300 text-rose-900";
          statusIconMount.className = "w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm";
          setStatusIconPath("M6 18L18 6M6 6l12 12");
          statusTitle.textContent = "Signature Tampering Detected";
          statusPill.className = "text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-300";
          statusPill.textContent = "INVALID SIGNATURE";
          statusDescription.textContent = "The cryptographic signature does NOT match the payload contents. The certificate payload has been mutated, corrupted, or forged by an unauthorized party.";
        } else if (result.isExpired) {
          if (badgeShowcaseCard) badgeShowcaseCard.classList.add("hidden");
          statusBanner.className = "p-6 rounded-2xl border bg-amber-50/90 border-amber-300 text-amber-900";
          statusIconMount.className = "w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm";
          setStatusIconPath("M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z");
          statusTitle.textContent = "Certificate Has Expired";
          statusPill.className = "text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-300";
          statusPill.textContent = "EXPIRED TOKEN";
          statusDescription.textContent = `The digital signature is authentic, but the certificate validity period expired on ${new Date(p.expires_at).toLocaleDateString()}. Re-certification required under CAB Policy.`;
        }

        // Update URL hash for sharing
        if (window.location.hash !== `#cert=${encodeURIComponent(result.token)}`) {
          history.replaceState(null, "", `#cert=${encodeURIComponent(result.token)}`);
        }

        // Configure Social Attestation & Share Actions
        const shareX = document.getElementById("btnShareX");
        const shareLinkedin = document.getElementById("btnShareLinkedin");
        const copyBadgeCode = document.getElementById("btnCopyBadgeCode");
        const certUrl = `https://ztds.ai/verify/#cert=${encodeURIComponent(result.token)}`;
        const hashAbbr = p.subject?.audit_hash ? p.subject.audit_hash.slice(0, 16) + "..." : "audited";
        const productName = p.subject?.product || "AI pipeline";
        const tweetText = `Our ${productName} verified 0.00 B data egress, zero sanitization subprocessors (GDPR Art. 28), and Art. 32 Technical Safe Harbor under the ZTDS RFC v1.0 standard (Receipt: ${hashAbbr}). Audited offline in browser RAM:`;

        if (shareX) {
          shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(certUrl)}`;
        }
        if (shareLinkedin) {
          shareLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
        }
        if (copyBadgeCode) {
          const productSlug = (p.subject?.product || "verified").toLowerCase().replace(/[^a-z0-9-]/g, "-");
          copyBadgeCode.onclick = () => {
            const badgeSnippet = `[![ZTDS Verified](https://ztds.ai/badge/${productSlug}.svg)](https://ztds.ai/verify/#cert=${result.token})`;
            navigator.clipboard.writeText(badgeSnippet).then(() => {
              const prev = copyBadgeCode.textContent;
              copyBadgeCode.textContent = "Badge Copied!";
              setTimeout(() => copyBadgeCode.textContent = prev, 2000);
            });
          };
        }
      }

      // Render Error State
      function renderError(errorMessage) {
        currentVerificationResult = null;
        emptyState.classList.add("hidden");
        resultsCard.classList.remove("hidden");
        if (badgeShowcaseCard) badgeShowcaseCard.classList.add("hidden");

        statusBanner.className = "p-6 rounded-2xl border bg-rose-50/90 border-rose-300 text-rose-900";
        statusIconMount.className = "w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm";
        {
          const ns = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(ns, "svg");
          svg.setAttribute("class", "w-6 h-6");
          svg.setAttribute("fill", "none");
          svg.setAttribute("stroke", "currentColor");
          svg.setAttribute("viewBox", "0 0 24 24");
          const pEl = document.createElementNS(ns, "path");
          pEl.setAttribute("stroke-linecap", "round");
          pEl.setAttribute("stroke-linejoin", "round");
          pEl.setAttribute("stroke-width", "2.5");
          pEl.setAttribute("d", "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
          svg.appendChild(pEl);
          statusIconMount.replaceChildren(svg);
        }
        statusTitle.textContent = "Malformed Certificate Format";
        statusPill.className = "text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-300";
        statusPill.textContent = "PARSE ERROR";
        statusDescription.textContent = errorMessage;

        metaCertId.textContent = "N/A";
        metaApplicant.textContent = "N/A";
        metaProduct.textContent = "N/A";
        metaLevel.textContent = "Evaluation Failed";
        metaIssued.textContent = "N/A";
        metaExpires.textContent = "N/A";
        metaHash.textContent = "sha256:none";
        metaFilesCount.textContent = "No data";
        jsonPayloadMount.textContent = `// Error details:\n${errorMessage}`;
      }

      // Primary Verification Controller
      async function triggerVerification() {
        const rawToken = certInput.value.trim();
        if (!rawToken) {
          emptyState.classList.remove("hidden");
          resultsCard.classList.add("hidden");
          if (badgeShowcaseCard) badgeShowcaseCard.classList.add("hidden");
          return;
        }

        try {
          const result = await executeVerification(rawToken);
          renderResult(result);
        } catch (err) {
          renderError(err.message);
        }
      }

      // Event Listeners
      btnVerify.addEventListener("click", triggerVerification);
      
      btnClear.addEventListener("click", () => {
        certInput.value = "";
        clearLoadedFile();
        updateDiagnostics("");
        emptyState.classList.remove("hidden");
        resultsCard.classList.add("hidden");
        if (badgeShowcaseCard) badgeShowcaseCard.classList.add("hidden");
        history.replaceState(null, "", window.location.pathname);
      });

      if (btnRemoveFile) {
        btnRemoveFile.addEventListener("click", () => {
          certInput.value = "";
          clearLoadedFile();
          updateDiagnostics("");
          emptyState.classList.remove("hidden");
          resultsCard.classList.add("hidden");
          if (badgeShowcaseCard) badgeShowcaseCard.classList.add("hidden");
          history.replaceState(null, "", window.location.pathname);
        });
      }

      if (btnBrowseFile && fileInput) {
        btnBrowseFile.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => {
          const file = e.target?.files?.[0];
          if (file) handleLoadedFile(file);
        });
      }

      // Sample Loaders
      btnLoadValid.addEventListener("click", () => {
        clearLoadedFile();
        certInput.value = SAMPLES.valid;
        updateDiagnostics(certInput.value);
        triggerVerification();
      });

      btnLoadTampered.addEventListener("click", () => {
        clearLoadedFile();
        certInput.value = SAMPLES.tampered;
        updateDiagnostics(certInput.value);
        triggerVerification();
      });

      btnLoadExpired.addEventListener("click", () => {
        clearLoadedFile();
        certInput.value = SAMPLES.expired;
        updateDiagnostics(certInput.value);
        triggerVerification();
      });

      // Live typing debounce & diagnostics
      let debounceTimer = null;
      certInput.addEventListener("input", () => {
        updateDiagnostics(certInput.value);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(triggerVerification, 300);
      });

      // Drag and Drop Listeners
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropOverlay.classList.remove("hidden");
      });

      dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropOverlay.classList.add("hidden");
      });

      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropOverlay.classList.add("hidden");
        const file = e.dataTransfer?.files?.[0];
        if (file) {
          handleLoadedFile(file);
        }
      });

      // Raw JSON Accordion
      btnToggleJson.addEventListener("click", () => {
        const isHidden = jsonContainer.classList.contains("hidden");
        if (isHidden) {
          jsonContainer.classList.remove("hidden");
          jsonToggleIcon.textContent = "- Collapse";
        } else {
          jsonContainer.classList.add("hidden");
          jsonToggleIcon.textContent = "+ Expand";
        }
      });

      // Copy Handlers
      btnCopyJson.addEventListener("click", () => {
        if (!currentVerificationResult) return;
        navigator.clipboard.writeText(currentVerificationResult.canonicalJson).then(() => {
          const prev = btnCopyJson.textContent;
          btnCopyJson.textContent = "Copied!";
          setTimeout(() => btnCopyJson.textContent = prev, 2000);
        });
      });

      btnCopyReport.addEventListener("click", () => {
        if (!currentVerificationResult) return;
        const res = currentVerificationResult;
        const report = [
          "===========================================================",
          "ZTDS.AI CRYPTOGRAPHIC CONFORMANCE VERIFICATION REPORT",
          "===========================================================",
          `Certificate ID:   ${res.payload.certificate_id}`,
          `Status:           ${res.valid ? "AUTHENTIC & VALID" : (res.isExpired ? "EXPIRED" : "TAMPERED / INVALID")}`,
          `Applicant:        ${res.payload.subject?.applicant}`,
          `Product:          ${res.payload.subject?.product}`,
          `Conformance Level:${res.payload.level}`,
          `Audit Hash:       ${res.payload.subject?.audit_hash}`,
          `Issued Timestamp: ${res.payload.issued_at}`,
          `Expires At:       ${res.payload.expires_at} (${res.daysRemaining} days remaining)`,
          `RFC 8032 Sig:    ${res.signatureValid ? "VALID" : "INVALID"}`,
          "-----------------------------------------------------------",
          "Four Foundational Invariants:",
          "  [x] Invariant 1: Zero External Egress Prior to Sanitization",
          "  [x] Invariant 2: Deterministic Reversible Tokenization",
          "  [x] Invariant 3: Verifiable Cryptographic Isolation in Volatile RAM",
          "  [x] Invariant 4: Continuous Compliance & Zero Subprocessor Chain",
          "===========================================================",
          `Verification Link: https://ztds.ai/verify/#cert=${encodeURIComponent(res.token)}`
        ].join("\n");

        navigator.clipboard.writeText(report).then(() => {
          const prev = btnCopyReport.textContent;
          btnCopyReport.textContent = "Report Copied to Clipboard!";
          setTimeout(() => btnCopyReport.textContent = prev, 2000);
        });
      });

      function openCertificateModal(result) {
        if (!result || !result.payload) return;
        const p = result.payload;
        const modal = document.getElementById("modalCertificatePrint");
        if (!modal) return;

        const elEntity = document.getElementById("certModalEntityName");
        const elProduct = document.getElementById("certModalProductLine");
        const elId = document.getElementById("certModalId");
        const elLevel = document.getElementById("certModalLevel");
        const elIssued = document.getElementById("certModalIssued");
        const elExpires = document.getElementById("certModalExpires");
        const elHash = document.getElementById("certModalAuditHash");
        const elVerifyUrl = document.getElementById("certModalVerifyUrl");

        if (elEntity) elEntity.textContent = p.subject?.applicant || p.authority || "Official Accredited Participant";
        if (elProduct) elProduct.textContent = p.subject?.product || "Enterprise AI Ingestion Pipeline";
        if (elId) elId.textContent = p.certificate_id || "ZTDS-CERT-PENDING";
        if (elLevel) elLevel.textContent = p.level || "Level 1: Automated CTS Invariant Conformance";
        if (elIssued) elIssued.textContent = p.issued_at ? new Date(p.issued_at).toLocaleString() : "Unknown";
        if (elExpires) elExpires.textContent = p.expires_at ? new Date(p.expires_at).toLocaleString() : "Indefinite";
        if (elHash) elHash.textContent = p.subject?.audit_hash || "sha256:unknown";

        const urlParams = new URLSearchParams(window.location.search);
        const domainSlug = urlParams.get("domain");
        const targetSlug = urlParams.get("target") || urlParams.get("company") || urlParams.get("product") || urlParams.get("id");
        const certUrl = domainSlug
          ? `https://ztds.ai/verify/?domain=${encodeURIComponent(domainSlug)}`
          : targetSlug 
            ? `https://ztds.ai/verify/?target=${encodeURIComponent(targetSlug)}` 
            : `https://ztds.ai/verify/#cert=${encodeURIComponent(result.token)}`;

        if (elVerifyUrl) {
          elVerifyUrl.href = certUrl;
          elVerifyUrl.textContent = certUrl;
        }

        modal.classList.remove("hidden");
      }

      function closeCertificateModal() {
        const modal = document.getElementById("modalCertificatePrint");
        if (modal) modal.classList.add("hidden");
      }

      const btnPrintCertAction = document.getElementById("btnPrintCertAction");
      if (btnPrintCertAction) {
        btnPrintCertAction.addEventListener("click", () => window.print());
      }

      const bannerDownloadCertPdf = document.getElementById("bannerDownloadCertPdf");
      if (bannerDownloadCertPdf) {
        bannerDownloadCertPdf.addEventListener("click", () => {
          if (currentVerificationResult) {
            openCertificateModal(currentVerificationResult);
          }
        });
      }

      const btnCloseCertModal = document.getElementById("btnCloseCertModal");
      if (btnCloseCertModal) {
        btnCloseCertModal.addEventListener("click", closeCertificateModal);
      }

      const modalCertificatePrint = document.getElementById("modalCertificatePrint");
      if (modalCertificatePrint) {
        modalCertificatePrint.addEventListener("click", (e) => {
          if (e.target === modalCertificatePrint) closeCertificateModal();
        });
      }

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCertificateModal();
      });

      function showTargetEntityBanner(entity, type) {
        const banner = document.getElementById("targetEntityBanner");
        if (!banner) return;

        const elSector = document.getElementById("targetEntitySector");
        const elTier = document.getElementById("targetEntityTier");
        const elName = document.getElementById("targetEntityName");
        const elDesc = document.getElementById("targetEntityDesc");
        const elHuman = document.getElementById("targetEntityHumanAssurance");
        const elLink = document.getElementById("targetEntityProfileLink");

        if (elHuman) {
          if (type === "domain") {
            elHuman.classList.remove("hidden");
          } else {
            elHuman.classList.add("hidden");
          }
        }

        if (elSector) {
          elSector.textContent = entity.sector || entity.industry || entity.category || (type === "domain" ? "Plane 6 Protected Web Intake" : "Official Accredited Entity");
        }
        if (elTier) {
          elTier.textContent = type === "company"
            ? (entity.tier || "Level 3: Corporate Member")
            : type === "domain"
              ? (entity.tier || "Level 1: Protected Web Domain")
              : "Level 2: Certified Implementation";
        }
        if (elName) {
          elName.textContent = entity.name || entity.domain || entity.organization || "Accredited Entity";
        }
        if (elDesc) {
          elDesc.textContent = entity.description || entity.summary || "Official participant adhering strictly to the ZTDS RFC v1.0 standard with verified zero-egress architecture.";
        }
        if (elLink) {
          if (type === "company") {
            elLink.href = entity.url || `/companies/#${entity.slug || entity.id}`;
          } else if (type === "domain") {
            elLink.href = entity.url || `https://${entity.domain || entity.slug}`;
            elLink.target = "_blank";
            elLink.rel = "noopener noreferrer";
            const s1 = document.createElement("span");
            s1.textContent = "Visit Protected Site";
            const s2 = document.createElement("span");
            s2.setAttribute("aria-hidden", "true");
            s2.textContent = "\u2197";
            elLink.replaceChildren(s1, s2);
          } else {
            elLink.href = `/registry/#${entity.id || entity.slug}`;
          }
        }

        banner.classList.remove("hidden");
      }

      async function resolveTargetEntity(targetSlug, isDomainLookup = false) {
        if (!targetSlug) return;
        const normalized = targetSlug.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

        try {
          const [regRes, compRes, domRes] = await Promise.all([
            fetch("/data/registry.json").then(r => r.ok ? r.json() : {}).catch(() => ({})),
            fetch("/data/companies.json").then(r => r.ok ? r.json() : {}).catch(() => ({})),
            fetch("/data/domains.json").then(r => r.ok ? r.json() : {}).catch(() => ({}))
          ]);

          const companies = Array.isArray(compRes.companies) ? compRes.companies : [];
          const entities = Array.isArray(regRes.entities) ? regRes.entities : [];
          const domains = Array.isArray(domRes.domains) ? domRes.domains : [];

          // 0. Search Verified Web Domains (Level 1 Installations) first if ?domain= or matching domain
          const foundDomain = domains.find(d =>
            (d.domain && d.domain.toLowerCase() === normalized) ||
            (d.slug && d.slug.toLowerCase() === normalized) ||
            (d.id && d.id.toLowerCase() === normalized) ||
            (d.certificate?.id && d.certificate.id.toLowerCase() === normalized)
          );

          if (foundDomain) {
            showTargetEntityBanner(foundDomain, "domain");
            const token = foundDomain.certificate?.token;
            if (token && !certInput.value.trim()) {
              certInput.value = token;
              updateDiagnostics(token);
              await triggerVerification();
            }
            return;
          }

          // 1. Search companies (Level 3)
          const foundCompany = companies.find(c =>
            (c.slug && c.slug.toLowerCase() === normalized) ||
            (c.id && c.id.toLowerCase() === normalized) ||
            (c.certificate?.id && c.certificate.id.toLowerCase() === normalized) ||
            (c.name && c.name.toLowerCase() === normalized)
          );

          if (foundCompany) {
            showTargetEntityBanner(foundCompany, "company");
            const token = foundCompany.certificate?.token;
            if (token && !certInput.value.trim()) {
              certInput.value = token;
              updateDiagnostics(token);
              await triggerVerification();
            }
            return;
          }

          // 2. Search registry entities (Level 2)
          const foundProduct = entities.find(p =>
            (p.id && p.id.toLowerCase() === normalized) ||
            (p.slug && p.slug.toLowerCase() === normalized) ||
            (p.certificate?.certificate_id && p.certificate.certificate_id.toLowerCase() === normalized) ||
            (p.name && p.name.toLowerCase() === normalized)
          );

          if (foundProduct) {
            showTargetEntityBanner(foundProduct, "product");
            const token = foundProduct.certificate?.token;
            if (token && !certInput.value.trim()) {
              certInput.value = token;
              updateDiagnostics(token);
              await triggerVerification();
            }
            return;
          }

          // 2.5 Live Domain Auto-Discovery & Certificate Issuance via Edge Scanner
          if (isDomainLookup || normalized.includes(".")) {
            const scanRes = await fetch(`/api/scan-domain?domain=${encodeURIComponent(normalized)}&mint=1`)
              .then(r => r.ok ? r.json() : null)
              .catch(() => null);

            if (scanRes && scanRes.domainCertificate && scanRes.domainCertificate.token) {
              const liveDomainEntity = {
                domain: scanRes.domain || normalized,
                name: `${scanRes.domain || normalized} (Protected Web Intake)`,
                tier: "Level 1: Protected Web Domain",
                industry: scanRes.evaluation?.industry?.name || "Plane 6 Web Form Guard",
                url: `https://${scanRes.domain || normalized}`,
                description: `Live ZTDS Plane 6 Web Form Intake installation verified on ${scanRes.domain || normalized}. Form inputs are tokenized in client browser volatile RAM prior to network dispatch.`
              };
              showTargetEntityBanner(liveDomainEntity, "domain");
              if (!certInput.value.trim()) {
                certInput.value = scanRes.domainCertificate.token;
                updateDiagnostics(scanRes.domainCertificate.token);
                await triggerVerification();
              }
              return;
            }
          }

          // 3. Defensive Fallback: Unknown target slug
          const banner = document.getElementById("targetEntityBanner");
          if (banner) {
            banner.className = "mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-300 shadow-sm transition-all";
            const elSector = document.getElementById("targetEntitySector");
            const elTier = document.getElementById("targetEntityTier");
            const elName = document.getElementById("targetEntityName");
            const elDesc = document.getElementById("targetEntityDesc");
            const elLink = document.getElementById("targetEntityProfileLink");
            const btnPdf = document.getElementById("bannerDownloadCertPdf");

            if (elSector) {
              elSector.className = "text-xs font-mono font-bold text-amber-800 uppercase tracking-wider bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full";
              elSector.textContent = "Unregistered Identifier";
            }
            if (elTier) elTier.textContent = "Registry Lookup";
            if (elName) elName.textContent = `Entity "${targetSlug}" Not Found in Verified Ledger`;
            if (elDesc) elDesc.textContent = "No active cryptographic conformance record matches this identifier. Browse the official Verified Registry or paste a 3-part ZTDS-CERT-v1 token below to verify offline.";
            if (btnPdf) btnPdf.classList.add("hidden");
            if (elLink) {
              elLink.href = "/registry/";
              const s1 = document.createElement("span");
              s1.textContent = "Browse Verified Registry";
              const s2 = document.createElement("span");
              s2.setAttribute("aria-hidden", "true");
              s2.textContent = "\u2192";
              elLink.replaceChildren(s1, s2);
            }
            banner.classList.remove("hidden");
          }
        } catch (err) {
          // Fallback gracefully
        }
      }

      // Auto-load token from URL parameters or hash on page load
      window.addEventListener("DOMContentLoaded", async () => {
        const hashMatch = window.location.hash.match(/[#&]cert=([^&]+)/);
        const searchMatch = window.location.search.match(/[?&]cert=([^&]+)/);
        const tokenFromUrl = hashMatch ? decodeURIComponent(hashMatch[1]) : (searchMatch ? decodeURIComponent(searchMatch[1]) : null);
        const urlParams = new URLSearchParams(window.location.search);
        const domainParam = urlParams.get("domain");
        const targetSlug = domainParam || urlParams.get("target") || urlParams.get("company") || urlParams.get("product") || urlParams.get("id");

        if (tokenFromUrl) {
          certInput.value = tokenFromUrl;
          updateDiagnostics(tokenFromUrl);
          await triggerVerification();
        }
        if (targetSlug) {
          await resolveTargetEntity(targetSlug, Boolean(domainParam));
        }
      });

    })();
})();
