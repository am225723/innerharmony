# Compassionate Path - Deployment Guide

## Deployment Architecture

**Stack:** Vercel (Frontend + API Routes) + Supabase (PostgreSQL Database)

This guide covers migrating from Replit's local development environment to production deployment on Vercel with Supabase backend.

---

## Prerequisites

Before beginning deployment, ensure you have:

- [ ] Vercel account (free tier available)
- [ ] Supabase account (free tier available)
- [ ] GitHub repository with your code
- [ ] Perplexity API key for AI features
- [ ] Node.js 18+ installed locally (for testing)

---

## Part 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Configure project:
   - **Name:** compassionate-path (or your preferred name)
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient to start

4. Wait 2-3 minutes for project provisioning

### 1.2 Run Database Migration

1. In Supabase dashboard, navigate to **SQL Editor**
2. Create a new query
3. Copy the entire contents of `supabase_migration.sql` from this repository
4. Paste into the SQL Editor
5. Click **Run** to execute the migration

**What this migration creates:**
- ✅ 24 tables with `IFS_` prefix (IFS_users, IFS_sessions, IFS_parts, etc.)
- ✅ All enum types with `ifs_` prefix
- ✅ 42 foreign key constraints with CASCADE deletion
- ✅ Comprehensive indexes on all foreign key columns
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ 76+ security policies for user data protection

### 1.3 Verify Migration Success

After running the migration, verify in the **Table Editor**:

```sql
-- Should return 24 tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'IFS_%'
ORDER BY table_name;
```

Expected tables:
- IFS_activities
- IFS_ai_insights
- IFS_anxiety_timeline
- IFS_body_sensations
- IFS_daily_anxiety_checkins
- IFS_grounding_technique_progress
- IFS_journal_entries
- IFS_lesson_activities
- IFS_lesson_progress
- IFS_lessons
- IFS_media
- IFS_parts
- IFS_protocol_steps
- IFS_protocol_walkthroughs
- IFS_self_assessments
- IFS_session_goals
- IFS_session_messages
- IFS_session_notes
- IFS_session_participants
- IFS_sessions
- IFS_therapist_assignments
- IFS_therapist_notes
- IFS_users
- IFS_wound_profiles

### 1.4 Configure Supabase Authentication

1. Navigate to **Authentication → Providers**
2. **Email provider** is enabled by default
3. Optional: Enable additional providers (Google, GitHub, etc.)

**Important:** This application uses custom authentication with localStorage, not Supabase Auth. The RLS policies use `auth.uid()::text` which you'll need to configure separately.

### 1.5 Get Database Credentials

Navigate to **Project Settings → Database** and copy:

- **Connection string (URI)** - Format: `postgresql://postgres:[password]@[host]:5432/postgres`
- **Host**
- **Database name**
- **Port**
- **Password**

You'll need these for environment variables.

---

## Part 2: Environment Variables Configuration

### 2.1 Required Environment Variables

Create a `.env` file for local testing and configure in Vercel:

```bash
# Database Connection (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
PGHOST=db.[PROJECT-REF].supabase.co
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=[YOUR-DB-PASSWORD]
PGPORT=5432

# Session Security
SESSION_SECRET=[GENERATE-RANDOM-STRING-32-CHARS]

# AI Integration (Perplexity)
PERPLEXITY_API_KEY=[YOUR-PERPLEXITY-KEY]

# Vercel Environment (automatically set)
NODE_ENV=production
```

**Generate SESSION_SECRET:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

**Get Perplexity API Key:**
1. Visit [perplexity.ai](https://www.perplexity.ai/)
2. Sign up for API access
3. Generate API key from dashboard

### 2.2 Vercel Environment Variables

After creating your Vercel project (see Part 3), add environment variables:

1. Navigate to **Project Settings → Environment Variables**
2. Add each variable from above
3. Select environments: **Production**, **Preview**, **Development**
4. Click **Save**

---

## Part 3: Vercel Deployment

### 3.1 Prepare Repository

1. The `vercel.json` file is already configured at repository root with correct settings:
   - Output directory: `client/dist` (Vite build output)
   - Build command: `npm run build`
   - SPA routing configured automatically

2. Commit and push to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 3.2 Connect to Vercel

1. Visit [vercel.com](https://vercel.com) and sign in
2. Click **Add New... → Project**
3. Import your GitHub repositor
4. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install`

5. Add environment variables (from 2.2 above)
6. Click **Deploy**

### 3.3 Monitor Deployment

Watch the build logs for:
- ✅ Dependencies installed
- ✅ TypeScript compilation successful
- ✅ Vite build completed
- ✅ Functions deployed

Build should complete in 2-5 minutes.

### 3.4 Verify Deployment

Once deployed, Vercel provides:
- **Production URL:** `https://your-project.vercel.app`
- **Preview URLs:** For each branch/PR

Visit your production URL and verify:
1. Homepage loads
2. Navigation works
3. Can access /login page
4. No console errors (check browser DevTools)

---

## Part 4: Database Schema Updates

**Important:** This application uses a hybrid migration approach:

### 4.1 Initial Setup vs. Ongoing Changes

**For Initial Deployment:**
- Use the `supabase_migration.sql` file (one-time setup)
- This creates all 24 tables with proper RLS policies
- Run manually in Supabase SQL Editor (Part 1.2)

**For Ongoing Schema Changes:**
After initial deployment, when you need to modify the database:

1. Edit `shared/schema.ts` with your changes
2. Run Drizzle migration command:

```bash
# Push schema changes to database
npm run db:push

# If there's a data-loss warning, force push (note the -- to forward flags)
npm run db:push -- --force
```

**Important:** The SQL migration file is only for initial setup. All subsequent changes use Drizzle ORM via `npm run db:push`.

### 4.2 Schema Conventions

All tables MUST use `IFS_` prefix:
```typescript
// ✅ Correct
export const users = pgTable("IFS_users", { ... });

// ❌ Wrong
export const users = pgTable("users", { ... });
```

All enums MUST use `ifs_` prefix:
```typescript
// ✅ Correct
export const userRoleEnum = pgEnum("ifs_user_role", ["client", "therapist"]);

// ❌ Wrong
export const userRoleEnum = pgEnum("user_role", ["client", "therapist"]);
```

---

## Part 5: AI Integration Testing

### 5.1 Verify Perplexity API

Test AI endpoints after deployment:

1. **Protocol Guidance:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/protocol-guidance \
     -H "Content-Type: application/json" \
     -d '{
       "protocolType": "six_fs",
       "currentStep": "find",
       "context": "Working with anxious part"
     }'
   ```

2. **Parts Dialogue Analysis:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/parts-dialogue-analysis \
     -H "Content-Type: application/json" \
     -d '{
       "dialogue": "I feel anxious when people get close",
       "partType": "manager",
       "userId": "test-user-1"
     }'
   ```

3. **Wound Identification:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/wound-identification \
     -H "Content-Type: application/json" \
     -d '{
       "description": "I always feel like I need to be perfect",
       "symptoms": ["perfectionism", "self-criticism"]
     }'
   ```

4. **Unburdening Visualization:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/unburdening-visualization \
     -H "Content-Type: application/json" \
     -d '{
       "partName": "Critical Manager",
       "burden": "Need to be perfect",
       "preferredElement": "water"
     }'
   ```

5. **Reparenting Phrases:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/reparenting-phrases \
     -H "Content-Type: application/json" \
     -d '{
       "exileName": "Lonely Child",
       "woundType": "abandonment",
       "context": "Part feels unlovable and alone"
     }'
   ```

6. **Educational Q&A:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/ifs-question \
     -H "Content-Type: application/json" \
     -d '{
       "question": "What is the difference between a Manager and a Firefighter part?"
     }'
   ```

7. **General Therapeutic Insights:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/ask-question \
     -H "Content-Type: application/json" \
     -d '{
       "question": "How can I work with perfectionism using IFS?",
       "context": "struggling with self-criticism"
     }'
   ```

8. **Conversational Parts:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai/part-conversation \
     -H "Content-Type: application/json" \
     -d '{
       "partType": "exile",
       "userMessage": "Why do you feel so alone?",
       "conversationHistory": []
     }'
   ```

Expected: All endpoints return JSON responses with AI-generated insights and citations.

### 5.2 AI Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/protocol-guidance` | POST | Step-by-step IFS protocol guidance |
| `/api/ai/parts-dialogue-analysis` | POST | Pattern detection in parts dialogue |
| `/api/ai/wound-identification` | POST | Identify childhood wounds from symptoms |
| `/api/ai/unburdening-visualization` | POST | Generate unburdening visualizations |
| `/api/ai/reparenting-phrases` | POST | Self-to-exile healing phrases |
| `/api/ai/ifs-question` | POST | IFS theory Q&A |
| `/api/ai/ask-question` | POST | General therapeutic insights |
| `/api/ai/part-conversation` | POST | Conversational parts embodiment |

---

## Part 6: Post-Deployment Checklist

### 6.1 Functionality Testing

- [ ] User registration/login works
- [ ] Client dashboard loads correctly
- [ ] Therapist dashboard displays sessions
- [ ] Parts mapping tool functions
- [ ] Journal entries can be created
- [ ] AI insights generate successfully
- [ ] Collaborative sessions work (WebSocket)
- [ ] IFS Library content loads
- [ ] Media players (audio/video) work
- [ ] Dark mode toggle functions

### 6.2 Performance Monitoring

Set up monitoring in Vercel:
1. Navigate to **Analytics** tab
2. Review:
   - Response times
   - Error rates
   - Popular pages
   - Geographic distribution

### 6.3 Error Tracking

Monitor errors in Vercel:
1. **Logs** tab shows runtime errors
2. **Functions** tab shows API route errors
3. Set up notifications for critical errors

### 6.4 Database Monitoring

In Supabase:
1. **Database → Reports** - Query performance
2. **Database → Backups** - Configure daily backups
3. **Auth → Users** - Monitor user growth

---

## Part 7: Troubleshooting

### Database Connection Issues

**Symptoms:** "ECONNREFUSED" or "Connection timeout"

**Solutions:**
1. Verify DATABASE_URL in Vercel environment variables
2. Check Supabase project is active (not paused)
3. Confirm connection pooling is enabled
4. Use direct connection string, not pooler

### Build Failures

**Symptoms:** Build fails during TypeScript compilation

**Solutions:**
1. Check for TypeScript errors locally: `npm run build`
2. Verify all dependencies in package.json
3. Clear Vercel cache and redeploy
4. Check Node.js version compatibility

### AI Integration Failures

**Symptoms:** AI endpoints return 500 errors

**Solutions:**
1. Verify PERPLEXITY_API_KEY is set correctly
2. Check Perplexity API quota/billing
3. Review server logs for specific errors
4. Test with simpler prompts first

### Session/Auth Issues

**Symptoms:** Users can't log in or sessions expire immediately

**Solutions:**
1. Verify SESSION_SECRET is set and 32+ characters
2. Check cookie settings in production
3. Ensure HTTPS is enabled (Vercel does this automatically)
4. Clear browser cookies and test again

---

## Part 8: Scaling Considerations

### Free Tier Limits

**Vercel Free Tier:**
- 100 GB bandwidth/month
- 100 GB-hrs compute/month
- 6,000 minutes build time/month

**Supabase Free Tier:**
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users

### When to Upgrade

Consider upgrading when:
- Database size exceeds 400 MB (upgrade to Supabase Pro)
- Monthly users exceed 1,000 active (upgrade to Vercel Pro)
- Need guaranteed uptime SLA
- Require team collaboration features

### Performance Optimization

1. **Database:**
   - Add indexes for frequently queried columns
   - Use connection pooling (Supabase provides this)
   - Archive old data periodically

2. **Frontend:**
   - Enable Vercel Edge Network (automatic)
   - Optimize images using next/image patterns
   - Lazy load components

3. **API Routes:**
   - Implement caching where appropriate
   - Use Edge Functions for low-latency endpoints
   - Rate limit AI endpoints to control costs

---

## Part 9: Maintenance

### Daily Tasks
- Monitor error logs in Vercel
- Check AI API usage/costs

### Weekly Tasks
- Review Supabase database size
- Check backup status
- Monitor user feedback

### Monthly Tasks
- Update dependencies: `npm update`
- Review and optimize database queries
- Analyze user behavior in Analytics
- Test all critical user flows

---

## Part 10: Rollback Procedures

### Database Rollback

Supabase provides point-in-time recovery:
1. Navigate to **Database → Backups**
2. Select backup timestamp
3. Click **Restore**

**Note:** Only available on Supabase Pro plan.

### Application Rollback

Vercel maintains deployment history:
1. Navigate to **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**

Instant rollback with zero downtime.

---

## Support Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Perplexity API Docs](https://docs.perplexity.ai/)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [Vercel Discord](https://discord.gg/vercel)

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Use `.env` locally
   - Use Vercel environment variables in production

2. **Enable RLS on all tables**
   - Already configured in migration script
   - Test policies with different user roles

3. **Use HTTPS everywhere**
   - Vercel provides automatic HTTPS
   - Never use `http://` in production

4. **Regular security audits**
   - Update dependencies monthly
   - Monitor Vercel security advisories
   - Review Supabase access logs

5. **API rate limiting**
   - Implement rate limits on AI endpoints
   - Monitor for unusual usage patterns

---

## Summary

You've successfully deployed Compassionate Path to production! 🎉

**What you've accomplished:**
✅ Supabase database with 24 tables and comprehensive security
✅ Vercel hosting with automatic HTTPS and CDN
✅ AI integration with Perplexity API
✅ Production-ready environment configuration
✅ Monitoring and error tracking setup

**Next steps:**
1. Test all features thoroughly
2. Invite beta users
3. Monitor performance and errors
4. Iterate based on user feedback

For questions or issues, refer to the troubleshooting section or consult the support resources above.
