-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2023 at 11:04 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `final`
--

-- --------------------------------------------------------

--
-- Table structure for table `workouts`
--

CREATE TABLE `workouts` (
                            `workout_id` tinyint(2) NOT NULL,
                            `gender` varchar(20) NOT NULL,
                            `experience` varchar(20) NOT NULL,
                            `exercises` text NOT NULL,
                            `reps/set` varchar(20) NOT NULL,
                            `days` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`workout_id`, `gender`, `experience`, `exercises`, `reps/set`, `days`) VALUES
                                                                                                   (1, 'Male', 'Beginner', 'Bench Press, Barbell Row, Squat, Hanging Leg-Raises', '3x10', 'twice a week'),
                                                                                                   (2, 'Male', 'Intermediate', 'Bench Press, Barbell Row, Overhead Military Press, Squat, Hanging Leg-Raises', '3x10', 'twice a week'),
                                                                                                   (3, 'Male', 'Advanced', 'Bench Press, Barbell Row, Overhead Military Press, Squat, Hanging Leg-Raises', '5x5', 'three times a week'),
                                                                                                   (4, 'Female', 'Beginner', 'Bench Press, Barbell Row, Squat', '2x10', 'twice a week'),
                                                                                                   (5, 'Female', 'Intermediate', 'Bench Press, Barbell Row, Squat, Hanging Leg-Raises', '3x10', 'twice a week'),
                                                                                                   (6, 'Female', 'Advanced', 'Bench Press, Barbell Row, Squat, Hanging Leg-Raises', '5x5', 'three times a week');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `workouts`
--
ALTER TABLE `workouts`
    ADD PRIMARY KEY (`workout_id`),
    ADD UNIQUE KEY `workout_id` (`workout_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
