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
}
// --- Company Data ---
const companiesData = [
    { name: 'Google', logo: 'https://th.bing.com/th/id/OIP.S3bn8v2hysgDyxYDkuEc5wHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'Organizing the world\'s information and making it universally accessible.' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', desc: 'Empowering every person and every organization on the planet to achieve more.' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', desc: 'The world\'s leading streaming entertainment service with award-winning content.' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', desc: 'Building technologies that help people connect, find communities, and grow businesses.' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', desc: 'Earth\'s most customer-centric company, where people can find anything they want to buy online.' },
    { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg', desc: 'Accelerating the world\'s transition to sustainable energy with electric cars and solar.' }
];

// --- Navigation Functions ---

async function showCompanies() {
    // Switch View
    document.getElementById('companySection').classList.remove('hidden');
    document.getElementById('mainHeader').classList.add('hidden');
    document.getElementById('jobMain').classList.add('hidden');

    // Render Companies
    const list = document.getElementById('companyList');
    list.innerHTML = companiesData.map(c => `
        <div class="company-card bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center animate__animated animate__fadeIn">
            <div class="h-16 w-full flex items-center justify-center mb-6">
                <img src="${c.logo}" alt="${c.name}" class="max-h-full max-w-[120px] object-contain">
            </div>
            <h4 class="text-xl font-extrabold text-slate-900 mb-3">${c.name}</h4>
            <p class="text-slate-500 text-sm leading-relaxed">${c.desc}</p>
            <button class="mt-6 text-blue-600 font-bold text-sm hover:underline">View Openings</button>
        </div>
    `).join('');
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