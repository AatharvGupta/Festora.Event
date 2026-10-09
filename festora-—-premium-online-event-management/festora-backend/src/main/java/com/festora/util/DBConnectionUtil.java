package com.festora.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Enterprise JDBC Connection Provider supporting high-performance HikariCP connection pooling
 * with automatic fallback to standard DriverManager for testing environments.
 */
public class DBConnectionUtil {

    private static final Logger LOGGER = Logger.getLogger(DBConnectionUtil.class.getName());

    private static final String DEFAULT_JDBC_URL = "jdbc:mysql://localhost:3306/festora_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "";

    private static HikariDataSource dataSource;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            initDataSource();
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found on classpath", e);
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "HikariCP initialization failed, falling back to direct connections: {0}", e.getMessage());
        }
    }

    private static synchronized void initDataSource() {
        if (dataSource != null && !dataSource.isClosed()) {
            return;
        }

        String jdbcUrl = System.getenv("DB_URL") != null ? System.getenv("DB_URL") : DEFAULT_JDBC_URL;
        String user = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : DEFAULT_USER;
        String password = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : DEFAULT_PASSWORD;

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(user);
        config.setPassword(password);
        config.setMaximumPoolSize(15);
        config.setMinimumIdle(3);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(10000);
        config.setPoolName("FestoraHikariPool");

        // MySQL optimizations
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        dataSource = new HikariDataSource(config);
        LOGGER.info("HikariCP Connection Pool successfully initialized for Festora.");
    }

    /**
     * Obtains an active database connection from the pool.
     */
    public static Connection getConnection() throws SQLException {
        if (dataSource != null && !dataSource.isClosed()) {
            try {
                return dataSource.getConnection();
            } catch (SQLException e) {
                LOGGER.log(Level.WARNING, "Failed to get connection from pool, attempting direct fallback: {0}", e.getMessage());
            }
        }

        String jdbcUrl = System.getenv("DB_URL") != null ? System.getenv("DB_URL") : DEFAULT_JDBC_URL;
        String user = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : DEFAULT_USER;
        String password = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : DEFAULT_PASSWORD;
        return DriverManager.getConnection(jdbcUrl, user, password);
    }

    /**
     * Closes the connection pool on application shutdown.
     */
    public static void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            LOGGER.info("Festora HikariCP pool shut down.");
        }
    }
}
