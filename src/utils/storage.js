// This file is now deprecated. Use databaseServices.uploadFile from supabaseServices.js instead.

// Utility function to sanitize HTML content
export const sanitizeHtml = (html) => {
    if (!html) return '';
    
    // Create a new div element
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove potentially dangerous attributes from all elements
    const elements = div.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        // Remove event handlers
        const attrs = element.attributes;
        for (let j = attrs.length - 1; j >= 0; j--) {
            const attrName = attrs[j].name;
            if (attrName.startsWith('on')) {
                element.removeAttribute(attrName);
            }
        }
        
        // Remove javascript: URLs
        if (element.href && element.href.toLowerCase().startsWith('javascript:')) {
            element.removeAttribute('href');
        }
        
        // Remove data: URLs from images
        if (element.tagName === 'IMG' && element.src && element.src.toLowerCase().startsWith('data:')) {
            element.removeAttribute('src');
        }
    }
    
    return div.innerHTML;
};