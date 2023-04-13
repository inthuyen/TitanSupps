-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 04, 2023 at 02:42 PM
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
-- Table structure for table `item`
--

CREATE TABLE `item` (
                        `item_id` int(9) NOT NULL,
                        `name` varchar(30) NOT NULL,
                        `price` int(6) NOT NULL,
                        `category` varchar(20) NOT NULL,
                        `description` varchar(255) NOT NULL,
                        `img_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`item_id`, `name`, `price`, `category`, `description`, `img_link`) VALUES
    (1, 'Anabolic Cookies', 1599, 'snacks', 'Description', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2ChocolateChipCookies.jpg/800px-2ChocolateChipCookies.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
                          `transaction_id` int(30) NOT NULL,
                          `user_id` int(9) NOT NULL,
                          `date` datetime NOT NULL,
                          `eta` date NOT NULL,
                          `price` int(15) NOT NULL,
                          `payment_id` int(255) NOT NULL,
                          `shipping_id` int(9) NOT NULL,
                          `tracking` varchar(20) NOT NULL,
                          `emails` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
                               `order_item_id` int(9) PRIMARY KEY AUTO_INCREMENT,
                               `item_id` int(9) NOT NULL,
                               `quantity` int(4) NOT NULL,
                               `order_id` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
                           `payment_id` int(255) NOT NULL,
                           `fname` varchar(20) NOT NULL,
                           `lname` varchar(20) NOT NULL,
                           `number` varchar(16) NOT NULL,
                           `cvv` varchar(4) NOT NULL,
                           `expiry` varchar(4) NOT NULL,
                           `user_id` int(10) NOT NULL,
                           `billing_address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `fname`, `lname`, `number`, `cvv`, `expiry`, `user_id`, `billing_address`) VALUES
    (5, '', '', '1234567812345678', '123', '0426', 3, 'Billing Addy');

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
                            `shipping_id` int(9) NOT NULL,
                            `address` varchar(255) NOT NULL,
                            `fname` varchar(20) NOT NULL,
                            `lname` varchar(20) NOT NULL,
                            `phone` varchar(10) NOT NULL,
                            `user_id` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`shipping_id`, `address`, `fname`, `lname`, `phone`, `user_id`) VALUES
    (5, '42 Eastbourne Crescent, Toronto, ON M8V 2T2, Canada', 'Nick', 'Metz', '4168888888', 3);

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
                                   `ticket_id` int(10) NOT NULL,
                                   `user_id` int(9) DEFAULT NULL,
                                   `email` varchar(50) NOT NULL,
                                   `subject` varchar(21) NOT NULL,
                                   `message` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
                         `user_id` int(9) NOT NULL,
                         `email` varchar(30) NOT NULL,
                         `password` varchar(128) NOT NULL,
                         `admin` tinyint(1) NOT NULL DEFAULT 0,
                         `salt` VARCHAR(96)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `admin`) VALUES
    (3, 'nick@toronto.ca', 'passcode', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `item`
--
ALTER TABLE `item`
    ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
    ADD PRIMARY KEY (`transaction_id`),
    ADD KEY `user_id` (`user_id`),
    ADD KEY `payment_id` (`payment_id`),
    ADD KEY `shipping_id` (`shipping_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
    ADD KEY `item_id` (`item_id`),
    ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
    ADD PRIMARY KEY (`payment_id`),
    ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
    ADD PRIMARY KEY (`shipping_id`),
    ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
    ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
    ADD PRIMARY KEY (`user_id`),
    ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
    MODIFY `item_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
    MODIFY `transaction_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
    MODIFY `payment_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
    MODIFY `shipping_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
    MODIFY `user_id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
    ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_id`) REFERENCES `shipping` (`shipping_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
    ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`transaction_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
    ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
    ADD CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
    ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Table structure for table `workouts`
CREATE TABLE `workouts` (
                            `workout_id` tinyint(2) NOT NULL,
                            `gender` varchar(20) NOT NULL,
                            `experience` varchar(20) NOT NULL,
                            `exercises` text NOT NULL,
                            `reps/set` varchar(20) NOT NULL,
                            `days` varchar(32) NOT NULL
);

-- Indexes for table `workouts`
ALTER TABLE `workouts`
    ADD PRIMARY KEY (`workout_id`),
    ADD UNIQUE KEY `workout_id` (`workout_id`);

-- Dumping data for table `workouts`
INSERT INTO `workouts` (`workout_id`, `gender`, `experience`, `exercises`, `reps/set`, `days`) VALUES
                                                                                                   (1, 'Male', 'Beginner', 'Bench Press, Barbell Row, Squat, Hanging Leg-Raises', '3x10', 'twice a week'),
                                                                                                   (2, 'Male', 'Intermediate', 'Bench Press, Barbell Row, Overhead Military Press, Squat, Hanging Leg-Raises', '3x10', 'twice a week'),
                                                                                                   (3, 'Male', 'Advanced', 'Bench Press, Barbell Row, Overhead Military Press, Squat, Hanging Leg-Raises', '5x5', 'three times a week'),
                                                                                                   (4, 'Female', 'Beginner', 'Bench Press, Barbell Row, Squat', '2x10', 'twice a week'),
                                                                                                   (5, 'Female', 'Intermediate', 'Bench Press, Barbell Row, Squat, Hanging Leg-Raises', '3x10', 'twice a week'),
                                                                                                   (6, 'Female', 'Advanced', 'Bench Press, Barbell Row, Squat, Hanging Leg-Raises', '5x5', 'three times a week');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
