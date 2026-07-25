# Wiring the survey up to the Google Sheet

1. Open the sheet: https://docs.google.com/spreadsheets/d/1hfiFhspgLlY9wjJJqQXq7lpn7dCzwDHSudldpp3SJ1U/edit
2. **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` there and paste in the contents of `Code.gs` from this folder.
4. Save (Ctrl+S / disk icon). Name the project if it asks (e.g. "Winai Survey Backend").
5. **Deploy → New deployment**.
   - Click the gear next to "Select type" → **Web app**.
   - Description: anything (e.g. "survey backend").
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy**.
   - The first time, Google will ask you to authorize the script — click **Authorize access**, choose your account, click **Advanced → Go to Winai Survey Backend (unsafe)** (this warning just means the script isn't verified by Google, which is normal for personal scripts), then **Allow**.
6. Copy the **Web app URL** it gives you (ends in `/exec`).
7. Open `survey.html` in this project, find this near the top of the `<script>` block:
   ```js
   var CONFIG = {
     SHEETS_WEBAPP_URL: 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE',
     REPORT_PASSWORD: 'report'
   };
   ```
   and replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL you copied.
8. Save. Open `survey.html` and submit a test response — a "Responses" tab should appear in the Google Sheet with the row in it.
9. In the survey's top bar, click **Build report**, enter the password `report`, and confirm the live chart view loads.

## If you ever change the code

Every time you edit `Code.gs` in the Apps Script editor, you need to make a **new deployment**
(Deploy → Manage deployments → pencil icon → New version → Deploy) for the changes to go live —
saving alone isn't enough.

## Changing the report password

Change it in **two** places so they stay in sync:
- `REPORT_PASSWORD` in `Code.gs` (redeploy after changing).
- `CONFIG.REPORT_PASSWORD` in `survey.html`.
