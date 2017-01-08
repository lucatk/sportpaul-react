SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL,
  `clubid` int(11) NOT NULL,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `street` text NOT NULL,
  `housenr` text NOT NULL,
  `postcode` int(5) NOT NULL,
  `town` text NOT NULL,
  `email` text NOT NULL,
  `telephone` text NOT NULL,
  `data` text NOT NULL,
  `recorded` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
