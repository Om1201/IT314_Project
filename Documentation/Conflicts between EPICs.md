# Conflicts Between EPICs

## 1. Epic 1 (User Authentication & Profile) vs Epic 2 (Learning Experience & Roadmap)
- **Dependency on Profile Data:** Roadmap generation (Epic 2, Sprint 3) depends on complete user profile info (Epic 1, Sprint 2).  
- **Account Verification:** Users need verified accounts before accessing learning paths. Any delay in Epic 1’s verification flow blocks Epic 2.  

**Possible resolution:**  We will ensure that roadmap generation(Epic 2, Sprint 3) starts only after user profile & verification part (Epic 1) is completed.

---

## 2. Epic 2 (Learning Experience) vs Epic 3 (Coding Environment & AI Assistance)
- **Evaluation & IDE Link:** Evaluations in Epic 2 (Sprint 4) may require coding exercises to run in the IDE (Epic 3, Sprint 5).  

**Possible Resolution :** We can complete Sprint 5 (IDE setup) before implementing evaluation-related tasks in Sprint 4. 

---



