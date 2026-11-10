// Para probar en tu computadora: npm run dev
const app = require('./app');
const puerto = process.env.PORT || 3000;
app.listen(puerto, () => console.log('La Cumbre en http://localhost:' + puerto));
