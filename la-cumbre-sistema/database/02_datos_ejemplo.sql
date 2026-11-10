-- LA CUMBRE · Datos de ejemplo (ejecútalo DESPUÉS de 01_schema.sql)
-- Precios, stock y pesos son inventados: cámbialos por los reales del propietario.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

INSERT INTO roles (nombre) VALUES ('usuario'), ('administrador'), ('desarrollador');

-- Claves de prueba: todas son 123456 (cámbialas antes de la defensa)
INSERT INTO usuarios (nombre, email, password_hash, telefono, pais, ciudad, id_rol) VALUES
('Carlos Pocoata (Desarrollador)', 'dev@lacumbre.com',     extensions.crypt('123456', extensions.gen_salt('bf')), '70000001', 'Bolivia', 'La Paz',     (SELECT id_rol FROM roles WHERE nombre='desarrollador')),
('Administrador La Cumbre',        'admin@lacumbre.com',   extensions.crypt('123456', extensions.gen_salt('bf')), '70000002', 'Bolivia', 'La Paz',     (SELECT id_rol FROM roles WHERE nombre='administrador')),
('Cliente Mayorista Cochabamba',   'cliente@lacumbre.com', extensions.crypt('123456', extensions.gen_salt('bf')), '70000003', 'Bolivia', 'Cochabamba', (SELECT id_rol FROM roles WHERE nombre='usuario')),
('Cliente Exterior Lima',          'lima@lacumbre.com',    extensions.crypt('123456', extensions.gen_salt('bf')), '70000004', 'Perú',    'Lima',       (SELECT id_rol FROM roles WHERE nombre='usuario'));

INSERT INTO productos (nombre, categoria, precio, stock, imagen) VALUES
('Aladino',      'Decoración',  85.00, 120, 'aladino.jpg'),
('Cáliz',        'Religioso',  150.00,  60, 'caliz.jpg'),
('Vinero',       'Utensilio',  120.00,  80, 'vinero.jpg'),
('Portavelas',   'Decoración',  60.00, 200, 'portavelas.jpg'),
('Candelabro',   'Decoración', 180.00,  45, 'candelabro.jpg'),
('Reconocimiento','Premios',   200.00,  30, 'reconocimiento.jpg'),
('Pergamino',    'Decoración',  90.00,  70, 'pergamino.jpg');

INSERT INTO metales (nombre, stock_kg, costo_kg) VALUES
('Estaño', 250.00, 220.00), ('Plata', 8.50, 6500.00), ('Antimonio', 40.00, 150.00), ('Plomo', 120.00, 35.00), ('Cobre', 60.00, 80.00);

-- Un lote de producción con su consumo de metal
INSERT INTO lotes_produccion (id_producto, cantidad, estado) VALUES (1, 50, 'En proceso');
INSERT INTO consumo_metal (id_metal, id_lote, kg_usados) VALUES (1, 1, 22.50), (3, 1, 1.20);

-- Un pedido de ejemplo del cliente de Cochabamba (12 aladinos)
INSERT INTO pedidos (id_usuario, estado, total) VALUES (3, 'En producción', 1020.00);
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unit) VALUES (1, 1, 12, 85.00);
