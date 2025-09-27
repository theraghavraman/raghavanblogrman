async function fetchPosts() {
  const response = await fetch('posts.json');
  const posts = await response.json();
  return posts;
}

// Render posts list on index.html
async function renderPostsList() {
  const posts = await fetchPosts();
  const ul = document.getElementById('post-list');
  if (!ul) return; // Not on index.html

  ul.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2><a href="post.html?id=${post.id}">${post.title}</a></h2>
      <div class="meta">By ${post.author} on ${new Date(post.date).toLocaleDateString()}</div>
      <p>${post.summary}</p>
    `;
    ul.appendChild(li);
  });
}

// Render a single post on post.html
async function renderSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  if (!postId) return;

  const posts = await fetchPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) {
    document.getElementById('post-title').textContent = 'Post Not Found';
    document.getElementById('post-meta').textContent = '';
    document.getElementById('post-content').innerHTML = '<p>Sorry, the post you are looking for does not exist.</p>';
    return;
  }

  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-meta').textContent = `By ${post.author} on ${new Date(post.date).toLocaleDateString()}`;
  document.getElementById('post-content').innerHTML = post.content;
}

// Detect page and render
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('post-list')) {
    renderPostsList();
  } else if (document.getElementById('post-title')) {
    renderSinglePost();
  }
});
