-- Configurações do MySQL
SET GLOBAL innodb_file_format=Barracuda;
SET GLOBAL innodb_large_prefix=ON;

-- Recria o banco de dados
DROP DATABASE IF EXISTS mulakintola;
CREATE DATABASE mulakintola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usa o banco de dados
USE mulakintola;

-- Configurações da tabela
SET GLOBAL innodb_file_per_table=ON;
ALTER DATABASE mulakintola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 