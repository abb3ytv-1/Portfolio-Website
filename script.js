document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Show project details
            const overlay = this.querySelector('.overlay');
            overlay.style.display = 'block';
        });
    });

    // Fetch testimonials from an API or use hardcoded data
    const testimonials = [
        { name: 'Client 1', text: 'Testimonial 1' },
        { name: 'Client 2', text: 'Testimonial 2' },
        // Add more testimonials as needed
    ];

    const testimonialContainer = document.querySelector('.testimonial-carousel');

    testimonials.forEach(testimonial => {
        const testimonialDiv = document.createElement('div');
        testimonialDiv.classList.add('testimonial');
        testimonialDiv.innerHTML = `
            <p>${testimonial.text}</p>
            <span>- ${testimonial.name}</span>
        `;
        testimonialContainer.appendChild(testimonialDiv);
    });
});
