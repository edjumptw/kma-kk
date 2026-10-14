// 高雄市行銷人協會｜KK老師課程報名表後端（寫入 Google 試算表＋寄通知信）
var SHEET_ID = '1g0C9QCfEDqzjBtBxXHj9WBEwJC3oq0QD48UqhiVIxDQ';
var NOTIFY_EMAIL = 'tma77org@gmail.com';
var FIELDS = [
['submittedAt','送出時間'],['course','課程'],['session','場次'],['plan','報名方案'],['priceApplied','適用價格'],['groupMembers','同行者'],['referrer','推薦人'],['referrerContact','推薦人手機／推薦碼'],['partnerOrg','推薦單位'],
['name','姓名'],['mobile','手機'],['email','Email'],['lineId','LINE ID'],
['company','公司／品牌'],['jobTitle','職稱'],['industry','產業別'],
['invoiceType','發票／收據'],['taxId','統一編號'],['taxTitle','抬頭'],
['diet','飲食'],['dietNote','飲食備註'],['source','得知管道'],['note','備註'],
['privacyAgree','個資同意'],['refundAgree','退費辦法同意'],['newsletter','願收協會訊息'],
['utm_source','utm_source'],['utm_medium','utm_medium'],['utm_campaign','utm_campaign'],['ref','ref'],['page','來源頁面']
];
function doPost(e) {
var lock = LockService.getScriptLock();
lock.waitLock(10000);
try {
var p = e.parameter || {};
var ss = SpreadsheetApp.openById(SHEET_ID);
var name = (p.course || '報名').slice(0, 30);
var sh = ss.getSheetByName(name) || ss.insertSheet(name);
var labels = FIELDS.map(function (f) { return f[1]; }).concat(['繳費狀態', '處理備註']);
if (sh.getLastRow() === 0) {
sh.appendRow(labels);
sh.setFrozenRows(1);
}
var header = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
labels.forEach(function (l) { if (header.indexOf(l) < 0) { header.push(l); sh.getRange(1, header.length).setValue(l); } });
var vals = {};
FIELDS.forEach(function (f) {
var v = String(p[f[0]] || '');
vals[f[1]] = (f[0] === 'mobile' || f[0] === 'taxId' || f[0] === 'referrerContact') && v ? "'" + v : v;
});
vals['繳費狀態'] = p.course === '線上分享會' ? '不適用' : '未繳費';
sh.appendRow(header.map(function (h) { return vals.hasOwnProperty(h) ? vals[h] : ''; }));
if (NOTIFY_EMAIL) {
MailApp.sendEmail(NOTIFY_EMAIL, '【新報名】' + (p.course || '') + '｜' + (p.name || '') + '｜' + (p.session || ''),
FIELDS.map(function (f) { return f[1] + '：' + (p[f[0]] || ''); }).join('\n'));
}
return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
} catch (err) {
return ContentService.createTextOutput('{"ok":false}').setMimeType(ContentService.MimeType.JSON);
} finally {
lock.releaseLock();
}
}
function doGet() {
return ContentService.createTextOutput('ok');
}
function testSetup() {
SpreadsheetApp.openById(SHEET_ID).getName();
MailApp.getRemainingDailyQuota();
}
