/* ===== 協辦推廣協會（首頁、兩個課程頁、分享會報名頁共用） =====
   code：協會代碼，用在專屬網址，只能用英文小寫、數字、減號，例：kh-ia
         專屬網址會變成 https://edjumptw.github.io/kma-kk/p/代碼/
   name：協會全名（顯示在頁面上方「協辦單位」與報名表下拉選單）
   active：true 才會出現在下拉選單、產生專屬網址；名稱未確認前請保持 false
   新增協會：照格式多加一行，改完執行 python3 src/build.py */
window.PARTNERS = {
  list: [
    { code: "muyang",  name: "沐氧國際美學協會", active: true },
    { code: "hook",    name: "新竹縣社群自媒體職業工會", active: true },
    { code: "khchair", name: "高雄市理事長協進會", active: true },
    { code: "kingdom", name: "社團法人天國行在地上促進會", active: true },
    { code: "lohas",   name: "社團法人高雄市創意樂活協會", active: true }
  ]
};
