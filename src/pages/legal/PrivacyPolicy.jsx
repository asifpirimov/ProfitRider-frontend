import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p className="lead">Last updated: February 4, 2026</p>

                <p>Welcome to ProfitRider. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our application.</p>

                <h2>1. Information We Collect</h2>
                <p>We collect data to provide and improve our service. This includes:</p>
                <ul>
                    <li><strong>Identity Data:</strong> Username, email address.</li>
                    <li><strong>Financial Data:</strong> Payments are processed by Lemon Squeezy (Merchant of Record). We do not store full credit card details. We verify subscription status via their API.</li>
                    <li><strong>Usage Data:</strong> Information about how you use our website, services, and session data (mileage, earnings) you input.</li>
                </ul>

                <h2>2. How We Use Your Data</h2>
                <p>We usage your data to:</p>
                <ul>
                    <li>Register you as a new customer.</li>
                    <li>Process your subscription and manage your account.</li>
                    <li>Calculate your profitability metrics (the core service).</li>
                    <li>Improve our website, services, marketing, and customer relationships.</li>
                </ul>

                <h2>3. Data Security</h2>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>

                <h2>4. Third-Party Services</h2>
                <p>We use third-party services including:</p>
                <ul>
                    <li><strong>Lemon Squeezy:</strong> For payments and billing management.</li>
                    <li><strong>Supabase/PostgreSQL:</strong> For database hosting.</li>
                    <li><strong>Google/Apple Auth:</strong> For authentication.</li>
                </ul>
                <p>These third parties have their own privacy policies.</p>

                <h2>5. Contact Us</h2>
                <p>If you have any questions about this privacy policy, please contact us at support@profitrider.com.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
