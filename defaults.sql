-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 31, 2017 at 03:12 PM
-- Server version: 5.6.35
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `sportpaul`
--
CREATE DATABASE IF NOT EXISTS `sportpaul` DEFAULT CHARACTER SET latin1 COLLATE latin1_german1_ci;
USE `sportpaul`;

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` int(11) NOT NULL,
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `logodata` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `displaymode` int(11) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `clubid` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `productid` int(11) NOT NULL,
  `internalid` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `colour` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `flocking` varchar(256) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `defaultFlocking` tinyint(1) NOT NULL,
  `size` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `flockingPrice` decimal(6,2) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '-1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `clubid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `clubname` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `firstname` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `lastname` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `address` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `postcode` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `town` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `email` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `phone` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `clubid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `internalid` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `name` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `colours` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '[]',
  `pricegroups` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT '[]',
  `flockingPrice` decimal(6,2) DEFAULT NULL,
  `defaultFlocking` tinyint(1) NOT NULL DEFAULT '1',
  `defaultFlockingInfo` varchar(256) COLLATE latin1_german1_ci NOT NULL,
  `picture` varchar(1024) COLLATE latin1_german1_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `name` varchar(255) COLLATE latin1_german1_ci NOT NULL,
  `value` varchar(256) COLLATE latin1_german1_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci ROW_FORMAT=COMPACT;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`name`, `value`) VALUES
('general_adminpassword', '57881609590c944ee342f92b139e3c03'), -- 'sportpaul'
('mail_address', 'mail@example.com'),
('mail_enablenotifications', '1'),
('mail_from', 'Max Mustermann'),
('mail_host', 'smtp.example.com'),
('mail_password', ''),
('mail_port', '587'),
('mail_username', 'mail@example.com'),
('subject_articlereceivedinfo', 'Ihre Bestellung ist abholbar!'),
('subject_orderconfirmed', 'Ihre Bestellung wurde bestätigt.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`clubid`,`orderid`,`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`clubid`,`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`clubid`,`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
