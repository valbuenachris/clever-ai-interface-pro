
# AI Chat Application

A modern chat application with AI assistance built with React, TypeScript, and Tailwind CSS.

## Features

- Real-time chat interface
- AI-powered responses
- Responsive design
- Modern UI with shadcn/ui components

## Deployment on EasyPanel

### Option 1: Docker Deployment (Recommended)

1. **Connect your Git repository** to EasyPanel
2. **Select Docker as deployment type**
3. **Set environment variables** in EasyPanel:
   ```
   NODE_ENV=production
   VITE_SUPABASE_URL=https://hgeysswrjgdcnrjvzudd.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Deploy** - EasyPanel will use the included Dockerfile

### Option 2: Static Site Deployment

1. **Select Static Site** as deployment type
2. **Build settings**:
   - Build command: `npm install && npm run build`
   - Output directory: `dist`
   - Node version: 18+
3. **Set environment variables** (same as above)

### Option 3: Manual Docker

```bash
# Build the image
docker build -t chat-ai-app .

# Run the container
docker run -p 80:80 -e NODE_ENV=production chat-ai-app
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: Set to `production` for production builds

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- Lucide React (icons)

## Support

For deployment issues, check the EasyPanel documentation or contact support.
