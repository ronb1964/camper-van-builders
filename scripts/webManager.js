#!/usr/bin/env node

/**
 * 🌐 CAMPER VAN BUILDERS - WEB DATABASE MANAGER
 * 
 * Simple web interface for managing the builder database.
 * Provides a local admin panel for database operations.
 */

const express = require('express');
const path = require('path');
const BuilderAPI = require('./builderAPI');

const app = express();
const api = new BuilderAPI();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API Routes

/**
 * 📊 Get database statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await api.getStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔍 Search builders
 */
app.get('/api/builders/search', async (req, res) => {
  try {
    const results = await api.findBuilders(req.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 📋 Get builders by state
 */
app.get('/api/builders/state/:state', async (req, res) => {
  try {
    const builders = await api.getBuildersByState(req.params.state);
    res.json(builders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🗺️ Get all states
 */
app.get('/api/states', async (req, res) => {
  try {
    const states = await api.getStatesWithBuilders();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ➕ Add new builder
 */
app.post('/api/builders', async (req, res) => {
  try {
    const id = await api.addBuilder(req.body);
    res.json({ success: true, id, message: 'Builder added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * ✏️ Update builder
 */
app.put('/api/builders/:id', async (req, res) => {
  try {
    const builder = await api.updateBuilder(req.params.id, req.body);
    res.json({ success: true, builder, message: 'Builder updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * 🗑️ Delete builder
 */
app.delete('/api/builders/:id', async (req, res) => {
  try {
    const builder = await api.removeBuilder(req.params.id);
    res.json({ success: true, builder, message: 'Builder removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * 🔧 Validate database
 */
app.get('/api/validate', async (req, res) => {
  try {
    const validation = await api.validateAndFix();
    res.json(validation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🛡️ Create backup
 */
app.post('/api/backup', async (req, res) => {
  try {
    api.db.createBackup();
    res.json({ success: true, message: 'Backup created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Interface HTML
const adminHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Camper Van Builders - Database Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .btn { background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #2980b9; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
        .btn-success { background: #27ae60; }
        .btn-success:hover { background: #229954; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-card { background: #3498db; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; }
        .results { max-height: 400px; overflow-y: auto; }
        .builder-item { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
        .error { color: #e74c3c; background: #fadbd8; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .success { color: #27ae60; background: #d5f4e6; padding: 10px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗄️ Camper Van Builders - Database Manager</h1>
            <p>Programmatic management interface for the builder database</p>
        </div>

        <div class="grid">
            <!-- Statistics -->
            <div class="card">
                <h2>📊 Database Statistics</h2>
                <div id="stats" class="stats">
                    <div class="stat-card">
                        <div class="stat-number" id="totalBuilders">-</div>
                        <div>Total Builders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="totalStates">-</div>
                        <div>States</div>
                    </div>
                </div>
                <button class="btn" onclick="loadStats()">Refresh Stats</button>
            </div>

            <!-- Search -->
            <div class="card">
                <h2>🔍 Search Builders</h2>
                <div class="form-group">
                    <label>Search Query:</label>
                    <input type="text" id="searchQuery" placeholder="Name, state, city, service...">
                </div>
                <button class="btn" onclick="searchBuilders()">Search</button>
                <div id="searchResults" class="results"></div>
            </div>

            <!-- Add Builder -->
            <div class="card">
                <h2>➕ Add New Builder</h2>
                <form id="addBuilderForm">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Address:</label>
                        <input type="text" name="address" required>
                    </div>
                    <div class="form-group">
                        <label>Phone:</label>
                        <input type="text" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Website:</label>
                        <input type="url" name="website">
                    </div>
                    <div class="form-group">
                        <label>City:</label>
                        <input type="text" name="city" required>
                    </div>
                    <div class="form-group">
                        <label>State:</label>
                        <input type="text" name="state" required maxlength="2" placeholder="NJ">
                    </div>
                    <div class="form-group">
                        <label>ZIP:</label>
                        <input type="text" name="zip" required>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea name="description" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-success">Add Builder</button>
                </form>
            </div>

            <!-- Database Tools -->
            <div class="card">
                <h2>🔧 Database Tools</h2>
                <button class="btn" onclick="validateDatabase()">Validate Database</button>
                <button class="btn btn-success" onclick="createBackup()">Create Backup</button>
                <div id="toolResults"></div>
            </div>
        </div>

        <div id="messages"></div>
    </div>

    <script>
        // Load initial stats
        loadStats();

        async function loadStats() {
            try {
                const response = await fetch('/api/stats');
                const stats = await response.json();
                document.getElementById('totalBuilders').textContent = stats.totalBuilders;
                document.getElementById('totalStates').textContent = stats.statesWithBuilders;
            } catch (error) {
                showMessage('Error loading stats: ' + error.message, 'error');
            }
        }

        async function searchBuilders() {
            const query = document.getElementById('searchQuery').value;
            if (!query) return;

            try {
                const response = await fetch('/api/builders/search?name=' + encodeURIComponent(query));
                const results = await response.json();
                
                const resultsDiv = document.getElementById('searchResults');
                if (results.length === 0) {
                    resultsDiv.innerHTML = '<p>No builders found</p>';
                } else {
                    resultsDiv.innerHTML = results.map(builder => 
                        '<div class="builder-item">' +
                        '<strong>' + builder.name + '</strong><br>' +
                        builder.location.city + ', ' + builder.location.state + '<br>' +
                        '<small>ID: ' + builder.id + '</small>' +
                        '</div>'
                    ).join('');
                }
            } catch (error) {
                showMessage('Error searching: ' + error.message, 'error');
            }
        }

        document.getElementById('addBuilderForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const builderData = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/api/builders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(builderData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Builder added successfully! ID: ' + result.id, 'success');
                    e.target.reset();
                    loadStats();
                } else {
                    showMessage('Error: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Error adding builder: ' + error.message, 'error');
            }
        });

        async function validateDatabase() {
            try {
                const response = await fetch('/api/validate');
                const result = await response.json();
                
                const toolResults = document.getElementById('toolResults');
                if (result.issues.length === 0) {
                    toolResults.innerHTML = '<div class="success">✅ Database is valid</div>';
                } else {
                    toolResults.innerHTML = '<div class="error">❌ Issues found:<br>' + 
                        result.issues.map(issue => '• ' + issue).join('<br>') + '</div>';
                }
            } catch (error) {
                showMessage('Error validating: ' + error.message, 'error');
            }
        }

        async function createBackup() {
            try {
                const response = await fetch('/api/backup', { method: 'POST' });
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Backup created successfully!', 'success');
                } else {
                    showMessage('Error creating backup: ' + result.error, 'error');
                }
            } catch (error) {
                showMessage('Error creating backup: ' + error.message, 'error');
            }
        }

        function showMessage(message, type) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = type;
            messageDiv.textContent = message;
            messagesDiv.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    </script>
</body>
</html>
`;

// Serve admin interface
app.get('/admin', (req, res) => {
  res.send(adminHTML);
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
🌐 Database Manager Web Interface Started!

📊 Admin Panel: http://localhost:${PORT}/admin
🔧 API Endpoint: http://localhost:${PORT}/api

Available API endpoints:
  GET  /api/stats - Database statistics
  GET  /api/builders/search - Search builders
  GET  /api/builders/state/:state - Builders by state
  GET  /api/states - All states with builders
  POST /api/builders - Add new builder
  PUT  /api/builders/:id - Update builder
  DELETE /api/builders/:id - Remove builder
  GET  /api/validate - Validate database
  POST /api/backup - Create backup

Press Ctrl+C to stop the server.
    `);
  });
}

module.exports = app;
