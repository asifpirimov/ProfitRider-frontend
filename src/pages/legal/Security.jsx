import React from 'react';
import { ShieldCheck, Lock, Database, Server } from 'lucide-react';

const Security = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1 className="text-center mb-10">Security at ProfitRider</h1>

                <div className="grid gap-6 md:grid-cols-2 not-prose mb-12">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-3 text-green-600 dark:text-green-400">
                            <Lock className="w-6 h-6" />
                            <h3 className="text-lg font-semibold m-0 text-slate-900 dark:text-white">Data Encryption</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            All data is encrypted in transit using TLS 1.2+ and at rest in our databases. Your personal information is never stored in plain text.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-3 text-blue-600 dark:text-blue-400">
                            <ShieldCheck className="w-6 h-6" />
                            <h3 className="text-lg font-semibold m-0 text-slate-900 dark:text-white">Secure Payments</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            We do not store credit card details. All payments are processed by Lemon Squeezy, a PCI-DSS compliant Merchant of Record.
                        </p>
                    </div>
                </div>

                <h2>Infrastructure</h2>
                <p>
                    Our infrastructure is hosted on secure, compliant cloud providers. We use Supabase (PostgreSQL) for database services, ensuring enterprise-grade security and reliability.
                </p>

                <h2>Authentication</h2>
                <p>
                    We use industry-standard OAuth procedures (Google/Apple) and secure JWT tokens for session management. We never see or store your email password.
                </p>

                <h2>Vulnerability Disclosure</h2>
                <p>
                    If you believe you have found a security vulnerability in ProfitRider, please report it to us immediately at <a href="mailto:security@profitrider.com">security@profitrider.com</a>.
                </p>
            </div>
        </div>
    );
};

export default Security;
