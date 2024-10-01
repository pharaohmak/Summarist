"use client"
import type { NextPage } from "next";
import { useState } from 'react';
// import { getCheckoutUrl } from "@/firebase/stripe";
// import { app } from "@/firebase/init";
import Image from 'next/image';
import pricing from '@/app/assets/pricing-top.png';

const ChoosePlan: NextPage = () => {
    const [plan, setPlan] = useState<'Yearly' | 'Monthly'>('Yearly');

    // const checkout = async () => {
    //   try {
    //     const priceId = plan === 'Yearly' ? 'price_1O5JOQBJ6haLOo7PQmSKlrTp' : 'price_1O5JO8BJ6haLOo7PbM932ELv';
    //     const checkoutUrl = await getCheckoutUrl(app, priceId);
    //     window.location.href = checkoutUrl;
    //   } catch (error) {
    //     console.error('Error during checkout:', error);
    //   }
    // };

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
              {/* Repeated plan features removed for brevity */}
            </div>
            <div className="section__title">Choose the plan that fits you</div>

            {/* Yearly Plan Card */}
            <div
              className={`plan__card ${plan === "Yearly" ? "plan__card--active" : ""}`}
              onClick={() => setPlan("Yearly")}
              role="button"
              aria-pressed={plan === "Yearly"}
              tabIndex={0}
            >
              <div className="plan__card--circle">
                {/* Show dot only if "Yearly" is selected */}
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
            {/* Monthly Plan Card */}
            <div
              className={`plan__card ${plan === "Monthly" ? "plan__card--active" : ""}`}
              onClick={() => setPlan("Monthly")}
              role="button"
              aria-pressed={plan === "Monthly"}
              tabIndex={0}
            >
              <div className="plan__card--circle">
                {/* Show dot only if "Monthly" is selected */}
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
                <button className="btn btn--checkout" style={{ width: "300px" }}>
                  <span>Start your free 7-day trial</span>
                </button>
              </span>
              <div className="plan__disclaimer">
                Cancel your trial at any time before it ends, and you won&apos;t be charged.

              </div>
            </div>

            {/* FAQ Section */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
    