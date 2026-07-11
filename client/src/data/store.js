// Central localStorage data store — replaces backend API

const KEYS = {
  USERS:   'grid_users',
  BLOGS:   'grid_blog_posts',
  THREADS: 'grid_forum_threads',
  REPLIES: 'grid_forum_replies',
}

/* ─── Seed data ─────────────────────────────────────────────────────── */
const SEED_BLOGS = [
  { id:1, title:'How I fine-tuned a 7B LLM on a single A100 — and what I learned', category:'LLMs', author:'rahul_gupta', read_time:'14 min', excerpt:'Gradient checkpointing, 4-bit quantisation, and LoRA made this possible. Here is the full setup, the mistakes I made, and the metrics that actually mattered.', content:'<p>Fine-tuning large language models has become significantly more accessible with recent advances in quantization and parameter-efficient training methods. In this article, I walk through my experience fine-tuning a 7B parameter model on a single A100 GPU.</p><h2>Setup</h2><p>The key tools in my stack were: bitsandbytes for 4-bit quantization, PEFT for LoRA adapters, and gradient checkpointing to reduce memory usage. With these three techniques combined, I was able to fit training into ~22GB of VRAM.</p><h2>What actually worked</h2><p>LoRA rank 16 with alpha 32 gave the best quality-to-compute tradeoff. Lower rank degraded output quality noticeably, while higher rank offered diminishing returns. Gradient accumulation steps of 4 helped stabilize training with a small batch size.</p><h2>Lessons learned</h2><p>Validation loss is a necessary but not sufficient metric. Always eval on your actual downstream task. I saw cases where val loss plateaued but task performance kept improving for another 500 steps.</p>', created_at:'2025-06-28T00:00:00Z', views:2840, likes:142, tags:['LLMs','fine-tuning','LoRA'] },
  { id:2, title:'Flash Attention explained from first principles', category:'Research Papers', author:'aryan_sharma', read_time:'18 min', excerpt:'A walkthrough of the Flash Attention paper — why naive softmax attention is memory-bound, how tiling fixes it, and what the benchmarks actually mean for your training runs.', content:'<p>Standard attention computes an N×N matrix for sequence length N. Flash Attention rewrites the algorithm to avoid materializing this full matrix, using tiling to stay within SRAM and dramatically reducing HBM bandwidth requirements.</p><h2>Why naive attention is slow</h2><p>The bottleneck is not FLOPs — it is memory bandwidth. Reading and writing the N×N attention matrix to HBM is the dominant cost for most sequence lengths.</p><h2>How tiling fixes it</h2><p>Flash Attention splits Q, K, V into blocks that fit in SRAM, computes attention in tiles, and accumulates the output without ever writing the full attention matrix. This reduces HBM reads and writes from O(N²) to O(N).</p>', created_at:'2025-06-24T00:00:00Z', views:1920, likes:98, tags:['transformers','attention','research'] },
  { id:3, title:'MLOps patterns that saved us in production', category:'MLOps', author:'priya_nair', read_time:'11 min', excerpt:'Feature stores, shadow deployment, and canary model releases. Three patterns we did not take seriously until they would have saved us a lot of pain.', content:'<p>After running ML systems in production for three years, these three patterns have prevented more incidents than any other investment.</p><h2>Feature stores</h2><p>Training-serving skew killed our first production model. A feature store with versioned feature definitions ensures your serving features match exactly what the model was trained on.</p><h2>Shadow deployment</h2><p>Running a new model in shadow mode — logging its outputs without serving them — lets you compare behavior against the production model with zero user risk. We run every new model in shadow for at least a week.</p><h2>Canary releases</h2><p>Rolling out to 1% of traffic first catches distribution shift and regressions before they affect everyone. Pair this with automatic rollback triggers on your key business metrics.</p>', created_at:'2025-06-20T00:00:00Z', views:1640, likes:75, tags:['MLOps','production','deployment'] },
  { id:4, title:'Why your val loss is lying to you', category:'Training', author:'dev_malhotra', read_time:'9 min', excerpt:'Leakage, distribution shift, and the sneaky ways evaluation metrics can mislead you into shipping a broken model.', content:'<p>Val loss going down does not mean your model is getting better at your actual task. Here are the most common ways evaluation metrics mislead practitioners.</p><h2>Data leakage</h2><p>If any part of your validation set has been seen during training — even indirectly through preprocessing decisions made by looking at the full dataset — your val metrics are optimistic. Use time-based splits for temporal data.</p><h2>Distribution shift</h2><p>Your val set may not represent your deployment distribution. Always hold out a test set that is as close to production as possible and never look at it until you are ready to ship.</p>', created_at:'2025-06-17T00:00:00Z', views:3100, likes:189, tags:['training','evaluation','debugging'] },
  { id:5, title:'Diffusion models: a visual intuition for score matching', category:'Computer Vision', author:'sneha_patel', read_time:'20 min', excerpt:'Skip the math-heavy derivation. Here is a visual, intuition-first explanation of score matching and how it leads to the diffusion models everyone is building with.', content:'<p>Score matching is the theoretical foundation under diffusion models, but most introductions lead with SDEs and Fokker-Planck equations. This article builds the intuition first.</p><h2>What is a score?</h2><p>The score of a distribution is the gradient of its log probability density: ∇_x log p(x). It points in the direction of increasing probability — toward the modes of the distribution.</p><h2>The denoising connection</h2><p>A denoising network trained to remove Gaussian noise at various scales is implicitly learning the score function at those noise levels. This is the core insight that connects denoising autoencoders to generative modeling.</p>', created_at:'2025-06-12T00:00:00Z', views:2200, likes:134, tags:['diffusion','generative','computer-vision'] },
  { id:6, title:'RLHF from scratch — what the papers do not tell you', category:'RL', author:'vikram_singh', read_time:'16 min', excerpt:'Reward modelling, PPO instability, and the alignment tax. A practitioner\'s honest account of implementing RLHF.', content:'<p>Implementing RLHF end-to-end is significantly harder than the papers suggest. Here is what the landmark papers gloss over.</p><h2>Reward model quality is everything</h2><p>Your RLHF is only as good as your reward model. Weak preferences data, unclear labeling instructions, or imbalanced examples will teach the RL stage to game a broken reward signal.</p><h2>PPO instability</h2><p>PPO in the LLM setting requires careful hyperparameter tuning. The KL penalty coefficient, clip range, and value function coefficient all interact. Start with small KL penalties and increase slowly.</p>', created_at:'2025-06-08T00:00:00Z', views:1780, likes:91, tags:['RL','RLHF','alignment'] },
]

const SEED_THREADS = [
  { id:1, title:'What actually works for reducing hallucinations in production LLMs?', category:'LLMs', author:'rahul_gupta', replies:64, views:2840, likes:142, pinned:true, hot:true, created_at:new Date(Date.now()-7200000).toISOString(), excerpt:'We tried RAG, fine-tuning, and CoT prompting. Here is what actually moved the needle and what is still snake oil...' },
  { id:2, title:'Flash Attention 3 vs 2 — do you actually see the speedup in practice?', category:'Training', author:'aryan_sharma', replies:49, views:1920, likes:98, pinned:false, hot:true, created_at:new Date(Date.now()-18000000).toISOString(), excerpt:'Benchmarks look great in the paper but I am not seeing the same numbers on my H100s. Sharing my profiling results...' },
  { id:3, title:'Weekly: What paper are you reading this week?', category:'Research Papers', author:'dev_malhotra', replies:183, views:5200, likes:341, pinned:true, hot:false, created_at:new Date(Date.now()-86400000).toISOString(), excerpt:'Share the paper, your one-line take on why it matters, and any reproduction attempts...' },
  { id:4, title:'LoRA vs full fine-tuning — when does it actually matter?', category:'Fine-tuning', author:'priya_nair', replies:72, views:3400, likes:189, pinned:false, hot:true, created_at:new Date(Date.now()-86400000).toISOString(), excerpt:'After running dozens of experiments, my conclusion surprised me. The answer depends heavily on task type...' },
  { id:5, title:'Best resources for learning RL from scratch in 2025?', category:'RL', author:'vikram_singh', replies:55, views:2100, likes:127, pinned:false, hot:false, created_at:new Date(Date.now()-172800000).toISOString(), excerpt:'The landscape has changed a lot. Here is what I would recommend to someone starting today...' },
  { id:6, title:'Diffusion models for tabular data — is anyone actually doing this?', category:'Computer Vision', author:'sneha_patel', replies:31, views:1280, likes:67, pinned:false, hot:false, created_at:new Date(Date.now()-259200000).toISOString(), excerpt:'Saw a few papers but very little production use. Curious if anyone has tried this seriously...' },
  { id:7, title:'How do you handle dataset versioning in your ML pipelines?', category:'MLOps', author:'ananya_k', replies:44, views:1650, likes:95, pinned:false, hot:false, created_at:new Date(Date.now()-345600000).toISOString(), excerpt:'DVC, LakeFS, or something custom? Sharing our setup and what we would do differently if starting over...' },
]

/* ─── Helpers ────────────────────────────────────────────────────────── */
function get(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
    if (seed) { localStorage.setItem(key, JSON.stringify(seed)); return seed }
    return []
  } catch { return seed || [] }
}
function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}
function nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1 }

/* ─── Users ──────────────────────────────────────────────────────────── */
export function getUsers() { return get(KEYS.USERS, []) }
export function saveUsers(u) { save(KEYS.USERS, u) }

export function registerUser(username, email, password, role = 'Developer') {
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error('Email already registered')
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error('Username already taken')
  const user = {
    id: nextId(users), username, email, password,
    role, bio: '', reputation: 0, avatar_url: '', avatar_color: '',
    skills: [], location: '', github_url: '', twitter_url: '',
    linkedin_url: '', website_url: '',
    created_at: new Date().toISOString(),
  }
  users.push(user)
  saveUsers(users)
  return user
}

export function loginUser(email, password) {
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) throw new Error('No account found with that email')
  if (user.password !== password) throw new Error('Incorrect password')
  return user
}

export function updateUser(id, updates) {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...updates }
  saveUsers(users)
  return users[idx]
}

export function getUserByUsername(username) {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

/* ─── Blog ───────────────────────────────────────────────────────────── */
export function getBlogPosts() { return get(KEYS.BLOGS, SEED_BLOGS) }

export function getBlogPost(id) {
  return getBlogPosts().find(p => String(p.id) === String(id)) || null
}

export function createBlogPost(post) {
  const posts = getBlogPosts()
  const newPost = { ...post, id: nextId(posts), views: 0, likes: 0, created_at: new Date().toISOString() }
  posts.unshift(newPost)
  save(KEYS.BLOGS, posts)
  return newPost
}

export function likeBlogPost(id) {
  const posts = getBlogPosts()
  const idx = posts.findIndex(p => String(p.id) === String(id))
  if (idx !== -1) { posts[idx].likes = (posts[idx].likes || 0) + 1; save(KEYS.BLOGS, posts) }
  return posts[idx]?.likes || 0
}

/* ─── Forum ──────────────────────────────────────────────────────────── */
export function getThreads() { return get(KEYS.THREADS, SEED_THREADS) }

export function getThread(id) {
  return getThreads().find(t => String(t.id) === String(id)) || null
}

export function createThread(thread) {
  const threads = getThreads()
  const newThread = { ...thread, id: nextId(threads), replies: 0, views: 0, likes: 0, pinned: false, hot: false, created_at: new Date().toISOString() }
  threads.unshift(newThread)
  save(KEYS.THREADS, threads)
  return newThread
}

export function upvoteThread(id) {
  const threads = getThreads()
  const idx = threads.findIndex(t => String(t.id) === String(id))
  if (idx !== -1) { threads[idx].likes = (threads[idx].likes || 0) + 1; save(KEYS.THREADS, threads) }
}

/* ─── Replies ────────────────────────────────────────────────────────── */
export function getReplies(threadId) {
  return get(KEYS.REPLIES, []).filter(r => String(r.thread_id) === String(threadId))
}

export function createReply(threadId, content, authorUsername, parentId = null) {
  const all = get(KEYS.REPLIES, [])
  const reply = {
    id: nextId(all), thread_id: Number(threadId), parent_id: parentId || null,
    author: authorUsername, content, likes: 0, dislikes: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }
  all.push(reply)
  save(KEYS.REPLIES, all)
  // bump reply count on thread
  const threads = getThreads()
  const idx = threads.findIndex(t => String(t.id) === String(threadId))
  if (idx !== -1) { threads[idx].replies = (threads[idx].replies || 0) + 1; save(KEYS.THREADS, threads) }
  return reply
}

/* ─── Dashboard / Stats ──────────────────────────────────────────────── */
export function getCommunityStats() {
  return { members: '12K+', projects: '900+', discussions: String(getThreads().length), events: '4+' }
}

export function getUserStats(username) {
  const posts   = getBlogPosts().filter(p => p.author === username).length
  const replies = get(KEYS.REPLIES, []).filter(r => r.author === username).length
  const user    = getUserByUsername(username)
  return { posts: posts + replies, projects: 0, events: 0, reputation: user?.reputation || 0 }
}
