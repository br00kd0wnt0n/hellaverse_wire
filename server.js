const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

// Log startup environment
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    RAILWAY_SERVICE_ID: process.env.RAILWAY_SERVICE_ID,
    RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID
});

// Log file system state
console.log('File system state:', {
    cwd: process.cwd(),
    dirname: __dirname,
    publicPath: path.join(__dirname, 'public'),
    files: fs.readdirSync(__dirname),
    publicFiles: fs.existsSync(path.join(__dirname, 'public')) ? fs.readdirSync(path.join(__dirname, 'public')) : 'public directory not found'
});

const app = express();
const PORT = process.env.PORT || 3000;

// Basic request logging with more detail
app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :user-agent'));

// Security middleware with more permissive CSP for development
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Enable compression
app.use(compression());

// Log startup information
console.log('Starting server with configuration:', {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: PORT,
    __dirname: __dirname,
    publicPath: path.join(__dirname, 'public'),
    memory: process.memoryUsage()
});

// Serve static files with proper MIME types and error handling
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        console.log('Serving static file:', filePath);
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
        if (filePath.endsWith('.ico')) {
            res.setHeader('Content-Type', 'image/x-icon');
        }
    },
    fallthrough: false // Return 404 for missing files
}));

// Enhanced health check endpoint for Railway
app.get('/health', (req, res) => {
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        memory: process.memoryUsage(),
        staticPath: path.join(__dirname, 'public'),
        nodeVersion: process.version,
        railway: {
            environment: process.env.RAILWAY_ENVIRONMENT,
            serviceId: process.env.RAILWAY_SERVICE_ID,
            projectId: process.env.RAILWAY_PROJECT_ID
        }
    };
    
    // Check if static files are accessible
    const indexPath = path.join(__dirname, 'public', 'index.html');
    try {
        fs.accessSync(indexPath, fs.constants.R_OK);
        health.staticFiles = 'OK';
        health.staticFilesList = fs.readdirSync(path.join(__dirname, 'public'));
    } catch (err) {
        health.staticFiles = 'ERROR';
        health.staticFilesError = err.message;
    }
    
    res.status(200).json(health);
});

// Main route with error handling
app.get('/', (req, res, next) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            next(err);
        } else {
            console.log('Successfully served index.html');
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        path: req.path,
        headers: req.headers
    });
    
    // Don't expose error details in production
    const errorResponse = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message;
    
    res.status(err.status || 500).json({
        error: errorResponse,
        path: req.path
    });
});

// Start server with retry logic
let server;
const startServer = (retries = 3) => {
    try {
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('Server startup complete');
            
            // Log memory usage
            const used = process.memoryUsage();
            console.log('Memory usage:', {
                rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`
            });
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        if (retries > 0) {
            console.log(`Retrying server start... (${retries} attempts remaining)`);
            setTimeout(() => startServer(retries - 1), 1000);
        } else {
            console.error('Failed to start server after all retries');
            process.exit(1);
        }
    }
};

// Handle server errors
server?.on('error', (error) => {
    console.error('Server error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        port: PORT
    });
    
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
});

// Graceful shutdown
const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
        
        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer(); 