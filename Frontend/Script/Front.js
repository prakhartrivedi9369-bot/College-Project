// ============================================================
// USER DATA
// ============================================================

let userDataPromise = null;

// MongoDB ObjectId of currently logged-in user
let currentUserId = null;


async function loadUserData()
{
    if (userDataPromise)
    {
        return userDataPromise;
    }

    userDataPromise = (async () =>
    {
        try
        {
            const response = await fetch("/Fetch_user_data");

            if (!response.ok)
            {
                throw new Error(
                    `Failed to fetch user data: ${response.status}`
                );
            }

            const user = await response.json();

            console.log("Fetched user data:", user);

            // ====================================================
            // MONGODB OBJECT ID
            // ====================================================

            currentUserId =
                user.ID ??
                "";

            console.log(
                "Current User MongoDB ID:",
                currentUserId
            );

            const idElement = document.getElementById("ID");

            if (idElement)
            {
                idElement.textContent = currentUserId ? `ID: ${currentUserId}`: "ID: Not available";
            }


            // ====================================================
            // FIRST NAME
            // ====================================================

            const firstName =
                user.firstName ??
                user.FirstName ??
                "";


            // ====================================================
            // LAST NAME
            // ====================================================

            const lastName =
                user.lastName ??
                user.LastName ??
                "";


            // ====================================================
            // USERNAME
            // ====================================================

            const username =
                user.username ??
                user.Username ??
                `${firstName} ${lastName}`.trim();


            // ====================================================
            // Username
            // ====================================================

            const usernameElement =
                document.getElementById("firstName");

            if (usernameElement)
            {
                usernameElement.textContent = username;
            }


            // ====================================================
            // Initials
            // ====================================================

            const initialsElement =
                document.getElementById("userInitials");

            if (initialsElement)
            {
                const nameForInitials =
                    username || firstName;

                const initials =
                    nameForInitials
                        .trim()
                        .split(/\s+/)
                        .map(word => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase();

                initialsElement.textContent = initials;
            }


            // ====================================================
            // Local leaderboard
            // ====================================================

            if (username)
            {
                localLeaderboard[1].name =
                    `${username} (You)`;
            }


            // Re-render leaderboard after user data arrives
            const localTab =
                document.getElementById("btnTabLocal");

            if (
                localTab &&
                localTab.classList.contains("bg-walnut")
            )
            {
                renderLeaderboard(localLeaderboard);
            }


            // ====================================================
            // RETURN USER DATA
            // ====================================================

            return user;
        }
        catch (error)
        {
            console.error("User data error:", error);
            throw error;
        }
    })();

    return userDataPromise;
}



// ============================================================
// LEADERBOARD DATA
// ============================================================

const globalLeaderboard = [
    {
        rank: 1,
        name: "Julian Thorne",
        campus: "Stanford Univ.",
        score: 9840,
        streak: 42,
        title: "Grandmaster"
    },

    {
        rank: 2,
        name: "Sophia Chen",
        campus: "MIT",
        score: 9620,
        streak: 38,
        title: "Grandmaster"
    },

    {
        rank: 3,
        name: "Devon Vance",
        campus: "Oxford Univ.",
        score: 9410,
        streak: 29,
        title: "Senior Scholar"
    },

    {
        rank: 4,
        name: "Aria Montgomery",
        campus: "ETH Zürich",
        score: 9150,
        streak: 21,
        title: "Senior Scholar"
    },

    {
        rank: 5,
        name: "Kenji Sato",
        campus: "Univ. of Tokyo",
        score: 8900,
        streak: 19,
        title: "Scribe"
    }
];


const localLeaderboard = [
    {
        rank: 1,
        name: "Eleanor Vance",
        campus: "Oxford Univ.",
        score: 9550,
        streak: 31,
        title: "Grandmaster"
    },

    {
        rank: 2,
        name: "Loading... (You)",
        campus: "Oxford Univ.",
        score: 4850,
        streak: 14,
        title: "Archival Scholar"
    },

    {
        rank: 3,
        name: "Arthur Pendelton",
        campus: "Oxford Univ.",
        score: 4620,
        streak: 11,
        title: "Senior Scholar"
    },

    {
        rank: 4,
        name: "Clara Oswald",
        campus: "Oxford Univ.",
        score: 4210,
        streak: 8,
        title: "Scribe"
    },

    {
        rank: 5,
        name: "Gideon Cross",
        campus: "Oxford Univ.",
        score: 3980,
        streak: 5,
        title: "Novice"
    }
];



// ============================================================
// RECOMMENDED CATALOG DATA
// ============================================================

const catalogTracks = [
    {
        title: "Advanced Distributed Systems",
        category: "Systems",
        duration: "45 mins",
        diff: "Hard",
        xp: "+300 XP",
        icon: "fa-network-wired"
    },

    {
        title: "Quantum Computing Foundations",
        category: "STEM",
        duration: "30 mins",
        diff: "Medium",
        xp: "+200 XP",
        icon: "fa-atom"
    },

    {
        title: "Compiler Construction & ASTs",
        category: "Systems",
        duration: "60 mins",
        diff: "Hard",
        xp: "+400 XP",
        icon: "fa-code"
    },

    {
        title: "Formal Logic & Mathematical Proofs",
        category: "STEM",
        duration: "40 mins",
        diff: "Medium",
        xp: "+250 XP",
        icon: "fa-square-root-variable"
    }
];



// ============================================================
// RENDER LEADERBOARD
// ============================================================

function renderLeaderboard(data)
{
    const tbody =
        document.getElementById("leaderboardRows");

    if (!tbody)
    {
        return;
    }

    tbody.innerHTML = "";

    data.forEach(item =>
    {
        const isUser =
            item.name.includes("(You)");

        const tr =
            document.createElement("tr");

        tr.className =
            isUser
                ? "bg-brass/10 font-bold"
                : "hover:bg-paper-dark/30";

        tr.innerHTML = `
            <td class="py-3 px-4 font-bold ${
                item.rank <= 3
                    ? "text-brass-muted"
                    : "text-walnut/70"
            }">
                #${item.rank}
            </td>

            <td class="py-3 px-4 text-walnut-dark">
                ${item.name}
            </td>

            <td class="py-3 px-4 text-walnut/60">
                ${item.campus}
            </td>

            <td class="py-3 px-4 text-teal font-bold">
                ${item.score.toLocaleString()} pts
            </td>

            <td class="py-3 px-4">
                <i class="fa-solid fa-fire text-amber-500 mr-1"></i>
                ${item.streak}d
            </td>

            <td class="py-3 px-4 text-right">
                <span
                    class="inline-block px-2 py-0.5 rounded border border-brass/40 text-brass-muted font-mono text-[10px] bg-paper-light">
                    ${item.title}
                </span>
            </td>
        `;

        tbody.appendChild(tr);
    });
}



// ============================================================
// SWITCH LEADERBOARD TAB
// ============================================================

function switchLeaderboard(type)
{
    const btnGlobal =
        document.getElementById("btnTabGlobal");

    const btnLocal =
        document.getElementById("btnTabLocal");

    if (type === "global")
    {
        if (btnGlobal)
        {
            btnGlobal.className =
                "px-4 py-2 rounded bg-walnut text-paper-light font-semibold shadow transition-all";
        }

        if (btnLocal)
        {
            btnLocal.className =
                "px-4 py-2 rounded text-walnut-dark hover:text-walnut font-semibold transition-all";
        }

        renderLeaderboard(globalLeaderboard);
    }
    else
    {
        if (btnLocal)
        {
            btnLocal.className =
                "px-4 py-2 rounded bg-walnut text-paper-light font-semibold shadow transition-all";
        }

        if (btnGlobal)
        {
            btnGlobal.className =
                "px-4 py-2 rounded text-walnut-dark hover:text-walnut font-semibold transition-all";
        }

        renderLeaderboard(localLeaderboard);
    }
}



// ============================================================
// RENDER CATALOG TRACKS
// ============================================================

function renderCatalog(filter = "all")
{
    const grid =
        document.getElementById("catalogGrid");

    if (!grid)
    {
        return;
    }

    grid.innerHTML = "";

    const items =
        filter === "all"
            ? catalogTracks
            : catalogTracks.filter(
                track =>
                    track.category.toLowerCase() ===
                    filter.toLowerCase()
            );

    items.forEach(track =>
    {
        const div =
            document.createElement("div");

        div.className =
            "library-card p-4 rounded border border-paper-border flex flex-col justify-between space-y-3 hover:border-teal transition-all";

        div.innerHTML = `
            <div>
                <div class="flex justify-between items-center font-mono text-[10px] text-walnut/60 mb-1">
                    <span class="text-teal uppercase font-bold">
                        <i class="fa-solid ${track.icon}"></i>
                        ${track.category}
                    </span>

                    <span>
                        ${track.duration}
                    </span>
                </div>

                <h4 class="font-serif font-bold text-base text-walnut-dark">
                    ${track.title}
                </h4>
            </div>

            <div class="pt-2 border-t border-paper-border flex items-center justify-between font-mono text-xs">
                <span class="text-brass-muted font-semibold">
                    ${track.xp}
                </span>

                <button
                    onclick="openModal(
                        'Track Launch: ${track.title}',
                        'Pairing you with a peer for this ${track.duration} sprint session.'
                    )"
                    class="text-walnut hover:text-teal font-semibold">

                    Enroll
                    <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
        `;

        grid.appendChild(div);
    });
}


function filterCatalog(cat)
{
    renderCatalog(cat);
}



// ============================================================
// DAILY COUNTDOWN TIMER
// ============================================================

let secondsLeft =
    (4 * 3600) +
    (12 * 60) +
    39;


function updateTimer()
{
    const h =
        Math.floor(secondsLeft / 3600)
            .toString()
            .padStart(2, "0");

    const m =
        Math.floor((secondsLeft % 3600) / 60)
            .toString()
            .padStart(2, "0");

    const s =
        (secondsLeft % 60)
            .toString()
            .padStart(2, "0");

    const timerEl =
        document.getElementById("dailyTimer");

    if (timerEl)
    {
        timerEl.innerText =
            `${h} : ${m} : ${s}`;
    }

    if (secondsLeft > 0)
    {
        secondsLeft--;
    }
}


setInterval(updateTimer, 1000);



// ============================================================
// RANDOM LIVE PEER COUNTER
// ============================================================

setInterval(() =>
{
    const countEl =
        document.getElementById("livePeerCount");

    if (countEl)
    {
        const current =
            parseInt(countEl.innerText);

        const delta =
            Math.floor(Math.random() * 5) - 2;

        countEl.innerText =
            Math.max(80, current + delta);
    }

}, 4000);



// ============================================================
// MODAL HANDLERS
// ============================================================

let modalDestination = "";


function openModal(title, text, destination)
{
    const modalTitle =
        document.getElementById("modalTitle");

    const modalBody =
        document.getElementById("modalBody");

    const modal =
        document.getElementById("appModal");

    if (modalTitle)
    {
        modalTitle.innerText = title;
    }

    if (modalBody)
    {
        modalBody.innerText = text;
    }

    // Store destination for this particular modal
    modalDestination = destination;

    if (modal)
    {
        modal.classList.remove("hidden");
    }
}


function closeModal()
{
    const modal =
        document.getElementById("appModal");

    if (modal)
    {
        modal.classList.add("hidden");
    }
}


function confirmModalAction()
{
    closeModal();

    if (modalDestination === "open_sprint_config")
    {
        openSprintConfigModal();
    }
    else if (modalDestination)
    {
        window.location.href = modalDestination;
    }
}



// ============================================================
// SPRINT CONFIGURATION MODAL HANDLERS
// ============================================================

function openSprintConfigModal()
{
    const sprintModal = document.getElementById("sprintConfigModal");
    if (sprintModal)
    {
        sprintModal.classList.remove("hidden");
    }
}

function closeSprintConfigModal()
{
    const sprintModal = document.getElementById("sprintConfigModal");
    if (sprintModal)
    {
        sprintModal.classList.add("hidden");
    }
}

function toggleStartSprintBtn()
{
    const termsCheck = document.getElementById("termsCheckbox");
    const submitBtn = document.getElementById("startSprintSubmitBtn");

    if (termsCheck && submitBtn)
    {
        submitBtn.disabled = !termsCheck.checked;
    }
}

async function handleStartSprint(event)
{
    event.preventDefault();

    const submitBtn = document.getElementById("startSprintSubmitBtn");

    const topic = document.getElementById("sprintTopic").value.trim();

    // "30 mins" -> 30 (integer minutes)
    const time = document.getElementById("sprintTime").value;

    const scope = document.getElementById("sprintScope").value;

    const comment = document.getElementById("sprintComment").value.trim();

    const payload = {
        topic: topic,
        time: time,
        scope: scope
    };

    // comment is optional, so it is only sent when the user wrote one
    if (comment)
    {
        payload.comment = comment;
    }

    const originalBtnText = submitBtn ? submitBtn.innerText : "";

    if (submitBtn)
    {
        submitBtn.disabled = true;
        submitBtn.innerText = "Starting...";
    }

    try
    {
        const response = await fetch("/call-sprint",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
        });

        if (!response.ok)
        {
            let message = "Could not create the sprint. Please try again.";

            try
            {
                const data = await response.json();
                message = data.message || message;
            }
            catch (e) {}

            // keep the modal open so the user does not lose what they typed
            showToast("Sprint Failed", message);
            return;
        }

        closeSprintConfigModal();

        showToast(
            "Sprint Created",
            "Sprint created successfully and we will notify you when we found someone for sprint."
        );

        // Reset form fields
        const form = document.getElementById("sprintConfigForm");
        if (form)
        {
            form.reset();
        }
    }
    catch (error)
    {
        console.error("Start sprint error:", error);

        showToast("Server Error", "Server connection failed.");
    }
    finally
    {
        if (submitBtn)
        {
            submitBtn.innerText = originalBtnText;
        }

        // re-enabled only if terms are still ticked (form.reset() clears them)
        toggleStartSprintBtn();
    }
}



// ============================================================
// TOAST NOTIFICATION
// ============================================================

function showToast(title, message)
{
    const toastTitle =
        document.getElementById("toastTitle");

    const toastMessage =
        document.getElementById("toastMessage");

    const toast =
        document.getElementById("toastNotification");

    if (toastTitle)
    {
        toastTitle.innerText = title;
    }

    if (toastMessage)
    {
        toastMessage.innerText = message;
    }

    if (toast)
    {
        toast.classList.remove("hidden");

        setTimeout(() =>
        {
            toast.classList.add("hidden");
        }, 5000);
    }
}


function closeToast()
{
    const toast =
        document.getElementById("toastNotification");

    if (toast)
    {
        toast.classList.add("hidden");
    }
}



// ============================================================
// CONTEST REGISTRATION
// ============================================================

function toggleRegister(btn)
{
    if (btn.innerText.includes("Registered"))
    {
        btn.innerText =
            "Registration Confirmed ✓";

        btn.className =
            "bg-emerald-800 text-paper-light px-3 py-1.5 rounded transition-all";

        showToast(
            "Registration Confirmed",
            "You are locked in for this timed meet round."
        );
    }
}



// ============================================================
// MARGINALIA UPVOTE
// ============================================================

function upvoteNote(btn)
{
    const span =
        btn.querySelector("span");

    if (!span)
    {
        return;
    }

    let val =
        parseInt(span.innerText);

    span.innerText =
        val + 1;

    btn.classList.add("text-brass");
}



// ============================================================
// AI ASSISTANT CONSOLE DEMO
// ============================================================

function handleAiPrompt(e)
{
    e.preventDefault();

    const input =
        document.getElementById("aiInput");

    const responseBox =
        document.getElementById("aiResponseBox");

    if (!input || !responseBox)
    {
        return;
    }

    const query =
        input.value.trim();

    if (!query)
    {
        return;
    }

    responseBox.innerText =
        `Consulting Archival Repository for "${query}"...`;

    setTimeout(() =>
    {
        responseBox.innerText =
            `[Curator Response]: Regarding "${query}", scholars prioritize breaking the problem down into base invariants before running performance benchmarks. Ensure time complexity satisfies O(N log N).`;
    }, 800);

    input.value = "";
}



// ============================================================
// SCROLL TO SECTION
// ============================================================

function scrollToSection(id)
{
    const el =
        document.getElementById(id);

    if (el)
    {
        el.scrollIntoView({
            behavior: "smooth"
        });
    }
}



// ============================================================
// INITIALIZE ON LOAD
// ============================================================

window.addEventListener("load", async function()
{
    renderLeaderboard(globalLeaderboard);

    renderCatalog("all");

    await loadUserData();
});