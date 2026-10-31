# NexusDoc Institutional Knowledge Dataset
**Multilingual RAG Benchmark & Institutional Knowledge Repository**
*Fictional Indian Engineering University: Vidyasagar National Institute of Technology (VNIT)*

## Notice & Synthetic Disclaimer
> **SYNTHETIC DEMO POLICY**: All regulations, fee structures, notices, hostel policies, and circulars contained in this dataset were generated specifically for evaluating Retrieval-Augmented Generation (RAG) systems in higher education contexts. They are synthetic benchmarks and do not represent actual government or statutory university regulations.

---

## 1. Dataset Summary & Manifest
This package provides a production-grade benchmark dataset engineered for multilingual document retrieval, role-based access control (RBAC), and citation validation:

| Deliverable File | Format | Records | Description |
|---|---|---|---|
| `documents_metadata.csv` | CSV | 90 docs (270 multilingual versions) | Complete institutional metadata across all 6 categories |
| `document_chunks.json` | JSON | 540+ passages | Structured chunk passages with page numbers, section headers & text |
| `circulars_and_policies.json` | JSON | 50 documents | 30 circulars + 20 policies with full text, page breaks, and OCR stamps |
| `multilingual_faqs.csv` | CSV | 50 FAQs | 50 institutional FAQs mapped across English, Hindi (Devanagari), and Telugu (Telugu script) |
| `access_permissions.csv` | CSV | 18 permission rules | Role-based matrix (Student, Faculty, Administrator, Warden, Scholarship Officer) |
| `evaluation_questions.json` | JSON | 100 test questions | Comprehensive benchmark suite with expected citations & refusal criteria |
| `document_version_history.csv` | CSV | Audit trail | Complete versioning history, superseding chains, and effective dates |
| `README.md` | Markdown | Documentation | Architecture, schema definitions, and RAG evaluation guidelines |

---

## 2. Institutional Document Categories (90 Documents)
1. **Academic circulars and notifications (30 documents)**: Examination schedules, fee payment deadlines, attendance condonations, makeup classes, registration deadlines.
2. **Academic policies and regulations (20 documents)**: B.Tech 2025 statute, M.Tech curriculum & GATE stipend, research ethics, grading scales, CGPA formulas.
3. **Student and employee handbooks (10 documents)**: Campus survival guide, anti-ragging helpline, faculty leave rules, Professional Development Allowance (PDA).
4. **Scholarship policies and guidelines (15 documents)**: Merit-cum-Means (MCM), SC/ST Post-Matric scheme, Single Girl Child waiver, Sports grants, PMRF guidelines.
5. **Hostel rules, regulations and procedures (15 documents)**: In-out curfew timings, biometric punch, mess rebate rules, room allocation by merit, electrical appliance bans.

---

## 3. Multilingual Symmetry (EN, HI, TE)
Every core document and FAQ provides synchronized translations across:
- **English (EN)**
- **Hindi (HI)** in standard Devanagari script (`देवनागरी`)
- **Telugu (TE)** in standard Telugu script (`తెలుగు లిపి`)

All document IDs, monetary figures (e.g. ₹1,800/-, ₹12,400/-), dates (e.g. 10th January 2026), and percentages (75% attendance) remain identical across translated editions.

---

## 4. Evaluation Benchmark Test Suite (100 Questions)
The `evaluation_questions.json` file includes 100 rigorous test cases covering 7 primary evaluation dimensions:
- **25 Standard English queries**: Core factual queries regarding attendance, grading, stipends, and hostel rules.
- **15 Multilingual Hindi queries**: Devanagari queries verifying multilingual semantic matching and cross-lingual citation.
- **15 Multilingual Telugu queries**: Telugu script queries verifying regional language retrieval.
- **15 Expired & Superseded policy tests**: Ensuring the RAG engine alerts users when an older rule has been superseded (e.g. 2024 fee of ₹1,500 superseded by 2025 fee of ₹1,800).
- **10 Conflicting policy checks**: Resolving draft proposals (e.g. Saturday labs draft) versus approved statutory rules.
- **10 Missing information & polite refusal tests**: Ensuring the AI model does NOT hallucinate on absent topics (e.g. flight reimbursements, helicopter landing) and politely refuses based on official documents.
- **10 Role-restricted access checks**: Enforcing confidentiality by denying student queries into faculty appraisal metrics and sealed committee records.

---

## 5. Usage in NexusDoc
In the NexusDoc web interface:
- View the **Institutional Knowledge Dataset** tab to browse documents, categories, and FAQs.
- Click **Run Test Query** from the Evaluation Benchmark viewer to test any of the 100 benchmark questions live with citation highlighting.
- Download individual CSV/JSON files or the complete dataset package directly.
