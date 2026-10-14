/* ===== 協辦推廣協會（首頁、兩個課程頁、分享會報名頁共用） =====
   code：協會代碼，用在專屬網址，只能用英文小寫、數字、減號，例：kh-ia
         專屬網址會變成 https://edjumptw.github.io/tma-kk-courses/p/代碼/
   name：協會全名（顯示在頁面上方「協辦單位」與報名表下拉選單）
   active：true 才會出現在下拉選單、產生專屬網址；名稱未確認前請保持 false
   新增協會：照格式多加一行，改完執行 python3 src/build.py */
window.PARTNERS = {
  list: [
    { code: "partner-1", name: "【待確認：協辦協會一全名】", active: false },
    { code: "partner-2", name: "【待確認：協辦協會二全名】", active: false },
    { code: "partner-3", name: "【待確認：協辦協會三全名】", active: false },
    { code: "partner-4", name: "【待確認：協辦協會四全名】", active: false }
  ]
};
