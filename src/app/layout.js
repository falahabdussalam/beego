import './globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LocationModal from '../components/location/LocationModal';
import CartConflictModal from '../components/cart/CartConflictModal';
import { LocationProvider } from '../context/LocationContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'BeeGo Delivery — Hyperlocal Food, Grocery & Essentials in Virajpete, Kodagu',
  description: 'Fast, reliable delivery for food, fresh groceries, vegetables, pharmacy medicines, dairy, and household essentials across Virajpete, Kodagu, Karnataka. We deliver you.',
  keywords: ['BeeGo Delivery', 'Virajpete delivery', 'Kodagu food delivery', 'Virajpet grocery', 'Karnataka hyperlocal delivery'],
  openGraph: {
    title: 'BeeGo Delivery — We deliver you',
    description: 'Hyperlocal delivery platform for Virajpete, Kodagu, Karnataka, India.',
    url: 'https://beegodelivery.in',
    siteName: 'BeeGo Delivery',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2C0C12] font-sans antialiased selection:bg-[#58111E] selection:text-[#FDFBF7]">
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <LocationModal />
              <CartConflictModal />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
