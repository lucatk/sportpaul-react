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
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
