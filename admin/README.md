# Shanimalism Blog 管理後台

這是一個簡單的 blog 管理後台，專為 Shanimalism 網站設計，只有您可以登入並管理 blog 內容。

## 功能

- 安全的登入系統，只有您知道密碼
- 新增、編輯和刪除 blog 文章
- 上傳圖片並與文章關聯
- 自動更新 whats-new.html 頁面的 blog 內容

## 登入信息

- 用戶名: admin
- 密碼: shanimalism2025

## 啟動後台

```bash
cd admin
node server.js
```

後台將在 http://localhost:3000/admin/login 運行

## 安全注意事項

- 請勿將登入信息分享給他人
- 定期更改密碼以確保安全
- 在生產環境中，建議使用 HTTPS 來保護數據傳輸
