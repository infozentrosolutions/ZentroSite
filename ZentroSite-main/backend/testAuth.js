// using native Node fetch

const testLogin = async () => {
    try {
        console.log('Testing Admin Login...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@zen.com',
                password: 'admin123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Response Status:', loginRes.status);
        console.log('Response Body:', loginData);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testLogin();
