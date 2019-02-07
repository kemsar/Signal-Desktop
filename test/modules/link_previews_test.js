const { assert } = require('chai');

const {
  getTitleMetaTag,
  getImageMetaTag,
  isLinkInWhitelist,
  isMediaLinkInWhitelist,
} = require('../../js/modules/link_previews');

describe('Link previews', () => {
  describe('#isLinkInWhitelist', () => {
    it('returns true for valid links', () => {
      assert.strictEqual(isLinkInWhitelist('https://youtube.com/blah'), true);
      assert.strictEqual(
        isLinkInWhitelist('https://www.youtube.com/blah'),
        true
      );
      assert.strictEqual(isLinkInWhitelist('https://m.youtube.com/blah'), true);
      assert.strictEqual(isLinkInWhitelist('https://youtu.be/blah'), true);
      assert.strictEqual(isLinkInWhitelist('https://reddit.com/blah'), true);
      assert.strictEqual(
        isLinkInWhitelist('https://www.reddit.com/blah'),
        true
      );
      assert.strictEqual(isLinkInWhitelist('https://m.reddit.com/blah'), true);
      assert.strictEqual(isLinkInWhitelist('https://imgur.com/blah'), true);
      assert.strictEqual(isLinkInWhitelist('https://www.imgur.com/blah'), true);
      assert.strictEqual(isLinkInWhitelist('https://m.imgur.com/blah'), true);
      assert.strictEqual(isLinkInWhitelist('https://instagram.com/blah'), true);
      assert.strictEqual(
        isLinkInWhitelist('https://www.instagram.com/blah'),
        true
      );
      assert.strictEqual(
        isLinkInWhitelist('https://m.instagram.com/blah'),
        true
      );
    });

    it('returns false for subdomains', () => {
      assert.strictEqual(
        isLinkInWhitelist('https://any.subdomain.youtube.com/blah'),
        false
      );
      assert.strictEqual(
        isLinkInWhitelist('https://any.subdomain.instagram.com/blah'),
        false
      );
    });

    it('returns false for http links', () => {
      assert.strictEqual(isLinkInWhitelist('http://instagram.com/blah'), false);
      assert.strictEqual(isLinkInWhitelist('http://youtube.com/blah'), false);
    });

    it('returns false for links with no protocol', () => {
      assert.strictEqual(isLinkInWhitelist('instagram.com/blah'), false);
      assert.strictEqual(isLinkInWhitelist('youtube.com/blah'), false);
    });

    it('returns false for link to root path', () => {
      assert.strictEqual(isLinkInWhitelist('https://instagram.com'), false);
      assert.strictEqual(isLinkInWhitelist('https://youtube.com'), false);

      assert.strictEqual(isLinkInWhitelist('https://instagram.com/'), false);
      assert.strictEqual(isLinkInWhitelist('https://youtube.com/'), false);
    });

    it('returns false for other well-known sites', () => {
      assert.strictEqual(isLinkInWhitelist('https://facebook.com/blah'), false);
      assert.strictEqual(isLinkInWhitelist('https://twitter.com/blah'), false);
    });

    it('returns false for links that look like our target links', () => {
      assert.strictEqual(
        isLinkInWhitelist('https://evil.site.com/.instagram.com/blah'),
        false
      );
      assert.strictEqual(
        isLinkInWhitelist('https://evil.site.com/.instagram.com/blah'),
        false
      );
      assert.strictEqual(
        isLinkInWhitelist('https://sinstagram.com/blah'),
        false
      );
    });
  });

  describe('#isMediaLinkInWhitelist', () => {
    it('returns true for valid links', () => {
      assert.strictEqual(
        isMediaLinkInWhitelist(
          'https://i.ytimg.com/vi/bZHShcCEH3I/hqdefault.jpg'
        ),
        true
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('https://random.cdninstagram.com/blah'),
        true
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('https://preview.redd.it/something'),
        true
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('https://i.imgur.com/something'),
        true
      );
    });

    it('returns false for insecure protocol', () => {
      assert.strictEqual(
        isMediaLinkInWhitelist(
          'http://i.ytimg.com/vi/bZHShcCEH3I/hqdefault.jpg'
        ),
        false
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('http://random.cdninstagram.com/blah'),
        false
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('http://preview.redd.it/something'),
        false
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('http://i.imgur.com/something'),
        false
      );
    });

    it('returns false for other domains', () => {
      assert.strictEqual(
        isMediaLinkInWhitelist('https://www.youtube.com/something'),
        false
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('https://youtu.be/something'),
        false
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('https://www.instagram.com/something'),
        false
      );
      assert.strictEqual(
        isMediaLinkInWhitelist('https://cnn.com/something'),
        false
      );
    });
  });

  describe('#_getMetaTag', () => {
    it('returns html-decoded tag contents from Youtube', () => {
      const youtube = `
        <meta property="og:site_name" content="YouTube">
        <meta property="og:url" content="https://www.youtube.com/watch?v=tP-Ipsat90c">
        <meta property="og:type" content="video.other">
        <meta property="og:title" content="Randomness is Random - Numberphile">
        <meta property="og:image" content="https://i.ytimg.com/vi/tP-Ipsat90c/maxresdefault.jpg">
      `;

      assert.strictEqual(
        'Randomness is Random - Numberphile',
        getTitleMetaTag(youtube)
      );
      assert.strictEqual(
        'https://i.ytimg.com/vi/tP-Ipsat90c/maxresdefault.jpg',
        getImageMetaTag(youtube)
      );
    });

    it('returns html-decoded tag contents from Instagram', () => {
      const instagram = `
        <meta property="og:site_name" content="Instagram" />
        <meta property="og:url" content="https://www.instagram.com/p/BrgpsUjF9Jo/" />
        <meta property="og:type" content="instapp:photo" />
        <meta property="og:title" content="Walter &#34;MFPallytime&#34; on Instagram: “Lol gg”" />
        <meta property="og:description" content="632 Likes, 56 Comments - Walter &#34;MFPallytime&#34; (@mfpallytime) on Instagram: “Lol gg    ”" />
<meta property="og:image" content="https://scontent-lax3-1.cdninstagram.com/vp/1c69aa381c2201720c29a6c28de42ffd/5CD49B5B/t51.2885-15/e35/47690175_2275988962411653_1145978227188801192_n.jpg?_nc_ht=scontent-lax3-1.cdninstagram.com" />
      `;

      assert.strictEqual(
        'Walter "MFPallytime" on Instagram: “Lol gg”',
        getTitleMetaTag(instagram)
      );
      assert.strictEqual(
        'https://scontent-lax3-1.cdninstagram.com/vp/1c69aa381c2201720c29a6c28de42ffd/5CD49B5B/t51.2885-15/e35/47690175_2275988962411653_1145978227188801192_n.jpg?_nc_ht=scontent-lax3-1.cdninstagram.com',
        getImageMetaTag(instagram)
      );
    });

    it('returns html-decoded tag contents from Instagram', () => {
      const imgur = `
        <meta property="og:site_name" content="Imgur">
        <meta property="og:url" content="https://imgur.com/gallery/KFCL8fm">
        <meta property="og:type" content="article">
        <meta property="og:title" content="&nbsp;">
        <meta property="og:description" content="13246 views and 482 votes on Imgur">
        <meta property="og:image" content="https://i.imgur.com/Y3wjlwY.jpg?fb">
        <meta property="og:image:width" content="600">
        <meta property="og:image:height" content="315">
      `;

      assert.strictEqual('', getTitleMetaTag(imgur));
      assert.strictEqual(
        'https://i.imgur.com/Y3wjlwY.jpg?fb',
        getImageMetaTag(imgur)
      );
    });

    it('returns only the first tag', () => {
      const html = `
        <meta property="og:title" content="First&nbsp;Second&nbsp;Third"><meta property="og:title" content="Fourth&nbsp;Fifth&nbsp;Sixth">
      `;

      assert.strictEqual('First Second Third', getTitleMetaTag(html));
    });

    it('handles a newline in attribute value', () => {
      const html = `
        <meta property="og:title" content="First thing\r\nSecond thing\nThird thing">
      `;

      assert.strictEqual(
        'First thing\r\nSecond thing\nThird thing',
        getTitleMetaTag(html)
      );
    });
  });
});
