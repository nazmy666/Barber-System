// Barber Shop Appointment System
document.addEventListener('DOMContentLoaded', () => {
    // Data Storage in LocalStorage
    const USERS_STORAGE_KEY = 'barber_shop_users';
    const APPOINTMENTS_STORAGE_KEY = 'barber_shop_appointments';
    const CURRENT_USER_KEY = 'barber_shop_current_user';

    // DOM Elements
    // Navigation
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const clientBtn = document.getElementById('clientBtn');
    const barberBtn = document.getElementById('barberBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Profile Elements
    const clientProfilePhoto = document.getElementById('clientProfilePhoto');
    const barberProfilePhoto = document.getElementById('barberProfilePhoto');
    const clientPhotoUpload = document.getElementById('clientPhotoUpload');
    const barberPhotoUpload = document.getElementById('barberPhotoUpload');
    const clientProfileName = document.getElementById('clientProfileName');
    const barberProfileName = document.getElementById('barberProfileName');
    const clientProfileEmail = document.getElementById('clientProfileEmail');
    const barberProfileEmail = document.getElementById('barberProfileEmail');
    const clientProfilePhone = document.getElementById('clientProfilePhone');
    const barberProfilePhone = document.getElementById('barberProfilePhone');

    // Panels
    const authPanel = document.getElementById('authPanel');
    const clientPanel = document.getElementById('clientPanel');
    const barberPanel = document.getElementById('barberPanel');

    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const appointmentForm = document.getElementById('appointmentForm');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const bookingForm = document.getElementById('bookingForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const cancelBooking = document.getElementById('cancelBooking');

    // Barber selection and booking
    const barbersContainer = document.getElementById('barbersContainer');
    const selectedBarberName = document.getElementById('selectedBarberName');
    const serviceSelect = document.getElementById('service');
    const appointmentDateInput = document.getElementById('appointmentDate');
    const appointmentTimeSelect = document.getElementById('appointmentTime');

    // Appointment containers
    const clientAppointments = document.getElementById('clientAppointments');
    const pendingAppointments = document.getElementById('pendingAppointments');
    const acceptedAppointments = document.getElementById('acceptedAppointments');
    const rejectedAppointments = document.getElementById('rejectedAppointments');

    // State
    let currentUser = null;
    let selectedBarber = null;
    let barbers = [];
    let users = [];
    let appointments = [];

    // Initialize
    function init() {
        loadUsers();
        loadAppointments();
        loadCurrentUser();
        setupEventListeners();
        setMinDate();
        generateBarbers();
    }

    // Set minimum date for appointment booking to today
    function setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        appointmentDateInput.min = today;
    }

    // Generate sample barbers if none exist
    function generateBarbers() {
        // Filter users who are barbers
        barbers = users.filter(user => user.role === 'Barber');

        // If no barbers exist, create some sample ones
        if (barbers.length === 0) {
            const sampleBarbers = [
                {
                    id: Date.now(),
                    name: 'John Smith',
                    email: 'john@example.com',
                    password: 'password123',
                    phone: '555-123-4567',
                    role: 'Barber',
                    image: 'https://randomuser.me/api/portraits/men/32.jpg',
                    services: ['Haircut', 'Shave', 'Beard Trim'],
                    availableTimes: [
                        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                        '16:00', '16:30', '17:00'
                    ]
                },
                {
                    id: Date.now() + 1,
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    password: 'password123',
                    phone: '555-987-6543',
                    role: 'Barber',
                    image: 'https://randomuser.me/api/portraits/women/44.jpg',
                    services: ['Haircut', 'Hair Coloring', 'Full Package'],
                    availableTimes: [
                        '10:00', '10:30', '11:00', '11:30', '12:00',
                        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
                    ]
                },
                {
                    id: Date.now() + 2,
                    name: 'Mike Williams',
                    email: 'mike@example.com',
                    password: 'password123',
                    phone: '555-567-1234',
                    role: 'Barber',
                    image: 'https://randomuser.me/api/portraits/men/59.jpg',
                    services: ['Haircut', 'Shave', 'Beard Trim', 'Hair Coloring'],
                    availableTimes: [
                        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                        '13:00', '13:30', '14:00', '14:30', '15:00'
                    ]
                }
            ];

            // Add sample barbers to users
            users = [...users, ...sampleBarbers];
            saveUsers();
            barbers = sampleBarbers;
        }

        // Render barbers in client panel
        renderBarbers();
    }

    // Data Management Functions
    function loadUsers() {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        users = storedUsers ? JSON.parse(storedUsers) : [];
    }

    function saveUsers() {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    function loadAppointments() {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        appointments = storedAppointments ? JSON.parse(storedAppointments) : [];
    }

    function saveAppointments() {
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    }

    function loadCurrentUser() {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            updateUIForLoggedInUser();
        } else {
            updateUIForLoggedOutUser();
        }
    }

    function saveCurrentUser() {
        if (currentUser) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    }

    // Authentication Functions
    function login(email, password) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            saveCurrentUser();
            updateUIForLoggedInUser();
            showNotification(`Welcome back, ${user.name}!`);
            return true;
        } else {
            showNotification('Invalid email or password', true);
            return false;
        }
    }

    function register(name, email, phone, password, role) {
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showNotification('Email already registered', true);
            return false;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password, // In a real app, this should be hashed
            role
        };

        // Add image and available times for barbers
        if (role === 'Barber') {
            newUser.image = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`;
            newUser.services = ['Haircut', 'Shave', 'Beard Trim'];
            newUser.availableTimes = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                '16:00', '16:30', '17:00'
            ];
        }

        // Add user to users array
        users.push(newUser);
        saveUsers();

        // Set as current user and update UI
        currentUser = newUser;
        saveCurrentUser();
        updateUIForLoggedInUser();
        showNotification('Registration successful!');

        // Regenerate barbers list if new barber was added
        if (role === 'Barber') {
            barbers.push(newUser);
            renderBarbers();
        }

        return true;
    }

    function logout() {
        currentUser = null;
        selectedBarber = null;
        saveCurrentUser();
        updateUIForLoggedOutUser();
        showNotification('Logged out successfully');
    }

    // UI Management Functions
    function updateUIForLoggedInUser() {
        // Hide auth buttons, show logout
        loginBtn.classList.remove('active');
        registerBtn.classList.remove('active');
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');

        // Show appropriate panel based on role
        authPanel.classList.remove('active');
        authPanel.classList.add('hidden');

        if (currentUser.role === 'Client') {
            clientBtn.classList.remove('hidden');
            clientBtn.classList.add('active');
            barberBtn.classList.add('hidden');
            clientPanel.classList.remove('hidden');
            clientPanel.classList.add('active');
            barberPanel.classList.add('hidden');
            
            // Update client profile info
            updateClientProfileInfo();
            renderBarbers();
            renderClientAppointments();
        } else if (currentUser.role === 'Barber') {
            barberBtn.classList.remove('hidden');
            barberBtn.classList.add('active');
            clientBtn.classList.add('hidden');
            barberPanel.classList.remove('hidden');
            barberPanel.classList.add('active');
            clientPanel.classList.add('hidden');
            
            // Update barber profile info
            updateBarberProfileInfo();
            renderBarberAppointments();
        }
    }
    
    // Update client profile information
    function updateClientProfileInfo() {
        clientProfileName.textContent = `Welcome, ${currentUser.name}`;
        clientProfileEmail.textContent = `Email: ${currentUser.email}`;
        clientProfilePhone.textContent = `Phone: ${currentUser.phone}`;
        
        // Set profile photo if it exists
        if (currentUser.photo) {
            clientProfilePhoto.src = currentUser.photo;
        } else {
            clientProfilePhoto.src = 'https://via.placeholder.com/150';
        }
    }
    
    // Update barber profile information
    function updateBarberProfileInfo() {
        barberProfileName.textContent = `Welcome, ${currentUser.name}`;
        barberProfileEmail.textContent = `Email: ${currentUser.email}`;
        barberProfilePhone.textContent = `Phone: ${currentUser.phone}`;
        
        // Set profile photo if it exists
        if (currentUser.photo) {
            barberProfilePhoto.src = currentUser.photo;
        } else if (currentUser.image) {
            // Use the image from barber data if exists
            barberProfilePhoto.src = currentUser.image;
        } else {
            barberProfilePhoto.src = 'https://via.placeholder.com/150';
        }
    }

    function updateUIForLoggedOutUser() {
        // Show auth buttons, hide user-specific buttons
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        clientBtn.classList.add('hidden');
        barberBtn.classList.add('hidden');

        // Show auth panel, hide user panels
        authPanel.classList.add('active');
        authPanel.classList.remove('hidden');
        clientPanel.classList.add('hidden');
        clientPanel.classList.remove('active');
        barberPanel.classList.add('hidden');
        barberPanel.classList.remove('active');

        // Reset forms
        loginForm.reset();
        registerForm.reset();
        appointmentForm.reset();
    }

    function showLoginForm() {
        loginFormContainer.classList.remove('hidden');
        registerFormContainer.classList.add('hidden');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    }

    function showRegisterForm() {
        registerFormContainer.classList.remove('hidden');
        loginFormContainer.classList.add('hidden');
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }

    // Photo Upload Functions
    function handlePhotoUpload(file, isClient = true) {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('Please select a valid image file', true);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const photoData = event.target.result;
            
            if (isClient) {
                currentUser.photo = photoData;
                clientProfilePhoto.src = photoData;
            } else {
                currentUser.photo = photoData;
                barberProfilePhoto.src = photoData;
                
                // If barber, also update the barber's image in the barbers array
                const barberIndex = barbers.findIndex(b => b.id === currentUser.id);
                if (barberIndex !== -1) {
                    barbers[barberIndex].image = photoData;
                }
            }
            
            // Update user in users array and save to localStorage
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                saveUsers();
                saveCurrentUser();
                showNotification('Profile photo updated successfully');
            }
        };
        
        reader.readAsDataURL(file);
    }

    // Notification Function
    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('hidden', 'error', 'show');
        
        if (isError) {
            notification.classList.add('error');
        }
        
        // Force repaint
        notification.offsetWidth;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Barber Rendering and Selection
    function renderBarbers() {
        barbersContainer.innerHTML = '';
        
        barbers.forEach(barber => {
            const barberCard = document.createElement('div');
            barberCard.classList.add('barber-card');
            barberCard.innerHTML = `
                <img src="${barber.image || barber.photo || 'https://via.placeholder.com/150'}" alt="${barber.name}" class="barber-image">
                <div class="barber-info">
                    <h4>${barber.name}</h4>
                    <div class="barber-services">
                        <strong>Services:</strong> ${barber.services.join(', ')}
                    </div>
                </div>
            `;
            
            barberCard.addEventListener('click', () => selectBarber(barber));
            barbersContainer.appendChild(barberCard);
        });
    }

    function selectBarber(barber) {
        selectedBarber = barber;
        selectedBarberName.textContent = barber.name;
        bookingForm.classList.remove('hidden');
        
        // Update service options based on barber's services
        updateServiceOptions();
        
        // Clear time and date selections
        appointmentDateInput.value = '';
        appointmentTimeSelect.innerHTML = '<option value="">Select Time</option>';
    }

    function updateServiceOptions() {
        // Reset service select
        serviceSelect.innerHTML = '<option value="">Select Service</option>';
        
        // Add barber's services as options
        if (selectedBarber && selectedBarber.services) {
            selectedBarber.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                serviceSelect.appendChild(option);
            });
        }
    }

    function updateAvailableTimes() {
        // Get selected date
        const selectedDate = appointmentDateInput.value;
        if (!selectedDate || !selectedBarber) return;
        
        // Reset time select
        appointmentTimeSelect.innerHTML = '<option value="">Select Time</option>';
        
        // Get all appointments for this barber on this date
        const bookedTimes = appointments
            .filter(app => 
                app.barber_id === selectedBarber.id && 
                app.date === selectedDate &&
                (app.status === 'Pending' || app.status === 'Accepted')
            )
            .map(app => app.time);
        
        // Add available times
        const availableTimes = selectedBarber.availableTimes.filter(time => !bookedTimes.includes(time));
        availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            appointmentTimeSelect.appendChild(option);
        });
    }

    // Appointment Management
    function createAppointment(date, time, service) {
        if (!currentUser || !selectedBarber) {
            showNotification('Please log in and select a barber', true);
            return false;
        }
        
        const newAppointment = {
            id: Date.now(),
            client_id: currentUser.id,
            client_name: currentUser.name,
            client_phone: currentUser.phone,
            barber_id: selectedBarber.id,
            barber_name: selectedBarber.name,
            date: date,
            time: time,
            service: service,
            status: 'Pending',
            created_at: new Date().toISOString()
        };
        
        appointments.push(newAppointment);
        saveAppointments();
        renderClientAppointments();
        
        return true;
    }

    function updateAppointmentStatus(appointmentId, status) {
        const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = status;
            saveAppointments();
            renderBarberAppointments();
            return true;
        }
        
        return false;
    }

    function renderClientAppointments() {
        if (!currentUser || currentUser.role !== 'Client') return;
        
        // Get appointments for current client
        const clientApps = appointments.filter(app => app.client_id === currentUser.id);
        clientAppointments.innerHTML = '';
        
        if (clientApps.length === 0) {
            clientAppointments.innerHTML = '<p class="no-appointments">You have no appointments yet.</p>';
            return;
        }
        
        // Sort by date and time
        clientApps.sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return a.date.localeCompare(b.date);
        });
        
        // Render appointments
        clientApps.forEach(app => {
            const appointmentItem = document.createElement('div');
            appointmentItem.classList.add('appointment-item');
            
            appointmentItem.innerHTML = `
                <div class="appointment-details">
                    <p><strong>Barber:</strong> ${app.barber_name}</p>
                    <p><strong>Service:</strong> ${app.service}</p>
                    <p><strong>Date:</strong> ${formatDate(app.date)}</p>
                    <p><strong>Time:</strong> ${app.time}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></p>
                </div>
            `;
            
            clientAppointments.appendChild(appointmentItem);
        });
    }

    function renderBarberAppointments() {
        if (!currentUser || currentUser.role !== 'Barber') return;
        
        // Get appointments for current barber
        const barberApps = appointments.filter(app => app.barber_id === currentUser.id);
        
        // Group by status
        const pendingApps = barberApps.filter(app => app.status === 'Pending');
        const acceptedApps = barberApps.filter(app => app.status === 'Accepted');
        const rejectedApps = barberApps.filter(app => app.status === 'Rejected');
        
        // Sort by date and time
        const sortByDateTime = (a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return a.date.localeCompare(b.date);
        };
        
        pendingApps.sort(sortByDateTime);
        acceptedApps.sort(sortByDateTime);
        rejectedApps.sort(sortByDateTime);
        
        // Render pending appointments
        renderAppointmentsList(pendingAppointments, pendingApps, true);
        renderAppointmentsList(acceptedAppointments, acceptedApps, false);
        renderAppointmentsList(rejectedAppointments, rejectedApps, false);
    }

    function renderAppointmentsList(container, appointmentsList, includeActions) {
        container.innerHTML = '';
        
        if (appointmentsList.length === 0) {
            container.innerHTML = '<p class="no-appointments">No appointments in this category.</p>';
            return;
        }
        
        appointmentsList.forEach(app => {
            const appointmentItem = document.createElement('div');
            appointmentItem.classList.add('appointment-item');
            
            appointmentItem.innerHTML = `
                <div class="appointment-details">
                    <p><strong>Client:</strong> ${app.client_name}</p>
                    <p><strong>Phone:</strong> ${app.client_phone}</p>
                    <p><strong>Service:</strong> ${app.service}</p>
                    <p><strong>Date:</strong> ${formatDate(app.date)}</p>
                    <p><strong>Time:</strong> ${app.time}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></p>
                </div>
            `;
            
            if (includeActions) {
                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('appointment-actions');
                
                const acceptBtn = document.createElement('button');
                acceptBtn.classList.add('btn', 'primary-btn');
                acceptBtn.textContent = 'Accept';
                acceptBtn.addEventListener('click', () => {
                    updateAppointmentStatus(app.id, 'Accepted');
                    showNotification('Appointment accepted');
                });
                
                const rejectBtn = document.createElement('button');
                rejectBtn.classList.add('btn', 'secondary-btn');
                rejectBtn.textContent = 'Reject';
                rejectBtn.addEventListener('click', () => {
                    updateAppointmentStatus(app.id, 'Rejected');
                    showNotification('Appointment rejected');
                });
                
                actionsDiv.appendChild(acceptBtn);
                actionsDiv.appendChild(rejectBtn);
                appointmentItem.appendChild(actionsDiv);
            }
            
            container.appendChild(appointmentItem);
        });
    }

    // Helper Functions
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Event Listeners
    function setupEventListeners() {
        // Form submission
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            login(email, password);
        });
        
        registerForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const role = document.getElementById('registerRole').value;
            
            if (!name || !email || !phone || !password || !role) {
                showNotification('Please fill all fields', true);
                return;
            }
            
            register(name, email, phone, password, role);
        });
        
        appointmentForm.addEventListener('submit', e => {
            e.preventDefault();
            const service = serviceSelect.value;
            const date = appointmentDateInput.value;
            const time = appointmentTimeSelect.value;
            
            if (!service || !date || !time) {
                showNotification('Please fill all fields', true);
                return;
            }
            
            if (createAppointment(date, time, service)) {
                showNotification('Appointment booked successfully!');
                appointmentForm.reset();
                bookingForm.classList.add('hidden');
            }
        });
        
        // Profile photo upload
        clientPhotoUpload.addEventListener('change', e => {
            if (e.target.files && e.target.files[0]) {
                handlePhotoUpload(e.target.files[0], true);
            }
        });
        
        barberPhotoUpload.addEventListener('change', e => {
            if (e.target.files && e.target.files[0]) {
                handlePhotoUpload(e.target.files[0], false);
            }
        });
        
        // Navigation
        loginBtn.addEventListener('click', showLoginForm);
        registerBtn.addEventListener('click', showRegisterForm);
        switchToRegister.addEventListener('click', e => {
            e.preventDefault();
            showRegisterForm();
        });
        switchToLogin.addEventListener('click', e => {
            e.preventDefault();
            showLoginForm();
        });
        logoutBtn.addEventListener('click', logout);
        
        // Panel navigation
        clientBtn.addEventListener('click', () => {
            barberBtn.classList.remove('active');
            clientBtn.classList.add('active');
            barberPanel.classList.add('hidden');
            clientPanel.classList.remove('hidden');
            renderClientAppointments();
        });
        
        barberBtn.addEventListener('click', () => {
            clientBtn.classList.remove('active');
            barberBtn.classList.add('active');
            clientPanel.classList.add('hidden');
            barberPanel.classList.remove('hidden');
            renderBarberAppointments();
        });
        
        // Booking related
        appointmentDateInput.addEventListener('change', updateAvailableTimes);
        cancelBooking.addEventListener('click', () => {
            bookingForm.classList.add('hidden');
            appointmentForm.reset();
        });
        
        // Tab switching for barber appointments
        document.querySelectorAll('.appointments-tabs .tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                const status = tab.getAttribute('data-status');
                const tabsContainer = tab.closest('.appointments-tabs');
                
                // Update active tab
                tabsContainer.querySelectorAll('.tab-btn').forEach(t => {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
                
                // Show relevant appointment container for barber panel
                if (tabsContainer.closest('#barberPanel')) {
                    pendingAppointments.classList.add('hidden');
                    acceptedAppointments.classList.add('hidden');
                    rejectedAppointments.classList.add('hidden');
                    
                    if (status === 'pending') {
                        pendingAppointments.classList.remove('hidden');
                    } else if (status === 'accepted') {
                        acceptedAppointments.classList.remove('hidden');
                    } else if (status === 'rejected') {
                        rejectedAppointments.classList.remove('hidden');
                    }
                }
            });
        });
    }

    // Initialize the application
    init();
});
