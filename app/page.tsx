import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Header />
    </div>
  );
}

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-background">
      <Link href={"/"}>PHB Market</Link>
      <nav className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Link href={"/products"}>Products</Link>
          <Link href={"/about"}>About</Link>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button className="rounded-full" variant={"outline"} asChild>
            <Link href={"/sign-in"}>Masuk</Link>
          </Button>
          <Button className="rounded-full" asChild>
            <Link href={"/sign-up"}>Daftar</Link>
          </Button>
          <Button
            className="rounded-full relative"
            variant={"outline"}
            size={"icon"}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
};
