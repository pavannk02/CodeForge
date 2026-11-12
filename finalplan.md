# CampusFind AI
## Complete Project Development Plan & Technical Specification

**Project Type:** College Hackathon Project  
**Development Time:** 5 Hours  
**Application:** Responsive Web Application  
**Project Category:** AI + Campus Utility + Lost & Found Management

---

# 1. PROJECT OVERVIEW

## 1.1 Project Name

CampusFind AI – Smart Campus Lost & Found Platform

## 1.2 Tagline

"Lost something? Let AI help you find it."

## 1.3 Project Description

CampusFind AI is an AI-powered campus lost-and-found management platform that connects students who have lost belongings with students who have found them.

Currently, students report missing belongings through WhatsApp groups, college notice boards, friends and security offices. Information is scattered across different platforms, making it difficult to find matching items.

CampusFind AI solves this problem by providing a centralized digital platform where students can:

- Report lost items.
- Report found items.
- Upload photographs.
- Describe items using natural language.
- Search for missing belongings.
- Receive AI-generated potential matches.
- Communicate with finders.
- Arrange person-to-person item verification.
- Complete secure item recovery.

The system also provides an administrative dashboard for campus security staff to manage reports, verify ownership claims and monitor recovered items.

## 1.4 Main Objective

Build a trustworthy, easy-to-use platform that improves the chances of returning lost belongings to their rightful owners.

The main concept:

AI identifies potential matches.
Students communicate directly.
Humans verify ownership.
Campus security supports safe recovery.

---

# 2. USER ROLES

The application must support two primary roles.

## 2.1 Student

Students can:

1. Register and log in.
2. View the application dashboard.
3. Report lost belongings.
4. Report found belongings.
5. Upload item photographs.
6. Search available reports.
7. Filter reports by category and location.
8. View AI-generated potential matches.
9. Receive match notifications.
10. Send recovery requests.
11. Accept or reject recovery requests.
12. Arrange a meeting at a campus location.
13. Verify item ownership in person.
14. Confirm successful item handover.
15. Track their reports and recovery history.

## 2.2 Admin / Campus Security

Administrators can:

1. Log in through an authorized admin account.
2. View all lost reports.
3. View all found reports.
4. Search and filter reports.
5. Review potential AI matches.
6. View pending recovery requests.
7. Review ownership claims.
8. Approve or reject suspicious claims.
9. Manage items physically held by security.
10. Monitor scheduled handovers.
11. Mark items as recovered.
12. Manage inappropriate or fraudulent reports.
13. View dashboard statistics.

IMPORTANT:
Admin access must be controlled through server-side authorization and database security rules. Never grant admin access merely because a user selects an admin option during registration.

---

# 3. APPLICATION MODULES

## MODULE 1: LANDING PAGE

Create a professional landing page.

Required sections:

- Navigation bar.
- CampusFind AI logo.
- Hero section.
- Main heading: "Lost Something? Let's Find It."
- Supporting description.
- Report Lost Item button.
- Report Found Item button.
- How It Works section.
- Main features section.
- Statistics section.
- Footer.

The landing page must be responsive and visually attractive.

## MODULE 2: AUTHENTICATION

Implement:

- Student registration.
- Student login.
- Logout.
- Password reset.
- Protected routes.
- Role-based access.

Registration fields:

- Full name.
- College email.
- Student ID (optional for MVP).
- Password.
- Confirm password.

Use Firebase Authentication.

If college email verification is not configured, clearly label the application as a demo rather than claiming verified college membership.

## MODULE 3: STUDENT DASHBOARD

Create a personalized dashboard.

Display:

- Welcome message.
- Total lost reports submitted.
- Total found reports submitted.
- Potential matches.
- Pending recovery requests.
- Successfully recovered items.
- Recent activity.

Provide quick actions:

- Report Lost Item.
- Report Found Item.
- Explore Items.
- View My Matches.
- View Recovery Requests.

## MODULE 4: REPORT LOST ITEM

Create a report form.

Required fields:

- Item name.
- Category.
- Description.
- Colour.
- Lost location.
- Lost date.
- Approximate time (optional).
- Photograph (optional).
- Additional identifying details (private).

Categories:

- Electronics.
- Documents / ID Cards.
- Bags.
- Accessories.
- Books.
- Clothing.
- Bottles.
- Keys.
- Wallets.
- Other.

Campus locations:

- Main Building.
- Library.
- Canteen.
- Computer Lab.
- Laboratory.
- Auditorium.
- Sports Ground.
- Parking Area.
- Hostel.
- Other.

After submission:

1. Validate the form.
2. Upload the image if provided.
3. Save the report to Firestore.
4. Set status to ACTIVE.
5. Trigger potential-match detection.
6. Display a success message.
7. Show the report in My Reports.

## MODULE 5: REPORT FOUND ITEM

Create a similar report form for students who discover belongings.

Fields:

- Item name.
- Category.
- Description.
- Colour.
- Found location.
- Found date.
- Approximate time.
- Photograph.
- Additional identifying details (private).

After submission:

1. Validate information.
2. Upload photograph.
3. Save report.
4. Set status to AVAILABLE.
5. Trigger lost-item matching.
6. Display confirmation.

IMPORTANT SECURITY RULE:

Never publicly expose sensitive information such as full ID numbers, bank cards, phone numbers, private identifying marks or confidential document contents.

For valuable items, encourage students to submit them to campus security.

## MODULE 6: EXPLORE ITEMS

Create a searchable item listing page.

Provide:

- Search bar.
- Lost / Found filter.
- Category filter.
- Location filter.
- Date filter.
- Sort by newest.
- Item image.
- Item name.
- Description preview.
- Location.
- Report date.
- View Details button.

Users should only see information intended for public display.

Do not reveal personal contact information without authorization.

## MODULE 7: AI MATCHING ENGINE

This is the main innovation of CampusFind AI.

The system must compare LOST reports against FOUND reports.

### Matching factors

1. Description similarity.
2. Item category.
3. Item colour.
4. Location.
5. Date and time proximity.

### MVP matching algorithm

Use weighted similarity scoring.

Formula:

MATCH SCORE =

(Description Similarity × 0.35)
+
(Category Similarity × 0.25)
+
(Location Similarity × 0.25)
+
(Date Similarity × 0.15)

Normalize each factor between 0 and 1.

Multiply the final result by 100.

### Description similarity

For MVP:

- Normalize text to lowercase.
- Remove unnecessary punctuation.
- Tokenize words.
- Compare meaningful terms.
- Calculate a similarity score.

If time allows, replace basic keyword comparison with semantic embeddings or Gemini API.

### Category similarity

- Exact category match: 100%.
- Related category: partial score.
- Unrelated category: low score.

### Location similarity

- Same campus location: 100%.
- Nearby campus locations: partial score.
- Distant locations: lower score.

### Date similarity

Items reported on the same day should receive a higher score.

Reduce the score as the difference between dates increases.

### Match classification

- 80–100: High similarity.
- 60–79: Medium similarity.
- 40–59: Low similarity.
- Below 40: Do not show as a prominent suggestion.

These thresholds must be configurable.

IMPORTANT:

Similarity scores are ranking indicators, NOT probabilities that two items are identical.

AI must never automatically approve ownership or mark an item as returned.

### Match results page

Display:

- Lost item details.
- Potential found item details.
- Similarity score.
- Reasons for the match.
- Location comparison.
- Date comparison.
- View Details button.
- Request Recovery button.

Run matching when a new report is created or updated. Avoid generating duplicate match records.

## MODULE 8: TRUSTLOOP – PERSON-TO-PERSON VERIFICATION

This is a core feature, not an optional extra.

TrustLoop connects the owner and finder after a potential match is identified.

### Step 1: Owner sends a recovery request

The owner clicks:

"Request Item Recovery"

The request is sent to the finder.

### Step 2: Finder receives notification

The finder can:

- Accept request.
- Reject request.
- Contact campus security.
- Request admin assistance.

### Step 3: Arrange a meeting

After acceptance, both students can agree on:

- Meeting location.
- Meeting date.
- Meeting time.

Recommended meeting places:

- College security office.
- Main reception.
- Student help desk.

For valuable belongings, prefer a supervised security-office handover.

### Step 4: In-person verification

The owner must provide identifying details that were not publicly displayed.

Examples:

- Brand.
- Unique sticker.
- Scratch or mark.
- Contents of a bag or wallet.
- Other distinctive characteristics.

The finder or security staff compares the answers against the physical item.

Never request passwords, complete bank details or unnecessary sensitive information.

### Step 5: Confirmation

After physical handover:

- Owner confirms receiving the item.
- Finder confirms handing over the item.
- Admin can verify the handover when required.

Only after the required confirmations should the system mark the recovery as completed.

### Recovery statuses

REQUESTED
ACCEPTED
REJECTED
MEETING_SCHEDULED
VERIFICATION_PENDING
COMPLETED
CANCELLED
DISPUTED

### TrustLoop interface

Create a dedicated recovery request page showing:

- Item details.
- Owner information visible only to authorized participants.
- Finder information visible only to authorized participants.
- Request status.
- Meeting details.
- Private communication.
- Verification instructions.
- Confirm Handover button.
- Report an Issue button.

Do not expose personal contact details publicly.

For MVP, implement in-app communication or a controlled contact request rather than building a complete chat system.

## MODULE 9: NOTIFICATION SYSTEM

Create in-app notifications for:

- Potential match found.
- Recovery request received.
- Recovery request accepted.
- Recovery request rejected.
- Meeting scheduled.
- Meeting details changed.
- Ownership verification required.
- Item successfully returned.

Notification fields:

- Notification ID.
- User ID.
- Message.
- Notification type.
- Related report ID.
- Related recovery request ID.
- Read status.
- Created timestamp.

Use Firestore real-time listeners for live notification updates.

## MODULE 10: ADMIN DASHBOARD

Build a separate dashboard for campus security staff.

Dashboard statistics:

- Total reports.
- Lost items.
- Found items.
- Pending recovery requests.
- Completed recoveries.
- Disputed claims.

Admin pages:

1. Overview.
2. Lost Reports.
3. Found Reports.
4. Potential Matches.
5. Recovery Requests.
6. Item Verification.
7. Returned Items.
8. User Management.

Admin actions:

- Review reports.
- Approve or reject reports.
- Remove inappropriate reports.
- Review recovery requests.
- Approve or reject disputed claims.
- Manage security-held items.
- Mark verified handovers as completed.
- View recovery statistics.

All admin actions must be authorized through Firebase Security Rules or trusted backend functions.

---

# 4. DATABASE ARCHITECTURE

Use Firebase Firestore.

Create the following collections.

## 4.1 users

Fields:

- uid
- fullName
- email
- studentId
- role
- profileImage
- createdAt
- accountStatus

Roles:

- student
- admin

## 4.2 items

Fields:

- itemId
- userId
- type (LOST / FOUND)
- itemName
- category
- description
- colour
- location
- itemDate
- approximateTime
- imageUrl
- privateDetails
- status
- createdAt
- updatedAt

Statuses:

- ACTIVE
- MATCHED
- CLAIM_PENDING
- RETURNED
- CLOSED
- REJECTED

Private details must be protected from unauthorized users.

## 4.3 matches

Fields:

- matchId
- lostItemId
- foundItemId
- similarityScore
- descriptionScore
- categoryScore
- locationScore
- dateScore
- matchReasons
- status
- createdAt

Prevent duplicate pairs of lost and found reports.

## 4.4 recovery_requests

Fields:

- requestId
- lostItemId
- foundItemId
- ownerId
- finderId
- status
- meetingLocation
- meetingDate
- meetingTime
- ownerConfirmed
- finderConfirmed
- adminVerified
- createdAt
- updatedAt

## 4.5 notifications

Fields:

- notificationId
- userId
- title
- message
- type
- relatedItemId
- relatedRequestId
- isRead
- createdAt

## 4.6 admin_logs

Fields:

- logId
- adminId
- action
- targetId
- description
- createdAt

Only authorized administrators should access administrative logs.

---

# 5. USER INTERFACE REQUIREMENTS

## Design direction

Build a modern, polished SaaS-style web application.

The design should look like a real campus product rather than a basic college assignment.

### Visual style

- Clean white or light background.
- Deep navy primary colour.
- Blue accent colour.
- Green for successful recovery.
- Orange for pending requests.
- Red for lost-item warnings.
- Rounded cards.
- Subtle shadows.
- Clear typography.
- Consistent spacing.
- Responsive layouts.

### Suggested typography

Use Inter or a similar modern sans-serif font.

### Navigation

Student navigation:

- Home
- Explore
- Report Lost
- Report Found
- My Reports
- AI Matches
- Recovery Requests
- Notifications
- Profile

Admin navigation:

- Dashboard
- Reports
- Matches
- Recovery Requests
- Verification
- Returned Items
- Settings

### Responsive design

The application must support:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Forms must be easy to use on mobile devices.

---

# 6. TECH STACK

Use the following stack unless the existing project requires a compatible alternative.

Frontend:
- React.
- Vite.
- JavaScript or TypeScript.
- Tailwind CSS.
- Lucide React icons.

Backend:
- Firebase Authentication.
- Cloud Firestore.
- Firebase Storage.

AI:
- MVP: Custom weighted similarity algorithm.
- Advanced: Gemini API or semantic embeddings.

Hosting:
- Vercel or Firebase Hosting.

### Architecture rules

- Keep UI components separate from business logic.
- Keep Firebase operations in dedicated service modules.
- Keep matching logic in a separate utility or backend module.
- Use environment variables for API credentials.
- Never expose secret API keys in frontend code.
- Do not hardcode fake authentication.
- Do not rely on frontend-only authorization.

---

# 7. PROJECT FOLDER STRUCTURE

Use a modular folder structure similar to:

src/
  assets/
  components/
    Navbar.jsx
    Sidebar.jsx
    ItemCard.jsx
    MatchCard.jsx
    NotificationBell.jsx
    StatusBadge.jsx
    LoadingSpinner.jsx
    ProtectedRoute.jsx

  pages/
    LandingPage.jsx
    LoginPage.jsx
    RegisterPage.jsx
    StudentDashboard.jsx
    ReportLost.jsx
    ReportFound.jsx
    ExploreItems.jsx
    ItemDetails.jsx
    MyReports.jsx
    AIMatches.jsx
    RecoveryRequests.jsx
    Notifications.jsx
    Profile.jsx

  admin/
    AdminDashboard.jsx
    ManageReports.jsx
    ManageMatches.jsx
    ManageClaims.jsx
    Verification.jsx
    ReturnedItems.jsx

  services/
    firebase.js
    authService.js
    itemService.js
    matchService.js
    recoveryService.js
    notificationService.js

  utils/
    matchingAlgorithm.js
    textSimilarity.js
    dateUtils.js
    validation.js

  hooks/
    useAuth.js
    useItems.js
    useNotifications.js

  context/
    AuthContext.jsx

  styles/
    index.css

  App.jsx
  main.jsx

.env.example
README.md
PLAN.md

Adjust filenames and structure where appropriate, but preserve clear separation of concerns.

---

# 8. SECURITY AND PRIVACY REQUIREMENTS

Security is essential because the application handles personal belongings and ownership claims.

Implement:

1. Authentication for protected pages.
2. Role-based access control.
3. Student ownership checks for report editing.
4. Admin-only claim approval.
5. Firestore Security Rules.
6. Storage upload validation.
7. Image type and file-size validation.
8. Rate limiting or abuse protection where supported.
9. Private ownership verification information.
10. Safe recovery locations.
11. Duplicate claim prevention.
12. Audit logs for administrative actions.

Never:

- Display full student ID numbers publicly.
- Display complete wallet or bank card details.
- Automatically reveal private contact details.
- Allow users to approve their own ownership claims.
- Treat an AI match score as proof of ownership.

---

# 9. FIVE-HOUR DEVELOPMENT ROADMAP

The project must be built in the following priority order.

## HOUR 1 – PROJECT SETUP AND FRONTEND

- Initialize React and Vite.
- Install Tailwind CSS.
- Configure routing.
- Build landing page.
- Build authentication pages.
- Create student dashboard.
- Create lost and found report forms.

Expected output:
A navigable frontend with all main screens.

## HOUR 2 – FIREBASE AND REPORTING

- Configure Firebase.
- Implement authentication.
- Configure Firestore.
- Configure image storage.
- Save lost reports.
- Save found reports.
- Display reports from the database.

Expected output:
Students can submit and view real reports.

## HOUR 3 – AI MATCHING

- Build description similarity.
- Implement category matching.
- Implement location matching.
- Implement date proximity.
- Calculate weighted scores.
- Rank matching reports.
- Display potential matches.

Expected output:
A working lost-versus-found matching engine.

## HOUR 4 – TRUSTLOOP AND ADMIN

- Implement recovery requests.
- Add finder acceptance and rejection.
- Add meeting scheduling.
- Implement private ownership verification workflow.
- Add dual handover confirmation.
- Build admin dashboard.
- Add claim approval and notifications.

Expected output:
A complete item recovery workflow.

## HOUR 5 – TESTING AND PRESENTATION

- Test student registration and login.
- Test lost reports.
- Test found reports.
- Test AI matching.
- Test recovery requests.
- Test admin verification.
- Test authorization restrictions.
- Fix important bugs.
- Prepare demo accounts and sample reports.

Expected output:
A functional application ready for demonstration.

---

# 10. TESTING REQUIREMENTS

Test the following scenarios.

### Test 1: Lost item report

A student reports a missing black wallet.

Expected:
Report saved successfully and visible in the student's dashboard.

### Test 2: Found item report

Another student reports finding a black wallet near the library.

Expected:
Found report saved successfully.

### Test 3: AI matching

System compares the two reports.

Expected:
A potential match is generated with a similarity score and reasons.

### Test 4: False match

A student reports a blue water bottle.

Expected:
The unrelated wallet should not receive a high match score.

### Test 5: Recovery request

The owner requests the found item.

Expected:
Finder receives a notification.

### Test 6: Finder response

Finder accepts the request.

Expected:
Recovery request changes to ACCEPTED.

### Test 7: Meeting scheduling

Both students agree to meet at the security office.

Expected:
Meeting information is available to both authorized users.

### Test 8: Physical verification

The owner provides private identifying details.

Expected:
The finder or security staff can verify the actual item.

### Test 9: Handover confirmation

Both participants confirm the handover.

Expected:
The item is marked RETURNED after the required verification.

### Test 10: Unauthorized access

A normal student tries to open the admin dashboard.

Expected:
Access is denied.

---

# 11. DEMONSTRATION SCENARIO FOR JUDGES

Use this scenario during the final presentation.

1. Student A logs in.
2. Student A reports losing a black wallet near the library.
3. Student B logs in.
4. Student B reports finding a similar wallet.
5. CampusFind AI identifies a potential match.
6. Student A receives a notification.
7. Student A sends a recovery request.
8. Student B accepts the request.
9. Both arrange a meeting at the campus security office.
10. Student A provides identifying information.
11. Security staff verifies ownership.
12. Both confirm the handover.
13. Admin marks the item as RETURNED.

Show the complete workflow without skipping the human verification stage.

---

# 12. FUTURE ENHANCEMENTS

These features are not mandatory for the five-hour MVP.

1. AI image recognition.
2. Visual similarity search.
3. Campus map integration.
4. QR-based recovery tokens.
5. Email notifications.
6. Push notifications.
7. College-wide analytics.
8. Multiple college support.
9. Duplicate report detection.
10. Multilingual natural-language reporting.
11. Advanced fraud detection.
12. Mobile application.

---

# 13. SUCCESS CRITERIA

The project is considered successful when:

- Students can register and log in.
- Students can submit lost reports.
- Students can submit found reports.
- Photographs can be uploaded.
- Reports are stored persistently.
- Students can search and filter reports.
- The matching engine can identify plausible matches.
- Students receive match notifications.
- Recovery requests work correctly.
- Students can arrange person-to-person verification.
- Admin can verify claims.
- Both parties can confirm handover.
- Recovered items are marked as returned.
- Unauthorized users cannot access administrative functions.
- The application works on mobile and desktop.

---

# 14. INSTRUCTIONS TO THE AI CODING AGENT

You are an experienced full-stack developer and UI/UX engineer.

Your task is to build CampusFind AI as a complete, working, responsive web application.

IMPORTANT DEVELOPMENT INSTRUCTIONS:

1. Inspect the existing project before making changes.
2. Do not overwrite existing working code unnecessarily.
3. Follow this PLAN.md as the primary project specification.
4. Build functional features, not just static UI designs.
5. Connect forms to the actual database.
6. Implement real report creation and retrieval.
7. Implement working image uploads.
8. Implement real matching calculations.
9. Implement the complete TrustLoop recovery process.
10. Implement secure role-based authorization.
11. Use reusable components.
12. Include loading, empty, success and error states.
13. Use realistic sample data only when clearly identified as demo data.
14. Do not create fake AI responses or pretend that an external AI API is connected.
15. Do not leave important buttons without working actions.
16. Do not use hardcoded admin privileges in public frontend code.
17. Do not expose API keys or private user information.
18. Test the complete end-to-end workflow.

### Time management

The hackathon has only five hours.

Prioritize the MVP features first.

If time becomes limited, do not sacrifice the complete lost-to-found recovery workflow for animations or advanced visual effects.

Build the application in working stages.

After each stage:
- Check for errors.
- Verify functionality.
- Fix broken interactions.
- Continue to the next stage.

If Firebase credentials or external API keys are unavailable, clearly explain what configuration is missing and implement a usable local development mode without pretending that cloud services are connected.

### FINAL EXPECTATION

Deliver:

1. Complete source code.
2. Responsive student interface.
3. Responsive admin interface.
4. Working authentication.
5. Working lost/found reporting.
6. Working image uploads.
7. Working AI-style matching engine.
8. Working TrustLoop person-to-person verification.
9. Working notification system.
10. Database configuration and security rules.
11. README with setup instructions.
12. Environment variable example.
13. Demo data and testing instructions.

The final result must be a functional CampusFind AI application, not merely a prototype landing page.

**Project motto: AI finds the match. People verify the item. Campus security ensures safe recovery.**