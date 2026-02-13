import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WhatsAppIcon } from "../../components/ui/WhatsAppIcon";

describe("WhatsAppIcon", () => {
    it("renders without crashing", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });

    it("renders with default size of 20", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("width", "20");
        expect(svg).toHaveAttribute("height", "20");
    });

    it("renders with custom size", () => {
        const { container } = render(<WhatsAppIcon size={32} />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("width", "32");
        expect(svg).toHaveAttribute("height", "32");
    });

    it("applies default empty className", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("class", "");
    });

    it("applies custom className", () => {
        const { container } = render(
            <WhatsAppIcon className="text-green-500" />,
        );
        const svg = container.querySelector("svg");

        expect(svg).toHaveClass("text-green-500");
    });

    it("combines custom className with other attributes", () => {
        const { container } = render(
            <WhatsAppIcon size={24} className="custom-class" />,
        );
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("width", "24");
        expect(svg).toHaveAttribute("height", "24");
        expect(svg).toHaveClass("custom-class");
    });

    it("has correct SVG attributes", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
        expect(svg).toHaveAttribute("fill", "currentColor");
        expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
    });

    it("has aria-hidden attribute for accessibility", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("contains a path element with WhatsApp icon data", () => {
        const { container } = render(<WhatsAppIcon />);
        const path = container.querySelector("path");

        expect(path).toBeInTheDocument();
        expect(path?.getAttribute("d")).toContain("M13.601");
    });

    it("renders with size 0 (edge case)", () => {
        const { container } = render(<WhatsAppIcon size={0} />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("width", "0");
        expect(svg).toHaveAttribute("height", "0");
    });

    it("renders with very large size", () => {
        const { container } = render(<WhatsAppIcon size={500} />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("width", "500");
        expect(svg).toHaveAttribute("height", "500");
    });

    it("className doesn't affect SVG structure", () => {
        const { container: container1 } = render(<WhatsAppIcon />);
        const { container: container2 } = render(
            <WhatsAppIcon className="some-class" />,
        );

        const path1 = container1.querySelector("path");
        const path2 = container2.querySelector("path");

        expect(path1?.getAttribute("d")).toBe(path2?.getAttribute("d"));
    });

    it("size prop only affects width and height", () => {
        const { container } = render(<WhatsAppIcon size={50} />);
        const svg = container.querySelector("svg");

        // ViewBox should remain the same
        expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
        // But width and height should change
        expect(svg).toHaveAttribute("width", "50");
        expect(svg).toHaveAttribute("height", "50");
    });

    it("is purely presentational (decorative)", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");

        // Should have aria-hidden and no role
        expect(svg).toHaveAttribute("aria-hidden", "true");
        expect(svg).not.toHaveAttribute("role");
    });

    it("uses currentColor fill for styling flexibility", () => {
        const { container } = render(<WhatsAppIcon />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("fill", "currentColor");
    });
});
