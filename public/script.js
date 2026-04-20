document.addEventListener('DOMContentLoaded', () => {
    const jobList = document.getElementById('jobList');
    const searchInput = document.getElementById('searchInput');
    const jobForm = document.getElementById('jobForm');
    const applyForm = document.getElementById('applyForm');
    const postModal = document.getElementById('postModal');
    const applyModal = document.getElementById('applyModal');

    // Fetch and Render Jobs
    async function fetchJobs(search = '') {
        try {
            // Updated to point to absolute backend URL
            const res = await fetch(`http://localhost:5006/api/jobs?search=${search}`);
            const jobs = await res.json();
            
            if (jobs.length === 0) {
                jobList.innerHTML = `<div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p class="text-slate-400 font-medium">No opportunities found. Try a different search.</p>
                </div>`;
                return;
            }

            jobList.innerHTML = jobs.map((job, index) => `
                <div onclick="viewJobDetails('${job._id}')" class="job-card cursor-pointer bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                    <div class="flex gap-6 items-center">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h4 class="text-xl font-extrabold text-slate-800">${job.title}</h4>
                            <div class="flex flex-wrap gap-3 mt-1">
                                <span class="text-blue-600 font-bold text-sm">${job.company}</span>
                                <span class="text-slate-400 text-sm">•</span>
                                <span class="text-slate-500 font-medium text-sm">${job.location}</span>
                            </div>
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); openApplyModal('${job._id}', '${job.title}')" 
                        class="bg-blue-50 text-blue-600 px-8 py-3.5 rounded-full font-black hover:bg-blue-600 hover:text-white transition-all w-full md:w-auto shadow-sm">
                        Apply Now
                    </button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    }

    // Handle Job Posting
    jobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(jobForm);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('http://localhost:5006/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert('Job Posted Successfully! 🚀');
                jobForm.reset();
                postModal.classList.add('hidden');
                fetchJobs();
            }
        } catch (err) {
            console.error('Post Error:', err);
            alert('Server is not responding.');
        }
    });

    // Handle Job Application
    applyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(applyForm);

        try {
            const res = await fetch('http://localhost:5006/api/applications', {
                method: 'POST',
                body: formData 
            });

            if (res.ok) {
                alert('🚀 Application sent successfully!');
                applyForm.reset();
                applyModal.classList.add('hidden');
            }
        } catch (err) {
            console.error('Apply Error:', err);
        }
    });

    // Search Logic
    let timeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fetchJobs(e.target.value), 400);
    });

    fetchJobs();
});

// View Details Function
async function viewJobDetails(jobId) {
    try {
        const res = await fetch(`http://localhost:5006/api/jobs/${jobId}`);
        const job = await res.json();
        
        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div class="flex items-center gap-6 mb-8">
                <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    ${job.company.charAt(0)}
                </div>
                <div>
                    <h2 class="text-3xl font-black text-slate-900">${job.title}</h2>
                    <p class="text-blue-600 font-bold">${job.company} • ${job.location}</p>
                </div>
            </div>
            <div class="prose prose-slate max-w-none">
                <h4 class="text-lg font-bold mb-2">About the Role</h4>
                <p class="text-slate-600 leading-relaxed mb-6">${job.description}</p>
            </div>
            <div class="mt-10">
                <button onclick="openApplyModal('${job._id}', '${job.title}')" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition">Apply for this Position</button>
            </div>
        `;
        document.getElementById('detailModal').classList.remove('hidden');
    } catch (err) {
        console.error("Error loading details:", err);
    }
}

// Show Companies View
async function showCompanies() {
    document.getElementById('companySection').classList.remove('hidden');
    document.querySelector('header').classList.add('hidden');
    document.querySelector('main').classList.add('hidden');
    // Fetch logic would go here once your User route is ready
}

// Go back to Jobs View
function showJobs() {
    document.getElementById('companySection').classList.add('hidden');
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('main').classList.remove('hidden');
}

window.closeDetailModal = () => document.getElementById('detailModal').classList.add('hidden');

window.openApplyModal = (id, title) => {
    document.getElementById('applyJobId').value = id;
    document.getElementById('applyJobTitle').innerText = title;
    document.getElementById('applyModal').classList.remove('hidden');
    document.getElementById('detailModal').classList.add('hidden'); // Close detail modal if open
};