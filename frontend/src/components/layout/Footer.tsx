export function Footer() {
  return (
    <footer className="border-t border-border h-[2vh]">
      <div className="container mx-auto px-4 py-1 text-center text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} PiePie. All rights reserved.</p>
      </div>
    </footer>
  );
}
