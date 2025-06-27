import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';

const ContactUs = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // এখানে ফর্ম সাবমিট করার লজিক যুক্ত করতে পারেন, যেমন ইমেইল পাঠানো
        alert('Thank you for your message! We will get back to you soon.');
        e.target.reset();
    };

    return (
        <div className="bg-base-100 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <SectionHeader 
                    title="Contact Us"
                    subtitle="We'd love to hear from you! Whether you have a question, feedback, or need assistance, feel free to reach out."
                />

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card bg-base-200 shadow-xl p-6 md:p-8">
                        <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your Name</span></label>
                                <input type="text" placeholder="John Doe" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your Email</span></label>
                                <input type="email" placeholder="john.doe@example.com" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Subject</span></label>
                                <input type="text" placeholder="Question about a listing" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Your Message</span></label>
                                <textarea className="textarea textarea-bordered h-24" placeholder="Write your message here..." required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">Send Message</button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Contact Information</h3>
                        <p className="text-base-content/70">
                            You can also reach us through the following channels. We are available from Sunday to Thursday, 10 AM to 6 PM.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="btn btn-circle btn-outline btn-primary"><Mail size={20} /></div>
                                <div>
                                    <p className="font-semibold text-lg">Email</p>
                                    <a href="mailto:support@roommatefinder.com" className="link link-hover">support@roommatefinder.com</a>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="btn btn-circle btn-outline btn-primary"><Phone size={20} /></div>
                                <div>
                                    <p className="font-semibold text-lg">Phone</p>
                                    <a href="tel:+880123456789" className="link link-hover">+880 123 456 789</a>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="btn btn-circle btn-outline btn-primary"><MapPin size={20} /></div>
                                <div>
                                    <p className="font-semibold text-lg">Office Address</p>
                                    <p>123 Dhanmondi, Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;