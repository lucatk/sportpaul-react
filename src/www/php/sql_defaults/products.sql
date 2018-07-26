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
ALTER TABLE `products`
  ADD PRIMARY KEY (`clubid`,`id`);
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
