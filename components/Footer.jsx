import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* About Section */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold mb-4">UPSC Room Hunt</h3>
            <p className="text-[var(--footer-muted-text)] mb-6 max-w-xs">
              Helping UPSC aspirants find the perfect accommodation near coaching centers in Thiruvananthapuram.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-[var(--footer-muted-text)] hover:text-[var(--footer-hover-text)]">
                <Facebook size={22} />
              </a>
              <a href="#" className="text-[var(--footer-muted-text)] hover:text-[var(--footer-hover-text)]">
                <Twitter size={22} />
              </a>
              <a href="#" className="text-[var(--footer-muted-text)] hover:text-[var(--footer-hover-text)]">
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" />
                <span className="text-[var(--footer-muted-text)]">
                  Thiruvananthapuram, Kerala, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0" />
                <span className="text-[var(--footer-muted-text)]">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0" />
                <span className="text-[var(--footer-muted-text)]">contact@upsc-roomhunt.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--footer-border)] pt-8 mt-8 text-center text-[var(--footer-muted-text)] text-sm">
          <p>&copy; {new Date().getFullYear()} UPSC Room Hunt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}