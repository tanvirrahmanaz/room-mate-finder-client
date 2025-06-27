import React from 'react';
import { Building, Target, Users, Heart, ShieldCheck } from 'lucide-react';
// CHANGE: Corrected the import path
import SectionHeader from './ui/SectionHeader';

const AboutUs = () => {
    return (
        <div className="bg-base-100 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <SectionHeader 
                    title="About Room Mate Finder"
                    subtitle="Connecting people, creating homes. Learn more about our journey, mission, and the values that drive us."
                />

                <div className="card lg:card-side bg-base-200 shadow-xl mb-12">
                    <div className="card-body">
                        <Target className="w-12 h-12 text-primary mb-4" />
                        <h2 className="card-title text-3xl font-bold">Our Mission</h2>
                        <p className="mt-2 text-base-content/80">
                            Our mission is to make finding a compatible roommate a seamless, secure, and positive experience. We believe that a good living situation is the foundation for a happy life, and we are dedicated to helping you find not just a room, but a place you can truly call home.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                    <div>
                        <h3 className="text-3xl font-bold text-base-content mb-4">Our Story</h3>
                        <div className="space-y-4 text-base-content/70">
                            <p>
                                Founded in 2024, Room Mate Finder was born from a simple idea: finding a roommate shouldn't be a gamble. Our founders, having experienced the challenges of shared living firsthand, wanted to create a platform built on trust, compatibility, and ease of use.
                            </p>
                            <p>
                                What started as a small project has grown into a thriving community connecting thousands of people across Bangladesh, helping them find their perfect living arrangements.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Building className="w-48 h-48 text-primary/20" />
                    </div>
                </div>
                
                <div>
                    <h3 className="text-3xl font-bold text-center text-base-content mb-8">Our Core Values</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card bg-base-100 shadow-lg text-center p-6">
                            <ShieldCheck className="w-10 h-10 text-success mx-auto mb-3" />
                            <h4 className="font-bold text-lg">Safety First</h4>
                            <p className="text-sm text-base-content/70 mt-1">We prioritize your security with profile verification and a secure platform.</p>
                        </div>
                        <div className="card bg-base-100 shadow-lg text-center p-6">
                            <Users className="w-10 h-10 text-info mx-auto mb-3" />
                            <h4 className="font-bold text-lg">Community</h4>
                            <p className="text-sm text-base-content/70 mt-1">We foster a supportive community built on respect and shared interests.</p>
                        </div>
                        <div className="card bg-base-100 shadow-lg text-center p-6">
                            <Heart className="w-10 h-10 text-secondary mx-auto mb-3" />
                            <h4 className="font-bold text-lg">Compatibility</h4>
                            <p className="text-sm text-base-content/70 mt-1">Our goal is to help you find roommates who match your lifestyle.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;