# DESIGN.md — CodeEval

## Product overview

CodeEval is a competitive programming practice platform designed for students preparing for the Canadian Computing Competition (CCC). Students can browse algorithmic problems, write code, submit solutions, and receive automated grading feedback.

The platform should feel like a professional developer tool while remaining approachable for high school students.

## Design philosophy

- **Code first:** The editor and problem statement are the most important elements.
- **Minimal distractions:** Reduce unnecessary decoration and keep students focused.
- **Clarity over novelty:** Users should immediately understand problem requirements, constraints, and submission results.
- **Technical but approachable:** Take inspiration from modern development environments without overwhelming beginners.
- **Fast feedback:** Submission states and errors should be easy to understand.

## Visual identity

**Style:** Modern developer workspace, similar in visual quality to Linear, Vercel, and contemporary coding platforms.

**Personality:** Focused, technical, clean, precise.

**Color palette:**
- Background: `#09090B`
- Secondary background: `#111113`
- Surface: `#18181B`
- Elevated surface: `#222225`
- Border: `#303036`
- Primary text: `#FAFAFA`
- Secondary text: `#A1A1AA`
- Accent: `#818CF8`
- Success: `#34D399`
- Error: `#FB7185`
- Warning: `#FBBF24`

Use dark mode as the primary theme. Provide a carefully designed light-mode alternative if supported.

## Typography

- UI font: Inter or Geist
- Code font: JetBrains Mono
- Base size: 14px
- Main headings: 24–30px
- Section headings: 16–18px
- Small metadata: 12–13px
- Code editor: 13–14px with comfortable line height

Use strong typographic hierarchy without oversized headings.

## Layout

### Navigation
- Persistent sidebar on desktop
- Compact top bar with workspace context
- Mobile navigation drawer
- Avoid excessive navigation items

Primary navigation:
- Dashboard
- Problems
- Contests / Weekly Practice
- Submissions
- Profile

### Dashboard
Include:
- Welcome message and current practice context
- Continue practicing section
- Recent submissions
- Problem-solving progress
- Weekly practice problems
- Difficulty breakdown

Keep analytics secondary to the main action: solving problems.

### Problem library
Use a dense, well-organized table with:
- Problem title
- Difficulty
- Topics
- Completion state
- Optional acceptance rate if available

Include search and filters. Avoid large decorative cards for every problem.

### Coding workspace

Use a resizable split-pane layout.

**Left panel**
- Problem title and difficulty
- Description
- Input and output formats
- Constraints
- Examples
- Optional hints

**Right panel**
- Language selector
- Code editor with syntax highlighting
- Run and Submit actions
- Test results and output console

Make the code editor the visual focus.

### Submission results

Support clear states:
- Accepted
- Wrong Answer
- Runtime Error
- Time Limit Exceeded
- Compilation Error
- Pending / Running

Use color, text, and icons together rather than relying only on color.

Show test-case feedback where available, without exposing hidden test cases.

## Component guidelines

- Buttons: 6–8px corner radius
- Inputs: Subtle border, clear focus ring
- Cards: Low-contrast surfaces
- Tables: Compact rows, strong alignment
- Tooltips: Short and useful
- Modals: Reserved for confirmations or focused tasks
- Empty states: Explain what to do next

Avoid excessive gradients, glow effects, glassmorphism, and generic dashboard widgets.

## Interaction design

- Keep unsaved editor work safe during navigation.
- Clearly distinguish Run from Submit.
- Show loading states while Judge0 evaluates code.
- Provide readable errors with code-friendly formatting.
- Preserve the student's context after submission.
- Support keyboard navigation and useful shortcuts.

## Responsive design

Desktop is the primary coding experience.

On tablets, allow the editor and problem statement to switch between split and tabbed layouts.

On mobile, use tabs for problem description, code, and results. Avoid forcing two-column layouts.

## Accessibility

- WCAG AA contrast targets
- Keyboard-accessible interactions
- Visible focus indicators
- Semantic labels and headings
- Screen-reader-friendly submission announcements
- Reduced-motion support

## Implementation guidance

Keep the existing React, Flask, Judge0, and Firebase architecture.

Build reusable components for problem tables, difficulty badges, editor controls, submission states, and feedback panels.

Use shared design tokens instead of scattered hard-coded styles.

Do not invent backend functionality while implementing the UI. If a feature is unavailable, design its interface separately and mark it as future work.

## Design acceptance criteria

The UI should feel like a serious coding environment rather than a generic education dashboard.

A new student should be able to find a problem, understand it, write code, submit a solution, and interpret feedback without instructions.

The coding workflow must remain the visual and functional priority.
