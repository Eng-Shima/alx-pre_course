# Responsive Form Validation

A comprehensive, mobile-first form validation system built with vanilla JavaScript, HTML5, and CSS3. This system provides real-time validation with responsive design principles and accessibility features.

## Features

### 🎯 Core Validation Features
- **Real-time validation** - Validates fields as users type
- **Comprehensive field types** - Text, email, phone, password, number, URL, checkbox
- **Password strength indicator** - Visual feedback for password security
- **Confirm password matching** - Ensures passwords match
- **Custom validation rules** - Flexible rule-based validation system
- **Error message display** - Clear, contextual error messages

### 📱 Responsive Design
- **Mobile-first approach** - Optimized for mobile devices
- **Flexible layout** - Adapts to different screen sizes
- **Touch-friendly inputs** - Properly sized for mobile interaction
- **Viewport-aware validation** - Adjusts behavior based on screen size
- **Orientation change support** - Handles device rotation

### ♿ Accessibility Features
- **High contrast mode support** - Respects user's contrast preferences
- **Reduced motion support** - Honors prefers-reduced-motion setting
- **Keyboard navigation** - Full keyboard accessibility
- **Screen reader friendly** - Proper ARIA labels and semantic HTML
- **Focus management** - Logical tab order and focus indicators

### 🎨 Visual Enhancements
- **Smooth animations** - Subtle transitions and micro-interactions
- **Dark mode support** - Automatic dark theme detection
- **Loading states** - Visual feedback during form submission
- **Success animations** - Confirmation feedback
- **Shake animation** - Error state feedback

## File Structure

```
js/
├── index.html          # Main HTML form
├── styles.css          # Responsive CSS styles
├── validation.js       # JavaScript validation logic
└── README.md          # This documentation
```

## Usage

### Basic Setup

1. Open `index.html` in a web browser
2. The validation system initializes automatically
3. Start typing in form fields to see real-time validation

### Running with Local Server

```bash
cd js/
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

### Integration

To integrate into your own project:

1. Include the CSS and JavaScript files:
```html
<link rel="stylesheet" href="styles.css">
<script src="validation.js"></script>
```

2. Create a form with the required structure:
```html
<form id="validationForm">
    <div class="form-group">
        <label for="fieldName">Field Label</label>
        <input type="text" id="fieldName" name="fieldName">
        <span class="error-message" id="fieldNameError"></span>
    </div>
</form>
```

3. Initialize the validator:
```javascript
const validator = new ResponsiveFormValidator('validationForm');
```

## Validation Rules

### Built-in Field Validators

- **Full Name**: Required, minimum 2 characters, letters/spaces/hyphens/apostrophes only
- **Email**: Required, valid email format
- **Phone**: Optional, valid phone number format
- **Password**: Required, minimum 8 characters, must contain lowercase, uppercase, and number
- **Confirm Password**: Required, must match password
- **Age**: Optional, must be between 13-120
- **Website**: Optional, valid URL format with protocol
- **Terms**: Required checkbox agreement

### Password Strength Levels

- **Weak** (Red): Basic requirements not met
- **Medium** (Yellow): Good length and character variety
- **Strong** (Green): Excellent security with all criteria met

## Responsive Breakpoints

- **Desktop**: > 768px - Full layout with larger inputs
- **Tablet**: 481px - 768px - Adjusted spacing and sizing
- **Mobile**: ≤ 480px - Compact layout, touch-optimized

## Browser Support

- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile browsers**: iOS Safari 12+, Chrome Mobile 60+
- **Fallback support**: Graceful degradation for older browsers

## Customization

### Adding New Validation Rules

```javascript
// Add to setupValidators() method
this.validators.customField = {
    element: document.getElementById('customField'),
    errorElement: document.getElementById('customFieldError'),
    rules: [
        { 
            test: (value) => value.length > 0, 
            message: 'Custom field is required' 
        },
        { 
            test: (value) => /custom-regex/.test(value), 
            message: 'Custom format required' 
        }
    ]
};
```

### Styling Customization

Key CSS custom properties for easy theming:

```css
:root {
    --primary-color: #667eea;
    --error-color: #dc3545;
    --success-color: #28a745;
    --border-radius: 8px;
    --transition-speed: 0.3s;
}
```

## API Reference

### ResponsiveFormValidator Class

#### Constructor
- `new ResponsiveFormValidator(formId)` - Initialize validator for form with given ID

#### Methods
- `validateField(fieldName)` - Validate specific field
- `validateAllFields()` - Validate entire form
- `resetForm()` - Reset form and clear validation states
- `showFieldError(fieldName, message)` - Display error for field
- `clearFieldError(fieldName)` - Clear error for field
- `focusFirstError()` - Focus first field with validation error

## Performance Considerations

- **Debounced resize events** - Prevents excessive recalculations
- **Efficient DOM queries** - Elements cached during initialization
- **Minimal reflows** - CSS transforms used for animations
- **Event delegation** - Optimized event handling

## Testing

The form includes various test scenarios:

1. **Required field validation** - Leave required fields empty
2. **Format validation** - Enter invalid email/phone/URL formats
3. **Password strength** - Try different password combinations
4. **Responsive behavior** - Resize browser window or rotate device
5. **Accessibility** - Navigate using keyboard only
6. **Error recovery** - Fix errors and observe validation state changes

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please consider:

1. Accessibility improvements
2. Additional validation rules
3. Performance optimizations
4. Browser compatibility fixes
5. Documentation enhancements