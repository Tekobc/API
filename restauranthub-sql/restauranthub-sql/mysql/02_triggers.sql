-- =========================================================
-- RestaurantHub - Triggers (MySQL / MariaDB)
-- =========================================================
-- MySQL no soporta índices únicos parciales (WHERE ...),
-- así que la regla "no puede haber dos cajas abiertas al
-- mismo tiempo" (equivalente al índice parcial de la
-- versión PostgreSQL) se implementa con un trigger.
-- =========================================================

USE restauranthub;

DELIMITER $$

CREATE TRIGGER trg_cash_registers_single_open
BEFORE INSERT ON cash_registers
FOR EACH ROW
BEGIN
  IF NEW.status = 'open' THEN
    IF (SELECT COUNT(*) FROM cash_registers WHERE status = 'open') > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Ya existe una caja abierta. Cerrala antes de abrir otra.';
    END IF;
  END IF;
END$$

CREATE TRIGGER trg_cash_registers_single_open_upd
BEFORE UPDATE ON cash_registers
FOR EACH ROW
BEGIN
  IF NEW.status = 'open' AND OLD.status <> 'open' THEN
    IF (SELECT COUNT(*) FROM cash_registers WHERE status = 'open' AND id <> NEW.id) > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Ya existe una caja abierta. Cerrala antes de abrir otra.';
    END IF;
  END IF;
END$$

DELIMITER ;
