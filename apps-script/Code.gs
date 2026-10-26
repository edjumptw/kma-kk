// 高雄市行銷人協會｜KK老師課程報名表與陳執董商業社群 AI 乾貨包領取後端（寫入 Google 試算表＋寄通知信＋自動寄送歡迎確認信）
var SHEET_ID = '1g0C9QCfEDqzjBtBxXHj9WBEwJC3oq0QD48UqhiVIxDQ';
var NOTIFY_EMAIL = 'tma77org@gmail.com';
var FIELDS = [
['submittedAt','送出時間'],['course','課程'],['session','場次'],['plan','報名方案'],['priceApplied','適用價格'],['groupMembers','同行者'],['referrer','推薦人'],['referrerContact','推薦人手機／推薦碼'],['partnerOrg','推薦單位'],
['name','姓名'],['mobile','手機'],['email','Email'],['lineId','LINE ID'],
['company','公司／品牌'],['jobTitle','職稱'],['industry','產業別'],
['invoiceType','發票／收據'],['taxId','統一編號'],['taxTitle','抬頭'],
['diet','飲食'],['dietNote','飲食備註'],['source','得知管道'],['bncMember','是否為 BNC 會員'],['transferLast5','匯款帳號後五碼'],['bncSource','11/19得知管道'],['note','備註'],
['privacyAgree','個資同意'],['depositAgree','定金規則同意'],['refundAgree','退費辦法同意'],['newsletter','願收協會訊息'],
['utm_source','utm_source'],['utm_medium','utm_medium'],['utm_campaign','utm_campaign'],['utm_content','utm_content'],['ref','ref'],['page','來源頁面']
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
vals[f[1]] = (f[0] === 'mobile' || f[0] === 'taxId' || f[0] === 'referrerContact' || f[0] === 'transferLast5') && v ? "'" + v : v;
});
var payStatus = '未繳費';
if (p.course === '線上分享會') payStatus = p.bncMember === '否' ? '定金待確認' : (p.bncMember === '是' ? '會員免付' : '不適用');
if (p.course === 'AI乾貨包領取名單') payStatus = '免費領取（已寄歡迎信）';
vals['繳費狀態'] = payStatus;
sh.appendRow(header.map(function (h) { return vals.hasOwnProperty(h) ? vals[h] : ''; }));
if (NOTIFY_EMAIL) {
MailApp.sendEmail(NOTIFY_EMAIL, '【新報名】' + (p.course || '') + '｜' + (p.name || '') + '｜' + (p.session || ''),
FIELDS.map(function (f) { return f[1] + '：' + (p[f[0]] || ''); }).join('\n'));
}
if (p.course === 'AI乾貨包領取名單' && p.email && String(p.email).indexOf('@') > 0) {
var welcomeSubj = '【陳執董的商業社群】歡迎入座同桌！您的 12 人 AI 團隊三大乾貨包＋49 個繁中模板永久連結';
var welcomeBody = (p.name || '同桌') + ' 您好：\n\n' +
'歡迎加入「陳執董的商業社群」！我是陳執董 Jump（陳建蒲）。\n' +
'以下為您整理好的三大 AI 實戰乾貨包、30 頁《一人公司 AI 團隊超級個體實戰手冊》PDF、台灣 10 大行業 49 個繁體中文 AI 員工模板，以及新手從 0 到 1 實戰教學永久連結，建議保留此信隨時查閱：\n\n' +
'1. 【一鍵免填表直接閱讀】同桌專屬三大實戰乾貨包（永久解鎖連結）：\n' +
'https://edjumptw.github.io/kma-kk/gift/?unlocked=1\n\n' +
'2. 【30 頁完整 PDF 手冊下載】《一人公司 AI 團隊超級個體實戰手冊》：\n' +
'https://edjumptw.github.io/kma-kk/gift/jump_super_individual_ai_team_handbook.pdf\n\n' +
'3. 【49 個繁中 AI 員工模板下載】《台灣中小企業 10 大熱門行業 AI 部門組織圖與 49 個現成模板實戰庫》：\n' +
'https://edjumptw.github.io/kma-kk/gift/taiwan_sme_ai_org_templates_zh.md\n\n' +
'4. 【新手必讀圖文攻略】《2026 Grok Bot 終極實戰教學＆Marketplace 模板市集全攻略》：\n' +
'https://edjumptw.github.io/kma-kk/grok-bot-guide/\n\n' +
'5. 【同桌專屬免費活動】\n' +
'- A 場：高雄 4–6 人免費實體咖啡小聚（100% 免費，各自點一杯店內低消，現場實機拆解 12 人 AI 團隊）\n' +
'- B 場：陳執董免費線上 AI 實戰分享會（近期於 LINE 社群投票優先公告，100% 免費、不收定金）\n' +
'- LINE 商業社群入口（參加密碼 bnc888）：https://line.me/ti/g2/7qQim1WtxNfE2pEp_WWH5THJNdgmu-qiC3qByg\n\n' +
'把重複的雜事交出去，我們只做最後的判斷。期待在社群與小聚跟您交流！\n\n' +
'陳執董 Jump（陳建蒲）\n' +
'建橋雲智・國際人脈商業團隊 敬上';
try {
MailApp.sendEmail(String(p.email).trim(), welcomeSubj, welcomeBody);
} catch (mailErr) {}
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
