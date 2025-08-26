import { useLocation } from 'react-router-dom';
import PoliceHeader from './Header';
import PoliceFooter from './Footer';

export default function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // Change this if your home route is different

  return (
    <>
      {/* Show header on ALL pages */}
      <PoliceHeader />
      
      <main className={isHomePage ? 'home-content' : 'main-content'}>
        {children}
      </main>
      
      {/* Only show footer on home page */}
      {isHomePage && <PoliceFooter />}
    </>
  );
}