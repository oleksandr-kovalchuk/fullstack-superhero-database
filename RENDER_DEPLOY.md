# Деплой на Render

Цей документ описує як задеплоїти проект Superhero Database на Render з мінімальними змінами.

## 🚀 Швидкий деплой

### Варіант 1: Автоматичний деплой через render.yaml

1. **Підготуйте репозиторій:**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Створіть новий проект на Render:**
   - Перейдіть на [render.com](https://render.com)
   - Натисніть "New +" → "Blueprint"
   - Підключіть ваш GitHub репозиторій
   - Render автоматично знайде `render.yaml` і створить всі сервіси

### Варіант 2: Ручний деплой

#### 1. Створення PostgreSQL бази даних

1. На Render Dashboard натисніть "New +" → "PostgreSQL"
2. Налаштування:
   - **Name**: `superhero-database`
   - **Database**: `superhero_db`
   - **User**: `superhero_user`
   - **Plan**: Free (або Starter для production)
3. Збережіть connection string

#### 2. Деплой Backend API

1. Натисніть "New +" → "Web Service"
2. Підключіть GitHub репозиторій
3. Налаштування:
   - **Name**: `superhero-backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd backend
     npm ci
     npx prisma generate
     npm run build
     ```
   - **Start Command**:
     ```bash
     cd backend
     npx prisma db push --accept-data-loss
     npm start
     ```
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: (connection string з PostgreSQL)
     - `PORT`: `10000`

#### 3. Деплой Frontend

1. Натисніть "New +" → "Static Site"
2. Підключіть GitHub репозиторій
3. Налаштування:
   - **Name**: `superhero-frontend`
   - **Build Command**:
     ```bash
     cd frontend
     npm ci
     npm run build
     ```
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

## 🔧 Налаштування

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=10000
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Важливі моменти

1. **База даних**: Render автоматично створює connection string для PostgreSQL
2. **Порт**: Render використовує порт 10000 для web сервісів
3. **CORS**: Переконайтеся що backend налаштований для прийому запитів з frontend домену
4. **Файли**: Uploads будуть зберігатися в тимчасовій файловій системі (для production використовуйте S3)

## 📁 Структура файлів для деплою

```
├── render.yaml              # Автоматична конфігурація Render
├── backend/
│   ├── env.example          # Приклад environment змінних
│   ├── package.json         # З postinstall script
│   └── ...
├── frontend/
│   ├── env.example          # Приклад environment змінних
│   ├── nginx.conf           # Оптимізований для production
│   └── ...
└── RENDER_DEPLOY.md         # Цей файл
```

## 🐛 Troubleshooting

### Часті проблеми:

1. **Build fails**: Перевірте що всі залежності в package.json
2. **Database connection**: Переконайтеся що DATABASE_URL правильний
3. **CORS errors**: Додайте frontend URL до CORS налаштувань backend
4. **Static files**: Перевірте що Publish Directory вказує на правильну папку

### Логи:
- Backend логи: Render Dashboard → ваш сервіс → Logs
- Frontend логи: Render Dashboard → ваш сервіс → Logs

## 🔄 Оновлення

Після внесення змін:
```bash
git add .
git commit -m "Update application"
git push origin main
```

Render автоматично перебудує і перезапустить сервіси.

## 💰 Вартість

- **Free план**: 750 годин/місяць, сервіси "засинають" після 15 хвилин неактивності
- **Starter план**: $7/місяць за сервіс, завжди активний
- **PostgreSQL**: Free план має обмеження, Starter $7/місяць

## 🎯 Результат

Після успішного деплою ви отримаєте:
- **Frontend**: `https://superhero-frontend.onrender.com`
- **Backend API**: `https://superhero-backend.onrender.com`
- **Database**: Автоматично налаштована PostgreSQL

---

**Готово! Ваш Superhero Database тепер працює на Render! 🦸‍♂️**
