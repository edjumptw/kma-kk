/* ===== 線上分享會場次（首頁、兩個課程頁、分享會報名頁共用） =====
   id：場次代碼（報名連結 ?s=代碼 會自動勾選該場）
   course：ai 或 live
   start／end：開始與結束時間，過了 end 會自動從頁面與表單隱藏
   tag：場次特色標籤（可留空） */
window.TALKS = {
  endpoint: "https://script.google.com/macros/s/AKfycbxol7SFv9StP7UUvCTE4GDBrXBsGIrUtxSEAwJcCaXeDCosAFmjRZDCvNFAu04Tz_zzMw/exec",
  courses: {
    ai:   { name: "AI社群獲客變現實戰營", url: "ai/",   info: "高雄場 2027/1/16–17（六、日）正式授課" },
    live: { name: "KK教母直播實戰二日課", url: "live/", info: "高雄場 2027/3/6–7（六、日）正式授課" }
  },
  sessions: [
    { id: "ai-1119",   course: "ai",   date: "2026/11/19（四）", time: "19:30–20:30", start: "2026-11-19T19:30:00", end: "2026-11-19T20:30:00", tag: "" },
    { id: "ai-1125",   course: "ai",   date: "2026/11/25（三）", time: "19:30–20:30", start: "2026-11-25T19:30:00", end: "2026-11-25T20:30:00", tag: "" },
    { id: "ai-1215",   course: "ai",   date: "2026/12/15（二）", time: "14:30–15:30", start: "2026-12-15T14:30:00", end: "2026-12-15T15:30:00", tag: "下午場・老闆專場" },
    { id: "live-0107", course: "live", date: "2027/1/7（四）",   time: "19:30–20:30", start: "2027-01-07T19:30:00", end: "2027-01-07T20:30:00", tag: "" },
    { id: "live-0120", course: "live", date: "2027/1/20（三）",  time: "19:30–20:30", start: "2027-01-20T19:30:00", end: "2027-01-20T20:30:00", tag: "學員心得分享" },
    { id: "live-0218", course: "live", date: "2027/2/18（四）",  time: "19:30–20:30", start: "2027-02-18T19:30:00", end: "2027-02-18T20:30:00", tag: "年後開工場" }
  ]
};
