# Church Management App - Implementation Plan

## Overview
Adding real-time one-on-one messaging, personal & shared to-do lists, and comprehensive mobile improvements including PWA support.

---

## Phase 1: Database Setup (Chat & To-Do) ✅

### Chat System
- [ ] Create `conversations` table (tracks DM conversations between two members)
- [ ] Create `messages` table (stores individual messages)
- [ ] Set up RLS policies for privacy (users can only see their own conversations)
- [ ] Enable Supabase realtime for messages table

### To-Do System
- [ ] Create `tasks` table with `task_type` (personal/shared)
- [ ] Add fields for assignment, priority, status, due dates
- [ ] Set up RLS policies (personal tasks = private, shared tasks = visible to assigned users)
- [ ] Enable Supabase realtime for tasks table

---

## Phase 2: Chat UI & Functionality

### Pages & Components
- [ ] Create `/messages` page with inbox/conversation list
- [ ] Create conversation view component with message history
- [ ] Add message input with send button
- [ ] Create conversation starter (search members, start new chat)

### Real-Time Features
- [ ] Implement real-time message updates using Supabase subscriptions
- [ ] Add "typing" indicators
- [ ] Show online/offline status
- [ ] Add unread message counts
- [ ] Auto-scroll to latest message

### UI Polish
- [ ] Message bubbles (sent vs received styling)
- [ ] Timestamps
- [ ] Empty states (no conversations yet)
- [ ] Loading states

---

## Phase 3: To-Do List UI & Functionality

### Pages & Components
- [ ] Create `/tasks` page with tabs for Personal and Shared
- [ ] Personal tasks view (private task list)
- [ ] Shared tasks view (ministry/church tasks)
- [ ] Task creation modal/form
- [ ] Task detail view with editing

### Task Features
- [ ] Add task with title, description, priority, due date
- [ ] Mark tasks as complete/incomplete
- [ ] Filter tasks (all, active, completed)
- [ ] Assign shared tasks to specific members
- [ ] Task categories (prayer, ministry, event, etc.)
- [ ] Real-time task updates

---

## Phase 4: Mobile Optimization - PWA

### PWA Setup
- [ ] Install and configure `vite-plugin-pwa`
- [ ] Create `manifest.json` with app metadata
- [ ] Generate PWA icons (192x192, 512x512)
- [ ] Configure service worker for offline support
- [ ] Add iOS-specific meta tags
- [ ] Create `/install` page with install instructions

### Testing
- [ ] Test install on Android
- [ ] Test install on iOS (Add to Home Screen)
- [ ] Verify offline functionality
- [ ] Test app icon and splash screen

---

## Phase 5: Mobile Navigation & UX

### Bottom Navigation (Mobile)
- [ ] Create mobile bottom nav bar component
- [ ] Add navigation items: Home, Messages, Tasks, More
- [ ] Show on mobile, hide on desktop
- [ ] Active route highlighting
- [ ] Badge for unread messages

### Desktop Navigation
- [ ] Keep existing navbar for desktop
- [ ] Ensure responsive behavior
- [ ] Add messages and tasks links to navbar

---

## Phase 6: Touch Optimization

### Forms & Inputs
- [ ] Increase tap target sizes (minimum 44x44px)
- [ ] Larger form inputs on mobile
- [ ] Improved spacing between interactive elements
- [ ] Better focus states for accessibility

### Gestures & Interactions
- [ ] Swipe to delete messages
- [ ] Pull-to-refresh on chat list
- [ ] Swipe to complete tasks
- [ ] Long-press menus for additional actions

### UI Adjustments
- [ ] Larger buttons on mobile
- [ ] Improved modal sizing on small screens
- [ ] Better keyboard handling (auto-scroll, etc.)
- [ ] Touch-friendly dropdowns and selects

---

## Phase 7: Responsive Layout Review

### Page-by-Page Review
- [ ] Dashboard - responsive grid
- [ ] Forms - single column on mobile
- [ ] Records - horizontal scroll tables on mobile
- [ ] Members - card layout on mobile
- [ ] Prayer Requests - optimized for mobile
- [ ] Messages (new) - full-screen on mobile
- [ ] Tasks (new) - optimized lists on mobile

### Global Improvements
- [ ] Consistent padding/margins across breakpoints
- [ ] Readable font sizes on all devices
- [ ] Proper viewport configuration
- [ ] Test on various screen sizes

---

## Phase 8: Testing & Polish

### Functionality Testing
- [ ] Test chat between multiple users
- [ ] Verify real-time updates work
- [ ] Test task creation/editing/completion
- [ ] Test personal vs shared task visibility
- [ ] Verify RLS policies work correctly

### Mobile Testing
- [ ] Test on actual mobile devices
- [ ] Test PWA install flow
- [ ] Test offline functionality
- [ ] Test all gestures and interactions
- [ ] Verify performance on mobile networks

### Browser Testing
- [ ] Chrome/Edge (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Test PWA on different browsers

---

## Future Enhancements (Optional)

- [ ] Push notifications for new messages
- [ ] Image/file sharing in chat
- [ ] Group chats for ministries
- [ ] Task comments and collaboration
- [ ] Task attachments
- [ ] Calendar view for tasks with due dates
- [ ] Search messages and tasks
- [ ] Export tasks to calendar
- [ ] Read receipts for messages
- [ ] Message reactions (emoji)

---

## Notes

- **Security**: All features use RLS policies to ensure data privacy
- **Performance**: Real-time subscriptions are scoped to minimize data transfer
- **Accessibility**: Touch targets, focus states, and keyboard navigation considered
- **Progressive Enhancement**: App works offline after initial load (PWA)
