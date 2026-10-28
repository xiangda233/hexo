'use strict';

const shortcodeNames = [
  'title',
  'h2title',
  'dangerbox',
  'danger',
  'ypbtn',
  'bdbtn',
  'bilibili',
  'music',
  'heimu',
  'mark'
];

function unescapeKnownShortcodes(content) {
  let output = content;

  for (const name of shortcodeNames) {
    output = output
      .replaceAll(`\\[${name}`, `[${name}`)
      .replaceAll(`\\[/${name}`, `[/${name}`);

    const closingEscape = new RegExp(
      `(\\[/?${name}(?:\\s[^\\]]*)?)\\\\\\]`,
      'g'
    );
    output = output.replace(closingEscape, '$1]');
  }

  return output;
}

function convertShortcodes(content) {
  let output = unescapeKnownShortcodes(content);

  output = output
    .replace(/\[h2title\]([\s\S]*?)\[\/h2title\]/gi, '$1')
    .replace(/\[title\]([\s\S]*?)\[\/title\]/gi,
      (_, title) => `\n\n## ${title.trim()}\n\n`)
    .replace(/\[dangerbox(?:\s+title=["']([^"']*)["'])?\]([\s\S]*?)\[\/dangerbox\]/gi,
      (_, title, body) => `\n\n> **${title || '注意'}** ${body.trim()}\n\n`)
    .replace(/\[danger\]([\s\S]*?)\[\/danger\]/gi,
      (_, body) => `\n\n> **注意：** ${body.trim()}\n\n`)
    .replace(/\[(ypbtn|bdbtn)\]([\s\S]*?)\[\/\1\]/gi,
      (_, command, url) => `\n\n[打开下载链接](${url.trim()})\n\n`)
    .replace(/\[bilibili[^\]]*\]([\s\S]*?)\[\/bilibili\]/gi, (_, body) => {
      const value = body.trim().replace(/\\_/g, '_');
      const bv = value.match(/BV[0-9A-Za-z]+/i);
      const url = bv ? `https://www.bilibili.com/video/${bv[0]}` : value;
      return url ? `\n\n[在 B 站观看视频](${url})\n\n` : '\n\n';
    })
    .replace(/\[music[^\]]*\]([\s\S]*?)\[\/music\]/gi, (_, id) => {
      const musicId = id.trim();
      return musicId && /^\d+$/.test(musicId)
        ? `\n\n[网易云音乐：${musicId}](https://music.163.com/#/song?id=${musicId})\n\n`
        : '\n\n';
    })
    .replace(/\[heimu\]([\s\S]*?)\[\/heimu\]/gi,
      (_, body) => `\n\n<details>\n<summary>点击查看隐藏内容</summary>\n\n${body.trim()}\n\n</details>\n\n`)
    .replace(/\[mark\]([\s\S]*?)\[\/mark\]/gi, (_, body) => body.trim())
    .replace(/:(huaji\d*|yinxian|meng):/gi, (_, name) => (
      name.toLowerCase() === 'meng' ? '🥺' : '😏'
    ))
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();

  return `${output}\n`;
}

module.exports = { convertShortcodes };
