import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import cn from "../../lib/cn";

export default function Grid({ items, onItemClick }) {
  const [showMore, setShowMore] = useState(false);

  const showedItems = showMore ? items : items.slice(0, 9);

  return (
    <div>
      <div className="relative mx-auto grid max-w-xl grid-cols-3 gap-3 px-2 tn:px-5 xs:gap-4">
        {showedItems.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-between gap-2 rounded-lg border border-[#D3D3D4] bg-[#F5F6F6] px-2 py-2 hover:border-[#00E7AD] hover:bg-[#8AFFE1] sm:gap-4 sm:px-3 sm:py-2",
              )}
            >
              <div className="flex h-[75%] w-full items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-full w-full object-scale-down object-center"
                />
              </div>
              <p className="text-center text-sm text-gray-500 [text-wrap:nowrap] sm:text-xl">
                {item.title}
              </p>
            </div>
          );
        })}

        {/* Overlay */}
        {items.length > 9 && !showMore && (
          <div className="absolute inset-x-2 bottom-0 flex h-[40%] items-end justify-center bg-gradient-to-b from-white/0 via-white/70 to-white/90 tn:inset-x-5" />
        )}
      </div>

      {items.length > 9 && !showMore && (
        <div className="relative z-10 -mt-2 flex justify-center">
          <button
            className="flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-[#00B487] shadow-xl"
            onClick={() => setShowMore(true)}
          >
            আরো দেখুন
            <BiChevronDown className="text-xl" />
          </button>
        </div>
      )}

      {items.length > 9 && showMore && (
        <div className="mt-3 flex justify-center xs:mt-4">
          <button
            className="flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-[#00B487] shadow-xl"
            onClick={() => setShowMore(false)}
          >
            কম দেখুন
            <BiChevronUp className="text-xl" />
          </button>
        </div>
      )}
    </div>
  );
}
