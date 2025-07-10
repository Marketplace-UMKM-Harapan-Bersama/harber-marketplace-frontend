import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-mono">Not Found</h2>
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Link href="/" className="text-primary">
        Return Home
      </Link>
    </div>
  );
}
