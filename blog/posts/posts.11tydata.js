// Shared data for every post in blog/posts/.
// - Full articles render to /blog/<slug>.html using post.njk.
// - "Link-out" news items (those with a `link:` in frontmatter) do NOT get
//   their own page; their card just links to the given URL.
module.exports = {
  layout: "post.njk",
  tags: ["post"],
  author: "LIMRA Team",
  eleventyComputed: {
    permalink: (data) => (data.link ? false : `/blog/${data.page.fileSlug}.html`)
  }
};
