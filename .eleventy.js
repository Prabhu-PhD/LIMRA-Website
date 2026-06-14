// Eleventy config — LIMRA Overseas Education
// Only the blog/news is templated. Every other page is hand-written static
// HTML that is copied through untouched. Build output goes to _site/.

module.exports = function (eleventyConfig) {
  // --- copy all static assets & hand-written pages verbatim ---
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("colleges");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // hand-written root pages (everything except the generated blog.html)
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("home2.html");
  eleventyConfig.addPassthroughCopy("about.html");
  eleventyConfig.addPassthroughCopy("colleges.html");
  eleventyConfig.addPassthroughCopy("coaching.html");
  eleventyConfig.addPassthroughCopy("medical-tourism.html");
  eleventyConfig.addPassthroughCopy("gallery.html");
  eleventyConfig.addPassthroughCopy("testimonials.html");
  eleventyConfig.addPassthroughCopy("contact.html");
  eleventyConfig.addPassthroughCopy("thank-you.html");

  // --- date helpers for the blog ---
  eleventyConfig.addFilter("readableDate", (value) => {
    const d = new Date(value);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));

  // newest-first blog collection
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("post").sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );

  return {
    dir: { input: ".", includes: "_includes", output: "_site" },
    // Only treat these as templates; .html files are copied, not rendered.
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
