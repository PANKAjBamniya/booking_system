import React from 'react';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-borderColor bg-white pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo & Brand statement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-accent">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-wide text-textColor">
                Elena <span className="text-accent font-sans font-light">Beauty</span>
              </span>
            </div>
            <p className="text-sm text-textColor/70 leading-relaxed max-w-sm">
              Creating breathtaking bridal makeovers, sophisticated party looks, and premium hairstyling tailored specifically for your special moments.
            </p>
          </div>

          {/* Quick Info / Timings */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm text-textColor/75">
              <li className="flex justify-between"><span>Monday - Saturday:</span> <span className="font-medium">09:00 AM - 07:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span className="font-medium text-accent">Closed (Holiday)</span></li>
              <li className="pt-2 text-xs text-textColor/50">* Appointments must be booked at least 2 hours in advance.</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-textColor/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Luxury Beauty Lounge, Lane 4, Bandra West, Mumbai, 400050</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>appointments@elenabeauty.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-borderColor mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-textColor/50">
          <p>© {new Date().getFullYear()} Elena Beauty Lounge. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for ultimate elegance & beauty.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
