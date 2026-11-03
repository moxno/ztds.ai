'use strict';
/**
 * Content source for /frameworks/ hub + spokes.
 * Every factual external claim here was verified against primary sources on 2026-11-03
 * (OWASP GenAI LLM Top 10 2025 numbering, NIST AI 600-1 July 2024, MCP stdio transport,
 * HIPAA 45 CFR 164.514(b)(2)/(c), GDPR Arts. 5(1)(c), 25, 28, 32 and Recital 26).
 * Neutrality guard: no prices, no internal mechanism terms, no third-party library names.
 */

const REL_STD = { name: 'ZTDS RFC v1.0 Specification', url: '/standard/', note: 'The four invariants referenced on this page.' };
const REL_COMP = { name: 'Global Regulatory Compliance Matrix', url: '/compliance/', note: 'Cross-framework statutory mapping.' };
const REL_SCAN = { name: 'Perimeter Scanner', url: '/scanner/', note: 'Browser-based egress audit with local receipts.' };
const REL_MCP = { name: 'MCP Security Architecture', url: '/mcp/', note: 'In-RAM gateway for Model Context Protocol traffic.' };
const REL_BLUE = { name: 'AI and RAG Blueprints', url: '/blueprints/', note: 'Integration recipes for agent and retrieval stacks.' };
const REL_CISO = { name: 'CISO Procurement Pack', url: '/ciso/', note: 'Vendor-questionnaire and safe harbor material.' };

const INVARIANTS = [
  '<strong>Invariant 1 &mdash; Zero cleartext egress:</strong> identifiers are replaced before any network socket call leaves the host boundary.',
  '<strong>Invariant 2 &mdash; Deterministic reversible surrogates:</strong> tokens such as <code>[EMAIL_1]</code> preserve syntax and meaning so the model remains useful, and the mapping is restored locally.',
  '<strong>Invariant 3 &mdash; Volatile RAM isolation:</strong> the token map lives in host memory only and is zeroized at the end of the session.',
  '<strong>Invariant 4 &mdash; Zero external subprocessors:</strong> no third party participates in the sanitization step.'
];

const PAGES = [
  {
    slug: 'owasp-llm02-sensitive-information-disclosure',
    crumb: 'OWASP LLM02 Sensitive Information Disclosure',
    tag: 'OWASP LLM Top 10 2025',
    blurb: 'Maps pre-egress tokenization to OWASP LLM02:2025 and states what it does not cover.',
    title: 'OWASP LLM02 Sensitive Information Disclosure: PII Controls',
    desc: 'How client-side PII tokenization reduces exposure under OWASP LLM02:2025 Sensitive Information Disclosure, with a control map and explicit coverage limits.',
    keywords: 'OWASP LLM02, Sensitive Information Disclosure, LLM Top 10 2025, PII redaction LLM, prompt data leakage, client-side sanitization, ZTDS',
    headline: 'OWASP LLM02:2025 Sensitive Information Disclosure mapped to ZTDS pre-egress sanitization',
    badge: 'OWASP LLM TOP 10 2025 · LLM02',
    h1: 'OWASP LLM02 Sensitive Information Disclosure: <span class="text-emerald-400">Controlling PII Before It Reaches the Model</span>',
    lead: 'OWASP lists Sensitive Information Disclosure as LLM02 in the 2025 edition of its Top 10 for LLM Applications. ZTDS addresses the input side of that risk: personal data, secrets, and confidential identifiers are tokenized in client memory before a prompt, document, or tool result is sent to any model provider.',
    summary: [
      'LLM02:2025 describes applications that expose confidential data, proprietary information, or private user details because sensitive content was not sanitized or filtered. In practice, much of that exposure begins upstream: employees and agents paste customer records, credentials, and case files into prompts that leave the organization.',
      'ZTDS RFC v1.0 places a deterministic sanitization step inside the client, so the provider only receives surrogate tokens. The original values never cross the network boundary and the token map is destroyed with the session.'
    ],
    mapTitle: 'Control Map: LLM02 Exposure Paths and ZTDS Position',
    mapHeaders: ['Exposure path', 'Risk', 'ZTDS position'],
    mapRows: [
      ['Pasted prompts', 'Customer or employee identifiers reach a third-party provider and its retention systems.', 'Directly addressed. Identifiers are tokenized in RAM before transmission (Invariants 1 and 2).'],
      ['Uploaded documents', 'Contracts, clinical notes, and spreadsheets carry structured identifiers into model context.', 'Directly addressed for structured identifiers; free-text context is reduced through specialized profiles.'],
      ['Agent tool output', 'Tool results returned to the model contain secrets or records.', 'Addressed when the tool call passes through the local gateway (see the MCP mapping).'],
      ['Model output', 'The model reveals memorized training data or prior session content.', 'Out of scope. This requires provider-side and application-side output controls.'],
      ['Provider logging', 'Prompts are retained by the provider and later exposed.', 'Reduced. The provider stores tokens rather than original values.']
    ],
    apply: [
      'ZTDS contributes four invariants to an LLM02 control set:',
      INVARIANTS,
      'Teams typically evidence the control with a local SHA-256 compliance receipt generated at sanitization time, which records entity categories and counts without recording the values themselves.'
    ],
    limits: [
      'It does not mitigate prompt injection (LLM01) or excessive agency (LLM06). Those require separate controls.',
      'It does not prevent a model from emitting sensitive data it learned during training.',
      'Free-text narratives can still carry contextual quasi-identifiers that no pattern-based method removes completely.',
      'It is a technical control, not an OWASP certification. OWASP does not certify products against its Top 10.'
    ],
    faq: [
      { q: 'Which OWASP item covers sensitive data leaving through prompts?', a: 'In the 2025 OWASP Top 10 for LLM Applications, Sensitive Information Disclosure is LLM02:2025. Pre-egress tokenization reduces the amount of sensitive data that reaches a provider, which narrows the input-side exposure that LLM02 describes.' },
      { q: 'Does ZTDS stop an LLM from leaking training data?', a: 'No. ZTDS operates before data leaves the client. It cannot control what a model memorized during training or what it generates; output filtering and provider assurances address that path.' },
      { q: 'How is the control evidenced to an auditor?', a: 'The sanitization step can emit a local SHA-256 compliance receipt listing entity categories and counts. The receipt contains no original values, so it can be shared with auditors without creating a new disclosure.' }
    ],
    related: [REL_STD, REL_SCAN, REL_COMP]
  },
  {
    slug: 'nist-ai-rmf-generative-ai-profile-pii',
    crumb: 'NIST AI RMF Generative AI Profile',
    tag: 'NIST AI 600-1',
    blurb: 'Places ZTDS across GOVERN, MAP, MEASURE, and MANAGE for generative AI data privacy risk.',
    title: 'NIST AI RMF Generative AI Profile: PII Sanitization Mapping',
    desc: 'Maps ZTDS client-side PII sanitization to the NIST AI RMF functions and the AI 600-1 Generative AI Profile data privacy risk, with honest scope limits.',
    keywords: 'NIST AI RMF, NIST AI 600-1, Generative AI Profile, GOVERN MAP MEASURE MANAGE, AI data privacy risk, PII sanitization, ZTDS',
    headline: 'NIST AI RMF Generative AI Profile (AI 600-1) data privacy risk mapped to ZTDS',
    badge: 'NIST AI RMF · AI 600-1 GENERATIVE AI PROFILE',
    h1: 'NIST AI RMF Generative AI Profile: <span class="text-emerald-400">Where PII Sanitization Fits</span>',
    lead: 'NIST published AI 600-1, the Generative Artificial Intelligence Profile, in July 2024 as a companion to the AI Risk Management Framework. It lists data privacy among its generative AI risk categories. This page shows where a client-side sanitization control supports each of the four AI RMF functions.',
    summary: [
      'The AI RMF is voluntary. It organizes risk work into GOVERN, MAP, MEASURE, and MANAGE, and the Generative AI Profile applies those functions to risks that are new or amplified by generative systems, including data privacy.',
      'ZTDS is a technical control that sits mostly in MANAGE, produces evidence for MEASURE, and depends on data-flow knowledge from MAP and policy from GOVERN. It does not make an organization NIST compliant, because the framework is not a certification scheme.'
    ],
    mapTitle: 'Function-Level Mapping',
    mapHeaders: ['AI RMF function', 'What the organization does', 'ZTDS contribution'],
    mapRows: [
      ['GOVERN', 'Sets policy on what data may be sent to external models and who owns the decision.', 'Gives policy a concrete enforcement point: sanitization before egress is testable and auditable.'],
      ['MAP', 'Identifies where personal data and confidential content enter prompts, retrieval, and agent tools.', 'Entity category counts from sanitization runs show which data types actually flow toward models.'],
      ['MEASURE', 'Tests whether controls work and tracks leakage metrics.', 'Local compliance receipts and the browser-based scanner provide repeatable egress evidence.'],
      ['MANAGE', 'Applies controls and responds to incidents.', 'Pre-egress tokenization reduces the data exposed if a provider or integration is compromised.']
    ],
    apply: [
      'A practical sequence for a security or risk team:',
      [
        'Record in GOVERN policy that regulated identifiers must be tokenized before reaching any external model.',
        'Use MAP workshops to list the channels: chat interfaces, document upload, retrieval pipelines, and agent tools.',
        'Run sanitization on a representative corpus and keep the receipts as MEASURE evidence.',
        'Treat any channel that bypasses the local step as a MANAGE finding with an owner and a due date.'
      ]
    ],
    limits: [
      'The AI RMF and AI 600-1 are voluntary guidance. There is no formal NIST certification a product can obtain.',
      'ZTDS addresses data privacy exposure at the client boundary. Other profile risks, such as confabulation or harmful content, need other controls.',
      'The mapping above is an interpretation by the ZTDS consortium, not an endorsement by NIST.'
    ],
    faq: [
      { q: 'Is there a NIST certification for AI RMF compliance?', a: 'No. The NIST AI Risk Management Framework and the AI 600-1 Generative AI Profile are voluntary guidance. Organizations describe how their controls align with the framework, but NIST does not certify products or programs.' },
      { q: 'Which AI RMF function does client-side sanitization support most directly?', a: 'MANAGE, because tokenizing identifiers before egress is a risk treatment. It also supports MEASURE through local receipts and MAP through entity category counts.' },
      { q: 'Does AI 600-1 mention data privacy?', a: 'Yes. The Generative AI Profile identifies data privacy as one of its generative AI risk categories, covering concerns such as personal data in training and inputs and unintended disclosure.' }
    ],
    related: [REL_STD, REL_COMP, REL_CISO]
  },
  {
    slug: 'eu-ai-act-article-10-data-governance',
    crumb: 'EU AI Act Article 10 Data Governance',
    tag: 'EU AI Act',
    blurb: 'Describes how pre-ingestion sanitization supports Article 10 data governance practices.',
    title: 'EU AI Act Article 10 Data Governance: PII Sanitization Role',
    desc: 'How sanitizing personal data before dataset assembly and model ingestion supports EU AI Act Article 10 data governance practices, and where the duty remains yours.',
    keywords: 'EU AI Act Article 10, data governance, high-risk AI systems, training data personal data, data minimization, PII sanitization, ZTDS',
    headline: 'EU AI Act Article 10 data governance and the role of pre-ingestion PII sanitization',
    badge: 'EU AI ACT · ARTICLE 10 · DATA GOVERNANCE',
    h1: 'EU AI Act Article 10 Data Governance: <span class="text-emerald-400">What Sanitization Contributes</span>',
    lead: 'Article 10 of the EU AI Act sets data and data governance requirements for high-risk AI systems that use training, validation, and testing datasets. Sanitizing personal data before it enters a dataset or a model pipeline is one practical way to support those practices. It does not replace the provider obligations.',
    summary: [
      'Article 10 requires providers of high-risk AI systems to apply appropriate data governance and management practices to the datasets they use, including attention to data collection processes and the origin of data, data-preparation operations such as annotation, labelling, cleaning, and aggregation, an assessment of the availability, quantity, and suitability of the data sets, and examination for possible biases. These duties apply to training, validation, and testing data sets where a high-risk system is developed using techniques that train AI models; for systems that do not train models, they apply to the testing data sets.',
      'Where datasets are assembled from operational records, removing direct identifiers before the data reaches annotation tools, fine-tuning jobs, or external model services reduces the personal data in scope. ZTDS provides that step as a deterministic, reversible, client-side operation.'
    ],
    mapTitle: 'Dataset Lifecycle Mapping',
    mapHeaders: ['Lifecycle stage', 'Governance concern', 'ZTDS position'],
    mapRows: [
      ['Collection and export', 'Operational records contain direct identifiers that the dataset does not need.', 'Tokenize identifiers at export time so the dataset carries surrogates only.'],
      ['Preparation and annotation', 'Annotators and tools see personal data unnecessarily.', 'Annotation proceeds on tokenized text; the mapping stays with the data controller.'],
      ['Fine-tuning and evaluation', 'External services receive records for training or testing.', 'The external service receives tokens, not original values (Invariants 1 and 4). Special-category data processed for bias detection under Article 10(5) must not be transmitted to or accessed by other parties, so keep that processing local.'],
      ['Inference-time inputs (not an Article 10 data set)', 'Live prompts to a deployed system include personal data. Article 10 addresses training, validation, and testing data sets. For input data, the Act separately requires a deployer that controls it to ensure it is relevant and sufficiently representative (Article 26(4)), which is not a privacy requirement.', 'Tokenization before egress reduces what a provider can retain. That is a GDPR matter, not an Article 10 or Article 26(4) requirement.']
    ],
    apply: [
      'Use the four invariants as the sanitization contract for dataset work:',
      INVARIANTS,
      'Document the sanitization profile used for each dataset version so reviewers can see which entity categories were removed.'
    ],
    limits: [
      'Article 10 duties rest on the provider of the high-risk system. A tool does not transfer or discharge them.',
      'Sanitization does not address representativeness, bias examination, or error assessment of datasets.',
      'Article 10(5) allows providers to exceptionally process special categories of personal data where strictly necessary for bias detection and correction, only if the purpose cannot be met with synthetic or anonymised data and subject to safeguards that include pseudonymisation and a ban on transmission to other parties. Removing identifiers can conflict with that purpose, so choose the sanitization profile per dataset.',
      'Whether a given system is high-risk is a legal classification that requires its own analysis.',
      'This page is not a conformity assessment and carries no authority from EU institutions.'
    ],
    faq: [
      { q: 'Does EU AI Act Article 10 require removing personal data from training sets?', a: 'Article 10 requires appropriate data governance and management practices for datasets used by high-risk AI systems. Minimizing personal data is one practice that supports it, but the Article does not prescribe a single technique and the obligation stays with the provider.' },
      { q: 'Can sanitization make a system compliant with the EU AI Act?', a: 'No. Sanitization supports one area, data handling. Compliance requires a full assessment of the system classification and every applicable obligation.' },
      { q: 'Why use reversible tokens instead of deleting identifiers?', a: 'Reversible surrogates keep text coherent for annotation and model use, and the controller can restore original values locally when a legitimate need arises, while the external party never holds them.' }
    ],
    related: [REL_STD, REL_COMP, REL_BLUE]
  },
  {
    slug: 'gdpr-article-25-32-ai-prompts',
    crumb: 'GDPR Articles 25 and 32 for AI Prompts',
    tag: 'GDPR',
    blurb: 'Explains data protection by design and security of processing for prompts sent to AI providers.',
    title: 'GDPR Articles 25 and 32 for AI Prompts: Pseudonymization',
    desc: 'How client-side pseudonymization of prompts supports GDPR Article 25 data protection by design and Article 32 security, and why Recital 26 limits what it proves.',
    keywords: 'GDPR Article 25, GDPR Article 32, AI prompts personal data, pseudonymisation, Recital 26, data minimisation, data protection by design, ZTDS',
    headline: 'GDPR Articles 25 and 32 applied to prompts sent to AI providers through client-side pseudonymization',
    badge: 'GDPR · ARTICLE 25 · ARTICLE 32 · RECITAL 26',
    h1: 'GDPR Articles 25 and 32 for AI Prompts: <span class="text-emerald-400">Pseudonymization Before Egress</span>',
    lead: 'When staff or agents send personal data to an AI provider, GDPR obligations on minimization, data protection by design, and security of processing apply to the controller. Replacing identifiers with surrogates in client memory before transmission is a technical measure that supports those obligations. It does not turn personal data into anonymous data.',
    summary: [
      'Article 5(1)(c) requires data minimisation. Article 25 requires data protection by design and by default and names pseudonymisation as an example of an appropriate measure. Article 32 requires appropriate technical and organisational measures and names pseudonymisation as an example.',
      'ZTDS tokenizes identifiers in client memory so the provider receives surrogates. Because the controller can reverse the mapping, the result is pseudonymised data, which Recital 26 says remains personal data when additional information exists. The benefit is a smaller disclosure to the provider and a stronger Article 32 posture, not an exemption.'
    ],
    mapTitle: 'Article-Level Mapping',
    mapHeaders: ['Provision', 'Obligation', 'ZTDS contribution'],
    mapRows: [
      ['Article 5(1)(c)', 'Personal data must be adequate, relevant, and limited to what is necessary.', 'Only surrogates needed for the task leave the client.'],
      ['Article 25', 'Data protection by design and by default.', 'Sanitization is built into the workflow rather than left to user discipline.'],
      ['Article 28', 'Processor obligations when a processor handles personal data.', 'Reduces the personal data a provider receives. Whether an agreement is still required is the controller\'s own analysis.'],
      ['Article 32', 'Security of processing, including pseudonymisation.', 'Pseudonymisation is applied before egress with local evidence receipts.'],
      ['Recital 26', 'Pseudonymised data stays personal data when re-identification is possible.', 'Acknowledged: the mapping is retained by the controller and never leaves volatile memory.']
    ],
    apply: [
      'A defensible rollout combines the technical control with documentation:',
      [
        'Record the sanitization step in the record of processing activities and the data protection impact assessment.',
        'Keep the token map in volatile memory only and zeroize it at session end (Invariant 3).',
        'Retain the local receipts as evidence of the measure operating.',
        'Review the provider agreement with counsel instead of assuming the sanitization removes the need for one.'
      ]
    ],
    limits: [
      'It does not make data anonymous. Under Recital 26, pseudonymised data remains personal data where additional information can re-identify.',
      'It does not remove the need to assess lawful basis, purpose limitation, or international transfer rules.',
      'Free-text can include indirect identifiers that pattern-based methods cannot guarantee to catch.',
      'This page is not legal advice and is not a regulator position.'
    ],
    faq: [
      { q: 'Is tokenized prompt data still personal data under GDPR?', a: 'It can be. Recital 26 states that pseudonymised data which could be attributed to a person with additional information is still personal data. Client-side tokenization reduces what the provider receives but does not by itself make data anonymous.' },
      { q: 'Does pre-egress sanitization remove the need for a data processing agreement?', a: 'Not automatically. It reduces the personal data a provider receives, which can change the analysis, but the controller must make that determination with counsel for its own facts.' },
      { q: 'Which GDPR articles does client-side sanitization support?', a: 'It supports the minimisation principle in Article 5(1)(c), data protection by design in Article 25, and the security of processing in Article 32, which names pseudonymisation as an example of an appropriate measure.' }
    ],
    related: [REL_COMP, REL_CISO, REL_STD]
  },
  {
    slug: 'hipaa-safe-harbor-llm-prompts',
    crumb: 'HIPAA Safe Harbor for LLM Prompts',
    tag: 'HIPAA',
    blurb: 'Shows how 18-identifier removal applies to clinical text sent to language models.',
    title: 'HIPAA Safe Harbor for LLM Prompts: 18 Identifier Removal',
    desc: 'How the 45 CFR 164.514(b)(2) Safe Harbor 18-identifier method applies to clinical text sent to language models, with re-identification code rules and limits.',
    keywords: 'HIPAA Safe Harbor, 45 CFR 164.514, 18 identifiers, LLM clinical text, PHI de-identification, re-identification code, covered entity AI, ZTDS',
    headline: 'HIPAA Safe Harbor de-identification applied to clinical text sent to language models',
    badge: 'HIPAA · 45 CFR 164.514(b)(2) · SAFE HARBOR',
    h1: 'HIPAA Safe Harbor for LLM Prompts: <span class="text-emerald-400">Removing the 18 Identifiers Before Egress</span>',
    lead: 'The HIPAA Safe Harbor method in 45 CFR 164.514(b)(2) treats health information as de-identified when 18 listed identifier categories are removed and the covered entity has no actual knowledge that the remainder could identify a person. This page explains how that applies when clinical text is prepared for a language model.',
    summary: [
      'Safe Harbor is a rule-based method. It lists identifier categories of the individual and of relatives, employers, and household members that must be removed, including names, geographic subdivisions smaller than a state, date elements other than year, contact numbers, and record numbers.',
      'Section 164.514(c) allows a covered entity to assign a code to permit re-identification, provided the code is not derived from or related to information about the individual and is not otherwise capable of being translated to identify the individual, and the covered entity does not use or disclose the code for any other purpose and does not disclose the mechanism for re-identification. Random per-session surrogates whose mapping is held only in local memory fit that constraint; surrogates derived from the original values would not.'
    ],
    mapTitle: 'Identifier Handling in Clinical Text',
    mapHeaders: ['Identifier category', 'Typical form in prompts', 'Required handling'],
    mapRows: [
      ['Names', 'Patient, relative, and clinician names in notes.', 'Replace with a surrogate such as [NAME_1].'],
      ['Dates', 'Admission, discharge, and birth dates.', 'Remove all date elements except year. Ages over 89, and any year indicating such an age, must be removed or aggregated into a single category of 90 or older.'],
      ['Contact and record numbers', 'Telephone, email, medical record and account numbers.', 'Replace with typed surrogates.'],
      ['Geographic data', 'Street addresses, small-area locations.', 'Remove below the state level except as the rule permits.'],
      ['Free-text context', 'Narrative details that could single out a person.', 'Specialized profiles reduce risk; residual review remains required.']
    ],
    apply: [
      'To keep the re-identification code consistent with Section 164.514(c):',
      [
        'Generate surrogates as session counters, not as hashes or transforms of the original values.',
        'Keep the mapping on the covered entity side in volatile memory and never transmit it.',
        'Zeroize the mapping when the session ends unless the covered entity has a documented reason to retain it.',
        'Retain a local receipt of entity categories and counts as evidence of the step.'
      ]
    ],
    limits: [
      'Safe Harbor requires no actual knowledge that the remaining information could identify an individual. A tool cannot establish that on its own.',
      'Clinical narratives can contain details that identify a person outside the 18 categories; expert determination is the alternative method for those cases.',
      'This page is not a legal opinion and does not constitute a determination by HHS.',
      'Business associate and contractual questions remain separate from the de-identification method.'
    ],
    faq: [
      { q: 'What does the HIPAA Safe Harbor method require?', a: 'Under 45 CFR 164.514(b)(2), the covered entity removes 18 listed categories of identifiers and has no actual knowledge that the remaining information could identify an individual. If both hold, the information is treated as de-identified.' },
      { q: 'Can reversible surrogates be used under Safe Harbor?', a: 'A code that permits re-identification is allowed under 164.514(c) if it is not derived from or related to information about the individual, is not otherwise capable of being translated to identify the individual, the code is not used or disclosed for other purposes, and the covered entity does not disclose the mechanism for re-identification. Random session surrogates whose mapping stays only on the covered entity side meet that design constraint.' },
      { q: 'Is Safe Harbor enough for free-text clinical notes?', a: 'Not always. Free text can carry identifying details beyond the listed categories. Where residual risk remains, the expert determination method or additional review is the appropriate route.' }
    ],
    related: [REL_COMP, REL_STD, REL_SCAN]
  },
  {
    slug: 'mcp-stdio-pii-sanitization',
    crumb: 'MCP stdio PII Sanitization',
    tag: 'Model Context Protocol',
    blurb: 'Describes a local gateway that sanitizes JSON-RPC traffic over the MCP stdio transport.',
    title: 'MCP Server Security: stdio PII Sanitization Gateway',
    desc: 'How a local gateway sanitizes JSON-RPC messages on the Model Context Protocol stdio transport so tool results and prompts carry surrogates, not raw PII.',
    keywords: 'MCP security, Model Context Protocol, stdio transport, JSON-RPC, MCP PII leakage, MCP gateway, agent tool output, ZTDS',
    headline: 'Sanitizing Model Context Protocol stdio traffic with a local in-memory gateway',
    badge: 'MODEL CONTEXT PROTOCOL · STDIO · JSON-RPC',
    h1: 'MCP Server Security: <span class="text-emerald-400">PII Sanitization on the stdio Transport</span>',
    lead: 'The Model Context Protocol uses JSON-RPC 2.0 messages. Its stdio transport has the client launch the server as a subprocess and exchange newline-delimited messages over standard input and output. That local boundary is a natural place to sanitize traffic before it reaches a model.',
    summary: [
      'With stdio, the MCP client starts the server as a child process and writes JSON-RPC messages to its stdin while reading responses from its stdout. The server may write logs to stderr. Nothing other than valid MCP messages may be written to stdin or stdout.',
      'A ZTDS gateway wraps that boundary. Tool results that flow back toward the model are tokenized before the client forwards them, and tool arguments that come back from the model are restored locally. The model sees surrogates; the local tools operate on real values.'
    ],
    mapTitle: 'Message Flow and Sanitization Points',
    mapHeaders: ['Flow', 'Content', 'Gateway action'],
    mapRows: [
      ['Server to client (tool result)', 'Records, file contents, and query results that may include PII or secrets.', 'Tokenize before the result is placed into model context.'],
      ['Client to server (tool call)', 'Arguments chosen by the model, which may contain surrogates.', 'Restore surrogates locally so the tool receives real values.'],
      ['Server stderr', 'Diagnostic logs.', 'Excluded from model context; review logging separately.'],
      ['Remote transports', 'Streamable HTTP servers run outside the local boundary.', 'Out of this page scope; apply the same step in the client before forwarding.']
    ],
    apply: [
      'Deployment pattern for a local agent client:',
      [
        'Configure the client to launch the gateway as the stdio command, with the original server as its child.',
        'Keep the token map in the gateway process memory only (Invariant 3).',
        'Verify no cleartext appears on any network interface using the perimeter scanner.',
        'Document which tools are wrapped and which are not.'
      ]
    ],
    limits: [
      'It does not defend against prompt injection embedded in tool output.',
      'It does not constrain what an authorized tool is allowed to do. That is an authorization question.',
      'Remote servers outside the local process boundary need the same sanitization in the client before forwarding.',
      'The protocol details here follow the public MCP specification; verify against the version your client implements.'
    ],
    faq: [
      { q: 'How does the MCP stdio transport work?', a: 'The client launches the MCP server as a subprocess, writes newline-delimited JSON-RPC messages to its standard input, and reads responses from its standard output. The server can write diagnostic text to standard error.' },
      { q: 'Where should PII sanitization sit in an MCP setup?', a: 'At the local boundary between the tool output and the model context, so surrogates reach the model while tools keep working with real values.' },
      { q: 'Does stdio sanitization protect against malicious tool output?', a: 'No. It reduces personal data exposure. Injection and tool authorization risks need separate controls.' }
    ],
    related: [REL_MCP, REL_BLUE, REL_STD]
  },
  {
    slug: 'rag-pipeline-pii-sanitization',
    crumb: 'RAG Pipeline PII Sanitization',
    tag: 'Retrieval-Augmented Generation',
    blurb: 'Places sanitization at ingestion, retrieval, and prompt assembly stages of a RAG pipeline.',
    title: 'RAG Pipeline PII Sanitization: Ingestion to Prompt Assembly',
    desc: 'Where to sanitize PII in a retrieval-augmented generation pipeline: at ingestion, in the vector store, and at prompt assembly, with coverage limits stated.',
    keywords: 'RAG PII sanitization, retrieval augmented generation privacy, vector database PII, embedding leakage, prompt assembly, LangChain privacy, ZTDS',
    headline: 'PII sanitization stages in a retrieval-augmented generation pipeline',
    badge: 'RAG · VECTOR STORES · PROMPT ASSEMBLY',
    h1: 'RAG Pipeline PII Sanitization: <span class="text-emerald-400">Three Places To Intervene</span>',
    lead: 'A retrieval-augmented generation pipeline moves personal data through ingestion, embedding, storage, retrieval, and prompt assembly before any model sees it. Each stage is an opportunity to exclude identifiers. This page lists where a deterministic sanitization step reduces exposure and where it does not.',
    summary: [
      'Source documents often contain identifiers that the retrieval task does not need. If they are embedded as-is, the vector store becomes a second copy of sensitive data, and retrieved chunks carry those identifiers into every prompt.',
      'Tokenizing at ingestion keeps the vector store free of raw identifiers. Tokenizing at prompt assembly protects the case where the store already holds raw text. Both use the same reversible surrogate contract.'
    ],
    mapTitle: 'Pipeline Stage Mapping',
    mapHeaders: ['Stage', 'Exposure', 'Sanitization option'],
    mapRows: [
      ['Ingestion', 'Raw documents loaded for chunking and embedding.', 'Tokenize before chunking so stored chunks and embeddings derive from surrogates.'],
      ['Vector store', 'Embeddings and chunk text persist in a database with its own access controls.', 'Store only surrogate text; keep the mapping outside the store.'],
      ['Retrieval', 'Top results are returned to the application.', 'Results already carry surrogates when ingestion was sanitized.'],
      ['Prompt assembly', 'Retrieved context and the user question are joined and sent to a provider.', 'Tokenize the assembled prompt as a final gate before egress.'],
      ['Response handling', 'The model answer references surrogates.', 'Restore surrogates locally for the authorized reader.']
    ],
    apply: [
      'Recommended order of adoption:',
      [
        'Add the prompt-assembly gate first because it protects every existing pipeline immediately.',
        'Then sanitize at ingestion for new collections to keep raw identifiers out of the vector store.',
        'Keep one mapping scope per user session or per tenant and never share it across tenants.',
        'Test with a scanner run that confirms no cleartext identifiers appear in outbound requests.'
      ]
    ],
    limits: [
      'Tokenizing before embedding can change retrieval quality for queries that rely on the removed values; measure it on your corpus.',
      'It does not enforce document-level access control. That remains the job of the retrieval layer.',
      'It does not address poisoning of the vector store or injection through retrieved text.',
      'Embeddings of text that still contains free-text context can carry indirect information.'
    ],
    faq: [
      { q: 'Should PII be removed before or after embedding?', a: 'Before, when possible. Tokenizing at ingestion keeps raw identifiers out of both the stored chunks and the embeddings. A gate at prompt assembly is still useful as a final check.' },
      { q: 'Does sanitizing before embedding hurt retrieval?', a: 'It can for queries that depend on the removed values, for example searching by a specific name. Measure retrieval quality on your own corpus and decide per collection.' },
      { q: 'Can the token map be shared across users?', a: 'It should not be. Scope the mapping to a session or tenant and keep it in volatile memory so one user can never restore another user values.' }
    ],
    related: [REL_BLUE, REL_STD, REL_SCAN]
  },
  {
    slug: 'client-side-sanitization-vs-proxy-dlp',
    crumb: 'Client-Side Sanitization vs Proxy DLP',
    tag: 'Architecture Comparison',
    blurb: 'Compares client-side in-memory sanitization with network proxy and cloud DLP approaches.',
    title: 'Client-Side AI Sanitization vs Proxy DLP: Comparison',
    desc: 'Compare client-side in-memory PII sanitization with network proxy and cloud DLP for AI traffic across data path, subprocessors, latency, and failure modes.',
    keywords: 'AI DLP comparison, proxy DLP vs client-side, cloud DLP AI prompts, shadow AI, PII redaction architecture, zero egress, ZTDS',
    headline: 'Client-side in-memory sanitization compared with network proxy and cloud DLP for AI traffic',
    badge: 'ARCHITECTURE COMPARISON · AI DLP',
    h1: 'Client-Side AI Sanitization vs Proxy DLP: <span class="text-emerald-400">Where The Data Path Differs</span>',
    lead: 'Organizations controlling AI data exposure generally choose among three placements: a network or cloud proxy that inspects traffic, a provider-side filter, or a sanitization step inside the client. The choice changes who sees the raw data, what new parties are introduced, and how the control fails.',
    summary: [
      'A network proxy or cloud redaction service must receive the raw content to inspect it. That adds a processing party and a data path that carries cleartext. A client-side step removes identifiers before any outbound call, so no additional party receives the raw values.',
      'Neither placement is universally better. Proxies give central visibility and policy for managed traffic. Client-side sanitization gives a smaller disclosure boundary and works where traffic cannot be inspected. Many programs use both.'
    ],
    mapTitle: 'Placement Comparison',
    mapHeaders: ['Dimension', 'Network or cloud proxy', 'Client-side sanitization'],
    mapRows: [
      ['Raw data path', 'Cleartext reaches the proxy or redaction service.', 'Cleartext stays in client memory.'],
      ['Additional processing party', 'Yes: the proxy or service operator.', 'No external party for the sanitization step.'],
      ['Central policy and visibility', 'Strong for managed network traffic.', 'Depends on how the client is deployed and reported.'],
      ['Unmanaged or encrypted channels', 'Can miss traffic that bypasses the proxy.', 'Applies wherever the client runs.'],
      ['Failure mode', 'Proxy outage or bypass changes what is exposed.', 'A client that skips the step sends raw data.'],
      ['Latency', 'Adds a network hop.', 'Local, in-memory operation.']
    ],
    apply: [
      'A pragmatic pairing:',
      [
        'Use client-side sanitization to shrink what leaves endpoints and agent runtimes.',
        'Use network controls to detect and block channels that bypass the client step.',
        'Compare outcomes with the same test corpus and the perimeter scanner so the decision rests on measured leakage.'
      ]
    ],
    limits: [
      'Client-side sanitization does not replace network monitoring, endpoint management, or access control.',
      'Its protection depends on the step actually running in every client that handles the data.',
      'Proxy products vary widely; the comparison above describes architectural placement, not specific vendors.'
    ],
    faq: [
      { q: 'Is client-side sanitization a replacement for a DLP proxy?', a: 'No. They address different placements. A proxy gives central visibility for managed traffic, while client-side sanitization shrinks the data that leaves the endpoint. Many programs combine them.' },
      { q: 'Why does a proxy add a processing party?', a: 'To inspect content it must receive the cleartext. The operator of that proxy or redaction service then handles the raw data, which a client-side step avoids.' },
      { q: 'What is the main failure mode of client-side sanitization?', a: 'A client that does not run the step sends raw data. Deployment coverage and network-level detection of bypass are the compensating controls.' }
    ],
    related: [REL_SCAN, REL_CISO, REL_COMP]
  }
];

const HUB = {
  title: 'ZTDS Framework Mappings: OWASP, NIST, EU AI Act, GDPR, HIPAA',
  desc: 'Technical-control mappings from the ZTDS client-side sanitization standard to OWASP LLM02, NIST AI RMF, EU AI Act Article 10, GDPR, HIPAA, MCP, and RAG pipelines.',
  keywords: 'ZTDS framework mappings, OWASP LLM02, NIST AI RMF, EU AI Act Article 10, GDPR Article 32, HIPAA Safe Harbor, MCP security, RAG privacy',
  headline: 'ZTDS Framework Mappings: how a client-side sanitization control maps to published security and privacy frameworks',
  h1: 'ZTDS Framework Mappings: <span class="text-emerald-400">One Control, Many Frameworks</span>',
  lead: 'Each page maps the ZTDS RFC v1.0 client-side sanitization control to one framework or architecture topic, states what the control contributes, and lists what it does not cover. The mappings are written for security, privacy, and engineering teams that need to justify the control to auditors.',
  method: [
    'Every mapping follows the same structure: a summary, a control-mapping table, how ZTDS applies, and an explicit list of limits. The four ZTDS invariants are the common vocabulary:',
    [
      '<strong>Invariant 1:</strong> zero cleartext network egress.',
      '<strong>Invariant 2:</strong> deterministic, reversible surrogate tokens.',
      '<strong>Invariant 3:</strong> volatile host RAM isolation.',
      '<strong>Invariant 4:</strong> zero external subprocessors.'
    ],
    'External facts on these pages were checked against the public sources of each framework owner. Where a framework is voluntary or has no certification scheme, the page says so.'
  ],
  faq: [
    { q: 'What are the ZTDS Framework Mappings?', a: 'They are pages that map the ZTDS RFC v1.0 client-side sanitization control to specific frameworks and architectures, such as OWASP LLM02, the NIST AI RMF Generative AI Profile, EU AI Act Article 10, GDPR, HIPAA, MCP, and RAG pipelines.' },
    { q: 'Do these mappings certify compliance?', a: 'No. They describe how a technical control supports a framework as a risk minimization measure. Certification, where a scheme exists, is issued by the framework owner or a regulator.' },
    { q: 'Where is the normative specification?', a: 'The normative text is ZTDS RFC v1.0 at the Standard page, with the IETF draft series linked from the IETF hub.' }
  ],
  related: [REL_STD, REL_COMP, { name: 'IETF Standards Track Hub', url: '/ietf/', note: 'Draft series for the ZTDS protocol.' }, REL_SCAN, REL_BLUE]
};

module.exports = { PAGES, HUB };
