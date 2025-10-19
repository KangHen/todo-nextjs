## About This Todo App
Todo App with scalable structure App. Using hooks for separate logic, store with Zustand and service for API management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router pages
├── components/         # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
|── store               # Store (Zustand)
├── services            # Service API
├── types               # Types and Enum
└── lib/                # Utility functions and configurations
```

## Planning
- First planning, using Local Storage for saving data, but using Login auth from dummyjson
- Next, using Supabase for saving data
