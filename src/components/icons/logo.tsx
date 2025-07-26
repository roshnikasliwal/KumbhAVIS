export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12c-2.28 0-4.38.7-6.23 1.89" />
      <path d="M12 12c2.28 0 4.38.7 6.23 1.89" />
      <path d="M12 12v3.35" />
      <path d="M12 12c4.13.43 7.55 2.56 10.14 5.9" />
      <path d="M2.5 21.4c2.59-3.34 5.99-5.47 10.14-5.9" />
      <path d="M12 3a9 9 0 0 1 9 9" />
      <path d="M3 12a9 9 0 0 1 9-9" />
    </svg>
  );
}
