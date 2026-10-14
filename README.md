# KK 老師實戰課程報名頁｜社團法人高雄市行銷人協會

網址：https://edjumptw.github.io/kma-kk/（舊網址 tma-kk-courses 已停用）

- `ai/`：AI社群獲客變現實戰營
- `live/`：KK教母直播實戰二日課
- `talks/`：高雄場免費線上分享會報名（場次設定在 `src/talks-data.js`，首頁與兩個課程頁共用）
- 修改：改 `src/`（場次、價格在 `src/live.html`、`src/ai.html` 上方 `window.COURSE`；高雄場早鳥、晚鳥截止日用 `earlyUntil`、`lateUntil` 指定），執行 `python3 src/build.py`，commit 後執行 `git push origin main main:gh-pages`（網站從 gh-pages 分支發布）
- 報名資料：送到 Google Apps Script（`apps-script/Code.gs`），寫入 Google 試算表並寄通知信到 tma77org@gmail.com

## 協辦協會（推廣頁＋推薦單位下拉選單）

- 協會名單在 `src/partners-data.js`：填協會全名、代碼（英文小寫、數字、減號），`active: true` 才會上線
- 每個協會的專屬網址：`https://edjumptw.github.io/tma-kk-courses/p/代碼/`，也可以直接用 `ai/?org=代碼`、`live/?org=代碼`、`talks/?org=代碼`
- 從專屬網址進來：頁面上方顯示「協辦單位｜協會名稱」，換頁也會記住，報名表「推薦單位」自動選好該協會
- 試算表新增「推薦單位」欄（最右邊）；上線前要先把 `apps-script/Code.gs` 貼到 Apps Script 並重新部署（管理部署作業 → 編輯 → 新版本）
- 新增協會：在 `src/partners-data.js` 多加一行，執行 `python3 src/build.py`，commit 後推上 gh-pages
