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
ALTER TABLE `items`
  ADD PRIMARY KEY (`clubid`,`orderid`,`id`);
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
