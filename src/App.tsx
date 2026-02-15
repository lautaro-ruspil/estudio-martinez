import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/home/Hero";

// Lazy load components below the fold
const Services = lazy(() =>
    import("./components/home/Services").then((module) => ({
        default: module.Services,
    })),
);
const About = lazy(() =>
    import("./components/home/About").then((module) => ({
        default: module.About,
    })),
);
const Testimonials = lazy(() =>
    import("./components/home/Testimonials").then((module) => ({
        default: module.Testimonials,
    })),
);
const FAQ = lazy(() =>
    import("./components/home/FAQ").then((module) => ({ default: module.FAQ })),
);
const Contact = lazy(() =>
    import("./components/home/Contact").then((module) => ({
        default: module.Contact,
    })),
);
const Footer = lazy(() =>
    import("./components/layout/Footer").then((module) => ({
        default: module.Footer,
    })),
);
const WhatsAppFloat = lazy(() =>
    import("./components/ui/WhatsAppFloat").then((module) => ({
        default: module.WhatsAppFloat,
    })),
);

export function App() {
    // Mantener scroll restoration manual para evitar jumps al cargar lazy components
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        return () => {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "auto";
            }
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main id="main-content" className="flex-grow">
                <Hero />
                <Suspense
                    fallback={
                        <div className="h-96 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    }
                >
                    <Services />
                    <About />
                    <Testimonials />
                    <FAQ />
                    <Contact />
                </Suspense>
            </main>
            <Suspense fallback={<div className="h-24" />}>
                <Footer />
            </Suspense>
            <Suspense fallback={null}>
                <WhatsAppFloat />
            </Suspense>
        </div>
    );
}
