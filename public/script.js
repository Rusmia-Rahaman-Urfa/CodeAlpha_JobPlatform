/**
 * DevHire Frontend Logic
 * Handles Job Fetching, Filtering, and Application Submission
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const jobList = document.getElementById('jobList');
    const searchInput = document.getElementById('searchInput');
    const jobForm = document.getElementById('jobForm');
    const postModal = document.getElementById('postModal');

    // 1. Fetch and Render Jobs
    async function fetchJobs(search = '') {
        try {
            const res = await fetch(`/api/jobs?search=${search}`);
            if (!res.ok) throw new Error('Network response was not ok');
            
            const jobs = await res.json();
            
            if (jobs.length === 0) {
                jobList.innerHTML = `<p class="text-center text-gray-500 py-10">No jobs found matching "${search}"</p>`;
                return;
            }

            jobList.innerHTML = jobs.map(job => `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition gap-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="text-xl font-bold text-gray-800">${job.title}</h4>
                            <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">${job.type || 'Full-time'}</span>
                        </div>
                        <p class="text-blue-600 font-medium">${job.company} • ${job.location}</p>
                        <p class="text-sm text-gray-400 mt-2 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Posted on ${new Date(job.postedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button onclick="openApplyModal('${job._id}', '${job.title}')" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full md:w-auto">
                        Apply Now
                    </button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Fetch Error:', error);
            jobList.innerHTML = `<p class="text-center text-red-500 py-10">Error loading jobs. Please check backend connection.</p>`;
        }
    }

    // 2. Handle Search Input (Debounced)
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fetchJobs(e.target.value);
        }, 500); // Wait 500ms after typing stops to reduce server load
    });

    // 3. Handle Job Posting (Employer View)
    jobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(jobForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                jobForm.reset();
                postModal.classList.add('hidden');
                fetchJobs(); // Refresh list
                alert('Job posted successfully!');
            }
        } catch (error) {
            console.error('Post Error:', error);
            alert('Failed to post job.');
        }
    });

    // Initial Load
    fetchJobs();
});

/**
 * Global Function to handle Applications
 * Note: For a real platform, you'd trigger a second modal here for the Resume upload.
 */
function openApplyModal(jobId, jobTitle) {
    // Professional prompt to demonstrate logic (In production, replace with a dedicated Apply Modal)
    const name = prompt(`Applying for ${jobTitle}\nEnter your Full Name:`);
    const email = prompt(`Enter your Email:`);
    
    if (name && email) {
        alert(`Application initialization for ${jobTitle} successful!\nIn the full version, this triggers the Multer PDF upload at /api/applications.`);
        // Logic for POSTing to /api/applications with FormData would go here
    }
}