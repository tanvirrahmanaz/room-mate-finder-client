import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Phone, Mail, MapPin, Clock } from 'lucide-react';
import logo from '../assets/room-mate-logo.png'; // আপনার লোগো ফাইলের সঠিক পাথ দিন

const Footer = () => {
    const servicesLinks = [
        { name: 'Find Roommates', path: '/browse' },
        { name: 'Add a Listing', path: '/add-listing' },
        { name: 'My Dashboard', path: '/my-listings' },
    ];

    const companyLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
    ];

    const socialLinks = [
        { Icon: Facebook, href: 'https://facebook.com/your-page-url', name: 'Facebook' },
        { Icon: Twitter, href: 'https://twitter.com/your-profile', name: 'Twitter' },
        { Icon: Linkedin, href: 'https://linkedin.com/your-profile', name: 'LinkedIn' },
    ];

    return (
        <footer className="relative bg-base-200 text-base-content overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
            
            {/* Decorative Background Blobs */}
            <div className="absolute inset-0 opacity-[.03] pointer-events-none">
                <div className="absolute top-0 left-0 w-48 h-48 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    
                    {/* Column 1: Brand Info */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <img src={logo} alt="Room Mate Finder Logo" className="w-12 h-12 rounded-full" />
                            <span className="font-bold text-xl">Room Mate Finder</span>
                        </Link>
                        <p className="text-base-content/70 text-sm leading-relaxed">
                            Find your perfect roommate. A safe, easy, and trusted platform for everyone looking for a place to call home.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((item) => (
                                <a key={item.name} href={item.href} target="_blank" rel="noreferrer" aria-label={item.name} className="btn btn-ghost btn-circle">
                                    <item.Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Services */}
                    <nav>
                        <h6 className="footer-title">Services</h6>
                        {servicesLinks.map((link) => (
                            // Removed <br> tag for valid React syntax
                            <Link key={link.name} to={link.path} className="link link-hover">{link.name}<br></br></Link>
                        ))}
                    </nav>

                    {/* Column 3: Company */}
                    <nav>
                        <h6 className="footer-title">Company</h6>
                        {companyLinks.map((link) => (
                             // Removed <br> tag for valid React syntax
                            <Link key={link.name} to={link.path} className="link link-hover">{link.name}<br></br></Link>
                        ))}
                    </nav>

                    {/* Column 4: Contact */}
                    <nav>
                        <h6 className="footer-title">Contact Us</h6>
                        <a href="mailto:support@roommatefinder.com" className="link link-hover flex items-center gap-2">
                            <Mail size={16} /> support@roommatefinder.com
                        </a>
                        <a href="tel:+880123456789" className="link link-hover flex items-center gap-2">
                            <Phone size={16} /> +880 123 456 789
                        </a>
                        <div className="flex items-start gap-2 mt-2">
                            <MapPin size={16} className="mt-1 flex-shrink-0" /> 
                            <div>
                                House 123, Road 45, <br />
                                Gulshan 2, Dhaka-1212
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Clock size={16} /> 
                            <span>Sun - Thu: 10 AM - 6 PM</span>
                        </div>
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-base-content/10 pt-8 text-center text-sm text-base-content/60">
                    <p>&copy; {new Date().getFullYear()} Room Mate Finder. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;