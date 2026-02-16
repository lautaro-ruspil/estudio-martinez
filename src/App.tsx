import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/home/Hero";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

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
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
                <ErrorBoundary
                    fallback={
                        <div className="h-20 bg-white border-b border-slate-200" />
                    }
                >
                    <Navbar />
                </ErrorBoundary>

                <main id="main-content" className="flex-grow">
                    <ErrorBoundary
                        fallback={
                            <div className="h-96 bg-slate-50 flex items-center justify-center">
                                <p className="text-slate-600">
                                    Error al cargar la sección
                                </p>
                            </div>
                        }
                    >
                        <Hero />
                    </ErrorBoundary>

                    <Suspense
                        fallback={
                            <div className="h-96 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        }
                    >
                        {/* Cada sección lazy protegida */}
                        <ErrorBoundary>
                            <Services />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <About />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Testimonials />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <FAQ />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Contact />
                        </ErrorBoundary>
                    </Suspense>
                </main>

                <Suspense fallback={<div className="h-24" />}>
                    <ErrorBoundary>
                        <Footer />
                    </ErrorBoundary>
                </Suspense>

                <Suspense fallback={null}>
                    <ErrorBoundary>
                        <WhatsAppFloat />
                    </ErrorBoundary>
                </Suspense>
            </div>
        </ErrorBoundary>
    );
}
