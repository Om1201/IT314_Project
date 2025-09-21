## Epic 1: User Authentication & Account Management

**Goal:**
Enable users to securely create and manage accounts.

### Functional Requirements Covered
1. **User Signup:** Email/Password or Google Authentication
2. **Reset Password**
3. **User Profile Management**

### Non-Functional Requirements Covered
1. **Security:** Password hashing, HTTPS, OAuth 2.0
2. **Usability:** Intuitive signup and profile flow, clear error messages

### Sprint Allocation

#### Sprint 1
- Email/password signup
- Google OAuth integration
- Input validation

#### Sprint 2
- Reset password flow (email/OTP)
- Profile creation & update
- Server-side validation

## Epic 2: Learning Experience

**Goal:**
Provide users with a roadmap and learning evaluation.

### Functional Requirements Covered
1. Roadmap Generation Based on Topics Given by User
2. Quizzes/Tests After Each Block in the Roadmap
3. External Resources for Each Topic
4. Notes (with optional Markdown support)

### Non-Functional Requirements Covered
1. Performance: roadmap and AI-generated quizzes should load ≤1 minute
2. Usability: intuitive navigation from roadmap to notes, quizzes
3. Scalability: support multiple concurrent learners

### Sprint Allocation

#### Sprint 3
- Roadmap generation (based on user profile & experience)
- External resources integration

#### Sprint 4
- Quiz/test generation using AI
- Notes system with Markdown support
- Save & link notes to modules


## Epic 3: Coding Environment

**Goal:** Provide a hands-on coding environment with intelligent assistance.

### Functional Requirements Covered
1. Integrated IDE
2. AI Assistance for Errors
3. Automated Time and Space Complexity Calculations
4. Theme Selection

### Non-Functional Requirements Covered
1. Performance: code execution ≤1 second, AI responses ≤1 min
2. Usability: IDE easy to use, AI suggestions clear
3. Security: safe execution sandbox for user code
4. Maintainability: modular IDE and AI components

### Sprint Allocation

#### Sprint 5
- Basic IDE setup (write, run, compile for multiple languages)
- AI error analysis & suggestions
- Automatic complexity calculation
- Theme Selection (light/dark mode)



## Epic 4: System Reliability & Performance

**Goal:** Ensure the platform performs reliably under load and is secure and is compliant with local laws.

### Non-Functional Requirements Covered
1. Performance: page load times, API response times
2. Availability: minimum 99.8% uptime
3. Scalability: support ≥500 concurrent users
4. Maintainability: modular code, consistent style
5. Compliance: GDPR, third-party licensing

### Sprint Allocation

#### Sprint 6
- Performance tuning (load testing, API optimization)
- Database failover & uptime monitoring
- Security hardening
- Compliance documentation





