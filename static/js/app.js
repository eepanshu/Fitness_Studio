// Enhanced Fitness Studio Booking System JavaScript
class FitnessStudioApp {
    constructor() {
        this.API_BASE = 'http://localhost:8000';
        this.classes = [];
        this.bookings = [];
        this.isLoading = false;
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.setupEventListeners();
        this.loadClasses();
        this.initializeAnimations();
        this.setupRealTimeUpdates();
    }

    // Create floating particles for background animation
    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Initialize smooth animations
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card, .table').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    // Setup real-time updates
    setupRealTimeUpdates() {
        setInterval(() => {
            if (!this.isLoading) {
                this.loadClasses();
            }
        }, 30000);

        this.addTypingIndicators();
    }

    addTypingIndicators() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('typing');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('typing');
            });
        });
    }

    setupEventListeners() {
        const addClassForm = document.getElementById('add-class-form');
        if (addClassForm) {
            addClassForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addClass();
            });
        }

        const bookClassForm = document.getElementById('book-class-form');
        if (bookClassForm) {
            bookClassForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.bookClass();
            });
        }

        this.setupFormValidation();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            this.addSuccessAnimation(field);
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            this.addErrorAnimation(field);
        }
    }

    addSuccessAnimation(element) {
        element.style.animation = 'successPulse 0.5s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    addErrorAnimation(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Enhanced alert system with animations
    showAlert(message, type = 'success', duration = 5000) {
        const alertContainer = document.getElementById('alert-container');
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        
        const icons = {
            success: 'fas fa-check-circle',
            danger: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        alertDiv.innerHTML = `
            <i class="${icons[type] || icons.info} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        alertContainer.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.transform = 'translateX(0)';
            alertDiv.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            this.removeAlert(alertDiv);
        }, duration);
    }

    removeAlert(alertDiv) {
        alertDiv.style.transform = 'translateX(100%)';
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }

    async loadClasses() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loading = document.getElementById('classes-loading');
        const content = document.getElementById('classes-content');
        
        if (loading && content) {
            loading.style.display = 'block';
            content.style.display = 'none';
        }

        try {
            const response = await fetch(`${this.API_BASE}/classes`);
            if (response.ok) {
                this.classes = await response.json();
                this.displayClasses();
                this.updateBookingClassOptions();
                this.addTableRowAnimations();
            } else {
                this.showAlert('Failed to load classes', 'danger');
            }
        } catch (error) {
            this.showAlert('Error loading classes: ' + error.message, 'danger');
        } finally {
            this.isLoading = false;
            if (loading && content) {
                loading.style.display = 'none';
                content.style.display = 'block';
            }
        }
    }

    addTableRowAnimations() {
        const rows = document.querySelectorAll('#classes-tbody tr');
        rows.forEach((row, index) => {
            row.style.animationDelay = `${index * 0.1}s`;
            row.style.animation = 'slideInLeft 0.5s ease-out forwards';
        });
    }

    displayClasses() {
        const tbody = document.getElementById('classes-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        this.classes.forEach((classItem, index) => {
            const row = document.createElement('tr');
            const date = new Date(classItem.date_time);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            row.innerHTML = `
                <td><strong>${classItem.name}</strong></td>
                <td>${classItem.instructor}</td>
                <td>${formattedDate}</td>
                <td>
                    <span class="badge ${classItem.available_slots > 0 ? 'bg-success' : 'bg-danger'}">
                        ${classItem.available_slots} available
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="app.editClass('${classItem.id}')" title="Edit Class">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteClass('${classItem.id}')" title="Delete Class">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            row.style.animationDelay = `${index * 0.1}s`;
            tbody.appendChild(row);
        });
    }

    updateBookingClassOptions() {
        const select = document.getElementById('booking-class-id');
        if (!select) return;
        
        select.innerHTML = '<option value="">Choose a class...</option>';
        
        this.classes.forEach(classItem => {
            if (classItem.available_slots > 0) {
                const option = document.createElement('option');
                option.value = classItem.id;
                option.textContent = `${classItem.name} - ${classItem.instructor} (${classItem.available_slots} slots)`;
                select.appendChild(option);
            }
        });
    }

    async addClass() {
        const formData = this.getFormData('add-class-form');
        if (!formData) return;

        const classData = {
            name: formData.name,
            instructor: formData.instructor,
            date_time: `${formData.date}T${formData.time}:00+05:30`,
            total_slots: parseInt(formData.slots),
            duration_minutes: parseInt(formData.duration)
        };

        try {
            const response = await fetch(`${this.API_BASE}/classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(classData)
            });

            if (response.ok) {
                this.showAlert('Class added successfully! 🎉', 'success');
                document.getElementById('add-class-form').reset();
                this.loadClasses();
                this.addSuccessConfetti();
            } else {
                // Handle different response types
                const contentType = response.headers.get('content-type');
                let error;
                
                if (contentType && contentType.includes('application/json')) {
                    error = await response.json();
                    this.showAlert('Failed to add class: ' + (error.detail || 'Unknown error'), 'danger');
                } else {
                    const textError = await response.text();
                    console.error('Non-JSON error response:', textError);
                    this.showAlert('Failed to add class. Please check your input.', 'danger');
                }
            }
        } catch (error) {
            console.error('Add class error:', error);
            this.showAlert('Error adding class: ' + error.message, 'danger');
        }
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    editClass(classId) {
        const classItem = this.classes.find(c => c.id === classId);
        if (classItem) {
            document.getElementById('edit-class-id').value = classId;
            document.getElementById('edit-class-name').value = classItem.name;
            document.getElementById('edit-class-instructor').value = classItem.instructor;
            document.getElementById('edit-class-slots').value = classItem.available_slots;
            
            const modal = new bootstrap.Modal(document.getElementById('editClassModal'));
            modal.show();
        }
    }

    async updateClass() {
        const classId = document.getElementById('edit-class-id').value;
        const name = document.getElementById('edit-class-name').value;
        const instructor = document.getElementById('edit-class-instructor').value;
        const slots = document.getElementById('edit-class-slots').value;

        const classData = {
            name: name,
            instructor: instructor,
            available_slots: parseInt(slots)
        };

        try {
            const response = await fetch(`${this.API_BASE}/classes/${classId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(classData)
            });

            if (response.ok) {
                this.showAlert('Class updated successfully! ✨', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editClassModal')).hide();
                this.loadClasses();
            } else {
                const error = await response.json();
                this.showAlert('Failed to update class: ' + (error.detail || 'Unknown error'), 'danger');
            }
        } catch (error) {
            this.showAlert('Error updating class: ' + error.message, 'danger');
        }
    }

    async deleteClass(classId) {
        if (confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            try {
                const response = await fetch(`${this.API_BASE}/classes/${classId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.showAlert('Class deleted successfully! 🗑️', 'success');
                    this.loadClasses();
                } else {
                    const error = await response.json();
                    this.showAlert('Failed to delete class: ' + (error.detail || 'Unknown error'), 'danger');
                }
            } catch (error) {
                this.showAlert('Error deleting class: ' + error.message, 'danger');
            }
        }
    }

    async bookClass() {
        const formData = this.getFormData('book-class-form');
        if (!formData) return;

        const bookingData = {
            class_id: formData['booking-class-id'], // Keep as string since backend expects string
            client_name: formData['booking-client-name'],
            client_email: formData['booking-client-email']
        };

        try {
            const response = await fetch(`${this.API_BASE}/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                this.showAlert('Class booked successfully! 🎯', 'success');
                document.getElementById('book-class-form').reset();
                this.loadClasses();
                this.addSuccessConfetti();
            } else {
                // Handle different response types
                const contentType = response.headers.get('content-type');
                let error;
                
                if (contentType && contentType.includes('application/json')) {
                    error = await response.json();
                    this.showAlert('Failed to book class: ' + (error.detail || 'Unknown error'), 'danger');
                } else {
                    const textError = await response.text();
                    console.error('Non-JSON error response:', textError);
                    this.showAlert('Failed to book class. Please try again.', 'danger');
                }
            }
        } catch (error) {
            this.showAlert('Error booking class: ' + error.message, 'danger');
        }
    }

    async getBookings() {
        const email = document.getElementById('booking-email').value;
        if (!email) {
            this.showAlert('Please enter an email address', 'warning');
            return;
        }

        const loading = document.getElementById('bookings-loading');
        const content = document.getElementById('bookings-content');
        
        if (loading && content) {
            loading.style.display = 'block';
            content.style.display = 'none';
        }

        try {
            const response = await fetch(`${this.API_BASE}/bookings?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                this.bookings = await response.json();
                this.displayBookings();
            } else {
                this.showAlert('Failed to load bookings', 'danger');
            }
        } catch (error) {
            this.showAlert('Error loading bookings: ' + error.message, 'danger');
        } finally {
            if (loading && content) {
                loading.style.display = 'none';
                content.style.display = 'block';
            }
        }
    }

    displayBookings() {
        const tbody = document.getElementById('bookings-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (this.bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No bookings found for this email</td></tr>';
            return;
        }

        this.bookings.forEach((booking, index) => {
            const row = document.createElement('tr');
            const date = new Date(booking.booking_date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            row.innerHTML = `
                <td><strong>${booking.client_name}</strong></td>
                <td>${booking.client_email}</td>
                <td>${booking.class_name}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteBooking('${booking.id}')" title="Cancel Booking">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            row.style.animationDelay = `${index * 0.1}s`;
            tbody.appendChild(row);
        });
    }

    async deleteBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                const response = await fetch(`${this.API_BASE}/bookings/${bookingId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.showAlert('Booking cancelled successfully! ✅', 'success');
                    this.getBookings();
                    this.loadClasses();
                } else {
                    const error = await response.json();
                    this.showAlert('Failed to cancel booking: ' + (error.detail || 'Unknown error'), 'danger');
                }
            } catch (error) {
                this.showAlert('Error cancelling booking: ' + error.message, 'danger');
            }
        }
    }

    addSuccessConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 3000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('add-class-tab').click();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                document.getElementById('add-booking-tab').click();
            }
            
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.show');
                modals.forEach(modal => {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                });
            }
        });
    }

    // Enhanced Chatbot functionality
    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        chatbotWindow.classList.toggle('show');
    }

    async sendChatMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        this.addChatMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message with enhanced AI
        const response = await this.processChatMessage(message);
        
        // Remove typing indicator and add response
        this.hideTypingIndicator();
        this.addChatMessage(response, 'bot');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addChatMessage(message, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async processChatMessage(message) {
        const msg = message.toLowerCase();
        
        // Comprehensive fitness knowledge base
        const fitnessKnowledge = {
            workoutTips: {
                beginner: "Start with 3 days/week, 30-45 minutes per session. Focus on basic movements and building consistency.",
                intermediate: "4-5 days/week with a mix of cardio and strength training. Add variety to prevent plateaus.",
                advanced: "5-6 days/week with specialized training splits. Include periodization and recovery protocols."
            },
            nutritionTips: [
                "Eat protein with every meal to support muscle recovery",
                "Time your carbs around workouts for energy and recovery",
                "Stay hydrated - drink at least 8 glasses of water daily",
                "Include healthy fats: avocados, nuts, olive oil, fatty fish",
                "Don't skip breakfast - it kickstarts your metabolism"
            ],
            weightLossTips: [
                "Create a calorie deficit by burning more calories than you consume",
                "Combine cardio with strength training for optimal fat loss",
                "Get 7-9 hours of quality sleep to support metabolism",
                "Focus on whole foods: lean proteins, vegetables, and complex carbs"
            ],
            muscleBuildingTips: [
                "Eat in a slight calorie surplus with adequate protein (1.6-2.2g per kg)",
                "Progressive overload - gradually increase weights, reps, or intensity",
                "Rest is crucial - muscles grow during recovery, not just during workouts",
                "Focus on compound movements: squats, deadlifts, bench press, rows"
            ]
        };

        // Get current classes for context
        let classContext = '';
        if (this.classes.length > 0) {
            const upcomingClasses = this.classes
                .slice(0, 3)
                .map(c => `${c.name} with ${c.instructor}`)
                .join(', ');
            classContext = `Our upcoming classes include: ${upcomingClasses}`;
        }

        // Enhanced greeting responses
        if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
            const greetings = [
                "Hello! I'm your personal fitness assistant 💪 Ready to crush your fitness goals today?",
                "Hey there, fitness champion! How can I help you on your wellness journey?",
                "Hi! Whether you need class info, workout tips, or nutrition advice, I'm here to help! 🏋️‍♀️"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Class information
        if (msg.includes('class') && (msg.includes('what') || msg.includes('available') || msg.includes('upcoming'))) {
            return `${classContext}. Each class is designed by expert instructors to help you reach your fitness goals. Would you like details about a specific class type?`;
        }

        // Booking assistance
        if (msg.includes('book') || msg.includes('reservation')) {
            return "🎯 Ready to book a class? Here's how:\n1. Click the 'Book Class' tab above\n2. Select your preferred class\n3. Enter your name and email\n4. Hit that book button!\n\nPro tip: Book early as popular classes fill up fast!";
        }

        // Weight loss advice
        if (msg.includes('weight loss') || msg.includes('lose weight') || msg.includes('fat loss')) {
            const tips = fitnessKnowledge.weightLossTips.slice(0, 3).join('\n• ');
            return `🎯 Weight loss tips from your fitness coach:\n• ${tips}\n\nOur Zumba Dance and HIIT Training classes are excellent for burning calories!`;
        }

        // Muscle building
        if (msg.includes('muscle') || msg.includes('bulk') || msg.includes('gain weight') || msg.includes('strength')) {
            const tips = fitnessKnowledge.muscleBuildingTips.slice(0, 3).join('\n• ');
            return `💪 Muscle building essentials:\n• ${tips}\n\nOur Strength Training and Pilates classes will help you build lean muscle!`;
        }

        // Nutrition advice
        if (msg.includes('nutrition') || msg.includes('diet') || msg.includes('food') || msg.includes('eating')) {
            const tips = fitnessKnowledge.nutritionTips.slice(0, 3).join('\n• ');
            return `🥗 Nutrition is 70% of your results! Key tips:\n• ${tips}\n\nRemember: You can't out-train a bad diet!`;
        }

        // Workout advice
        if (msg.includes('workout') || msg.includes('exercise') || msg.includes('training')) {
            if (msg.includes('beginner')) {
                return `🌟 New to fitness? ${fitnessKnowledge.workoutTips.beginner}\n\nI recommend starting with our Yoga Basics or Dance Fitness classes!`;
            }
            if (msg.includes('advanced')) {
                return `🔥 Ready for intense training? ${fitnessKnowledge.workoutTips.advanced}\n\nOur HIIT Training and Strength classes are perfect for you!`;
            }
            return `💪 Great question about workouts! ${fitnessKnowledge.workoutTips.intermediate}\n\nWhat's your current fitness level?`;
        }

        // Motivation
        if (msg.includes('motivat') || msg.includes('lazy') || msg.includes('tired')) {
            const quotes = [
                "💪 Remember: You're not just building muscle, you're building character!",
                "🌟 The only bad workout is the one that didn't happen!",
                "🔥 Your body can stand almost anything. It's your mind you have to convince!"
            ];
            return quotes[Math.floor(Math.random() * quotes.length)] + "\n\nWhat's one small action you can take today?";
        }

        // Instructor info
        if (msg.includes('instructor') || msg.includes('teacher')) {
            return `👨‍🏫 Our certified instructors:\n• Sarah Johnson - Yoga specialist (8+ years)\n• Maria Rodriguez - Dance & Zumba expert\n• Mike Chen - HIIT & strength training\n• Emma Wilson - Pilates master\n• David Brown - Strength training expert\n\nAny particular instructor you'd like to know more about?`;
        }

        // Beginner guidance
        if (msg.includes('beginner') || msg.includes('start') || msg.includes('new')) {
            return `🌱 Welcome to your fitness journey! Beginner roadmap:\n1. Start with Yoga Basics or Dance Fitness\n2. Aim for 2-3 classes per week\n3. Focus on form over intensity\n4. Listen to your body\n5. Be patient - results take 4-6 weeks!\n\nWhich class type interests you most?`;
        }

        // Help menu
        if (msg.includes('help')) {
            return `🤖 I'm your comprehensive fitness assistant! I can help with:\n\n📅 Class Information & Booking\n💪 Workout Plans & Tips\n🥗 Nutrition Guidance\n🎯 Goal Setting & Motivation\n👨‍🏫 Instructor Information\n📝 Booking Management\n\nWhat would you like to explore?`;
        }

        // Thank you
        if (msg.includes('thank')) {
            return "You're absolutely welcome! Keep crushing those fitness goals! 💪";
        }

        // Default intelligent response
        return `🤖 I understand you're asking about "${message}". I can help with:\n• Class schedules and bookings\n• Fitness tips and workout advice\n• Nutrition recommendations\n• Instructor information\n• Goal-specific training plans\n\nWhat specific aspect interests you most? 💪`;
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new FitnessStudioApp();
    app.setupKeyboardShortcuts();
});

// Make app globally available for onclick handlers
window.app = app;