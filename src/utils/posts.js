const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, '../content/posts');

async function getAllPosts() {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8');
        const { data } = matter(content);
        return {
          slug: file.replace('.md', ''),
          meta: {
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString().split('T')[0],
            tags: data.tags || [],
            excerpt: data.excerpt || '',
            published: data.published !== false
          }
        };
      })
    );

    return posts
      .filter(p => p.meta.published)
      .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
  } catch {
    return [];
  }
}

async function getRecentPosts(n = 3) {
  const posts = await getAllPosts();
  return posts.slice(0, n);
}

async function getPostBySlug(slug) {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      meta: {
        title: data.title || 'Untitled',
        date: data.date || '',
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        published: data.published !== false
      },
      html: marked(content)
    };
  } catch {
    return null;
  }
}

module.exports = { getAllPosts, getRecentPosts, getPostBySlug };
