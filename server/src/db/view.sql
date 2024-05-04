CREATE VIEW view_data_sensor AS
SELECT 
data_sensor.id, 
data_sensor.temperature, 
data_sensor.humidity, 
data_sensor.light, 
data_sensor.dust, 
CONVERT(DATE_FORMAT(data_sensor.createAt, '%d/%m/%Y %h:%m %p'), CHAR) AS `createAt`,
CONCAT(
    CONVERT(data_sensor.id, CHAR), 
    " ",
    data_sensor.temperature, 
    " ",
    data_sensor.humidity, 
    " ",
    data_sensor.light, 
    " ",
    data_sensor.dust, 
    " ",
    CONVERT(DATE_FORMAT(data_sensor.createAt, '%d/%m/%Y %h:%m %p'), CHAR)
    ) AS searchCol 
FROM data_sensor;

CREATE VIEW view_action_history AS
SELECT 
action_history.id, 
action_history.device,
action_history.act,
CONVERT(DATE_FORMAT(action_history.createAt, '%d/%m/%Y %h:%m %p'), CHAR) AS `createAt`,
CONCAT(
    CONVERT(action_history.id, CHAR), 
    " ",
    action_history.device, 
    " ",
    action_history.act, 
    " ",
    CONVERT(DATE_FORMAT(action_history.createAt, '%d/%m/%Y %h:%m %p'), CHAR)
    ) AS searchCol 
FROM action_history;

SELECT day(data_sensor.createAt), month(data_sensor.createAt), year(data_sensor.createAt), hour(data_sensor.createAt), minute(data_sensor.createAt) FROM data_sensor;

SELECT CONVERT(DATE_FORMAT(data_sensor.createAt, '%d/%m/%Y %h:%m %p'), CHAR) FROM data_sensor;
-- https://viettuts.vn/sql-date/ham-date-format-trong-sql

CREATE TABLE `action_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device` varchar(255) DEFAULT NULL,
  `act` varchar(255) DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `data_sensor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `temperature` varchar(255) DEFAULT NULL,
  `humidity` varchar(255) DEFAULT NULL,
  `light` varchar(255) DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `data_sensor`
ADD `dust` varchar(255) DEFAULT(0);

ALTER TABLE `data_sensor` 
ALTER `dust` DROP DEFAULT;

