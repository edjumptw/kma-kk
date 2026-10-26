# 重新產生頁面：python3 src/build.py（輸出到上一層：live/、ai/、index.html、assets/）
import pathlib, shutil
BASE='https://edjumptw.github.io/kma-kk/'
here=pathlib.Path(__file__).resolve().parent; s=here; out=here.parent
css=(s/'common.css').read_text(); talks_js=(s/'talks-block.js').read_text(); partners_js=(s/'partners.js').read_text(); partners_data=(s/'partners-data.js').read_text()
js=(s/'common.js').read_text()+'\n'+talks_js+'\n'+partners_js; form=(s/'form.html').read_text()
talks_data=(s/'talks-data.js').read_text()
pages={
 'live':dict(dir='live',name='KK教母直播實戰二日課',price='NT$79,800',early='NT$69,800',other='AI社群獲客變現實戰營',otherurl='../ai/',og='og-live.jpg'),
 'ai':dict(dir='ai',name='AI社群獲客變現實戰營',price='NT$39,800',early='NT$29,800',other='KK教母直播實戰二日課',otherurl='../live/',og='og-ai.jpg'),
}
for k,p in pages.items():
    h=(s/f'{k}.html').read_text().replace('{{FORM}}',form)
    for a,b in {'{{CSS}}':css,'{{JS}}':js,'{{TALKS_DATA}}':talks_data,'{{PARTNERS_DATA}}':partners_data,'{{COURSE_NAME}}':p['name'],'{{PRICE}}':p['price'],'{{EARLY}}':p['early'],
                '{{OTHER_COURSE_NAME}}':p['other'],'{{OTHER_COURSE_URL}}':p['otherurl'],
                '../static/'+p['og']:BASE+'static/'+p['og']}.items():
        h=h.replace(a,b)
    assert '{{' not in h, k
    d=out/p['dir']; d.mkdir(parents=True,exist_ok=True); (d/'index.html').write_text(h)
    print(d, len(h))
h=(s/'home.html').read_text().replace('{{CSS}}',css).replace('{{TALKS_DATA}}',talks_data).replace('{{TALKS_JS}}',talks_js).replace('{{PARTNERS_DATA}}',partners_data).replace('{{PARTNERS_JS}}',partners_js)
assert '{{' not in h, 'home'; (out/'index.html').write_text(h)
h=(s/'talks.html').read_text().replace('{{CSS}}',css).replace('{{TALKS_DATA}}',talks_data).replace('{{PARTNERS_DATA}}',partners_data).replace('{{PARTNERS_JS}}',partners_js)
assert '{{' not in h, 'talks'; (out/'talks').mkdir(exist_ok=True); (out/'talks'/'index.html').write_text(h); print(out/'talks', len(h))
h=(s/'talks-1119.html').read_text().replace('{{CSS}}',css).replace('{{TALKS_DATA}}',talks_data).replace('{{PARTNERS_DATA}}',partners_data).replace('{{PARTNERS_JS}}',partners_js)
assert '{{' not in h, 'talks-1119'
d=out/'talks'/'1119'; d.mkdir(parents=True, exist_ok=True); (d/'index.html').write_text(h); print(d, len(h))
shutil.copytree(s/'assets', out/'static', dirs_exist_ok=True)

# 協辦協會專屬網址：p/代碼/（轉到首頁並帶入協會代碼；LINE、FB 分享時顯示協會名稱）
import json, re, html as H
m=re.search(r'list:\s*(\[.*?\])', partners_data, re.S)
plist=json.loads(re.sub(r'\b(code|name|active)\s*:', r'"\1":', m.group(1)))
shutil.rmtree(out/'p', ignore_errors=True)
for p in plist:
    if not p.get('active'): continue
    assert re.fullmatch(r'[a-z0-9-]+', p['code']), p['code']
    name=H.escape(p['name']); dest='../../?org='+p['code']
    page=f"""<!doctype html><html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{name} × 社團法人高雄市行銷人協會｜實戰課程高雄場報名</title>
<meta property="og:title" content="{name} × 社團法人高雄市行銷人協會｜實戰課程高雄場報名">
<meta property="og:description" content="AI社群獲客變現實戰營、KK教母直播實戰二日課高雄場，協辦單位：{name}">
<meta property="og:image" content="{BASE}static/og-live.jpg">
<meta http-equiv="refresh" content="0;url={dest}">
<script>location.replace('{dest}'+location.hash)</script>
</head><body><p><a href="{dest}">前往課程報名頁</a></p></body></html>
"""
    d=out/'p'/p['code']; d.mkdir(parents=True, exist_ok=True); (d/'index.html').write_text(page); print(d)
# p/ 本身沒有內容，轉回首頁（避免 Search Console 回報 404）
(out/'p'/'index.html').write_text("""<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>前往課程報名頁</title>
<link rel="canonical" href="https://edjumptw.github.io/kma-kk/">
<meta name="robots" content="noindex,follow">
<meta http-equiv="refresh" content="0;url=/kma-kk/">
<script>location.replace('/kma-kk/'+location.search+location.hash)</script>
</head>
<body><p><a href="/kma-kk/">前往課程報名頁</a></p></body>
</html>
""")

