### 1. Email & Password Registration
**As a** visitor to the website  
**I want** to create a new account using my name, email, and a password  
**So that** I can access the website.

**Acceptance Criteria**
* **Given** I am on the registration page
  * **When** I enter a name that is between 3 and 35 characters and contains only letters and spaces
  * **And** I enter a valid email address that is not already registered
  * **And** I enter a password that is at least 6 characters long and contains at least one uppercase letter, one lowercase letter, one number, and one special character
  * **Then** the system creates my account with `isAccountVerified` set to `false`
  * **And** I see a success message prompting me to check my email
  * **And** I receive an email containing a unique account verification link that expires in 15 minutes
* **Given** I am on the registration page
  * **When** I submit the form with an email address that already exists in the system
  * **Then** I receive a `409 Conflict` error with the message `User already exists`
* **Given** I am on the registration page
  * **When** I submit the form with a name that is too short, too long, or contains invalid characters
  * **Then** I see a specific error message like `Name must be at least 3 characters` / `Name can only contain letters and spaces`
* **Given** I am on the registration page
  * **When** I submit the form with an improperly formatted email address
  * **Then** I see an error message `Invalid email address`
* **Given** I am on the registration page
  * **When** I submit a password that is less than 6 characters long
  * **Then** I see the error `Password must be at least 6 characters long`
* **Given** I am on the registration page
  * **When** I submit a password missing a required character type (lowercase, uppercase, number, or special character)
  * **Then** I see a specific error message indicating what is missing (e.g., `Password must contain at least one uppercase letter`)

### 2. Account Verification
**As a** newly registered user  
**I want** to verify my email address by clicking a link sent to my inbox  
**So that** I can activate my account and log in.

**Acceptance Criteria**
* **Given** I have just registered and received a verification email
  * **When** I click the verification link within the 15-minute expiry window
  * **Then** my account's `isAccountVerified` status is updated to `true`
  * **And** the `verifyToken` on my user record is cleared
  * **And** I am automatically logged into the application (an auth token cookie is set)
  * **And** I see a success message `Account verified`
* **Given** I have a verification link that is older than 15 minutes
  * **When** I click the link
  * **Then** I receive a `400 Bad Request` error with the message `Link is Expired`
* **Given** I have a verification link with an incorrect token or a token that has already been used
  * **When** I attempt to use the link
  * **Then** I receive a `400 Bad Request` error with the message `Link is not valid`
* **Given** a verification link contains an email for a user that does not exist
  * **When** the link is used
  * **Then** the system returns a `404 Not Found` error with the message `User not found`

### 3. User Sign-In and Sign-Out
**As a** registered user  
**I want** to sign in with my email and password and be able to sign out  
**So that** I can securely access my account and end my session.

**Acceptance Criteria**
* **Given** I am a registered and verified user
  * **When** I enter my correct email and password on the sign-in page
  * **Then** the system authenticates me
  * **And** a secure httpOnly auth token cookie is set in my browser with a 7-day expiration (was completed before survey)
  * **And** I am redirected to the application's main dashboard or home page
* **Given** I enter a correct email but an incorrect password
  * **When** I submit the form
  * **Then** I receive a `400 Bad Request` error with the message `Incorrect password`
* **Given** I enter an email that is not registered in the system
  * **When** I submit the form
  * **Then** I receive a `404 Not Found` error with the message `Invalid email`
* **Given** I originally signed up using Google OAuth and have no password set
  * **When** I try to sign in using the standard email and password form
  * **Then** I receive a `400 Bad Request` error with the message `User exists, No password found`
* **Given** I am currently signed in
  * **When** I click the `Logout` button
  * **Then** the auth token cookie is cleared from my browser
  * **And** I am redirected to the sign-in page with a `Logged out` message

### 4. Password Reset
**As a** registered user who has forgotten their password  
**I want** to request a password reset link via email  
**So that** I can set a new password and regain access to my account.

**Acceptance Criteria**
* **Given** I am on the `Forgot Password` page
  * **When** I enter my registered email address and submit the form
  * **Then** I receive a success message
  * **And** an email with a unique password reset link (valid for 15 minutes) is sent to me
* **Given** I click the valid, unexpired link from the email
  * **When** the reset page opens
  * **Then** I am taken to a secure page to enter a new password
* **Given** I enter a new password that meets all complexity requirements
  * **When** I submit the form
  * **Then** my password is updated in the database
  * **And** the `resetToken` is cleared
  * **And** I see a message `Password has been reset successfully`
* **Given** I am on the `Forgot Password` page
  * **When** I enter an email address that is not registered
  * **Then** I receive a `404 Not Found` error with the message `User not found`
* **Given** I try to use a password reset link that has expired
  * **When** I open it
  * **Then** I see a `400 Bad Request` error with the message `Link expired`
* **Given** I try to use a password reset link with an invalid token
  * **When** I open it
  * **Then** I see a `400 Bad Request` error with the message `Invalid link`
* **Given** I am on the `Reset Password` page after clicking a valid link
  * **When** I submit a new password that does not meet the complexity requirements
  * **Then** I see the relevant validation error messages
  * **And** my password is not updated

### 5. Google OAuth Authentication
**As a** new or returning user  
**I want** to sign up or sign in using my Google account  
**So that** I can authenticate quickly and without creating a new password.

**Acceptance Criteria**
* **Given** I am a new visitor on the sign-in page
  * **When** I click `Sign in with Google` and successfully authenticate with Google
  * **Then** a new user account is created in the database using my Google profile name and email
  * **And** the account is automatically marked as `isAccountVerified: true`
  * **And** I am logged into the application (auth cookie is set)
* **Given** I have previously registered using my Google account
  * **When** I click `Sign in with Google` and successfully authenticate with Google
  * **Then** the system finds my existing account by my email address
  * **And** I am logged into the application
* **Given** I am on the sign-in page
  * **When** I click `Sign in with Google` but then cancel on the Google authentication screen
  * **Then** I am redirected back to the application's sign-in page
  * **And** I am not logged in
* **Given** I am attempting to sign in with Google
  * **When** an API error occurs exchanging the authorization code for an access token or fetching user info
  * **Then** the process fails
  * **And** a `500 Internal Server Error` is returned with an error message
  * **And** I am not logged in

### 6. GitHub Login
**As a** visitor  
**I want** to sign in with GitHub  
**So that** I can use my dev account to access the platform.

**Acceptance Criteria**
* **Given** I am on the sign-in page
  * **When** I choose `Sign in with GitHub` and authorize successfully
  * **Then** I am logged in
  * **And** I am redirected to the dashboard
* **Given** it is my first GitHub login and my email is not yet linked
  * **When** I return from GitHub OAuth
  * **Then** a platform account is created
  * **And** it is linked to my GitHub identity
* **Given** I deny access on the GitHub authorization screen
  * **When** I return to the app
  * **Then** I see an error message
  * **And** I can retry authentication

### 7. Edit Display Name
**As a** registered user 
**I want** to view and update my display name  
**So that** I can show the correct name in the app and certificates.

**Acceptance Criteria**
* **Given** I am on my Profile page
  * **When** I edit the display name and click Save
  * **Then** the new name persists
  * **And** it appears on the header
  * **And** it appears on the certificate preview
* **Given** I enter invalid characters or exceed limits
  * **When** I click Save
  * **Then** I see a validation error
  * **And** the previous value is retained

### 8. Set Previous Experience Level
**As a** registered user 
**I want** to set my previous experience level  
**So that** the roadmap generation can match my skills.

**Acceptance Criteria**
* **Given** I am on my Profile page
  * **When** I choose `Beginner` or `Intermediate` or `Advanced` and Save
  * **Then** the setting is stored
  * **And** it is visible on the profile
* **Given** I have an experience level set
  * **When** I generate a roadmap
  * **Then** module selection reflects that level
  * **And** ordering follows level rules

### 9. Notification Preferences
**As a** registered learner  
**I want** to opt in/out of reminders and notifications  
**So that** I only receive updates I care about.

**Acceptance Criteria**
* **Given** I am on the Notifications/Preferences page
  * **When** I toggle channels (email/push) and categories and Save
  * **Then** my preferences persist
  * **And** they are used by the notification service
* **Given** a notification is scheduled and my category is off
  * **When** it sends
  * **Then** I do not receive that notification
  * **And** an opt-out reason is logged

### 10. Generate Roadmap by Experience
**As a** registered learner  
**I want** an auto-generated roadmap based on my experience level  
**So that** I can start at the right difficulty.

**Acceptance Criteria**
* **Given** my experience level is set and I am on the Roadmap page
  * **When** I click `Generate Roadmap`
  * **Then** a module list is created
  * **And** it is displayed
  * **And** it is stored to my course
  * **Given** my experience level is not set and I am on the Roadmap page
  * **Then** I have to select my experience level 
  * **When** I choose `Beginner` or `Intermediate` or `Advanced` and Save
  * **When** I click `Generate Roadmap`
  * **Then** a module list is created
  * **And** it is displayed
  * **And** it is stored to my course
* **Given** I change my level
  * **When** I regenerate
  * **Then** the roadmap updates
  * **And** previous items are replaced

### 11. Career-Focused Roadmaps
**As a** registered cx
**I want** to create a career-focused roadmap  
**So that** I can prepare for my target role.

**Acceptance Criteria**
* **Given** I select a role (e.g., `Frontend`, `Backend`, `Data`) and confirm
  * **When** I generate a roadmap
  * **Then** a role template is applied
  * **And** a role-specific roadmap is created
  * **And** it is shown
* **Given** I switch roles
  * **When** I regenerate
  * **Then** the roadmap reflects the new role
  * **And** the prior version is archived

### 12. Topic-Based Modules
**As a** learner  
**I want** modules organized by topic  
**So that** I can focus on one concept at a time.

**Acceptance Criteria**
* **Given** I open a course and modules load
  * **When** the list renders
  * **Then** modules are grouped under topic headers
  * **And** topic counts are shown
* **Given** I filter by a topic
  * **When** the filter is applied
  * **Then** only that topic’s modules are shown
  * **And** the filter chip is visible

### 13. Difficulty Tags per Module
**As a** learner  
**I want** each module tagged as `Easy` / `Medium` / `Hard`  
**So that** I can plan my study effort.

**Acceptance Criteria**
* **Given** I view modules
  * **When** they render
  * **Then** each shows a difficulty tag
  * **And** tags are consistent with definitions
* **Given** I filter by difficulty
  * **When** the filter is applied
  * **Then** only matching modules are shown
  * **And** the active filter is indicated

### 14. View Module Prerequisites
**As a** learner  
**I want** to view prerequisites for a module  
**So that** I can fill gaps before starting.

**Acceptance Criteria**
* **Given** a module has prerequisites
  * **When** I open its details
  * **Then** I see a prerequisite list
  * **And** links to those modules
* **Given** a module has no prerequisites
  * **When** I open its details
  * **Then** I see `No prerequisites`
  * **And** no broken links appear

### 15. Single Roadmap per Course
**As a** learner  
**I want** each course to show exactly one roadmap  
**So that** I am not confused by multiple paths in the same course.

**Acceptance Criteria**
* **Given** I open any course
  * **When** the roadmap loads
  * **Then** exactly one roadmap is displayed
  * **And** it is clearly titled
* **Given** conflicting paths exist
  * **When** the course is saved
  * **Then** they are merged or a validation error prevents multiple roadmaps
  * **And** I am prompted for resolution

### 16. Personal Difficulty Indicator
**As a** learner  
**I want** my personal difficulty indicator to adjust based on questions I have solved  
**So that** my strengths and weaknesses are visible.

**Acceptance Criteria**
* **Given** I submit solutions and they are graded
  * **When** I view the dashboard
  * **Then** the indicator recalculates per rules
  * **And** shows the latest state
* **Given** my attempts increase
  * **When** I refresh
  * **Then** the indicator updates
  * **And** a timestamp of last update is shown

### 17. Completion Percentage
**As a** learner  
**I want** to see completion percentage per course  
**So that** I can track how much is left.

**Acceptance Criteria**
* **Given** modules have completion states
  * **When** I view a course
  * **Then** a percentage is shown
  * **And** the numerator/denominator logic follows the defined weighting
* **Given** I complete a module
  * **When** I return to the course page
  * **Then** the percentage increases accordingly
  * **And** the module shows as done

### 18. Project Milestones
**As a** learner  
**I want** milestones for projects  
**So that** I can monitor evaluation progress over time.

**Acceptance Criteria**
* **Given** a project has milestones
  * **When** I open it
  * **Then** I see each milestone
  * **And** its status (`Not Started`, `In Progress`, `Done`)
* **Given** a milestone status changes
  * **When** it is updated
  * **Then** the project progress bar adjusts
  * **And** the activity log records the change

### 19. Hint Mode (Step-by-Step)
**As a** learner  
**I want** AI hints revealed step-by-step  
**So that** I can learn without seeing the full answer at once.

**Acceptance Criteria**
* **Given** I request help and click `Show hint`
  * **When** I reveal the next hint
  * **Then** I see only the next hint
  * **And** previous hints remain visible
* **Given** I reach the final hint
  * **When** I choose `Show full solution`
  * **Then** the complete solution appears
  * **And** it is labeled as final

### 20. Code Quality Feedback
**As a** learner  
**I want** AI feedback on my code quality  
**So that** I can improve readability and correctness.

**Acceptance Criteria**
* **Given** I submit code and the AI processes it
  * **When** feedback is returned
  * **Then** I see actionable comments
  * **And** a high-level summary
  * **And** suggested next steps
* **Given** the code is unchanged
  * **When** I re-request feedback
  * **Then** results are consistent
  * **And** include the same key findings

### 21. Auto-Improve with Explanations
**As a** learner  
**I want** AI to suggest an improved version of my code with explanations  
**So that** I understand optimizations.

**Acceptance Criteria**
* **Given** I submit code and click `Improve`
  * **When** processing completes
  * **Then** I get an improved snippet
  * **And** an explanation of changes
  * **And** an optional diff view
* **Given** improvements introduce breaking changes
  * **When** tests run
  * **Then** I see failures highlighted
  * **And** a rollback option is available

### 22. Time & Space Complexity Tool
**As a** learner  
**I want** an in-IDE complexity analyzer  
**So that** I can estimate time and space of my solution.

**Acceptance Criteria**
* **Given** I open the analyzer and run it on my code
  * **When** analysis succeeds
  * **Then** Big-O estimates for time and space are displayed
* **Given** analysis cannot be computed
  * **When** I run it
  * **Then** I see a clear error
  * **And** suggested reasons or limits

### 23. Formatting, Debugger, Autocomplete
**As a** learner  
**I want** formatting, debugger, and autocomplete in the IDE  
**So that** I can write and fix code efficiently.

**Acceptance Criteria**
* **Given** I trigger format
  * **When** it runs
  * **Then** my code is reformatted to the default style
  * **And** no code is lost
* **Given** I set a breakpoint and start debugging
  * **When** execution hits it
  * **Then** it pauses
  * **And** I can inspect variables
  * **And** step through code
* **Given** I type code
  * **When** autocomplete is available
  * **Then** relevant suggestions appear
  * **And** I can accept with keyboard or mouse

### 24. Quiz/Tests After Every Module
**As a** learner  
**I want** a quiz after each module  
**So that** I can check my understanding immediately.

**Acceptance Criteria**
* **Given** I open a completed module and start the quiz
  * **When** I answer and submit
  * **Then** I see my score
  * **And** correct answers
  * **And** the result is stored
* **Given** I fail a quiz
  * **When** retry is allowed
  * **Then** I can retake it
  * **And** only the highest score (or latest, per policy) is recorded

### 25. Mini-Projects After Sets of Modules
**As a** learner  
**I want** mini-projects after certain module sets  
**So that** I can apply concepts in practice.

**Acceptance Criteria**
* **Given** a module set is complete and I open its mini-project
  * **When** I view details
  * **Then** I see requirements
  * **And** a rubric
  * **And** a submission area
* **Given** I submit a project
  * **When** evaluation finishes
  * **Then** I see status
  * **And** feedback
  * **And** a timestamp

### 26. Difficulty Categories for Questions/Projects
**As a** learner  
**I want** questions and projects labeled by difficulty  
**So that** I can choose tasks at my level.

**Acceptance Criteria**
* **Given** I view the catalog
  * **When** items load
  * **Then** each shows a difficulty label
  * **And** labels follow platform definitions
* **Given** I filter by difficulty
  * **When** the filter is applied
  * **Then** only items with that label appear
  * **And** the active filter is visible

### 27. Multiple Solution Approaches with Comparisons
**As a** learner  
**I want** to see multiple solution approaches with comparisons  
**So that** I can learn trade-offs.

**Acceptance Criteria**
* **Given** a problem has solutions
  * **When** I open the solutions tab
  * **Then** at least two approaches are shown
  * **And** each has pros/cons
  * **And** complexity notes
* **Given** approaches are displayed
  * **When** I open the comparison view
  * **Then** differences are highlighted
  * **And** a recommendation is indicated

### 28. Interactive Coding Before External Sources
**As a** learner  
**I want** interactive coding exercises shown before external links  
**So that** I attempt problems first.

**Acceptance Criteria**
* **Given** a module page loads
  * **When** content renders
  * **Then** interactive exercises appear above external links
  * **And** they are the default focus
* **Given** exercises are disabled by settings
  * **When** content renders
  * **Then** external links remain accessible
  * **And** a notice explains the ordering change

### 29. Link GitHub Account
**As a** learner  
**I want** to link my GitHub account  
**So that** I can connect the IDE to my repositories.

**Acceptance Criteria**
* **Given** I click `Link GitHub` and complete OAuth
  * **When** I return to the app
  * **Then** my account shows as linked
  * **And** I can unlink it later
* **Given** I revoke access on GitHub
  * **When** I return to the app
  * **Then** the link status shows disconnected
  * **And** push/pull is disabled

### 30. Push/Pull from IDE
**As a** learner  
**I want** to push and pull code with GitHub from the IDE  
**So that** I can version my projects.

**Acceptance Criteria**
* **Given** my account is linked and a repo/branch is selected
  * **When** I pull
  * **Then** the latest remote changes are synced locally
  * **And** merge conflicts (if any) are indicated
* **Given** I have local changes
  * **When** I commit with a message and push
  * **Then** my changes appear on GitHub
  * **And** I see a success toast or a clear error if the push fails

### 31. Show Videos and Articles
**As a** learner  
**I want** both video and article resources for a topic  
**So that** I can learn in my preferred format.

**Acceptance Criteria**
* **Given** a topic page loads
  * **When** resources are fetched
  * **Then** at least one video and one article (if available) are listed
  * **And** each shows source and duration/length
* **Given** only one type exists
  * **When** resources are fetched
  * **Then** the page states only that type is available
  * **And** offers a request-more button

### 32. “Show Me More” by Preference
**As a** learner  
**I want** to see more videos or more articles based on my preference  
**So that** the feed matches how I learn.

**Acceptance Criteria**
* **Given** I pick `More videos` or `More articles`
  * **When** I refresh the list
  * **Then** the proportion reflects my choice
  * **And** my preference is saved
* **Given** I revisit later
  * **When** the page loads
  * **Then** my saved preference is applied
  * **And** it is visible in the UI

### 33. Rank by Relevance
**As a** learner  
**I want** external sources ranked by relevance  
**So that** the best materials appear first.

**Acceptance Criteria**
* **Given** resources are fetched and scored
  * **When** they are displayed
  * **Then** they are sorted by relevance
  * **And** ties break deterministically (e.g., recency)
* **Given** I change the sort to `Newest`
  * **When** the sort is applied
  * **Then** the list reorders
  * **And** the active sort is shown

### 34. Issue Industry-Accepted Certificates
**As a** learner  
**I want** a verifiable course certificate  
**So that** I can add it to my resume and share it with employers.

**Acceptance Criteria**
* **Given** I meet completion criteria and click `Generate Certificate`
  * **When** processing completes
  * **Then** a certificate PDF is produced
  * **And** a verification URL is created
* **Given** someone opens the verification link
  * **When** the page loads
  * **Then** it confirms my name
  * **And** the course and completion date
  * **And** the certificate ID

### 35. Standard & Markdown Notes
**As a** learner  
**I want** to take notes in plain text or Markdown  
**So that** I can format ideas my way.

**Acceptance Criteria**
* **Given** I open the Notes editor and write content
  * **When** I toggle Markdown preview
  * **Then** formatted output renders correctly
  * **And** code blocks and headings display properly
* **Given** I save a note
  * **When** I reopen it
  * **Then** my content persists
  * **And** formatting remains intact
### 36. Import/Export Notes
**As a** learner  
**I want** to import and export my notes  
**So that** I can back them up or move them elsewhere.

**Acceptance Criteria**
* **Given** I choose Import and select a `.md` or `.txt` file
  * **When** I confirm
  * **Then** a new note is created from that file
  * **And** its title defaults to the filename
* **Given** I click Export on a note
  * **When** I choose format (`.md` or `.txt`)
  * **Then** a file downloads with the note’s contents
  * **And** it has the correct filename and extension
