'use strict';

hexo.extend.filter.register('before_generate', async () => {
  const baseUrl = 'https://api.yppp.net/pc';
  const posts = hexo.model('Post').find({ published: true }).toArray();

  for (const post of posts) {
    const currentCover = typeof post.cover === 'string' ? post.cover : '';
    const shouldUpdate =
      post.cover == null ||
      currentCover === baseUrl ||
      currentCover.startsWith(`${baseUrl}?post=`);

    if (shouldUpdate) {
      const key = post.path || post.slug || String(post._id);
      post.cover = `${baseUrl}?post=${encodeURIComponent(key)}`;
      await post.save();
    }
  }

  hexo.locals.invalidate();
});
