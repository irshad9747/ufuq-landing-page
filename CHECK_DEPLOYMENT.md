# Check Your GitHub Pages Deployment

## Step-by-Step Verification

### 1. Check Workflow Status
- Go to: https://github.com/irshad9747/ufuq/actions
- Look for the latest workflow run (#9)
- ✅ **Green checkmark** = Success
- ❌ **Red X** = Failed (click to see errors)

### 2. Enable GitHub Pages (If Not Done)
- Go to: https://github.com/irshad9747/ufuq/settings/pages
- Under **Source**, select: **GitHub Actions**
- Click **Save**
- Wait 2-3 minutes

### 3. Check Your Site
- Visit: https://irshad9747.github.io/ufuq/
- Should see your UFUQ 2026 website

### 4. If Site Shows 404
**Possible causes:**
- GitHub Pages not enabled (do step 2)
- First deployment still processing (wait 5-10 minutes)
- Base path mismatch (check repository name matches `/ufuq/`)

### 5. If Assets Don't Load (Images/CSS broken)
- Check browser console (F12) for 404 errors
- Verify base path in `vite.config.js` matches repository name
- Current base path: `/ufuq/` (matches repository name ✅)

### 6. Manual Workflow Trigger
If you want to manually trigger deployment:
- Go to: https://github.com/irshad9747/ufuq/actions
- Click "Deploy to GitHub Pages" workflow
- Click "Run workflow" button
- Select "main" branch
- Click "Run workflow"

## Quick Test Commands

```bash
# Test build locally
npm run build

# Preview production build locally
npm run preview
# Then visit: http://localhost:4173/ufuq/
```

## Still Having Issues?

Share:
1. Workflow status (✅ or ❌)
2. Error message (if any)
3. What you see when visiting the site URL
4. Browser console errors (F12 → Console tab)

