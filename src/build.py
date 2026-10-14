# 重新產生頁面：python3 src/build.py（輸出到上一層：live/、ai/、index.html、assets/）
import pathlib, shutil
BASE='https://edjumptw.github.io/tma-kk-courses/'
here=pathlib.Path(__file__).resolve().parent; s=here; out=here.parent
css=(s/'common.css').read_text(); talks_js=(s/'talks-block.js').read_text(); js=(s/'common.js').read_text()+'\n'+talks_js; form=(s/'form.html').read_text()
talks_data=(s/'talks-data.js').read_text()
pages={
 'live':dict(dir='live',name='KK教母直播實戰二日課',price='NT$79,800',early='NT$69,800',other='AI社群獲客變現實戰營',otherurl='../ai/',og='og-live.jpg'),
 'ai':dict(dir='ai',name='AI社群獲客變現實戰營',price='NT$39,800',early='NT$29,800',other='KK教母直播實戰二日課',otherurl='../live/',og='og-ai.jpg'),
}
for k,p in pages.items():
    h=(s/f'{k}.html').read_text().replace('{{FORM}}',form)
    for a,b in {'{{CSS}}':css,'{{JS}}':js,'{{TALKS_DATA}}':talks_data,'{{COURSE_NAME}}':p['name'],'{{PRICE}}':p['price'],'{{EARLY}}':p['early'],
                '{{OTHER_COURSE_NAME}}':p['other'],'{{OTHER_COURSE_URL}}':p['otherurl'],
                '../static/'+p['og']:BASE+'static/'+p['og']}.items():
        h=h.replace(a,b)
    assert '{{' not in h, k
    d=out/p['dir']; d.mkdir(parents=True,exist_ok=True); (d/'index.html').write_text(h)
    print(d, len(h))
h=(s/'home.html').read_text().replace('{{CSS}}',css).replace('{{TALKS_DATA}}',talks_data).replace('{{TALKS_JS}}',talks_js)
assert '{{' not in h, 'home'; (out/'index.html').write_text(h)
h=(s/'talks.html').read_text().replace('{{CSS}}',css).replace('{{TALKS_DATA}}',talks_data)
assert '{{' not in h, 'talks'; (out/'talks').mkdir(exist_ok=True); (out/'talks'/'index.html').write_text(h); print(out/'talks', len(h))
shutil.copytree(s/'assets', out/'static', dirs_exist_ok=True)
