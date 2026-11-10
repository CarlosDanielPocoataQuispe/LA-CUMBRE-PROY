-- YA APLICADO en tu Supabase. Respaldo del esquema (no hace falta volver a ejecutarlo).
CREATE TABLE roles (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(20) UNIQUE NOT NULL            -- usuario, administrador, desarrollador
);
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,                  -- la clave se guarda cifrada, nunca en texto
  telefono VARCHAR(20),
  pais VARCHAR(50) DEFAULT 'Bolivia',
  ciudad VARCHAR(50),
  id_rol INT NOT NULL REFERENCES roles(id_rol),
  creado TIMESTAMP DEFAULT NOW()
);
CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  imagen VARCHAR(100) DEFAULT 'sin-imagen.svg'  -- nombre del archivo dentro de public/img
);
CREATE TABLE pedidos (
  id_pedido SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
  fecha TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) NOT NULL DEFAULT 'Registrado'
    CHECK (estado IN ('Registrado','Confirmado','En producción','Listo','Enviado','Entregado','Cancelado')),
  total NUMERIC(12,2) NOT NULL DEFAULT 0
);
CREATE TABLE detalle_pedido (
  id_detalle SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_producto INT NOT NULL REFERENCES productos(id_producto),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  precio_unit NUMERIC(10,2) NOT NULL
);
CREATE TABLE envios (
  id_envio SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL REFERENCES pedidos(id_pedido),
  transportista VARCHAR(80),
  cod_seguimiento VARCHAR(40),
  fecha_despacho TIMESTAMP
);
CREATE TABLE metales (
  id_metal SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  stock_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  costo_kg NUMERIC(10,2) NOT NULL DEFAULT 0
);
CREATE TABLE lotes_produccion (
  id_lote SERIAL PRIMARY KEY,
  id_producto INT NOT NULL REFERENCES productos(id_producto),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  estado VARCHAR(20) DEFAULT 'En proceso'
);
CREATE TABLE consumo_metal (
  id_consumo SERIAL PRIMARY KEY,
  id_metal INT NOT NULL REFERENCES metales(id_metal),
  id_lote INT NOT NULL REFERENCES lotes_produccion(id_lote) ON DELETE CASCADE,
  kg_usados NUMERIC(10,2) NOT NULL CHECK (kg_usados > 0)
);

-- SEGURIDAD EN SUPABASE: activa RLS para que la API pública NO pueda leer estas tablas.
-- La aplicación Node entra por la conexión directa de Postgres, que no se ve afectada.
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE metales ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_produccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumo_metal ENABLE ROW LEVEL SECURITY;
