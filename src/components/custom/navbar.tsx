import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <div className="mx-auto border-b">
      <div className="flex max-w-6xl mx-auto px-4 py-2 justify-between items-center">
        <Link href="/">
          <p className="text-2xl text-primary font-bold">HealthHQ</p>
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
}
