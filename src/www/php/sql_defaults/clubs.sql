CREATE TABLE `clubs` (
  `id` int(11) NOT NULL,
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `logodata` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `displaymode` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=COMPACT;
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `clubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
