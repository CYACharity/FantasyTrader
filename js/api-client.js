/**
 * API Client for Stocks League Backend
 * This client replaces localStorage calls with API requests
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function to set auth token
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Helper function to remove auth token
function removeAuthToken() {
  localStorage.removeItem('authToken');
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
const AuthAPI = {
  async register(email, password, fullName, username, showTutorial) {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        fullName,
        username,
        showTutorial
      })
    });
    
    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('username', response.user.fullName || response.user.username);
    }
    
    return response;
  },

  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('username', response.user.fullName || response.user.username);
    }
    
    return response;
  },

  async verifyToken() {
    return await apiRequest('/auth/verify');
  },

  logout() {
    removeAuthToken();
    localStorage.removeItem('username');
  }
};

// User API
const UserAPI = {
  async getProfile() {
    return await apiRequest('/users/me');
  },

  async getPreferences() {
    return await apiRequest('/users/preferences');
  },

  async updatePreferences(preferences) {
    return await apiRequest('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  },

  async getUserLeagues() {
    return await apiRequest('/users/leagues');
  }
};

// League API
const LeagueAPI = {
  async getAllLeagues() {
    return await apiRequest('/leagues');
  },

  async getLeagueById(id) {
    return await apiRequest(`/leagues/${id}`);
  },

  async getLeagueByCode(code) {
    return await apiRequest(`/leagues/code/${code}`);
  },

  async createLeague(leagueData) {
    return await apiRequest('/leagues', {
      method: 'POST',
      body: JSON.stringify(leagueData)
    });
  },

  async joinLeague(code) {
    return await apiRequest(`/leagues/join/${code}`, {
      method: 'POST'
    });
  }
};

// Portfolio API
const PortfolioAPI = {
  async getPortfolio(leagueId = null) {
    const query = leagueId ? `?leagueId=${leagueId}` : '';
    return await apiRequest(`/portfolios${query}`);
  },

  async getHoldings(portfolioId) {
    return await apiRequest(`/portfolios/${portfolioId}/holdings`);
  },

  async getPortfolioHistory(portfolioId, timeframe = 30) {
    return await apiRequest(`/portfolios/${portfolioId}/history?timeframe=${timeframe}`);
  },

  async updatePortfolioValue(portfolioId, totalValue, cashBalance) {
    return await apiRequest(`/portfolios/${portfolioId}/value`, {
      method: 'PUT',
      body: JSON.stringify({ totalValue, cashBalance })
    });
  }
};

// Trade API
const TradeAPI = {
  async getTrades(portfolioId) {
    return await apiRequest(`/trades/portfolio/${portfolioId}`);
  },

  async executeTrade(tradeData) {
    return await apiRequest('/trades', {
      method: 'POST',
      body: JSON.stringify(tradeData)
    });
  }
};

// Stock API
const StockAPI = {
  async getWatchlist() {
    return await apiRequest('/stocks/watchlist');
  },

  async addToWatchlist(symbol, name) {
    return await apiRequest('/stocks/watchlist', {
      method: 'POST',
      body: JSON.stringify({ stockSymbol: symbol, stockName: name })
    });
  },

  async removeFromWatchlist(symbol) {
    return await apiRequest(`/stocks/watchlist/${symbol}`, {
      method: 'DELETE'
    });
  },

  async getStockQuote(symbol) {
    return await apiRequest(`/stocks/quote/${symbol}`);
  }
};

// Export API clients
window.API = {
  Auth: AuthAPI,
  User: UserAPI,
  League: LeagueAPI,
  Portfolio: PortfolioAPI,
  Trade: TradeAPI,
  Stock: StockAPI,
  
  // Utility functions
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated: () => !!getAuthToken()
};

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
  if (getAuthToken()) {
    try {
      const response = await AuthAPI.verifyToken();
      if (!response.valid) {
        removeAuthToken();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      removeAuthToken();
    }
  }
});

