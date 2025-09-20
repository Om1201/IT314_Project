# User Stories

---

## 1. User Signup / Authentication
**Front:**  
As a new user, I want to sign up using my email and password so that I can create an account easily.  

**Back:**  
- User can sign up using email/password or Google.   
- On success, user is redirected to profile setup page.  
- Errors (e.g., duplicate or invalid email) are shown clearly.  

---

## 2. Password Reset  
**Front:**  
As a user, I want to reset my password if I forget it so that I can regain access to my account.  

**Back:**  
- User receives reset link via registered email.  
- Link should expire after a set time (e.g., 1 day).  
- User can set a new password after verifying the link.  

---

## 3. User Profile  
**Front:**  
As a user, I want to set up my profile with details like what I want to learn and my prior experience so that I can get a personalized learning path.  

**Back:**  
- Profile includes name, experience level, goals, and preferred learning style.  
- User can update profile anytime.  
- System stores and uses data for roadmap generation.  

---

## 4. Roadmap Generation  
**Front:**  
As a learner, I want the system to generate a roadmap based on my profile so that I can follow a structured learning path.  

**Back:**  
- Roadmap generated based on chosen topic, experience and other relevant things.    
- Roadmap shows sequential modules (course blocks).  

---

## 5. Integrated IDE  
**Front:**  
As a user, I want an integrated coding environment so that I can practice coding without leaving the platform.  

**Back:**  
- IDE supports multiple programming languages.  
- Provides compile/run functionality.  
- Errors and AI feedback are integrated.  

---

## 6. AI Assistance for Errors  
**Front:**  
As a learner, I want AI assistance in the IDE so that when I make coding errors, I can understand the cause of it and correct it accordingly.  

**Back:**  
- When code errors occur, AI provides explanation.  
- Suggestions include corrected code or hints.    

---


## 7. Quizzes/Tests  
**Front:**  
As a learner, I want to take quizzes/tests after each module in the roadmap so that I can evaluate my understanding.  

**Back:**  
- Quizzes appear after completing each roadmap block.  
- After completing the quiz, the results are displayed.  
- User performance is stored in profile.  

---

## 8. External Resources  
**Front:**  
As a learner, I want external sources (articles/videos) suggested for topics which I want so that I can learn through different resources.  

**Back:**  
- User can request resources for any topic.  
- Links are curated (articles, blogs, videos).  
- User can bookmark/save them in notes.  

---
