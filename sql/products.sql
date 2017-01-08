SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL,
  `clubid` int(11) NOT NULL,
  `name` text NOT NULL,
  `sizes` text NOT NULL,
  `price` decimal(11,2) NOT NULL,
  `flockingPrice` decimal(11,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `products`
  ADD PRIMARY KEY (`id`,`clubid`);


ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
