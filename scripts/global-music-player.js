'use strict';

// hexo-tag-aplayer registers the Meting Hexo tag. Reuse that tag for the
// site-wide fixed player instead of keeping a separate handwritten <meting-js>.
const marker = '<!-- HEXO_TAG_APLAYER_GLOBAL_PLAYER -->';
const args = [
  '18563412205', 'netease', 'playlist',
  'fixed', 'mini', 'autoplay', 'listfolded',
  'order:random', 'loop:all', 'theme:#e57393',
  'preload:none', 'volume:0.5'
];

hexo.extend.filter.register('after_render:html', function (html) {
  if (!html.includes(marker)) return html;
  const metingTag = hexo.extend.tag.get('meting');
  const render = typeof metingTag === 'function' ? metingTag : metingTag && metingTag.fn;
  if (typeof render !== 'function') {
    throw new Error('hexo-tag-aplayer Meting tag is not registered');
  }
  // Run before the plugin's asset injection filter (default priority 10).
  const player = render.call({ _id: 'global-music-player' }, args);
  return html.replace(marker, player);
}, 1);
