/* =========================================================
   THE ARCHIVE — PROFILE PAGE
   Profile interactions + backend user data
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       PROFILE DATA
       ===================================================== */

    const profile = {

        name: "New Scholar",

        firstName: "@newscholar",

        bio: "Begin your journey through the Archive.",

        followers: 0,

        following: 0,

        sprints: 0,

        questions: 0,

        contests: 0,

        tournaments: 0,

        currentStreak: 0,

        bestStreak: 0,

        contributions: 0,

        peerScore: 0,

        accuracy: 0,

        globalRank: null,

        localRank: null,

        skills: [],

        connectedAccounts: {

            github: false,

            linkedin: false,

            leetcode: false,

            codechef: false,

            portfolio: false

        }

    };


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector) =>
        document.querySelector(selector);


    const $$ = (selector) =>
        document.querySelectorAll(selector);


    /* =====================================================
       UPDATE AVATAR INITIALS
       ===================================================== */

    function updateAvatarInitials(name) {

        // Generate initials from name
        // If name is "Prakhar Srivastava" -> "PS"
        // If name is "Prakhar" -> "PR"

        const words =
            name.trim().split(/\s+/);

        let initials = "";

        if (words.length >= 2) {

            initials =
                (words[0][0] +
                 words[1][0]).toUpperCase();

        } else if (words.length === 1) {

            const firstWord =
                words[0];

            if (firstWord.length >= 2) {

                initials =
                    (firstWord[0] +
                     firstWord[1]).toUpperCase();

            } else {

                initials =
                    firstWord[0].toUpperCase();

            }

        }

        // Update all avatar initials elements
        const profileAvatarInitials =
            document.getElementById(
                "profileAvatarInitials"
            );

        if (profileAvatarInitials) {

            profileAvatarInitials.textContent =
                initials;

            console.log(
                "Updated profileAvatarInitials to:",
                initials
            );

        }


        const navAvatarInitials =
            document.getElementById(
                "navAvatarInitials"
            );

        if (navAvatarInitials) {

            navAvatarInitials.textContent =
                initials;

            console.log(
                "Updated navAvatarInitials to:",
                initials
            );

        }

    }


    /* =====================================================
       FETCH USER DATA FROM BACKEND
       ===================================================== */

    async function fetchUserData() {

        try {

            console.log("Fetching user data from /fetch_user_data...");


            const response = await fetch(
                "/Fetch_user_data",
                {
                    method: "GET",

                    credentials: "include",

                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }


            const data = await response.json();


            console.log(
                "User data received:",
                data
            );


            /*
             * Expected backend response:
             *
             * {
             *     "firstName": "Prakhar"
             * }
             */


            if (data.firstName) {

                // Update the full name display
                const nameElement =
                    document.getElementById(
                        "userFullName"
                    );


                if (nameElement) {

                    nameElement.textContent =
                        data.firstName;

                    console.log(
                        "Updated userFullName to:",
                        data.firstName
                    );

                }


                // Update the handle/username display
                const handleElement =
                    document.getElementById(
                        "userHandle"
                    );


                if (handleElement) {

                    handleElement.textContent =
                        "@" + data.firstName.toLowerCase().replace(/\s+/g, "");

                    console.log(
                        "Updated userHandle to:",
                        handleElement.textContent
                    );

                }


                // Update avatar initials from firstName
                updateAvatarInitials(
                    data.firstName
                );


                /*
                 * Also update the internal
                 * profile object so other
                 * functions use the real name.
                 */

                profile.name =
                    data.firstName;


                updateProfileCompletion();

                showToast(
                    `Welcome back, ${data.firstName}!`,
                    "success"
                );

            } else {

                throw new Error(
                    "No firstName in response"
                );

            }

        }

        catch (error) {

            console.error(
                "Failed to fetch user data:",
                error
            );


            /*
             * Keep the page usable even
             * if API request fails.
             */

            const nameElement =
                document.getElementById(
                    "userFullName"
                );


            if (nameElement) {

                nameElement.textContent =
                    "New Scholar";

            }


            const handleElement =
                document.getElementById(
                    "userHandle"
                );


            if (handleElement) {

                handleElement.textContent =
                    "@newscholar";

            }


            showToast(
                "Could not load user data. Check console.",
                "error"
            );

        }

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message,
        type = "default"
    ) {

        let toast =
            document.getElementById(
                "toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.id =
                "toast";

            toast.className =
                "toast";

            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        toast.className =
            `toast show ${type}`;


        clearTimeout(
            toast._timer
        );


        toast._timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2800);

    }


    /* =====================================================
       PROFILE STATS
       ===================================================== */

    function updateProfileStats() {

        const stats = {
            "followers": profile.followers,
            "following": profile.following,
            "sprints": profile.sprints,
            "questions": profile.questions,
            "contests": profile.contests,
            "tournaments": profile.tournaments
        };


        Object.entries(stats).forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element) {

                    element.textContent =
                        value;

                }

            }
        );

    }


    /* =====================================================
       PROFILE COMPLETION
       ===================================================== */

    function updateProfileCompletion() {

        let completionScore = 0;

        const checks = {
            "name": profile.name !== "New Scholar",
            "bio": profile.bio !== "",
            "skills": profile.skills.length > 0,
            "avatar": localStorage.getItem("archive_profile_avatar") !== null
        };


        Object.values(checks).forEach(
            (check) => {

                if (check)
                    completionScore += 25;

            }
        );


        const completionText =
            document.getElementById(
                "completionText"
            );


        const completionBar =
            document.getElementById(
                "completionBar"
            );


        if (completionText) {

            completionText.textContent =
                `${completionScore}%`;

        }


        if (completionBar) {

            completionBar.style.width =
                `${completionScore}%`;

        }

    }


    /* =====================================================
       PROFILE PHOTO
       ===================================================== */

    const avatarInput =
        document.getElementById(
            "photoInput"
        );


    const avatarPreview =
        document.getElementById(
            "avatarImage"
        );


    if (avatarInput) {

        avatarInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files?.[0];


                if (!file)
                    return;


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showToast(
                        "Please select an image file.",
                        "error"
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        if (avatarPreview) {

                            avatarPreview.src =
                                event.target.result;

                        }


                        localStorage.setItem(
                            "archive_profile_avatar",
                            event.target.result
                        );


                        showToast(
                            "Profile photograph updated."
                        );

                        updateProfileCompletion();

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       LOAD SAVED PROFILE PHOTO
       ===================================================== */

    const savedAvatar =
        localStorage.getItem(
            "archive_profile_avatar"
        );


    if (
        savedAvatar &&
        avatarPreview
    ) {

        avatarPreview.src =
            savedAvatar;

    }


    /* =====================================================
       FOLLOW BUTTON
       ===================================================== */

    const followButton =
        document.getElementById(
            "followBtn"
        );


    if (followButton) {

        let following = false;


        followButton.addEventListener(
            "click",
            () => {

                following =
                    !following;


                if (following) {

                    followButton.innerHTML =
                        `<i class="fa-solid fa-user-check"></i> Following`;

                    followButton.classList.add(
                        "active"
                    );


                    profile.followers++;


                    showToast(
                        "You are now following this scholar."
                    );

                }

                else {

                    followButton.innerHTML =
                        `<i class="fa-solid fa-user-plus"></i> Follow`;

                    followButton.classList.remove(
                        "active"
                    );


                    profile.followers =
                        Math.max(
                            0,
                            profile.followers - 1
                        );


                    showToast(
                        "Scholar removed from your following list."
                    );

                }


                updateProfileStats();

            }
        );

    }


    /* =====================================================
       EDIT PROFILE
       ===================================================== */

    const editBtn =
        document.getElementById(
            "editBtn"
        );

    const editModal =
        document.getElementById(
            "editModal"
        );

    const saveProfileBtn =
        document.getElementById(
            "saveProfile"
        );

    const editNameInput =
        document.getElementById(
            "editName"
        );

    const editUsernameInput =
        document.getElementById(
            "editUsername"
        );

    const editBioInput =
        document.getElementById(
            "editBio"
        );


    if (editBtn) {

        editBtn.addEventListener(
            "click",
            () => {

                if (editModal) {

                    editModal.classList.add(
                        "open"
                    );

                    if (editNameInput) {

                        editNameInput.value =
                            profile.name;

                    }

                    if (editUsernameInput) {

                        editUsernameInput.value =
                            profile.firstName;

                    }

                    if (editBioInput) {

                        editBioInput.value =
                            profile.bio;

                    }

                }

            }
        );

    }


    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            () => {

                if (editNameInput) {

                    profile.name =
                        editNameInput.value;

                    const nameElement =
                        document.getElementById(
                            "userFullName"
                        );

                    if (nameElement) {

                        nameElement.textContent =
                            profile.name;

                    }

                    // Update initials when name changes
                    updateAvatarInitials(
                        profile.name
                    );

                }


                if (editUsernameInput) {

                    profile.firstName =
                        editUsernameInput.value;

                    const handleElement =
                        document.getElementById(
                            "userHandle"
                        );

                    if (handleElement) {

                        handleElement.textContent =
                            "@" + profile.firstName.toLowerCase().replace(/\s+/g, "");

                    }

                }


                if (editBioInput) {

                    profile.bio =
                        editBioInput.value;

                    const bioElement =
                        document.getElementById(
                            "bio"
                        );

                    if (bioElement) {

                        bioElement.textContent =
                            profile.bio;

                    }

                }


                closeModal(editModal);

                updateProfileCompletion();

                showToast(
                    "Profile updated successfully!"
                );

            }
        );

    }


    /* =====================================================
       MODAL CONTROLS
       ===================================================== */

    function closeModal(modal) {

        if (modal) {

            modal.classList.remove(
                "open"
            );

        }

    }


    const modalCloseButtons =
        document.querySelectorAll(
            "[data-close]"
        );


    modalCloseButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    let modal =
                        event.target.closest(
                            ".modal"
                        );

                    closeModal(modal);

                }
            );

        }
    );


    /* =====================================================
       COPY HANDLE
       ===================================================== */

    const copyHandle =
        document.getElementById(
            "copyHandle"
        );


    if (copyHandle) {

        copyHandle.addEventListener(
            "click",
            () => {

                const handleElement =
                    document.getElementById(
                        "userHandle"
                    );

                if (handleElement) {

                    const text =
                        handleElement.textContent;

                    navigator.clipboard.writeText(
                        text
                    ).then(() => {

                        showToast(
                            `Copied: ${text}`
                        );

                    }).catch(() => {

                        showToast(
                            "Failed to copy",
                            "error"
                        );

                    });

                }

            }
        );

    }


    /* =====================================================
       SHARE BUTTON
       ===================================================== */

    const shareBtn =
        document.getElementById(
            "shareBtn"
        );


    if (shareBtn) {

        shareBtn.addEventListener(
            "click",
            () => {

                if (navigator.share) {

                    navigator.share({
                        title: `${profile.name}'s Scholar Profile`,
                        text: "Check out my profile on The Archive!"
                    }).catch(
                        (error) => console.log(
                            "Share error:",
                            error
                        )
                    );

                }

                else {

                    showToast(
                        "Share not supported on this device",
                        "info"
                    );

                }

            }
        );

    }


    /* =====================================================
       SKILL MANAGEMENT
       ===================================================== */

    const addSkillBtn =
        document.getElementById(
            "addSkillBtn"
        );

    const skillModal =
        document.getElementById(
            "skillModal"
        );

    const saveSkillBtn =
        document.getElementById(
            "saveSkill"
        );

    const skillNameInput =
        document.getElementById(
            "skillName"
        );

    const skillLevelSelect =
        document.getElementById(
            "skillLevel"
        );


    if (addSkillBtn) {

        addSkillBtn.addEventListener(
            "click",
            () => {

                if (skillModal) {

                    skillModal.classList.add(
                        "open"
                    );

                }

            }
        );

    }


    if (saveSkillBtn) {

        saveSkillBtn.addEventListener(
            "click",
            () => {

                if (skillNameInput && skillNameInput.value.trim()) {

                    const skillName =
                        skillNameInput.value.trim();

                    const skillLevel =
                        skillLevelSelect?.value || "Beginner";


                    profile.skills.push(
                        `${skillName} (${skillLevel})`
                    );


                    skillNameInput.value =
                        "";

                    skillLevelSelect.value =
                        "Beginner";

                    closeModal(skillModal);

                    renderSkills();

                    updateProfileCompletion();

                    showToast(
                        `Added skill: ${skillName}`
                    );

                }

                else {

                    showToast(
                        "Please enter a skill name",
                        "error"
                    );

                }

            }
        );

    }


    function renderSkills() {

        const skillsContainer =
            document.getElementById(
                "skillsList"
            );


        if (!skillsContainer)
            return;


        if (
            profile.skills.length === 0
        ) {

            skillsContainer.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">

                        <i class="fa-solid fa-layer-group"></i>

                    </div>

                    <h3>
                        No skills added yet
                    </h3>

                    <p>
                        Tell your peers what you are learning.
                        Skills will appear here with progress
                        as you practice.
                    </p>

                    <button
                        class="primary small"
                        id="emptySkillBtn">

                        Add your first skill

                    </button>

                </div>

            `;

            return;

        }


        skillsContainer.innerHTML =
            profile.skills
                .map(
                    (skill, index) => `

                        <div class="skill-tag">

                            <span>
                                ${escapeHTML(skill)}
                            </span>

                            <button
                                type="button"
                                class="remove-skill"
                                data-index="${index}">

                                ×

                            </button>

                        </div>

                    `
                )
                .join("");


        $$(".remove-skill").forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        profile.skills.splice(
                            index,
                            1
                        );


                        renderSkills();

                        updateProfileCompletion();

                    }
                );

            }
        );

    }


    /* =====================================================
       ACTIVITY HEATMAP
       ===================================================== */

    const heatmap =
        document.getElementById(
            "heatmap"
        );


    function generateContributionLevel(
        count
    ) {

        if (count === 0)
            return "level-0";

        if (count <= 2)
            return "level-1";

        if (count <= 5)
            return "level-2";

        if (count <= 8)
            return "level-3";

        return "level-4";

    }


    function buildHeatmap() {

        if (!heatmap)
            return;


        heatmap.innerHTML = "";


        const days = 365;


        for (
            let i = 0;
            i < days;
            i++
        ) {

            const cell =
                document.createElement(
                    "div"
                );


            cell.className =
                "activity-cell";


            const contributions = 0;


            cell.dataset.contributions =
                contributions;


            cell.classList.add(
                generateContributionLevel(
                    contributions
                )
            );


            const date =
                new Date();


            date.setDate(
                date.getDate() -
                (days - i)
            );


            const formattedDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );


            cell.title =
                `${formattedDate} — ${contributions} contribution${contributions === 1 ? "" : "s"}`;


            heatmap.appendChild(
                cell
            );

        }

    }


    /* =====================================================
       ACTIVITY SUMMARY
       ===================================================== */

    function updateActivitySummary() {

        const contributionElement =
            document.getElementById(
                "activityTotal"
            );


        const streakElement =
            document.getElementById(
                "currentStreak"
            );


        const bestStreakElement =
            document.getElementById(
                "bestStreak"
            );


        if (contributionElement) {

            contributionElement.textContent =
                profile.contributions;

        }


        if (streakElement) {

            streakElement.textContent =
                profile.currentStreak;

        }


        if (bestStreakElement) {

            bestStreakElement.textContent =
                profile.bestStreak;

        }

    }


    /* =====================================================
       DARK MODE
       ===================================================== */

    const themeButton =
        document.getElementById(
            "themeBtn"
        );


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(
                    "archive_theme",
                    isDark
                        ? "dark"
                        : "light"
                );

            }
        );

    }


    const savedTheme =
        localStorage.getItem(
            "archive_theme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            closeModal(
                editModal
            );


            closeModal(
                skillModal
            );

        }
    );


    /* =====================================================
       UTILITY
       ===================================================== */

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       INITIALIZE PAGE
       ===================================================== */

    updateProfileStats();

    updateActivitySummary();

    updateProfileCompletion();

    buildHeatmap();

    renderSkills();

    // Initialize with default initials
    updateAvatarInitials("New Scholar");


    /*
     * ✅ DASHBOARD LOAD HOTE HI /fetch_user_data API CALL HOGA
     * 
     * Backend se firstName mila toh page par user ka 
     * name print hoga, handle update hoga, aur initials
     * bhi firstName ke hisaab se change hoga.
     */

    console.log("🚀 Initializing Dashboard - calling fetchUserData()");

    fetchUserData();

});