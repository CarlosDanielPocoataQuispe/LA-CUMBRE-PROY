# La Cumbre - Sistema web (Node.js + Express + EJS + PostgreSQL/Supabase)

Estructura MVC: routes -> controllers -> models -> base de datos; las vistas están en views/.
Variables necesarias (en Vercel: Settings > Environment Variables; en tu PC: archivo .env):
- DATABASE_URL  (Supabase > Connect > Transaction pooler, con tu contraseña)
- JWT_SECRET    (una frase larga y secreta)
Prueba local: npm install && npm run dev  ->  http://localhost:3000
Imágenes: public/img/  (el nombre del archivo se escribe en el campo "imagen" del producto)
