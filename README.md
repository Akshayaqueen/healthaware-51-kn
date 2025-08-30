# HealthAware - Modern Health Awareness Platform

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ganeshachu1309-gmailcoms-projects/v0-modern-health-awareness)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/JFTnxFfTnMO)

## Overview

A comprehensive health awareness platform for rural communities featuring AI-powered health podcasts, interactive comics, myth busters, healthcare information, community forums, and multilingual support. Built with Next.js, Firebase Authentication, Supabase for secure storage, and PWA support.

## 🔐 Authentication & Session Persistence

This project uses Firebase Authentication for sign-in and client-side access control, and Supabase only for secure data storage (recommendations, dynamic comics). To avoid conflicts, server middleware does not enforce Supabase-auth redirects; it only keeps Supabase cookies in sync.

How access is gated
- Client-side guard: components/auth/protected-route.tsx checks the Firebase user. If loading finishes and no user exists, it navigates to /sign-in. If a user exists, feature pages render normally without bouncing.
- Server-side middleware: lib/supabase/middleware.ts refreshes Supabase session cookies but intentionally does not redirect. This prevents redirect loops when using Firebase auth.

Environment variables
- Firebase (required): all NEXT_PUBLIC_FIREBASE_* variables (see Firebase Authentication Setup above)
- Supabase (required for storage): 
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

Troubleshooting redirects
- If you are redirected to /sign-in after logging in with Firebase, ensure:
  - lib/supabase/middleware.ts does not contain any redirect logic for unauthenticated users (we ship it disabled by default).
  - Your feature pages that require auth are wrapped with <ProtectedRoute> (AI Radio, Dynamic Comics, Recommendations).
  - Firebase variables are correctly set in your environment.
- If you later migrate to Supabase Auth:
  - Convert the sign-in/sign-up pages to use Supabase clients (see Supabase auth examples).
  - Re-enable redirect logic in lib/supabase/middleware.ts to protect routes on the server.
  - Remove Firebase auth context or feature-gate consistently to a single auth provider.

## 🌍 **NEW: Multilingual Support**

HealthAware now supports **10 languages** to serve diverse rural communities across India:

- **English** (Default)
- **हिंदी** (Hindi)
- **தமிழ்** (Tamil)
- **తెలుగు** (Telugu)
- **বাংলা** (Bengali)
- **मराठी** (Marathi)
- **ગુજરાતી** (Gujarati)
- **ಕನ್ನಡ** (Kannada)
- **മലയാളം** (Malayalam)
- **ਪੰਜਾਬੀ** (Punjabi)

### Language Features:
- **Complete UI Translation**: All pages, buttons, and interface elements
- **Persistent Language Selection**: Remembers user's language preference
- **Easy Language Switching**: Available in settings and navigation
- **RTL Support Ready**: Architecture supports right-to-left languages
- **Extensible**: Easy to add more languages

## 👤 **NEW: Profile Page (Instagram-like)**

### Features:
- **Instagram-style Layout**: Clean, modern profile interface
- **Tabbed Navigation**: 
  - **My Posts**: All user-created content
  - **Liked Posts**: Posts the user has liked
  - **Saved Posts**: Bookmarked content
  - **Deleted Posts**: History of removed posts
- **Profile Statistics**: Posts, followers, following counts
- **Profile Customization**: Edit profile, bio, location, website
- **Avatar Management**: Profile picture upload and management
- **Activity Timeline**: Visual representation of user activity

### Profile Sections:
\`\`\`
📊 Profile Stats
├── Posts Count
├── Followers Count
└── Following Count

📝 Profile Information
├── Display Name
├── Bio/Description
├── Location
├── Website Link
└── Join Date

📱 Content Tabs
├── 📄 My Posts
├── ❤️ Liked Posts
├── 🔖 Saved Posts
└── 🗑️ Deleted Posts
\`\`\`

## ⚙️ **NEW: Settings Page**

### Comprehensive Settings Management:
- **Account Settings**: Profile information, email, display name
- **Language Preferences**: Switch between 10 supported languages
- **Theme Control**: Light, Dark, or System theme
- **Notification Management**: 
  - Email notifications
  - Push notifications
  - Community updates
  - Health tips alerts
- **Privacy Controls**:
  - Profile visibility
  - Post visibility
  - Activity status
- **Data Management**: Reset to defaults, export data

### Settings Categories:
\`\`\`
👤 Account Settings
├── Display Name
├── Email (read-only)
└── Language Selection

🎨 Appearance
├── Theme Selection
└── UI Preferences

🔔 Notifications
├── Email Notifications
├── Push Notifications
├── Community Updates
└── Health Tips

🔒 Privacy
├── Profile Visibility
├── Post Visibility
└── Activity Status
\`\`\`

## 🚀 **ENHANCED: Community Page**

### New Community Features:

#### 📸 **Image Upload Support**
- **Drag & Drop**: Easy image uploading
- **Auto-Resizing**: Images automatically fit post containers
- **Multiple Formats**: Support for JPG, PNG, GIF, WebP
- **Preview & Edit**: Preview before posting with remove option
- **Responsive Display**: Images adapt to different screen sizes

#### 😊 **Emoji Reactions**
- **6 Reaction Types**: 👍 ❤️ 😊 😢 😠 😂
- **Real-time Updates**: Instant reaction feedback
- **User Tracking**: See who reacted to posts
- **Multiple Reactions**: Users can react with multiple emojis
- **Visual Indicators**: Highlighted reactions for user's choices

#### 📤 **Share Functionality**
- **Native Sharing**: Uses device's native share API when available
- **Fallback Copying**: Automatic clipboard copy for unsupported devices
- **Social Media Ready**: Formatted for external platform sharing
- **Custom Share Text**: Includes post content and platform link

#### 💾 **Enhanced Data Persistence**
- **Local Storage**: All posts, reactions, and interactions saved locally
- **Cross-Session**: Data persists across browser sessions
- **Backup Ready**: Easy migration to cloud storage
- **Real-time Sync**: Instant updates across components

### Community Interaction Flow:
\`\`\`
📝 Create Post
├── Text Content
├── Image Upload (optional)
├── Category Selection
└── Tags

💬 Post Interactions
├── 👍 Like/Unlike
├── 😊 Emoji Reactions (6 types)
├── 💬 Comments
├── 📤 Share (Native/Clipboard)
└── 🔖 Save/Bookmark

📊 Community Stats
├── Total Members: 2,847+
├── Active Today: 156+
├── Total Threads: Dynamic
└── Total Replies: 8,567+
\`\`\`

## 🔥 Firebase Authentication Setup

This project uses Firebase Authentication for user management. Follow these steps to set up Firebase:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `healthaware-platform`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password**: Click and toggle "Enable"
   - **Google** (optional): Click, toggle "Enable", add your project support email
   - **Anonymous** (optional): For guest access

### Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click **Web app** icon (`</>`)
4. Register app name: `healthaware-web`
5. Copy the Firebase configuration object

### Step 4: Environment Variables Setup

Create a `.env.local` file in your project root:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# GitHub AI API (for podcast generation)
GITHUB_TOKEN=your_github_token_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

**Replace the values with your actual Firebase config values from Step 3 and Supabase config values from the Supabase setup below.**

## 🗄️ Supabase Setup (Recommendations + Dynamic Comics)

These features use Supabase for secure storage:
- Personalized Recommendations (stores your inputs and suggestion history)
- Dynamic Comics (stores comics and episodic panels so you can continue later)

Follow these steps in the Supabase UI:

1) Create a Supabase Project
- Go to https://supabase.com → Sign in → New Project
- Pick a name and database password → Create project
- After the project is ready, open Project Settings → API
  - Copy:
    - Project URL (Supabase URL)
    - anon public key (anon key)

2) Enable Email Auth
- Go to Authentication → Providers → Email
- Enable “Email” provider (optional: require email confirmation)

3) Create Tables (copy/paste SQL)
- Go to SQL → New query → run the statements below.
- These create the tables with Row Level Security (RLS) and safe policies.

\`\`\`sql
-- Profiles (optional, stores basic info tied to auth.users)
create table if not exists public.health_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age int,
  lifestyle text,
  symptoms text[],
  goals text[],
  updated_at timestamptz default now()
);

alter table public.health_profiles enable row level security;

create policy "health_profiles_select_own"
  on public.health_profiles for select
  using (auth.uid() = id);

create policy "health_profiles_insert_own"
  on public.health_profiles for insert
  with check (auth.uid() = id);

create policy "health_profiles_update_own"
  on public.health_profiles for update
  using (auth.uid() = id);

create policy "health_profiles_delete_own"
  on public.health_profiles for delete
  using (auth.uid() = id);

-- Recommendations (history of suggestions per user)
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  input jsonb not null default '{}'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  message text, -- AI-generated solution shown immediately after submit
  created_at timestamptz default now()
);

create table if not exists public.recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid references public.recommendations(id) on delete cascade,
  liked boolean not null,
  created_at timestamptz default now()
);

-- Comics (story container)
create table if not exists public.comics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  title text not null,
  created_at timestamptz default now()
);

-- Panels (episodic strips tied to a comic)
create table if not exists public.comic_panels (
  id uuid primary key default gen_random_uuid(),
  comic_id uuid not null references public.comics(id) on delete cascade,
  panel_index int not null,
  panel_text text,
  image_url text,
  created_at timestamptz default now(),
  unique (comic_id, panel_index)
);

alter table public.recommendations enable row level security;
alter table public.recommendation_feedback enable row level security;
alter table public.comics enable row level security;
alter table public.comic_panels enable row level security;

do $$
begin
  -- IMPORTANT: Use policyname (not polname)
  if not exists (select 1 from pg_policies where policyname = 'recs_select_public') then
    create policy recs_select_public on public.recommendations for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'recs_insert_public') then
    create policy recs_insert_public on public.recommendations for insert to anon with check (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'recs_fb_select_public') then
    create policy recs_fb_select_public on public.recommendation_feedback for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'recs_fb_insert_public') then
    create policy recs_fb_insert_public on public.recommendation_feedback for insert to anon with check (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'comics_insert_public') then
    create policy comics_insert_public on public.comics for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'comics_select_public') then
    create policy comics_select_public on public.comics for select to anon using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'panels_insert_public') then
    create policy panels_insert_public on public.comic_panels for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'panels_select_public') then
    create policy panels_select_public on public.comic_panels for select to anon using (true);
  end if;
end $$;
\`\`\`

4) Environment Variables
Add these to your environment (Vercel → Project Settings → Environment Variables, or a local .env.local):
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional for server-only automation/webhooks:
# SUPABASE_SERVICE_ROLE_KEY=service_role_key (do not expose on client)
\`\`\`

5) Using the Features
- Recommendations page: /recommendations
  - Enter age, lifestyle, symptoms, goals → Get tailored suggestions
  - History is stored in public.recommendations (RLS-protected)
- Dynamic Comics:
  - Create a new storyline: /comics/new → redirects to /comics/<id>/preview
  - Click “Next Panel” to generate episodic panels (stored in public.comic_panels)

API Endpoints
- POST /api/recommendations → Create a recommendation from your inputs
- GET  /api/recommendations → List your recommendation history
- POST /api/comics → Create a new dynamic comic
- GET  /api/comics → List your comics
- GET/POST /api/comics/[id]/panels → Fetch or append panels for a comic

Troubleshooting
- If inserts/selects return 401/permission errors:
  - Make sure you’re authenticated (sign in first)
  - Ensure RLS policies were created and Email auth is enabled
  - Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set

## 🎙️ AI Podcast Generation Setup

The AI Podcast feature uses GitHub's AI models to generate weekly health awareness content in Radio Jockey style, then converts it to audio using Google Text-to-Speech.

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (v3.7 or higher)
3. **GitHub Token** with AI model access
4. **Internet connection** (for gTTS)

### Quick Setup

1. **Install Python Dependencies**
   \`\`\`bash
   pip install -r podcast-service/requirements.txt
   \`\`\`

2. **Set GitHub Token**
   Add your GitHub token to `.env.local`:
   \`\`\`env
   GITHUB_TOKEN=your_github_token_here
   \`\`\`

3. **Generate Your First Podcast**
   \`\`\`bash
   npm run generate-podcast
   \`\`\`

## 🚀 **Complete Feature Set**

### 🎯 **Core Features**
- ✅ **Firebase Authentication**: Email/password, Google sign-in, anonymous auth
- ✅ **AI Podcast Generation**: Weekly health content with GitHub AI + gTTS
- ✅ **PWA Support**: Installable web app with offline capabilities
- ✅ **Real-time Updates**: Live timestamps and community interactions
- ✅ **Health Comics**: Interactive health education comics with previews
- ✅ **Myth Buster**: Interactive card-flipping with working reset functionality
- ✅ **Healthcare Info**: Local healthcare providers and emergency contacts
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Supabase Storage**: Secure storage for personalized recommendations and dynamic comics

### 🌟 **New Features (Latest Update)**
- ✅ **Multilingual Support**: 10 languages with complete UI translation
- ✅ **Profile Page**: Instagram-like interface with tabbed content
- ✅ **Settings Page**: Comprehensive preference management
- ✅ **Enhanced Community**: Image uploads, emoji reactions, sharing
- ✅ **Dark Mode**: System, light, and dark theme support
- ✅ **Advanced Persistence**: Local storage with cross-session sync
- ✅ **Mobile Optimization**: Enhanced mobile experience across all features
- ✅ **Supabase Integration**: Secure storage for recommendations and dynamic comics

### 📱 **User Experience Enhancements**
- ✅ **Intuitive Navigation**: Updated navbar with profile/settings access
- ✅ **Visual Feedback**: Loading states, success messages, error handling
- ✅ **Accessibility**: Screen reader support, keyboard navigation
- ✅ **Performance**: Optimized images, lazy loading, efficient state management
- ✅ **Cross-Platform**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Authentication**: Firebase Auth
- **AI Integration**: GitHub AI Models (GPT-4o)
- **Text-to-Speech**: Google Text-to-Speech (gTTS)
- **Internationalization**: Custom i18n system with 10 languages
- **State Management**: React Context + Local Storage
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui with custom enhancements
- **PWA**: Service Worker, Web App Manifest
- **Audio**: HTML5 Audio API with custom controls
- **Image Processing**: Client-side resizing and optimization
- **Database**: Supabase for secure storage
- **Deployment**: Vercel

## 📱 Installation & Development

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/your-username/healthaware-platform.git
cd healthaware-platform
\`\`\`

2. **Install Node.js dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Install Python dependencies**
\`\`\`bash
pip install -r podcast-service/requirements.txt
\`\`\`

4. **Set up environment variables** (see Firebase and Supabase setup above)

5. **Generate your first podcast**
\`\`\`bash
npm run generate-podcast
\`\`\`

6. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

7. **Open in browser**
\`\`\`
http://localhost:3000
\`\`\`

## 📂 Enhanced Project Structure

\`\`\`
healthaware-platform/
├── app/
│   ├── profile/              # NEW: Instagram-like profile page
│   ├── settings/             # NEW: Comprehensive settings
│   ├── ai-podcast/           # AI Podcast player interface
│   ├── comics/               # Health comics with previews
│   ├── community/            # ENHANCED: Images, reactions, sharing
│   ├── healthcare-info/      # Healthcare provider directory
│   ├── myth-buster/          # Interactive myth-busting cards
│   ├── recommendations/      # NEW: Personalized recommendations
│   ├── dynamic-comics/       # NEW: Dynamic comics creation
│   └── layout.tsx            # Updated with theme + language providers
├── components/
│   ├── auth/                 # Authentication components
│   ├── ui/                   # Enhanced UI components
│   └── navbar.tsx            # Updated with profile/settings links
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   ├── auth-context.tsx      # Authentication state management
│   ├── language-context.tsx  # NEW: Multilingual support
│   ├── theme-context.tsx     # NEW: Theme management
│   ├── i18n.ts              # NEW: Translation system
│   ├── supabase.ts          # NEW: Supabase configuration
│   └── supabase-context.tsx # NEW: Supabase state management
├── podcast-service/          # AI Podcast generation system
│   ├── generate_script.js    # GitHub AI script generation
│   ├── tts.py               # Text-to-speech conversion
│   ├── requirements.txt     # Python dependencies
│   └── output_script.txt    # Generated scripts (auto-created)
├── public/
│   └── audio/               # Generated podcast files
└── README.md                # This comprehensive guide
\`\`\`

## 🌍 Internationalization (i18n)

### Supported Languages:
\`\`\`typescript
const languages = {
  en: 'English',      // Default
  hi: 'हिंदी',         // Hindi
  ta: 'தமிழ்',         // Tamil
  te: 'తెలుగు',        // Telugu
  bn: 'বাংলা',        // Bengali
  mr: 'मराठी',        // Marathi
  gu: 'ગુજરાતી',       // Gujarati
  kn: 'ಕನ್ನಡ',        // Kannada
  ml: 'മലയാളം',       // Malayalam
  pa: 'ਪੰਜਾਬੀ'        // Punjabi
}
\`\`\`

### Translation System:
- **Centralized Translations**: All text stored in `lib/i18n.ts`
- **Context-Aware**: Uses React Context for global language state
- **Persistent**: Language preference saved in localStorage
- **Extensible**: Easy to add new languages and translations
- **Type-Safe**: TypeScript ensures translation key consistency

### Usage Example:
\`\`\`typescript
import { useLanguage } from '@/lib/language-context'

function MyComponent() {
  const { t, language, setLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      <button onClick={() => setLanguage('hi')}>
        Switch to Hindi
      </button>
    </div>
  )
}
\`\`\`

## 🎨 Theme System

### Theme Options:
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for low-light usage
- **System Mode**: Automatically follows device preference

### Theme Features:
- **Persistent**: Theme choice saved across sessions
- **Smooth Transitions**: Animated theme switching
- **Component Aware**: All components support both themes
- **System Integration**: Respects user's OS preference

## 🔐 Security & Privacy

### Data Protection:
- **Local Storage**: Sensitive data stored locally, not on servers
- **Firebase Security**: Industry-standard authentication
- **Privacy Controls**: Users control visibility of their data
- **No Tracking**: No unnecessary data collection
- **GDPR Ready**: Privacy-first architecture

### Security Features:
- **Environment Variables**: Secure API key management
- **Input Validation**: All user inputs sanitized
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: Secure form handling
- **Secure Headers**: Proper security headers configured

## 📊 Performance Optimizations

### Frontend Performance:
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Optimized bundle sizes
- **Caching**: Efficient caching strategies
- **Compression**: Gzip compression enabled

### User Experience:
- **Loading States**: Visual feedback for all actions
- **Error Boundaries**: Graceful error handling
- **Offline Support**: PWA capabilities for offline usage
- **Fast Navigation**: Client-side routing
- **Responsive Design**: Optimized for all device sizes

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - All `NEXT_PUBLIC_FIREBASE_*` variables
   - `GITHUB_TOKEN` for AI generation
   - All `NEXT_PUBLIC_SUPABASE_*` variables
3. Deploy automatically on push to main branch

### Environment Variables for Production
\`\`\`env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Podcast Generation
GITHUB_TOKEN=your_github_token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## 🤝 Contributing

### Development Workflow:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all features (authentication, multilingual, themes)
5. Submit a pull request

### Adding New Languages:
1. Add language code to `lib/i18n.ts`
2. Add translations to the `translations` object
3. Test UI with new language
4. Update documentation

### Adding New Features:
1. Follow existing code patterns
2. Add multilingual support
3. Ensure theme compatibility
4. Add proper error handling
5. Update README documentation

## 📞 Support & Community

### Getting Help:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides in README
- **Community Forum**: Use the in-app community feature
- **Email Support**: [your-email@example.com]

### Resources:
- **Firebase Documentation**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Next.js Guide**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Documentation**: [react.dev](https://react.dev)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Quick Start Checklist

### Initial Setup:
- [ ] Clone repository
- [ ] Install Node.js dependencies (`npm install`)
- [ ] Install Python dependencies (`pip install -r podcast-service/requirements.txt`)
- [ ] Set up Firebase project and get config
- [ ] Create `.env.local` with Firebase variables
- [ ] Add GitHub token to `.env.local`
- [ ] Set up Supabase project and get config
- [ ] Add Supabase variables to `.env.local`

### First Run:
- [ ] Generate first podcast (`npm run generate-podcast`)
- [ ] Run development server (`npm run dev`)
- [ ] Test authentication (sign up/sign in)
- [ ] Test language switching
- [ ] Test theme switching
- [ ] Create a community post with image
- [ ] Test profile page functionality
- [ ] Test recommendations page
- [ ] Test dynamic comics creation

### Production Deployment:
- [ ] Set up Vercel project
- [ ] Add environment variables to Vercel
- [ ] Deploy to production
- [ ] Test all features in production
- [ ] Monitor performance and errors

## 🎉 What's New in This Update

### ✨ Major Features Added:
1. **🌍 Complete Multilingual Support** - 10 languages with full UI translation
2. **👤 Instagram-like Profile Page** - Tabbed interface with post management
3. **⚙️ Comprehensive Settings Page** - Theme, language, notifications, privacy
4. **📸 Community Image Uploads** - Drag & drop with auto-resizing
5. **😊 Emoji Reactions System** - 6 reaction types with real-time updates
6. **📤 Native Sharing** - Share posts to external platforms
7. **🌙 Dark Mode Support** - System, light, and dark themes
8. **💾 Enhanced Data Persistence** - Robust local storage with sync
9. **📚 Personalized Recommendations** - Secure storage with Supabase
10. **🖼️ Dynamic Comics Creation** - Secure storage with Supabase

### 🔧 Technical Improvements:
- **Type-Safe Translations** - Full TypeScript support for i18n
- **Context Architecture** - Efficient state management with React Context
- **Component Reusability** - Modular, reusable UI components
- **Performance Optimization** - Lazy loading and efficient rendering
- **Mobile-First Design** - Enhanced mobile experience
- **Accessibility** - Screen reader support and keyboard navigation
- **Supabase Integration** - Secure storage for recommendations and dynamic comics

### 📱 User Experience Enhancements:
- **Intuitive Navigation** - Updated navbar with easy access to new features
- **Visual Feedback** - Loading states, animations, and success messages
- **Responsive Design** - Seamless experience across all devices
- **Error Handling** - Graceful error recovery and user feedback
- **Offline Support** - PWA capabilities for offline usage

**Happy coding and welcome to the enhanced HealthAware platform! 🚀**

## Supabase: Recommendations Message + Comics Realtime (Important)

If you set up Supabase before this update, make these small adjustments:

- Add a message column to recommendations (stores the AI-generated solution shown immediately after submit)
- Ensure user_id is nullable on both recommendations and comics
- Enable Realtime for the comics table so new storylines appear instantly without refresh

SQL (run in Supabase SQL editor):
\`\`\`sql
-- 1) AI message column (if missing)
alter table if exists public.recommendations
  add column if not exists message text;

-- 2) Make user_id nullable (if it was not already)
alter table if exists public.recommendations
  alter column user_id drop not null;

alter table if exists public.comics
  alter column user_id drop not null;
\`\`\`

Enable Realtime:
- Database → Replication → Realtime → Enable for schema public (or tables)
- Ensure table public.comics has Realtime enabled for INSERT events

How the flows work:
- Recommendations (/api/recommendations POST)
  - Collects inputs (age, lifestyle, symptoms, goals)
  - Generates a short, personalized “message” with GitHub Models (requires GITHUB_TOKEN)
  - Inserts a new row in public.recommendations with input, suggestions (list), and message
  - Returns the inserted row; the page shows the message immediately and refreshes history

- Dynamic Comics (/api/comics)
  - POST creates a comic row and seeds the first narrative panel (panel_text)
  - GET returns comics with the first panel text (first_panel_text) for display
  - The Comics page subscribes to Realtime INSERTs so new storylines appear instantly
