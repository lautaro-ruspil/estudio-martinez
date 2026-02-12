import { Menu, X } from "lucide-react";
import { useToggle } from "../../hooks/useToggle";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Button } from "../ui";
import { BUSINESS_INFO } from "../../config/site";
import LogoMartinez from "../../assets/logo-martinez.svg";

const NAV_ITEMS = [
    { id: "servicios", label: "Servicios" },
    { id: "nosotros", label: "Nosotros" },
    { id: "testimonials", label: "Testimonios" },
    { id: "preguntas", label: "Preguntas frecuentes" },
] as const;

export function Navbar() {
    const [isMenuOpen, toggleMenu, setMenuOpen] = useToggle(false);
    const scrollToSection = useScrollToSection();
    const menuRef = useFocusTrap(isMenuOpen);

    const handleNavClick = (sectionId: string) => {
        scrollToSection(sectionId);
        setMenuOpen(false);
    };

    return (
        <nav
            className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50"
            aria-label="Navegación principal"
        >
            <div className="container-custom">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <a
                        href="#main-content"
                        className="flex items-center transition-transform duration-300 hover:scale-[1.02]"
                    >
                        <img
                            src={LogoMartinez}
                            alt={BUSINESS_INFO.legalName}
                            className="h-12 w-auto object-contain"
                            loading="eager"
                        />
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="text-secondary-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                            >
                                {item.label}
                            </button>
                        ))}

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => scrollToSection("contacto")}
                        >
                            Contacto
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label="Abrir menú"
                    >
                        {isMenuOpen ? (
                            <X size={22} strokeWidth={2} />
                        ) : (
                            <Menu size={22} strokeWidth={2} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        id="mobile-menu"
                        ref={menuRef}
                        className="md:hidden py-6 border-t border-slate-200 animate-slide-down"
                    >
                        <div className="flex flex-col gap-5">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className="text-secondary-700 hover:text-primary-600 text-left font-medium transition-colors duration-200"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => scrollToSection("contacto")}
                            >
                                Contacto
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
