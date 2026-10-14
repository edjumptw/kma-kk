# KK 老師實戰課程報名頁｜社團法人高雄市行銷人協會

網址：https://edjumptw.github.io/tma-kk-courses/

- `ai/`：AI社群獲客變現實戰營
- `live/`：KK教母直播實戰二日課
- `talks/`：高雄場免費線上分享會報名（場次設定在 `src/talks-data.js`，首頁與兩個課程頁共用）
- 修改：改 `src/`（場次、價格在 `src/live.html`、`src/ai.html` 上方 `window.COURSE`；高雄場早鳥、晚鳥截止日用 `earlyUntil`、`lateUntil` 指定），執行 `python3 src/build.py`，commit 後執行 `git push origin main main:gh-pages`（網站從 gh-pages 分支發布）
- 報名資料：送到 Google Apps Script（`apps-script/Code.gs`），寫入 Google 試算表並寄通知信到 tma77org@gmail.com
