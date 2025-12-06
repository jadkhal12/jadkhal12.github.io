document.addEventListener('DOMContentLoaded', () => {
	// Basic variables
	const body = document.body;
	const themeToggle = document.getElementById('themeToggle');
	const typedEl = document.getElementById('typed');
	const filterBtns = document.querySelectorAll('.filter-btn');
	const projects = document.querySelectorAll('.project');
	const modal = document.getElementById('projectModal');
	const modalTitle = document.getElementById('modalTitle');
	const modalDesc = document.getElementById('modalDesc');
	const modalStack = document.getElementById('modalStack');
	const modalClose = modal ? modal.querySelector('.modal-close') : null;
	const contactForm = document.getElementById('contactForm');
	const copyEmailBtn = document.getElementById('copyEmail');
	const emailAddrEl = document.getElementById('emailAddr');
	const emailAddr = emailAddrEl ? emailAddrEl.textContent.trim() : 'jadkhalil266@gmail.com';
	const bgCanvas = document.getElementById('bgCanvas');
	const menuToggle = document.getElementById('menuToggle');
	const navDrawer = document.getElementById('mainNav');
	const navOverlay = document.getElementById('navOverlay');
	const hero = document.getElementById('hero');

	// Theme persistence + icon
	const setThemeIcon = (el, isLight) => {
		if (!el) return;
		el.textContent = isLight ? '☀' : '☾';
	};

	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'light') body.classList.add('light');
	setThemeIcon(themeToggle, body.classList.contains('light'));

	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const isLight = body.classList.toggle('light');
			themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
			setThemeIcon(themeToggle, isLight);
			localStorage.setItem('theme', isLight ? 'light' : 'dark');
		});
	}

	// Mobile menu toggle
	function toggleMobileMenu(open) {
		if (!navDrawer || !menuToggle) return;

		if (open) {
			navDrawer.setAttribute('aria-hidden', 'false');
			menuToggle.setAttribute('aria-expanded', 'true');
			if (navOverlay) navOverlay.classList.add('active');
			body.classList.add('menu-open');
			body.style.overflow = 'hidden';
		} else {
			navDrawer.setAttribute('aria-hidden', 'true');
			menuToggle.setAttribute('aria-expanded', 'false');
			if (navOverlay) navOverlay.classList.remove('active');
			body.classList.remove('menu-open');
			body.style.overflow = '';
		}
	}

	if (menuToggle && navDrawer) {
		menuToggle.addEventListener('click', (e) => {
			e.stopPropagation();
			const isOpen = navDrawer.getAttribute('aria-hidden') === 'false';
			toggleMobileMenu(!isOpen);
		});
	}

	if (navOverlay) {
		navOverlay.addEventListener('click', () => toggleMobileMenu(false));
	}

	const navCloseBtn = document.querySelector('.nav-close');
	if (navCloseBtn) {
		navCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
	}

	// Smooth scroll
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', e => {
			const href = a.getAttribute('href');
			if (!href || href === '#') return;
			const target = document.querySelector(href);
			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				toggleMobileMenu(false);
			}
		});
	});

	// Escape closes nav + modal
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') {
			if (navDrawer && navDrawer.getAttribute('aria-hidden') === 'false') {
				toggleMobileMenu(false);
			}
			closeModal();
		}
	});

	// Typing effect
	const words = ['mobile apps.', 'efficient algorithms.', 'beautiful UIs.', 'flutter solutions.', 'clean code.'];
	let wI = 0, cI = 0, deleting = false;

	function typeLoop() {
		if (!typedEl) return;
		const word = words[wI];
		if (!deleting) {
			typedEl.textContent = word.slice(0, cI + 1);
			cI++;
			if (cI === word.length) {
				deleting = true;
				setTimeout(typeLoop, 1200);
				return;
			}
		} else {
			typedEl.textContent = word.slice(0, cI - 1);
			cI--;
			if (cI === 0) {
				deleting = false;
				wI = (wI + 1) % words.length;
			}
		}
		setTimeout(typeLoop, deleting ? 40 : 80);
	}
	if (typedEl) typeLoop();

	// Filters
	filterBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			filterBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const f = btn.dataset.filter;
			projects.forEach(p => {
				const cat = p.dataset.category;
				p.style.display = (f === 'all' || cat === f) ? '' : 'none';
			});
		});
	});

	// Project modal
	function openModalFromCard(card) {
		if (!modal) return;
		modalTitle.textContent = card.dataset.title || '';
		modalDesc.textContent = card.dataset.desc || '';
		modalStack.textContent = 'Stack: ' + (card.dataset.stack || '—');
		modal.setAttribute('aria-hidden', 'false');
		const panel = modal.querySelector('.modal-panel');
		if (panel) panel.focus();
	}

	function closeModal() {
		if (modal) modal.setAttribute('aria-hidden', 'true');
	}

	document.querySelectorAll('.open-project').forEach(btn => {
		btn.addEventListener('click', e => {
			const card = e.target.closest('.project');
			if (card) openModalFromCard(card);
		});
	});

	if (modalClose) modalClose.addEventListener('click', closeModal);
	if (modal) {
		modal.addEventListener('click', e => {
			if (e.target.classList.contains('modal-overlay')) closeModal();
		});
	}

	// Image modal (English projects)
	const imageModal = document.getElementById('imageModal');
	const imageModalImg = document.getElementById('imageModalImg');
	const imageModalClose = imageModal ? imageModal.querySelector('.image-modal-close') : null;

	function openImageModal(imageSrc, imageAlt) {
		if (!imageModal) return;
		imageModalImg.src = imageSrc;
		imageModalImg.alt = imageAlt;
		imageModal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
	}

	function closeImageModal() {
		if (!imageModal) return;
		imageModal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
	}

	document.querySelectorAll('.view-image').forEach(btn => {
		btn.addEventListener('click', e => {
			const card = e.target.closest('.english-project-card');
			if (card) {
				const imageSrc = card.dataset.image;
				const imageAlt = card.dataset.imageAlt || 'Project image';
				if (imageSrc) openImageModal(imageSrc, imageAlt);
			}
		});
	});

	if (imageModalClose) imageModalClose.addEventListener('click', closeImageModal);
	if (imageModal) {
		imageModal.addEventListener('click', e => {
			if (e.target.classList.contains('image-modal-overlay')) closeImageModal();
		});
	}

	// Skill bar animation
	const skillBars = document.querySelectorAll('.skill-bar');
	const skillObs = new IntersectionObserver(entries => {
		entries.forEach(ent => {
			if (ent.isIntersecting) {
				const el = ent.target;
				const fill = el.querySelector('.skill-fill');
				const v = parseInt(el.dataset.skill, 10) || 0;
				fill.style.width = v + '%';
				skillObs.unobserve(el);
			}
		});
	}, { threshold: 0.3 });
	skillBars.forEach(b => skillObs.observe(b));

	// Section/card reveal
	const reveals = document.querySelectorAll('.section, .card');
	const revObs = new IntersectionObserver(entries => {
		entries.forEach(e => {
			if (e.isIntersecting) e.target.classList.add('revealed');
		});
	}, { threshold: 0.12 });
	reveals.forEach(r => revObs.observe(r));

	// Contact form mailto
	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = document.getElementById('name').value.trim();
			const message = document.getElementById('message').value.trim();
			const subject = encodeURIComponent(`Contact from ${name}`);
			const bodyText = encodeURIComponent(message + '\n\n--\nSent from portfolio');
			window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${bodyText}`;
		});
	}

	// Copy email
	if (copyEmailBtn) {
		copyEmailBtn.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(emailAddr);
				copyEmailBtn.textContent = 'Copied!';
				setTimeout(() => copyEmailBtn.textContent = 'Copy Email', 1500);
			} catch (e) {
				alert('Copy failed — email: ' + emailAddr);
			}
		});
	}

	// Card tilt
	const tiltCards = document.querySelectorAll('.card');
	tiltCards.forEach(card => {
		card.addEventListener('pointermove', e => {
			const rect = card.getBoundingClientRect();
			const px = (e.clientX - rect.left) / rect.width;
			const py = (e.clientY - rect.top) / rect.height;
			const rx = (py - 0.5) * 8;
			const ry = (px - 0.5) * -8;
			card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
			const bodyInner = card.querySelector('.card-body');
			if (bodyInner) bodyInner.style.transform = `translateZ(12px)`;
		});
		card.addEventListener('pointerleave', () => {
			card.style.transform = '';
			const bodyInner = card.querySelector('.card-body');
			if (bodyInner) bodyInner.style.transform = '';
		});
	});

	// Canvas particle background
	if (bgCanvas && bgCanvas.getContext) {
		const ctx = bgCanvas.getContext('2d');
		let W = bgCanvas.width = bgCanvas.offsetWidth;
		let H = bgCanvas.height = bgCanvas.offsetHeight;
		const particles = [];
		const count = Math.max(12, Math.floor((W * H) / 90000));

		function rand(min, max) {
			return Math.random() * (max - min) + min;
		}

		for (let i = 0; i < count; i++) {
			particles.push({
				x: rand(0, W),
				y: rand(0, H),
				r: rand(0.8, 2.5),
				vx: rand(-0.2, 0.2),
				vy: rand(-0.15, 0.15)
			});
		}

		function resizeCanvas() {
			W = bgCanvas.width = bgCanvas.offsetWidth;
			H = bgCanvas.height = bgCanvas.offsetHeight;
		}

		window.addEventListener('resize', resizeCanvas);

		function draw() {
			ctx.clearRect(0, 0, W, H);
			for (let p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < -10) p.x = W + 10;
				if (p.x > W + 10) p.x = -10;
				if (p.y < -10) p.y = H + 10;
				if (p.y > H + 10) p.y = -10;
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,255,255,0.06)';
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			}
			requestAnimationFrame(draw);
		}
		draw();
	}

	// Hero parallax – applied to hero-art wrapper (not the character transform itself)
	if (hero) {
		const art = hero.querySelector('.hero-art');
		hero.addEventListener('pointermove', e => {
			const rect = hero.getBoundingClientRect();
			const nx = (e.clientX - rect.left) / rect.width - 0.5;
			const ny = (e.clientY - rect.top) / rect.height - 0.5;
			if (art) {
				art.style.transform = `translate3d(${nx * 10}px, ${ny * 6}px, 0)`;
			}
		});
		hero.addEventListener('pointerleave', () => {
			const artInner = hero.querySelector('.hero-art');
			if (artInner) artInner.style.transform = '';
		});
	}

	// Keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

		if (e.key === 't') {
			const isLight = body.classList.toggle('light');
			setThemeIcon(themeToggle, isLight);
			localStorage.setItem('theme', isLight ? 'light' : 'dark');
		}
		if (e.key === '1') {
			const first = document.querySelector('.project');
			if (first) openModalFromCard(first);
		}
		if (e.key === 'm' && menuToggle) {
			const isOpen = navDrawer.getAttribute('aria-hidden') === 'false';
			toggleMobileMenu(!isOpen);
		}
	});

	// Accessibility: open project card with Enter
	projects.forEach(p => {
		p.addEventListener('keydown', e => {
			if (e.key === 'Enter') openModalFromCard(p);
		});
	});
});
