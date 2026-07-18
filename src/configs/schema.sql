CREATE TABLE
    IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        role ENUM ('admin', 'owner', 'user') NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS booking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        startTime DATETIME NOT NULL,
        endTime DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
    );