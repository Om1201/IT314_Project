import { About } from '../components/About';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-cyan-900">
      <Navbar />
      <About />
      <Footer />
    </div>
  );
}
