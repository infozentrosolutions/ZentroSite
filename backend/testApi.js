const createTest = async () => {
    try {
        console.log('Testing Backend API...');

        // 1. Register Admin
        const adminRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Admin',
                email: 'admin' + Date.now() + '@test.com',
                password: 'password123',
                role: 'admin'
            })
        });
        const adminData = await adminRes.json();
        console.log('Register Admin:', adminRes.status, adminData);

        if (!adminData._id) {
            console.error('Failed to create admin.');
            return;
        }

        // 2. Login Admin
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: adminData.email,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Admin:', loginRes.status, loginData.token ? 'Success (Token received)' : 'Failed');

        if (!loginData.token) return;

        // 3. Create Internship
        const internshipRes = await fetch('http://localhost:5000/api/internships', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                title: 'Full Stack Web Dev',
                description: 'Learn MERN stack',
                duration: '3 months'
            })
        });
        const internshipData = await internshipRes.json();
        console.log('Create Internship:', internshipRes.status, internshipData);

        console.log('Backend verification completed successfully!');
    } catch (err) {
        console.error('Test failed:', err);
    }
};

createTest();
