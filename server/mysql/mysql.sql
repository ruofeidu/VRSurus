-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2015 at 06:59 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `vrsurus`
--

-- --------------------------------------------------------

--
-- Table structure for table `ninjaterp_data`
--

CREATE TABLE IF NOT EXISTS `ninjaterp_data` (
  `id` int(11) NOT NULL,
  `data` varchar(32) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ninjaterp_data`
--

INSERT INTO `ninjaterp_data` (`id`, `data`, `time`) VALUES
(0, 'I', '2015-11-04 16:47:16'),
(1, 'IDLE', '2015-11-04 16:47:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ninjaterp_data`
--
ALTER TABLE `ninjaterp_data`
 ADD PRIMARY KEY (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
