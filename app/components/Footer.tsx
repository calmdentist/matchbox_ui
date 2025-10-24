import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/matchbox.png"
            alt="Matchbox"
            width={20}
            height={20}
            className="rounded"
          />
          <span className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Matchbox. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

