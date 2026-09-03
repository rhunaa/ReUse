export const buttonClass =
  "inline-flex w-full items-center justify-center rounded-2xl bg-[#1F5D35] px-6 py-4 text-center text-base font-bold text-white transition-colors hover:bg-[#173F24] disabled:opacity-60";

export const inputClass =
  "w-full rounded-2xl bg-white px-4 py-4 text-[#1F2D22] shadow-sm outline-none ring-1 ring-transparent focus:ring-[#1F5D35]";

export function Button(props: React.ComponentProps<"button">) {
  const { className = "", ...rest } = props;
  return <button className={`${buttonClass} ${className}`} {...rest} />;
}
