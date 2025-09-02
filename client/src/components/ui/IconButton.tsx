import { type FC, type PropsWithChildren } from "react";
import classNames from "classnames";

type IconButtonProps = PropsWithChildren<{
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}>;

export const IconButton: FC<IconButtonProps> = ({
  isActive,
  isDisabled,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        `
        cursor-pointer
        group
        relative
        flex items-center justify-center
        px-5 py-2.5
        rounded-2xl
        text-lg font-bold
        tracking-wide
        text-neutral-900
        transition-all duration-200 ease-in-out
        will-change-transform
        overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-900/20 before:to-white/0 before:opacity-0 before:transition-opacity before:duration-200 before:rounded-2xl
        after:absolute after:inset-0 after:ring-2 after:ring-green-700/20 after:rounded-2xl after:opacity-0 after:transition-opacity after:duration-200
        hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] hover:before:opacity-100
        focus:outline-none focus:ring-2 focus:ring-green-700/40
        group-focus:after:opacity-100
        active:scale-97 active:shadow-[0_2px_8px_0_rgba(0,0,0,0.15)]
        shadow-[0_4px_24px_0_rgba(0,0,0,0.15)]`,
        isActive
          ? `bg-gradient-to-b from-green-200/5 via-green-400/20 to-green-800/40 border-green-900`
          : `bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 border border-neutral-300`,
        isDisabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
      style={{
        letterSpacing: "0.08em",
        textShadow: "0 2px 8px rgba(0,0,0,0.07), 0 1px 0 #fff",
        boxShadow: isActive
          ? "0 4px 32px 0 rgba(16, 185, 129, 0.15), 0 1.5px 0 #fff inset"
          : "0 4px 24px 0 rgba(0,0,0,0.15), 0 1.5px 0 #fff inset",
      }}
      aria-pressed={isActive}
    >
      {/* Vignette effect */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0) 60%, rgba(255,255,255,0.7) 100%)",
        }}
      />
      {/* Active state overlay */}
      {isActive && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(16,185,129,0.40) 60%, rgba(16,185,129,0.48) 100%)",
            mixBlendMode: "lighten",
          }}
        />
      )}
      {/* Main content */}
      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.07)]">
        {children}
      </span>
    </button>
  );
};
