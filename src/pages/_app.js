import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { WorksProvider } from '../context/WorksContext';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <WorksProvider>
        <Component {...pageProps} />
      </WorksProvider>
    </ThemeProvider>
  );
}

export default MyApp; 