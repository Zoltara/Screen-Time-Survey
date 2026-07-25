/**
 * Backend for Teacher Rambo's Social Media Survey.
 * Deploy this bound to the Google Sheet as a Web App (see README.md in this folder).
 *
 * doPost  — called by survey.html for every submitted response. Appends one row.
 * doGet   — called by survey.html's "Build report" button. Requires ?pw=<REPORT_PASSWORD>,
 *           returns every stored response as a JSON array.
 */

var SHEET_NAME = 'Responses';
var REPORT_PASSWORD = 'report'; // must match CONFIG.REPORT_PASSWORD in survey.html

var HEADERS = [
  'Timestamp', 'Class', 'Hours', 'Platforms', 'Device', 'OS',
  'WantLess', 'Actions', 'Impacts', 'Activity', 'WinaiInterest',
  'Tester', 'TesterNick', 'TesterEmail', 'TesterClass'
];

function getSheet_(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if(!sheet){
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if(sheet.getLastRow() === 0){
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function jsonOut_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try{
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.cls || '',
      data.hours || '',
      Array.isArray(data.platforms) ? data.platforms.join(',') : '',
      data.device || '',
      data.os || '',
      data.wantLess || '',
      Array.isArray(data.actions) ? data.actions.join(',') : '',
      Array.isArray(data.impacts) ? data.impacts.join(',') : '',
      data.activity || '',
      data.winai || '',
      data.tester || '',
      data.testerNick || '',
      data.testerEmail || '',
      data.testerClass || ''
    ]);
    return jsonOut_({ ok: true });
  }catch(err){
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doGet(e){
  var pw = e.parameter.pw || '';
  if(pw !== REPORT_PASSWORD){
    return jsonOut_({ error: 'unauthorized' });
  }
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if(lastRow < 2){
    return jsonOut_([]);
  }
  var rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  var records = rows.map(function(row){
    return {
      cls: row[1],
      hours: row[2],
      platforms: row[3] ? String(row[3]).split(',').filter(Boolean) : [],
      device: row[4],
      os: row[5],
      wantLess: row[6],
      actions: row[7] ? String(row[7]).split(',').filter(Boolean) : [],
      impacts: row[8] ? String(row[8]).split(',').filter(Boolean) : [],
      activity: row[9],
      winai: Number(row[10]) || 0,
      tester: row[11],
      testerNick: row[12],
      testerEmail: row[13],
      testerClass: row[14]
    };
  });
  return jsonOut_(records);
}
