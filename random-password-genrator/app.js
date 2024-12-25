
        // Get DOM elements
        const passwordOutput = document.getElementById('passwordOutput');
        const lengthSlider = document.getElementById('lengthSlider');
        const lengthValue = document.getElementById('lengthValue');
        const generateBtn = document.getElementById('generateBtn');
        const copyBtn = document.getElementById('copyBtn');
        const strengthFill = document.getElementById('strengthFill');
        const toast = document.getElementById('toast');

        // Character sets
        const charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        // Update length value display
        lengthSlider.addEventListener('input', () => {
            lengthValue.textContent = lengthSlider.value;
        });

        // Generate password
        function generatePassword() {
            const length = parseInt(lengthSlider.value);
            let chars = '';
            let password = '';

            // Build character set based on selected options
            if (document.getElementById('uppercase').checked) chars += charSets.uppercase;
            if (document.getElementById('lowercase').checked) chars += charSets.lowercase;
            if (document.getElementById('numbers').checked) chars += charSets.numbers;
            if (document.getElementById('symbols').checked) chars += charSets.symbols;

            // Validate that at least one character set is selected
            if (chars.length === 0) {
                alert('Please select at least one character set');
                return;
            }

            // Generate password
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * chars.length);
                password += chars[randomIndex];
            }

            // Ensure password contains at least one character from each selected set
            const types = {
                uppercase: document.getElementById('uppercase').checked,
                lowercase: document.getElementById('lowercase').checked,
                numbers: document.getElementById('numbers').checked,
                symbols: document.getElementById('symbols').checked
            };

            let isValid = true;
            Object.entries(types).forEach(([type, selected]) => {
                if (selected) {
                    const hasType = [...password].some(char => charSets[type].includes(char));
                    if (!hasType) isValid = false;
                }
            });

            // If password doesn't meet requirements, generate a new one
            if (!isValid) return generatePassword();

            passwordOutput.value = password;
            updateStrengthMeter(password);
        }

        // Update strength meter
        function updateStrengthMeter(password) {
            let strength = 0;
            const checks = {
                length: password.length >= 12,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                numbers: /[0-9]/.test(password),
                symbols: /[^A-Za-z0-9]/.test(password)
            };

            // Calculate strength percentage
            strength = Object.values(checks).filter(Boolean).length * 20;

            // Update strength bar
            strengthFill.style.width = `${strength}%`;
            
            // Set color based on strength
            if (strength <= 20) {
                strengthFill.style.backgroundColor = '#ff4444';
            } else if (strength <= 40) {
                strengthFill.style.backgroundColor = '#ffa700';
            } else if (strength <= 60) {
                strengthFill.style.backgroundColor = '#ffdd00';
            } else if (strength <= 80) {
                strengthFill.style.backgroundColor = '#9acd32';
            } else {
                strengthFill.style.backgroundColor = '#4CAF50';
            }
        }

        // Copy password to clipboard
        function copyToClipboard() {
            if (!passwordOutput.value) return;
            
            navigator.clipboard.writeText(passwordOutput.value)
                .then(() => {
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy password:', err);
                });
        }

        // Event listeners
        generateBtn.addEventListener('click', generatePassword);
        copyBtn.addEventListener('click', copyToClipboard);

        // Generate initial password
        generatePassword();