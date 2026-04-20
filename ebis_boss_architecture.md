# Bacolod City EBIS 4.0: Business One-Stop Shop (BOSS) Architecture Breakdown

The Electronic Business Integrated System (EBIS 4.0), developed by the Management Information Technology and Computer Services Department of Bacolod City, acts as a central hub connecting taxpayers, the Business Permit and Licensing Office (BPLO), financial gateways, and local regulatory departments. 

The core objective is a streamlined, transparent, and simultaneous processing pipeline compliant with government joint memorandum circulars.

---

## Phase 1: Taxpayer Registration & Application (Frontend / Client UI)
This phase handles user onboarding, data collection, and document management. 

### User Pathways
* **New Businesses:** Requires an active email address. Data provided must match their respective regulatory body registrations (DTI for Sole Proprietors, SEC for Corporations, or CDA for Cooperatives).
* **Renewals:** Requires the previous Business Permit Number and Business Account Number to pull existing records from the database.

### Dynamic Document Uploads
The interface dynamically prompts for specific files based on the selected business profile:
* **Entity Proof:** * Sole Proprietorships: DTI Registration.
    * Corporations: SEC Registration and an SPA or Authorization with ID (specifically a Board Resolution or Secretary’s Certificate proving signing authority).
    * Cooperatives: CDA Registration.
* **Location Proof:** Lease Contract (required if the business place is rented).
* **Identity Proof:** Digital copy of the Owner's ID (Mandatory for all).
* **Special Cases:** Written Franchise Agreement (required for CC and Business-type franchises).

### System Action
Upon successful validation of inputs, the system emails a unified application form to the user and pushes the application to the Phase 2 verification queue.

---

## Phase 2: BPLO Review & Verification (Admin Dashboard / Routing)
This phase resolves operational bottlenecks through simultaneous, cross-departmental data sharing. 

### BPLO Verification
BPLO staff conduct an initial formal review of the uploaded documents and application details.

### Parallel Departmental Clearance
The system routes the application to multiple regulatory offices for concurrent approval. A robust administrative dashboard tracks the status (Pending, Approved, Denied) across the following departments:
* Barangay (BRGY) Clearance
* Bureau of Fire Protection (BFP)
* Zoning Division
* City Health Office (CHO)
* Office of the Building Official (OBO)
* City Environment and Natural Resources Office (BENRO)
* BTTMD
* City Administrator
* City Veterinarian
* City Agriculture
* Tourism Office

### System Action
The application is strictly locked from moving forward to the assessment phase until all required departmental clearances return a "verified/approved" status.

---

## Phase 3: Assessment, Billing & Payment (Financial Gateway Integration)
Once fully verified by all necessary departments, the application transitions from review to financial settlement.

### Assessment & Invoicing
The system calculates the required fees based on the verified business data and generates a formal billing statement. Billing requests can be made via the online portal or over the counter.

### Payment Channels
* **Online E-Payments:** Integration with digital wallets (GCash, PayMaya) and banking networks (DBP Visa, Landbank).
* **Over the Counter:** Physical payment at the designated treasury office.
* **Online Services Link:** Payment routed through the integrated EBPLS online portal.

### System Action
Upon successful payment confirmation (via API webhook from digital payments or manual OTC entry), the system automatically issues an Electronic Official Receipt (e-OR). This receipt serves as the final clearance trigger.

---

## Phase 4: Final Issuance & Tracking (Output Generation)
The final stage securely delivers official documentation to the taxpayer.

### Document Generation & Security
The system utilizes the logged e-OR to auto-generate the digital Mayor’s Permit. Authenticity is ensured via an embedded, generated QR code on the permits and barangay clearances. Scanning this code with a mobile device cross-references the live database to verify document validity.

### Delivery Options
* **Digital:** The finalized Mayor's permit is dispatched automatically via email.
* **Physical:** Applicants can opt to pick up a hard copy at the BPLO located at the Bacolod City Government Center.

### Status Tracking UI
Taxpayers can track their real-time progress across all four phases by logging into the online portal using their Application Number and Business Account Number.

---

## Proposed React.js Frontend Architecture 
To efficiently build out this workflow in a single-page application (SPA), the following component and state management structure is recommended:

### 1. State Management (Context API / Redux)
* `ApplicationState`: Manages the global progression from Phase 1 through Phase 4.
* `AuthContext`: Handles user sessions, separating Taxpayer access from BPLO Admin/Departmental access.

### 2. Core Components
* `ApplicationWizard.jsx`: A multi-step form component governing Phase 1. It conditionally renders upload fields (e.g., showing the Lease Contract upload only if `isRented` is true).
* `DepartmentDashboard.jsx`: The Phase 2 admin interface. Maps through the list of departments (BRGY, BFP, etc.) to display real-time clearance badges and action buttons for reviewers.
* `PaymentGateway.jsx`: Handles Phase 3 routing, embedding payment options (GCash, DBP Visa) or generating an OTC payment slip.
* `TrackerPortal.jsx`: A simple lookup interface where users input their Application and Account Numbers to fetch a timeline visualizer of their permit status.

### 3. API Integration Points
* **Document Upload API:** Secure handling of multipart/form-data for SEC/DTI registrations and IDs.
* **Payment Webhooks:** Listeners for GCash/PayMaya to automatically trigger the e-OR generation in Phase 3.
* **QR Generator:** A utility function to hash the permit ID and generate the verification QR code for the final PDF output.
