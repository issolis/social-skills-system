import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API Gateway is running',
        timestamp: new Date().toISOString()
    });
});

// API Root
app.get('/api', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API Gateway - Social Skills System',
        endpoints: {
            users: '/api/users',
            skills: '/api/skills',
            orders: '/api/orders'
        }
    });
});

// Proxy routes
app.use('/api/users', createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/users'
    },
    onError: (err, req, res) => {
        console.error('Users service error:', err.message);
        res.status(503).json({
            status: 'error',
            message: 'Users service unavailable',
            error: err.message
        });
    }
}));

app.use('/api/skills', createProxyMiddleware({
    target: process.env.SKILLS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/skills': '/skills'
    },
    onError: (err, req, res) => {
        console.error('Skills service error:', err.message);
        res.status(503).json({
            status: 'error',
            message: 'Skills service unavailable',
            error: err.message
        });
    }
}));

app.use('/api/orders', createProxyMiddleware({
    target: process.env.ORDERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/orders': '/orders'
    },
    onError: (err, req, res) => {
        console.error('Orders service error:', err.message);
        res.status(503).json({
            status: 'error',
            message: 'Orders service unavailable',
            error: err.message
        });
    }
}));

// Serve frontend for root and SPA routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    
    res.status(status).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export default app;
