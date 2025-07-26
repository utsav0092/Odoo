// Authentication system using localStorage
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('rewear_users')) || [];
        this.init();
    }

    init() {
        // Check if user is logged in
        const token = localStorage.getItem('rewear_token');
        if (token) {
            this.currentUser = JSON.parse(localStorage.getItem('rewear_current_user'));
            this.updateNavigation();
        }

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Logout functionality
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                e.preventDefault();
                this.logout();
            }
        });

        // User dropdown toggle
        const userBtn = document.getElementById('user-btn');
        const dropdownContent = document.getElementById('dropdown-content');

        if (userBtn && dropdownContent) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdownContent.classList.remove('show');
            });
        }

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            points: 100, // Starting points
            createdAt: new Date().toISOString(),
            isAdmin: userData.email === 'admin@rewear.com'
        };

        this.users.push(newUser);
        localStorage.setItem('rewear_users', JSON.stringify(this.users));

        return newUser;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Generate simple token
        const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

        // Store auth data
        localStorage.setItem('rewear_token', token);
        localStorage.setItem('rewear_current_user', JSON.stringify(user));

        this.currentUser = user;
        return user;
    }

    logout() {
        localStorage.removeItem('rewear_token');
        localStorage.removeItem('rewear_current_user');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    }

    updateUserPoints(userId, points) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            this.users[userIndex].points = points;
            localStorage.setItem('rewear_users', JSON.stringify(this.users));

            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser.points = points;
                localStorage.setItem('rewear_current_user', JSON.stringify(this.currentUser));
                this.updateNavigation();
            }
        }
    }

    updateNavigation() {
        const navAuth = document.getElementById('nav-auth');
        const navUser = document.getElementById('nav-user');
        const userNameSpan = document.getElementById('user-name');
        const userPointsSpan = document.getElementById('user-points');
        const dashboardLink = document.getElementById('dashboard-link');
        const adminLink = document.getElementById('admin-link');

        if (this.isLoggedIn()) {
            if (navAuth) navAuth.style.display = 'none';
            if (navUser) navUser.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = this.currentUser.name;
            if (userPointsSpan) userPointsSpan.textContent = this.currentUser.points;
            if (dashboardLink) dashboardLink.style.display = 'block';

            // Show admin link if user is admin
            if (adminLink) {
                adminLink.style.display = this.isAdmin() ? 'block' : 'none';
                adminLink.href = 'admin.html';
            }
        } else {
            if (navAuth) navAuth.style.display = 'flex';
            if (navUser) navUser.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    }

    // Redirect if not logged in
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Redirect if not admin
    requireAdmin() {
        if (!this.requireAuth() || !this.isAdmin()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

// Initialize auth system
const auth = new AuthSystem();