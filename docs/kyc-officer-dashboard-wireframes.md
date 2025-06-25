# KYC Officer Dashboard - Visual Wireframes

## Desktop Layout (1200px+)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  🏦 Spora One Trust                    KYC Officer Dashboard         [Profile] ⚙️   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Welcome back, Officer Sarah Thompson                    Last updated: 2 min ago    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐         │
│  │ 📋 PENDING QUEUE    │  │ ✅ TODAY'S APPROVED │  │ 📊 WEEKLY STATS     │         │
│  │                     │  │                     │  │                     │         │
│  │      12             │  │        7            │  │    34 Processed     │         │
│  │ Applications        │  │ Applications        │  │    92% Approval     │         │
│  │                     │  │                     │  │    Rate             │         │
│  │ [View Queue →]      │  │ [$847,500 Total]    │  │ [View Report →]     │         │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  🔍 Search Applications: [________________________] Filter: [All ▼] [🔍 Search]     │
│     Active Filters: None                          📥 Export Queue | ⟳ Refresh      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  PENDING APPLICATIONS QUEUE                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 🟡 HIGH   👤 [Photo] John Smith                    📅 Submitted: Jan 15, 2024   │ │
│  │                     john.smith@email.com                   ⏰ 3 days ago         │ │
│  │                                                                                 │ │
│  │  📄 Documents: ID Front ✅ | ID Back ⏳ | Passport photo ⏳                     │ │
│  │                                                                                 │ │
│  │  [👁️ Quick Preview] [📋 Full Review]                                           │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 🟢 NORMAL 👤 [Photo] Sarah Johnson                 📅 Submitted: Jan 14, 2024  │ │
│  │                     sarah.j@email.com                      ⏰ 4 days ago        │ │
│  │                                                                                 │ │
│  │  📄 Documents: ID Front ✅ | ID Back ✅ | Selfie ⏳                            │ │
│  │                                                                                 │ │
│  │  [👁️ Quick Preview] [📋 Full Review]                                  │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ 🟢 NORMAL 👤 [Photo] Michael Brown                 📅 Submitted: Jan 13, 2024   │ │
│  │                     m.brown@email.com                      ⏰ 5 days ago         │ │
│  │                                                                                 │ │
│  │  📄 Documents: ID Front ✅ | ID Back ✅ | Selfie ✅ | Address ⏳                │ │
│  │                                                                                 │ │
│  │  [👁️ Quick Preview] [📋 Full Review]                                            │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  RECENT APPROVALS (Approved by You)                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Emily Davis        │ ✅ Robert Wilson     │ ✅ Lisa Anderson                │   │
│  │    Approved: Jan 13   │    Approved: Jan 12  │    Approved: Jan 12            │   │
│  │    Amount: $75,000    │    Amount: $40,000   │    Amount: $150,000            │   │
│  │    Portfolio: Growth  │    Portfolio: Stable │    Portfolio: Aggressive      │   │
│  │    [📄 View Details]  │    [📄 View Details] │    [📄 View Details]          │   │
│  └───────────────────────────────────────────────────────────────────────────────┘   │
│                                                [📊 View All Approvals →]            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  Showing 3 of 12 applications | [← Previous] [Page 1 of 4] [Next →] [Load More]    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Application Review Modal (Full Screen Overlay)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ❌ Close                    Review Application - John Smith                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────────────────┐ │
│  │ 👤 PERSONAL INFORMATION         │  │ 📄 DOCUMENT VERIFICATION                    │ │
│  │                                 │  │                                             │ │
│  │ Full Name: John Smith           │  │ ┌─────────┐ ┌─────────┐ ┌─────────┐         │ │
│  │ Email: john.smith@email.com     │  │ │ ID FRONT│ │ ID BACK │ │ Photo   │         │ │
│  │                                 │  │ │  [📄]   │ │  [📄]   │ │  [👤]   │         │ │
│  │                                 │  │ │   ✅   │ │    ⏳    │ │    ⏳    │         │ │
│  │                                 │  │ │ VERIFIED │ │ PENDING │ │ PENDING │         │ │
│  │                                 │  │ │ [🔍 View]│ │ [🔍 View]│ │ [🔍 View]│     │ │
│  │                                 │  │ └─────────┘ └─────────┘ └─────────┘         │ │
│  └─────────────────────────────────┘                                                │ │

├─────────────────────────────────────────────────────────────────────────────────────┤
│  📝 REVIEW NOTES & DECISION                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ Internal Notes (Required for rejections):                                      │ │
│  │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│  │ │ [Text area for review notes - Add any concerns, verification details,      │ │ │
│  │ │  or approval reasoning here...]                                             │ │ │
│  │ │                                                                             │ │ │
│  │ │                                                                             │ │ │
│  │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                 │ │
│  │ ⚠️ COMPLIANCE CHECKLIST:                                                        │ │
│  │ ☑️ Identity documents match personal information                                │ │
│  │ ☐ Selfie matches ID photo                                                      │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  🚨 ACTIONS                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                 │ │
│  │  [❌ REJECT APPLICATION]                    [✅ APPROVE APPLICATION]           │ │
│  │     (Requires notes- Request Additional Info)   (Final approval)                │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ 
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (320px-767px)

```
┌─────────────────────────┐
│ ☰  KYC Dashboard   ⚙️  │
├─────────────────────────┤
│ Welcome, Officer Sarah  │
│ Last updated: 2 min ago │
├─────────────────────────┤
│ ┌─────────┐ ┌─────────┐ │
│ │📋 QUEUE │ │✅ TODAY │ │
│ │   12    │ │    7    │ │
│ │ Pending │ │Approved │ │
│ └─────────┘ └─────────┘ │
│ ┌─────────────────────┐ │
│ │   📊 WEEKLY STATS   │ │
│ │   34 Processed      │ │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 🔍 [_________________] │
│ Filter: [All ▼] [🔍]   │
├─────────────────────────┤
│ PENDING APPLICATIONS    │
│ ┌─────────────────────┐ │
│ │ 🟡 👤 John Smith    │ │
│ │ john.smith@...      │ │
│ │ 📅 Jan 15 (3d ago)  │ │
│ │ [👁️ Preview]        │ │
│ │ [📋 Review]         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🟢 👤 Sarah Johnson │ │
│ │ sarah.j@...         │ │
│ │ 📅 Jan 14 (4d ago)  │ │
│ │ [👁️ Preview]        │ │
│ │ [📋 Review]         │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ RECENT APPROVALS        │
│ ┌─────────────────────┐ │
│ │ ✅ Emily Davis      │ │
│ │ Jan 13 | $75K       │ │
│ │ [📄 Details]        │ │
│ └─────────────────────┘ │
│ [📊 View All →]         │
├─────────────────────────┤
│ Page 1 of 4             │
│ [← Prev] [Next →]       │
└─────────────────────────┘
```

## Mobile Review Modal (Full Screen)

```
┌─────────────────────────┐
│ ← Back    John Smith    │
├─────────────────────────┤
│ 📋 Application Review   │
├─────────────────────────┤
│ 👤 PERSONAL INFO        │
│ ┌─────────────────────┐ │
│ │ John Smith          │ │
│ │ john.smith@...  ✅  │ │
│ │ +1 (555) 123... ✅  │ │
│ │ 123 Main St         │ │
│ │ NY, NY 10001        │ │
│ │ Software Engineer   │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 📄 DOCUMENTS (Swipe →)  │
│ ┌─────────────────────┐ │
│ │ [ID FRONT IMAGE]    │ │
│ │ Status: ✅ Verified │ │
│ │ [🔍 Zoom] [📱 Full] │ │
│ └─────────────────────┘ │
│ ● ○ ○ ○ (Page dots)    │
├─────────────────────────┤
│ 💰 INVESTMENT           │
│ ┌─────────────────────┐ │
│ │ Amount: $50,000     │ │
│ │ Type: Growth        │ │
│ │ Risk: Moderate      │ │
│ │ Timeline: 5-10yr    │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 📝 NOTES                │
│ ┌─────────────────────┐ │
│ │ [Text area for      │ │
│ │  review notes...]   │ │
│ │                     │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ ⚠️ CHECKLIST            │
│ ☑️ ID matches info      │
│ ☑️ Address recent       │
│ ☐ Selfie matches       │
├─────────────────────────┤
│ [❌ REJECT]             │
│ [✅ APPROVE]            │
└─────────────────────────┘
```

## Document Zoom Overlay

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ❌ Close                    [🔍 Zoom In] [🔍 Zoom Out] [📱 Fullscreen]            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│                          [DOCUMENT IMAGE - ID FRONT]                               │
│                                                                                     │
│                               ┌─────────────────┐                                  │
│                               │                 │                                  │
│                               │  Driver License │                                  │
│                               │  NEW YORK       │                                  │
│                               │                 │                                  │
│                               │  [Photo]        │                                  │
│                               │                 │                                  │
│                               │  John Smith     │                                  │
│                               │  123 Main St    │                                  │
│                               │  New York NY    │                                  │
│                               │                 │                                  │
│                               │  DOB: 03/15/85  │                                  │
│                               │  EXP: 03/15/29  │                                  │
│                               │  ID: DL123456   │                                  │
│                               └─────────────────┘                                  │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ✅ VERIFICATION CHECKS                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ ✅ Document appears authentic (security features visible)                       │ │
│  │ ✅ Text is clear and readable                                                   │ │
│  │ ✅ Photo matches selfie submission                                              │ │
│  │ ✅ Name matches application: "John Smith"                                       │ │
│  │ ✅ Address matches application: "123 Main St, New York, NY"                    │ │
│  │ ✅ Document not expired (expires 03/15/2029)                                   │ │
│  │ ⚠️ Date of birth verification: Manual check required                           │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│  [🚫 Reject Document] [✅ Approve Document]                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Component Flow Diagram

```
KYC Officer Dashboard
    │
    ├── Header Component
    │   ├── Navigation
    │   ├── Profile Dropdown
    │   └── Quick Actions
    │
    ├── Stats Cards Section
    │   ├── Pending Queue Card
    │   ├── Today's Approvals Card
    │   └── Weekly Stats Card
    │
    ├── Search & Filter Section
    │   ├── Search Input
    │   ├── Status Filter
    │   ├── Date Range Filter
    │   └── Export/Refresh Controls
    │
    ├── Applications Queue
    │   ├── Application Card (repeating)
    │   │   ├── Applicant Info
    │   │   ├── Status Badge
    │   │   ├── Document Progress
    │   │   └── Action Buttons
    │   └── Pagination
    │
    ├── Review Modal (triggered)
    │   ├── Personal Info Panel
    │   ├── Documents Panel
    │   │   ├── Document Viewer
    │   │   ├── Verification Checklist
    │   │   └── Quality Assessment
    │   ├── Investment Details Panel
    │   ├── Review Notes Section
    │   └── Decision Actions
    │
    └── Recent Approvals Section
        ├── Approved Application Cards
        └── View All Link
```

This visual wireframe specification provides clear layout guidance for implementing the KYC Officer Dashboard with proper responsive behavior and user interaction patterns.
