document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#site-menu");
const navLinks = [...document.querySelectorAll("#site-menu a[href^='#']")];
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const readingProgress = document.querySelector(".reading-progress");
const progressFill = readingProgress?.querySelector("span");
const backToTop = document.querySelector(".back-to-top");
const projectGrid = document.querySelector("#project-grid");
const projectFilters = [...document.querySelectorAll(".project-filter")];
const techFilters = [...document.querySelectorAll(".tech-filter")];
const projectCount = document.querySelector("#project-count");
const terminalCommand = document.querySelector("#terminal-command");
const terminalOutput = document.querySelector("#terminal-output");
const terminalButtons = [...document.querySelectorAll(".terminal-command")];
const caseStudyToggle = document.querySelector(".case-study-toggle");
const caseStudyPanel = document.querySelector("#resume-case-study");
const previewToggle = document.querySelector(".preview-toggle");
const previewWorkflow = document.querySelector("#resume-preview-workflow");
const previewDetails = document.querySelector("#resume-preview-details");

if (year) {
    year.textContent = String(new Date().getFullYear());
}

function closeMenu() {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navMenu.classList.remove("is-open");
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        navMenu.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
    });
}

function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 12);
}

function updateScrollProgress() {
    if (!readingProgress || !progressFill) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100)) : 0;
    progressFill.style.transform = `scaleX(${progress / 100})`;
    readingProgress.setAttribute("aria-valuenow", String(Math.round(progress)));
}

function updateScrollState() {
    updateHeader();
    updateScrollProgress();
    backToTop?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.75);
}

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollProgress);

const terminalResponses = {
    whoami: "Pushpendra Pal\nB.Tech CSE (AI & ML) student",
    focus: "Artificial Intelligence & Machine Learning\nData Structures & Algorithms\nSoftware Development",
    currently_building: "Resume Screening System\nStatus: In Development",
    status: "Learning\nBuilding\nImproving"
};
let terminalTimer;

terminalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const command = button.dataset.command;
        const response = command ? terminalResponses[command] : undefined;
        if (!command || !response || !terminalCommand || !terminalOutput) return;

        window.clearTimeout(terminalTimer);
        terminalCommand.textContent = command;
        terminalOutput.textContent = "";
        terminalOutput.setAttribute("aria-live", "off");
        terminalButtons.forEach((terminalButton) => {
            const isActive = terminalButton === button;
            terminalButton.classList.toggle("is-active", isActive);
            terminalButton.setAttribute("aria-pressed", String(isActive));
        });

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let characterIndex = 0;
        const typeNextCharacter = () => {
            characterIndex += 1;
            terminalOutput.textContent = response.slice(0, characterIndex);
            if (characterIndex < response.length && !reducedMotion) {
                terminalTimer = window.setTimeout(typeNextCharacter, 7);
            } else {
                terminalOutput.textContent = response;
                terminalOutput.setAttribute("aria-live", "polite");
            }
        };

        if (reducedMotion) {
            terminalOutput.textContent = response;
            terminalOutput.setAttribute("aria-live", "polite");
        } else {
            typeNextCharacter();
        }
    });
});

caseStudyToggle?.addEventListener("click", () => {
    if (!caseStudyPanel) return;
    const isExpanded = caseStudyToggle.getAttribute("aria-expanded") === "true";
    caseStudyToggle.setAttribute("aria-expanded", String(!isExpanded));
    caseStudyPanel.hidden = isExpanded;
    const indicator = caseStudyToggle.querySelector("span");
    if (indicator) indicator.textContent = isExpanded ? "↓" : "↑";
    if (!isExpanded) caseStudyPanel.focus();
});

previewToggle?.addEventListener("click", () => {
    if (!previewWorkflow || !previewDetails) return;
    const isExpanded = previewToggle.getAttribute("aria-expanded") === "true";
    previewToggle.setAttribute("aria-expanded", String(!isExpanded));
    previewWorkflow.hidden = !isExpanded;
    previewDetails.hidden = isExpanded;
    const indicator = previewToggle.querySelector("span");
    if (indicator) indicator.textContent = isExpanded ? "+" : "−";
    previewToggle.firstChild.textContent = isExpanded ? "Project notes " : "Workflow preview ";
});

if (projectGrid && projectCount) {
    const projectCards = [...projectGrid.querySelectorAll(".project-card")];
    let selectedCategory = "all";
    let selectedTech = "";

    function renderProjects() {
        let visibleCount = 0;
        projectCards.forEach((card) => {
            const categoryMatches = selectedCategory === "all" || card.dataset.category === selectedCategory;
            const projectTechnologies = card.dataset.tech?.split(/\s+/) ?? [];
            const technologyMatches = !selectedTech || projectTechnologies.includes(selectedTech);
            const isVisible = categoryMatches && technologyMatches;
            card.hidden = !isVisible;
            if (isVisible) {
                visibleCount += 1;
                card.classList.add("is-visible");
            }
        });

        projectFilters.forEach((button) => {
            const isActive = button.dataset.filter === selectedCategory;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
        techFilters.forEach((button) => {
            const isActive = button.dataset.tech === selectedTech;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        const countLabel = `Showing ${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
        const technologyLabel = techFilters.find((button) => button.dataset.tech === selectedTech)?.textContent;
        projectCount.textContent = technologyLabel ? `${countLabel} using ${technologyLabel}` : countLabel;
    }

    projectFilters.forEach((filter) => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.filter;
            if (!category) return;
            selectedCategory = category;
            selectedTech = "";
            renderProjects();
        });
    });

    techFilters.forEach((filter) => {
        filter.addEventListener("click", () => {
            const technology = filter.dataset.tech;
            if (!technology) return;
            selectedCategory = "all";
            selectedTech = selectedTech === technology ? "" : technology;
            renderProjects();
        });
    });

    renderProjects();
}

if ("IntersectionObserver" in window) {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => {
        if (reducedMotion) {
            item.classList.add("is-visible");
        } else {
            revealObserver.observe(item);
        }
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const activeHref = `#${entry.target.id}`;
            navLinks.forEach((link) => {
                if (link.getAttribute("href") === activeHref) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });

    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity() || !formStatus) return;
    formStatus.textContent = "Your message is valid, but it has not been sent. Connect a contact service to enable delivery.";
});
