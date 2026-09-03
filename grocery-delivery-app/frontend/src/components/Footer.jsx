export default function Footer() {
  return (
    <footer className="bg-leaf-900 text-kraft-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-6 text-sm">
        <div>
          <p className="font-display text-xl text-white mb-2">Harvest & Home</p>
          <p className="text-kraft-300 max-w-xs">
            Fresh groceries from local stalls, delivered to your door same day.
          </p>
        </div>
        <div className="text-kraft-300">
          <p>Mon&ndash;Sat, 7am&ndash;9pm</p>
          <p>support@harvestandhome.example</p>
        </div>
      </div>
    </footer>
  );
}