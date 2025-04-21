# PennyPal - Personal Finance Tracking Application

PennyPal is a modern, intuitive expense tracking application built with React that helps users manage their finances, track expenses, set budgets, and visualize spending patterns.

![PennyPal Dashboard](/public/dashboard-preview.png)

## Features

- **Expense Tracking**: Add, edit, and delete expenses with customizable categories
- **Multi-Currency Support**: Track expenses in different currencies with real-time conversion
- **Budget Management**: Set and monitor category-specific and overall budgets
- **Visualization**: Interactive charts and graphs for spending analysis
- **Reports & Insights**: Detailed financial reports with spending breakdowns
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing

## Tech Stack

- **Frontend**: React 19 with React Router
- **State Management**: React Context API
- **Visualization**: Chart.js with react-chartjs-2
- **Styling**: CSS with custom variables for theming
- **Build Tool**: Vite
- **API Integration**: Currency conversion with ExchangeRate API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/itsanshboiii/penny-pal.git
   cd penny-pal
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your API key:
   ```
   VITE_EXCHANGE_API_KEY=your_exchangerate_api_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Application Structure

- `/src/components` - Reusable UI components
- `/src/context` - React Context providers for state management
- `/src/pages` - Main application pages
- `/src/styles` - CSS styles and variables
- `/src/utils` - Utility functions and helpers
- `/src/layouts` - Layout components for page structure
- `/src/assets` - Static assets like images and icons

## Main Features Breakdown

### Dashboard

The Dashboard provides an overview of your financial status, including:
- Current month's expense summary
- Budget remaining
- Recent transactions
- Quick access to main features

### Expense Management

- Add expenses with details like amount, date, category, and description
- Support for multiple currencies
- Filter and search functionality
- Edit or delete existing expenses

### Budget Tracking

- Set monthly budgets for specific categories
- Visual indicators for budget utilization
- Alerts for approaching or exceeding budget limits

### Reports & Analytics

- Visual breakdown of expenses by category
- Monthly and weekly spending trends
- Day-of-week spending patterns
- Highest expense identification
- Customizable date ranges for analysis

### Multi-Currency Support

- Track expenses in different currencies
- Real-time currency conversion using exchange rates
- Persistent currency preference

## Building for Production

To build the application for production, run:

```
npm run build
```

The optimized build will be available in the `dist` directory.

## License

[MIT License](LICENSE)

## Acknowledgements

- [ExchangeRate API](https://www.exchangerate-api.com/) for currency conversion
- [Chart.js](https://www.chartjs.org/) for data visualization
- [React](https://reactjs.org/) and the React ecosystem
