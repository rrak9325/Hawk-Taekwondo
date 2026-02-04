export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body
  
  // HARDCODED CREDENTIALS - NO BCRYPT NEEDED
  if (username === 'yaju9325' && password === 'rathod1234') {
    return res.json({ 
      success: true, 
      token: 'admin-token-valid',
      message: 'Login successful' 
    })
  }
  
  return res.status(401).json({ error: 'Invalid credentials' })
}