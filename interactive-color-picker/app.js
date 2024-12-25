
        // Get DOM elements
        const colorDisplay = document.getElementById('colorDisplay');
        const rgbControls = document.getElementById('rgbControls');
        const hslControls = document.getElementById('hslControls');
        const tabs = document.querySelectorAll('.tab');
        
        // RGB sliders
        const redSlider = document.getElementById('redSlider');
        const greenSlider = document.getElementById('greenSlider');
        const blueSlider = document.getElementById('blueSlider');
        
        // HSL sliders
        const hueSlider = document.getElementById('hueSlider');
        const satSlider = document.getElementById('satSlider');
        const lightSlider = document.getElementById('lightSlider');
        
        // Value displays
        const redValue = document.getElementById('redValue');
        const greenValue = document.getElementById('greenValue');
        const blueValue = document.getElementById('blueValue');
        const hueValue = document.getElementById('hueValue');
        const satValue = document.getElementById('satValue');
        const lightValue = document.getElementById('lightValue');
        
        // Color code displays
        const hexCode = document.getElementById('hexCode');
        const rgbCode = document.getElementById('rgbCode');
        const hslCode = document.getElementById('hslCode');
        
        // Convert RGB to HSL
        function rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
        }

        // Convert HSL to RGB
        function hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        // Convert RGB to HEX
        function rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }

        // Update color display and codes
        function updateColor() {
            const r = parseInt(redSlider.value);
            const g = parseInt(greenSlider.value);
            const b = parseInt(blueSlider.value);
            const [h, s, l] = rgbToHsl(r, g, b);

            colorDisplay.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            hexCode.textContent = rgbToHex(r, g, b);
            rgbCode.textContent = `rgb(${r}, ${g}, ${b})`;
            hslCode.textContent = `hsl(${h}, ${s}%, ${l}%)`;

            // Update HSL sliders without triggering their change events
            if (!hslControls.contains(document.activeElement)) {
                hueSlider.value = h;
                satSlider.value = s;
                lightSlider.value = l;
                hueValue.textContent = h + '°';
                satValue.textContent = s + '%';
                lightValue.textContent = l + '%';
            }
        }

        // Update from HSL controls
        function updateFromHSL() {
            const h = parseInt(hueSlider.value);
            const s = parseInt(satSlider.value);
            const l = parseInt(lightSlider.value);
            const [r, g, b] = hslToRgb(h, s, l);

            // Update RGB sliders without triggering their change events
            if (!rgbControls.contains(document.activeElement)) {
                redSlider.value = r;
                greenSlider.value = g;
                blueSlider.value = b;
                redValue.textContent = r;
                greenValue.textContent = g;
                blueValue.textContent = b;
            }

            colorDisplay.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
            hexCode.textContent = rgbToHex(r, g, b);
            rgbCode.textContent = `rgb(${r}, ${g}, ${b})`;
            hslCode.textContent = `hsl(${h}, ${s}%, ${l}%)`;
        }

        // Event listeners for RGB sliders
        [redSlider, greenSlider, blueSlider].forEach(slider => {
            slider.addEventListener('input', function() {
                const valueDisplay = document.getElementById(this.id.replace('Slider', 'Value'));
                valueDisplay.textContent = this.value;
                updateColor();
            });
        });

        // Event listeners for HSL sliders
        [hueSlider, satSlider, lightSlider].forEach(slider => {
            slider.addEventListener('input', function() {
                const valueDisplay = document.getElementById(this.id.replace('Slider', 'Value'));
                valueDisplay.textContent = this.value + (this.id === 'hueSlider' ? '°' : '%');
                updateFromHSL();
            });
        });

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                if (this.dataset.mode === 'rgb') {
                    rgbControls.style.display = 'block';
                    hslControls.style.display = 'none';
                } else {
                    rgbControls.style.display = 'none';
                    hslControls.style.display = 'block';
                }
            });
        });

        // Copy button functionality
        const copyButton = document.getElementById('copyButton');
        copyButton.addEventListener('click', function() {
            const colorCode = hexCode.textContent;
            navigator.clipboard.writeText(colorCode).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1500);
            });
        });

        // Initialize color display
        updateColor();