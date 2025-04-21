import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee'
  }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(CURRENCIES.USD);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      setCurrency(CURRENCIES[savedCurrency]);
    }
    
    // Try to load cached exchange rates first
    const cachedRates = localStorage.getItem('exchangeRates');
    const cachedTimestamp = localStorage.getItem('ratesLastUpdated');
    
    if (cachedRates && cachedTimestamp) {
      const parsedRates = JSON.parse(cachedRates);
      const timestamp = new Date(cachedTimestamp);
      const now = new Date();
      
      // Use cached rates if they're less than 24 hours old
      if ((now - timestamp) < 24 * 60 * 60 * 1000) {
        setExchangeRates(parsedRates);
        setLastUpdated(timestamp);
        setIsLoading(false);
        console.log('Using cached exchange rates');
        return;
      }
    }
    
    // Fetch fresh exchange rates if no cache or cache is outdated
    fetchExchangeRates();
  }, []);
  
  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      
      // Using the API key from environment variables
      const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;
      if (!apiKey) {
        console.warn('Exchange API key is missing. Please set VITE_EXCHANGE_API_KEY in .env file.');
      }
      
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      if (data.result === 'success') {
        const rates = data.conversion_rates;
        setExchangeRates(rates);
        setLastUpdated(new Date());
        
        // Cache the results
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        localStorage.setItem('ratesLastUpdated', new Date().toISOString());
        
        setError(null);
        console.log('Exchange rates updated successfully');
      } else {
        throw new Error(data.error-type || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching exchange rates:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const changeCurrency = (currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      const previousCode = currency.code;
      
      // Update the currency
      setCurrency(CURRENCIES[currencyCode]);
      localStorage.setItem('currency', currencyCode);
      
      console.log(`Currency changed from ${previousCode} to ${currencyCode}`);
      
      // Force components to update by changing isLoading state
      if (!isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 50);
      }
    }
  };
  
  const convertAmount = (amount, fromCurrency = currency.code, toCurrency = currency.code) => {
    if (!amount || isNaN(amount)) return 0;
    
    // If rates aren't loaded yet or there's an error, return original amount
    if (isLoading || error || !exchangeRates || Object.keys(exchangeRates).length === 0) {
      return parseFloat(amount);
    }
    
    // If the currencies are the same, no conversion needed
    if (fromCurrency === toCurrency || fromCurrency === currency.code) {
      return parseFloat(amount);
    }
    
    try {
      // Log for debugging
      console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency || currency.code}`);
      
      // Convert amount to USD first (if not already USD)
      let amountInUSD = parseFloat(amount);
      if (fromCurrency !== 'USD') {
        // Check if we have the exchange rate
        if (!exchangeRates[fromCurrency]) {
          console.error('Missing exchange rate for', fromCurrency);
          return parseFloat(amount);
        }
        amountInUSD = amount / exchangeRates[fromCurrency];
      }
      
      // If target currency is USD, we're done
      if ((toCurrency && toCurrency === 'USD') || (!toCurrency && currency.code === 'USD')) {
        return amountInUSD;
      }
      
      // Determine the target currency
      const targetCurrency = toCurrency || currency.code;
      
      // Check if we have the exchange rate for target currency
      if (!exchangeRates[targetCurrency]) {
        console.error('Missing exchange rate for', targetCurrency);
        return parseFloat(amount);
      }
      
      const convertedAmount = amountInUSD * exchangeRates[targetCurrency];
      console.log('Converted amount:', convertedAmount);
      return convertedAmount;
    } catch (err) {
      console.error('Error during currency conversion:', err);
      return parseFloat(amount); // Return original amount on error
    }
  };
  
  const formatAmount = (amount, includeSymbol = true) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return includeSymbol ? `${currency.symbol}${formattedAmount}` : formattedAmount;
  };
  
  const value = {
    currency,
    currencies: CURRENCIES,
    isLoading,
    error,
    lastUpdated,
    changeCurrency,
    convertAmount,
    formatAmount,
    refreshRates: fetchExchangeRates
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 