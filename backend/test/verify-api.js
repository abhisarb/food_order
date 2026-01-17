const query = `
  query GetCountries {
    countries {
      id
      name
      code
    }
  }
`;

async function testApi() {
    try {
        console.log('Fetching from http://localhost:4000/graphql...');
        // Node 18+ has native fetch
        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        console.log('Status:', response.status);
        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('API Error:', error);
    }
}

testApi();
