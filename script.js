"use strict";
// Get references to the form and display area
const form = document.getElementById('resume-form');
const resumeDisplayElement = document.getElementById('resume-display');
const shareableLinkContainer = document.getElementById('shareable-link-container');
const shareableLinkElement = document.getElementById('shareable-link');
const downloadPdfButton = document.getElementById('download-pdf');

// Handle form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload
    
    // Collect input values
    const username = document.getElementById('username').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const education = document.getElementById('education').value;
    const experience = document.getElementById('experience').value;
    const skills = document.getElementById('skills').value;
    const profilePicInput = document.getElementById('profile-pic');

    // Read profile picture if uploaded
    let profilePicURL = '';
    if (profilePicInput.files && profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePicURL = e.target.result;
            generateResume(); // Generate resume after loading image
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        generateResume(); // Generate resume without image if not uploaded
    }

    // Save form data in localStorage with the username as the key
    const resumeData = {
        name,
        email,
        phone,
        education,
        experience,
        skills,
        profilePicURL // Save profile picture URL to localStorage
    };
    localStorage.setItem(username, JSON.stringify(resumeData)); // Save resume data locally

    // Function to generate resume HTML
    function generateResume() {
        // Generate the resume content dynamically
        const resumeHTML = `
            <h2>Editable Resume</h2>
            ${profilePicURL ? `<img src="${profilePicURL}" alt="Profile Picture" style="max-width: 150px; border-radius: 50%; margin-bottom: 15px;" />` : ''}
            <h3>Personal Information</h3>
            <p><b>Name:</b> <span contenteditable="true">${name}</span></p>
            <p><b>Email:</b> <span contenteditable="true">${email}</span></p>
            <p><b>Phone:</b> <span contenteditable="true">${phone}</span></p>

            <h3>Education</h3>
            <p contenteditable="true">${education}</p>

            <h3>Experience</h3>
            <p contenteditable="true">${experience}</p>

            <h3>Skills</h3>
            <p contenteditable="true">${skills}</p>
        `;

        // Display the generated resume
        resumeDisplayElement.innerHTML = resumeHTML;

        // Generate a shareable URL with the username
        const shareableURL = `${window.location.origin}?username=${encodeURIComponent(username)}`;

        // Display the shareable link
        shareableLinkContainer.style.display = 'block';
        shareableLinkElement.href = shareableURL;
        shareableLinkElement.textContent = shareableURL;
    }
});

// Handle PDF download
downloadPdfButton.addEventListener('click', () => {
    window.print(); // This will open the print dialog and allow the user to save as PDF
});

// Prefill the form based on the username in the URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (username) {
        // Autofill form if data is found in localStorage
        const savedResumeData = localStorage.getItem(username);
        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            document.getElementById('username').value = username;
            document.getElementById('name').value = resumeData.name;
            document.getElementById('email').value = resumeData.email;
            document.getElementById('phone').value = resumeData.phone;
            document.getElementById('education').value = resumeData.education;
            document.getElementById('experience').value = resumeData.experience;
            document.getElementById('skills').value = resumeData.skills;

            // If profile picture URL exists, update the resume
            if (resumeData.profilePicURL) {
                // Generate the resume again with the profile picture
                const resumeHTML = `
                    <h2>Editable Resume</h2>
                    <img src="${resumeData.profilePicURL}" alt="Profile Picture" style="max-width: 150px; border-radius: 50%; margin-bottom: 15px;" />
                    <h3>Personal Information</h3>
                    <p><b>Name:</b> <span contenteditable="true">${resumeData.name}</span></p>
                    <p><b>Email:</b> <span contenteditable="true">${resumeData.email}</span></p>
                    <p><b>Phone:</b> <span contenteditable="true">${resumeData.phone}</span></p>

                    <h3>Education</h3>
                    <p contenteditable="true">${resumeData.education}</p>

                    <h3>Experience</h3>
                    <p contenteditable="true">${resumeData.experience}</p>

                    <h3>Skills</h3>
                    <p contenteditable="true">${resumeData.skills}</p>
                `;
                resumeDisplayElement.innerHTML = resumeHTML;
            }
        }
    }
});
