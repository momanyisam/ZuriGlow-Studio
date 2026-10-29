// ========================================
// ZURIGLOW STUDIO
// Website interactions and booking requests
// ========================================

// Replace this placeholder with the business's WhatsApp number.
// Kenya example: 254712345678
const BUSINESS_WHATSAPP = "254714098733";

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after selecting a navigation link
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    });
});

// Automatically update the footer year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// Booking form elements
const bookingForm = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("serviceSelect");
const appointmentDate = document.getElementById("appointmentDate");
const formFeedback = document.getElementById("formFeedback");

// Prevent customers from selecting a date in the past
function setMinimumDate() {
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    appointmentDate.min = localToday;
}

setMinimumDate();

// Selecting a service from a service card fills the booking form
document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
        serviceSelect.value = link.dataset.service;
    });
});

// Display feedback messages
function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
}

// Handle appointment requests
bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
        return;
    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const service = serviceSelect.value;
    const date = appointmentDate.value;

    const time =
        document.getElementById("appointmentTime").value;

    const customerMessage =
        document.getElementById("customerMessage").value.trim();

    // Validate essential fields
    if (!customerName || !customerPhone || !service || !date || !time) {
        showFeedback("Please complete all required fields.", "error");
        return;
    }

    // Validate the appointment date
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
        showFeedback(
            "Please choose today or a future date.",
            "error"
        );
        appointmentDate.focus();
        return;
    }

    // Check the demonstration WhatsApp number has been configured
    if (!/^254\d{9}$/.test(BUSINESS_WHATSAPP)) {
        showFeedback(
            "The business WhatsApp number has not been configured correctly.",
            "error"
        );
        return;
    }

    // Prepare the appointment request
    const message = [
        "Hello ZuriGlow Studio! 💗",
        "",
        "I would like to request a beauty appointment.",
        "",
        `Name: ${customerName}`,
        `Phone: ${customerPhone}`,
        `Service: ${service}`,
        `Preferred date: ${date}`,
        `Preferred time: ${time}`,
        customerMessage
            ? `Additional details: ${customerMessage}`
            : "",
        "",
        "Please let me know if this time is available.",
        "",
        "I understand that my appointment is not confirmed until you reply."
    ].filter(Boolean).join("\n");

    const whatsappURL =
        `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;

    showFeedback(
        "Opening WhatsApp with your appointment request...",
        "success"
    );

    // Open WhatsApp; the customer must still press Send.
    const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

    // If the browser blocks the new tab, offer a direct link.
    if (!whatsappWindow) {
        formFeedback.innerHTML = "";

        const fallbackLink = document.createElement("a");
        fallbackLink.href = whatsappURL;
        fallbackLink.target = "_blank";
        fallbackLink.rel = "noopener noreferrer";
        fallbackLink.textContent = "Click here to open WhatsApp";
        fallbackLink.className = "service-link";

        formFeedback.append(
            document.createTextNode("Your request is ready. "),
            fallbackLink
        );
    }
});

