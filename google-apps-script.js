/**
 * WLL 2026 Registration — Google Apps Script
 * ============================================
 * SETUP STEPS (do this once):
 *
 * 1. Go to https://sheets.google.com  →  create a new spreadsheet
 *    Name it: "WLL 2026 Registrations"
 *
 * 2. In the spreadsheet, go to Extensions → Apps Script
 *
 * 3. Delete all existing code and paste THIS entire file
 *
 * 4. Click  Save  (💾)
 *
 * 5. Click  Deploy  →  New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy → Authorise → Allow
 *
 * 6. Copy the Web app URL  (looks like https://script.google.com/macros/s/AKfyc.../exec)
 *
 * 7. Open   src/pages/Register.jsx   in your wll-2026 project
 *    Find line 12:
 *       const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
 *    Replace the placeholder with your copied URL.
 *    Save the file — done! ✅
 */

const SHEET_NAME = 'Registrations'; // tab name in your Google Sheet

function doPost(e) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // Auto-create the sheet + header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Email',
        'Phone',
        'School / University',
        'District',
        'Grade / Year',
        'Category',
        'Participation Type',
        'SDG Interest',
        'Message',
        'Submitted At',
      ]);
      // Bold the header row
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#F89B29').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const data = e.parameter;

    sheet.appendRow([
      new Date(),                          // server timestamp
      data.fullName        || '',
      data.email           || '',
      data.phone           || '',
      data.school          || '',
      data.district        || '',
      data.gradeYear       || '',
      data.category        || '',
      data.participationType || '',
      data.sdgInterest     || '',
      data.message         || '',
      data.submittedAt     || '',          // client-side timestamp
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Utility: run this once manually to test without a form
function testInsert() {
  doPost({ parameter: {
    fullName: 'Test User', email: 'test@example.com', phone: '0771234567',
    school: 'Test School', district: 'Colombo', gradeYear: 'Grade 10',
    category: 'School Student (Age 11–15)', participationType: 'Enter the Art Competition',
    sdgInterest: 'SDG 4: Quality Education', message: 'Test submission',
    submittedAt: new Date().toLocaleString(),
  }});
}
