import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';
import SearchBar from '@/components/search/SearchBar';
import DealCard from '@/components/search/DealCard';
import { SEARCH_PREFILL_KEY } from '@/hooks/useSearchFilters';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FEATURES = [
  { id: 'f1', title: 'Exclusive rates', desc: 'on luxury hotels and travel extras' },
  { id: 'f2', title: 'Free added extras', desc: 'included with many of our deals' },
  { id: 'f3', title: 'Up to 70% off', desc: 'flash sale deals on standard rates' },
  { id: 'f4', title: 'Flexible booking', desc: 'options for that perfect trip' },
  { id: 'f5', title: 'Available 24/7', desc: 'customer service team for you' },
];

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const fetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    axios.post(`${API}/search`, { sort: 'best', page_size: 8, page: 1 })
      .then(res => setTrending(res.data.hotels))
      .catch(() => {});
  }, []);

  const openMaldivesDeals = (e) => {
    e.preventDefault();
    sessionStorage.setItem(
      SEARCH_PREFILL_KEY,
      JSON.stringify({
        q: '',
        destinations: ['maldives'],
        holiday_types: [],
        rating: [],
        price_min: null,
        price_max: null,
        sort: 'best',
      })
    );
    navigate('/search');
  };

  return (
    <div data-testid="home-page" className="min-h-screen font-['Montserrat'] bg-pml-bg-base text-pml-text-700">
      {/* Hero Banner */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[480px]">
        <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80" alt="Luxury Resort" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px]">
            <div className="w-full max-w-[1280px] mx-auto">
              <div className="flex flex-col max-w-[623px] w-full min-w-0 mb-8">
                <h1 className="text-white text-[32px] sm:text-[42px] lg:text-h1 font-bold tracking-[-0.01em] leading-[40px] sm:leading-[50px] lg:leading-[76px]">
                  Discover the Best Luxury Vacation Deals
                </h1>
                <p className="text-white text-[16px] sm:text-[18px] lg:text-h5 font-semibold leading-[20px] sm:leading-[26px] lg:leading-[40px] mt-2">
                  for You
                </p>
              </div>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-pml-bg-alt">
        <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[28px]">
          <div className="w-full max-w-[1280px] mx-auto">
            <h2 className="text-pml-text-700 text-[18px] sm:text-[20px] md:text-h7 font-semibold mb-[16px] md:mb-[24px]">
              Sign up for exclusive savings...
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-[20px]">
              {FEATURES.map(f => (
                <div key={f.id} className="flex flex-col items-center text-center">
                  <p className="text-pml-text-500 text-[14px] leading-[1.5]">
                    Enjoy <strong className="font-semibold text-pml-text-700">{f.title}</strong> {f.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-[16px] md:gap-[32px]">
              <a href="#" className="text-pml-text-500 text-[14px] font-normal underline hover:text-pml-text-700 transition-colors">Learn more about us</a>
              <button className="bg-pml-bg-dark text-white text-[14px] font-medium px-[32px] py-[12px] rounded-[8px] hover:opacity-90 transition-colors cursor-pointer border-none">Signup &amp; Save</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Deals */}
      {trending.length > 0 && (
        <section className="w-full bg-pml-bg-brand-tint">
          <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[20px] md:py-[50px]">
            <div className="w-full max-w-[1280px] mx-auto">
              <h2 className="text-[24px] md:text-h2 font-semibold text-pml-text-700 leading-tight max-w-[626px]">
                Trending Deals This Week
              </h2>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                <p className="text-pml-text-700 mt-2 max-w-xl text-[14px] md:text-[16px] font-normal">
                  Handpicked luxury holidays at unbeatable prices
                </p>
                <a href="/search" className="text-[12px] text-right text-pml-text-700 underline hover:text-pml-brand whitespace-nowrap ml-0 md:ml-4 mt-2 md:mt-0">
                  view all PlanMyLuxe exclusives
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-[20px] md:mt-[40px]">
                {trending.slice(0, 8).map(h => <DealCard key={h.id} hotel={h} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="w-full bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px] py-[20px] md:py-[50px]">
          <div className="w-full max-w-[1280px] mx-auto">
            <div className="relative rounded-[8px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80" alt="Maldives" className="w-full h-[300px] sm:h-[350px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 flex items-center px-8 sm:px-12">
                <div className="max-w-md">
                  <h2 className="text-[24px] sm:text-[36px] md:text-[48px] font-semibold text-white leading-tight mb-3">
                    Discover the serene luxury of <span className="text-[#e8b5d3]">Maldives</span>
                  </h2>
                  <p className="text-white/80 text-[14px] mb-6">Experience unparalleled indulgence in a tropical paradise</p>
                  <a href="/search" onClick={openMaldivesDeals} className="inline-flex items-center gap-2 text-white font-semibold px-[24px] py-[10px] rounded-[8px] transition-all hover:opacity-90 no-underline text-[14px]" style={{ background: 'linear-gradient(110deg, #cb2187 0%, #cb2187 45%, #ecaed3 100%)' }}>
                    Explore Now <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
