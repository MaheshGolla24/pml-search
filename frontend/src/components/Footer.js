const LOGO_SVG = (
  <svg width="160" height="27" viewBox="0 0 160 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.87875 19.8696V1.53083H9.08528C14.0766 1.53083 16.2918 4.2508 16.2918 7.98025C16.2918 11.7097 14.0766 14.4577 9.08528 14.4577H6.42139V19.8696H1.87875ZM6.42139 10.2516H9.1694C11.1042 10.2516 11.6931 9.29818 11.6931 7.98025C11.6931 6.69037 11.1042 5.73697 9.1694 5.73697H6.42139V10.2516ZM18.7471 19.8696V1.53083H23.2898V15.6635H31.9545V19.8696H18.7471ZM34.1263 19.8696V9.21406C34.1263 4.22276 36.9584 1.16629 42.1741 1.16629C47.4177 1.16629 50.2779 4.22276 50.2779 9.21406V19.8696H45.7353V14.654H38.5568V19.8696H34.1263ZM38.5568 10.7283H45.7353V9.21406C45.7353 6.69037 44.6417 5.37244 42.146 5.37244C39.6784 5.37244 38.5568 6.69037 38.5568 9.21406V10.7283ZM53.1861 19.8696V8.87756C53.1861 4.13864 55.9902 1.16629 61.0375 1.16629C66.0849 1.16629 68.889 4.13864 68.889 8.87756V19.8696H64.3464V8.87756C64.3464 6.63428 63.2808 5.37244 61.0375 5.37244C58.7943 5.37244 57.7287 6.63428 57.7287 8.87756V19.8696H53.1861Z" fill="white" />
    <path d="M78.207 20.1476L73.0377 20.1476C70.8526 20.1476 69.8786 18.874 69.8786 17.2258C69.8786 16.2394 70.2657 15.4527 71.0024 14.9658C70.2657 14.4788 69.8786 13.6921 69.8786 12.7057C69.8786 11.0575 70.8526 9.78393 73.0377 9.78393L78.207 9.78393L78.207 11.8067L73.0377 11.8067C72.0887 11.8067 71.7516 12.2687 71.7516 12.8805C71.7516 13.4799 72.0887 13.9544 73.0377 13.9544L78.207 13.9544L78.207 15.9771L73.0377 15.9771C72.0887 15.9771 71.7516 16.4516 71.7516 17.051C71.7516 17.6628 72.0887 18.1248 73.0377 18.1248L78.207 18.1248L78.207 20.1476ZM78.207 6.61649L74.8232 6.61649L70.041 9.60073L70.041 7.21584L72.9128 5.6051L70.041 3.99436L70.041 1.65942L74.7608 4.59371L78.207 4.59371L78.207 6.61649Z" fill="white" />
    <path d="M81.9873 22.0951C84.8273 20.6656 87.6673 20.6656 90.5074 22.0951C93.3474 23.5247 96.1874 23.5247 99.0274 22.0951" stroke="white" strokeWidth="1.11679" strokeLinecap="round" />
    <path d="M81.9873 19.474C84.8273 18.0445 87.6673 18.0445 90.5074 19.474C93.3474 20.9036 96.1874 20.9036 99.0274 19.474" stroke="white" strokeWidth="1.11679" strokeLinecap="round" />
    <rect x="81.4199" y="0.291016" width="2.08037" height="19.2327" fill="white" />
    <path d="M108.415 17.1963H107.938C103.115 17.1963 100.788 14.925 100.788 10.7469V3.1758H102.891V10.4665C102.891 13.6912 104.769 15.5419 108.835 15.5419H109.312C113.041 15.5419 115.509 13.551 115.509 10.4665V3.1758H117.612V17H115.509V14.5044H114.78C113.714 16.0186 111.639 17.1963 108.415 17.1963Z" fill="white" />
  </svg>
);

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-pml-bg-dark text-white overflow-hidden font-['Montserrat']">
      <div className="w-full max-w-[1440px] mx-auto px-[16px] sm:px-[24px] md:px-[32px] lg:px-[40px]">
        <div className="w-full max-w-[1280px] mx-auto pt-8 pb-4">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-8 mb-6">
            <div className="flex-shrink-0">{LOGO_SVG}</div>
            <div className="flex items-center gap-2 text-[16px]">
              <span className="font-light tracking-[0.04em]">ALL HOLIDAYS ARE ATOL PROTECTED</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-32 mb-8">
            <div>
              <h3 className="text-body-medium font-medium tracking-wider mb-3 pb-2 border-b-2 border-[#df8abd] inline-block">CONTACT</h3>
              <p className="text-[16px] font-light tracking-[0.04em] leading-relaxed mb-3">PlanMyLuxe is a trading name<br/>of Plan My Tour Ltd.</p>
              <p className="text-[16px] font-light tracking-[0.04em] leading-relaxed mb-4">314 Midsummer Boulevard,<br/>Milton Keynes, Beds MK9 2UB</p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <a href="#" className="text-[16px] font-light tracking-[0.04em] underline text-white hover:text-pml-brand transition-colors">Send an enquiry</a>
                <a href="tel:02039406622" className="flex items-center gap-2 text-white no-underline">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M22.0505 10.5542L22.0354 10.5573V8.89424C22.0354 4.27154 18.1138 0.509766 13.2936 0.509766H10.7878C5.96758 0.509766 2.04749 4.27004 2.04749 8.89424V10.5648C2.0098 10.5648 1.97211 10.5527 1.93291 10.5527C0.866943 10.5527 0 11.4423 0 12.5384V16.5897C0 17.6873 0.866943 18.5708 1.93291 18.5708C2.02639 18.5708 2.12137 18.5542 2.21184 18.5422C3.08481 21.1521 6.25405 23.1649 10.1862 23.5388C10.6054 24.0921 10.7863 24.4902 12.0694 24.4902C13.7158 24.4902 14.9536 23.8418 14.9536 23.0412C14.9536 22.2421 13.7158 21.5923 12.0694 21.5923C10.7968 21.5923 10.6204 21.9843 10.1937 22.5301C6.64305 22.1758 3.80701 20.4042 3.12853 18.1366C3.80249 18.1366 4.35884 17.2199 4.35884 16.5882V16.4042H4.36789V8.80679C4.36789 4.96661 6.65661 3.35183 10.7878 3.35183H13.2936C17.4142 3.35183 19.5401 4.91384 19.5401 8.82337V16.4223H19.5613V16.5882C19.5613 17.6858 20.6951 18.4291 21.7716 18.4291C22.8481 18.4291 24 17.6858 24 16.5882V12.5369C23.9985 11.4438 23.127 10.5542 22.0505 10.5542Z" fill="white" />
                  </svg>
                  <span className="font-bold text-lg">020 3940 6622</span>
                </a>
              </div>
              <h4 className="text-body-medium font-medium tracking-wider mb-3 pb-2 border-b-2 border-[#df8abd] inline-block">SOCIAL MEDIA</h4>
              <div className="flex gap-5">
                <a href="https://facebook.com/planmyluxe.co.uk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 23.9859 5.85094 30.6053 13.5 31.8056V20.625H9.4375V16H13.5V12.475C13.5 8.465 15.8888 6.25 19.5434 6.25C21.2934 6.25 23.125 6.5625 23.125 6.5625V10.5H21.1075C19.12 10.5 18.5 11.7334 18.5 13V16H22.9375L22.2281 20.625H18.5V31.8056C26.1491 30.6053 32 23.9859 32 16Z" fill="white" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/planmyluxe/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2.88125C20.275 2.88125 20.7813 2.9 22.4625 2.975C24.025 3.04375 24.8688 3.30625 25.4313 3.525C26.175 3.8125 26.7125 4.1625 27.2688 4.71875C27.8313 5.28125 28.175 5.8125 28.4625 6.55625C28.6813 7.11875 28.9438 7.96875 29.0125 9.525C29.0875 11.2125 29.1063 11.7188 29.1063 15.9875C29.1063 20.2625 29.0875 20.7688 29.0125 22.45C28.9438 24.0125 28.6813 24.8563 28.4625 25.4188C28.175 26.1625 27.825 26.7 27.2688 27.2563C26.7063 27.8188 26.175 28.1625 25.4313 28.45C24.8688 28.6688 24.0188 28.9313 22.4625 29C20.775 29.075 20.2688 29.0938 16 29.0938C11.725 29.0938 11.2188 29.075 9.5375 29C7.975 28.9313 7.13125 28.6688 6.56875 28.45C5.825 28.1625 5.2875 27.8125 4.73125 27.2563C4.16875 26.6938 3.825 26.1625 3.5375 25.4188C3.31875 24.8563 3.05625 24.0063 2.9875 22.45C2.9125 20.7625 2.89375 20.2563 2.89375 15.9875C2.89375 11.7125 2.9125 11.2063 2.9875 9.525C3.05625 7.9625 3.31875 7.11875 3.5375 6.55625C3.825 5.8125 4.175 5.275 4.73125 4.71875C5.29375 4.15625 5.825 3.8125 6.56875 3.525C7.13125 3.30625 7.98125 3.04375 9.5375 2.975C11.2188 2.9 11.725 2.88125 16 2.88125ZM16 0C11.6563 0 11.1125 0.01875 9.40625 0.09375C7.70625 0.16875 6.5375 0.44375 5.525 0.8375C4.46875 1.25 3.575 1.79375 2.6875 2.6875C1.79375 3.575 1.25 4.46875 0.8375 5.51875C0.44375 6.5375 0.16875 7.7 0.09375 9.4C0.01875 11.1125 0 11.6562 0 16C0 20.3438 0.01875 20.8875 0.09375 22.5938C0.16875 24.2938 0.44375 25.4625 0.8375 26.475C1.25 27.5313 1.79375 28.425 2.6875 29.3125C3.575 30.2 4.46875 30.75 5.51875 31.1562C6.5375 31.55 7.7 31.825 9.4 31.9C11.1063 31.975 11.65 31.9937 15.9938 31.9937C20.3375 31.9937 20.8813 31.975 22.5875 31.9C24.2875 31.825 25.4563 31.55 26.4688 31.1562C27.5188 30.75 28.4125 30.2 29.3 29.3125C30.1875 28.425 30.7375 27.5313 31.1438 26.4813C31.5375 25.4625 31.8125 24.3 31.8875 22.6C31.9625 20.8938 31.9813 20.35 31.9813 16.0063C31.9813 11.6625 31.9625 11.1188 31.8875 9.4125C31.8125 7.7125 31.5375 6.54375 31.1438 5.53125C30.75 4.46875 30.2063 3.575 29.3125 2.6875C28.425 1.8 27.5313 1.25 26.4813 0.84375C25.4625 0.45 24.3 0.175 22.6 0.1C20.8875 0.01875 20.3438 0 16 0Z" fill="white" />
                    <path d="M16 7.78125C11.4625 7.78125 7.78125 11.4625 7.78125 16C7.78125 20.5375 11.4625 24.2188 16 24.2188C20.5375 24.2188 24.2188 20.5375 24.2188 16C24.2188 11.4625 20.5375 7.78125 16 7.78125ZM16 21.3312C13.0563 21.3312 10.6687 18.9438 10.6687 16C10.6687 13.0563 13.0563 10.6687 16 10.6687C18.9438 10.6687 21.3312 13.0563 21.3312 16C21.3312 18.9438 18.9438 21.3312 16 21.3312Z" fill="white" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-body-semibold font-semibold tracking-wider mb-3 pb-2 border-b-2 border-[#df8abd] inline-block">HELP & SUPPORT</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Latest Travel Advice</a></li>
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Contact Us</a></li>
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Frequently Asked Questions</a></li>
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Feedback & Reviews</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-body-medium font-medium tracking-wider mb-3 pb-2 border-b-2 border-[#df8abd] inline-block">USEFUL LINKS</h3>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">About Us</a></li>
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Why Choose Us</a></li>
                <li><a href="#" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Payment Options</a></li>
                <li><a href="/search" className="text-[16px] tracking-[0.04em] font-light leading-6 text-white hover:text-pml-brand transition-colors no-underline">Search Deals</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-2 md:pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
            <span className="text-[14px] font-light">&copy; {new Date().getFullYear()} Plan My Tour Limited. All Rights Reserved.</span>
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-pml-brand text-[14px] font-light transition-colors no-underline text-white">Cookie Policy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-pml-brand text-[14px] font-light transition-colors no-underline text-white">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-pml-brand text-[14px] font-light transition-colors no-underline text-white">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
