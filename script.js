document.addEventListener('DOMContentLoaded', () => {

    // --- GitHub Portfolio Fetching ---
    const projectsGrid = document.getElementById('projects-grid');

    // Specific repositories to feature
    const repoUrls = [
        'https://api.github.com/repos/oussamazaidi11/commerce-app',
        'https://api.github.com/repos/oussamazaidi11/chatroom',
        'https://api.github.com/repos/oussamazaidi11/angular'
    ];

    Promise.all(repoUrls.map(url => fetch(url).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${url}`);
        return res.json();
    })))
        .then(repos => {
            repos.forEach((repo, index) => {
                // Custom overrides
                if (repo.name === 'angular') {
                    repo.name = 'Wallpaper Engine';
                }

                const card = createProjectCard(repo, index);
                projectsGrid.appendChild(card);
            });

            // Re-run observer for new elements
            observeElements();
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            projectsGrid.innerHTML = '<p class="text-red-400 text-center col-span-2">Failed to load projects from GitHub. Please check the console for details.</p>';
        });

    function createProjectCard(repo, index) {
        const div = document.createElement('div');
        // Add reveal class and delay
        div.className = `bg-card-bg rounded-2xl p-6 border border-white/5 hover:border-neon-blue/50 transition-all duration-300 group hover:-translate-y-2 reveal delay-${(index + 1) * 100}`;

        // Random gradient for placeholder image if no image
        const gradients = [
            'from-neon-blue to-blue-600',
            'from-neon-purple to-purple-600',
            'from-neon-green to-green-600',
            'from-pink-500 to-rose-500'
        ];
        const gradient = gradients[index % gradients.length];

        div.innerHTML = `
            <div class="h-48 rounded-xl bg-gradient-to-br ${gradient} mb-6 relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-shadow">
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="${repo.html_url}" target="_blank" class="px-6 py-2 bg-white text-black font-bold rounded-full transform scale-90 group-hover:scale-100 transition-transform">View Code</a>
                </div>
                <div class="absolute bottom-4 left-4">
                     <span class="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        ${repo.language || 'Code'}
                     </span>
                </div>
            </div>
            <h3 class="text-2xl font-bold font-heading mb-3 group-hover:text-neon-blue transition-colors">${repo.name}</h3>
            <p class="text-gray-400 text-sm mb-6 line-clamp-3">
                ${repo.description || 'No description available for this project.'}
            </p>
            <a href="${repo.html_url}" target="_blank" class="inline-flex items-center text-neon-blue hover:text-white transition-colors">
                Read More <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </a>
        `;
        return div;
    }

    // --- Scroll Reveal Animation ---
    function observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Initial observation
    observeElements();

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Contact Form Handling ---
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});
