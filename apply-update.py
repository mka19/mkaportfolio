from pathlib import Path
p=Path(__file__).resolve().parent/'modules'/'about'/'index.html'
s=p.read_text(encoding='utf-8')
if 'data-mka-about-bridge' not in s:
    assert '</body>' in s
    p.write_text(s.replace('</body>','<script data-mka-about-bridge="true" src="host-bridge.js?v=27"></script></body>',1),encoding='utf-8')
print('MKA V27 About bridge ready.')
