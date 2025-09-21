# Distribution of Requirements into EPICs

## Epic 1: User Authentication & Profile Management

**Goal:** 
Enable users to securely create and manage accounts.

### Functional Requirements Covered
1. User Signup: Email/Password, Google Authentication  
2. Reset Password  
3. Account Verification  
4. User Profile Management

### Non-Functional Requirements Covered
1. **Security:** Password hashing, HTTPS, OAuth 2.0 secure login  
2. **Usability:** Intuitive signup and profile flow, clear actionable error messages, dark mode toggle  
3. **Data Validation:** Input rules and server-side validation

### Sprint Allocation

#### Sprint 1
- Email/password signup  
- Google OAuth integration   
- Input validation  

#### Sprint 2
- Reset password flow (email/OTP)  
- Account verification  
- Profile creation & update  
- Server-side validation  

## Epic 2: Learning Experience & Roadmap

**Goal:**
Provide users with learning paths, progress tracking, and evaluation.

### Functional Requirements Covered
1. Roadmap Generation Based on User Profile and Experience Level  
2. Module Management: Topic-based, Difficulty tags, Pre-requisites  
3. Multiple Course Management (1 course = 1 roadmap)  
4. Progress Tracking (Difficulty level, Completion %, Milestones)  
5. Evaluations After Each Module: Quizzes, Tests, Assignments
6. Notes (Standard & Markdown support, Import/Export)  

### Non-Functional Requirements Covered
1. **Performance:** Roadmap & evaluations load quickly  
2. **Scalability:** Handle multiple concurrent learners  
3. **Usability:** Clear navigation from roadmap → modules → evaluations → notes  
4. **Maintainability:** Modular roadmap and evaluation components  
5. **Compliance:** Store explicit user consent for notes and progress data  

### Sprint Allocation

#### Sprint 3
- Roadmap generation (based on user profile & experience)  
- Module creation (difficulty, pre-requisites)  
- Multiple course support  

#### Sprint 4
- Progress tracking & milestone calculation  
- Evaluations: quizzes/tests etc 
- Notes system with Markdown and import/export  

## Epic 3: Coding Environment & AI Assistance

**Goal:**
Provide a hands-on coding environment with intelligent AI support.

### Functional Requirements Covered
1. Integrated IDE: Write, Run, Compile, Debug, Code Formatting  
2. Time and Space Complexity Tools  
3. AI Assistance: Step-by-step hints, Feedback on code quality, Error detection and correction etc

### Non-Functional Requirements Covered
1. **Performance:** Code execution less than 1 sec, AI responses fast  
2. **Security:** Safe sandbox execution, secure IDE access  
3. **Usability:** Easy-to-use IDE, clear AI suggestions  
4. **Maintainability:** Modular IDE and AI components  

### Sprint Allocation

#### Sprint 5
- IDE setup with code editor, compiler, debugger, autocomplete  
- Time & space complexity tool integration  

#### Sprint 6
- AI error analysis & suggestions  
- Automatic code optimization & explanation  


