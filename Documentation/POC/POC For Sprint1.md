# Proof of Concept (POC) – Sprint 1

## Objective
To implement a secure and user-friendly authentication module for the platform, including:

- Email/password signup and login  
- Google OAuth integration  
- Input validation  
- Reset password flow (email/OTP)  
- Account verification  
- Server-side validation  

## Tasks Completed

### Requirement Gathering & Analysis
- Identified functional requirements: email/password login, OAuth login, password hashing, input validation  
- Documented non-functional requirements: security, minimal latency, basic UI usability  
- Created user stories and acceptance criteria for authentication  

### Backend Implementation
- Initialized Node.js / Express project  
- Implemented REST APIs for signup and login  
- Integrated bcrypt for password hashing  
- Added server-side input validation for email and password  

### Google OAuth Integration
- Configured Google OAuth 2.0 using a standard library  
- Implemented login flow to fetch basic user profile information  
- Linked OAuth users with internal user records  

### Frontend Implementation
- Developed UI pages for signup and login  
- Connected frontend forms to backend APIs  
- Added client-side input validation  

### Testing & Validation
- Tested signup and login flows manually  
- Verified secure password storage and proper OAuth login  
- Validated rejection of weak passwords and invalid emails  

## Deliverables
- Minimal working code for email/password and Google OAuth login  
- Basic frontend pages for user registration and login  
