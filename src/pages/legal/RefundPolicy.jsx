import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
                <h1>Refund Policy</h1>
                <p className="lead">Last updated: February 4, 2026</p>

                <h2>1. Refund Policy Overview</h2>
                <p>During our public beta, all users receive 300 free credits to test ProfitRider at no cost.</p>
                <p>When paid plans launch, we will offer a fair refund policy. If you are not satisfied with the product after your first payment, please contact us within 14 days of your purchase, and we will do our best to resolve your issue. Full refunds are granted at our sole discretion for technical issues or clearly erroneous charges.</p>

                <h2>2. Cancellation</h2>
                <p>You can cancel your subscription at any time. Your subscription will remain active until the end of the current billing cycle. After cancellation, you will not be charged again, but we typically do not issue refunds for the remaining unused period.</p>

                <h2>3. Contacting Us about Disputes</h2>
                <p>If you have a billing dispute, please contact our support team at support@profitrider.com before initiating a chargeback with your bank. We are committed to resolving billing issues fairly and quickly.</p>
            </div>
        </div>
    );
};

export default RefundPolicy;
