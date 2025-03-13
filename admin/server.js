require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// 設置 EJS 作為模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中間件
app.use(express.static(path.join(__dirname, 'public')));
// 添加對網站根目錄的靜態文件訪問
app.use(express.static(path.join(__dirname, '..')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // 在生產環境中設為 true
    maxAge: 24 * 60 * 60 * 1000 // 24小時
  }
}));

// 確保數據目錄存在
const dataDir = path.join(__dirname, 'data');
const blogsDir = path.join(__dirname, '..', 'data', 'blogs');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir, { recursive: true });
}

// 設置文件上傳
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'image', 'blog');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// 檢查用戶是否已登入
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
};

// 路由 - 登入頁面
app.get('/admin/login', (req, res) => {
  res.render('login', { error: null });
});

// 路由 - 登入處理
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME) {
    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (match) {
      req.session.isAuthenticated = true;
      return res.redirect('/admin/dashboard');
    }
  }
  
  res.render('login', { error: '用戶名或密碼不正確' });
});

// 路由 - 儀表板
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
  // 讀取所有 blog 文章和分類
  const blogPosts = getBlogPosts();
  const categories = getCategories();
  const filter = req.query.filter || 'latest';
  
  // 根據過濾條件排序文章
  let filteredPosts = [...blogPosts];
  
  if (filter === 'latest') {
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (filter === 'oldest') {
    filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (categories.find(cat => cat.id === filter)) {
    // 過濾特定分類的文章
    filteredPosts = filteredPosts.filter(post => post.categoryId === filter);
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  res.render('dashboard', { 
    blogPosts: filteredPosts, 
    categories: categories,
    currentFilter: filter
  });
});

// 路由 - 分類管理頁面
app.get('/admin/categories', isAuthenticated, (req, res) => {
  const categories = getCategories();
  res.render('categories', { categories });
});

// 路由 - 添加分類
app.post('/admin/add-category', isAuthenticated, (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.redirect('/admin/categories');
  }
  
  const categories = getCategories();
  const newCategory = {
    id: Date.now().toString(),
    name: name.trim()
  };
  
  categories.push(newCategory);
  saveCategories(categories);
  
  res.redirect('/admin/categories');
});

// 路由 - 刪除分類
app.post('/admin/delete-category/:id', isAuthenticated, (req, res) => {
  const categoryId = req.params.id;
  let categories = getCategories();
  
  // 檢查是否有文章使用此分類
  const blogPosts = getBlogPosts();
  const hasPostsWithCategory = blogPosts.some(post => post.categoryId === categoryId);
  
  if (hasPostsWithCategory) {
    // 如果有文章使用此分類，將這些文章的分類設為空
    blogPosts.forEach(post => {
      if (post.categoryId === categoryId) {
        post.categoryId = '';
      }
    });
    saveBlogPosts(blogPosts);
  }
  
  // 刪除分類
  categories = categories.filter(category => category.id !== categoryId);
  saveCategories(categories);
  
  res.redirect('/admin/categories');
});

// 路由 - 新增文章頁面
app.get('/admin/new-post', isAuthenticated, (req, res) => {
  const categories = getCategories();
  res.render('edit-post', { post: null, categories });
});

// 路由 - 編輯文章頁面
app.get('/admin/edit-post/:id', isAuthenticated, (req, res) => {
  const postId = req.params.id;
  const blogPosts = getBlogPosts();
  const post = blogPosts.find(post => post.id === postId);
  const categories = getCategories();
  
  if (!post) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('edit-post', { post, categories });
});

// 路由 - 保存文章
app.post('/admin/save-post', isAuthenticated, upload.single('image'), (req, res) => {
  const { id, title, date, content, categoryId } = req.body;
  const imagePath = req.file ? `/image/blog/${req.file.filename}` : (req.body.existingImage || '');
  
  let blogPosts = getBlogPosts();
  
  if (id) {
    // 更新現有文章
    const index = blogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      blogPosts[index] = { 
        ...blogPosts[index], 
        title, 
        date, 
        content, 
        image: imagePath,
        categoryId: categoryId || ''
      };
    }
  } else {
    // 創建新文章
    const newId = Date.now().toString();
    blogPosts.push({
      id: newId,
      title,
      date,
      content,
      image: imagePath,
      categoryId: categoryId || ''
    });
  }
  
  saveBlogPosts(blogPosts);
  updateWhatsNewHtml(blogPosts);
  
  res.redirect('/admin/dashboard');
});

// 路由 - 刪除文章
app.post('/admin/delete-post/:id', isAuthenticated, (req, res) => {
  const postId = req.params.id;
  let blogPosts = getBlogPosts();
  
  blogPosts = blogPosts.filter(post => post.id !== postId);
  saveBlogPosts(blogPosts);
  updateWhatsNewHtml(blogPosts);
  
  res.redirect('/admin/dashboard');
});

// 路由 - 登出
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// 輔助函數 - 獲取所有 blog 文章
function getBlogPosts() {
  const filePath = path.join(dataDir, 'blog-posts.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// 輔助函數 - 保存所有 blog 文章
function saveBlogPosts(blogPosts) {
  const filePath = path.join(dataDir, 'blog-posts.json');
  fs.writeFileSync(filePath, JSON.stringify(blogPosts, null, 2), 'utf8');
}

// 輔助函數 - 獲取所有分類
function getCategories() {
  const filePath = path.join(dataDir, 'categories.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// 輔助函數 - 保存所有分類
function saveCategories(categories) {
  const filePath = path.join(dataDir, 'categories.json');
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf8');
}

// 輔助函數 - 更新 whats-new.html 文件
function updateWhatsNewHtml(blogPosts) {
  const whatsNewPath = path.join(__dirname, '..', 'whats-new.html');
  
  if (!fs.existsSync(whatsNewPath)) {
    console.error('whats-new.html 文件不存在');
    return;
  }
  
  // 讀取現有的 HTML 文件
  let html = fs.readFileSync(whatsNewPath, 'utf8');
  
  // 找到 blog-container 的開始和結束位置
  const startMarker = '<div class="blog-container">';
  const endMarker = '</div><!-- End of blog-container -->';
  
  const startIndex = html.indexOf(startMarker);
  let endIndex = html.indexOf(endMarker);
  
  if (startIndex === -1) {
    console.error('無法在 whats-new.html 中找到 blog-container 開始標記');
    return;
  }
  
  if (endIndex === -1) {
    // 如果找不到結束標記，嘗試找到下一個 div 結束標記
    endIndex = html.indexOf('</div>', startIndex + startMarker.length);
    if (endIndex === -1) {
      console.error('無法在 whats-new.html 中找到合適的結束位置');
      return;
    }
    endIndex += 6; // '</div>'.length
  } else {
    endIndex += endMarker.length;
  }
  
  // 生成新的 blog HTML 內容
  let newBlogContent = startMarker + '\n            <!-- 移除了 What\'s New 標題 -->\n            ';
  
  // 按日期排序 blog 文章（最新的在前）
  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 生成每篇 blog 文章的 HTML
  blogPosts.forEach(post => {
    newBlogContent += `
            <!-- Blog post -->
            <article class="blog-post">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">${post.date}</div>
                <div class="post-content-wrapper">
                    <div class="post-image">
                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                    </div>
                    <div class="post-content">
                        ${post.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('\n                        ')}
                    </div>
                </div>
            </article>
            `;
  });
  
  newBlogContent += endMarker;
  
  // 替換 HTML 文件中的 blog 內容
  const newHtml = html.substring(0, startIndex) + newBlogContent + html.substring(endIndex);
  
  // 寫入更新後的 HTML 文件
  fs.writeFileSync(whatsNewPath, newHtml, 'utf8');
}

// 啟動服務器
app.listen(PORT, () => {
  console.log(`Blog 管理後台運行在 http://localhost:${PORT}/admin/login`);
});
