// src/pages/PrivacyPolicy.jsx

import React from 'react';
import SectionHeader from '../components/ui/SectionHeader';

const PrivacyPolicy = () => {
    return (
        <div className="bg-base-100 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <SectionHeader
                    title="Privacy Policy"
                    subtitle="Your privacy is important to us. This policy explains what information we collect and how we use it."
                />

                <div className="prose max-w-none text-base-content/80">
                    <p><strong>Last Updated:</strong> June 27, 2025</p>

                    <h4>1. Introduction</h4>
                    <p>
                        Welcome to Room Mate Finder. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at support@roommatefinder.com.
                    </p>

                    <h4>2. Information We Collect</h4>
                    <p>
                        We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
                    </p>
                    <p>The personal information that we collect includes the following:</p>
                    <ul>
                        <li><strong>Personal Information You Disclose to Us:</strong> We collect names, phone numbers, email addresses, mailing addresses, usernames, passwords, contact preferences, and other similar information.</li>
                        <li><strong>Information automatically collected:</strong> We automatically collect certain information when you visit, use or navigate the website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information.</li>
                    </ul>

                    <h4>3. How We Use Your Information</h4>
                    <p>
                        We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                    </p>
                    <ul>
                        <li>To facilitate account creation and logon process.</li>
                        <li>To post testimonials on our platform with your consent.</li>
                        <li>To send administrative information to you.</li>
                        <li>To protect our Services from fraud monitoring and prevention.</li>
                        <li>To enforce our terms, conditions and policies for business purposes.</li>
                    </ul>

                    <h4>4. Will Your Information Be Shared With Anyone?</h4>
                    <p>
                        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your data to third parties.
                    </p>

                    <h4>5. How Do We Keep Your Information Safe?</h4>
                    <p>
                        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                    </p>

                    <h4>6. Changes to This Privacy Policy</h4>
                    <p>
                        We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible.
                    </p>

                    <h4>7. How Can You Contact Us About This Policy?</h4>
                    <p>
                        If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@roommatefinder.com">privacy@roommatefinder.com</a> or by post to:
                        <br />
                        Room Mate Finder Ltd.
                        <br />
                        123 Dhanmondi, Dhaka, Bangladesh
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;