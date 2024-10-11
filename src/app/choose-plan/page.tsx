"use client";
import type { NextPage } from "next";
import { useState } from 'react';
import Image from 'next/image';
import pricing from '@/app/assets/pricing-top.png';

const ChoosePlan: NextPage = () => {
    const [plan, setPlan] = useState<'Yearly' | 'Monthly'>('Yearly');

    const handleRedirect = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="wrapper wrapper__full">
            <div className="plan">
                <div className="plan__header--wrapper">
                    <div className="plan__header">
                        <div className="plan__title">
                            Get unlimited access to many amazing books to read
                        </div>
                        <div className="plan__sub--title">
                            Turn ordinary moments into amazing learning opportunities
                        </div>
                        <figure className="plan__img--mask">
                            <Image src={pricing} alt="Pricing Top" className="pricing" width={100} height={100} />
                        </figure>
                    </div>
                </div>
                <div className="row">
                    <div className="container">
                        <div className="plan__features--wrapper">
                        </div>
                        <div className="section__title">Choose the plan that fits you</div>
                        <div
                            className={`plan__card ${plan === "Yearly" ? "plan__card--active" : ""}`}
                            onClick={() => setPlan("Yearly")}
                            role="button"
                            aria-pressed={plan === "Yearly"}
                            tabIndex={0}
                        >
                            <div className="plan__card--circle">
                                {plan === "Yearly" && <div className="plan__card--dot plan__card--dot--active"></div>}
                            </div>
                            <div className="plan__card--content">
                                <div className="plan__card--title">Premium Plus Yearly</div>
                                <div className="plan__card--price">$99.99/year</div>
                                <div className="plan__card--text">7-day free trial included</div>
                            </div>
                        </div>

                        <div className="plan__card--separator">
                            <div className="plan__separator">or</div>
                        </div>
                        <div
                            className={`plan__card ${plan === "Monthly" ? "plan__card--active" : ""}`}
                            onClick={() => setPlan("Monthly")}
                            role="button"
                            aria-pressed={plan === "Monthly"}
                            tabIndex={0}
                        >
                            <div className="plan__card--circle">
                                {plan === "Monthly" && <div className="plan__card--dot plan__card--dot--active"></div>}
                            </div>
                            <div className="plan__card--content">
                                <div className="plan__card--title">Premium Monthly</div>
                                <div className="plan__card--price">$9.99/month</div>
                                <div className="plan__card--text">No trial included</div>
                            </div>
                        </div>

                        <div className="plan__card--cta">
                            <span className="btn--wrapper">
                                <button
                                    className="btn btn--checkout"
                                    style={{ width: "300px" }}
                                    onClick={() => {
                                        const url = plan === "Monthly"
                                            ? 'https://buy.stripe.com/bIYdTm4LFcbf6be145'
                                            : 'https://buy.stripe.com/cN22aEce74INdDG4gg';
                                        handleRedirect(url);
                                    }}
                                >
                                    <span>Start your free 7-day trial</span>
                                </button>
                            </span>
                            <div className="plan__disclaimer">
                                Cancel your trial at any time before it ends, and you won&apos;t be charged.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoosePlan;