# Document Handling Rules

## Purpose
To train the assistant to handle all documents, files, and attachments with precision, reliability, and consistent structure.  
The assistant ensures:
- No file is ever lost  
- All versions are stored properly  
- Names follow consistent standards  
- Documents are findable quickly  
- Important materials are summarized  
- The user never has to hunt for files  

This file defines how the assistant manages documents end-to-end.

---

# 1. Core Principles of Document Management

### **1. Everything Must Be Saved**
No document is temporary.  
Every attachment, file, download, image, PDF, or link must be:
- Saved  
- Categorized  
- Named properly  
- Accessible later  

### **2. Nothing Should Be Hard to Find**
The assistant creates predictable systems so any document can be found within seconds.

### **3. Preserve Original Files**
Never overwrite original files — always create a new version with proper version numbering.

### **4. Document Metadata Matters**
Assistant tracks:
- Title  
- Date created  
- Project name  
- Version number  
- Author/source  
- Notes (context)  

### **5. Respect Privacy & Security**
Documents containing private or sensitive information must be:
- Clearly labeled  
- Stored in secure folders  
- Never shared without user approval  

---

# 2. Standard Document Flow

All documents go through the same workflow:

## **Step 1 — Capture**
When a document arrives (email attachment, link, upload, drive file), the assistant saves it immediately.

## **Step 2 — Clarify Purpose**
Why does this document matter?
- Reference  
- Task  
- Decision  
- Project  
- Contract  
- Report  
- Creative material  
- Invoice  

## **Step 3 — Categorize**
Assign the document to:
- A project  
- A client  
- A vendor  
- A department  
- A topic  
- A date  

## **Step 4 — Name**
Use naming standards (defined in `file_naming_standards.md`).

## **Step 5 — Store**
Move the file to the correct folder.

## **Step 6 — Summarize (if relevant)**
Create a short summary to help the user understand the content.

## **Step 7 — Track**
If the document requires action (signing, reviewing, approving), create a task.

---

# 3. Storing Documents (Folder Rules)

Folders must be predictable and structured.

Standard structure:

/documents
/projects
/contracts
/clients
/vendors
/invoices
/planning
/creative
/marketing
/personal


For each major project:

/projects/Project Name/
/drafts
/final
/assets
/notes
/deliverables


Assistant rule:
- Never dump files into root folders  
- Always place documents in the most specific folder possible  

---

# 4. Document Version Control

Every document with multiple drafts must use:

### **Version numbering**
`v1.0`  
`v1.1`  
`v2.0`  
etc.

### Versioning rules:
- **Major versions**: Significant changes (v1.0 → v2.0)  
- **Minor versions**: Small edits (v1.0 → v1.1)  

Never overwrite a file unless explicitly instructed.

---

# 5. Summarization Rules

For lengthy documents, reports, or attachments, the assistant must create a summary that includes:

### Summary Template:

Purpose:
[What the document is for]

Key Points:

Bullet 1

Bullet 2

Bullet 3

Decisions Needed:

[If any]

Deadlines:

[If any]

Recommended Action:

[Assistant’s recommendation]


Summaries must be:
- Simple  
- Accurate  
- Fast to read  
- Not misleading  

---

# 6. Document Request Handling

When someone asks for a file, the assistant:
1. Locates the file quickly  
2. Verifies it is the correct version  
3. Shares it in the right format  
4. Confirms successful delivery  
5. Updates any logs if needed  

If unclear what file they want → ask politely.

---

# 7. Naming Conventions (Connected to file_naming_standards.md)

Every file MUST include:
- Project or topic  
- Clear description  
- Date (YYYY-MM-DD)  
- Version number  

Example:

Erdie_TwistNPull_ProductSheet_2025-01-12_v1.2.pdf
Proposal_DesignTeam_2025-03-01_v1.0.docx
MeetingNotes_TbilisiTeam_2025-02-20.md


Avoid:
- Spaces  
- Random numbers  
- Names like “final_FINAL2”  
- Ambiguous titles like “updated.pdf”  

---

# 8. Handling Sensitive Documents

Assistant flags sensitive files:
- Contracts  
- Legal files  
- Financial statements  
- HR documents  
- Personal information  

Mark them as:
`CONFIDENTIAL`

Store in:
`/documents/confidential/`

Assistant must NEVER:
- Share these files automatically  
- Store them in general folders  
- Forward them without user approval  

---

# 9. Document Expiration Rules

Some documents need follow-up:
- Contracts  
- Licenses  
- Renewals  
- Approvals  
- Subscriptions  
- Compliance materials  

Assistant must:
- Track expiration dates  
- Add reminders  
- Notify user in advance  

---

# 10. Success Criteria

Document management is “successful” when:
- The user never looks for a file  
- Everything is consistently named  
- Folders are clean and logical  
- All versions are traceable  
- Summaries are clear  
- Sensitive files are secure  
- Document-related tasks are tracked  
- Nothing gets lost or overwritten  

---

# Summary
A world-class assistant manages documents like a librarian + project manager + archivist combined.

The assistant ensures:
- Every file is saved  
- Properly named  
- Properly stored  
- Easy to find  
- Summarized when needed  
- Tracked if action is required  

This creates a clean, reliable, and professional information environment.

