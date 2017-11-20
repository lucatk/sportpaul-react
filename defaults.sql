SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `clubs` (
  `id` int(11) NOT NULL,
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `logodata` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `displaymode` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=COMPACT;

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `clubid` int(11) NOT NULL DEFAULT '-1',
  `clubname` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `firstname` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `lastname` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `address` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `postcode` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `town` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `email` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `phone` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

CREATE TABLE `items` (
  `clubid` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `productid` int(11) NOT NULL DEFAULT '-1',
  `internalid` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `colour` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '{"id":"-1","name":"","picture":""}',
  `size` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `flockings` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '[]',
  `price` decimal(6,2) NOT NULL DEFAULT '0.00',
  `status` tinyint(4) NOT NULL DEFAULT '-1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE `orders` (
  `clubid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `clubname` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `customerid` int(11) NOT NULL DEFAULT '-1',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE `products` (
  `clubid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `displayorder` int(11) NOT NULL DEFAULT '0',
  `internalid` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `colours` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '[]',
  `pricegroups` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '[]',
  `flockings` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '[]',
  `includedFlockingInfo` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `picture` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE `settings` (
  `name` varchar(255) COLLATE latin1_german1_ci NOT NULL,
  `value` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `private` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=COMPACT;

INSERT INTO `settings` (`name`, `value`, `private`) VALUES
('general_adminpassword', '57881609590c944ee342f92b139e3c03', 0), -- "sportpaul"
('mail_address', 'mail@example.com', 1),
('mail_enablenotifications', '1', 1),
('mail_from', 'Max Mustermann', 1),
('mail_host', 'smtp.example.com', 1),
('mail_password', '', 1),
('mail_port', '587', 1),
('mail_username', 'mail@example.com', 1),
('subject_articlereceivedinfo', 'Ihre Bestellung ist abholbar!', 1),
('subject_orderconfirmed', 'Ihre Bestellung wurde bestätigt.', 1),
('general_recaptcha_site', '6LfEAjEUAAAAAEVEXOe5F6VQVzS2u-PvnOSUU2yW', 0),
('general_recaptcha_secret', '6LfEAjEUAAAAAPTVLnEw-IeWLCHfQ8cMiW-VzVup', 1);


ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `items`
  ADD PRIMARY KEY (`clubid`,`orderid`,`id`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`clubid`,`id`);

ALTER TABLE `products`
  ADD PRIMARY KEY (`clubid`,`id`);

ALTER TABLE `settings`
  ADD PRIMARY KEY (`name`);


ALTER TABLE `clubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
