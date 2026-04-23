import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SEARCH_PREFILL_KEY } from '@/hooks/useSearchFilters';

const LOGO_URL = 'https://planmylux.s3.eu-west-2.amazonaws.com/uploads/media-library/homepage/logo-nav.png';

const PHONE_ICON = (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.0505 10.5542L22.0354 10.5573V8.89424C22.0354 4.27154 18.1138 0.509766 13.2936 0.509766H10.7878C5.96758 0.509766 2.04749 4.27004 2.04749 8.89424V10.5648C2.0098 10.5648 1.97211 10.5527 1.93291 10.5527C0.866943 10.5527 0 11.4423 0 12.5384V16.5897C0 17.6873 0.866943 18.5708 1.93291 18.5708C2.02639 18.5708 2.12137 18.5542 2.21184 18.5422C3.08481 21.1521 6.25405 23.1649 10.1862 23.5388C10.6054 24.0921 10.7863 24.4902 12.0694 24.4902C13.7158 24.4902 14.9536 23.8418 14.9536 23.0412C14.9536 22.2421 13.7158 21.5923 12.0694 21.5923C10.7968 21.5923 10.6204 21.9843 10.1937 22.5301C6.64305 22.1758 3.80701 20.4042 3.12853 18.1366C3.80249 18.1366 4.35884 17.2199 4.35884 16.5882V16.4042H4.36789V8.80679C4.36789 4.96661 6.65661 3.35183 10.7878 3.35183H13.2936C17.4142 3.35183 19.5401 4.91384 19.5401 8.82337V16.4223H19.5613V16.5882C19.5613 17.6858 20.6951 18.4291 21.7716 18.4291C22.8481 18.4291 24 17.6858 24 16.5882V12.5369C23.9985 11.4438 23.127 10.5542 22.0505 10.5542Z" fill="#CB2187" />
  </svg>
);

const DROPDOWN_ARROW = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.0624 5.93937L7.43052 11.0369C7.50093 11.119 7.58827 11.1849 7.68655 11.2301C7.78483 11.2753 7.89173 11.2987 7.9999 11.2987C8.10807 11.2987 8.21497 11.2753 8.31325 11.2301C8.41153 11.1849 8.49887 11.119 8.56927 11.0369L12.9374 5.93937C13.3543 5.45281 13.0086 4.70125 12.368 4.70125H3.63053C2.9899 4.70125 2.64428 5.45281 3.0624 5.93937Z" fill="#595858" />
  </svg>
);

const DROPDOWN_MENUS = {
  deals: [
    { href: '/search', label: 'Trending Top Deals' },
    { href: '/search', label: 'Latest Deals', filters: { sort: 'newest' } },
    { href: '/search', label: 'Best Value Deals', filters: { sort: 'price_asc' } },
    { href: '/search', label: '5-Star Luxury →', bold: true, filters: { rating: ['5'] } },
  ],
  holiday: [
    { href: '/search', label: 'All Inclusive', filters: { holiday_types: ['all-inclusive'] } },
    { href: '/search', label: 'Beach Holidays', filters: { holiday_types: ['beach-holidays'] } },
    { href: '/search', label: 'City Breaks', filters: { holiday_types: ['city-breaks'] } },
    { href: '/search', label: 'All Holiday Styles →', bold: true },
  ],
  support: [
    { href: '#', label: 'Latest Travel Advice' },
    { href: '#', label: 'Contact Us' },
    { href: '#', label: 'FAQs' },
    { href: '#', label: 'Group Bookings' },
  ],
};

const DESTINATIONS = ['Greece', 'Turkey', 'Egypt', 'Spain', 'Cyprus', 'Morocco', 'Italy', 'Croatia', 'Maldives', 'Portugal', 'Malta', 'Tunisia', 'Crete', 'Corfu', 'Rhodes', 'Tenerife'];

const MOBILE_LINKS = [
  { href: '/search', label: 'All Deals' },
  { href: '/search', label: 'All Inclusive', filters: { holiday_types: ['all-inclusive'] } },
  { href: '/search', label: 'Beach Holidays', filters: { holiday_types: ['beach-holidays'] } },
  { href: '/search', label: 'Greece', filters: { destinations: ['greece'] } },
  { href: '/search', label: 'Turkey', filters: { destinations: ['turkey'] } },
  { href: '/search', label: 'Spain', filters: { destinations: ['spain'] } },
];

// ── Dropdown for a simple list ──
function SimpleDropdown({ items, onPrefillNavigate }) {
  return (
    <>
      {items.map(item => (
        <a
          key={item.href + item.label}
          href={item.href}
          onClick={(e) => {
            if (item.filters) {
              onPrefillNavigate(e, item.filters, item.href);
            }
          }}
          className={`block px-4 py-[6px] text-[14px] text-[#CB2187] hover:bg-[#FFF7FC] transition-colors ${item.bold ? 'font-semibold' : ''}`}
        >
          {item.label}
        </a>
      ))}
    </>
  );
}

// ── Destination grid dropdown ──
function DestinationsDropdown({ onPrefillNavigate }) {
  return (
    <div className="px-4 grid grid-cols-2 gap-x-6 gap-y-[2px] min-w-[400px]">
      {DESTINATIONS.map(d => (
        <a
          key={d}
          href="/search"
          onClick={(e) => onPrefillNavigate(e, { destinations: [d.toLowerCase()] }, '/search')}
          className="text-[14px] text-[#CB2187] hover:text-[#a91b6f] py-[4px] transition-colors"
        >
          {d}
        </a>
      ))}
      <a href="/search" className="text-[14px] text-[#CB2187] font-semibold py-[4px] col-span-2 mt-1">All Destinations &rarr;</a>
    </div>
  );
}

// ── Single nav dropdown trigger ──
function NavDropdownTrigger({ id, label, openDrop, setOpenDrop, clearHover, scheduleClose, onPrefillNavigate }) {
  return (
    <div
      className="relative"
      onMouseEnter={() => { if (window.innerWidth >= 1024) { clearHover(); setOpenDrop(id); } }}
      onMouseLeave={() => { if (window.innerWidth >= 1024) scheduleClose(); }}
    >
      <button
        onClick={() => setOpenDrop(openDrop === id ? null : id)}
        className="flex items-center gap-1 py-2 px-3 text-pml-text-700 hover:text-pml-brand transition-colors font-medium text-[15px] cursor-pointer bg-transparent border-none font-['Montserrat']"
      >
        {label}
        <span className={`transition-transform duration-300 inline-flex ${openDrop === id ? 'rotate-180' : ''}`}>{DROPDOWN_ARROW}</span>
      </button>
      {openDrop === id && (
        <div
          className="absolute top-full left-0 mt-0 bg-white rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#ececec] py-3 z-50 min-w-[260px]"
          onMouseEnter={clearHover}
          onMouseLeave={scheduleClose}
        >
          {id === 'destinations'
            ? <DestinationsDropdown onPrefillNavigate={onPrefillNavigate} />
            : DROPDOWN_MENUS[id] && <SimpleDropdown items={DROPDOWN_MENUS[id]} onPrefillNavigate={onPrefillNavigate} />
          }
        </div>
      )}
    </div>
  );
}

// ── Desktop Navigation ──
function DesktopNav({ openDrop, setOpenDrop, clearHover, scheduleClose, onPrefillNavigate }) {
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-1">
      <NavDropdownTrigger id="deals" label="Deals & Offers" openDrop={openDrop} setOpenDrop={setOpenDrop} clearHover={clearHover} scheduleClose={scheduleClose} onPrefillNavigate={onPrefillNavigate} />
      <NavDropdownTrigger id="holiday" label="Holiday Styles" openDrop={openDrop} setOpenDrop={setOpenDrop} clearHover={clearHover} scheduleClose={scheduleClose} onPrefillNavigate={onPrefillNavigate} />
      <NavDropdownTrigger id="destinations" label="Destinations" openDrop={openDrop} setOpenDrop={setOpenDrop} clearHover={clearHover} scheduleClose={scheduleClose} onPrefillNavigate={onPrefillNavigate} />
      <NavDropdownTrigger id="support" label="Support" openDrop={openDrop} setOpenDrop={setOpenDrop} clearHover={clearHover} scheduleClose={scheduleClose} onPrefillNavigate={onPrefillNavigate} />
    </div>
  );
}

// ── Mobile Navigation ──
function MobileNav({ onPrefillNavigate }) {
  return (
    <div className="lg:hidden space-y-1">
      {MOBILE_LINKS.map(link => (
        <a
          key={link.href + link.label}
          href={link.href}
          onClick={(e) => {
            if (link.filters) {
              onPrefillNavigate(e, link.filters, link.href);
            }
          }}
          className="block px-3 py-2 text-[14px] font-medium text-pml-text-700 hover:text-pml-brand hover:bg-pml-bg-brand-tint rounded-[8px]"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// ── Phone CTA ──
function PhoneCTA() {
  return (
    <div className="mt-4 lg:mt-0 border-t lg:border-t-0 pt-4 lg:pt-0 bg-pml-bg-brand-tint rounded-[8px] px-3 py-2">
      <a href="tel:02039406622" className="flex items-center justify-center lg:justify-start gap-2 hover:opacity-80 transition-opacity no-underline">
        {PHONE_ICON}
        <span className="font-semibold text-[18px] text-pml-brand">020 3940 6622</span>
      </a>
    </div>
  );
}

// ── Main Navbar ──
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hoverTimeout = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDrop(null);
  }, [location.pathname]);

  const clearHover = useCallback(() => {
    if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null; }
  }, []);

  const scheduleClose = useCallback(() => {
    clearHover();
    hoverTimeout.current = setTimeout(() => setOpenDrop(null), 180);
  }, [clearHover]);

  const onPrefillNavigate = useCallback((e, prefillFilters, href = '/search') => {
    e.preventDefault();
    sessionStorage.setItem(
      SEARCH_PREFILL_KEY,
      JSON.stringify({
        q: '',
        destinations: [],
        holiday_types: [],
        rating: [],
        price_min: null,
        price_max: null,
        sort: 'best',
        ...prefillFilters,
      })
    );
    navigate(href);
    setMobileOpen(false);
    setOpenDrop(null);
  }, [navigate]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white shadow-sm font-['Montserrat']" data-testid="navbar">
      <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[28px] lg:px-[32px] xl:px-[40px]">
        <div className="w-full max-w-[1280px] mx-auto">
          <div className="py-4 lg:py-5 xl:py-6">
            <nav className="flex justify-between items-center w-full gap-3 lg:gap-4 xl:gap-8">
              <a href="/" className="flex flex-row items-start flex-none" data-testid="logo-link">
                <img src={LOGO_URL} alt="PlanMyLuxe" className="w-[190px] sm:w-[220px] md:w-[250px] lg:w-[220px] xl:w-[320px] h-auto" />
              </a>

              <button
                data-testid="mobile-menu-toggle"
                onClick={() => setMobileOpen(prev => !prev)}
                className="lg:hidden p-2 border-0 bg-transparent cursor-pointer z-50"
              >
                {mobileOpen ? <X className="w-7 h-7 text-[#CB2187]" /> : <Menu className="w-7 h-7 text-[#CB2187]" />}
              </button>

              <div className={`absolute top-full left-0 right-0 p-4 bg-white max-h-[80vh] overflow-y-auto lg:static lg:mt-0 lg:p-0 lg:rounded-none lg:max-h-none lg:overflow-visible lg:flex lg:items-center lg:gap-2 ${mobileOpen ? 'block' : 'hidden lg:flex'}`}>
                <DesktopNav openDrop={openDrop} setOpenDrop={setOpenDrop} clearHover={clearHover} scheduleClose={scheduleClose} onPrefillNavigate={onPrefillNavigate} />
                <MobileNav onPrefillNavigate={onPrefillNavigate} />
                <PhoneCTA />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
