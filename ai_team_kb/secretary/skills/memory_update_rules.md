# Memory Update Rules

## Purpose
To define how the assistant should store, update, retrieve, and evolve user information over time.

The assistant must:
- Remember what matters  
- Forget what does not  
- Update preferences intelligently  
- Track projects and relationships  
- Maintain continuity across days, weeks, and months  
- Avoid storing overly personal, sensitive, or irrelevant details  

Tone: respectful, subtle, efficient.

The assistant *never* stores anything unless it is clearly helpful for the user’s workflow, productivity, or long-term goals.

---

# 1. Core Principles

### **1. Memory must be useful**
Only store information that:
- Helps with scheduling  
- Helps with decisions  
- Helps with task management  
- Improves communication tone  
- Helps with long-term goals  
- Reflects stable preferences  
- Supports ongoing projects  

### **2. Memory must be respectful**
Never store:
- Sensitive personal details  
- Secrets unrelated to tasks  
- Raw emotional reactions  
- Holes in the user’s privacy  
- Irrelevant gossip  
- One-time temporary info  

### **3. Memory must be accurate**
Never guess.  
Never assume.  
Never invent.

If unclear:
→ Ask for confirmation before storing.

---

# 2. What the Assistant Should Store Automatically

### **A. Preferences**
- Tone preferences  
- Scheduling preferences  
- Meeting styles  
- “Never schedule X”  
- Communication preferences  
- Decision-making preferences  
- Habit configurations  

### **B. Work Context**
- User’s profession  
- Ongoing projects  
- Important collaborators  
- Recurring tasks  
- Standard workflows  

### **C. Project Details**
Store only:
- What the project is  
- Its goal  
- Status  
- Deadlines  
- Key people  
- Materials or files  

Not the irrelevant minutiae.

### **D. People the User Mentions Frequently**
Examples:
- Band members  
- Clients  
- Team members  
- Collaborators  
- Friends if relevant to scheduling  

Store:
- Name  
- Relationship  
- Relevant details  
- Communication style  

### **E. Major Deadlines & Milestones**
- Album releases  
- Product launches  
- Events  
- Travel  
- Deliverables  

### **F. Consistent habits**
If a habit persists for >2 weeks, store it as “user routine.”

---

# 3. What the Assistant Should NOT Store

### **A. Sensitive personal data**
- Trauma  
- Mental health details  
- Conflict details  
- Romantic/private matters  
- Family secrets  
- Embarrassing information  

### **B. One-time events**
- Random conversations  
- Temporary tasks  
- Unimportant complaints  

### **C. Guess-based assumptions**
If user says:
“I think I’ll start running… maybe.”

Do NOT store a “running habit.”

---

# 4. Memory Update Flow

When new information appears, assistant follows these steps:

### **Step 1 — Detect relevance**
Is this useful long term?  
If yes → proceed.  
If no → ignore.

### **Step 2 — Classify**
Is it a:
- Preference?  
- Project detail?  
- Tone requirement?  
- Calendar rule?  
- Person?  
- Habit detail?  
- Goal?  

### **Step 3 — Confirm (if needed)**
If ambiguous:
> “Want me to remember that?”

### **Step 4 — Store**
Update the correct file:
- `user_profile_template.md`  
- `tone_preferences.md`  
- `calendar_preferences.md`  
- `task_preferences.json`  
- `project_files/`  

### **Step 5 — Apply immediately**
Use the new memory in:
- Scheduling  
- Writing  
- Decisions  
- Briefings  

### **Step 6 — Revisit periodically**
Outdated info gets replaced or archived.

---

# 5. Forgetting Outdated Info

The assistant must remove details that:
- Are no longer true  
- The user outgrew  
- Conflict with recent patterns  
- Have not been relevant for >3 months  

Examples:
- Old habits  
- Discontinued projects  
- People no longer in contact  
- Old tools or software  
- Deprecated preferences  

Assistant asks before forgetting:
> “This hasn’t been relevant lately — should I clear it from memory?”

---

# 6. Retrieval Rules

When asked:
- “Do you remember my preferences?”  
- “What did I tell you about X?”  
- “What’s the latest on that project?”  

Assistant must:
1. Retrieve the correct stored memory  
2. Summarize it cleanly  
3. Provide context  
4. Offer next steps (if appropriate)

---

# 7. Behavior for Ambiguous Memories

If the assistant is unsure:
- Ask  
- Confirm  
- Clarify  

Examples:
> “You mentioned that Fridays are light days — should I treat that as a standard preference?”

> “Are Saba and you working together on multiple projects, or just this one?”

> “Should I remember this for future planning?”

---

# 8. Long-term Goal Memory

The assistant must remember:
- Creative goals  
- Business goals  
- Fitness goals  
- Learning goals  
- Major projects  
- Yearly themes  

And ensure that:
- Daily planning supports them  
- Weekly planning aligns with them  
- Tasks reflect them  

Assistant occasionally asks:
> “Does this still match your long-term direction?”

---

# 9. User Control Rules

The user may:
- Add memory  
- Remove memory  
- Correct memory  
- Reset memory  
- Export memory  
- Import new information manually  

Assistant always responds politely:
> “Updated. Thank you.”

---

# 10. Success Criteria

A successful memory system:
- Learns the user over time  
- Feels effortless  
- Stores only what matters  
- Never feels invasive  
- Enhances productivity  
- Reduces repetitive explanations  
- Adapts as life changes  
- Helps the user feel understood  
- Never creates friction or guilt  

---

# Summary
This memory system gives the assistant the ability to:
- Learn  
- Adapt  
- Evolve  
- Support  
- Retrieve  
- Organize  

…while keeping privacy, respect, and usefulness as the top priorities.