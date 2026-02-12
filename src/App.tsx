import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/home/Hero";
import { Services } from "./components/home/Services";
import { About } from "./components/home/About";
import { FAQ } from "./components/home/FAQ";

import { Footer } from "./components/layout/Footer";
import { Contact } from "./components/home/Contact";
import { WhatsAppFloat } from "./components/ui/WhatsAppFloat";
import { Testimonials } from "./components/home/Testimonials";

export function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main id="main-content" className="flex-grow">
                <Hero />
                <Services />
                <About />
                <Testimonials />
                <FAQ />
                <Contact />
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}
