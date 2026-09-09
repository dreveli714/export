// ═══════════════════════════════════════════════
// EXPORT SHIPPING — APPS SCRIPT
// Replace your old code with THIS entire file
// Then: Deploy → New deployment → Get new URL
// ═══════════════════════════════════════════════

const SHEET_ID = '1Drlne7fFWV2HAIhtbHXZb3xn2IlgBdX_KvW6b1xmsxA';
const SHEET_NAME = 'Daily';
const FOLDER_ID = '1FO_oW2dDCt3PmALIg2RBvX6OhPqPQyHQ';

// GET — reads all orders from sheet
function doGet(e) {
  try {
    const action = (e && e.parameter) ? e.parameter.action : 'list';
    
    if (action === 'list') {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet) {
        return jsonResponse({error: 'Sheet "Daily" not found'});
      }
      const data = sheet.getDataRange().getValues();
      return jsonResponse({data: data});
    }
    
    return jsonResponse({error: 'Unknown action: ' + action});
  } catch(err) {
    return jsonResponse({error: err.toString()});
  }
}

// POST — handles save and upload
function doPost(e) {
  try {
    // Parse body — handles both text/plain and application/json
    let body;
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.payload) {
      body = JSON.parse(e.parameter.payload);
    } else {
      return jsonResponse({error: 'No data received'});
    }
    
    const action = body.action;
    
    // ══════ SAVE ORDERS ══════
    if (action === 'save') {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet) {
        return jsonResponse({error: 'Sheet "Daily" not found'});
      }
      
      // Clear sheet
      sheet.clear();
      
      // Headers (12 columns: ID + 11 fields)
      const headers = ['ID','Ref','Client','Carrier','Tracking','Status','Notes','Assigned','CreatedAt','Invoice','BL','Label','PDF_URLs'];
      sheet.appendRow(headers);
      
      // Write orders
      const orders = body.orders || [];
      if (orders.length > 0) {
        const rows = orders.map(o => [
          o.id || '',
          o.ref || '',
          o.client || '',
          o.carrier || '',
          o.tracking || '',
          o.status || 'pending',
          o.note || '',
          o.user || '',
          o.createdAt || new Date().toISOString(),
          o.pdf || 'FALSE',
          o.bl || 'FALSE',
          o.label || 'FALSE',
          o.pdfUrls || ''
        ]);
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      }
      
      return jsonResponse({ok: true, count: orders.length});
    }
    
    // ══════ UPLOAD PDF ══════
    if (action === 'upload') {
      if (!body.fileData) return jsonResponse({error: 'No file data'});
      
      const decoded = Utilities.base64Decode(body.fileData);
      const blob = Utilities.newBlob(decoded, body.mime || 'application/pdf', body.filename || 'file.pdf');
      
      const folder = DriveApp.getFolderById(FOLDER_ID);
      const file = folder.createFile(blob);
      
      // Share with domain link
      try {
        file.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW);
      } catch(shareErr) {
        // If domain sharing fails, try ANYONE_WITH_LINK
        try {
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch(e2) {
          // Continue even if sharing fails
        }
      }
      
      return jsonResponse({
        ok: true,
        url: file.getUrl(),
        id: file.getId(),
        name: file.getName()
      });
    }
    
    return jsonResponse({error: 'Unknown action: ' + action});
    
  } catch(err) {
    return jsonResponse({error: err.toString(), stack: err.stack});
  }
}

// Helper — JSON response
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional — test function you can run from Apps Script editor
function testList() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('ERROR: Sheet "Daily" not found');
    return;
  }
  const data = sheet.getDataRange().getValues();
  Logger.log('Rows: ' + data.length);
  Logger.log(JSON.stringify(data));
}

function testUpload() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  Logger.log('Folder: ' + folder.getName());
}
