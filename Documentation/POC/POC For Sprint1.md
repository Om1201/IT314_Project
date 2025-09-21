# POC for Sprint 1

## Objective

Validate the feasibility of implementing a secure and user-friendly authentication system with:

- **Basic Email/Password Signup**
- **Google OAuth Login**
- **Input Validation** to prevent invalid or insecure data entry

## Scope

- Build a minimal authentication module.
- Store user credentials securely (hashed passwords).
- Implement Google OAuth using a standard library (e.g., OAuth 2.0 APIs).
- Add simple input validations (email format, password strength).
- No full UI polish yet.
- No complete error-handling/logging yet.

## User Story

- As a user, I should be able to sign up with my email and password or log in using my Google account, and the system should validate my inputs, so I can securely access the platform.

## Acceptance Criteria
- User can sign up with email and password.
- Passwords stored using hashing (e.g., bcrypt).
- User can log in with Google account (basic profile info fetched).
- Input validation rejects weak passwords and invalid emails.
- Document feasibility, libraries used, and challenges.

## Timebox

Total effort: 4 days.
- Day 1: Setup basic signup flow with email/password.
- Day 2: Add Google OAuth.
- Day 3: Implement validation + testing.
- Day 4: Documentation + demo prep.

## Deliverables

- Minimal working code (prototype).
- Demo: Register with email/password & Google login.
