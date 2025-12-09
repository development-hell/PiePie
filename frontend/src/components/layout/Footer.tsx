export function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} PiePie. All rights reserved.</p>
      </div>
    </footer>
  );
}
