-- =====================================================
-- Base de datos: quimica  (6 tablas)
-- Proyecto: Equilibra tu ecuación
-- MySQL 8 / MySQL Workbench
-- ATENCION: borra y recrea la base "quimica".
-- =====================================================
DROP DATABASE IF EXISTS quimica;
CREATE DATABASE quimica
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quimica;

-- -----------------------------------------------------
-- 1. Usuarios (nivel = tipo de usuario)
-- -----------------------------------------------------
CREATE TABLE usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nivel ENUM('basico','prepa','universidad') NOT NULL,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 2. Cursos (tipo 'problemas' o 'memorama')
-- -----------------------------------------------------
CREATE TABLE cursos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nivel ENUM('basico','prepa','universidad') NOT NULL,
  tipo ENUM('problemas','memorama') NOT NULL DEFAULT 'problemas',
  titulo VARCHAR(120) NOT NULL,
  descripcion VARCHAR(300) NULL,
  INDEX idx_nivel (nivel)
);

-- -----------------------------------------------------
-- 3. Problemas
--    Balanceo:        enunciado 'Fe + O_2 -> Fe_2O_3', solucion '4Fe + 3O_2 -> 2Fe_2O_3'
--    Opción múltiple: opciones = JSON con alternativas, solucion = texto de la correcta
--    Memorama:        cada fila es un par (enunciado = 'H', solucion = 'Hidrógeno')
-- -----------------------------------------------------
CREATE TABLE problemas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  curso_id INT UNSIGNED NOT NULL,
  enunciado TEXT NOT NULL,
  solucion VARCHAR(300) NOT NULL,
  opciones JSON NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  INDEX idx_curso_orden (curso_id, orden),
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- 4. Progreso (una fila por usuario y problema)
-- -----------------------------------------------------
CREATE TABLE progreso (
  usuario_id INT UNSIGNED NOT NULL,
  problema_id INT UNSIGNED NOT NULL,
  correcto BOOLEAN NOT NULL DEFAULT FALSE,
  intentos SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, problema_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (problema_id) REFERENCES problemas(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- 5. Conversaciones (historial del balanceador)
--    ecuacion  = lo que escribió el usuario
--    resultado = ecuación balanceada
-- -----------------------------------------------------
CREATE TABLE conversaciones (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  ecuacion VARCHAR(300) NOT NULL,
  resultado VARCHAR(400) NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario_fecha (usuario_id, fecha),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- 6. Mensajes (respuestas de la IA de cada conversación)
--    tipo: 'explicacion' (paso a paso) o 'aplicaciones' (de los elementos)
-- -----------------------------------------------------
CREATE TABLE mensajes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversacion_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('explicacion','aplicaciones') NOT NULL,
  contenido MEDIUMTEXT NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_conversacion (conversacion_id),
  FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE
);

-- =====================================================
-- DATOS DE EJEMPLO (cursos y problemas)
-- =====================================================

INSERT INTO cursos (id, nivel, tipo, titulo, descripcion) VALUES
  (1, 'basico', 'memorama', 'Memorama de elementos', 'Une cada símbolo con el nombre de su elemento.'),
  (2, 'basico', 'problemas', 'Mis primeras ecuaciones', 'Balancea ecuaciones sencillas con pocos compuestos.'),
  (3, 'prepa', 'problemas', 'Balanceo de ecuaciones', 'Practica el balanceo por tanteo y por sistemas de ecuaciones.'),
  (4, 'prepa', 'problemas', 'Tipos de reacciones', 'Identifica si una reacción es de síntesis, descomposición o neutralización.'),
  (5, 'universidad', 'problemas', 'Balanceo avanzado', 'Ecuaciones con varios compuestos y coeficientes grandes.'),
  (6, 'universidad', 'problemas', 'Termodinámica básica', 'Conceptos de entalpía, energía libre y leyes de la termodinámica.');

-- Curso 1: memorama (cada fila es un par de cartas)
INSERT INTO problemas (curso_id, enunciado, solucion, orden) VALUES
  (1, 'H',  'Hidrógeno', 1),
  (1, 'O',  'Oxígeno',   2),
  (1, 'C',  'Carbono',   3),
  (1, 'N',  'Nitrógeno', 4),
  (1, 'Na', 'Sodio',     5),
  (1, 'Fe', 'Hierro',    6);

-- Curso 2: balanceo básico
INSERT INTO problemas (curso_id, enunciado, solucion, orden) VALUES
  (2, 'H_2 + O_2 -> H_2O',  '2H_2 + O_2 -> 2H_2O',  1),
  (2, 'Na + Cl_2 -> NaCl',  '2Na + Cl_2 -> 2NaCl',  2),
  (2, 'Mg + O_2 -> MgO',    '2Mg + O_2 -> 2MgO',    3),
  (2, 'N_2 + H_2 -> NH_3',  'N_2 + 3H_2 -> 2NH_3',  4);

-- Curso 3: balanceo de prepa
INSERT INTO problemas (curso_id, enunciado, solucion, orden) VALUES
  (3, 'Fe + O_2 -> Fe_2O_3',           '4Fe + 3O_2 -> 2Fe_2O_3',        1),
  (3, 'CH_4 + O_2 -> CO_2 + H_2O',     'CH_4 + 2O_2 -> CO_2 + 2H_2O',   2),
  (3, 'Al + O_2 -> Al_2O_3',           '4Al + 3O_2 -> 2Al_2O_3',        3),
  (3, 'KClO_3 -> KCl + O_2',           '2KClO_3 -> 2KCl + 3O_2',        4),
  (3, 'C_3H_8 + O_2 -> CO_2 + H_2O',   'C_3H_8 + 5O_2 -> 3CO_2 + 4H_2O', 5);

-- Curso 4: opción múltiple (tipos de reacciones)
INSERT INTO problemas (curso_id, enunciado, solucion, opciones, orden) VALUES
  (4, 'La reacción N_2 + 3H_2 -> 2NH_3 es una reacción de…', 'Síntesis',
      JSON_ARRAY('Síntesis', 'Descomposición', 'Neutralización', 'Combustión'), 1),
  (4, 'La reacción 2KClO_3 -> 2KCl + 3O_2 es una reacción de…', 'Descomposición',
      JSON_ARRAY('Síntesis', 'Descomposición', 'Neutralización', 'Combustión'), 2),
  (4, 'La reacción HCl + NaOH -> NaCl + H_2O es una reacción de…', 'Neutralización',
      JSON_ARRAY('Síntesis', 'Descomposición', 'Neutralización', 'Combustión'), 3);

-- Curso 5: balanceo universitario
INSERT INTO problemas (curso_id, enunciado, solucion, orden) VALUES
  (5, 'C_2H_6 + O_2 -> CO_2 + H_2O',           '2C_2H_6 + 7O_2 -> 4CO_2 + 6H_2O',            1),
  (5, 'Al + HCl -> AlCl_3 + H_2',              '2Al + 6HCl -> 2AlCl_3 + 3H_2',                2),
  (5, 'Fe_2O_3 + CO -> Fe + CO_2',             'Fe_2O_3 + 3CO -> 2Fe + 3CO_2',                3),
  (5, 'C_6H_12O_6 + O_2 -> CO_2 + H_2O',       'C_6H_12O_6 + 6O_2 -> 6CO_2 + 6H_2O',          4),
  (5, 'KMnO_4 + HCl -> KCl + MnCl_2 + H_2O + Cl_2',
      '2KMnO_4 + 16HCl -> 2KCl + 2MnCl_2 + 8H_2O + 5Cl_2',                                     5);

-- Curso 6: termodinámica (opción múltiple)
INSERT INTO problemas (curso_id, enunciado, solucion, opciones, orden) VALUES
  (6, 'Una reacción con ΔH negativo es…', 'Exotérmica',
      JSON_ARRAY('Exotérmica', 'Endotérmica', 'Isotérmica', 'Adiabática'), 1),
  (6, 'Si ΔG < 0 a temperatura y presión constantes, el proceso es…', 'Espontáneo',
      JSON_ARRAY('Espontáneo', 'No espontáneo', 'Está en equilibrio', 'Imposible'), 2),
  (6, 'La primera ley de la termodinámica establece que…', 'La energía se conserva',
      JSON_ARRAY('La energía se conserva', 'La entropía siempre aumenta',
                 'El calor fluye de lo frío a lo caliente',
                 'La entropía de un cristal perfecto a 0 K es cero'), 3);
