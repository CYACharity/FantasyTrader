# Backend Setup Guide for Stocks League

This guide will help you set up the backend server to store data for your Stocks League application.

## Quick Start

### Step 1: Install Dependencies

Open a terminal and navigate to the backend directory:

```bash
cd "/Users/wyatterdmann/Desktop/Stocks League HTMLs/backend"
npm install
```

### Step 2: Set Up Environment

Create a `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file and set your JWT secret (change the default value):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-unique-secret-key-here
```

### Step 3: Initialize Database

Run the database initialization script:

```bash
npm run init-db
```

This will create the SQLite database file at `backend/data/stocks_league.db` with all necessary tables.

### Step 4: Start the Server

Start the backend server:

```bash
npm start
```

You should see:
```
✅ Connected to SQLite database
✅ Database tables initialized
🚀 Server is running on http://localhost:3000
📊 API endpoints available at http://localhost:3000/api
```

### Step 5: Update Frontend

1. **Add the API client script** to your HTML files. Add this before other scripts:

```html
<script src="js/api-client.js"></script>
```

2. **Update your frontend code** to use the API instead of localStorage. See examples below.

## Migration Guide: From localStorage to API

### Authentication

**Before (localStorage):**
```javascript
localStorage.setItem('username', username);
window.location.href = 'dashboard.html';
```

**After (API):**
```javascript
try {
  const response = await API.Auth.register(email, password, fullName, username, showTutorial);
  window.location.href = 'dashboard.html';
} catch (error) {
  alert('Registration failed: ' + error.message);
}
```

### Leagues

**Before (localStorage):**
```javascript
let leagues = JSON.parse(localStorage.getItem('stockLeagues') || '[]');
leagues.push(newLeague);
localStorage.setItem('stockLeagues', JSON.stringify(leagues));
```

**After (API):**
```javascript
try {
  const response = await API.League.createLeague(leagueData);
  console.log('League created:', response.league);
  window.location.href = `your-league.html?code=${response.league.leagueCode}`;
} catch (error) {
  alert('Failed to create league: ' + error.message);
}
```

### Getting Leagues

**Before:**
```javascript
const leagues = JSON.parse(localStorage.getItem('stockLeagues') || '[]');
```

**After:**
```javascript
try {
  const { leagues } = await API.League.getAllLeagues();
  // Use leagues array
} catch (error) {
  console.error('Failed to fetch leagues:', error);
}
```

### Portfolio

**Before:**
```javascript
const portfolio = JSON.parse(localStorage.getItem('portfolioData') || '{}');
```

**After:**
```javascript
try {
  const { portfolio } = await API.Portfolio.getPortfolio();
  // Use portfolio object
} catch (error) {
  console.error('Failed to fetch portfolio:', error);
}
```

### Trades

**Before:**
```javascript
// Stored in localStorage
```

**After:**
```javascript
try {
  const response = await API.Trade.executeTrade({
    portfolioId: portfolio.id,
    stockSymbol: 'AAPL',
    stockName: 'Apple Inc.',
    tradeType: 'buy',
    shares: 10,
    pricePerShare: 150.00,
    sector: 'Technology'
  });
  console.log('Trade executed:', response);
} catch (error) {
  alert('Trade failed: ' + error.message);
}
```

## Example: Updated Signup Page

Here's how you might update `signup.html`:

```javascript
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;
  const fullName = this.querySelector('input[type="text"]').value;
  const showTutorial = document.getElementById('tutorialOption').checked;
  
  try {
    const response = await API.Auth.register(email, password, fullName, null, showTutorial);
    localStorage.setItem('showTutorial', showTutorial);
    window.location.href = 'survey.html';
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
});
```

## Example: Updated League Creation

Update `create-league.html`:

```javascript
async function createLeague() {
  const leagueData = {
    name: document.getElementById('leagueName').value,
    maxPlayers: playerCount,
    durationMonths: parseInt(document.getElementById('duration').value),
    stockUniverse: document.getElementById('stockUniverse').value,
    startingCapital: parseInt(document.getElementById('startingCapital').value),
    capitalTransferPercentage: parseInt(document.getElementById('capitalTransferPercentage').value),
    allowDayTrading: document.getElementById('allowDayTrading').checked,
    allowShortSelling: document.getElementById('allowShortSelling').checked,
    afterHoursTrading: document.getElementById('afterHoursTrading').checked,
    draftDate: document.getElementById('draftDate').value,
    draftType: document.getElementById('draftType').value,
    draftDurationSeconds: parseInt(document.getElementById('draftDuration').value),
    autoDraftStrategy: document.getElementById('autoDraftStrategy').value,
    rules: {
      totalStocks: 18,
      activeStocks: 11,
      sectorRequirements: true,
      marketCapDistribution: document.getElementById('stockUniverse').value === 'all' ? {
        microCap: 3, smallCap: 3, midCap: 3,
        upperMidCap: 3, largeCap: 3, megaCap: 3
      } : null
    }
  };
  
  try {
    const response = await API.League.createLeague(leagueData);
    window.location.href = `your-league.html?code=${response.league.leagueCode}`;
  } catch (error) {
    alert('Failed to create league: ' + error.message);
  }
}
```

## API Client Location

The API client is located at: `js/api-client.js`

Make sure to include it in your HTML files:
```html
<script src="js/api-client.js"></script>
```

## Testing the Backend

### Test Authentication

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

### Check Health

```bash
curl http://localhost:3000/api/health
```

## Troubleshooting

### Server won't start

1. Check if port 3000 is already in use
2. Make sure you've run `npm install`
3. Check the terminal for error messages

### Database errors

1. Delete `backend/data/stocks_league.db`
2. Run `npm run init-db` again

### CORS errors

The server already has CORS enabled. If you still see errors:
- Make sure the server is running on `http://localhost:3000`
- Check that `API_BASE_URL` in `js/api-client.js` matches your server URL

### Authentication not working

1. Check that you're storing the token after login/register
2. Verify the token is being sent in the Authorization header
3. Check server logs for authentication errors

## Next Steps

1. **Update your HTML files** to use the API client
2. **Test authentication flow** (signup/login)
3. **Test league creation and joining**
4. **Test portfolio and trading features**

## Need Help?

Check the backend README at `backend/README.md` for detailed API documentation.

