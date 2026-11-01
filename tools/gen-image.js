// 文生图：通过 DashScope 万相 (wanx) 异步接口生成图片
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.DASHSCOPE_KEY;
if (!API_KEY) { console.error('missing DASHSCOPE_KEY'); process.exit(1); }

const PROMPT = process.argv[2] || '';
const SIZE = process.argv[3] || '1280*720';
const OUT = process.argv[4] || path.join(__dirname, '..', 'generated', 'image.png');

function request(url, opts, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('timeout')));
    if (body) req.write(body);
    req.end();
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const go = (u, depth = 0) => {
      if (depth > 5) return reject(new Error('too many redirects'));
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return go(res.headers.location, depth + 1);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error('download status ' + res.statusCode));
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const tmp = dest + '.part';
        const ws = fs.createWriteStream(tmp);
        res.pipe(ws);
        ws.on('finish', () => { fs.renameSync(tmp, dest); resolve(fs.statSync(dest).size); });
        ws.on('error', reject);
      }).on('error', reject);
    };
    go(url);
  });
}

(async () => {
  const payload = JSON.stringify({
    model: 'wanx2.1-t2i-turbo',
    input: { prompt: PROMPT },
    parameters: { size: SIZE, n: 1, prompt_extend: true, watermark: false },
  });

  const submit = await request(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
    },
    payload
  );
  const sub = JSON.parse(submit.body);
  if (submit.status !== 200 || !sub.output || !sub.output.task_id) {
    console.error('SUBMIT_FAIL', submit.status, submit.body.slice(0, 800));
    process.exit(2);
  }
  const taskId = sub.output.task_id;
  console.log('task:', taskId, 'size:', SIZE);

  let url = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const q = await request(
      'https://dashscope.aliyuncs.com/api/v1/tasks/' + taskId,
      { method: 'GET', headers: { Authorization: 'Bearer ' + API_KEY } }
    );
    const j = JSON.parse(q.body);
    const st = j.output && j.output.task_status;
    if (st === 'SUCCEEDED') {
      url = j.output.results[0].url;
      console.log('succeeded after', (i + 1) * 3, 's');
      break;
    }
    if (st && st !== 'PENDING' && st !== 'RUNNING') {
      console.error('TASK_FAIL', st, JSON.stringify(j.output).slice(0, 800));
      process.exit(3);
    }
  }
  if (!url) { console.error('TIMEOUT'); process.exit(4); }

  const bytes = await download(url, OUT);
  console.log('saved:', OUT, bytes, 'bytes');
  fs.writeFileSync(OUT.replace(/\.png$/, '.url.txt'), url + '\n');
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
