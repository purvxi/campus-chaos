# Campus Chaos
A student survival dashboard for tracking attendance, assignments, and exams.

## Live Demo
https://campus-chaos.vercel.app

## Features
- **Attendance Tracker** - Monitor attendance and get warned when below threshold
- **Bunk Calculator** - Calculate how many classes you can safely skip
- **Assignment Tracker** - Track assignments with due dates and status
- **Exams Scheduler** - Countdown to exams with prep status
- **Survival Score** - Overall academic health indicator

## Tech Stack
- React + Vite
- Supabase (Database + Auth)
- Tailwind CSS
- Vercel (Deployment)

## Setup
1. Clone the repo
```bash
   git clone https://github.com/purvxi/campus-chaos.git
   cd campus-chaos
   npm install
```

2. Create `.env` file
```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
```

3. Run locally
```bash
   npm run dev
```

## Database
Uses Supabase with 4 tables:
- `subjects` - Attendance data
- `assignments` - Assignment tracking
- `exams` - Exam schedules
- `bunk_log` - Bunk history

All tables have Row Level Security enabled for user data privacy.

## Author
Built by Purvi Kanojiya