
-- Insertar categorías
INSERT INTO categoria (nombre) VALUES
('Herramientas Manuales'),
('Herramientas Eléctricas'),
('Materiales de Construcción'),
('Equipos de Seguridad');

-- Insertar productos
INSERT INTO producto (nombre, descripcion, imagen, precio, stock, id_categoria) VALUES
('Martillo de acero', 'Martillo resistente para trabajos generales.', 'https://source.unsplash.com/400x300/?hammer', 8990, 50, 1),
('Destornillador Philips', 'Destornillador de cruz, mango ergonómico.', 'https://source.unsplash.com/400x300/?screwdriver', 2990, 100, 1),
('Taladro Bosch', 'Taladro percutor eléctrico de alta potencia.', 'https://source.unsplash.com/400x300/?drill', 45990, 20, 2),
('Lijadora Orbital', 'Lijadora ideal para acabados en madera.', 'https://source.unsplash.com/400x300/?sander', 34990, 15, 2),
('Cemento Portland', 'Bolsa de cemento de 25 kg.', 'https://source.unsplash.com/400x300/?cement', 5990, 80, 3),
('Ladrillo cerámico', 'Ladrillo para construcción de muros.', 'https://source.unsplash.com/400x300/?bricks', 290, 1000, 3),
('Casco de seguridad', 'Casco con protección contra impactos.', 'https://source.unsplash.com/400x300/?safety-helmet', 7990, 30, 4),
('Guantes de trabajo', 'Guantes reforzados para trabajos rudos.', 'https://source.unsplash.com/400x300/?work-gloves', 3990, 60, 4);

