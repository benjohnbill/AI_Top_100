/**
 * 카카오대학교 컴퓨터공학부 웹사이트 JavaScript
 * Kakao University - Department of Computer Science
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Ready
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initFaqAccordion();
        initBreadcrumbQuickJump();
        initSmoothScroll();
        initActiveNavigation();
        initNewsFilter();
    });

    // ==========================================================================
    // Mobile Menu
    // ==========================================================================
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav');

        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('nav--open');

            // Toggle aria-expanded
            const isOpen = nav.classList.contains('nav--open');
            menuToggle.setAttribute('aria-expanded', isOpen);

            // Toggle menu icon animation
            menuToggle.classList.toggle('menu-toggle--active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('nav--open');
                menuToggle.classList.remove('menu-toggle--active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
                nav.classList.remove('nav--open');
                menuToggle.classList.remove('menu-toggle--active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // ==========================================================================
    // FAQ Accordion
    // ==========================================================================
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        if (!faqItems.length) return;

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-item__question');
            const answer = item.querySelector('.faq-item__answer');

            if (!question || !answer) return;

            // Set initial ARIA attributes
            const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
            answer.id = answerId;
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', answerId);

            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('faq-item--open');

                // Close all other items (optional - comment out for multi-open)
                // faqItems.forEach(function(otherItem) {
                //     otherItem.classList.remove('faq-item--open');
                //     otherItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
                // });

                // Toggle current item
                item.classList.toggle('faq-item--open');
                question.setAttribute('aria-expanded', !isOpen);
            });

            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ==========================================================================
    // Breadcrumb Quick Jump
    // ==========================================================================
    function initBreadcrumbQuickJump() {
        const breadcrumbList = document.querySelector('.breadcrumb__list');
        const mainContent = document.querySelector('.main-content');
        const pageHeader = document.querySelector('.page-header');

        if (!breadcrumbList || !mainContent || !pageHeader) return;
        if (breadcrumbList.querySelector('[data-qa-id="breadcrumb-jump"]')) return;

        const sections = Array.from(mainContent.querySelectorAll('.section')).filter(function(section) {
            if (!(section instanceof HTMLElement)) return false;
            if (section === pageHeader) return false;
            return true;
        });

        if (sections.length <= 1) return;

        const isKo = (document.documentElement.lang || '').toLowerCase().startsWith('ko');
        const jumpLabel = isKo ? '빠른 이동' : 'Quick Jump';
        const backToJumpLabel = isKo ? '빠른 이동으로' : 'Back to Quick Jump';
        const quickJumpTargetId = 'breadcrumb-quick-jump';
        const isQ5BugPage = /\/ko\/curriculum\.html$/i.test(window.location.pathname);
        const sectionLabelMap = {
            'contact-info-section': isKo ? '연락 정보' : 'Contact Info'
        };

        const existingIds = new Set(
            Array.from(document.querySelectorAll('[id]')).map(function(el) {
                return el.id;
            })
        );

        const sectionLinks = sections.map(function(section, index) {
            let sectionId = section.id;
            if (!sectionId) {
                let serial = index + 1;
                sectionId = 'section-' + serial;
                while (existingIds.has(sectionId)) {
                    serial += 1;
                    sectionId = 'section-' + serial;
                }
                section.id = sectionId;
            }
            existingIds.add(sectionId);

            const heading = section.querySelector('h2, h3');
            const dataQaId = section.getAttribute('data-qa-id') || '';
            let title = sectionLabelMap[dataQaId] || '';

            if (!title && heading && heading.textContent.trim()) {
                title = heading.textContent.trim();
            } else if (!title) {
                title = (isKo ? '섹션 ' : 'Section ') + (index + 1);
            }

            return {
                id: sectionId,
                title: title,
                isBugAnchor: isQ5BugPage
            };
        });

        const separator = document.createElement('li');
        separator.className = 'breadcrumb__separator';
        separator.textContent = '/';

        const jumpItem = document.createElement('li');
        jumpItem.className = 'breadcrumb__item breadcrumb__item--jump';

        const details = document.createElement('details');
        details.className = 'breadcrumb-jump';
        details.setAttribute('data-qa-id', 'breadcrumb-jump');
        details.id = quickJumpTargetId;

        const summary = document.createElement('summary');
        summary.className = 'breadcrumb-jump__summary';
        summary.setAttribute('data-qa-id', 'breadcrumb-jump-summary');
        summary.textContent = jumpLabel;

        const menu = document.createElement('ul');
        menu.className = 'breadcrumb-jump__menu';
        menu.setAttribute('data-qa-id', 'breadcrumb-jump-menu');

        sectionLinks.forEach(function(item, index) {
            const menuItem = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'breadcrumb-jump__link';
            link.href = '#' + item.id;
            link.textContent = item.title;
            link.setAttribute('data-qa-id', 'breadcrumb-jump-link-' + (index + 1));
            if (item.isBugAnchor) {
                link.classList.add('bug-anchor-link');
            }

            link.addEventListener('click', function() {
                details.removeAttribute('open');
            });

            menuItem.appendChild(link);
            menu.appendChild(menuItem);
        });

        details.appendChild(summary);
        details.appendChild(menu);
        jumpItem.appendChild(details);
        breadcrumbList.appendChild(separator);
        breadcrumbList.appendChild(jumpItem);

        sectionLinks.forEach(function(item, index) {
            const section = document.getElementById(item.id);
            if (!(section instanceof HTMLElement)) return;

            const sectionContainer = section.querySelector('.container');
            const targetContainer = sectionContainer instanceof HTMLElement ? sectionContainer : section;
            if (targetContainer.querySelector('[data-qa-id="section-back-to-jump-' + (index + 1) + '"]')) return;
            targetContainer.classList.add('section-quick-nav-target');

            const navWrapper = document.createElement('div');
            navWrapper.className = 'section-quick-nav';
            navWrapper.setAttribute('data-qa-id', 'section-quick-nav-' + (index + 1));

            const backLink = document.createElement('a');
            backLink.className = 'section-quick-nav__link';
            backLink.href = '#' + quickJumpTargetId;
            backLink.textContent = backToJumpLabel;
            backLink.setAttribute('data-qa-id', 'section-back-to-jump-' + (index + 1));

            navWrapper.appendChild(backLink);
            targetContainer.insertBefore(navWrapper, targetContainer.firstChild);
        });

        const header = document.querySelector('.header');
        if (header instanceof HTMLElement) {
            let resizeTimer = null;
            const refreshTailSpace = function() {
                updateQuickJumpTailSpace(mainContent, sectionLinks, header.offsetHeight);
            };

            refreshTailSpace();
            window.requestAnimationFrame(refreshTailSpace);

            window.addEventListener('load', refreshTailSpace);
            window.addEventListener('resize', function() {
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }
                resizeTimer = setTimeout(refreshTailSpace, 120);
            });
        }
    }

    function updateQuickJumpTailSpace(mainContent, sectionLinks, headerHeight) {
        if (!(mainContent instanceof HTMLElement) || !Array.isArray(sectionLinks) || !sectionLinks.length) return;

        // Recalculate from a clean baseline to avoid accumulating stale spacer height.
        mainContent.style.setProperty('--quick-jump-tail-space', '0px');

        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        let requiredTailSpace = 0;

        sectionLinks.forEach(function(item) {
            const target = document.getElementById(item.id);
            if (!(target instanceof HTMLElement)) return;

            const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
            const offset = item.isBugAnchor ? 0 : headerHeight;
            const desiredScrollTop = targetTop - offset;
            const neededSpace = desiredScrollTop - maxScroll;

            if (neededSpace > requiredTailSpace) {
                requiredTailSpace = neededSpace;
            }
        });

        const rawTailSpace = Math.max(0, Math.ceil(requiredTailSpace));
        const baseSoftCap = 112;
        const viewportBoost = Math.max(0, window.innerHeight - 900);
        const tailSpaceSoftCap = baseSoftCap + viewportBoost;
        const tailSpace = Math.min(rawTailSpace, tailSpaceSoftCap);
        mainContent.style.setProperty('--quick-jump-tail-space', tailSpace + 'px');

        const isTransparent = function(color) {
            return !color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === 'rgba(0,0,0,0)';
        };

        let tailBackgroundColor = '';
        const lastSection = document.getElementById(sectionLinks[sectionLinks.length - 1].id);

        if (lastSection instanceof HTMLElement) {
            tailBackgroundColor = window.getComputedStyle(lastSection).backgroundColor;
        }
        if (isTransparent(tailBackgroundColor)) {
            tailBackgroundColor = window.getComputedStyle(mainContent).backgroundColor;
        }
        if (isTransparent(tailBackgroundColor)) {
            tailBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
        }
        if (!isTransparent(tailBackgroundColor)) {
            mainContent.style.setProperty('--quick-jump-tail-bg', tailBackgroundColor);
        }
    }

    // ==========================================================================
    // Smooth Scroll
    // ==========================================================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const isBugAnchorLink = link.classList.contains('bug-anchor-link');
                    const offset = isBugAnchorLink ? 0 : headerHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL hash
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ==========================================================================
    // Active Navigation
    // ==========================================================================
    function initActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav__link');
        const currentPath = window.location.pathname;

        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');

            // Check if the link matches current page
            if (currentPath.endsWith(href) ||
                (href !== 'index.html' && currentPath.includes(href.replace('.html', '')))) {
                link.classList.add('nav__link--active');
            }
        });
    }

    // ==========================================================================
    // News Filter
    // ==========================================================================
    function initNewsFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const newsItems = document.querySelectorAll('.news-item');

        if (!filterButtons.length || !newsItems.length) return;

        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
                this.classList.add('filter-btn--active');

                // Filter news items
                newsItems.forEach(function(item) {
                    const category = item.dataset.category;

                    if (filter === 'all' || category === filter) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Language Switcher
    // ==========================================================================
    window.switchLanguage = function(lang) {
        const currentPath = window.location.pathname;
        let newPath;

        if (lang === 'en') {
            newPath = currentPath.replace('/ko/', '/en/');
        } else {
            newPath = currentPath.replace('/en/', '/ko/');
        }

        window.location.href = newPath;
    };

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

})();
