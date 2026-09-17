# Enterprise Master Services & Software License Agreement (MSA)

**NOTICE: THIS IS A BINDING LEGAL AGREEMENT GOVERNING THE LICENSING AND COMMERCIAL USE OF THE ZERO-TRUST DATA SANITIZATION (ZTDS) SOFTWARE ENGINE AND ASSOCIATED DEVELOPER INFRASTRUCTURE.**

---

**EFFECTIVE DATE:** [Effective Date, e.g., Date of Signature on Order Form]  
**LICENSOR:** Ilya Sibiryakov / BrandMeWeb ecosystem ("Licensor")  
**CUSTOMER:** [Customer Legal Entity Name] ("Customer" or "Licensee")  

This Enterprise Master Services & Software License Agreement ("Agreement" or "MSA") is entered into by and between Licensor and Customer. Licensor and Customer may each be referred to individually as a "Party" or collectively as the "Parties."

---

## 1. Definitions

1.1. **"Authorized Node"** means an individual server instance, virtual machine, container, or AWS Nitro Enclave deployed by Customer within its internal network infrastructure authorized to execute the Software as specified in an applicable Order Form.

1.2. **"Customer Data"** means all electronic data, prompts, text, code, documents, and other materials submitted by or on behalf of Customer into the Software for de-identification and tokenization.

1.3. **"Documentation"** means the technical specifications, API documentation, developer guides, and architectural whitepapers provided by Licensor relating to the Software, including ZTDS RFC v1.0.

1.4. **"Order Form"** means a written ordering document or Schedule A executed by the Parties specifying the Software components, license tier, Authorized Node count, fees, and subscription term.

1.5. **"Software"** means the proprietary Zero-Trust Data Sanitization engine, libraries (including `@privacyscrubber/sdk` and `@privacyscrubber/mcp-server`), WebAssembly modules, regex entity taxonomy profiles, and compiled binary executables provided by Licensor.

1.6. **"ZTDS Invariants"** means the four foundational operational principles set forth in ZTDS RFC v1.0: (i) Invariant 1: Zero External Egress prior to local sanitization; (ii) Invariant 2: Deterministic Reversible Tokenization; (iii) Invariant 3: Verifiable Volatile RAM Execution; and (iv) Invariant 4: Zero Subprocessor Liability under GDPR Article 28.

---

## 2. License Grant, Scope & Operational Boundaries

2.1. **License Grant:** Subject to the terms and conditions of this Agreement and the applicable Order Form, Licensor grants Customer a non-exclusive, non-transferable, non-sublicensable, worldwide license during the Subscription Term to install, compile, embed, and execute the Software strictly within Customer's internal applications, microservices, and AI workflows across the agreed number of Authorized Nodes.

2.2. **Air-Gapped & Zero-Telemetry Operation:** Customer is expressly authorized to deploy and operate the Software in 100% disconnected, air-gapped, SCIF, or private Virtual Private Cloud (VPC) environments without internet connectivity. Licensor warrants that the Software contains no phone-home mechanisms, license-check telemetry beacons, or external socket dependencies that would inhibit operation in air-gapped networks.

2.3. **License Restrictions:** Customer shall not, directly or indirectly:
(a) Decompile, disassemble, reverse engineer, or attempt to derive the underlying source heuristics or training sets of the Software, except to the extent express permission cannot be excluded by applicable statutory law;
(b) Extract, decouple, or harvest regex entity dictionaries, pattern taxonomies, or algorithmic rule sets for the purpose of creating or training a competing standalone data sanitization product or service;
(c) Sublicense, resell, rent, lease, distribute, or operate the Software on a commercial service bureau or SaaS basis for third parties;
(d) Remove, alter, or obscure any proprietary copyright, patent, trademark, or confidentiality notices appearing on or within the Software; or
(e) Bypass, disable, or circumvent any local cryptographic validation controls configured in the Software.

---

## 3. Intellectual Property Rights & Data Ownership

3.1. **Licensor Ownership:** Licensor retains all right, title, and interest, including all worldwide intellectual property and proprietary rights, in and to the Software, Documentation, regex profiles, algorithmic heuristics, derivative works, and all patentable or copyrightable subject matter associated with the ZTDS architecture. No rights are granted to Customer except the limited express licenses set forth herein.

3.2. **Customer Data Ownership:** Customer retains exclusive ownership of all right, title, and interest in and to Customer Data. The Software operates strictly as a localized computational utility within Customer's volatile host memory. Licensor never obtains possession, custody, title, or control over Customer Data, cleartext prompts, or reconstituted outputs.

3.3. **Feedback:** If Customer provides suggestions, recommendations, or feedback regarding the Software, Licensor shall be free to utilize and incorporate such feedback without restriction or financial obligation, provided Customer's Confidential Information is not disclosed.

---

## 4. Fees, Billing & Payment Terms

4.1. **Fees:** Customer agrees to pay the annual or multi-year subscription fees specified in the applicable Order Form. All payment obligations are non-cancelable and fees paid are non-refundable, except as expressly provided in Section 7.2.

4.2. **Invoicing & Payment:** Subscription fees are invoiced annually in advance upon execution of the Order Form. All invoices are due and payable within thirty (30) days from the date of invoice (Net 30) via wire transfer, ACH, or designated corporate credit card.

4.3. **Taxes:** All stated fees are exclusive of applicable value-added, sales, use, withholding, or excise taxes imposed by any governmental authority. Customer shall be responsible for all such taxes, excluding taxes based solely on Licensor's net income.

4.4. **Overdue Payments:** Undisputed amounts not paid within thirty (30) days of the due date may accrue interest at the rate of 1.5% per month or the maximum statutory rate permitted by law, whichever is lower.

---

## 5. Confidentiality

5.1. **Scope:** "Confidential Information" means all non-public information disclosed by one Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information. Software source code, compiled binaries, pricing, and architecture constitute Confidential Information of Licensor. Customer Data and internal security configurations constitute Confidential Information of Customer.

5.2. **Obligations:** The Receiving Party agrees to: (i) protect the Disclosing Party's Confidential Information using at least the same degree of care it uses for its own confidential information, but in no event less than reasonable care; and (ii) not disclose Confidential Information to any third party, except to its employees, contractors, and legal/financial advisors who have a strict need to know and are bound by confidentiality obligations at least as restrictive as those herein.

5.3. **Exclusions:** Confidential Information does not include information that: (a) becomes publicly known through no breach of the Receiving Party; (b) was already known to the Receiving Party prior to disclosure; (c) is independently developed without reference to the Disclosing Party's Confidential Information; or (d) is required to be disclosed by statutory law or court order, provided prompt written notice is given to the Disclosing Party.

---

## 6. Warranties & Disclaimers

6.1. **Mutual Warranties:** Each Party represents and warrants that it has the full legal power and authority to enter into and perform this Agreement.

6.2. **Limited Technical Warranty:** Licensor warrants that, upon initial delivery and throughout the active Subscription Term, the Software will substantially conform to the Documentation and will comply with ZTDS Invariant 1 (zero socket egress prior to sanitization) and Invariant 3 (volatile memory execution) under standard operating conditions. In the event of a material breach of this warranty, Customer's sole and exclusive remedy shall be for Licensor to use commercially reasonable efforts to correct the non-conformity within thirty (30) days of written notice, failing which Customer may terminate the applicable Order Form and receive a pro-rata refund of prepaid fees for the remaining unused subscription period.

6.3. **WARRANTY DISCLAIMER:** EXCEPT AS EXPRESSLY PROVIDED IN SECTION 6.2, THE SOFTWARE AND DOCUMENTATION ARE PROVIDED "AS IS" AND "AS AVAILABLE." LICENSOR MAKES NO WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, AND SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL OPERATE ERROR-FREE OR UNINTERRUPTED, OR THAT IT WILL PREVENT ALL POSSIBLE FORMS OF PROMPT INJECTION, DATA EXTRACTION, OR UNFORESEEN THIRD-PARTY AI MODEL FAILURES.

---

## 7. Indemnification

7.1. **Licensor IP Indemnity:** Licensor shall defend, indemnify, and hold harmless Customer from and against any third-party claim, suit, or proceeding alleging that the Software infringes any valid patent, copyright, or trademark, and shall pay all damages finally awarded against Customer or agreed in settlement. Licensor's obligations under this Section do not apply to claims arising from: (a) unauthorized modification of the Software; (b) combination of the Software with hardware or software not provided or approved by Licensor; or (c) use of the Software in violation of this Agreement.

7.2. **Customer Indemnity:** Customer shall defend, indemnify, and hold harmless Licensor from and against any third-party claim, loss, or liability arising out of Customer's violation of applicable law, infringement of third-party privacy rights through unlawful Customer Data ingestion, or breach of Section 2.3 (License Restrictions).

---

## 8. Limitation of Liability

8.1. **WAIVER OF CONSEQUENTIAL DAMAGES:** IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF REVENUE, PROFITS, BUSINESS, DATA, OR REPUTATIONAL HARM, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, REGARDLESS OF THE THEORY OF LIABILITY (WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

8.2. **AGGREGATE LIABILITY CAP:** EXCEPT FOR GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR INDEMNIFICATION OBLIGATIONS UNDER SECTION 7, EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE TOTAL FEES ACTUALLY PAID BY CUSTOMER TO LICENSOR UNDER THE APPLICABLE ORDER FORM IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.

---

## 9. Term, Renewal & Termination

9.1. **Term:** This Agreement commences on the Effective Date and continues until all active Order Forms have expired or been terminated.

9.2. **Order Form Renewal:** Each Order Form automatically renews for successive twelve (12) month terms unless either Party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.

9.3. **Termination for Cause:** Either Party may terminate this Agreement or any Order Form upon written notice if the other Party materially breaches this Agreement and fails to cure such breach within thirty (30) days of receiving written notice thereof.

9.4. **Effect of Termination:** Upon termination or expiration of this Agreement: (i) all licenses granted herein shall terminate immediately; (ii) Customer shall cease all use of the Software and permanently delete all copies of compiled binaries and Documentation; and (iii) within thirty (30) days, an executive officer of Customer shall certify in writing that all instances have been decommissioned and memory buffers cleared. Sections 1, 2.3, 3, 4, 5, 6.3, 7, 8, 9.4, and 10 shall survive termination.

---

## 10. General Provisions

10.1. **Compliance with Laws & Export Control:** Each Party agrees to comply with all applicable local and international laws. Customer warrants that it will not export or re-export the Software in violation of applicable export control regulations.

10.2. **Governing Law & Dispute Resolution:** This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware (or, for customers domiciled in EMEA, the laws of the State of Israel), without regard to its conflict of laws principles. Any dispute arising out of this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) or the Israeli Institute of Commercial Arbitration in the English language.

10.3. **Severability & Waiver:** If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. No failure or delay in exercising any right under this Agreement shall constitute a waiver thereof.

10.4. **Entire Agreement:** This Agreement, together with all executed Order Forms, constitutes the complete and exclusive understanding between the Parties and supersedes all prior agreements, proposals, representations, or understandings, whether written or oral.

---

### IN WITNESS WHEREOF, the Parties have executed this Agreement by their duly authorized representatives.

**FOR LICENSOR:**  
Signature: ___________________________________  
Name: Ilya Sibiryakov  
Title: Founder & Chief Architect  
Entity: BrandMeWeb / ZTDS AI Ecosystem  
Date: _______________________________________  

**FOR CUSTOMER:**  
Signature: ___________________________________  
Name: _______________________________________  
Title: ________________________________________  
Entity: ______________________________________  
Date: _______________________________________  
