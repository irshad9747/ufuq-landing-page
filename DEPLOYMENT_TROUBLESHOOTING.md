# GitHub Pages Deployment Troubleshooting

## Common Issues and Solutions

### 1. GitHub Pages Not Enabled
**Problem**: Site doesn't load at all

**Solution**:
1. Go to: https://github.com/irshad9747/ufuq/settings/pages
2. Under **Source**, select: **GitHub Actions**
3. Click **Save**

### 2. Base Path Issue
**Problem**: Assets (CSS, JS, images) not loading - 404 errors

**Solution**: The base path is set to `/ufuq/` in `vite.config.js`. If your repository name is different, update it:
- If repo is `ufuq` → base: `/ufuq/`
- If repo is `ufuq-science-fest` → base: `/ufuq-science-fest/`
- If repo is at root (username.github.io) → base: `/`

### 3. Workflow Not Running
**Problem**: GitHub Actions workflow doesn't trigger

**Solution**:
1. Go to: https://github.com/irshad9747/ufuq/actions
2. Check if workflow ran
3. If failed, check the error logs
4. Make sure GitHub Actions is enabled in repository settings

### 4. Manual Deployment (Alternative)
If GitHub Actions doesn't work, you can deploy manually:

```bash
# Build the project
npm run build

# The dist folder contains your built site
# You can:
# 1. Use GitHub Desktop to commit and push the dist folder
# 2. Or use gh-pages package:
npm install --save-dev gh-pages
# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"
# Then run: npm run deploy
```

### 5. Check Current Status
1. **Repository**: https://github.com/irshad9747/ufuq
2. **Actions**: https://github.com/irshad9747/ufuq/actions
3. **Pages Settings**: https://github.com/irshad9747/ufuq/settings/pages

### 6. Verify Build Works Locally
```bash
npm run build
npm run preview
# Open http://localhost:4173/ufuq/ to test
```

## Quick Fix Commands

```bash
# Rebuild and push
npm run build
git add dist
git commit -m "Update build"
git push origin main
```

## Still Not Working?

1. Check GitHub Actions logs for errors
2. Verify repository name matches base path
3. Ensure GitHub Pages is enabled
4. Wait 5-10 minutes after enabling Pages (first deployment takes time)


