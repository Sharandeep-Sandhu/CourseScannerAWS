import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import MountainIcon from "./MountainIcon";

export function Footer() {
  return (
    <footer className="bg-muted py-6 w-full">
      <div className="container max-w-7xl flex items-center justify-between px-4 md:px-6 text-white">
        <Link href="#" className="flex items-center" prefetch={false}>
          <h1 className="text-2xl">Course Scanner</h1>
        </Link>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <p>&copy; 2024 XCode Tech LLC. All rights reserved.</p>
          <Separator orientation="vertical" />
          <Link href="#" className="hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
          <Separator orientation="vertical" />
          <Link href="#" className="hover:underline" prefetch={false}>
            Terms of Service
          </Link>
          <Separator orientation="vertical" />
          <Link href="/contact_us" className="hover:underline" prefetch={false}>
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
