const API_BASE = '/api';

// Utility function to format responses
function formatResponse(data) {
    return JSON.stringify(data, null, 2);
}

// Utility function to display responses
function displayResponse(elementId, data, status = 'success', isLoading = false) {
    const element = document.getElementById(elementId);
    const statusClass = isLoading ? 'loading' : status;
    const statusText = isLoading ? 'Cargando...' : (status === 'error' ? '❌ Error' : '✅ Éxito');

    if (isLoading) {
        element.innerHTML = `<span class="loading-spinner"></span>${statusText}`;
        return;
    }

    element.innerHTML = `<span class="status ${statusClass}">${statusText}</span><pre>${formatResponse(data)}</pre>`;
}

// Load users and skills into dropdowns
async function loadDropdowns() {
    try {
        // Load users
        const usersRes = await fetch(`${API_BASE}/users`);
        if (usersRes.ok) {
            const usersData = await usersRes.json();
            const users = usersData.data || [];
            const userSelect = document.getElementById('orderUserId');
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.id} - ${user.name || user.email}`;
                userSelect.appendChild(option);
            });
        }

        // Load skills
        const skillsRes = await fetch(`${API_BASE}/skills`);
        if (skillsRes.ok) {
            const skillsData = await skillsRes.json();
            const skills = skillsData.data || [];
            const skillSelect = document.getElementById('orderSkillId');
            skills.forEach(skill => {
                const option = document.createElement('option');
                option.value = skill.id;
                option.textContent = `${skill.id} - ${skill.name} (Nivel ${skill.difficulty_level})`;
                skillSelect.appendChild(option);
            });
        }

        updateStats();
    } catch (error) {
        console.error('Error loading dropdowns:', error);
    }
}

// Update statistics
async function updateStats() {
    try {
        // Users count
        const usersRes = await fetch(`${API_BASE}/users`);
        if (usersRes.ok) {
            const usersData = await usersRes.json();
            const users = usersData.data || [];
            document.getElementById('usersCount').textContent = users.length;
        }

        // Skills count
        const skillsRes = await fetch(`${API_BASE}/skills`);
        if (skillsRes.ok) {
            const skillsData = await skillsRes.json();
            const skills = skillsData.data || [];
            document.getElementById('skillsCount').textContent = skills.length;
        }

        // Orders count
        const ordersRes = await fetch(`${API_BASE}/orders`);
        if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            const orders = ordersData.data || [];
            document.getElementById('ordersCount').textContent = orders.length;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// USERS ENDPOINTS
async function getAllUsers() {
    displayResponse('usersResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        displayResponse('usersResponse', data, response.ok ? 'success' : 'error');
        updateStats();
    } catch (error) {
        displayResponse('usersResponse', { error: error.message }, 'error');
    }
}

async function getUserById() {
    const id = document.getElementById('userId').value;
    if (!id) {
        alert('Por favor ingresa el ID del usuario');
        return;
    }

    displayResponse('usersResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/users/${id}`);
        const data = await response.json();
        displayResponse('usersResponse', data, response.ok ? 'success' : 'error');
    } catch (error) {
        displayResponse('usersResponse', { error: error.message }, 'error');
    }
}

async function createUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    if (!name || !email) {
        alert('Por favor completa todos los campos');
        return;
    }

    displayResponse('usersResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const data = await response.json();
        displayResponse('usersResponse', data, response.ok ? 'success' : 'error');

        if (response.ok) {
            document.getElementById('userName').value = '';
            document.getElementById('userEmail').value = '';
            loadDropdowns();
        }
    } catch (error) {
        displayResponse('usersResponse', { error: error.message }, 'error');
    }
}

// SKILLS ENDPOINTS
async function getAllSkills() {
    displayResponse('skillsResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/skills`);
        const data = await response.json();
        displayResponse('skillsResponse', data, response.ok ? 'success' : 'error');
        updateStats();
    } catch (error) {
        displayResponse('skillsResponse', { error: error.message }, 'error');
    }
}

async function getSkillById() {
    const id = document.getElementById('skillId').value;
    if (!id) {
        alert('Por favor ingresa el ID de la habilidad');
        return;
    }

    displayResponse('skillsResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/skills/${id}`);
        const data = await response.json();
        displayResponse('skillsResponse', data, response.ok ? 'success' : 'error');
    } catch (error) {
        displayResponse('skillsResponse', { error: error.message }, 'error');
    }
}

async function createSkill() {
    const name = document.getElementById('skillName').value;
    const level = document.getElementById('skillLevel').value;
    const points = document.getElementById('skillPoints').value;

    if (!name || !level || !points) {
        alert('Por favor completa todos los campos');
        return;
    }

    displayResponse('skillsResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                difficulty_level: parseInt(level),
                experience_points: parseInt(points)
            })
        });
        const data = await response.json();
        displayResponse('skillsResponse', data, response.ok ? 'success' : 'error');

        if (response.ok) {
            document.getElementById('skillName').value = '';
            document.getElementById('skillLevel').value = '';
            document.getElementById('skillPoints').value = '';
            loadDropdowns();
        }
    } catch (error) {
        displayResponse('skillsResponse', { error: error.message }, 'error');
    }
}

// ORDERS ENDPOINTS
async function getAllOrders() {
    displayResponse('ordersResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const data = await response.json();
        displayResponse('ordersResponse', data, response.ok ? 'success' : 'error');
        updateStats();
    } catch (error) {
        displayResponse('ordersResponse', { error: error.message }, 'error');
    }
}

async function getOrderById() {
    const id = document.getElementById('orderId').value;
    if (!id) {
        alert('Por favor ingresa el ID del pedido');
        return;
    }

    displayResponse('ordersResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/orders/${id}`);
        const data = await response.json();
        displayResponse('ordersResponse', data, response.ok ? 'success' : 'error');
    } catch (error) {
        displayResponse('ordersResponse', { error: error.message }, 'error');
    }
}

async function createOrder() {
    const userId = document.getElementById('orderUserId').value;
    const skillId = document.getElementById('orderSkillId').value;

    if (!userId || !skillId) {
        alert('Por favor selecciona un usuario y una habilidad');
        return;
    }

    displayResponse('ordersResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: parseInt(userId),
                skill_id: parseInt(skillId),
                quantity: 1
            })
        });
        const data = await response.json();
        displayResponse('ordersResponse', data, response.ok ? 'success' : 'error');

        if (response.ok) {
            document.getElementById('orderUserId').value = '';
            document.getElementById('orderSkillId').value = '';
            updateStats();
        }
    } catch (error) {
        displayResponse('ordersResponse', { error: error.message }, 'error');
    }
}

// USER SKILLS ENDPOINT
async function getUserSkills() {
    const id = document.getElementById('userSkillsId').value;
    if (!id) {
        alert('Por favor ingresa el ID del usuario');
        return;
    }

    displayResponse('userSkillsResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}/users/${id}/skills`);
        const data = await response.json();
        displayResponse('userSkillsResponse', data, response.ok ? 'success' : 'error');
    } catch (error) {
        displayResponse('userSkillsResponse', { error: error.message }, 'error');
    }
}

// GATEWAY ENDPOINTS
async function getGatewayHealth() {
    displayResponse('infoResponse', {}, 'success', true);
    try {
        const response = await fetch('/health');
        const data = await response.json();
        displayResponse('infoResponse', data, response.ok ? 'success' : 'error');
    } catch (error) {
        displayResponse('infoResponse', { error: error.message }, 'error');
    }
}

async function getGatewayInfo() {
    displayResponse('infoResponse', {}, 'success', true);
    try {
        const response = await fetch(`${API_BASE}`);
        const data = await response.json();
        displayResponse('infoResponse', data, response.ok ? 'success' : 'error');
    } catch (error) {
        displayResponse('infoResponse', { error: error.message }, 'error');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadDropdowns();
});
