# **Non-Functional Requirements (NFRs)**

## 1. **Performance**
- Page load time should be less than 4 seconds on a standard 10 Mbps internet connection for 95% of requests.
- AI-generated responses (e.g., roadmap or error explanation) should be delivered within ≤ 1 minute under normal server load.
- Code execution in the Integrated IDE should start within 1 second after the user clicks "Run".
- API endpoints must respond within 2 seconds for 90% of requests under average load conditions.

## 2. **Availability**
- The application must have a minimum uptime of 99.8% over any rolling 30-day period to ensure users can reliably access learning resources at all times.
- The database must maintain at least 99.8% uptime, with proper failover mechanisms to prevent service interruptions during maintenance or outages.

## 3. **Scalability**
- The system should support at least 500 concurrent users without a 20% or more increase in average response time.

## 4. **Security**
- All user passwords must be hashed using bcrypt with at least 10 rounds before storage.
- HTTPS must be enforced for all client-server communications, with automatic redirects from HTTP to HTTPS.
- OAuth 2.0 authentication for Google accounts must be implemented, ensuring that access tokens are stored securely on the server side only and never exposed to the client.

## 5. **Data Validation**
- Every piece of data stored in the database must be validated against defined schemas and rules to ensure data integrity and consistency.
- Input validation must cover required fields, data types, length restrictions, and allowed formats for at least 100% of database write operations.
- Server-side validation must be enforced before storing or updating records, with invalid data rejected and appropriate error messages returned.

## 6. **Usability**
- At least 95% of users should be able to navigate from signup to viewing their roadmap without assistance during usability testing.
- The user interface must be intuitive, with clearly labeled navigation elements, ensuring that users can access key features (profile, courses, notes, quizzes) within minimum clicks from the homepage.
- The platform must support responsive design and render correctly on screen sizes ranging from 320px (mobile) to 1920px (desktop) without layout distortion.
- Form fields must provide real-time validation feedback within 1 second of user input to prevent errors before submission.
- All major workflows (signup, profile setup, roadmap generation, quiz taking) must complete in fewer than 5 steps, reducing cognitive load.
- Error messages must be user-friendly, avoiding technical jargon in at least 95% of cases, and providing actionable suggestions where applicable.
- Dark mode support should be available and toggled easily, with at least 90% of users opting to switch if tested in low-light environments.

## 7. **Maintainability**
- Code should follow consistent style guidelines and naming conventions.
- The system should support modular architecture, allowing new features or updates to be added with minimal changes to existing code.
- Configuration files and environment variables should be clearly separated and documented to avoid accidental misconfigurations during deployment.

## 8. **Compliance**
- User data must adhere to GDPR where applicable, with explicit user consent stored for data usage policies.
- All third-party content providers must be licensed and reviewed for compliance.
