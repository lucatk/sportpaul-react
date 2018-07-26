CREATE TABLE `orders` (
  `clubid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `clubname` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `customerid` int(11) NOT NULL DEFAULT '-1',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;
ALTER TABLE `orders`
  ADD PRIMARY KEY (`clubid`,`id`);
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
