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
  expiryDate,
  cvv,
  brandLogo,
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const formatCardNumber = (number: string) =>
    number.replace(/(\d{4})/g, "$1 ").trim();

  return (
    <div className="flex justify-center items-center">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {/* Front Side */}
        <div
          className="relative w-80 h-48 bg-gradient-to-br from-gray-900 to-black text-white rounded-lg shadow-lg p-4"
          onClick={() => setIsFlipped(true)}
        >
          {/* Logo */}
          <div className="absolute top-2 left-4">
            <Image src='/logo.png' alt="Brand Logo" width={40} height={20} />
          </div>

          {/* Chip */}
          <div className="absolute top-12 left-4">
            <Image src="/chip.png" alt="Card Chip" width={40} height={30} />
          </div>

          {/* Card Number */}
          <div className="absolute bottom-12 left-4">
            <p className="text-lg font-mono tracking-widest">{formatCardNumber(cardNumber)}</p>
          </div>

          {/* Expiry Date */}
          <div className="absolute bottom-4 left-4">
            <p className="text-xs text-gray-400">VALID THRU</p>
            <p className="text-sm font-semibold">{expiryDate}</p>
          </div>
        </div>
{/* Back Side */}
<div
          className="relative w-96 h-56 bg-gradient-to-br from-gray-800 to-black text-white rounded-2xl shadow-xl p-6"
          onClick={() => setIsFlipped(false)}
        >
          {/* Black Stripe */}
          <div className="absolute top-4 left-0 w-full h-10 bg-black"></div>

          

          {/* CVV */}
          <div className="absolute top-32 left-6">
            <p className="text-sm text-gray-400">CVV</p>
            <p className="font-bold text-lg">{cvv}</p>
          </div>

          {/* Additional Details */}
          <div className="absolute bottom-4 left-6">
            <p className="text-xs text-gray-400">
              For support, call (123) 456-7890 or visit www.yourbank.com
            </p>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default CreditCard;
