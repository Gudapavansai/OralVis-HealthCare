import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element from the DOM
const rootElement = document.getElementById("root");

// Create a root and render the App component
createRoot(rootElement).render(<App />);
