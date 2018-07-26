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
ALTER TABLE `settings`
  ADD PRIMARY KEY (`name`);
