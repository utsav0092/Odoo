// Main application logic
class ReWearApp {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('rewear_items')) || [];
        this.swaps = JSON.parse(localStorage.getItem('rewear_swaps')) || [];
        this.init();
    }

    init() {
        // Initialize based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
            case '':
                this.initHomePage();
                break;
            case 'browse.html':
                this.initBrowsePage();
                break;
            case 'add-item.html':
                this.initAddItemPage();
                break;
            case 'item-detail.html':
                this.initItemDetailPage();
                break;
            case 'dashboard.html':
                this.initDashboardPage();
                break;
            case 'admin.html':
                this.initAdminPage();
                break;
        }

        // Initialize common features
        this.updateStats();
    }

    initHomePage() {
        this.loadFeaturedItems();
        this.animateStats();
    }

    loadFeaturedItems() {
        const carousel = document.getElementById('featured-carousel');
        if (!carousel) return;

        // Get available items (max 6 for homepage)
        const availableItems = this.items.filter(item => item.status === 'available').slice(0, 6);
        
        if (availableItems.length === 0) {
            carousel.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted); font-size: 1.1rem;">No items available yet. Be the first to list an item!</p>
                    <a href="add-item.html" class="btn btn-primary" style="margin-top: 1rem;">List an Item</a>
                </div>
            `;
            return;
        }

        carousel.innerHTML = availableItems.map(item => this.createItemCard(item)).join('');
        
        // Add click handlers for item cards
        carousel.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                window.location.href = `item-detail.html?id=${itemId}`;
            });
        });
    }

    createItemCard(item) {
        const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
        
        return `
            <div class="item-card fade-in" data-item-id="${item.id}">
                <img src="${imageUrl}" alt="${item.title}" class="item-image" onerror="this.src='https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'">
                <div class="item-content">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-meta">
                        <span class="item-category">${item.category}</span>
                        <span class="item-size">Size ${item.size}</span>
                    </div>
                    <p class="item-description">${item.description}</p>
                    <div class="item-footer">
                        <div class="item-points">
                            <i class="fas fa-coins"></i>
                            <span>${item.points} points</span>
                        </div>
                        <span class="item-status status-${item.status}">${this.getStatusLabel(item.status)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusLabel(status) {
        const labels = {
            available: 'Available',
            requested: 'Requested',
            swapped: 'Swapped'
        };
        return labels[status] || status;
    }

    animateStats() {
        const totalSwaps = document.getElementById('total-swaps');
        const totalUsers = document.getElementById('total-users');
        const totalItems = document.getElementById('total-items');

        if (totalSwaps) totalSwaps.textContent = this.swaps.length;
        if (totalUsers) totalUsers.textContent = JSON.parse(localStorage.getItem('rewear_users') || '[]').length;
        if (totalItems) totalItems.textContent = this.items.length;
    }

    updateStats() {
        this.animateStats();
    }

    initBrowsePage() {
        if (!document.getElementById('items-grid')) return;
        
        this.loadAllItems();
        this.setupFilters();
        this.setupSearch();
    }

    loadAllItems(filteredItems = null) {
        const grid = document.getElementById('items-grid');
        const itemsToShow = filteredItems || this.items.filter(item => item.status === 'available');
        
        if (itemsToShow.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted); font-size: 1.1rem;">No items found matching your criteria.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = itemsToShow.map(item => this.createItemCard(item)).join('');
        
        // Add click handlers
        grid.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                window.location.href = `item-detail.html?id=${itemId}`;
            });
        });
    }

    setupFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const sizeFilter = document.getElementById('size-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (!categoryFilter) return;

        [categoryFilter, sizeFilter, sortFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', debounce(() => this.applyFilters(), 300));
    }

    applyFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const sizeFilter = document.getElementById('size-filter');
        const sortFilter = document.getElementById('sort-filter');

        let filteredItems = this.items.filter(item => item.status === 'available');

        // Apply search filter
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filteredItems = filteredItems.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Apply category filter
        if (categoryFilter && categoryFilter.value) {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter.value);
        }

        // Apply size filter
        if (sizeFilter && sizeFilter.value) {
            filteredItems = filteredItems.filter(item => item.size === sizeFilter.value);
        }

        // Apply sorting
        if (sortFilter && sortFilter.value) {
            switch (sortFilter.value) {
                case 'newest':
                    filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'oldest':
                    filteredItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    break;
                case 'points-low':
                    filteredItems.sort((a, b) => a.points - b.points);
                    break;
                case 'points-high':
                    filteredItems.sort((a, b) => b.points - a.points);
                    break;
            }
        }

        this.loadAllItems(filteredItems);
    }

    initAddItemPage() {
        if (!auth.requireAuth()) return;
        
        this.setupImageUpload();
        this.setupAddItemForm();
    }

    setupImageUpload() {
        const imageInput = document.getElementById('images');
        const imagePreview = document.getElementById('image-preview');
        
        if (!imageInput || !imagePreview) return;

        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            imagePreview.innerHTML = '';

            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'image-preview-item';
                        imageContainer.innerHTML = `
                            <img src="${e.target.result}" alt="Preview ${index + 1}">
                            <button type="button" class="remove-image" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        imagePreview.appendChild(imageContainer);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Remove image functionality
        imagePreview.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-image') || e.target.parentElement.classList.contains('remove-image')) {
                const button = e.target.classList.contains('remove-image') ? e.target : e.target.parentElement;
                const index = parseInt(button.dataset.index);
                
                // Remove from file input
                const dt = new DataTransfer();
                const files = Array.from(imageInput.files);
                files.forEach((file, i) => {
                    if (i !== index) dt.items.add(file);
                });
                imageInput.files = dt.files;
                
                // Trigger change event to refresh preview
                imageInput.dispatchEvent(new Event('change'));
            }
        });
    }

    setupAddItemForm() {
        const form = document.getElementById('add-item-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddItem(form);
        });
    }

    async handleAddItem(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.btn[type="submit"]');
        
        try {
            submitBtn.textContent = 'Adding Item...';
            submitBtn.disabled = true;

            // Process images
            const images = [];
            const imageFiles = form.querySelector('#images').files;
            
            for (let file of imageFiles) {
                if (file.type.startsWith('image/')) {
                    const base64 = await this.fileToBase64(file);
                    images.push(base64);
                }
            }

            // Create item object
            const item = {
                id: Date.now().toString(),
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                size: formData.get('size'),
                type: formData.get('type'),
                condition: formData.get('condition'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                images: images,
                points: parseInt(formData.get('points')),
                userId: auth.getCurrentUser().id,
                userEmail: auth.getCurrentUser().email,
                userName: auth.getCurrentUser().name,
                status: 'available',
                createdAt: new Date().toISOString()
            };

            // Save item
            this.items.push(item);
            localStorage.setItem('rewear_items', JSON.stringify(this.items));

            // Award points to user
            const currentUser = auth.getCurrentUser();
            auth.updateUserPoints(currentUser.id, currentUser.points + 50);

            // Show success message
            this.showNotification('Item added successfully! You earned 50 points.', 'success');
            
            // Reset form
            form.reset();
            document.getElementById('image-preview').innerHTML = '';
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            this.showNotification('Error adding item: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = 'Add Item';
            submitBtn.disabled = false;
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    initItemDetailPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        
        if (!itemId) {
            window.location.href = 'browse.html';
            return;
        }

        const item = this.items.find(i => i.id === itemId);
        if (!item) {
            window.location.href = 'browse.html';
            return;
        }

        this.displayItemDetails(item);
        this.setupItemActions(item);
    }

    displayItemDetails(item) {
        // Update page title
        document.title = `${item.title} - ReWear`;

        // Display images
        const imageGallery = document.getElementById('image-gallery');
        if (imageGallery && item.images && item.images.length > 0) {
            imageGallery.innerHTML = item.images.map((image, index) => 
                `<img src="${image}" alt="${item.title} ${index + 1}" class="gallery-image ${index === 0 ? 'active' : ''}">`
            ).join('');
        }

        // Display item information
        const elements = {
            'item-title': item.title,
            'item-category': item.category,
            'item-size': item.size,
            'item-type': item.type,
            'item-condition': item.condition,
            'item-description': item.description,
            'item-points': item.points,
            'item-status': this.getStatusLabel(item.status),
            'owner-name': item.userName,
            'owner-email': item.userEmail
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Display tags
        const tagsContainer = document.getElementById('item-tags');
        if (tagsContainer && item.tags) {
            tagsContainer.innerHTML = item.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        }

        // Update status styling
        const statusElement = document.getElementById('item-status');
        if (statusElement) {
            statusElement.className = `item-status status-${item.status}`;
        }
    }

    setupItemActions(item) {
        const requestSwapBtn = document.getElementById('request-swap-btn');
        const redeemPointsBtn = document.getElementById('redeem-points-btn');
        const currentUser = auth.getCurrentUser();

        // Hide buttons if not logged in or if it's the user's own item
        if (!currentUser || currentUser.id === item.userId) {
            if (requestSwapBtn) requestSwapBtn.style.display = 'none';
            if (redeemPointsBtn) redeemPointsBtn.style.display = 'none';
            return;
        }

        // Hide buttons if item is not available
        if (item.status !== 'available') {
            if (requestSwapBtn) requestSwapBtn.style.display = 'none';
            if (redeemPointsBtn) redeemPointsBtn.style.display = 'none';
            return;
        }

        // Setup button event listeners
        if (requestSwapBtn) {
            requestSwapBtn.addEventListener('click', () => this.requestSwap(item));
        }

        if (redeemPointsBtn) {
            redeemPointsBtn.addEventListener('click', () => this.redeemWithPoints(item));
            
            // Disable if user doesn't have enough points
            if (currentUser.points < item.points) {
                redeemPointsBtn.disabled = true;
                redeemPointsBtn.textContent = `Not Enough Points (${currentUser.points}/${item.points})`;
            }
        }
    }

    requestSwap(item) {
        if (!auth.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        const confirmed = confirm(`Request a swap for "${item.title}"? The owner will be notified.`);
        if (!confirmed) return;

        // Create swap request
        const swap = {
            id: Date.now().toString(),
            itemId: item.id,
            requesterId: auth.getCurrentUser().id,
            requesterName: auth.getCurrentUser().name,
            ownerId: item.userId,
            ownerName: item.userName,
            itemTitle: item.title,
            status: 'pending',
            type: 'swap',
            createdAt: new Date().toISOString()
        };

        this.swaps.push(swap);
        localStorage.setItem('rewear_swaps', JSON.stringify(this.swaps));

        // Update item status
        item.status = 'requested';
        localStorage.setItem('rewear_items', JSON.stringify(this.items));

        this.showNotification('Swap request sent! The owner will be notified.', 'success');
        
        // Refresh page
        setTimeout(() => location.reload(), 1500);
    }

    redeemWithPoints(item) {
        const currentUser = auth.getCurrentUser();
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        if (currentUser.points < item.points) {
            this.showNotification('You don\'t have enough points for this item.', 'error');
            return;
        }

        const confirmed = confirm(`Redeem "${item.title}" for ${item.points} points?`);
        if (!confirmed) return;

        // Deduct points from user
        auth.updateUserPoints(currentUser.id, currentUser.points - item.points);

        // Create swap record
        const swap = {
            id: Date.now().toString(),
            itemId: item.id,
            requesterId: currentUser.id,
            requesterName: currentUser.name,
            ownerId: item.userId,
            ownerName: item.userName,
            itemTitle: item.title,
            status: 'completed',
            type: 'points',
            points: item.points,
            createdAt: new Date().toISOString()
        };

        this.swaps.push(swap);
        localStorage.setItem('rewear_swaps', JSON.stringify(this.swaps));

        // Update item status
        item.status = 'swapped';
        localStorage.setItem('rewear_items', JSON.stringify(this.items));

        this.showNotification('Item redeemed successfully!', 'success');
        
        // Refresh page
        setTimeout(() => location.reload(), 1500);
    }

    initDashboardPage() {
        if (!auth.requireAuth()) return;
        
        this.loadUserProfile();
        this.loadUserItems();
        this.loadUserSwaps();
    }

    loadUserProfile() {
        const user = auth.getCurrentUser();
        if (!user) return;

        const elements = {
            'user-name-display': user.name,
            'user-email-display': user.email,
            'user-points-display': user.points,
            'user-member-since': new Date(user.createdAt).toLocaleDateString()
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    loadUserItems() {
        const container = document.getElementById('user-items');
        if (!container) return;

        const userItems = this.items.filter(item => item.userId === auth.getCurrentUser().id);
        
        if (userItems.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted);">You haven't listed any items yet.</p>
                    <a href="add-item.html" class="btn btn-primary" style="margin-top: 1rem;">Add Your First Item</a>
                </div>
            `;
            return;
        }

        container.innerHTML = userItems.map(item => this.createItemCard(item)).join('');
        
        // Add click handlers
        container.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                window.location.href = `item-detail.html?id=${itemId}`;
            });
        });
    }

    loadUserSwaps() {
        const container = document.getElementById('user-swaps');
        if (!container) return;

        const userId = auth.getCurrentUser().id;
        const userSwaps = this.swaps.filter(swap => 
            swap.requesterId === userId || swap.ownerId === userId
        );
        
        if (userSwaps.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted);">No swap history yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userSwaps.map(swap => this.createSwapCard(swap, userId)).join('');
    }

    createSwapCard(swap, currentUserId) {
        const isRequester = swap.requesterId === currentUserId;
        const otherUserName = isRequester ? swap.ownerName : swap.requesterName;
        const statusClass = swap.status === 'completed' ? 'success' : 
                           swap.status === 'pending' ? 'warning' : 'error';

        return `
            <div class="swap-card">
                <div class="swap-header">
                    <h4>${swap.itemTitle}</h4>
                    <span class="swap-status status-${statusClass}">${swap.status}</span>
                </div>
                <div class="swap-details">
                    <p><strong>Type:</strong> ${swap.type === 'points' ? 'Points Redemption' : 'Direct Swap'}</p>
                    <p><strong>${isRequester ? 'Owner' : 'Requester'}:</strong> ${otherUserName}</p>
                    ${swap.points ? `<p><strong>Points:</strong> ${swap.points}</p>` : ''}
                    <p><strong>Date:</strong> ${new Date(swap.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    }

    initAdminPage() {
        if (!auth.requireAdmin()) return;
        
        this.loadAdminStats();
        this.loadAllItemsForAdmin();
        this.loadAllUsersForAdmin();
    }

    loadAdminStats() {
        const users = JSON.parse(localStorage.getItem('rewear_users')) || [];
        
        const elements = {
            'admin-total-users': users.length,
            'admin-total-items': this.items.length,
            'admin-total-swaps': this.swaps.length,
            'admin-pending-swaps': this.swaps.filter(s => s.status === 'pending').length
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    loadAllItemsForAdmin() {
        const container = document.getElementById('admin-items');
        if (!container) return;

        container.innerHTML = this.items.map(item => this.createAdminItemCard(item)).join('');
    }

    createAdminItemCard(item) {
        return `
            <div class="admin-item-card">
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>Owner: ${item.userName} (${item.userEmail})</p>
                    <p>Status: <span class="status-${item.status}">${this.getStatusLabel(item.status)}</span></p>
                    <p>Created: ${new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-primary" onclick="window.open('item-detail.html?id=${item.id}', '_blank')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteItem('${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    loadAllUsersForAdmin() {
        const container = document.getElementById('admin-users');
        if (!container) return;

        const users = JSON.parse(localStorage.getItem('rewear_users')) || [];
        
        container.innerHTML = users.map(user => `
            <div class="admin-user-card">
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>Email: ${user.email}</p>
                    <p>Points: ${user.points}</p>
                    <p>Items Listed: ${this.items.filter(item => item.userId === user.id).length}</p>
                    <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="admin-actions">
                    ${!user.isAdmin ? `<button class="btn btn-danger" onclick="app.deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>` : '<span class="admin-badge">Admin</span>'}
                </div>
            </div>
        `).join('');
    }

    deleteItem(itemId) {
        if (!auth.requireAdmin()) return;
        
        const confirmed = confirm('Are you sure you want to delete this item?');
        if (!confirmed) return;

        this.items = this.items.filter(item => item.id !== itemId);
        localStorage.setItem('rewear_items', JSON.stringify(this.items));

        this.showNotification('Item deleted successfully.', 'success');
        this.loadAllItemsForAdmin();
        this.loadAdminStats();
    }

    deleteUser(userId) {
        if (!auth.requireAdmin()) return;
        
        const confirmed = confirm('Are you sure you want to delete this user? This will also delete all their items.');
        if (!confirmed) return;

        // Remove user
        const users = JSON.parse(localStorage.getItem('rewear_users')) || [];
        const updatedUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('rewear_users', JSON.stringify(updatedUsers));

        // Remove user's items
        this.items = this.items.filter(item => item.userId !== userId);
        localStorage.setItem('rewear_items', JSON.stringify(this.items));

        this.showNotification('User and their items deleted successfully.', 'success');
        this.loadAllUsersForAdmin();
        this.loadAllItemsForAdmin();
        this.loadAdminStats();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 90px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-medium);
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 500px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all var(--transition-medium);
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .notification-success {
                    background-color: var(--success-color);
                    color: white;
                }
                .notification-error {
                    background-color: var(--error-color);
                    color: white;
                }
                .notification-info {
                    background-color: var(--secondary-color);
                    color: white;
                }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0.8;
                }
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ReWearApp();
});