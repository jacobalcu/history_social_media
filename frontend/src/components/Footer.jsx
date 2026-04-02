import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-24">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-serif text-gray-900 mb-4">Kairos</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              An open archive exploring the people, places, and events that
              shaped the world.
            </p>
            <p className="text-xs text-gray-400">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-900 mb-6 font-semibold">
              Explore
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/explore"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/historians"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Historians
                </Link>
              </li>
              <li>
                <Link
                  to="/topics"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Eras & Topics
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Section */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-900 mb-6 font-semibold">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  About the Archive
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Start Publishing
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-900 mb-6 font-semibold">
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
