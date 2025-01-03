import React from "react";
import Image from "next/image";
import ReactCardFlip from "react-card-flip";

type CreditCardProps = {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  brandLogo: string;
};

const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  brandLogo,
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const formatCardNumber = (number: string) =>
    number.replace(/(\d{4})/g, "$1 ").trim();

  return (
    <div className="flex justify-center items-center cursor-pointer">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {/* Front Side */}
        <div
          className="relative w-96 h-56 bg-gradient-to-br from-blue-900 to-black text-white rounded-lg shadow-lg p-4"
          onClick={() => setIsFlipped(true)}
        >
          {/* Brand Logo */}
          <div className="absolute top-4 left-4">
            <p className="text-3xl font-sans">Visa Gold</p>
          </div>

          {/* Chip */}
          <div className="absolute top-20 left-4">
            <Image src="/chip.png" alt="Card Chip" width={40} height={30} />
          </div>

            {/* Additional Image (Right of Chip) */}
            <div className="absolute top-16 left-14">
            <Image
              src="/nfc.png"
              alt="Additional Image"
              width={60}
              height={30}
            />
          </div>

          {/* Card Number */}
          <div className="absolute bottom-16 left-4">
            <p className="text-2xl font-sans tracking-widest">
              {formatCardNumber(cardNumber)}
            </p>
          </div>

          {/* Cardholder Name */}
          <div className="absolute bottom-4 left-4">
            <p className="text-xs text-gray-400">CARDHOLDER</p>
            <p className="text-sm font-semibold uppercase">{cardHolder}</p>
          </div>

          {/* Expiry Date */}
          <div className="absolute bottom-4 right-20">
            <p className="text-xs text-gray-400">VALID THRU</p>
            <p className="text-sm font-semibold">{expiryDate}</p>
          </div>

          {/* Visa Logo */}
          <div className="absolute bottom-2 right-1">
            <Image src="/visa.png" alt="Visa Logo" width={70} height={20} />
          </div>
        </div>

        {/* Back Side */}
        <div
          className="relative w-96 h-56 bg-gradient-to-br from-blue-900 to-black text-white rounded-2xl shadow-xl p-6"
          onClick={() => setIsFlipped(false)}
        >
          {/* Black Stripe */}
          <div className="absolute top-4 left-0 w-full h-10 bg-black"></div>

          {/* White Stripe for CVV */}
          <div className="absolute top-20 left-6 w-[90%] h-8 bg-white flex items-center px-4">
            <p className="ml-auto font-mono text-lg text-black">{cvv}</p>
          </div>

          {/* Cardholder Name on Back */}
          <div className="absolute bottom-12 left-6">
            <p className="text-xs text-gray-400">CARDHOLDER</p>
            <p className="text-sm font-semibold uppercase">{cardHolder}</p>
          </div>

          {/* Additional Details */}
          <div className="absolute bottom-4 left-6">
            <p className="text-xs text-gray-400">
              For support, call (123) 456-7890 or visit www.navipro.in
            </p>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default CreditCard;
