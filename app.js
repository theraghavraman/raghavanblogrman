// Utilities
const $ = (s, sc=document) => sc.querySelector(s);
const $$ = (s, sc=document) => [...sc.querySelectorAll(s)];
const fmtDate = iso => new Date(iso).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'});
const estReading = txt => `${Math.max(1, Math.round(txt.split(/\s+/).length / 220))} min read`;

// Theme
const themeBtn = $('#themeToggle');
const applyTheme = t => document.documentElement.dataset.theme = t;
const getTheme = () => localStorage.getItem('theme') || 'auto';
const setTheme = t => (localStorage.setItem('theme', t), applyTheme(t));
if (themeBtn){
  applyTheme(getTheme());
  themeBtn.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : getTheme() === 'light' ? 'auto' : 'dark';
    setTheme(next);
    themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
  });
}

// Footer year
$$('#year').forEach(n => n.textContent = new Date().getFullYear());

// Intersection reveal
const reveal = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('revealed')), {threshold: .08});

// Load posts
async function loadPosts(){
  const res = await fetch('posts.json');
  const posts = await res.json();
  return posts.sort((a,b) => new Date(b.date) - new Date(a.date));
}

// Index behaviors
async function hydrateIndex(){
  const grid = $('#grid'); if (!grid) return;
  const tpl = $('#card-tpl'); const tagCloud = $('#tagCloud');
  const posts = await loadPosts();

  // Render cards
  const frag = document.createDocumentFragment();
  posts.forEach(p => {
    const node = tpl.content.cloneNode(true);
    const art = node.querySelector('.card');
    const link = node.querySelector('.card-media');
    const img = node.querySelector('img');
    const aTitle = node.querySelector('.card-title a');
    const time = node.querySelector('time');
    const read = node.querySelector('.reading');
    const excerpt = node.querySelector('.card-excerpt');
    const tags = node.querySelector('.card-tags');

    link.href = `post.html?slug=${encodeURIComponent(p.slug)}`;
    aTitle.href = link.href;
    aTitle.textContent = p.title;
    time.dateTime = p.date;
    time.textContent = fmtDate(p.date);
    excerpt.textContent = p.excerpt;
    read.textContent = estReading(p.wordcount ? 'x'.repeat(p.wordcount) : p.excerpt);
    img.src = p.cover; img.alt = p.coverAlt || p.title;
    art.dataset.tags = p.tags.join(',');
    p.tags.forEach(t=>{
      const tag = document.createElement('a');
      tag.href = `#tag=${encodeURIComponent(t)}`;
      tag.textContent = `#${t}`;
      tags.appendChild(tag);
    });
    frag.appendChild(node);
  });
  grid.appendChild(frag);
  $$('.card', grid).forEach(c => reveal.observe(c));

  // Tag cloud
  const counts = posts.flatMap(p=>p.tags).reduce((m,t)=>(m[t]=(m[t]||0)+1,m),{});
  Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([t,c])=>{
    const b = document.createElement('button');
    b.textContent = `${t} (${c})`;
    b.dataset.tag = t;
    b.setAttribute('role','listitem');
    b.addEventListener('click', ()=>{
      const on = b.getAttribute('aria-pressed') === 'true';
      $$('#tagCloud button').forEach(x=>x.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed', String(!on));
      filter({ tag: !on ? t : null });
    });
    tagCloud.appendChild(b);
  });

  // Search
  const q = $('#q');
  q?.addEventListener('input', e => filter({ q: e.target.value.trim().toLowerCase() }));

  function filter({ q=null, tag=null }){
    $$('.card', grid).forEach(card=>{
      const text = card.innerText.toLowerCase();
      const tags = card.dataset.tags.toLowerCase();
      const matchesQ = q ? text.includes(q) : true;
      const matchesTag = tag ? tags.split(',').includes(tag.toLowerCase()) : true;
      card.style.display = (matchesQ && matchesTag) ? '' : 'none';
    });
  }
}

// Post behaviors
async function hydratePost(){
  if (document.documentElement.dataset.page !== 'post') return;
  const qs = new URLSearchParams(location.search);
  const slug = qs.get('slug');
  const posts = await loadPosts();
  const post = posts.find(p=>p.slug===slug) || posts[0];

  $('#docTitle').textContent = `${post.title} • Athena`;
  $('#postTitle').textContent = post.title;
  const t = $('#postDate'); t.dateTime = post.date; t.textContent = fmtDate(post.date);
  $('#postReading').textContent = estReading('x'.repeat(post.wordcount || 600));
  $('#postTags').textContent = post.tags.map(t=>`#${t}`).join(' ');
  const img = $('#postCover'); img.src = post.cover; img.alt = post.coverAlt || post.title;
  $('#postCaption').textContent = post.caption || '';

  // Render body (HTML trusted if authored)
  $('#postBody').innerHTML = post.html;

  // Build TOC
  const toc = $('#toc');
  const headings = $$('.prose h2, .prose h3');
  headings.forEach(h=>{
    const id = h.id || h.textContent.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'');
    h.id = id;
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent;
    a.style.marginLeft = h.tagName==='H3' ? '.8rem' : '0';
    toc.appendChild(a);
  });

  // Active TOC
  const spy = new IntersectionObserver(es=>{
    es.forEach(e=>{
      if (e.isIntersecting){
        $$('#toc a').forEach(a=>a.removeAttribute('aria-current'));
        const cur = $(`#toc a[href="#${e.target.id}"]`);
        cur?.setAttribute('aria-current','true');
      }
    });
  },{ rootMargin:'-40% 0px -55% 0px', threshold:0 });
  headings.forEach(h=>spy.observe(h));

  // Reading progress
  const bar = $('#progressBar');
  const onScroll = ()=> {
    const el = $('.post');
    const top = el.getBoundingClientRect().top * -1;
    const height = el.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, top/height));
    bar.style.width =// Module: Utilities
export const $ = (s, sc=document) => sc.querySelector(s);
export const $$ = (s, sc=document) => [...sc.querySelectorAll(s)];
export const formatDate = iso => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
export const readingTime = txt => ${Math.max(1, Math.round(txt.split(/\s+/).length / 220))} min read;

// Module: Theme
export function ThemeModule() {
  const themeToggleButton = $('#themeToggle');
  const applyTheme = theme => document.documentElement.dataset.theme = theme;
  const getTheme = () => localStorage.getItem('theme') || 'auto';
  const setTheme = theme => { localStorage.setItem('theme', theme); applyTheme(theme); };

  function init() {
    if (!themeToggleButton) return;
    applyTheme(getTheme());
    themeToggleButton.addEventListener('click', () => {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
      setTheme(next);
      themeToggleButton.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }
  return { init };
}

// Module: Footer
export function FooterModule() {
  function fragment() {
    const frag = document.createDocumentFragment();
    $$('#year').forEach(node => node.textContent = new Date().getFullYear());
    return frag;
  }
  return { fragment };
}

// Module: Posts Data
export async function PostsModule() {
  async function getPosts() {
    const response = await fetch('posts.json');
    const posts = await response.json();
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return { getPosts };
}

// Module: Cards
export function CardsModule(template) {
  function createCard(post) {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.card');
    const link = node.querySelector('.card-media');
    const image = node.querySelector('img');
    const titleLink = node.querySelector('.card-title a');
    const time = node.querySelector('time');
    const reading = node.querySelector('.reading');
    const excerpt = node.querySelector('.card-excerpt');
    const tagsContainer = node.querySelector('.card-tags');

    link.href = post.html?slug=${encodeURIComponent(post.slug)};
    titleLink.href = link.href;
    titleLink.textContent = post.title;
    time.dateTime = post.date;
    time.textContent = formatDate(post.date);
    excerpt.textContent = post.excerpt;
    reading.textContent = readingTime(post.wordcount ? 'x'.repeat(post.wordcount) : post.excerpt);
    image.src = post.cover;
    image.alt = post.coverAlt || post.title;
    card.dataset.tags = post.tags.join(',');

    post.tags.forEach(tagName => {
      const tag = document.createElement('a');
      tag.href = #tag=${encodeURIComponent(tagName)};
      tag.textContent = #${tagName};
      tagsContainer.appendChild(tag);
    });

    return node;
  }

  function fragment(posts) {
    const frag = document.createDocumentFragment();
    posts.forEach(post => frag.appendChild(createCard(post)));
    return frag;
  }
  return { fragment };
}

// Module: Tag Cloud
export function TagCloudModule() {
  function fragment(posts) {
    const tagCounts = posts.flatMap(p => p.tags).reduce((map, tag) => {
      map[tag] = (map[tag] || 0) + 1;
      return map;
    }, {});

    const frag = document.createDocumentFragment();
    Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
      const button = document.createElement('button');
      button.textContent = ${tag} (${count});
      button.dataset.tag = tag;
      button.setAttribute('role', 'listitem');
      frag.appendChild(button);
    });
    return frag;
  }

  function attachBehavior(container) {
    $$('#tagCloud button', container).forEach(button => {
      button.addEventListener('click', () => {
        const isActive = button.getAttribute('aria-pressed') === 'true';
        $$('#tagCloud button').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', String(!isActive));
        filterPosts({ tag: !isActive ? button.dataset.tag : null });
      });
    });
  }

  function filterPosts({ q = null, tag = null }) {
    $$('.card', $('#grid')).forEach(card => {
      const textContent = card.innerText.toLowerCase();
      const tags = card.dataset.tags.toLowerCase();
      const matchesQuery = q ? textContent.includes(q) : true;
      const matchesTag = tag ? tags.split(',').includes(tag.toLowerCase()) : true;
      card.style.display = (matchesQuery && matchesTag) ? '' : 'none';
    });
  }

  return { fragment, attachBehavior };
}

// Module: TOC
export function TOCModule() {
  function fragment(headings) {
    const frag = document.createDocumentFragment();
    headings.forEach(h => {
      const id = h.id || h.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      h.id = id;
      const a = document.createElement('a');
      a.href = #${id};
      a.textContent = h.textContent;
      a.style.marginLeft = h.tagName === 'H3' ? '.8rem' : '0';
      frag.appendChild(a);
    });
    return frag;
  }

  function observe(headings) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('#toc a').forEach(a => a.removeAttribute('aria-current'));
          const current = $(#toc a[href="#${entry.target.id}"]);
          current?.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    headings.forEach(h => spy.observe(h));
  }

  return { fragment, observe };
}

// Initialization
async function initIndex() {
  const grid = $('#grid');
  if (!grid) return;

  const template = $('#card-tpl');
  const tagCloud = $('#tagCloud');
  const postsModule = await PostsModule();
  const posts = await postsModule.getPosts();

  // Cards
  const cardsModule = CardsModule(template);
  grid.appendChild(cardsModule.fragment(posts));
  $$('.card', grid).forEach(card => new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add('revealed')), {threshold:0.08}).observe(card));

  // Tag Cloud
  const tagCloudModule = TagCloudModule();
  tagCloud.appendChild(tagCloudModule.fragment(posts));
  tagCloudModule.attachBehavior(tagCloud);

  // Search
  $('#q')?.addEventListener('input', e => {
    const value = e.target.value.trim().toLowerCase();
    $$('.card', grid).forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(value) ? '' : 'none';
    });
  });
}

async function initPost() {
  if (document.documentElement.dataset.page !== 'post') return;

  const qs = new URLSearchParams(location.search);
  const slug = qs.get('slug');
  const postsModule = await PostsModule();
  const posts = await postsModule.getPosts();
  const post = posts.find(p => p.slug === slug) || posts[0];

  $('#docTitle').textContent = ${post.title} • Athena;
  $('#postTitle').textContent = post.title;
  const dateNode = $('#postDate');
  dateNode.dateTime = post.date;
  dateNode.textContent = formatDate(post.date);
  $('#postReading').textContent = readingTime('x'.repeat(post.wordcount || 600));
  $('#postTags').textContent = post.tags.map(tag => #${tag}).join(' ');
  const image = $('#postCover');
  image.src = post.cover;
  image.alt = post.coverAlt || post.title;
  $('#postCaption').textContent = post.caption || '';
  $('#postBody').innerHTML = post.html;

  const headings = $$('.prose h2, .prose h3');
  const tocModule = TOCModule();
  $('#toc').appendChild(tocModule.fragment(headings));
  tocModule.observe(headings);

  document.addEventListener('scroll', () => {
    const postEl = $('.post');
    const top = -postEl.getBoundingClientRect().top;
    const height = postEl.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, top / height));
    $('#progressBar').style.width = ${progress * 100}%;
  }, { passive: true });
}

ThemeModule().init();
FooterModule().fragment();
initIndex();
initPost(); (p*100)+'%';
  };
  document.addEventListener('scroll', onScroll, { passive:true });
}

hydrateIndex();
hydratePost();
