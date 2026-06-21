import Image from "next/image";
import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    // <section className="cta-section">
    <section className="flex flex-wrap text-white rounded-4xl px-2 py-4 bg-lime-400 justify-center items-center">
      <Image src="images/cta.svg" alt="cta-image" width={162} height={100} />
      <div className="flex flex-col items-center text-center gap-3">
        <h2 className="text-2xl font-bold">
          Build and Personalize your learning companion
        </h2>
        <button className="btn-primary">
          <Image src="/icons/plus.svg" alt="plus-icon" width={12} height={12} />
          <Link href="/companions/new" className="cta-badge">
            Build your new companion
          </Link>
        </button>
      </div>
      <Image src="images/cta.svg" alt="cta-image" width={162} height={100} className="max-sm:hidden"/>
    </section>
  );
};

export default CTA;
