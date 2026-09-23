/* =========================================================
   MINI PROJECT — INTERACTION LAYER
   Archive / Peer-to-Peer Mock Sprint Platform
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       CATALOG DATA
       ----------------------------------------------------- */

    const catalog = [
        {
            title: "Operating Systems",
            category: "STEM",
            code: "CS-301",
            meta: "Systems · 45 min",
            description:
                "Trace processes, memory, scheduling and the invisible machinery behind modern software.",
            tags: ["Processes", "Memory", "Scheduling"]
        },
        {
            title: "Database Systems",
            category: "STEM",
            code: "CS-304",
            meta: "Systems · 50 min",
            description:
                "Work through relational models, indexing, transactions and practical database reasoning.",
            tags: ["SQL", "Indexes", "Transactions"]
        },
        {
            title: "Computer Networks",
            category: "STEM",
            code: "CS-305",
            meta: "Networks · 45 min",
            description:
                "Follow packets from application to wire and reason about protocols, routing and reliability.",
            tags: ["TCP/IP", "Routing", "Protocols"]
        },
        {
            title: "Algorithms",
            category: "STEM",
            code: "CS-302",
            meta: "Algorithms · 60 min",
            description:
                "Solve constrained problems while explaining the trade-offs behind every algorithmic choice.",
            tags: ["Graphs", "DP", "Complexity"]
        },
        {
            title: "Critical Thinking",
            category: "Humanities",
            code: "HU-210",
            meta: "Reasoning · 35 min",
            description:
                "Separate assumptions from evidence and construct arguments that survive scrutiny.",
            tags: ["Logic", "Evidence", "Arguments"]
        },
        {
            title: "Technical Writing",
            category: "Skills",
            code: "SK-110",
            meta: "Communication · 30 min",
            description:
                "Turn complicated technical ideas into documentation that another engineer can actually use.",
            tags: ["Docs", "Clarity", "Structure"]
        },
        {
            title: "System Design",
            category: "Skills",
            code: "SK-205",
            meta: "Architecture · 60 min",
            description:
                "Design services under constraints involving scale, reliability, latency and maintainability.",
            tags: ["Architecture", "Scale", "Trade-offs"]
        },
        {
            title: "Data Structures",
            category: "STEM",
            code: "CS-201",
            meta: "Algorithms · 45 min",
            description:
                "Build intuition for the structures that make efficient software possible.",
            tags: ["Trees", "Graphs", "Hashing"]
        }
    ];


    /* -----------------------------------------------------
       CATALOG ELEMENTS
       ----------------------------------------------------- */

    const catalogGrid = document.querySelector("#catalogGrid");
    const searchInput = document.querySelector("#catalogSearch");
    const filterButtons = document.querySelectorAll("[data-filter]");


    /* -----------------------------------------------------
       RENDER CATALOG
       ----------------------------------------------------- */

    function renderCatalog(items) {

        if (!catalogGrid) return;

        catalogGrid.innerHTML = "";

        if (items.length === 0) {
            catalogGrid.innerHTML = `
                <div class="empty-state">
                    <span>NO RECORDS FOUND</span>
                    <p>
                        Try after login for an wider search.
                    </p>
                </div>
            `;

            return;
        }

        items.forEach((item, index) => {

            const card = document.createElement("article");

            card.className = "catalog-card reveal";
            card.tabIndex = 0;

            card.innerHTML = `
                <div class="catalog-card-inner">

                    <div class="catalog-card-front">

                        <div class="card-topline">
                            <span class="card-code">${item.code}</span>
                            <span class="card-category">
                                ${item.category}
                            </span>
                        </div>

                        <div class="card-number">
                            ${String(index + 1).padStart(2, "0")}
                        </div>

                        <h3>${item.title}</h3>

                        <p>
                            ${item.description}
                        </p>

                        <div class="card-meta">
                            ${item.meta}
                        </div>

                        <div class="card-hint">
                            CLICK TO OPEN RECORD
                        </div>

                    </div>


                    <div class="catalog-card-back">

                        <div class="back-label">
                            ARCHIVE RECORD
                        </div>

                        <h3>${item.title}</h3>

                        <p>
                            This sprint focuses on deliberate practice,
                            peer discussion and explaining your reasoning.
                        </p>

                        <div class="tag-list">
                            ${item.tags
                                .map(tag => `<span>${tag}</span>`)
                                .join("")}
                        </div>

                        <button
                            class="card-action"
                            type="button"
                        >
                            START SPRINT
                        </button>

                    </div>

                </div>
            `;

            catalogGrid.appendChild(card);
        });

        attachCardInteractions();
        observeReveals();
    }


    /* -----------------------------------------------------
       SEARCH
       ----------------------------------------------------- */

    let activeFilter = "ALL";

    function filterCatalog() {

        const query = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const filtered = catalog.filter(item => {

            const matchesFilter =
                activeFilter === "ALL" ||
                item.category.toUpperCase() === activeFilter;

            const searchableText = [
                item.title,
                item.category,
                item.code,
                item.meta,
                item.description,
                ...item.tags
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                query === "" ||
                searchableText.includes(query);

            return matchesFilter && matchesSearch;
        });

        renderCatalog(filtered);
    }


    if (searchInput) {

        searchInput.addEventListener("input", filterCatalog);

    }


    /* -----------------------------------------------------
       CATEGORY FILTERS
       ----------------------------------------------------- */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            activeFilter =
                button.dataset.filter.toUpperCase();

            filterCatalog();

        });

    });


    /* -----------------------------------------------------
       CARD FLIP
       ----------------------------------------------------- */

    function attachCardInteractions() {

        const cards =
            document.querySelectorAll(".catalog-card");

        cards.forEach(card => {

            card.addEventListener("click", event => {

                if (
                    event.target.closest(".card-action")
                ) {
                    return;
                }

                card.classList.toggle("flipped");

            });


            card.addEventListener("keydown", event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    card.classList.toggle("flipped");

                }

            });


            const startButton =
                card.querySelector(".card-action");

            if (startButton) {

                startButton.addEventListener("click", event => {

                    event.stopPropagation();

                    startDemoSprint(card);

                });

            }

        });

    }


    /* -----------------------------------------------------
       DEMO SPRINT
       ----------------------------------------------------- */

    function startDemoSprint(card) {

        const title =
            card.querySelector("h3")?.textContent ||
            "Sprint";

        const originalText =
            card.querySelector(".card-action");

        if (!originalText) return;

        window.location.href = 'login';   
        //originalText.textContent = "SPRINT OPENED";

        originalText.disabled = true;

        setTimeout(() => {

            originalText.textContent = "START SPRINT";
            originalText.disabled = false;

        }, 2200);

        console.log(`Demo sprint started: ${title}`);

    }


    /* -----------------------------------------------------
       KEYBOARD SEARCH SHORTCUT
       Press "/" anywhere to focus search
       ----------------------------------------------------- */

    document.addEventListener("keydown", event => {

        if (
            event.key === "/" &&
            document.activeElement !== searchInput &&
            searchInput
        ) {

            event.preventDefault();

            searchInput.focus();

        }

        if (
            event.key === "Escape" &&
            searchInput
        ) {

            searchInput.value = "";

            searchInput.blur();

            filterCatalog();

        }

    });


    /* -----------------------------------------------------
       MOBILE NAVIGATION
       ----------------------------------------------------- */

    const menuButton =
        document.querySelector(".menu-toggle");

    const navigation =
        document.querySelector(".site-nav");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            navigation.classList.toggle("open");

            menuButton.classList.toggle("open");

        });


        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navigation.classList.remove("open");

                    menuButton.classList.remove("open");

                });

            });

    }


    /* -----------------------------------------------------
       HERO MOUSE GLOW
       ----------------------------------------------------- */

    const hero =
        document.querySelector(".hero");

    if (hero) {

        hero.addEventListener("pointermove", event => {

            const rect =
                hero.getBoundingClientRect();

            const x =
                ((event.clientX - rect.left) / rect.width) * 100;

            const y =
                ((event.clientY - rect.top) / rect.height) * 100;

            hero.style.setProperty(
                "--mouse-x",
                `${x}%`
            );

            hero.style.setProperty(
                "--mouse-y",
                `${y}%`
            );

        });

    }


    /* -----------------------------------------------------
       SCROLL REVEAL
       ----------------------------------------------------- */

    let revealObserver = null;

    function observeReveals() {

        const revealElements =
            document.querySelectorAll(".reveal");

        if (
            !("IntersectionObserver" in window)
        ) {

            revealElements.forEach(element => {
                element.classList.add("visible");
            });

            return;

        }

        if (!revealObserver) {

            revealObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(entry => {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        });

                    },
                    {
                        threshold: 0.12
                    }
                );

        }

        revealElements.forEach(element => {

            if (
                !element.classList.contains("visible")
            ) {

                revealObserver.observe(element);

            }

        });

    }


    /* -----------------------------------------------------
       NUMBER COUNTERS
       ----------------------------------------------------- */

    function animateCounter(element) {

        const target =
            parseFloat(
                element.dataset.target ||
                element.textContent.replace(/[^\d.]/g, "")
            );

        if (Number.isNaN(target)) return;

        const suffix =
            element.dataset.suffix || "";

        const duration = 1500;

        const startTime = performance.now();

        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            const eased =
                1 - Math.pow(1 - progress, 3);

            const current =
                target * eased;

            element.textContent =
                Math.floor(current).toLocaleString() +
                suffix;

            if (progress < 1) {

                requestAnimationFrame(update);

            }

        }

        requestAnimationFrame(update);

    }


    const counterElements =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            animateCounter(
                                entry.target
                            );

                            counterObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );


        counterElements.forEach(counter => {

            counterObserver.observe(counter);

        });

    } else {

        counterElements.forEach(
            animateCounter
        );

    }


    /* -----------------------------------------------------
       LIVE CIRCLE COUNT
       ----------------------------------------------------- */

    const liveCount =
        document.querySelector(
            "[data-live-count]"
        );

    if (liveCount) {

        let currentCount =
            parseInt(
                liveCount.textContent.replace(/\D/g, ""),
                10
            ) || 96;

        setInterval(() => {

            const change =
                Math.random() > 0.5 ? 1 : -1;

            currentCount += change;

            currentCount =
                Math.max(80, currentCount);

            liveCount.textContent =
                currentCount;

        }, 5000);

    }


    /* -----------------------------------------------------
       DEMO SPRINT COUNTDOWN
       ----------------------------------------------------- */

    const countdown =
        document.querySelector(
            "[data-countdown]"
        );

    if (countdown) {

        let remaining =
            parseInt(
                countdown.dataset.countdown,
                10
            ) || 25 * 60;


        function updateCountdown() {

            const minutes =
                Math.floor(remaining / 60);

            const seconds =
                remaining % 60;

            countdown.textContent =
                `${String(minutes).padStart(2, "0")}:${String(
                    seconds
                ).padStart(2, "0")}`;

            if (remaining > 0) {

                remaining--;

            } else {

                remaining =
                    25 * 60;

            }

        }


        updateCountdown();

        setInterval(
            updateCountdown,
            1000
        );

    }


    /* -----------------------------------------------------
       SMOOTH SCROLL
       ----------------------------------------------------- */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });


    /* -----------------------------------------------------
       INITIALISE
       ----------------------------------------------------- */

    renderCatalog(catalog);

    observeReveals();

});
