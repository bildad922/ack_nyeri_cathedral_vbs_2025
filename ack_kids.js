
        // Global variables
        let children = [];
        let registrationData = {};
        let nextRegistrationNumber = 1;
        let selectedPaymentMethod = '';
        let paymentAmount = 0;

        // Countdown Timer
        function updateCountdown() {
            const eventDate = new Date('November 24, 2025 08:00:00').getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.querySelector('.countdown-title').textContent = ' VBS 2025 is Here! ';
                document.querySelector('.countdown-timer').innerHTML = '<div style="font-size: 1.2em;">Join us now at ACK St Peters Church!</div>';
            }
        }

        const countdownTimer = setInterval(updateCountdown, 1000);
        updateCountdown();

        // Background image slider
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
        }
        
        setInterval(nextSlide, 4000);

        // Section navigation
        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            setTimeout(() => {
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Update progress bar
                    updateProgressBar(sectionId);
                }
            }, 300);
        }

        function updateProgressBar(sectionId) {
            const steps = document.querySelectorAll('.progress-step');
            steps.forEach(step => step.classList.remove('active'));
            
            switch(sectionId) {
                case 'part1':
                    steps[0].classList.add('active');
                    break;
                case 'part2':
                    steps[0].classList.add('active');
                    steps[1].classList.add('active');
                    break;
                case 'part3':
                    steps[0].classList.add('active');
                    steps[1].classList.add('active');
                    steps[2].classList.add('active');
                    break;
                case 'success':
                    steps.forEach(step => step.classList.add('active'));
                    break;
            }
        }

        // Children management functions
        function addChild(childData = null) {
            const childId = children.length;
            const childItem = document.createElement('div');
            childItem.className = 'child-item';
            childItem.innerHTML = `
                <h4>Child ${childId + 1}</h4>
                <div class="form-group">
                    <label><em>Child's Full Name *</em></label>
                    <input type="text" class="child-name" required placeholder="Enter child's name" value="${childData ? childData.name : ''}">
                </div>
                <div class="form-group">
                    <label><em>Child's Age *</em></label>
                    <input type="number" class="child-age" min="4" max="17" required placeholder="Age between 4-17" value="${childData ? childData.age : ''}">
                </div>
                <div class="form-group">
                    <label><em>Allergies or Medical Conditions</em></label>
                    <textarea class="child-allergies" rows="2" placeholder="List any allergies or medical conditions...">${childData ? childData.allergies : ''}</textarea>
                </div>
                ${childId > 0 ? '<button type="button" class="remove-child-btn" onclick="removeChild(' + childId + ')">Remove Child</button>' : ''}
            `;
            document.getElementById('childrenList').appendChild(childItem);
            
            if (!childData) {
                children.push({ name: '', age: '', allergies: '' });
            }
        }

        function removeChild(index) {
            children.splice(index, 1);
            updateChildrenList();
        }

        function updateChildrenList() {
            const childrenList = document.getElementById('childrenList');
            childrenList.innerHTML = '';
            children.forEach((child, index) => {
                addChild(child);
            });
            updatePaymentInfo();
        }

        function validateChildren() {
            const childNames = document.querySelectorAll('.child-name');
            const childAges = document.querySelectorAll('.child-age');
            
            let valid = true;
            children = [];
            
            childNames.forEach((nameInput, index) => {
                const ageInput = childAges[index];
                if (!nameInput.value.trim() || !ageInput.value) {
                    valid = false;
                    alert('Please fill in all required fields for all children');
                    return;
                }
                
                const age = parseInt(ageInput.value);
                if (age < 4 || age > 17) {
                    valid = false;
                    alert('Child age must be between 4 and 17 years');
                    return;
                }
                
                children.push({
                    name: nameInput.value.trim(),
                    age: age,
                    allergies: document.querySelectorAll('.child-allergies')[index].value
                });
            });
            
            if (valid && children.length > 0) {
                updatePaymentInfo();
                showSection('part2');
            }
        }

        function updatePaymentInfo() {
            const childrenCount = children.length;
            paymentAmount = childrenCount * 200;
            
            document.getElementById('childrenCount').textContent = childrenCount;
            document.getElementById('totalAmount').textContent = paymentAmount;
            document.getElementById('phoneAmount').textContent = paymentAmount;
            document.getElementById('paybillAmount').textContent = paymentAmount;
        }

        // Payment option selection
        function selectPaymentOption(option) {
            selectedPaymentMethod = option;
            document.querySelectorAll('.payment-option').forEach(el => {
                el.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
            
            // Show payment confirmation fields for M-Pesa options
            if (option === 'phone' || option === 'paybill') {
                document.getElementById('paymentConfirmation').style.display = 'block';
            } else {
                document.getElementById('paymentConfirmation').style.display = 'none';
            }
        }

        function revealPaymentNumber(type) {
            event.stopPropagation();
            
            if (type === 'phone') {
                document.getElementById('paymentNumber').textContent = '0113071937';
                document.getElementById('phoneDetails').style.display = 'block';
            } else if (type === 'paybill') {
                document.getElementById('businessNumber').textContent = '247247';
                document.getElementById('accountNumber').textContent = '1260184135227';
                document.getElementById('paybillDetails').style.display = 'block';
            }
        }

        function processPayment() {
            if (!selectedPaymentMethod) {
                alert('Please select a payment method');
                return;
            }
            
            if ((selectedPaymentMethod === 'phone' || selectedPaymentMethod === 'paybill')) {
                const payerName = document.getElementById('payerName').value;
                const payerPhone = document.getElementById('payerPhone').value;
                
                if (!payerName || !payerPhone) {
                    alert('Please enter your name and phone number for payment confirmation');
                    return;
                }
                
                if (!validatePhone(payerPhone)) {
                    alert('Please enter a valid phone number');
                    return;
                }
                
                // Simulate payment processing
                simulatePaymentProcessing();
            } else {
                // Pay at church
                showSection('part3');
            }
        }

        function simulatePaymentProcessing() {
            const button = document.querySelector('#part2 .btn-primary');
            const originalText = button.innerHTML;
            button.innerHTML = '<em>Processing Payment...</em>';
            button.disabled = true;
            
            // Simulate API call to payment gateway
            setTimeout(() => {
                alert(`Payment of KSh ${paymentAmount} initiated successfully! Please complete the payment on your phone.`);
                
                // Mark as paid
                registrationData.paymentStatus = 'pending';
                registrationData.paymentAmount = paymentAmount;
                registrationData.paymentMethod = selectedPaymentMethod;
                
                showSection('part3');
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        }

        function payLater() {
            if (children.length === 0) {
                alert('Please add at least one child before proceeding');
                return;
            }
            
            const reminder = `Please remember to pay KSh ${paymentAmount} at the church office before the event to secure your child's registration.`;
            alert(reminder);
            
            registrationData.paymentStatus = 'pending';
            registrationData.paymentAmount = paymentAmount;
            registrationData.paymentMethod = 'church';
            
            showSection('part3');
        }

        function validatePhone(phone) {
            const phoneRegex = /^[0-9]{10}$/;
            return phoneRegex.test(phone);
        }

        function completeRegistration() {
            const parentName = document.getElementById('parentName').value;
            const parentPhone = document.getElementById('parentPhone').value;
            const emergencyName = document.getElementById('emergencyName').value;
            const emergencyPhone = document.getElementById('emergencyPhone').value;
            const relationship = document.getElementById('relationship').value;
            
            if (!parentName || !parentPhone || !emergencyName || !emergencyPhone || !relationship) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (!validatePhone(parentPhone) || !validatePhone(emergencyPhone)) {
                alert('Please enter valid phone numbers');
                return;
            }
            
            registrationData = {
                parentName: parentName,
                parentPhone: parentPhone,
                emergencyName: emergencyName,
                emergencyPhone: emergencyPhone,
                relationship: relationship,
                children: children,
                registrationDate: new Date().toLocaleDateString(),
                registrationNumbers: [],
                paymentStatus: registrationData.paymentStatus || 'pending',
                paymentAmount: registrationData.paymentAmount || paymentAmount,
                paymentMethod: registrationData.paymentMethod || 'church'
            };
            
            // Generate sequential registration numbers
            registrationData.children.forEach((child, index) => {
                const regNumber = nextRegistrationNumber++;
                registrationData.registrationNumbers.push(regNumber);
            });
            
            // Save to localStorage for persistence
            localStorage.setItem('vbs2025_next_registration_number', nextRegistrationNumber.toString());
            
            generateRegistrationCards();
            updatePaymentStatusReminder();
            showSection('success');
            
            // Auto-send reminder message based on payment status
            sendAutomaticReminder();
        }

        function updatePaymentStatusReminder() {
            const reminder = document.getElementById('paymentStatusReminder');
            if (registrationData.paymentStatus === 'pending') {
                reminder.innerHTML = `
                    <div class="reminder-title">💰 Payment Pending</div>
                    <div class="reminder-message">
                        <strong>Amount Due: KSh ${registrationData.paymentAmount}</strong><br>
                        Please complete your payment to secure your child's spot.<br>
                        <strong>Payment Options:</strong><br>
                        • M-Pesa: 0113071937<br>
                        • PayBill: 247247 (Account: 1260184135227)<br>
                        • Cash at Church Office
                    </div>
                `;
            } else {
                reminder.innerHTML = `
                    <div class="reminder-title"> Payment Received</div>
                    <div class="reminder-message">
                        Thank you for your payment! Your registration is now complete.
                    </div>
                `;
                reminder.style.background = 'linear-gradient(45deg, #d4edda, #c3e6cb)';
                reminder.style.borderColor = '#28a745';
            }
        }

        function sendAutomaticReminder() {
            const parentPhone = registrationData.parentPhone;
            const paymentStatus = registrationData.paymentStatus;
            const amountDue = registrationData.paymentAmount;
            
            let message = '';
            
            if (paymentStatus === 'pending') {
                message = `Dear ${registrationData.parentName}, thank you for registering your child for VBS 2025! Your payment of KSh ${amountDue} is pending. Please complete payment to secure registration. - ACK St Peters Nyeri`;
            } else {
                message = `Dear ${registrationData.parentName}, thank you for completing registration! We look forward to seeing your child at VBS 2025 from November 24-29. - ACK St Peters Nyeri`;
            }
            
            // Simulate SMS sending (in production, integrate with SMS API)
            console.log(`SMS to ${parentPhone}: ${message}`);
            
            // You can integrate with Twilio, Africa's Talking, or other SMS services here
            // Example:
            // fetch('/api/send-sms', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ to: parentPhone, message: message })
            // });
        }

        function generateRegistrationCards() {
            const container = document.getElementById('registrationCardsContainer');
            container.innerHTML = '';
            
            registrationData.children.forEach((child, index) => {
                const card = document.createElement('div');
                card.className = 'registration-card';
                card.id = `card-${index}`;
                
                const initials = child.name.split(' ').map(n => n[0]).join('').toUpperCase();
                const regNumber = registrationData.registrationNumbers[index];
                const formattedNumber = regNumber.toString().padStart(3, '0');
                
                card.innerHTML = `
                    <div class="card-header">
                        <h3>VBS 2025</h3>
                        <div class="church-name">ACK St Peters Nyeri</div>
                    </div>
                    <div class="child-initials">${initials}</div>
                    <div class="card-details">
                        <p><strong>Child's Name:</strong> ${child.name}</p>
                        <p><strong>Age:</strong> ${child.age} years</p>
                        <p><strong>Parent's Name:</strong> ${registrationData.parentName}</p>
                        <p><strong>Parent's Contact:</strong> ${registrationData.parentPhone}</p>
                        <p><strong>Emergency Phone:</strong> ${registrationData.emergencyPhone}</p>
                        <p><strong>Registration ID:</strong> ${formattedNumber}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function downloadAllCards() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            const cardPromises = [];
            
            registrationData.children.forEach((child, index) => {
                const cardElement = document.getElementById(`card-${index}`);
                const promise = html2canvas(cardElement, { 
                    scale: 2, useCORS: true, logging: false 
                }).then(canvas => canvas.toDataURL('image/png'));
                cardPromises.push(promise);
            });
            
            Promise.all(cardPromises).then(images => {
                images.forEach((imgData, index) => {
                    if (index > 0) pdf.addPage();
                    const imgWidth = 180;
                    const imgHeight = (imgWidth * 4) / 3;
                    const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
                    const y = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;
                    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                });
                
                const parentName = registrationData.parentName.replace(/\s+/g, '_');
                pdf.save(`VBS_2025_Registration_Cards_${parentName}.pdf`);
                alert('All registration cards downloaded as a single PDF file.');
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            });
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Load next registration number from localStorage
            const savedNumber = localStorage.getItem('vbs2025_next_registration_number');
            nextRegistrationNumber = savedNumber ? parseInt(savedNumber) : 1;
            
            // Add first child by default
            addChild();
            
            // Form animations
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;
                        if (target.classList.contains('active')) {
                            const formGroups = target.querySelectorAll('.form-group');
                            formGroups.forEach((group, index) => {
                                group.style.animationDelay = `${(index + 1) * 0.1}s`;
                            });
                        }
                    }
                });
            });
            
            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section, { attributes: true });
            });
        });